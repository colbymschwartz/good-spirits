import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors } from '../theme';
import type { Cocktail, Variation } from '../types';

interface ShareCardProps {
  cocktail: Cocktail;
  variation: Variation;
  onReady?: (capture: () => Promise<void>) => void;
}

export function ShareCard({ cocktail, variation, onReady }: ShareCardProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const captureAndShare = useCallback(async () => {
    if (!viewShotRef.current?.capture) return;
    try {
      const uri = await viewShotRef.current.capture();
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      } else {
        await Share.share({ url: uri });
      }
    } catch (_) {
      // User cancelled or error
    }
  }, []);

  // Expose capture function to parent via callback ref
  React.useEffect(() => {
    onReady?.(captureAndShare);
  }, [onReady, captureAndShare]);

  const emoji = getCocktailEmoji(cocktail);
  const showVariationName = variation.name !== cocktail.name;

  // Format ingredients - strip leading measurements for cleaner display
  const ingredients = variation.spec;

  return (
    <View style={styles.offscreen} pointerEvents="none">
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1, result: 'tmpfile' }}
        style={styles.shotContainer}
      >
        <View style={styles.card}>
          {/* Top branding */}
          <Text style={styles.branding}>◆{'  '}Good Spirits{'  '}◆</Text>

          {/* Gold divider */}
          <View style={styles.divider} />

          {/* Cocktail emoji */}
          <Text style={styles.emoji}>{emoji}</Text>

          {/* Cocktail name */}
          <Text style={styles.cocktailName}>{cocktail.name}</Text>

          {/* Variation name */}
          {showVariationName && (
            <Text style={styles.variationName}>{variation.name}</Text>
          )}

          {/* Gold divider */}
          <View style={styles.divider} />

          {/* Ingredients */}
          <View style={styles.ingredientsContainer}>
            {ingredients.map((item, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Glass / Method / Garnish */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Glass</Text>
              <Text style={styles.metaValue}>{variation.glass}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Method</Text>
              <Text style={styles.metaValue}>{variation.method}</Text>
            </View>
            {variation.garnish ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Garnish</Text>
                <Text style={styles.metaValue}>{variation.garnish}</Text>
              </View>
            ) : null}
          </View>

          {/* Bottom divider */}
          <View style={styles.divider} />

          {/* Footer */}
          <Text style={styles.footer}>🍸{'  '}Shared from Good Spirits</Text>
        </View>
      </ViewShot>
    </View>
  );
}

const CARD_WIDTH = 390;
const CARD_HEIGHT = 520;

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 1, // must be visible for ViewShot to capture
  },
  shotContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.bgDark,
    borderWidth: 1,
    borderColor: colors.accentGold,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  branding: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accentGold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.accentGold,
    opacity: 0.4,
    marginVertical: 2,
  },
  emoji: {
    fontSize: 52,
    textAlign: 'center',
    marginTop: 2,
  },
  cocktailName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f0e6d3',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  variationName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.accentGold,
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
  ingredientsContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2.5,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accentGold,
    marginRight: 10,
    opacity: 0.7,
  },
  ingredientText: {
    fontSize: 14,
    color: '#f0e6d3',
    flex: 1,
    lineHeight: 20,
  },
  metaContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    width: 70,
  },
  metaValue: {
    fontSize: 13,
    color: '#f0e6d3',
    flex: 1,
    textTransform: 'capitalize',
  },
  footer: {
    fontSize: 11,
    color: colors.accentGold,
    opacity: 0.6,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
