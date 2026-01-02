# CLAUDE.md - Tiimo Planner iOS App

> Custom instructions for Claude Code to build a production-ready Tiimo-style planner app

---

## 🎯 Project Overview

**App Name:** Tiimo Planner (working title)  
**Platform:** iOS (React Native + Expo), with future Android support  
**Target Users:** People with ADHD, autism, or anyone who benefits from visual time management  
**Design Philosophy:** Neuroinclusive, calming, visually clear, minimal cognitive load

---

## 🛠 Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React Native 0.76+ | Cross-platform mobile |
| Tooling | Expo SDK 52+ | Managed workflow, EAS builds |
| Language | TypeScript 5.0+ | Strict mode enabled |
| Navigation | Expo Router | File-based routing |
| State | React Context + useReducer | May upgrade to Zustand if needed |
| Storage | AsyncStorage | Local persistence |
| Animations | Reanimated 3 | 60fps native animations |
| Gestures | Gesture Handler | Swipes, drags, long press |
| Icons | lucide-react-native | Consistent icon set |
| Dates | date-fns | Lightweight date utilities |
| Notifications | expo-notifications | Local push notifications |
| Audio | expo-av | Focus sounds, celebration effects |
| Haptics | expo-haptics | Tactile feedback |

---

## 📁 Project Structure

```
TiimoPlanner/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Day View (Home)
│   │   ├── week.tsx              # Week View
│   │   ├── brain-dump.tsx        # To-Do / Brain Dump list
│   │   ├── insights.tsx          # Stats & streaks
│   │   └── settings.tsx          # Settings
│   ├── _layout.tsx               # Root layout
│   ├── task/[id].tsx             # Task detail/edit modal
│   ├── routine/[id].tsx          # Routine detail
│   └── focus/[taskId].tsx        # Focus timer screen
│
├── components/
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskModal.tsx
│   │   ├── TaskTimer.tsx
│   │   └── DraggableTask.tsx
│   ├── brain-dump/
│   │   ├── BrainDumpInput.tsx
│   │   ├── BrainDumpItem.tsx
│   │   └── BrainDumpList.tsx
│   ├── calendar/
│   │   ├── DayPicker.tsx
│   │   ├── WeekView.tsx
│   │   └── TimelineView.tsx
│   ├── routines/
│   │   ├── RoutineCard.tsx
│   │   └── RoutinePanel.tsx
│   ├── insights/
│   │   ├── StreakCounter.tsx
│   │   ├── CompletionChart.tsx
│   │   └── MoodTracker.tsx
│   ├── focus/
│   │   ├── FocusTimer.tsx
│   │   ├── FocusSounds.tsx
│   │   └── PomodoroPresets.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── ColorPicker.tsx
│       ├── IconPicker.tsx
│       ├── Celebration.tsx
│       └── TabBar.tsx
│
├── contexts/
│   ├── ThemeContext.tsx
│   ├── TaskContext.tsx
│   ├── BrainDumpContext.tsx
│   ├── InsightsContext.tsx
│   ├── NotificationContext.tsx
│   └── FocusContext.tsx
│
├── hooks/
│   ├── useStorage.ts
│   ├── useTasks.ts
│   ├── useTimer.ts
│   ├── useHaptics.ts
│   ├── useNotifications.ts
│   ├── useStreaks.ts
│   └── useMood.ts
│
├── utils/
│   ├── colors.ts
│   ├── dates.ts
│   ├── recurrence.ts
│   ├── notifications.ts
│   ├── sounds.ts
│   └── analytics.ts
│
├── types/
│   └── index.ts
│
├── constants/
│   ├── config.ts
│   ├── sounds.ts
│   └── celebrations.ts
│
├── assets/
│   ├── icons/
│   ├── sounds/
│   │   ├── notification.wav
│   │   ├── complete.wav
│   │   ├── focus-ambient.mp3
│   │   └── celebration.wav
│   └── animations/
│       └── confetti.json        # Lottie animation
│
├── app.json
├── eas.json
├── tsconfig.json
└── package.json
```

---

## ✅ Feature Status & Roadmap

### Phase 1: Core MVP ✅ (Already Built in Web)
> Migrate these from existing React web app

- [x] Visual daily planner with timeline
- [x] Color-coded task cards
- [x] Custom icons per task
- [x] Focus/Pomodoro timer
- [x] Routines/templates library
- [x] Weekly calendar view
- [x] Recurring tasks (daily/weekly/custom)
- [x] Task reminders/notifications
- [x] Dark mode
- [x] Local data persistence
- [x] Copy tasks to other days
- [x] Task completion tracking

### Phase 2: Brain Dump & Capture 🔄 (Priority: HIGH)
> Separate idea capture from scheduling

- [ ] Brain dump tab/screen
- [ ] Quick add input (text)
- [ ] Drag task from brain dump → timeline
- [ ] Swipe to delete/complete brain dump items
- [ ] Sort by: newest, oldest, manual
- [ ] Estimate time per item (optional)
- [ ] Convert brain dump item to scheduled task

### Phase 3: Gamification & Insights 📊 (Priority: HIGH)
> Motivation through visibility

- [ ] Streak counter (consecutive days completing tasks)
- [ ] Daily/weekly completion percentage
- [ ] Completion history chart (last 7/30 days)
- [ ] "Best day of week" insight
- [ ] "Most productive time" insight
- [ ] Mood check-ins (1-5 scale or emoji)
- [ ] Mood vs productivity correlation
- [ ] Weekly summary notification

### Phase 4: Enhanced Focus Mode 🎵 (Priority: MEDIUM)
> Better focus experience

- [ ] Background ambient sounds (rain, forest, lo-fi)
- [ ] Pomodoro presets (25/5, 50/10, custom)
- [ ] Focus session history
- [ ] "Do not disturb" integration
- [ ] Break reminders
- [ ] Focus stats (total focus time today/week)

### Phase 5: Celebrations & Polish ✨ (Priority: MEDIUM)
> Delight and engagement

- [ ] Confetti animation on task complete
- [ ] Sound effects (subtle, optional)
- [ ] Haptic patterns for different actions
- [ ] Streak milestone celebrations (7 days, 30 days)
- [ ] Custom celebration preferences
- [ ] Smooth page transitions

### Phase 6: Platform Features 📱 (Priority: LOW - Post-Launch)
> Native integrations

- [ ] iOS Widgets (home screen, lock screen)
- [ ] Apple Watch companion (view today, quick complete)
- [ ] Calendar sync (Apple, Google)
- [ ] Siri Shortcuts
- [ ] Live Activities (Dynamic Island)
- [ ] iCloud sync (cross-device)
- [ ] Apple Health mood integration

### Phase 7: AI Features 🤖 (Priority: FUTURE)
> Smart assistance

- [ ] Voice input for tasks
- [ ] AI task breakdown (big task → subtasks)
- [ ] AI time estimation
- [ ] AI priority suggestions
- [ ] Natural language scheduling ("lunch with mom tomorrow at noon")

---

## 📐 Coding Standards

### File Naming
- Components: `PascalCase.tsx` (e.g., `TaskCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useStorage.ts`)
- Utils: `camelCase.ts` (e.g., `dates.ts`)
- Types: `index.ts` in `/types` folder

### Component Structure
```tsx
// 1. Imports (React, RN, third-party, local)
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

// 2. Types
interface Props {
  task: Task;
  onComplete: (id: string) => void;
}

// 3. Component
export function TaskCard({ task, onComplete }: Props) {
  const { colors } = useTheme();
  
  // hooks
  // callbacks
  // effects
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* JSX */}
    </View>
  );
}

// 4. Styles (at bottom)
const styles = StyleSheet.create({
  container: {
    // styles
  },
});

// 5. Default export (if needed)
export default TaskCard;
```

### State Management Pattern
```tsx
// Context with useReducer for complex state
type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string; date: string } };

function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    // etc.
  }
}
```

### Async Storage Pattern
```tsx
// Always use try/catch, always await
const saveData = async <T>(key: string, data: T): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return false;
  }
};
```

### Animation Pattern (Reanimated)
```tsx
// Use shared values and animated styles
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// Trigger with withSpring/withTiming
const handlePress = () => {
  scale.value = withSpring(0.95, { damping: 15 });
};
```

### Haptic Feedback
```tsx
// Use appropriate feedback for action type
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);   // Tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // Toggle
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);   // Delete
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Complete
```

---

## 🎨 Design System

### Color Palettes
```typescript
// Light mode task colors
const lightPalettes = [
  { bg: '#FEE2E2', accent: '#F87171', name: 'coral' },
  { bg: '#FEF3C7', accent: '#FBBF24', name: 'sunshine' },
  { bg: '#D1FAE5', accent: '#34D399', name: 'mint' },
  { bg: '#DBEAFE', accent: '#60A5FA', name: 'sky' },
  { bg: '#EDE9FE', accent: '#A78BFA', name: 'lavender' },
  { bg: '#FCE7F3', accent: '#F472B6', name: 'rose' },
  { bg: '#E0E7FF', accent: '#818CF8', name: 'periwinkle' },
  { bg: '#CCFBF1', accent: '#2DD4BF', name: 'teal' },
];

// Dark mode equivalents with darker backgrounds
```

### Typography
```typescript
const typography = {
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '600' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};
```

### Spacing
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Border Radius
```typescript
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
```

---

## 🔔 Notification Strategy

### Reminder Scheduling
```typescript
// Schedule notification X minutes before task time
const scheduleTaskReminder = async (task: Task, date: Date) => {
  const reminderMinutes = REMINDER_OPTIONS.find(r => r.value === task.reminder)?.minutes;
  if (reminderMinutes === null) return;
  
  const [hours, mins] = task.time.split(':').map(Number);
  const taskTime = new Date(date);
  taskTime.setHours(hours, mins, 0, 0);
  
  const triggerTime = new Date(taskTime.getTime() - reminderMinutes * 60 * 1000);
  
  if (triggerTime > new Date()) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: reminderMinutes === 0 ? 'Starting now!' : `Starting in ${reminderMinutes} minutes`,
        sound: true,
      },
      trigger: { date: triggerTime },
    });
  }
};
```

### Daily Notification Types
1. **Morning brief** (optional): "You have 5 tasks today"
2. **Task reminders**: Per-task based on settings
3. **Streak reminder**: "Don't break your 7-day streak!"
4. **Weekly summary**: "You completed 85% of tasks this week"

---

## 📊 Data Models

### Task
```typescript
interface Task {
  id: string;
  title: string;
  icon: IconName;
  colorName: ColorName;
  time: string;           // "HH:mm"
  duration: number;       // minutes
  date: string;           // "YYYY-MM-DD" start date
  completed: Record<string, boolean>;
  recurrence: Recurrence;
  reminder: ReminderType;
  notificationIds?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Brain Dump Item
```typescript
interface BrainDumpItem {
  id: string;
  text: string;
  estimatedMinutes?: number;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}
```

### Mood Entry
```typescript
interface MoodEntry {
  id: string;
  date: string;           // "YYYY-MM-DD"
  mood: 1 | 2 | 3 | 4 | 5; // or emoji type
  note?: string;
  createdAt: string;
}
```

### Focus Session
```typescript
interface FocusSession {
  id: string;
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  completed: boolean;
}
```

### User Stats
```typescript
interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  lastActiveDate: string;
  weeklyCompletionRates: Record<string, number>; // { "2024-W01": 0.85 }
}
```

---

## 🧪 Testing Checklist

### Before Each PR
- [ ] App builds without errors
- [ ] No TypeScript errors
- [ ] Tested on iOS Simulator
- [ ] Dark mode works correctly
- [ ] Haptics feel appropriate
- [ ] Animations are smooth (60fps)
- [ ] Data persists after app restart
- [ ] Notifications schedule correctly

### Before Release
- [ ] Test on multiple iPhone sizes (SE, 15, 15 Pro Max)
- [ ] Test on iPad (if supported)
- [ ] Memory usage is reasonable
- [ ] App launch time < 2 seconds
- [ ] All user flows tested end-to-end
- [ ] Accessibility labels present
- [ ] VoiceOver works correctly

---

## 🚀 Build & Deploy

### Development
```bash
npx expo start          # Start dev server
npx expo start --ios    # Open iOS simulator
npx expo start --clear  # Clear cache and start
```

### Preview Build
```bash
eas build --profile preview --platform ios
```

### Production Build
```bash
eas build --profile production --platform ios
eas submit --platform ios  # Submit to App Store
```

---

## 📝 Common Commands

```bash
# Install a new Expo package
npx expo install <package-name>

# Install npm package
npm install <package-name>

# Check for Expo SDK updates
npx expo install --check

# Run TypeScript check
npx tsc --noEmit

# Clear all caches
npx expo start --clear
rm -rf node_modules && npm install

# Generate app icons
npx expo-optimize

# View logs
npx expo start --dev-client
```

---

## ⚠️ Known Issues & Solutions

### "Unable to resolve module"
```bash
npx expo start --clear
# or
rm -rf node_modules && npm install
```

### Reanimated not working
Ensure `babel.config.js` has:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### Notifications not showing on iOS Simulator
Local notifications work, but you need a physical device for push notifications.

### Gesture Handler conflicts
Wrap root with `GestureHandlerRootView`:
```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* app */}
    </GestureHandlerRootView>
  );
}
```

---

## 🎯 Current Sprint Focus

> Update this section as you progress

**Current Phase:** Phase 1 - Core MVP Migration

**This Week's Goals:**
1. [ ] Set up Expo project with all dependencies
2. [ ] Create ThemeContext with light/dark mode
3. [ ] Build TaskCard component
4. [ ] Build TaskList with FlatList
5. [ ] Implement AsyncStorage persistence

**Blockers:**
- None currently

---

## 📚 Reference Links

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Lucide Icons](https://lucide.dev/icons/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

*Last updated: January 2025*
