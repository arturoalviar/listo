import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'

import { uuid } from '@/utils'
import { Spaces, Space, SpacesCollection } from '@/types/spaces'

const localSpacesData = localStorage.getItem('listoState')
const currentState: Spaces = localSpacesData
  ? JSON.parse(localSpacesData)
  : { spaces: {} }

@Module({ namespaced: true, store })
export default class SpacesModule extends VuexModule implements Spaces {
  spaces: SpacesCollection = currentState.spaces

  get spaceById() {
    return (id: string) => this.spaces[id]
  }

  get spaceBoards() {
    return (id: string) => this.spaces[id].boards
  }

  @Mutation
  RESET_STATE() {
    this.spaces = {}
  }

  @Mutation
  CREATE_SPACE(payload: { name: string; id?: string }) {
    const { id, name } = payload
    const spaceId = id || uuid()
    const space: Space = {
      createdAt: new Date(),
      boards: [],
      id: spaceId,
      name,
    }

    Vue.set(this.spaces, spaceId, space)
  }

  @Mutation
  UPDATE_SPACE(payload: { spaceId: string; key: string; value: string }) {
    const { spaceId, key, value } = payload

    Vue.set(this.spaces[spaceId], key, value)
  }

  @Mutation
  ADD_BOARDS_TO_SPACE(payload: { spaceId: string; boardIds: string[] }) {
    const { spaceId, boardIds } = payload

    Vue.set(this.spaces[spaceId], 'boards', [...boardIds])
  }

  @Mutation
  DELETE_SPACE(payload: { spaceId: string }) {
    const { spaceId } = payload
    Vue.delete(this.spaces, spaceId)
  }

  @Action({ rawError: true })
  addBoardsToSpace(payload: { spaceId: string; boardIds: string[] }) {
    this.context.commit('ADD_BOARDS_TO_SPACE', payload)
  }

  @Action({ rawError: true })
  deleteSpace(payload: { spaceId: string }) {
    this.context.commit('DELETE_SPACE', payload)
  }
}
