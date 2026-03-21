import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { colors, typography, spacing } from '../theme';

export function PlaceholderScreen({ route }: any) {
  const { title, icon } = route.params || {};
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good Spirits</Text>
        <Text style={styles.headerSubtitle}>The Home Mixologist{'\u2019'}s Bible</Text>
      </View>
      <ArtDecoDivider />
      <View style={styles.content}>
        <Text style={styles.icon}>{icon || '🍸'}</Text>
        <Text style={styles.title}>{title || 'Coming Soon'}</Text>
        <Text style={styles.subtitle}>This screen will be built in Phase 2</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.accentGold,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textDim,
  },
});
