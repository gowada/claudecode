// 縁帳 - テーマ設定（和モダン）

export const colors = {
  // Primary - 深緑鼠
  primary: '#3D5A5B',
  primaryLight: '#5A7A7B',
  primaryDark: '#2A4344',

  // Secondary - 煤竹色
  secondary: '#8B7355',
  secondaryLight: '#A89070',
  secondaryDark: '#6E5A44',

  // Background - 生成り
  background: '#F7F5F0',
  backgroundDark: '#EBE8E0',

  // Surface - 白
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',

  // Text - 墨
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#888888',
  textLight: '#AAAAAA',

  // Accent - 緋色
  accent: '#C84C4C',
  accentLight: '#E06666',

  // Status
  success: '#4A7C4E',
  warning: '#C89B4C',
  error: '#C84C4C',

  // Others
  border: '#E0DDD5',
  divider: '#EBE8E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  // Display
  displayLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },

  // Headline
  headlineLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },

  // Label
  labelLarge: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

// よく使うスタイルのプリセット
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodyLarge.fontSize,
    color: colors.text,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  commonStyles,
};
