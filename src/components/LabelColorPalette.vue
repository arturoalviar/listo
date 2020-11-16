<template>
  <div class="listo-label-color-palette">
    <p class="listo-input-label">Select label color</p>
    <ul class="flex flex-row flex-wrap">
      <li
        v-for="(label, index) in colors"
        :key="'label-color-palette-' + index"
        class="inline-flex mr-4 mb-4"
      >
        <input
          v-model="currentColor"
          class="absolute w-6 h-6 opacity-0 cursor-pointer"
          :aria-label="'Color ' + label.color"
          :style="{
            backgroundColor: label.color,
          }"
          :value="label.color"
          type="radio"
          @click="emitClickedColor(label)"
        />
        <div
          :style="{
            backgroundColor: label.color,
          }"
          class="color-palette-item flex justify-center items-center w-6 h-6 rounded"
        >
          <CheckIcon
            v-if="currentColor === label.color"
            class="w-4 h-4"
            :style="{
              stroke: label.textColor,
            }"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { CheckIcon } from 'vue-feather-icons'

import { colorPalette } from '@/utils/defaultLabels'
import { LabelColor } from '@/types/labels'

@Component({
  name: 'label-color-palette',
  components: {
    CheckIcon,
  },
})
export default class LabelColorPalette extends Vue {
  @Prop() selectedColor!: string
  colors = colorPalette
  currentColor = ''

  @Watch('selectedColor')
  onSelectedColorChange() {
    this.currentColor = this.selectedColor
  }

  mounted() {
    if (this.selectedColor) {
      this.currentColor = this.selectedColor
    }
  }

  emitClickedColor(label: LabelColor) {
    this.$emit('click', label)
  }
}
</script>
