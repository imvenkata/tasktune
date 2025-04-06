"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTaskStore } from "@/lib/task-store"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import TaskModal from "@/components/task-modal"
import type { Task } from "@/lib/types"
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ICON_COLLECTION } from "@/components/icons"; // Import icon collection

export default function TaskCalendarView() {
  console.log("[TaskCalendarView] Rendering component")
  const { tasks, addTask, updateTask, toggleTaskCompletion } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [newTaskDate, setNewTaskDate] = useState<string | null>(null)
  const [newTaskTime, setNewTaskTime] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  // Add a state for the current view, with responsive default
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">(
    typeof window !== 'undefined' && window.innerWidth < 768 ? "day" : "month"
  )

  // Add renderIcon helper function
  const renderIcon = (iconId: string | null | undefined, size = "h-3 w-3") => {
    if (!iconId) return null;
    const IconComponent = ICON_COLLECTION[iconId as keyof typeof ICON_COLLECTION]
    return IconComponent ? <IconComponent className={cn(size, "text-muted-foreground/80")} /> : null
  }

  // Add responsive listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      
      // Auto-switch to day view on small screens if currently in month view
      if (window.innerWidth < 640 && currentView === "month") {
        setCurrentView("day")
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentView])

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(newDate)
    setSelectedDay(null)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(newDate)
    setSelectedDay(null)
  }

  // Update the goToToday function to normalize date
  const goToToday = () => {
    const today = new Date()
    // Create a new date object with year, month, date only to avoid time-related issues
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    setCurrentDate(normalizedToday)
    setSelectedDay(normalizedToday.getDate())
  }

  // Improved robust date formatting function
  const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Fix parseTaskDate function to be more robust
  const parseTaskDate = (dateString: string | null | undefined): number | null => {
    if (!dateString) {
      console.warn("Empty or undefined date string provided to parseTaskDate");
      return null;
    }

    try {
      // For YYYY-MM-DD format (from input type="date")
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split("-").map(Number);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          return day;
        }
      }

      // Try to parse it as a Date object
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.getDate();
      }
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
    }

    console.warn("Failed to parse date:", dateString);
    return null;
  }

  // Safe date comparison function
  const isSameDate = (date1: string, date2: string): boolean => {
    try {
      // Handle empty dates
      if (!date1 || !date2) return false;
      
      // Normalize dates if they're in YYYY-MM-DD format
      if (date1.match(/^\d{4}-\d{2}-\d{2}$/) && date2.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date1 === date2;
      }
      
      // Try parsing as Date objects and compare
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        return d1.getFullYear() === d2.getFullYear() && 
              d1.getMonth() === d2.getMonth() && 
              d1.getDate() === d2.getDate();
      }
    } catch (error) {
      console.error("Error comparing dates:", date1, date2, error);
    }
    
    return false;
  }

  // Get month data
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Prepare calendar grid
  const dayElements = []
  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
  const currentDay = today.getDate()

  // Calculate previous month's days to show
  const previousMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const previousMonthLength = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  for (let i = 0; i < previousMonthDays; i++) {
    const day = previousMonthLength - previousMonthDays + i + 1
    dayElements.push(
      <div
        key={`prev-${i}`}
        className="h-24 border border-gray-100 dark:border-gray-800 p-1 text-gray-400 dark:text-gray-600"
      >
        <span className="text-xs">{day}</span>
      </div>,
    )
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = isCurrentMonth && i === currentDay
    const isSelected = i === selectedDay

    // Improved date formatting for consistency
    const dayStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
    
    // Filter tasks for the current day using improved date comparison
    const tasksForDay = tasks.filter((task) => {
      // Handle potential date format issues
      if (!task.date) return false;
      
      return isSameDate(task.date, dayStr);
    });

    const hasTasks = tasksForDay.length > 0

    dayElements.push(
      <div
        key={i}
        className={cn(
          "h-24 border relative overflow-hidden cursor-pointer transition-colors group", // Added group for hover effects
          // Use theme border colors
          isToday ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-border hover:bg-secondary/50",
          isSelected ? "ring-2 ring-primary bg-primary/10 dark:bg-primary/15" : "",
        )}
        onClick={() => handleDayClick(i)}
      >
        <DroppableTimeSlot date={dayStr} hour={undefined}>
          <div className="p-1">
            <span
              className={cn(
                "inline-block rounded-full h-5 w-5 text-xs flex items-center justify-center font-medium", // Adjusted size slightly
                // Use theme primary for today marker
                isToday ? "bg-primary text-primary-foreground" : "text-foreground",
              )}
            >
              {i}
            </span>
          </div>

          {/* Refined task display for Month View */}
          <div className="px-1 mt-1 overflow-hidden space-y-0.5"> {/* Reduced spacing, added mt-1 */}
            {hasTasks && (
              <>
                {tasksForDay.slice(0, 2).map((task) => (
                  <DraggableTask key={task.id} task={task}>
                    <div
                      className={cn(
                        "p-1 rounded border text-xs mb-1 transition-colors flex items-center justify-between", // Added flex, justify-between
                        "border", // Keep base border
                      )}
                      style={{
                        backgroundColor: `${task.color}1A`,
                        borderColor: `${task.color}4D`,
                      }}
                      title={task.title}
                    >
                      {/* Left side: Toggle + Title */}
                      <div className="flex items-center overflow-hidden mr-1">
                        {/* Completion Toggle Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent slot click
                            toggleTaskCompletion(task.id);
                          }}
                          className="mr-1.5 flex-shrink-0 p-0.5 rounded hover:bg-background/20"
                          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-foreground/50 group-hover:border-foreground" />
                          )}
                        </button>
                        
                        {/* Task Title with conditional styling */}
                        <span 
                          className={cn(
                            "truncate flex-1", 
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}
                          onClick={(e) => handleTaskClick(task, e)} 
                          style={{ cursor: 'pointer' }} 
                        >
                          {task.title}
                        </span>
                      </div>
                      
                      {/* Right side: Icon */}
                      <div className="flex-shrink-0">
                        {renderIcon(task.icon, "h-3 w-3")} 
                      </div>
                    </div>
                  </DraggableTask>
                ))}

                {/* Refined '+ more' indicator */}
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1.5 pt-0.5">+{tasksForDay.length - 2} more</div>
                )}
              </>
            )}
          </div>
        </DroppableTimeSlot>
      </div>,
    )
  }

  // Calculate next month's days to show
  const totalCells = 42 // 6 rows of 7 days
  const nextMonthDays = totalCells - dayElements.length

  for (let i = 1; i <= nextMonthDays; i++) {
    dayElements.push(
      <div
        key={`next-${i}`}
        // Use theme border and text colors
        className="h-24 border border-border p-1 text-muted-foreground/50"
      >
        <span className="text-xs">{i}</span>
      </div>,
    )
  }

  // Add a function to handle view changes
  const changeView = (view: "month" | "week" | "day") => {
    setCurrentView(view)
  }

  // Handle click on a day in the month view
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    
    // Create date string for the selected day
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    
    // Open task modal with the selected date
    setNewTaskDate(dateStr);
    setNewTaskTime("09:00"); // Default to 9 AM
    setIsTaskModalOpen(true);
  }

  // Handle creating a new task from a time slot
  const handleTimeSlotClick = (dateStr: string, hour: number) => {
    // Format the hour as HH:00
    const formattedHour = hour.toString().padStart(2, '0') + ':00';
    
    // Calculate end time (1 hour later)
    const endHour = (hour + 1) % 24;
    const formattedEndHour = endHour.toString().padStart(2, '0') + ':00';
    
    console.log(`[TaskCalendarView] Opening task modal for date: ${dateStr}, time: ${formattedHour}`);
    
    // Set the date and time for the new task
    setNewTaskDate(dateStr);
    setNewTaskTime(formattedHour);
    
    // Open the task modal
    setIsTaskModalOpen(true);
  }
  
  // Handle saving a new task
  const handleSaveNewTask = (newTask: Task) => {
    console.log('[TaskCalendarView] Task saved:', newTask);
    
    if (editingTask) {
      // If we're editing an existing task, use updateTask
      console.log('[TaskCalendarView] Updating existing task:', newTask.id);
      updateTask(newTask.id, newTask);
    } else {
      // Otherwise add as a new task
      console.log('[TaskCalendarView] Adding new task');
      addTask(newTask);
    }
    
    // Clear editing state and close modal
    setEditingTask(null);
    setIsTaskModalOpen(false);
  }

  // Handle opening task for editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the day/slot click
    console.log('[TaskCalendarView] Opening task for editing:', task);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }
  
  // Set up drag and drop sensors with improved configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );
  
  // Handle drag end for task rescheduling with improved error handling
  const handleDragEnd = (event: DragEndEvent) => {
    try {
      const { active, over } = event;
      
      if (!active || !over) {
        console.log("[Drag] Missing active or over data, aborting drag operation");
        return;
      }
      
      // Extract task ID and target date/time from the draggable and droppable IDs
      const taskId = active.id.toString();
      
      // Validate droppable ID format
      const dropTargetParts = over.id.toString().split('|');
      if (dropTargetParts.length < 2) {
        console.error("[Drag] Invalid drop target format:", over.id);
        return;
      }
      
      const [targetType, targetDate, targetHour] = dropTargetParts;
      
      console.log(`[Drag] Moving task ${taskId} to ${targetDate} at ${targetHour || 'all day'}`);
      
      // Validate the target date
      if (!targetDate || !targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error("[Drag] Invalid target date format:", targetDate);
        return;
      }
      
      // Find the task in our tasks array
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error("[Drag] Task not found:", taskId);
        return;
      }
      
      // Create an updated version of the task with new date/time
      const updatedTask: Task = {
        ...task,
        date: targetDate,
      };
      
      // Only update time if a specific hour was targeted
      if (targetHour) {
        try {
          const hour = parseInt(targetHour, 10);
          if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            updatedTask.startTime = `${hour.toString().padStart(2, '0')}:00`;
            
            // If the task has an end time, adjust it relatively
            if (task.endTime) {
              const [currentStartHour, currentStartMinute] = task.startTime ? task.startTime.split(':').map(Number) : [0, 0];
              const [currentEndHour, currentEndMinute] = task.endTime.split(':').map(Number);
              
              // Calculate duration in minutes
              const startTimeInMinutes = (currentStartHour * 60) + (currentStartMinute || 0);
              const endTimeInMinutes = (currentEndHour * 60) + (currentEndMinute || 0);
              const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
              
              // Apply the same duration to the new start time
              const newStartTimeInMinutes = hour * 60;
              const newEndTimeInMinutes = newStartTimeInMinutes + durationInMinutes;
              
              // Convert back to HH:MM format
              const newEndHour = Math.floor(newEndTimeInMinutes / 60);
              const newEndMinute = newEndTimeInMinutes % 60;
              
              if (newEndHour <= 23) {
                updatedTask.endTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;
              } else {
                // Handle overflow to next day
                updatedTask.endTime = "23:59";
              }
            }
          } else {
            console.warn("[Drag] Hour out of range:", hour);
          }
        } catch (error) {
          console.error("[Drag] Error parsing hour:", error);
        }
      }
      
      // Update the task in the store
      updateTask(taskId, updatedTask);
    } catch (error) {
      console.error("[Drag] Unexpected error in drag handling:", error);
    }
  };

  // Create a draggable task component with error handling
  function DraggableTask({ task, children }: { task: Task, children: React.ReactNode }) {
    try {
      const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: task.id,
      });
      
      const style = transform ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1,
        cursor: 'grab'
      } : undefined;

      return (
        <div 
          ref={setNodeRef} 
          style={style}
          {...listeners} 
          {...attributes}
          data-dragging={isDragging ? "true" : undefined}
          data-task-id={task.id}
        >
          {children}
        </div>
      );
    } catch (error) {
      console.error("[DraggableTask] Error rendering draggable:", error);
      // Fallback to non-draggable in case of error
      return <div data-error="true">{children}</div>;
    }
  }

  // Create a droppable time slot component with error handling
  function DroppableTimeSlot({ date, hour, children }: { date: string, hour?: number, children: React.ReactNode }) {
    try {
      const {isOver, setNodeRef} = useDroppable({
        id: `slot|${date}|${hour || ''}`,
      });
      
      const style = {
        backgroundColor: isOver ? 'rgba(var(--primary)/0.1)' : undefined,
        transition: 'background-color 0.2s',
      };

      return (
        <div 
          ref={setNodeRef} 
          style={style} 
          className="h-full w-full"
          data-droppable="true"
          data-date={date}
          data-hour={hour}
          data-is-over={isOver ? "true" : undefined}
        >
          {children}
        </div>
      );
    } catch (error) {
      console.error("[DroppableTimeSlot] Error rendering droppable:", error, {date, hour});
      // Fallback to regular div in case of error
      return <div data-error="true">{children}</div>;
    }
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold">
            {monthName} {year}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm">
            Today
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Add to calendar</h4>
                  <p className="text-sm text-muted-foreground">Create a new task or event on this day.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">New Task</Button>
                  <Button>New Event</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-1">
            <Button
              variant={currentView === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => changeView("month")}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Month
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => changeView("week")}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Week
            </Button>
            <Button 
              variant={currentView === "day" ? "default" : "outline"} 
              size="sm" 
              onClick={() => changeView("day")}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Day
            </Button>
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {currentView === "month" && (
          <>
            <div className="grid grid-cols-7 text-center py-2 bg-secondary rounded-t-md border-b border-border">
              {windowWidth <= 640 ? 
                // Use shorter day names on mobile
                ["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))
                :
                ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))
              }
            </div>

            <div className="grid grid-cols-7 border-t border-l border-border rounded-b-md overflow-hidden bg-card">
              {dayElements}
            </div>
          </>
        )}

        {currentView === "week" && (
          <div className="mt-4">
            {/* Use theme colors for header */}
            <div className="grid grid-cols-7 text-center py-2 bg-secondary rounded-t-md border-b border-border">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const date = new Date(currentDate)
                const dayOfWeek = date.getDay()
                const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
                date.setDate(date.getDate() + diff)
                const today = new Date();
                const isToday = isSameDay(date, today)

                return (
                  <div key={day} className="text-sm font-medium px-1">
                    {/* Use theme text colors */}
                    <div className={cn(isToday ? "text-primary" : "text-muted-foreground")}>{day}</div>
                    <div className={cn("text-xs", isToday ? "text-primary font-semibold" : "text-muted-foreground")}>{date.getDate()}</div>
                  </div>
                )
              })}
            </div>

            {/* Use theme border/bg color */}
            <div className="border border-t-0 rounded-b-md overflow-hidden bg-card">
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 8
                return (
                  <div key={i} className="grid grid-cols-8 border-b border-border last:border-b-0 min-h-[60px]"> {/* Changed to 8 cols to include time */}
                    {/* Time Slot Column - Use theme colors */}
                    <div className="p-2 text-xs text-muted-foreground border-r border-border text-right">
                      {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
                    </div>
                    {/* Day Columns - Use theme colors, add hover effect */}
                    {Array.from({ length: 7 }, (_, j) => {
                      // Calculate the date for this column
                      const date = new Date(currentDate);
                      const dayOfWeek = date.getDay();
                      const diff = j - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                      date.setDate(date.getDate() + diff);
                      const formattedDate = format(date, 'yyyy-MM-dd');
                      
                      return (
                        <div 
                          key={j} 
                          className="border-r border-border last:border-r-0 p-1 hover:bg-secondary/50 relative"
                          onClick={() => handleTimeSlotClick(formattedDate, hour)}
                        >
                          <DroppableTimeSlot date={formattedDate} hour={hour}>
                            {/* Filter tasks for this specific weekday and hour */}
                            {tasks
                              .filter(task => {
                                // Match the date
                                
                                if (task.date !== formattedDate) return false;
                                
                                // Match the hour if startTime exists
                                if (task.startTime) {
                                  const taskStartHour = parseInt(task.startTime.split(':')[0], 10);
                                  return taskStartHour === hour;
                                }
                                
                                return false;
                              })
                              .map((task) => (
                                <DraggableTask key={task.id} task={task}>
                                  <div
                                    className={cn(
                                      "p-1 rounded border text-xs mb-1 transition-colors flex items-center justify-between", // Added flex, justify-between
                                      "border", // Keep base border
                                    )}
                                    style={{
                                      backgroundColor: `${task.color}1A`,
                                      borderColor: `${task.color}4D`,
                                    }}
                                    title={task.title}
                                  >
                                    {/* Left side: Toggle + Title */}
                                    <div className="flex items-center overflow-hidden mr-1">
                                      {/* Completion Toggle Button */}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent slot click
                                          toggleTaskCompletion(task.id);
                                        }}
                                        className="mr-1.5 flex-shrink-0 p-0.5 rounded hover:bg-background/20"
                                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                      >
                                        {task.completed ? (
                                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <div className="h-3 w-3 rounded-full border border-foreground/50 group-hover:border-foreground" />
                                        )}
                                      </button>
                                      
                                      {/* Task Title with conditional styling */}
                                      <span 
                                        className={cn(
                                          "truncate flex-1", 
                                          task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                        )}
                                        onClick={(e) => handleTaskClick(task, e)} 
                                        style={{ cursor: 'pointer' }} 
                                      >
                                        {task.title}
                                      </span>
                                    </div>
                                    
                                    {/* Right side: Icon */}
                                    <div className="flex-shrink-0">
                                      {renderIcon(task.icon, "h-3 w-3")} 
                                    </div>
                                  </div>
                                </DraggableTask>
                              ))
                            }
                          </DroppableTimeSlot>
                        </div>
                      );
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Responsive day view */}
        {currentView === "day" && (
          <div className="mt-4">
            <div className="text-center py-2 bg-secondary rounded-t-md border-b border-border">
              <div className="text-sm font-medium">
                {format(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    selectedDay || currentDate.getDate()
                  ),
                  "EEEE, MMMM d, yyyy"
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-card rounded-b-md border border-border">
              {Array.from({ length: 14 }, (_, i) => {
                const hour = i + 7
                return (
                  <div key={i} className="flex border-b border-border last:border-b-0 min-h-[60px]">
                    {/* Time Slot Column - Use theme colors */}
                    <div className="p-2 text-xs text-muted-foreground border-r border-border w-16 sm:w-20 text-right flex-shrink-0">
                      {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
                    </div>
                    {/* Task Area - Add hover effect */}
                    <div 
                      className="flex-1 p-1.5 space-y-1 hover:bg-secondary/50"
                      onClick={() => handleTimeSlotClick(format(currentDate, 'yyyy-MM-dd'), hour)}
                    >
                      <DroppableTimeSlot date={format(currentDate, 'yyyy-MM-dd')} hour={hour}>
                        {/* Filter tasks for the current day AND the specific hour */}
                        {tasks
                          .filter((task) => {
                            const taskDate = task.date ? new Date(task.date + 'T00:00:00') : null;
                            if (!taskDate) return false;
                            const isSameDate = isSameDay(taskDate, currentDate);
                            if (!isSameDate) return false;

                            if (task.startTime) {
                              const taskStartHour = parseInt(task.startTime.split(':')[0], 10);
                              return taskStartHour === hour;
                            }
                            
                            return false; 
                          })
                          .map((task) => (
                            <DraggableTask key={task.id} task={task}>
                              <div
                                className={cn(
                                  "p-2 rounded border transition-colors", // Base styles
                                  "border", // Ensure border is always applied
                                )}
                                style={{
                                  backgroundColor: `${task.color}1A`,
                                  borderColor: `${task.color}4D`,
                                }}
                                title={task.title}
                              >
                                {/* Main content flex container */}
                                <div className="flex items-center justify-between mb-1"> 
                                  {/* Left side: Toggle + Title */}
                                  <div className="flex items-center overflow-hidden mr-2">
                                    {/* Completion Toggle Button */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent slot click
                                        toggleTaskCompletion(task.id);
                                      }}
                                      className="mr-2 flex-shrink-0 p-0.5 rounded hover:bg-background/20"
                                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                    >
                                      {task.completed ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" /> // Slightly larger icon for Day View
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-foreground/50 group-hover:border-foreground" /> // Thicker border circle
                                      )}
                                    </button>
                                    
                                    {/* Task Title with conditional styling */}
                                    <span 
                                      className={cn(
                                        "text-sm font-medium truncate flex-1", // Added flex-1
                                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                      )}
                                      onClick={(e) => handleTaskClick(task, e)} // Keep modal opening on title click
                                      style={{ cursor: 'pointer' }} // Indicate title is clickable
                                    >
                                      {task.title}
                                    </span>
                                  </div>
                                  
                                  {/* Right side: Icon */}
                                  <div className="flex-shrink-0">
                                    {renderIcon(task.icon, "h-4 w-4")} 
                                  </div>
                                </div>
                                
                                {/* Time display */}
                                {(task.startTime) && (
                                   <div className={cn(
                                     "text-xs text-muted-foreground pl-[26px]", // Adjust padding to align with title
                                     task.completed && "line-through"
                                   )}>
                                     {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}
                                   </div>
                                 )}
                              </div>
                            </DraggableTask>
                          ))}
                      </DroppableTimeSlot>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DndContext>

      {/* Refine Selected Day Card */}
      {selectedDay && (
        <Card className="mt-4 p-4 bg-card border border-border">
          <h3 className="font-medium mb-2 text-foreground">
            Selected: {monthName} {selectedDay}, {year}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks for this day</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => {
                  // Create date string for the selected day
                  const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;
                  
                  // Open task modal with the selected date
                  setNewTaskDate(dateStr);
                  setNewTaskTime("09:00"); // Default to 9 AM
                  setIsTaskModalOpen(true);
                }}
              >
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            </div>

            {/* Refine Task List in Card */}
            <div className="border border-border rounded-md p-2 bg-background/50">
              {(() => {
                // Get tasks for the selected day 
                const selectedDayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;
                
                const tasksForSelectedDay = tasks.filter(task => task.date === selectedDayStr);
                
                return tasksForSelectedDay.length > 0 ? (
                  <div className="space-y-1.5">
                    {tasksForSelectedDay.slice(0, 3).map((task, i) => (
                      <div 
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between gap-2 py-1 px-1.5 rounded", // Removed cursor-pointer, Added justify-between
                          "border", // Add base border
                          "hover:bg-secondary/50" // Keep hover effect
                        )}
                        style={{
                          backgroundColor: `${task.color}1A`,
                          borderColor: `${task.color}4D`,
                        }}
                        onClick={(e) => handleTaskClick(task, e)} // Keep modal open on row click
                      >
                        {/* Left side: Toggle + Color Dot + Title */}
                        <div className="flex items-center overflow-hidden mr-1">
                          {/* Completion Toggle Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              toggleTaskCompletion(task.id);
                            }}
                            className="flex-shrink-0 p-0.5 rounded mr-1.5 hover:bg-background/20"
                            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-foreground/50 group-hover:border-foreground" />
                            )}
                          </button>
                          
                          {/* Color Dot */}
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0 mr-2"
                            style={{ backgroundColor: task.color || 'hsl(var(--primary))' }}
                          />
                          
                          {/* Task Title */}
                          <span className={cn("text-sm flex-1 truncate", task.completed ? "line-through text-muted-foreground" : "text-foreground")}>
                            {task.title}
                          </span>
                        </div>
                        
                        {/* Right side: Icon + Time */}
                        <div className="flex items-center flex-shrink-0">
                          {/* Icon */}
                          <div className="mr-2">
                            {renderIcon(task.icon, "h-4 w-4")} 
                          </div>
                          
                          {/* Time Display */}
                          {(task.startTime) && (
                            <span className={cn(
                              "text-xs text-muted-foreground",
                              task.completed && "line-through"
                            )}>
                              {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No tasks for this day</p>
                    {/* <p className="text-xs mt-1">Click "Add Task" to create one</p> */}
                  </div>
                );
              })()}
            </div>
          </div>
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveNewTask}
        initialDate={newTaskDate}
        initialTime={newTaskTime}
        initialTask={editingTask}
      />
    </div>
  );
}

