import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { useStorage } from '../hooks/useStorage';
import { STORAGE_KEYS } from '../constants/config';
import { getDateString } from '../utils/dates';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string, date: string) => void;
  copyTaskToDate: (task: Task, newDate: string) => void;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string; date: string } }
  | { type: 'COPY_TASK'; payload: { task: Task; newDate: string } };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;

    case 'ADD_TASK':
      return [...state, action.payload];

    case 'UPDATE_TASK':
      return state.map(task =>
        task.id === action.payload.id ? action.payload : task
      );

    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);

    case 'TOGGLE_COMPLETE':
      return state.map(task => {
        if (task.id === action.payload.id) {
          const newCompleted = { ...task.completed };
          newCompleted[action.payload.date] = !newCompleted[action.payload.date];
          return { ...task, completed: newCompleted };
        }
        return task;
      });

    case 'COPY_TASK':
      const { task, newDate } = action.payload;
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        date: newDate,
        completed: {},
        recurrence: { type: 'none' },
      };
      return [...state, newTask];

    default:
      return state;
  }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const { saveToStorage, loadFromStorage } = useStorage();

  useEffect(() => {
    const loadTasks = async () => {
      const loaded = await loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
      dispatch({ type: 'SET_TASKS', payload: loaded });
    };
    loadTasks();
  }, [loadFromStorage]);

  useEffect(() => {
    if (tasks.length > 0) {
      saveToStorage(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, saveToStorage]);

  const addTask = (task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleComplete = (id: string, date: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id, date } });
  };

  const copyTaskToDate = (task: Task, newDate: string) => {
    dispatch({ type: 'COPY_TASK', payload: { task, newDate } });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        copyTaskToDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}

// Helper function to create default tasks
export const createDefaultTasks = (): Task[] => {
  const today = getDateString(new Date());
  return [
    {
      id: '1',
      title: 'Morning Stretch',
      icon: 'dumbbell',
      colorName: 'mint',
      time: '07:00',
      duration: 15,
      completed: {},
      date: today,
      recurrence: { type: 'daily', endDate: null, days: [] },
      reminder: '5min',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Breakfast',
      icon: 'coffee',
      colorName: 'sunshine',
      time: '07:30',
      duration: 30,
      completed: {},
      date: today,
      recurrence: { type: 'none' },
      reminder: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Deep Work',
      icon: 'briefcase',
      colorName: 'sky',
      time: '09:00',
      duration: 90,
      completed: {},
      date: today,
      recurrence: { type: 'weekdays', endDate: null, days: [] },
      reminder: '15min',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Lunch Break',
      icon: 'utensils',
      colorName: 'coral',
      time: '12:00',
      duration: 45,
      completed: {},
      date: today,
      recurrence: { type: 'none' },
      reminder: 'atTime',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Reading',
      icon: 'book',
      colorName: 'lavender',
      time: '20:00',
      duration: 30,
      completed: {},
      date: today,
      recurrence: { type: 'daily', endDate: null, days: [] },
      reminder: '10min',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};
