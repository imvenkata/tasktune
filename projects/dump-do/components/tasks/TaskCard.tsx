import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Check, Clock, Repeat } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Task } from '../../types';
import { restoreColor } from '../../utils/colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getRecurrenceLabel } from '../../utils/recurrence';
import {
  Sun, Moon, Coffee, Book, Dumbbell,
  Utensils, Briefcase, Heart, Music, Sparkles
} from 'lucide-react-native';

const iconMap = {
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
  book: Book,
  dumbbell: Dumbbell,
  utensils: Utensils,
  briefcase: Briefcase,
  heart: Heart,
  music: Music,
  sparkles: Sparkles,
};

interface TaskCardProps {
  task: Task;
  date: string;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function TaskCard({ task, date, onPress, onToggleComplete }: TaskCardProps) {
  const { isDark } = useTheme();
  const color = restoreColor(task.colorName, isDark);
  const Icon = iconMap[task.icon] || Coffee;
  const isCompleted = task.completed[date] || false;
  const recurrenceLabel = getRecurrenceLabel(task.recurrence);

  const handleToggleComplete = () => {
    Haptics.notificationAsync(
      isCompleted
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
    onToggleComplete?.();
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: color.bg },
        pressed && styles.pressed,
        isCompleted && styles.completed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconTimeRow}>
            <View style={[styles.iconContainer, { backgroundColor: color.accent + '20' }]}>
              <Icon size={18} color={color.accent} strokeWidth={2.5} />
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.time, isDark && styles.timeDark]}>{task.time}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleToggleComplete}
            style={[
              styles.checkbox,
              { borderColor: color.accent },
              isCompleted && { backgroundColor: color.accent },
            ]}
          >
            {isCompleted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.title,
            isDark && styles.titleDark,
            isCompleted && styles.titleCompleted,
          ]}
        >
          {task.title}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.duration, isDark && styles.durationDark]}>
            {task.duration} min
          </Text>
          {recurrenceLabel && (
            <View style={styles.recurrenceLabel}>
              <Repeat size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.recurrenceText, isDark && styles.recurrenceTextDark]}>
                {recurrenceLabel}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  completed: {
    opacity: 0.6,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timeDark: {
    color: '#D1D5DB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  titleDark: {
    color: '#F3F4F6',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  durationDark: {
    color: '#9CA3AF',
  },
  recurrenceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recurrenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recurrenceTextDark: {
    color: '#9CA3AF',
  },
});
