import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2, Check, Circle, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BrainDumpItem as BrainDumpItemType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useBrainDump } from '../../contexts/BrainDumpContext';

interface Props {
  item: BrainDumpItemType;
}

export function BrainDumpItem({ item }: Props) {
  const { isDark } = useTheme();
  const { deleteItem, completeItem, uncompleteItem } = useBrainDump();

  const isCompleted = !!item.completedAt;

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isCompleted) {
      uncompleteItem(item.id);
    } else {
      completeItem(item.id);
    }
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteItem(item.id);
          },
        },
      ]
    );
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return isDark ? '#6B7280' : '#9CA3AF';
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity
        onPress={handleToggleComplete}
        style={styles.checkbox}
      >
        {isCompleted ? (
          <Check size={20} color="#6366F1" strokeWidth={3} />
        ) : (
          <Circle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.text,
            isDark && styles.textDark,
            isCompleted && styles.textCompleted,
          ]}
        >
          {item.text}
        </Text>

        <View style={styles.meta}>
          {item.estimatedMinutes && (
            <View style={styles.metaItem}>
              <Clock size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.metaText, isDark && styles.metaTextDark]}>
                {item.estimatedMinutes} min
              </Text>
            </View>
          )}
          {item.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                {item.priority}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        <Trash2 size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  checkbox: {
    padding: 4,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  textDark: {
    color: '#F3F4F6',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaTextDark: {
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteButton: {
    padding: 8,
  },
});
