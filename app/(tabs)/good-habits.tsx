import { HabitCard } from '@/components/good/HabitCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { useHabits } from '@/context/HabitsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoodHabitsScreen() {
  const router = useRouter();
  const { goodHabits } = useHabits();
  const today = new Date().toISOString().split('T')[0];

  const active = useMemo(() => goodHabits.filter((h) => !h.archived), [goodHabits]);
  const archived = useMemo(() => goodHabits.filter((h) => h.archived), [goodHabits]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h2">🌱 Building</ThemedText>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/good-habit/create')}
            accessibilityLabel="Add new good habit"
          >
            <Ionicons name="add" size={22} color={Colors.bg} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Daily habits shape who you become.</Text>

        {active.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>No habits yet</ThemedText>
            <Text style={styles.emptyText}>Start small. Even one task a day rewires you.</Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => router.push('/good-habit/create')}
            >
              <Text style={styles.createBtnText}>Create your first habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {active.map((h) => {
              const rec = h.history.find((d) => d.date === today);
              return (
                <HabitCard
                  key={h.id}
                  habit={h}
                  todayCompleted={rec?.completedCount ?? 0}
                  todayTotal={h.tasks.length}
                />
              );
            })}
            <TouchableOpacity
              style={styles.addMoreBtn}
              onPress={() => router.push('/good-habit/create')}
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.teal} />
              <Text style={styles.addMoreText}>Add another habit</Text>
            </TouchableOpacity>
          </View>
        )}

        {archived.length > 0 && (
          <View style={{ marginTop: Spacing.md }}>
            <Text style={styles.archivedLabel}>Archived ({archived.length})</Text>
            {archived.map((h) => (
              <View key={h.id} style={styles.archivedItem}>
                <Text style={styles.archivedIcon}>{h.icon}</Text>
                <Text style={styles.archivedName}>{h.name}</Text>
                <Text style={styles.archivedStreak}>Best: {h.longestStreak}d</Text>
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
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary },
  addBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: Colors.teal,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
  createBtn: {
    backgroundColor: Colors.teal,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: 999, marginTop: Spacing.sm,
  },
  createBtnText: { color: Colors.bg, fontWeight: '700', fontSize: FontSize.md },
  list: { gap: Spacing.xs },
  addMoreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.md, justifyContent: 'center',
  },
  addMoreText: { color: Colors.teal, fontSize: FontSize.md, fontWeight: '600' },
  archivedLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  archivedItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm, opacity: 0.5,
  },
  archivedIcon: { fontSize: 20 },
  archivedName: { flex: 1, fontSize: FontSize.md, color: Colors.textSecondary },
  archivedStreak: { fontSize: FontSize.sm, color: Colors.textMuted },
});
