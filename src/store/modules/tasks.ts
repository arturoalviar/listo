import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep'
import store from '@/store'

import { uuid } from '@/utils'
import { ColumnTask } from '@/types/columns'
import Tasks, { Task, TaskCollection, TaskKey } from '@/types/tasks'
import { Label } from '@/types/labels'

const localTasksData = localStorage.getItem('listoState')
const currentState: Tasks = localTasksData
  ? JSON.parse(localTasksData)
  : { tasks: {} }

@Module({ namespaced: true, store })
export default class TaskModule extends VuexModule implements Tasks {
  tasks: TaskCollection = currentState.tasks

  get allTaskKeys() {
    return () => Object.keys(this.tasks)
  }

  get taskById() {
    return (id: string) => this.tasks[id]
  }

  get labels() {
    return (id: string) => this.tasks[id].labels
  }

  get checklists() {
    return (id: string) => this.tasks[id].checklists
  }

  @Mutation
  RESET_STATE() {
    this.tasks = {}
  }

  @Mutation
  private CREATE_TASK(payload: {
    name: string
    id: string
    boardId: string
    columnId: string
  }) {
    const { name, id, boardId, columnId } = payload
    const newTask: Task = {
      description: '',
      labels: [],
      checklists: [],
      id,
      boardId,
      columnId,
      name,
    }

    Vue.set(this.tasks, id, newTask)
  }

  @Mutation
  COPY_TASK(payload: {
    id: string
    name: string
    boardId: string
    columnId: string
    description: string
    labels: string[]
  }) {
    const { id } = payload

    Vue.set(this.tasks, id, payload)
  }

  @Mutation
  UPDATE_TASK(payload: { id: string; key: TaskKey; value: string }) {
    const { id, key, value } = payload

    Vue.set(this.tasks[id], key, value)
  }

  @Mutation
  ADD_CHECKLIST_TO_TASK(payload: { taskId: string; checklistId: string }) {
    const { taskId, checklistId } = payload

    this.tasks[taskId].checklists.push(checklistId)
  }

  @Mutation
  ADD_LABEL_TO_TASK(payload: { taskId: string; label: Label }) {
    const { taskId, label } = payload
    const taskLabels = this.tasks[taskId].labels

    let labelIndex = -1
    taskLabels.forEach((item, index) => {
      if (item === label.id) {
        labelIndex = index
      }
    })

    if (labelIndex >= 0) {
      this.tasks[taskId].labels.splice(labelIndex, 1)
    } else {
      this.tasks[taskId].labels.push(label.id)
    }
  }

  @Mutation
  DELETE_CHECKLIST(payload: { taskId: string; checklistId: string }) {
    const { taskId, checklistId } = payload

    const checklistIndex = this.tasks[taskId].checklists.indexOf(checklistId)

    this.tasks[taskId].checklists.splice(checklistIndex, 1)
  }

  @Mutation
  DELETE_TASK(payload: { id: string }) {
    const { id } = payload

    Vue.delete(this.tasks, id)
  }

  @Action({ rawError: true })
  createTask(payload: { name: string; boardId: string; columnId: string }) {
    const newTaskId = uuid()

    this.context.commit('CREATE_TASK', { ...payload, id: newTaskId })

    return newTaskId
  }

  @Action({ rawError: true })
  copyTasks(payload: { columnId: string; tasks: ColumnTask[]}) {
    const { columnId, tasks } = payload
    const newCopiedTasks: ColumnTask[] = []

    tasks.map(({taskId, isVisible}) => {
      // generate a new id
      const newTaskId = uuid()
      // grab a copy of task we are copying
      // doing a shallow copy would cause a bug when adding and removing labels
      const taskData = cloneDeep({
        ...this.tasks[taskId],
        id: newTaskId,
        columnId,
      })

      newCopiedTasks.push({
        taskId: newTaskId,
        isVisible
      })

      this.context.commit('COPY_TASK', taskData)
    })

    return newCopiedTasks
  }

  @Action({ rawError: true })
  deleteTask(payload: { id: string }) {
    const { id } = payload

    this.context.commit('DELETE_TASK', payload)

    return id
  }

  @Action({ rawError: true })
  deleteTasks(payload: { tasks: ColumnTask[] }) {
    const { tasks } = payload

    tasks.forEach(({taskId}) => {
      this.context.commit('DELETE_TASK', { id: taskId })
    })
  }
}
