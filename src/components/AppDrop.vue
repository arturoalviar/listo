<template>
  <div @drop.stop="onDrop" @dragover.prevent @dragenter.prevent>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'app-drop',
})
export default class AppDrag extends Vue {
  onDrop(event: DragEvent) {
    const currentEvent = event.dataTransfer as DataTransfer

    const transferData = JSON.parse(currentEvent.getData('payload'))

    this.$emit('drop', transferData)
  }
}
</script>
