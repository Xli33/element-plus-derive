<template>
  <el-card header="RemoteSelect" class="block">
    <el-space>
      <EpdRemoteSelect
        v-model="selectModel"
        v-model:list="selectLists"
        :method="getList"
        filterable
        clearable
        style="width: 200px">
      </EpdRemoteSelect>
      <EpdRemoteSelect :model-value="selectModel" :list="selectLists" textMode></EpdRemoteSelect>
      <EpdRemoteSelect
        :method="getList"
        multiple
        all
        @change="$message.info(JSON.stringify($event))"></EpdRemoteSelect>
      值：{{ selectModel }}
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EpdRemoteSelect } from '@/index'

const selectModel = ref(''),
  selectLists = ref([])

const getList = () =>
  new Promise((r) => {
    setTimeout(() => {
      r([
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ])
    }, 1000)
  })
</script>
