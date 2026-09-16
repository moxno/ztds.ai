---
name: ZTDS.ai
version: "1.0"
colors:
  bg-main: "#020617"
  bg-card: "rgba(15, 23, 42, 0.75)"
  bg-terminal: "#030712"
  border-card: "rgba(51, 65, 85, 0.6)"
  border-hover: "rgba(56, 189, 248, 0.4)"
  accent-cyan: "#38bdf8"
  accent-emerald: "#10b981"
  accent-purple: "#818cf8"
  accent-amber: "#facc15"
  accent-pink: "#f472b6"
  text-main: "#f8fafc"
  text-muted: "#94a3b8"
  text-heading: "#ffffff"
  surface-elevated: "#0f172a"
  destructive: "#ef4444"
  success: "#22c55e"
typography:
  display:
    fontFamily: "Inter"
    fontSize: "4rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
    lineHeight: 1.1
  h1:
    fontFamily: "Inter"
    fontSize: "3rem"
    fontWeight: 700
    letterSpacing: "-0.025em"
    lineHeight: 1.15
  h2:
    fontFamily: "Inter"
    fontSize: "2rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
    lineHeight: 1.25
  h3:
    fontFamily: "Inter"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: "Inter"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  body-md:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  caption:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
    textTransform: "uppercase"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
  section-gap: "120px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
shadows:
  card: "0 1px 3px rgba(0, 0, 0, 0.3)"
  card-hover: "0 8px 32px rgba(56, 189, 248, 0.08)"
  glow-cyan: "0 0 20px rgba(56, 189, 248, 0.15)"
  glow-emerald: "0 0 20px rgba(16, 185, 129, 0.15)"
container:
  max-width: "1200px"
  padding-x: "24px"
breakpoints:
  mobile: "430px"
  tablet: "768px"
  desktop: "1024px"
  wide: "1280px"
---

## Overview

ZTDS.ai is the independent, vendor-neutral open standard authority for Zero-Trust Data Sanitization. The design language communicates **institutional gravitas** and **technical precision** — positioned between an IEEE specification portal and a modern developer platform like Vercel or Linear.

The aesthetic is **Deep-Space Minimalism**: near-black backgrounds with precisely controlled glassmorphism cards and two accent colors (cyan for primary interactions, emerald for verification/success states). Every pixel must reinforce the message: "This is a standards body, not a startup landing page."

## Brand Identity

- **Positioning**: Independent technical consortium and specification maintainer. NOT a sales page for PrivacyScrubber.
- **Voice**: Authoritative, precise, zero-fluff. Like reading an RFC or IEEE standard — but with modern web ergonomics.
- **Emotional Target**: Trust, competence, inevitability. The user should feel they are looking at the canonical source of truth for an industry standard.

## Colors

The palette is rooted in Tailwind's Slate scale with two chromatic accents.

- **bg-main (#020617):** Slate-950. The deepest background. Creates a "deep space" canvas that makes content float.
- **bg-card (rgba(15, 23, 42, 0.75)):** Semi-transparent Slate-900. Glassmorphism foundation — cards appear to hover over the background with `backdrop-filter: blur(12px)`.
- **accent-cyan (#38bdf8):** Sky-400. The sole driver for primary CTAs, active states, links, and interactive elements. Used sparingly for maximum impact.
- **accent-emerald (#10b981):** Emerald-500. Reserved exclusively for verification badges, success states, and "Certified" labels. Signals trust and compliance.
- **accent-purple (#818cf8):** Indigo-400. Used for code syntax highlighting and secondary category markers only.
- **text-main (#f8fafc):** Slate-50. High-contrast body text on dark backgrounds. WCAG AAA compliant.
- **text-muted (#94a3b8):** Slate-400. Metadata, timestamps, secondary descriptions.

### Color Constraints
- Do NOT use bright reds or oranges outside of destructive/error states.
- Do NOT introduce additional accent colors. The three-accent system (cyan, emerald, purple) is locked.
- Do NOT use pure white (#ffffff) for backgrounds. Only for headings and sparse emphasis.

## Typography

Inter is the sole UI typeface. JetBrains Mono is used exclusively for code, terminal output, and token identifiers.

### Typography Constraints
- Do NOT mix more than two font families on any page.
- Do NOT use font weights below 400 or above 800.
- Heading letter-spacing is always negative (tighter). Body text uses default or slightly relaxed spacing.

## Layout

- **Container**: Max-width 1200px, centered, with 24px horizontal padding.
- **Section Spacing**: 120px gap between major page sections (desktop). 64px on mobile.
- **Card Grid**: CSS Grid, minimum 320px columns, 24px gap.
- **Breakpoints**: Mobile-first. 430px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide).

### Layout Constraints
- Do NOT use full-bleed colored sections. All content respects max-width container.
- Do NOT center-align body text blocks. Left-align for readability (headings may be centered in hero sections only).
- Cards MUST use the glassmorphism pattern: `backdrop-filter: blur(12px)`, semi-transparent background, 1px border with subtle opacity.

## Components

### Navigation Header
- Sticky, full-width, translucent background (`backdrop-filter: blur(16px)`).
- Logo "ZTDS" in Inter Bold, left-aligned.
- Navigation links: Standard, Scanner, Registry, Badge, SDK, Apply.
- Single primary CTA button "Get Certified" (accent-cyan background, dark text).
- Mobile: hamburger menu.

### Hero Section
- Left-aligned or centered headline (display typography).
- Subheadline in text-muted color.
- Two CTAs: Primary (filled, accent-cyan) + Secondary (outlined, border-only).
- Optional: Ambient glow gradient behind the hero.

### Trust Bar
- Horizontal row of institutional logos/names (Zenodo, OSF, SSRN, IEEE).
- Grayscale, subtle opacity. NOT colorful.
- Caption text: "Published & Peer-Reviewed."

### Glassmorphism Cards
- Use `.ztds-card` class pattern.
- On hover: border transitions to `border-hover` color, subtle `transform: translateY(-2px)`.
- No box-shadow on default state. Only on hover (use `card-hover` shadow token).

### Entity Token Badges
- Colored inline pills for each PII entity type (Name=amber, Email=cyan, Phone=emerald, ID=pink, Secret=purple).
- Monospace font, small size (0.82rem), with subtle colored border and low-opacity background.

### Terminal/Code Blocks
- Dark background (`#030712`), 1px Slate-800 border, 8px border-radius.
- JetBrains Mono, Slate-200 text.
- Optional: colored prompt character (`$` in cyan).

### Buttons
- **Primary**: `accent-cyan` background, `#020617` text, 8px radius, 600 weight. Hover: lighten 10%.
- **Secondary**: Transparent background, 1px `accent-cyan` border, `accent-cyan` text. Hover: fill with low-opacity cyan.
- **Ghost**: No border, `text-muted` color. Hover: `text-main`.
- All buttons: minimum 44px touch target height.

### Footer
- Full-width, separated by 1px Slate-800 border.
- 3-4 column grid: Navigation, Resources, Community, Legal.
- Bottom: "Built for the community by the community." + copyright.

## Animation

- **Transitions**: 200ms ease for color/border changes, 250ms ease for transforms.
- **Scroll Reveals**: Subtle fade-in-up (opacity 0 -> 1, translateY 16px -> 0) on section entry.
- No aggressive parallax. No bouncing animations. No decorative spinners.
- Card hover: `translateY(-2px)` only. Restrained.

## Do's and Don'ts

### Do
- Maintain strict brand isolation: ZTDS.ai is the standard, PrivacyScrubber is one certified implementation.
- Use glassmorphism cards consistently across all pages.
- Ensure every page has proper `<meta>` description, OG tags, and Schema.org markup.
- Use SVG icons only. No emoji in production UI.
- Ensure all interactive elements meet 44px minimum touch target.

### Don't
- Don't add decorative illustrations or stock photos. This is a technical standards site.
- Don't use gradients on text (except subtle hero headline glow effects).
- Don't use rounded corners larger than 16px on cards (2xl is max for cards).
- Don't use color backgrounds behind sections. Dark space is the canvas.
- Don't use Comic Sans, cursive, or decorative fonts.
- Don't use emojis in any UI element.
