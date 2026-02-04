// No6 - テーマ設定（ミニマル・ラグジュアリー）
// 黒・白・生成りを基調としたデザインシステム

export const colors = {
  // Primary - 漆黒
  primary: '#0A0A0A',
  primaryLight: '#1A1A1A',
  primaryDark: '#000000',

  // Secondary - 墨色
  secondary: '#2C2C2C',
  secondaryLight: '#3C3C3C',
  secondaryDark: '#1C1C1C',

  // Background - 生成り / オフホワイト
  background: '#FAF9F7',
  backgroundDark: '#F5F4F2',
  backgroundPure: '#FFFFFF',

  // Surface - 白
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',

  // Text
  text: '#0A0A0A',
  textSecondary: '#4A4A4A',
  textMuted: '#8A8A8A',
  textLight: '#AAAAAA',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#CCCCCC',

  // Accent - はちみつのゴールド
  accent: '#D4A574',
  accentLight: '#E5C49A',
  accentDark: '#B8895A',

  // Status（控えめ）
  success: '#4A6A4E',
  warning: '#A68A4C',
  error: '#8B4A4A',

  // Others
  border: '#E5E5E3',
  borderLight: '#F0F0EE',
  divider: '#EBEBEA',
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
};

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export const typography = {
  // Display - ブランドコピー用
  displayLarge: {
    fontSize: 36,
    fontWeight: '300' as const,
    lineHeight: 48,
    letterSpacing: 2,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '300' as const,
    lineHeight: 38,
    letterSpacing: 1.5,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '300' as const,
    lineHeight: 34,
    letterSpacing: 1,
  },

  // Headline - セクションタイトル
  headlineLarge: {
    fontSize: 22,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  headlineMedium: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  headlineSmall: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.2,
  },

  // Body - 本文
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  // Label - ボタン・ラベル
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.8,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.6,
  },

  // Price - 価格表示
  price: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};

// アニメーション設定（静かで遅め）
export const animation = {
  duration: {
    fast: 200,
    normal: 400,
    slow: 600,
    verySlow: 1000,
  },
  easing: 'ease-out',
};

// よく使うスタイルのプリセット
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  cardFlat: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.none,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    secondary: {
      backgroundColor: colors.transparent,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.none,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    text: {
      backgroundColor: colors.transparent,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.none,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animation,
  commonStyles,
};
