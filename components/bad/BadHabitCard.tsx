import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { BadHabit } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BadHabitCardProps {
  habit: BadHabit;
}

export function BadHabitCard({ habit }: BadHabitCardProps) {
  const router = useRouter();
  const progress = Math.min(1, habit.urgeCount / 1000);
  const dayProgress = Math.min(1, habit.streakDays / habit.targetDays);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/bad-habit/${habit.id}`)}
      activeOpacity={0.8}
      accessibilityLabel={`${habit.name} bad habit`}
    >
      <View style={[styles.accentBar, { backgroundColor: habit.color }]} />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: habit.color + '22' }]}>
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            <Text style={styles.subtitle}>
              {habit.isCompleted ? '🏆 Overcome!' : `Day ${habit.streakDays} of ${habit.targetDays}`}
            </Text>
          </View>
          <View style={styles.counter}>
            <Text style={[styles.counterNum, { color: habit.color }]}>
              {habit.urgeCount}
            </Text>
            <Text style={styles.counterLabel}>/ 1000</Text>
          </View>
        </View>

        {/* Progress bars */}
        <View style={styles.bars}>
          {/* Urge counter bar */}
          <View>
            <Text style={styles.barLabel}>Urges resisted</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: habit.color }]} />
            </View>
          </View>
          {/* Day streak bar */}
          <View>
            <Text style={styles.barLabel}>Clean days</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${dayProgress * 100}%`, backgroundColor: Colors.teal }]} />
            </View>
          </View>
        </View>

        {habit.milestoneResets > 0 && (
          <Text style={styles.milestone}>
            🏅 {habit.milestoneResets}× 1000 milestone{habit.milestoneResets > 1 ? 's' : ''} hit!
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={styles.arrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  accentBar: { width: 4, alignSelf: 'stretch' },
  content: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconCircle: {
    width: 40, height: 40, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  titleBlock: { flex: 1 },
  name: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  counter: { alignItems: 'flex-end' },
  counterNum: { fontSize: FontSize.xl, fontWeight: '800' },
  counterLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  bars: { gap: Spacing.xs },
  barLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 3 },
  barTrack: {
    height: 5,
    backgroundColor: Colors.surface3,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  milestone: { fontSize: FontSize.sm, color: Colors.orange, fontWeight: '600' },
  arrow: { marginRight: Spacing.sm },
});
