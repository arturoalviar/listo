<template>
  <div v-if="labels.length" :class="classes" class="listo-task-labels">
    <ul class="flex flex-row h-8 mb-4">
      <li
        v-for="(labelId, index) in labels"
        :key="'task-item-label-' + index"
        class="inline-flex rounded-lg px-4 items-center mr-2 font-medium text-xs"
        :style="{ backgroundColor: refLabels[labelId].color }"
      >
        <p
          v-if="!isCondensed"
          class="leading-none"
          :style="{ color: refLabels[labelId].textColor }"
        >
          {{ refLabels[labelId].name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Labels from '@/types/labels'

const labelsModule = namespace('labels')
const tasksModule = namespace('tasks')

@Component({
  name: 'task-label-group',
})
export default class LabelGroup extends Vue {
  @Prop() boardId!: string
  @Prop() taskId!: string
  @Prop({ default: false, type: [Boolean] }) readonly isCondensed!: boolean

  @labelsModule.Getter boardLabels!: (id: string) => Labels
  @tasksModule.Getter('labels') getTaskLabels!: (taskId: string) => string[]

  labels: string[] = []
  refLabels: Labels = {}

  get classes() {
    return {
      'is-condensed': this.isCondensed,
    }
  }

  mounted() {
    this.labels = this.getTaskLabels(this.taskId)
    this.refLabels = this.boardLabels(this.boardId)
  }
}
</script>

<style scoped>
@import '../assets/styles/components/task-label-group.css';
</style>
