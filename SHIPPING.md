# SHIPPING.md — Build & Release Protocol

## Pre-Ship Checklist

Before running `eas build`:
- [ ] All code tested on web (`npx expo start --web --port 8090`)
- [ ] All features manually verified
- [ ] Version bumped in `app.json` (if needed)
- [ ] `NEXT_BUILD.md` updated with build status
- [ ] Explicit approval from Colby received

## Build Commands

### Preview (TestFlight Internal)
```bash
eas build --platform ios --profile preview --non-interactive
```
- Auto-increments build number
- Distributes to 21 testers in "Friends" group
- Typically takes 4-10 minutes (off-peak), 1-2 hours (peak)

### Production (App Store)
```bash
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --profile production
```
- Requires Apple review
- Auto-increments build number

## EAS Queue Management

**Best times to build (fast queue):**
- Early mornings (6-9 AM PT)
- Late evenings (8 PM - midnight PT)
- Weekends

**Worst times (slow queue):**
- Weekday afternoons (especially Friday 2-6 PM PT)
- Can wait 1.5+ hours on free tier

**Monitoring:**
- Dashboard: https://expo.dev/accounts/duffers/projects/good-spirits/builds
- CLI shows real-time queue position

## Rollback Plan

### If a TestFlight build is broken:

**Option 1: Remove broken build (fastest)**
1. Go to App Store Connect → My Apps → Good Spirits → TestFlight
2. Find the broken build → Click "Expire Build"
3. Previous build becomes active again for testers
4. Fix bug, ship hotfix when ready

**Option 2: Re-upload previous build**
1. Find previous working build at https://expo.dev/accounts/duffers/projects/good-spirits/builds
2. Download the `.ipa` artifact
3. Re-submit via `eas submit --url <artifact-url>`
4. Note: Build number will be higher, but app version can stay same

**Option 3: Emergency hotfix (recommended)**
1. Fix the bug in code
2. Bump build number in `app.json` (or let auto-increment handle it)
3. `eas build --platform ios --profile preview`
4. `eas submit --platform ios --profile production` (if needed)
5. Fastest path to get fix in users' hands

### Build History
All builds are preserved at:
- **Expo Dashboard:** https://expo.dev/accounts/duffers/projects/good-spirits/builds
- **Artifacts:** Download `.ipa` or `.aab` files from any past build
- **Commits:** Every build links to its git commit SHA

## Post-Ship Checklist

After successful TestFlight upload:
- [ ] Update `NEXT_BUILD.md` status to SHIPPED
- [ ] Note build URL and timestamp in `NEXT_BUILD.md`
- [ ] Clear completed items from "Ready to Ship" section
- [ ] Start next version section in `NEXT_BUILD.md`
- [ ] Monitor TestFlight for crash reports (first 24h)
- [ ] Check for tester feedback in TestFlight or Discord

## Local Builds — BLOCKED

**Local Xcode builds are not viable as of 2026-03-28.** macOS 26.2 ships Ruby 4.0.2; CocoaPods 1.16.2 has a Unicode encoding bug. `pod install` crashes. Upstream fix pending.

**Strategy: EAS cloud builds only.** Stay within free tier (30/month) by testing on web first and only building after QA passes. See `LOCAL_BUILDS.md` for details when this becomes available again.

## Troubleshooting

### Build fails with "Build number conflict"
- **Cause:** Apple already has that build number
- **Fix:** Auto-increment should prevent this, but if manual override needed:
  ```bash
  # Bump buildNumber in app.json
  # Or delete conflicting build in App Store Connect
  ```

### Build stuck in queue >2 hours
- **Action:** Cancel and retry off-peak, or use local build

### TestFlight not updating for testers
- **Check:** App Store Connect → TestFlight → Builds → ensure "Export Compliance" is marked (automatic for internal only)
- **Timeline:** Can take 5-10 min after upload for notification to send

### Crash on launch
- **Rollback:** Expire broken build, previous version activates immediately
- **Debug:** Check Expo logs at https://expo.dev/accounts/duffers/projects/good-spirits/logs

## Version Strategy

**Semantic versioning: vMAJOR.MINOR.PATCH**
- **MAJOR** (v2.0.0): Breaking changes, major redesign
- **MINOR** (v1.1.0): New features, significant additions
- **PATCH** (v1.0.1): Bug fixes, small improvements

**Build numbers:**
- Auto-incremented by EAS for preview + production profiles
- Monotonically increasing (Apple requirement)
- Can skip numbers (e.g., 10 → 13 is fine)

## Support Resources

- **Expo Docs:** https://docs.expo.dev/build/introduction/
- **EAS Build Status:** https://status.expo.dev/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **TestFlight Dashboard:** App Store Connect → My Apps → Good Spirits → TestFlight
