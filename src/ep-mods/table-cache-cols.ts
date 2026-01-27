/**
 * 针对ElTable组件，添加列宽缓存功能
 * 在使用的ElTable组件上指定cache-cols属性以启用
 */
import type { Obj } from '../type'
import { ElTable, type TableColumnCtx } from 'element-plus'
import { deepMerge, getPathValue, makeObjectByPath } from 'utils-where'

// 扩展Crud，添加cacheCols属性
ElTable.props.cacheCols = Object /* {
  type: Object,
  default: () => ({
    keys: '', // 存储路径
    cols: [] // 列配置
  })
} */
const saveColWidth = function (
  this: any,
  newWidth: number,
  oldWidth: number,
  column: TableColumnCtx<Obj> /* event: MouseEvent */
) {
  // console.log('onHeaderDragend', newWidth, oldWidth, column);
  const first = this.cacheCols.keys.split('.')[0],
    targetKey = this.cacheCols.keys.slice(first.length + 1)
  const appData = localStorage.getItem(first)
  const localStore = appData ? JSON.parse(appData) : {}
  let targetObj: Obj = getPathValue(localStore, targetKey)

  if (!targetObj) {
    targetObj = {}
    deepMerge(localStore, makeObjectByPath(targetKey, targetObj))
  }
  if (targetObj[column.property]) {
    targetObj[column.property].width = Math.round(newWidth)
  } else {
    targetObj[column.property] = {
      width: Math.round(newWidth)
    }
  }
  if (this.cacheCols.cols?.length) {
    this.cacheCols.cols.find((e: Obj) => e.prop === column.property).width = Math.round(newWidth)
  }
  setTimeout(() => {
    localStorage.setItem(first, JSON.stringify(localStore))
  })
}

const tableMounted = function (this: any) {
  if (!this.cacheCols?.keys) return
  // 读取列宽配置
  const first = this.cacheCols.keys.split('.')[0],
    targetKey = this.cacheCols.keys.slice(first.length + 1)
  const appData = localStorage.getItem(first)
  const currentData = appData && getPathValue(JSON.parse(appData), targetKey)
  if (!currentData || !Object.keys(currentData).length) return
  this.$nextTick(() => {
    this.columns.forEach((e: Obj) => {
      if (currentData[e.property]?.width) {
        e.realWidth = null
        e.width = currentData[e.property].width
      }
      // Object.assign(e, localStore[e.prop])
    })
  })
}

const tableUpdated = function (this: any) {
  if (!this.cacheCols?.keys) return
  const selfProps = this.$.vnode.props
  if (
    typeof selfProps.onHeaderDragend === 'function' &&
    selfProps.onHeaderDragend.name !== 'bound saveColWidth'
  ) {
    selfProps.onHeaderDragend = [saveColWidth.bind(this), selfProps.onHeaderDragend]
    return
  }
  if (Array.isArray(selfProps.onHeaderDragend)) {
    selfProps.onHeaderDragend.every((e: { name: string }) => e.name !== 'bound saveColWidth') &&
      selfProps.onHeaderDragend.unshift(saveColWidth.bind(this))
    return
  }
  selfProps.onHeaderDragend = saveColWidth.bind(this)
}

if (typeof ElTable.mounted !== 'function') {
  ElTable.mounted = tableMounted
} else {
  const mounted = ElTable.mounted
  ElTable.mounted = function () {
    mounted.call(this)
    tableMounted.call(this)
  }
}

if (typeof ElTable.updated !== 'function') {
  ElTable.updated = tableUpdated
} else {
  const updated = ElTable.updated
  ElTable.updated = function () {
    updated.call(this)
    tableUpdated.call(this)
  }
}
