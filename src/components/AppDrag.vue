<template>
  <div
    draggable="true"
    @dragstart.self="onDrag"
    @dragover.prevent
    @dragenter.prevent
    @dragend.self="onDragEnd"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'app-drag',
})
export default class AppDrag extends Vue {
  @Prop() transferData!: Record<string, unknown>

  onDrag(event: DragEvent) {
    const currentEvent = event.dataTransfer as DataTransfer
    currentEvent.effectAllowed = 'move'
    currentEvent.dropEffect = 'move'

    currentEvent.setData('payload', JSON.stringify(this.transferData))

    this.$emit('dragging', true)
  }

  onDragEnd() {
    this.$emit('dragging', false)
  }
}
</script>
