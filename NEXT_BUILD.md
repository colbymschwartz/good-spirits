# Next Build: v1.7.0 (TBD)

## Status
**PLANNING** — no active work

## Previous Build: v1.6.0 build 13
**SHIPPED** — 2026-03-27 @ 7:53 PM PT
- Build URL: https://expo.dev/accounts/duffers/projects/good-spirits/builds/635f192c-a710-4c31-af24-b6883b3c4259
- Commit: 0c78347
- TestFlight: 21 testers notified
- EAS queue: off-peak build (7:45 PM retry) completed in 4 minutes
- All 5 QA bugs fixed and tested

## Ideas for v1.7.0
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
