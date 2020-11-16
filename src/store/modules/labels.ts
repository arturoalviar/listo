import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'

import { uuid } from '@/utils'
import { Label, LabelTemp } from '@/types/labels'

@Module({ namespaced: true, store })
export default class LabelsModule extends VuexModule {
  get boardLabels() {
    return (boardId: string) => store.state.boards.boards[boardId].labels
  }

  get taskLabels() {
    return (payload: { taskId: string }) => {
      const { taskId } = payload
      return store.state.tasks.tasks[taskId].labels
    }
  }

  @Mutation
  ADD_LABEL(payload: { boardId: string; label: LabelTemp }) {
    const { boardId, label } = payload
    const labelId = uuid()
    const updatedLabel = { ...label, id: labelId }

    Vue.set(store.state.boards.boards[boardId].labels, labelId, updatedLabel)
  }

  @Mutation
  UPDATE_LABEL(payload: { boardId: string; labelId: string; label: Label }) {
    const { boardId, labelId, label } = payload
    Vue.set(store.state.boards.boards[boardId].labels, labelId, label)
  }

  @Mutation
  DELETE_LABEL(payload: { boardId: string; labelId: string }) {
    const { boardId, labelId } = payload
    Vue.delete(store.state.boards.boards[boardId].labels, labelId)

    store.state.boards.boards[boardId].columns.forEach((column) => {
      const currentTasks = store.state.columns.columns[column].tasks

      if (currentTasks.length) {
        currentTasks.forEach(({ taskId }) => {
          const taskLabels = store.state.tasks.tasks[taskId].labels

          if (taskLabels.length) {
            const deletedLabelIndex = taskLabels.indexOf(labelId)

            if (deletedLabelIndex !== -1) {
              Vue.delete(
                store.state.tasks.tasks[taskId].labels,
                deletedLabelIndex
              )
            }
          }
        })
      }
    })
  }

  @Action({ rawError: true })
  deleteLabel(payload: { boardId: string; labelId: string }) {
    const { labelId } = payload

    this.context.commit('DELETE_LABEL', payload)

    return labelId
  }
}
