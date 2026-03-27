import { BadHabitCard } from '@/components/bad/BadHabitCard';
import { HabitCard } from '@/components/good/HabitCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Spacing } from '@/constants/Colors';
import { useHabits } from '@/context/HabitsContext';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Still up?';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Night Owl 🦉';
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function HomeScreen() {
  const router = useRouter();
  const { goodHabits, badHabits } = useHabits();

  const today = new Date().toISOString().split('T')[0];

  const goodSummary = useMemo(() => {
    let totalTasks = 0, completedTasks = 0;
    const activeHabits = goodHabits.filter((h) => !h.archived);
    for (const h of activeHabits) {
      const rec = h.history.find((d) => d.date === today);
      totalTasks += h.tasks.length;
      completedTasks += rec ? rec.completedCount : 0;
    }
    return { totalTasks, completedTasks, habitCount: activeHabits.length };
  }, [goodHabits, today]);

  const activeBadHabits = useMemo(() => badHabits.filter((h) => !h.isCompleted), [badHabits]);
  const topGoodHabits = useMemo(() => goodHabits.filter((h) => !h.archived).slice(0, 2), [goodHabits]);

  const streakDisplay = useMemo(() => {
    const best = goodHabits.reduce((max, h) => Math.max(max, h.streak), 0);
    return best;
  }, [goodHabits]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText variant="h2">{getGreeting()} 👋</ThemedText>
            <Text style={styles.date}>{getTodayLabel()}</Text>
          </View>
          {streakDisplay > 0 && (
            <View style={styles.streakPill}>
              <Text style={styles.streakPillText}>🔥 {streakDisplay}</Text>
            </View>
          )}
        </View>

        {/* Today's overview card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNum, { color: Colors.teal }]}>
                {goodSummary.completedTasks}/{goodSummary.totalTasks}
              </Text>
              <Text style={styles.overviewLabel}>tasks done</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNum, { color: Colors.purple }]}>
                {goodSummary.habitCount}
              </Text>
              <Text style={styles.overviewLabel}>active habits</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewNum, { color: Colors.red }]}>
                {activeBadHabits.length}
              </Text>
              <Text style={styles.overviewLabel}>breaking</Text>
            </View>
          </View>

          {/* Progress bar */}
          {goodSummary.totalTasks > 0 && (
            <View style={styles.todayBar}>
              <View
                style={[
                  styles.todayBarFill,
                  { width: `${(goodSummary.completedTasks / goodSummary.totalTasks) * 100}%` },
                ]}
              />
            </View>
          )}

          {goodSummary.completedTasks === goodSummary.totalTasks && goodSummary.totalTasks > 0 && (
            <Text style={styles.allDone}>✅ All tasks done today! You crushed it.</Text>
          )}
        </View>

        {/* Good habits section */}
        {topGoodHabits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h3">🌱 Building</ThemedText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/good-habits')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {topGoodHabits.map((h) => {
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
          </View>
        )}

        {/* Bad habits section */}
        {activeBadHabits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h3">🛡️ Breaking</ThemedText>
              <TouchableOpacity onPress={() => router.push('/(tabs)/bad-habits')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {activeBadHabits.slice(0, 2).map((h) => (
              <BadHabitCard key={h.id} habit={h} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {goodHabits.length === 0 && badHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌟</Text>
            <ThemedText variant="h3" style={{ textAlign: 'center' }}>
              Your journey starts here
            </ThemedText>
            <Text style={styles.emptySubtitle}>
              Create a habit to build, or track one you want to break.
            </Text>
            <View style={styles.emptyButtons}>
              <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: Colors.teal }]} onPress={() => router.push('/(tabs)/good-habits')}>
                <Text style={styles.emptyBtnText}>Build a habit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.borderBright }]} onPress={() => router.push('/(tabs)/bad-habits')}>
                <Text style={[styles.emptyBtnText, { color: Colors.textPrimary }]}>Break a habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  date: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  streakPill: {
    backgroundColor: Colors.orange + '22',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
  },
  streakPillText: { color: Colors.orange, fontWeight: '700', fontSize: FontSize.md },
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  overviewItem: { alignItems: 'center', gap: 2 },
  overviewNum: { fontSize: FontSize.xxl, fontWeight: '800' },
  overviewLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  divider: { width: 1, height: 40, backgroundColor: Colors.borderBright },
  todayBar: {
    height: 6,
    backgroundColor: Colors.surface3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  todayBarFill: {
    height: '100%',
    backgroundColor: Colors.teal,
    borderRadius: 999,
    minWidth: 4,
  },
  allDone: {
    fontSize: FontSize.sm,
    color: Colors.teal,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: { gap: Spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.teal, fontWeight: '600' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyEmoji: { fontSize: 64 },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButtons: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  emptyBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    borderRadius: 999,
  },
  emptyBtnText: { fontWeight: '700', color: Colors.bg, fontSize: FontSize.md },
});
