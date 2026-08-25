---
name: Aurelian Press
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#43474e'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#476083'
  primary: '#000613'
  on-primary: '#ffffff'
  primary-container: '#001f3f'
  on-primary-container: '#6f88ad'
  inverse-primary: '#afc8f0'
  secondary: '#60603e'
  on-secondary: '#ffffff'
  secondary-container: '#e6e5b9'
  on-secondary-container: '#666643'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f0'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#e6e5b9'
  secondary-fixed-dim: '#cac99f'
  on-secondary-fixed: '#1d1d03'
  on-secondary-fixed-variant: '#484828'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
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
---

## Brand & Style

The design system is anchored in the "Modern Editorial" aesthetic—a fusion of classical publishing prestige and contemporary digital precision. It is designed to evoke a sense of authority, intellectual rigor, and tactile luxury. The target audience includes authors, literary agents, and discerning readers who value the "objecthood" of a book even in a digital space.

The style leverages **Minimalism** through generous whitespace and **Corporate Modern** structures for reliability. It uses high-contrast typography and a restricted color palette to mimic the experience of reading a high-end physical journal or a limited-edition hardcover. The UI should feel curated rather than crowded, prioritizing legibility and a calm, focused atmosphere.

## Colors

The palette is defined by traditional bookbinding materials. 
- **Primary (Deep Navy):** Used for primary navigation, headings, and high-emphasis backgrounds. It provides a stable, authoritative foundation.
- **Secondary (Rich Cream):** This is the primary surface color. It reduces eye strain compared to pure white and evokes the texture of premium acid-free paper.
- **Tertiary (Subtle Gold):** Reserved for "moments of excellence"—call-to-action buttons, active states, and ornamental flourishes. 
- **Neutral (Ink Black):** A slightly softened black used for body text to maintain high legibility against the cream background without the harshness of pure #000000.

## Typography

Typography is the cornerstone of this design system. We utilize a high-contrast pairing to establish a clear hierarchy. 

**Playfair Display** is used for all major headings. Its high-contrast strokes and elegant serifs communicate the startup's literary heritage. For large display sizes, use tighter letter spacing to maintain a sophisticated, "locked-in" look.

**Inter** serves as the functional workhorse. It provides a clean, neutral counterpoint to the decorative serif. It is used for all body copy, UI labels, and data-heavy tables to ensure maximum readability and a modern feel. Labels should use increased letter spacing and uppercase styling to differentiate them from body text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain the controlled feel of a printed page. 
- **Desktop:** A 12-column grid with a max-width of 1280px. Margins are intentionally wide (64px) to create a "frame" around the content, emphasizing the premium nature of the brand.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows a strict 8px linear scale. Large vertical gaps (e.g., 80px or 120px) should be used between major page sections to allow the typography to "breathe," mirroring the generous margins found in luxury book design.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh, floating shadows, opting instead for a "grounded" feel.

- **Surface Levels:** The base level is the Rich Cream (#FFFDD0). Secondary surfaces (like sidebars or cards) use a slightly lighter or darker tint of the cream to create subtle separation.
- **Shadows:** Use extremely diffused, low-opacity shadows with a hint of the primary Navy color in the shadow's tint (e.g., `box-shadow: 0 4px 20px rgba(0, 31, 63, 0.08)`). This makes the UI feel like physical layers of paper stacked atop one another.
- **Refined Borders:** Use thin (1px) borders in a muted version of the Navy or Gold for card containers to provide structure without adding visual bulk.

## Shapes

The shape language is **Soft**. We use a 0.25rem (4px) base radius for buttons and input fields. This slight rounding removes the "sharpness" of a purely brutalist design while remaining more professional and serious than the highly rounded "bubbly" styles used in social media apps. Large cards may use the `rounded-lg` (8px) setting to feel more substantial.

## Components

- **Buttons:** Primary buttons use the Deep Navy background with Gold text or Gold accents. They should have a subtle hover transition where the background darkens slightly.
- **Input Fields:** Use a "minimalist paper" style—only a bottom border (1px) in a neutral gray, which turns Navy or Gold on focus.
- **Cards:** Cards should have a 1px border (#001F3F at 10% opacity) and the soft ambient shadow mentioned in the Elevation section. They are used to highlight book covers or author profiles.
- **Chips:** Used for genre tags (e.g., "Historical Fiction"). These should be outlined in the Primary Navy color with uppercase Label-MD typography.
- **Book Previewer:** A custom component specific to this system. It should feature a large serif heading, a "drop cap" for the start of the text, and a high-contrast layout that mimics a physical book's interior.
- **Lists:** Use elegant, wide-spaced list items with a thin horizontal separator between them to maintain an organized, ledger-like appearance.