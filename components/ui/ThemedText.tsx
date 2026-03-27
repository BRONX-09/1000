import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'muted';
  color?: string;
}

export function ThemedText({ variant = 'body', color, style, children, ...props }: ThemedTextProps) {
  return (
    <Text style={[styles[variant], color ? { color } : {}, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  } as TextStyle,
  body: {
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
  } as TextStyle,
  caption: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  } as TextStyle,
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  muted: {
    fontSize: FontSize.xs,
    fontWeight: '400',
    color: Colors.textMuted,
  } as TextStyle,
});
