#### 基本用法

```vue
<template>
  <Combi>
    <template #prepend>
      <el-select clearable style="width: 7em">
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
<script>
export default {}
</script>
```

#### 使用文本

```vue
<template>
  <Combi prepend="在前" append="在后">
    <el-date-picker clearable></el-date-picker>
  </Combi>
</template>
<script>
export default {}
</script>
```
