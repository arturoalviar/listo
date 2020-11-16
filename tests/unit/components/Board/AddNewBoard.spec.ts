import { mount, createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'

import AppButton from '@/components/AppButton.vue'
import BoardAddNew from '@/components/BoardAddNew.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BoardAddNew', () => {
  let state
  let mutations: {CREATE_BOARD: () => void}
  let store: Store<unknown> 

  beforeEach(() => {
    state = {
      boards: {}
    }
    mutations = {
      CREATE_BOARD: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        boards: {
          namespaced: true,
          state,
          mutations
        }
      }
    })
  })

  it('does not call CREATE_BOARD mutation when input value is blank', () => {
    const wrapper = mount(BoardAddNew, { components: {AppButton}, store, localVue })
    const input = wrapper.find('input')
    const inputEl = input.element as HTMLInputElement
    inputEl.value = ''

    const button = wrapper.find('button')
    button.trigger('click')
    expect(mutations.CREATE_BOARD).not.toHaveBeenCalled()
  })

  it('calls on CREATE_BOARD mutation when add board button is clicked and input has a value', () => {
    const wrapper = mount(BoardAddNew, { components: {AppButton}, store, localVue })
    const input = wrapper.find('input')
    const inputEl = input.element as HTMLInputElement
    inputEl.value = 'new board'
    input.trigger('input')

    const button = wrapper.find('button')
    button.trigger('click')
    expect(mutations.CREATE_BOARD).toHaveBeenCalled()
  })  
})