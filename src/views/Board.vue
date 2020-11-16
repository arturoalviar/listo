<template>
  <div v-if="board" class="board">
    <div class="board-header grid items-center pr-6 gap-4">
      <BoardTitle :id="board.id" :title="board.name" />
      <div class="board-header-controls flex justify-end items-end ml-auto">
        <BoardFavorite
          :board-id="board.id"
          class="board-header-fav-toggle mr-4 text-xl"
        />
        <AppButton class="board-header-menu-button" @click="toggleBoardMenu"
          >Show Menu</AppButton
        >
      </div>
    </div>
    <div class="columns listo-scrollbar">
      <BoardColumn
        v-for="(columnId, columnIndex) of board.columns"
        :key="'column-' + columnId"
        :board-id="id"
        :column-index="columnIndex"
        :column-id="columnId"
      />

      <div class="column pr-6">
        <div class="column-inner">
          <AppToggleInput
            button-text="Add new column"
            @keyup-enter="dispatchCreateColumn"
          >
            <template #icon>
              <PlusIcon class="mr-2 w-4 h-4" />
            </template>
          </AppToggleInput>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isTaskOpen"
        class="task-bg inset-0 fixed z-10 flex flex-col py-10 overflow-x-hidden overflow-y-auto"
        @close="closeTaskView"
        @click.self="closeTaskView"
      >
        <router-view />
      </div>
    </transition>
    <BoardSettings
      :id="id"
      :is-visible="openMenu"
      @close-board-menu="toggleBoardMenu"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { MetaInfo } from 'vue-meta'
import { PlusIcon } from 'vue-feather-icons'

import AppToggleInput from '@/components/AppToggleInput.vue'
import BoardColumn from '@/components/BoardColumn.vue'
import BoardFavorite from '@/components/BoardFavorite.vue'
import BoardTitle from '@/components/BoardTitle.vue'
import BoardSettings from '@/components/BoardSettings.vue'
import { Board } from '@/types/board'

const boardModule = namespace('boards')
const columnModule = namespace('columns')

Component.registerHooks(['metaInfo'])

@Component({
  name: 'board',
  components: {
    AppToggleInput,
    BoardColumn,
    BoardFavorite,
    BoardTitle,
    BoardSettings,
    PlusIcon,
  },
})
export default class BoardView extends Vue {
  @boardModule.Getter('board') boardGetter!: (id: string) => Board
  @boardModule.Mutation TOGGLE_MENU!: (payload: Record<string, unknown>) => void
  @boardModule.Mutation ADD_COLUMN!: (payload: Record<string, unknown>) => void
  @boardModule.Mutation ADD_RECENT_BOARD!: (payload: string) => void

  @columnModule.Action createColumn!: (
    payload: Record<string, unknown>
  ) => string

  openMenu = false
  board: null | Board = null

  mounted() {
    this.board = this.boardGetter(this.id)
    this.openMenu = this.board.isMenuOpen
    this.ADD_RECENT_BOARD(this.id)
  }

  get id() {
    return this.$route.params.uid
  }

  get isTaskOpen() {
    return this.$route.name === 'task'
  }

  get pageTitle() {
    return this.board?.name
  }

  metaInfo(): MetaInfo {
    return {
      title: this.pageTitle,
    }
  }

  toggleBoardMenu() {
    this.openMenu = !this.openMenu
    this.TOGGLE_MENU({
      id: this.id,
      isMenuOpen: this.openMenu,
    })
  }

  closeTaskView() {
    this.$router.push({
      name: 'board',
    })
  }

  dispatchCreateColumn(value: string) {
    this.$store
      .dispatch('columns/createColumn', {
        name: value,
        boardId: this.board?.id,
      })
      .then((newColumnId) => {
        this.ADD_COLUMN({
          boardId: this.board?.id,
          columnId: newColumnId,
        })
      })
  }
}
</script>

<style lang="css">
@import '../assets/styles/views/board-global.css';
</style>

<style lang="css" scoped>
@import '../assets/styles/views/board.css';
</style>
