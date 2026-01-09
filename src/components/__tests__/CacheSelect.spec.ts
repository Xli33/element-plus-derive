import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import CacheSelect from '../CacheSelect.vue'

describe('CacheSelect', () => {
  it('renders properly', () => {
    const wrapper = mount(CacheSelect, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: 'a',
        teleported: false,
        list: [
          {
            value: 'a',
            label: 'one'
          }
        ]
      }
    })
    // console.log('text(): --- ', wrapper.html())

    expect(wrapper.text()).toContain('one')
  })
})
