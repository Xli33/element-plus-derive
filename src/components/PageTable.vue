<template>
  <div
    ref="elRef"
    :class="[
      useClass('page-table-container'),
      border && showHeader && useClass('page-table-bordered'),
      maximized && useClass('page-table-maximized'),
      maximized && fullscreen && useClass('page-table-fullscreen')
    ]">
    <el-row
      v-if="showHeader"
      justify="space-between"
      align="middle"
      :class="useClass('page-table-header')">
      <div>
        <slot name="title">
          <h1 :class="useClass('page-table-header-title')">
            {{ title ?? $i18n.t('pageTable.title') }}
          </h1>
        </slot>
      </div>
      <div>
        <slot name="headerAction"></slot>
        <el-tooltip
          placement="top"
          :content="$i18n.t('pageTable.reload')"
          :teleported="isTransfer"
          :showArrow="false">
          <el-icon :size="20" :class="useClass('page-table-action')" @click="reload">
            <RefreshRight />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          v-model:visible="showMinMaxTip"
          placement="top"
          :content="$i18n.t(`pageTable.${maximized ? 'restore' : 'maxmize'}`)"
          :teleported="isTransfer"
          :showArrow="false">
          <el-icon :size="20" :class="useClass('page-table-action')" @click="changeFullscreen">
            <component :is="maximized ? ScaleToOriginal : FullScreen" />
          </el-icon>
        </el-tooltip>
        <ToggleColumn
          v-if="tableColumns.length"
          v-model="tableColumns"
          size="20"
          :teleported="isTransfer"
          :store-at="storeAt"
          @change="$emit('change-col', $event)">
          <el-icon :size="20">
            <Setting />
          </el-icon>
        </ToggleColumn>
        <slot name="headerActionEnd"></slot>
      </div>
    </el-row>
    <div :class="useClass('page-table-list')">
      <el-table
        ref="tableRef"
        v-bind="omitOwnKeys($attrs, ['style', 'class', 'id'])"
        v-loading="loading"
        :border="border"
        :data="table.data"
        :height="table.height"
        :max-height="table.maxHeight">
        <!-- @row-click="clickRow" -->
        <ElColumn v-if="tableColumns.length" :columns="tableColumns">
          <template v-for="item in slotColumns" #[item.slot]="params">
            <slot :name="item.slot" v-bind="params"></slot>
          </template>
        </ElColumn>
        <slot v-else name="columns"></slot>
      </el-table>
      <el-pagination
        ref="pageRef"
        v-show="!hidePage"
        v-model:current-page="sizer.curr"
        v-model:page-size="sizer.size"
        :total="sizer.total"
        layout="total, sizes, prev, pager, next, jumper"
        :teleported="isTransfer"
        :page-sizes="pageSizeOpts"
        background
        :class="useClass('page-table-paginator')"
        @current-change="changePage"
        @size-change="changePageSize" />
    </div>
  </div>
</template>

<script lang="tsx">
// 分页表格组件

import type { Obj } from '@/type'
import type { PropType, Ref } from 'vue'
import {
  computed,
  ref,
  reactive,
  watch,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useTemplateRef
} from 'vue'
import { ElRow, ElTooltip, ElIcon, ElTable, ElPagination } from 'element-plus'
import { RefreshRight, FullScreen, ScaleToOriginal, Setting } from '@element-plus/icons-vue'
import { getPathValue, omitOwnKeys } from 'utils-where'
import { $i18n } from '@/locale/i18n'
import { useClass } from '@/utils'
import ToggleColumn from './ToggleColumn.vue'
import ElColumn from './ElColumn.vue'

export default {
  name: 'PageTable'
  // inheritAttrs: false
}
</script>

<script setup lang="tsx">
const props = defineProps({
  columns: {
    type: Array as PropType<Obj[]>,
    default: () => []
  },
  modelValue: {
    type: Array as PropType<Obj[]>,
    default: () => []
  },
  /**
   * 远程请求方法
   *
   * @example
   * const getResult = () => axios.get('').then(res => res.data)
   * <PageTable :method="getResult" />
   */
  method: Function,
  /**
   * 调用 method 时传入的参数或者返回参数的函数
   */
  param: [Object, Function],
  /**
   * 返回值中对应的列表数据key
   *
   * @example 如返回结构是 { result: [1,2,3], total: 100 }，则dataKey='result'
   */
  dataKey: String,
  /**
   * 返回值中对应的分页总条数key
   *
   * @example 如返回结构是 { result: [1,2,3], total: 100 }，则totalKey='total'
   */
  totalKey: String,
  /**
   * 请求时传递的分页参数中 first 对应 key
   * 后端分页一般要求指定起始数据索引或者“页码”，以及获取多少条数据
   *
   * @example
   * 如后端接口给定的分页参数是 firstIndex 对应起始索引
   * pageKey='firstIndex'
   */
  pageKey: String,
  /**
   * 请求时传递的分页参数中 size 对应 key
   * 后端分页一般要求指定起始数据索引或者“页码”，以及获取多少条数据
   *
   * @example
   * 如后端接口给定的分页参数是 amount 对应需要获取的条数
   * sizeKey='amount'
   */
  sizeKey: String,
  /**
   * 对象形式传递分页参数映射
   */
  pageMap: {
    type: Object,
    default(props: Obj) {
      return {
        first: props.pageKey,
        pageSize: props.sizeKey
      }
    }
  },
  border: Boolean,
  /**
   * 处理接口返回列表数据的函数
   */
  process: Function,
  // loading: Boolean,
  /**
   * 是否本地分页
   */
  isLocal: Boolean,
  /**
   * 分页条数选项
   */
  pageSizeOpts: {
    type: Array as PropType<number[]>,
    default: () => [30, 50, 100]
  },
  /**
   * 查询失败时不清除之前获取到的结果
   */
  autoRemain: Boolean,
  /**
   * 计算el-table的maxHeight时，el-table距离视口底部的距离
   * @default 45
   */
  bottomDis: {
    type: [Number, String],
    default: 45
  },
  /**
   * 勾选项
   */
  // selection: Array,
  /**
   * 初始分页条数
   */
  initSize: Number,
  /**
   * 远程查询时额外检测的方法
   */
  check: Function,
  /**
   * 查询时是否用页码而不是用当页第一条的索引
   */
  usePageNum: {
    type: Boolean,
    default: true
  },
  /**
   * 是否点击行即更改Checkbox状态
   */
  // clickToCheck: Boolean,
  /**
   * 获取的勾选项是否去除_checked等内部属性
   */
  // pure: Boolean,
  /**
   * head title
   */
  title: String,
  /**
   * 是否显示header
   */
  showHeader: Boolean,
  transfer: {
    type: Boolean,
    default: true
  },
  /**
   * 最大化时是否全屏
   */
  fullscreen: Boolean,
  /**
   * 传至ToggleColumn组件的storeAt
   */
  storeAt: String,
  /**
   * 隐藏分页
   */
  hidePage: Boolean,
  /**
   * 自动设置el-table的maxHeight
   */
  autoMaxHeight: {
    type: Boolean,
    default: true
  },
  /**
   * el-table的maxHeight
   */
  maxHeight: [Number, String],
  /**
   * el-table的height
   */
  height: [Number, String],
  /**
   * 自动设置el-table的height
   */
  autoHeight: Boolean,
  /**
   * 最大化时自动计算哪种高度
   */
  maximizeHeightType: {
    type: String as PropType<'height' | 'maxHeight'>,
    default: 'maxHeight'
  }
})

const emit = defineEmits<{
  'update:modelValue': [val: Obj[]]
  // 'update:selection': [val: Obj[]];
  load: [res: any]
  // 'select-all': [val: Obj[], boolean];
  // 'select-rows': [val: Obj[]];
  // select: [val: Obj, boolean];
  reload: []
  'change-col': [val: Obj[] | Obj]
  'maximize-change': [val: boolean]
}>()

// data

let initHeight: number // 未传入height时自动计算出的height
let initMaxHeight: number // 未传入maxHeight时自动计算出的maxHeight
const loading = defineModel('loading', { type: Boolean }),
  refTable = useTemplateRef<any>('tableRef'),
  refEl = useTemplateRef('elRef'),
  refPage = useTemplateRef<any>('pageRef'),
  maximized = ref(false),
  tableColumns = shallowRef<Obj[]>(props.columns) as Ref<Obj[]>,
  table = reactive({
    data: [] as Obj[],
    height: props.height,
    maxHeight: props.maxHeight
    // selectType: {
    //   align: 'center',
    //   className: 'page-table-mr0',
    //   renderHeader: () => {
    //     const checkableList = table.data.filter(e => e._checkable && !e._disabled),
    //       len = checkableList.length;
    //     return (
    //       table.data.some(e => e._checkable) && (
    //         <ElCheckbox
    //           model-value={!!len && checkableList.every(e => e._checked)}
    //           indeterminate={
    //             !!len &&
    //             !checkableList.every(e => e._checked) &&
    //             checkableList.some(e => e._checked)
    //           }
    //           disabled={!len}
    //           onUpdate:model-value={(val: boolean) => {
    //             checkableList.forEach(e => {
    //               e._checked = val;
    //             });
    //           }}
    //           onChange={(val: any) => {
    //             selectRow();
    //             emit(
    //               'select-all',
    //               !props.pure ? checkableList : checkableList.map(e => pureRow(e)),
    //               val
    //             );
    //           }}
    //         />
    //       )
    //     );
    //   },
    //   render: ({ row, index }: Obj) =>
    //     row._checkable && (
    //       <ElCheckbox
    //         model-value={row._checked}
    //         disabled={row._disabled}
    //         onUpdate:model-value={(val: boolean) => {
    //           checkRow(table.data[index]!, val);
    //         }}
    //       />
    //     )
    // }
  })

const sizer = shallowReactive({
  curr: 1,
  size: props.initSize || props.pageSizeOpts[0]!,
  total: 0
})
const showMinMaxTip = ref(false)

// computed

const isTransfer = computed(() => (maximized.value ? false : props.transfer))

const slotColumns = computed(() => {
  const arr: Obj[] = [],
    findSlot = (col: Obj) => {
      if (col.slot) {
        arr.push(col)
      }
      if (col.children) {
        col.children.forEach((e: Obj) => {
          findSlot(e)
        })
      }
    }
  props.columns.forEach((e: Obj) => {
    findSlot(e)
  })
  return arr
})

// methods

// function makeCols() {
//   const selectType = props.columns.find(e => e.type === 'selection');
//   if (selectType) {
//     const type: Obj = {
//       ...selectType,
//       width: selectType.width || 54,
//       type: undefined,
//       ...table.selectType
//     };
//     tableColumns.value = [type].concat(props.columns.slice(1));
//   } else {
//     tableColumns.value = props.columns;
//   }
// }

let isFromRemote: true | null
let totalChanged: true | null // 总条数是否变化
let isRequesting: true | null // 是否发起请求。loading可由父组件控制，比如默认展示loading状态但实际未发起请求，故需要单独变量判断是否在请求
let reqId: number = 0 // 请求次数id
async function getRemoteData() {
  if (typeof props.method !== 'function') return console.warn("typeof method isn't function")
  if (isRequesting) {
    // 未完成加载又触发新请求，让reqId在Number.MAX_SAFE_INTEGER范围内递增，用于后续与innerReqId比较判断是否为最近一次请求
    reqId = (reqId + 1) % Number.MAX_SAFE_INTEGER
  }
  const innerReqId = reqId
  isRequesting = true
  loading.value = true
  // emit('update:selection', []);
  const res = await props.method(
    Object.assign(getPageParam(), typeof props.param !== 'function' ? props.param : props.param())
  )
  // 当存在重复请求时，即上一次请求未完成又触发了新请求，则reqId会依次递增
  // 若reqId与innerReqId不相等，则说明不是最近一次请求
  if (reqId !== innerReqId) return
  loading.value = false
  isRequesting = null
  // 这里不能将reqId重置为0。假设连续触发2次请求，第1次请求的innerId是0，第2次的是1, 但第2次请求比第1次请求更快完成
  // 此时若重置reqId，则第1次请求结束时，因其innerId与reqId同为0，依旧会通过，导致列表又被第一次的结果覆盖了
  // 所以当存在重复请求时，reqId是保持递增的，若没有重复请求，则reqId维持在上一次请求的值
  // 也就依然需要isRequesting判断是否在重复请求，不能单靠reqId是否大于0判断
  // 当没有重复请求时，reqId应该始终为初始值0，存在重复请求时也只会依次递增
  // reqId = 0;
  if (!res) {
    if (!props.autoRemain) {
      sizer.total = 0
      totalChanged = true
      setTimeout(() => {
        totalChanged = null
      })
      emit('update:modelValue', [])
    }
    return
  }
  // if (typeof props.process === 'function') {
  //   const processed = props.process(res)
  //   if (processed) {
  //     res = processed
  //   }
  // }
  let data = getPathValue(res, props.dataKey!) || []
  // handleData(data);
  if (typeof props.process === 'function') {
    const processed = props.process(data)
    if (Array.isArray(processed)) {
      data = processed
    }
  }
  table.data = data
  sizer.total = getPathValue(res, props.totalKey!) || 0
  isFromRemote = true
  totalChanged = true
  emit('update:modelValue', table.data)
  emit('load', res)
  setTimeout(() => {
    isFromRemote = null
    totalChanged = null
  })
}

// function handleData(data: Obj[]) {
//   props.columns.some(e => e.type === 'selection') &&
//     data.forEach(e => {
//       e._checkable = true; // 是否显示checkbox
//       e._checked = e._disabled = false;
//     });
// }

function getData(isPaging?: boolean) {
  if (typeof props.check === 'function' && !props.check()) return
  !props.isLocal ? getRemoteData() : getLocalData(isPaging)
}

function getLocalData(isPaging?: boolean) {
  let i = isPaging ? sizer.size * (sizer.curr - 1) : 0
  const arr = [],
    temp = i + sizer.size,
    gap = temp > sizer.total ? sizer.total : temp,
    totalList = props.modelValue

  for (; i < gap; i++) {
    // totalList[i]!._checked = totalList[i]!._disabled = false;
    arr.push(totalList[i]!)
  }
  table.data = arr
  // emit('update:selection', []);
}

function changePage() {
  // element-plus的分页组件有bug：总条数改变导致页码变化时，会再次触发currentChange事件
  // 此处通过变量避免重复请求
  !totalChanged && getData(true)
}

function changePageSize(size: number) {
  sizer.size = size
  sizer.curr === 1 && getData()
}

/**
 * 远程查询
 * @param stay 是否留在当前页
 */
function search(stay?: boolean) {
  if (stay !== true) {
    sizer.curr = 1
  }
  nextTick(getRemoteData)
}

// function selectRow(row?: Obj, val?: boolean) {
//   if (row) {
//     row._checked = val;
//   }
//   // console.log(row, val);
//   let selections = table.data.filter((e: Obj) => e._checked);
//   if (props.pure) {
//     selections = selections.map((e: Obj) => pureRow(e));
//   }
//   emit('update:selection', selections);
//   emit('select-rows', selections);
// }

function getHeight() {
  return (
    window.innerHeight -
    +props.bottomDis -
    refTable.value!.$el.getBoundingClientRect().top -
    refPage.value!.$el.offsetHeight
  )
}
/**
 * 设置内部 el-table 的（最大）高度
 * @param isHeight 是否设置`height`，默认`false`：设置`maxHeight`
 */
function setMaxHeight(isHeight?: boolean) {
  nextTick(() => {
    const num = getHeight()
    table[isHeight ? 'height' : 'maxHeight'] = num > 0 ? num : 0
  })
}

function setMaximizeHeight() {
  ;(props.maximizeHeightType === 'height' || props.maximizeHeightType === 'maxHeight') &&
    nextTick(() => {
      const num = getHeight()
      table[props.maximizeHeightType] = num > 0 ? num : 0
    })
}

function getPageParam() {
  return {
    [props.pageMap.first]: !props.usePageNum ? sizer.size * (sizer.curr - 1) : sizer.curr,
    [props.pageMap.pageSize]: sizer.size
  }
}

// let changeByRowClick: true | null;
// function clickRow(row: Obj, index: number) {
//   if (!props.clickToCheck || !row._checkable || row._disabled) return;
//   changeByRowClick = true;
//   row = table.data[index]!;
//   // if (!row) return
//   row._checked = !row._checked;
//   selectRow(row, row._checked);
//   emit('select', !props.pure ? row : pureRow(row), row._checked);
//   setTimeout(() => {
//     changeByRowClick = null;
//   });
// }

// 更改行的Checkbox时触发
// function checkRow(row: Obj, val: boolean) {
//   if (changeByRowClick) return;
//   selectRow(row, val);
//   emit('select', !props.pure ? row : pureRow(row), val);
// }

// function pureRow(row: Obj) {
//   const cloned = { ...row };
//   delete cloned._checkable;
//   delete cloned._checked;
//   delete cloned._disabled;
//   // delete cloned._index
//   // delete cloned._rowKey
//   return cloned;
// }

function changeFullscreen() {
  if (props.fullscreen) {
    maximized.value ? document.exitFullscreen() : refEl.value!.requestFullscreen()
    return
  }
  maximized.value = !maximized.value
  showMinMaxTip.value = false
  if (maximized.value) {
    setMaximizeHeight()
    document.body.classList.add('clip')
  } else {
    table.height = props.height ?? initHeight
    table.maxHeight = props.maxHeight ?? initMaxHeight
    document.body.classList.remove('clip')
  }
  nextTick(() => {
    emit('maximize-change', maximized.value)
  })
}
function reload() {
  if (!loading.value) props.isLocal ? emit('reload') : search()
}

defineExpose({
  search,
  setMaxHeight,
  table,
  sizer,
  getPage: () => ({
    ...getPageParam(),
    curr: sizer.curr,
    total: sizer.total
  })
})

// created
// makeCols();
// sizer.size = props.initSize || props.pageSizeOpts[0]!;

onMounted(() => {
  if (!props.maxHeight && !props.height && (props.autoMaxHeight || props.autoHeight)) {
    setMaxHeight(props.autoHeight)
    nextTick(() => {
      initMaxHeight = table.maxHeight as number
      initHeight = table.height as number
    })
  }
  if (props.fullscreen) {
    refEl.value!.onfullscreenchange = () => {
      maximized.value = !!document.fullscreenElement
      if (maximized.value) {
        setTimeout(setMaximizeHeight)
      } else {
        table.height = props.height ?? initHeight
        table.maxHeight = props.maxHeight ?? initMaxHeight
      }
      setTimeout(() => {
        emit('maximize-change', maximized.value)
      })
    }
  }
})

onBeforeUnmount(() => {
  refEl.value!.onfullscreenchange = null
})

watch(
  () => props.modelValue,
  (val) => {
    const data = Array.isArray(val) ? val : []
    if (props.isLocal) {
      sizer.curr = 1
      sizer.total = data.length
      // handleData(data);
      getLocalData()
      return
    }
    if (!isFromRemote) {
      sizer.curr = 1
      sizer.total = data.length
      table.data = data
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.maxHeight,
  (val) => {
    table.maxHeight = val
  }
)
watch(
  () => props.height,
  (val) => {
    table.height = val
  }
)

watch(
  () => props.columns,
  (val) => {
    tableColumns.value = val
  }
)
</script>

<style lang="scss">
@use '@/styles/PageTable.scss';
</style>
