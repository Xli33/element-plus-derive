import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import CurdTable from '../CurdTable.vue'

describe('CurdTable', () => {
  it('renders properly', () => {
    const wrapper = mount(CurdTable, {
      global: {
        plugins: [ElementPlus]
      },
      props: {}
    })
    // console.log('text(): --- ', wrapper.html())

    expect(wrapper.text()).toContain('新增')
  })
})
