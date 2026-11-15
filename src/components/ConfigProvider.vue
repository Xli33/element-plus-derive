<template>
  <slot />
</template>

<script lang="ts">
export default {
  name: 'ConfigProvider'
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { CPKey } from '@/utils'

const props = defineProps({
  /**
   * 语言包对象
   */
  locale: Object,
  /**
   * 语言包对象键名前缀
   */
  msgPrefix: {
    type: String,
    default: 'd'
  }
})

// 向下层所有子组件注入当前配置
provide(CPKey, {
  locale: computed(() => props.locale),
  msgPrefix: props.msgPrefix
})
</script>
