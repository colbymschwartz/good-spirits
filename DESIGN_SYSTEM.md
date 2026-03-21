# Good Spirits — Design System Bible

> *"The door is unmarked. The password is taste."*

---

## 1. Design Philosophy

### The Core Tension: Vintage Warmth vs. Modern Clarity

Good Spirits lives in the space between a 1920s speakeasy and a 2026 iOS app. This is not a costume — it's a translation. We take the *feeling* of walking into The Savoy's American Bar circa 1930 — the low amber light, the gold-leafed mirrors, the geometric precision of Art Deco tilework, the quiet authority of a bartender who knows 750 recipes by heart — and express it through the interaction patterns, animation physics, and typographic clarity that modern mobile users expect.

**What "prohibition meets modern" means in practice:**

- **Warmth, not coldness.** Our backgrounds are deep midnight blue-blacks, never sterile grays. Our text is warm cream, never clinical white. Our accent is gold, never generic blue.
- **Craft, not clutter.** Art Deco was maximalist in its era, but its defining quality was *geometric precision*. We use decorative elements sparingly — a thin gold divider here, a fan ornament there — so each one lands with weight. If it doesn't serve the content, it doesn't exist.
- **Authority, not novelty.** The Savoy Cocktail Book didn't need to be flashy. It was authoritative. Our app should feel like it *knows* cocktails — curated, opinionated, and trustworthy. This comes from typography choices, content hierarchy, and generous spacing, not gimmicks.
- **Mystery, not confusion.** Speakeasies used progressive disclosure — you had to know the door, the password, the bartender's name. We borrow this sense of discovery (a detail screen that unfurls, a technique that reveals itself step-by-step) without ever sacrificing usability.

### Reference Touchstones

**Real Bars:**
- The Savoy American Bar, London — Basil Ionides' 1929 Art Deco renovation: black lacquer walls, mirrored surfaces, geometric chrome fixtures
- PDT (Please Don't Tell), NYC — the hidden-door phone booth entrance, the intimacy of discovery
- The Connaught Bar, London — restrained luxury, bespoke service, the famous martini trolley
- Death & Co, NYC — dark, moody, cocktail-forward, the book-as-menu approach

**Real Books:**
- *The Savoy Cocktail Book* (Harry Craddock, 1930) — Gilbert Rumbold's Art Deco illustrations, geometric figure studies, the contrast between decorative headers and readable recipe text
- *The PDT Cocktail Book* — modern authority, clean typography, photography-forward
- *Regarding Cocktails* (Sasha Petraske) — minimal, elegant, text-driven

**Real Design Movements:**
- Art Deco (1920-1940) — geometric construction, sunburst motifs, stepped forms, metallic accents
- The Bauhaus (1919-1933) — "form follows function," geometric typography, the marriage of craft and modernism
- Mid-century Modern (1940s-1960s) — the clean evolution of Deco's geometry into functional design

**Modern App References:**
- Highball by Studio Neat — recipe card metaphor, restraint, shareable cards
- Cocktail Party — clean hierarchy, subtle micro-interactions, grid-based ingredient layout
- Apple Music (dark mode) — premium dark UI, generous spacing, editorial feel
- Things 3 — animation quality, haptic precision, the feeling of craft in every interaction

---

## 2. Color Palettes

All palettes share a common structure: dark backgrounds with warm metallic accents, because this is the visual DNA of every great speakeasy. The difference is in *mood* — which corner of the bar you're sitting in.

### Palette A: "The Savoy" (Recommended Primary)

*The flagship palette. Deep midnight with warm gold — the polished bar at 11pm.*

**Prohibition Reference:** The Savoy American Bar's black lacquer walls, chrome fixtures, and amber lighting reflected in mirrored surfaces.

| Token | Hex | Usage |
|---|---|---|
| `bgDeep` | `#0B0E1A` | Root background, OLED-friendly near-black with blue undertone |
| `bgPrimary` | `#1A1A2E` | Primary background, main screen surfaces |
| `bgCard` | `#16213E` | Card backgrounds, elevated surfaces |
| `bgElevated` | `#1C2A4A` | Modals, sheets, hover states |
| `accentGold` | `#C9A96E` | Primary accent — buttons, active tabs, highlights |
| `accentGoldBright` | `#D4AF37` | High-emphasis moments — hero CTAs, active indicators |
| `accentGoldLight` | `#E0C992` | Secondary accent — selected states, subtle highlights |
| `accentGoldDim` | `#A08550` | Disabled gold, inactive accent elements |
| `accentAmber` | `#D4A053` | Spirit-category coding (bourbon/whiskey family) |
| `accentCopper` | `#B87333` | Warm tertiary accent — badges, tags |
| `textPrimary` | `#F0E6D3` | Primary text — warm cream, never pure white |
| `textSecondary` | `#A09880` | Supporting text — muted gold-beige |
| `textDim` | `#6B6355` | Tertiary text, placeholders, disabled labels |
| `border` | `#2A2A4A` | Subtle borders, card outlines |
| `borderLight` | `#3A3A5A` | Emphasized borders, dividers |
| `success` | `#6BBD7B` | Available ingredients, success states |
| `warning` | `#E8A87C` | Low-stock, attention needed |
| `error` | `#E07070` | Missing ingredients, error states |
| `overlay` | `rgba(11,14,26,0.6)` | Background scrims behind modals |
| `goldOverlay12` | `rgba(201,169,110,0.12)` | Gold wash on surfaces — selected card backgrounds |
| `goldOverlay06` | `rgba(201,169,110,0.06)` | Subtle gold tint — hover states |

**Gold Gradient (for decorative elements, shimmer effects):**
Linear gradient at 135deg: `#8B6914` → `#D4AF37` → `#E8D5A3` → `#D4AF37` → `#8B6914`

**Mood:** Polished, confident, late-night sophistication. The feeling of ordering a perfectly made Martini from a bartender who doesn't need to check the recipe.

**Pros:** Highest contrast ratios for accessibility. The blue-black undertone keeps dark mode from feeling heavy. Gold reads as premium across cultures. OLED screens render `bgDeep` as true black, saving battery.

**Cons:** Requires careful handling of the blue undertone — too much blue in card surfaces and it starts feeling corporate. Gold accent can feel generic if not paired with strong typography and decoration.

---

### Palette B: "The Speakeasy"

*Warmer and more intimate. Dark mahogany and burnished brass — the hidden room behind the bookshelf.*

**Prohibition Reference:** The warm wood, leather, and brass of a 1920s private drinking club. Reverse-painted glass signs with gold leaf on dark backgrounds.

| Token | Hex | Usage |
|---|---|---|
| `bgDeep` | `#0D0A07` | Root background — warm near-black, brown undertone |
| `bgPrimary` | `#1A1410` | Primary background — dark walnut tone |
| `bgCard` | `#241C16` | Card backgrounds — rich brown-black |
| `bgElevated` | `#2E241C` | Modals, sheets — lighter warm surface |
| `accentGold` | `#D4AF37` | Primary accent — true Deco gold |
| `accentGoldBright` | `#E8D5A3` | Champagne highlight — delicate and luminous |
| `accentGoldDim` | `#8B6914` | Antique gold — pressed states, subtle accents |
| `accentBrass` | `#B8860B` | Warm metallic secondary — icons, ornamental elements |
| `accentBurgundy` | `#6B1C2A` | Deep red accent — category coding, tags |
| `accentCopper` | `#CD7F32` | Warm tertiary — badges, spirit categories |
| `textPrimary` | `#F5F0E1` | Ivory — warmer than Palette A |
| `textSecondary` | `#B8A88A` | Parchment — muted warm |
| `textDim` | `#6B5F50` | Faded leather tone |
| `border` | `#3C2415` | Warm border — mahogany edge |
| `borderLight` | `#4A3525` | Emphasized border |
| `success` | `#7BC47F` | Slightly warmer green |
| `warning` | `#E8A87C` | Amber warning |
| `error` | `#D45454` | Muted red (feels less alarming in warm context) |
| `overlay` | `rgba(13,10,7,0.65)` | Warm scrim |

**Mood:** Intimate, cozy, secretive. The feeling of finding a bar no one else knows about. Whiskey-forward.

**Pros:** The warm brown undertone feels genuinely speakeasy. The burgundy accent adds richness and period authenticity. Excellent for whiskey/bourbon-focused content.

**Cons:** Lower contrast than Palette A — requires extra attention to accessibility. The brown tones can feel muddy on certain screens if not carefully managed. Less versatile for gin/vodka/tequila-focused cocktails that benefit from cooler tones.

---

### Palette C: "The Emerald Room"

*Jewel-toned and dramatic. Deep emerald with gold — the VIP booth in a grand hotel bar.*

**Prohibition Reference:** The private club rooms of the 1920s — deep green leather banquettes, gold-framed mirrors, emerald velvet curtains. The color of money, and of exclusivity.

| Token | Hex | Usage |
|---|---|---|
| `bgDeep` | `#060E0A` | Root background — near-black with green undertone |
| `bgPrimary` | `#0E1A14` | Primary background — deep forest |
| `bgCard` | `#142620` | Card backgrounds — dark emerald |
| `bgElevated` | `#1C3028` | Modals, sheets — lighter emerald surface |
| `accentGold` | `#D4AF37` | Primary accent — classic gold on green is the definitive Deco combination |
| `accentGoldBright` | `#E8D5A3` | Champagne highlight |
| `accentGoldDim` | `#A08550` | Muted gold |
| `accentEmerald` | `#2D6A4F` | Secondary accent — buttons, tags, category coding |
| `accentJade` | `#00A86B` | Bright interactive green — links, active states |
| `accentCopper` | `#B87333` | Warm tertiary — temperature contrast |
| `textPrimary` | `#F0EDE5` | Cool cream |
| `textSecondary` | `#9CA894` | Sage — green-tinted secondary |
| `textDim` | `#5A6B5E` | Moss — muted tertiary |
| `border` | `#1E3A2C` | Green-tinted border |
| `borderLight` | `#2E4A3C` | Emphasized border |
| `success` | `#6BBD7B` | Natural green success |
| `warning` | `#E8A87C` | Amber warning |
| `error` | `#E07070` | Red error (high contrast against green) |
| `overlay` | `rgba(6,14,10,0.6)` | Green-tinted scrim |

**Mood:** Luxurious, exclusive, slightly theatrical. The feeling of a members-only club where the cocktails have no prices because if you have to ask, you can't afford them.

**Pros:** Green + gold is *the* quintessential Art Deco color combination (see the Savoy's original interiors, the Emerald Room at the Waldorf). Extremely distinctive — no other cocktail app uses this palette. The green undertone flatters food/drink photography.

**Cons:** Green as a primary background is polarizing. The success-state green accent needs differentiation from the background green (solved here by using a brighter jade). Long sessions in a green-dominant UI can cause color fatigue. Harder to execute than Palettes A or B.

---

### Palette D: "Gatsby's Party"

*Higher contrast, more dramatic. Jet black with bright gold and a pop of Art Deco coral — the rooftop party at the mansion.*

**Prohibition Reference:** The grand parties of the Jazz Age — the dramatic contrast of black tie and gold, the flash of a beaded dress, the Art Deco posters of A.M. Cassandre with their bold, limited palettes.

| Token | Hex | Usage |
|---|---|---|
| `bgDeep` | `#050505` | Root background — true near-black, OLED optimized |
| `bgPrimary` | `#121212` | Primary background — neutral charcoal |
| `bgCard` | `#1E1E1E` | Card backgrounds — lighter charcoal |
| `bgElevated` | `#2A2A2A` | Modals, sheets |
| `accentGold` | `#D4AF37` | Primary accent — bright and unapologetic |
| `accentGoldBright` | `#FFD700` | Pure gold — high-emphasis moments only |
| `accentGoldDim` | `#8B6914` | Muted gold |
| `accentCoral` | `#E34234` | Bold secondary — the "pop" color. Sparingly. |
| `accentTeal` | `#008080` | Cool tertiary — links, interactive elements |
| `accentIvory` | `#FFFDD0` | Warm highlight — almost-white for emphasis |
| `textPrimary` | `#FFFDD0` | Ivory text — warm but high-contrast on black |
| `textSecondary` | `#B0A890` | Muted gold-beige |
| `textDim` | `#666660` | Neutral dim |
| `border` | `#2A2A2A` | Subtle neutral border |
| `borderLight` | `#3A3A3A` | Emphasized border |
| `borderGold` | `#D4AF3740` | Gold border at 25% opacity — decorative dividers |
| `success` | `#6BBD7B` | Green success |
| `warning` | `#E8A87C` | Amber warning |
| `error` | `#E34234` | Coral doubles as error (context-dependent) |
| `overlay` | `rgba(5,5,5,0.7)` | Deep scrim |

**Mood:** Bold, dramatic, celebratory. The feeling of champagne on New Year's Eve. More theatrical than the other palettes.

**Pros:** Highest contrast of any option — excellent accessibility scores. The neutral black background makes gold feel even more luxurious. The coral accent adds energy that the other palettes lack. Most "modern" feeling of the four — easier to execute without looking dated.

**Cons:** The neutral black lacks the distinctive tint of the other palettes. Can feel less warm and intimate. The coral accent risks feeling sporty or aggressive if overused. Requires more restraint than the other palettes — the high contrast amplifies every design decision, good or bad.

---

### Palette Recommendation

**Use Palette A ("The Savoy") as the shipped default.** It has the best balance of period authenticity, accessibility, and versatility. The blue-black undertone keeps it from feeling heavy during long browsing sessions, and the gold system is rich enough to carry the full range of interactive states.

Palette B ("The Speakeasy") is the strongest alternative for users who prefer warmer tones, and could be offered as a theme option. Palettes C and D are viable for brand differentiation but carry more execution risk.

---

## 3. Typography

### Font Strategy

Good Spirits uses a **dual-font system**: a geometric Art Deco-inflected display face for personality and a high-readability system font for UI clarity. This mirrors the typographic hierarchy of vintage cocktail menus — ornate headers with clean, readable recipe text beneath.

### Recommended Font Pairing

**Display / Headers: Josefin Sans**
- Available on Google Fonts (load via `expo-font`)
- Geometric, 1920s-inspired, with a vintage Scandinavian elegance
- The uppercase forms are distinctly Art Deco: geometric "O," single-story "a," elegant proportions
- Available in weights from Thin (100) to Bold (700) — use Light (300) for hero/display sizes, SemiBold (600) for section headers
- Fallback: system font with wide letter-spacing

**Body / UI: System Font (SF Pro on iOS, Roboto on Android)**
- Maximum readability, Dynamic Type support, zero load time
- Familiar to users — doesn't fight the display font for attention
- Provides the "modern" half of the vintage/modern equation

**Alternative Display Options (in order of preference):**
1. **Cormorant Garamond** — High-contrast serif with Art Deco sensibility. More editorial, more "cocktail book." Use if Josefin Sans feels too casual.
2. **Playfair Display** — Transitional serif, high stroke contrast. The classic "luxury app" serif. More conventional but proven premium.
3. **Poiret One** — Ultra-thin geometric display face, pure Deco. Beautiful but only works at very large sizes (28px+). Use for hero moments only.

### Type Scale

| Token | Size (px) | Weight | Font | Letter Spacing | Line Height | Usage |
|---|---|---|---|---|---|---|
| `hero` | 34 | Light (300) | Josefin Sans | 3.0 | 1.1 | Cocktail name on detail screen, section hero text |
| `display` | 28 | Light (300) | Josefin Sans | 2.5 | 1.15 | Feature cocktail name, "Cocktail of the Day" |
| `h1` | 22 | SemiBold (600) | Josefin Sans | 2.0 | 1.2 | Screen titles ("Cocktails," "My Bar," "Techniques") |
| `h2` | 18 | SemiBold (600) | Josefin Sans | 1.5 | 1.25 | Section headers within a screen |
| `h3` | 16 | SemiBold (600) | System | 0.5 | 1.3 | Subsection headers, card titles |
| `body` | 15 | Regular (400) | System | 0.3 | 1.5 | Recipe instructions, descriptions, long-form text |
| `bodyBold` | 15 | SemiBold (600) | System | 0.3 | 1.5 | Emphasized body text, ingredient names |
| `secondary` | 13 | Regular (400) | System | 0.3 | 1.4 | Supporting info, metadata, timestamps |
| `caption` | 12 | Medium (500) | System | 1.0 | 1.3 | Labels, tags, filter pills, card metadata |
| `micro` | 10 | Medium (500) | System | 1.5 | 1.2 | Badge counts, fine print, tertiary metadata |
| `label` | 11 | SemiBold (600) | Josefin Sans | 2.0 | 1.0 | Uppercase category labels, tab bar labels |

### Weight Usage Rules

- **Light (300):** Display font only, at sizes 28px and above. The thin strokes need size to be legible.
- **Regular (400):** Body text, descriptions, instructions. The workhorse weight.
- **Medium (500):** Captions, micro text — adds just enough presence at small sizes.
- **SemiBold (600):** Headers, emphasis, interactive labels. The primary "strong" weight.
- **Bold (700):** Used sparingly — numerical values (ABV, proof), price-like data, or single-word emphasis. Never for full sentences.

### Letter Spacing Rules

- **Display/Hero (28px+):** Wide tracking (2.0–3.0). This is the signature Art Deco touch — generously spaced uppercase text suggesting engraved signage.
- **Section Headers (16–22px):** Moderate tracking (1.0–2.0). Still Deco-inflected but tighter for readability.
- **Body Text (13–15px):** Minimal tracking (0.3). Let the system font's native metrics handle readability.
- **Captions/Labels (10–12px):** Moderate tracking (1.0–2.0). Small text benefits from extra breathing room.
- **ALL-CAPS text:** Always add +0.5 to the base tracking value. Uppercase text without added tracking feels cramped.

### Special Typographic Treatments

**Cocktail Names (on detail screen):**
Josefin Sans Light at 34px, uppercase, letter-spacing 3.0, `textPrimary` color. Centered. This is the app's typographic signature moment — it should feel like a name etched in glass.

**Section Divider Labels ("WHISKEY COCKTAILS," "STIRRED," "CLASSICS"):**
Josefin Sans SemiBold at 11px, uppercase, letter-spacing 2.5, `accentGold` color. Flanked by thin gold horizontal rules (1px, `accentGoldDim`).

**Ingredient Lists:**
System font, 15px regular. Ingredient name in SemiBold, measurement in Regular. Use tabular/monospaced numerals if available for measurement alignment.

**Technique Steps:**
System font, 15px regular. Step numbers in Josefin Sans SemiBold, 16px, `accentGold`. The number acts as a small Art Deco accent anchoring each step.

---

## 4. Component Design Language

### Cocktail Card (Browse Screen)

**Dimensions:** Full width minus 32px horizontal padding (16px per side). Height: 88px.

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│  ┌──────┐                                           │
│  │      │  COCKTAIL NAME              ★ 4.5  │
│  │ Emoji│  Rye · Sweet Vermouth · Bitters     │
│  │      │  🏷 Classic · Stirred         ♡     │
│  └──────┘                                           │
└─────────────────────────────────────────────────────┘
```

- **Background:** `bgCard` with 1px `border` outline
- **Border Radius:** 12px (`radius.md`)
- **Padding:** 16px all sides
- **Emoji Container:** 56x56px, `bgDeep` background, 8px radius, centered emoji at 32px
- **Cocktail Name:** `h3` style — System SemiBold 16px, `textPrimary`, letter-spacing 0.5
- **Ingredients Preview:** `secondary` style — System Regular 13px, `textSecondary`, single line truncated with ellipsis. Ingredients separated by ` · ` (middle dot with spaces)
- **Tags:** `caption` style — System Medium 12px. Each tag is a pill: `bgElevated` background, 4px vertical padding, 8px horizontal padding, `pill` radius. Tag text in `accentGold` for spirit-type tags, `textSecondary` for style tags
- **Rating:** `caption` style, `accentGold` color. Star character + numeric value
- **Favorite Heart:** 20px, `accentGoldDim` when unfavorited, `accentGold` filled when favorited
- **Press State:** Scale to 0.97 over 80ms (spring: damping 15, stiffness 150). Background transitions to `bgCardHover`. Release springs back to 1.0 over 120ms with slight overshoot.
- **Haptic:** `ImpactFeedbackStyle.Light` on press

### Cocktail Detail Card (Detail Screen)

**Layout:** Full-screen scrollable view.

**Hero Section (top):**
- **Background:** `bgDeep` with subtle radial gradient from center — `bgPrimary` at edges, `bgDeep` at center. This creates a subtle spotlight effect.
- **Emoji:** Centered, 80px. Sits 24px below the navigation bar.
- **Cocktail Name:** Centered below emoji, 16px gap. `hero` type style — Josefin Sans Light 34px, uppercase, letter-spacing 3.0, `textPrimary`.
- **Subtitle:** Centered, 8px below name. `secondary` style, `textSecondary`. E.g., "A CLASSIC STIRRED COCKTAIL"
- **Decorative Element:** A thin horizontal gold rule (1px, `accentGold`) centered 16px below subtitle, 80px wide. Small diamond ornament (6px, rotated 45deg square) centered on the rule.
- **Rating & Metadata Row:** Centered, 16px below decorative rule. Star rating, "Made 3 times," favorite heart. `caption` style, `textSecondary`, with `accentGold` for active stars/heart.

**Ingredients Section:**
- **Section Header:** "INGREDIENTS" — Josefin Sans SemiBold 11px, uppercase, letter-spacing 2.5, `accentGold`. Left-aligned. Flanked by gold rules extending to the right edge.
- **Ingredient Rows:** 48px height each. Left: measurement (System Regular 15px, `textSecondary`, 60px width, right-aligned). Center: ingredient name (System SemiBold 15px, `textPrimary`). Right: availability indicator — green dot (`success`) if in bar, red dot (`error`) if missing.
- **Row Dividers:** 1px `border` between rows, inset 16px from left edge.
- **Spacing:** Section sits 24px below hero, 16px horizontal padding.

**Instructions Section:**
- **Section Header:** Same treatment as Ingredients header.
- **Step Rows:** Step number in Josefin Sans SemiBold 16px, `accentGold`, 32px wide. Step text in System Regular 15px, `textPrimary`, next to number. 12px vertical gap between steps.

**Notes Section (if user has notes):**
- **Background:** `bgCard` card with 12px radius, 16px padding.
- **Note Text:** System Regular 15px, `textSecondary`, italic.

### Technique Card

**Dimensions:** Full width minus 32px. Height: auto (content-driven).

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│  MUDDLING                                           │
│  ─── ◇ ───                                          │
│  A gentle pressing technique to release oils         │
│  and aromas from fresh ingredients.                  │
│                                                      │
│  Related: Mojito · Caipirinha · Old Fashioned        │
└─────────────────────────────────────────────────────┘
```

- **Background:** `bgCard`, 12px radius, 16px padding
- **Technique Name:** Josefin Sans SemiBold 18px, uppercase, letter-spacing 2.0, `textPrimary`
- **Decorative Divider:** Thin gold rule with centered diamond, same as detail card, 12px below name
- **Description:** System Regular 15px, `textSecondary`, 12px below divider
- **Related Cocktails:** `caption` style, `accentGold`, comma-separated. 16px below description.

### Button Styles

**Primary Button:**
- **Background:** `accentGold`
- **Text:** `bgDeep`, System SemiBold 15px, uppercase, letter-spacing 1.5
- **Height:** 48px
- **Border Radius:** 8px (sharp, Deco-angular — not pill-shaped)
- **Press State:** Darken background to `accentGoldDim`, scale 0.97, 80ms. Haptic: `ImpactFeedbackStyle.Medium`
- **Disabled:** Background `accentGoldDim` at 50% opacity, text at 50% opacity

**Secondary Button:**
- **Background:** transparent
- **Border:** 1px `accentGold`
- **Text:** `accentGold`, System SemiBold 15px, uppercase, letter-spacing 1.5
- **Height:** 48px
- **Border Radius:** 8px
- **Press State:** Background fills to `goldOverlay12`, 80ms

**Ghost Button:**
- **Background:** transparent, no border
- **Text:** `accentGold`, System Medium 14px
- **Press State:** Text color shifts to `accentGoldLight`, background `goldOverlay06`

**Pill Filter Button (for filter bars):**
- **Inactive:** `bgCard` background, `textSecondary` text, `caption` style, 20px border radius (pill), 8px vertical / 14px horizontal padding. Height: 32px.
- **Active:** `accentGold` background, `bgDeep` text. Same dimensions.
- **Press State:** Scale 0.95, 60ms spring. Haptic: `ImpactFeedbackStyle.Light`
- **Transition between states:** 200ms ease-in-out background color and text color change

### Navigation Bar

- **Background:** `bgNav` with 0.95 opacity + subtle blur (iOS vibrancy). On scroll, background transitions to full opacity over 100ms.
- **Height:** Standard iOS safe area (44px content + safe area inset)
- **Title:** Josefin Sans SemiBold 18px, uppercase, letter-spacing 1.5, `textPrimary`. Centered.
- **Back Button:** System chevron icon, 20px, `accentGold`
- **Right Actions:** Icon buttons, 22px, `accentGold`
- **Bottom Border:** None (clean separation via color difference) — OR 1px `border` if needed for contrast on certain screens

### Bottom Tab Bar

- **Background:** `bgNav` with 0.95 opacity + blur
- **Height:** Standard iOS (49px content + safe area inset)
- **Tab Items:**
  - **Inactive:** Icon 24px, `textDim`. Label in Josefin Sans Medium 10px, uppercase, letter-spacing 1.5, `textDim`. 4px gap between icon and label.
  - **Active:** Icon 24px, `accentGold`. Label in same style, `accentGold`.
  - **Transition:** 200ms color fade. No scale animation on the tab icons (feels cheap).
- **Haptic:** `ImpactFeedbackStyle.Light` on tab switch
- **Top Border:** 1px `border` (hairline separator)

### Modal / Bottom Sheet

- **Background:** `bgElevated`
- **Border Radius:** 16px on top-left and top-right corners (bottom corners square if full-height)
- **Handle:** 36px wide, 4px tall, `textDim` color, centered, 8px from top edge
- **Content Padding:** 24px horizontal, 16px top (below handle), 24px bottom + safe area
- **Backdrop:** `overlay` (semi-transparent dark scrim)
- **Entry Animation:** Spring slide-up, 400ms, dampingRatio 0.85
- **Exit Animation:** 250ms ease-in slide-down
- **Haptic:** `ImpactFeedbackStyle.Medium` when sheet reaches detent positions

### List Item

- **Height:** 56px (single-line), 72px (two-line)
- **Padding:** 16px horizontal
- **Left Element:** Icon or indicator, 24px, 16px right margin
- **Primary Text:** System Regular 15px, `textPrimary`
- **Secondary Text:** System Regular 13px, `textSecondary`, 2px below primary
- **Right Element:** Chevron (12px, `textDim`), toggle, or value text
- **Divider:** 1px `border`, inset to align with text start (56px from left edge)
- **Press State:** Background `goldOverlay06`, 80ms

### Dividers & Decorative Elements

**Simple Divider:**
1px horizontal line, `border` color, full width or inset.

**Section Divider with Label:**
```
─────────── CLASSICS ───────────
```
Two thin gold rules (`accentGoldDim`, 1px) extending from the label to the edges. Label in Josefin Sans SemiBold 11px, uppercase, letter-spacing 2.5, `accentGold`. 16px gap between rules and label text.

**Ornamental Divider:**
```
──────── ◇ ────────
```
Thin gold rule (1px, `accentGoldDim`) with centered diamond ornament (6x6px rotated square, `accentGold`). Used between major content sections on detail screens.

**Art Deco Corner Ornaments (for special cards/modals):**
L-shaped decorative elements at each corner, constructed from two perpendicular lines (16px long, 1px, `accentGoldDim`) meeting at a right angle with a small circle (4px diameter) or square (4px) at the vertex. Used only on featured/premium content — cocktail of the day, technique detail modals. Do NOT overuse — these are the "seasoning."

**Fan/Sunburst Decorative Element:**
For empty states or hero backgrounds, a half-sunburst with 12-16 rays emanating upward from a center point at the bottom. Rays are 1px `accentGoldDim` at 15% opacity. Purely atmospheric — sits behind content.

### Icon Style

- **Functional Icons (navigation, actions):** SF Symbols where available. 22-24px. Line weight matching SF Symbols' regular weight. `accentGold` when active, `textDim` when inactive.
- **Category/Decorative Icons (glassware, techniques):** Custom line icons with consistent 1.5px stroke weight. Geometric construction — built from circles, straight lines, and simple arcs (matching Art Deco principles). `textSecondary` default, `accentGold` when interactive.
- **Emoji (current implementation):** Retained for cocktail identification on browse cards. Displayed at 32px in a 56x56px container with `bgDeep` background and 8px border radius. Emoji are the "personality" element — they should feel like small illustrated plates in a cocktail book.

---

## 5. Spacing & Layout

### Grid System

- **Screen Margins:** 16px horizontal on browse/list screens, 24px horizontal on detail/editorial screens
- **Card Gutters:** 12px between cards in a vertical list
- **Section Spacing:** 32px between major sections (e.g., "Ingredients" and "Instructions" on a detail screen)
- **Subsection Spacing:** 16px between subsections within a section
- **Content Width:** Full width minus margins. No centered max-width column on phone — every pixel matters. On iPad, max content width of 600px, centered.

### Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `micro` | 2px | Hairline gaps, icon-to-badge spacing |
| `xs` | 4px | Tight internal padding (tag pills, badge padding) |
| `sm` | 8px | Default internal gap (icon-to-label, between stacked tags) |
| `md` | 12px | Card gutters, list item gaps, moderate padding |
| `lg` | 16px | Screen margins (browse), card internal padding, standard gap |
| `xl` | 20px | Generous internal padding |
| `xxl` | 24px | Screen margins (detail), section sub-spacing |
| `xxxl` | 32px | Between major sections |
| `section` | 48px | Hero-to-content gap, major page divisions |
| `hero` | 64px | Top-of-page hero spacing, screen-level breathing room |

### Border Radius Philosophy

**Sharp Deco angles for structure, soft rounds for interaction.**

- **Cards:** 12px — enough to feel modern, sharp enough to echo Deco geometry
- **Buttons (primary/secondary):** 8px — notably sharper than modern rounded buttons. This is a deliberate Deco reference — angular, architectural, like a stepped building facade
- **Filter Pills:** 20px (pill shape) — the exception. These are interactive affordances that benefit from a tactile, rounded shape
- **Modals/Sheets:** 16px on top corners — matches iOS convention while staying in design language
- **Emoji Containers:** 8px — small, sharp, frame-like
- **Avatar/Profile Images (if ever used):** Full circle — the only fully rounded element

**The principle:** Rectangular elements that contain content (cards, buttons, modals) maintain angular Deco character. Small interactive indicators (pills, toggles, dots) can be rounded. This creates a visual hierarchy where the architecture is geometric and the interactive touches are softer.

### Content Density Guidelines

**Browse Screens (Cocktails list, Techniques list, Favorites):**
- Medium density. Cards stacked with 12px gaps. Show 4-5 cards per screen on standard iPhone. User should see enough options to scroll through without feeling overwhelmed.

**Detail Screens (Cocktail detail, Technique detail):**
- Low density. Generous spacing. The hero section (emoji + name + subtitle + decorative divider) should occupy the top 35-40% of the screen. Ingredients and instructions below with 32px section gaps. This screen should feel editorial — like a page in a beautifully designed cocktail book.

**My Bar Screen:**
- Higher density. Ingredient list items at 56px height. This is a utility screen — efficiency matters more than atmosphere. Still maintain the visual language (gold accents, proper typography) but allow more items per screen.

**Filter/Search States:**
- Medium-high density. Active filters should be visible without scrolling. Search results can be slightly more compact (80px card height) to show more results.

---

## 6. Animation & Interaction

### Animation Principles

1. **Elegant, not playful.** Every animation should feel like a well-made mechanical watch — precise, purposeful, satisfying. No bouncing, wiggling, or cartoon physics.
2. **Spring-based by default.** Springs feel more physical and organic than linear or cubic-bezier timing. Use Reanimated's `withSpring` for all interactive animations.
3. **Fast acknowledgment, slow settle.** React instantly to touch (80ms), but let elements settle gracefully (300-500ms). The user should never wait for an animation to finish before they can act.
4. **Match haptic to motion.** Crisp/light haptics pair with sharp, fast animations. Medium haptics pair with slower, weightier movements.

### Spring Configurations

**Snappy (button presses, card taps, quick feedback):**
```
damping: 15, stiffness: 150, mass: 0.5
```
Duration: ~120ms to settle. Minimal overshoot. Used for press states, toggle switches, small UI changes.

**Smooth (page transitions, modal presentations, section reveals):**
```
damping: 20, stiffness: 100, mass: 0.8
```
Duration: ~400ms. Subtle overshoot (~2%). Used for entering/leaving screens, sheets sliding up, content expanding.

**Crisp (precise movements, no bounce needed):**
```
dampingRatio: 1.0, duration: 300
```
Critically damped — settles exactly at target with no oscillation. Used for color transitions, opacity changes, precise positioning.

**Celebratory (favorite heart, achievement moments):**
```
damping: 8, stiffness: 120, mass: 0.6
```
Duration: ~500ms with visible bounce (~15% overshoot). Used rarely — only for intentionally delightful moments.

### Transition Catalog

| Interaction | Animation | Duration | Haptic |
|---|---|---|---|
| **Card press** | Scale to 0.97, bg to `bgCardHover` | 80ms spring (Snappy) | `Impact.Light` |
| **Card release** | Scale to 1.0 with overshoot | 120ms spring (Snappy) | — |
| **Navigate to detail** | Shared element transition: card emoji scales and moves to hero position; background crossfades | 350ms spring (Smooth) | — |
| **Favorite toggle** | Heart scales 1.0 → 1.3 → 1.0 | 500ms spring (Celebratory) | `Notification.Success` |
| **Unfavorite** | Heart fades to outline | 200ms (Crisp) | `Impact.Light` |
| **Filter pill select** | Scale 0.95 → 1.0, bg/text color swap | 200ms (Crisp) | `Impact.Light` |
| **Tab switch** | Content fades out (100ms) then in (150ms). No horizontal slide. | 250ms total | `Impact.Light` |
| **Sheet present** | Slide up from bottom + backdrop fade | 400ms spring (Smooth) | `Impact.Medium` at detent |
| **Sheet dismiss** | Slide down + backdrop fade | 250ms ease-in | — |
| **Pull to refresh** | Custom: cocktail shaker icon appears, shakes at threshold | 300ms spring | `Impact.Medium` at threshold |
| **List item appear** | Fade in + slide up 8px, staggered 30ms per item | 250ms per item (Crisp) | — |
| **Search expand** | Search bar grows from icon to full width | 300ms spring (Smooth) | — |
| **Error shake** | Horizontal shake: translateX ±6px, 3 oscillations | 400ms | `Notification.Error` |

### Scroll Behaviors

- **Standard scroll:** Native iOS scroll physics (UIScrollView momentum). Do not override.
- **Sticky section headers:** On browse screens, category labels ("WHISKEY," "GIN," "TEQUILA") stick to the top of the scroll view as the user scrolls past them. Background: `bgPrimary` with 0.95 opacity + blur.
- **Navigation bar collapse (detail screen):** As the user scrolls down on the detail screen, the hero section (emoji + name) collapses. The cocktail name transitions from hero size (34px, centered) to navigation-bar title size (18px, centered in nav bar). This is a continuous animation driven by scroll position, not a discrete state change.
- **Parallax on hero images:** If cocktail images are added in the future, the image moves at 0.7x scroll speed relative to the scroll container, creating a subtle depth effect.

### Gold Shimmer Effect

For loading states and emphasis moments, a horizontal gradient sweep across gold elements:

- Gradient: `accentGoldDim` → `accentGoldBright` → `accentGoldDim`
- Width of highlight band: 40% of element width
- Animation: Left-to-right sweep, 1.5s duration, ease-in-out, repeating
- Usage: Skeleton loading placeholders, "cocktail of the day" reveal, decorative flourish on first launch

### Gesture Interactions

- **Swipe left on cocktail card:** Reveals action buttons (Favorite, Made It, Share) sliding in from the right. 60px wide each. Background: `accentGold` (Favorite), `accentAmber` (Made It), `accentCopper` (Share).
- **Long press on cocktail card:** Opens context menu (iOS native style) with: View Details, Add to Favorites, Mark as Made, Share. Haptic: `Impact.Heavy` on menu appearance.
- **Pull down on detail screen:** Dismisses back to browse (if presented modally) or triggers refresh.

---

## 7. Imagery & Iconography

### Photo Treatment

Currently, the app uses emoji for cocktail identification. If photography is introduced:

- **Dark overlay gradient:** Bottom-to-top, 60% `bgDeep` to 0% transparent. Ensures text readability over images.
- **Color grading:** Warm — increase amber tones, decrease blue. Photos should feel like they were taken in warm bar lighting, not clinical studio lighting.
- **Vignette:** Subtle darkening at edges (10-15%), creating a spotlight effect that mimics bar lighting.
- **Aspect Ratio:** 4:3 for card thumbnails, 16:9 for hero images on detail screens. Always fill the container (cover, not contain).
- **No filters:** Avoid sepia, grain, or other "vintage" photo filters. The vintage feeling comes from the surrounding UI, not from degrading the image quality.

### Illustration Style (if illustrations are introduced)

Follow the Gilbert Rumbold / Savoy Cocktail Book approach:
- **Geometric simplification:** Reduce subjects to circles, triangles, and straight lines
- **Flat fills:** Solid color, no gradients or shading within illustrations. Maximum 3 colors: `accentGold`, `textPrimary`, and one accent (varies by subject)
- **Bold outlines:** 2px stroke in `textPrimary` or `accentGoldDim`
- **Whimsical but elegant:** Characters (if any) should feel like stylized Art Deco figures — elongated, geometric, poised
- **White space as composition:** Illustrations float in space rather than filling containers

### Emoji Usage

Emoji are currently the primary visual identifier for cocktails. This is a valid design choice — emoji are universally recognizable, require no assets, and have personality.

**Rules for emoji in the design system:**
- **Always contained:** Emoji sit inside a rectangular container (56x56px on cards, 80x80px on detail) with `bgDeep` background and 8px border radius. The container gives them a "plate" quality — like small illustrations in a book.
- **No emoji in body text.** Emoji as inline text decoration looks casual. In Good Spirits, emoji are visual elements, not typographic ones.
- **Consistent per cocktail:** Each cocktail has one canonical emoji. It's part of the recipe data, not decorative choice.

### Decorative Elements Catalog

**1. Ornamental Divider (primary):**
Thin horizontal gold rule with centered diamond. Used between sections on detail screens.
- Rule: 1px, `accentGoldDim`
- Diamond: 6px square rotated 45deg, `accentGold` fill
- Total width: stretches to content margins

**2. Section Label Divider:**
Two horizontal rules flanking a text label.
- Rules: 1px, `accentGoldDim`, extending from label to content edges
- Label: Josefin Sans SemiBold 11px, uppercase, letter-spacing 2.5, `accentGold`
- Gap between rule and label: 12px

**3. Corner Ornaments:**
For featured content only (cocktail of the day card, welcome modal).
- Two perpendicular lines, 16px each, 1px `accentGoldDim`
- Small circle (4px diameter, `accentGold` fill) at the corner vertex
- Placed at all four corners of the container, inset 8px from edges

**4. Thin Border Frame:**
For the cocktail detail hero area.
- 1px `accentGoldDim` rectangle, inset 8px from container edges
- 8px border radius to match container radius

**5. Sunburst Background:**
For empty states and hero backgrounds.
- 16 rays emanating from bottom-center, spread across 180 degrees
- Rays: 1px, `accentGoldDim` at 10% opacity
- Subtle and atmospheric — never competes with content

**Usage Discipline:**
- Maximum of ONE decorative element per visible screen area (not counting dividers)
- Decorative elements use `accentGoldDim` or lower opacity — they should be felt, not stared at
- Detail screens get more decoration than browse screens (browse is for scanning, detail is for savoring)
- Never combine corner ornaments with a border frame on the same element

---

## 8. Screen Mockup Descriptions

### 8.1 Cocktails Browse Screen

**Status Bar:** Standard iOS, light content (white text/icons on dark).

**Navigation Bar (top):**
- Background: `bgNav` (#111128) at 0.95 opacity with blur
- Title: "COCKTAILS" — Josefin Sans SemiBold 18px, uppercase, letter-spacing 1.5, `textPrimary` (#F0E6D3). Centered.
- Right action: Search icon (SF Symbol `magnifyingglass`), 22px, `accentGold` (#C9A96E). Tapping expands to full search bar with 300ms spring animation.
- No left action (this is a root tab screen)
- No bottom border — color separation is sufficient

**Search Bar (when expanded):**
- Full width minus 32px margins
- Height: 40px
- Background: `bgCard` (#16213E)
- Border: 1px `border` (#2A2A4A)
- Border Radius: 8px
- Placeholder: "Search cocktails..." — System Regular 15px, `textDim` (#6B6355)
- Search icon: 16px, `textDim`, 12px from left edge
- Cancel button: "Cancel" — System Regular 15px, `accentGold`, 12px right of search field
- Clear button (when text entered): ✕ icon, 16px, `textDim`, right side of field

**Filter Bar (below search/nav):**
- Horizontal scrolling row of pill filter buttons
- Height: 48px (including 8px top and bottom padding)
- First pill: "All" (active by default)
- Subsequent pills: "Whiskey," "Gin," "Rum," "Tequila," "Vodka," "Brandy," "Other"
- Second row option (or toggleable): "Classic," "Modern," "Tiki," "Stirred," "Shaken," "Built"
- Pill spacing: 8px between pills
- Left margin: 16px (aligns with content)
- Right overflow: Fades to transparent at right edge to indicate scrollability
- Active pill: `accentGold` background, `bgDeep` text
- Inactive pill: `bgCard` background, `textSecondary` text
- Pill style: `caption` typography (System Medium 12px), 20px border radius, 6px vertical padding, 14px horizontal padding

**Cocktail List (main content):**
- Vertical scrolling FlatList
- Cards: 88px height, full width minus 32px (16px margins), 12px gap between cards
- 4-5 cards visible per screen on iPhone 15 Pro (393pt width, ~852pt height minus nav/tabs/filters)
- Cards render with staggered fade-in animation on first load: each card slides up 8px and fades in over 250ms, staggered 30ms apart
- Pull-to-refresh: Custom gold shimmer animation at top

**Individual Card Layout:**
- Left: Emoji in 56x56px container (`bgDeep`, 8px radius), 16px from left edge, vertically centered
- Content area: 12px right of emoji container
  - **Line 1:** Cocktail name — System SemiBold 16px, `textPrimary`. Right-aligned: star + rating ("★ 4.5") in System Medium 12px, `accentGold`
  - **Line 2:** Ingredient preview — System Regular 13px, `textSecondary`. Truncated to one line. E.g., "Rye Whiskey · Sweet Vermouth · Angostura"
  - **Line 3:** Tags row. Pills: System Medium 11px, 4px/8px padding, 12px pill radius. Spirit tag in `accentGold` text on `goldOverlay12` background. Style tag in `textSecondary` text on `bgElevated` background. Right-aligned: heart icon, 18px, `textDim` (unfavorited) or `accentGold` (favorited)
- Vertical spacing within card: Line 1 to Line 2: 4px. Line 2 to Line 3: 6px.

**Empty State (no search results):**
- Centered vertically in content area
- Subtle sunburst decorative element (16 rays, `accentGoldDim` at 10% opacity) behind content
- Emoji: 🍸 at 48px
- Text: "No cocktails found" — Josefin Sans Light 22px, `textPrimary`, centered. 12px below emoji.
- Subtext: "Try adjusting your filters" — System Regular 14px, `textSecondary`, centered. 8px below.

**Bottom Tab Bar:**
- Background: `bgNav` at 0.95 opacity with blur
- Top border: 1px `border`
- 5 tabs, evenly distributed:
  1. Cocktails (🍸 emoji or custom glass icon, 22px) — "COCKTAILS" label
  2. My Bar (🥃) — "MY BAR"
  3. Techniques (🧊) — "TECHNIQUES"
  4. History (📜) — "HISTORY"
  5. Favorites (❤️) — "FAVORITES"
- Active tab: `accentGold` icon and label. Inactive: `textDim`
- Label: Josefin Sans Medium 10px, uppercase, letter-spacing 1.5
- Icon-to-label gap: 4px

---

### 8.2 Cocktail Detail Screen

**Navigation Bar:**
- Background: transparent initially, fading to `bgNav` at 0.95 opacity as user scrolls (triggered when hero section is 50% scrolled off)
- Left: Back chevron, 20px, `accentGold`
- Center: Empty initially. As hero scrolls off, cocktail name fades in — Josefin Sans SemiBold 16px, uppercase, `textPrimary`. This is a scroll-driven continuous animation.
- Right: Share icon + overflow menu (···), each 22px, `accentGold`

**Hero Section:**
- Background: `bgDeep` with subtle radial gradient (lighter at center, darker at edges)
- Top padding: 16px below nav bar
- Emoji: 80px, centered horizontally
- Cocktail Name: 16px below emoji. Josefin Sans Light 34px, uppercase, letter-spacing 3.0, `textPrimary`, centered. Example: "MANHATTAN"
- Subtitle: 8px below name. Josefin Sans Regular 13px, uppercase, letter-spacing 2.0, `textSecondary`, centered. Example: "A CLASSIC STIRRED COCKTAIL"
- Ornamental Divider: 20px below subtitle. 80px wide, centered. 1px gold rule with centered diamond (6px rotated square, `accentGold`).
- Metadata Row: 16px below ornament. Centered. Three items separated by ` · `:
  - Star rating: "★★★★☆" in `accentGold` 14px
  - Made count: "Made 3 times" in `textSecondary` 13px
  - Favorite heart: 20px, `accentGold` if favorited
- Total hero height: approximately 280px

**Content Body (scrollable below hero):**
- Background: `bgPrimary`
- Top padding: 24px

**Ingredients Section:**
- Section header: Ornamental label divider — "INGREDIENTS" flanked by gold rules
- 16px below header: ingredient list begins
- Each ingredient row: 48px height
  - Left column (64px wide, right-aligned): Measurement — System Regular 15px, `textSecondary`. E.g., "2 oz"
  - 12px gap
  - Center column: Ingredient name — System SemiBold 15px, `textPrimary`. E.g., "Rye Whiskey"
  - Right column: Availability dot — 8px circle, `success` (green) if in user's bar, `error` (red) if not, `textDim` (gray) if not tracked
  - Bottom border: 1px `border`, inset to align with ingredient name column
- Below last ingredient: 12px gap, then "Add missing to shopping list" ghost button if any ingredients are missing

**Instructions Section:**
- 32px below Ingredients section
- Section header: "INSTRUCTIONS" ornamental label divider
- 16px below header: steps begin
- Each step:
  - Step number: Josefin Sans SemiBold 18px, `accentGold`, 32px wide, top-aligned
  - Step text: System Regular 15px, `textPrimary`, 1.5 line height. Adjacent to number.
  - 16px gap between steps
- Example:
  ```
  1   Add rye whiskey, sweet vermouth, and Angostura
      bitters to a mixing glass with ice.

  2   Stir for 30 seconds until well-chilled.

  3   Strain into a chilled coupe glass.

  4   Garnish with a brandied cherry.
  ```

**Garnish Section (if applicable):**
- 24px below Instructions
- Section header: "GARNISH" ornamental label divider
- Single line: System Regular 15px, `textPrimary`. E.g., "Brandied cherry or lemon twist"

**Notes Section (if user has notes):**
- 32px below last section
- Background: `bgCard`, 12px radius, 16px padding
- Header: "YOUR NOTES" — System SemiBold 13px, uppercase, letter-spacing 1.0, `textSecondary`. Right side: "Edit" ghost button
- Note text: System Regular 15px, `textSecondary`, italic

**Variations Section (if cocktail has variants):**
- 32px below previous section
- Section header: "VARIATIONS" ornamental label divider
- Horizontal scrolling cards, 200px wide, 120px height, 12px gap
- Each variation card:
  - Background: `bgCard`, 12px radius, 12px padding
  - Name: System SemiBold 14px, `textPrimary`
  - Description: System Regular 12px, `textSecondary`, 2 lines max
  - Bottom: "→ View" in `accentGold`, 12px, right-aligned

**Bottom Safe Area:** 24px padding below last content section, plus safe area inset.

---

### 8.3 My Bar Screen

**Navigation Bar:**
- Title: "MY BAR" — Josefin Sans SemiBold 18px, uppercase
- Right action: "+" add icon, 22px, `accentGold` — opens ingredient search sheet

**Summary Header:**
- Background: `bgCard`, full width, 16px padding
- Left: "You can make" — System Regular 15px, `textSecondary`
- Center/Right: "47 cocktails" — System SemiBold 22px, `accentGold`. The number uses Josefin Sans SemiBold for extra personality.
- Below: "with 23 ingredients" — System Regular 13px, `textSecondary`
- Bottom border: ornamental divider (thin gold rule with diamond)
- Total height: ~80px

**Category Sections:**
The ingredient list is grouped by category. Each category:

- **Category Header:** Sticky on scroll. Background: `bgPrimary` at 0.95 opacity with blur. Josefin Sans SemiBold 14px, uppercase, letter-spacing 2.0, `accentGold`. Left-aligned, 16px margin. Right side: count ("6 items") in System Regular 12px, `textSecondary`. Bottom border: 1px `accentGoldDim`.

- **Ingredient Items:** 56px height, 16px horizontal padding.
  - Left: Green checkmark circle (20px, `success` background, white checkmark) if owned. Tap to toggle.
  - 12px gap
  - Name: System Regular 15px, `textPrimary`
  - Below name: Brand preference (if set) — System Regular 12px, `textSecondary`, italic. E.g., "Rittenhouse"
  - Right: Chevron, 12px, `textDim`
  - Tapping opens ingredient detail (brand preference, related cocktails)
  - Bottom divider: 1px `border`, inset to align with name text

- **Categories in order:** Spirits, Liqueurs, Mixers, Bitters, Sweeteners, Garnishes, Other

**"What Should I Buy Next?" Section:**
- 32px below last category
- Background: `bgCard`, 16px padding, 12px radius
- Corner ornaments (the decorative L-shapes at all four corners — this is a featured content area)
- Header: "NEXT BOTTLE TO BUY" — Josefin Sans SemiBold 14px, uppercase, `accentGold`
- Below: recommended ingredient with count of new cocktails it unlocks
  - Ingredient: System SemiBold 16px, `textPrimary`. E.g., "Campari"
  - Unlock count: "Unlocks 8 new cocktails" — System Regular 14px, `textSecondary`
  - Cocktail preview: first 3 cocktail names in `accentGold` 13px, e.g., "Negroni · Americano · Boulevardier"
  - CTA: Primary button "Add to Bar" (full width, 48px height)

---

### 8.4 Techniques Screen

**Navigation Bar:**
- Title: "TECHNIQUES" — Josefin Sans SemiBold 18px, uppercase

**Introduction:**
- 16px top padding
- Text: System Regular 15px, `textSecondary`, 16px horizontal padding. "Master the fundamentals. Each technique unlocks a world of cocktails."
- Below: ornamental divider, 16px bottom margin

**Technique Cards:**
Vertical list of cards, full width minus 32px, 12px gap between cards.

Each card:
- Background: `bgCard`, 12px radius, 20px padding
- **Top line:** Technique name — Josefin Sans SemiBold 18px, uppercase, letter-spacing 1.5, `textPrimary`. E.g., "STIRRING"
- **12px below:** Ornamental divider (thin gold rule with diamond, width: 60px, left-aligned)
- **12px below divider:** Description — System Regular 15px, `textSecondary`, 1.5 line height, 3 lines max. E.g., "The elegant method for spirit-forward cocktails. A proper stir chills and dilutes without introducing air bubbles."
- **16px below description:** Related cocktails — "USED IN:" label (System Medium 11px, `textDim`, uppercase) followed by cocktail names in `accentGold` 13px, wrapping if needed. E.g., "Manhattan · Martini · Negroni · Old Fashioned"
- **Press state:** Scale 0.98, background to `bgCardHover`, 80ms. Navigates to technique detail.
- **Card height:** Auto (content-driven), approximately 160-180px

**Technique Detail (pushed screen):**
- Full-screen scrollable view
- Hero: Technique name in `hero` style (Josefin Sans Light 34px, centered, uppercase)
- Below: step-by-step instructions with numbered steps (same format as cocktail instructions)
- Below: grid of related cocktails (2-column grid of mini cocktail cards: emoji + name + rating)

---

### 8.5 Favorites Screen

**Navigation Bar:**
- Title: "FAVORITES" — Josefin Sans SemiBold 18px, uppercase
- Right action: Sort icon (SF Symbol `arrow.up.arrow.down`), 20px, `accentGold`

**Content States:**

**With Favorites:**
- Same card format as Cocktails Browse screen (88px cocktail cards)
- No filter bar (favorites are already curated)
- Sort options (via sort button): "Date Added," "Name A-Z," "Rating"
- Cards list with 12px gaps, 16px horizontal margins
- Swipe-left on card: "Remove" action with `error` background

**Empty State:**
- Centered vertically
- Sunburst decorative background (16 rays, `accentGoldDim` at 10%)
- Emoji: ❤️ at 48px, centered
- 16px below: "No favorites yet" — Josefin Sans Light 22px, `textPrimary`, centered
- 8px below: "Tap the heart on any cocktail to save it here" — System Regular 14px, `textSecondary`, centered, max-width 280px
- 24px below: Secondary button "Browse Cocktails" (outlined, `accentGold`, 48px height, 200px width, centered)

---

### 8.6 Bottom Tab Bar (Global)

**Persistent across all tab screens. Not shown during pushed detail screens on iOS (standard behavior).**

**Specifications:**
- **Background:** `bgNav` (#111128) at 0.95 opacity with background blur (UIBlurEffect equivalent)
- **Top border:** 1px `border` (#2A2A4A) — hairline separator
- **Height:** 49px content area + safe area bottom inset (34px on modern iPhones) = 83px total
- **Layout:** 5 tabs, evenly distributed across full width

**Per Tab:**
- **Touch target:** Full width/5 × full height (minimum 44px tall)
- **Icon:** 24px, centered horizontally in touch target, 6px from top
- **Label:** Josefin Sans Medium 10px, uppercase, letter-spacing 1.5, centered, 4px below icon

**Tab Definitions:**
| Tab | Icon/Emoji | Label | Active Color | Inactive Color |
|---|---|---|---|---|
| Cocktails | 🍸 (or custom coupe glass line icon) | COCKTAILS | `accentGold` | `textDim` |
| My Bar | 🥃 (or custom rocks glass line icon) | MY BAR | `accentGold` | `textDim` |
| Techniques | 🧊 (or custom shaker line icon) | TECHNIQUES | `accentGold` | `textDim` |
| History | 📜 (or custom scroll line icon) | HISTORY | `accentGold` | `textDim` |
| Favorites | ❤️ (or custom heart line icon) | FAVORITES | `accentGold` | `textDim` |

**Interaction:**
- Tapping an active tab scrolls its content to top (standard iOS behavior)
- Tapping an inactive tab switches content with a crossfade (100ms out, 150ms in)
- Haptic: `ImpactFeedbackStyle.Light` on every tab tap
- No scale animation on tab icons (this is a navigation element, not a playful interaction)

**Icon Transition:**
When a tab becomes active, the icon color transitions from `textDim` to `accentGold` over 200ms with ease-in-out timing. If using custom line icons (future): the inactive icon is outline-only, the active icon fills with `accentGold`. This provides clear state indication without animation excess.

---

## Appendix A: Quick Reference — Token Summary

### Colors (Palette A — The Savoy)
```
Backgrounds:  #0B0E1A  #1A1A2E  #16213E  #1C2A4A  #111128
Gold System:  #D4AF37  #C9A96E  #E0C992  #A08550  #8B6914
Text:         #F0E6D3  #A09880  #6B6355
Borders:      #2A2A4A  #3A3A5A
Semantic:     #6BBD7B  #E8A87C  #E07070
Warm Accents: #D4A053  #B87333
```

### Typography
```
Display Font: Josefin Sans (Light 300, SemiBold 600)
UI Font:      System (SF Pro / Roboto)
Scale:        hero 34 · display 28 · h1 22 · h2 18 · h3 16 · body 15 · secondary 13 · caption 12 · micro 10 · label 11
```

### Spacing
```
micro 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 24 · xxxl 32 · section 48 · hero 64
```

### Border Radius
```
sm 8 · md 12 · lg 16 · pill 20 · circle 9999
```

### Animation Springs
```
Snappy:       damping 15, stiffness 150, mass 0.5
Smooth:       damping 20, stiffness 100, mass 0.8
Crisp:        dampingRatio 1.0, duration 300
Celebratory:  damping 8, stiffness 120, mass 0.6
```

---

## Appendix B: Accessibility Checklist

- [ ] All text meets WCAG AA contrast ratios (4.5:1 for body, 3:1 for large text) against its background
- [ ] `textPrimary` (#F0E6D3) on `bgPrimary` (#1A1A2E): contrast ratio 10.2:1 (passes AAA)
- [ ] `textSecondary` (#A09880) on `bgPrimary` (#1A1A2E): contrast ratio 5.1:1 (passes AA)
- [ ] `accentGold` (#C9A96E) on `bgPrimary` (#1A1A2E): contrast ratio 5.8:1 (passes AA)
- [ ] `textDim` (#6B6355) on `bgPrimary` (#1A1A2E): contrast ratio 3.1:1 (passes AA for large text only — use at 16px+ or as non-essential decorative text)
- [ ] All interactive elements have minimum 44x44px touch targets
- [ ] Haptic feedback reinforces but never replaces visual feedback
- [ ] Decorative elements have `accessibilityElementsHidden={true}`
- [ ] Support Dynamic Type scaling (at minimum: body, secondary, caption sizes)
- [ ] Gold accent is never the sole indicator of state — always paired with shape, icon, or text change
- [ ] Animations respect `UIAccessibility.isReduceMotionEnabled` — fall back to instant state changes

---

*"I am prepared to believe that a dry Martini slightly impairs the palate, but think what it does for the soul."* — Alec Waugh

*This design system is a living document. It defines the visual soul of Good Spirits — a place where the craft of the 1920s meets the clarity of 2026.*
