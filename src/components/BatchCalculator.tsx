import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArtDecoDivider } from './ArtDecoDivider';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail, Variation } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  cocktail: Cocktail;
  initialVariationIndex?: number;
}

function scaleSpec(spec: string[], servings: number): string[] {
  return spec.map((line) => {
    // Match leading number (int or decimal or fraction) and scale it
    return line.replace(
      /^(\d+(?:\.\d+)?(?:\/\d+)?)/,
      (match) => {
        let value: number;
        if (match.includes('/')) {
          const [num, den] = match.split('/');
          value = parseInt(num, 10) / parseInt(den, 10);
        } else {
          value = parseFloat(match);
        }
        const scaled = value * servings;
        // Format nicely
        if (scaled === Math.floor(scaled)) {
          return String(scaled);
        }
        return scaled.toFixed(1).replace(/\.0$/, '');
      }
    );
  });
}

export function BatchCalculator({
  visible,
  onClose,
  cocktail,
  initialVariationIndex = 0,
}: Props) {
  const [variationIndex, setVariationIndex] = useState(initialVariationIndex);
  const [servings, setServings] = useState(2);

  useEffect(() => {
    setVariationIndex(initialVariationIndex);
  }, [initialVariationIndex]);

  const variation = cocktail.variations[variationIndex] || cocktail.variations[0];

  const scaledSpec = useMemo(
    () => scaleSpec(variation.spec, servings),
    [variation.spec, servings]
  );

  const adjustServings = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setServings((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Batch Calculator</Text>
            <Text style={styles.headerSubtitle}>{cocktail.name}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>

        <ArtDecoDivider />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
        >
          {/* Variation picker */}
          {cocktail.variations.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>VARIATION</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.varRow}
              >
                {cocktail.variations.map((v, i) => (
                  <Pressable
                    key={v.name}
                    style={[
                      styles.varPill,
                      variationIndex === i && styles.varPillActive,
                    ]}
                    onPress={() => setVariationIndex(i)}
                  >
                    <Text
                      style={[
                        styles.varPillText,
                        variationIndex === i && styles.varPillTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {v.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Servings control */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SERVINGS</Text>
            <View style={styles.servingsRow}>
              <Pressable
                style={[styles.servingsBtn, servings <= 1 && styles.servingsBtnDisabled]}
                onPress={() => adjustServings(-1)}
                disabled={servings <= 1}
              >
                <Text style={styles.servingsBtnText}>−</Text>
              </Pressable>
              <View style={styles.servingsDisplay}>
                <Text style={styles.servingsNumber}>{servings}</Text>
                <Text style={styles.servingsLabel}>
                  serving{servings !== 1 ? 's' : ''}
                </Text>
              </View>
              <Pressable
                style={[styles.servingsBtn, servings >= 20 && styles.servingsBtnDisabled]}
                onPress={() => adjustServings(1)}
                disabled={servings >= 20}
              >
                <Text style={styles.servingsBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <ArtDecoDivider style={{ marginVertical: spacing.md }} />

          {/* Scaled ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>INGREDIENTS</Text>
            {scaledSpec.map((line, i) => (
              <View key={i} style={styles.specItem}>
                <View style={styles.specDot} />
                <Text style={styles.specText}>{line}</Text>
              </View>
            ))}
          </View>

          {/* Glass & Method */}
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>GLASS</Text>
              <Text style={styles.infoText}>{variation.glass}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>METHOD</Text>
              <Text style={styles.infoText}>{variation.method}</Text>
            </View>
          </View>

          {variation.garnish ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>GARNISH</Text>
              <Text style={styles.detailText}>{variation.garnish}</Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.displayFont,
    color: colors.accentGold,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
  },
  closeText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.accentGold,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
  },

  // Variation pills
  varRow: {
    gap: spacing.sm,
  },
  varPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  varPillActive: {
    borderColor: colors.accentGold,
    backgroundColor: colors.goldOverlay15,
  },
  varPillText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.textDim,
  },
  varPillTextActive: {
    color: colors.accentGoldLight,
  },

  // Servings
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  servingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsBtnDisabled: {
    borderColor: colors.textDim,
    opacity: 0.4,
  },
  servingsBtnText: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.accentGold,
  },
  servingsDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  servingsNumber: {
    fontSize: 36,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  servingsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Spec
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

  // Info
  infoRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
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
});
