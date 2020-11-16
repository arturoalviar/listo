import App from './app'
import Boards from './board'
import FavBoards from './favBoards'
import Columns from './columns'
import Checklists from './checklists'
import Tasks from './tasks'
import Settings from './settings'
import Spaces from './spaces'

export default interface RootState {
  app: App
  boards: Boards
  favBoards: FavBoards
  columns: Columns
  checklists: Checklists
  tasks: Tasks
  settings: Settings
  spaces: Spaces
}
