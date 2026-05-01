# OCR UX Issues - Found 2026-04-01

## v1.7.0 Build 24 Testing Results

**✅ OCR Core Functionality Working:**
- Google Cloud Vision API properly configured
- Clean text extraction 
- Parser removes clutter (bullet emojis, formatting issues)
- Recipe name cleanup working

## v1.7.1 — All five issues fixed (2026-04-30)

### 1. Keyboard Won't Dismiss 🔥 HIGH PRIORITY ✅ FIXED
- **Original issue:** Once keyboard appears for text editing, user can't dismiss it. Can't scroll to Save button — workflow blocked.
- **Fix:** Added `TouchableWithoutFeedback` wrapper + `Keyboard.dismiss` + `keyboardDismissMode="on-drag"` on ScrollView. Added iOS `InputAccessoryView` with a "Done" button on multi-line text inputs.
- **Files:** `src/components/ImportModal.tsx`, `src/components/CreateCocktailModal.tsx`

### 2. Photo Imports as Drink Image 📸 MEDIUM ✅ FIXED
- **Original issue:** OCR source photo became the cocktail's main image. Messy drink cards with recipe screenshots instead of proper photos.
- **Fix:** Removed the `savePhoto` call in ImportModal's `handleSave`. The OCR source photo is no longer saved as the cocktail's drink photo. Users can take a real drink photo from the cocktail detail screen.
- **Files:** `src/components/ImportModal.tsx`

### 3. Can't Edit Imported Recipes ✏️ MEDIUM ✅ FIXED
- **Original issue:** After import, recipe fields couldn't be edited. Couldn't fix OCR mistakes.
- **Fix:** Added `updateCustomCocktail` action to Zustand store. Refactored `CreateCocktailModal` to accept an optional `cocktail` prop — when passed, modal opens in edit mode with all fields pre-populated. Added an Edit button on `CocktailDetailScreen` for any cocktail with `isCustom: true`.
- **Files:** `src/store/useAppStore.ts`, `src/components/CreateCocktailModal.tsx`, `src/screens/CocktailDetailScreen.tsx`

### 4. No Delete Functionality 🗑️ MEDIUM ✅ FIXED
- **Original issue:** No way to delete bad imports. Bad imports accumulated.
- **Fix:** Added a Delete button on `CocktailDetailScreen` for any cocktail with `isCustom: true`. Confirms via `Alert.alert` with destructive style; on confirm, calls `deleteCustomCocktail` and navigates back.
- **Files:** `src/screens/CocktailDetailScreen.tsx`

### 5. Emoji Changes on Text Share 🍸 MEDIUM ✅ FIXED
- **Original issue:** When sharing, drink emoji changed (e.g., martini glass 🍸 became lowball glass 🥃).
- **Root cause found:** ImportModal hardcoded `glass: 'rocks'` for every imported recipe with no way to override. The share card's `getCocktailEmoji()` falls back to the cocktail's stored glass — which was always `rocks` (lowball 🥃) for imports, regardless of the actual drink.
- **Fix:** Added regex-based glass detection from the pasted recipe text (matches "martini glass", "coupe", "highball", etc.) plus a fallback that detects "martini" in the cocktail name. Added Glass / Method / Garnish pickers to the parsed-review screen so users can override anything the parser misses. Also auto-detects method and garnish.
- **Files:** `src/components/ImportModal.tsx`