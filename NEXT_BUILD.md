# Next Build: v1.7.1 (Ready to Ship)

## Status
**READY** — all OCR-UX-ISSUES resolved + 18 craft mocktails added. Tested on web, awaiting EAS build approval from Colby.

## What's in v1.7.1
- **18 craft mocktails** sourced from named bartenders via Punch — Faux|groni, Maydan's Southside, Moneyball (Death & Co), Queen Garden Swizzle, plus 14 more
- **New `non-alcoholic` spirit category** with 🌿 emoji + filter pill
- **All five OCR-UX issues fixed** (see `OCR-UX-ISSUES.md` for details):
  1. Keyboard now dismisses via tap-outside or Done button
  2. OCR source photo no longer saved as drink image
  3. Imported recipes can now be edited via Edit button on detail screen
  4. Custom cocktails can now be deleted via Delete button + confirmation
  5. Glass emoji bug fixed at the root — import auto-detects glass type and provides full Glass/Method/Garnish pickers

## Pre-ship checklist
- [x] TypeScript compiles cleanly (`npx tsc --noEmit`)
- [x] All tests pass (`npm test` — 8/8)
- [x] Visual verification on web — mocktails render, glass emoji correct, edit/delete buttons appear for custom cocktails
- [ ] Bump version in `app.json` to 1.7.1 (Colby's call)
- [ ] EAS build (Colby's call)

## Previous Build: v1.7.0 build 24
**SHIPPED** — TestFlight (date per Expo dashboard)
- OCR via Google Cloud Vision shipped
- Parser fixes, text import improvements
- 5 UX issues found in testing — all addressed in v1.7.1

## Ideas for v1.7.2+
See `IDEAS.md` for full backlog. Top candidates:
- Advanced search/filters
- Cocktail collections/playlists
- Social sharing improvements
- Offline mode enhancements

## Build Notes (Lessons Learned)
- **EAS queue timing matters:** Friday afternoon = 1.5h+ waits. Off-peak (evenings, weekends) = 4-10 min.
- **Test on web first:** Catches 90% of issues before building for iOS.
- **CLAUDE.md now in repo:** Future subagents will have full context up front.
- **Preview builds auto-increment:** No more manual build number management.

## Quick Reference Commands

### Start development
```bash
npx expo start --web --port 8090
```

### Build for TestFlight
```bash
eas build --platform ios --profile preview --non-interactive
```

### Check build status
https://expo.dev/accounts/duffers/projects/good-spirits/builds
