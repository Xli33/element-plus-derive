## ToggleColumn

用于切换el-table列的显示状态

```vue
<template>
  <ToggleColumn v-model="table.columns"></ToggleColumn>
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
      key: 'selection',
      width: 60,
      _switchable: false // 让该列不可被切换
    },
    {
      title: 'year',
      key: 'year'
    },
    {
      title: 'date',
      key: 'date'
    }
  ]
})
</script>
```

## props

`modelValue` _Array_  
v-model双向绑定Table列

`title` _String_  
全选框文本

`icon` _String_  
传入iview icon名则仅显示图标

`cache-id` _String | Number_  
绑定columns对应的唯一标识，一般在v-for中绑定了固定某列且列配置中带有 `_visible:false` 时用到

`all` _Boolean_ （default `true`）  
是否显示全选框

`transfer` _Boolean_  
el-dropdown的transfer

`store-at` _String_  
将状态缓存至localStorage中的key，支持a.b形式  
如`store-at='app.main.cols'`，组件会尝试将显示状态读写至 localStorage.app.main.cols

## emits

`change` (value)  
切换列状态时触发。`value`: 切换的列

## slots

`default()`  
替换默认显示的Button
