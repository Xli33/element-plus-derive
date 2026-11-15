<template>
  <el-card header="CacheSelect" class="block">
    <el-space>
      <EpdCacheSelect
        v-model="selectModel"
        v-model:list="selectList"
        :method="getList"
        filterable
        style="width: 200px"
        @change="$message.info($event || '')"
        @load="(e: any) => console.log(e)">
      </EpdCacheSelect>
      <EpdCacheSelect :model-value="selectModel" :list="selectList" textMode></EpdCacheSelect>
      <EpdCacheSelect
        v-model:list="selectList"
        v-model="selectModel"
        :method="getList"
        filterable
        style="width: 220px"
        @load="(e: any) => console.log(e)">
      </EpdCacheSelect>
      值：{{ selectModel }}
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Obj } from '@/type'
import { EpdCacheSelect } from '@/index'

const selectModel = ref(''),
  selectList = ref([])
const list: Obj[] = []
for (let i = 0; i < 26; i++) {
  list.push({
    value: String(i),
    label: String.fromCharCode(97 + i)
  })
}

const getList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(list)
    }, 1000)
  })
}
</script>
