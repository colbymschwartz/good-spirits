import { Platform } from 'react-native';

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  displayFont: 'JosefinSans_700Bold',
  displayFontRegular: 'JosefinSans_400Regular',
  displayFontSemiBold: 'JosefinSans_600SemiBold',

  sizes: {
    xs: 10,
    sm: 11,
    body: 13,
    md: 14,
    lg: 15,
    xl: 16,
    xxl: 22,
    hero: 24,
    icon: 48,
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  letterSpacing: {
    tight: 0.5,
    wide: 1,
    wider: 1.5,
  },
} as const;
