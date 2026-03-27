import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  color?: string;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  color,
  style,
  ...props
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [styles.base, styles[`size_${size}`], styles[variant]];
  if (color && variant === 'primary') {
    containerStyle.push({ backgroundColor: color });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[containerStyle, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? Colors.teal : Colors.bg} size="small" />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: { paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.md },
  size_md: { paddingVertical: Spacing.sm + 4, paddingHorizontal: Spacing.lg },
  size_lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },

  primary: { backgroundColor: Colors.teal },
  secondary: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.borderBright },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.red },

  label: { fontWeight: '700', fontSize: FontSize.md } as TextStyle,
  label_primary: { color: Colors.bg },
  label_secondary: { color: Colors.textPrimary },
  label_ghost: { color: Colors.teal },
  label_danger: { color: Colors.white },
});
