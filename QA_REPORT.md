# Good Spirits App - QA Report

**Date:** 2026-03-20
**Scope:** Full source review of `src/` directory
**Status:** 17 issues found (2 Critical, 5 High, 7 Medium, 3 Low)

---

## CRITICAL

### 1. RemixModal has stale state on re-open
- **File:** `src/components/RemixModal.tsx`
- **Lines:** 41-46
- **Description:** `useState` is initialized from props (`variation.name + ' (Remix)'`, `variation.spec`, `variation.glass`, etc.) but React only uses these initial values on first mount. When the modal is closed and reopened with a **different** variation (e.g., switching from "Classic" to "Rye" tab then tapping Remix), the form will still show the previous variation's data because the Modal component stays mounted and `useState` initial values are ignored on subsequent renders.
- **Impact:** User sees wrong recipe data in the Remix form. Saving would create a variation with stale/incorrect ingredients.
- **Suggested fix:** Add a `useEffect` that resets all form state when `variation` or `cocktail` props change, or key the modal so it remounts: `<RemixModal key={variation.name} ... />`.

### 2. BatchCalculator has stale initialVariationIndex
- **File:** `src/components/BatchCalculator.tsx`
- **Line:** 53
- **Description:** `useState(initialVariationIndex)` captures the initial value only. If the user changes the active variation tab on CocktailDetailScreen and then opens BatchCalculator, the calculator may show the wrong variation because the internal `variationIndex` state wasn't updated to match the new `initialVariationIndex` prop.
- **Impact:** Batch calculations shown for wrong variation.
- **Suggested fix:** Add `useEffect(() => setVariationIndex(initialVariationIndex), [initialVariationIndex])` to sync when the prop changes.

---

## HIGH

### 3. FavoritesScreen does not include custom cocktails
- **File:** `src/screens/FavoritesScreen.tsx`
- **Lines:** 54-58
- **Description:** `favCocktails` is built by searching only `COCKTAIL_DATABASE`. If a user creates a custom cocktail (via CreateCocktailModal) and favorites it, it won't appear in the Favorites list because custom cocktails live in `useAppStore.customCocktails`, not in `COCKTAIL_DATABASE`.
- **Impact:** Favorited custom cocktails silently disappear from Favorites view.
- **Suggested fix:** Merge `customCocktails` into the search:
  ```ts
  const allCocktails = [...COCKTAIL_DATABASE, ...customCocktails];
  return favorites.map(id => allCocktails.find(c => c.id === id)).filter(Boolean);
  ```

### 4. History data references non-existent cocktail IDs
- **File:** `src/data/history.ts`
- **Lines:** 40, 60-62
- **Description:** The "Dark Ages" era references `keyDrinks: ["cosmopolitan", "long-island-iced-tea", "fuzzy-navel", "sex-on-the-beach"]`. The IDs `"fuzzy-navel"` and `"sex-on-the-beach"` do not exist in `COCKTAIL_DATABASE`. The "Modern Era" references `["low-abv-aperitifs", "mezcal-cocktails", "modern-classics"]` — none of these IDs exist in the database.
- **Impact:** HistoryScreen gracefully degrades (shows raw ID text instead of a tappable cocktail link), but it looks broken and unprofessional. The non-existent IDs render as plain text like `"fuzzy-navel"` with no emoji or navigation.
- **Suggested fix:** Either add these cocktails to the database, or replace the IDs with ones that exist (e.g., for Dark Ages use `"cosmopolitan"` and `"long-island-iced-tea"` only; for Modern Era use `"aperol-spritz"`, `"naked-famous"`, `"penicillin"`).

### 5. Duplicate ingredient ID "orgeat" in ingredient index
- **File:** `src/data/ingredients.ts`
- **Lines:** 331 (Liqueurs category) and 432 (Sweeteners category)
- **Description:** The ingredient `"orgeat"` appears in both the "Liqueurs" and "Sweeteners" categories with the same `id: "orgeat"`. When the MyBar SectionList renders both, toggling one will visually toggle the other since they share the same ID in the `myBar` array. This also means the `myBar` Set will match either entry for "What Can I Make?" calculations.
- **Impact:** Confusing UX — checking orgeat in one category appears to check it in another. Potential double-counting in ingredient tallies.
- **Suggested fix:** Rename one to a distinct ID, e.g., `"orgeat-syrup"` in the Sweeteners category.

### 6. MyBarScreen "What Can I Make?" doesn't check custom cocktails
- **File:** `src/screens/MyBarScreen.tsx`
- **Lines:** 38-51
- **Description:** The `makeable` computation only iterates `COCKTAIL_DATABASE`, not custom cocktails from the store. Custom cocktails with matching ingredients won't appear in the "What Can I Make?" section.
- **Impact:** Users who create custom cocktails with simple ingredients won't see them suggested.
- **Suggested fix:** Include `customCocktails` in the iteration: `[...COCKTAIL_DATABASE, ...customCocktails]`.

### 7. FavoritesScreen cross-tab navigation doesn't pass variationIndex
- **File:** `src/screens/FavoritesScreen.tsx`
- **Lines:** 87-90
- **Description:** Navigation to CocktailDetail from Favorites doesn't pass `variationIndex` in params. The detail screen defaults to `variationIndex = 0`, which is correct behavior, but this means users always see the first variation regardless of what they may have been viewing before.
- **Impact:** Minor — functional but could confuse users who favorited a cocktail while viewing a specific variation.
- **Suggested fix:** This is acceptable behavior since favorites are per-cocktail not per-variation. Consider documenting this as intentional.

---

## MEDIUM

### 8. CocktailCard animation memory leak potential
- **File:** `src/components/CocktailCard.tsx`
- **Lines:** 25-31
- **Description:** The `useEffect` starts an `Animated.timing` animation on mount but does not return a cleanup function. If the component unmounts before the 350ms animation completes (e.g., rapid scrolling in the FlatList), the animation's callback may fire on an unmounted component.
- **Impact:** React warning "Can't perform state update on unmounted component" in development. Not a crash but creates console noise and indicates improper cleanup.
- **Suggested fix:** Return cleanup: `useEffect(() => { const anim = Animated.timing(opacity, {...}); anim.start(); return () => anim.stop(); }, []);`

### 9. CocktailDetailScreen "Made It" button uses getState() inline
- **File:** `src/screens/CocktailDetailScreen.tsx`
- **Line:** 210
- **Description:** The "Made It" button calls `useAppStore.getState().toggleMadeIt(cocktail.id)` directly inside the `onPress` handler JSX. While functional, this bypasses React's subscription model — the button won't re-render to show "made it" state changes (unlike the Favorite button which properly subscribes via `useAppStore((s) => s.toggleFavorite)`). Additionally, there's no visual indication of the current "made it" state on this button (it always shows the same icon/text regardless).
- **Impact:** The "Made It" button always looks the same whether toggled on or off. No feedback to the user.
- **Suggested fix:** Subscribe to `madeIt` state and conditionally style the button, similar to how the favorite button works.

### 10. CocktailsScreen keyExtractor may produce duplicate keys
- **File:** `src/screens/CocktailsScreen.tsx`
- **Line:** 163
- **Description:** `keyExtractor` returns `item.cocktail.id`. If the filtered results contain the same cocktail mapped to different variation indices (which the current filter logic doesn't produce, but could if extended), this would cause duplicate key warnings.
- **Impact:** Not currently triggered but fragile. Low risk today.
- **Suggested fix:** Include variation index: `item.cocktail.id + '-' + item.varIdx`.

### 11. PlaceholderScreen is unused
- **File:** `src/screens/PlaceholderScreen.tsx`
- **Description:** This screen is defined but never imported or used in any navigation stack. It was likely used during early development and is now dead code.
- **Impact:** No runtime impact; increases bundle size slightly.
- **Suggested fix:** Remove the file or keep it for Phase 2 development.

### 12. ArtDecoDivider `style` prop typed as `any`
- **File:** `src/components/ArtDecoDivider.tsx`
- **Line:** 6
- **Description:** The `style` prop is typed as `any`, losing type safety. Multiple callers pass `style={{ marginVertical: spacing.md }}` which works but isn't type-checked.
- **Impact:** No runtime issue; reduces TypeScript's ability to catch style errors.
- **Suggested fix:** Type as `StyleProp<ViewStyle>` from `react-native`.

### 13. FilterBar hard-codes color values
- **File:** `src/components/FilterBar.tsx`
- **Line:** 82
- **Description:** `pillTextActive` uses hard-coded `color: '#1a1a2e'` instead of `colors.bgDark`. While the value is the same today, it creates a maintenance risk if the dark background color changes.
- **Impact:** Visual inconsistency risk on future theme changes.
- **Suggested fix:** Replace with `colors.bgDark`.

### 14. SearchBar icon overlaps input text on small screens
- **File:** `src/components/SearchBar.tsx`
- **Lines:** 38-42, 51
- **Description:** The search icon is positioned with `position: 'absolute', left: 14` and the input has `paddingLeft: 40`. On very narrow screens or with large font accessibility settings, the emoji search icon (which can vary in width across platforms) may overlap with the input text.
- **Impact:** Minor visual overlap on edge-case screen sizes or accessibility settings.
- **Suggested fix:** Increase `paddingLeft` to 44 or use a flex-based layout instead of absolute positioning.

---

## LOW

### 15. Cocktail data tags include values not in MOOD_LABELS
- **File:** `src/data/cocktails.ts` vs `src/data/spirits.ts`
- **Description:** Some cocktail tags (e.g., `"spirit-forward"`, `"aperitif"`, `"light"`, `"summery"`, `"elegant"`) don't have corresponding entries in `MOOD_LABELS`. The mood filter won't surface these cocktails when filtering by those tags. Tags are used for filtering AND display (shown as chips on cards and detail screens), but the filter only offers tags defined in `MOOD_LABELS`.
- **Impact:** Some cocktails may not be discoverable via mood filters for tags that don't have a label. The tags still display correctly as text on the detail view.
- **Suggested fix:** Either add missing mood labels or ensure cocktails only use tags that exist in `MOOD_LABELS`.

### 16. Tab bar height may be too short on Android
- **File:** `src/navigation/TabNavigator.tsx`
- **Lines:** 77-79
- **Description:** `tabBarStyle` sets `height: 72, paddingBottom: 8`. On Android devices without a gesture navigation bar (older 3-button nav), this provides adequate space. But on newer Android devices with gesture navigation, the bottom safe area inset is not accounted for, which could cause the tab labels to be partially obscured.
- **Impact:** Potential visual clipping on some Android devices.
- **Suggested fix:** Use `safeAreaInsets` to dynamically adjust tab bar bottom padding, or rely on React Navigation's built-in safe area handling.

### 17. `dark-stormy` vs `dark-n-stormy` ID mismatch in emoji map
- **File:** `src/utils/cocktailEmoji.ts` line 30 vs `src/data/cocktails.ts` line 1554
- **Description:** The cocktail emoji map has `'dark-n-stormy': '⛈️'` but the actual cocktail ID in the database is `'dark-stormy'`. The specific emoji won't match; it will fall through to the glass/style/spirit-based fallback.
- **Impact:** The Dark & Stormy cocktail won't show its intended storm emoji (⛈️), instead showing a generic fallback emoji.
- **Suggested fix:** Change the emoji map key from `'dark-n-stormy'` to `'dark-stormy'`.

---

## Summary

| Severity | Count | Key Themes |
|----------|-------|------------|
| CRITICAL | 2 | Stale modal state (RemixModal, BatchCalculator) |
| HIGH | 5 | Missing custom cocktail integration, broken history links, duplicate IDs |
| MEDIUM | 7 | Animation cleanup, UI state feedback, dead code, type safety |
| LOW | 3 | Data mismatches, platform-specific display issues |

### Top Priorities
1. Fix RemixModal and BatchCalculator stale state (#1, #2) — these cause incorrect data to be displayed/saved
2. Include custom cocktails in FavoritesScreen and MyBarScreen (#3, #6) — core feature gap
3. Fix history data references (#4) — visible broken UI
4. Fix duplicate orgeat ID (#5) — confusing ingredient management
5. Add "Made It" visual state feedback (#9) — poor UX on a prominent button
