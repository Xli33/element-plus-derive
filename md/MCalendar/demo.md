#### 基本用法

```vue
<template>
  <EpdMCalendar v-model:range="calendar.range" :date="calendar.date" has-range>
    <template #cell="{ day = {} } = { day: {} }">
      <el-badge type="success" is-dot></el-badge>
      <p>{{ day._text }}</p>
    </template>
  </EpdMCalendar>
</template>

<script setup>
import { shallowReactive } from 'vue'

const calendar = shallowReactive({
  range: [
    { _date: new Date(Date.now() - 86400000 * 7) },
    { _date: new Date(Date.now() - 86400000) }
  ],
  date: new Date(Date.now() - 86400000 * 7)
})
</script>
```
