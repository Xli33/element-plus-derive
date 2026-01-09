# element-plus-derive

基于vue 3.5+与element-plus的组件&优化扩展，可自定义组件前缀  
**示例均使用无前缀的默认组件名**

## 安装

```bash
npm i element-plus-derive

or

yarn add element-plus-derive
```

[TOC]

### CDN引入

```html
<link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css" />
<link rel="stylesheet" href="https://unpkg.com/element-plus-derive/dist/umd/index.css" />
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/element-plus"></script>
<script src="https://unpkg.com/@element-plus/icons-vue"></script>
<script src="https://unpkg.com/element-plus-derive/dist/umd/index.js"></script>

<!-- <script src="https://unpkg.com/-derive/dist/umd/en-US.js"></script> -->

<script>
  const app = Vue.createApp(App)
  app.use(ElementPlus)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(epDerive /*,{msg: epDeriveEnUS} */)
  app.mount('#app')
</script>
```

### 全局引入

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import epDerive from 'element-plus-derive' // 包含所有组件与指令
import 'element-plus-derive/style' // 引入所有组件样式

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(epDerive)
app.mount('#app')
```

#### 自定义组件前缀

为免容易变得冗长，组件名及其样式class默认无前缀，若需要自定义，可传入prefix参数

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import epDerive from 'element-plus-derive' // 包含所有组件与指令

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 所有组件名前缀将被设置为 My，使用时如 <MyCombi>，<MyBaseSwitch> ...
app.use(epDerive, { prefix: 'My' })
app.mount('#app')
```

**此时需要再修改组件共用的scss变量以适配前缀**，无需前缀时建议直接引入`element-plus-derive/style`中的css

`App.vue`

```scss
<style lang="scss">
// 导入后并覆盖变量$epd-prefix为需要的前缀名称
@forward 'styles/common.scss' with (
  $epd-prefix: 'my'
);

// 导入所有组件样式
@use 'element-plus-derive/scss/index.scss';

// 或者单独导入需要的组件样式
@use 'element-plus-derive/scss/Combi.scss';
</style>
```

### 按需引入

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Combi } from 'element-plus-derive'
import 'element-plus-derive/styles/Combi.css' // 引入需要的组件样式

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component(Combi.name, Combi)
app.mount('#app')
```

仅部分组件需要对应样式，如图
![css](./assets/import%20component%20css.png)

### 国际化

目前提供中英翻译，默认显示简体中文。在安装插件时可传入需要显示的语言，若使用vue-i18n，则只需传入vue-i18n实例

- 使用插件提供的英文翻译

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import epDerive from 'element-plus-derive'
import enUS from 'element-plus-derive/locale/en-US'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(epDerive, {
  msg: enUS
})
app.mount('#app')
```

- 使用插件未提供的翻译

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import epDerive from 'element-plus-derive'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app
  .use(epDerive, {
    msg: {
      d: {
        lang: 'zh-Hant',
        allCheckbox: {
          title: '全選'
        },
        curdTable: {
          actionText: '操作',
          addText: '新增',
          del: '刪除'
        },
        mCalendar: {
          mini: ['日', '一', '二', '三', '四', '五', '六'],
          short: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
          long: ['禮拜日', '禮拜一', '禮拜二', '禮拜三', '禮拜四', '禮拜五', '禮拜六']
        },
        modalFooter: {
          ok: '確定',
          cancel: '取消'
        },
        pageTable: {
          title: '列表',
          reload: '重載',
          maxmize: '最大化',
          restore: '還原'
        },
        toggleColumn: {
          title: '列',
          checkAll: '全選'
        }
      }
    }
  })
  .mount('#app')
```

- 使用vue-i18n

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import epDerive from 'element-plus-derive'
import zhCN from 'element-plus-derive/locale/zh-CN'
import enUS from 'element-plus-derive/locale/en-US'

import App from './App.vue'

// 需要时可手动修改语言主要key，并在安装插件时传入参数msgPrefix，如 {msgPrefix: 'someKey'}
// zhCN.someKey = zhCN.d
// delete zhCN.d
// enUS.someKey = enUS.d
// delete enUS.d

const i18n = createI18n({
  allowComposition: true,
  // globalInjection: true,
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      ...zh,
      ...zhCN
    },
    'en-US': {
      ...en,
      ...enUS
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(epDerive, {
  i18n
  // msgPrefix: 'someKey' // 该值仅针对使用vue-i18n的情况生效
})
app.mount('#app')
```

### 调优

- 为多选模式的ElSelect添加全选功能。**若全局安装了插件则无需再次注册指令**

```js
// 全局注册
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {elSelect} from 'element-plus-derive'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.directive('elSelect', elSelect)
app.mount('#app')

// 局部注册
<script setup>
import { elSelect as vElSelect } from "element-plus-derive";
</script>

// 使用
<Select v-el-select:all="true" multiple></Select>
```

### 组件

[AllCheckbox](./md/AllCheckbox.md)  
提供全选功能的CheckboxGroup

[CacheSelect](./md/CacheSelect.md)  
避免重复调用远程接口的RemoteSelect，同一个cacheId对应只触发一次请求

[Combi](./md/Combi.md)  
类似iview Input[append prepend]的组合框

[CurdTable](./md/CurdTable.md)
具有增删功能的Table

[Drawer](./md/Drawer.md)  
默认带footer的el-drawer

[ElColumn](./md/ElColumn.md)  
通过数组形式使用el-table-column

[MCalendar](./md/MCalendar.md)  
月度日历组件

[ModalFooter](./md/ModalFooter.md)  
代替ElDialog自带的底栏部分，按钮易于控制，自定义度更高

[PageTable](./md/PageTable.md)  
远程分页/本地分页的Table

[RemoteSelect](./md/RemoteSelect.md)  
远程Select

[ToggleColumn](./md/ToggleColumn.md)  
用于切换Table列的显示状态

## License

MIT
