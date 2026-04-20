#### 基本用法

```vue
<template>
  <el-button :loading="pageTable.loading" style="margin-bottom:5px" @click="search">查询</el-button>
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
      label: 'num',
      prop: 'num'
    },
    {
      label: 'date',
      prop: 'date'
    },
    {
      label: 'time',
      prop: 'time'
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
    }, 3000)
  })
}
</script>
```
