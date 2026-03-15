#### 基本用法

```vue
<template>
  <CacheSelect
    v-model="selectModel"
    :method="getList"
    style="width: 200px;margin-right:10px"
    @change="$message.info($event)"></CacheSelect>
  <CacheSelect
    v-model="selectModel"
    :method="getList"
    style="width: 200px"
    @change="$message.info($event)"></CacheSelect>
</template>
<script setup>
import { ref } from 'vue'

const selectModel = ref(''),
  getList = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { value: 'a', label: '一' },
          { value: 'b', label: '二' },
          { value: 'c', label: '三' }
        ])
      })
    }, 2000)
</script>
```
