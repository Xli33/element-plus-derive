<template>
  <el-select
    v-if="!textMode"
    v-model="code"
    @visible-change="openChange"
    @change="changeCode"
    v-bind="$attrs"
    v-el-select:all="all"
    :multiple="multiple"
    :loading="loading"
    :no-data-text="loading ? (null as any) : undefined">
    <slot name="dropdown" :list="codes">
      <el-option
        v-for="(item, index) in codes"
        :key="props.valueAsKey ? item[keyMap.value] : index"
        :value="item[keyMap.value]"
        :label="formatLabel && formatLabel(item, index)"
        :disabled="optionDisabled && optionDisabled(item, index)">
        <slot :item="item" :index="index">{{ item[keyMap.label] }}</slot>
      </el-option>
    </slot>
  </el-select>
  <span v-else>
    <slot name="text" :text="selected">{{ selected }}</slot>
  </span>
</template>

<script lang="ts">
// 本地/远程下拉框

import type { Obj } from '@/type'
import { type PropType, computed, nextTick, onMounted, ref, watch } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { elSelect as vElSelect } from '@/directives'

export default {
  name: 'RemoteSelect',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
export type SelectValue = string | number | (string | number)[]

const props = defineProps({
  modelValue: [String, Array, Number] as PropType<SelectValue>,
  list: Array as PropType<Obj[]>,
  multiple: Boolean,
  /**
   * 是否将选项的value作为Option的key，默认以v-for的index作为key
   */
  valueAsKey: Boolean,
  /**
   * 选项对应value的key
   */
  valueKey: {
    type: String,
    default: 'value'
  },
  /**
   * 选项对应文本的key
   */
  labelKey: {
    type: String,
    default: 'label'
  },
  keyMap: {
    type: Object,
    default(props: Obj) {
      return {
        value: props.valueKey,
        label: props.labelKey
      }
    }
  },
  method: Function,
  refresh: Function,
  process: Function,
  param: [Object, Function, String],
  chosen: [Object, Array],
  autoGet: Boolean, // 默认只在点开时请求，若该值为true，则挂载后立即请求
  formatLabel: {
    type: Function
    /* default(item, index) {
        let ref = this.$refs["options" + index];
        return ref && ref[0] && ref[0].optionLabel;
      } */
  },
  /**
   * 点开再请求时，该函数返回true表示可发送请求
   */
  check: {
    type: Function
  },
  textMode: Boolean,
  textFormat: Function,
  /**
   * 关联值，该值变化后会清空绑定值与选项
   *
   * @example 当 some 变化后，<RemoteSelect>的值与选项都会清空
   * <Select v-model="some" ><Option value="1">1</Option></Select>
   * <RemoteSelect :parentCode="some" />
   */
  parentCode: [String, Array, Number],
  optionDisabled: Function,
  getSelected: {
    type: Function,
    default({
      multiple,
      keyMap,
      list,
      value
    }: {
      multiple: boolean
      keyMap: { value: string }
      list: Obj[]
      value: SelectValue
    }) {
      return !multiple
        ? list.find((e: Obj) => e[keyMap.value] === value) || {}
        : list.filter((e: Obj) => (value as (string | number)[]).includes(e[keyMap.value]))
    }
  },
  /**
   * 启用则根据绑定的list判断是否需要在展开时发送请求
   */
  cache: Boolean,
  loader: Function,
  /**
   * 开启后则展开时仅当parentCode有效才会发送请求
   */
  strict: Boolean,
  all: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'update:modelValue': [val: SelectValue]
  'update:chosen': [item: Obj]
  'update:list': [list: Obj[]]
  'update:refresh': [handle: typeof search]
  load: [val: any]
}>()

defineSlots<{
  default(_: { item: Obj; index: number }): any
  dropdown(_: { list: Obj[] }): any
  text(_: { text: string }): any
}>()

// data

const code = ref<SelectValue>(props.modelValue ?? '')
const codes = ref<Obj[]>([])
const loading = ref(false)
const chosenItem = ref<Obj>({})

// computed

// key映射

// 显示的已选项文本
const selected = computed<string>(() =>
  chosenItem.value && Object.keys(chosenItem.value).length > 0
    ? typeof props.textFormat !== 'function'
      ? !props.multiple
        ? chosenItem.value[props.keyMap.label]
        : chosenItem.value.map((e: Obj) => e[props.keyMap.label]).join(',')
      : props.textFormat(chosenItem.value)
    : ''
)

// methods

const loaded = ref(false)
let listUpdated: true | null, flag: true | null, /* current: any, */ outerChanged: true | null

// 查询列表
async function search() {
  let res
  if (typeof props.loader !== 'function') {
    if (typeof props.method !== 'function') {
      console.warn("typeof method isn't function")
      return
    }
    loading.value = true
    res = await props.method(typeof props.param !== 'function' ? props.param : props.param())
    loading.value = false
    if (res && typeof props.process === 'function') {
      const processed = props.process(res)
      if (processed != undefined) {
        res = processed
      }
    }
  } else {
    loading.value = true
    res = await props.loader()
    loading.value = false
  }
  if (!res) return
  loaded.value = true
  codes.value = res
  emit('update:list', res)
  hasCode() && changeCode(code.value)
  listUpdated = true
  nextTick(() => {
    listUpdated = null
  })
  emit('load', res)
}
// 变更事件
function changeCode(val: SelectValue) {
  flag = true
  nextTick(() => {
    flag = null
  })
  // 若是由于parentCode变更导致codes为空而引发组件内部将值置为undefined（单选模式）或[]（多选模式），则将外部传入的value重新赋值到code
  // if (current && (props.multiple ? !val.toString().length : val === undefined)) {
  //   code.value = val = current;
  // }
  chosenItem.value = props.getSelected({
    multiple: props.multiple,
    keyMap: props.keyMap,
    list: codes.value,
    value: code.value
  })
  emit('update:modelValue', val ?? '')
  emit('update:chosen', chosenItem.value)
}
// 展开事件
function openChange(open: boolean) {
  open &&
    !props.autoGet &&
    !loading.value &&
    !loaded.value &&
    (!props.check || props.check()) &&
    (!props.strict || !!props.parentCode) &&
    search()
}
// 判断是否有值
function hasCode() {
  return code.value != undefined && code.value.toString().length > 0
}

emit('update:refresh', search)

// 挂载后尝试查询一次
onMounted(() => {
  props.autoGet ? search() : hasCode() && !codes.value.length && openChange(true)
})

defineExpose({
  code,
  changeCode,
  loaded,
  codes,
  search
})

// watch
// 监听list
watch(
  () => props.list,
  (val) => {
    if (listUpdated) return
    if (val && val.length) {
      codes.value = val
      loaded.value = !!props.cache
      // if(!props.cache && props.textMode && hasCode() && !selected.value) {}
    } else {
      codes.value = []
      loaded.value = false
    }
  },
  { immediate: true }
)
// 监听modelValue
watch(
  () => props.modelValue,
  (val) => {
    if (flag) return
    outerChanged = true
    nextTick(() => {
      outerChanged = null
    })
    code.value = val ?? ''
    // if (hasCode()) {
    changeCode(code.value)
    if (props.refresh === search) return
    for (const i in chosenItem.value) {
      return
    }
    /* this.opening = true;
        this.$nextTick(() => {
          this.opening = false;
        }); */
    openChange(hasCode())
    // }
  }
)
// 监听parentCode
watch(
  () => props.parentCode,
  (val) => {
    if (!outerChanged) {
      code.value = props.multiple ? [] : ''
    }
    // else {
    // current = props.modelValue;
    // setTimeout(() => {
    //   current = null;
    // });
    // }
    codes.value = []
    loaded.value = false
    emit('update:list', codes.value)
    hasCode() && val && /* !this.opening  && */ openChange(true)
  }
)
</script>
