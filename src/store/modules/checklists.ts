import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'

import { uuid } from '@/utils'
import { Checklists, Checklist, ChecklistCollection } from '@/types/checklists'

const localChecklistsData = localStorage.getItem('listoState')
const currentState: Checklists = localChecklistsData
  ? JSON.parse(localChecklistsData)
  : { checklists: {} }

@Module({ namespaced: true, store })
export default class CheckListModule extends VuexModule implements Checklists {
  checklists: ChecklistCollection = currentState.checklists

  get checklist() {
    return (id: string) => this.checklists[id]
  }

  get items() {
    return (id: string) => this.checklists[id].items
  }

  @Mutation
  RESET_STATE() {
    this.checklists = {}
  }

  @Mutation
  CREATE_CHECKLIST(payload: { id: string; taskId: string; name: string }) {
    const { id, taskId, name } = payload
    const checkList: Checklist = {
      items: [],
      showCompleted: true,
      id,
      taskId,
      name,
    }
    Vue.set(this.checklists, id, checkList)
  }

  @Mutation
  UPDATE_CHECKLIST(payload: {
    id: string
    key: string
    value: string | boolean
  }) {
    const { id, key, value } = payload

    Vue.set(this.checklists[id], key, value)
  }

  @Mutation
  ADD_ITEM_TO_CHECKLIST(payload: { checklistId: string; label: string }) {
    const { checklistId, label } = payload

    const newItem = {
      label,
      completed: false,
    }

    this.checklists[checklistId].items.push(newItem)
  }

  @Mutation
  UPDATE_CHECKLIST_ITEM(payload: {
    checklistId: string
    index: number
    key: string
    value: string | boolean
  }) {
    const { checklistId, index, key, value } = payload

    Vue.set(this.checklists[checklistId].items[index], key, value)
  }

  @Mutation
  DELETE_CHECKLIST(payload: { checklistId: string }) {
    const { checklistId } = payload

    Vue.delete(this.checklists, checklistId)
  }

  @Mutation
  DELETE_CHECKLIST_ITEM(payload: { checklistId: string; index: number }) {
    const { checklistId, index } = payload

    this.checklists[checklistId].items.splice(index, 1)
  }

  @Action({ rawError: true })
  createChecklist(payload: { taskId: string; name: string }) {
    const { taskId } = payload
    const checklistId = uuid()

    this.context.commit('CREATE_CHECKLIST', { ...payload, id: checklistId })
    this.context.commit(
      'tasks/ADD_CHECKLIST_TO_TASK',
      { taskId, checklistId },
      { root: true }
    )
  }

  @Action({ rawError: true })
  deleteChecklist(payload: { checklistId: string }) {
    const { checklistId } = payload
    const { taskId } = this.checklists[checklistId]

    this.context.commit('DELETE_CHECKLIST', payload)

    return { checklistId, taskId }
  }

  @Action({ rawError: true })
  setAllChecklistItems(payload: { checklistId: string; value: boolean }) {
    const { checklistId, value } = payload
    this.checklists[checklistId].items.map((checklist, index) => {
      if (this.checklists[checklistId].items[index].completed !== value) {
        this.context.commit('UPDATE_CHECKLIST_ITEM', {
          checklistId,
          index,
          key: 'completed',
          value,
        })
      }
    })
  }
}
