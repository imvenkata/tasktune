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
  task?: Task
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

export default function TaskModal({ task, onClose, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [notes, setNotes] = useState(task?.notes || "")

  // Date handling
  const defaultDate = task?.date ? new Date(task.date) : new Date()
  const [startDate, setStartDate] = useState<Date>(defaultDate)
  const [endDate, setEndDate] = useState<Date>(defaultDate)

  // Time handling
  const [startTime, setStartTime] = useState(task?.startTime || "09:00")
  const [endTime, setEndTime] = useState(task?.endTime || "10:00")

  const [color, setColor] = useState(task?.color || "purple")
  const [isAllDay, setIsAllDay] = useState(task?.isAllDay || false)
  const [isAnytime, setIsAnytime] = useState(task?.isAnytime || false)
  const [repeat, setRepeat] = useState(task?.repeat || "No repeat")
  const [subtasks, setSubtasks] = useState<SubTask[]>(task?.subTasks || [])
  const [newSubtask, setNewSubtask] = useState("")
  const [tags, setTags] = useState<string[]>(task?.category ? [task.category] : [])
  const [showTagsPopup, setShowTagsPopup] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false)
  const [description, setDescription] = useState(task?.notes || "")
  const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">(task?.energyLevel || "medium")

  // Color and icon selection
  const [showColorIconPopup, setShowColorIconPopup] = useState(false)
  const [selectedColor, setSelectedColor] = useState(task?.color || "#B5A8E0") // Default purple
  const [selectedIcon, setSelectedIcon] = useState<string | null>(task?.icon || null)
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
  }, [])

  // Update the handleSave function to ensure proper date formatting:
  const handleSave = () => {
    if (!title.trim()) {
      setTitle("Untitled task")
    }

    // Format the date as YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split("T")[0]
    const formattedEndDate = endDate.toISOString().split("T")[0]

    const newTask: Task = {
      id: task?.id || generateId(),
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
      completed: task?.completed || false,
      category: tags.length > 0 ? tags[0] : undefined,
      priority: task?.priority || "medium",
      energyLevel,
    }

    console.log("Saving task:", newTask)
    onSave(newTask)
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
  const renderIcon = (iconId: string, size = "h-6 w-6") => {
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

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden">
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title and color */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add title"
                className="w-full text-xl md:text-2xl font-medium mb-2 focus:outline-none focus:ring-0 border-0 p-0 placeholder:text-gray-400 transition-all"
              />
              {/* Update the notes section in the task modal */}
              <div>
                {notes || notes === " " ? (
                  <textarea
                    id="notes-input"
                    value={notes === " " ? "" : notes} // Fix to prevent showing a space
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write notes here"
                    className="w-full mt-2 p-2 border border-gray-200 rounded-md outline-none resize-none text-gray-600 min-h-[80px]"
                    autoFocus={notes === " "}
                  />
                ) : (
                  <button
                    className="text-gray-500 hover:text-gray-700 flex items-center text-sm group transition-all"
                    onClick={() => {
                      setNotes(" ") // Set a space to trigger the textarea to show with autoFocus
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-gray-700 transition-colors">Write notes here</span>
                  </button>
                )}
              </div>
            </div>

            {/* Color and Icon Circle */}
            <div
              ref={colorIconButtonRef}
              className="w-20 h-20 rounded-full relative cursor-pointer shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: selectedColor }}
              onClick={() => setShowColorIconPopup(!showColorIconPopup)}
            >
              {selectedIcon ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {renderIcon(selectedIcon, "h-10 w-10 text-white")}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Pencil className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Color and Icon Popup */}
          {showColorIconPopup && (
            <div ref={colorIconPopupRef} className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowColorIconPopup(false)}
              ></div>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 z-10 max-h-[80vh] overflow-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Color palette section */}
                  <div className="flex-1">
                    <div className="grid grid-cols-7 gap-3">
                      {COLOR_PALETTE.map((colorHex, index) => (
                        <button
                          key={index}
                          className={`w-10 h-10 rounded-full ${selectedColor === colorHex ? "ring-2 ring-gray-400" : ""}`}
                          style={{ backgroundColor: colorHex }}
                          onClick={() => setSelectedColor(colorHex)}
                        />
                      ))}
                      <button
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                        onClick={() => {
                          // In a real app, this would open a color picker
                          setSelectedColor("#B5A8E0") // Default back to purple for now
                        }}
                      />
                      <button
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                        onClick={() => setSelectedColor("transparent")}
                      >
                        <div className="w-8 h-0.5 bg-gray-400 transform rotate-45"></div>
                      </button>
                    </div>
                  </div>

                  {/* Icon selection section */}
                  <div className="flex-1">
                    {/* Search bar */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Recent section */}
                    <h3 className="text-lg font-medium mb-2">Recent</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {RECENT_ICONS.map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Activity section */}
                    <h3 className="text-lg font-medium mb-2">Activity</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ACTIVITY_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Bathroom & Household section */}
                    <h3 className="text-lg font-medium mb-2">Bathroom & Household</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {BATHROOM_HOUSEHOLD_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Objects section */}
                    <h3 className="text-lg font-medium mb-2">Objects</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {OBJECT_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Food section */}
                    <h3 className="text-lg font-medium mb-2">Food</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {FOOD_ICONS.filter((icon) => icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase())).map(
                        (icon) => (
                          <button
                            key={icon.id}
                            className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                            onClick={() => setSelectedIcon(icon.id)}
                          >
                            {renderIcon(icon.id, "h-6 w-6")}
                          </button>
                        ),
                      )}
                    </div>

                    {/* Clothes section */}
                    <h3 className="text-lg font-medium mb-2">Clothes</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {CLOTHES_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* People section */}
                    <h3 className="text-lg font-medium mb-2">People</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {PEOPLE_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Travel section */}
                    <h3 className="text-lg font-medium mb-2">Travel</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {TRAVEL_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Nature section */}
                    <h3 className="text-lg font-medium mb-2">Nature</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {NATURE_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Symbols section */}
                    <h3 className="text-lg font-medium mb-2">Symbols</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SYMBOL_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-6 w-6")}
                        </button>
                      ))}
                    </div>

                    {/* Flags section */}
                    <h3 className="text-lg font-medium mb-2">Flags</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {FLAG_ICONS.filter((icon) => icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase())).map(
                        (icon) => (
                          <button
                            key={icon.id}
                            className={`w-10 h-10 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                            onClick={() => setSelectedIcon(icon.id)}
                          >
                            {renderIcon(icon.id, "h-6 w-6")}
                          </button>
                        ),
                      )}
                    </div>

                    {/* Other icons */}
                    <div className="flex flex-wrap gap-2 mb-4 border-t pt-4">
                      {OTHER_ICONS.filter((icon) =>
                        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()),
                      ).map((icon) => (
                        <button
                          key={icon.id}
                          className={`w-8 h-8 flex items-center justify-center border rounded ${selectedIcon === icon.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                          onClick={() => setSelectedIcon(icon.id)}
                        >
                          {renderIcon(icon.id, "h-4 w-4")}
                        </button>
                      ))}
                    </div>

                    {/* Upload button */}
                    <div className="flex justify-between items-center mt-4">
                      <button className="flex items-center gap-2 text-gray-700">
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </button>
                      <button
                        className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center"
                        onClick={() => {
                          // In a real app, this would be a custom emoji picker
                        }}
                      >
                        <span className="text-xl">👋</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time settings */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg font-medium text-gray-700">Starts</span>
              <div className="flex gap-2">
                {/* Date picker for start date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-3 md:px-4 py-1 md:py-2 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors text-xs md:text-sm">
                      <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                      <span className="text-gray-800">{format(startDate, "PPP")}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Time picker for start time */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{startTime}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Select time</h4>
                      <div className="flex space-x-2">
                        <select
                          className="border rounded p-1"
                          value={startTime.split(":")[0]}
                          onChange={(e) => {
                            const hour = e.target.value
                            const minute = startTime.split(":")[1]
                            handleStartTimeChange(`${hour}:${minute}`)
                          }}
                        >
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <option key={hour} value={hour.toString().padStart(2, "0")}>
                              {hour.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-xl">:</span>
                        <select
                          className="border rounded p-1"
                          value={startTime.split(":")[1]}
                          onChange={(e) => {
                            const hour = startTime.split(":")[0]
                            const minute = e.target.value
                            handleStartTimeChange(`${hour}:${minute}`)
                          }}
                        >
                          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                            <option key={minute} value={minute.toString().padStart(2, "0")}>
                              {minute.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg font-medium text-gray-700">Ends</span>
              <div className="flex gap-2">
                {/* Date picker for end date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <CalendarIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{format(endDate, "PPP")}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Time picker for end time */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-800">{endTime}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Select time</h4>
                      <div className="flex space-x-2">
                        <select
                          className="border rounded p-1"
                          value={endTime.split(":")[0]}
                          onChange={(e) => {
                            const hour = e.target.value
                            const minute = endTime.split(":")[1]
                            handleEndTimeChange(`${hour}:${minute}`)
                          }}
                        >
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <option key={hour} value={hour.toString().padStart(2, "0")}>
                              {hour.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-xl">:</span>
                        <select
                          className="border rounded p-1"
                          value={endTime.split(":")[1]}
                          onChange={(e) => {
                            const hour = endTime.split(":")[0]
                            const minute = e.target.value
                            handleEndTimeChange(`${hour}:${minute}`)
                          }}
                        >
                          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                            <option key={minute} value={minute.toString().padStart(2, "0")}>
                              {minute.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">Repeat</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-800">{repeat}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-2">
                    <div className="space-y-1">
                      {["No repeat", "Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
                        <button
                          key={option}
                          className={cn(
                            "w-full text-left px-2 py-1 rounded hover:bg-gray-100",
                            repeat === option ? "bg-purple-100 text-purple-700" : "",
                          )}
                          onClick={() => {
                            setRepeat(option)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-lg font-medium text-gray-700">All day</span>
              <Switch checked={isAllDay} onCheckedChange={setIsAllDay} className="data-[state=checked]:bg-purple-600" />
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-lg font-medium text-gray-700">Anytime</span>
              <Switch
                checked={isAnytime}
                onCheckedChange={setIsAnytime}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-lg font-medium text-gray-700">Energy Required</span>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md flex items-center justify-center ${
                    energyLevel === "low" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setEnergyLevel("low")}
                >
                  <Battery className="h-4 w-4 mr-1" />
                  Low
                </button>
                <button
                  className={`px-3 py-1 rounded-md flex items-center justify-center ${
                    energyLevel === "medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setEnergyLevel("medium")}
                >
                  <Battery className="h-4 w-4 mr-1" />
                  Medium
                </button>
                <button
                  className={`px-3 py-1 rounded-md flex items-center justify-center ${
                    energyLevel === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setEnergyLevel("high")}
                >
                  <Battery className="h-4 w-4 mr-1" />
                  High
                </button>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

          {/* Subtasks */}
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-4 text-gray-800">Sub tasks</h3>
            <div className="space-y-2 mb-4">
              {subtasks.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="flex items-center bg-gray-50 rounded-xl p-3 group hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(index)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => updateSubtask(index, e.target.value)}
                    className={`flex-1 text-xs md:text-sm bg-transparent border-none outline-none ${
                      subtask.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  />
                  <button
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeSubtaskAtIndex(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <input
                type="text"
                placeholder="Add task"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 bg-transparent border-none p-3 outline-none text-gray-700 placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSubtask()
                  }
                }}
              />
              <div className="flex">
                <button className="p-3 text-gray-400 hover:text-gray-700 transition-colors" onClick={addSubtask}>
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  className="p-3 text-gray-400 hover:text-purple-600 transition-colors mr-1"
                  onClick={generateAISubtasks}
                  disabled={isGeneratingSubtasks}
                >
                  {isGeneratingSubtasks ? (
                    <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Tags</h3>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1.5 bg-gray-50 rounded-xl flex items-center gap-1 border border-gray-100 group hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">{tag}</span>
                  <button
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toggleTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <button
                ref={tagsButtonRef}
                className="px-3 py-1.5 bg-gray-50 rounded-xl flex items-center gap-1 border border-gray-100 hover:bg-gray-100 transition-colors"
                onClick={() => setShowTagsPopup(!showTagsPopup)}
              >
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Add tags</span>
              </button>
            </div>

            {/* Tags popup */}
            {showTagsPopup && (
              <div
                ref={tagsPopupRef}
                className="absolute z-10 mt-2 bg-white rounded-md shadow-lg p-4 border w-full max-w-md"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      className={`px-3 py-2 rounded-md border flex items-center gap-2 ${
                        tags.includes(tag.name) ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                      }`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    type="text"
                    placeholder="New tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 border rounded-l-md p-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addNewTag()
                      }
                    }}
                  />
                  <button className="bg-gray-200 p-2 rounded-r-md" onClick={addNewTag}>
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white backdrop-blur-sm bg-white/90">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-all"
            onClick={() => {
              if (task?.id && onDelete) {
                onDelete(task.id)
                onClose()
              } else {
                onClose()
              }
            }}
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="flex space-x-3">
            <button className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-800 flex items-center hover:bg-gray-200 transition-colors">
              <Play className="h-4 w-4 mr-2" />
              Start task
            </button>
            <button
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center hover:from-purple-700 hover:to-purple-800 transition-colors shadow-sm hover:shadow text-xs md:text-sm"
              onClick={handleSave}
            >
              <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

