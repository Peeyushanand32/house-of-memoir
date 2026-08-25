---
name: House of Memoir
colors:
  surface: '#fbf8fa'
  surface-dim: '#e1d8d4'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f4'
  surface-container: '#f0edee'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303031'
  inverse-on-surface: '#f3f0f1'
  outline: '#75777d'
  outline-variant: '#c5c6cc'
  surface-tint: '#555f70'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#121c2a'
  on-primary-container: '#7a8496'
  inverse-primary: '#bdc7da'
  secondary: '#615e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e8e1de'
  on-secondary-container: '#686461'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#231b00'
  on-tertiary-container: '#9b812a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e3f7'
  primary-fixed-dim: '#bdc7da'
  on-primary-fixed: '#121c2a'
  on-primary-fixed-variant: '#3d4757'
  secondary-fixed: '#e8e1de'
  secondary-fixed-dim: '#cbc5c3'
  on-secondary-fixed: '#1d1b1a'
  on-secondary-fixed-variant: '#494644'
  tertiary-fixed: '#ffe085'
  tertiary-fixed-dim: '#e3c466'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
  ink-black: '#1e1b18'
  paper-cream: '#fff8f5'
  heritage-navy: '#000613'
  gold-leaf: '#735c00'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap-lg: 120px
  section-gap-md: 80px
---

## Brand & Style

The design system for **House of Memoir** is anchored in a "Modern Editorial" aesthetic—a fusion of classical publishing prestige and contemporary digital precision. It is designed to evoke a sense of authority, intellectual rigor, and tactile luxury, positioning the platform as a premier destination for personal history and literary legacy.

The style leverages **Minimalism** through generous whitespace and **Corporate Modern** structures to ensure reliability. It utilizes high-contrast typography and a restricted color palette to mimic the experience of reading a high-end physical journal or a limited-edition hardcover. The UI is curated and intentional, prioritizing legibility and a calm, focused atmosphere that respects the weight of the stories being told.

## Colors

The palette is defined by traditional bookbinding materials and archival elements.

- **Primary (Heritage Navy):** Used for primary navigation, headings, and high-emphasis backgrounds. It provides a stable, authoritative foundation.
- **Secondary (Paper Cream):** This is the primary surface color. It reduces eye strain compared to pure white and evokes the texture of premium acid-free paper.
- **Tertiary (Gold Leaf):** Reserved for "moments of excellence"—call-to-action buttons, active states, and ornamental flourishes.
- **Neutral (Ink Black):** A softened black used for body text to maintain high legibility against the cream background while avoiding the harshness of digital pure black.

## Typography

Typography is the cornerstone of this design system, utilizing a high-contrast pairing to establish a clear hierarchy.

**Playfair Display** is used for all major headings. Its high-contrast strokes and elegant serifs communicate the brand's literary heritage. For large display sizes, use tighter letter spacing to maintain a sophisticated, "locked-in" editorial look.

**Inter** serves as the functional workhorse. It provides a clean, neutral counterpoint to the decorative serif. It is used for all body copy, UI labels, and inputs to ensure maximum readability. Labels should use increased letter spacing and uppercase styling to differentiate them from long-form body text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain the controlled, deliberate feel of a printed page.

- **Desktop:** A 12-column grid with a max-width of 1280px. Margins are intentionally wide (64px) to create a "frame" around the content, emphasizing the premium nature of the brand.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows a strict 8px linear scale. Large vertical gaps should be used between major page sections to allow the typography to "breathe," mirroring the generous margins found in luxury book design and traditional typesetting.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh, floating effects, opting instead for a "grounded" feel reminiscent of physical layers.

- **Surface Levels:** The base level is the Paper Cream. Secondary surfaces (like sidebars or cards) use a slightly lighter or darker tint (Surface-Dim) to create subtle separation.
- **Shadows:** Use extremely diffused, low-opacity shadows with a hint of the Heritage Navy color in the shadow's tint to ground elements. Shadows should feel like the natural cast of stacked paper rather than digital elevation.
- **Refined Borders:** Use thin (1px) borders in a muted version of Navy or Gold for card containers to provide structure without adding visual bulk.

## Shapes

The shape language is **Soft**. We use a 0.25rem (4px) base radius for buttons and input fields. This slight rounding removes the "sharpness" of a purely brutalist design while remaining more professional and serious than the highly rounded styles typical of consumer social apps. Large cards may use the `rounded-lg` (8px) setting to feel more substantial and permanent.

## Components

- **Buttons:** Primary buttons use the Heritage Navy background with Gold or Cream text. They should have a subtle hover transition where the background shifts in tone or adds a thin Gold border.
- **Input Fields:** Use a "minimalist paper" style—primarily a bottom border (1px) in a neutral gray, which turns Navy or Gold on focus.
- **Cards:** Cards should have a 1px border at 10% opacity and the soft ambient shadow mentioned in the Elevation section. They are used to highlight book covers or memoir snippets.
- **Chips:** Used for genre or status tags. These should be outlined in the Primary Navy color with uppercase Label-MD typography and generous horizontal padding.
- **Memoir Previewer:** A custom component specific to this system. It should feature a large serif heading, a "drop cap" for the start of the text, and a high-contrast layout that mimics a physical book's interior.
- **Lists:** Use elegant, wide-spaced list items with a thin horizontal separator between them to maintain an organized, ledger-like appearance.