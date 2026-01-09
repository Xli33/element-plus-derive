# ModalFooter

代替ElDialog自带的底栏部分，按钮易于控制，自定义度更高

```jsx
<template>
  <Button @click="modal.show = true">show Modal</Button>
  <Dialog v-model="modal.show" title="modal footer">
    <h1>modal content</h1>
    <template #footer>
      <ModalFooter
        v-model="modal.show"
        :ok-loading="modal.loading"
        @ok="confirm"
        @cancel="cancel"></ModalFooter>
    </template>
  </Dialog>
</template>
<script setup>
  import { reactive } from 'vue'

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
      alert('cancel')
      modal.show = false
    }
</script>
```

## props

`modelValue` _Boolean_  
双向绑定Modal的modelValue

`ok-text` _String_  
确定按钮文本

`ok-disabled` _Boolean_  
确定按钮禁用状态

`ok-loading` _Boolean_  
确定按钮加载状态

`ok` _Object_  
传递给确定按钮的props

`cancel-text` _String_  
取消按钮文本

`cancel-loading` _Boolean_  
取消按钮加载状态

`cancel-disabled` _Boolean_  
取消按钮禁用状态

`cancel` _Object_  
传递给取消按钮的props

`cancel-type` _String_ （default `'default'`）  
取消按钮type

`has-ok` _Boolean_ （default `true`）  
是否显示确定按钮

## emits

`ok`  
点击确定按钮触发

`cancel`  
点击取消按钮触发。未监听该事件时会直接关闭Modal

## slots

`other()`  
显示在右下角按钮旁边的内容

`action()`  
显示在底栏左侧的内容
