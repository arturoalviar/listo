<template>
  <AppDrop class="column" @drop="moveBoardItem">
    <AppDrag
      :transfer-data="{
        type: 'column',
        fromColumnIndex: columnIndex,
      }"
      class="column-inner flex flex-col h-full"
      @dragging="updateDragging"
    >
      <div class="column-header relative mb-6 h-8">
        <div class="column-title-wrapper relative mr-8 font-semibold">
          <input
            ref="editingInput"
            v-model.trim="newColumnName"
            class="bg-transparent w-full p-2 font-semibold leading-none rounded active:bg-input hover:bg-input focus:outline-none focus:bg-input focus-within:bg-input"
            type="text"
            @blur="updateColumnName"
            @keyup.enter="updateColumnName"
          />
        </div>
        <ColumnDropdownMenu
          :board-id="boardId"
          :column-id="columnId"
          :column-index="columnIndex"
          :column-name="column.name"
          :is-dragging="isDragging"
        />
      </div>
      <div
        class="flex flex-col h-full relative pr-2 overflow-y-auto listo-scrollbar show-on-hover"
      >
        <AppToggleInput
          button-text="Add new card"
          @blur="dispatchCreateTask"
          @keyup-enter="dispatchCreateTask"
        >
          <template #icon>
            <PlusIcon class="mr-2 w-4 h-4" />
          </template>
        </AppToggleInput>
        <div v-if="column.tasks.length">
          <ColumnTask
            v-for="({ taskId, isVisible }, taskIndex) of column.tasks"
            :key="'task-' + taskId"
            :class="{ 'is-filtered': !isVisible }"
            :board-id="boardId"
            :column-id="columnId"
            :column-index="columnIndex"
            :task-id="taskId"
            :task-index="taskIndex"
          />
        </div>
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { PlusIcon } from 'vue-feather-icons'

import AppDrag from '@/components/AppDrag.vue'
import AppDrop from '@/components/AppDrop.vue'
import AppToggleInput from '@/components/AppToggleInput.vue'
import ColumnTask from '@/components/ColumnTask.vue'
import ColumnDropdownMenu from '@/components/ColumnDropdownMenu.vue'
import MoveBoardItem from '@/mixins/moveBoardItem'

import { Column } from '@/types/columns'

const columnsModule = namespace('columns')
const tasksModule = namespace('tasks')

@Component({
  name: 'board-column',
  components: {
    ColumnTask,
    ColumnDropdownMenu,
    AppDrag,
    AppDrop,
    AppToggleInput,
    PlusIcon,
  },
})
export default class BoardColumn extends mixins(MoveBoardItem) {
  @columnsModule.Getter columnById!: (id: string) => Column
  @columnsModule.Mutation UPDATE_COLUMN!: (
    payload: Record<string, unknown>
  ) => void
  @columnsModule.Mutation ADD_TASK!: (payload: Record<string, unknown>) => void

  @tasksModule.Action createTask!: (payload: Record<string, unknown>) => void

  @Prop() boardId!: string
  @Prop() columnId!: string
  @Prop() columnIndex!: number

  isEditing = false
  newColumnName = ''
  column: Column = { id: '', boardId: '', name: '', tasks: [] }

  $refs!: {
    editingInput: HTMLInputElement
  }

  mounted() {
    this.column = this.columnById(this.columnId)
    this.newColumnName = this.column.name
  }

  toggleEditingMode() {
    this.isEditing = !this.isEditing
    if (this.isEditing) {
      this.$nextTick(() => this.$refs.editingInput.focus())
    }
  }

  updateColumnName() {
    this.UPDATE_COLUMN({
      id: this.column.id,
      key: 'name',
      value: this.newColumnName,
    })
    this.$nextTick(() => this.$refs.editingInput.blur())
  }

  dispatchCreateTask(value: string) {
    this.$store
      .dispatch('tasks/createTask', {
        columnId: this.column.id,
        boardId: this.boardId,
        name: value,
      })
      .then((newTaskId) => {
        this.ADD_TASK({
          boardId: this.boardId,
          columnId: this.column.id,
          taskId: newTaskId,
        })
      })
  }
}
</script>
