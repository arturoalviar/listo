<template>
  <div class="listo-labels" :class="classes">
    <h2 class="listo-block-heading">Labels</h2>
    <ul v-if="labels" ref="labelsRef" class="relative flex flex-col w-full">
      <li
        v-for="(label, id, index) in labels"
        :key="'item-label-' + id"
        class="relative flex flex-row flex-no-wrap items-center h-8 w-full mb-4 rounded-md cursor-pointer overflow-hidden z-10"
      >
        <div
          class="listo-label flex w-full items-center pl-4 pr-2 h-8 overflow-hidden"
          :style="{ backgroundColor: label.color }"
          @click.stop="handleLabelClick(id, index)"
        >
          <p
            class="font-medium text-sm truncate"
            :style="{ color: label.textColor }"
          >
            {{ label.name }}
          </p>
        </div>
        <button
          v-if="isTask"
          aria-label="Edit label"
          class="listo-label-edit-button inline-flex items-center justify-center bg-current relative cursor-pointer h-8 w-10 transition-primary z-50"
          :style="{ backgroundColor: label.button }"
          @click="handleLabelClick(id, index, true)"
        >
          <EditIcon class="w-4 h-4" />
        </button>
      </li>
      <li>
        <AppPopover v-model="isAdding">
          <template #content>
            <LabelAddForm
              v-click-out="{
                handler: () => (isAdding = false),
                closeConditional: () => isAdding,
              }"
              :board-id="boardId"
              :unused-labels="unusedLabels"
              @click="closeAddForm"
            />
          </template>
          <AppButton full @click="handleAdd">Add label</AppButton>
        </AppPopover>
      </li>
      <AppPopover v-model="isEditing" :target="target">
        <template #content>
          <LabelEditForm
            v-if="isEditing"
            v-click-out="{
              handler: () => (isEditing = false),
              closeConditional: () => isEditing,
            }"
            :board-id="boardId"
            :index="clickedLabel"
            :label="label"
            @click="closeForm"
          />
        </template>
      </AppPopover>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { EditIcon } from 'vue-feather-icons'

import LabelAddForm from '@/components/LabelAddForm.vue'
import LabelEditForm from '@/components/LabelEditForm.vue'

import Labels, { Label, LabelColor } from '@/types/labels'

const boardModule = namespace('boards')
const labelsModule = namespace('labels')
const tasksModule = namespace('tasks')

@Component({
  name: 'label-group',
  components: {
    EditIcon,
    LabelAddForm,
    LabelEditForm,
  },
})
export default class LabelGroup extends Vue {
  @Prop() boardId!: string
  @Prop() taskId!: string
  @Prop({ default: false }) isTask!: boolean

  @boardModule.Getter('unusedLabels') getUnusedLabels!: (
    id: string
  ) => LabelColor[]

  @labelsModule.Getter boardLabels!: (boardId: string) => Labels
  @tasksModule.Mutation ADD_LABEL_TO_TASK!: (payload: {
    taskId: string
    label: Label
  }) => void

  labels: Labels = {}
  label: Label | null = null
  isAdding = false
  isEditing = false
  clickedLabel = 0
  selectedTop = 0
  selectedWidth = 0
  target: Element | null = null

  $refs!: {
    labelsRef: HTMLInputElement
  }

  get classes() {
    return {
      'is-task': this.isTask,
      'is-settings': !this.isTask,
    }
  }

  get formTop() {
    return `${this.selectedTop}px`
  }

  get formWidth() {
    return `${this.selectedWidth}px`
  }

  get unusedLabels(): LabelColor[] {
    return this.getUnusedLabels(this.boardId)
  }

  mounted() {
    this.labels = this.boardLabels(this.boardId)
    this.target = this.$refs.labelsRef.children[this.clickedLabel]
  }

  closeForm() {
    this.isEditing = false
  }

  closeAddForm() {
    this.isAdding = false
  }

  handleAdd() {
    this.isAdding = true
  }

  handleLabelClick(labelId: string, labelIndex: number, overwrite = false) {
    this.label = this.labels[labelId]
    this.clickedLabel = labelIndex
    if (this.isTask && !overwrite) {
      this.ADD_LABEL_TO_TASK({
        taskId: this.taskId,
        label: this.label,
      })
    } else {
      this.target = this.$refs.labelsRef.children[this.clickedLabel]
      this.isEditing = true
    }
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/label-group.css';
</style>
