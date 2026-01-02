# Tiimo Planner - iOS Mobile App

A neuroinclusive visual daily planner built with React Native and Expo.

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android
npx expo start --android
```

## 📁 Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Day View (Home)
│   │   ├── week.tsx       # Week View
│   │   ├── brain-dump.tsx # Brain Dump / To-Do
│   │   ├── insights.tsx   # Stats & Insights
│   │   └── settings.tsx   # Settings
│   ├── task/[id].tsx      # Task detail modal
│   ├── routine/[id].tsx   # Routine detail
│   └── focus/[taskId].tsx # Focus timer
│
├── components/            # Reusable components
│   ├── tasks/            # Task-related components
│   ├── brain-dump/       # Brain dump components
│   ├── calendar/         # Calendar components
│   ├── routines/         # Routine components
│   ├── insights/         # Analytics components
│   ├── focus/            # Focus mode components
│   └── ui/               # Generic UI components
│
├── contexts/             # React contexts for state
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── constants/            # App constants
├── assets/              # Images, sounds, animations
└── docs/                # Documentation & references
```

## 📚 Documentation

- **[CLAUDE.md](./docs/CLAUDE.md)** - Comprehensive project guide and coding standards
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Quick start guide
- **[TIIMO_MOBILE_SETUP.md](./docs/TIIMO_MOBILE_SETUP.md)** - Mobile setup instructions
- **[tiimo-planner-web-reference.jsx](./docs/tiimo-planner-web-reference.jsx)** - Web version reference

## 🛠 Tech Stack

- **React Native 0.81** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based navigation
- **React Native Reanimated** - Smooth animations
- **Lucide Icons** - Icon library
- **date-fns** - Date utilities

## 📦 Key Dependencies

- `expo-router` - File-based navigation
- `react-native-reanimated` - Native animations
- `react-native-gesture-handler` - Touch gestures
- `expo-notifications` - Local notifications
- `expo-haptics` - Haptic feedback
- `@react-native-async-storage/async-storage` - Local storage
- `lucide-react-native` - Icons
- `date-fns` - Date manipulation

## 🎯 Current Status

✅ **Phase 1: Project Setup**
- Expo project initialized
- Folder structure created
- Dependencies installed
- Basic navigation configured

🔄 **Next Steps:**
- Implement ThemeContext with dark mode
- Build TaskCard component
- Create TaskList with data persistence
- Add task creation/editing functionality

## 🔧 Development

```bash
# Type check
npx tsc --noEmit

# Clear cache and restart
npx expo start --clear

# iOS builds (requires EAS CLI)
eas build --profile preview --platform ios

# Production build
eas build --profile production --platform ios
```

## 📱 Features

### Phase 1 (Core MVP)
- Visual daily planner
- Color-coded task cards
- Custom icons
- Focus/Pomodoro timer
- Routines library
- Weekly view
- Task reminders
- Dark mode

### Phase 2 (Brain Dump)
- Quick capture interface
- Drag & drop scheduling
- Task estimation

### Phase 3 (Insights)
- Streak tracking
- Completion analytics
- Mood tracking

See [CLAUDE.md](./docs/CLAUDE.md) for complete feature roadmap.

## 🎨 Design System

- **Color Palettes**: 8 neuroinclusive color schemes
- **Typography**: Clear hierarchy, easy to read
- **Spacing**: Consistent 8px grid system
- **Animations**: 60fps native performance
- **Haptics**: Contextual tactile feedback

## 📄 License

Private project

---

**Built with ❤️ for neurodivergent individuals**
