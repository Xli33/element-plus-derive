<template>
  <el-card header="CurdTable - ElColumn - ToggleColumn" class="block">
    <EpdToggleColumn
      v-for="n in 2"
      :key="n"
      v-model="columns"
      :min-visible="2"
      transfer
      cache-id="app"
      store-at="app.[user.main.list.cols]"
      style="margin-right: 10px; margin-bottom: 10px"></EpdToggleColumn>
    <el-table
      :data="table.list"
      border
      style="margin-bottom: 20px"
      :cache-cols="{ keys: 'app.[user.main.list.cols]', cols: columns }"
      @header-dragend="
        (newWidth: any, oldWidth: any, column: any, event: any) => {
          console.log('header-dragend', newWidth, oldWidth, column, event)
        }
      ">
      <EpdElColumn :columns="columns">
        <template #num="{ $index }">
          <el-input v-model.trim="table.list[$index]!.num"></el-input>
        </template>
      </EpdElColumn>
    </el-table>
    <EpdCurdTable
      v-model="table.list"
      :columns="columns"
      size="small"
      :action-width="150"
      :add-row="table.add"
      border
      :cache-cols="{ keys: 'app.[user.main.list.cols]', cols: columns }"
      loading
      :class="['hahahah', { hahahah2: true }]"
      id="qqq"
      :style="{ color: 'red', fontSize: false && '20px' }"
      data-test="test"
      :before-add="beforeAdd"
      :before-remove="beforeRemove">
      <template #num="{ $index }">
        <el-input v-model.trim="table.list[$index]!.num"></el-input>
      </template>
      <template #moreAction="{ row }">
        <el-button size="small">查看 {{ row.age }}</el-button>
      </template>
    </EpdCurdTable>
  </el-card>
</template>

<script setup lang="tsx">
import { shallowRef } from 'vue'
import type { Obj } from '@/type'
import { ElMessageBox } from 'element-plus'
import { EpdCurdTable, EpdElColumn, EpdToggleColumn } from '@/index'

const genCols = () => [
  {
    label: 'emoji',
    prop: 'emoji',
    type: 'selection',
    _switchable: false
  },
  {
    label: 'exp',
    prop: 'exp'
    // minWidth: 300
  },
  {
    label: 'num',
    prop: 'num',
    slot: 'num',
    // minWidth: 300,
    renderHeader: ({ column }: { column: Obj }) => (
      <>
        {column.title}
        <input
          value={column.title}
          onInput={(e) => (column.title = (e.target as HTMLInputElement).value)}
        />
      </>
    )
  },
  {
    label: 'time',
    prop: 'time'
    // width: 200
  }
]
const table = {
  columns: genCols(),
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
  ],
  add: () => [
    {
      emoji: ' 😏🤤',
      exp: 'Σ(っ °Д °;)っ',
      num: Math.random(),
      time: new Date().toLocaleString()
    }
  ]
}
const columns = shallowRef(genCols())

function beforeAdd(add: any) {
  ElMessageBox.confirm('确定要新增吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      add()
    })
    .catch()
}
function beforeRemove(row: any, index: number, del: any) {
  ElMessageBox.confirm(`确定要删除${row.emoji}吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      del(index)
    })
    .catch()
}
</script>
