# LOCAL_BUILDS.md — Zero-Queue EAS Build Fallback

## ⚠️ STATUS: BLOCKED (as of 2026-03-28)

**Local Xcode builds are not viable.** macOS 26.2 ships Ruby 4.0.2 and CocoaPods 1.16.2 has a Unicode encoding bug incompatible with Ruby 4.0. `pod install` crashes. This is an upstream CocoaPods issue — no fix available yet.

**Current strategy: EAS cloud builds only.** See CLAUDE.md Rule #5 for build discipline and queue management.

This file is preserved for when CocoaPods ships a Ruby 4.0 fix, at which point local builds become a viable fallback again.

---

## Why Local Builds? (When Available)

EAS free tier has unpredictable queue times:
- **Off-peak:** 4-10 minutes
- **Peak (weekday afternoons):** 1.5+ hours

Local builds on the Mac mini eliminate queue dependency entirely.

## Prerequisites

### 1. Xcode Command Line Tools
```bash
xcode-select --install
```
✅ Already installed on Mac mini (`/Library/Developer/CommandLineTools`)

### 2. EAS CLI
```bash
npm install -g eas-cli
```
✅ Already installed (used for cloud builds)

### 3. Apple Developer Account
✅ Already set up (duffersmcmulligan@gmail.com, Team ID: TBD)

## One-Time Setup

### Step 1: Configure Credentials
Run this from the Good Spirits repo on the Mac mini:

```bash
cd /Users/mulligan/Projects/good-spirits
eas credentials
```

Select:
- Platform: **iOS**
- Action: **Download distribution certificate**
- Save to: `~/.expo/credentials/` (default)

This downloads your Apple signing certificate and provisioning profile to the Mac mini.

### Step 2: Test Local Build
```bash
eas build --platform ios --profile preview --local
```

This will:
- Build the app on the Mac mini (5-10 minutes)
- Upload the `.ipa` artifact to Expo
- Make it available for TestFlight submission (same as cloud builds)

### Step 3: Verify Disk Space
Local builds require ~5GB per build (cached dependencies speed up subsequent builds).

```bash
df -h /Users/mulligan/Projects/good-spirits
```

The Mac mini has sufficient space for local builds.

## Usage

### When to Use Local Builds

**Use local when:**
- EAS queue is >30 minutes
- Friday afternoon / peak traffic
- Need to ship urgently

**Use cloud when:**
- Queue is <15 minutes (off-peak, weekends)
- Mac mini is offline or unavailable
- Don't need immediate results

### Local Build Command
```bash
cd /Users/mulligan/Projects/good-spirits
eas build --platform ios --profile preview --local
```

**Time:** 5-10 minutes (first build may take longer for dependency downloads)

### Submit to TestFlight
After local build completes:
```bash
eas submit --platform ios --profile production --url <build-artifact-url>
```

Or enable auto-submit in `eas.json`:
```json
"preview": {
  "distribution": "internal",
  "ios": {
    "simulator": false,
    "autoIncrement": true,
    "autoSubmit": true
  }
}
```

## Troubleshooting

### "No valid code signing identity found"
- Run `eas credentials` again
- Select "Set up distribution certificate" → "Let EAS handle it"
- Re-download credentials

### "Xcode not found"
- Install full Xcode from App Store (not just Command Line Tools)
- Run: `sudo xcode-select --switch /Applications/Xcode.app`

### Build fails with "insufficient disk space"
- Clear old builds: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
- Check space: `df -h`

### Build artifact not uploading to Expo
- Check network connection
- Retry: EAS will resume from checkpoint

## Performance Comparison

| Method | Time (off-peak) | Time (peak) | Cost |
|--------|----------------|-------------|------|
| **Cloud (free tier)** | 4-10 min | 1.5-2 hours | $0 |
| **Cloud (Priority)** | 2-5 min | 5-10 min | $99/month |
| **Local (Mac mini)** | 5-10 min | 5-10 min | $0 (one-time setup) |

**Recommendation:** Use local builds as a fallback when cloud queue is slow. Best of both worlds: zero cost, zero queue.

## Next Steps

To enable local builds:
1. **Colby:** Run `eas credentials` on Mac mini (requires interactive prompt)
2. Select iOS platform
3. Download distribution certificate
4. Test with: `eas build --platform ios --profile preview --local --no-wait`
5. Document any additional setup steps here

Once credentials are configured, local builds become a reliable fallback option.
