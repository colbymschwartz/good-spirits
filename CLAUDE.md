# CLAUDE.md — Good Spirits Agent Instructions

## Project Overview
**Good Spirits** is a cocktail reference app with 77 cocktail families, 347 variations, and intelligent "My Bar" filtering. Users can stock their bar, discover recipes they can make, learn techniques, calculate batch recipes, and track favorites/history.

**Stack:** React Native + Expo SDK 54, TypeScript  
**Theme:** Dark (#0A0A0A background), gold accents (#D4A855), Josefin Sans font  
**Navigation:** React Navigation (bottom tabs + native stack)  
**State:** Zustand (persistent via AsyncStorage)  
**Data:** Static JSON/TS cocktail database in `src/data/`

## Architecture

```
src/
├── components/     # Reusable UI components
├── data/          # Cocktail database (static JSON/TS)
├── screens/       # Screen components (Home, CocktailDetail, MyBar, Batch, Profile)
├── store/         # Zustand stores (AsyncStorage persistence)
├── theme/         # Colors, spacing, typography constants
├── navigation/    # Navigator configs (tabs + stack)
├── utils/         # Helper functions
└── types/         # TypeScript types
```

### Key Files
- **app.json** — version, build number, Expo config, plugins
- **eas.json** — build profiles (preview = TestFlight internal, production = App Store)
- **NEXT_BUILD.md** — current sprint, what's ready to ship, build status
- **IDEAS.md** — feature backlog
- **package.json** — dependencies, scripts

## Development Rules

### 1. TypeScript Strict
- No `any` types. Use proper types or `unknown` + type guards.
- All data structures in `src/types/` should be properly typed.

### 2. Theme Consistency
- **Dark theme only.** Background: `#0A0A0A`, Gold: `#D4A855`
- Use `theme/colors.ts` constants, never hardcode colors.
- Font: Josefin Sans (loaded via expo-font).

### 3. Testing Protocol
**ALWAYS test on web before reporting done:**
```bash
npx expo start --web --port 8090
```
Open `localhost:8090` in browser, manually verify:
- Feature works as intended
- No console errors
- UI renders correctly (dark theme, gold accents)
- Navigation flows work
- State persists across refresh (if applicable)

**Report format:**
- What was built
- What was tested
- What works
- What doesn't (if anything)

### 4. Shipping Rules (CRITICAL)
- **NEVER run `eas build` or `eas submit` yourself.** Only Colby or the main agent can ship.
- **NEVER modify `app.json` version/buildNumber** unless explicitly told to.
- After coding, report completion to Colby via Discord. He decides when to ship.

### 5. Build Strategy: EAS Cloud Only (No Local Xcode)
- **We use EAS cloud builds exclusively.** Do not attempt local Xcode builds.
- **Why:** macOS 26.2 ships Ruby 4.0.2; CocoaPods 1.16.2 has a Unicode encoding bug incompatible with Ruby 4.0. `pod install` crashes. This is upstream — no fix available yet.
- **Free tier:** 30 builds/month. Plenty if we're disciplined.
- **Queue management:** Build after 6 PM PT or on weekends for fast queues (sub-5 min). Avoid weekday afternoons (1.5+ hour waits).
- **Build discipline:** Test EVERYTHING on web preview first (`npx expo start --web --port 8090`). Only trigger an EAS build after QA passes on web and Colby approves. Target: 4-6 builds/month.
- **If we outgrow 30 builds:** $99/month Production plan (200 builds, priority queue). Decision is Colby's.

### 6. Commit Hygiene
- **Fix commits:** `Fix: description` (e.g., `Fix: stock button tap handling`)
- **Feature commits:** `Add: description` (e.g., `Add: batch calculator screen`)
- **Version commits:** `vX.Y.Z — summary` (e.g., `v1.6.0 — 5 QA bug fixes`)
- Push to `main` branch (no feature branches at this stage).

### 7. Data Integrity
- Cocktail data lives in `src/data/`. Any changes must maintain the schema:
  - `name` (string)
  - `spirit` (string, e.g., "gin", "whiskey")
  - `ingredients` (array of `{ name, amount, unit }`)
  - `instructions` (string)
  - `glass` (string)
  - `garnish` (string, optional)
  - `variations` (array, optional)

## Common Tasks

### Add a new cocktail
1. Open `src/data/cocktails.ts`
2. Add entry to the appropriate spirit array
3. Follow existing format (name, spirit, ingredients, instructions, glass)
4. Test on web (search for it, verify it renders, "What Can I Make?" logic works)

### Fix a UI bug
1. Locate the screen/component in `src/screens/` or `src/components/`
2. Make the fix
3. Test on web (reproduce the bug scenario, verify fix)
4. Commit: `Fix: description of what was fixed`

### Add a feature
1. Plan: identify affected files (screens, components, store, data)
2. Implement
3. Test on web (full user flow)
4. Commit: `Add: feature name`

### Update dependencies
```bash
npx expo install <package>@<version>
```
Expo CLI handles React Native compatibility automatically.

## Known Issues & Gotchas

1. **React Native Reanimated v4.x is incompatible with Expo SDK 54** — use RN's built-in `Animated` API instead.
2. **Keyboard dismiss on Android** — requires `keyboardDismissMode="on-drag"` + `returnKeyType="done"` on TextInput.
3. **Stock button on web** — use `TouchableOpacity` with `hitSlop` for better tap targeting (Enter key works, tap may be finicky).
4. **Image imports** — use `require()` for local assets, handle `null` photoUri gracefully in components.
5. **AsyncStorage persistence** — Zustand `persist` middleware auto-saves state. Test by refreshing web app (state should restore).

## Build Profiles (eas.json)

- **preview** — TestFlight internal distribution (21 testers in "Friends" group). Auto-increments build number.
- **production** — App Store submission. Requires Apple review.

**DO NOT run these commands yourself:**
```bash
# Only Colby or main agent runs these
eas build --platform ios --profile preview
eas submit --platform ios --profile production
```

## Support & Debugging

- **EAS Dashboard:** https://expo.dev/accounts/duffers/projects/good-spirits/builds
- **TestFlight:** App Store Connect → My Apps → Good Spirits → TestFlight
- **Logs:** `npx expo start --web` shows console output in terminal + browser DevTools

## Questions?
Ask Colby via Discord. Don't guess — clarity beats speed.
