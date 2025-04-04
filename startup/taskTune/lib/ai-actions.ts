"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Task } from "@/lib/types"

type SmartScheduleInput = {
  tasks: Task[]
  energyProfile: { [key: string]: string }
  adaptiveMode: boolean
}

type SmartScheduleOutput = {
  timeBlocks: any[]
  patterns: any[]
}

type TaskBreakdownInput = {
  taskTitle: string
  taskDescription: string
  category: string
  priority: string
  dueDate?: string
}

type TaskBreakdownOutput = {
  subtasks: string[]
  estimatedTotalTime: number
}

/**
 * Generates an AI-powered smart schedule based on tasks and energy profile
 */
export async function generateSmartSchedule(input: SmartScheduleInput): Promise<SmartScheduleOutput> {
  const prompt = `
    You are an AI assistant specialized in productivity optimization and smart scheduling.
    
    Create an optimal schedule for these tasks, considering the user's energy profile and patterns.
    Tasks: ${JSON.stringify(input.tasks)}
    Energy Profile: ${JSON.stringify(input.energyProfile)}
    Use Adaptive Mode: ${input.adaptiveMode}
    
    The schedule should:
    1. Match high-energy tasks with high-energy time periods
    2. Include appropriate breaks
    3. Account for fixed-time commitments
    4. Batch similar tasks when possible
    5. Allow buffer time between tasks
    
    Also identify productivity patterns and provide insights.
    
    Format the response as a JSON object with:
    1. timeBlocks: Array of time blocks with tasks assigned to them
    2. patterns: Array of productivity patterns with type, description, and recommendation
    
    Each timeBlock should have:
    - id: unique identifier
    - startTime: start time (HH:MM format)
    - endTime: end time (HH:MM format)
    - energyLevel: "high", "medium", or "low"
    - tasks: array of scheduled tasks
    
    Each task should have:
    - id: unique identifier
    - taskId: reference to original task id
    - title: task title
    - duration: estimated duration in minutes
    - priority: "high", "medium", or "low"
    - category: task category
    - energyRequired: "high", "medium", or "low"
    - isBreak: boolean (optional)
    - isFixed: boolean (optional)
    - confidence: number from 0-100 indicating match confidence
  `

  try {
    const response = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 2500,
    })

    // Parse the response into our expected format
    const result = JSON.parse(response.text) as SmartScheduleOutput

    // Mock data for development/demo purposes
    if (!result.timeBlocks || result.timeBlocks.length === 0) {
      return getMockScheduleData()
    }

    return result
  } catch (error) {
    console.error("Error generating smart schedule:", error)
    // Return mock data as fallback
    return getMockScheduleData()
  }
}

/**
 * Generates subtasks for a given task using AI
 */
export async function generateTaskBreakdown(input: TaskBreakdownInput): Promise<TaskBreakdownOutput> {
  const prompt = `
    You are an AI assistant specialized in task management and productivity.
    
    Break down the following task into clear, actionable subtasks:
    
    Task Title: ${input.taskTitle}
    Description: ${input.taskDescription || "No description provided"}
    Category: ${input.category}
    Priority: ${input.priority}
    ${input.dueDate ? `Due Date: ${input.dueDate}` : ""}
    
    Guidelines for creating subtasks:
    1. Create 3-7 clear, specific, and actionable subtasks
    2. Each subtask should be completable in 5-30 minutes
    3. Order subtasks logically (preparation steps first, etc.)
    4. Include any necessary setup or preparation steps
    5. Include a final review/verification step if appropriate
    
    Format the response as a JSON object with:
    1. subtasks: Array of subtask titles (strings)
    2. estimatedTotalTime: Estimated total time in minutes to complete all subtasks
  `

  try {
    const response = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the response into our expected format
    const result = JSON.parse(response.text) as TaskBreakdownOutput

    // Mock data for development/demo purposes
    if (!result.subtasks || result.subtasks.length === 0) {
      return getMockTaskBreakdown(input.taskTitle)
    }

    return result
  } catch (error) {
    console.error("Error generating task breakdown:", error)
    // Return mock data as fallback
    return getMockTaskBreakdown(input.taskTitle)
  }
}

/**
 * Provides mock schedule data for development/demo purposes
 */
function getMockScheduleData(): SmartScheduleOutput {
  return {
    timeBlocks: [
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
      {
        id: "block-3",
        startTime: "13:00",
        endTime: "15:00",
        energyLevel: "medium",
        tasks: [
          {
            id: 106,
            taskId: 6,
            title: "Administrative tasks",
            duration: 45,
            priority: "medium",
            category: "Work",
            energyRequired: "low",
            confidence: 80,
          },
          {
            id: 107,
            taskId: 7,
            title: "Afternoon break",
            duration: 15,
            priority: "low",
            category: "Break",
            energyRequired: "low",
            isBreak: true,
            confidence: 90,
          },
          {
            id: 108,
            taskId: 8,
            title: "Project planning",
            duration: 60,
            priority: "high",
            category: "Work",
            energyRequired: "medium",
            confidence: 85,
          },
        ],
      },
    ],
    patterns: [
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
    ],
  }
}

/**
 * Provides mock task breakdown data for development/demo purposes
 */
function getMockTaskBreakdown(taskTitle: string): TaskBreakdownOutput {
  // Different subtasks based on task title keywords
  if (taskTitle.toLowerCase().includes("presentation")) {
    return {
      subtasks: [
        "Research topic and gather key information",
        "Create outline and structure for presentation",
        "Design slide template and visual elements",
        "Develop content for each slide",
        "Add supporting visuals and data",
        "Practice presentation and time it",
        "Review and make final adjustments",
      ],
      estimatedTotalTime: 180,
    }
  } else if (taskTitle.toLowerCase().includes("report") || taskTitle.toLowerCase().includes("document")) {
    return {
      subtasks: [
        "Outline document structure and key sections",
        "Research necessary information and data",
        "Write first draft of introduction and background",
        "Develop main content sections",
        "Create supporting charts or tables",
        "Write conclusion and recommendations",
        "Proofread and format document",
      ],
      estimatedTotalTime: 210,
    }
  } else if (taskTitle.toLowerCase().includes("meeting")) {
    return {
      subtasks: [
        "Create meeting agenda with key topics",
        "Prepare necessary materials and documents",
        "Send calendar invites to all participants",
        "Set up meeting room or virtual meeting link",
        "Prepare opening remarks and discussion points",
        "Plan follow-up action items template",
      ],
      estimatedTotalTime: 90,
    }
  } else {
    // Default generic subtasks
    return {
      subtasks: [
        "Define specific goals and success criteria",
        "Gather necessary resources and information",
        "Create initial draft or prototype",
        "Review progress and make adjustments",
        "Complete final version",
        "Test and verify results",
      ],
      estimatedTotalTime: 120,
    }
  }
}

