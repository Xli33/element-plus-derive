<template>
  <el-row justify="space-between" align="middle">
    <div>
      <slot name="other"></slot>
    </div>
    <div>
      <el-button
        :disabled="cancelDisabled"
        :loading="cancelLoading"
        :type="cancelType"
        v-bind="cancel"
        @click="toCancel"
        >{{ cancelText ?? $i18n.t('modalFooter.cancel') }}</el-button
      >
      <el-button
        v-if="hasOk"
        :disabled="okDisabled"
        :loading="okLoading"
        v-bind="ok"
        type="primary"
        @click="$emit('ok')"
        >{{ okText ?? $i18n.t('modalFooter.ok') }}</el-button
      >
      <slot name="action"></slot>
    </div>
  </el-row>
</template>

<script lang="ts">
// Modal/Drawer底部通用组件

import { getCurrentInstance, type PropType } from 'vue'
import { ElRow, ElButton } from 'element-plus'
import { $i18n } from '@/locale/i18n'
import type { BtnType } from '@/type'

export default {
  name: 'ModalFooter',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps({
  modelValue: Boolean,
  /**
   * 确定按钮文本
   */
  okText: String,
  /**
   * 取消按钮文本
   */
  cancelText: String,
  /**
   * 传递给确定按钮的props
   */
  ok: Object,
  /**
   * 确定按钮加载状态
   */
  okLoading: Boolean,
  /**
   * 确定按钮禁用状态
   */
  okDisabled: Boolean,
  /**
   * 传递给取消按钮的props
   */
  cancel: Object,
  /**
   * 取消按钮加载状态
   */
  cancelLoading: Boolean,
  /**
   * 取消按钮禁用状态
   */
  cancelDisabled: Boolean,
  /**
   * 取消按钮type，默认 default
   */
  cancelType: {
    type: String as PropType<BtnType>,
    default: 'default'
  },
  /**
   * 是否显示确定按钮
   */
  hasOk: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  ok: []
  cancel: []
}>()
const instance = getCurrentInstance()

// methods
const toCancel = () => {
  // 若父组件监听了cancel事件则触发该监听器，否则直接更改modelValue
  instance!.vnode.props!.onCancel ? emit('cancel') : emit('update:modelValue', false)
}
</script>
