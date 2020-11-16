<template>
  <div
    class="task-card bg-card relative flex flex-col flex-grow inset-0 mx-auto px-2 py-4 text-left rounded-lg shadow-lg lg:px-8 lg:py-10"
  >
    <div class="task-card-content w-full px-8">
      <AppCloseButton class="task-close-wrapper px-4 py-6" @click="close" />
      <div class="task-title-wrapper relative mb-4">
        <div
          class="listo-card-title task-title relative mb-2 border border-transparent -ml-2 transition-primary"
        >
          <input
            type="text"
            class="task-title-input relative bg-transparent w-full p-2 text-xl font-medium focus:outline-none"
            :value="task.name"
            placeholder="task title"
            @change="updateTask($event, 'name')"
            @keydown.enter="handleEnter($event, 'name')"
          />
        </div>
        <div class="task-meta text-xs font-medium">
          <p>in: {{ boardName }} / {{ columnName }}</p>
        </div>
      </div>
      <TaskLabelGroup :board-id="boardId" :task-id="task.id" />
      <div class="task-card-body grid gap-8">
        <div class="task-description relative mt-4">
          <TaskMdTextarea
            :content="task.description"
            @change="updateTask($event, 'description')"
          />
          <ChecklistList :task-id="task.id" />
        </div>
        <div class="task-card-controls">
          <div class="controls-add-to-card">
            <h3 class="listo-block-heading">Add to Card</h3>
            <ChecklistControls class="mb-4" :task-id="task.id" />
            <LabelGroup
              :board-id="boardId"
              :task-id="task.id"
              :is-task="true"
            />
          </div>
          <div class="controls-actions">
            <h3 class="listo-block-heading">Actions</h3>
            <AppButton variant="danger" @click="dispatchDeleteTask"
              >Delete</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { namespace } from 'vuex-class'
import { MetaInfo } from 'vue-meta'

import TaskMdTextarea from '@/components/TaskMdTextarea.vue'
import ChecklistList from '@/components/ChecklistList.vue'
import ChecklistControls from '@/components/ChecklistControls.vue'
import LabelGroup from '@/components/LabelGroup.vue'
import TaskLabelGroup from '@/components/TaskLabelGroup.vue'

import escapable from '@/mixins/escapable'

import { Task } from '@/types/tasks'

const boardsModule = namespace('boards')
const tasksModule = namespace('tasks')
const columnsModule = namespace('columns')
const snackbarModule = namespace('snackbar')

Component.registerHooks(['metaInfo'])

@Component({
  name: 'task',
  components: {
    TaskMdTextarea,
    ChecklistList,
    ChecklistControls,
    LabelGroup,
    TaskLabelGroup,
  },
})
export default class TaskView extends mixins(escapable) {
  @boardsModule.Getter('boardName') getBoardName!: (id: string) => string

  @tasksModule.Getter taskById!: (id: string) => Task
  @tasksModule.Action deleteTask!: (id: string) => string
  @tasksModule.Mutation UPDATE_TASK!: (payload: Record<string, unknown>) => void

  @columnsModule.Getter taskIndex!: (payload: Record<string, unknown>) => number
  @columnsModule.Getter('columnName') getColumnName!: (
    payload: string
  ) => string
  @columnsModule.Mutation REMOVE_TASK!: (
    payload: Record<string, unknown>
  ) => void

  @snackbarModule.Mutation SHOW_SNACKBAR!: (
    payload: Record<string, unknown>
  ) => void

  task: Task = {
    id: '',
    boardId: '',
    columnId: '',
    name: '',
    description: '',
    labels: [],
    checklists: [],
  }

  boardName = ''
  columnName = ''

  created() {
    this.task = this.taskById(this.$route.params.id)
    this.boardName = this.getBoardName(this.boardId)
    this.columnName = this.getColumnName(this.task.columnId)
  }

  get boardId() {
    return this.$route.params.uid
  }

  get pageTitle() {
    return this.task?.name
  }

  metaInfo(): MetaInfo {
    return {
      title: this.pageTitle,
    }
  }

  close() {
    this.$router.push({
      name: 'board',
    })
  }

  handleEscKey({ keyCode }: KeyboardEvent) {
    if (this.isEscKey(keyCode)) {
      this.close()
    }
  }

  handleEnter(event: KeyboardEvent, key: string) {
    const value = event.target as HTMLElement
    value.blur()
    this.updateTask(event, key)
  }

  updateTask(event: KeyboardEvent, key: string) {
    const value = (event.target as HTMLInputElement).value
    this.UPDATE_TASK({ id: this.task.id, key, value })
  }

  dispatchDeleteTask() {
    this.$store
      .dispatch('tasks/deleteTask', {
        id: this.task.id,
      })
      .then((taskId) => {
        const { columnId } = this.task
        const taskIndex = this.taskIndex({
          taskId,
          columnId,
        })

        this.SHOW_SNACKBAR({
          message: 'Task deleted.',
        })

        this.REMOVE_TASK({
          columnId,
          taskIndex,
        })
      })

    this.close()
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/views/task.css';
@import '../assets/styles/components/markdown.css';
</style>
