import type { Obj } from '@/type'
import { getPathValue } from 'utils-where'
import zhCN from './zh-CN'

type Translator = {
  i18n: any
  prefix: string
  msg: Obj
  t(key: string, ...args: any[]): string
}

// 若库在安装时传入了 vue-i18n 实例，则直接使用 vue-i18n 进行翻译
// 获取不到翻译文本时显示key
export const $i18n: Translator = {
  i18n: null,
  prefix: 'd',
  msg: zhCN,
  t(key: string, ...args: any[]) {
    return (
      $i18n.i18n?.global.t($i18n.prefix + '.' + key, ...args) ??
      getPathValue($i18n.msg, $i18n.prefix + '.' + key) ??
      key
    )
  }
}
