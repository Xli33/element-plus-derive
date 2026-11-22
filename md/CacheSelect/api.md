## props

除以下prop，可传递RemoteSelect与Select的其它prop

`modelValue` _String | Array | Number_  
v-model双向绑定选中值

`cache-id` _String_ （default `'list'`）  
缓存的唯一键，当页面上同时用到多个不同数据源的CacheSelect时需传入不同值

## emits

除以下事件，可监听RemoteSelect与Select的其它事件

`load` (list)  
加载数据时触发。`list`：加载的数据

`change` (value)  
更改选中项时触发。`value`：当前选中项

## slots

同RemoteSelect
