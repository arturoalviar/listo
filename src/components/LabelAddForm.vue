<template>
  <div class="listo-popover-card listo-label-form">
    <p class="listo-popover-card-title">Add label</p>
    <AppCloseButton @click="closeLabelForm" />
    <div class="listo-label-input">
      <label class="listo-input-label" for="label-name-input">Name</label>
      <input
        v-model="currentName"
        class="listo-text-input"
        type="text"
        @keyup.enter="addLabel"
      />
    </div>
    <LabelColorPalette
      :selected-color="defaultLabelOption.color"
      @click="addLabelColor"
    />
    <div class="listo-button-group">
      <AppButton variant="success" @click="addLabel">Create</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import LabelColorPalette from '@/components/LabelColorPalette.vue'

import { colorPalette } from '@/utils/defaultLabels'

const labelsModule = namespace('labels')
import { Label, LabelTemp, LabelColor } from '@/types/labels'

@Component({
  name: 'label-add-form',
  components: {
    LabelColorPalette,
  },
})
export default class LabelEditForm extends Vue {
  @Prop() boardId!: string
  @Prop() unusedLabels!: LabelColor[]

  @labelsModule.Getter boardLabels!: (boardId: string) => Label[]
  @labelsModule.Mutation ADD_LABEL!: (payload: {
    boardId: string
    label: LabelTemp
  }) => void

  @Watch('unusedLabels')
  onUnusedLabelsChanged() {
    this.currentLabel = {
      name: '',
      ...this.defaultLabelOption,
    }
  }

  currentName = ''
  currentLabel = {
    name: '',
    button: '',
    textColor: '',
    color: '',
  }

  get defaultLabelOption() {
    return this.unusedLabels.length ? this.unusedLabels[0] : colorPalette[0]
  }

  mounted() {
    this.currentLabel = {
      name: this.currentName,
      ...this.defaultLabelOption,
    }
  }

  closeLabelForm() {
    this.currentName = ''
    this.$emit('click')

    this.$nextTick(() => {
      this.currentLabel = {
        name: '',
        ...this.defaultLabelOption,
      }
    })
  }

  addLabel() {
    this.currentLabel = {
      ...this.currentLabel,
      name: this.currentName,
    }

    this.ADD_LABEL({
      boardId: this.boardId,
      label: this.currentLabel,
    })

    this.closeLabelForm()
  }

  addLabelColor(label: LabelColor) {
    const { button, textColor, color } = label
    this.currentLabel = {
      ...this.currentLabel,
      button,
      textColor,
      color,
    }
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/label-form.css';
</style>
