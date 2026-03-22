import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
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
  const customIngredients = useAppStore((s) => s.customIngredients);
  const toggleBarItem = useAppStore((s) => s.toggleBarItem);
  const addCustomIngredient = useAppStore((s) => s.addCustomIngredient);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');

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

  const handleAddCustom = useCallback((category: string) => {
    setAddCategory(category);
    setNewIngredientName('');
    setShowAddModal(true);
  }, []);

  const handleSaveCustom = useCallback(() => {
    const name = newIngredientName.trim();
    if (!name) return;
    const id = 'custom-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const ingredient: IngredientItem = { id, name, essential: false, brands: [] };
    addCustomIngredient(addCategory, ingredient);
    toggleBarItem(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowAddModal(false);
  }, [newIngredientName, addCategory, addCustomIngredient, toggleBarItem]);

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

  // Merge static + custom ingredients per category, sorted alphabetically
  const sections = useMemo(() => {
    return INGREDIENT_INDEX.map((cat) => {
      const custom = customIngredients[cat.category] || [];
      const allItems = [...cat.items, ...custom].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        title: cat.category,
        icon: cat.icon,
        data: collapsed[cat.category] ? [] : allItems,
        totalCount: allItems.length,
      };
    });
  }, [collapsed, customIngredients]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string; icon: string; data: IngredientItem[]; totalCount: number } }) => {
      const isCollapsed = collapsed[section.title] ?? false;
      const catData = INGREDIENT_INDEX.find((c) => c.category === section.title);
      const custom = customIngredients[section.title] || [];
      const allItems = [...(catData?.items || []), ...custom];
      const total = allItems.length;
      const owned = allItems.filter((i) => myBar.includes(i.id)).length;

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
    [collapsed, myBar, toggleCollapse, customIngredients]
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

  const renderSectionFooter = useCallback(
    ({ section }: { section: { title: string; data: IngredientItem[] } }) => {
      if (collapsed[section.title]) return null;
      return (
        <Pressable
          style={styles.addCustomBtn}
          onPress={() => handleAddCustom(section.title)}
        >
          <Text style={styles.addCustomText}>+ Add Custom</Text>
        </Pressable>
      );
    },
    [collapsed, handleAddCustom]
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
        renderSectionFooter={renderSectionFooter}
        ListHeaderComponent={ListHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* Add Custom Ingredient Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add Custom Ingredient</Text>
            <Text style={styles.modalSubtitle}>to {addCategory}</Text>
            <TextInput
              style={styles.modalInput}
              value={newIngredientName}
              onChangeText={setNewIngredientName}
              placeholder="Ingredient name"
              placeholderTextColor={colors.textDim}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveCustom}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSaveBtn, !newIngredientName.trim() && styles.modalSaveBtnDisabled]}
                onPress={handleSaveCustom}
                disabled={!newIngredientName.trim()}
              >
                <Text style={styles.modalSaveText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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

  // Add Custom button
  addCustomBtn: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  addCustomText: {
    fontSize: typography.sizes.body,
    color: colors.accentGold,
    fontWeight: typography.weights.semibold,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.displayFont,
    color: colors.accentGold,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.bgDark,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.accentGold,
    alignItems: 'center',
  },
  modalSaveBtnDisabled: {
    opacity: 0.4,
  },
  modalSaveText: {
    fontSize: typography.sizes.md,
    color: colors.bgDark,
    fontWeight: typography.weights.bold,
  },
});
