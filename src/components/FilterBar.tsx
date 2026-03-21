import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';

interface FilterOption {
  key: string;
  label: string;
}

interface Props {
  options: FilterOption[];
  selected: string;
  onSelect: (key: string) => void;
}

export function FilterBar({ options, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {options.map((opt, i) => {
        const isActive = selected === opt.key;
        return (
          <Pressable
            key={opt.key}
            style={[
              styles.pill,
              isActive && styles.pillActive,
              i > 0 ? { marginLeft: 8 } : undefined,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(opt.key);
            }}
          >
            <Text
              style={[
                styles.pillText,
                isActive && styles.pillTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: colors.accentGold,
    borderColor: colors.accentGold,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pillTextActive: {
    color: colors.bgDark,
    fontWeight: '700',
  },
});
