<template>
  <RemoteSelect
    ref="sel"
    v-model="code"
    v-model:list="local[cacheId]!"
    @load="load"
    @change="change"
    @update:chosen="$emit('update:chosen', $event)"
    @update:list="$emit('update:list', $event)"
    v-bind="$attrs"
    cache>
    <template #default="{ item, index }">
      <slot :item="item" :index="index"></slot>
    </template>
    <template #dropdown="{ list }">
      <slot name="dropdown" :list="list"></slot>
    </template>
    <template #text="obj">
      <slot name="text" v-bind="obj"></slot>
    </template>
  </RemoteSelect>
</template>

<script lang="ts">
// 缓存形式的RemoteSelect，保证同一cacheId下只会有一次请求以及同一份选项数据
// 常用于循环中替代RemoteSelect，可避免生成多个RemoteSelect时会触发多次重复请求，同时所有同cacheId组件共享同一选项源

import type { Obj } from '@/type'
import {
  type PropType,
  onMounted,
  ref,
  watch,
  nextTick,
  useTemplateRef,
  shallowReactive
} from 'vue'
import RemoteSelect, { type SelectValue } from './RemoteSelect.vue'

// 默认加载标记
const loadeds: {
  [n: string]: true | null
} = {
  list: null
}
// 用于存储选项list
const local: {
  [n: string]: Obj[]
} = shallowReactive({})
// 需要防止触发重复请求的实例数组，并用于在第一次load后补充触发未触发的update:chosen
const cached: {
  [n: string]: Obj[]
} = {
  list: []
}
// 由于默认缓存特性，udpate:list只会触发一次，本组件有默认值时update:chosen也只会触发一次，所以存在多个同类型实例时只会有第一个能拿到chosen和list
// 该对象用于保存需要手动触发update:list的CacheSelect实例
const listToUpdate: {
  [n: string]: Obj[]
} = {
  list: []
}
// 是否可加载标记
const cachedWithValue: {
  [n: string]: boolean
} = {}

export default {
  name: 'CacheSelect',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Array, Number] as PropType<SelectValue>,
  /**
   * 缓存的唯一键，当页面上同时用到多个不同数据源的CacheSelect时需传入不同值
   */
  cacheId: {
    type: String,
    default: 'list'
  }
})

const emit = defineEmits<{
  // 'update:modelValue': [val: SelectValue]
  // 'update:chosen': [item: Obj]
  // 'update:list': [list: Obj[]]
  // load: [res: any]
  // change: [val: SelectValue]
  (e: 'update:modelValue', val: SelectValue): void
  (e: 'update:chosen', item: Obj): void
  (e: 'update:list', list: Obj[]): void
  (e: 'load', res: any): void
  <k extends SelectValue>(e: 'change', val: k): void
}>()

// data

const code = ref<SelectValue>('')
const selRef = useTemplateRef('sel') //ref<any>(null)

// methods
// let flag: true | null
const change = (val: SelectValue) => {
  // flag = true
  // nextTick(() => {
  //   flag = null
  // })
  emit('update:modelValue', val)
  emit('change', val)
}

const load = (res: any) => {
  nextTick(() => {
    if (cached[props.cacheId]) {
      cached[props.cacheId]!.forEach((e) => {
        e.changeCode(e.code)
      })
      cached[props.cacheId] = []
    }
    if (listToUpdate[props.cacheId]) {
      listToUpdate[props.cacheId]!.forEach((e) => {
        if (e !== selRef.value) {
          e.$emit('update:list', e.codes)
        }
      })
      listToUpdate[props.cacheId] = []
    }
  })
  emit('load', res)
}
const hasCode = () => code.value != undefined && code.value.toString().length > 0

//  watch

watch(
  () => props.modelValue,
  (val) => {
    if (code.value !== val /* !flag */) code.value = val ?? ''
  }
)

// created
if (!local[props.cacheId]) {
  local[props.cacheId] = []
  loadeds[props.cacheId] = null
}

onMounted(() => {
  if (local[props.cacheId]!.length) {
    selRef.value!.loaded = true
  }
  if (props.modelValue) {
    code.value = props.modelValue
  }
  if (!loadeds[props.cacheId]) {
    loadeds[props.cacheId] = true
  } else {
    // chosen是有值才会存在，故需要判断hasCode
    if (hasCode()) {
      if (!cached[props.cacheId]) {
        cached[props.cacheId] = []
      }
      cached[props.cacheId]!.push(selRef.value!)
    }
    // cacheId中的第一个有值的不能将loaded改为true，否则其无法自动回显
    selRef.value!.loaded = cachedWithValue[props.cacheId]!
  }
  // v-model:list无关是否存在已选值，始终能获取到的
  if (!listToUpdate[props.cacheId]) {
    listToUpdate[props.cacheId] = []
  }
  listToUpdate[props.cacheId]!.push(selRef.value!)
  // 遇到第一个有值的，该类型标记为true，则之后同类型的loaded始终会是true，保证只会被第一个有值的触发自动请求，若该类型都木有值，则每一个都可以触发请求
  if (!cachedWithValue[props.cacheId]) {
    cachedWithValue[props.cacheId] = hasCode()
  }

  watch(
    () => local[props.cacheId],
    (val) => {
      if (val!.length) {
        selRef.value!.loaded = true
      }
    },
    {
      immediate: true
    }
  )
})
</script>
