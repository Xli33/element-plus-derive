## props

`modelValue` _Array_  
v-model双向绑定Table列

`icon` _Object_  
element-plus图标组件，默认展示`<Menu>`

`cache-id` _String | Number_  
绑定columns对应的唯一标识，一般在v-for中绑定了固定某列且列配置中带有 `_visible:false` 时用到

`all` _Boolean_ （default `true`）  
是否显示全选框

`transfer` _Boolean_  
el-dropdown的teleported

`store-at` _String_  
将状态缓存至localStorage中的key，支持a.b形式  
如`store-at='app.main.cols'`，组件会尝试将显示状态读写至 localStorage.app.main.cols

## emits

`change` (value)  
切换列状态时触发。`value`: 切换的列

## slots

`default()`  
替换默认显示的Button
