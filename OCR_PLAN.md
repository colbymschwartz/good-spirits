# OCR Feature Implementation Plan
**Created:** 2026-03-28  
**Status:** Research Phase  
**Confidence:** 2.8/5.0 (research in progress)

## Problem Statement
The Good Spirits app has photo import buttons (camera + gallery) in the ImportModal component, but they only capture images without extracting text. Users expect OCR (Optical Character Recognition) to automatically extract recipe text from photos.

## Research Findings

### Library Options Evaluated

#### 1. ❌ expo-ocr (REJECTED)
- **Status:** Unpublished from npm on 2023-12-09
- **Reason:** No longer maintained/available
- **Source:** npm registry shows E404

#### 2. ⚠️ @react-native-ml-kit/text-recognition (INCOMPATIBLE)
- **Pros:**
  - Actively maintained (v2.0.0, published 6 months ago)
  - Uses Google ML Kit (proven accuracy)
  - Good documentation
  - Supports multiple scripts (Latin, Japanese, Chinese, Korean, Devanagari)
- **Cons:**
  - **DOES NOT WORK with Expo managed workflow**
  - Requires bare React Native or `expo prebuild` (ejects from managed workflow)
  - No Expo config plugin available
  - StackOverflow confirms: "Make sure you are not using Expo managed workflow"
- **Performance (from research):**
  - MLKit: ~0.05s average recognition time
  - 6x faster than Apple Vision framework
- **Verdict:** Cannot use without ejecting from Expo managed workflow

#### 3. 🔍 iOS Vision Framework (INVESTIGATING)
- **Pros:**
  - Built into iOS (no external dependencies, no bundle size increase)
  - Free, no API costs
  - Good accuracy (slightly better with rotated text than MLKit)
  - Supports simplified Chinese in addition to Latin
- **Cons:**
  - Slower than MLKit (~0.31s vs 0.05s average)
  - Requires native module or Expo config plugin
  - Only works on iOS (not Android)
- **Research source:** Bitfactory.io comparison (2021, but principles still apply)

### Key Challenge: Expo Managed Workflow Constraint
Good Spirits is built with **Expo SDK 54 managed workflow**. This means:
- ✅ We can use Expo modules and config plugins
- ❌ We cannot use native modules that require `react-native link`
- ❌ We cannot eject to bare workflow (would lose Expo build service benefits)
- ✅ We CAN use custom native code IF there's an Expo config plugin

### Next Steps in Research
1. ⏳ Search for Expo-compatible OCR solutions (Expo modules or config plugins)
2. ⏳ Check if iOS Vision framework has an Expo config plugin
3. ⏳ Evaluate cloud OCR options (Google Cloud Vision, AWS Textract) as fallback
4. ⏳ Consider creating custom Expo config plugin for @react-native-ml-kit/text-recognition

## Test Image Available
- **Location:** `/Users/mulligan/Projects/good-spirits/test-images/recipe-sample-1.jpg`
- **Content:** "Income Tax" cocktail recipe
- **Challenges:** 
  - Mixed fonts/sizes
  - Photo overlay (cocktail glass partially obscures text)
  - Stylized header text
  - Numbered directions
  - Ingredient list with measurements

## Current Code Status
- **ImportModal component:** Has camera/gallery buttons but no OCR
- **expo-image-picker:** Already installed (v17.0.10)
- **Current UX:** Photo captured → shows "Photo captured!" → user still must type recipe text
- **Expected UX:** Photo captured → OCR extracts text → preview with editable text → import

## Open Questions
1. Is there an Expo-compatible OCR library that works on iOS?
2. Should we limit OCR to iOS-only (Vision framework) or require cross-platform?
3. If no Expo solution exists, do we:
   - Eject to bare workflow? (loses Expo benefits)
   - Use cloud OCR? (requires internet, privacy concerns, costs)
   - Remove photo buttons until a solution exists?

## Potential Solutions (Ranked by Viability)

### Option A: Cloud OCR (Google Cloud Vision API)
**Confidence: 3.8/5.0**

**Pros:**
- ✅ Works with Expo managed workflow (simple HTTP API)
- ✅ Highly accurate (Google's production OCR engine)
- ✅ No native code required
- ✅ Supports multiple languages
- ✅ Can test on web version immediately

**Cons:**
- ❌ Requires internet connection
- ❌ Privacy concern (recipe images sent to Google)
- ❌ Cost: $1.50 per 1000 images (first 1000/month free)
- ❌ Adds latency (network round-trip)

**Implementation:**
1. Use `expo-image-picker` to get image URI
2. Convert to base64
3. POST to Google Cloud Vision API
4. Parse JSON response for detected text
5. Extract structured recipe data

**Cost estimate:**
- Free tier: 1000 requests/month
- If each user imports 10 recipes/month and we have 100 users = 1000 requests (FREE)
- Beyond that: negligible cost for small user base

**Privacy mitigation:**
- Add privacy notice in app ("Recipe images processed by Google Cloud Vision")
- Store images locally only, delete after OCR complete

### Option B: Custom Expo Config Plugin for iOS Vision Framework
**Confidence: 2.5/5.0**

**Pros:**
- ✅ Free, no API costs
- ✅ Works offline
- ✅ Privacy-preserving (on-device)
- ✅ Good accuracy

**Cons:**
- ❌ Requires writing native Swift code
- ❌ iOS-only (Android users get nothing)
- ❌ Higher development complexity
- ❌ Harder to test (can't test on web)
- ❌ I have limited native iOS development experience

**Implementation:**
1. Create Expo config plugin
2. Write Swift module wrapping VNRecognizeTextRequest
3. Expose to React Native via JSI
4. Add to app.json plugins array
5. Test on physical iOS device only

**Risk:** High chance of implementation bugs, long testing cycle

### Option C: Remove Photo Buttons (Punt on OCR)
**Confidence: 5.0/5.0** (for what it is)

**Pros:**
- ✅ Honest about current capabilities
- ✅ Zero development time
- ✅ No broken user expectations
- ✅ Can add OCR later when better solution exists

**Cons:**
- ❌ Removes potentially useful feature
- ❌ Users can't import recipes from photos at all

**Implementation:**
1. Remove camera/gallery buttons from ImportModal
2. Keep text paste input only
3. Add to IDEAS.md roadmap: "OCR import (future)"

### Option D: Hybrid - iOS Live Text Instruction
**Confidence: 4.0/5.0**

**Pros:**
- ✅ Zero development required
- ✅ Works great on iOS 15+
- ✅ Privacy-preserving
- ✅ Free
- ✅ Users already know how to use it

**Cons:**
- ❌ Not truly automatic
- ❌ Requires user to know the workflow
- ❌ iOS-only

**Implementation:**
1. Keep import modal text-paste only
2. Add helper text: "TIP: On iPhone, long-press text in a photo to copy it, then paste here"
3. Optionally: link to iOS Live Text documentation

## Recommendation

**Primary: Option A (Google Cloud Vision API)** for these reasons:
1. Works immediately with Expo managed workflow
2. Can test on web version before building
3. Highly accurate out of the box
4. Free for our expected usage (1000 recipes/month covers small user base)
5. Privacy concern is manageable with disclosure

**Fallback: Option D (iOS Live Text instruction)** if:
- Privacy concerns override technical benefits
- Cost becomes an issue (unlikely at current scale)
- We want to ship faster without external dependencies

**Not recommended:**
- Option B (custom plugin) - too complex, iOS-only, high risk
- Option C (remove buttons) - we already half-built the feature

## Next Actions
- [ ] Get Colby's input on privacy vs convenience tradeoff
- [ ] If Option A approved: Set up Google Cloud Vision API key
- [ ] Design UX flow with "Extracting text..." loading state
- [ ] Write parsing logic (extract name, ingredients, instructions from raw OCR text)
- [ ] Build feature on web version for testing
- [ ] Test with real recipe photos
- [ ] Achieve 4.5+ confidence before requesting iOS build

---

**Status:** Research complete, awaiting decision on approach.
