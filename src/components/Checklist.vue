<template>
  <div v-if="checklist" class="listo-checklist">
    <header class="listo-checklist-header relative flex flex-row w-full">
      <div class="listo-icon-heading flex-1">
        <CheckCircleIcon />
        <input
          ref="checklistTitleInput"
          v-model="currentChecklistTitle"
          class="listo-outline-input listo-block-heading listo-checklist-title-input block w-full p-2 border border-transparent m-0 transition-primary hover:border-current active:border-current focus:border-current focus-within:border-current"
          @keyup.enter="updateChecklistName"
          @blur="updateChecklistName"
        />
      </div>
      <div
        class="listo-checklist-options flex flex-row items-center opacity-0 ml-2 transition-primary"
        :style="menuButtonStyles"
      >
        <button
          class="inline-flex self-center px-2"
          aria-label="Toggle checklist dropdown"
          @click.prevent="showDropdown"
        >
          <MoreHorizontalIcon />
        </button>
      </div>
      <ChecklistDropdownMenu
        v-if="isDropdownOpen"
        :checklist-id="checklistId"
        :task-id="checklist.taskId"
        :items-count="checklist.items.length"
        :completed-count="completed.length"
        :show-completed="checklist.showCompleted"
        @close="closeDropdown"
        @add-item="menuFocusAddForm"
        @edit-name="menuFocusTitle"
        @toggle-show-completed="menuToggleShowCompleted"
      />
    </header>

    <ChecklistProgress
      :checklist-id="checklistId"
      :checklist-size="checklist.items.length"
      :checklist-completed="completed.length"
    />

    <ul class="checklist-items">
      <li
        v-for="(item, index) in checklist.items"
        :key="'checklist-item-' + index"
      >
        <ChecklistItem
          :checklist-id="checklistId"
          :item="item"
          :index="index"
          :show-completed="checklist.showCompleted"
        />
      </li>
    </ul>
    <div class="checklist-item-add-form flex flex-row w-full pt-2">
      <div class="checklist-item-add-button-wrapper h-8 px-2 mr-2">
        <button
          class="w-6 h-8 text-center transition-primary"
          aria-label="Add item"
          :aria-disabled="!newChecklistItemLabel.length"
          :disabled="!newChecklistItemLabel.length"
          :class="{
            'opacity-25 cursor-not-allowed': !newChecklistItemLabel.length,
          }"
          @click="addNewChecklistItem"
        >
          <PlusIcon />
        </button>
      </div>
      <input
        ref="checklistAddingInput"
        v-model="newChecklistItemLabel"
        class="listo-text-input listo-outline-input"
        type="text"
        placeholder="Add an item to checklist"
        @keyup.enter="addNewChecklistItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import {
  CheckCircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from 'vue-feather-icons'
import ChecklistDropdownMenu from '@/components/ChecklistDropdownMenu.vue'
import ChecklistItem from '@/components/ChecklistItem.vue'
import ChecklistProgress from '@/components/ChecklistProgress.vue'

import MenuToggleable from '@/mixins/menuToggleable'

import { Checklist } from '@/types/checklists'

const checklistModule = namespace('checklists')

@Component({
  name: 'checklist',
  components: {
    CheckCircleIcon,
    MoreHorizontalIcon,
    PlusIcon,
    ChecklistDropdownMenu,
    ChecklistItem,
    ChecklistProgress,
  },
})
export default class ChecklistComponent extends mixins(MenuToggleable) {
  @Prop() checklistId!: string

  @checklistModule.Getter('checklist') getChecklist!: (id: string) => Checklist
  @checklistModule.Mutation ADD_ITEM_TO_CHECKLIST!: (
    payload: Record<string, unknown>
  ) => void
  @checklistModule.Mutation UPDATE_CHECKLIST!: (
    payload: Record<string, unknown>
  ) => void

  newChecklistItemLabel = ''
  currentChecklistTitle = ''
  isAdding = false
  checklist: Checklist = {
    id: '',
    taskId: '',
    name: '',
    showCompleted: true,
    items: [],
  }

  $refs!: {
    checklistAddingInput: HTMLInputElement
    checklistTitleInput: HTMLInputElement
  }

  get menuButtonStyles() {
    return {
      opacity: this.isDropdownOpen ? '1' : '',
    }
  }

  get completed() {
    return this.checklist.items.filter((checklist) => {
      if (checklist.completed) {
        return checklist
      }
    })
  }

  mounted() {
    this.checklist = this.getChecklist(this.checklistId)
    this.currentChecklistTitle = this.checklist.name
  }

  updateChecklistName() {
    this.UPDATE_CHECKLIST({
      id: this.checklistId,
      key: 'name',
      value: this.currentChecklistTitle,
    })
  }

  toggleShowCompleted() {
    this.UPDATE_CHECKLIST({
      id: this.checklistId,
      key: 'showCompleted',
      value: !this.checklist.showCompleted,
    })
  }

  menuToggleShowCompleted() {
    this.closeDropdown()
    this.toggleShowCompleted()
  }

  menuFocusAddForm() {
    this.closeDropdown()
    this.$nextTick(() => {
      this.$refs.checklistAddingInput.focus()
    })
  }

  menuFocusTitle() {
    this.closeDropdown()
    this.$nextTick(() => {
      this.$refs.checklistTitleInput.focus()
    })
  }

  addNewChecklistItem() {
    this.ADD_ITEM_TO_CHECKLIST({
      checklistId: this.checklistId,
      label: this.newChecklistItemLabel,
    })

    this.newChecklistItemLabel = ''
  }

  setAddingMode(mode = true) {
    this.isAdding = mode
    if (mode) {
      this.$nextTick(() => {
        this.$refs.checklistAddingInput.focus()
      })
    }
  }

  exitAddingMode() {
    this.isAdding = false
  }
}
</script>

<style lang="css" scoped>
.listo-checklist-header {
  &:hover .listo-checklist-options {
    @apply opacity-100;
  }
}
</style>
