# Xcode Setup Progress — 2026-03-28 Night

## What Was Accomplished

### ✅ Completed Steps
1. **rbenv + ruby-build installed** (already present via Homebrew)
2. **Ruby 3.3.6 compiled and installed** (10:34 PM)
3. **Set Ruby 3.3.6 as local version** for project (`.ruby-version` file created)
4. **CocoaPods installed** successfully in Ruby 3.3.6 environment
5. **Expo prebuild executed** - generated `ios/` folder with native Xcode project
6. **CocoaPods dependencies installed** - `pod install` succeeded with `LANG=en_US.UTF-8` fix
7. **Xcode workspace created** - `ios/goodspirits.xcworkspace` ready to open

### ⚠️ Blocked at Command Line Build
- `xcodebuild` requires iOS Simulator to be configured
- No simulators detected: `xcrun simctl list devices` returns empty
- Attempted destinations all failed:
  - `-scheme goodspirits` (wrong case)
  - `-scheme GoodSpirits` without destination (no default)
  - `-destination 'generic/platform=iOS Simulator'` (no simulators available)

## Next Steps (Morning - Requires Colby or GUI)

### Option 1: Xcode GUI (Recommended)
1. Open `/Users/mulligan/Projects/good-spirits/ios/goodspirits.xcworkspace` in Xcode
2. Click the device selector next to the Run button
3. Choose any iPhone simulator (e.g., "iPhone 16 Pro")
4. Press Cmd+R or click Run button
5. Wait for app to launch in simulator
6. **When it crashes:** Xcode will show exact line + full stack trace

### Option 2: Install Simulator via CLI (If GUI Unavailable)
```bash
# Download iOS 18.4 Simulator runtime
sudo xcodebuild -downloadPlatform iOS

# Create an iPhone 16 Pro simulator
xcrun simctl create "iPhone 16 Pro" com.apple.CoreSimulator.SimDeviceType.iPhone-16-Pro

# Boot the simulator
xcrun simctl boot "iPhone 16 Pro"

# Open Simulator app
open -a Simulator

# Then run: xcodebuild with -destination 'platform=iOS Simulator,name=iPhone 16 Pro'
```

## Key Environment Details

### Ruby Environment
- **System Ruby**: 4.0.2 (broken - CocoaPods incompatible)
- **rbenv Ruby**: 3.3.6 (working)
- **CocoaPods**: 1.16.2
- **Critical env var**: `LANG=en_US.UTF-8` (prevents Unicode normalization crash)

### Project Structure
```
/Users/mulligan/Projects/good-spirits/
├── ios/                          # Native Xcode project (generated)
│   ├── goodspirits.xcworkspace  # OPEN THIS IN XCODE
│   ├── Podfile                  # CocoaPods dependencies
│   ├── Podfile.lock             # Locked versions
│   └── Pods/                    # Installed native modules
├── .ruby-version                # Forces Ruby 3.3.6
├── src/                         # React Native source code
└── app.json                     # Expo config
```

### Commands That Work
```bash
# Activate Ruby 3.3.6 environment
cd /Users/mulligan/Projects/good-spirits
eval "$(rbenv init - zsh)"
export LANG=en_US.UTF-8

# Verify Ruby version
ruby --version  # Should show: ruby 3.3.6

# CocoaPods commands
pod install
pod update

# Expo prebuild
npx expo prebuild --platform ios --clean
```

## Why This Matters

**Without Xcode debugger, we are flying blind.**

EAS Build crashes give us:
- ❌ Exception type (SIGSEGV)
- ❌ Memory address (0x00000...)
- ❌ No source line
- ❌ No variable values
- ❌ No call stack with symbols

Xcode debugger gives us:
- ✅ **Exact source file + line number where crash occurs**
- ✅ Full call stack with function names
- ✅ Variable values at crash time
- ✅ Can set breakpoints and step through code
- ✅ Can test fixes immediately (no 5-min EAS build cycle)

**This is the difference between guessing and knowing.**

## Current Theories for iOS Crash

Based on builds 13-18 all crashing identically:

1. **Test dependency conflict** (jest@30 vs 29.7.0 expected) - added in commit `e14c7f1`
2. **package-lock.json explosion** (8,501 → 14,952 lines, 684 → 1,113 packages)
3. **Native module initialization issue** triggered by new dependency tree
4. **Search refactor in CocktailsScreen.tsx** causing edge case at render time
5. **ImportModal changes** with image picker base64 option

**Xcode will tell us which one in 30 seconds.**

## Status Summary

- ✅ Ruby environment: **WORKING**
- ✅ CocoaPods: **WORKING**  
- ✅ Xcode project: **GENERATED**
- ⏸️ Xcode build: **REQUIRES GUI OR SIMULATOR SETUP**
- ⏳ Crash analysis: **PENDING XCODE RUN**

**Estimated time to crash discovery once Xcode runs: 30 seconds - 2 minutes**

---

_Prepared overnight while Colby sleeps. Ready for morning execution._
