<template>
  <div>
    <el-checkbox
      v-show="!hideAll"
      v-model="whole"
      :indeterminate="indeterminate"
      @change="change"
      >{{ title ?? $i18n.t('allCheckbox.title') }}</el-checkbox
    >
    <el-checkbox-group v-model="inner" class="ep-inline-block" @change="change">
      <el-checkbox v-for="item in list" :key="item[keyMap.value]" :value="item[keyMap.value]">
        <slot :item="item">{{ item[keyMap.label] }}</slot>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts">
// 全选组件

import type { Obj } from '@/type'
import { type PropType, computed, onMounted, watch, shallowRef } from 'vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { $i18n } from '@/locale/i18n'
// 声明组件 name 不建议用 definOptions，因为 setup 内部有内容时，哪怕只有一行注释，依旧会导致无名组件被赋予 __name 属性
// 这时若用 defineOptions 声明了 name，组件就会有一个多余的 __name
// 当这里声明过 name 后，即便有调用 setup 也不会再生成多余的 __name
export default {
  name: 'AllCheckbox'
}
</script>

<script setup lang="ts">
export type CheckValue = (string | number)[]

defineSlots<{
  /**
   * checkbox整体选项区域
   */
  // default(): any
  /**
   * checkbox选项内容
   * @param item list子项
   */
  default(_: { item: Obj }): any
}>()
// console.log(slots);

const props = defineProps({
  modelValue: Array as PropType<CheckValue>,
  /**
   * 全选框显示文本，默认“全选”
   */
  title: String,
  /**
   * 选项数组，数组成员可以是数组或对象
   */
  list: {
    type: Array as PropType<Obj[]>,
    default: () => []
  },
  /**
   * 各选项值对应list中的value键。如list是[{v:1,k:2}]，valueKey为 v 且 labelKey为 k, 则选项绑定值为 1，显示文本是 2
   */
  valueKey: {
    type: [String, Number],
    default: 0
  },
  /**
   * 各选项值对应list中的label键。如list是[{v:1,k:2}]，valueKey为 v 且 labelKey为 k, 则选项绑定值为 1，显示文本是 2
   */
  labelKey: {
    type: [String, Number],
    default: 1
  },
  /**
   * 同时设置valueKey & labelKey，优先级相对更高
   */
  keyMap: {
    type: Object,
    default(props: Obj) {
      return {
        value: props.valueKey,
        label: props.labelKey
      }
    }
  },
  /**
   * 是否隐藏全选框
   */
  hideAll: Boolean,
  /**
   * 双向绑定全选框的值，若全选中应为 true，否则 false
   */
  all: Boolean
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: CheckValue): void
  (e: 'update:all', val: boolean): void
  <k extends CheckValue>(e: 'change', val: k, all: boolean): void
}>()

// 勾选项
const inner = shallowRef(props.modelValue || [])

// const options = computed(() => {
//   const arr: Obj[] = slots.default?.()
//   return arr
//     ? arr
//       .filter((e) => e.type.name === 'Checkbox')
//       .concat(
//         arr
//           .filter((e) => e.type.description === 'v-fgt')
//           .flatMap((e) => e.children)
//           .filter((c) => c.type.name === 'Checkbox')
//       )
//     : props.list
// })

// 是否全选
const whole = computed({
  get() {
    return inner.value.length === props.list.length
  },
  set(val) {
    inner.value = val
      ? props.list.map((e: Obj) => e[props.keyMap.value]) // : options.value.map((e: Obj) => e.props.label)
      : []
  }
})

// 半勾选状态
const indeterminate = computed(
  () => inner.value.length > 0 && inner.value.length < props.list.length
)

// let flag: true | null
// 修改事件
function change() {
  // flag = true
  // nextTick(() => {
  //   flag = null
  // })
  emit('update:modelValue', inner.value)
  emit('update:all', whole.value)
  emit('change', inner.value, whole.value)
}

onMounted(() => {
  emit('update:all', whole.value)
  // if (Array.isArray(props.modelValue)) {
  // inner.value = props.modelValue
  // emit('update:all', whole.value)
  // }
})

watch(
  () => props.modelValue,
  (val) => {
    if (inner.value !== val) {
      inner.value = val || []
      emit('update:all', whole.value)
    }
  }
)
</script>
