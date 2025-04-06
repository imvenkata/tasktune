"use client"

import type React from "react"
import { create } from "zustand"
import type { Task, SubTask } from "./types"

type TaskStore = {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: (token: string) => Promise<void>
  addTask: (task: Task) => void
  updateTask: (id: string, updatedTask: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, updatedTask: Partial<Task>) => void
  toggleTaskCompletion: (id: string) => void
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  fetchTasks: async (token: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      set({ tasks: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  moveTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    })),

  toggleTaskCompletion: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          const progress = completed
            ? 100
            : task.subTasks && task.subTasks.length > 0
              ? Math.round((task.subTasks.filter((st) => st.completed).length / task.subTasks.length) * 100)
              : task.progress || 0;
          return {
            ...task,
            completed,
            progress,
          }
        }
        return task
      }),
    })),

  updateSubtask: (taskId, subtaskId, completed) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId && task.subTasks) {
          const updatedSubtasks = task.subTasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed } : subtask,
          )
          const completedCount = updatedSubtasks.filter((st) => st.completed).length
          const progress = Math.round((completedCount / updatedSubtasks.length) * 100)
          return {
            ...task,
            subTasks: updatedSubtasks,
            progress,
            completed: progress === 100,
          }
        }
        return task
      }),
    })),
}))

