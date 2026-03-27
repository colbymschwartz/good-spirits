import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { colors, typography, spacing, radius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🍸',
    title: 'Welcome to Good Spirits',
    subtitle: '119 classic cocktails at your fingertips',
  },
  {
    emoji: '🥃',
    title: 'Stock Your Bar',
    subtitle:
      "Add your ingredients and we'll show you what you can make. Look for 'Ready to Pour' cocktails!",
  },
  {
    emoji: '⭐',
    title: 'Rate & Remix',
    subtitle:
      'Rate your favorites, scale recipes for batches, and create your own remix variations.',
  },
  {
    emoji: '✨',
    title: 'Import & Create',
    subtitle:
      'Paste recipes from anywhere or build your own from scratch.',
  },
];

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ visible, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Skip button */}
        {!isLastSlide && (
          <Pressable style={styles.skipBtn} onPress={onComplete}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide, i) => (
            <View key={i} style={styles.slide}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom area */}
        <View style={styles.bottomArea}>
          {isLastSlide ? (
            <Pressable style={styles.goBtn} onPress={onComplete}>
              <Text style={styles.goBtnText}>Let's Go</Text>
            </Pressable>
          ) : (
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    zIndex: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: typography.sizes.md,
    color: '#a09880',
    fontWeight: typography.weights.semibold,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl * 2,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.displayFont,
    color: '#c9a96e',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: '#f0e6d3',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomArea: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2a2a4a',
  },
  dotActive: {
    backgroundColor: '#c9a96e',
    width: 24,
  },
  goBtn: {
    backgroundColor: '#c9a96e',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: radius.sm,
  },
  goBtnText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#1a1a2e',
  },
});
