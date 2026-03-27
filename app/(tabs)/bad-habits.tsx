import { BadHabitCard } from '@/components/bad/BadHabitCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Spacing } from '@/constants/Colors';
import { useHabits } from '@/context/HabitsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BadHabitsScreen() {
  const router = useRouter();
  const { badHabits } = useHabits();

  const active = useMemo(() => badHabits.filter((h) => !h.isCompleted), [badHabits]);
  const overcome = useMemo(() => badHabits.filter((h) => h.isCompleted), [badHabits]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2">🛡️ Breaking</ThemedText>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/bad-habit/create')}
            accessibilityLabel="Add new bad habit to break"
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Say NO 1000 times. 21 days clean. The habit is broken.
        </Text>

        {active.length === 0 && overcome.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛡️</Text>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>Nothing to break yet</ThemedText>
            <Text style={styles.emptyText}>
              Name a habit you want to leave behind. We'll help you fight it.
            </Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => router.push('/bad-habit/create')}
            >
              <Text style={styles.createBtnText}>Track a bad habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {active.map((h) => (
              <BadHabitCard key={h.id} habit={h} />
            ))}
            {active.length > 0 && (
              <TouchableOpacity
                style={styles.addMoreBtn}
                onPress={() => router.push('/bad-habit/create')}
              >
                <Ionicons name="add-circle-outline" size={20} color={Colors.red} />
                <Text style={[styles.addMoreText, { color: Colors.red }]}>Track another</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Overcome section */}
        {overcome.length > 0 && (
          <View style={styles.overcomeSection}>
            <Text style={styles.overcomeTitle}>🏆 Overcome ({overcome.length})</Text>
            {overcome.map((h) => (
              <View key={h.id} style={styles.overcomeItem}>
                <Text style={styles.overcomeIcon}>{h.icon}</Text>
                <View style={styles.overcomeInfo}>
                  <Text style={styles.overcomeName}>{h.name}</Text>
                  <Text style={styles.overcomeStats}>
                    {h.totalUrgeCount.toLocaleString()} total NOs · {h.streakDays} days clean
                  </Text>
                </View>
                <Text style={styles.overcomeBadge}>✅</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },
  addBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  createBtn: {
    backgroundColor: Colors.red,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm + 4,
    borderRadius: 999, marginTop: Spacing.sm,
  },
  createBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },
  list: { gap: Spacing.xs },
  addMoreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.md, justifyContent: 'center',
  },
  addMoreText: { fontSize: FontSize.md, fontWeight: '600' },
  overcomeSection: { gap: Spacing.sm, marginTop: Spacing.md },
  overcomeTitle: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  overcomeItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md,
  },
  overcomeIcon: { fontSize: 24 },
  overcomeInfo: { flex: 1 },
  overcomeName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textSecondary },
  overcomeStats: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  overcomeBadge: { fontSize: 20 },
});
