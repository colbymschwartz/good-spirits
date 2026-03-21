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

const GLASS_OPTIONS = ['rocks', 'coupe', 'highball', 'martini', 'nick-and-nora', 'tiki', 'copper-mug', 'flute', 'collins'];
const METHOD_OPTIONS = ['Stir', 'Shake', 'Build', 'Muddle', 'Blend', 'Swizzle', 'Layer'];

function generateId(): string {
  return 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function parseIngredientId(specLine: string): string {
  // Remove leading measurement: "2 oz bourbon" -> "bourbon"
  const cleaned = specLine
    .replace(/^[\d\s\/\.]+/, '')
    .replace(/^(oz|ml|cl|dash(es)?|barspoon|tsp|tbsp|cup|splash|rinse|drop)\s+/i, '')
    .trim();
  return cleaned.toLowerCase().replace(/\s+/g, '-') || specLine.toLowerCase().replace(/\s+/g, '-');
}

export function CreateCocktailModal({ visible, onClose }: Props) {
  const saveCustomCocktail = useAppStore((s) => s.saveCustomCocktail);

  const [name, setName] = useState('');
  const [spirit, setSpirit] = useState('whiskey');
  const [customSpirit, setCustomSpirit] = useState('');
  const [style, setStyle] = useState('spirit-forward');
  const [specLines, setSpecLines] = useState(['']);
  const [glass, setGlass] = useState('rocks');
  const [method, setMethod] = useState('Stir');
  const [garnish, setGarnish] = useState('');
  const [steps, setSteps] = useState('');
  const [ratioNotes, setRatioNotes] = useState('');

  const resetForm = () => {
    setName('');
    setSpirit('whiskey');
    setCustomSpirit('');
    setStyle('spirit-forward');
    setSpecLines(['']);
    setGlass('rocks');
    setMethod('Stir');
    setGarnish('');
    setSteps('');
    setRatioNotes('');
  };

  const addSpec = () => setSpecLines([...specLines, '']);
  const removeSpec = (idx: number) => setSpecLines(specLines.filter((_, i) => i !== idx));
  const updateSpec = (idx: number, text: string) => {
    const next = [...specLines];
    next[idx] = text;
    setSpecLines(next);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const resolvedSpirit = spirit === 'other' && customSpirit.trim()
      ? customSpirit.trim().toLowerCase()
      : spirit;

    const filteredSpec = specLines.filter((s) => s.trim());

    const cocktail: Cocktail = {
      id: generateId(),
      name: name.trim(),
      style,
      spirit: resolvedSpirit,
      era: 'modern',
      history: '',
      tags: [],
      isCustom: true,
      variations: [{
        name: 'My Recipe',
        canon: true,
        isCustom: true,
        spec: filteredSpec,
        ingredients: filteredSpec.map(parseIngredientId),
        glass,
        method,
        garnish,
        steps,
        ratioNotes,
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Create Cocktail</Text>
            <Text style={styles.headerSubtitle}>Build your own recipe</Text>
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
            {/* Name */}
            <View style={styles.section}>
              <Text style={styles.label}>COCKTAIL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="White Mezcal Negroni"
                placeholderTextColor={colors.textDim}
              />
            </View>

            {/* Spirit + Style */}
            <View style={styles.row}>
              <View style={styles.halfSection}>
                <Text style={styles.label}>BASE SPIRIT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                  {allSpirits.map((s) => (
                    <Pressable
                      key={s}
                      style={[styles.pill, spirit === s && styles.pillActive]}
                      onPress={() => {
                        setSpirit(s);
                        if (s !== 'other') setCustomSpirit('');
                        Haptics.selectionAsync();
                      }}
                    >
                      <Text style={[styles.pillText, spirit === s && styles.pillTextActive]} numberOfLines={1}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                {spirit === 'other' && (
                  <TextInput
                    style={[styles.input, { marginTop: spacing.sm }]}
                    value={customSpirit}
                    onChangeText={setCustomSpirit}
                    placeholder="e.g. Pisco, Absinthe..."
                    placeholderTextColor={colors.textDim}
                  />
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>STYLE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                {Object.entries(STYLE_LABELS).map(([k, v]) => (
                  <Pressable
                    key={k}
                    style={[styles.pill, style === k && styles.pillActive]}
                    onPress={() => { setStyle(k); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.pillText, style === k && styles.pillTextActive]}>{v as string}</Text>
                  </Pressable>
                ))}
              </ScrollView>
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
                  {specLines.length > 1 && (
                    <Pressable style={styles.removeBtn} onPress={() => removeSpec(i)}>
                      <Text style={styles.removeBtnText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable style={styles.addBtn} onPress={addSpec}>
                <Text style={styles.addBtnText}>+ Add Ingredient</Text>
              </Pressable>
            </View>

            {/* Glass + Method */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
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
                placeholder="Orange peel, expressed"
                placeholderTextColor={colors.textDim}
              />
            </View>

            {/* Steps */}
            <View style={styles.section}>
              <Text style={styles.label}>STEPS</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={steps}
                onChangeText={setSteps}
                placeholder="How to build this drink..."
                placeholderTextColor={colors.textDim}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Ratio Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>RATIO NOTES (OPTIONAL)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={ratioNotes}
                onChangeText={setRatioNotes}
                placeholder="Why this ratio works..."
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
              <Text style={styles.saveBtnText}>Create Cocktail</Text>
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
  halfSection: {
    flex: 1,
  },
  row: {
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

  pillRow: {
    gap: spacing.sm,
  },
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
