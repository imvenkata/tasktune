import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { Plus, Play, Pause, RotateCcw, Sun, Moon, Coffee, Book, Dumbbell, Utensils, Briefcase, Heart, Music, Sparkles, X, Check, Clock, Trash2, FolderOpen, Save, Layers, ChevronLeft, ChevronRight, Calendar, LayoutList, Sunrise, Sunset, Laptop, Zap, Copy, CheckCircle2, RefreshCw, Bell, BellOff, BellRing, Settings, Volume2, VolumeX, Database, AlertTriangle, CheckCheck, Search, Filter, BarChart3, Download, Upload, Undo2, FileText, Flag, AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

// Theme Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// Notification Context
const NotificationContext = createContext();
const useNotifications = () => useContext(NotificationContext);

// Storage Context
const StorageContext = createContext();
const useStorage = () => useContext(StorageContext);

const iconMap = {
  sun: Sun, moon: Moon, coffee: Coffee, book: Book, dumbbell: Dumbbell,
  utensils: Utensils, briefcase: Briefcase, heart: Heart, music: Music, sparkles: Sparkles,
};

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

const darkPalettes = [
  { bg: '#450A0A', accent: '#F87171', name: 'coral' },
  { bg: '#451A03', accent: '#FBBF24', name: 'sunshine' },
  { bg: '#052E16', accent: '#34D399', name: 'mint' },
  { bg: '#0C1929', accent: '#60A5FA', name: 'sky' },
  { bg: '#1E1B4B', accent: '#A78BFA', name: 'lavender' },
  { bg: '#4A0D2C', accent: '#F472B6', name: 'rose' },
  { bg: '#1E1B4B', accent: '#818CF8', name: 'periwinkle' },
  { bg: '#042F2E', accent: '#2DD4BF', name: 'teal' },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_KEYS = {
  TASKS: 'tiimo-tasks',
  ROUTINES: 'tiimo-routines',
  THEME: 'tiimo-theme',
  SOUND: 'tiimo-sound',
  NOTIFICATIONS: 'tiimo-notifications',
  LAST_SAVED: 'tiimo-last-saved',
};

const REMINDER_OPTIONS = [
  { value: 'none', label: 'No reminder', minutes: null },
  { value: 'atTime', label: 'At start time', minutes: 0 },
  { value: '5min', label: '5 min before', minutes: 5 },
  { value: '10min', label: '10 min before', minutes: 10 },
  { value: '15min', label: '15 min before', minutes: 15 },
  { value: '30min', label: '30 min before', minutes: 30 },
  { value: '1hour', label: '1 hour before', minutes: 60 },
];

const PRIORITY_OPTIONS = [
  { value: 'none', label: 'No priority', icon: Minus, color: 'gray' },
  { value: 'low', label: 'Low', icon: ArrowDown, color: 'blue' },
  { value: 'medium', label: 'Medium', icon: Minus, color: 'yellow' },
  { value: 'high', label: 'High', icon: ArrowUp, color: 'orange' },
  { value: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'red' },
];

// Use local date to avoid timezone issues
const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Function to get today's date string - call this instead of using a stale constant
const getTodayString = () => getDateString(new Date());

const shouldTaskAppearOnDate = (task, dateStr) => {
  const taskDate = new Date(task.date);
  const checkDate = new Date(dateStr);
  if (checkDate < taskDate) return false;
  if (task.recurrence?.endDate && checkDate > new Date(task.recurrence.endDate)) return false;
  const recurrence = task.recurrence || { type: 'none' };
  switch (recurrence.type) {
    case 'none': return dateStr === task.date;
    case 'daily': return true;
    case 'weekdays': const dow = checkDate.getDay(); return dow >= 1 && dow <= 5;
    case 'weekly': case 'custom':
      if (recurrence.days?.length > 0) return recurrence.days.includes(checkDate.getDay());
      return checkDate.getDay() === taskDate.getDay();
    default: return dateStr === task.date;
  }
};

const getRecurrenceLabel = (recurrence) => {
  if (!recurrence || recurrence.type === 'none') return null;
  switch (recurrence.type) {
    case 'daily': return 'Every day';
    case 'weekdays': return 'Weekdays';
    case 'weekly': case 'custom':
      if (recurrence.days?.length > 0) {
        if (recurrence.days.length === 7) return 'Every day';
        return recurrence.days.map(d => DAYS_OF_WEEK[d].slice(0, 2)).join(', ');
      }
      return 'Weekly';
    default: return null;
  }
};

// Restore color palette from stored color name
const restoreColor = (colorName, isDark) => {
  const palettes = isDark ? darkPalettes : lightPalettes;
  const found = palettes.find(p => p.name === colorName);
  return found || palettes[0];
};

const createDefaultTasks = () => {
  const today = getTodayString();
  return [
    { id: 1, title: 'Morning Stretch', icon: 'dumbbell', colorName: 'mint', time: '07:00', duration: 15, completed: {}, date: today, recurrence: { type: 'daily', endDate: null, days: [] }, reminder: '5min', priority: 'medium', notes: '' },
    { id: 2, title: 'Breakfast', icon: 'coffee', colorName: 'sunshine', time: '07:30', duration: 30, completed: {}, date: today, recurrence: { type: 'none' }, reminder: 'none', priority: 'none', notes: '' },
    { id: 3, title: 'Deep Work', icon: 'briefcase', colorName: 'sky', time: '09:00', duration: 90, completed: {}, date: today, recurrence: { type: 'weekdays', endDate: null, days: [] }, reminder: '15min', priority: 'high', notes: 'Focus on the most important project tasks' },
    { id: 4, title: 'Team Standup', icon: 'heart', colorName: 'rose', time: '10:00', duration: 30, completed: {}, date: today, recurrence: { type: 'weekly', endDate: null, days: [1, 3, 5] }, reminder: '5min', priority: 'medium', notes: '' },
    { id: 5, title: 'Lunch Break', icon: 'utensils', colorName: 'coral', time: '12:00', duration: 45, completed: {}, date: today, recurrence: { type: 'none' }, reminder: 'atTime', priority: 'low', notes: '' },
    { id: 6, title: 'Reading', icon: 'book', colorName: 'lavender', time: '20:00', duration: 30, completed: {}, date: today, recurrence: { type: 'daily', endDate: null, days: [] }, reminder: '10min', priority: 'none', notes: 'Current book: Atomic Habits' },
  ];
};

const createDefaultRoutines = () => [
  { id: 'morning', name: 'Morning Routine', icon: 'sunrise', colorName: 'sunshine', isDefault: true, tasks: [
    { title: 'Wake Up & Hydrate', icon: 'sun', colorName: 'sunshine', time: '06:30', duration: 10, reminder: 'none', priority: 'medium', notes: '' },
    { title: 'Morning Stretch', icon: 'dumbbell', colorName: 'mint', time: '06:45', duration: 15, reminder: '5min', priority: 'medium', notes: '' },
    { title: 'Healthy Breakfast', icon: 'coffee', colorName: 'coral', time: '07:30', duration: 30, reminder: 'atTime', priority: 'low', notes: '' },
  ]},
  { id: 'work', name: 'Work Day', icon: 'laptop', colorName: 'sky', isDefault: true, tasks: [
    { title: 'Check Emails', icon: 'briefcase', colorName: 'sky', time: '09:00', duration: 30, reminder: 'atTime', priority: 'medium', notes: '' },
    { title: 'Deep Work Block', icon: 'sparkles', colorName: 'lavender', time: '09:30', duration: 90, reminder: '5min', priority: 'high', notes: '' },
    { title: 'Lunch', icon: 'utensils', colorName: 'coral', time: '12:00', duration: 60, reminder: 'atTime', priority: 'low', notes: '' },
  ]},
  { id: 'evening', name: 'Evening Wind Down', icon: 'sunset', colorName: 'rose', isDefault: true, tasks: [
    { title: 'Evening Walk', icon: 'heart', colorName: 'mint', time: '18:00', duration: 30, reminder: '10min', priority: 'medium', notes: '' },
    { title: 'Dinner', icon: 'utensils', colorName: 'coral', time: '18:30', duration: 45, reminder: 'atTime', priority: 'low', notes: '' },
    { title: 'Reading', icon: 'book', colorName: 'periwinkle', time: '20:30', duration: 30, reminder: '15min', priority: 'none', notes: '' },
  ]},
];

const routineIconMap = { sunrise: Sunrise, sunset: Sunset, laptop: Laptop, zap: Zap, ...iconMap };

const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  return {
    onTouchStart: (e) => { touchEnd.current = null; touchStart.current = e.targetTouches[0].clientX; },
    onTouchMove: (e) => { touchEnd.current = e.targetTouches[0].clientX; },
    onTouchEnd: () => {
      if (!touchStart.current || !touchEnd.current) return;
      const distance = touchStart.current - touchEnd.current;
      if (Math.abs(distance) > threshold) { distance > 0 ? onSwipeLeft?.() : onSwipeRight?.(); }
    }
  };
};

// Storage Provider
function StorageProvider({ children }) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
    if (saved) setLastSaved(new Date(saved));
  }, []);

  const saveToStorage = useCallback((key, data) => {
    try {
      setSaveStatus('saving');
      localStorage.setItem(key, JSON.stringify(data));
      const now = new Date();
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, now.toISOString());
      setLastSaved(now);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      setSaveStatus('error');
      return false;
    }
  }, []);

  const loadFromStorage = useCallback((key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      return defaultValue;
    } catch (e) {
      console.error('Load error:', e);
      return defaultValue;
    }
  }, []);

  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setLastSaved(null);
    setSaveStatus('idle');
  }, []);

  const getStorageSize = useCallback(() => {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) total += item.length * 2; // UTF-16
    });
    return (total / 1024).toFixed(1); // KB
  }, []);

  return (
    <StorageContext.Provider value={{ saveToStorage, loadFromStorage, clearAllData, lastSaved, saveStatus, getStorageSize }}>
      {children}
    </StorageContext.Provider>
  );
}

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const isDark = theme === 'dark';
  const palettes = isDark ? darkPalettes : lightPalettes;

  const colors = {
    bg: isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
    card: isDark ? 'bg-gray-800' : 'bg-white',
    cardHover: isDark ? 'bg-gray-700' : 'bg-gray-50',
    header: isDark ? 'bg-gray-900/90' : 'bg-white/90',
    border: isDark ? 'border-gray-700' : 'border-gray-100',
    text: isDark ? 'text-gray-100' : 'text-gray-800',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-500',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    input: isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800',
    inputFocus: isDark ? 'focus:border-purple-400 focus:ring-purple-900' : 'focus:border-purple-400 focus:ring-purple-100',
    modal: isDark ? 'bg-gray-800' : 'bg-white',
    button: isDark ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-100 active:bg-gray-200',
    buttonText: isDark ? 'text-gray-200' : 'text-gray-700',
    accent: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700',
    accentHover: isDark ? 'active:bg-purple-800/50' : 'active:bg-purple-200',
    selected: isDark ? 'bg-purple-600' : 'bg-purple-500',
    danger: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600',
    success: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600',
    overlay: isDark ? 'bg-black/60' : 'bg-black/40',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, palettes, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Notification Provider
function NotificationProvider({ children }) {
  const [permission, setPermission] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) !== 'false');
  const [sentNotifications, setSentNotifications] = useState(new Set());
  const audioContext = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SOUND, soundEnabled); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, notificationsEnabled); }, [notificationsEnabled]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioContext.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) { console.log('Audio not supported'); }
  }, [soundEnabled]);

  const sendNotification = useCallback((title, body, tag) => {
    if (!notificationsEnabled || permission !== 'granted' || sentNotifications.has(tag)) return false;
    try {
      const notification = new Notification(title, { body, icon: '📋', tag, requireInteraction: false });
      notification.onclick = () => { window.focus(); notification.close(); };
      setSentNotifications(prev => new Set([...prev, tag]));
      playSound();
      setTimeout(() => setSentNotifications(prev => { const next = new Set(prev); next.delete(tag); return next; }), 3600000);
      return true;
    } catch (e) { return false; }
  }, [permission, notificationsEnabled, sentNotifications, playSound]);

  return (
    <NotificationContext.Provider value={{ permission, requestPermission, sendNotification, soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled, playSound }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default function App() {
  return (
    <StorageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <TiimoPlanner />
        </NotificationProvider>
      </ThemeProvider>
    </StorageProvider>
  );
}

function TiimoPlanner() {
  const { isDark, palettes, colors, toggleTheme } = useTheme();
  const { permission, sendNotification, notificationsEnabled } = useNotifications();
  const { saveToStorage, loadFromStorage, saveStatus } = useStorage();
  
  // Load tasks from storage, applying current theme colors
  const [tasks, setTasks] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.TASKS, null);
    if (stored) return stored;
    return createDefaultTasks();
  });
  
  const [routines, setRoutines] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.ROUTINES, null);
    if (stored) return stored;
    return createDefaultRoutines();
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoutinesPanel, setShowRoutinesPanel] = useState(false);
  const [showSaveRoutineModal, setShowSaveRoutineModal] = useState(false);
  const [showTaskActions, setShowTaskActions] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notification, setNotification] = useState(null);
  
  const [viewMode, setViewMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [addTaskDate, setAddTaskDate] = useState(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  // Statistics panel state
  const [showStats, setShowStats] = useState(false);

  // Export/Import state
  const [showExportImport, setShowExportImport] = useState(false);

  // Undo state
  const [undoStack, setUndoStack] = useState([]);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Save tasks whenever they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.TASKS, tasks);
    }, 500); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [tasks, saveToStorage]);

  // Save routines whenever they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [routines, saveToStorage]);

  // Helper to get color with current theme
  const getTaskColor = useCallback((task) => {
    return restoreColor(task.colorName, isDark);
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Notification scheduler
  useEffect(() => {
    if (!notificationsEnabled || permission !== 'granted') return;
    const checkNotifications = () => {
      const now = new Date();
      const todayStr = getDateString(now);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      tasks.forEach(task => {
        if (!shouldTaskAppearOnDate(task, todayStr)) return;
        if (task.completed?.[todayStr]) return;
        if (!task.reminder || task.reminder === 'none') return;
        const reminderOption = REMINDER_OPTIONS.find(r => r.value === task.reminder);
        if (!reminderOption || reminderOption.minutes === null) return;
        const [hours, mins] = task.time.split(':').map(Number);
        const taskMinutes = hours * 60 + mins;
        const notifyAtMinutes = taskMinutes - reminderOption.minutes;
        if (currentMinutes >= notifyAtMinutes && currentMinutes < notifyAtMinutes + 1) {
          const tag = `${task.id}-${todayStr}-${task.time}`;
          const body = reminderOption.minutes === 0 ? `Starting now! (${task.duration} min)` : `Starting in ${reminderOption.minutes} minutes`;
          sendNotification(`🔔 ${task.title}`, body, tag);
        }
      });
    };
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [tasks, notificationsEnabled, permission, sendNotification]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sendNotification('⏰ Timer Complete!', `${activeTimer?.title} is done!`, `timer-${Date.now()}`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeTimer, sendNotification]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const goToPreviousDay = () => setSelectedDate(addDays(selectedDate, -1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToPreviousWeek = () => setWeekStart(addDays(weekStart, -7));
  const goToNextWeek = () => setWeekStart(addDays(weekStart, 7));

  const daySwipe = useSwipe(goToNextDay, goToPreviousDay);
  const weekSwipe = useSwipe(goToNextWeek, goToPreviousWeek);

  const showNotificationToast = (message, type = 'success') => setNotification({ message, type });

  const getTasksForDate = useCallback((date, applyFilters = true) => {
    const dateStr = getDateString(date);
    let filteredTasks = tasks.filter(t => shouldTaskAppearOnDate(t, dateStr));

    // Apply search filter
    if (applyFilters && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    // Apply priority filter
    if (applyFilters && filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
    }

    return filteredTasks
      .map(t => ({ ...t, color: getTaskColor(t), isCompleted: t.completed?.[dateStr] || false, instanceDate: dateStr }))
      .sort((a, b) => {
        // Sort by priority first (urgent > high > medium > low > none), then by time
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
        const priorityDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        if (priorityDiff !== 0) return priorityDiff;
        return a.time.localeCompare(b.time);
      });
  }, [tasks, getTaskColor, searchQuery, filterPriority]);

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));
    return days;
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setWeekStart(getStartOfWeek(new Date()));
  };

  const loadRoutine = (routine, targetDate = selectedDate) => {
    const dateStr = getDateString(targetDate);
    const newTasks = routine.tasks.map((task, index) => ({
      ...task, id: Date.now() + index, completed: {}, date: dateStr, recurrence: { type: 'none' },
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setShowRoutinesPanel(false);
    showNotificationToast(`Added "${routine.name}"`);
  };

  const replaceWithRoutine = (routine) => {
    const dateStr = getDateString(selectedDate);
    const filteredTasks = tasks.filter(t => t.recurrence?.type !== 'none' || t.date !== dateStr);
    const newTasks = routine.tasks.map((task, index) => ({
      ...task, id: Date.now() + index, completed: {}, date: dateStr, recurrence: { type: 'none' },
    }));
    setTasks([...filteredTasks, ...newTasks]);
    setShowRoutinesPanel(false);
    showNotificationToast(`Loaded "${routine.name}"`);
  };

  const saveAsRoutine = (name, icon) => {
    const dayTasks = getTasksForDate(selectedDate);
    const newRoutine = {
      id: `custom-${Date.now()}`, name, icon,
      colorName: lightPalettes[Math.floor(Math.random() * lightPalettes.length)].name,
      isDefault: false,
      tasks: dayTasks.map(({ title, icon, colorName, time, duration, reminder }) => ({ title, icon, colorName, time, duration, reminder: reminder || 'none' })),
    };
    setRoutines(prev => [...prev, newRoutine]);
    setShowSaveRoutineModal(false);
    showNotificationToast(`Saved "${name}"`);
  };

  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
    showNotificationToast('Routine deleted');
  };

  const copySingleTask = (task, targetDates) => {
    const { color, isCompleted, instanceDate, ...taskData } = task;
    const newTasks = targetDates.map((date, index) => ({
      ...taskData, id: Date.now() + index, date: getDateString(date), completed: {}, recurrence: { type: 'none' },
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setShowCopyModal(null);
    setShowTaskActions(null);
    showNotificationToast(`Copied to ${targetDates.length} day${targetDates.length > 1 ? 's' : ''}`);
  };

  const copyAllTasks = (targetDates) => {
    const currentDayTasks = getTasksForDate(selectedDate);
    let newTasks = [];
    targetDates.forEach((date, dateIndex) => {
      currentDayTasks.forEach((task, taskIndex) => {
        const { color, isCompleted, instanceDate, ...taskData } = task;
        newTasks.push({ ...taskData, id: Date.now() + dateIndex * 1000 + taskIndex, date: getDateString(date), completed: {}, recurrence: { type: 'none' } });
      });
    });
    setTasks(prev => [...prev, ...newTasks]);
    setShowCopyModal(null);
    showNotificationToast(`Copied ${currentDayTasks.length} tasks to ${targetDates.length} days`);
  };

  const startTimer = (task) => {
    setActiveTimer(task);
    setTimerSeconds(task.duration * 60);
    setIsTimerRunning(true);
    setShowTaskActions(null);
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => { if (activeTimer) { setTimerSeconds(activeTimer.duration * 60); setIsTimerRunning(false); } };
  const closeTimer = () => { setActiveTimer(null); setIsTimerRunning(false); setTimerSeconds(0); };

  const toggleComplete = (taskId, instanceDate) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newCompleted = { ...t.completed };
        newCompleted[instanceDate] = !newCompleted[instanceDate];
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
    setShowTaskActions(null);
  };

  const deleteTask = (taskId, deleteAll = false, instanceDate = null) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Save task to undo stack before deleting
    setUndoStack(prev => [...prev.slice(-9), { type: 'delete', task: { ...task }, timestamp: Date.now() }]);
    setShowUndoToast(true);
    setTimeout(() => setShowUndoToast(false), 5000);

    if (deleteAll || !task?.recurrence || task.recurrence.type === 'none') {
      setTasks(tasks.filter(t => t.id !== taskId));
      showNotificationToast('Task deleted');
    } else if (instanceDate) {
      const skipDate = new Date(instanceDate);
      skipDate.setDate(skipDate.getDate() - 1);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, recurrence: { ...t.recurrence, endDate: getDateString(skipDate) } } : t));
      showNotificationToast('Recurring task ended');
    }
    setShowTaskActions(null);
    setShowDeleteConfirm(null);
  };

  const undoLastDelete = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    if (lastAction.type === 'delete') {
      setTasks(prev => [...prev, lastAction.task]);
      setUndoStack(prev => prev.slice(0, -1));
      setShowUndoToast(false);
      showNotificationToast('Task restored');
    }
  };

  const clearDayTasks = () => {
    const dateStr = getDateString(selectedDate);
    const tasksToDelete = tasks.filter(t => t.recurrence?.type === 'none' && t.date === dateStr);

    // Save all deleted tasks to undo stack
    if (tasksToDelete.length > 0) {
      setUndoStack(prev => [...prev.slice(-9), { type: 'clearDay', tasks: tasksToDelete, date: dateStr, timestamp: Date.now() }]);
      setShowUndoToast(true);
      setTimeout(() => setShowUndoToast(false), 5000);
    }

    setTasks(tasks.filter(t => t.recurrence?.type !== 'none' || t.date !== dateStr));
    showNotificationToast('Day cleared');
  };

  // Calculate statistics
  const getStatistics = useCallback(() => {
    const today = getTodayString();
    const todayTasks = tasks.filter(t => shouldTaskAppearOnDate(t, today));
    const completedToday = todayTasks.filter(t => t.completed?.[today]).length;

    // Last 7 days statistics
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = addDays(new Date(), -i);
      const dateStr = getDateString(date);
      const dayTasks = tasks.filter(t => shouldTaskAppearOnDate(t, dateStr));
      const completed = dayTasks.filter(t => t.completed?.[dateStr]).length;
      last7Days.push({ date: dateStr, total: dayTasks.length, completed, day: DAYS_OF_WEEK[date.getDay()] });
    }

    const totalTasksLast7 = last7Days.reduce((sum, d) => sum + d.total, 0);
    const completedLast7 = last7Days.reduce((sum, d) => sum + d.completed, 0);
    const completionRate = totalTasksLast7 > 0 ? Math.round((completedLast7 / totalTasksLast7) * 100) : 0;

    // Priority breakdown
    const priorityStats = { urgent: 0, high: 0, medium: 0, low: 0, none: 0 };
    tasks.forEach(t => { if (t.priority) priorityStats[t.priority]++; });

    return { todayTasks: todayTasks.length, completedToday, last7Days, completionRate, priorityStats, totalTasks: tasks.length };
  }, [tasks]);

  // Export data
  const exportData = () => {
    const data = { tasks, routines, exportDate: new Date().toISOString(), version: '1.0' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiimo-planner-backup-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotificationToast('Data exported successfully');
  };

  // Import data
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        }
        if (data.routines && Array.isArray(data.routines)) {
          setRoutines(data.routines);
        }
        showNotificationToast('Data imported successfully');
        setShowExportImport(false);
      } catch (err) {
        showNotificationToast('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning ☀️';
    if (hour < 17) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const weekDays = getWeekDays();
  const tasksWithReminders = selectedDateTasks.filter(t => t.reminder && t.reminder !== 'none').length;

  return (
    <div className={`min-h-screen ${colors.bg} touch-pan-y transition-colors duration-300`}>
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg text-white font-medium text-sm ${notification.type === 'success' ? 'bg-green-500' : 'bg-purple-500'}`}>
          {notification.message}
        </div>
      )}

      {/* Save Status Indicator */}
      {saveStatus === 'saving' && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500 text-white text-xs font-medium">
          <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
        </div>
      )}
      {saveStatus === 'saved' && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-medium">
          <CheckCheck className="w-3 h-3" /> Saved
        </div>
      )}

      {/* Undo Toast */}
      {showUndoToast && undoStack.length > 0 && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-800 text-white shadow-xl">
          <span className="text-sm">Task deleted</span>
          <button onClick={undoLastDelete} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 rounded-xl text-sm font-medium active:bg-purple-600">
            <Undo2 className="w-4 h-4" /> Undo
          </button>
        </div>
      )}

      {/* Header */}
      <div className={`sticky top-0 z-10 ${colors.header} backdrop-blur-lg border-b ${colors.border} safe-area-top transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className={`text-xl font-bold ${colors.text} truncate`}>{getGreeting()}</h1>
              <p className={`${colors.textSecondary} text-sm mt-0.5`}>
                {viewMode === 'day' 
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                  : `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSearch(!showSearch)} className={`flex items-center justify-center w-11 h-11 ${showSearch ? colors.accent : colors.button} rounded-2xl transition-colors`}>
                <Search className={`w-5 h-5 ${showSearch ? '' : colors.textSecondary}`} />
              </button>
              <button onClick={() => setShowStats(true)} className={`flex items-center justify-center w-11 h-11 ${colors.button} rounded-2xl transition-colors`}>
                <BarChart3 className={`w-5 h-5 ${colors.textSecondary}`} />
              </button>
              <button onClick={() => setShowSettings(true)} className={`flex items-center justify-center w-11 h-11 ${colors.button} rounded-2xl transition-colors relative`}>
                <Settings className={`w-5 h-5 ${colors.textSecondary}`} />
                {notificationsEnabled && permission === 'granted' && tasksWithReminders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-medium">{tasksWithReminders}</span>
                )}
              </button>
              <button onClick={toggleTheme} className={`flex items-center justify-center w-11 h-11 ${colors.button} rounded-2xl transition-colors`}>
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <div className={`flex ${colors.button} rounded-2xl p-1`}>
                <button onClick={() => setViewMode('day')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 min-h-[44px] ${viewMode === 'day' ? `${colors.card} shadow ${isDark ? 'text-purple-400' : 'text-purple-700'}` : colors.textSecondary}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('week')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 min-h-[44px] ${viewMode === 'week' ? `${colors.card} shadow ${isDark ? 'text-purple-400' : 'text-purple-700'}` : colors.textSecondary}`}>
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setShowRoutinesPanel(true)} className={`flex items-center justify-center w-11 h-11 ${colors.accent} ${colors.accentHover} rounded-2xl transition-colors`}>
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <button onClick={viewMode === 'day' ? goToPreviousDay : goToPreviousWeek} className={`p-3 -ml-2 ${colors.button} rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}>
              <ChevronLeft className={`w-5 h-5 ${colors.textSecondary}`} />
            </button>
            <button onClick={goToToday} className={`px-5 py-2.5 text-sm font-medium ${isDark ? 'text-purple-400 active:bg-purple-900/30' : 'text-purple-600 active:bg-purple-50'} rounded-xl transition-colors min-h-[44px]`}>
              Today
            </button>
            <button onClick={viewMode === 'day' ? goToNextDay : goToNextWeek} className={`p-3 -mr-2 ${colors.button} rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}>
              <ChevronRight className={`w-5 h-5 ${colors.textSecondary}`} />
            </button>
          </div>

          {/* Search and Filter Bar */}
          {showSearch && (
            <div className="mt-3 space-y-3">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.textMuted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-base transition-colors`}
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <X className={`w-5 h-5 ${colors.textMuted}`} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {['all', ...PRIORITY_OPTIONS.map(p => p.value)].map((priority) => {
                  const opt = priority === 'all' ? { label: 'All', color: 'gray' } : PRIORITY_OPTIONS.find(p => p.value === priority);
                  const isActive = filterPriority === priority;
                  return (
                    <button
                      key={priority}
                      onClick={() => setFilterPriority(priority)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-purple-500 text-white' : `${colors.button} ${colors.buttonText}`}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {weekDays.map((day) => {
                const isSelected = getDateString(day) === getDateString(selectedDate);
                const isToday = getDateString(day) === getTodayString();
                const dayTasks = getTasksForDate(day);
                const hasReminders = dayTasks.some(t => t.reminder && t.reminder !== 'none');
                return (
                  <button key={day.toISOString()} onClick={() => setSelectedDate(day)} className={`flex-shrink-0 w-14 py-2.5 rounded-2xl text-center transition-all min-h-[72px] ${isSelected ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : isToday ? `${colors.accent}` : `${colors.card} ${colors.cardHover}`}`}>
                    <div className={`text-xs font-medium ${isSelected ? 'text-purple-200' : colors.textSecondary}`}>
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold mt-0.5 ${isSelected ? 'text-white' : colors.text}`}>{day.getDate()}</div>
                    {dayTasks.length > 0 && (
                      <div className="flex justify-center gap-0.5 mt-1">
                        {hasReminders ? <Bell className={`w-3 h-3 ${isSelected ? 'text-purple-200' : 'text-purple-400'}`} /> :
                          [...Array(Math.min(dayTasks.length, 3))].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-200' : 'bg-purple-400'}`} />
                          ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Timer Overlay */}
      {activeTimer && (
        <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm flex items-center justify-center p-4`}>
          <div className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative" style={{ backgroundColor: activeTimer.color.bg }}>
            <button onClick={closeTimer} className="absolute top-4 right-4 p-3 rounded-full active:bg-black/10 transition-colors min-h-[44px] min-w-[44px]">
              <X className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: activeTimer.color.accent }}>
              {React.createElement(iconMap[activeTimer.icon], { className: 'w-10 h-10 text-white' })}
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>{activeTimer.title}</h2>
            <div className="relative w-52 h-52 mx-auto my-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="104" cy="104" r="96" fill="none" stroke={isDark ? '#374151' : 'white'} strokeWidth="10" />
                <circle cx="104" cy="104" r="96" fill="none" stroke={activeTimer.color.accent} strokeWidth="10" strokeLinecap="round" strokeDasharray={603} strokeDashoffset={603 - (603 * timerSeconds) / (activeTimer.duration * 60)} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} tabular-nums`}>{formatTime(timerSeconds)}</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={toggleTimer} className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform" style={{ backgroundColor: activeTimer.color.accent }}>
                {isTimerRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>
              <button onClick={resetTimer} className={`w-16 h-16 rounded-2xl ${colors.card} flex items-center justify-center shadow-lg active:scale-95 transition-transform`}>
                <RotateCcw className={`w-7 h-7 ${colors.textSecondary}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Actions */}
      {showTaskActions && (
        <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={() => setShowTaskActions(null)}>
          <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl p-6 pb-8 safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
            <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />
            <div className="flex items-center gap-4 mb-2 p-4 rounded-2xl" style={{ backgroundColor: showTaskActions.color.bg }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{ backgroundColor: showTaskActions.color.accent }}>
                {React.createElement(iconMap[showTaskActions.icon], { className: 'w-7 h-7 text-white' })}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} text-lg`}>{showTaskActions.title}</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{showTaskActions.time} • {showTaskActions.duration} min</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 px-4">
              {showTaskActions.reminder && showTaskActions.reminder !== 'none' && (
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <Bell className="w-3.5 h-3.5 text-purple-500" />
                  <span className={`text-xs font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{REMINDER_OPTIONS.find(r => r.value === showTaskActions.reminder)?.label}</span>
                </div>
              )}
              {showTaskActions.recurrence?.type !== 'none' && (
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                  <span className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{getRecurrenceLabel(showTaskActions.recurrence)}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <ActionButton icon={Play} label="Start Timer" color="green" onClick={() => startTimer(showTaskActions)} isDark={isDark} />
              <ActionButton icon={Check} label={showTaskActions.isCompleted ? 'Mark Incomplete' : 'Mark Complete'} color="purple" onClick={() => toggleComplete(showTaskActions.id, showTaskActions.instanceDate)} isDark={isDark} />
              <ActionButton icon={Copy} label="Copy to Other Days" color="blue" onClick={() => setShowCopyModal({ type: 'single', task: showTaskActions })} isDark={isDark} />
              <ActionButton icon={Bell} label="Edit Task & Reminder" color="orange" onClick={() => { setEditingTask(showTaskActions); setShowTaskActions(null); setShowAddModal(true); }} isDark={isDark} />
              <ActionButton icon={Trash2} label="Delete Task" color="red" onClick={() => { if (showTaskActions.recurrence?.type !== 'none') setShowDeleteConfirm(showTaskActions); else deleteTask(showTaskActions.id); }} isDark={isDark} isDestructive />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className={`fixed inset-0 z-[60] ${colors.overlay} backdrop-blur-sm`} onClick={() => setShowDeleteConfirm(null)}>
          <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl p-6 pb-8 safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
            <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${colors.danger} rounded-2xl flex items-center justify-center mx-auto mb-4`}><Trash2 className="w-8 h-8" /></div>
              <h3 className={`text-xl font-bold ${colors.text} mb-2`}>Delete Recurring Task?</h3>
              <p className={colors.textSecondary}>This task repeats {getRecurrenceLabel(showDeleteConfirm.recurrence)?.toLowerCase()}</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => deleteTask(showDeleteConfirm.id, false, showDeleteConfirm.instanceDate)} className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl active:opacity-90 transition-all min-h-[56px]">Stop Recurring (End Today)</button>
              <button onClick={() => deleteTask(showDeleteConfirm.id, true)} className="w-full py-4 bg-red-500 text-white font-semibold rounded-2xl active:opacity-90 transition-all min-h-[56px]">Delete All Occurrences</button>
              <button onClick={() => setShowDeleteConfirm(null)} className={`w-full py-4 ${colors.button} ${colors.buttonText} font-semibold rounded-2xl transition-all min-h-[56px]`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onDataCleared={() => { setTasks(createDefaultTasks()); setRoutines(createDefaultRoutines()); }} onExportImport={() => { setShowSettings(false); setShowExportImport(true); }} />}
      {showCopyModal && <CopyTasksModal mode={showCopyModal.type} task={showCopyModal.task} currentDate={selectedDate} onClose={() => setShowCopyModal(null)} onCopySingle={copySingleTask} onCopyAll={copyAllTasks} />}
      {showRoutinesPanel && <RoutinesPanel routines={routines} selectedDate={selectedDate} selectedDateTasks={selectedDateTasks} onClose={() => setShowRoutinesPanel(false)} onLoad={loadRoutine} onReplace={replaceWithRoutine} onDelete={deleteRoutine} onSave={() => { setShowRoutinesPanel(false); setShowSaveRoutineModal(true); }} onCopy={() => { setShowRoutinesPanel(false); setShowCopyModal({ type: 'all' }); }} onClear={() => { clearDayTasks(); setShowRoutinesPanel(false); }} />}
      {showSaveRoutineModal && <SaveRoutineModal onClose={() => setShowSaveRoutineModal(false)} onSave={saveAsRoutine} taskCount={selectedDateTasks.length} />}
      {showStats && <StatisticsModal onClose={() => setShowStats(false)} stats={getStatistics()} />}
      {showExportImport && <ExportImportModal onClose={() => setShowExportImport(false)} onExport={exportData} onImport={importData} />}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 pb-24" {...(viewMode === 'day' ? daySwipe : weekSwipe)}>
        {viewMode === 'day' && (
          <div className="space-y-3">
            {selectedDateTasks.map((task) => (
              <MobileTaskCard key={`${task.id}-${task.instanceDate}`} task={task} onTap={() => setShowTaskActions(task)} onComplete={() => toggleComplete(task.id, task.instanceDate)} />
            ))}
            {selectedDateTasks.length === 0 && (
              <div className="text-center py-20">
                <div className={`w-20 h-20 ${colors.accent} rounded-3xl flex items-center justify-center mx-auto mb-4`}><Calendar className="w-10 h-10" /></div>
                <p className={`${colors.textSecondary} mb-6 text-lg`}>No tasks for this day</p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={() => setShowRoutinesPanel(true)} className={`w-full px-6 py-4 ${colors.accent} ${colors.accentHover} font-medium rounded-2xl transition-colors min-h-[56px]`}>Load Routine</button>
                  <button onClick={() => { setAddTaskDate(selectedDate); setEditingTask(null); setShowAddModal(true); }} className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg transition-colors min-h-[56px]">Add Task</button>
                </div>
              </div>
            )}
            <p className={`text-center text-xs ${colors.textMuted} pt-4`}>← Swipe to change days →</p>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dateStr = getDateString(day);
              const isToday = dateStr === getTodayString();
              const dayTasks = getTasksForDate(day);
              return (
                <div key={dateStr} className={`rounded-2xl overflow-hidden ${isToday ? 'ring-2 ring-purple-400' : ''}`}>
                  <div className={`px-4 py-3 flex items-center justify-between ${isToday ? 'bg-purple-500 text-white' : colors.button}`} onClick={() => { setSelectedDate(day); setViewMode('day'); }}>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${isToday ? 'text-white' : colors.text}`}>{day.getDate()}</span>
                      <span className={`font-medium ${isToday ? 'text-purple-100' : colors.textSecondary}`}>{day.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dayTasks.some(t => t.reminder && t.reminder !== 'none') && <Bell className={`w-4 h-4 ${isToday ? 'text-purple-200' : 'text-purple-400'}`} />}
                      <span className={`text-sm ${isToday ? 'text-purple-200' : colors.textMuted}`}>{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}</span>
                      <ChevronRight className={`w-5 h-5 ${isToday ? 'text-purple-200' : colors.textMuted}`} />
                    </div>
                  </div>
                  {dayTasks.length > 0 && (
                    <div className={`${colors.card} p-2 space-y-2`}>
                      {dayTasks.slice(0, 3).map((task) => {
                        const IconComponent = iconMap[task.icon];
                        return (
                          <div key={`${task.id}-${dateStr}`} onClick={() => setShowTaskActions({ ...task, instanceDate: dateStr })} className={`flex items-center gap-3 p-3 rounded-xl active:scale-[0.98] transition-transform ${task.isCompleted ? 'opacity-50' : ''}`} style={{ backgroundColor: task.color.bg }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative" style={{ backgroundColor: task.color.accent }}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} truncate ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</p>
                              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{task.time}</p>
                            </div>
                            {task.isCompleted && <Check className="w-5 h-5 text-green-500" />}
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && <button onClick={() => { setSelectedDate(day); setViewMode('day'); }} className="w-full py-2 text-sm text-purple-500 font-medium">+{dayTasks.length - 3} more</button>}
                    </div>
                  )}
                  <button onClick={() => { setAddTaskDate(day); setEditingTask(null); setShowAddModal(true); }} className={`w-full py-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} ${colors.textMuted} active:opacity-80 transition-colors flex items-center justify-center gap-2 text-sm`}>
                    <Plus className="w-4 h-4" /> Add task
                  </button>
                </div>
              );
            })}
            <p className={`text-center text-xs ${colors.textMuted} pt-2`}>← Swipe to change weeks →</p>
          </div>
        )}
      </div>

      <button onClick={() => { setAddTaskDate(selectedDate); setEditingTask(null); setShowAddModal(true); }} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center text-white active:scale-95 transition-transform safe-area-bottom">
        <Plus className="w-8 h-8" />
      </button>

      {showAddModal && <AddTaskModal onClose={() => { setShowAddModal(false); setAddTaskDate(null); setEditingTask(null); }} onSave={(task) => {
        const taskDate = addTaskDate || selectedDate;
        if (editingTask) {
          setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id, completed: editingTask.completed || {} } : t));
          showNotificationToast('Task updated');
        } else {
          setTasks([...tasks, { ...task, id: Date.now(), date: getDateString(taskDate), completed: {} }]);
          showNotificationToast('Task added');
        }
        setShowAddModal(false);
        setAddTaskDate(null);
        setEditingTask(null);
      }} selectedDate={addTaskDate || selectedDate} editingTask={editingTask} />}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .safe-area-top { padding-top: env(safe-area-inset-top); }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SettingsModal({ onClose, onDataCleared, onExportImport }) {
  const { isDark, colors } = useTheme();
  const { permission, requestPermission, soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled, playSound } = useNotifications();
  const { clearAllData, lastSaved, getStorageSize } = useStorage();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleEnableNotifications = async () => {
    if (permission === 'default') {
      const result = await requestPermission();
      if (result === 'granted') setNotificationsEnabled(true);
    } else if (permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const handleClearData = () => {
    clearAllData();
    onDataCleared();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl p-6 pb-8 safe-area-bottom animate-slide-up max-h-[85vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${colors.text}`}>Settings</h2>
          <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}>
            <X className={`w-6 h-6 ${colors.textSecondary}`} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Notifications Section */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                <BellRing className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>Notifications</h3>
                <p className={`text-sm ${colors.textSecondary}`}>Get reminded before tasks</p>
              </div>
            </div>

            {permission === 'denied' && (
              <div className={`mb-4 p-3 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className="text-sm text-red-500">Notifications blocked. Enable in browser settings.</p>
              </div>
            )}

            <button onClick={handleEnableNotifications} disabled={permission === 'denied'} className={`w-full flex items-center justify-between p-4 rounded-xl ${colors.card} ${permission === 'denied' ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                {notificationsEnabled && permission === 'granted' ? <Bell className="w-5 h-5 text-purple-500" /> : <BellOff className={`w-5 h-5 ${colors.textMuted}`} />}
                <span className={colors.text}>{permission === 'default' ? 'Enable Notifications' : 'Task Reminders'}</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors ${notificationsEnabled && permission === 'granted' ? 'bg-purple-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-1 ${notificationsEnabled && permission === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>

            <button onClick={() => { setSoundEnabled(!soundEnabled); if (!soundEnabled) playSound(); }} className={`w-full flex items-center justify-between p-4 rounded-xl ${colors.card} mt-2`}>
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-500" /> : <VolumeX className={`w-5 h-5 ${colors.textMuted}`} />}
                <span className={colors.text}>Notification Sound</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors ${soundEnabled ? 'bg-purple-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform mt-1 ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>
          </div>

          {/* Storage Section */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <Database className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>Data Storage</h3>
                <p className={`text-sm ${colors.textSecondary}`}>Your data is saved locally</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${colors.card} space-y-3`}>
              <div className="flex justify-between">
                <span className={colors.textSecondary}>Storage used</span>
                <span className={`font-medium ${colors.text}`}>{getStorageSize()} KB</span>
              </div>
              <div className="flex justify-between">
                <span className={colors.textSecondary}>Last saved</span>
                <span className={`font-medium ${colors.text}`}>
                  {lastSaved ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                </span>
              </div>
            </div>

            <button onClick={onExportImport} className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl mt-3 ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <Download className="w-5 h-5" />
              <span className="font-medium">Export / Import Data</span>
            </button>

            <button onClick={() => setShowClearConfirm(true)} className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl mt-2 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Clear All Data</span>
            </button>
          </div>

          {/* Info */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              💾 All your tasks, routines, and settings are automatically saved to your browser's local storage. Your data stays on this device.
            </p>
          </div>
        </div>

        {/* Clear Confirm Dialog */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" onClick={() => setShowClearConfirm(false)}>
            <div className={`${colors.modal} rounded-2xl p-6 max-w-sm w-full shadow-2xl`} onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${colors.danger} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold ${colors.text} mb-2`}>Clear All Data?</h3>
                <p className={colors.textSecondary}>This will delete all your tasks, routines, and settings. This cannot be undone.</p>
              </div>
              <div className="space-y-3">
                <button onClick={handleClearData} className="w-full py-4 bg-red-500 text-white font-semibold rounded-2xl active:opacity-90">Yes, Clear Everything</button>
                <button onClick={() => setShowClearConfirm(false)} className={`w-full py-4 ${colors.button} ${colors.buttonText} font-semibold rounded-2xl`}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick, isDark, isDestructive }) {
  const colorClasses = {
    green: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600',
    purple: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-600',
    blue: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600',
    orange: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-600',
    red: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600',
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'} transition-colors min-h-[56px]`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClasses[color]}`}><Icon className="w-5 h-5" /></div>
      <span className={`font-medium ${isDestructive ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>{label}</span>
    </button>
  );
}

function MobileTaskCard({ task, onTap, onComplete }) {
  const { isDark } = useTheme();
  const IconComponent = iconMap[task.icon];
  const recurrenceLabel = getRecurrenceLabel(task.recurrence);
  const hasReminder = task.reminder && task.reminder !== 'none';
  const hasPriority = task.priority && task.priority !== 'none';
  const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === task.priority);
  const priorityColors = {
    low: { bg: 'bg-blue-100', text: 'text-blue-600', darkBg: 'bg-blue-900/50', darkText: 'text-blue-300' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-600', darkBg: 'bg-yellow-900/50', darkText: 'text-yellow-300' },
    high: { bg: 'bg-orange-100', text: 'text-orange-600', darkBg: 'bg-orange-900/50', darkText: 'text-orange-300' },
    urgent: { bg: 'bg-red-100', text: 'text-red-600', darkBg: 'bg-red-900/50', darkText: 'text-red-300' },
  };

  return (
    <div onClick={onTap} className={`rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all ${task.isCompleted ? 'opacity-60' : ''}`} style={{ backgroundColor: task.color.bg }}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ backgroundColor: task.color.accent }}>
          <IconComponent className="w-7 h-7 text-white" />
          {(hasReminder || recurrenceLabel) && (
            <div className="absolute -bottom-1 -right-1 flex gap-0.5">
              {hasReminder && <div className={`w-5 h-5 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center shadow`}><Bell className="w-3 h-3 text-purple-500" /></div>}
              {recurrenceLabel && !hasReminder && <div className={`w-5 h-5 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center shadow`}><RefreshCw className="w-3 h-3 text-blue-500" /></div>}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} text-lg ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</h3>
            {hasPriority && priorityConfig && (
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${isDark ? priorityColors[task.priority]?.darkBg : priorityColors[task.priority]?.bg} ${isDark ? priorityColors[task.priority]?.darkText : priorityColors[task.priority]?.text}`}>
                {priorityConfig.label}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-2 mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <Clock className="w-4 h-4" /><span>{task.time}</span><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span><span>{task.duration} min</span>
          </div>
          {task.notes && (
            <p className={`text-sm mt-1 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{task.notes}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {hasReminder && <span className="text-xs text-purple-500 font-medium">🔔 {REMINDER_OPTIONS.find(r => r.value === task.reminder)?.label}</span>}
            {recurrenceLabel && <span className="text-xs text-blue-500 font-medium">↻ {recurrenceLabel}</span>}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onComplete(); }} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-green-500 border-green-500' : `border-gray-300 active:border-gray-400 ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}`}>
          {task.isCompleted && <Check className="w-6 h-6 text-white" />}
        </button>
      </div>
    </div>
  );
}

function RoutinesPanel({ routines, selectedDate, selectedDateTasks, onClose, onLoad, onReplace, onDelete, onSave, onCopy, onClear }) {
  const { isDark, colors } = useTheme();
  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 border-b ${colors.border} flex-shrink-0`}>
          <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-4`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${colors.accent} rounded-2xl flex items-center justify-center`}><Layers className="w-5 h-5" /></div>
              <div>
                <h2 className={`text-lg font-bold ${colors.text}`}>Routines</h2>
                <p className={`text-sm ${colors.textSecondary}`}>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}><X className={`w-6 h-6 ${colors.textSecondary}`} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {routines.map((routine) => {
              const RoutineIcon = routineIconMap[routine.icon] || Sparkles;
              const routineColor = restoreColor(routine.colorName, isDark);
              return (
                <div key={routine.id} className={`rounded-2xl p-4 border ${colors.border}`} style={{ backgroundColor: routineColor.bg + '40' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: routineColor.accent }}><RoutineIcon className="w-6 h-6 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{routine.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{routine.tasks.length} tasks</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => onLoad(routine)} className={`flex-1 px-4 py-3 ${colors.card} ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-50'} ${colors.buttonText} text-sm font-medium rounded-xl border ${colors.border} transition-colors flex items-center justify-center gap-2 min-h-[48px]`}><Plus className="w-4 h-4" /> Add</button>
                    <button onClick={() => onReplace(routine)} className="flex-1 px-4 py-3 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px] active:opacity-80" style={{ backgroundColor: routineColor.accent }}><FolderOpen className="w-4 h-4" /> Load</button>
                    {!routine.isDefault && <button onClick={() => onDelete(routine.id)} className={`px-4 py-3 ${isDark ? 'active:bg-red-900/30' : 'active:bg-red-100'} rounded-xl transition-colors min-h-[48px]`}><Trash2 className="w-5 h-5 text-red-400" /></button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`p-5 border-t ${colors.border} flex-shrink-0`}>
          <div className="flex gap-3">
            <button onClick={onSave} disabled={selectedDateTasks.length === 0} className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg active:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[56px]"><Save className="w-5 h-5" /> Save Current</button>
            {selectedDateTasks.length > 0 && (
              <>
                <button onClick={onCopy} className={`px-5 py-4 ${isDark ? 'bg-blue-900/50 active:bg-blue-800/50 text-blue-300' : 'bg-blue-100 active:bg-blue-200 text-blue-700'} font-medium rounded-2xl transition-colors min-h-[56px]`}><Copy className="w-5 h-5" /></button>
                <button onClick={onClear} className={`px-5 py-4 ${colors.button} ${colors.buttonText} font-medium rounded-2xl transition-colors min-h-[56px]`}><Trash2 className="w-5 h-5" /></button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyTasksModal({ mode, task, currentDate, onClose, onCopySingle, onCopyAll }) {
  const { isDark, colors } = useTheme();
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date(currentDate));
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };
  
  const toggleDate = (date) => {
    if (!date || getDateString(date) === getDateString(currentDate)) return;
    const dateStr = getDateString(date);
    setSelectedDates(prev => prev.some(d => getDateString(d) === dateStr) ? prev.filter(d => getDateString(d) !== dateStr) : [...prev, date]);
  };
  
  const isDateSelected = (date) => date && selectedDates.some(d => getDateString(d) === getDateString(date));
  const handleCopy = () => {
    if (selectedDates.length === 0) return;
    mode === 'single' && task ? onCopySingle(task, selectedDates) : onCopyAll(selectedDates);
  };
  const days = getDaysInMonth(calendarMonth);

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 border-b ${colors.border} flex-shrink-0`}>
          <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-4`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'} rounded-2xl flex items-center justify-center`}><Copy className="w-5 h-5" /></div>
              <div>
                <h2 className={`text-lg font-bold ${colors.text}`}>{mode === 'single' ? 'Copy Task' : 'Copy All Tasks'}</h2>
                <p className={`text-sm ${colors.textSecondary}`}>Select days to copy to</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}><X className={`w-6 h-6 ${colors.textSecondary}`} /></button>
          </div>
        </div>
        <div className="px-5 pt-4 flex gap-2 flex-wrap">
          <button onClick={() => { const newDates = []; for (let i = 1; i <= 7; i++) newDates.push(addDays(currentDate, i)); setSelectedDates(prev => [...new Set([...prev, ...newDates].map(d => getDateString(d)))].map(s => new Date(s))); }} className={`px-4 py-2 ${colors.accent} text-sm font-medium rounded-xl ${colors.accentHover}`}>Next 7 days</button>
          {selectedDates.length > 0 && <button onClick={() => setSelectedDates([])} className={`px-4 py-2 ${colors.danger} text-sm font-medium rounded-xl`}>Clear</button>}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className={`p-2 ${colors.button} rounded-xl`}><ChevronLeft className={`w-5 h-5 ${colors.textSecondary}`} /></button>
            <h3 className={`font-semibold ${colors.text}`}>{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className={`p-2 ${colors.button} rounded-xl`}><ChevronRight className={`w-5 h-5 ${colors.textSecondary}`} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className={`text-center text-xs font-medium ${colors.textSecondary} py-2`}>{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} className="aspect-square" />;
              const isCurrentDate = getDateString(day) === getDateString(currentDate);
              const isSelected = isDateSelected(day);
              const isToday = getDateString(day) === getTodayString();
              return (
                <button key={idx} onClick={() => toggleDate(day)} disabled={isCurrentDate} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all relative ${isCurrentDate ? `${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${colors.textMuted} cursor-not-allowed` : isSelected ? 'bg-blue-500 text-white shadow-md' : isToday ? colors.accent : `${colors.text} ${colors.button}`}`}>
                  {day.getDate()}{isSelected && <CheckCircle2 className="w-3 h-3 absolute bottom-1 right-1" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className={`p-5 border-t ${colors.border} flex-shrink-0`}>
          <button onClick={handleCopy} disabled={selectedDates.length === 0} className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg active:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[56px]">
            <Copy className="w-5 h-5" /> Copy to {selectedDates.length} Day{selectedDates.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveRoutineModal({ onClose, onSave, taskCount }) {
  const { isDark, colors } = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('sparkles');

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl p-6 pb-8 safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />
        <h2 className={`text-xl font-bold ${colors.text} mb-6`}>Save as Routine</h2>
        <div className="space-y-5">
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Routine Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., My Morning Routine" className={`w-full px-4 py-4 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-lg transition-colors`} autoFocus />
          </div>
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(iconMap).map(([key, IconComponent]) => (
                <button key={key} onClick={() => setIcon(key)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${icon === key ? 'bg-purple-500 text-white shadow-lg' : colors.button}`}><IconComponent className={`w-6 h-6 ${icon === key ? '' : colors.textSecondary}`} /></button>
              ))}
            </div>
          </div>
          <button onClick={() => { if (name.trim()) onSave(name, icon); }} disabled={!name.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg active:opacity-90 transition-all disabled:opacity-50 min-h-[56px] text-lg">Save Routine</button>
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ onClose, onSave, selectedDate, editingTask }) {
  const { isDark, colors, palettes } = useTheme();
  const { permission, notificationsEnabled } = useNotifications();
  const [title, setTitle] = useState(editingTask?.title || '');
  const [icon, setIcon] = useState(editingTask?.icon || 'sparkles');
  const [colorIndex, setColorIndex] = useState(() => {
    if (editingTask?.colorName) {
      const idx = lightPalettes.findIndex(p => p.name === editingTask.colorName);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });
  const [time, setTime] = useState(editingTask?.time || '09:00');
  const [duration, setDuration] = useState(editingTask?.duration || 30);
  const [recurrenceType, setRecurrenceType] = useState(editingTask?.recurrence?.type || 'none');
  const [customDays, setCustomDays] = useState(editingTask?.recurrence?.days || []);
  const [endDate, setEndDate] = useState(editingTask?.recurrence?.endDate || '');
  const [reminder, setReminder] = useState(editingTask?.reminder || 'none');
  const [priority, setPriority] = useState(editingTask?.priority || 'none');
  const [notes, setNotes] = useState(editingTask?.notes || '');

  const color = palettes[colorIndex];
  const colorName = lightPalettes[colorIndex].name;
  const canUseReminders = permission === 'granted' && notificationsEnabled;

  const handleSave = () => {
    if (!title.trim()) return;
    let recurrence = { type: recurrenceType, endDate: endDate || null, days: [] };
    if (recurrenceType === 'weekly' || recurrenceType === 'custom') {
      recurrence.days = customDays.length > 0 ? customDays : [selectedDate.getDay()];
    }
    onSave({ title, icon, colorName, time, duration, recurrence, reminder, priority, notes, completed: editingTask?.completed || {} });
  };

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`sticky top-0 ${colors.modal} p-5 border-b ${colors.border} z-10`}>
          <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-4`} />
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${colors.text}`}>{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <p className={`text-sm ${colors.textSecondary}`}>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}><X className={`w-6 h-6 ${colors.textSecondary}`} /></button>
          </div>
        </div>
        
        <div className="p-5 space-y-5">
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Task Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What do you want to do?" className={`w-full px-4 py-4 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-lg transition-colors`} />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(iconMap).map(([key, IconComponent]) => (
                <button key={key} onClick={() => setIcon(key)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${icon === key ? 'bg-purple-500 text-white shadow-lg' : colors.button}`}><IconComponent className={`w-5 h-5 ${icon === key ? '' : colors.textSecondary}`} /></button>
              ))}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Color</label>
            <div className="flex flex-wrap gap-3">
              {palettes.map((c, idx) => (
                <button key={idx} onClick={() => setColorIndex(idx)} className={`w-11 h-11 rounded-full transition-all ${colorIndex === idx ? 'ring-4 ring-offset-2 ring-purple-400 scale-110' : ''} ${isDark ? 'ring-offset-gray-800' : 'ring-offset-white'}`} style={{ backgroundColor: c.accent }} />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`w-full px-4 py-4 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-lg transition-colors`} />
            </div>
            <div>
              <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Duration</label>
              <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className={`w-full px-4 py-4 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-lg transition-colors`}>
                {[5, 10, 15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d < 60 ? `${d} min` : `${d/60} hour${d > 60 ? 's' : ''}`}</option>)}
              </select>
            </div>
          </div>

          {/* Priority Section */}
          <div className={`${isDark ? 'bg-green-900/30' : 'bg-green-50'} rounded-2xl p-4`}>
            <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-800'} mb-3`}><Flag className="w-4 h-4" /> Priority</label>
            <div className="grid grid-cols-5 gap-2">
              {PRIORITY_OPTIONS.map((opt) => {
                const priorityBgColors = { none: 'bg-gray-500', low: 'bg-blue-500', medium: 'bg-yellow-500', high: 'bg-orange-500', urgent: 'bg-red-500' };
                return (
                  <button key={opt.value} onClick={() => setPriority(opt.value)} className={`py-3 px-2 rounded-xl text-xs font-medium transition-all ${priority === opt.value ? `${priorityBgColors[opt.value]} text-white shadow` : `${colors.card} ${colors.buttonText}`}`}>{opt.label}</button>
                );
              })}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2`}><FileText className="w-4 h-4" /> Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className={`w-full px-4 py-3 rounded-2xl border ${colors.input} ${colors.inputFocus} outline-none text-base transition-colors resize-none`}
            />
          </div>

          {/* Reminder Section */}
          <div className={`${isDark ? 'bg-orange-900/30' : 'bg-orange-50'} rounded-2xl p-4`}>
            <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-800'} mb-3`}><Bell className="w-4 h-4" /> Reminder</label>
            {!canUseReminders && <p className={`text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'} mb-3`}>Enable notifications in Settings to use reminders</p>}
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setReminder(opt.value)} disabled={!canUseReminders && opt.value !== 'none'} className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${reminder === opt.value ? 'bg-orange-500 text-white shadow' : `${colors.card} ${colors.buttonText}`} ${!canUseReminders && opt.value !== 'none' ? 'opacity-50' : ''}`}>{opt.label}</button>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div className={`${isDark ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-2xl p-4`}>
            <label className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-800'} mb-3`}><RefreshCw className="w-4 h-4" /> Repeat</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[{ value: 'none', label: 'Never' }, { value: 'daily', label: 'Every Day' }, { value: 'weekdays', label: 'Weekdays' }, { value: 'custom', label: 'Custom' }].map((opt) => (
                <button key={opt.value} onClick={() => setRecurrenceType(opt.value)} className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${recurrenceType === opt.value ? 'bg-purple-500 text-white shadow' : `${colors.card} ${colors.buttonText}`}`}>{opt.label}</button>
              ))}
            </div>
            {(recurrenceType === 'custom' || recurrenceType === 'weekly') && (
              <div className="mt-3">
                <p className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'} mb-2`}>Select days:</p>
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <button key={idx} onClick={() => setCustomDays(prev => prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx])} className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${customDays.includes(idx) ? 'bg-purple-500 text-white' : `${colors.card} ${colors.textSecondary}`}`}>{day.slice(0, 1)}</button>
                  ))}
                </div>
              </div>
            )}
            {recurrenceType !== 'none' && (
              <div className="mt-3">
                <label className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'} mb-2 block`}>End date (optional)</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={getDateString(selectedDate)} className={`w-full px-4 py-3 rounded-xl border ${colors.input} ${colors.inputFocus} outline-none text-sm transition-colors`} />
              </div>
            )}
          </div>
          
          {/* Preview */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>Preview</label>
            <div className="rounded-2xl p-4" style={{ backgroundColor: color.bg }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{ backgroundColor: color.accent }}>
                  {React.createElement(iconMap[icon], { className: 'w-7 h-7 text-white' })}
                  {reminder !== 'none' && <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center shadow`}><Bell className="w-3 h-3 text-purple-500" /></div>}
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} text-lg`}>{title || 'Task Name'}</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{time} • {duration} min</p>
                  {notes && <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{notes}</p>}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {priority !== 'none' && <span className={`text-xs font-medium ${priority === 'urgent' ? 'text-red-500' : priority === 'high' ? 'text-orange-500' : priority === 'medium' ? 'text-yellow-600' : 'text-blue-500'}`}>⚑ {PRIORITY_OPTIONS.find(p => p.value === priority)?.label}</span>}
                    {reminder !== 'none' && <span className="text-xs text-purple-500 font-medium">🔔 {REMINDER_OPTIONS.find(r => r.value === reminder)?.label}</span>}
                    {recurrenceType !== 'none' && <span className="text-xs text-blue-500 font-medium">↻ {recurrenceType === 'daily' ? 'Every day' : recurrenceType === 'weekdays' ? 'Weekdays' : customDays.length > 0 ? customDays.map(d => DAYS_OF_WEEK[d].slice(0, 2)).join(', ') : ''}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button onClick={handleSave} disabled={!title.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg active:opacity-90 transition-all disabled:opacity-50 min-h-[56px] text-lg">{editingTask ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </div>
    </div>
  );
}

function StatisticsModal({ onClose, stats }) {
  const { isDark, colors } = useTheme();
  const maxTasks = Math.max(...stats.last7Days.map(d => d.total), 1);

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 border-b ${colors.border} flex-shrink-0`}>
          <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-4`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-600'} rounded-2xl flex items-center justify-center`}>
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${colors.text}`}>Statistics</h2>
                <p className={`text-sm ${colors.textSecondary}`}>Your progress overview</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}>
              <X className={`w-6 h-6 ${colors.textSecondary}`} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Today's Summary */}
          <div className={`p-5 rounded-2xl ${isDark ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-purple-100 to-indigo-100'}`}>
            <h3 className={`font-semibold ${colors.text} mb-4`}>Today</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{stats.completedToday}</div>
                <div className={colors.textSecondary}>Completed</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${colors.text}`}>{stats.todayTasks}</div>
                <div className={colors.textSecondary}>Total Tasks</div>
              </div>
            </div>
          </div>

          {/* 7-Day Chart */}
          <div className={`p-5 rounded-2xl ${colors.card} border ${colors.border}`}>
            <h3 className={`font-semibold ${colors.text} mb-4`}>Last 7 Days</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {stats.last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-24">
                    {day.total > 0 && (
                      <div
                        className={`w-full rounded-t-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative`}
                        style={{ height: `${(day.total / maxTasks) * 100}%` }}
                      >
                        {day.completed > 0 && (
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-lg"
                            style={{ height: `${(day.completed / day.total) * 100}%` }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs ${i === 6 ? 'font-bold text-purple-500' : colors.textSecondary}`}>{day.day}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className={`text-xs ${colors.textSecondary}`}>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`text-xs ${colors.textSecondary}`}>Total</span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className={`p-5 rounded-2xl ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>Completion Rate</h3>
                <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Last 7 days</p>
              </div>
              <div className={`text-4xl font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>{stats.completionRate}%</div>
            </div>
            <div className={`mt-3 h-3 rounded-full ${isDark ? 'bg-green-900/50' : 'bg-green-200'}`}>
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${stats.completionRate}%` }} />
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className={`p-5 rounded-2xl ${colors.card} border ${colors.border}`}>
            <h3 className={`font-semibold ${colors.text} mb-4`}>Tasks by Priority</h3>
            <div className="space-y-3">
              {[
                { key: 'urgent', label: 'Urgent', color: 'bg-red-500' },
                { key: 'high', label: 'High', color: 'bg-orange-500' },
                { key: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                { key: 'low', label: 'Low', color: 'bg-blue-500' },
                { key: 'none', label: 'No Priority', color: 'bg-gray-400' },
              ].map(({ key, label, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={colors.text}>{label}</span>
                      <span className={colors.textSecondary}>{stats.priorityStats[key]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Stats */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>Total Tasks</span>
              <span className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{stats.totalTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportImportModal({ onClose, onExport, onImport }) {
  const { isDark, colors } = useTheme();
  const fileInputRef = useRef(null);

  return (
    <div className={`fixed inset-0 z-50 ${colors.overlay} backdrop-blur-sm`} onClick={onClose}>
      <div className={`absolute bottom-0 left-0 right-0 ${colors.modal} rounded-t-3xl p-6 pb-8 safe-area-bottom animate-slide-up`} onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'} rounded-2xl flex items-center justify-center`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${colors.text}`}>Export / Import</h2>
              <p className={`text-sm ${colors.textSecondary}`}>Backup or restore your data</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-3 ${colors.button} rounded-xl min-h-[44px] min-w-[44px]`}>
            <X className={`w-6 h-6 ${colors.textSecondary}`} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={onExport}
            className={`w-full p-5 rounded-2xl ${isDark ? 'bg-green-900/30' : 'bg-green-50'} flex items-center gap-4 active:opacity-80 transition-opacity`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
              <Download className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-left">
              <h3 className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>Export Data</h3>
              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Download all tasks and routines as JSON</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full p-5 rounded-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'} flex items-center gap-4 active:opacity-80 transition-opacity`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Import Data</h3>
              <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Restore from a backup file</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />

          <div className={`p-4 rounded-2xl ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
              ⚠️ Importing will replace all your current data. Make sure to export first if you want to keep your existing tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
