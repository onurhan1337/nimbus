import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ItemComponent from '../WelcomeItem.vue'

describe('ItemComponent', () => {
  it('renders slots content correctly', () => {
    const wrapper = mount(ItemComponent, {
      slots: {
        icon: '<span class="icon">Icon</span>',
        heading: '<span class="heading">Heading</span>',
        default: '<p>Content</p>'
      }
    })

    // Check if the icon slot renders correctly
    expect(wrapper.find('.icon').exists()).toBe(true)
    expect(wrapper.find('.icon').text()).toBe('Icon')

    // Check if the heading slot renders correctly
    expect(wrapper.find('.heading').exists()).toBe(true)
    expect(wrapper.find('.heading').text()).toBe('Heading')

    // Check if the default slot renders correctly
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('p').text()).toBe('Content')
  })

  it('renders with the correct structure', () => {
    const wrapper = mount(ItemComponent)

    // Check if the main wrapper and expected class names are present
    expect(wrapper.find('.item').exists()).toBe(true)
    expect(wrapper.find('.details').exists()).toBe(true)
  })
})
