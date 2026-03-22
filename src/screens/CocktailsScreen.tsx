import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { INGREDIENT_INDEX } from '../data/ingredients';
import { SPIRIT_ICONS, STYLE_LABELS, MOOD_LABELS } from '../data/spirits';
import { useAppStore } from '../store/useAppStore';
import { CocktailCard } from '../components/CocktailCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { CreateCocktailModal } from '../components/CreateCocktailModal';
import { ImportModal } from '../components/ImportModal';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail } from '../types';
import type { CocktailsStackParamList } from '../navigation/stacks/CocktailsStack';

type NavigationProp = NativeStackNavigationProp<CocktailsStackParamList, 'Cocktails'>;

const SPIRIT_FILTERS = [
  { key: 'all', label: '\uD83C\uDF78 All' },
  ...Object.entries(SPIRIT_ICONS)
    .filter(([k]) => k !== 'other')
    .map(([key, icon]) => ({
      key,
      label: `${icon} ${key.charAt(0).toUpperCase() + key.slice(1)}`,
    })),
  { key: 'other', label: '\u2728 Other' },
];

const STYLE_FILTERS = [
  { key: 'all', label: 'All Styles' },
  ...Object.entries(STYLE_LABELS).map(([key, label]) => ({ key, label: label as string })),
];

const MOOD_FILTERS = [
  { key: 'all', label: 'All Moods' },
  ...Object.entries(MOOD_LABELS).map(([key, label]) => ({ key, label: label as string })),
];

const MY_BAR_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'ready', label: 'Ready to Pour' },
  { key: 'almost', label: 'Almost There' },
];

// Build ingredient ID → name lookup
const INGREDIENT_NAME_MAP: Record<string, string> = {};
for (const cat of INGREDIENT_INDEX) {
  for (const item of cat.items) {
    INGREDIENT_NAME_MAP[item.id] = item.name;
  }
}

// Deterministic "Drink of the Day" using date as seed
function getDrinkOfTheDay(cocktails: Cocktail[]): Cocktail {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const year = now.getFullYear();
  const seed = year * 366 + dayOfYear;

  // Group by spirit type for rotation
  const spiritTypes = [...new Set(cocktails.map((c) => c.spirit))];
  const spiritIndex = seed % spiritTypes.length;
  const todaysSpirit = spiritTypes[spiritIndex];
  const spiritCocktails = cocktails.filter((c) => c.spirit === todaysSpirit);

  // Pick from that spirit's cocktails
  const cocktailIndex = Math.floor(seed / spiritTypes.length) % spiritCocktails.length;
  return spiritCocktails[cocktailIndex] || cocktails[seed % cocktails.length];
}

export function CocktailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [spiritFilter, setSpiritFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [barFilter, setBarFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dotdDismissed, setDotdDismissed] = useState(false);
  const customCocktails = useAppStore((s) => s.customCocktails);
  const customVariations = useAppStore((s) => s.customVariations);
  const myBar = useAppStore((s) => s.myBar);

  const allCocktails = useMemo(() => {
    const merged = COCKTAIL_DATABASE.map((c) => {
      const customVars = customVariations[c.id] || [];
      if (customVars.length === 0) return c;
      return { ...c, variations: [...c.variations, ...customVars] };
    });
    return [...merged, ...customCocktails];
  }, [customVariations, customCocktails]);

  const drinkOfTheDay = useMemo(() => {
    return getDrinkOfTheDay(allCocktails);
  }, [allCocktails]);

  // Pre-compute bar match data for each cocktail
  const barMatchData = useMemo(() => {
    if (myBar.length === 0) return new Map<string, { ratio: number; missing: string[] }>();
    const barSet = new Set(myBar);
    const map = new Map<string, { ratio: number; missing: string[] }>();
    for (const cocktail of allCocktails) {
      let bestRatio = 0;
      let bestMissing: string[] = [];
      for (const v of cocktail.variations) {
        if (v.ingredients.length === 0) continue;
        const missing = v.ingredients.filter((ing) => !barSet.has(ing));
        const ratio = (v.ingredients.length - missing.length) / v.ingredients.length;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestMissing = missing;
        }
      }
      map.set(cocktail.id, {
        ratio: bestRatio,
        missing: bestMissing.map((id) => INGREDIENT_NAME_MAP[id] || id),
      });
    }
    return map;
  }, [allCocktails, myBar]);

  const filtered = useMemo(() => {
    let results = allCocktails;
    const q = search ? search.toLowerCase().trim() : '';
    const sf = spiritFilter !== 'all' ? spiritFilter : '';

    if (sf) {
      results = results.filter((c) =>
        c.spirit === sf ||
        c.variations.some((v) =>
          (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(sf))) ||
          (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(sf)))
        )
      );
    }
    if (styleFilter !== 'all') {
      if (styleFilter === 'frozen') {
        results = results.filter((c) =>
          c.style === 'frozen' ||
          c.variations.some((v) =>
            v.name.toLowerCase().includes('frozen') ||
            (v.method && v.method.toLowerCase() === 'blend') ||
            (v.method && v.method.toLowerCase() === 'blending')
          )
        );
      } else {
        results = results.filter((c) => c.style === styleFilter);
      }
    }
    if (moodFilter !== 'all') {
      results = results.filter((c) => c.tags && c.tags.includes(moodFilter));
    }

    // My Bar filter
    if (barFilter !== 'all' && myBar.length > 0) {
      results = results.filter((c) => {
        const data = barMatchData.get(c.id);
        if (!data) return false;
        if (barFilter === 'ready') return data.ratio === 1;
        if (barFilter === 'almost') return data.ratio >= 0.8;
        return true;
      });
    }

    if (q) {
      results = results.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.spirit.toLowerCase().includes(q) ||
        c.style.toLowerCase().includes(q) ||
        (c.tags && c.tags.some((t: string) => t.toLowerCase().includes(q))) ||
        c.variations.some((v) =>
          v.name.toLowerCase().includes(q) ||
          (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(q))) ||
          (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(q)))
        )
      );
    }

    const stf = styleFilter !== 'all' ? styleFilter : '';

    // When searching, expand matching variations into separate cards
    if (q) {
      const expanded: { cocktail: typeof results[0]; varIdx: number }[] = [];
      results.forEach((c) => {
        const matchingVarIndices: number[] = [];
        c.variations.forEach((v, i) => {
          if (
            v.name.toLowerCase().includes(q) ||
            (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(q))) ||
            (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(q)))
          ) {
            matchingVarIndices.push(i);
          }
        });

        if (matchingVarIndices.length > 0) {
          if (c.name.toLowerCase().includes(q)) {
            expanded.push({ cocktail: c, varIdx: 0 });
            matchingVarIndices.forEach((i) => {
              if (i > 0 && c.variations[i].name.toLowerCase().includes(q)) {
                expanded.push({ cocktail: c, varIdx: i });
              }
            });
          } else {
            matchingVarIndices.forEach((i) => {
              expanded.push({ cocktail: c, varIdx: i });
            });
          }
        } else if (
          c.name.toLowerCase().includes(q) ||
          c.spirit.toLowerCase().includes(q) ||
          c.style.toLowerCase().includes(q) ||
          (c.tags && c.tags.some((t: string) => t.toLowerCase().includes(q)))
        ) {
          expanded.push({ cocktail: c, varIdx: 0 });
        }
      });
      return expanded;
    }

    // No search — just spirit/style/mood filters, one card per family with best variation
    return results.map((c) => {
      let bestIdx = 0;
      if (sf || stf) {
        if (stf && c.style === stf) return { cocktail: c, varIdx: 0 };

        const matchIdx = c.variations.findIndex((v) => {
          const matchesSpirit = sf && (
            (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(sf))) ||
            (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(sf)))
          );
          const matchesStyle = stf === 'frozen' && c.style !== 'frozen' && (
            v.name.toLowerCase().includes('frozen') ||
            (v.method && v.method.toLowerCase() === 'blend') ||
            (v.method && v.method.toLowerCase() === 'blending')
          );
          return matchesSpirit || matchesStyle;
        });
        if (matchIdx >= 0) bestIdx = matchIdx;
      }
      return { cocktail: c, varIdx: bestIdx };
    });
  }, [allCocktails, spiritFilter, styleFilter, moodFilter, barFilter, myBar, barMatchData, search]);

  const handlePress = useCallback(
    (cocktail: Cocktail, varIdx: number) => {
      navigation.navigate('CocktailDetail', { cocktailId: cocktail.id, variationIndex: varIdx });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: { cocktail: Cocktail; varIdx: number } }) => {
      const matchData = myBar.length > 0 ? barMatchData.get(item.cocktail.id) : undefined;
      const missing = matchData?.missing;
      const matchRatio = matchData?.ratio;
      return (
        <CocktailCard
          cocktail={item.cocktail}
          variationIndex={item.varIdx}
          onPress={() => handlePress(item.cocktail, item.varIdx)}
          missingIngredients={missing}
          matchRatio={matchRatio}
          showBarMatch={myBar.length > 0}
        />
      );
    },
    [handlePress, barFilter, barMatchData]
  );

  const keyExtractor = useCallback((item: { cocktail: Cocktail; varIdx: number }) => item.cocktail.id + '-' + item.varIdx, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const spiritIcon = SPIRIT_ICONS[drinkOfTheDay.spirit] || '✨';
  const dotdStyleLabel = STYLE_LABELS[drinkOfTheDay.style] || drinkOfTheDay.style;

  // Hide DOTD when searching, filtering, or dismissed
  const showDotd = !dotdDismissed && !search.trim() && spiritFilter === 'all' && styleFilter === 'all' && moodFilter === 'all' && barFilter === 'all';

  const ListHeader = useMemo(() => {
    if (!showDotd) return null;
    return (
      <View style={styles.dotdWrapper}>
        <Pressable
          style={styles.dotdCard}
          onPress={() => handlePress(drinkOfTheDay, 0)}
        >
          <Text style={styles.dotdHeader}>🍸 Drink of the Day</Text>
          <View style={styles.dotdBody}>
            <Text style={styles.dotdEmoji}>{getCocktailEmoji(drinkOfTheDay)}</Text>
            <View style={styles.dotdInfo}>
              <Text style={styles.dotdName}>{drinkOfTheDay.name}</Text>
              <Text style={styles.dotdMeta}>
                {spiritIcon} {drinkOfTheDay.spirit.charAt(0).toUpperCase() + drinkOfTheDay.spirit.slice(1)} · {dotdStyleLabel}
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable style={styles.dotdDismiss} onPress={() => setDotdDismissed(true)}>
          <Text style={styles.dotdDismissText}>✕</Text>
        </Pressable>
      </View>
    );
  }, [showDotd, drinkOfTheDay, spiritIcon, dotdStyleLabel, handlePress, dotdDismissed]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good Spirits</Text>
        <Text style={styles.headerSubtitle}>The Home Mixologist{'\u2019'}s Bible</Text>
      </View>

      <ArtDecoDivider />

      <SearchBar value={search} onChangeText={setSearch} />
      <FilterBar options={SPIRIT_FILTERS} selected={spiritFilter} onSelect={setSpiritFilter} />
      <FilterBar options={STYLE_FILTERS} selected={styleFilter} onSelect={setStyleFilter} />
      <FilterBar options={MOOD_FILTERS} selected={moodFilter} onSelect={setMoodFilter} />
      {myBar.length > 0 && (
        <FilterBar options={MY_BAR_FILTERS} selected={barFilter} onSelect={setBarFilter} />
      )}

      <ArtDecoDivider />

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={15}
        windowSize={10}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accentGold}
            colors={[colors.accentGold]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\uD83C\uDF78'}</Text>
            <Text style={styles.emptyTitle}>No Cocktails Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        }
      />

      {/* FAB Menu */}
      {showFabMenu && (
        <Pressable style={styles.fabOverlay} onPress={() => setShowFabMenu(false)}>
          <View style={styles.fabMenu}>
            <Pressable
              style={styles.fabMenuItem}
              onPress={() => { setShowFabMenu(false); setShowCreate(true); }}
            >
              <Text style={styles.fabMenuIcon}>{'\u2728'}</Text>
              <Text style={styles.fabMenuText}>Create New</Text>
            </Pressable>
            <Pressable
              style={styles.fabMenuItem}
              onPress={() => { setShowFabMenu(false); setShowImport(true); }}
            >
              <Text style={styles.fabMenuIcon}>{'\uD83D\uDCCB'}</Text>
              <Text style={styles.fabMenuText}>Import Recipe</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      {/* FAB Button */}
      <Pressable style={styles.fab} onPress={() => setShowFabMenu(!showFabMenu)}>
        <Text style={styles.fabText}>{showFabMenu ? '\u2715' : '+'}</Text>
      </Pressable>

      <CreateCocktailModal visible={showCreate} onClose={() => setShowCreate(false)} />
      <ImportModal visible={showImport} onClose={() => setShowImport(false)} />
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
    fontSize: typography.sizes.hero + 2,
    fontFamily: typography.displayFont,
    color: colors.accentGold,
    letterSpacing: typography.letterSpacing.wide,
    textShadowColor: 'rgba(201, 169, 110, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
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
    paddingBottom: spacing.xxl,
  },

  // Drink of the Day
  dotdWrapper: {
    position: 'relative',
  },
  dotdDismiss: {
    position: 'absolute',
    top: 8,
    right: 24,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotdDismissText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  dotdCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accentGold,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  dotdHeader: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accentGold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.md,
  },
  dotdBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dotdEmoji: {
    fontSize: 40,
  },
  dotdInfo: {
    flex: 1,
  },
  dotdName: {
    fontSize: typography.sizes.xl + 2,
    fontFamily: typography.displayFont,
    color: colors.accentGoldLight,
    letterSpacing: typography.letterSpacing.tight,
  },
  dotdMeta: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: 2,
  },

  empty: {
    alignItems: 'center',
    paddingTop: spacing.huge * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.displayFontSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.body,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.bgDark,
    marginTop: -2,
  },
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: spacing.xl,
    paddingBottom: spacing.xxl + 64,
  },
  fabMenu: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  fabMenuIcon: {
    fontSize: 18,
  },
  fabMenuText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
});
