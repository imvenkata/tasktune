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
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
  onRefresh?: () => void
}

export default function TaskDetailView({ task, onClose, onUpdate, onDelete, fetchWithAuth, onRefresh }: TaskDetailViewProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>({ ...task })
  const [newSubtask, setNewSubtask] = useState("")
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false)

  const calculateProgress = (subtasks?: SubTask[]): number => {
    if (!subtasks || subtasks.length === 0) return task.completed ? 100 : 0
    const completedCount = subtasks.filter((st) => st.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  const handleSubtaskToggle = async (subtaskId: string, isComplete: boolean) => {
    if (!task) return;
    
    try {
      // Optimistically update UI first
      // Update local state instead of using updateSubtask from store
      setEditedTask(prevTask => {
        const updatedSubtasks = (prevTask.subTasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: isComplete } : st
        );
        
        return {
          ...prevTask,
          subTasks: updatedSubtasks,
          progress: calculateTaskProgress(updatedSubtasks),
          completed: updatedSubtasks.every(st => st.completed) && updatedSubtasks.length > 0
        };
      });
      
      // Get the updated subtask from the task
      const updatedSubTasks = task.subTasks ? [...task.subTasks] : [];
      const subtaskIndex = updatedSubTasks.findIndex(st => st.id === subtaskId);
      
      if (subtaskIndex === -1) {
        console.error("Could not find subtask with ID:", subtaskId);
        return;
      }
      
      // Calculate if all subtasks are completed after this change
      const allSubtasksCompleted = updatedSubTasks.every(subtask => 
        subtask.id === subtaskId ? isComplete : subtask.completed
      );
      
      // Send the update to the backend
      const response = await fetchWithAuth(`/subtasks/${subtaskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: isComplete
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update subtask (${response.status})`);
      }
      
      // Update parent task completion status if needed
      if (allSubtasksCompleted !== task.completed && updatedSubTasks.length > 0) {
        console.log(`All subtasks completed: ${allSubtasksCompleted}, updating parent task completion status`);
        
        const taskResponse = await fetchWithAuth(`/tasks/${task.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            completed: allSubtasksCompleted,
            progress: allSubtasksCompleted ? 100 : calculateTaskProgress(updatedSubTasks)
          }),
        });
        
        if (!taskResponse.ok) {
          console.warn(`Failed to update parent task completion status (${taskResponse.status})`);
        }
      }
      
      // Refresh task data if callback exists
      if (onRefresh) {
        onRefresh();
      }
      
    } catch (error) {
      console.error("Error toggling subtask:", error);
      // Revert optimistic update on failure
      setEditedTask(prevTask => {
        const revertedSubtasks = (prevTask.subTasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !isComplete } : st
        );
        
        return {
          ...prevTask,
          subTasks: revertedSubtasks,
          progress: calculateTaskProgress(revertedSubtasks),
          completed: revertedSubtasks.every(st => st.completed) && revertedSubtasks.length > 0
        };
      });
    }
  };
  
  // Helper function to calculate task progress based on completed subtasks
  const calculateTaskProgress = (subtasks: any[]): number => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedCount = subtasks.filter(st => st.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  const addSubtask = async () => {
    if (!newSubtask.trim() || !task?.id || !fetchWithAuth) return

    const subtaskPayload = {
      title: newSubtask.trim(),
      completed: false, // Default new subtasks to not completed
    }

    console.log(`Adding subtask to task ${task.id}:`, subtaskPayload);
    try {
      const response = await fetchWithAuth(`/tasks/${task.id}/subtasks`, {
        method: 'POST',
        body: JSON.stringify(subtaskPayload),
      })

      if (!response.ok) {
        let errorDetail = "Failed to add subtask.";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (e) {}
        throw new Error(errorDetail);
      }

      const createdSubtask: SubTask = await response.json();
      console.log("Subtask added successfully:", createdSubtask);

      // Update local state AFTER successful API call
      setEditedTask((prevTask) => {
        const updatedSubtasks = [...(prevTask.subTasks || []), createdSubtask];
        return {
          ...prevTask,
          subTasks: updatedSubtasks,
          progress: calculateProgress(updatedSubtasks),
        };
      });
      setNewSubtask(""); // Clear input field

    } catch (error) {
      console.error("Error adding subtask:", error);
      alert(`Error adding subtask: ${error instanceof Error ? error.message : "Unknown error"}`);
      // TODO: Better error display
    }
  }

  const removeSubtask = async (subtaskId: string | number) => {
    if (!fetchWithAuth) return;
    // Optimistically remove from UI, or wait for API response?
    // For now, let's wait for API confirmation before removing locally.
    console.log(`Deleting subtask ${subtaskId}`);
    try {
      const response = await fetchWithAuth(`/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
         let errorDetail = "Failed to delete subtask.";
         if (response.status !== 204) { 
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorDetail;
            } catch(e) {
               errorDetail = `Server responded with status ${response.status}`; 
            }
         }
        throw new Error(errorDetail);
      }

      console.log("Subtask deleted successfully:", subtaskId);
      // Update local state AFTER successful API call
      setEditedTask((prevTask) => {
        const updatedSubtasks = (prevTask.subTasks || []).filter((st) => st.id !== subtaskId);
        return {
          ...prevTask,
          subTasks: updatedSubtasks,
          progress: calculateProgress(updatedSubtasks),
        };
      });

    } catch (error) {
      console.error(`Error deleting subtask ${subtaskId}:`, error);
      alert(`Error deleting subtask: ${error instanceof Error ? error.message : "Unknown error"}`);
      // TODO: Better error display
    }
  }

  const generateAISubtasks = async () => {
    if (!task?.id || !fetchWithAuth) return;

    setIsGeneratingSubtasks(true)
    console.log(`Generating AI subtasks for task ${task.id}`);

    try {
      // Note: The request body schema (schemas.GenerateSubtasksRequest)
      // might need specific fields. Adjust payload if necessary.
      const payload = {}; // Adjust if backend expects a body

      const response = await fetchWithAuth(`/tasks/${task.id}/generate-subtasks`, {
        method: 'POST',
        body: JSON.stringify(payload), // Send empty or specific body based on backend needs
      });

      if (!response.ok) {
        let errorDetail = "Failed to generate AI subtasks.";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (e) {}
        throw new Error(errorDetail);
      }

      const generatedSubtasks: SubTask[] = await response.json();
      console.log("AI Subtasks generated successfully:", generatedSubtasks);

      // Update local state with the generated subtasks
      setEditedTask((prevTask) => {
         const updatedSubtasks = [...(prevTask.subTasks || []), ...generatedSubtasks];
         return {
           ...prevTask,
           subTasks: updatedSubtasks,
           progress: calculateProgress(updatedSubtasks),
           // Parent task completion status likely doesn't change just by adding subtasks
         };
      });

    } catch (error) {
      console.error("Error generating AI subtasks:", error);
      alert(`Error generating AI subtasks: ${error instanceof Error ? error.message : "Unknown error"}`);
      // TODO: Better error display
    } finally {
      setIsGeneratingSubtasks(false)
    }
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
                  <button className="h-5 w-5 rounded-full mr-2 flex-shrink-0" onClick={() => handleSubtaskToggle(subtask.id, !subtask.completed)}>
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
              {onDelete && (
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => {
                    onDelete(task.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}
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

