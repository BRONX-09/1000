import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { useHaptics } from '@/hooks/useHaptics';
import { TaskRecord } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
  task: TaskRecord;
  accentColor?: string;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, accentColor = Colors.teal, onToggle }: TaskItemProps) {
  const { light } = useHaptics();
  const checkScale = useRef(new Animated.Value(task.completed ? 1 : 0)).current;
  const strikeWidth = useRef(new Animated.Value(task.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: task.completed ? 1 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 15,
      }),
      Animated.timing(strikeWidth, {
        toValue: task.completed ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [task.completed]);

  function handlePress() {
    light();
    onToggle(task.id);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.container}
      accessibilityLabel={task.label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: task.completed }}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, task.completed && { borderColor: accentColor, backgroundColor: accentColor + '22' }]}>
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <Ionicons name="checkmark" size={14} color={accentColor} />
        </Animated.View>
      </View>

      {/* Label + strikethrough */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            task.completed && { color: Colors.textMuted },
          ]}
        >
          {task.label}
        </Text>
        {task.completed && (
          <Animated.View
            style={[
              styles.strikethrough,
              {
                width: strikeWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  strikethrough: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: Colors.textMuted,
    top: '50%',
    left: 0,
  },
});
