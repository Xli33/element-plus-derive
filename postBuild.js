import { rename, cp } from 'node:fs/promises'
// import { glob } from 'glob'
import fs from 'fs-extra'
import picolor from 'picocolors'
import { MarkdownTreeParser } from '@kayvan/markdown-tree-parser'
import { marked } from 'marked'
import { codeToHtml } from 'shiki'
import markedShiki from 'marked-shiki'
// import { transformVueToJs } from './md/vueTojs.js'

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
      // let compiledJs
      // if (mdToHtml.hasDemo && lang === 'vue') {
      //   compiledJs = code // await transformVueToJs(code)
      // }
      const highlightedCode = await codeToHtml(code, {
        lang,
        theme: 'material-theme-palenight'
      })

      return mdToHtml.hasDemo && lang === 'vue'
        ? `
          <div class="demo-block">
            <live-preview demo-code="${encodeURI(code)}"></live-preview>
            <div class="demo-code-wrapper">
              <details>
                <summary>查看源码</summary>
                ${highlightedCode}
              </details>
            </div>
          </div>
          `
        : highlightedCode
    }
  })
)

// md 转 html 片段
async function mdToHtml(mdString, hasDemo) {
  mdToHtml.hasDemo = hasDemo
  const parsedHtml = await markedParser.parse(mdString)
  mdToHtml.hasDemo = false
  return parsedHtml
}
// async function mdToHtml(mdString, needLiveDemo) {
//   // 1. 获取 Tokens
//   const tokens = marked.lexer(mdString)

//   // 2. 遍历 Tokens，手动处理异步的 shiki 高亮
//   for (const token of tokens) {
//     if (token.type === 'code') {
//       // 异步获取高亮 HTML
//       const highlighted = await codeToHtml(token.text, {
//         lang: token.lang || 'text',
//         theme: 'material-theme-palenight'
//       })

//       if (token.lang === 'vue' && needLiveDemo) {
//         // 编译 Vue 源码
//         const jsCode = await transformVueToJs(token.text)
//         const base64 = Buffer.from(jsCode).toString('base64')

//         // 直接修改 token 的 text，将其替换为包含编译后代码和高亮代码的 HTML 容器
//         // 注意：这里我们将 token 类型改为 'html'，防止被 marked 再次转义
//         token.type = 'html'
//         token.text = `
//           <div class="demo-wrapper">
//             <div class="demo-preview" data-v-code="${base64}"></div>
//             <details class="demo-code">
//               <summary>查看源码</summary>
//               ${highlighted}
//             </details>
//           </div>`
//       } else {
//         // 普通代码块也手动转成 HTML
//         token.type = 'html'
//         token.text = `<div class="shiki-code">${highlighted}</div>`
//       }
//     }
//   }

//   // 3. 最后直接用同步解析器，因为内容已经被我们提前异步转好了
//   return marked.parser(tokens)
// }

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
      files = fs
        .readdirSync(srcDir)
        .filter((e) => !e.match(/\.\w+$/))
        .sort() //(await glob('*/', { cwd: srcDir, posix: true })).sort()

    menus.push(first)
    const { sub: apiSub } = first

    for (const file of files) {
      // const apiUrl = file.replace(/\.md$/, suffix)
      const relativeTxtPath = first.route + '/' + file + suffix // first.route + '/' + apiUrl

      //  构造菜单
      apiSub.push({
        name: file,
        url: relativeTxtPath
      })
      // const each = apiUrl.split('/')
      // if (each[1]) {
      //   let apiSubMenu = apiSub.find((e) => e.name === each[0])
      //   if (!apiSubMenu) {
      //     apiSubMenu = {
      //       name: each[0],
      //       sub: []
      //     }
      //     apiSub.push(apiSubMenu)
      //   }
      //   apiSubMenu.sub.push({
      //     name: each[1].replace(/\.txt$/, ''),
      //     url: relativeTxtPath
      //   })
      // } else {
      //   apiSub.push({
      //     name: apiUrl.replace(/\.txt$/, ''),
      //     url: relativeTxtPath
      //   })
      // }

      // 实际写入的文件路径
      const distPath = distDir + relativeTxtPath,
        demoMds = [],
        headFoot = { from: ['main.md', 'api.md'], mds: [] }

      headFoot.from.forEach((e) => {
        headFoot.mds.push(fs.readFileSync(srcDir + file + '/' + e, 'utf-8'))
      })
      fs.readdirSync(srcDir + file).forEach((e) => {
        if (!e.endsWith('.md') || headFoot.from.includes(e)) return
        demoMds.push(fs.readFileSync(srcDir + file + '/' + e, 'utf-8'))
      })
      // const mdContent = await fs.readFile(srcDir + file, 'utf-8')
      // const htmlFragment = marked.parse(mdContent)

      const htmlFragment = await mdToHtml(
        [headFoot.mds[0], ...demoMds, headFoot.mds[1]].join('\n'),
        true
      )

      // 确保目标目录存在（例如 docs/readme/va/1.txt）
      await fs.ensureFile(distPath)

      // 写入文件
      await fs.writeFile(distPath, htmlFragment)
    }

    console.log(picolor.green('\n/md下的文件全部解析完成!'))
  } catch (err) {
    console.error(picolor.red(err))
  }
}

fs.rm(distDir, { recursive: true })
  .catch((err) => {
    console.error(picolor.redBright(err))
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
