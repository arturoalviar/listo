interface Columns {
  columns: ColumnCollection
}

interface ColumnCollection {
  [columnId: string]: Column
}

interface ColumnTask {
  taskId: string
  isVisible: boolean
}

interface Column {
  readonly id: string
  boardId: string
  name: string
  tasks: ColumnTask[]
}

type ColumnKey = 'name' | 'tasks'

export default Columns
export { Column, ColumnCollection, ColumnKey, ColumnTask }
