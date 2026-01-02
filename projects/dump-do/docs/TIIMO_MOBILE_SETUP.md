# Tiimo Planner - iOS Mobile App Setup & Requirements

## Overview

This document outlines the setup, requirements, and architecture for converting the Tiimo Planner web app to a native iOS application using React Native, with a clear path to cross-platform (Android) support.

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76+ | Cross-platform mobile framework |
| **Expo** | SDK 52+ | Development tooling & native APIs |
| **TypeScript** | 5.0+ | Type safety & better DX |

### Why Expo?
- ✅ Faster development cycle with hot reloading
- ✅ Built-in APIs for notifications, haptics, storage
- ✅ EAS Build for app store submissions
- ✅ Easy upgrade path and OTA updates
- ✅ Great for solo developers and small teams

---

## Development Environment Setup

### Prerequisites

#### 1. System Requirements
```
- macOS 13+ (Ventura or later) - Required for iOS development
- Xcode 15+ (from Mac App Store)
- Node.js 20 LTS+
- Watchman (for file watching)
```

#### 2. Install Required Tools

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Install Watchman
brew install watchman

# Install iOS Simulator (via Xcode)
xcode-select --install
```

#### 3. Install Xcode & iOS Simulator
1. Download Xcode from Mac App Store
2. Open Xcode → Settings → Platforms → Download iOS 17+ Simulator
3. Accept license: `sudo xcodebuild -license accept`

#### 4. Apple Developer Account
- **Free Account**: Test on simulator only
- **Paid Account ($99/year)**: Required for physical device testing & App Store

---

## Project Initialization

### Create New Expo Project

```bash
# Create project with TypeScript template
npx create-expo-app@latest TiimoPlanner --template expo-template-blank-typescript

cd TiimoPlanner

# Install core dependencies
npx expo install expo-notifications expo-haptics expo-secure-store
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install expo-linear-gradient expo-blur

# Install navigation
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Install UI libraries
npm install lucide-react-native
npm install date-fns

# Install dev dependencies
npm install -D @types/react @types/react-native
```

---

## Project Structure

```
TiimoPlanner/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx             # Day View (Home)
│   │   ├── week.tsx              # Week View
│   │   ├── routines.tsx          # Routines Library
│   │   └── settings.tsx          # Settings
│   ├── _layout.tsx               # Root layout
│   └── task/
│       └── [id].tsx              # Task detail/edit modal
│
├── components/
│   ├── tasks/
│   │   ├── TaskCard.tsx          # Individual task card
│   │   ├── TaskList.tsx          # Scrollable task list
│   │   ├── TaskTimer.tsx         # Focus timer overlay
│   │   └── TaskModal.tsx         # Add/Edit task modal
│   ├── routines/
│   │   ├── RoutineCard.tsx
│   │   └── RoutinePanel.tsx
│   ├── calendar/
│   │   ├── DayPicker.tsx         # Horizontal date selector
│   │   └── WeekView.tsx          # Week grid view
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── ColorPicker.tsx
│       └── IconPicker.tsx
│
├── contexts/
│   ├── ThemeContext.tsx          # Light/dark theme
│   ├── TaskContext.tsx           # Task state management
│   └── NotificationContext.tsx   # Push notifications
│
├── hooks/
│   ├── useStorage.ts             # AsyncStorage wrapper
│   ├── useNotifications.ts       # Notification scheduling
│   ├── useTimer.ts               # Focus timer logic
│   └── useHaptics.ts             # Haptic feedback
│
├── utils/
│   ├── colors.ts                 # Color palettes
│   ├── dates.ts                  # Date helpers
│   ├── recurrence.ts             # Recurrence logic
│   └── notifications.ts          # Notification helpers
│
├── types/
│   └── index.ts                  # TypeScript types
│
├── constants/
│   └── config.ts                 # App constants
│
├── assets/
│   ├── icons/
│   └── sounds/
│       └── notification.wav      # Notification sound
│
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tsconfig.json
└── package.json
```

---

## Key Migration Notes: Web → React Native

### Component Replacements

| Web (React) | React Native | Notes |
|-------------|--------------|-------|
| `<div>` | `<View>` | Import from 'react-native' |
| `<span>`, `<p>` | `<Text>` | All text must be in `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` | Better UX with haptics |
| `<input>` | `<TextInput>` | Different props |
| `<input type="time">` | Custom picker or `@react-native-community/datetimepicker` | No native time input |
| `onClick` | `onPress` | Different event name |
| CSS classes | `StyleSheet.create()` | No Tailwind (use NativeWind if desired) |
| `localStorage` | `AsyncStorage` | Async, different API |
| `Notification API` | `expo-notifications` | Different scheduling API |
| `window.AudioContext` | `expo-av` | Different audio API |

### CSS/Styling Migration

```tsx
// Web (Tailwind)
<div className="p-4 bg-white rounded-2xl shadow-lg">

// React Native
import { StyleSheet, View } from 'react-native';

<View style={styles.card}>

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android shadow
  },
});
```

### Storage Migration

```tsx
// Web
localStorage.setItem('tasks', JSON.stringify(tasks));
const tasks = JSON.parse(localStorage.getItem('tasks'));

// React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
const stored = await AsyncStorage.getItem('tasks');
const tasks = stored ? JSON.parse(stored) : [];
```

### Notifications Migration

```tsx
// React Native with Expo
import * as Notifications from 'expo-notifications';

// Configure
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permission
const { status } = await Notifications.requestPermissionsAsync();

// Schedule notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Task Reminder',
    body: 'Morning Stretch starts in 5 minutes',
    sound: true,
  },
  trigger: {
    date: new Date(Date.now() + 5 * 60 * 1000),
  },
});
```

---

## TypeScript Types

```typescript
// types/index.ts

export interface Task {
  id: string;
  title: string;
  icon: IconName;
  colorName: ColorName;
  time: string;           // "HH:mm" format
  duration: number;       // minutes
  date: string;           // "YYYY-MM-DD"
  completed: Record<string, boolean>;  // { "2024-01-15": true }
  recurrence: Recurrence;
  reminder: ReminderType;
  notificationId?: string; // For canceling scheduled notifications
}

export interface Recurrence {
  type: 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';
  days: number[];         // [0-6] for custom days
  endDate: string | null;
}

export type ReminderType = 'none' | 'atTime' | '5min' | '10min' | '15min' | '30min' | '1hour';

export interface Routine {
  id: string;
  name: string;
  icon: IconName;
  colorName: ColorName;
  isDefault: boolean;
  tasks: Omit<Task, 'id' | 'date' | 'completed' | 'recurrence'>[];
}

export type ColorName = 'coral' | 'sunshine' | 'mint' | 'sky' | 'lavender' | 'rose' | 'periwinkle' | 'teal';

export type IconName = 'sun' | 'moon' | 'coffee' | 'book' | 'dumbbell' | 'utensils' | 'briefcase' | 'heart' | 'music' | 'sparkles';

export interface ColorPalette {
  bg: string;
  accent: string;
  name: ColorName;
}
```

---

## Feature Implementation Priority

### Phase 1: Core MVP (Week 1-2)
- [ ] Project setup with Expo
- [ ] Basic navigation (tabs)
- [ ] Task data model & storage
- [ ] Day view with task list
- [ ] Add/Edit task modal
- [ ] Task completion toggle
- [ ] Light/Dark theme

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Week view
- [ ] Task recurrence logic
- [ ] Swipe gestures for navigation
- [ ] Focus timer
- [ ] Haptic feedback

### Phase 3: Notifications & Polish (Week 5-6)
- [ ] Push notification scheduling
- [ ] Notification sounds
- [ ] Routines library
- [ ] Copy task to other days
- [ ] Delete confirmations
- [ ] Animations (Reanimated)

### Phase 4: App Store (Week 7-8)
- [ ] App icons & splash screen
- [ ] App Store screenshots
- [ ] Privacy policy
- [ ] TestFlight beta testing
- [ ] App Store submission

---

## Key Dependencies Reference

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-notifications": "~0.29.0",
    "expo-haptics": "~14.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-blur": "~14.0.0",
    "expo-av": "~15.0.0",
    "@react-native-async-storage/async-storage": "2.1.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "lucide-react-native": "^0.460.0",
    "date-fns": "^4.1.0",
    "react-native-svg": "15.8.0"
  }
}
```

---

## Running the App

```bash
# Start development server
npx expo start

# Run on iOS Simulator
npx expo start --ios

# Run on physical device (scan QR with Expo Go app)
npx expo start

# Build for production
eas build --platform ios
```

---

## App Store Checklist

### Required Assets
- [ ] App Icon (1024x1024 PNG, no alpha)
- [ ] Splash Screen
- [ ] Screenshots (6.7", 6.5", 5.5" iPhones)
- [ ] App Preview Video (optional)

### Required Information
- [ ] App Name
- [ ] Subtitle
- [ ] Description
- [ ] Keywords
- [ ] Support URL
- [ ] Privacy Policy URL
- [ ] Age Rating answers

### Build Configuration (app.json)
```json
{
  "expo": {
    "name": "Tiimo Planner",
    "slug": "tiimo-planner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.yourname.tiimoplanner",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCalendarsUsageDescription": "Allow Tiimo to add tasks to your calendar",
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ]
  }
}
```

---

## Next Steps

1. **Set up development environment** following the instructions above
2. **Initialize project** with `create-expo-app`
3. **Start with the Task model** - define TypeScript types
4. **Build the TaskCard component** - the core visual element
5. **Implement storage** - get persistence working early
6. **Add navigation** - set up tab structure

Would you like me to generate any of these components as starter code?

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Expo Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
