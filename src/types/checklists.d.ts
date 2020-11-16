interface Checklists {
  checklists: ChecklistCollection
}

interface ChecklistCollection {
  [id: string]: Checklist
}

interface ChecklistItem {
  label: string
  completed: boolean
}

interface Checklist {
  readonly id: string
  taskId: string
  name: string
  showCompleted: boolean
  items: ChecklistItem[]
}

export default Checklists
export { Checklists, ChecklistCollection, Checklist, ChecklistItem }
