import { HabitCalendar } from '@/components/good/HabitCalendar';
import { TaskItem } from '@/components/good/TaskItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { getGoodHabitStreakMessage } from '@/constants/Messages';
import { useHabits } from '@/context/HabitsContext';
import { useHaptics } from '@/hooks/useHaptics';
import { TaskRecord } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

export default function GoodHabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { goodHabits, saveDayRecord, updateGoodHabit, deleteGoodHabit } = useHabits();
  const { success, medium } = useHaptics();

  const habit = useMemo(() => goodHabits.find((h) => h.id === id), [goodHabits, id]);
  const today = new Date().toISOString().split('T')[0];

  const todayRecord = useMemo(() => habit?.history.find((d) => d.date === today), [habit, today]);

  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const [streakMsg, setStreakMsg] = useState('');

  useEffect(() => {
    if (!habit) return;
    if (todayRecord) {
      setTasks([...todayRecord.tasks]);
      setSaved(true);
    } else {
      setTasks(habit.tasks.map((t) => ({ ...t, completed: false })));
      setSaved(false);
    }
  }, [habit?.id, todayRecord?.date]);

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <ThemedText variant="h3">Habit not found</ThemedText>
          <Button label="Go back" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    setSaved(false);
  }

  function handleSave() {
    saveDayRecord(habit!.id, tasks);
    setSaved(true);
    success();
    const newStreak = habit!.streak + 1;
    const msg = getGoodHabitStreakMessage(newStreak);
    if (msg) setStreakMsg(msg);
    else setStreakMsg('');
  }

  function handleDelete() {
    Alert.alert(
      'Delete habit',
      `Delete "${habit!.name}"? This will remove all history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoodHabit(habit!.id);
            router.back();
          },
        },
      ]
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const allDone = completedCount === tasks.length && tasks.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top gradient header */}
        <LinearGradient
          colors={[habit.color + '44', Colors.bg]}
          style={styles.headerGradient}
        >
          {/* Back + actions row */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.navActions}>
              <TouchableOpacity
                onPress={() => router.push(`/good-habit/create?edit=${habit.id}`)}
                style={styles.iconBtn}
                accessibilityLabel="Edit habit"
              >
                <Ionicons name="pencil-outline" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.iconBtn} accessibilityLabel="Delete habit">
                <Ionicons name="trash-outline" size={20} color={Colors.red} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Icon + name */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.habitHeader}>
            <View style={[styles.iconCircle, { backgroundColor: habit.color + '33' }]}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
            </View>
            <ThemedText variant="h2">{habit.name}</ThemedText>
            <StreakBadge streak={habit.streak} color={habit.color} size="lg" />
            {streakMsg ? (
              <Animated.View entering={FadeInUp.duration(400)}>
                <Text style={[styles.streakMsg, { color: habit.color }]}>{streakMsg}</Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        </LinearGradient>

        {/* Today's tasks */}
        <Card style={styles.tasksCard}>
          <View style={styles.tasksHeader}>
            <ThemedText variant="h3">Today's Tasks</ThemedText>
            <Text style={styles.taskProgress}>
              {completedCount}/{tasks.length}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`,
                  backgroundColor: habit.color,
                },
              ]}
            />
          </View>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                accentColor={habit.color}
                onToggle={toggleTask}
              />
            ))}
          </View>

          {allDone && (
            <View style={[styles.allDoneBanner, { backgroundColor: habit.color + '22' }]}>
              <Text style={[styles.allDoneText, { color: habit.color }]}>
                🎉 All done! Save to lock in your streak.
              </Text>
            </View>
          )}

          <Button
            label={saved ? '✓ Day Saved!' : 'Save Today'}
            variant={saved ? 'secondary' : 'primary'}
            color={habit.color}
            onPress={handleSave}
            disabled={saved}
            style={{ marginTop: Spacing.md }}
          />
        </Card>

        {/* Calendar heatmap */}
        <Card style={styles.calendarCard}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
            Activity
          </ThemedText>
          <HabitCalendar habit={habit} />
          <View style={styles.calendarLegend}>
            <Text style={styles.legendLabel}>Less</Text>
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <View
                key={v}
                style={[
                  styles.legendCell,
                  { backgroundColor: v === 0 ? Colors.surface3 : habit.color + Math.round(v * 255).toString(16).padStart(2, '0') },
                ]}
              />
            ))}
            <Text style={styles.legendLabel}>More</Text>
          </View>
        </Card>

        {/* Stats */}
        <Card>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.md }}>Stats</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: habit.color }]}>{habit.streak}</Text>
              <Text style={styles.statLabel}>Current streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: habit.color }]}>{habit.longestStreak}</Text>
              <Text style={styles.statLabel}>Best streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: habit.color }]}>
                {habit.history.filter((d) => d.completed).length}
              </Text>
              <Text style={styles.statLabel}>Days completed</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: Spacing.xxl, gap: Spacing.md },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  headerGradient: { padding: Spacing.md, paddingTop: 0 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  backBtn: { padding: Spacing.xs },
  navActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { padding: Spacing.xs },
  habitHeader: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  iconCircle: { width: 72, height: 72, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  habitIcon: { fontSize: 36 },
  streakMsg: { fontSize: FontSize.md, fontWeight: '600', textAlign: 'center' },
  tasksCard: { marginHorizontal: Spacing.md },
  tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  taskProgress: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textSecondary },
  progressBar: {
    height: 6, backgroundColor: Colors.surface3, borderRadius: 999, overflow: 'hidden', marginBottom: Spacing.md,
  },
  progressFill: { height: '100%', borderRadius: 999, minWidth: 4 },
  taskList: { gap: 2 },
  allDoneBanner: { padding: Spacing.sm, borderRadius: Radius.md, marginTop: Spacing.sm },
  allDoneText: { fontWeight: '600', textAlign: 'center' },
  calendarCard: { marginHorizontal: Spacing.md },
  calendarLegend: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm, justifyContent: 'flex-end',
  },
  legendLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  legendCell: { width: 12, height: 12, borderRadius: 3 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});
