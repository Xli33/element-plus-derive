<template>
  <el-card header="Combi" class="block">
    <el-space style="margin-bottom: 10px">
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
        <el-select model-value="2" clearable style="width: 80px">
          <el-option value="2">2</el-option>
        </el-select>
      </Combi>
      <Combi>
        <template #prepend>
          <el-select clearable style="width: 4em">
            <el-option value="111">111</el-option>
            <el-option value="222">222</el-option>
          </el-select>
        </template>
        <el-input-number></el-input-number>
        <template #append>
          <el-select model-value="2" clearable style="width: 4em">
            <el-option value="2">2</el-option>
          </el-select>
        </template>
      </Combi>
    </el-space>

    <el-space>
      <Combi>
        <template #prepend>
          <el-select clearable style="width: 4em">
            <el-option value="111">111</el-option>
            <el-option value="222">222</el-option>
          </el-select>
        </template>
        <el-date-picker />
      </Combi>
      <Combi>
        <el-date-picker />
        <template #append>
          <el-select clearable style="width: 4em">
            <el-option value="111">111</el-option>
            <el-option value="222">222</el-option>
          </el-select>
        </template>
      </Combi>
      <Combi>
        <el-date-picker />
        <template #append>
          <el-input placeholder="请输入" />
        </template>
      </Combi>
      <Combi>
        <el-date-picker />
        <template #append>
          <el-button>按钮</el-button>
        </template>
      </Combi>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { Combi } from '@/index'
</script>
