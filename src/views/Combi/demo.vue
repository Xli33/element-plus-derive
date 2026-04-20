<template>
  <el-card header="Combi" class="block">
    <el-space>
      <Combi prepend="begin" append="end">
        <el-select clearable>
          <el-option value="aaa">aaaaaaa</el-option>
        </el-select>
      </Combi>
      <Combi>
        <template #append>
          <el-icon><DocumentAdd /></el-icon>
        </template>
        <el-select clearable>
          <el-option value="sss">sssssss</el-option>
        </el-select>
      </Combi>
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
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { Combi } from '@/index'
</script>
