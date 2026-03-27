import { Colors, FontSize, Spacing } from '@/constants/Colors';
import { getRandomUrgeMessage } from '@/constants/Messages';
import { useHaptics } from '@/hooks/useHaptics';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(SCREEN_W * 0.6, 220);

interface Particle {
  id: number;
  angle: number;
  color: string;
}

interface UrgeButtonProps {
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function UrgeButton({ color = Colors.teal, onPress, disabled = false }: UrgeButtonProps) {
  const { heavy, success } = useHaptics();
  const scale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);

  const fireParticles = useCallback(() => {
    const COLORS = [color, Colors.white, Colors.orange, Colors.purple];
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: particleId.current++,
      angle: (i * 360) / 12,
      color: COLORS[i % COLORS.length],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  }, [color]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    heavy();
    const msg = getRandomUrgeMessage();

    // Scale animation: shrink → bounce
    scale.value = withSequence(
      withTiming(0.88, { duration: 80 }),
      withSpring(1.08, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 14, stiffness: 300 })
    );

    // Flash
    flashOpacity.value = withSequence(
      withTiming(0.35, { duration: 60 }),
      withTiming(0, { duration: 300 })
    );

    runOnJS(setMessage)(msg);
    runOnJS(fireParticles)();
    runOnJS(success)();
    runOnJS(onPress)();
  }, [disabled, heavy, success, onPress, fireParticles]);

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(handlePress)();
  });

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Particles */}
      {particles.map((p) => (
        <ParticleView key={p.id} angle={p.angle} color={p.color} buttonSize={BUTTON_SIZE} />
      ))}

      {/* The Button */}
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.button, { width: BUTTON_SIZE, height: BUTTON_SIZE, borderRadius: BUTTON_SIZE / 2 }, buttonAnimStyle]}>
          {/* Background fill */}
          <View style={[StyleSheet.absoluteFill, {
            borderRadius: BUTTON_SIZE / 2,
            backgroundColor: color + '18',
          }]} />

          {/* SVG ring */}
          <Svg width={BUTTON_SIZE} height={BUTTON_SIZE} style={StyleSheet.absoluteFill}>
            <Circle
              cx={BUTTON_SIZE / 2}
              cy={BUTTON_SIZE / 2}
              r={BUTTON_SIZE / 2 - 4}
              stroke={color}
              strokeWidth={3}
              fill="none"
              opacity={0.8}
            />
          </Svg>

          {/* Flash overlay on press */}
          <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: BUTTON_SIZE / 2, backgroundColor: Colors.white }, flashStyle]} />

          {/* Inner content */}
          <Text style={styles.noText}>NO</Text>
          <Text style={styles.subText}>Press to resist</Text>
        </Animated.View>
      </GestureDetector>

      {/* Affirmation message */}
      {message ? (
        <AffirmationText text={message} />
      ) : null}
    </View>
  );
}

// Particle burst element
function ParticleView({ angle, color, buttonSize }: { angle: number; color: string; buttonSize: number }) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const rad = (angle * Math.PI) / 180;
  const dist = buttonSize / 2 + 40;

  React.useEffect(() => {
    translateX.value = withTiming(Math.cos(rad) * dist, { duration: 600, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(Math.sin(rad) * dist, { duration: 600, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(0, { duration: 600 });
    scale.value = withTiming(0, { duration: 600 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.particle, { backgroundColor: color }, style]}
      pointerEvents="none"
    />
  );
}

// Affirmation text with fade-in-out
function AffirmationText({ text }: { text: string }) {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 1800 }),
      withTiming(0, { duration: 400 })
    );
  }, [text]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.affirmation, style]}>
      <Text style={styles.affirmationText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface2,
    elevation: 12,
    shadowColor: Colors.teal,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  noText: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 6,
  },
  subText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: -4,
    letterSpacing: 0.5,
  },
  particle: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  affirmation: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  affirmationText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
});
