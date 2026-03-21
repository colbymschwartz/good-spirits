import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArtDecoDivider } from './ArtDecoDivider';
import { BASE_SPIRITS, STYLE_LABELS } from '../data/spirits';
import { useAppStore } from '../store/useAppStore';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface ParsedRecipe {
  name: string;
  spec: string[];
  steps: string;
  spirit: string;
  style: string;
  glass: string;
  method: string;
  garnish: string;
}

function generateId(): string {
  return 'import-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function parseIngredientId(specLine: string): string {
  const cleaned = specLine
    .replace(/^[\d\s\/\.]+/, '')
    .replace(/^(oz|ml|cl|dash(es)?|barspoon|tsp|tbsp|cup|splash|rinse|drop)\s+/i, '')
    .trim();
  return cleaned.toLowerCase().replace(/\s+/g, '-') || specLine.toLowerCase().replace(/\s+/g, '-');
}

function parseRecipeText(rawText: string): ParsedRecipe | null {
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l);
  if (lines.length === 0) return null;

  let name = lines[0].replace(/^#+\s*/, '').replace(/recipe$/i, '').trim();
  const ingredients: string[] = [];
  const steps: string[] = [];
  let inSteps = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^(step|direction|instruction|method|preparation)/i.test(line)) {
      inSteps = true;
      continue;
    }
    if (/^(ingredient|what you|you.ll need)/i.test(line)) {
      inSteps = false;
      continue;
    }
    if (inSteps || /^\d+[\.\)]\s/.test(line)) {
      steps.push(line.replace(/^\d+[\.\)]\s*/, ''));
      inSteps = true;
    } else if (/^\d|^[\u00BC-\u00BE\u215B-\u215E]|^[-\u2022\*]\s*\d/.test(line)) {
      ingredients.push(line.replace(/^[-\u2022\*]\s*/, ''));
    } else if (line.includes('oz') || line.includes('tbsp') || line.includes('tsp') || line.includes('cup') || line.includes('dash')) {
      ingredients.push(line.replace(/^[-\u2022\*]\s*/, ''));
    } else if (line.length > 20) {
      steps.push(line);
    }
  }

  return {
    name,
    spec: ingredients,
    steps: steps.join(' '),
    spirit: 'other',
    style: 'spirit-forward',
    glass: 'rocks',
    method: 'Stir',
    garnish: '',
  };
}

export function ImportModal({ visible, onClose }: Props) {
  const saveCustomCocktail = useAppStore((s) => s.saveCustomCocktail);

  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedRecipe | null>(null);
  const [customSpirit, setCustomSpirit] = useState('');

  const resetForm = () => {
    setRawText('');
    setParsed(null);
    setCustomSpirit('');
  };

  const handleParse = () => {
    const result = parseRecipeText(rawText);
    if (result) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setParsed(result);
    }
  };

  const handleSave = () => {
    if (!parsed || !parsed.name) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const finalSpirit = parsed.spirit === 'other' && customSpirit.trim()
      ? customSpirit.trim().toLowerCase()
      : parsed.spirit;

    const cocktail: Cocktail = {
      id: generateId(),
      name: parsed.name,
      style: parsed.style,
      spirit: finalSpirit,
      era: 'modern',
      history: '',
      tags: [],
      isCustom: true,
      variations: [{
        name: 'Imported Recipe',
        canon: true,
        isCustom: true,
        spec: parsed.spec,
        ingredients: parsed.spec.map(parseIngredientId),
        glass: parsed.glass,
        method: parsed.method,
        garnish: parsed.garnish,
        steps: parsed.steps,
        ratioNotes: '',
        brandRecs: '',
      }],
    };

    saveCustomCocktail(cocktail);
    resetForm();
    onClose();
  };

  const allSpirits = [...BASE_SPIRITS, 'other'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Import Recipe</Text>
            <Text style={styles.headerSubtitle}>Paste and parse</Text>
          </View>
          <Pressable onPress={() => { resetForm(); onClose(); }} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>

        <ArtDecoDivider />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            {!parsed ? (
              <>
                <Text style={styles.hint}>
                  Paste a recipe from a website, menu, or book. The parser will extract the name, ingredients, and steps.
                </Text>
                <TextInput
                  style={[styles.input, styles.importArea]}
                  value={rawText}
                  onChangeText={setRawText}
                  placeholder={`Old Fashioned\n2 oz bourbon\n1 sugar cube\n2-3 dashes Angostura bitters\n\nSteps:\n1. Place sugar cube in glass\n2. Add bitters and muddle\n3. Add bourbon and ice\n4. Stir and garnish with orange peel`}
                  placeholderTextColor={colors.textDim}
                  multiline
                  textAlignVertical="top"
                />
                <Pressable
                  style={[styles.saveBtn, !rawText.trim() && styles.saveBtnDisabled]}
                  onPress={handleParse}
                  disabled={!rawText.trim()}
                >
                  <Text style={styles.saveBtnText}>Parse Recipe</Text>
                </Pressable>
              </>
            ) : (
              <>
                {/* Name */}
                <View style={styles.section}>
                  <Text style={styles.label}>NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={parsed.name}
                    onChangeText={(t) => setParsed({ ...parsed, name: t })}
                    placeholderTextColor={colors.textDim}
                  />
                </View>

                {/* Ingredients preview */}
                <View style={styles.section}>
                  <Text style={styles.label}>INGREDIENTS ({parsed.spec.length} found)</Text>
                  {parsed.spec.map((s, i) => (
                    <View key={i} style={styles.specItem}>
                      <View style={styles.specDot} />
                      <Text style={styles.specText}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* Steps preview */}
                {parsed.steps ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>STEPS</Text>
                    <Text style={styles.previewText}>{parsed.steps}</Text>
                  </View>
                ) : null}

                {/* Spirit + Style pickers */}
                <View style={styles.section}>
                  <Text style={styles.label}>SPIRIT</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                    {allSpirits.map((s) => (
                      <Pressable
                        key={s}
                        style={[styles.pill, parsed.spirit === s && styles.pillActive]}
                        onPress={() => {
                          setParsed({ ...parsed, spirit: s });
                          if (s !== 'other') setCustomSpirit('');
                          Haptics.selectionAsync();
                        }}
                      >
                        <Text style={[styles.pillText, parsed.spirit === s && styles.pillTextActive]}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  {parsed.spirit === 'other' && (
                    <TextInput
                      style={[styles.input, { marginTop: spacing.sm }]}
                      value={customSpirit}
                      onChangeText={setCustomSpirit}
                      placeholder="e.g. Pisco, Absinthe..."
                      placeholderTextColor={colors.textDim}
                    />
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>STYLE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                    {Object.entries(STYLE_LABELS).map(([k, v]) => (
                      <Pressable
                        key={k}
                        style={[styles.pill, parsed.style === k && styles.pillActive]}
                        onPress={() => { setParsed({ ...parsed, style: k }); Haptics.selectionAsync(); }}
                      >
                        <Text style={[styles.pillText, parsed.style === k && styles.pillTextActive]}>{v as string}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <Pressable style={[styles.saveBtn, { flex: 1 }]} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Import Cocktail</Text>
                  </Pressable>
                  <Pressable style={styles.backBtn} onPress={() => setParsed(null)}>
                    <Text style={styles.backBtnText}>Back</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  headerLeft: { flex: 1 },
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
    paddingBottom: spacing.huge + 40,
  },
  hint: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },

  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.accentGoldLight,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  importArea: {
    minHeight: 200,
    paddingTop: 10,
  },

  pillRow: { gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  pillActive: {
    borderColor: colors.accentGold,
    backgroundColor: colors.goldOverlay15,
  },
  pillText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.textDim,
  },
  pillTextActive: {
    color: colors.accentGoldLight,
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
  previewText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  saveBtn: {
    backgroundColor: colors.accentGold,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.bgDark,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  backBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
});
