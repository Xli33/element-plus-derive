## AllCheckbox

提供全选功能的el-checkbox-group

```vue
<template>
  <AllCheckbox v-model="checkeds" v-model:all="checkAll" :list="list"></AllCheckbox>
</template>
<script setup>
import { ref, shallowRef } from 'vue'

const checkeds = shallowRef(['1', '3']),
  checkAll = ref(),
  list = Object.entries({
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
  })
</script>
```

## props

`modelValue` _Array_  
双向绑定选中值

`all` _Boolean_  
v-model:all双向绑定全选框的值，若全选中应为 true，否则 false

`title` _String_  
全选框显示文本，默认“全选”

`list` _Array_  
选项数组，数组成员可以是数组或对象

`value-key` _String | Number_ （default `0`）  
各选项值对应list中的value键。如list是[{v:1,k:2}]，valueKey为 v 且 labelKey为 k, 则选项绑定值为 1，显示文本是 2

`label-key` _String | Number_ （default `1`）  
各选项值对应list中的label键。如list是[{v:1,k:2}]，valueKey为 v 且 labelKey为 k, 则选项绑定值为 1，显示文本是 2

`key-map` _Object_  
同时设置valueKey & labelKey，优先级相对更高

`hide-all` _Boolean_  
是否隐藏全选框

## emits

`change` (value, checkAll)  
更改checkbox时触发。`value` ：当前选中值数组 `checkAll` ：是否全选

## slots

`default({item})`  
checkbox选项文本
