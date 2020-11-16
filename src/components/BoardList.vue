<template>
  <div class="listo-page-body">
    <div class="listo-page-body-header">
      <div class="container">
        <div class="listo-page-header">
          <h1 class="listo-page-heading">Boards</h1>
          <AppButton @click="isAddingBoard = true">Add new board</AppButton>
        </div>
      </div>
    </div>
    <div v-if="hasBoards" class="listo-page-body-content listo-scrollbar">
      <div class="container">
        <div v-if="favBoards.length" class="mb-10">
          <h2 class="listo-block-heading">Favorite Boards</h2>
          <div class="board-list-cards">
            <BoardListCard
              v-for="id in favBoards"
              :id="boards[id].id"
              :key="'board-fav' + id"
              :name="boards[id].name"
            />
          </div>
        </div>
        <div v-if="recentBoards.length" class="mb-10">
          <h2 class="listo-block-heading">Recently visited Boards</h2>
          <div class="board-list-cards">
            <BoardListCard
              v-for="id in recentBoards"
              :id="boards[id].id"
              :key="'board-visited' + id"
              :name="boards[id].name"
            />
          </div>
        </div>
        <div class="mb-10">
          <div class="listo-section-header">
            <h2 class="listo-block-heading">All Boards</h2>
            <AppSearchFilter
              placeholder="Filter boards"
              rounded
              :search="filterBoards"
              @input="getCurrentQuery"
              @searched="getFilteredBoards"
            />
          </div>
          <div class="board-list-cards">
            <BoardListCard
              v-for="boardId in filteredBoards"
              :id="boardId"
              :key="'board' + boardId"
              :name="boards[boardId].name"
            />
          </div>
        </div>
      </div>
    </div>

    <AppEmptyList v-else title="Nothing to see here. Add your first board." />

    <AppModal v-model="isAddingBoard">
      <BoardAddNew @board-created="isAddingBoard = false" />
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

import AppEmptyList from '@/components/AppEmptyList.vue'
import AppModal from '@/components/AppModal.vue'
import AppSearchFilter from '@/components/AppSearchFilter.vue'
import BoardAddNew from '@/components/BoardAddNew.vue'
import BoardListCard from '@/components/BoardListCard.vue'

import { BoardsCollection } from '@/types/board'

const boardsModule = namespace('boards')
const favBoardsModule = namespace('favBoards')

@Component({
  name: 'board-list',
  components: {
    AppEmptyList,
    AppModal,
    AppSearchFilter,
    BoardAddNew,
    BoardListCard,
  },
})
export default class BoardList extends Vue {
  @boardsModule.State boards!: BoardsCollection
  @boardsModule.State recentBoards!: string[]
  @favBoardsModule.State favBoards!: string[]

  isAddingBoard = false
  currentSearchQuery = ''
  currentBoards: string[] = []

  get boardIds() {
    return Object.keys(this.boards)
  }

  get hasBoards() {
    return this.boardIds.length !== 0
  }

  get filteredBoards() {
    return this.currentBoards.length ||
      (!this.currentBoards.length && this.currentSearchQuery.length)
      ? this.currentBoards
      : this.boardIds
  }

  filterBoards(searchTerm: string) {
    return this.boardIds.filter((boardId) => {
      const isInTitle = this.boards[boardId].name
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase())

      if (isInTitle !== -1) {
        return boardId
      }
    })
  }

  getCurrentQuery(value: string) {
    this.currentSearchQuery = value
  }

  getFilteredBoards(value: string[]) {
    this.currentBoards = value
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/board-list.css';
</style>
