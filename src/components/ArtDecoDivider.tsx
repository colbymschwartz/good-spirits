import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface Props {
  style?: any;
}

export function ArtDecoDivider({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text style={styles.diamond}>◆</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.accentGoldDim,
  },
  diamond: {
    fontSize: 8,
    color: colors.accentGoldDim,
    marginHorizontal: 10,
  },
});
