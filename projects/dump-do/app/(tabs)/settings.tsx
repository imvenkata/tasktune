import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Moon, Sun, Smartphone, Trash2, Database, Info } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useStorage } from '../../hooks/useStorage';
import * as Haptics from 'expo-haptics';

export default function Settings() {
  const { isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { clearAllData, lastSaved, saveStatus } = useStorage();

  const handleClearData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Clear All Data',
      'This will delete all your tasks, routines, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Smartphone },
  ];

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Settings
        </Text>
        <Text style={[styles.headerSubtitle, isDark && styles.headerSubtitleDark]}>
          Customize your experience
        </Text>
      </View>

      {/* Theme Section */}
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Appearance
        </Text>

        {themeOptions.map(({ value, label, icon: Icon }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.option,
              isDark && styles.optionDark,
              themeMode === value && styles.optionSelected,
              themeMode === value && isDark && styles.optionSelectedDark,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setThemeMode(value as any);
            }}
          >
            <View style={styles.optionLeft}>
              <Icon size={20} color={isDark ? '#F3F4F6' : '#111827'} />
              <Text style={[styles.optionText, isDark && styles.optionTextDark]}>
                {label}
              </Text>
            </View>
            {themeMode === value && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Data Management */}
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Data Management
        </Text>

        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <Database size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
              Last Saved
            </Text>
            <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
              {lastSaved ? new Date(lastSaved).toLocaleString() : 'Never'}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <Info size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
              Save Status
            </Text>
            <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
              {saveStatus.charAt(0).toUpperCase() + saveStatus.slice(1)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.dangerButton, isDark && styles.dangerButtonDark]}
          onPress={handleClearData}
        >
          <Trash2 size={20} color="#EF4444" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          About
        </Text>
        <Text style={[styles.aboutText, isDark && styles.aboutTextDark]}>
          Tiimo Planner v1.0.0
        </Text>
        <Text style={[styles.aboutText, isDark && styles.aboutTextDark]}>
          A neuroinclusive visual time management app
        </Text>
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerTitleDark: {
    color: '#F3F4F6',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerSubtitleDark: {
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  optionDark: {
    backgroundColor: '#111827',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  optionSelectedDark: {
    backgroundColor: '#1E293B',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  optionTextDark: {
    color: '#F3F4F6',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  infoCardDark: {
    backgroundColor: '#111827',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoLabelDark: {
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoValueDark: {
    color: '#F3F4F6',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    marginTop: 8,
  },
  dangerButtonDark: {
    backgroundColor: '#450A0A',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  aboutTextDark: {
    color: '#9CA3AF',
  },
});
