<template>
  <div>
    <transition name="fade">
      <div
        v-show="!enableTransitions"
        class="listo-checkbox-item listo-checklist-item relative flex flex-row p-2 rounded hover:bg-bg"
      >
        <div class="listo-checkbox-wrapper">
          <input
            v-model="item.completed"
            type="checkbox"
            @change="toggleItemCompleted($event)"
          />
          <div class="listo-checkbox">
            <CheckIcon />
          </div>
        </div>
        <div
          class="listo-checklist-label-wrapper flex flex-1 pr-4 items-center"
        >
          <label
            v-show="!isEditing"
            ref="checklistEditingLabel"
            class="listo-input-label checklist-label"
            :class="classes"
            @click="editLabel({ label: item.label })"
            >{{ item.label }}</label
          >
          <textarea
            v-show="isEditing"
            ref="checklistEditingInput"
            v-model.trim="currentItemLabel"
            class="listo-text-input checklist-input"
            type="text"
            @blur="exitEditMode"
            @input="adjustTextareaSize"
            @keydown.enter.exact="updateLabel"
            @keydown.enter.shift.exact="addNewlineToTextarea"
          />
          <div
            class="listo-checklist-item-controls relative flex flex-col justify-center items-center w-8 h-8 opacity-0 transition-primary"
          >
            <button aria-label="delete checklist item" @click="deleteItem">
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { CheckIcon, TrashIcon } from 'vue-feather-icons'

import { ChecklistItem } from '@/types/checklists'

const checklistsModule = namespace('checklists')

@Component({
  name: 'checklist-item',
  components: {
    CheckIcon,
    TrashIcon,
  },
})
export default class ChecklistItemComponent extends Vue {
  @Prop() checklistId!: string
  @Prop() item!: ChecklistItem
  @Prop() index!: number
  @Prop() showCompleted!: boolean

  @checklistsModule.Mutation UPDATE_CHECKLIST_ITEM!: (
    payload: Record<string, unknown>
  ) => void
  @checklistsModule.Mutation DELETE_CHECKLIST_ITEM!: (
    payload: Record<string, unknown>
  ) => void

  currentItemLabel = ''
  isEditing = false

  $refs!: {
    checklistEditingInput: HTMLInputElement
    checklistEditingLabel: HTMLInputElement
  }

  get classes() {
    return {
      'is-completed line-through opacity-50': this.item.completed,
    }
  }

  get enableTransitions() {
    return !this.showCompleted && this.item.completed
  }

  mounted() {
    this.$refs.checklistEditingInput.style.height = `${
      this.$refs.checklistEditingLabel.getBoundingClientRect().height
    }px`
  }

  adjustTextareaSize() {
    this.$refs.checklistEditingInput.style.height = '5px'
    this.$refs.checklistEditingInput.style.height = `${this.$refs.checklistEditingInput.scrollHeight}px`
  }

  addNewlineToTextarea() {
    this.currentItemLabel = `${this.currentItemLabel}\n`
  }

  deleteItem() {
    this.DELETE_CHECKLIST_ITEM({
      checklistId: this.checklistId,
      index: this.index,
    })
  }

  exitEditMode() {
    this.isEditing = false
  }

  toggleItemCompleted($event: MouseEvent) {
    const currentTarget = $event.target as HTMLInputElement

    this.UPDATE_CHECKLIST_ITEM({
      checklistId: this.checklistId,
      index: this.index,
      key: 'completed',
      value: currentTarget.checked,
    })
  }

  editLabel(options: { label: string; isEditing?: boolean }) {
    const { label, isEditing } = options
    this.isEditing = isEditing || true
    this.currentItemLabel = label
    if (this.isEditing) {
      this.$nextTick(() => {
        this.$refs.checklistEditingInput.focus()
      })
    }
  }

  updateLabel() {
    this.isEditing = false
    this.UPDATE_CHECKLIST_ITEM({
      checklistId: this.checklistId,
      index: this.index,
      key: 'label',
      value: this.currentItemLabel,
    })
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/checklist-item.css';
</style>
