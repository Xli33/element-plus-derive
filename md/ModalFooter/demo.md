#### 基本用法

```vue
<template>
  <el-button @click="modal.show = true">show Modal</el-button>
  <el-dialog
    v-model="modal.show"
    title="modal footer"
    :show-close="!modal.loading"
    :close-on-click-modal="!modal.loading">
    <h1>modal content</h1>
    <template #footer>
      <ModalFooter
        v-model="modal.show"
        :ok-loading="modal.loading"
        :cancel-disabled="modal.loading"
        @ok="confirm"
        @cancel="cancel"></ModalFooter>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const modal = reactive({
    show: false,
    loading: false
  }),
  confirm = () => {
    modal.loading = true
    setTimeout(() => {
      modal.show = false
      setTimeout(() => {
        modal.loading = false
      }, 200)
    }, 2000)
  },
  cancel = () => {
    ElMessage.info('cancel')
    modal.show = false
  }
</script>
```
