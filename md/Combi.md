## Combi

类似iview Input[append prepend]的组合框

```vue
<template>
  <Combi>
    <template #prepend>
      <el-select clearable style="width: 4em">
        <el-option value="111">111</el-option>
        <el-option value="222">222</el-option>
      </el-select>
    </template>
    <el-select clearable>
      <el-option value="2">2</el-option>
    </el-select>
    <template #append>
      <el-icon><DArrowRight /></el-icon>
    </template>
  </Combi>
</template>
```

## props

`prepend` _String_  
前置文本

`append` _String_  
后置文本

## slots

`default()`

`prepend()`  
前置内容

`append()`  
后置内容
