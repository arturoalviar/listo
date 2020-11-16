import { BoardsCollection } from './board'
import { ColumnCollection } from './columns'
import { ChecklistCollection } from './checklists'
import { TaskCollection } from './tasks'
import { SpacesCollection } from './spaces'

export interface AppUploadData {
  boards: BoardsCollection
  columns: ColumnCollection
  checklists: ChecklistCollection
  tasks: TaskCollection
  spaces: SpacesCollection
  favBoards: string[]
}

export interface App {
  hasCompletedSetup: boolean
}

export default App
