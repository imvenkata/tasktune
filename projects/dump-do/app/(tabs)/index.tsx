import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTasks, createDefaultTasks } from '../../contexts/TaskContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TaskCard } from '../../components/tasks/TaskCard';
import { AddTaskModal } from '../../components/tasks/AddTaskModal';
import { getDateString, addDays } from '../../utils/dates';
import { shouldTaskAppearOnDate } from '../../utils/recurrence';
import { Task } from '../../types';

export default function DayView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, toggleComplete, addTask, updateTask } = useTasks();
  const { isDark } = useTheme();

  const dateStr = getDateString(selectedDate);

  // Initialize with default tasks if no tasks exist
  useEffect(() => {
    if (tasks.length === 0) {
      const defaultTasks = createDefaultTasks();
      defaultTasks.forEach(task => addTask(task));
    }
  }, []);

  // Filter tasks for the selected date
  const todaysTasks = tasks
    .filter(task => shouldTaskAppearOnDate(task, dateStr))
    .sort((a, b) => a.time.localeCompare(b.time));

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();

    return `${dayName}, ${monthName} ${dayNum}`;
  };

  const isToday = getDateString(new Date()) === dateStr;

  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    if (editingTask) {
      updateTask({
        ...editingTask,
        ...taskData,
        updatedAt: now,
      });
    } else {
      addTask({
        ...taskData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      } as Task);
    }
    setShowAddModal(false);
    setEditingTask(null);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            onPress={() => setSelectedDate(addDays(selectedDate, -1))}
            style={styles.navButton}
          >
            <ChevronLeft size={24} color={isDark ? '#F3F4F6' : '#111827'} />
          </TouchableOpacity>

          <View style={styles.dateInfo}>
            <Text style={[styles.dateLabel, isDark && styles.dateLabelDark]}>
              {isToday ? 'Today' : formatDate(selectedDate).split(',')[0]}
            </Text>
            <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setSelectedDate(addDays(selectedDate, 1))}
            style={styles.navButton}
          >
            <ChevronRight size={24} color={isDark ? '#F3F4F6' : '#111827'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {todaysTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              No tasks scheduled for this day
            </Text>
            <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
              Tap + to add a task
            </Text>
          </View>
        ) : (
          todaysTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              date={dateStr}
              onPress={() => handleEditTask(task)}
              onToggleComplete={() => toggleComplete(task.id, dateStr)}
            />
          ))
        )}
      </ScrollView>

      <AddTaskModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        selectedDate={selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateLabelDark: {
    color: '#9CA3AF',
  },
  dateText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  dateTextDark: {
    color: '#F3F4F6',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: '#6366F1',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyTextDark: {
    color: '#9CA3AF',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptySubtextDark: {
    color: '#6B7280',
  },
});
