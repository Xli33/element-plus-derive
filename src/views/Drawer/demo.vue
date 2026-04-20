<template>
  <el-card header="Drawer" class="block">
    <el-button @click="modal.show = true">show drawer</el-button>
    <Drawer
      v-model="modal.show"
      title="drawer footer"
      :show-close="!modal.loading"
      :close-on-click-modal="!modal.loading"
      :footer-attrs="{
        okLoading: modal.loading,
        cancelDisabled: modal.loading
      }"
      @ok="confirm"
      @cancel="cancel">
      body
    </Drawer>
  </el-card>
</template>

<script setup lang="ts">
import { shallowReactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Drawer } from '@/index'

const modal = shallowReactive({
  show: false,
  loading: false
})

const confirm = () => {
  modal.loading = true
  setTimeout(() => {
    modal.show = false
    setTimeout(() => {
      modal.loading = false
    }, 200)
  }, 1000)
}

const cancel = () => {
  ElMessageBox.confirm('确定要关闭吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      modal.show = false
    })
    .catch(() => {
      ElMessage.info('cancel')
    })
}
</script>
