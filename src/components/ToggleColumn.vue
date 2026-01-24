<template>
  <el-dropdown
    placement="bottom-end"
    :teleported="transfer"
    :popper-class="useClass('toggle-column-pop')"
    :hide-on-click="false"
    :showArrow="false"
    :class="useClass('toggle-column')">
    <span :class="useClass('toggle-column-btn')">
      <slot>
        <el-button type="default" :icon="icon">
          <template v-if="!icon"
            >{{ title ?? $i18n.t('toggleColumn.title') }} <el-icon><ArrowDown /></el-icon
          ></template>
        </el-button>
      </slot>
    </span>
    <template #dropdown>
      <div v-if="all" class="el-dropdown-menu__item">
        <el-checkbox v-model="checkAll" :indeterminate="indeterminate">{{
          $i18n.t('toggleColumn.checkAll')
        }}</el-checkbox>
      </div>
      <el-dropdown-menu :class="useClass('toggle-column-list')">
        <el-dropdown-item
          v-for="(item, index) in checkList"
          :key="index"
          :disabled="!item._switchable">
          <el-checkbox
            v-model="item._visible"
            :disabled="!item._switchable"
            @change="change(item, index)"
            >{{ item.label }}</el-checkbox
          >
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
// 切换列组件

import type { Obj } from '@/type'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import {
  ElDropdown,
  ElButton,
  ElCheckbox,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { deepMerge, getPathValue, isObject, makeObjectByPath, setPathValue } from 'utils-where'
import { $i18n } from '@/locale/i18n'
import { useClass } from '@/utils'

// 用于记录绑定的原始列，配合prop：cacheId使用，避免在v-for中绑定了有 _visible: false 的列时在切换显示后丢失原始列
const initial: Obj = {}

export default {
  name: 'ToggleColumn'
}
</script>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Array
  },
  title: String,
  /**
   * 仅显示图标
   */
  icon: String,
  /**
   * 绑定columns对应的唯一标识，一般在v-for中绑定了固定某列且列配置中带有 _visible:false 时用到
   */
  cacheId: [String, Number],
  /**
   * 是否显示全选框
   */
  all: {
    type: Boolean,
    default: true
  },
  transfer: Boolean,
  /**
   * 将状态缓存至localStorage中的key，支持a.b形式
   *
   * @example
   * // 组件会尝试将显示状态读写至 localStorage.app.main.cols
   * storeAt='app.main.cols'
   *
   * 特殊情况：如读写至 localStorage.app.page1['part1.list'].cols
   * storeAt='app.page1.[part1.list].cols'
   */
  storeAt: String,
  /**
   * 最小可见列数
   */
  minVisible: {
    type: Number,
    default: 1
  },
  /**
   * 切换列时是否实时读取本地存储
   *
   * 在启用storeAt时，默认只在初始化时从本地读取一次之前保存的状态 \
   * 若需要每次切换列时都实时从本地获取最新的数据，则可以开启此项 \
   * 一般在搭配其它逻辑共享同一数据结构时适用，如拖拽列宽后需要将列宽存至同一对象中以节省存储空间 \
   * 当在循环中使用（即存在cacheId）时，建议开启此项，否则可能会出现列显示异常的情况
   *
   * @default
   * !!props.storeAt && !!props.cacheId
   */
  realtime: {
    type: Boolean,
    default: (props: Obj) => !!props.storeAt && !!props.cacheId
  }
})

const emit = defineEmits<{
  'update:modelValue': [val: Obj[]]
  change: [val: Obj[] | Obj]
}>()

let tid: ReturnType<typeof setTimeout> | null, first: string, restKeys: string
// 保存状态至本地
const save = (flag?: boolean) => {
  clearTimeout(tid!)
  let prev = localStorage.getItem(first) as any
  prev = prev ? (JSON.parse(prev) as Obj) : {}
  // 保存过则通过setPathValue直接赋值，否则应该根据restKeys构建对象并入prev
  !flag ? setPathValue(prev, restKeys, config) : deepMerge(prev, makeObjectByPath(restKeys, config))
  tid = setTimeout(() => {
    tid = null
    localStorage.setItem(first, JSON.stringify(prev))
  })
}

// data
// let configPath: Obj
let config: Obj
if (props.storeAt) {
  first = props.storeAt!.split('.')[0]!
  restKeys = props.storeAt!.slice(first.length + 1)
  // e.g. props.storeAt = 'app.main.cols'，则尝试获取 localStorage.app.main.cols，未获取到则保存一遍 localStorage.app: {main: {cols:{}}}
  config =
    (localStorage.getItem(first) as unknown as Obj) &&
    getPathValue(JSON.parse(localStorage[first]), restKeys)
  // config无效则说明之前木有存过，需要调用save(true)先存储一次符合props.storeAt的数据结构
  if (!config) {
    config = {}
    save(true)
  }
}
const backup = shallowRef<Obj[]>([]),
  checkList = ref<Obj[]>([])

// computed

const indeterminate = computed(() => {
  const cols = checkList.value.filter((e) => e._switchable)
  return cols.some((e) => e._visible) && cols.some((e) => !e._visible)
})
const checkAll = computed({
  get() {
    const cols = checkList.value.filter((e) => e._switchable)
    return cols.length > 0 && cols.every((e) => e._visible)
  },
  set(val) {
    if (val) {
      checkList.value.forEach((e, i) => {
        if (e._switchable) {
          backup.value[i]!._visible = e._visible = val
          return
        }
        e._switchable = e.initSwitchable
      })
    } else {
      // 待禁用数量
      const toDisableds = props.minVisible - checkList.value.filter((e) => !e._switchable).length
      let count = 0
      checkList.value.forEach((e, i) => {
        if (!e._switchable) return
        backup.value[i]!._visible = e._visible = count < toDisableds
        if (e._visible) {
          e._switchable = false
          // backup.value[i]!._visible = e._visible = true
          count++
        }
      })
    }

    if (props.storeAt) {
      if (props.realtime) config = getPathValue(JSON.parse(localStorage[first]), restKeys)
      checkList.value.forEach((e, i) => {
        isObject(config[e.key])
          ? (config[e.key].visible = e._visible)
          : (config[e.key] = { visible: e._visible })
      })
      save()
      // globalUser.saveConfig(configPath)
    }
    emitModel()
    emit('change', backup.value)
  }
})

// methods

function checkValid() {
  const showns = checkList.value.filter((e) => e._visible)
  // 达到最小可见列数时禁止切换
  if (showns.length <= props.minVisible) {
    showns.forEach((e) => {
      e._switchable = false
    })
    return
  }
  showns.forEach((e) => {
    if (e.initSwitchable && !e._switchable) e._switchable = true
  })
}

function change(item: Obj, index: number) {
  // console.log(item.key, item._visible);
  backup.value[index]!._visible = item._visible
  if (props.storeAt) {
    if (props.realtime) config = getPathValue(JSON.parse(localStorage[first]), restKeys)
    isObject(config[item.key])
      ? (config[item.key].visible = item._visible)
      : (config[item.key] = { visible: item._visible })
    save()
    // setTimeout(() => {
    //   globalUser.saveConfig(configPath)
    // })
  }
  emitModel()
  checkValid()
  emit('change', backup.value[index]!)
}

// let toToggle: ReturnType<typeof setTimeout> | null;
// function toggle(open: boolean) {
//   clearTimeout(toToggle!);
//   toToggle = setTimeout(() => {
//     // console.log("toggle");
//     visible.value = open;
//     toToggle = null;
//   }, 200);
// }

function setColumns(init?: boolean) {
  if (!init && props.storeAt && props.realtime)
    config = getPathValue(JSON.parse(localStorage[first]), restKeys)
  ;(initial[props.cacheId!]?.cols || props.modelValue).forEach((e: Obj) => {
    if (!e.hasOwnProperty('_visible')) {
      e._visible = props.storeAt ? config[e.prop] == undefined || config[e.prop].visible : true
    }
    if (!e.hasOwnProperty('_switchable')) {
      e._switchable = true
    }
    backup.value.push(e)
    checkList.value.push({
      label: e.label || '',
      key: e.prop,
      initSwitchable: e._switchable,
      _switchable: e._switchable,
      _visible: e._visible
    })
  })
  checkValid()
  emitModel()
}

let flag: true | null
function emitModel() {
  if (props.cacheId != null) {
    initial[props.cacheId].flag = true
    setTimeout(() => {
      initial[props.cacheId!].flag = null
    })
  }
  flag = true
  setTimeout(() => {
    flag = null
  })
  emit(
    'update:modelValue',
    backup.value.filter((e) => e._visible)
  )
}

onMounted(() => {
  if (props.cacheId != null) {
    initial[props.cacheId]
      ? initial[props.cacheId].all++
      : (initial[props.cacheId] = { cols: props.modelValue, all: 1 })
    onBeforeUnmount(() => {
      // 组件卸载后将initial中对应“同类组件”数量减1，减完若为0则可以清除 initial[props.cacheId]
      if (initial[props.cacheId!] && --initial[props.cacheId!].all < 1) {
        delete initial[props.cacheId!]
      }
    })
  }
  setColumns(true)
})

// watch
watch(
  () => props.modelValue,
  (val) => {
    if (flag) return
    if (initial[props.cacheId!] && !initial[props.cacheId!].flag) {
      initial[props.cacheId!].cols = val
    }
    backup.value = []
    checkList.value = []
    setColumns()
  }
)
</script>

<style lang="scss">
@use '@/styles/ToggleColumn.scss';
</style>
