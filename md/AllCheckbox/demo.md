#### 基本用法

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
