# Good Spirits — React Native + Expo Architecture Spec

## Overview
Port the existing Good Spirits v2 web app (React + Vite) to a native iOS app using React Native + Expo, targeting Apple App Store release.

## Source Codebase (Google Drive)
**Location:** `AI Files/Apps/CocktailApp-v2/goodspirits-project/`

### Existing Assets
- **Data layer:** 2,873 lines — cocktails (77 families, 300+ variations), ingredients, spirits, techniques, history
- **Components:** 2,436 lines across 10 components — CocktailsTab, CocktailDetail, BatchCalculator, RemixModal, CreateCocktailModal, ImportModal, MyBarTab, TechniquesTab, HistoryTab, FavoritesTab
- **Styling:** 513 lines CSS — dark navy/gold theme (`#1a1a2e` bg, `#c9a96e` gold accent)
- **Utils:** localStorage wrapper, share helper
- **Icons/Concepts:** 6 design concepts (deco gold, cream burgundy, bold black gold, emerald botanical, minimal charcoal, navy copper) + app icons (1024px PNG + SVG)

### Existing Features
- Cocktail browsing with spirit/style/tag filters and search
- Detailed cocktail view with multiple variations per family
- My Bar inventory with brand tracking
- Custom cocktail creation + recipe import (text/URL parsing)
- Remix existing cocktails into custom variations
- Batch calculator (scale recipes by servings)
- Favorites, ratings (5-star), "made it" tracking
- Personal notes per cocktail/variation
- Photo capture per cocktail/variation
- Technique library (stirring, shaking, muddling, building, blending, swizzling)
- Cocktail history by era (Golden Age → Prohibition → Tiki → Dark Ages → Craft Revival)
- Share functionality

## Architecture: React Native + Expo

### Stack
- **Framework:** Expo SDK 53+ (managed workflow)
- **Navigation:** React Navigation 7 (bottom tabs + stack navigators)
- **State:** Zustand (lightweight, React-friendly, replaces useState chain)
- **Storage:** expo-secure-store for sensitive data, @react-native-async-storage/async-storage for general persistence
- **Image handling:** expo-image-picker (photos), expo-file-system (local storage)
- **Build/Deploy:** EAS Build + EAS Submit (cloud builds, TestFlight, App Store)
- **OTA Updates:** expo-updates (push fixes without App Store review)

### Project Structure
```
good-spirits/
├── app.json                    # Expo config
├── App.tsx                     # Root with NavigationContainer
├── src/
│   ├── navigation/
│   │   ├── TabNavigator.tsx    # Bottom tab bar (5 tabs)
│   │   └── StackNavigator.tsx  # Per-tab stack navigation
│   ├── screens/
│   │   ├── CocktailsScreen.tsx
│   │   ├── CocktailDetailScreen.tsx
│   │   ├── MyBarScreen.tsx
│   │   ├── TechniquesScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── FavoritesScreen.tsx
│   ├── components/
│   │   ├── CocktailCard.tsx
│   │   ├── VariationCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── BatchCalculator.tsx
│   │   ├── RemixModal.tsx
│   │   ├── CreateCocktailModal.tsx
│   │   ├── ImportModal.tsx
│   │   ├── StarRating.tsx
│   │   └── PhotoCapture.tsx
│   ├── data/
│   │   ├── cocktails.ts        # Direct port — 77 families
│   │   ├── ingredients.ts      # Direct port — ingredient index
│   │   ├── spirits.ts          # Direct port — spirit helpers
│   │   ├── techniques.ts       # Direct port — technique library
│   │   └── history.ts          # Direct port — era content
│   ├── store/
│   │   ├── useAppStore.ts      # Zustand store (favorites, myBar, ratings, etc.)
│   │   └── storage.ts          # AsyncStorage wrapper (replaces localStorage)
│   ├── theme/
│   │   ├── colors.ts           # Dark navy/gold palette
│   │   ├── typography.ts       # Font sizes, weights
│   │   └── spacing.ts          # Consistent spacing scale
│   ├── utils/
│   │   ├── share.ts            # Native share sheet
│   │   ├── search.ts           # Fuzzy search logic
│   │   └── helpers.ts          # Misc utilities
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── assets/
│   ├── icon.png                # App icon (1024x1024)
│   ├── splash.png              # Splash screen
│   └── adaptive-icon.png       # Android adaptive icon
└── eas.json                    # EAS Build config
```

### Key Migration Decisions

| Web (Current) | Native (Target) | Notes |
|---|---|---|
| `<div>`, `<span>` | `<View>`, `<Text>` | Standard RN migration |
| CSS classes | `StyleSheet.create()` | Theme tokens for consistency |
| `localStorage` | `AsyncStorage` | Same API pattern, async |
| `window.navigator.share` | `expo-sharing` | Native share sheet |
| Camera/photo via HTML5 | `expo-image-picker` | Native camera + gallery |
| CSS animations | `react-native-reanimated` | Smooth 60fps animations |
| Bottom nav (CSS) | React Navigation BottomTabNavigator | Native tab bar |
| `onClick` | `onPress` / Pressable | Native touch handling |
| `scrollable div` | `FlatList` / `ScrollView` | Virtualized lists for perf |

### Design System
Port the existing dark theme:
- Background: `#1a1a2e` (dark navy)
- Cards: `#16213e`
- Accent: `#c9a96e` (gold)
- Text primary: `#f0e6d3`
- Text secondary: `#a09880`
- Safe area handling via `react-native-safe-area-context`
- Haptic feedback on interactions (`expo-haptics`)

### Data Flow
```
cocktails.ts (static data) → useAppStore (Zustand)
                                ↕
                            AsyncStorage (persistence)
                                ↕
                            Screens/Components (UI)
```

All user data (favorites, ratings, myBar, customCocktails, notes, photos) persists via AsyncStorage with the same key prefix pattern (`good-spirits-*`).

### Phase Plan

**Phase 1 — Foundation (MVP)**
- [ ] Expo project scaffold with TypeScript
- [ ] Navigation structure (5 tabs + stack)
- [ ] Port all data files (cocktails, ingredients, spirits, techniques, history)
- [ ] Theme system
- [ ] Zustand store + AsyncStorage persistence
- [ ] CocktailsScreen with search/filter
- [ ] CocktailDetailScreen with variations

**Phase 2 — Core Features**
- [ ] MyBarScreen with ingredient tracking + brand management
- [ ] FavoritesScreen with ratings + "made it"
- [ ] TechniquesScreen
- [ ] HistoryScreen with era navigation
- [ ] BatchCalculator modal

**Phase 3 — Advanced Features**
- [ ] Custom cocktail creation
- [ ] Recipe import (text parsing)
- [ ] Remix modal
- [ ] Photo capture + local storage
- [ ] Personal notes
- [ ] Native share sheet

**Phase 4 — Polish & Ship**
- [ ] App icon + splash screen
- [ ] Haptic feedback
- [ ] Smooth animations (reanimated)
- [ ] Performance optimization (FlatList virtualization)
- [ ] TestFlight beta
- [ ] App Store submission

### App Store Requirements
- Apple Developer Account ($99/year) — **Colby signing up**
- Bundle ID: `com.goodspirits.app` (or similar)
- App icon: 1024x1024 (already have)
- Screenshots: 6.7" (iPhone 15 Pro Max), 6.1" (iPhone 15 Pro), 5.5" (iPhone 8 Plus)
- Privacy policy URL (required)
- Age rating: 17+ (alcohol content)

### Why Not...
- **Capacitor/Ionic:** WebView wrapper, Apple rejects thin wrappers, performance issues, provisioning/Cordova plugin hell
- **Flutter:** Requires Dart, complete rewrite, no code reuse from existing React app
- **SwiftUI:** iOS-only, complete rewrite in Swift, no Android path
- **Bare React Native:** All the config pain Expo eliminates (Xcode, Gradle, native modules)
