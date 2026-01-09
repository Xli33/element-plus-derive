# ElColumn

通过数组形式使用el-table-column

```jsx
<template>
  <el-table :data="tableData" border style="width: 100%">
    <!-- 引入 ElColumn 组件配置列 -->
    <ElColumn :columns="columns">
      <!-- 1. 内容插槽 (slot) 示例 -->
      <!-- 对应 columns 中配置的 slot: 'nameSlot' -->
      <template #nameSlot="{ row }">
        <el-tag type="success">{{ row.name }}</el-tag>
      </template>
      <!-- 2. 表头插槽 (headerSlot) 示例 -->
      <!-- 对应 columns 中配置的 headerSlot: 'customHeader' -->
      <template #customHeader="{ column }">
        <span style="display: flex; align-items: center; color: #409eff">
          <el-icon style="margin-right: 4px"><User /></el-icon>
          {{ column.label }} (Slot)
        </span>
      </template>
    </ElColumn>
  </el-table>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { User, Timer, Edit } from '@element-plus/icons-vue';


const tableData = ref([
  { date: '2024-01-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2024-01-02', name: 'Jack', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2024-01-03', name: 'Alice', address: 'No. 189, Grove St, Los Angeles' }
]);

// 列配置
const columns = [
  // 1. 普通列：直接显示 prop 数据
  {
    prop: 'date',
    label: 'Date',
    width: 180
  },

  // 2. 插槽示例：同时使用 slot 自定义内容 和 headerSlot 自定义表头
  {
    prop: 'name',
    label: 'Name',
    width: 180,
    slot: 'nameSlot', // 对应 <template #nameSlot>
    headerSlot: 'customHeader' // 对应 <template #customHeader>
  },

  // 3. Render 函数示例：使用 JSX/TSX 自定义内容
  {
    prop: 'addr',
    label: 'Address (Render with children)',
    minWidth: 200,
    children: [
      {
        prop: 'addrIcon',
        label: 'icon',
        render: () => (
          <el-icon style="vertical-align: middle">
            <Edit />
          </el-icon>
        )
      },
      {
        prop: 'address',
        label: 'address',
        // render 函数接收 scope 参数: { row, column, $index }
        render: ({ row }: any) => <span style="color: #666;">{row.address}</span>
      }
    ]
  },

  // 4. RenderHeader 示例：使用 JSX/TSX 自定义表头
  {
    label: 'Operations',
    width: 150,
    fixed: 'right',
    // renderHeader 函数接收 scope 参数: { column, $index }
    renderHeader: ({ column }: any) => (
      <div style="color: #f56c6c; font-weight: bold;">
        <el-icon>
          <Timer />
        </el-icon>{' '}
        {column.label}
      </div>
    ),
    // render 函数渲染操作按钮
    render: ({ row }: any) => (
      <ElButton type="primary" link onClick={() => ElMessage.success(`Clicked ${row.name}`)}>
        View
      </ElButton>
    )
  }
];
</script>
```

## props

`columns` _Array_ （default `[]`）  
列配置

## slots

`name({row, index})`  
传给Table的动态slot，需要列配置中指定slot。e.g. `[{ slot: 'name' }]`
