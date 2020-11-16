<template>
  <div v-if="space" class="listo-spaces container px-8">
    <header class="listo-space-header pt-16 pb-20">
      <div
        class="container listo-space-header-container flex justify-between items-start"
      >
        <div class="listo-space-name flex-grow pr-4 w-full">
          <input
            ref="currentSpaceTitle"
            v-model="currentSpaceName"
            type="text"
            class="listo-outline-input listo-page-heading w-full"
            @change="updateSpaceName"
          />
        </div>
        <div class="listo-space-header-settings relative">
          <button
            class="listo-space-settigs-toggle"
            @click.prevent="showDropdown"
          >
            <MoreVerticalIcon />
          </button>
          <SpaceDropdownMenu
            v-if="isDropdownOpen"
            :space-id="id"
            @close="closeDropdown"
            @add-item="dropdownAddItem"
            @edit-name="editSpaceName"
            @delete="dispatchDeleteSpace"
          />
        </div>
      </div>
    </header>
    <div class="container space-board-list-wrapper mt-12">
      <div class="listo-section-header">
        <h2 class="listo-section-heading">Boards</h2>
        <AppSearchFilter
          placeholder="Filter boards"
          rounded
          :search="filterBoards"
          @input="getCurrentQuery"
          @searched="getFilteredBoards"
        />
      </div>
      <div
        v-if="spaceBoards"
        class="space-board-list grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          class="listo-card listo-button-card bg-primary relative col-span-1 overflow-hidden border z-0"
        >
          <a href="#" @click.prevent="showBoardOptions">
            <div class="flex items-center pl-6 pr-12 h-32 justify-center">
              <h2 class="font-semibold text-xl text-white">
                Edit space boards
              </h2>
            </div>
          </a>
        </div>
        <BoardListCard
          v-for="board in spaceBoards"
          :id="board"
          :key="'space-board--' + board"
          :name="boards[board].name"
        />
      </div>

      <AppModal v-model="isEditingBoards" is-top>
        <SpaceAddForm
          :space-id="space.id"
          :space-boards="space.boards"
          @completed="isEditingBoards = false"
        />
      </AppModal>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { namespace } from 'vuex-class'
import { MetaInfo } from 'vue-meta'
import { MoreVerticalIcon } from 'vue-feather-icons'

import AppModal from '@/components/AppModal.vue'
import AppSearchFilter from '@/components/AppSearchFilter.vue'
import BoardListCard from '@/components/BoardListCard.vue'
import SpaceAddForm from '@/components/SpaceAddForm.vue'
import SpaceDropdownMenu from '@/components/SpaceDropdownMenu.vue'

import MenuToggleable from '@/mixins/menuToggleable'

import { BoardsCollection } from '@/types/board'
import { Space } from '@/types/spaces'

const boardsModule = namespace('boards')
const spacesModule = namespace('spaces')
const snackbarModule = namespace('snackbar')

Component.registerHooks(['metaInfo'])

@Component({
  name: 'space',
  components: {
    AppModal,
    AppSearchFilter,
    BoardListCard,
    SpaceAddForm,
    SpaceDropdownMenu,
    MoreVerticalIcon,
  },
})
export default class SpaceView extends mixins(MenuToggleable) {
  @boardsModule.State boards!: BoardsCollection
  @snackbarModule.Mutation SHOW_SNACKBAR!: (
    payload: Record<string, unknown>
  ) => void
  @spacesModule.Getter spaceById!: (id: string) => Space
  @spacesModule.Action deleteSpace!: (payload: { id: string }) => void
  @spacesModule.Mutation UPDATE_SPACE!: (payload: {
    spaceId: string
    key: string
    value: string
  }) => void

  space: null | Space = null
  currentSpaceName = ''
  currentSearchQuery = ''
  currentBoards: string[] = []
  isEditingBoards = false

  $refs!: {
    currentSpaceTitle: HTMLInputElement
  }

  get id() {
    return this.$route.params.id
  }

  get spaceBoards() {
    return this.currentBoards.length ||
      (!this.currentBoards.length && this.currentSearchQuery.length)
      ? this.currentBoards
      : this.space?.boards
  }

  get pageTitle() {
    return this.space?.name
  }

  metaInfo(): MetaInfo {
    return {
      title: `${this.pageTitle} | Listo`,
    }
  }

  mounted() {
    this.space = this.spaceById(this.id)
    this.currentSpaceName = this.space.name
  }

  updateSpaceName() {
    if (this.space?.name !== this.currentSpaceName) {
      this.UPDATE_SPACE({
        spaceId: this.id,
        key: 'name',
        value: this.currentSpaceName,
      })
    }
  }

  editSpaceName() {
    this.closeDropdown()
    this.$nextTick(() => {
      this.$refs.currentSpaceTitle.focus()
    })
  }

  showBoardOptions() {
    this.isEditingBoards = true
  }

  dropdownAddItem() {
    this.closeDropdown()
    this.showBoardOptions()
  }

  filterBoards(searchTerm: string) {
    return this.space?.boards.filter((boardId) => {
      const isInTitle = this.boards[boardId].name
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase())

      if (isInTitle !== -1) {
        return boardId
      }
    })
  }

  async dispatchDeleteSpace() {
    this.closeDropdown()
    const confirm = await this.$root.$globalDialog.open({
      title: 'Delete Space',
      description:
        'This action will only delete this space; No boards in this space will be affected.',
      actionLabel: 'Delete',
      variant: 'danger',
    })
    if (confirm) {
      this.$store
        .dispatch('spaces/deleteSpace', { spaceId: this.id })
        .then(() => {
          this.$router
            .push({
              name: 'spaces',
            })
            .then(() => {
              this.SHOW_SNACKBAR({
                message: 'Space deleted',
              })
            })
        })
    }
  }

  getCurrentQuery(value: string) {
    this.currentSearchQuery = value
  }

  getFilteredBoards(value: string[]) {
    this.currentBoards = value
  }
}
</script>

<style lang="css">
@import '../assets/styles/views/space.css';
</style>
