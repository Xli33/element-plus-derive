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
      epMod: 'src/ep-mod.ts',
      epDeriveZhCn: 'src/locale/zh-CN.ts',
      epDeriveEnUs: 'public/locale/en-US.js'
    }).forEach(async (e) => {
      await build({
        configFile: false,
        plugins: [vue(), vueJsx()],
        ...sameOption,
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
          rolldownOptions: {
            external: ['vue', 'element-plus', '@element-plus/icons-vue', 'dayjs'],
            // treeshake: {
            //   moduleSideEffects: (id) => !id.includes('utils-where')
            // },
            output: {
              minify: {
                compress: {
                  dropConsole: true,
                  dropDebugger: true
                }
              },
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
        bundleTypes: true,
        // 当合并出问题时考虑取消 bundleTypes，并开启下面的 outDir、compilerOptions 配置
        // outDir: 'dist/types',
        // compilerOptions: {
        //   rootDir: './src'
        // },
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
          unlinkSync('dist/ep-mod.d.ts')
          // unlinkSync('dist/zh-CN.d.ts')
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
          'src/ep-mod.ts'
          // vite8起，lib模式下无需指定entry，也能从 src/index 这种单一入口中拆分chunk了
          // 'src/directives/index.ts',
          // 'src/locale/zh-CN.ts'
          // 'src/components/Combi.vue'
        ],
        name: 'epDerive',
        // fileName 是软件包输出文件的名称，默认为 package.json 中的 "name"。也可以定义为以 format 和 entryName 为参数的函数，并返回文件名
        // fileName: 'index',
        fileName: (format, entryName) => `${entryName}.js`,
        cssFileName: 'index',
        formats: ['es' /*'cjs', 'umd' */]
      },
      rolldownOptions: {
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
          codeSplitting: {
            groups: [
              // 按组件对应名输出各自的css
              {
                name: (id: string) => {
                  if (id.includes('.vue?vue&type=style&index=0&lang.scss' /* '/components/' */)) {
                    return id.match(/[a-zA-Z]+\.vue/)![0]
                  }
                },
                priority: 1
              },
              // 分离ep-mods/*
              {
                test: /src\/ep-mods\/[a-z-]+\.ts/,
                name: (id: string) => 'ep-mods/' + id.match(/[a-z-]+\.ts/)![0].slice(0, -3),
                priority: 1
              },
              // 分离语言文件
              {
                test: /src\/locale\/\w+-\w+\.ts$/,
                name: (id: string) => 'locale/' + id.match(/[a-zA-Z-]+.ts/)![0].slice(0, -3),
                priority: 1
              },
              // 分离vue指令文件
              {
                test: /src\/directives\/.+\.ts$/,
                name: (id: string) => 'directives/' + id.match(/[a-z-]+\.ts/)![0].slice(0, -3),
                priority: 1
              }
            ]
          },
          // {
          //
          //   // console.log(id)
          //   // 按组件对应名输出各自的css
          //   if (id.includes('.vue?vue&type=style&index=0&lang.scss' /* '/components/' */)) {
          //     return id.match(/[a-zA-Z]+\.vue/)![0]
          //   }
          //   // 分离ep-mods/*
          //   if (/src\/ep-mods\/[a-z-]+\.ts/.test(id)) {
          //     return id.match(/[a-z-]+\.ts/)![0].slice(0, -3)
          //   }
          //   // 分离语言文件
          //   // if (/src\/locale\/\w+-\w+\.ts$/.test(id)) {
          //   //   const file = id.match(/[a-zA-Z-]+.ts/)![0]
          //   //   return file.slice(0, -3)
          //   // }
          //   // 分离vue指令文件
          //   if (/src\/directives\/.+\.ts$/.test(id)) {
          //     return id.match(/[a-z-]+\.ts/)![0].slice(0, -3)
          //   }
          //   // if (id.includes('.vue?vue&type=style&index=0&lang.less')) return 'css'
          //   // if (id.includes('.vue?vue&type=script&setup=true&lang.ts')) return 'coms'
          //   // if (id.includes('.vue')) return 'vues'
          // },
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
          chunkFileNames: (/* chunkInfo */) => {
            // 分离到对应文件夹

            // console.log(chunkInfo)

            // const mid = chunkInfo.moduleIds[0]
            // let matched = /src\/ep-mods\/.+\.ts$/.test(mid)
            // if (matched) return 'ep-mods/[name].js'
            // matched = /src\/locale\/.+\.ts$/.test(mid)
            // if (matched) return 'locale/[name].js'
            // matched = /src\/directives\/.+\.ts$/.test(mid)
            // if (matched) return 'directives/[name].js'

            return '[name].js'
          }
          // entryFileNames: (chunkInfo) => {
          //   //   //'js/[name]-[hash].js'
          //   console.log(chunkInfo)
          //   return '[name].js'
          //   //   let dir = ''
          //   //   const { facadeModuleId } = chunkInfo
          //   //   if (facadeModuleId!.match(/src\/locale\/.+\.ts$/)) dir = 'locale/'
          //   //   else if (facadeModuleId!.match(/src\/directives\/.+\.ts$/)) dir = 'directives/'
          //   //   return dir + '[name].js'
          // }
        }
      }
    }
  }
})
