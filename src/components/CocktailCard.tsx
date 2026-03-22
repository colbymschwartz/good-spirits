import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Cocktail } from '../types';
import { STYLE_LABELS } from '../data/spirits';
import { getCocktailEmoji } from '../utils/cocktailEmoji';
import { colors, typography, spacing, radius } from '../theme';

interface Props {
  cocktail: Cocktail;
  variationIndex?: number;
  onPress: () => void;
  missingIngredients?: string[];
}

function CocktailCardInner({ cocktail, variationIndex = 0, onPress, missingIngredients }: Props) {
  const emoji = getCocktailEmoji(cocktail);
  const styleLabel = STYLE_LABELS[cocktail.style] || cocktail.style;
  const varCount = cocktail.variations.length;
  const variation = cocktail.variations[variationIndex] || cocktail.variations[0];
  const showVariation = variationIndex > 0 && variation;

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
      mass: 1,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
      mass: 1,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <Pressable
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.spiritIcon}>
          <Text style={styles.spiritIconText}>{emoji}</Text>
        </View>
        <View style={styles.info}>
          {showVariation ? (
            <>
              <Text style={styles.name} numberOfLines={1}>
                {variation.name}
              </Text>
              <Text style={styles.parentName} numberOfLines={1}>
                {cocktail.name}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.name} numberOfLines={1}>
                {cocktail.name}
              </Text>
              <Text style={styles.meta}>
                {cocktail.spirit.charAt(0).toUpperCase() + cocktail.spirit.slice(1)} · {styleLabel}
              </Text>
            </>
          )}
          <View style={styles.tags}>
            {cocktail.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          {missingIngredients && missingIngredients.length > 0 && (
            <Text style={styles.missingText} numberOfLines={2}>
              Missing: {missingIngredients.join(', ')}
            </Text>
          )}
        </View>
        {varCount > 1 && (
          <View style={styles.varBadge}>
            <Text style={styles.varBadgeText}>{varCount} vars</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export const CocktailCard = React.memo(CocktailCardInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  spiritIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.goldOverlay12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spiritIconText: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  parentName: {
    fontSize: typography.sizes.body,
    color: colors.accentGoldDim,
    marginTop: 1,
    fontStyle: 'italic',
  },
  meta: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  tag: {
    backgroundColor: colors.secondaryOverlay15,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  missingText: {
    fontSize: typography.sizes.sm,
    color: colors.textDim,
    fontStyle: 'italic',
    marginTop: 4,
  },
  varBadge: {
    backgroundColor: colors.goldOverlay10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  varBadgeText: {
    fontSize: typography.sizes.sm,
    color: colors.accentGoldDim,
  },
});
