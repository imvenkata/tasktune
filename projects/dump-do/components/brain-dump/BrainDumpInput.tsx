import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { useBrainDump } from '../../contexts/BrainDumpContext';

export function BrainDumpInput() {
  const [text, setText] = useState('');
  const { isDark } = useTheme();
  const { addItem } = useBrainDump();

  const handleAdd = () => {
    if (text.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addItem(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TextInput
        style={[
          styles.input,
          isDark && styles.inputDark,
        ]}
        value={text}
        onChangeText={setText}
        placeholder="Quick capture your thoughts..."
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        multiline
        maxLength={200}
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          !text.trim() && styles.addButtonDisabled,
        ]}
        onPress={handleAdd}
        disabled={!text.trim()}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
    maxHeight: 100,
  },
  inputDark: {
    color: '#F3F4F6',
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
