import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import Drawer from '../Drawer.vue'

describe('Drawer', () => {
  it('renders properly', () => {
    const wrapper = mount(Drawer, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: true,
        title: '标题'
      }
    })
    // console.log('text(): --- ', wrapper.html())
    expect(wrapper.text()).toContain('标题')
  })
})
