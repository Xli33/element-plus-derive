import type { Obj } from '@/type'
import type { Directive } from 'vue'

// el-select使用v-el-select:all开启全选
export const elSelect: Directive = {
  beforeMount: (el, binding, vnode: any) => {
    if (binding.arg !== 'all' || (binding.value != null && !binding.value)) return
    if (!vnode.el) return
    const { ctx } = vnode.ctx,
      icon = document.createElement('i')
    icon.className = 'el-icon el-select__caret el-select__icon el-icon-folderChecked'
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1024 1024"><path fill="currentColor"d="M128 192v640h768V320H485.76L357.504 192zm-32-64h287.872l128.384 128H928a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32m414.08 502.144 180.992-180.992L736.32 494.4 510.08 720.64l-158.4-158.336 45.248-45.312z"></path></svg>'
    icon.onclick = (e) => {
      if (ctx.disabled || !ctx.multiple) return
      e.stopPropagation()
      const valids = ctx.optionsArray.filter((e: Obj) => !e.disabled),
        value = ctx.modelValue.length !== valids.length ? valids.map((e: Obj) => e.value) : []
      ctx.$emit('update:modelValue', value)
      ctx.$emit('change', value)
    }
    if (!document.getElementById('elSelect-css')) {
      const style = document.createElement('style')
      style.id = 'elSelect-css'
      style.innerHTML =
        '.with-all.el-select .el-select__suffix .el-icon-folderChecked,' +
        '.with-all.el-select-multiple:hover .el-select__suffix .el-icon:not(.el-icon-folderChecked){display:none;}' +
        '.with-all.el-select-multiple:hover .el-select__suffix .el-icon-folderChecked{display:inline-flex}'
      document.head.appendChild(style)
    }
    el.classList.add('with-all', 'el-select-multiple')
    el.children[0]!.children[1]!.appendChild(icon)
  },
  updated: (el: HTMLElement, binding, vnode) => {
    el.classList.add('with-all')
    if (binding.arg !== 'all') return
    el.classList.toggle(
      'el-select-multiple',
      (binding.value == null || binding.value) && (vnode as Obj).ctx.props.multiple
    )
  }
}
