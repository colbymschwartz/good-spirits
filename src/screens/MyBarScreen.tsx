import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
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

// Simple fuzzy match: how well does query match a name?
function fuzzyScore(query: string, name: string): number {
  const q = query.toLowerCase().trim();
  const n = name.toLowerCase();
  if (!q) return 0;
  if (n === q) return 100;
  if (n.startsWith(q)) return 90;
  if (n.includes(q)) return 70;
  // Check if all words in query appear in name
  const qWords = q.split(/\s+/);
  const allWordsMatch = qWords.every((w) => n.includes(w));
  if (allWordsMatch) return 60;
  // Partial first-word match
  const nWords = n.split(/[\s()-]+/);
  for (const nw of nWords) {
    if (nw.startsWith(q)) return 50;
  }
  // Levenshtein-ish: check if query is close (off by 1-2 chars)
  if (q.length >= 3 && n.length >= 3) {
    for (const nw of nWords) {
      if (Math.abs(nw.length - q.length) <= 2) {
        let matches = 0;
        const shorter = q.length <= nw.length ? q : nw;
        const longer = q.length > nw.length ? q : nw;
        for (let i = 0; i < shorter.length; i++) {
          if (longer.includes(shorter[i])) matches++;
        }
        if (matches / shorter.length >= 0.7) return 40;
      }
    }
  }
  return 0;
}

interface FuzzyMatch {
  id: string;
  name: string;
  query: string;
  enabled: boolean;
}

function findBestMatch(query: string, allIngredients: { id: string; name: string }[]): FuzzyMatch | null {
  const q = query.trim();
  if (!q) return null;
  let best: { id: string; name: string; score: number } | null = null;
  for (const ing of allIngredients) {
    const score = fuzzyScore(q, ing.name);
    if (score > 0 && (!best || score > best.score)) {
      best = { ...ing, score };
    }
  }
  if (best) {
    return { id: best.id, name: best.name, query: q, enabled: true };
  }
  return null;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [fuzzyMatches, setFuzzyMatches] = useState<FuzzyMatch[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

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

  const { makeable, almostMakeable } = useMemo(() => {
    if (myBar.length === 0) return { makeable: [] as Cocktail[], almostMakeable: [] as { cocktail: Cocktail; missing: string[] }[] };
    const barSet = new Set(myBar);
    const exact: Cocktail[] = [];
    const almost: { cocktail: Cocktail; missing: string[] }[] = [];
    const seenAlmost = new Set<string>();
    for (const cocktail of [...COCKTAIL_DATABASE, ...customCocktails]) {
      let isExact = false;
      let bestMissing: string[] | null = null;
      for (const v of cocktail.variations) {
        if (v.ingredients.length === 0) continue;
        const missing = v.ingredients.filter((ing) => !barSet.has(ing));
        if (missing.length === 0) {
          isExact = true;
          break;
        }
        if (missing.length <= 2 && (!bestMissing || missing.length < bestMissing.length)) {
          bestMissing = missing;
        }
      }
      if (isExact) {
        exact.push(cocktail);
      } else if (bestMissing && !seenAlmost.has(cocktail.id)) {
        almost.push({ cocktail, missing: bestMissing });
        seenAlmost.add(cocktail.id);
      }
    }
    // Sort almost by fewest missing first
    almost.sort((a, b) => a.missing.length - b.missing.length);
    return { makeable: exact, almostMakeable: almost.slice(0, 8) };
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

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: { id: string; name: string; category: string }[] = [];
    for (const cat of INGREDIENT_INDEX) {
      for (const item of cat.items) {
        if (
          item.name.toLowerCase().startsWith(q) ||
          item.name.toLowerCase().includes(q) ||
          item.id.includes(q)
        ) {
          results.push({ id: item.id, name: item.name, category: cat.category });
        }
      }
    }
    // Also search custom ingredients
    for (const [category, items] of Object.entries(customIngredients)) {
      for (const item of items) {
        if (
          item.name.toLowerCase().startsWith(q) ||
          item.name.toLowerCase().includes(q)
        ) {
          results.push({ id: item.id, name: item.name, category });
        }
      }
    }
    // Sort: startsWith matches first, then includes
    results.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    });
    return results.slice(0, 15);
  }, [searchQuery, customIngredients]);

  // Flat list of all ingredients for fuzzy matching
  const allIngredients = useMemo(() => {
    const items: { id: string; name: string }[] = [];
    for (const cat of INGREDIENT_INDEX) {
      for (const item of cat.items) {
        items.push({ id: item.id, name: item.name });
      }
    }
    for (const [, catItems] of Object.entries(customIngredients)) {
      for (const item of catItems) {
        items.push({ id: item.id, name: item.name });
      }
    }
    return items;
  }, [customIngredients]);

  const handleVoiceStock = useCallback(() => {
    const raw = searchQuery.trim();
    if (!raw) return;
    // Split by commas, "and", newlines
    const segments = raw.split(/[,\n]+|\band\b/i).map((s) => s.trim()).filter(Boolean);
    const matches: FuzzyMatch[] = [];
    for (const seg of segments) {
      const match = findBestMatch(seg, allIngredients);
      if (match) {
        // Skip already-in-bar items but still show them
        matches.push({ ...match, enabled: !myBar.includes(match.id) });
      }
    }
    if (matches.length > 0) {
      setFuzzyMatches(matches);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Keyboard.dismiss();
    }
  }, [searchQuery, allIngredients, myBar]);

  const handleToggleFuzzyMatch = useCallback((index: number) => {
    setFuzzyMatches((prev) =>
      prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m))
    );
  }, []);

  const handleAddAllMatches = useCallback(() => {
    const toAdd = fuzzyMatches.filter((m) => m.enabled && !myBar.includes(m.id));
    for (const match of toAdd) {
      toggleBarItem(match.id);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const count = toAdd.length;
    setFuzzyMatches([]);
    setSearchQuery('');
    if (count > 0) {
      setSuccessMessage(`${count} ingredient${count !== 1 ? 's' : ''} added to your bar!`);
      setTimeout(() => setSuccessMessage(''), 2500);
    }
  }, [fuzzyMatches, myBar, toggleBarItem]);

  const handleAddFromSearch = useCallback(
    (id: string) => {
      if (!myBar.includes(id)) {
        toggleBarItem(id);
      }
      setSearchQuery('');
    },
    [myBar, toggleBarItem]
  );

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

        {/* Search / Dictation Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.searchInput, { flex: 1 }]}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setFuzzyMatches([]);
                setSuccessMessage('');
              }}
              placeholder="Type or dictate: bourbon, campari, lime..."
              placeholderTextColor={colors.textDim}
              returnKeyType="search"
              onSubmitEditing={handleVoiceStock}
              clearButtonMode="while-editing"
            />
            {searchQuery.includes(',') || /\band\b/i.test(searchQuery) ? (
              <TouchableOpacity
                style={styles.stockBtn}
                onPress={handleVoiceStock}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.stockBtnText}>Stock</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Fuzzy match confirmation list */}
          {fuzzyMatches.length > 0 && (
            <View style={styles.fuzzyBox}>
              <Text style={styles.fuzzyTitle}>Found:</Text>
              {fuzzyMatches.map((match, idx) => (
                <Pressable
                  key={match.id + idx}
                  style={styles.fuzzyRow}
                  onPress={() => handleToggleFuzzyMatch(idx)}
                >
                  <View style={[styles.fuzzyCheck, match.enabled && styles.fuzzyCheckActive]}>
                    {match.enabled && <Text style={styles.fuzzyCheckmark}>✓</Text>}
                  </View>
                  <Text style={[styles.fuzzyName, !match.enabled && styles.fuzzyNameDisabled]}>
                    {match.name}
                  </Text>
                  {myBar.includes(match.id) && (
                    <Text style={styles.fuzzyAlready}>already stocked</Text>
                  )}
                </Pressable>
              ))}
              <Pressable style={styles.addAllBtn} onPress={handleAddAllMatches}>
                <Text style={styles.addAllBtnText}>Add All</Text>
              </Pressable>
            </View>
          )}

          {/* Success message */}
          {successMessage ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {searchResults.length > 0 && fuzzyMatches.length === 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.searchResultRow}
                  onPress={() => handleAddFromSearch(item.id)}
                >
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName}>{item.name}</Text>
                    <Text style={styles.searchResultCategory}>{item.category}</Text>
                  </View>
                  {myBar.includes(item.id) ? (
                    <Text style={styles.searchResultAdded}>✓</Text>
                  ) : (
                    <Text style={styles.searchResultAdd}>+</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

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
          {makeable.length === 0 && almostMakeable.length > 0 && (
            <>
              <Text style={styles.almostTitle}>Almost There:</Text>
              {almostMakeable.slice(0, 5).map((item) => (
                <Pressable
                  key={item.cocktail.id}
                  style={styles.makeableItem}
                  onPress={() =>
                    navigation.navigate('CocktailsTab', {
                      screen: 'CocktailDetail',
                      params: { cocktailId: item.cocktail.id },
                    })
                  }
                >
                  <Text style={styles.makeableEmoji}>{getCocktailEmoji(item.cocktail)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.makeableName}>{item.cocktail.name}</Text>
                    <Text style={styles.missingText}>
                      Need: {item.missing.map((m) => m.replace(/-/g, ' ')).join(', ')}
                    </Text>
                  </View>
                  <Text style={styles.makeableArrow}>→</Text>
                </Pressable>
              ))}
            </>
          )}
        </View>

        <ArtDecoDivider style={{ marginTop: spacing.md }} />

        <View style={styles.browseHeader}>
          <Text style={styles.browseTitle}>Browse Ingredients</Text>
        </View>
      </View>
    ),
    [myBar.length, myBar, makeable, almostMakeable, navigation, searchQuery, searchResults, handleAddFromSearch, fuzzyMatches, handleVoiceStock, handleToggleFuzzyMatch, handleAddAllMatches, successMessage]
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
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
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
  almostTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  missingText: {
    fontSize: typography.sizes.sm,
    color: colors.accentGoldDim,
    marginTop: 2,
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

  // Search
  searchSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  stockBtn: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  stockBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.bgDark,
  },
  fuzzyBox: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.accentGold,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  fuzzyTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    marginBottom: spacing.sm,
  },
  fuzzyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  fuzzyCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuzzyCheckActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  fuzzyCheckmark: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  fuzzyName: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  fuzzyNameDisabled: {
    color: colors.textDim,
    textDecorationLine: 'line-through',
  },
  fuzzyAlready: {
    fontSize: typography.sizes.xs,
    color: colors.textDim,
    fontStyle: 'italic',
  },
  addAllBtn: {
    backgroundColor: colors.accentGold,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addAllBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.bgDark,
  },
  successBox: {
    backgroundColor: colors.successOverlay15,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  successText: {
    fontSize: typography.sizes.body,
    color: colors.success,
    fontWeight: typography.weights.semibold,
  },
  searchInput: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  searchResults: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    maxHeight: 300,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  searchResultCategory: {
    fontSize: typography.sizes.sm,
    color: colors.textDim,
    marginTop: 2,
  },
  searchResultAdd: {
    fontSize: 24,
    color: colors.accentGold,
    fontWeight: typography.weights.bold,
    paddingHorizontal: spacing.sm,
  },
  searchResultAdded: {
    fontSize: 18,
    color: colors.success,
    fontWeight: typography.weights.bold,
    paddingHorizontal: spacing.sm,
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
