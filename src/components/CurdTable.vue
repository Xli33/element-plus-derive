<template>
  <div>
    <el-table
      v-bind="omitOwnKeys($attrs, ['style', 'class', 'id'])"
      :border="border"
      :data="list"
      :size="size"
      style="z-index: 0">
      <ElColumn v-if="columns.length" :columns="columns">
        <template v-for="item in slotColumns" #[item.slot]="params">
          <slot :name="item.slot" v-bind="params"></slot>
        </template>
      </ElColumn>
      <slot v-else name="columns"></slot>
      <el-table-column
        v-if="!disabled"
        :label="actionText || $i18n.t('curdTable.actionText')"
        :width="actionCol.width"
        :align="actionCol.align"
        :fixed="actionCol.fixed"
        :prop="actionCol.prop">
        <template #default="{ row, $index }">
          <slot name="moreAction" :row="row" :index="$index"></slot>
          <el-button
            v-if="!hideDelBtn || !hideDelBtn(row, $index)"
            :type="delBtnType"
            :size="delBtnSize"
            :ghost="delBtnGhost"
            plain
            v-bind="delBtn"
            :disabled="delBtnDisabled(row, $index)"
            @click="toDel($index)"
            >{{ $i18n.t('curdTable.del') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="!disabled"
      v-show="addable"
      :type="addBtnType"
      :size="addBtnSize"
      :ghost="addBtnGhost"
      :disabled="addBtnDisabled"
      v-bind="addBtn"
      plain
      style="display: block; position: relative; width: 100%; margin-top: -1px"
      @click="toAdd">
      {{ addText ?? $i18n.t('curdTable.addText') }}
    </el-button>
  </div>
</template>

<script lang="ts">
// 增删表格组件

import type { BtnSize, BtnType, Obj } from '@/type'
import { type PropType, computed, ref, watch } from 'vue'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { omitOwnKeys } from 'utils-where'
import ElColumn from './ElColumn.vue'
import { $i18n } from '@/locale/i18n'

export default {
  name: 'CurdTable'
}
</script>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Array as PropType<Obj[]>,
    default: () => []
  },
  /**
   * el-table-column的props
   */
  columns: {
    type: Array as PropType<Obj[]>,
    default: () => []
  },
  /**
   * 是否隐藏控制列
   */
  disabled: Boolean,
  /**
   * 可否增加数据，默认true
   */
  addable: {
    type: Boolean,
    default: true
  },
  /**
   * 控制列宽度，默认90px
   */
  actionWidth: {
    type: Number,
    default: 90
  },
  /**
   * 控制列水平对齐，默认居中
   */
  actionAlign: {
    type: String,
    default: 'center'
  },
  /**
   * 控制列是否固定
   */
  actionFixed: String,
  /**
   * 控制列表头文本
   */
  actionText: String,
  /**
   * 右侧控制列
   */
  actionCol: {
    type: Object,
    default(props: Obj) {
      return {
        // title: props.actionText,
        prop: '_action',
        width: props.actionWidth,
        align: props.actionAlign,
        fixed: props.actionFixed
      }
    }
  },
  /**
   * 新增行时需要添加的数据
   */
  addRow: {
    type: Function,
    default: () => []
  },
  border: Boolean,
  size: String as PropType<'' | 'default' | 'small' | 'large' | undefined>,
  /**
   * 返回Promise以决定何时新增数据
   */
  beforeAdd: Function,
  /**
   * 返回Promise以决定何时删除数据
   */
  beforeRemove: Function,
  addBtnType: {
    type: String as PropType<BtnType>,
    default: 'default'
  },
  addBtnSize: String as PropType<BtnSize>,
  addBtnGhost: {
    type: Boolean,
    default: false
  },
  addBtnDisabled: {
    type: Boolean,
    default(props: Obj) {
      return !props.addable
    }
  },
  addBtn: {
    type: Object,
    default: () => ({})
  },
  delBtnType: {
    type: String as PropType<BtnType>,
    default: 'warning'
  },
  delBtnSize: {
    type: String as PropType<BtnSize>,
    default: 'small'
  },
  delBtnGhost: {
    type: Boolean,
    default: true
  },
  delBtn: {
    type: Object,
    default: () => ({})
  },
  addText: String,
  /**
   * 是否隐藏每行的删除按钮，通过函数返回值决定
   */
  hideDelBtn: Function,
  /**
   * 是否禁用每行删除按钮，通过函数返回值决定
   */
  delBtnDisabled: {
    type: Function,
    default() {
      return false
    }
  }
})

const emit = defineEmits<{
  'update:modelValue': [val: typeof props.modelValue]
  add: [row: Obj]
  remove: [row: Obj]
  /**
   * 增加或删除后触发，由增加触发时参数为true
   */
  change: [isAdd: boolean]
  // (e: 'change', isAdd: boolean):void
}>()

// data

const list = ref(props.modelValue)

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

function toAdd() {
  typeof props.beforeAdd !== 'function' ? add() : props.beforeAdd().then(add).catch()
}
function add(args?: Obj[]) {
  list.value.push(...props.addRow(args))
  emit('update:modelValue', list.value)
  emit('add', list.value[list.value.length - 1]!)
  emit('change', true)
}
function toDel(index: number) {
  typeof props.beforeRemove !== 'function'
    ? del(index)
    : props.beforeRemove(list.value[index], index).then(() => {
        del(index)
      })
}
function del(index: number) {
  const [removed] = list.value.splice(index, 1)
  emit('update:modelValue', list.value)
  emit('remove', removed!)
  emit('change', false)
}

// onMounted(() => {
//   if (props.modelValue && props.modelValue.length) {
//     list.value = props.modelValue
//   }
// })

watch(
  () => props.modelValue,
  (val) => {
    list.value = val
  }
)
</script>
