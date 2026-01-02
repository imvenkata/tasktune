import { IconName } from '../constants/config';

export interface Recurrence {
  type: 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';
  endDate?: string | null;
  days?: number[];
}

export interface Task {
  id: string;
  title: string;
  icon: IconName;
  colorName: string;
  time: string;
  duration: number;
  date: string;
  completed: Record<string, boolean>;
  recurrence?: Recurrence;
  reminder?: string;
  notificationIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  name: string;
  icon: IconName;
  colorName: string;
  isDefault?: boolean;
  tasks: Omit<Task, 'id' | 'date' | 'completed' | 'createdAt' | 'updatedAt'>[];
}

export interface BrainDumpItem {
  id: string;
  text: string;
  estimatedMinutes?: number;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  completed: boolean;
}
