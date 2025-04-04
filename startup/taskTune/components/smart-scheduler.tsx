"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  BrainCircuit,
  Sparkles,
  BarChart3,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TimeBlock = {
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

export default function SmartScheduler() {
  const [isLoading, setIsLoading] = useState(false)
  const [schedule, setSchedule] = useState<TimeBlock[]>([])
  const [patterns, setPatterns] = useState<ProductivityPattern[]>([])
  const [activeTab, setActiveTab] = useState("schedule")
  const [energyProfile, setEnergyProfile] = useState<{ [key: string]: "high" | "medium" | "low" }>({
    morning: "high",
    afternoon: "medium",
    evening: "low",
  })
  const [autoReschedule, setAutoReschedule] = useState(true)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [missedTask, setMissedTask] = useState<ScheduledTask | null>(null)
  const [adaptiveMode, setAdaptiveMode] = useState(true)
  const [timeAccuracy, setTimeAccuracy] = useState(70)

  // Mock data for initial schedule
  useState(() => {
    // This would normally come from the AI service
    const mockSchedule: TimeBlock[] = [
      {
        id: "block-1",
        startTime: "08:00",
        endTime: "10:00",
        energyLevel: "high",
        tasks: [
          {
            id: 101,
            taskId: 1,
            title: "Deep work on project",
            duration: 90,
            priority: "high",
            category: "Work",
            energyRequired: "high",
            confidence: 85,
          },
          {
            id: 102,
            taskId: 2,
            title: "Quick break",
            duration: 10,
            priority: "medium",
            category: "Break",
            energyRequired: "low",
            isBreak: true,
            confidence: 95,
          },
          {
            id: 103,
            taskId: 3,
            title: "Email processing",
            duration: 20,
            priority: "medium",
            category: "Work",
            energyRequired: "medium",
            confidence: 75,
          },
        ],
      },
      {
        id: "block-2",
        startTime: "10:00",
        endTime: "12:00",
        energyLevel: "high",
        tasks: [
          {
            id: 104,
            taskId: 4,
            title: "Team meeting",
            duration: 60,
            priority: "high",
            category: "Work",
            energyRequired: "medium",
            isFixed: true,
            confidence: 100,
          },
          {
            id: 105,
            taskId: 5,
            title: "Lunch break",
            duration: 30,
            priority: "medium",
            category: "Break",
            energyRequired: "low",
            isBreak: true,
            confidence: 90,
          },
        ],
      },
    ]

    const mockPatterns: ProductivityPattern[] = [
      {
        type: "Time Estimation",
        description: "You consistently underestimate task duration by ~25%",
        recommendation: "The scheduler has adjusted time estimates to be more realistic",
      },
      {
        type: "Energy Pattern",
        description: "Your productivity peaks between 9-11 AM",
        recommendation: "High-focus tasks are scheduled during your morning energy peak",
      },
      {
        type: "Task Completion",
        description: "Administrative tasks are often delayed or rescheduled",
        recommendation: "These tasks are now scheduled during lower energy periods",
      },
      {
        type: "Break Pattern",
        description: "You work most effectively with breaks every 90 minutes",
        recommendation: "Short breaks are automatically scheduled after focused work periods",
      },
    ]

    setSchedule(mockSchedule)
    setPatterns(mockPatterns)
  })

  // Generate a new schedule using AI
  const generateSchedule = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For now, we'll just use our mock data with a slight modification
      setSchedule((prev) => {
        const updated = [...prev]
        // Make a small change to show it "updated"
        if (updated[0]?.tasks.length > 0) {
          updated[0].tasks[0].confidence = 90
        }
        return updated
      })
    } catch (error) {
      console.error("Failed to generate schedule:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle task completion
  const markTaskComplete = (blockId: string, taskId: number) => {
    // Update the schedule
    setSchedule((prev) =>
      prev.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            tasks: block.tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)),
          }
        }
        return block
      }),
    )
  }

  // Simulate a missed task and trigger rescheduling dialog
  const simulateMissedTask = () => {
    // Find a task to "miss"
    const block = schedule[0]
    const task = block?.tasks[0]

    if (task) {
      setMissedTask(task)
      setShowRescheduleDialog(true)
    }
  }

  // Handle rescheduling of a missed task
  const handleReschedule = () => {
    // In a real implementation, this would call the AI service to reschedule
    // For now, we'll just close the dialog
    setShowRescheduleDialog(false)
    setMissedTask(null)

    // Show a simulated "rescheduled" message
    alert("Task rescheduled for tomorrow at 10:00 AM")
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
    <div className="space-y-4">
      <div>
        <div className="p-4 border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center">
            <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-medium">AI Smart Scheduler</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="border border-[#333333] rounded-md px-3 py-1 flex items-center text-sm"
              onClick={generateSchedule}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Schedule
                </>
              )}
            </button>

            <button
              className="border border-[#333333] rounded-md px-3 py-1 flex items-center text-sm"
              onClick={simulateMissedTask}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Simulate Missed Task
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex border-b border-[#333333] mb-4">
            <button
              className={cn(
                "px-4 py-2 flex items-center",
                activeTab === "schedule" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400",
              )}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Smart Schedule
            </button>
            <button
              className={cn(
                "px-4 py-2 flex items-center",
                activeTab === "insights" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400",
              )}
              onClick={() => setActiveTab("insights")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Productivity Insights
            </button>
          </div>

          {activeTab === "schedule" && (
            <div className="space-y-6">
              {schedule.map((block) => (
                <div key={block.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="px-2 py-0.5 bg-[#222222] rounded-md text-sm mr-2">
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
                          "flex items-start p-3 rounded-md border border-[#333333]",
                          task.isBreak ? "bg-blue-900/10" : "",
                          task.isFixed ? "bg-purple-900/10" : "",
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium">{task.title}</span>
                            {task.isFixed && (
                              <div className="ml-2 px-2 py-0.5 bg-[#222222] rounded-full text-xs">Fixed</div>
                            )}
                            {task.isBreak && (
                              <div className="ml-2 px-2 py-0.5 bg-blue-900/30 text-blue-500 rounded-full text-xs">
                                Break
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#222222] rounded-full text-xs">
                              <Clock className="h-3 w-3" />
                              {task.duration} min
                            </div>

                            <div
                              className={cn(
                                "px-2 py-0.5 bg-[#222222] rounded-full text-xs",
                                getPriorityColor(task.priority),
                              )}
                            >
                              {task.priority} priority
                            </div>

                            <div className="px-2 py-0.5 bg-[#222222] rounded-full text-xs">{task.category}</div>

                            <div className="px-2 py-0.5 bg-[#222222] rounded-full text-xs flex items-center">
                              <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                              {task.confidence}% match
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            className="h-7 w-7 rounded-full hover:bg-[#333333] flex items-center justify-center text-green-500"
                            onClick={() => markTaskComplete(block.id, task.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <button className="h-7 w-7 rounded-full hover:bg-[#333333] flex items-center justify-center text-red-500">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Productivity Patterns</h3>

                {patterns.map((pattern, index) => (
                  <div key={index} className="p-3 border border-[#333333] rounded-lg bg-[#222222]">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-purple-900/30 text-purple-500">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{pattern.type}</h4>
                        <p className="text-sm text-gray-400 mt-1">{pattern.description}</p>
                        <p className="text-sm text-purple-400 mt-2">
                          <Sparkles className="h-3 w-3 inline mr-1" />
                          {pattern.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium">Scheduling Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Adaptive Time Estimation</div>
                      <p className="text-sm text-gray-400">
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
                        className={`block h-6 rounded-full ${adaptiveMode ? "bg-purple-600" : "bg-[#333333]"} cursor-pointer`}
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
                    <div className="flex items-center justify-between">
                      <div>Time Estimation Accuracy</div>
                      <span className="text-sm">{timeAccuracy}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={timeAccuracy}
                      onChange={(e) => setTimeAccuracy(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-400">Higher values add more buffer time to prevent rushing</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Automatic Rescheduling</div>
                      <p className="text-sm text-gray-400">Automatically reschedule missed tasks</p>
                    </div>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={autoReschedule}
                        onChange={() => setAutoReschedule(!autoReschedule)}
                        className="sr-only"
                        id="toggleReschedule"
                      />
                      <label
                        htmlFor="toggleReschedule"
                        className={`block h-6 rounded-full ${autoReschedule ? "bg-purple-600" : "bg-[#333333]"} cursor-pointer`}
                      >
                        <span
                          className={`block h-4 w-4 mt-1 ml-1 rounded-full bg-white transform transition-transform ${
                            autoReschedule ? "translate-x-4" : ""
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
                            className="w-full rounded-md border border-[#333333] px-3 py-1 text-sm bg-[#222222]"
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rescheduling Dialog */}
      {showRescheduleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-2">Missed Task Detected</h3>
            <p className="text-sm text-gray-400 mb-4">
              It looks like you missed or couldn't complete this task. Would you like to reschedule it?
            </p>

            {missedTask && (
              <div className="p-3 my-2 border border-[#333333] rounded-md bg-[#222222]">
                <h4 className="font-medium">{missedTask.title}</h4>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <span>{missedTask.duration} minutes</span>
                  <span>•</span>
                  <span className={getPriorityColor(missedTask.priority)}>{missedTask.priority} priority</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm">
                  AI suggests rescheduling for tomorrow at 10:00 AM when your energy typically matches this task.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-[#333333] rounded-md bg-[#222222]"
                onClick={() => setShowRescheduleDialog(false)}
              >
                Skip This Task
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md" onClick={handleReschedule}>
                Reschedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

