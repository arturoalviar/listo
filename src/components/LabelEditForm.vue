<template>
  <div class="listo-popover-card listo-label-form">
    <p class="listo-popover-card-title">Edit label</p>
    <AppCloseButton @click="closeLabelForm" />
    <div class="listo-label-input">
      <label class="listo-input-label" for="label-name-input">Name</label>
      <input
        v-model="currentName"
        class="listo-text-input"
        type="text"
        @keyup.enter="updateLabel"
      />
    </div>
    <LabelColorPalette
      :selected-color="label.color"
      @click="updateLabelColor"
    />
    <div class="listo-button-group">
      <AppButton variant="success" @click="updateLabel">Save</AppButton>
      <AppButton variant="danger" @click="deleteLabel">Delete</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import LabelColorPalette from '@/components/LabelColorPalette.vue'

const labelsModule = namespace('labels')
import { Label, LabelColor } from '@/types/labels'

@Component({
  name: 'label-edit-form',
  components: {
    LabelColorPalette,
  },
})
export default class LabelEditForm extends Vue {
  @Prop() boardId!: string
  @Prop() index!: number
  @Prop() label!: Label

  @labelsModule.Getter boardLabels!: (boardId: string) => Label[]
  @labelsModule.Mutation UPDATE_LABEL!: (payload: {
    boardId: string
    labelId: string
    label: Label
  }) => void
  @labelsModule.Mutation DELETE_LABEL!: (payload: {
    boardId: string
    labelId: string
  }) => void

  currentName = ''
  currentLabel!: Label

  mounted() {
    this.currentLabel = this.label
    this.currentName = this.label.name
  }

  closeLabelForm() {
    this.$emit('click')
  }

  updateLabel() {
    this.currentLabel = {
      ...this.currentLabel,
      name: this.currentName,
    }

    this.UPDATE_LABEL({
      boardId: this.boardId,
      labelId: this.currentLabel.id,
      label: this.currentLabel,
    })

    this.closeLabelForm()
  }

  updateLabelColor(label: LabelColor) {
    const { button, textColor, color } = label
    this.currentLabel = {
      ...this.currentLabel,
      button,
      textColor,
      color,
    }
  }

  deleteLabel() {
    this.DELETE_LABEL({
      boardId: this.boardId,
      labelId: this.currentLabel.id,
    })

    this.closeLabelForm()
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/label-form.css';
</style>
