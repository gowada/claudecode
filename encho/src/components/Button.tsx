import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'large' | 'medium' | 'small';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.base];

    if (variant === 'primary') baseStyles.push(styles.primary);
    else if (variant === 'secondary') baseStyles.push(styles.secondary);
    else if (variant === 'text') baseStyles.push(styles.textVariant);

    if (size === 'large') baseStyles.push(styles.largeSize);
    else if (size === 'medium') baseStyles.push(styles.mediumSize);
    else if (size === 'small') baseStyles.push(styles.smallSize);

    if (disabled) baseStyles.push(styles.disabled);
    if (style) baseStyles.push(style);

    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.baseText];

    if (variant === 'primary') baseStyles.push(styles.primaryText);
    else if (variant === 'secondary') baseStyles.push(styles.secondaryText);
    else if (variant === 'text') baseStyles.push(styles.textVariantText);

    if (size === 'large') baseStyles.push(styles.largeText);
    else if (size === 'medium') baseStyles.push(styles.mediumText);
    else if (size === 'small') baseStyles.push(styles.smallText);

    if (disabled) baseStyles.push(styles.disabledText);
    if (textStyle) baseStyles.push(textStyle);

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  // Variants - No6 uses square corners (borderRadius: none)
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.none,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.none,
  },
  textVariant: {
    backgroundColor: 'transparent',
  },

  // Sizes
  largeSize: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  mediumSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  smallSize: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 36,
  },

  // Disabled
  disabled: {
    backgroundColor: colors.textMuted,
  },

  // Text styles - No6 uses uppercase with letter spacing
  baseText: {
    ...typography.labelLarge,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  primaryText: {
    color: colors.textOnDark,
  },
  secondaryText: {
    color: colors.primary,
  },
  textVariantText: {
    color: colors.primary,
    textTransform: 'none',
    letterSpacing: 0,
  },

  // Text sizes
  largeText: {
    fontSize: typography.labelLarge.fontSize,
  },
  mediumText: {
    fontSize: typography.labelMedium.fontSize,
  },
  smallText: {
    fontSize: typography.labelSmall.fontSize,
  },

  disabledText: {
    color: colors.textOnDark,
  },
});
