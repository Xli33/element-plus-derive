import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import AllCheckbox from '../AllCheckbox.vue'

describe('AllCheckbox', () => {
  it('renders properly', () => {
    const wrapper = mount(AllCheckbox, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: ['3'],
        title: '所有',
        list: [
          ['1', '星期一'],
          ['2', '星期二'],
          ['3', '星期三']
        ]
      }
    })
    // console.log('text(): --- ', wrapper.html())
    expect(wrapper.text()).toContain('所有星期一星期二星期三')
  })
})
