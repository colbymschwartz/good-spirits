import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { INGREDIENT_INDEX } from '../data/ingredients';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { useAppStore } from '../store/useAppStore';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors, typography, spacing, radius } from '../theme';
import type { IngredientItem, Cocktail } from '../types';

export function MyBarScreen() {
  const navigation = useNavigation<any>();
  const myBar = useAppStore((s) => s.myBar);
  const customCocktails = useAppStore((s) => s.customCocktails);
  const toggleBarItem = useAppStore((s) => s.toggleBarItem);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = useCallback((category: string) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleToggle = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleBarItem(id);
    },
    [toggleBarItem]
  );

  const makeable = useMemo(() => {
    if (myBar.length === 0) return [];
    const barSet = new Set(myBar);
    const results: Cocktail[] = [];
    for (const cocktail of [...COCKTAIL_DATABASE, ...customCocktails]) {
      const canMake = cocktail.variations.some(
        (v) =>
          v.ingredients.length > 0 &&
          v.ingredients.every((ing) => barSet.has(ing))
      );
      if (canMake) results.push(cocktail);
    }
    return results;
  }, [myBar, customCocktails]);

  const sections = useMemo(() => {
    return INGREDIENT_INDEX.map((cat) => ({
      title: cat.category,
      icon: cat.icon,
      data: collapsed[cat.category] ? [] : cat.items,
    }));
  }, [collapsed]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string; icon: string; data: IngredientItem[] } }) => {
      const isCollapsed = collapsed[section.title] ?? false;
      const catData = INGREDIENT_INDEX.find((c) => c.category === section.title);
      const total = catData?.items.length ?? 0;
      const owned = catData?.items.filter((i) => myBar.includes(i.id)).length ?? 0;

      return (
        <Pressable
          style={styles.sectionHeader}
          onPress={() => toggleCollapse(section.title)}
        >
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>
            {owned}/{total}
          </Text>
          <Text style={styles.chevron}>{isCollapsed ? '▸' : '▾'}</Text>
        </Pressable>
      );
    },
    [collapsed, myBar, toggleCollapse]
  );

  const renderItem = useCallback(
    ({ item }: { item: IngredientItem }) => {
      const isOwned = myBar.includes(item.id);
      return (
        <Pressable
          style={styles.ingredientRow}
          onPress={() => handleToggle(item.id)}
        >
          <View style={[styles.checkbox, isOwned && styles.checkboxActive]}>
            {isOwned && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.ingredientInfo}>
            <View style={styles.ingredientNameRow}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              {item.essential && (
                <View style={styles.essentialBadge}>
                  <Text style={styles.essentialText}>Essential</Text>
                </View>
              )}
            </View>
            {item.brands.length > 0 && (
              <Text style={styles.brands} numberOfLines={1}>
                {item.brands.join(', ')}
              </Text>
            )}
          </View>
        </Pressable>
      );
    },
    [myBar, handleToggle]
  );

  const ListHeader = useMemo(
    () => (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bar</Text>
          <Text style={styles.headerSubtitle}>
            {myBar.length} ingredient{myBar.length !== 1 ? 's' : ''} stocked
          </Text>
        </View>

        <ArtDecoDivider />

        {/* What Can I Make */}
        <View style={styles.makeableSection}>
          <Text style={styles.makeableTitle}>
            What Can I Make? ({makeable.length})
          </Text>
          {makeable.length === 0 ? (
            <Text style={styles.makeableEmpty}>
              Add ingredients to see what you can make
            </Text>
          ) : (
            makeable.slice(0, 10).map((c) => (
              <Pressable
                key={c.id}
                style={styles.makeableItem}
                onPress={() =>
                  navigation.navigate('CocktailsTab', {
                    screen: 'CocktailDetail',
                    params: { cocktailId: c.id },
                  })
                }
              >
                <Text style={styles.makeableEmoji}>{getCocktailEmoji(c)}</Text>
                <Text style={styles.makeableName}>{c.name}</Text>
                <Text style={styles.makeableArrow}>→</Text>
              </Pressable>
            ))
          )}
          {makeable.length > 10 && (
            <Text style={styles.makeableMore}>
              +{makeable.length - 10} more cocktails
            </Text>
          )}
        </View>

        <ArtDecoDivider style={{ marginTop: spacing.md }} />

        <View style={styles.browseHeader}>
          <Text style={styles.browseTitle}>Browse Ingredients</Text>
        </View>
      </View>
    ),
    [myBar.length, makeable, navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  list: {
    paddingBottom: spacing.huge,
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

  // What Can I Make
  makeableSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  makeableTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    marginBottom: spacing.sm,
  },
  makeableEmpty: {
    fontSize: typography.sizes.body,
    color: colors.textDim,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
  makeableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  makeableEmoji: {
    fontSize: 18,
  },
  makeableName: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  makeableArrow: {
    fontSize: typography.sizes.md,
    color: colors.accentGoldDim,
  },
  makeableMore: {
    fontSize: typography.sizes.sm,
    color: colors.textDim,
    textAlign: 'center',
    paddingTop: spacing.sm,
  },

  // Browse
  browseHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  browseTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: typography.sizes.md,
    color: colors.textDim,
  },

  // Ingredient rows
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ingredientName: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  essentialBadge: {
    backgroundColor: colors.goldOverlay12,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  essentialText: {
    fontSize: typography.sizes.xs,
    color: colors.accentGoldDim,
    fontWeight: typography.weights.semibold,
  },
  brands: {
    fontSize: typography.sizes.sm,
    color: colors.textDim,
    marginTop: 2,
  },
});
