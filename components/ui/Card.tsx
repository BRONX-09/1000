import { Colors, Radius, Spacing } from '@/constants/Colors';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: number;
}

export function Card({ variant = 'default', padding = Spacing.md, style, children, ...props }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], { padding }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
  },
  default: {
    backgroundColor: Colors.surface,
  },
  elevated: {
    backgroundColor: Colors.surface2,
  },
  bordered: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderBright,
  },
});
