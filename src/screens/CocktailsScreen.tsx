import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { SPIRIT_ICONS, STYLE_LABELS, MOOD_LABELS } from '../data/spirits';
import { useAppStore } from '../store/useAppStore';
import { CocktailCard } from '../components/CocktailCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { CreateCocktailModal } from '../components/CreateCocktailModal';
import { ImportModal } from '../components/ImportModal';
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

export function CocktailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [spiritFilter, setSpiritFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const customCocktails = useAppStore((s) => s.customCocktails);
  const customVariations = useAppStore((s) => s.customVariations);

  const allCocktails = useMemo(() => {
    const merged = COCKTAIL_DATABASE.map((c) => {
      const customVars = customVariations[c.id] || [];
      if (customVars.length === 0) return c;
      return { ...c, variations: [...c.variations, ...customVars] };
    });
    return [...merged, ...customCocktails];
  }, [customVariations, customCocktails]);

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
        // Frozen matches parent style OR any variation with "frozen" in the name or "blend" as method
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

    return results.map((c) => {
      let bestIdx = 0;
      if (q || sf || stf) {
        // If search matches the family name directly, show first variation
        if (q && c.name.toLowerCase().includes(q)) return { cocktail: c, varIdx: 0 };

        // If style filter matches the parent style exactly, show first variation
        if (stf && c.style === stf && !q && !sf) return { cocktail: c, varIdx: 0 };

        const matchIdx = c.variations.findIndex((v) => {
          const matchesSearch = q && (
            v.name.toLowerCase().includes(q) ||
            (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(q))) ||
            (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(q)))
          );
          const matchesSpirit = sf && (
            (v.spec && v.spec.some((s: string) => s.toLowerCase().includes(sf))) ||
            (v.ingredients && v.ingredients.some((ing: string) => ing.toLowerCase().includes(sf)))
          );
          // For frozen style filter, find the frozen variation specifically
          const matchesStyle = stf === 'frozen' && c.style !== 'frozen' && (
            v.name.toLowerCase().includes('frozen') ||
            (v.method && v.method.toLowerCase() === 'blend') ||
            (v.method && v.method.toLowerCase() === 'blending')
          );
          return matchesSearch || matchesSpirit || matchesStyle;
        });
        if (matchIdx >= 0) bestIdx = matchIdx;
      }
      return { cocktail: c, varIdx: bestIdx };
    });
  }, [allCocktails, spiritFilter, styleFilter, moodFilter, search]);

  const handlePress = useCallback(
    (cocktail: Cocktail, varIdx: number) => {
      navigation.navigate('CocktailDetail', { cocktailId: cocktail.id, variationIndex: varIdx });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: { cocktail: Cocktail; varIdx: number } }) => (
      <CocktailCard
        cocktail={item.cocktail}
        variationIndex={item.varIdx}
        onPress={() => handlePress(item.cocktail, item.varIdx)}
      />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback((item: { cocktail: Cocktail; varIdx: number }) => item.cocktail.id, []);


  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Trigger a re-render by toggling refreshing state
    setTimeout(() => setRefreshing(false), 400);
  }, []);

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

      <ArtDecoDivider />

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={15}
        windowSize={10}
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
