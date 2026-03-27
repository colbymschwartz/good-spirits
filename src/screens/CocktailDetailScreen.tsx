import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { COCKTAIL_DATABASE } from '../data/cocktails';
import { SPIRIT_ICONS, STYLE_LABELS } from '../data/spirits';
import { useAppStore } from '../store/useAppStore';
import { ArtDecoDivider } from '../components/ArtDecoDivider';
import { BatchCalculator } from '../components/BatchCalculator';
import { RemixModal } from '../components/RemixModal';
import { ShareCard } from '../components/ShareCard';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail, Variation } from '../types';
import type { CocktailsStackParamList } from '../navigation/stacks/CocktailsStack';

type DetailRoute = RouteProp<CocktailsStackParamList, 'CocktailDetail'>;

function StarRating({ cocktailId }: { cocktailId: string }) {
  const ratings = useAppStore((s) => s.ratings);
  const setRating = useAppStore((s) => s.setRating);
  const currentRating = ratings[cocktailId] || 0;

  const handleRate = (star: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(cocktailId, star === currentRating ? 0 : star);
  };

  return (
    <View style={starStyles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => handleRate(star)} hitSlop={4}>
          <Text style={[starStyles.star, star <= currentRating ? starStyles.starFilled : starStyles.starEmpty]}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  star: {
    fontSize: 30,
  },
  starFilled: {
    color: colors.accentGold,
  },
  starEmpty: {
    color: '#3a3a5a',
  },
});

export function CocktailDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { cocktailId, variationIndex = 0 } = route.params;

  const customCocktails = useAppStore((s) => s.customCocktails);
  const customVariations = useAppStore((s) => s.customVariations);
  const favorites = useAppStore((s) => s.favorites);
  const madeIt = useAppStore((s) => s.madeIt);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleMadeIt = useAppStore((s) => s.toggleMadeIt);
  const notes = useAppStore((s) => s.notes);
  const photos = useAppStore((s) => s.photos);
  const saveNote = useAppStore((s) => s.saveNote);
  const savePhoto = useAppStore((s) => s.savePhoto);

  const cocktail = useMemo(() => {
    const base = COCKTAIL_DATABASE.find((c) => c.id === cocktailId);
    if (base) {
      const customVars = customVariations[base.id] || [];
      if (customVars.length > 0) {
        return { ...base, variations: [...base.variations, ...customVars] };
      }
      return base;
    }
    return customCocktails.find((c) => c.id === cocktailId) || null;
  }, [cocktailId, customCocktails, customVariations]);

  const [activeVariation, setActiveVariation] = useState(variationIndex);
  const [showBatch, setShowBatch] = useState(false);
  const [showRemix, setShowRemix] = useState(false);
  const [noteText, setNoteText] = useState('');
  const shareCapture = useRef<(() => Promise<void>) | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variation = cocktail?.variations[activeVariation] || cocktail?.variations[0];
  const noteKey = cocktail && variation ? cocktail.id + '::' + variation.name : '';
  const photoUri = cocktail && variation ? photos[noteKey] || null : null;

  // Sync note text when variation changes
  useEffect(() => {
    if (noteKey) {
      setNoteText(notes[noteKey] || '');
    }
  }, [noteKey, notes]);

  if (!cocktail) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Cocktail not found</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!variation) return null;

  const isFav = favorites.includes(cocktail.id);
  const isMade = madeIt.includes(cocktail.id);
  const spiritIcon = SPIRIT_ICONS[cocktail.spirit] || '✨';
  const styleLabel = STYLE_LABELS[cocktail.style] || cocktail.style;

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(cocktail.id);
  };

  const handleShareReady = useCallback((capture: () => Promise<void>) => {
    shareCapture.current = capture;
  }, []);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (shareCapture.current) {
      await shareCapture.current();
    }
  };

  const handlePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      savePhoto(cocktail.id, variation.name, result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      savePhoto(cocktail.id, variation.name, result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    saveNote(cocktail.id, variation.name, text);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowSaved(false);
    saveTimerRef.current = setTimeout(() => {
      setShowSaved(true);
      hideTimerRef.current = setTimeout(() => setShowSaved(false), 1500);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button only */}
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
        </View>

        {/* Hero section */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{spiritIcon}</Text>
          <Text style={styles.heroName}>{cocktail.name}</Text>

          {/* Star Rating */}
          <StarRating cocktailId={cocktail.id} />

          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>
              {cocktail.spirit.charAt(0).toUpperCase() + cocktail.spirit.slice(1)}
            </Text>
            <Text style={styles.heroMetaDot}>·</Text>
            <Text style={styles.heroMetaText}>{styleLabel}</Text>
            <Text style={styles.heroMetaDot}>·</Text>
            <Text style={styles.heroMetaText}>{cocktail.era}</Text>
          </View>
          {cocktail.history ? (
            <Text style={styles.heroHistory}>{cocktail.history}</Text>
          ) : null}
          <View style={styles.heroTags}>
            {cocktail.tags.map((tag) => (
              <View key={tag} style={styles.heroTag}>
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action buttons — prominent row */}
        <View style={styles.actionRow}>
          <Pressable onPress={handleFavorite} style={[styles.actionBtnLarge, isFav && styles.actionBtnLargeActive]}>
            <Text style={styles.actionBtnLargeIcon}>{isFav ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionBtnLargeText, isFav && styles.actionBtnLargeTextActive]}>Favorite</Text>
          </Pressable>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleMadeIt(cocktail.id); }} style={[styles.actionBtnLarge, isMade && styles.actionBtnLargeActive]}>
            <Text style={styles.actionBtnLargeIcon}>{isMade ? '✅' : '☑️'}</Text>
            <Text style={[styles.actionBtnLargeText, isMade && styles.actionBtnLargeTextActive]}>{isMade ? 'Made It!' : 'Made It'}</Text>
          </Pressable>
          <Pressable onPress={() => setShowBatch(true)} style={styles.actionBtnLarge}>
            <Text style={styles.actionBtnLargeIcon}>🧮</Text>
            <Text style={styles.actionBtnLargeText}>Batch</Text>
          </Pressable>
          <Pressable onPress={() => setShowRemix(true)} style={styles.actionBtnLarge}>
            <Text style={styles.actionBtnLargeIcon}>🔄</Text>
            <Text style={styles.actionBtnLargeText}>Remix</Text>
          </Pressable>
          <Pressable onPress={handleShare} style={styles.actionBtnLarge}>
            <Text style={styles.actionBtnLargeIcon}>📤</Text>
            <Text style={styles.actionBtnLargeText}>Share</Text>
          </Pressable>
        </View>

        <ArtDecoDivider />

        {/* Variation tabs */}
        {cocktail.variations.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.varTabs}
            contentContainerStyle={styles.varTabsContent}
          >
            {cocktail.variations.map((v, i) => (
              <Pressable
                key={v.name}
                style={[styles.varTab, activeVariation === i && styles.varTabActive]}
                onPress={() => {
                  setActiveVariation(i);
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.varTabText,
                    activeVariation === i && styles.varTabTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {v.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Variation detail */}
        <View style={styles.variationDetail}>
          {/* Name + badges */}
          <View style={styles.varHeader}>
            <Text style={styles.varName}>{variation.name}</Text>
            {variation.canon && (
              <View style={styles.canonBadge}>
                <Text style={styles.canonBadgeText}>CANON</Text>
              </View>
            )}
            {variation.isCustom && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>CUSTOM</Text>
              </View>
            )}
          </View>

          {/* Photo section */}
          {photoUri ? (
            <View style={styles.photoSection}>
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
              <View style={styles.photoActions}>
                <Pressable style={styles.photoBtn} onPress={handleCamera}>
                  <Text style={styles.photoBtnText}>📷 Retake</Text>
                </Pressable>
                <Pressable style={styles.photoBtn} onPress={handlePhoto}>
                  <Text style={styles.photoBtnText}>🖼️ Gallery</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <View style={styles.photoActions}>
                <Pressable style={styles.photoBtn} onPress={handleCamera}>
                  <Text style={styles.photoBtnText}>📷 Take Photo</Text>
                </Pressable>
                <Pressable style={styles.photoBtn} onPress={handlePhoto}>
                  <Text style={styles.photoBtnText}>🖼️ From Gallery</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Spec / Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>INGREDIENTS</Text>
            {variation.spec.map((item, i) => (
              <View key={i} style={styles.specItem}>
                <View style={styles.specDot} />
                <Text style={styles.specText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Glass & Method */}
          <View style={styles.rowSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>GLASS</Text>
              <Text style={styles.infoText}>{variation.glass}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>METHOD</Text>
              <Text style={styles.infoText}>{variation.method}</Text>
            </View>
          </View>

          {/* Garnish */}
          {variation.garnish ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>GARNISH</Text>
              <Text style={styles.detailText}>{variation.garnish}</Text>
            </View>
          ) : null}

          {/* Steps */}
          {variation.steps ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>STEPS</Text>
              <Text style={styles.detailText}>{variation.steps}</Text>
            </View>
          ) : null}

          {/* Ratio Notes */}
          {variation.ratioNotes ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>RATIO NOTES</Text>
              <View style={styles.ratioBox}>
                <Text style={styles.ratioText}>{variation.ratioNotes}</Text>
              </View>
            </View>
          ) : null}

          {/* Brand Recommendations */}
          {variation.brandRecs ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BRAND RECOMMENDATIONS</Text>
              <Text style={styles.detailText}>{variation.brandRecs}</Text>
            </View>
          ) : null}

          {/* Personal Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MY NOTES</Text>
            <TextInput
              style={styles.notesInput}
              value={noteText}
              onChangeText={handleNoteChange}
              placeholder="Tasting notes, personal tweaks, preferences..."
              placeholderTextColor={colors.textDim}
              multiline
              textAlignVertical="top"
            />
            {showSaved && (
              <Text style={styles.savedText}>Saved</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <BatchCalculator
        visible={showBatch}
        onClose={() => setShowBatch(false)}
        cocktail={cocktail}
        initialVariationIndex={activeVariation}
      />

      <RemixModal
        visible={showRemix}
        onClose={() => setShowRemix(false)}
        cocktail={cocktail}
        variation={variation}
      />

      <ShareCard
        cocktail={cocktail}
        variation={variation}
        onReady={handleShareReady}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: typography.sizes.lg,
    color: colors.textDim,
    marginBottom: spacing.md,
  },
  backLink: {
    fontSize: typography.sizes.md,
    color: colors.accentGold,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    color: colors.accentGold,
    fontWeight: typography.weights.semibold,
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  actionBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.accentGold,
  },
  favButton: {
    padding: spacing.xs,
  },
  favButtonText: {
    fontSize: 24,
  },

  // Action row (prominent buttons below history)
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  actionBtnLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minWidth: 60,
  },
  actionBtnLargeActive: {
    // Active state for favorite
  },
  actionBtnLargeIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  actionBtnLargeText: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionBtnLargeTextActive: {
    color: colors.accentGold,
  },

  // Hero
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroName: {
    fontSize: typography.sizes.hero + 2,
    fontFamily: typography.displayFont,
    color: colors.accentGold,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: spacing.sm,
  },
  heroMetaText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  heroMetaDot: {
    fontSize: typography.sizes.body,
    color: colors.textDim,
  },
  heroHistory: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heroTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  heroTag: {
    backgroundColor: colors.goldOverlay12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  heroTagText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.accentGoldLight,
  },

  // Variation tabs
  varTabs: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  varTabsContent: {
    paddingHorizontal: spacing.lg,
  },
  varTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    position: 'relative',
  },
  varTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accentGold,
  },
  varTabText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textDim,
  },
  varTabTextActive: {
    color: colors.accentGoldLight,
  },

  // Variation detail
  variationDetail: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  varHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  varName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  canonBadge: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  canonBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  customBadge: {
    backgroundColor: colors.bgSurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    textTransform: 'uppercase',
  },

  // Photo section
  photoSection: {
    marginBottom: spacing.lg,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  photoPlaceholder: {
    marginBottom: spacing.lg,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photoBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
  },
  photoBtnText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },

  // Sections
  section: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.xs,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  specDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentGoldDim,
    marginTop: 7,
  },
  specText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    flex: 1,
  },
  rowSection: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoBlock: {
    flex: 1,
  },
  infoText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  detailText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ratioBox: {
    backgroundColor: colors.goldOverlay06,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentGoldDim,
  },
  ratioText: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldLight,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Notes
  notesInput: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    minHeight: 80,
    lineHeight: 20,
  },
  savedText: {
    fontSize: typography.sizes.sm,
    color: colors.accentGold,
    marginTop: spacing.xs,
  },
});
