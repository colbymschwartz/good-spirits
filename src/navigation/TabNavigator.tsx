import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../theme';
import { CocktailsStack } from './stacks/CocktailsStack';
import { MyBarStack } from './stacks/MyBarStack';
import { TechniquesStack } from './stacks/TechniquesStack';
import { HistoryStack } from './stacks/HistoryStack';
import { FavoritesStack } from './stacks/FavoritesStack';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  CocktailsTab: '\uD83C\uDF78',
  MyBarTab: '\uD83E\uDD43',
  TechniquesTab: '\uD83E\uDDCA',
  HistoryTab: '\uD83D\uDCDC',
  FavoritesTab: '\u2764\uFE0F',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name="CocktailsTab"
        component={CocktailsStack}
        options={{ tabBarLabel: 'Cocktails' }}
      />
      <Tab.Screen
        name="MyBarTab"
        component={MyBarStack}
        options={{ tabBarLabel: 'My Bar' }}
      />
      <Tab.Screen
        name="TechniquesTab"
        component={TechniquesStack}
        options={{ tabBarLabel: 'Technique' }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{ tabBarLabel: 'Favorites' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgNav,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.tight,
    textTransform: 'uppercase',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabIconActive: {
    // Active state handled by tint color
  },
});
