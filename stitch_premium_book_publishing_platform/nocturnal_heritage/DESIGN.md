---
name: Nocturnal Heritage
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353536'
  on-surface: '#e4e2e3'
  on-surface-variant: '#c5c6cc'
  inverse-surface: '#e4e2e3'
  inverse-on-surface: '#303031'
  outline: '#8f9096'
  outline-variant: '#44474c'
  surface-tint: '#bdc7da'
  primary: '#bdc7da'
  on-primary: '#273140'
  primary-container: '#000613'
  on-primary-container: '#6e788a'
  inverse-primary: '#555f70'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#cbc5c3'
  on-tertiary: '#33302e'
  tertiary-container: '#070605'
  on-tertiary-container: '#7b7775'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e3f7'
  primary-fixed-dim: '#bdc7da'
  on-primary-fixed: '#121c2a'
  on-primary-fixed-variant: '#3d4757'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e8e1de'
  tertiary-fixed-dim: '#cbc5c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#494644'
  background: '#131314'
  on-background: '#e4e2e3'
  surface-variant: '#353536'
  heritage-navy: '#000613'
  gold-accent: '#D4AF37'
  paper-white: '#FFF8F5'
  ink-dim: '#75777D'
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
    letterSpacing: 0.1em
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
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 128px
  container-max: 1200px
---

## Brand & Style

This design system is a premium, high-contrast evolution of an editorial aesthetic, specifically tailored for a sophisticated dark-mode experience. The brand personality is one of **prestige, archival permanence, and quiet luxury**. It targets an audience that values legacy, storytelling, and high-end digital craftsmanship.

The design style is a blend of **Minimalism** and **Glassmorphism**, set against a **High-Contrast** backdrop. By utilizing a deep, atmospheric navy base, the UI evokes the feeling of a private library at night. The interface prioritizes focus through vast negative space, sharp typographic hierarchy, and the strategic use of gold highlights to signify "moments of truth." The emotional response should be one of profound calm, intellectual depth, and the tactile sensation of a luxury leather-bound volume.

To maintain the premium feel, all transitions must be deliberate and smooth. The experience should feel like turning the heavy pages of a custom-made book—weighted, intentional, and graceful.

## Colors

The color palette is architected for a high-contrast dark environment that maintains readability while exuding luxury.

- **Primary (Heritage Navy - #000613):** The foundation. This deep, near-black navy is used for all primary surfaces and background layers. It provides a more sophisticated depth than a pure digital black.
- **Secondary (Gold Accent - #D4AF37):** Reserved for highlights, primary call-to-actions, and ornamental elements. It mimics metallic gold leaf found on classic book spines.
- **Tertiary (Paper White - #FFF8F5):** An off-white cream used for all primary body text and headlines. This high-contrast pairing ensures accessibility and provides a warmth that prevents the dark theme from feeling cold.
- **Neutral (Ink Dim - #75777D):** A mid-tone grey used for secondary information, borders, and disabled states to maintain a clear visual hierarchy.

## Typography

The typography system relies on the classical tension between a high-contrast serif and a modern sans-serif.

**Playfair Display** is the signature face, used for all display and headline levels. In this dark theme, the thin strokes of the serif must be protected; avoid weights below 600 for headlines to prevent "thinning out" against the dark background.

**Inter** provides the functional clarity required for long-form reading and UI interaction. For **Label-MD**, use uppercase styling and increased letter-spacing (0.1em) to create an elegant, small-caps effect suitable for navigation and categories. 

The line height for body copy is intentionally generous (1.6) to facilitate an effortless reading experience, reminiscent of premium editorial layouts.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model to ensure a curated, book-like composition on larger screens.

- **Desktop:** A 12-column grid with a narrow 1200px container and wide 80px margins. The wide margins act as a "mat" for the content, enhancing the gallery-like feel.
- **Tablet:** 8-column grid with 40px margins.
- **Mobile:** 4-column grid with 20px margins.

Spacing follows an 8px base unit. Section gaps are intentionally large (128px) to provide a clear mental break between different chapters of content. Components should use internal padding that favors vertical space, emphasizing the editorial vertical rhythm.

## Elevation & Depth

In this dark, high-contrast theme, elevation is achieved through **Backdrop Blurs** and **Tonal Tiering** rather than traditional drop shadows.

- **Surface Tiers:** The base level is the Heritage Navy. Elevated containers (like cards or menus) use a slightly lighter navy variant or a semi-transparent glass effect (10% opacity Paper White) with a 20px backdrop blur.
- **Borders:** Instead of shadows, use "Ghost Borders"—1px strokes at very low opacity (15%) of the Gold or Paper White color to define element boundaries.
- **Parallax:** To create a sense of physical depth, implement subtle parallax on background imagery or decorative gold flourishes. Background elements should move at 0.1x scroll speed, creating a layered, "archival" feel.

## Shapes

The shape language is **Soft (0.25rem)**. This minimal rounding maintains the structural integrity of a serious, editorial product. Sharp corners are avoided to prevent a "brutalist" feel, but large radii are also avoided to ensure the UI does not appear too consumer-grade or playful. 

Use 4px for buttons and inputs, and 8px (rounded-lg) for large content cards to give them a slightly more substantial, protective feel.

## Components

- **Buttons:** Primary buttons feature a solid Gold background with Heritage Navy text. Hover states should trigger a subtle expansion of the button (1.02x scale) and a gentle outer glow. Secondary buttons use a Gold 1px border with no fill.
- **Inputs:** Use the "Archival" style: a simple 1px bottom border in Paper White (30% opacity). Upon focus, the border becomes solid Gold and the label floats upward using a smooth ease-in-out transition.
- **Cards:** Cards are semi-transparent with a 1px border and a subtle backdrop blur. They should fade into view with a 20px upward slide when entering the viewport.
- **Animations:** 
    - **Fade-Ins:** All major content sections use a 0.8s ease-out fade with a slight Y-axis offset.
    - **Hover States:** Links and interactive elements should utilize a "Gold-underline" animation that grows from the center outwards.
    - **Transitions:** Page transitions should employ a "cinematic fade" (black-out/black-in) to maintain the nocturnal atmosphere.
- **Editorial Flourish:** Use a "Drop Cap" for the beginning of memoir articles, rendered in Gold Playfair Display, spanning three lines of body text.