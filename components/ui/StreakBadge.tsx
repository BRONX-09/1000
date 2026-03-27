import { Colors, FontSize, Spacing } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

interface StreakBadgeProps {
  streak: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, color = Colors.orange, size = 'md' }: StreakBadgeProps) {
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    if (streak >= 7) {
      scaleAnim.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      scaleAnim.value = 1;
    }
  }, [streak]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const sizes = {
    sm: { container: 36, font: FontSize.xs, emoji: 12 },
    md: { container: 48, font: FontSize.sm, emoji: 14 },
    lg: { container: 60, font: FontSize.md, emoji: 18 },
  };
  const s = sizes[size];

  return (
    <Animated.View style={[{ alignItems: 'center' }, animStyle]}>
      <View style={[styles.badge, { backgroundColor: color + '22' }]}>
        <Text style={{ fontSize: s.emoji }}>🔥</Text>
        <Text style={[styles.count, { color, fontSize: s.font }]}>
          {streak}
        </Text>
      </View>
      <Text style={styles.label}>day streak</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
  },
  count: {
    fontWeight: '800',
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
