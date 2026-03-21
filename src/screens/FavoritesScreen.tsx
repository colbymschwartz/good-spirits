import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { SPIRIT_ICONS, STYLE_LABELS } from '../data/spirits';
import { useAppStore } from '../store/useAppStore';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail } from '../types';

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (n: number) => void;
}) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onRate(n)} hitSlop={4}>
          <Text style={[starStyles.star, n <= rating && starStyles.starActive]}>
            {'\u2605'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 18, color: colors.textDim },
  starActive: { color: colors.accentGold },
});

export function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const favorites = useAppStore((s) => s.favorites);
  const madeIt = useAppStore((s) => s.madeIt);
  const ratings = useAppStore((s) => s.ratings);
  const customCocktails = useAppStore((s) => s.customCocktails);
  const toggleMadeIt = useAppStore((s) => s.toggleMadeIt);
  const setRating = useAppStore((s) => s.setRating);

  const favCocktails = useMemo(() => {
    const allCocktails = [...COCKTAIL_DATABASE, ...customCocktails];
    return favorites
      .map((id) => allCocktails.find((c) => c.id === id))
      .filter(Boolean) as Cocktail[];
  }, [favorites, customCocktails]);

  const handleRate = useCallback(
    (id: string, n: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setRating(id, n);
    },
    [setRating]
  );

  const handleMadeIt = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleMadeIt(id);
    },
    [toggleMadeIt]
  );

  const renderItem = useCallback(
    ({ item }: { item: Cocktail }) => {
      const emoji = getCocktailEmoji(item);
      const isMade = madeIt.includes(item.id);
      const rating = ratings[item.id] || 0;
      const styleLabel = STYLE_LABELS[item.style] || item.style;

      return (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() =>
            navigation.navigate('CocktailsTab', {
              screen: 'CocktailDetail',
              params: { cocktailId: item.id },
            })
          }
        >
          <View style={styles.cardTop}>
            <View style={styles.emojiBox}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardMeta}>
                {item.spirit.charAt(0).toUpperCase() + item.spirit.slice(1)} ·{' '}
                {styleLabel}
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <StarRating
              rating={rating}
              onRate={(n) => handleRate(item.id, n)}
            />
            <Pressable
              style={[styles.madeItBtn, isMade && styles.madeItBtnActive]}
              onPress={() => handleMadeIt(item.id)}
            >
              <Text
                style={[
                  styles.madeItText,
                  isMade && styles.madeItTextActive,
                ]}
              >
                {isMade ? '\u2713 Made It' : 'Made It?'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      );
    },
    [madeIt, ratings, navigation, handleRate, handleMadeIt]
  );

  const keyExtractor = useCallback((item: Cocktail) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} cocktail{favorites.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      <ArtDecoDivider />

      <FlatList
        data={favCocktails}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u2764\uFE0F'}</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart on any cocktail to save it here for quick access
            </Text>
          </View>
        }
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
  cardPressed: {
    backgroundColor: colors.bgCardHover,
    transform: [{ scale: 0.98 }],
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.goldOverlay12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  cardMeta: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Made It
  madeItBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.textDim,
  },
  madeItBtnActive: {
    backgroundColor: colors.successOverlay15,
    borderColor: colors.success,
  },
  madeItText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textDim,
  },
  madeItTextActive: {
    color: colors.success,
  },

  // Empty state
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
});
