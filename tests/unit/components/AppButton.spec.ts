import { shallowMount, mount } from '@vue/test-utils'
import AppButton from '@/components/AppButton.vue'

const CLASSES = {
  default: 'is-default',
  danger: 'is-danger',
}

describe('AppButton.vue', () => {

  it('renders default button', () => {
    const wrapper = shallowMount(AppButton)
    expect(wrapper.classes()).toContain(CLASSES.default)
  })
  
  it('renders default button when random string variant is passed in', () => {
    const wrapper = shallowMount(AppButton, {
      propsData: {
        variant: 'some random value',
      },
    })
    expect(wrapper.classes()).toContain(CLASSES.default)
  })

  it('renders alert button', () => {
    const wrapper = shallowMount(AppButton, {
      propsData: {
        variant: 'danger',
      },
    })
    expect(wrapper.classes()).toContain(CLASSES.danger)
  })

  it('emits click when button is clicked', async () => {
    const wrapper = mount(AppButton)

    wrapper.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().click).toBeTruthy()
  })

  it('calls function when button is clicked', async () => {
    const clickFunction = jest.fn()
    const wrapper = mount(AppButton)

    wrapper.vm.$on('click', clickFunction)
    wrapper.trigger('click')

    await wrapper.vm.$nextTick()

    expect(clickFunction).toBeCalled()
  })
})
