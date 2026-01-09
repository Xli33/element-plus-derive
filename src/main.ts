import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import { i18n } from './i18n'

import App from './App.vue'

// import { $i18n } from './locale/i18n'
// $i18n.i18n = i18n
// $i18n.prefix = 'q'

const APP = createApp(App)
  // .use(i18n)
  .use(ElementPlus)

// 注册element-plus的icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  APP.component(key, component)
}
APP.mount('#app')
