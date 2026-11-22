import { createI18n } from 'vue-i18n'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import zhCN from './locale/zh-CN'
import enUS from '../public/locale/en-US'

export const i18n = createI18n({
  allowComposition: true,
  // globalInjection: true,
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      el: zh,
      d: zhCN
    },
    'en-US': {
      el: en,
      d: enUS
    }
  }
})
