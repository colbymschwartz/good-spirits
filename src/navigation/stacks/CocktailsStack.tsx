import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CocktailsScreen } from '../../screens/CocktailsScreen';
import { CocktailDetailScreen } from '../../screens/CocktailDetailScreen';
import { colors } from '../../theme';

export type CocktailsStackParamList = {
  Cocktails: undefined;
  CocktailDetail: { cocktailId: string; variationIndex?: number };
};

const Stack = createNativeStackNavigator<CocktailsStackParamList>();

export function CocktailsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgDark },
      }}
    >
      <Stack.Screen name="Cocktails" component={CocktailsScreen} />
      <Stack.Screen name="CocktailDetail" component={CocktailDetailScreen} />
    </Stack.Navigator>
  );
}
