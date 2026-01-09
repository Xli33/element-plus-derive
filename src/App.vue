<template>
  <el-card title="AllCheckbox" class="block">
    <AllCheckbox v-model="allCheckeds" v-model:all="allCheck" :list="allCheckedList"></AllCheckbox>
    <AllCheckbox v-model="allCheckeds" :list="allCheckedList">
      <template #default="{ item }">
        <DD>
          <del>{{ item }}</del>
        </DD>
      </template>
      <!-- <DD #default="item">{{ item }}</DD> -->
    </AllCheckbox>
    <p>
      值：{{ allCheckeds }} <span style="margin-left: 16px">whole: {{ allCheck }}</span>
    </p>
  </el-card>
  <el-card title="Combi" class="block">
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
  <el-card title="RemoteSelect" class="block">
    <el-space>
      <RemoteSelect
        v-model="selectModel"
        v-model:list="selectLists"
        :method="getList"
        filterable
        clearable
        style="width: 200px">
      </RemoteSelect>
      <RemoteSelect :model-value="selectModel" :list="selectLists" textMode></RemoteSelect>
      <RemoteSelect
        :method="getList"
        multiple
        all
        @change="$message.info(JSON.stringify($event))"></RemoteSelect>
      值：{{ selectModel }}
    </el-space>
  </el-card>
  <el-card title="CacheSelect" class="block">
    <el-space>
      <CacheSelect
        v-model="selectModel"
        v-model:list="selectList"
        :method="getList"
        filterable
        style="width: 200px"
        @change="$message.info($event || '')"
        @load="(e) => console.log(e)">
      </CacheSelect>
      <CacheSelect :model-value="selectModel" :list="selectList" textMode></CacheSelect>
      <CacheSelect
        v-if="toggle === 'T'"
        v-model:list="selectList"
        v-model="selectModel"
        :method="getList"
        filterable
        style="width: 220px"
        @load="(e) => console.log(e)">
      </CacheSelect>
      值：{{ selectModel }}
    </el-space>
  </el-card>
  <el-card title="CurdTable" class="block">
    <ToggleColumn v-for="n in colNum" :key="n" v-model="columns" cache-id="app"></ToggleColumn>
    <el-table :data="table.list" style="margin-bottom: 20px">
      <ElColumn :columns="columns">
        <template #num="{ $index }">
          <el-input v-model.trim="table.list[$index]!.num"></el-input>
        </template>
      </ElColumn>
    </el-table>
    <CurdTable
      v-model="table.list"
      :columns="columns"
      size="small"
      :action-width="150"
      :add-row="table.add"
      loading>
      <template #num="{ $index }">
        <el-input v-model.trim="table.list[$index]!.num"></el-input>
      </template>
      <template #moreAction="{ row }">
        <el-button size="small">查看 {{ row.age }}</el-button>
      </template>
    </CurdTable>
  </el-card>
  <el-card title="ModalFooter" class="block">
    <el-button @click="modal.show = true">show Modal</el-button>
    <el-dialog v-model="modal.show" title="modal footer">
      <el-table>
        <ElColumn :columns="table.columns"> </ElColumn>
      </el-table>
      <template #footer>
        <ModalFooter
          v-model="modal.show"
          :ok-loading="modal.loading"
          @ok="confirm"
          @cancel="$message.info('cancel')">
        </ModalFooter>
      </template>
    </el-dialog>
  </el-card>
  <el-card title="PageTable" class="block">
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
          stripe>
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
  <el-card title="MCalendar" class="block">
    <MCalendar
      v-model:range="calendar.range"
      has-range
      style="text-align: left"
      @click-day="
        (...args: []) => {
          console.log('clickDay', args)
        }
      "
      @dblclick-day="(...args:[]) => console.log('dblclickDay', args)"
      @select-range="(...args:[]) => console.log('select-range', args)">
      <template #cell="{ day }"> <el-badge status="success"></el-badge>{{ day._text }} </template>
    </MCalendar>
  </el-card>
</template>

<script lang="tsx">
import { onMounted, reactive, ref, shallowReactive, shallowRef, useTemplateRef } from 'vue'
import {
  AllCheckbox,
  Combi,
  CacheSelect,
  RemoteSelect,
  CurdTable,
  MCalendar,
  ModalFooter,
  PageTable,
  ToggleColumn,
  ElColumn
} from './index'
import type { Obj } from './type'
// import { i18n } from './i18n'

export default {
  components: {
    DD: {
      // name: 'DD',
      setup(props, { slots }) {
        return () => <ins>{slots.default!()}</ins>
      }
    }
  }
}
</script>

<script setup lang="tsx">
// const { t } = useI18n()
// const locale = ref('zh-CN')

const toggle = ref('F')
const allCheckeds = shallowRef(['1', '3']),
  allCheck = ref(),
  allCheckedList = Object.entries({
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
  })
const selectModel = ref(''),
  selectList = ref([]),
  selectLists = ref([])
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
const columns = shallowRef(genCols()),
  colNum = ref(2)
console.log(columns)

const calendar = shallowReactive({
  range: [
    { _date: new Date(Date.now() - 86400000 * 7) },
    { _date: new Date(Date.now() - 86400000) }
  ]
})

const modal = shallowReactive({
  show: false,
  loading: false
})
const refPageTable = useTemplateRef('pageTableRef')
const getBareTableList = () =>
  new Array(50).fill(0).map((e, i) => JSON.parse(JSON.stringify(table.list[i % 2]!)))
const pageTable = reactive({
  loading: false,
  selection: [],
  list: getBareTableList()
})

const getList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        allCheckedList.map((e) => ({
          value: e[0],
          label: e[1]
        }))
      )
    }, 1000)
  })
}

const confirm = () => {
  modal.loading = true
  setTimeout(() => {
    modal.show = false
    setTimeout(() => {
      modal.loading = false
    }, 200)
  }, 1000)
}

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

<style lang="scss">
body {
  margin: 1vw;
  text-align: center;
}

.el-card__header p {
  vertical-align: top;

  > span {
    vertical-align: middle;
  }
}

.el-select-dropdown {
  max-height: 320px;
}

.block {
  margin: 10px;
}

.el-table--small {
  font-size: 14px;

  .el-table__cell {
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
