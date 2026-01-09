import { fileURLToPath, URL } from 'node:url'
import { cpSync, unlinkSync } from 'node:fs'
// import { resolve } from 'node:path'

import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const sameOption = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       api: 'modern-compiler',
    //       additionalData: `@use '@/styles/common.scss' as *;`
    //     }
    //   }
    // }
  }
  if (command === 'build') {
    console.log('build umd')

    Object.entries({
      epDerive: 'src/index.ts',
      epDeriveZhCn: 'src/locale/zh-CN.ts',
      epDeriveEnUs: 'public/locale/en-US.js'
    }).forEach(async (e) => {
      await build({
        configFile: false,
        plugins: [vue(), vueJsx()],
        ...sameOption,
        esbuild: {
          drop: ['console', 'debugger'] // umd打包时删除所有的console 和 debugger
        },
        build: {
          target: 'es2023',
          cssTarget: ['chrome112', 'edge112', 'firefox115', 'safari16.4'],
          outDir: 'dist/umd',
          copyPublicDir: false,
          emptyOutDir: false,
          lib: {
            entry: e[1],
            name: e[0],
            fileName: (format, entryName) => `${entryName}.js`,
            cssFileName: 'index',
            formats: ['umd']
          },
          rollupOptions: {
            external: ['vue', 'element-plus', '@element-plus/icons-vue', 'dayjs'],
            output: {
              globals: {
                vue: 'Vue',
                'element-plus': 'ElementPlus',
                '@element-plus/icons-vue': 'ElementPlusIconsVue'
              }
            }
          }
        }
      })
    })
  }

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      dts({
        tsconfigPath: './tsconfig.app.json',
        rollupTypes: true,

        // cleanVueFileName: true,
        // insertTypesEntry: false,
        include: [
          'src/index.ts',
          'src/type.ts',
          'src/components/*.{vue,ts}',
          'src/directives/*.ts'
        ],
        // 写入.d.ts前去除部分组件中内联的其它组件类型声明
        beforeWriteFile(filePath, content) {
          if (filePath.includes('CacheSelect.vue')) {
            // console.log('found:', content.match(/sel:.+?\}\)\s*\|\s*null;/s)?.[0])
            return {
              filePath,
              content: content.replace(/sel:.+?\}\)\s*\|\s*null;/s, 'sel: any')
            }
          }
          if (filePath.includes('PageTable.vue')) {
            // console.log('found:', content.match(/tableRef:.+\| null;/s)?.[0])
            return {
              filePath,
              content: content.replace(
                /tableRef:.+\| null;\s*}, HTMLDivElement>/s,
                'tableRef: any;\npageRef: any;\n}, HTMLDivElement>'
              )
            }
          }
        },
        afterBuild() {
          // console.log(fileMap)
          unlinkSync('dist/zh-CN.d.ts')
          cpSync('src/styles', 'dist/scss', { recursive: true })
        }
      })
    ],
    ...sameOption,
    build: {
      emptyOutDir: false,
      cssCodeSplit: true,
      lib: {
        entry: [
          'src/index.ts',
          'src/directives/index.ts',
          'src/locale/zh-CN.ts'
          // 'src/components/Combi.vue'
        ],
        name: 'elementPlusDerive',
        // fileName 是软件包输出文件的名称，默认为 package.json 中的 "name"。也可以定义为以 format 和 entryName 为参数的函数，并返回文件名
        // fileName: 'index',
        fileName: (format, entryName) => `${entryName}.js`,
        cssFileName: 'index',
        formats: ['es' /*'cjs', 'umd' */]
      },
      rollupOptions: {
        // 确保外部化处理那些
        // 你不想打包进库的依赖
        external: ['vue', 'element-plus', '@element-plus/icons-vue', 'dayjs', 'utils-where'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖
          // 提供一个全局变量
          // globals: {
          //   vue: 'Vue',
          //   'element-plus': 'ElementPlus',
          //   '@element-plus/icons-vue': 'ElementPlusIconsVue'
          // },
          manualChunks(id) {
            // console.log(id)
            // 按组件对应名输出各自的css
            if (id.includes('.vue?vue&type=style&index=0&lang.scss' /* '/components/' */)) {
              return id.match(/[a-zA-Z]+\.vue/)![0]
            }
            // 分离iview-mods/*
            // if (/src\/iview-mods\/[a-z-]+\.ts/.test(id)) {
            //   return id.match(/[a-z-]+\.ts/)![0].slice(0, -3)
            // }
            // 分离语言文件
            // if (/src\/locale\/\w+-\w+\.ts$/.test(id)) {
            //   const file = id.match(/[a-zA-Z-]+.ts/)![0]
            //   return file.slice(0, -3)
            // }
            // 分离vue指令文件
            if (/src\/directives\/.+\.ts$/.test(id)) {
              return id.match(/[a-z-]+\.ts/)![0].slice(0, -3)
            }
            // if (id.includes('.vue?vue&type=style&index=0&lang.less')) return 'css'
            // if (id.includes('.vue?vue&type=script&setup=true&lang.ts')) return 'coms'
            // if (id.includes('.vue')) return 'vues'
          },
          assetFileNames: (assetInfo) => {
            // console.log(JSON.stringify(assetInfo, null, 1))
            // let folder = 'assets'
            // const ext = (assetInfo.name || '').split('.').slice(-1)[0]
            // if (ext === 'css') {
            //   folder = 'css'
            // } else if (/^(?:png|jpe?g|gif|svg|webp)$/i.test(ext)) {
            //   folder = 'img'
            // } else if (/^(?:woff2?|ttf|otf)$/i.test(ext)) {
            //   folder = 'fonts'
            // }
            // return `${folder}/[name]-[hash][extname]`
            return `${assetInfo.names[0] !== 'ep-mod.css' ? 'styles/' : ''}[name][extname]`
          },
          chunkFileNames: (chunkInfo) => {
            // 分离到对应文件夹

            const mid = chunkInfo.moduleIds[0]
            // let matched = /src\/iview-mods\/.+\.ts$/.test(mid)
            // if (matched) return 'iview-mods/[name].js'
            let matched = /src\/locale\/.+\.ts$/.test(mid)
            if (matched) return 'locale/[name].js'
            matched = /src\/directives\/.+\.ts$/.test(mid)
            if (matched) return 'directives/[name].js'

            return '[name].js'
            //   if (
            //     chunkInfo.isDynamicEntry &&
            //     chunkInfo.facadeModuleId?.includes('/src/assets/locale')
            //   ) {
            //     const locale = <RegExpMatchArray>(
            //       chunkInfo.facadeModuleId.match(/([a-zA-Z-]+)\/index.ts/)
            //     )
            //     return `assets/locale/${locale[1]}-[hash].js`
            //   }
            // return 'js/[name]-[hash].js'
          },
          entryFileNames: (chunkInfo) => {
            //'js/[name]-[hash].js'
            // console.log(chunkInfo)
            let dir = ''
            const { facadeModuleId } = chunkInfo
            if (facadeModuleId!.match(/src\/locale\/.+\.ts$/)) dir = 'locale/'
            else if (facadeModuleId!.match(/src\/directives\/.+\.ts$/)) dir = 'directives/'
            return dir + '[name].js'
          }
        }
      }
    }
  }
})
