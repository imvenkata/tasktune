"use client"

import { useState } from "react"
import { Loader2, BrainCircuit, Clock, CheckCircle2, PencilLine, XCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type PlanTask = {
  id: string
  title: string
  description?: string
  estimatedMinutes: number
  priority: "low" | "medium" | "high"
  category: string
  selected: boolean
}

type GeneratedPlan = {
  title: string
  description?: string
  tasks: PlanTask[]
  tips?: string[]
}

export default function AiPlanner() {
  const [goal, setGoal] = useState("")
  const [timeAvailable, setTimeAvailable] = useState("")
  const [energyLevel, setEnergyLevel] = useState("medium")
  const [additionalContext, setAdditionalContext] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Toggle task selection in the generated plan
  const toggleTaskSelection = (taskId: string) => {
    if (!generatedPlan) return

    setGeneratedPlan({
      ...generatedPlan,
      tasks: generatedPlan.tasks.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task)),
    })
  }

  // Edit a task in the generated plan
  const updateTaskTitle = (taskId: string, newTitle: string) => {
    if (!generatedPlan) return

    setGeneratedPlan({
      ...generatedPlan,
      tasks: generatedPlan.tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)),
    })
  }

  // Generate a plan using AI
  const generatePlan = async () => {
    if (!goal.trim()) {
      setError("Please enter a goal or task to plan")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response
      const mockPlan: GeneratedPlan = {
        title: "Your Personalized Plan",
        description: "A structured approach to accomplish your goal efficiently",
        tasks: [
          {
            id: "task-1",
            title: "Research and gather information",
            description: "Collect all necessary resources and background information",
            estimatedMinutes: 30,
            priority: "high",
            category: "Planning",
            selected: true,
          },
          {
            id: "task-2",
            title: "Create outline or framework",
            description: "Establish the structure for your work",
            estimatedMinutes: 20,
            priority: "high",
            category: "Planning",
            selected: true,
          },
          {
            id: "task-3",
            title: "Take a short break",
            description: "Rest your mind before diving into the main work",
            estimatedMinutes: 10,
            priority: "low",
            category: "Break",
            selected: true,
          },
          {
            id: "task-4",
            title: "Complete first draft",
            description: "Focus on getting your ideas down without perfectionism",
            estimatedMinutes: 45,
            priority: "medium",
            category: "Work",
            selected: true,
          },
          {
            id: "task-5",
            title: "Review and refine",
            description: "Polish your work and make necessary improvements",
            estimatedMinutes: 25,
            priority: "medium",
            category: "Work",
            selected: true,
          },
        ],
        tips: [
          "Start with the most challenging task when your energy is highest",
          "Break down complex tasks into smaller, manageable steps",
          "Use the Pomodoro technique: 25 minutes of focus followed by a 5-minute break",
          "Minimize distractions by silencing notifications during focus periods",
        ],
      }

      setGeneratedPlan(mockPlan)
    } catch (err) {
      console.error("Failed to generate plan:", err)
      setError("Failed to generate plan. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add selected tasks to the task list
  const addTasksToPlanner = () => {
    if (!generatedPlan) return

    const selectedTasks = generatedPlan.tasks.filter((task) => task.selected)

    // In a real app, you would add these tasks to your task store
    console.log("Adding tasks to planner:", selectedTasks)

    // Reset the planner
    setGeneratedPlan(null)
    setGoal("")
    setTimeAvailable("")
    setAdditionalContext("")
  }

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-900"
      case "medium":
        return "text-orange-500 border-orange-900"
      case "low":
        return "text-green-500 border-green-900"
      default:
        return "text-gray-500 border-gray-700"
    }
  }

  // Calculate total estimated time
  const totalEstimatedTime =
    generatedPlan?.tasks.filter((task) => task.selected).reduce((total, task) => total + task.estimatedMinutes, 0) || 0

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-4">
      {!generatedPlan ? (
        <div>
          <div className="flex items-center mb-4">
            <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-medium">AI Task Planner</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">What do you want to accomplish?</label>
              <textarea
                placeholder="e.g., Clean the apartment, Prepare for presentation, Organize my digital files..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full min-h-[100px] p-2 border border-[#333333] rounded-md bg-[#222222] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">How much time do you have?</label>
              <input
                placeholder="e.g., 2 hours, 30 minutes, all afternoon..."
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                className="w-full p-2 border border-[#333333] rounded-md bg-[#222222] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Current energy level</label>
              <div className="flex space-x-2">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    className={cn(
                      "flex-1 capitalize py-1 px-3 rounded-md",
                      energyLevel === level ? "bg-purple-600 text-white" : "bg-[#222222] text-gray-300",
                    )}
                    onClick={() => setEnergyLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Any additional context? (optional)</label>
              <textarea
                placeholder="e.g., I have ADHD, I struggle with starting tasks, I get distracted easily..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="w-full min-h-[80px] p-2 border border-[#333333] rounded-md bg-[#222222] text-white"
              />
            </div>

            {error && <div className="p-3 bg-red-900/30 text-red-400 rounded-md text-sm">{error}</div>}

            <button
              onClick={generatePlan}
              disabled={isLoading || !goal.trim()}
              className={cn(
                "w-full py-2 px-4 rounded-md flex items-center justify-center",
                isLoading || !goal.trim()
                  ? "bg-[#333333] text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Generating plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="p-4 bg-[#222222] border-b border-[#333333]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium">{generatedPlan.title}</h2>
                <p className="text-sm text-gray-400">
                  {generatedPlan.tasks.filter((t) => t.selected).length} tasks • {formatTime(totalEstimatedTime)} total
                </p>
              </div>
              <button
                className="border border-[#333333] rounded-md p-1 flex items-center text-gray-400 hover:bg-[#333333]"
                onClick={() => setGeneratedPlan(null)}
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            {generatedPlan.description && <p className="mt-2 text-sm text-gray-300">{generatedPlan.description}</p>}
          </div>

          <div className="p-4">
            <div className="space-y-3 mb-4">
              {generatedPlan.tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start p-3 rounded-md border border-[#333333]",
                    task.selected ? "bg-[#222222]" : "bg-[#1A1A1A] opacity-60",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={task.selected}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="mt-1 mr-3"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{task.title}</div>

                    {task.description && <p className="text-sm text-gray-400">{task.description}</p>}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border border-[#333333] bg-[#1A1A1A]">
                        <Clock className="h-3 w-3" />
                        {formatTime(task.estimatedMinutes)}
                      </div>

                      <div
                        className={cn(
                          "px-2 py-0.5 text-xs rounded-full border bg-[#1A1A1A]",
                          getPriorityColor(task.priority),
                        )}
                      >
                        {task.priority}
                      </div>

                      <div className="px-2 py-0.5 text-xs rounded-full bg-[#1A1A1A] border border-[#333333] text-gray-300">
                        {task.category}
                      </div>
                    </div>
                  </div>

                  <button
                    className="h-7 w-7 rounded-full hover:bg-[#333333] flex items-center justify-center"
                    onClick={() => {
                      const newTitle = prompt("Edit task", task.title)
                      if (newTitle) {
                        updateTaskTitle(task.id, newTitle)
                      }
                    }}
                  >
                    <PencilLine className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            {generatedPlan.tips && generatedPlan.tips.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2 text-gray-300">Helpful Tips</div>
                <div className="bg-[#222222] rounded-md p-3 border border-[#333333]">
                  <ul className="space-y-2 text-sm pl-4">
                    {generatedPlan.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <Sparkles className="h-4 w-4 text-purple-500 mr-2 mt-0.5" />
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={addTasksToPlanner}
              className={cn(
                "w-full py-2 px-4 rounded-md flex items-center justify-center",
                !generatedPlan.tasks.some((t) => t.selected)
                  ? "bg-[#333333] text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700",
              )}
              disabled={!generatedPlan.tasks.some((t) => t.selected)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Add Selected Tasks to My Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

