import Vue from 'vue'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'

@Module({ namespaced: true, store })
export default class SearchModule extends VuexModule {
  searchTerm = ''
  labelFilters: string[] = []

  @Mutation
  FILTER_TASKS(payload: {
    searchTerm: string
    labelFilters: string[]
    columns: string[]
  }) {
    const { searchTerm, labelFilters, columns } = payload
    this.searchTerm = searchTerm
    this.labelFilters = labelFilters

    columns.map((columnId) => {
      store.state.columns.columns[columnId].tasks.map(
        ({ taskId }, taskIndex) => {
          const isInTitle = this.searchTerm.length
            ? store.state.tasks.tasks[taskId].name.indexOf(this.searchTerm) !==
              -1
            : true

          const hasLabel = this.labelFilters.length
            ? store.state.tasks.tasks[taskId].labels.some(
                (labelId) => this.labelFilters.indexOf(labelId) !== -1
              )
            : true

          const task = store.state.columns.columns[columnId].tasks[taskIndex]

          if (isInTitle && hasLabel) {
            Vue.set(store.state.columns.columns[columnId].tasks, taskIndex, {
              ...task,
              isVisible: true,
            })
          } else {
            Vue.set(store.state.columns.columns[columnId].tasks, taskIndex, {
              ...task,
              isVisible: false,
            })
          }
        }
      )
    })
  }
}
