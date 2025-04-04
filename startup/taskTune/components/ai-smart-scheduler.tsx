"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BrainCircuit,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateSmartSchedule, generateTaskBreakdown } from "@/lib/ai-actions"
import type { Task } from "@/lib/types"
import { useTaskStore } from "@/lib/task-store"
import { Badge } from "@/components/ui/badge"

type ScheduleBlock = {
  id: string
  startTime: string
  endTime: string
  energyLevel: "high" | "medium" | "low"
  tasks: ScheduledTask[]
}

type ScheduledTask = {
  id: number
  taskId: number
  title: string
  duration: number
  priority: "high" | "medium" | "low"
  category: string
  energyRequired: "high" | "medium" | "low"
  isBreak?: boolean
  isFixed?: boolean
  confidence: number
}

type ProductivityPattern = {
  type: string
  description: string
  recommendation: string
}

export default function AiSmartScheduler() {
  const { tasks, addTask, updateTask } = useTaskStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isBreakdownLoading, setIsBreakdownLoading] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([])
  const [patterns, setPatterns] = useState<ProductivityPattern[]>([])
  const [activeTab, setActiveTab] = useState("schedule")
  const [energyProfile, setEnergyProfile] = useState<{ [key: string]: "high" | "medium" | "low" }>({
    morning: "high",
    afternoon: "medium",
    evening: "low",
  })
  const [adaptiveMode, setAdaptiveMode] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([])
  const [expandedTasks, setExpandedTasks] = useState<number[]>([])

  // Generate a smart schedule using AI
  const handleGenerateSchedule = async () => {
    setIsLoading(true)
    try {
      const result = await generateSmartSchedule({
        tasks: tasks,
        energyProfile: energyProfile,
        adaptiveMode: adaptiveMode,
      })

      setSchedule(result.timeBlocks)
      setPatterns(result.patterns)
    } catch (error) {
      console.error("Failed to generate schedule:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate subtasks for a task using AI
  const handleGenerateSubtasks = async (task: Task) => {
    setSelectedTask(task)
    setIsBreakdownLoading(true)
    try {
      const result = await generateTaskBreakdown({
        taskTitle: task.title,
        taskDescription: task.notes || "",
        category: task.category || "Task",
        priority: task.priority || "medium",
        dueDate: task.dueDate,
      })

      setGeneratedSubtasks(result.subtasks)
    } catch (error) {
      console.error("Failed to generate subtasks:", error)
    } finally {
      setIsBreakdownLoading(false)
    }
  }

  // Apply generated subtasks to the selected task
  const applyGeneratedSubtasks = () => {
    if (!selectedTask) return

    const subtasks = generatedSubtasks.map((title, index) => ({
      id: `${selectedTask.id}-subtask-${index}`,
      title,
      completed: false,
    }))

    updateTask(selectedTask.id, {
      ...selectedTask,
      subTasks: [...(selectedTask.subTasks || []), ...subtasks],
    })

    setSelectedTask(null)
    setGeneratedSubtasks([])
  }

  // Toggle task expansion in the schedule view
  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  // Mark a task as complete in the schedule
  const markTaskComplete = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTask(taskId, { ...task, completed: true })
    }
  }

  // Get color for energy level
  const getEnergyColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-900/30 text-green-500"
      case "medium":
        return "bg-blue-900/30 text-blue-500"
      case "low":
        return "bg-orange-900/30 text-orange-500"
      default:
        return "bg-gray-900/30 text-gray-400"
    }
  }

  // Get color for priority
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

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return new Date(2023, 0, 1, hours, minutes).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
          <h2 className="text-lg font-medium">AI Smart Scheduler</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGenerateSchedule} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Smart Schedule
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="schedule" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="schedule" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Smart Schedule
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Task Breakdown
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Productivity Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {schedule.length > 0 ? (
              <div className="space-y-6">
                {schedule.map((block) => (
                  <div key={block.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="px-2 py-0.5 bg-muted rounded-md text-sm mr-2">
                          {formatTime(block.startTime)} - {formatTime(block.endTime)}
                        </div>
                        <div
                          className={cn("capitalize px-2 py-0.5 rounded-md text-sm", getEnergyColor(block.energyLevel))}
                        >
                          <Zap className="h-3 w-3 mr-1 inline" />
                          {block.energyLevel} Energy
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pl-1">
                      {block.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "flex flex-col p-3 rounded-md border",
                            task.isBreak ? "bg-blue-900/10" : "",
                            task.isFixed ? "bg-purple-900/10" : "",
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{task.title}</span>
                                {task.isFixed && (
                                  <Badge variant="outline" className="ml-2">
                                    Fixed
                                  </Badge>
                                )}
                                {task.isBreak && (
                                  <Badge variant="outline" className="ml-2 bg-blue-900/30 text-blue-500">
                                    Break
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.duration} min
                                </Badge>

                                <Badge variant="outline" className={cn(getPriorityColor(task.priority))}>
                                  {task.priority} priority
                                </Badge>

                                <Badge variant="outline">{task.category}</Badge>

                                <Badge variant="outline" className="flex items-center">
                                  <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                                  {task.confidence}% match
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full text-green-500"
                                onClick={() => markTaskComplete(task.taskId)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => toggleTaskExpansion(task.id)}
                              >
                                {expandedTasks.includes(task.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {expandedTasks.includes(task.id) && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-sm text-muted-foreground">
                                <p>
                                  This task was scheduled during a {task.energyRequired} energy period to match your
                                  current energy patterns.
                                </p>
                                {task.isBreak ? (
                                  <p className="mt-1">Regular breaks help maintain productivity and prevent burnout.</p>
                                ) : (
                                  <p className="mt-1">
                                    Consider breaking this task down into smaller subtasks for better focus.
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const fullTask = tasks.find((t) => t.id === task.taskId)
                                  if (fullTask) {
                                    handleGenerateSubtasks(fullTask)
                                    setActiveTab("breakdown")
                                  }
                                }}
                              >
                                <Sparkles className="h-3 w-3 mr-2" />
                                Generate Subtasks
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Smart Schedule Generated Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Generate a smart schedule based on your tasks, energy levels, and productivity patterns.
                </p>
                <Button onClick={handleGenerateSchedule} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Smart Schedule
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">AI Task Breakdown</h3>
                <div className="text-sm text-muted-foreground">Break complex tasks into manageable subtasks</div>
              </div>

              {selectedTask ? (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium">{selectedTask.title}</h4>
                      {selectedTask.priority && (
                        <Badge className={cn("ml-2", getPriorityColor(selectedTask.priority))}>
                          {selectedTask.priority}
                        </Badge>
                      )}
                    </div>

                    {selectedTask.notes && <p className="text-sm text-muted-foreground mb-4">{selectedTask.notes}</p>}

                    {isBreakdownLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Generating subtasks...</span>
                      </div>
                    ) : (
                      <>
                        {generatedSubtasks.length > 0 ? (
                          <div className="space-y-4">
                            <h4 className="font-medium">Generated Subtasks:</h4>
                            <div className="space-y-2">
                              {generatedSubtasks.map((subtask, index) => (
                                <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mr-2" />
                                  <span className="text-sm">{subtask}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedTask(null)
                                  setGeneratedSubtasks([])
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={applyGeneratedSubtasks}>Apply Subtasks</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No subtasks generated yet.</p>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Select a task to break down into subtasks:</p>

                  <div className="space-y-2">
                    {tasks
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="p-3 flex items-center justify-between cursor-pointer hover:bg-accent"
                          onClick={() => handleGenerateSubtasks(task)}
                        >
                          <div>
                            <div className="font-medium">{task.title}</div>
                            {task.dueDate && (
                              <div className="text-xs text-muted-foreground">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Break Down
                          </Button>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium">Productivity Patterns</h3>

              {patterns.length > 0 ? (
                <div className="space-y-4">
                  {patterns.map((pattern, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{pattern.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{pattern.description}</p>
                          <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
                            <Sparkles className="h-3 w-3 inline mr-1" />
                            {pattern.recommendation}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Insights Available Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Generate a smart schedule to receive AI-powered insights about your productivity patterns.
                  </p>
                  <Button onClick={handleGenerateSchedule} disabled={isLoading}>
                    Generate Schedule & Insights
                  </Button>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Energy Profile Settings</h3>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Adaptive Time Estimation</div>
                      <p className="text-sm text-muted-foreground">
                        Adjust time estimates based on your actual completion times
                      </p>
                    </div>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={adaptiveMode}
                        onChange={() => setAdaptiveMode(!adaptiveMode)}
                        className="sr-only"
                        id="toggleAdaptive"
                      />
                      <label
                        htmlFor="toggleAdaptive"
                        className={`block h-6 rounded-full ${adaptiveMode ? "bg-purple-600" : "bg-muted"} cursor-pointer`}
                      >
                        <span
                          className={`block h-4 w-4 mt-1 ml-1 rounded-full bg-white transform transition-transform ${
                            adaptiveMode ? "translate-x-4" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>Energy Profile</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["morning", "afternoon", "evening"].map((time) => (
                        <div key={time} className="space-y-1">
                          <p className="text-sm capitalize">{time}</p>
                          <select
                            className="w-full rounded-md border px-3 py-1 text-sm bg-background"
                            value={energyProfile[time]}
                            onChange={(e) =>
                              setEnergyProfile({
                                ...energyProfile,
                                [time]: e.target.value as "high" | "medium" | "low",
                              })
                            }
                          >
                            <option value="high">High Energy</option>
                            <option value="medium">Medium Energy</option>
                            <option value="low">Low Energy</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}

