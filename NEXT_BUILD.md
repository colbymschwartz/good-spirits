# Next Build — Bug Reports & Feature Requests

## 🐛 Bugs
1. **Recipe import not working** — someone tried to load a new recipe and it didn't work. Need to investigate the ImportModal flow — could be a parsing issue or UI bug.
3. **Photo import not working** — can't take photo or access library from the cocktail detail screen. `expo-image-picker` v17.0.10 is installed and code looks correct. Possible causes:
   - Permissions not being granted properly on the device
   - `expo-image-picker` v17 may be incompatible with SDK 54 (expected version is ~17.0.10, matches)
   - Could be a production build issue vs dev mode — image picker may need specific Info.plist entries
   - **Action:** Check if `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` are in the Expo config. Currently NOT in app.json — this is likely the fix. Need to add camera/photo permissions to app.json plugins.

## 💅 UX Improvements
2. **Notes need a save indicator** — notes auto-save but it's not clear to the user. Options:
   - Add a "Saved ✓" toast/badge that appears briefly after typing stops
   - Add an explicit "Save" button
   - Small "Auto-saved" text below the text field

## 🆕 New Features
4. **Voice stock My Bar** — text input + mic button on My Bar screen. User says/types what they have, fuzzy-match against ingredient database, confirm, auto-toggle. Uses iOS built-in keyboard dictation + custom matching logic.

5. **"Stock your bar" hint** — show a hint on Cocktails screen for new users who haven't added any ingredients yet
6. **First launch onboarding tour** — 4 swipeable screens (Welcome, Stock Your Bar, Rate/Batch/Remix, Import/Create). Only shows once, skip button, navy/gold theme, "Let's Go" CTA.

## 📝 Tester Feedback
*(Add items here as feedback comes in)*

---
*Last updated: 2026-03-24*
