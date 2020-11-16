import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep'

import store from '@/store'
import { uuid } from '@/utils'
import App, { AppUploadData } from '@/types/app'

const localAppState = localStorage.getItem('listoState')

const appState = localAppState
  ? JSON.parse(localAppState)
  : { hasCompletedSetup: false }

@Module({ namespaced: true, store })
export default class AppModule extends VuexModule implements App {
  hasCompletedSetup = appState.hasCompletedSetup

  @Mutation
  COMPLETE_SETUP() {
    this.hasCompletedSetup = true
  }

  @Mutation
  RESET_STATE() {
    const localStateStorage = localStorage.getItem('listoState')

    if (localStateStorage) {
      localStorage.removeItem('listoState')
    }

    this.hasCompletedSetup = false
  }

  @Mutation
  MERGE_BOARD_DATA(payload: AppUploadData) {
    const { boards, columns, tasks, checklists, favBoards, spaces } = payload
    const boardCollection: {
      [id: string]: { oldId: string; newId: string }
    } = {}

    Object.keys(boards).forEach((boardId) => {
      if (boardId in store.state.boards.boards) {
        const newBoardId = uuid()
        const currentBoardCols = boards[boardId].columns
        let newColumnsIds: string[] = []

        // check if board has columns (generally should)
        if (currentBoardCols.length) {
          // go through board's id ref array
          newColumnsIds = currentBoardCols.map((columnId) => {
            // create new id
            const newColumnId = uuid()
            const currentColumnTasks = columns[columnId].tasks
            let newTaskIds: string[] = []

            if (currentColumnTasks.length) {
              newTaskIds = currentColumnTasks.map(({ taskId }) => {
                const newTaskId = uuid()
                const currentTaskChecklists = tasks[taskId].checklists
                let newChecklistIds: string[] = []

                if (currentTaskChecklists.length) {
                  newChecklistIds = currentTaskChecklists.map((checklistId) => {
                    const newChecklistId = uuid()
                    const checklistCopy = cloneDeep({
                      ...checklists[checklistId],
                      id: newChecklistId,
                      name: `Recovered: ${checklists[checklistId].name}`,
                    })

                    store.state.checklists.checklists[
                      newChecklistId
                    ] = checklistCopy

                    return newChecklistId
                  })
                }

                const taskCopy = cloneDeep({
                  ...tasks[taskId],
                  id: newTaskId,
                  name: `Recovered: ${tasks[taskId].name}`,
                  checklists: newChecklistIds,
                })

                Vue.set(store.state.tasks.tasks, newTaskId, taskCopy)

                return newTaskId
              })
            }

            // copy column from our backup data
            const columnCopy = cloneDeep({
              ...columns[columnId],
              tasks: newTaskIds,
              id: newColumnId,
            })

            // add backup column to our state; has new ID now with updated task refs but with old data still in tack
            Vue.set(store.state.columns.columns, newColumnId, columnCopy)

            return newColumnId
          })
        }

        if (boards[boardId].isFavorite) {
          const favBoardsIndex = favBoards.indexOf(boardId)
          // remove duplicate id
          favBoards.splice(favBoardsIndex, 1)
          // add newly generated id
          favBoards.push(newBoardId)
        }

        const boardCopy = cloneDeep({
          ...boards[boardId],
          columns: newColumnsIds,
          id: newBoardId,
          name: `Recovered: ${boards[boardId].name}`,
        })

        Vue.set(store.state.boards.boards, newBoardId, boardCopy)
        boardCollection[boardId] = { oldId: boardId, newId: newBoardId }
      } else {
        const currentBoardCols = boards[boardId].columns

        if (currentBoardCols.length) {
          currentBoardCols.forEach((columnId) => {
            const currentColumnTasks = columns[columnId].tasks
            if (currentBoardCols.length) {
              currentColumnTasks.forEach(({ taskId }) => {
                const currentTaskChecklists = tasks[taskId].checklists
                currentTaskChecklists.forEach((checklistId) => {
                  store.state.checklists.checklists[checklistId] =
                    checklists[checklistId]
                })
                store.state.tasks.tasks[taskId] = tasks[taskId]
              })
            }
            store.state.columns.columns[columnId] = columns[columnId]
          })
        }

        store.state.boards.boards[boardId] = boards[boardId]
      }
    })

    store.state.favBoards.favBoards = store.state.favBoards.favBoards.concat(
      favBoards
    )

    Object.keys(spaces).map((spaceId) => {
      const newSpaceId = uuid()
      const currentSpaceBoards = spaces[spaceId].boards
      let newBoardIds: string[] = []

      newBoardIds = currentSpaceBoards.map((spaceBoardId) => {
        if (spaceBoardId in boardCollection) {
          return boardCollection[spaceBoardId].newId
        }
        return spaceBoardId
      })

      const spaceCopy = {
        ...spaces[spaceId],
        id: newSpaceId,
        name: `Recovered: ${spaces[spaceId].name}`,
        boards: newBoardIds,
      }

      Vue.set(store.state.spaces.spaces, newSpaceId, spaceCopy)
    })
  }

  @Action({ rawError: true })
  setInitalState() {
    const boardId = uuid()
    this.context.commit(
      'boards/CREATE_BOARD',
      { id: boardId, name: 'Todos' },
      { root: true }
    )

    const columnNames = ['Todo', 'In progress', 'Completed']

    const columnIds = columnNames.map((columnName) => {
      const columnId = uuid()

      this.context.commit(
        'columns/CREATE_COLUMN',
        {id: columnId, boardId, name: columnName},
        {root: true}
      )
      this.context.commit(
        'boards/ADD_COLUMN',
        {boardId, columnId},
        {root: true}
      )
      return columnId
    })

    const taskId = uuid()

    this.context.commit(
      'tasks/CREATE_TASK',
      {id: taskId,  columnId: columnIds[0], boardId, name: 'Remind yourself that you are awesome'},
      {root: true}
    )
    this.context.commit(
      'columns/ADD_TASK',
      {columnId: columnIds[0], taskId},
      {root: true}
    )

    return boardId
  }
  @Action({ rawError: true })
  resetAppState() {
    this.context.commit('RESET_STATE', {})
    this.context.commit('boards/RESET_STATE', {}, { root: true })
    this.context.commit('checklists/RESET_STATE', {}, { root: true })
    this.context.commit('columns/RESET_STATE', {}, { root: true })
    this.context.commit('favBoards/RESET_STATE', {}, { root: true })
    this.context.commit('spaces/RESET_STATE', {}, { root: true })
    this.context.commit('tasks/RESET_STATE', {}, { root: true })
  }
}
