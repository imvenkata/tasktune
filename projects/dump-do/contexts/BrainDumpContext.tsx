import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrainDumpItem } from '../types';
import { STORAGE_KEYS } from '../constants/config';

type BrainDumpAction =
  | { type: 'SET_ITEMS'; payload: BrainDumpItem[] }
  | { type: 'ADD_ITEM'; payload: BrainDumpItem }
  | { type: 'UPDATE_ITEM'; payload: BrainDumpItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'COMPLETE_ITEM'; payload: string }
  | { type: 'UNCOMPLETE_ITEM'; payload: string };

interface BrainDumpContextType {
  items: BrainDumpItem[];
  addItem: (text: string, estimatedMinutes?: number, priority?: 'low' | 'medium' | 'high') => void;
  updateItem: (item: BrainDumpItem) => void;
  deleteItem: (id: string) => void;
  completeItem: (id: string) => void;
  uncompleteItem: (id: string) => void;
  activeItems: BrainDumpItem[];
  completedItems: BrainDumpItem[];
}

const BrainDumpContext = createContext<BrainDumpContextType | undefined>(undefined);

function brainDumpReducer(state: BrainDumpItem[], action: BrainDumpAction): BrainDumpItem[] {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload;

    case 'ADD_ITEM':
      return [action.payload, ...state];

    case 'UPDATE_ITEM':
      return state.map(item =>
        item.id === action.payload.id ? action.payload : item
      );

    case 'DELETE_ITEM':
      return state.filter(item => item.id !== action.payload);

    case 'COMPLETE_ITEM':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, completedAt: new Date().toISOString() }
          : item
      );

    case 'UNCOMPLETE_ITEM':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, completedAt: undefined }
          : item
      );

    default:
      return state;
  }
}

export function BrainDumpProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(brainDumpReducer, []);

  // Load brain dump items from AsyncStorage on mount
  useEffect(() => {
    loadItems();
  }, []);

  // Save brain dump items to AsyncStorage whenever they change
  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.BRAIN_DUMP);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'SET_ITEMS', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load brain dump items:', error);
    }
  };

  const saveItems = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BRAIN_DUMP, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save brain dump items:', error);
    }
  };

  const addItem = (text: string, estimatedMinutes?: number, priority?: 'low' | 'medium' | 'high') => {
    const newItem: BrainDumpItem = {
      id: Date.now().toString(),
      text,
      estimatedMinutes,
      priority,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const updateItem = (item: BrainDumpItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  };

  const deleteItem = (id: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  };

  const completeItem = (id: string) => {
    dispatch({ type: 'COMPLETE_ITEM', payload: id });
  };

  const uncompleteItem = (id: string) => {
    dispatch({ type: 'UNCOMPLETE_ITEM', payload: id });
  };

  const activeItems = items.filter(item => !item.completedAt);
  const completedItems = items.filter(item => item.completedAt);

  const value: BrainDumpContextType = {
    items,
    addItem,
    updateItem,
    deleteItem,
    completeItem,
    uncompleteItem,
    activeItems,
    completedItems,
  };

  return (
    <BrainDumpContext.Provider value={value}>
      {children}
    </BrainDumpContext.Provider>
  );
}

export function useBrainDump() {
  const context = useContext(BrainDumpContext);
  if (context === undefined) {
    throw new Error('useBrainDump must be used within a BrainDumpProvider');
  }
  return context;
}
