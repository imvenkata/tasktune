import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ListTodo, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useBrainDump } from '../../contexts/BrainDumpContext';
import { BrainDumpItem } from './BrainDumpItem';

type ViewMode = 'active' | 'completed';

export function BrainDumpList() {
  const { isDark } = useTheme();
  const { activeItems, completedItems } = useBrainDump();
  const [viewMode, setViewMode] = useState<ViewMode>('active');

  const items = viewMode === 'active' ? activeItems : completedItems;

  return (
    <View style={styles.container}>
      <View style={[styles.tabs, isDark && styles.tabsDark]}>
        <TouchableOpacity
          style={[
            styles.tab,
            viewMode === 'active' && styles.tabActive,
            viewMode === 'active' && isDark && styles.tabActiveDark,
          ]}
          onPress={() => setViewMode('active')}
        >
          <ListTodo
            size={18}
            color={viewMode === 'active' ? '#6366F1' : (isDark ? '#9CA3AF' : '#6B7280')}
          />
          <Text
            style={[
              styles.tabText,
              isDark && styles.tabTextDark,
              viewMode === 'active' && styles.tabTextActive,
            ]}
          >
            Active ({activeItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            viewMode === 'completed' && styles.tabActive,
            viewMode === 'completed' && isDark && styles.tabActiveDark,
          ]}
          onPress={() => setViewMode('completed')}
        >
          <CheckCircle2
            size={18}
            color={viewMode === 'completed' ? '#6366F1' : (isDark ? '#9CA3AF' : '#6B7280')}
          />
          <Text
            style={[
              styles.tabText,
              isDark && styles.tabTextDark,
              viewMode === 'completed' && styles.tabTextActive,
            ]}
          >
            Done ({completedItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          {viewMode === 'active' ? (
            <>
              <ListTodo size={48} color={isDark ? '#4B5563' : '#D1D5DB'} />
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No active items
              </Text>
              <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
                Tap the + button above to capture your thoughts
              </Text>
            </>
          ) : (
            <>
              <CheckCircle2 size={48} color={isDark ? '#4B5563' : '#D1D5DB'} />
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No completed items
              </Text>
              <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
                Complete items to see them here
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BrainDumpItem item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
  },
  tabActiveDark: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextDark: {
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTextDark: {
    color: '#9CA3AF',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptySubtextDark: {
    color: '#6B7280',
  },
});
