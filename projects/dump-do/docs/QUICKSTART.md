# 🚀 Quick Start - Do This Now

## Step 1: Create Project Folder
```bash
mkdir -p ~/Projects/TiimoPlanner
cd ~/Projects/TiimoPlanner
```

## Step 2: Copy CLAUDE.md
Copy the `CLAUDE.md` file into this folder. This is your master instruction file for Claude Code.

## Step 3: Initialize Expo Project
```bash
npx create-expo-app@latest . --template expo-template-blank-typescript
```

## Step 4: Install All Dependencies (copy/paste this entire block)
```bash
# Core Expo packages
npx expo install expo-notifications expo-haptics expo-secure-store expo-linear-gradient expo-blur expo-av

# Storage
npx expo install @react-native-async-storage/async-storage

# Animations & Gestures
npx expo install react-native-reanimated react-native-gesture-handler

# Navigation
npx expo install expo-router expo-linking expo-constants
npx expo install react-native-screens react-native-safe-area-context

# Icons & Graphics
npx expo install react-native-svg
npm install lucide-react-native

# Utilities
npm install date-fns uuid
npm install -D @types/uuid
```

## Step 5: Update babel.config.js
Replace contents with:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

## Step 6: Create Folder Structure
```bash
mkdir -p app/\(tabs\) app/task app/focus
mkdir -p components/{tasks,brain-dump,calendar,routines,insights,focus,ui}
mkdir -p contexts hooks utils types constants
mkdir -p assets/{icons,sounds,animations}
```

## Step 7: Copy Starter Files
- Copy `types.ts` → `types/index.ts`
- Copy `TaskCard.tsx` → `components/tasks/TaskCard.tsx`

## Step 8: Test It Works
```bash
npx expo start
# Press 'i' for iOS Simulator
```

---

## 🤖 Using Claude Code

Once your project is set up, in VS Code with Claude Code:

1. Open the project folder
2. Claude Code will read `CLAUDE.md` automatically
3. Ask Claude Code to help you build features

### Example Prompts for Claude Code:

**Start building:**
```
"Read CLAUDE.md and set up the basic app structure with Expo Router tabs"
```

**Build a feature:**
```
"Create the ThemeContext based on the design system in CLAUDE.md"
```

**Continue work:**
```
"Let's work on Phase 2 - build the Brain Dump screen with the BrainDumpInput component"
```

**Fix issues:**
```
"The app crashes when I toggle dark mode - can you debug?"
```

---

## 📋 Build Order (What to Ask Claude Code)

### Week 1: Foundation
1. "Set up Expo Router with 5 tabs: Home, Week, Brain Dump, Insights, Settings"
2. "Create ThemeContext with light/dark mode and all color palettes"
3. "Build the TaskCard component with haptic feedback"
4. "Create TaskContext with useReducer for state management"
5. "Implement useStorage hook for AsyncStorage persistence"

### Week 2: Core Screens
6. "Build the Day View (Home tab) with task list sorted by time"
7. "Create the Add Task modal with all form fields"
8. "Build the Week View with horizontal date picker"
9. "Implement task completion toggle with animation"
10. "Add recurrence logic for repeating tasks"

### Week 3: Brain Dump & Timer
11. "Build Brain Dump tab with quick add input"
12. "Create draggable brain dump items"
13. "Build the Focus Timer screen with countdown"
14. "Add Pomodoro presets (25/5, 50/10)"
15. "Implement focus session tracking"

### Week 4: Insights & Polish
16. "Create streak counter component"
17. "Build completion rate charts"
18. "Add celebration animations on task complete"
19. "Implement notification scheduling"
20. "Final polish and bug fixes"

---

## ✅ You're Ready!

Once you complete Steps 1-8, you'll have a working Expo project. Then use Claude Code with the prompts above to build each feature systematically.

Good luck! 🎉
