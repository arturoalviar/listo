import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import Boards, { BoardsCollection } from '@/types/board'
import labels, { colorPalette } from '@/utils/defaultLabels'
import { uuid } from '@/utils'
import store from '@/store'

const localBoardsState = localStorage.getItem('listoState')
const boardsState = localBoardsState
  ? JSON.parse(localBoardsState)
  : { boards: {}, recentBoards: [] }

@Module({ namespaced: true, store })
export default class BoardModule extends VuexModule implements Boards {
  boards: BoardsCollection = boardsState.boards
  recentBoards: string[] = boardsState.recentBoards

  get board() {
    return (id: string) => this.boards[id]
  }

  get boardName() {
    return (id: string) => this.boards[id].name
  }

  get boardTasks() {
    return (id: string) => {
      return this.boards[id].columns
        .map((columnId) => {
          return store.state.columns.columns[columnId].tasks.map(
            ({ taskId }) => taskId
          )
        })
        .flat()
    }
  }

  get columns() {
    return (id: string) => this.boards[id].columns
  }

  get isFav() {
    return (id: string) => this.boards[id].isFavorite
  }

  get createdAtDate() {
    return (id: string) => this.boards[id].createdAt
  }

  get unusedLabels() {
    return (id: string) => {
      return Object.values(colorPalette).filter(({ color: paletteColor }) => {
        return !Object.values(this.boards[id].labels).some(
          ({ color }) => paletteColor === color
        )
      })
    }
  }

  @Mutation
  RESET_STATE() {
    this.boards = {}
    this.recentBoards = []
  }

  @Mutation
  CREATE_BOARD(payload: { name: string; id?: string }) {
    const { id, name } = payload
    const boardId = id || uuid()
    const boardData = {
      id: boardId,
      createdAt: new Date(),
      columns: [],
      isMenuOpen: false,
      isFavorite: false,
      name,
      labels: labels,
    }

    Vue.set(this.boards, boardId, boardData)
  }

  @Mutation
  DELETE_BOARD(payload: { id: string }) {
    const { id } = payload

    const toDeleteBoardIndex = this.recentBoards.indexOf(id)

    if (toDeleteBoardIndex >= 0) {
      this.recentBoards.splice(toDeleteBoardIndex, 1)
    }

    Vue.delete(this.boards, id)
  }

  @Mutation
  TOGGLE_MENU(payload: { id: string; isMenuOpen: boolean }) {
    const { id, isMenuOpen } = payload
    this.boards[id].isMenuOpen = isMenuOpen
  }

  @Mutation
  TOGGLE_FAV(payload: { id: string; isFav: boolean }) {
    const { id, isFav } = payload
    this.boards[id].isFavorite = isFav
  }

  @Mutation
  UPDATE_NAME(payload: { name: string; id: string }) {
    const { name, id } = payload
    this.boards[id].name = name
  }

  @Mutation
  ADD_COLUMN(payload: { boardId: string; columnId: string }) {
    const { boardId, columnId } = payload
    this.boards[boardId].columns.push(columnId)
  }

  @Mutation
  INSERT_COLUMN(payload: {
    boardId: string
    columnId: string
    startIndex: number
  }) {
    const { boardId, columnId, startIndex } = payload

    if (startIndex >= this.boards[boardId].columns.length) {
      this.boards[boardId].columns.push(columnId)
    } else {
      this.boards[boardId].columns.splice(startIndex + 1, 0, columnId)
    }
  }

  @Mutation
  MOVE_COLUMN(payload: {
    boardId: string
    fromColumnIndex: number
    toColumnIndex: number
  }) {
    const { boardId, fromColumnIndex, toColumnIndex } = payload
    const columnToMove = this.boards[boardId].columns.splice(
      fromColumnIndex,
      1
    )[0]
    this.boards[boardId].columns.splice(toColumnIndex, 0, columnToMove)
  }

  @Mutation
  DELETE_COLUMN(payload: { boardId: string; columnIndex: number }) {
    const { boardId, columnIndex } = payload
    this.boards[boardId].columns.splice(columnIndex, 1)
  }

  // recent board mutations
  @Mutation
  ADD_RECENT_BOARD(boardId: string) {
    const boardIdIndex = this.recentBoards.indexOf(boardId)
    const inRecentBoards = boardIdIndex !== -1
    if (this.recentBoards.length <= 3 && !inRecentBoards) {
      this.recentBoards.push(boardId)
      return
    }
    if (!inRecentBoards) {
      this.recentBoards.pop()
      this.recentBoards.unshift(boardId)
      return
    }
    if (boardIdIndex !== 0) {
      this.recentBoards.splice(boardIdIndex, 1)
      this.recentBoards.unshift(boardId)
    }
  }

  @Action({ rawError: true })
  toggleFav(payload: { id: string; isFav: boolean }) {
    const { id, isFav } = payload
    if (isFav) {
      this.context.commit(
        'favBoards/ADD_FAV_BOARD',
        { boardId: id },
        { root: true }
      )
    } else {
      this.context.commit(
        'favBoards/DELETE_FAV_BOARD',
        { boardId: id },
        { root: true }
      )
    }
    this.context.commit('TOGGLE_FAV', payload)
  }

  @Action({ rawError: true })
  deleteBoard(payload: { id: string }) {
    const { id } = payload

    if (this.boards[id].isFavorite) {
      this.context.commit(
        'favBoards/DELETE_FAV_BOARD',
        { boardId: id },
        { root: true }
      )
    }
    this.context.commit('DELETE_BOARD', payload)
  }
}
