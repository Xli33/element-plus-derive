import type { App } from 'vue'
import type { Obj } from './type'

import * as allComponents from './components'
import { $i18n } from './locale/i18n'
import { vElSelect } from './directives' // 用 import * as dirs from './directives'会导致生成额外的chunk，内容是通过Object.freeze处理过的只读对象
import { useClass } from './utils'

const directives = Object.entries({
    elSelect: vElSelect
  }),
  components = Object.values(allComponents)

export function install(
  app: App,
  opt: {
    prefix?: string
    i18n?: any
    msg?: Obj
    msgPrefix?: string
  } = {}
) {
  // 支持定义组件前缀
  if (opt.prefix != null) {
    useClass.prefix = opt.prefix
  }
  /* 
    当通过多个createApp实例化并调用同一个epDerive的install时，此处直接叠加prefix会导致前缀不断重复拼接
    故应在下面的注册阶段修改注册名，保持组件自身name始终无前缀以避免该bug
  */
  // components.forEach((e) => {
  //   e.name = useClass.prefix + e.name
  // })
  components.forEach((component) => {
    app.component(useClass.prefix + component.name!, component)
  })
  directives.forEach(([key, value]) => {
    app.directive(key, value)
  })
  if (opt.i18n) {
    $i18n.i18n = opt.i18n
    // 语言内容默认挂在键d上。若不使用“d”则将其替换为opt.msgPrefix
    if (opt.msgPrefix && opt.msgPrefix !== 'd') {
      $i18n.prefix = opt.msgPrefix
      // if ($i18n.msg.d) {
      //   $i18n.msg[$i18n.prefix] = $i18n.msg.d
      //   delete $i18n.msg.d
      // }
    }
    return
  }
  if (opt.msg) {
    $i18n.msg = opt.msg
  }
}

export default {
  install
}

export * from './components'

export {
  // vue指令
  vElSelect
}
