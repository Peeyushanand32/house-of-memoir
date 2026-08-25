---
name: Cyan Logic
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
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
---

# Cyan Logic Design System

## Visual Identity
The brand identity represents "Cyan Logic"—a cool, tech-forward, and precision-oriented aesthetic. The style is **Corporate / Modern**, leaning heavily into clarity, reliability, and digital fluidity. The UI evokes a sense of calm efficiency through a predominantly cool color palette and the use of Inter's highly legible glyphs. The visual language is structured yet approachable, moving away from the harshness of zero-radius corners to a more balanced, slightly rounded interface.

## Colors
The color palette is anchored by a high-energy primary cyan and a deep, reliable secondary blue. This combination creates a "Fidelity" color mapping that emphasizes digital precision.

*   **Primary (#7ae9e6):** An electric cyan used for key actions, highlights, and active states. It provides a high-contrast focal point against white backgrounds.
*   **Secondary (#4081f1):** A classic royal blue used for structural elements, secondary actions, and providing visual weight to the interface.
*   **Neutral:** Derived from the core seed color to ensure harmony, resulting in cool greys that maintain the "Logic" aesthetic without feeling muddy.

The system defaults to a **light mode** configuration.

## Typography
We have consolidated our typeface to **Inter** across all levels to maximize legibility and maintain a cohesive, modern look. Inter's tall x-height and tight spacing make it ideal for data-heavy applications.

- **Headlines:** Set in bold weights with reduced letter-spacing for a "tech" feel. Large headlines scale up to 32px.
- **Body:** Standardized at 16px for optimal readability with generous line heights (1.5x).
- **Labels:** Medium weights are used for utility text and button labels to ensure they stand out even at smaller scales.

## Layout & Spacing
The layout follows a **Fluid Grid** model with an 8px base unit. This ensures vertical rhythm across all components.

- **Gutters:** 16px (md) on mobile, scaling to 24px (lg) on desktop.
- **Margins:** 16px on mobile to maximize screen real estate, increasing to 48px or auto-centering on larger displays.
- **Breakpoints:** Mobile (under 600px), Tablet (600px-1024px), Desktop (1024px+).

## Elevation & Depth
Depth is communicated through **Tonal Layers** rather than heavy shadows. We use subtle shifts in background saturation (using the cool neutral tones) to indicate hierarchy. When elevation is required for floating elements like menus or modals, use an **Ambient Shadow**: a soft, diffused 15% opacity blur tinted with the secondary blue to maintain color harmony.

## Shapes
The UI has moved away from sharp edges to a **Rounded** aesthetic. This softens the technical nature of the brand, making the application feel more modern and user-friendly.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) border radius.
- **Large Elements (Cards, Modals):** 1rem (16px) border radius.
- **Extra Large Elements:** 1.5rem (24px) for distinct section containers.

## Components
- **Buttons:** Primary buttons use the #7ae9e6 fill with dark text for high contrast. Secondary buttons use the #4081f1 blue with white text. Both feature 8px rounded corners.
- **Input Fields:** Use a subtle 1px border in a cool neutral grey, switching to a 2px #4081f1 border on focus.
- **Cards:** White backgrounds with a very light cool-grey stroke and 16px rounded corners.
- **Chips:** Highly rounded (pill-shaped) using light tints of the primary cyan for "active" tags.