import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface CounterDisplayProps {
  current: number;
  total?: number;
  color?: string;
  milestoneResets?: number;
}

export function CounterDisplay({ current, total = 1000, color = Colors.teal, milestoneResets = 0 }: CounterDisplayProps) {
  const progress = Math.min(1, current / total);

  return (
    <View style={styles.container}>
      {/* Big number */}
      <View style={styles.numberBlock}>
        <Text style={[styles.number, { color }]}>{current.toLocaleString()}</Text>
        <Text style={styles.slash}> / {total.toLocaleString()}</Text>
      </View>
      <Text style={styles.label}>urges resisted</Text>

      {/* Linear progress bar */}
      <View style={styles.barTrack}>
        <View
          style={[styles.barFill, { width: `${progress * 100}%`, backgroundColor: color }]}
        />
        {/* Milestone ticks */}
        {[0.1, 0.25, 0.5, 0.75].map((tick) => (
          <View
            key={tick}
            style={[styles.tick, { left: `${tick * 100}%` as any }]}
          />
        ))}
      </View>

      {/* Milestone resets */}
      {milestoneResets > 0 && (
        <View style={styles.milestones}>
          {Array.from({ length: milestoneResets }).map((_, i) => (
            <Text key={i} style={styles.milestoneIcon}>🏅</Text>
          ))}
          <Text style={styles.milestoneText}>
            {milestoneResets}× 1000 resisted!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  numberBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  number: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
  slash: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    paddingBottom: 8,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  barTrack: {
    width: '80%',
    height: 8,
    backgroundColor: Colors.surface3,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
    minWidth: 4,
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: Colors.bg,
    top: 0,
  },
  milestones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  milestoneIcon: { fontSize: 18 },
  milestoneText: {
    fontSize: FontSize.sm,
    color: Colors.orange,
    fontWeight: '600',
  },
});
