<template>
  <el-card header="PageTable" class="block">
    <el-row align="bottom" :gutter="10">
      <el-col :span="12">
        <PageTable
          ref="pageTableRef"
          v-model:selection="pageTable.selection"
          v-model:loading="pageTable.loading"
          :columns="table.columns"
          :method="getPageList"
          data-key="ress"
          total-key="total"
          click-to-check
          :max-height="400"
          show-header
          border
          stripe
          @header-dragend="
            (newWidth: any, oldWidth: any, column: { property: string }, event: any) => {
              console.log('header-dragend', newWidth, oldWidth, column, event)
              ;(table.columns.find((e) => e.prop === column.property) as Obj)!.width = newWidth
            }
          ">
          <template #num="{ column }">
            {{ column.title }}
          </template>
        </PageTable>
      </el-col>
      <el-col :span="12">
        <PageTable
          v-model="pageTable.list"
          :columns="table.columns"
          is-local
          :max-height="400"
          border
          style="margin-bottom: 15px" />
      </el-col>
      <el-col :span="12">
        <PageTable v-model="pageTable.list" :columns="table.columns" is-local :max-height="400" />
      </el-col>
      <el-col :span="12">
        <PageTable
          v-model="pageTable.list"
          :columns="table.columns"
          is-local
          :max-height="400"
          show-header
          fullscreen />
      </el-col>
    </el-row>
    <el-tag v-for="(item, index) in pageTable.selection" :key="index">{{ item }}</el-tag>
  </el-card>
</template>

<script setup lang="ts">
import type { Obj } from '@/type'
import { onMounted, reactive, useTemplateRef } from 'vue'
import { PageTable } from '@/index'

const table = {
  columns: [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      label: 'num',
      prop: 'num',
      slot: 'num'
    },
    {
      label: 'emoji',
      prop: 'emoji'
    },
    {
      label: 'exp',
      prop: 'exp'
    },
    {
      label: 'time',
      prop: 'time'
    }
  ],
  list: [
    {
      emoji: '😶‍🌫️🤨😐',
      exp: 'ԅ(¯﹃¯ԅ)',
      num: Math.random(),
      time: new Date().toLocaleString()
    },
    {
      emoji: '😠😪',
      exp: 'ヾ(•ω•`)o',
      num: Math.random(),
      time: new Date().toLocaleString()
    }
  ]
}
const refPageTable = useTemplateRef('pageTableRef')
const getBareTableList = () =>
  new Array(50).fill(0).map((e, i) => JSON.parse(JSON.stringify(table.list[i % 2]!)))
const pageTable = reactive({
  loading: false,
  selection: [],
  list: getBareTableList()
})

const getPageList = () =>
  new Promise((r) => {
    setTimeout(() => {
      r({
        ress: getBareTableList(),
        total: 50
      })
    }, 1000)
  })

onMounted(() => {
  refPageTable.value!.search()
})
</script>
