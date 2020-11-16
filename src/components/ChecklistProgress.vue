<template>
  <div
    class="listo-checklist-progress-container flex flex-row w-full px-2 mt-2"
  >
    <div class="checklist-progress-status mr-4">{{ currentProgress }}</div>
    <div
      class="checklist-progress-bar bg-input relative flex-grow h-4 rounded-lg overflow-hidden"
    >
      <div
        class="checklist-progress bg-primary absolute left-0 top-0 h-full rounded-lg transition-primary duration-200"
        :style="styles"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'checklist-progress',
})
export default class ChecklistProgress extends Vue {
  @Prop() checklistId!: string
  @Prop() checklistSize!: number
  @Prop() checklistCompleted!: number

  get currentProgress() {
    return `${this.checklistCompleted}/${this.checklistSize}`
  }

  get styles() {
    return {
      width: `${(this.checklistCompleted / this.checklistSize) * 100}%`,
    }
  }
}
</script>
