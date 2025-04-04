export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  project?: string
  date: string
  startTime: string
  endTime?: string
  isAllDay?: boolean
  isAnytime?: boolean
  color: string
  icon?: string | null
  repeat?: string
  notes?: string
  subTasks?: SubTask[]
  completed: boolean
  priority?: "low" | "medium" | "high"
  category?: string
  progress?: number
  dueDate?: string
  energyRequired?: "low" | "medium" | "high"
  energyLevel?: "low" | "medium" | "high"
}

