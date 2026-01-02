import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTasks } from '../../contexts/TaskContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TaskCard } from '../../components/tasks/TaskCard';
import { getDateString, addDays, getStartOfWeek, DAYS_OF_WEEK } from '../../utils/dates';
import { shouldTaskAppearOnDate } from '../../utils/recurrence';

export default function WeekView() {
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const { tasks, toggleComplete } = useTasks();
  const { isDark } = useTheme();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = getDateString(new Date());

  const getTasksForDate = (date: Date) => {
    const dateStr = getDateString(date);
    return tasks
      .filter(task => shouldTaskAppearOnDate(task, dateStr))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const goToPreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const goToCurrentWeek = () => {
    setWeekStart(getStartOfWeek(new Date()));
  };

  const formatWeekRange = () => {
    const start = weekStart;
    const end = addDays(weekStart, 6);
    const monthStart = start.toLocaleString('default', { month: 'short' });
    const monthEnd = end.toLocaleString('default', { month: 'short' });

    if (monthStart === monthEnd) {
      return `${monthStart} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${monthStart} ${start.getDate()} - ${monthEnd} ${end.getDate()}, ${start.getFullYear()}`;
  };

  const isCurrentWeek = getDateString(weekStart) === getDateString(getStartOfWeek(new Date()));

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
            <ChevronLeft size={24} color={isDark ? '#F3F4F6' : '#111827'} />
          </TouchableOpacity>

          <View style={styles.weekInfo}>
            <Text style={[styles.weekLabel, isDark && styles.weekLabelDark]}>
              {isCurrentWeek ? 'This Week' : 'Week View'}
            </Text>
            <Text style={[styles.weekRange, isDark && styles.weekRangeDark]}>
              {formatWeekRange()}
            </Text>
          </View>

          <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
            <ChevronRight size={24} color={isDark ? '#F3F4F6' : '#111827'} />
          </TouchableOpacity>
        </View>

        {!isCurrentWeek && (
          <TouchableOpacity onPress={goToCurrentWeek} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.weekContent}
        showsVerticalScrollIndicator={false}
      >
        {weekDays.map((date, index) => {
          const dateStr = getDateString(date);
          const dayTasks = getTasksForDate(date);
          const isToday = dateStr === today;
          const dayName = DAYS_OF_WEEK[date.getDay()];
          const dayNum = date.getDate();

          return (
            <View key={dateStr} style={styles.daySection}>
              <View style={[
                styles.dayHeader,
                isDark && styles.dayHeaderDark,
                isToday && styles.dayHeaderToday,
                isToday && isDark && styles.dayHeaderTodayDark,
              ]}>
                <Text style={[
                  styles.dayName,
                  isDark && styles.dayNameDark,
                  isToday && styles.dayNameToday,
                ]}>
                  {dayName}
                </Text>
                <View style={[
                  styles.dayNumber,
                  isToday && styles.dayNumberToday,
                ]}>
                  <Text style={[
                    styles.dayNumberText,
                    isDark && styles.dayNumberTextDark,
                    isToday && styles.dayNumberTextToday,
                  ]}>
                    {dayNum}
                  </Text>
                </View>
              </View>

              <View style={styles.dayTasks}>
                {dayTasks.length === 0 ? (
                  <View style={styles.emptyDay}>
                    <Text style={[styles.emptyDayText, isDark && styles.emptyDayTextDark]}>
                      No tasks
                    </Text>
                  </View>
                ) : (
                  dayTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      date={dateStr}
                      onToggleComplete={() => toggleComplete(task.id, dateStr)}
                    />
                  ))
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 8,
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  weekLabelDark: {
    color: '#9CA3AF',
  },
  weekRange: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  weekRangeDark: {
    color: '#F3F4F6',
  },
  todayButton: {
    marginTop: 12,
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  weekContent: {
    flex: 1,
  },
  daySection: {
    marginBottom: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayHeaderDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  dayHeaderToday: {
    backgroundColor: '#EEF2FF',
    borderBottomColor: '#6366F1',
    borderBottomWidth: 2,
  },
  dayHeaderTodayDark: {
    backgroundColor: '#1E293B',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayNameDark: {
    color: '#D1D5DB',
  },
  dayNameToday: {
    color: '#6366F1',
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  dayNumberToday: {
    backgroundColor: '#6366F1',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  dayNumberTextDark: {
    color: '#F3F4F6',
  },
  dayNumberTextToday: {
    color: '#FFFFFF',
  },
  dayTasks: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyDay: {
    padding: 20,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyDayTextDark: {
    color: '#6B7280',
  },
});
