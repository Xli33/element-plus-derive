#### 基本用法

```vue
<template>
  <ToggleColumn v-model="table.columns" style="float:right;margin-bottom:10px"></ToggleColumn>
  <el-table :data="table.list">
    <ElColumn :columns="table.columns"></ElColumn>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const table = ref({
  list: [
    {
      year: 2000,
      date: '2000-01-01'
    },
    {
      year: 1000,
      date: '1000-01-01'
    }
  ],
  columns: [
    {
      type: 'selection',
      prop: 'selection',
      width: 60,
      _switchable: false // 让该列不可被切换
    },
    {
      label: 'year',
      prop: 'year'
    },
    {
      label: 'date',
      prop: 'date'
    }
  ]
})
</script>
```
