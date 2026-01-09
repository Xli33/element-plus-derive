<template>
  <div v-loading="loading" :class="useClass('mcalendar')">
    <el-row>
      <el-col
        v-for="(day, index) in week"
        :key="index"
        :span="4"
        :class="[
          useClass('mcalendar-title'),
          { weekend: offDay.includes(day.order) },
          titleClass && titleClass(day, index)
        ]"
        >{{ day.title }}</el-col
      >
    </el-row>
    <el-row>
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :span="4"
        :class="[
          useClass('mcalendar-cell'),
          item._isToday && useClass('mcalendar-cell_today'),
          { outer: item._isOuter },
          { 'range-start': item === rangeStart },
          { 'in-range': item._inRange },
          { 'range-end': item === rangeEnd },
          dateClass && dateClass(item, index),
          item.className
        ]"
        @click="selectDate(item, index)"
        @dblclick="dblClick(item, index)"
        @mouseenter="hoverDate(item, index)">
        <slot name="cell" :day="item" :index="index">
          {{ item._text }}
        </slot>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
// 日历组件

import type { Obj } from '@/type'
import { type PropType, type Ref, ref, computed, watch, nextTick } from 'vue'
import { dayjs, ElRow, ElCol } from 'element-plus'
import type { Dayjs } from 'dayjs'
import { $i18n } from '@/locale/i18n'
import { useClass } from '@/utils'

export default {
  name: 'MCalendar'
}
</script>

<script setup lang="ts">
export interface MCalendarCell {
  _date: Date
  _text: string
  _isOuter: boolean
  _isToday: boolean
  // _rangeStart: undefined,
  // _rangeEnd: undefined,
  _inRange: boolean | void
  [x: string]: any
}

// const dayjs = getCurrentInstance()!.appContext.config.globalProperties.$Date
// if (!dayjs.prototype.isBetween) dayjs.extend(isBetween)
// defineSlots<{
//   cell({ item, index }: { item: MCalendarCell, index: number }): any
// }>()

const props = defineProps({
  /**
   * 指定日期，默认显示该日期所在月份
   */
  date: Date,
  /**
   * 传入的额外日期数据
   * 组件始终展示一段日期，但业务上有时需要根据返回的一组日期进行渲染，如 [{date:'2000-01-01',xxx:false},{date:'2000-01-02',xxx:true}]
   */
  dates: Array as PropType<Obj[]>,
  /**
   * 周起始日，默认星期一
   */
  startDay: {
    type: Number,
    default: 1,
    validator: (val: number) => val > -1 && val < 7
  },
  /**
   * 休息日，默认周六周日
   *
   * @example [5,6] 休息日变为周五周六
   */
  offDay: {
    type: Array,
    default: () => [6, 0]
  },
  /**
   * 传入dates里日期值对应的key，默认“date”
   */
  dateKey: {
    type: String,
    default: 'date'
  },
  /**
   * 单元格标题class
   */
  titleClass: Function,
  /**
   * 每一天单元格class
   */
  dateClass: Function,
  /**
   * 加载状态
   */
  loading: Boolean,
  /**
   * 单元格日期[格式](https://day.js.org/docs/en/display/format)，默认 YYYY-MM-DD
   */
  textFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  /**
   * 是否将指定date放在第一行，而不是按传统模式将每月1号放在第一行，此时会限定整个42格为起止范围，故可能不会显示完整的某月上下范围
   */
  isOnFirstLine: Boolean,
  /**
   * 是否开启范围选择
   */
  hasRange: Boolean,
  /**
   * 非当前有效时间范围内的日期是否可被选入范围
   */
  outerInRange: Boolean,
  /**
   * 选择一个范围后，再选择时是否先将已选范围清除，即是否可清除已选范围
   */
  clearable: {
    type: Boolean,
    default: true
  },
  /**
   * 已选范围
   *
   * @example [{_date: '2020-01-01'}, {_date: new Date('2020-01-10')}]
   */
  range: Array as PropType<(Obj & { _date: Date | string | number })[]>,
  /**
   * 周标题内容类型，可选mini、short、long
   *
   * @example
   * weekType=mini 对应显示成 一、二、三。。。
   * weekType=short对应显示成 周一、周二、周三。。。
   * weekType=long 对应显示成 星期一、星期二、星期三。。。
   */
  weekType: {
    type: String,
    default: 'mini'
  },
  /**
   * 周一到周日对应的映射，若传入有效对象则以该对象的key显示星期标题
   *
   * @example
   * 周六周日标题会分别显示成 “星期6” 和 “星期天”，忽略对应的翻译文本
   * :weekMap={0: '星期天', 6: '星期6'}   *
   */
  weekMap: {
    type: Object
    // default(props: Obj) {
    //   return [1, 2, 3, 4, 5, 6, 0].reduce((a, b) => Object.assign(a, { [b]: $i18n.t(`MCalendar.${props.weekType}.${b}`) }), {})
    // }
  }
})

const emit = defineEmits<{
  'update:range': [[MCalendarCell | null, MCalendarCell | null]]
  'select-range': [[MCalendarCell | null, MCalendarCell | null], MCalendarCell[]]
  'click-day': [MCalendarCell, number]
  'dblclick-day': [MCalendarCell, number]
}>()

const list = ref<MCalendarCell[]>() as Ref<MCalendarCell[]>,
  rangeStart = ref<MCalendarCell | null>(null),
  rangeEnd = ref<MCalendarCell | null>(null)

// 起始星期（几）
const weekAt = computed(() => {
  let dayStart = Math.floor(props.startDay)
  if (isNaN(dayStart) || dayStart < 0 || dayStart > 6) {
    dayStart = 0
  }
  return dayStart
})

// const weekMap = {
//   1: '一',
//   2: '二',
//   3: '三',
//   4: '四',
//   5: '五',
//   6: '六',
//   0: '日'
// }
// 根据起始星期生成一周
const week = computed(() => {
  let order
  const arr = [],
    max = weekAt.value + 7
  for (let i = weekAt.value; i < max; i++) {
    order = i % 7
    arr.push({
      title: props.weekMap?.[order] || $i18n.t(`mCalendar.${props.weekType}.${order}`),
      order
    })
  }
  return arr
})

// 计算第一格及最后一格对应日期
const getRange = (date?: Date) => {
  let mDate = dayjs(
      date || props.date || (props.dates && props.dates[0] && props.dates[0][props.dateKey])
    ),
    start,
    end,
    firstDay

  if (props.isOnFirstLine) {
    start = mDate
  } else {
    start = mDate.startOf('month')
    end = mDate.endOf('month')
  }
  firstDay = start.day()

  // 若当前开始星期不是星期天且1号是星期天，则需要将星期天值改为7
  if (weekAt.value !== 0 && firstDay === 0) {
    firstDay = 7
  }
  mDate = start.subtract(firstDay - weekAt.value, 'day') // 第一格日期
  if (props.isOnFirstLine) {
    end = mDate.add(41, 'day')
  }

  return {
    beginDate: mDate.format('YYYY-MM-DD'),
    endDate: end?.format('YYYY-MM-DD'),
    extra: [mDate, props.isOnFirstLine ? mDate : start, end] as const
  }
}

// 根据日期渲染对应月份
const renderByDate = () => {
  if (props.hasRange) {
    rangeStart.value = rangeEnd.value = null
  }
  const {
    extra: [mDate, start, end]
  } = getRange()
  const dates = props.dates?.[0]
      ? props.dates.slice() /* 若props.dates是reactive，则slice结果是跳过proxy的裸数组 */
      : [],
    now = new Date()
  let i, eachDay: Dayjs, sameDate

  list.value = []
  for (i = 0; i < 42; i++) {
    eachDay = mDate.add(i, 'day')
    sameDate = dates.find((d) => eachDay.isSame(d[props.dateKey], 'day'))
    list.value.push({
      _date: eachDay.toDate(),
      _text: eachDay.format(props.textFormat),
      _isOuter: eachDay.isBefore(start, 'day') || eachDay.isAfter(end, 'day'), //!eachDay.isBetween(start, end, 'day', '[]'),
      _isToday: eachDay.isSame(now, 'day'),
      // _rangeStart: undefined,
      // _rangeEnd: undefined,
      _inRange: undefined,
      ...sameDate
    })
  }
}

let flag: true | null
const selectDate = (item: MCalendarCell, index: number) => {
  // console.log(item, index);
  const selectionChanged = props.hasRange && (!item._isOuter || props.outerInRange)
  if (selectionChanged) {
    // 选择开头
    if (!rangeStart.value) {
      rangeStart.value = item
      item._inRange = true
    } else if (!rangeEnd.value) {
      // 选择结尾
      if (item._date < rangeStart.value._date) {
        const temp = rangeStart.value
        rangeStart.value = item
        item = temp
      }
      rangeEnd.value = item
      item._inRange = true
    } else {
      // 选过范围则重置选择状态
      rangeStart.value = rangeEnd.value = null
      list.value.forEach((e) => {
        e._inRange = false
      })
      if (!props.clearable) {
        rangeStart.value = item
      }
    }
  }
  emit('click-day', item, index)
  if (selectionChanged) {
    flag = true
    nextTick(() => {
      flag = null
    })
    emit('update:range', [rangeStart.value, rangeEnd.value])
    emit(
      'select-range',
      [rangeStart.value, rangeEnd.value!],
      list.value.slice(
        list.value.indexOf(rangeStart.value!),
        list.value.indexOf(rangeEnd.value!) + 1
      )
    )
  }
}
// 双击某天
const dblClick = (item: MCalendarCell, index: number) => {
  // console.log(item, index);
  emit('dblclick-day', item, index)
}
// hover事件
const hoverDate = (item: Obj, index: number) => {
  if (
    !props.hasRange ||
    !rangeStart.value ||
    rangeEnd.value ||
    (item._isOuter && !props.outerInRange)
  )
    return
  let /* each, */ startIndex = list.value.indexOf(rangeStart.value)
  if (index < startIndex) {
    const temp = startIndex
    startIndex = index
    index = temp
  }
  list.value.forEach((e, i) => {
    // each = dayjs(e._date);
    e._inRange = i >= startIndex && i <= index
    // e._inRange = each.isSameOrAfter(rangeStart.value, 'day') && each.isSameOrBefore(rangeEnd.value, 'day')
  })
}

// 设置range
const setRange = (val: typeof props.range) => {
  if (!props.hasRange || flag) return
  if (!val || !val.length) {
    rangeStart.value = rangeEnd.value = null
    list.value.forEach((e) => {
      e._inRange = false
    })
    return
  }
  if (!val[0] || !val[1]) return
  if (dayjs(val[0]._date).isAfter(val[1]._date)) {
    const temp = val[1]
    val[1] = val[0]
    val[0] = temp
  }
  const len = list.value.length
  let each,
    // 传入的range可能是当前42格日期之外的时间，故startIndex与endIndex默认值分别为-1 和 len
    // 保证后续的_inRange判断中不会出现startIndex或endIndex是undefined，导致范围中的日期_inRange却是false
    startIndex: number = -1,
    endIndex: number = len
  for (let i = 0; i < len; i++) {
    each = dayjs(list.value[i]!._date)
    if (startIndex < 0 && each.isSame(val[0]._date, 'day')) {
      rangeStart.value = list.value[i]!
      startIndex = i
    }
    if (each.isSame(val[1]._date, 'day')) {
      rangeEnd.value = list.value[i]!
      endIndex = i
      break
    }
  }
  list.value.forEach((e, i) => {
    e._inRange = i >= startIndex && i <= endIndex
  })
}

// 默认生成一次日历
renderByDate()
if (props.range) {
  // 传入的范围可能是在当前42格日期之外，在后续setRange中就获取不到对应的rangeStart & rangeEnd
  // 此时虽然界面上范围是高亮的，但选中某一格日期时不会先清除已有范围（当clearable为true时）
  // 所以这里先直接将传入范围赋值给rangeStart & rangeEnd以避免上述问题，如果范围没有超出的话，setRange内部一定会重新对rangeStart、rangeEnd赋值
  rangeStart.value = props.range[0] as MCalendarCell
  rangeEnd.value = props.range[1] as MCalendarCell
  setRange(props.range)
}

watch(
  () => props.date,
  (val) => {
    !props.dates && val instanceof Date && renderByDate()
  }
)

watch(
  () => props.dates,
  (val) => {
    val && renderByDate()
  }
)

watch(
  () => props.startDay,
  () => {
    renderByDate()
  }
)

watch(() => props.range, setRange)
</script>

<style lang="scss">
@use '@/styles/MCalendar.scss';
</style>
