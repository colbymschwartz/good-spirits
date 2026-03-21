import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { TECHNIQUE_LIBRARY } from '../data/techniques';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { colors, typography, spacing, radius } from '../theme';
import type { Technique } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function TechniquesScreen() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Technique }) => {
      const isExpanded = expanded[item.id] ?? false;

      return (
        <Pressable
          style={styles.card}
          onPress={() => toggle(item.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardSummary} numberOfLines={isExpanded ? undefined : 2}>
                {item.summary}
              </Text>
            </View>
            <Text style={styles.chevron}>{isExpanded ? '\u25BE' : '\u25B8'}</Text>
          </View>

          {isExpanded && (
            <View style={styles.expanded}>
              <ArtDecoDivider style={{ marginVertical: spacing.md }} />

              <Text style={styles.content}>{item.content}</Text>

              {item.tips.length > 0 && (
                <View style={styles.tipsSection}>
                  <Text style={styles.sectionLabel}>TIPS</Text>
                  {item.tips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <Text style={styles.tipBullet}>{'\u2022'}</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {item.usedIn.length > 0 && (
                <View style={styles.usedInSection}>
                  <Text style={styles.sectionLabel}>USED IN</Text>
                  <View style={styles.tagRow}>
                    {item.usedIn.map((style) => (
                      <View key={style} style={styles.tag}>
                        <Text style={styles.tagText}>{style}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </Pressable>
      );
    },
    [expanded, toggle]
  );

  const keyExtractor = useCallback((item: Technique) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Techniques</Text>
        <Text style={styles.headerSubtitle}>Master the Craft</Text>
      </View>

      <ArtDecoDivider />

      <FlatList
        data={TECHNIQUE_LIBRARY}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.displayFont,
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
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.huge,
  },

  // Cards
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.goldOverlay12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.displayFontSemiBold,
    color: colors.textPrimary,
  },
  cardSummary: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  chevron: {
    fontSize: typography.sizes.md,
    color: colors.textDim,
    marginTop: 2,
  },

  // Expanded
  expanded: {
    marginTop: spacing.sm,
  },
  content: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipsSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tipBullet: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldDim,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  usedInSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.goldOverlay12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accentGoldLight,
    textTransform: 'capitalize',
  },
});
