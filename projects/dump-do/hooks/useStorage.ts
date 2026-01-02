import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useStorage() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const saveToStorage = useCallback(async <T>(key: string, data: T): Promise<boolean> => {
    try {
      setSaveStatus('saving');
      await AsyncStorage.setItem(key, JSON.stringify(data));
      const now = new Date();
      await AsyncStorage.setItem('last-saved', now.toISOString());
      setLastSaved(now);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      setSaveStatus('error');
      return false;
    }
  }, []);

  const loadFromStorage = useCallback(async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultValue;
    } catch (error) {
      console.error('Load error:', error);
      return defaultValue;
    }
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setLastSaved(null);
      setSaveStatus('idle');
    } catch (error) {
      console.error('Clear error:', error);
    }
  }, []);

  useEffect(() => {
    const loadLastSaved = async () => {
      try {
        const saved = await AsyncStorage.getItem('last-saved');
        if (saved) {
          setLastSaved(new Date(saved));
        }
      } catch (error) {
        console.error('Error loading last saved:', error);
      }
    };
    loadLastSaved();
  }, []);

  return {
    saveToStorage,
    loadFromStorage,
    clearAllData,
    lastSaved,
    saveStatus,
  };
}
