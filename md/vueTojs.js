import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import babel from '@babel/core'
import vueJsx from '@vue/babel-plugin-jsx'

/**
 * 合并多行 vue import 为一行
 * @param {string} code 拼接后的总代码
 * @returns {string} 优化后的代码
 */
function combineVueImports(code) {
  const importRegex = /import\s+{(.*?)}\s+from\s+['"]vue['"];?/g
  const members = new Set()
  // 查找并提取所有成员
  let match
  while ((match = importRegex.exec(code)) !== null) {
    // 处理 { a, b as c } 这种情况，按逗号分割并清理空格
    match[1].split(',').forEach((m) => {
      const trimmed = m.trim()
      if (trimmed) members.add(trimmed)
    })
  }
  // 如果没有匹配到 vue 的导入，直接返回原代码
  if (members.size === 0) return code
  // 移除原有的所有 vue import 行
  const codeWithoutImports = code.replace(importRegex, '')
  // 在顶部生成唯一的 import 行
  const combinedImport = `import { ${Array.from(members).join(', ')} } from "vue";`
  return combinedImport + '\n' + codeWithoutImports.trim()
}

export async function transformVueToJs(source, filename = '') {
  // 解析 SFC
  const { descriptor } = parse(source, { filename })

  // 处理 Script (特别是 setup)
  // 注意：需要唯一 ID (scopeId) 来支持作用域样式
  const id = Date.now().toString()
  const scriptCompiled = compileScript(descriptor, {
    id,
    babelParserPlugins: ['jsx'] // 如果是 TSX，则使用: ['jsx', 'typescript']
  })

  // 使用 Babel 将 JSX 转换为 Vue 运行时的 h() 函数
  const result = babel.transformSync(scriptCompiled.content, {
    plugins: [
      [vueJsx, { optimize: true }] // 关键：使用 Vue 专用的 JSX 插件
    ],
    filename // 必须提供，以便 Babel 处理
  })

  // 处理 Template (转为 render 函数)
  const templateCompiled = compileTemplate({
    source: descriptor.template.content,
    filename,
    id,
    compilerOptions: {
      // 关键：告诉模板编译器哪些变量是从 setup 返回的
      bindingMetadata: scriptCompiled.bindings
    },
    scoped: descriptor.styles.some((s) => s.scoped)
  })

  // 组装最终的 JS 代码
  // 我们需要把 template 的 render 函数注入到 script 导出的对象中
  let code = result.code
  // 将 "export default" 替换为常量，方便组合
  code = code.replace(/export\s+default/, 'const _sfc_main =')

  const finalCode = `${code}
    ${templateCompiled.code}
    _sfc_main.render = render
    _sfc_main.__file = "${filename}"
    _sfc_main.__scopeId = "data-v-${id}"
    export default _sfc_main`
  return combineVueImports(finalCode)
}
