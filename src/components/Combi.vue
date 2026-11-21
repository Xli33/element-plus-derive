<template>
  <div :class="[useClass('combi'), 'el-input', 'el-input-group']">
    <div v-if="hasPrepend" class="el-input-group__prepend">
      <slot name="prepend">{{ prepend }}</slot>
    </div>
    <div
      :class="[useClass('combi-cell'), { 'with-append': hasAppend, 'with-prepend': hasPrepend }]">
      <slot></slot>
    </div>
    <div v-if="hasAppend" class="el-input-group__append">
      <slot name="append">{{ append }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
// 类似 el-input[append prepend]的组合框

import { computed } from 'vue'
import { useClass } from '@/utils'

export default {
  name: 'Combi'
}
</script>

<script setup lang="ts">
const slots = defineSlots<{
  default(): any
  /**
   * 前置内容
   */
  prepend?(): any
  /**
   * 后置内容
   */
  append?(): any
}>()

const props = defineProps({
  /**
   * 前置文本
   */
  prepend: String,
  /**
   * 后置文本
   */
  append: String
})

const hasPrepend = computed(() => !!props.prepend || !!slots.prepend?.().length)
const hasAppend = computed(() => !!props.append || !!slots.append?.().length)
</script>

<style lang="scss">
@use '@/styles/Combi.scss';
</style>
