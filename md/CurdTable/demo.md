#### 基本用法

```vue
<template>
  <CurdTable
    v-model="table.list"
    :columns="table.columns"
    size="small"
    :action-width="130"
    :add-row="table.add">
    <template #num="{ row, $index }">
      <el-input v-model.trim="table.list[$index].num"></el-input>
    </template>
    <template #moreAction="{ row }">
      <el-button size="small" style="margin-right:5px">查看</el-button>
    </template>
  </CurdTable>
</template>

<script setup lang="jsx">
const table = {
  columns: [
    {
      label: 'emoji',
      prop: 'emoji',
      type: 'selection'
    },
    {
      label: 'exp',
      prop: 'exp'
    },
    {
      label: 'num',
      prop: 'num',
      slot: 'num',
      renderHeader: ({ column }) => (
        <>
          {column.label}
          <input value={column.label} onInput={(e) => (column.label = e.target.value)} />
        </>
      )
    },
    {
      label: 'time',
      prop: 'time'
    }
  ],
  list: [
    {
      emoji: '😶‍🌫️🤨😐',
      exp: 'ԅ(¯﹃¯ԅ)',
      num: Math.random(),
      time: new Date().toLocaleString()
    },
    {
      emoji: '😠😪',
      exp: 'ヾ(•ω•`)o',
      num: Math.random(),
      time: new Date().toLocaleString()
    }
  ],
  add: () => [
    {
      emoji: ' 😏🤤',
      exp: 'Σ(っ °Д °;)っ',
      num: Math.random(),
      time: new Date().toLocaleString()
    }
  ]
}
</script>
```
