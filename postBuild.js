import { rename, cp } from 'node:fs/promises'
import { glob } from 'glob'
import fs from 'fs-extra'
import chalk from 'chalk'
import { MarkdownTreeParser } from '@kayvan/markdown-tree-parser'
import { marked } from 'marked'
import { codeToHtml } from 'shiki'
import markedShiki from 'marked-shiki'

// 切换工作目录到脚本所在目录
process.chdir(import.meta.dirname)

rename('dist/umd.d.ts', 'dist/umd/index.d.ts').catch((err) => {
  console.warn(`failed to move umd.d.ts and the error is:`, err)
})

// 配置路径
const srcDir = 'md/'
const distDir = 'docs/readme/'
// 最终需要生成的菜单结构
const menus = []
const suffix = '.txt'

const markedParser = marked.use(
  markedShiki({
    async highlight(code, lang) {
      return await codeToHtml(code, {
        lang,
        theme: 'material-theme-palenight'
        // themes: {
        //   light: 'material-theme-palenight',
        //   dark: 'material-theme-palenight'
        // }
      })
    }
  })
)

// md 转 html 片段
async function mdToHtml(mdString) {
  return await markedParser.parse(mdString)
}

// 处理readme生成介绍等
async function buildFromReadme() {
  const parser = new MarkdownTreeParser()
  const mdContent = await fs.readFile('README.md', 'utf-8')
  const tree = await parser.parse(mdContent)
  const arr = [
    {
      title: '开始使用',
      route: 'start',
      headings: ['安装']
    },
    {
      title: '国际化',
      route: 'internationalization',
      headings: ['国际化']
    },
    {
      title: '调优',
      route: 'tuning',
      headings: ['调优']
    }
  ]
  const result = await Promise.allSettled(
    arr.map(async (e) => {
      const sections = await Promise.allSettled(
        e.headings.map((h) => parser.stringify(parser.extractSection(tree, h)))
      )
      const mdString = await mdToHtml(sections.map((e) => e.value).join('\n'))
      return {
        title: e.title,
        route: e.route,
        mdString
      }
    })
  )

  result.forEach((e) => {
    // console.log(e)
    const filePath = distDir + e.value.title + suffix
    fs.ensureFileSync(filePath)
    fs.writeFileSync(filePath, e.value.mdString)
    menus.push({
      name: e.value.title,
      route: e.value.route,
      url: e.value.title + suffix
    })
  })
}

// 生成 组件 html片段
async function buildComponentHtml() {
  try {
    // posix: true 确保在 Windows 上也使用 / 分隔符，方便路径处理
    const first = {
        name: '组件',
        route: 'component',
        sub: []
      },
      files = (await glob('**/*.md', { cwd: srcDir, posix: true })).sort()
    menus.push(first)
    const { route: apiDir, sub: apiSub } = first

    for (const file of files) {
      const apiUrl = file.replace(/\.md$/, suffix)
      const relativeTxtPath = apiDir + '/' + apiUrl

      //  构造菜单
      const each = apiUrl.split('/')
      if (each[1]) {
        let apiSubMenu = apiSub.find((e) => e.name === each[0])
        if (!apiSubMenu) {
          apiSubMenu = {
            name: each[0],
            sub: []
          }
          apiSub.push(apiSubMenu)
        }
        apiSubMenu.sub.push({
          name: each[1].replace(/\.txt$/, ''),
          url: relativeTxtPath
        })
      } else {
        apiSub.push({
          name: apiUrl.replace(/\.txt$/, ''),
          url: relativeTxtPath
        })
      }

      // 实际写入的文件路径
      const distPath = distDir + relativeTxtPath

      // 读取并解析
      const mdContent = await fs.readFile(srcDir + file, 'utf-8')
      // const htmlFragment = marked.parse(mdContent)

      const htmlFragment = await mdToHtml(mdContent)

      // 确保目标目录存在（例如 docs/readme/va/1.txt）
      await fs.ensureFile(distPath)

      // 写入文件
      await fs.writeFile(distPath, htmlFragment)
    }
    console.log(chalk.green('\n/md下的文件全部解析完成!'))
  } catch (err) {
    console.error(chalk.red(err))
  }
}

fs.rm(distDir, { recursive: true })
  .catch((err) => {
    console.error(chalk.redBright(err))
  })
  .finally(async () => {
    await buildFromReadme()
    await buildComponentHtml()
    fs.writeFileSync('docs/menus.json', JSON.stringify(Object.values(menus)))
    // 复制assets文件夹到docs/readme下便于文档访问
    cp('assets/', 'docs/assets', {
      recursive: true
    }).catch((err) => {
      console.warn(`failed to copy assets files and the error is:`, err)
    })
  })
