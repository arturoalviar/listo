interface Tasks {
  tasks: TaskCollection
}

interface TaskCollection {
  [taskId: string]: Task
}

interface Task {
  readonly id: string
  boardId: string
  columnId: string
  name: string
  description: string
  checklists: string[]
  labels: string[]
}

type TaskKey = 'name' | 'description'

export default Tasks
export { Task, TaskKey, TaskCollection }
