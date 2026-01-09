<template>
  <el-drawer v-bind="$attrs" v-model="showDrawer">
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template v-if="hasFooter" #footer>
      <slot name="footer">
        <ModalFooter v-bind="footerAttrs" @ok="$emit('ok')" @cancel="toCancel"></ModalFooter>
      </slot>
    </template>
  </el-drawer>
</template>

<script lang="ts">
// 通用Drawer组件

import { getCurrentInstance } from 'vue'
import { ElDrawer } from 'element-plus'
import ModalFooter from './ModalFooter.vue'

export default {
  name: 'Drawer',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps({
  hasFooter: {
    type: Boolean,
    default: true
  },
  footerAttrs: Object
})

defineSlots<{
  // header
  header(): any
  // body
  default(): any
  //   footer
  footer(): any
}>()

const emit = defineEmits<{
  ok: []
  cancel: []
}>()

const showDrawer = defineModel({
  type: Boolean
})
const instance = getCurrentInstance()!

const toCancel = () => {
  // 若父组件监听了cancel事件则触发该监听器，否则直接更改modelValue
  instance.vnode.props!.onCancel ? emit('cancel') : (showDrawer.value = false)
}
</script>
