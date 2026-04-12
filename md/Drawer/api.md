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

- `0.0.5+`
  点击遮罩与关闭icon时也会触发该事件，若需分开处理可以使用 el-drawer 的 `before-close`

## slots

`header()`  
header

`default()`  
body

`footer()`  
footer
