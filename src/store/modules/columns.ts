import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'

import { uuid } from '@/utils'
import Columns, {
  Column,
  ColumnCollection,
  ColumnKey,
  ColumnTask,
} from '@/types/columns'

const localColumnsData = localStorage.getItem('listoState')
const currentState: Columns = localColumnsData
  ? JSON.parse(localColumnsData)
  : { columns: {} }

@Module({ namespaced: true, store })
export default class ColumnModule extends VuexModule implements Columns {
  columns: ColumnCollection = currentState.columns

  get columnById() {
    return (id: string) => this.columns[id]
  }

  get columnName() {
    return (id: string) => this.columns[id].name
  }

  get tasks() {
    return (id: string) => this.columns[id].tasks
  }

  get taskIndex() {
    return (payload: { columnId: string; taskId: string }) => {
      const { columnId, taskId } = payload
      const tasks = this.columns[columnId].tasks

      // return tasks.indexOf(taskId)
      tasks.forEach((taskItem, index) => {
        if (taskItem.taskId === taskId) {
          return index
        }
      })

      return -1
    }
  }

  @Mutation
  RESET_STATE() {
    this.columns = {}
  }

  @Mutation
  private CREATE_COLUMN(payload: {
    name: string
    id: string
    boardId: string
  }) {
    const { name, id, boardId } = payload
    const newColumn: Column = {
      tasks: [],
      id,
      boardId,
      name,
    }

    Vue.set(this.columns, id, newColumn)
  }

  @Mutation
  COPY_COLUMN(payload: {
    id: string
    copyId: string
    name: string
    tasks: string[]
  }) {
    const { id, name, copyId, tasks } = payload
    const columnCopy = Object.assign(
      {},
      { ...this.columns[id], id: copyId, name, tasks }
    )

    Vue.set(this.columns, copyId, columnCopy)
  }

  @Mutation
  UPDATE_COLUMN(payload: { id: string; key: ColumnKey; value: string }) {
    const { id, key, value } = payload

    Vue.set(this.columns[id], key, value)
  }

  @Mutation
  ADD_TASK(payload: { columnId: string; taskId: string }) {
    const { columnId, taskId } = payload
    const newTask = {
      taskId,
      isVisible: true,
    }

    this.columns[columnId].tasks.push(newTask)
  }

  @Mutation
  MOVE_TASK(payload: {
    toColumnId: string
    toTaskIndex: number
    taskToMove: ColumnTask
  }) {
    const { toColumnId, toTaskIndex, taskToMove } = payload

    this.columns[toColumnId].tasks.splice(toTaskIndex, 0, taskToMove)
  }

  @Mutation
  REMOVE_TASK(payload: { columnId: string; taskIndex: number }) {
    const { columnId, taskIndex } = payload

    this.columns[columnId].tasks.splice(taskIndex, 1)
  }

  @Mutation
  DELETE_TASKS_IN_COLUMN(payload: { id: string }) {
    const { id } = payload

    if (this.columns[id].tasks.length) {
      Vue.set(this.columns[id], 'tasks', [])
    }
  }

  @Mutation
  private DELETE_COLUMN(payload: { id: string }) {
    const { id } = payload

    Vue.delete(this.columns, id)
  }

  @Action({ rawError: true })
  createColumn(payload: { boardId: string; name: string }) {
    const newColumnId = uuid()

    this.context.commit('CREATE_COLUMN', { ...payload, id: newColumnId })

    return newColumnId
  }

  @Action({ rawError: true })
  copyColumn(payload: { id: string; index: number; name: string }) {
    const { id, index } = payload
    const copyId = uuid()

    return this.context
      .dispatch(
        'tasks/copyTasks',
        {
          columnId: copyId,
          tasks: this.columns[id].tasks,
        },
        { root: true }
      )
      .then((tasks) => {
        this.context.commit('COPY_COLUMN', { ...payload, copyId, tasks })

        return {
          id: copyId,
          index,
        }
      })
  }

  @Action({ rawError: true })
  deleteColumn(payload: { id: string }) {
    const { id } = payload

    return this.context
      .dispatch(
        'tasks/deleteTasks',
        {
          tasks: this.columns[id].tasks,
        },
        { root: true }
      )
      .then(() => {
        this.context.commit('DELETE_COLUMN', payload)

        return id
      })
  }

  @Action({ rawError: true })
  moveTask(payload: {
    fromColumnId: string
    fromTaskIndex: number
    toColumnId: string
    toTaskIndex: number
  }) {
    const { fromColumnId, fromTaskIndex, toColumnId, toTaskIndex } = payload
    const fromColumn = this.columns[fromColumnId]
    const taskToMove = fromColumn.tasks.splice(fromTaskIndex, 1)[0]

    this.context.commit('MOVE_TASK', { toColumnId, toTaskIndex, taskToMove })

    return taskToMove
  }
}
