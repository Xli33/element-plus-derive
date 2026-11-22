## props

除以下内容，可传递其它el-table的prop

`modelValue` _Array_ （default `[]`）  
v-model双向绑定列表数据

`columns` _Array_ （default `[]`）  
iview Table columns

`disabled` _Boolean_  
隐藏控制列

`addable` _Boolean_ （default `true`）  
可否增加数据

`action-width` _Number_ （default `90`）  
控制列宽度

`action-align` _String_ （default `'center'`）  
控制列水平对齐

`action-fixed` _String_  
控制列是否固定

`action-text` _String_  
控制列表头文本

`action-col` _Object_  
右侧控制列

`add-row` _Function_ （default `() => []`）  
新增行时需要添加的数据

`border` _Boolean_  
Table的border

`size` _String_  
Table的size

`before-add` _Function_  
控制何时新增数据，签名：`(done) => void`，调用done()即执行新增

`before-remove` _Function_  
控制何时删除数据，签名：`(row, index, done) => void`，调用done(index)即执行删除指定index项

`add-btn-type` _String_ （default `'default'`）  
新增按钮type

`add-btn-size` _String_  
新增按钮size

`add-btn-ghost` _Boolean_ （default `false`）  
新增按钮的ghost

`add-btn-disabled` _Boolean_  
新增按钮的disabled

`add-btn` _Object_  
传给新增Button的prop

`del-btn-type` _String_ （default `'warning'`）  
删除按钮type

`del-btn-size` _String_ （default `'small'`）  
删除按钮size

`del-btn-ghost` _Boolean_ （default `true`）  
删除按钮的ghost

`del-btn` _Object_  
传给删除按钮的prop

`add-text` _String_  
新增按钮文本

`hide-del-btn` _Function_  
是否隐藏每行的删除按钮，通过函数返回值决定

`del-btn-disabled` _Function_ （default `() => false`）  
是否禁用每行删除按钮，通过函数返回值决定

## emits

`add` (row)  
新增后触发。`row`：新增的行

`remove` (row)  
删除后触发。`row`：删除的行

`change` (isAdd)  
增加或删除后触发。`isAdd`：是否新增了数据

## slots

`columns`  
直接传递 `<el-table-column>`

`[name]({row, index})`  
通过数组配置传递动态slot，对应列的插槽名，需要列配置中指定slot。e.g. `[{ slot: 'name' }]`

`moreAction({ row, index })`  
每行删除按钮旁的更多内容。`row`：行，`index`：索引
