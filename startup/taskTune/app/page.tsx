import { ThemeProvider } from "@/components/theme-provider"
import TaskTuneApp from "@/components/tasktune-app"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <TaskTuneApp />
    </ThemeProvider>
  )
}

