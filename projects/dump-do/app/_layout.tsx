import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TaskProvider } from '../contexts/TaskContext';
import { BrainDumpProvider } from '../contexts/BrainDumpContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TaskProvider>
          <BrainDumpProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="task/[id]"
                options={{
                  presentation: 'modal',
                  title: 'Task Details'
                }}
              />
              <Stack.Screen
                name="routine/[id]"
                options={{
                  presentation: 'modal',
                  title: 'Routine'
                }}
              />
              <Stack.Screen
                name="focus/[taskId]"
                options={{
                  presentation: 'fullScreenModal',
                  title: 'Focus Mode'
                }}
              />
            </Stack>
          </BrainDumpProvider>
        </TaskProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
