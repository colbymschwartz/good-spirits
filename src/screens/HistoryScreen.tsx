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
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COCKTAIL_HISTORY } from '../data/history';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors, typography, spacing, radius } from '../theme';
import type { HistoryEra } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const navigateToCocktail = useCallback(
    (id: string) => {
      navigation.navigate('CocktailsTab', {
        screen: 'CocktailDetail',
        params: { cocktailId: id },
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: HistoryEra }) => {
      const isExpanded = expanded[item.id] ?? false;

      return (
        <Pressable style={styles.card} onPress={() => toggle(item.id)}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPeriod}>{item.period}</Text>
            </View>
            <Text style={styles.chevron}>{isExpanded ? '\u25BE' : '\u25B8'}</Text>
          </View>

          <Text
            style={styles.summary}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {item.summary}
          </Text>

          {isExpanded && (
            <View style={styles.expanded}>
              <ArtDecoDivider style={{ marginVertical: spacing.md }} />

              <Text style={styles.content}>{item.content}</Text>

              {/* Key Drinks */}
              {item.keyDrinks.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>KEY DRINKS</Text>
                  {item.keyDrinks.map((drinkId) => {
                    const cocktail = COCKTAIL_DATABASE.find(
                      (c) => c.id === drinkId
                    );
                    if (!cocktail) {
                      return (
                        <Text key={drinkId} style={styles.drinkName}>
                          {drinkId}
                        </Text>
                      );
                    }
                    return (
                      <Pressable
                        key={drinkId}
                        style={styles.drinkRow}
                        onPress={() => navigateToCocktail(drinkId)}
                      >
                        <Text style={styles.drinkEmoji}>
                          {getCocktailEmoji(cocktail)}
                        </Text>
                        <Text style={styles.drinkName}>{cocktail.name}</Text>
                        <Text style={styles.drinkArrow}>{'\u2192'}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {/* Key Figures */}
              {item.keyFigures.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>KEY FIGURES</Text>
                  {item.keyFigures.map((figure, i) => (
                    <View key={i} style={styles.figureRow}>
                      <Text style={styles.figureBullet}>{'\u2022'}</Text>
                      <Text style={styles.figureText}>{figure}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Key Innovation */}
              {item.keyInnovation ? (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>KEY INNOVATIONS</Text>
                  <View style={styles.innovationBox}>
                    <Text style={styles.innovationText}>
                      {item.keyInnovation}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </Pressable>
      );
    },
    [expanded, toggle, navigateToCocktail]
  );

  const keyExtractor = useCallback((item: HistoryEra) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cocktail History</Text>
        <Text style={styles.headerSubtitle}>From Golden Age to Modern Era</Text>
      </View>

      <ArtDecoDivider />

      <FlatList
        data={COCKTAIL_HISTORY}
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
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.goldOverlay12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
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
  cardPeriod: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldDim,
    marginTop: 2,
    fontStyle: 'italic',
  },
  chevron: {
    fontSize: typography.sizes.md,
    color: colors.textDim,
  },
  summary: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 19,
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
  section: {
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

  // Key drinks
  drinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldOverlay06,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  drinkEmoji: {
    fontSize: 18,
  },
  drinkName: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  drinkArrow: {
    fontSize: typography.sizes.md,
    color: colors.accentGoldDim,
  },

  // Key figures
  figureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  figureBullet: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldDim,
    marginTop: 1,
  },
  figureText: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // Innovation
  innovationBox: {
    backgroundColor: colors.goldOverlay06,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentGoldDim,
  },
  innovationText: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldLight,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
