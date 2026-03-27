import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DayStreakBarProps {
  streakDays: number;
  targetDays: number;
  color?: string;
}

export function DayStreakBar({ streakDays, targetDays, color = Colors.teal }: DayStreakBarProps) {
  const progress = Math.min(1, streakDays / targetDays);
  const pct = `${Math.floor(progress * 100)}%`;

  const milestones = [7, 14, 21];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.days}>{streakDays}</Text>
          <Text style={styles.daysLabel}> / {targetDays} days clean</Text>
        </View>
        <Text style={styles.pct}>{pct}</Text>
      </View>

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: pct, backgroundColor: color }]} />
        {milestones.map((m) => (
          m < targetDays ? (
            <View
              key={m}
              style={[
                styles.milestone,
                { left: `${(m / targetDays) * 100}%` as any },
                streakDays >= m && { backgroundColor: color },
              ]}
            />
          ) : null
        ))}
      </View>

      <View style={styles.labels}>
        {milestones.filter((m) => m < targetDays).map((m) => (
          <Text
            key={m}
            style={[
              styles.milestoneLabel,
              { marginLeft: `${(m / targetDays) * 100 - 3}%` as any },
              streakDays >= m && { color },
            ]}
          >
            {m}d
          </Text>
        ))}
      </View>

      <Text style={styles.message}>
        {streakDays >= targetDays
          ? '🎉 You\'ve gone the distance! Mark it as overcome.'
          : streakDays >= 21
          ? '21 days done. Keep holding on.'
          : streakDays >= 7
          ? '7 days! Your brain is adapting. 💪'
          : streakDays >= 3
          ? '3 days strong. The tide is turning.'
          : streakDays === 1
          ? 'Day one. Every great story starts here.'
          : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'flex-end' },
  days: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  daysLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, paddingBottom: 4 },
  pct: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  barTrack: {
    height: 10,
    backgroundColor: Colors.surface3,
    borderRadius: Radius.full,
    overflow: 'visible',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
    minWidth: 6,
  },
  milestone: {
    position: 'absolute',
    width: 3,
    height: 16,
    top: -3,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderBright,
  } as any,
  labels: {
    flexDirection: 'row',
    position: 'relative',
    height: 14,
  },
  milestoneLabel: {
    position: 'absolute',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  message: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
