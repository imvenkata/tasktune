"use client"

import { useState } from "react"
import { X, Calendar, Clock, Flag, CheckCircle2, Plus, Edit2, Trash2, Save, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, SubTask } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { ICON_COLLECTION } from "@/components/icons"

interface TaskDetailViewProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export default function TaskDetailView({ task, onClose, onUpdate, onDelete }: TaskDetailViewProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>({ ...task })
  const [newSubtask, setNewSubtask] = useState("")
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false)

  const calculateProgress = (subtasks?: SubTask[]): number => {
    if (!subtasks || subtasks.length === 0) return task.completed ? 100 : 0
    const completedCount = subtasks.filter((st) => st.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  const toggleSubtask = (subtaskId: string) => {
    if (!editedTask.subTasks) return

    const updatedSubtasks = editedTask.subTasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st,
    )

    const progress = calculateProgress(updatedSubtasks)
    setEditedTask({
      ...editedTask,
      subTasks: updatedSubtasks,
      progress,
      completed: progress === 100,
    })
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return

    const newSubtaskItem: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtask,
      completed: false,
    }

    const updatedSubtasks = [...(editedTask.subTasks || []), newSubtaskItem]
    setEditedTask({
      ...editedTask,
      subTasks: updatedSubtasks,
      progress: calculateProgress(updatedSubtasks),
    })
    setNewSubtask("")
  }

  const removeSubtask = (subtaskId: string) => {
    if (!editedTask.subTasks) return

    const updatedSubtasks = editedTask.subTasks.filter((st) => st.id !== subtaskId)
    setEditedTask({
      ...editedTask,
      subTasks: updatedSubtasks,
      progress: calculateProgress(updatedSubtasks),
    })
  }

  const generateAISubtasks = () => {
    setIsGeneratingSubtasks(true)

    // Simulate AI generation (in a real app, this would call an AI service)
    setTimeout(() => {
      const aiGeneratedSubtasks = generateSubtasksForTitle(editedTask.title)
      setEditedTask({
        ...editedTask,
        subTasks: [...(editedTask.subTasks || []), ...aiGeneratedSubtasks],
      })
      setIsGeneratingSubtasks(false)
    }, 1000)
  }

  // Helper function to generate relevant subtasks based on the task title
  const generateSubtasksForTitle = (taskTitle: string) => {
    const lowercaseTitle = taskTitle.toLowerCase()
    let generatedSubtasks: SubTask[] = []

    if (lowercaseTitle.includes("meeting") || lowercaseTitle.includes("call")) {
      generatedSubtasks = [
        { id: generateId(), title: "Prepare agenda", completed: false },
        { id: generateId(), title: "Send calendar invites", completed: false },
        { id: generateId(), title: "Prepare presentation slides", completed: false },
        { id: generateId(), title: "Take meeting notes", completed: false },
        { id: generateId(), title: "Send follow-up email", completed: false },
      ]
    } else if (lowercaseTitle.includes("report") || lowercaseTitle.includes("document")) {
      generatedSubtasks = [
        { id: generateId(), title: "Gather necessary data", completed: false },
        { id: generateId(), title: "Create outline", completed: false },
        { id: generateId(), title: "Write first draft", completed: false },
        { id: generateId(), title: "Review and edit", completed: false },
        { id: generateId(), title: "Format document", completed: false },
        { id: generateId(), title: "Submit for approval", completed: false },
      ]
    } else if (lowercaseTitle.includes("project") || lowercaseTitle.includes("develop")) {
      generatedSubtasks = [
        { id: generateId(), title: "Define project scope", completed: false },
        { id: generateId(), title: "Create project timeline", completed: false },
        { id: generateId(), title: "Assign responsibilities", completed: false },
        { id: generateId(), title: "Implement core features", completed: false },
        { id: generateId(), title: "Test functionality", completed: false },
        { id: generateId(), title: "Review and finalize", completed: false },
      ]
    } else {
      // Default subtasks for any other type of task
      generatedSubtasks = [
        { id: generateId(), title: "Research and plan", completed: false },
        { id: generateId(), title: "Prepare materials", completed: false },
        { id: generateId(), title: "Execute main task", completed: false },
        { id: generateId(), title: "Review results", completed: false },
        { id: generateId(), title: "Follow up if needed", completed: false },
      ]
    }

    return generatedSubtasks
  }

  const saveChanges = () => {
    onUpdate(editedTask)
  }

  const toggleTaskCompletion = () => {
    const completed = !editedTask.completed

    // If task has subtasks, update them all
    let updatedSubtasks = editedTask.subTasks
    if (updatedSubtasks) {
      updatedSubtasks = updatedSubtasks.map((st) => ({
        ...st,
        completed,
      }))
    }

    setEditedTask({
      ...editedTask,
      completed,
      progress: completed ? 100 : 0,
      subTasks: updatedSubtasks,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100"
      case "medium":
        return "bg-orange-100"
      case "low":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }

  // Render the selected icon or a default icon
  const renderIcon = (iconId: string | null | undefined, size = "h-6 w-6") => {
    if (!iconId) return null
    const IconComponent = ICON_COLLECTION[iconId as keyof typeof ICON_COLLECTION]
    return IconComponent ? <IconComponent className={size} /> : null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-medium">Task Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Task Title</label>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <input
                      type="date"
                      value={editedTask.date}
                      onChange={(e) => setEditedTask({ ...editedTask, date: e.target.value })}
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <input
                      type="date"
                      value={editedTask.dueDate || ""}
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                      className="bg-transparent w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Priority</label>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      editedTask.priority === "low" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setEditedTask({ ...editedTask, priority: "low" })}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Low
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      editedTask.priority === "medium" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setEditedTask({ ...editedTask, priority: "medium" })}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Medium
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                      editedTask.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setEditedTask({ ...editedTask, priority: "high" })}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    High
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editedTask.notes || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 h-20"
                  placeholder="Add any additional notes here..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <button
                  className="h-6 w-6 rounded-full mr-2 flex items-center justify-center"
                  onClick={toggleTaskCompletion}
                >
                  {editedTask.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </button>
                <h3
                  className={cn(
                    "text-base md:text-xl font-medium",
                    editedTask.completed && "line-through text-gray-500",
                  )}
                >
                  {editedTask.title}
                </h3>
                {editedTask.icon && (
                  <div
                    className="ml-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: editedTask.color }}
                  >
                    {renderIcon(editedTask.icon, "h-4 w-4 text-white")}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  {new Date(editedTask.date).toLocaleDateString()}
                </div>

                <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  {editedTask.startTime} - {editedTask.endTime}
                </div>

                <div
                  className={cn(
                    "flex items-center px-3 py-1 rounded-full text-sm",
                    getPriorityBgColor(editedTask.priority || "medium"),
                  )}
                >
                  <Flag className={cn("h-4 w-4 mr-2", getPriorityColor(editedTask.priority || "medium"))} />
                  {editedTask.priority?.charAt(0).toUpperCase() + editedTask.priority?.slice(1) || "Medium"} Priority
                </div>
              </div>

              {editedTask.dueDate && (
                <div className="flex items-center text-sm">
                  <span className="font-medium">Due Date:</span>
                  <span className="ml-2">{new Date(editedTask.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {editedTask.notes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{editedTask.notes}</p>
                </div>
              )}

              {editedTask.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Progress</span>
                    <span>{editedTask.progress}%</span>
                  </div>
                  <Progress value={editedTask.progress} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm md:text-base">Subtasks</h4>
              {!editMode && (
                <button
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit Task
                </button>
              )}
            </div>

            <div className="space-y-2">
              {(editedTask.subTasks || []).map((subtask) => (
                <div key={subtask.id} className="flex items-center bg-gray-100 rounded-md p-2">
                  <button className="h-5 w-5 rounded-full mr-2 flex-shrink-0" onClick={() => toggleSubtask(subtask.id)}>
                    {subtask.completed ? (
                      <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-xs md:text-sm ${subtask.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {subtask.title}
                  </span>
                  {editMode && (
                    <button className="text-gray-400 hover:text-red-500" onClick={() => removeSubtask(subtask.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              {editMode && (
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="flex-1 bg-gray-100 border border-gray-200 rounded-l-lg p-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addSubtask()
                      }
                    }}
                  />
                  <button className="bg-purple-600 text-white p-2 rounded-r-lg" onClick={addSubtask}>
                    <Plus className="h-5 w-5" />
                  </button>
                  <button
                    className="ml-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center"
                    onClick={generateAISubtasks}
                    disabled={isGeneratingSubtasks}
                  >
                    {isGeneratingSubtasks ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        AI Generate
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between sticky bottom-0 bg-white">
          {editMode ? (
            <>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setEditMode(false)}>
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-lg flex items-center"
                onClick={saveChanges}
              >
                <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => {
                  if (onDelete) {
                    onDelete(task.id)
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg" onClick={onClose}>
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function generateId() {
  return `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

