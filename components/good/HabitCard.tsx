import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { GoodHabit } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressRing } from '../ui/ProgressRing';

interface HabitCardProps {
  habit: GoodHabit;
  todayCompleted: number;
  todayTotal: number;
}

export function HabitCard({ habit, todayCompleted, todayTotal }: HabitCardProps) {
  const router = useRouter();
  const progress = todayTotal > 0 ? todayCompleted / todayTotal : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/good-habit/${habit.id}`)}
      activeOpacity={0.8}
      accessibilityLabel={`${habit.name} habit`}
    >
      {/* Color accent bar */}
      <View style={[styles.accentBar, { backgroundColor: habit.color }]} />

      <View style={styles.content}>
        {/* Icon + Name */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: habit.color + '22' }]}>
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            <View style={styles.streakRow}>
              <Text style={styles.streakText}>🔥 {habit.streak} day streak</Text>
            </View>
          </View>
        </View>

        {/* Progress + tasks */}
        <View style={styles.footer}>
          <ProgressRing
            progress={progress}
            size={48}
            strokeWidth={5}
            color={habit.color}
            label={`${todayCompleted}/${todayTotal}`}
          />
          <View style={styles.footerText}>
            <Text style={styles.completionLabel}>
              {progress === 1 ? '✅ Done today!' : `${todayCompleted} of ${todayTotal} tasks`}
            </Text>
            <Text style={styles.tapHint}>Tap to check in</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </View>
      </View>
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
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  titleBlock: { flex: 1 },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  streakText: { fontSize: FontSize.sm, color: Colors.orange },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerText: { flex: 1 },
  completionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tapHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
