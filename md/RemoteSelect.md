# RemoteSelect

远程Select

```html
<template>
  <RemoteSelect
    v-model="selectModel"
    :method="getList"
    filterable
    style="width: 200px"
    @on-change="$Message.info($event)"></RemoteSelect>
</template>
<script setup>
  import { ref } from 'vue'

  const selectModel = ref(''),
    getList = () => new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {value: 'a', label: '一'}
                {value: 'b', label: '二'}
                {value: 'c', label: '三'}
            ])
        }, 2000)
    })
</script>
```

## props

除以下prop，可传递el-select的其它prop，如filterable

`modelValue` _String | Array | Number_  
v-model双向绑定选中值

`list` _Array_  
可通过v-model:list双向绑定选项列表

`multiple` _Boolean_  
是否多选

`value-as-key` _Boolean_  
是否将选项的value作为Option的key，默认以v-for的index作为key

`value-key` _String_ （default `'value'`）  
选项对应value的key

`label-key` _String_ （default `'label'`）  
选项对应文本的key

`key-map` _Object_  
同时设置 valueKey 与 labelKey，优先级更高

`method` _Function_  
查询数据的函数/方法，结果为Falsy则认为请求失败，可返回一个Promise<result>。例如使用axios.get()

`refresh` _Function_  
可通过v-model:refresh获取组件内部的查询方法

`process` _Function_  
处理 method 成功返回后的结果

`param` _Object | Function | String_  
调用method时的参数

`chosen` _Object | Array_  
通过v-model:chosen获取选中对象

`auto-get` _Boolean_  
是否挂载后立即请求，否则在点开时请求

`format-label` _Function_  
修改Option的label，参数分别为：当前项，当前项索引

`check` _Function_  
点开获取数据时根据该函数返回值确定可否发送请求

`text-mode` _Boolean_  
是否仅显示选中项的文本

`text-format` _Function_  
修改当启用textMode时显示的文本，参数：选中项

`parent-code` _String | Array | Number_  
关联值，该值变化后会清空绑定值与选项

```jsx
当 some 变化后，<RemoteSelect>的值与选项都会清空
<select v-model="some">
  <option value="1">1</option>
</select>
<RemoteSelect :parentCode="some" />
```

`option-disabled` _Function_  
用于判断是否禁用每一项Option，参数：当前项，当前项索引

`get-selected` _Function_  
手动处理获取选中项的过程，参数：`{ multiple, keyMap, list, value }`

`cache` _Boolean_  
启用则根据绑定的list判断是否需要在展开时发送请求

`loader` _Function_  
手动获取数据，此时method和param不生效

`strict` _Boolean_  
开启后则展开时仅当parentCode有效才会发送请求

`all` _Boolean_ （default `false`）  
是否使用 `v-el-select:all` 增加一键全选功能，仅多选模式生效

## emits

除以下事件，可监听Select的其它事件，如on-change

`load` (value)  
成功加载数据后触发。`value`: 返回的列表结果，应该是数组

## slots

`default({ item, index })`  
选项显示的内容。`item`: 单个选项，`index`: 选项index

`dropdown({ list })`  
替换`<el-select><el-option /></el-select>`中的整个Option。`list`: 选项数组

`text({ text })`  
textMode对应的文本内容。`text`: 选中项
