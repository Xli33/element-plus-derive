#### 基本用法

```vue
<template>
  <el-button v-loading="drawer.loading" @click="drawer.show = true">show drawer</el-button>
  <Drawer
    v-model="drawer.show"
    title="Drawer"
    :show-close="!drawer.loading"
    :close-on-click-modal="!drawer.loading"
    :footer-attrs="{
      okLoading: drawer.loading,
      cancelDisabled: drawer.loading
    }"
    @ok="confirm"
    @cancel="cancel"></Drawer>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const drawer = reactive({
    show: false,
    loading: false
  }),
  confirm = () => {
    drawer.loading = true
    setTimeout(() => {
      drawer.show = false
      setTimeout(() => {
        drawer.loading = false
      }, 200)
    }, 2000)
  },
  cancel = () => {
    ElMessageBox.confirm('确定要关闭吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        drawer.show = false
      })
      .catch(() => {
        ElMessage.info('cancel')
      })
  }
</script>
```
