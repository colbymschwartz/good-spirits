# Xcode Local Build Setup - In Progress
**Started:** 2026-03-28 1:24 PM PDT  
**Status:** Installing Ruby 3.3.0

## Problem
- Mac mini has Ruby 4.0.2 (released March 17, 2026)
- CocoaPods 1.16.2 is incompatible with Ruby 4.0 (Unicode encoding bug)
- This blocks local Xcode builds

## Solution
Install Ruby 3.3.0 (stable, CocoaPods-compatible) via rbenv

## Steps Completed
1. ✅ Installed Xcode 16 from App Store
2. ✅ Opened Xcode to accept license
3. ✅ Ran `expo prebuild` - generated ios/ folder
4. ✅ Installed Homebrew CocoaPods (failed due to Ruby 4.0)
5. ✅ Installed rbenv + ruby-build
6. ⏳ Installing Ruby 3.3.0 (compiling from source, ~5-10 min)

## Next Steps
7. Set Ruby 3.3.0 as global default
8. Reinstall CocoaPods via Ruby 3.3.0
9. Run `pod install` in ios/ folder
10. Build app with Xcode

## Why This Matters
- Unlimited builds (no 30/month limit)
- No queue delays
- Native iOS libraries (OCR via Vision framework)
- Full control over native code

---
**Confidence:** 4.7/5.0 that this will work
