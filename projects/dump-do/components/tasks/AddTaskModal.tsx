import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X, Clock, Bell, Repeat,
  Sun, Moon, Coffee, Book, Dumbbell,
  Utensils, Briefcase, Heart, Music, Sparkles
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Task, Recurrence } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { lightPalettes, restoreColor } from '../../utils/colors';
import { REMINDER_OPTIONS, IconName, ICON_NAMES } from '../../constants/config';
import { getDateString } from '../../utils/dates';

const iconMap: Record<IconName, any> = {
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

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DURATION_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120];

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task | null;
  selectedDate: Date;
}

export function AddTaskModal({
  visible,
  onClose,
  onSave,
  editingTask,
  selectedDate,
}: AddTaskModalProps) {
  const { isDark } = useTheme();

  const [title, setTitle] = useState(editingTask?.title || '');
  const [icon, setIcon] = useState<IconName>(editingTask?.icon || 'sparkles');
  const [colorIndex, setColorIndex] = useState(() => {
    if (editingTask?.colorName) {
      const idx = lightPalettes.findIndex(p => p.name === editingTask.colorName);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });
  const [time, setTime] = useState(editingTask?.time || '09:00');
  const [duration, setDuration] = useState(editingTask?.duration || 30);
  const [recurrenceType, setRecurrenceType] = useState<Recurrence['type']>(
    editingTask?.recurrence?.type || 'none'
  );
  const [customDays, setCustomDays] = useState<number[]>(
    editingTask?.recurrence?.days || []
  );
  const [reminder, setReminder] = useState(editingTask?.reminder || 'none');

  const colorName = lightPalettes[colorIndex].name;
  const color = restoreColor(colorName, isDark);

  // Reset form when modal opens or editingTask changes
  useEffect(() => {
    if (visible) {
      if (editingTask) {
        setTitle(editingTask.title);
        setIcon(editingTask.icon);
        const idx = lightPalettes.findIndex(p => p.name === editingTask.colorName);
        setColorIndex(idx !== -1 ? idx : 0);
        setTime(editingTask.time);
        setDuration(editingTask.duration);
        setRecurrenceType(editingTask.recurrence?.type || 'none');
        setCustomDays(editingTask.recurrence?.days || []);
        setReminder(editingTask.reminder || 'none');
      } else {
        setTitle('');
        setIcon('sparkles');
        setColorIndex(0);
        setTime('09:00');
        setDuration(30);
        setRecurrenceType('none');
        setCustomDays([]);
        setReminder('none');
      }
    }
  }, [visible, editingTask]);

  const resetForm = () => {
    setTitle('');
    setIcon('sparkles');
    setColorIndex(0);
    setTime('09:00');
    setDuration(30);
    setRecurrenceType('none');
    setCustomDays([]);
    setReminder('none');
  };

  const handleSave = () => {
    if (!title.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let recurrence: Recurrence = { type: recurrenceType, endDate: null, days: [] };
    if (recurrenceType === 'weekly' || recurrenceType === 'custom') {
      recurrence.days = customDays.length > 0 ? customDays : [selectedDate.getDay()];
    }

    onSave({
      title: title.trim(),
      icon,
      colorName,
      time,
      duration,
      date: getDateString(selectedDate),
      recurrence,
      reminder,
      completed: editingTask?.completed || {},
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleDay = (dayIndex: number) => {
    Haptics.selectionAsync();
    setCustomDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    return `${mins / 60} hour${mins > 60 ? 's' : ''}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, isDark && styles.containerDark]}
      >
        {/* Header */}
        <View style={[styles.header, isDark && styles.headerDark]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {editingTask ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!title.trim()}
            style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          >
            <Text style={[styles.saveButtonText, !title.trim() && styles.saveButtonTextDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Task Name
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What do you need to do?"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              style={[styles.titleInput, isDark && styles.titleInputDark]}
              autoFocus
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Icon
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.iconGrid}>
                {ICON_NAMES.map((iconName) => {
                  const IconComponent = iconMap[iconName];
                  const isSelected = icon === iconName;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setIcon(iconName);
                      }}
                      style={[
                        styles.iconButton,
                        isDark && styles.iconButtonDark,
                        isSelected && { backgroundColor: color.accent + '30' },
                      ]}
                    >
                      <IconComponent
                        size={24}
                        color={isSelected ? color.accent : (isDark ? '#9CA3AF' : '#6B7280')}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Color
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorGrid}>
                {lightPalettes.map((palette, idx) => {
                  const isSelected = colorIndex === idx;
                  const displayColor = restoreColor(palette.name, isDark);
                  return (
                    <TouchableOpacity
                      key={palette.name}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setColorIndex(idx);
                      }}
                      style={[
                        styles.colorButton,
                        { backgroundColor: displayColor.bg },
                        isSelected && { borderWidth: 3, borderColor: displayColor.accent },
                      ]}
                    >
                      <View
                        style={[styles.colorDot, { backgroundColor: displayColor.accent }]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              <Clock size={16} color={isDark ? '#9CA3AF' : '#6B7280'} /> Time
            </Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="09:00"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              style={[styles.timeInput, isDark && styles.timeInputDark]}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {/* Duration Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Duration
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.durationGrid}>
                {DURATION_OPTIONS.map((mins) => {
                  const isSelected = duration === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setDuration(mins);
                      }}
                      style={[
                        styles.durationButton,
                        isDark && styles.durationButtonDark,
                        isSelected && styles.durationButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.durationButtonText,
                          isDark && styles.durationButtonTextDark,
                          isSelected && styles.durationButtonTextSelected,
                        ]}
                      >
                        {formatDuration(mins)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Reminder Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              <Bell size={16} color={isDark ? '#9CA3AF' : '#6B7280'} /> Reminder
            </Text>
            <View style={styles.reminderGrid}>
              {REMINDER_OPTIONS.map((opt) => {
                const isSelected = reminder === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setReminder(opt.value);
                    }}
                    style={[
                      styles.reminderButton,
                      isDark && styles.reminderButtonDark,
                      isSelected && styles.reminderButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.reminderButtonText,
                        isDark && styles.reminderButtonTextDark,
                        isSelected && styles.reminderButtonTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Recurrence Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              <Repeat size={16} color={isDark ? '#9CA3AF' : '#6B7280'} /> Repeat
            </Text>
            <View style={styles.recurrenceGrid}>
              {[
                { value: 'none', label: 'Never' },
                { value: 'daily', label: 'Every Day' },
                { value: 'weekdays', label: 'Weekdays' },
                { value: 'custom', label: 'Custom' },
              ].map((opt) => {
                const isSelected = recurrenceType === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setRecurrenceType(opt.value as Recurrence['type']);
                    }}
                    style={[
                      styles.recurrenceButton,
                      isDark && styles.recurrenceButtonDark,
                      isSelected && styles.recurrenceButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.recurrenceButtonText,
                        isDark && styles.recurrenceButtonTextDark,
                        isSelected && styles.recurrenceButtonTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Days Selection */}
            {(recurrenceType === 'custom' || recurrenceType === 'weekly') && (
              <View style={styles.daysRow}>
                {DAYS_OF_WEEK.map((day, idx) => {
                  const isSelected = customDays.includes(idx);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => toggleDay(idx)}
                      style={[
                        styles.dayButton,
                        isDark && styles.dayButtonDark,
                        isSelected && styles.dayButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          isDark && styles.dayButtonTextDark,
                          isSelected && styles.dayButtonTextSelected,
                        ]}
                      >
                        {day[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
              Preview
            </Text>
            <View style={[styles.preview, { backgroundColor: color.bg }]}>
              <View style={[styles.previewIcon, { backgroundColor: color.accent + '30' }]}>
                {React.createElement(iconMap[icon], { size: 24, color: color.accent })}
              </View>
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, isDark && styles.previewTitleDark]}>
                  {title || 'Task Name'}
                </Text>
                <Text style={[styles.previewMeta, isDark && styles.previewMetaDark]}>
                  {time} - {formatDuration(duration)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerTitleDark: {
    color: '#F3F4F6',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabelDark: {
    color: '#9CA3AF',
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  titleInputDark: {
    backgroundColor: '#1F2937',
    color: '#F3F4F6',
    borderColor: '#374151',
  },
  iconGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconButtonDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
  },
  timeInputDark: {
    backgroundColor: '#1F2937',
    color: '#F3F4F6',
    borderColor: '#374151',
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationButtonDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  durationButtonSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  durationButtonTextDark: {
    color: '#D1D5DB',
  },
  durationButtonTextSelected: {
    color: '#FFFFFF',
  },
  reminderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reminderButtonDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  reminderButtonSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  reminderButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  reminderButtonTextDark: {
    color: '#D1D5DB',
  },
  reminderButtonTextSelected: {
    color: '#FFFFFF',
  },
  recurrenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  recurrenceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recurrenceButtonDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  recurrenceButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  recurrenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  recurrenceButtonTextDark: {
    color: '#D1D5DB',
  },
  recurrenceButtonTextSelected: {
    color: '#FFFFFF',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayButtonDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  dayButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dayButtonTextDark: {
    color: '#D1D5DB',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  previewTitleDark: {
    color: '#F3F4F6',
  },
  previewMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewMetaDark: {
    color: '#9CA3AF',
  },
  bottomPadding: {
    height: 40,
  },
});
