<template>
  <div class="column-options-wrapper absolute top-0 right-0 w-6 h-8">
    <button class="w-6 h-8 focus:outline-none" @click="showDropdown">
      <MoreHorizontalIcon />
    </button>
    <div
      v-if="isDropdownOpen"
      v-click-out="closeDropdown"
      class="listo-dropdown-menu-wrapper"
    >
      <ul v-if="!isCopyingColumn">
        <li class="listo-dropdown-menu-item" @click="deleteItemsInColumn">
          <div class="listo-dropdown-menu-item-content">
            <div class="listo-dropdown-menu-item-icon">
              <XCircleIcon />
            </div>
            <div class="listo-dropdown-menu-item-content">
              Delete all itmes in column
            </div>
          </div>
        </li>
        <li class="listo-dropdown-menu-divider" />
        <li class="listo-dropdown-menu-item" @click="showCopyColumnForm">
          <div class="listo-dropdown-menu-item-icon">
            <CopyIcon />
          </div>
          <div class="listo-dropdown-menu-item-content">Copy column</div>
        </li>
        <li class="listo-dropdown-menu-item" @click="dispatchDeleteColumn">
          <div class="listo-dropdown-menu-item-icon">
            <TrashIcon />
          </div>
          <div class="listo-dropdown-menu-item-content">Delete Column</div>
        </li>
      </ul>

      <div v-if="isCopyingColumn" class="column-copy-form p-4">
        <div class="column-copy-form-header relative flex flex-row mb-4">
          <button
            class="absolute top-0 left-0"
            @click="isCopyingColumn = false"
          >
            <ArrowLeftIcon class="w-4 h-4" />
          </button>
          <div
            class="column-copy-title font-semibold text-sm leading-none text-center w-full"
          >
            Copy Column
          </div>
        </div>
        <input
          v-model="copyColumnTitle"
          class="listo-text-input"
          type="text"
          @keyup.enter="dispatchCopyColumn"
        />
        <AppButton variant="success" @click="dispatchCopyColumn"
          >Create List</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import {
  ArrowLeftIcon,
  CopyIcon,
  MoreHorizontalIcon,
  TrashIcon,
  XCircleIcon,
} from 'vue-feather-icons'

import MenuToggleable from '@/mixins/menuToggleable'

const boardModule = namespace('boards')
const columnsModule = namespace('columns')
const snackbarModule = namespace('snackbar')

@Component({
  name: 'column-dropdown-menu',
  components: {
    ArrowLeftIcon,
    CopyIcon,
    MoreHorizontalIcon,
    TrashIcon,
    XCircleIcon,
  },
})
export default class ColumnDropdownMenu extends mixins(MenuToggleable) {
  @boardModule.Mutation INSERT_COLUMN!: (
    payload: Record<string, unknown>
  ) => void
  @boardModule.Mutation DELETE_COLUMN!: (
    payload: Record<string, unknown>
  ) => void

  @columnsModule.Mutation DELETE_TASKS_IN_COLUMN!: (
    payload: Record<string, unknown>
  ) => void
  @columnsModule.Action copyColumn!: (
    payload: Record<string, unknown>
  ) => string
  @columnsModule.Action deleteColumn!: (
    payload: Record<string, unknown>
  ) => string

  @snackbarModule.Mutation SHOW_SNACKBAR!: (
    payload: Record<string, unknown>
  ) => void

  @Prop() boardId!: string
  @Prop() columnId!: string
  @Prop() columnIndex!: number
  @Prop() columnName!: string
  @Prop() isDragging!: boolean

  copyColumnTitle = ''
  isCopyingColumn = false

  @Watch('isDragging')
  onIsDraggingChnage() {
    this.isDropdownOpen = false
  }

  showCopyColumnForm() {
    this.copyColumnTitle = this.columnName
    this.isCopyingColumn = true
  }

  dispatchCopyColumn() {
    this.$store
      .dispatch('columns/copyColumn', {
        id: this.columnId,
        index: this.columnIndex,
        name: this.copyColumnTitle,
      })
      .then(({ id, index }) => {
        this.INSERT_COLUMN({
          boardId: this.boardId,
          columnId: id,
          startIndex: index,
        })

        this.SHOW_SNACKBAR({
          message: 'Column copied',
        })

        this.closeDropdown()
        this.isCopyingColumn = false
      })
  }

  deleteItemsInColumn() {
    this.DELETE_TASKS_IN_COLUMN({ id: this.columnId })
    this.closeDropdown()
  }

  dispatchDeleteColumn() {
    this.closeDropdown()
    this.$store
      .dispatch('columns/deleteColumn', {
        id: this.columnId,
      })
      .then(() => {
        this.SHOW_SNACKBAR({
          message: 'Column deleted',
        })

        this.DELETE_COLUMN({
          boardId: this.boardId,
          columnIndex: this.columnIndex,
        })
      })
  }
}
</script>