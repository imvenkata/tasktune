import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { BrainDumpInput } from '../../components/brain-dump/BrainDumpInput';
import { BrainDumpList } from '../../components/brain-dump/BrainDumpList';

export default function BrainDump() {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <BrainDumpInput />
      <BrainDumpList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
});
