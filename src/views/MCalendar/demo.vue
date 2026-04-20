<template>
  <el-card header="MCalendar" class="block">
    <MCalendar
      v-model:range="calendar.range"
      has-range
      style="text-align: left"
      @click-day="
        (...args: []) => {
          console.log('clickDay', args)
        }
      "
      @dblclick-day="(...args: []) => console.log('dblclickDay', args)"
      @select-range="(...args: []) => console.log('select-range', args)">
      <template #cell="{ day }">
        <el-badge type="success" is-dot></el-badge>
        <p>{{ day._text }}</p>
      </template>
    </MCalendar>
  </el-card>
</template>

<script setup lang="ts">
import { shallowReactive } from 'vue'
import { MCalendar } from '@/index'

const calendar = shallowReactive({
  range: [
    { _date: new Date(Date.now() - 86400000 * 7) },
    { _date: new Date(Date.now() - 86400000) }
  ]
})
</script>
