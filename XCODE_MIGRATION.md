# Xcode Migration Plan - WORK IN PROGRESS
**Started:** 2026-03-28 10:29 AM PDT
**Status:** Research phase - actively working

## Goal
Switch from Expo EAS cloud builds to local Xcode builds on Mac mini to:
1. Remove 30 builds/month limit
2. Enable native iOS libraries (iOS Vision OCR)
3. Eliminate queue delays

## Research Log
- 10:29 AM: Created this document
- 10:29 AM: Checked `expo prebuild --help` - it creates native iOS/Android project files
- 10:30 AM: Checked for Xcode - **NOT INSTALLED** on Mac mini (only Command Line Tools)
- 10:30 AM: This is a blocker - Xcode must be installed before we can build locally

## Current Mac mini Status
- **macOS Version:** 26.2 (latest)
- **Xcode Status:** ❌ NOT INSTALLED (only Command Line Tools present)
- **Storage needed:** ~15 GB for Xcode
- **Installation method:** App Store (requires Apple ID sign-in)

## Questions to Answer
- [x] What does `expo prebuild` actually do? → Generates ios/ and android/ folders with native project files
- [x] Is Xcode installed? → NO - must install from App Store first
- [ ] Can we keep using Expo for everything except builds?
- [ ] Certificate/provisioning profile requirements?
- [ ] Can I automate builds via command line once Xcode is installed?

## Migration Steps (High Level)

### Phase 1: Prerequisites (Colby must do)
1. **Install Xcode from App Store**
   - Open App Store on Mac mini
   - Search "Xcode"
   - Download/Install (~15 GB, takes 30-60 min)
   - Open Xcode once to accept license agreement
   
2. **Verify Apple Developer Account**
   - Already have one (used for TestFlight)
   - Team ID: 52ZFNXX6NB (Colby Schwartz Individual)
   - This is sufficient for local builds

### Phase 2: Generate Native Projects (I can do)
1. Run `npx expo prebuild --platform ios` in the project directory
2. This creates an `ios/` folder with Xcode project files
3. App continues to work exactly the same
4. We can still use Expo for development (`expo start`)

### Phase 3: Configure Xcode (I can do most, Colby may need to approve)
1. Open `ios/GoodSpirits.xcworkspace` in Xcode
2. Configure signing & capabilities:
   - Select development team (52ZFNXX6NB)
   - Xcode auto-generates provisioning profiles
3. Set build configuration to Release

### Phase 4: Build Locally (I can do autonomously)
1. Command line: `xcodebuild -workspace ios/GoodSpirits.xcworkspace -scheme GoodSpirits -configuration Release`
2. Or use Xcode GUI: Product → Archive
3. Export .ipa file for TestFlight upload
4. Upload to App Store Connect (same as before, just local build instead of EAS)

### Phase 5: Add OCR Library (I can do)
1. Install `@react-native-ml-kit/text-recognition`
2. Run `npx pod-install` to link native dependencies
3. Rebuild with Xcode
4. Test OCR feature

## What Colby Must Do
1. ✋ **Install Xcode** (App Store, ~1 hour with download)
2. ✋ **Open Xcode once** to accept license (one-time)
3. ✋ **Sign in with Apple ID** in Xcode preferences (if prompted)
4. ✋ **Approve first build** (Xcode may ask for keychain access)

## What I Can Do Autonomously
1. ✅ Run `expo prebuild`
2. ✅ Configure Xcode project settings
3. ✅ Build app via command line
4. ✅ Install OCR library
5. ✅ Test and iterate
6. ✅ Upload builds to TestFlight

## Risks & Gotchas
1. **Can't go back easily** - Once we prebuild, we're committed to managing native code
2. **Larger git repo** - ios/ folder adds thousands of files
3. **Updates need care** - Expo SDK updates may require regenerating ios/ folder
4. **I need Xcode access** - Can I run GUI apps on Mac mini remotely? Or only command-line?

## Open Questions
- [ ] Can I run Xcode GUI via Screen Sharing, or only xcodebuild command-line?
- [ ] Should we add ios/ to .gitignore or commit it?
- [ ] Do we keep EAS for Android builds, or go full local?

---

**Next:** Waiting for Colby to install Xcode before proceeding
