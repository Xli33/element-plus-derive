# PageTable

远程分页/本地分页的Table

```vue
<template>
  <button :loading="pageTable.loading" @click="search">查询</button>
  <PageTable
    ref="pageTableRef"
    v-model:selection="pageTable.selection"
    v-model:loading="pageTable.loading"
    :columns="pageTable.columns"
    :method="getList"
    page-key="current"
    size-key="size"
    data-key="list"
    total-key="total"
    use-page-num
    :max-height="400"
    show-header
    border
    stripe>
    <template #num="{ column }">{{ column.title }}</template>
  </PageTable>
</template>
<script setup>
import { shallowReactive, useTemplateRef } from 'vue'

const refPageTable = useTemplateRef('pageTableRef')
const pageTable = shallowReactive({
  loading: false,
  selection: [],
  columns: [
    {
      title: 'num',
      key: 'num'
    },
    {
      title: 'date',
      key: 'date'
    },
    {
      title: 'time',
      key: 'time'
    }
  ]
})
function search() {
  refPageTable.value.search()
}
function getList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ress: new Array(30).fill(0).map((e, i) => ({ num: i, date: '1010', time: '----' })),
        total: 30
      })
    })
  })
}
</script>
```

## props

`columns` _Array_ （default `[]`）  
列配置

`modelValue` _Array_ （default `[]`）  
双向绑定列表数据

`method` _Function_  
远程请求方法

```ts
const getResult = () => axios.get('').then(res => res.data)
<PageTable :method="getResult" />
```

`param` _Object | Function_  
调用 method 时传入的参数或者返回参数的函数

`data-key` _String_  
返回值中对应的列表数据key  
如返回结构是 `{ result: [1,2,3], total: 100 }`，则`dataKey='result'`

`total-key` _String_  
返回值中对应的分页总条数key  
如返回结构是 `{ result: [1,2,3], total: 100 }`，则`totalKey='total'`

`page-key` _String_  
请求时传递的分页参数中 first 对应 key  
后端分页一般要求指定起始数据索引或者“页码”，以及获取多少条数据  
如后端接口给定的分页参数是 firstIndex 对应起始索引`pageKey='firstIndex'`

`size-key` _String_  
请求时传递的分页参数中 size 对应 key。  
后端分页一般要求指定起始数据索引或者“页码”，以及获取多少条数据  
如后端接口给定的分页参数是 amount 对应需要获取的条数`sizeKey='amount'`

`page-map` _Object_  
对象形式传递分页参数映射

`border` _Boolean_  
对应el-table的border

`process` _Function_  
处理接口返回列表数据的函数

`is-local` _Boolean_  
是否本地分页

`page-size-opts` _Array_ （default `[30, 50, 100]`）  
分页条数选项

`auto-remain` _Boolean_  
查询失败时不清除之前获取到的结果

`bottom-dis` _Number | String_ （default `45`）  
计算Table的maxHeight时，Table距离视口底部的距离

`init-size` _Number_  
初始分页条数

`check` _Function_  
远程查询时额外检测的方法

`use-page-num` _Boolean_ （default `true`）  
查询时是否用页码而不是用当页第一条的索引

`title` _String_  
head title

`show-header` _Boolean_  
是否显示header

`transfer` _Boolean_ （default `true`）  
Transfer

`fullscreen` _Boolean_  
最大化时是否全屏

`store-at` _String_  
传至ToggleColumn组件的storeAt

`hide-page` _Boolean_  
隐藏分页

`auto-max-height` _Boolean_ （default `true`）  
自动设置el-table的maxHeight

`max-height` _Number | String_  
el-table的maxHeight

`height` _Number | String_  
el-table的height

`auto-height` _Boolean_  
自动设置Table的height

`maximize-height-type` _String_ （default `'maxHeight'`）  
最大化时自动计算哪种高度

## emits

`load` (res)  
成功加载列表后触发。`res`: 获取到的结果

`reload`  
点击刷新图标触发，仅本地分页时生效

`change-col` (checked)  
内部组件切换列后触发。`checked`: 切换的列

`maximize-change` (maximized)  
切换最大化后触发。`maximized`: 是否最大化

## slots

`title()`  
左上角的标题

`headerAction()`  
右上角功能区

`headerActionEnd()`  
右上角功能区右侧

`name({row, index})`  
传给Table的动态slot，需要列配置中指定slot。e.g. `[{ slot: 'name' }]`
