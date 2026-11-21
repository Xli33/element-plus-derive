import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import ModalFooter from '../ModalFooter.vue'

describe('ModalFooter', () => {
  it('renders properly', () => {
    const wrapper = mount(ModalFooter, {
      global: {
        plugins: [ElementPlus]
      },
      props: {}
    })
    // console.log('text(): --- ', wrapper.html())

    expect(wrapper.text()).toContain('确定')
  })
})
