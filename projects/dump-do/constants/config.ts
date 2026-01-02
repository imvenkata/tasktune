export const STORAGE_KEYS = {
  TASKS: 'tiimo-tasks',
  ROUTINES: 'tiimo-routines',
  THEME: 'tiimo-theme',
  SOUND: 'tiimo-sound',
  NOTIFICATIONS: 'tiimo-notifications',
  LAST_SAVED: 'tiimo-last-saved',
  BRAIN_DUMP: 'tiimo-brain-dump',
};

export const REMINDER_OPTIONS = [
  { value: 'none', label: 'No reminder', minutes: null },
  { value: 'atTime', label: 'At start time', minutes: 0 },
  { value: '5min', label: '5 min before', minutes: 5 },
  { value: '10min', label: '10 min before', minutes: 10 },
  { value: '15min', label: '15 min before', minutes: 15 },
  { value: '30min', label: '30 min before', minutes: 30 },
  { value: '1hour', label: '1 hour before', minutes: 60 },
];

export const ICON_NAMES = [
  'sun', 'moon', 'coffee', 'book', 'dumbbell',
  'utensils', 'briefcase', 'heart', 'music', 'sparkles'
] as const;

export type IconName = typeof ICON_NAMES[number];
