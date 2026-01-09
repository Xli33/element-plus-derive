import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElColumn from '../ElColumn.vue'

describe('ElColumn', () => {
  it('renders properly', () => {
    const wrapper = mount(ElColumn, {
      props: {
        columns: [{ label: '状态', prop: 'status' }]
      },
      global: {
        // 通过stubs将ElColumn需要的ElTableColumn/el-table-column替换为当前定义的div
        stubs: {
          // el-table-column无法正常渲染，即使直接使用 <el-table><el-table-column label='1' prop='1'></el-table> 也不会有列的节点
          // 故仅测试ElColumn本身
          ElTableColumn: {
            template: '<div class="stub-column">{{ $attrs.label }}</div>',
            inheritAttrs: false
          }
        }
      }
    })
    // console.log('text(): --- ', wrapper.html())

    expect(wrapper.text()).toContain('状态')
  })
})
