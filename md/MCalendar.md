## MCalendar

月度日历组件

```vue
<template>
  <MCalendar v-model:range="calendar.range" :date="calendar.date" has-range>
    <template #cell="{ day }"> <Badge status="success"></Badge>{{ day._text }} </template>
  </MCalendar>
</template>
<script setup>
import { shallowReactive } from 'vue'

const caledar = shallowReactive({
  range: [
    { _date: new Date(Date.now() - 86400000 * 7) },
    { _date: new Date(Date.now() - 86400000) }
  ],
  date: new Date('2000-01-01')
})
</script>
```

## props

`date` _Date_  
指定日期，默认显示该日期所在月份

`dates` _Array_  
传入的额外日期数据。
组件始终展示一段日期，但业务上有时需要根据返回的一组日期进行渲染，如 `[{date:'2000-01-01',xxx:false},{date:'2000-01-02',xxx:true}]`

`start-day` _Number_ （default `1`）  
周起始日，默认星期一

`off-day` _Array_ （default `[6, 0]`）  
休息日，默认周六周日

`date-key` _String_ （default `'date'`）  
传入dates里日期值对应的key

`title-class` _Function_  
单元格标题class

`date-class` _Function_  
每一天单元格class

`loading` _Boolean_  
加载状态

`text-format` _String_ （default `'YYYY-MM-DD'`）  
单元格日期[格式](https://day.js.org/docs/en/display/format)

`is-on-first-line` _Boolean_  
是否将指定date放在第一行，而不是按传统模式将每月1号放在第一行，此时可能不会显示完整的单一月份

`has-range` _Boolean_  
是否开启范围选择

`outer-in-range` _Boolean_  
非当前有效时间范围内的日期是否可被选入范围

`clearable` _Boolean_ （default `true`）  
选择一个范围后，再选择时是否先将已选范围清除，即是否可清除已选范围

`range` _Array_  
已选范围。

`week-type` _String_ （default `'mini'`）  
周标题内容类型，可选mini、short、long

- `week-type='mini'` 对应显示成 一、二、三。。。
- `week-type='short'` 对应显示成 周一、周二、周三。。。
- `week-type='long'` 对应显示成 星期一、星期二、星期三。。。

`week-map` _Object_  
周一到周日对应的映射，若传入有效对象则以该对象的key显示星期标题

```jsx
周六周日标题会分别显示成 “星期6” 和 “星期天”，忽略对应的翻译文本
:week-map="{0: '星期天', 6: '星期6'}"
```

## emits

`click-day` (item, index)  
点击日期单元格触发。`item`: 点中日期单元

`select-range` ([begin, end], ranged)  
选择范围后触发。`begin`：范围开始，`end`：范围结束，`ranged`：包含起止范围的所有日期

`dblclick-day` (item, index)  
双击日期单元格触发。`item`: 点中日期单元

## slots

`cell({ item, index })`  
单元格内容。`item`: 单个日期
