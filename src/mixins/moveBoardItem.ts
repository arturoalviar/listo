import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { TransferDataPayload } from '@/types/moveBoardItem'

const boardModule = namespace('boards')
const columnsModule = namespace('columns')
const tasksModule = namespace('tasks')

@Component({
  name: 'MoveBoardItem',
})
export default class MoveBoardItem extends Vue {
  @boardModule.Getter('columns') getBoardColumns!: (payload: string) => string[]
  @boardModule.Mutation MOVE_COLUMN!: (payload: Record<string, unknown>) => void

  @columnsModule.Action moveTask!: (payload: Record<string, unknown>) => void

  @tasksModule.Mutation UPDATE_TASK!: (payload: Record<string, unknown>) => void

  @Prop() boardId!: string
  @Prop() columnId!: string
  @Prop() taskIndex!: number
  @Prop() columnIndex!: number

  columns: string[] = []
  isDragging = false

  mounted() {
    this.columns = this.getBoardColumns(this.boardId)
  }

  moveBoardItem(transferData: TransferDataPayload) {
    const { type } = transferData

    if (type === 'task') {
      this.dispatchMoveTask(transferData)
    } else {
      this.moveColumn(transferData)
    }
  }

  dispatchMoveTask({ fromColumnIndex, fromTaskIndex }: TransferDataPayload) {
    const fromColumnId = this.columns[fromColumnIndex]

    this.$store
      .dispatch('columns/moveTask', {
        fromColumnId,
        fromTaskIndex,
        toColumnId: this.columnId,
        toTaskIndex: this.taskIndex,
      })
      .then(({taskId}) => {
        this.UPDATE_TASK({
          id: taskId,
          key: 'columnId',
          value: this.columnId,
        })
      })
  }

  moveColumn({ fromColumnIndex }: TransferDataPayload) {
    this.MOVE_COLUMN({
      fromColumnIndex,
      toColumnIndex: this.columnIndex,
      boardId: this.boardId,
    })
  }

  updateDragging(value: boolean) {
    this.isDragging = value
  }
}
