---
name: Cyan Modern
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2ec'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3038'
  inverse-on-surface: '#eff0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#006a68'
  primary: '#006765'
  on-primary: '#ffffff'
  primary-container: '#008280'
  on-primary-container: '#f3fffe'
  inverse-primary: '#68d8d5'
  secondary: '#005ac4'
  on-secondary: '#ffffff'
  secondary-container: '#4f8eff'
  on-secondary-container: '#00275e'
  tertiary: '#964400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bd5700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#86f4f1'
  primary-fixed-dim: '#68d8d5'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#00504e'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#aec6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004396'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2ec'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
---

# Design System: Cyan Modern

## Brand & Style
The brand identity has shifted from a warm, industrial orange to a tech-forward, vibrant cyan and blue aesthetic. The personality is professional yet energetic, leaning into a **Corporate / Modern** style with a focus on precision and digital-first interactions. It aims to evoke a sense of reliability and innovation through a cool-toned palette and high-legibility typography.

## Colors
The color palette is dominated by a bright, electric cyan (`#7ae9e6`) as the primary brand color, supported by a deep digital blue (`#4081f1`) for secondary actions and structural emphasis. The shift to a light color mode with these specific hues creates a refreshing, "clean tech" atmosphere. Primary elements utilize the cyan for high visibility, while the secondary blue provides necessary contrast and depth.

## Typography
The system has transitioned from Public Sans to **Inter**, a typeface designed for screens. This change emphasizes clarity and a modern, neutral aesthetic. Headlines are bold and tightly spaced, while body text maintains high readability. The scale is disciplined, ensuring a consistent rhythm across desktop and mobile interfaces.

## Layout & Spacing
The layout uses a fluid grid system with a base unit of 8px. This creates a balanced, mathematical rhythm. Gutters are set to 16px to maintain clear separation between content blocks. On mobile, margins reduce to 16px, while desktop layouts expand to accommodate larger containers with 24px or 32px of internal padding.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and soft, ambient shadows. Instead of heavy borders, the interface uses subtle changes in surface color and light, diffused shadows to indicate hierarchy. Primary surfaces are white, with secondary containers using very light neutral tints to create a "stacked" effect.

## Shapes
The design has moved away from sharp, 0px corners to a **Rounded** aesthetic. Standard components feature a 0.5rem (8px) corner radius, providing a more approachable and modern feel. Large containers like cards use 1rem (16px) radius, while specific UI accents like chips or buttons may utilize larger radii for a friendlier appearance.

## Components
- **Buttons:** Use the Primary Cyan for main calls to action with dark text for contrast. Secondary buttons use the Blue. All feature 8px rounded corners.
- **Inputs:** Clean, outlined fields with a 1px border. Focus states use the Blue secondary color.
- **Cards:** White background with a subtle shadow and 16px corner radius.
- **Chips:** Highly rounded (pill-shaped) to distinguish them from buttons, using light tints of the primary cyan.