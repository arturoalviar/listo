import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'

const initalFavBoards = {
  favBoards: [],
}

const localFavBoards = localStorage.getItem('listoState')
const favBoardsState = localFavBoards
  ? JSON.parse(localFavBoards)
  : initalFavBoards

@Module({ namespaced: true, store })
export default class SettingsModule extends VuexModule {
  favBoards: string[] = favBoardsState.favBoards

  @Mutation
  RESET_STATE() {
    this.favBoards = []
  }

  @Mutation
  ADD_FAV_BOARD(payload: { boardId: string }) {
    const { boardId } = payload

    const boardIndex = this.favBoards.indexOf(boardId)

    if (boardIndex === -1) {
      this.favBoards.push(boardId)
    }
  }

  @Mutation
  DELETE_FAV_BOARD(payload: { boardId: string }) {
    const { boardId } = payload

    const boardIndex = this.favBoards.indexOf(boardId)

    if (boardIndex !== -1) {
      this.favBoards.splice(boardIndex, 1)
    }
  }
}
