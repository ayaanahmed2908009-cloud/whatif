---
name: Divergent Chic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#47464e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#77767e'
  outline-variant: '#c8c5ce'
  surface-tint: '#5b5b7e'
  primary: '#020220'
  on-primary: '#ffffff'
  primary-container: '#1a1b3a'
  on-primary-container: '#8383a8'
  inverse-primary: '#c3c3eb'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#030507'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1f21'
  on-tertiary-container: '#838688'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c3c3eb'
  on-primary-fixed: '#171837'
  on-primary-fixed-variant: '#434465'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 32px
  margin-mobile: 24px
  section-padding-lg: 160px
  section-padding-sm: 80px
---

## Brand & Style

The design system is defined by a sophisticated tension between "engineered precision" and "creative chaos." It targets a high-end audience that values both technical excellence and artistic expression. The aesthetic direction is a hybrid of **Modern Minimalism** and **Artistic Playfulness**.

We utilize the clean, centered layout architecture found in high-conversion SaaS landing pages, framing it with "divergent" abstract elements—organic, squiggle-like shapes that represent shifting timelines and possibilities. This creates a "spoiled" user experience: one where the utility is flawless (Apple-inspired) but the soul is vibrant and energetic. The overall feeling should be expensive, curated, and intellectually stimulating.

## Colors

The palette is anchored by **Deep Indigo (#1A1B3A)** and **Soft White (#F8FAFC)** to establish a premium, "Chic" foundation. This high-contrast pairing provides the "engineered" feel of professional software.

To represent the "divergent timelines," we employ a secondary palette of saturated, playful accents. These are used exclusively for abstract background shapes and specific call-to-action highlights. Use the **Secondary Indigo (#6366F1)** for interactive states, while the vibrant accents (Orange, Teal, Purple) should appear as floating graphic elements behind the primary content, mimicking the "Jive" reference.

## Typography

This design system relies on **Hanken Grotesk** for all roles to maintain a unified, modern, and sharp appearance. Headlines use heavy weights (700-800) and tight letter spacing to create a sense of impact and authority, appearing centered as the focal point of the layout.

Body text is set with generous line heights to ensure readability against white backgrounds. Small labels utilize uppercase styling with wide tracking to denote technical details or categories, reinforcing the "engineered" aspect of the brand.

## Layout & Spacing

The layout follows a **Fixed Grid** approach for content containment, ensuring that text blocks remain narrow and readable even on ultra-wide screens.

- **Hero Alignment:** Content is strictly center-aligned. Headlines should be capped at a maximum width of 800px to prevent long line lengths.
- **Section Rhythm:** Use large vertical gaps (`section-padding-lg`) between major narrative shifts to allow the "divergent" shapes to breathe.
- **Mobile Reflow:** On mobile, abstract shapes should be scaled down or partially cropped to maintain a focus on the central text and high-contrast mockups. Mockups should tilt slightly (5-10 degrees) to create a dynamic, physical feel.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layers** and **Ultra-Fine Outlines**.

- **Borders:** Use 0.5px borders in a muted Indigo (10-15% opacity) for cards and input fields. This provides structural definition without visual clutter.
- **Micro-Depth:** Floating elements (like phone mockups) use a single, very soft, highly diffused ambient shadow (Color: Primary Indigo, Opacity: 8%, Blur: 40px) to separate them from the background squiggles.
- **Layering:** The hierarchy is: Background Color (Level 0) → Abstract Shapes (Level 1) → Main Content & Text (Level 2) → Floating Mockups (Level 3).

## Shapes

The geometry of this design system is a "Controlled Organic" style.
- **Functional Elements:** Buttons, cards, and containers use a consistent **1rem (16px)** corner radius, providing a soft but professional feel.
- **Abstract Elements:** The "divergent" shapes are fully organic squiggles. These should be vector-based with no sharp corners, appearing as if drawn with a thick, physical marker.
- **Mockups:** Mobile device frames should have highly realistic, large-radius corners to match the premium "Apple-designed" requirement.

## Components

### Buttons
- **Primary:** Deep Indigo background, white text, 1rem roundedness. On hover, the background shifts to Secondary Indigo.
- **Secondary:** Transparent background with a 0.5px border. Text is Primary Indigo.

### High-Contrast Mockups
- Phone frames should be represented in a deep matte black or midnight indigo.
- Screen content should use high-contrast white backgrounds with vibrant UI elements to pop against the dark hardware.

### Abstract Graphics
- Use the accent palette. Shapes should be placed "behind" the text but "in front" of the background color.
- Implement a subtle parallax effect on scroll for these shapes to enhance the "divergent timeline" metaphor.

### Cards
- White background, 0.5px Indigo border, 1rem roundedness. Use for feature grids. Minimal padding should be at least 32px to maintain the "spoiled" luxury feel.
