import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'
import ToggleColumn from '../ToggleColumn.vue'

describe('ToggleColumn', () => {
  it('renders properly', async () => {
    const wrapper = mount(ToggleColumn, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: [
          {
            label: 'num',
            prop: 'num'
          },
          {
            label: 'num2',
            prop: 'num2'
          },
          {
            label: 'num3',
            prop: 'num3'
          }
        ]
      }
    })
    wrapper.find('button').trigger('click')
    await nextTick()
    // console.log('text(): --- ', wrapper.html())

    expect(wrapper.text()).toContain('全选numnum2num3')
  })
})
