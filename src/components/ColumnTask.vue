<template>
  <AppDrop class="listo-column-item-wrapper" @drop="moveBoardItem">
    <AppDrag
      class="listo-card column-item flex items-center flex-wrap mb-6 cursor-pointer"
      :class="classes"
      :transfer-data="{
        type: 'task',
        fromColumnIndex: columnIndex,
        fromTaskIndex: taskIndex,
      }"
      @dragging="updateDragging"
    >
      <div
        v-if="task"
        class="column-item-content w-full flex-shrink-0 py-4 px-4"
        @click.stop="goToTask(taskId)"
      >
        <TaskLabelGroup :board-id="boardId" :task-id="taskId" is-condensed />
        <h3 class="column-item-title w-full flex-shrink-0 font-medium">
          {{ task.name }}
        </h3>
        <div
          class="column-item-content-icons w-full text-sm flex flex-row mt-2"
        >
          <div v-if="task.description" class="column-item-content-icon mr-2">
            <AlignLeftIcon class="w-4 h-4" />
          </div>
          <div
            v-if="task.checklists.length"
            class="column-item-content-icon mr-2"
          >
            <CheckCircleIcon class="w-4 h-4" />
          </div>
        </div>
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { AlignLeftIcon, CheckCircleIcon } from 'vue-feather-icons'

import AppDrag from '@/components/AppDrag.vue'
import AppDrop from '@/components/AppDrop.vue'
import TaskLabelGroup from '@/components/TaskLabelGroup.vue'
import moveBoardItem from '@/mixins/moveBoardItem'

import { Task } from '@/types/tasks'
const tasksModule = namespace('tasks')

@Component({
  name: 'column-task',
  components: {
    AlignLeftIcon,
    CheckCircleIcon,
    AppDrag,
    AppDrop,
    TaskLabelGroup,
  },
})
export default class ColumnTask extends mixins(moveBoardItem) {
  @Prop() boardId!: string
  @Prop() columnIndex!: number
  @Prop() taskId!: string
  @Prop() taskIndex!: number

  @tasksModule.Getter taskById!: (id: string) => Task

  task: null | Task = null

  @Watch('taskId')
  onTaskIdChange(newId: string) {
    this.task = this.taskById(newId)
  }

  get classes() {
    return {
      'is-dragging': this.isDragging,
    }
  }

  mounted() {
    this.task = this.taskById(this.taskId)
  }

  goToTask(taskId: string) {
    this.$router.push({
      name: 'task',
      params: { id: taskId },
    })
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/column-item.css';
</style>
