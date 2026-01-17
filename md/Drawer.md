# Drawer

默认带footer的el-drawer

```vue
<template>
  <Drawer
    v-model="drawer.show"
    v-loading="drawer.loading"
    title="Drawer"
    @ok="confirm"
    @cancel="cancel"></Drawer>
</template>
<script setup>
import { reactive } from 'vue'

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
    alert('cancel')
    drawer.show = false
  }
</script>
```

## props

`modelValue` _Boolean_  
双向绑定

`has-footer` _Boolean_ （default `true`）  
是否显示footer

`footer-attrs` _Object_  
传递给ModalFooter的props

## emits

`ok`  
点击确定按钮触发

`cancel`  
点击取消按钮触发。未监听该事件时会直接关闭Drawer

## slots

`header()`  
header

`default()`  
body

`footer()`  
footer
