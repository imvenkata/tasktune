"use client"

import { useState, useRef, useEffect } from "react"
import {
  CalendarIcon,
  Clock,
  Tag,
  Plus,
  X,
  Save,
  Play,
  Trash2,
  RefreshCw,
  Sparkles,
  Pencil,
  Upload,
  Search,
  Battery,
  CheckCircle2,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { generateId } from "@/lib/utils"
import type { Task, SubTask } from "@/lib/types"
import { ICON_COLLECTION } from "@/components/icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TaskModalProps {
  isOpen: boolean;
  task?: Task
  initialTask?: Task | null
  initialDate?: string | null
  initialTime?: string | null
  onClose: () => void
  onSave: (task: Task) => void
  onDelete?: (taskId: string) => void
}

// Predefined tag categories with emojis
const PREDEFINED_TAGS = [
  { id: "relationships", name: "Relationships", emoji: "👫" },
  { id: "hobby", name: "Hobby", emoji: "🎨" },
  { id: "social", name: "Social", emoji: "💬" },
  { id: "work", name: "Work", emoji: "💻" },
  { id: "exercise", name: "Exercise", emoji: "🚲" },
  { id: "health", name: "Health", emoji: "🧠" },
  { id: "pets", name: "Pets", emoji: "🐶" },
  { id: "human-needs", name: "Human needs", emoji: "🥛" },
  { id: "study", name: "Study", emoji: "📚" },
  { id: "household", name: "Household", emoji: "🧹" },
  { id: "self-care", name: "Self care", emoji: "❤️" },
  { id: "preparation", name: "Preparation", emoji: "🔔" },
]

// Color palette options
const COLOR_PALETTE = [
  // Row 1
  "#8FD3B6",
  "#B5A8E0",
  "#F9B294",
  "#B8D0FF",
  "#F9B9D4",
  "#F9E2D2",
  "#B5C9B7",
  // Row 2
  "#C5E0D8",
  "#D7D0F1",
  "#FCDBC1",
  "#D6E4FF",
  "#FCE0EB",
  "#FCF0E8",
  "#D7E4D9",
  // Row 3
  "#E1F1EA",
  "#EBE7F9",
  "#FEF0E7",
  "#EBF2FF",
  "#FEF0F5",
  "#FEF8F3",
  "#EBF2EC",
]

// Activity icons
const ACTIVITY_ICONS = [
  { id: "soccer", name: "Soccer" },
  { id: "basketball", name: "Basketball" },
  { id: "football", name: "Football" },
  { id: "baseball", name: "Baseball" },
  { id: "tennis", name: "Tennis" },
  { id: "volleyball", name: "Volleyball" },
  { id: "rugby", name: "Rugby" },
]

// Recent icons
const RECENT_ICONS = [
  { id: "computer", name: "Computer" },
  { id: "lightning", name: "Lightning" },
  { id: "rollercoaster", name: "Roller Coaster" },
  { id: "magnifier", name: "Magnifier" },
  { id: "fire", name: "Fire" },
]

// Other icons
const OTHER_ICONS = [
  { id: "clock", name: "Clock" },
  { id: "game", name: "Game Controller" },
  { id: "home", name: "Home" },
  { id: "bulb", name: "Light Bulb" },
  { id: "utensils", name: "Utensils" },
  { id: "infinity", name: "Infinity" },
  { id: "smile", name: "Smile" },
  { id: "car", name: "Car" },
  { id: "chat", name: "Chat" },
  { id: "heart", name: "Heart" },
  { id: "flag", name: "Flag" },
]

// Bathroom & Household icons
const BATHROOM_HOUSEHOLD_ICONS = [
  { id: "shower", name: "Shower" },
  { id: "toilet", name: "Toilet" },
  { id: "sink", name: "Sink" },
  { id: "utensils", name: "Utensils" },
  { id: "home", name: "Home" },
  { id: "bed", name: "Bed" },
  { id: "broom", name: "Broom" },
]

// Object icons
const OBJECT_ICONS = [
  { id: "briefcase", name: "Briefcase" },
  { id: "box", name: "Box" },
  { id: "phone", name: "Phone" },
  { id: "laptop", name: "Laptop" },
  { id: "camera", name: "Camera" },
  { id: "book", name: "Book" },
  { id: "gift", name: "Gift" },
]

// Food icons
const FOOD_ICONS = [
  { id: "apple", name: "Apple" },
  { id: "pizza", name: "Pizza" },
  { id: "coffee", name: "Coffee" },
  { id: "cake", name: "Cake" },
  { id: "ice-cream", name: "Ice Cream" },
  { id: "salad", name: "Salad" },
  { id: "burger", name: "Burger" },
]

// Clothes icons
const CLOTHES_ICONS = [
  { id: "shirt", name: "Shirt" },
  { id: "pants", name: "Pants" },
  { id: "shoes", name: "Shoes" },
  { id: "hat", name: "Hat" },
  { id: "socks", name: "Socks" },
  { id: "jacket", name: "Jacket" },
  { id: "dress", name: "Dress" },
]

// People icons
const PEOPLE_ICONS = [
  { id: "person", name: "Person" },
  { id: "family", name: "Family" },
  { id: "baby", name: "Baby" },
  { id: "man", name: "Man" },
  { id: "woman", name: "Woman" },
  { id: "couple", name: "Couple" },
  { id: "group", name: "Group" },
]

// Travel icons
const TRAVEL_ICONS = [
  { id: "plane", name: "Plane" },
  { id: "car", name: "Car" },
  { id: "train", name: "Train" },
  { id: "bus", name: "Bus" },
  { id: "bike", name: "Bike" },
  { id: "ship", name: "Ship" },
  { id: "taxi", name: "Taxi" },
]

// Nature icons
const NATURE_ICONS = [
  { id: "tree", name: "Tree" },
  { id: "flower", name: "Flower" },
  { id: "sun", name: "Sun" },
  { id: "moon", name: "Moon" },
  { id: "cloud", name: "Cloud" },
  { id: "rain", name: "Rain" },
  { id: "mountain", name: "Mountain" },
]

// Symbols icons
const SYMBOL_ICONS = [
  { id: "heart", name: "Heart" },
  { id: "star", name: "Star" },
  { id: "music", name: "Music" },
  { id: "flag", name: "Flag" },
  { id: "infinity", name: "Infinity" },
  { id: "circle", name: "Circle" },
  { id: "square", name: "Square" },
]

// Flag icons
const FLAG_ICONS = [
  { id: "flag-us", name: "USA" },
  { id: "flag-uk", name: "UK" },
  { id: "flag-eu", name: "EU" },
  { id: "flag-ca", name: "Canada" },
  { id: "flag-jp", name: "Japan" },
  { id: "flag-in", name: "India" },
  { id: "flag-br", name: "Brazil" },
]

export default function TaskModal({ 
  isOpen, 
  task, 
  initialTask = null,
  initialDate = null, 
  initialTime = null,
  onClose, 
  onSave, 
  onDelete 
}: TaskModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  const initialTaskData = initialTask || task || {
    id: "new-" + generateId(),
    title: "",
    date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    startTime: initialTime || "09:00",
    endTime: initialTime ? 
      `${(parseInt(initialTime.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00` : 
      "10:00",
    completed: false,
    priority: "medium",
    color: "#8FD3B6",
    icon: "",
    notes: "",
    subTasks: [],
  }
  
  const [currentTask, setCurrentTask] = useState<Task>(initialTaskData)

  const [title, setTitle] = useState(currentTask.title || "")
  const [notes, setNotes] = useState(currentTask.notes || "")

  // Date handling - ensure proper parsing of the date string
  const defaultDate = currentTask.date ? new Date(currentTask.date + 'T00:00:00') : new Date()
  const [startDate, setStartDate] = useState<Date>(defaultDate)
  const [endDate, setEndDate] = useState<Date>(defaultDate)

  // Time handling
  const [startTime, setStartTime] = useState(currentTask.startTime || "09:00")
  const [endTime, setEndTime] = useState(currentTask.endTime || "10:00")

  const [color, setColor] = useState(currentTask.color || "#B5A8E0")
  const [isAllDay, setIsAllDay] = useState(currentTask.isAllDay || false)
  const [isAnytime, setIsAnytime] = useState(currentTask.isAnytime || false)
  const [repeat, setRepeat] = useState(currentTask.repeat || "No repeat")
  const [subtasks, setSubtasks] = useState<SubTask[]>(currentTask.subTasks || [])
  const [newSubtask, setNewSubtask] = useState("")
  const [tags, setTags] = useState<string[]>(currentTask.category ? [currentTask.category] : [])
  const [showTagsPopup, setShowTagsPopup] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false)
  const [description, setDescription] = useState(currentTask.notes || "")
  const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">(currentTask.energyLevel || "medium")

  // Color and icon selection
  const [showColorIconPopup, setShowColorIconPopup] = useState(false)
  const [selectedColor, setSelectedColor] = useState(currentTask.color || "#B5A8E0") // Default purple
  const [selectedIcon, setSelectedIcon] = useState<string | null>(currentTask.icon || null)
  const [iconSearchQuery, setIconSearchQuery] = useState("")

  const tagsPopupRef = useRef<HTMLDivElement>(null)
  const tagsButtonRef = useRef<HTMLButtonElement>(null)
  const colorIconPopupRef = useRef<HTMLDivElement>(null)
  const colorIconButtonRef = useRef<HTMLDivElement>(null)

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle tags popup
      if (
        tagsPopupRef.current &&
        !tagsPopupRef.current.contains(event.target as Node) &&
        tagsButtonRef.current &&
        !tagsButtonRef.current.contains(event.target as Node)
      ) {
        setShowTagsPopup(false)
      }

      // Handle color/icon popup
      if (
        colorIconPopupRef.current &&
        !colorIconPopupRef.current.contains(event.target as Node) &&
        colorIconButtonRef.current &&
        !colorIconButtonRef.current.contains(event.target as Node)
      ) {
        setShowColorIconPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showTagsPopup, showColorIconPopup])

  // Update the handleSave function to ensure proper date formatting:
  const handleSave = () => {
    if (!title.trim()) {
      setTitle("Untitled task")
    }

    // Format the date as YYYY-MM-DD, ensuring we don't lose a day due to timezone issues
    // Use startDate's year, month, and day directly instead of ISO string parsing
    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`
    
    const newTask: Task = {
      id: currentTask.id,
      title: title.trim() || "Untitled task",
      date: formattedStartDate,
      startTime,
      endTime,
      color: selectedColor,
      icon: selectedIcon,
      notes,
      isAllDay,
      isAnytime,
      repeat,
      subTasks: subtasks,
      completed: currentTask.completed,
      category: tags.length > 0 ? tags[0] : undefined,
      priority: currentTask.priority,
      energyLevel,
    }

    console.log("Saving task:", newTask)
    onSave(newTask)
    onClose()
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return

    setSubtasks([
      ...subtasks,
      {
        id: generateId(),
        title: newSubtask,
        completed: false,
      },
    ])
    setNewSubtask("")
  }

  const toggleTag = (tagName: string) => {
    if (tags.includes(tagName)) {
      setTags(tags.filter((t) => t !== tagName))
    } else {
      setTags([...tags, tagName])
    }
  }

  const addNewTag = () => {
    if (!newTag.trim()) return
    toggleTag(newTag)
    setNewTag("")
  }

  // Update the generateAISubtasks function
  const generateAISubtasks = () => {
    if (!title.trim()) {
      // Don't generate subtasks if there's no title
      alert("Please add a task title first")
      return
    }

    setIsGeneratingSubtasks(true)

    // Simulate AI generation (in a real app, this would call an AI service)
    setTimeout(() => {
      const aiGeneratedSubtasks = generateSubtasksForTitle(title)
      setSubtasks([...subtasks, ...aiGeneratedSubtasks])
      setIsGeneratingSubtasks(false)
    }, 1000)
  }

  // Improve the generateSubtasksForTitle function to handle more cases
  const generateSubtasksForTitle = (taskTitle: string) => {
    const lowercaseTitle = taskTitle.toLowerCase()
    let generatedSubtasks: SubTask[] = []

    if (lowercaseTitle.includes("meeting") || lowercaseTitle.includes("call")) {
      generatedSubtasks = [
        { id: generateId(), title: "Prepare agenda", completed: false },
        { id: generateId(), title: "Send calendar invites", completed: false },
        { id: generateId(), title: "Prepare presentation slides", completed: false },
        { id: generateId(), title: "Take meeting notes", completed: false },
        { id: generateId(), title: "Send follow-up email", completed: false },
      ]
    } else if (lowercaseTitle.includes("report") || lowercaseTitle.includes("document")) {
      generatedSubtasks = [
        { id: generateId(), title: "Gather necessary data", completed: false },
        { id: generateId(), title: "Create outline", completed: false },
        { id: generateId(), title: "Write first draft", completed: false },
        { id: generateId(), title: "Review and edit", completed: false },
        { id: generateId(), title: "Format document", completed: false },
        { id: generateId(), title: "Submit for approval", completed: false },
      ]
    } else if (lowercaseTitle.includes("project") || lowercaseTitle.includes("develop")) {
      generatedSubtasks = [
        { id: generateId(), title: "Define project scope", completed: false },
        { id: generateId(), title: "Create project timeline", completed: false },
        { id: generateId(), title: "Assign responsibilities", completed: false },
        { id: generateId(), title: "Implement core features", completed: false },
        { id: generateId(), title: "Test functionality", completed: false },
        { id: generateId(), title: "Review and finalize", completed: false },
      ]
    } else if (lowercaseTitle.includes("clean") || lowercaseTitle.includes("house")) {
      generatedSubtasks = [
        { id: generateId(), title: "Gather cleaning supplies", completed: false },
        { id: generateId(), title: "Dust surfaces", completed: false },
        { id: generateId(), title: "Vacuum floors", completed: false },
        { id: generateId(), title: "Clean bathrooms", completed: false },
        { id: generateId(), title: "Take out trash", completed: false },
      ]
    } else {
      // Default subtasks for any other type of task
      generatedSubtasks = [
        { id: generateId(), title: "Research and plan", completed: false },
        { id: generateId(), title: "Prepare materials", completed: false },
        { id: generateId(), title: "Execute main task", completed: false },
        { id: generateId(), title: "Review results", completed: false },
        { id: generateId(), title: "Follow up if needed", completed: false },
      ]
    }

    return generatedSubtasks
  }

  // Render the selected icon or a default icon
  const renderIcon = (iconId: string, size = "h-5 w-5") => {
    const IconComponent = ICON_COLLECTION[iconId as keyof typeof ICON_COLLECTION]
    return IconComponent ? <IconComponent className={size} /> : null
  }

  // We don't need this anymore as we've added filtering directly in the render section

  const toggleSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks]
    updatedSubtasks[index] = { ...updatedSubtasks[index], completed: !updatedSubtasks[index].completed }
    setSubtasks(updatedSubtasks)
  }

  const updateSubtask = (index: number, newTitle: string) => {
    const updatedSubtasks = [...subtasks]
    updatedSubtasks[index] = { ...updatedSubtasks[index], title: newTitle }
    setSubtasks(updatedSubtasks)
  }

  const removeSubtaskAtIndex = (index: number) => {
    const updatedSubtasks = [...subtasks]
    updatedSubtasks.splice(index, 1)
    setSubtasks(updatedSubtasks)
  }

  // Time picker handler
  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
  }

  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
  }

  // Update useEffect to reset state when task prop changes (needed for editing existing tasks)
  useEffect(() => {
    if (initialTask) {
      // If editing an existing task, set the currentTask state and update individual fields
      setCurrentTask(initialTask); // Explicitly set currentTask
      setTitle(initialTask.title || "")
      setNotes(initialTask.notes || "")
      setStartDate(initialTask.date ? new Date(initialTask.date + 'T00:00:00') : new Date())
      setEndDate(initialTask.date ? new Date(initialTask.date + 'T00:00:00') : new Date())
      setStartTime(initialTask.startTime || "09:00")
      setEndTime(initialTask.endTime || "10:00")
      setColor(initialTask.color || "#B5A8E0")
      setSelectedColor(initialTask.color || "#B5A8E0")
      setIsAllDay(initialTask.isAllDay || false)
      setIsAnytime(initialTask.isAnytime || false)
      setRepeat(initialTask.repeat || "No repeat")
      setSubtasks(initialTask.subTasks || [])
      setTags(initialTask.category ? [initialTask.category] : [])
      setDescription(initialTask.notes || "")
      setEnergyLevel(initialTask.energyLevel || "medium")
      setSelectedIcon(initialTask.icon || null)
    } else if (isOpen) {
      // If creating a new task, reset currentTask and update fields based on initialDate/initialTime
      const newTaskData = {
        id: "new-" + generateId(),
        title: "",
        date: initialDate || format(new Date(), 'yyyy-MM-dd'),
        startTime: initialTime || "09:00",
        endTime: initialTime ? 
          `${(parseInt(initialTime.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00` : 
          "10:00",
        completed: false,
        priority: "medium" as "low" | "medium" | "high",
        color: "#8FD3B6",
        icon: "",
        notes: "",
        subTasks: [],
      }
      setCurrentTask(newTaskData); // Explicitly set currentTask for a new task
      
      if (initialDate) {
        const dateObj = new Date(initialDate + 'T00:00:00')
        setStartDate(dateObj)
        setEndDate(dateObj)
      } else {
        const now = new Date()
        setStartDate(now)
        setEndDate(now)
      }
      setTitle("")
      setNotes("")
      setStartTime(initialTime || "09:00")
      setEndTime(initialTime ? 
        `${(parseInt(initialTime.split(':')[0], 10) + 1).toString().padStart(2, '0')}:00` : 
        "10:00")
      setColor("#B5A8E0")
      setSelectedColor("#B5A8E0")
      setIsAllDay(false)
      setIsAnytime(false)
      setRepeat("No repeat")
      setSubtasks([])
      setTags([])
      setDescription("")
      setEnergyLevel("medium")
      setSelectedIcon(null)
    }
  }, [initialTask, isOpen, initialDate, initialTime]) // Include initialDate and initialTime in dependencies

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal Container - Apply theme, rounded corners, shadow */}
      <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-border overflow-hidden">
        {/* Modal Header - Cleaned up */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">{currentTask ? "Edit Task" : "New Task"}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Input - Refined */}
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium px-2 py-1 border-none focus:ring-0 bg-transparent placeholder-muted-foreground outline-none"
          />

          {/* Date & Time Section - Refined layout */}
          <div className="space-y-3">
             <div className="flex items-center space-x-3">
               {/* Date Picker Popover - Refined Button */}
               <Popover>
                 <PopoverTrigger asChild>
                   <button
                     className={cn(
                       "flex items-center text-sm px-3 py-1.5 rounded-md border border-input bg-background hover:bg-secondary transition-colors",
                       !startDate && "text-muted-foreground"
                     )}
                   >
                     <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                     {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                   </button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                   {/* Calendar Styling might need further theme alignment if default isn't enough */}
                   <Calendar
                     mode="single"
                     selected={startDate}
                     onSelect={(date) => date && setStartDate(date)}
                     initialFocus
                   />
                 </PopoverContent>
               </Popover>

               {/* Time Inputs (conditional) - Refined Inputs */}
               {!isAllDay && !isAnytime && (
                 <div className="flex items-center space-x-2">
                   <input
                     type="time"
                     value={startTime}
                     onChange={(e) => handleStartTimeChange(e.target.value)}
                     className="px-2 py-1 border border-input bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
                   />
                   <span>-</span>
                   <input
                     type="time"
                     value={endTime}
                     onChange={(e) => handleEndTimeChange(e.target.value)}
                     className="px-2 py-1 border border-input bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
                   />
                 </div>
               )}
            </div>

            {/* All Day / Anytime Switches - Refined Layout & Labels */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                <label htmlFor="all-day">All Day</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="anytime" checked={isAnytime} onCheckedChange={setIsAnytime} />
                <label htmlFor="anytime">Anytime</label>
              </div>
            </div>
          </div>

          {/* Color & Icon Picker Section - Refined Button */}
          <div className="relative flex items-center space-x-3">
             <div ref={colorIconButtonRef} className="flex items-center space-x-3">
                <button
                  onClick={() => setShowColorIconPopup(!showColorIconPopup)}
                  className="p-1.5 rounded-full border border-input hover:border-muted-foreground transition-colors"
                  style={{ backgroundColor: selectedColor }}
                  aria-label="Select color"
                />
                <button
                   onClick={() => setShowColorIconPopup(!showColorIconPopup)}
                   className="p-1.5 rounded-lg border border-input hover:bg-secondary transition-colors"
                   aria-label="Select icon"
                >
                   {selectedIcon ? renderIcon(selectedIcon, "h-5 w-5 text-muted-foreground") : <Sparkles className="h-5 w-5 text-muted-foreground" />} {/* Default to sparkles if no icon */}
                </button>
              </div>

             {/* Color/Icon Popup - Refined Styling */}
            {showColorIconPopup && (
              <div
                ref={colorIconPopupRef}
                className="absolute top-full left-0 mt-2 z-10 w-80 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-4"
              >
                {/* Color Palette Section */}
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Color</h4>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {COLOR_PALETTE.map((bgColor) => (
                    <button
                      key={bgColor}
                      className={cn(
                        "w-7 h-7 rounded-full border transition-transform hover:scale-110",
                        selectedColor === bgColor ? "ring-2 ring-offset-2 ring-primary ring-offset-popover" : "border-border/50",
                      )}
                      style={{ backgroundColor: bgColor }}
                      onClick={() => setSelectedColor(bgColor)}
                      aria-label={`Select color ${bgColor}`}
                    />
                  ))}
                </div>

                {/* Icon Section */}
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Icon</h4>
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search icons..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1 border border-input bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                   {/* Example Icon Category - Needs structure for all categories */}
                   <div className="grid grid-cols-7 gap-2">
                      {/* Filter and map ALL_ICONS based on iconSearchQuery */}
                      {[...RECENT_ICONS, ...OTHER_ICONS, ...FOOD_ICONS /* Add other categories */]
                        .filter(icon => icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()))
                        .map((icon) => (
                          <button
                             key={icon.id}
                             className={cn(
                               "p-1 rounded-md flex items-center justify-center hover:bg-secondary",
                               selectedIcon === icon.id ? "bg-secondary ring-1 ring-primary" : ""
                             )}
                             onClick={() => setSelectedIcon(icon.id)}
                             title={icon.name}
                          >
                             {renderIcon(icon.id, "h-5 w-5 text-muted-foreground")}
                          </button>
                        ))}
                    </div>
                    {/* Add more sections/categories as needed */}
                </div>
              </div>
            )}

            {/* Tags Section - Refined Button */}
            <div className="relative flex-1">
              <button
                 ref={tagsButtonRef}
                 onClick={() => setShowTagsPopup(!showTagsPopup)}
                 className="w-full flex items-center justify-between text-left px-3 py-1.5 rounded-md border border-input bg-background hover:bg-secondary text-sm transition-colors"
              >
                 <span className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Tags
                 </span>
                 <span className="text-foreground truncate max-w-[70%]">
                   {tags.length > 0 ? tags.map(tag => PREDEFINED_TAGS.find(t => t.id === tag)?.emoji).join(" ") || tags.join(", ") : "None"}
                 </span>
              </button>

              {/* Tags Popup - Refined Styling */}
              {showTagsPopup && (
                 <div
                   ref={tagsPopupRef}
                   className="absolute top-full left-0 mt-2 z-10 w-72 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-4 space-y-3"
                 >
                   <h4 className="text-xs font-semibold uppercase text-muted-foreground">Select Tags</h4>
                   <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                      {PREDEFINED_TAGS.map((tag) => (
                         <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={cn(
                              "w-full flex items-center text-left p-1.5 rounded-md text-sm hover:bg-secondary transition-colors",
                              tags.includes(tag.id) ? "bg-secondary font-medium" : ""
                            )}
                         >
                            <span className="mr-2">{tag.emoji}</span>
                            <span>{tag.name}</span>
                            {tags.includes(tag.id) && <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />}
                         </button>
                      ))}
                   </div>
                   {/* Add New Tag Input - Refined */}
                   <div className="flex pt-2 border-t border-border">
                       <input
                          type="text"
                          placeholder="New tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addNewTag(); }}
                          className="flex-1 px-2 py-1 border border-input bg-background rounded-l-md text-sm focus:ring-primary focus:border-primary"
                       />
                       <button
                          onClick={addNewTag}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-r-md text-sm font-medium hover:bg-primary/90 transition-colors"
                       >
                         Add
                       </button>
                    </div>
                 </div>
              )}
            </div>
          </div>

          {/* Notes / Description - Refined Textarea */}
          <textarea
            placeholder="Add notes or description..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full p-3 border border-input bg-background rounded-md text-sm focus:ring-primary focus:border-primary placeholder-muted-foreground resize-none"
          />

          {/* Subtasks Section - Refined */}
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-muted-foreground">Subtasks</h3>
             <div className="space-y-2">
               {subtasks.map((subtask, index) => (
                 <div key={index} className="flex items-center group bg-secondary/50 p-2 rounded-md">
                   <input
                     type="checkbox"
                     checked={subtask.completed}
                     onChange={() => toggleSubtask(index)}
                     className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                   />
                   <input
                     type="text"
                     value={subtask.title}
                     onChange={(e) => updateSubtask(index, e.target.value)}
                     className={cn(
                       "flex-1 text-sm bg-transparent outline-none focus:bg-background/50 px-1 py-0.5 rounded",
                       subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
                     )}
                   />
                   <button
                     onClick={() => removeSubtaskAtIndex(index)}
                     className="ml-2 p-1 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                     aria-label="Remove subtask"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                 </div>
               ))}
             </div>

             {/* Add Subtask Input & AI Button - Refined */}
             <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
                  className="flex-1 px-3 py-1.5 border border-input bg-background rounded-md text-sm focus:ring-primary focus:border-primary"
                />
                <button
                   onClick={generateAISubtasks}
                   disabled={isGeneratingSubtasks || !title}
                   className="p-2 rounded-md bg-secondary hover:bg-primary/10 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   title={!title ? "Enter a task title to generate subtasks" : "Generate subtasks with AI"}
                >
                   {isGeneratingSubtasks ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                </button>
             </div>
          </div>

          {/* Repeat & Energy Level (Example) - Needs proper dropdown/selection components */}
           <div className="flex items-center space-x-4 text-sm">
             <div className="flex items-center space-x-2 text-muted-foreground">
               <RefreshCw className="h-4 w-4" />
               {/* Replace with actual Dropdown/Select component later */}
               <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="px-2 py-1 border border-input bg-background rounded-md focus:ring-primary focus:border-primary"
                >
                  <option>No repeat</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
             </div>
             <div className="flex items-center space-x-2 text-muted-foreground">
               <Battery className="h-4 w-4" />
                {/* Replace with actual Button Group or Select component later */}
                <div className="flex space-x-1 bg-secondary p-0.5 rounded-md">
                   {["low", "medium", "high"].map((level) => (
                     <button
                       key={level}
                       onClick={() => setEnergyLevel(level as "low" | "medium" | "high")}
                       className={cn(
                         "px-2 py-0.5 rounded text-xs capitalize",
                         energyLevel === level ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                       )}
                     >
                       {level}
                     </button>
                   ))}
                 </div>
             </div>
           </div>

        </div>

        {/* Modal Footer - Refined Button Styles */}
        <div className="flex items-center justify-between p-4 border-t border-border flex-shrink-0 bg-secondary/50">
          <div>
             {currentTask && onDelete && (
                <button
                  onClick={() => onDelete(currentTask.id)}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete task"
                >
                   <Trash2 className="h-4 w-4 mr-1.5" />
                   Delete
                </button>
              )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-background border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Save task"
            >
              <Save className="h-4 w-4 mr-1.5 inline-block -mt-0.5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

