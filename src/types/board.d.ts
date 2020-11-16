import Labels from './labels'

interface Boards {
  boards: BoardsCollection
  recentBoards: string[]
}

interface BoardsCollection {
  [id: string]: Board
}

interface Board {
  readonly id: string
  name: string
  createdAt: Date
  isMenuOpen: boolean
  isFavorite: boolean
  columns: string[]
  labels: Labels
}

export default Boards
export { Boards, Board, BoardsCollection }
