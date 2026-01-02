#!/bin/bash

# ============================================
# Tiimo Planner - React Native Project Setup
# ============================================
# Run this script to quickly set up your project:
# chmod +x setup.sh && ./setup.sh

set -e  # Exit on error

echo "🚀 Setting up Tiimo Planner React Native project..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org or use nvm"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check for Xcode (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v xcode-select &> /dev/null; then
        echo "⚠️  Xcode command line tools not found. Installing..."
        xcode-select --install
    else
        echo "✅ Xcode CLI tools detected"
    fi
fi

# Create project
PROJECT_NAME="TiimoPlanner"

echo ""
echo "📦 Creating Expo project: $PROJECT_NAME"
npx create-expo-app@latest $PROJECT_NAME --template expo-template-blank-typescript

cd $PROJECT_NAME

# Install dependencies
echo ""
echo "📥 Installing dependencies..."

# Core Expo packages
npx expo install \
    expo-notifications \
    expo-haptics \
    expo-secure-store \
    expo-linear-gradient \
    expo-blur \
    expo-av

# Storage
npx expo install @react-native-async-storage/async-storage

# Animations & Gestures
npx expo install \
    react-native-reanimated \
    react-native-gesture-handler

# Navigation
npx expo install \
    @react-navigation/native \
    @react-navigation/bottom-tabs \
    react-native-screens \
    react-native-safe-area-context

# Icons & Graphics
npx expo install react-native-svg
npm install lucide-react-native

# Utilities
npm install date-fns

# Dev dependencies
npm install -D @types/react @types/react-native

# Create folder structure
echo ""
echo "📁 Creating project structure..."

mkdir -p app/\(tabs\)
mkdir -p app/task
mkdir -p components/tasks
mkdir -p components/routines
mkdir -p components/calendar
mkdir -p components/ui
mkdir -p contexts
mkdir -p hooks
mkdir -p utils
mkdir -p types
mkdir -p constants
mkdir -p assets/icons
mkdir -p assets/sounds

# Create placeholder files
echo "// Root layout" > app/_layout.tsx
echo "// Home tab (Day view)" > app/\(tabs\)/index.tsx
echo "// Week view tab" > app/\(tabs\)/week.tsx
echo "// Routines tab" > app/\(tabs\)/routines.tsx
echo "// Settings tab" > app/\(tabs\)/settings.tsx
echo "// Task detail modal" > app/task/[id].tsx

echo "// Theme context" > contexts/ThemeContext.tsx
echo "// Task context" > contexts/TaskContext.tsx
echo "// Notification context" > contexts/NotificationContext.tsx

echo "// Storage hook" > hooks/useStorage.ts
echo "// Notifications hook" > hooks/useNotifications.ts
echo "// Timer hook" > hooks/useTimer.ts
echo "// Haptics hook" > hooks/useHaptics.ts

echo "// Color palettes" > utils/colors.ts
echo "// Date utilities" > utils/dates.ts
echo "// Recurrence logic" > utils/recurrence.ts
echo "// Notification helpers" > utils/notifications.ts

echo "// App constants" > constants/config.ts

# Update app.json with proper config
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Tiimo Planner",
    "slug": "tiimo-planner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.yourname.tiimoplanner",
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "package": "com.yourname.tiimoplanner",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
EOF

# Create EAS config for builds
cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
EOF

echo ""
echo "✅ Project setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. cd $PROJECT_NAME"
echo "   2. Copy the types.ts file to ./types/index.ts"
echo "   3. Copy the TaskCard.tsx to ./components/tasks/TaskCard.tsx"
echo "   4. npx expo start"
echo ""
echo "📱 To run on iOS simulator:"
echo "   npx expo start --ios"
echo ""
echo "📚 Documentation:"
echo "   - Expo: https://docs.expo.dev"
echo "   - React Navigation: https://reactnavigation.org"
echo ""
echo "Happy coding! 🎉"
