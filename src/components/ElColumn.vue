<script lang="tsx">
// 支持通过数组形式使用el-table-column

import type { Obj } from '@/type'
import type { PropType } from 'vue'
import { ElTableColumn } from 'element-plus'

// type ColumnScope = {
//   row: Obj;
//   column: Obj;
//   $index: number;
//   store: Obj;
// };

let validAttr: ((originCol: Obj) => Obj) | null = null
let renderColumn: ((col: Obj, slots: any) => any) | null = null

let initOnce: null | (() => void) = () => {
  initOnce = null

  validAttr = (originCol: Obj) => {
    const attr = { ...originCol }
    delete attr.children
    delete attr.render
    delete attr.slot
    delete attr.renderHeader
    delete attr.headerSlot
    return attr
  }

  renderColumn = (col: Obj, slots: any) => (
    <ElTableColumn {...validAttr!(col)}>
      {{
        header: col.renderHeader || (col.headerSlot && slots[col.headerSlot]),
        default: (scope: any) =>
          Array.isArray(col.children) && col.children.length > 0
            ? col.children.map((e) => renderColumn!(e, slots))
            : col.render?.(scope) || slots[col.slot]?.(scope)
      }}
    </ElTableColumn>
  )
}

export default {
  name: 'ElColumn',
  props: {
    columns: {
      type: Array as PropType<Obj[]>,
      default: () => []
    }
  },
  setup(props, { slots }) {
    // 首次实例化时初始化辅助函数
    initOnce?.()

    return () => props.columns.map((e) => renderColumn!(e, slots))
  }
}
</script>
