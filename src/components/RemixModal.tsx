import React, { useState, useEffect } from 'react';
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
import { useAppStore } from '../store/useAppStore';
import { colors, typography, spacing, radius } from '../theme';
import type { Cocktail, Variation } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  cocktail: Cocktail;
  variation: Variation;
}

const GLASS_OPTIONS = ['rocks', 'coupe', 'highball', 'martini', 'nick-and-nora', 'tiki', 'copper-mug', 'flute', 'collins', 'hurricane', 'snifter'];
const METHOD_OPTIONS = ['Stir', 'Shake', 'Build', 'Muddle', 'Blend', 'Swizzle', 'Layer'];

function parseIngredientId(specLine: string): string {
  const cleaned = specLine
    .replace(/^[\d\s\/\.]+/, '')
    .replace(/^(oz|ml|cl|dash(es)?|barspoon|tsp|tbsp|cup|splash|rinse|drop)\s+/i, '')
    .trim();
  return cleaned.toLowerCase().replace(/\s+/g, '-') || specLine.toLowerCase().replace(/\s+/g, '-');
}

export function RemixModal({ visible, onClose, cocktail, variation }: Props) {
  const saveCustomVariation = useAppStore((s) => s.saveCustomVariation);

  const [name, setName] = useState(variation.name + ' (Remix)');
  const [specLines, setSpecLines] = useState(variation.spec.map((s) => s));
  const [glass, setGlass] = useState(variation.glass || 'rocks');
  const [method, setMethod] = useState(variation.method || 'Stir');
  const [garnish, setGarnish] = useState(variation.garnish || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setName(variation.name + ' (Remix)');
    setSpecLines(variation.spec.map((s) => s));
    setGlass(variation.glass || 'rocks');
    setMethod(variation.method || 'Stir');
    setGarnish(variation.garnish || '');
    setNotes('');
  }, [variation, cocktail]);

  const updateSpec = (idx: number, text: string) => {
    const next = [...specLines];
    next[idx] = text;
    setSpecLines(next);
  };
  const removeSpec = (idx: number) => setSpecLines(specLines.filter((_, i) => i !== idx));
  const addSpec = () => setSpecLines([...specLines, '']);

  const handleSave = () => {
    if (!name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const filteredSpec = specLines.filter((s) => s.trim());
    const newVar: Variation = {
      name: name.trim(),
      canon: false,
      isCustom: true,
      spec: filteredSpec,
      ingredients: filteredSpec.map(parseIngredientId),
      glass,
      method,
      garnish,
      steps: variation.steps || '',
      ratioNotes: notes || variation.ratioNotes || '',
      brandRecs: variation.brandRecs || '',
    };

    saveCustomVariation(cocktail.id, newVar);
    onClose();
  };

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
            <Text style={styles.headerTitle}>Remix</Text>
            <Text style={styles.headerSubtitle}>{cocktail.name}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
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
            {/* Variation name */}
            <View style={styles.section}>
              <Text style={styles.label}>VARIATION NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textDim}
              />
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.label}>INGREDIENTS</Text>
              {specLines.map((line, i) => (
                <View key={i} style={styles.specRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={line}
                    onChangeText={(t) => updateSpec(i, t)}
                    placeholder="e.g. 1.5 oz mezcal"
                    placeholderTextColor={colors.textDim}
                  />
                  <Pressable style={styles.removeBtn} onPress={() => removeSpec(i)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable style={styles.addBtn} onPress={addSpec}>
                <Text style={styles.addBtnText}>+ Add Ingredient</Text>
              </Pressable>
            </View>

            {/* Glass + Method */}
            <View style={styles.section}>
              <Text style={styles.label}>GLASS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                {GLASS_OPTIONS.map((g) => (
                  <Pressable
                    key={g}
                    style={[styles.pill, glass === g && styles.pillActive]}
                    onPress={() => { setGlass(g); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.pillText, glass === g && styles.pillTextActive]}>{g}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>METHOD</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                {METHOD_OPTIONS.map((m) => (
                  <Pressable
                    key={m}
                    style={[styles.pill, method === m && styles.pillActive]}
                    onPress={() => { setMethod(m); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.pillText, method === m && styles.pillTextActive]}>{m}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Garnish */}
            <View style={styles.section}>
              <Text style={styles.label}>GARNISH</Text>
              <TextInput
                style={styles.input}
                value={garnish}
                onChangeText={setGarnish}
                placeholderTextColor={colors.textDim}
              />
            </View>

            {/* Ratio Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>YOUR RATIO NOTES</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Why you prefer this ratio..."
                placeholderTextColor={colors.textDim}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Save */}
            <Pressable
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveBtnText}>Save Variation</Text>
            </Pressable>
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
  textArea: {
    minHeight: 80,
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

  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: typography.weights.bold,
  },
  addBtn: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentGoldDim,
    borderRadius: radius.sm,
    borderStyle: 'dashed',
    marginTop: spacing.xs,
  },
  addBtnText: {
    fontSize: typography.sizes.body,
    color: colors.accentGold,
    fontWeight: typography.weights.semibold,
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
});
