---
name: google-stitch
description: Automates the creation of high-fidelity multi-screen UI/UX design systems and mockups using Google Stitch (stitch.withgoogle.com) via Chrome DevTools MCP. Use when generating, iterating, or exporting UI prototypes, design token systems (DESIGN.md), or converting design canvases into clean front-end code.
---

# Google Stitch UI/UX Automation Skill

## 1. Overview & Purpose
Google Stitch (`stitch.withgoogle.com`) is an AI-native interface canvas from Google Labs that generates mobile and web UIs, design tokens, and production-ready front-end code (HTML, Tailwind CSS, React, Figma export).

This skill standardizes the multi-step protocol for:
1. Authoring a persistent `DESIGN.md` contract with machine-readable YAML tokens and human-readable brand rationale.
2. Automating Stitch project creation and prompt chaining via `chrome_devtools` MCP in the user's authenticated Google session.
3. Systematically generating full-scale multi-screen site architectures on the Stitch canvas.
4. Exporting code and synchronizing assets with the local workspace.

---

## 2. Core Workflow Protocol

### Step 1: Design System Grounding (`DESIGN.md`)
Before sending any prompt to Stitch, compile a root-level `DESIGN.md` file adhering to the Google Labs specification:
```yaml
---
name: Brand Name
colors:
  bg-main: "#020617"
  bg-card: "rgba(15, 23, 42, 0.75)"
  accent-cyan: "#38bdf8"
  accent-emerald: "#10b981"
  text-main: "#f8fafc"
typography:
  h1:
    fontFamily: "Inter"
    fontSize: "3rem"
    fontWeight: 700
---

## Overview
Brand positioning and visual aesthetics.

## Do's and Don'ts
Hard constraints (e.g. "No emojis", "Pure CSS glassmorphism", "44px touch targets").
```

### Step 2: Browser Discovery & Navigation
1. Call `chrome_devtools.list_pages` to verify the user's active Chrome session.
2. Call `chrome_devtools.new_page` with URL `https://stitch.withgoogle.com/` (without `isolatedContext` to inherit existing Google authentication).
3. Take a snapshot (`take_snapshot`) to locate UI controls:
   - Radio "Web" or "App"
   - Prompt input textarea (`uid`)
   - "Generate designs" button (`uid`)

### Step 3: Prompt Structuring for Stitch
Stitch performs best when given dense, structural prompts rather than high-level requests:
- **Role & Framework**: State the brand identity, domain, and design system constraints.
- **Top-to-Bottom Section Breakdown**: Specify every major visual module (Header, Hero, Value Grid, Interactive Demo, Trust Citations, Footer).
- **Exact Token Values**: Pass hex codes (`#020617`, `#38bdf8`, `#10b981`) and font names (`Inter`, `JetBrains Mono`) directly in the prompt text.
- **Negative Constraints**: Explicitly forbid unwanted elements ("No emojis", "No stock photography", "No decorative illustrations").

### Step 4: Multi-Screen Chaining on the Canvas
Once the initial screen is generated:
1. Stitch creates a project canvas (`stitch.withgoogle.com/projects/{projectId}`).
2. Subsequent screens must be requested using the bottom prompt input bar.
3. Submit using `press_key` with `"Enter"` or by clicking the send button.
4. Wait 12–15 seconds per screen generation (`sleep 12-15`).
5. Capture viewport screenshots using `take_screenshot` without `filePath` to inspect the visual canvas.

### Step 5: Code Export & Workspace Sync
- Click Stitch's native "Export" button (`uid`) to retrieve clean HTML/CSS or React components.
- Map the exported styles to the local project's design tokens and component structure.

---

## 3. Stitch Prompt Template Library

### Landing Page Prompt Pattern
```text
A dark-theme landing page for [Brand/Standard].
Design style: Deep-space minimalism with [bg-hex] background, [card-hex] glassmorphism cards, and [accent-hex] accents.
Sticky glass navbar with logo, section links, and CTA button.
Hero section with status pill, large bold headline, subheadline, and dual CTAs.
Institutional trust bar with grayscale DOI/academic badges.
4-Card feature/invariant grid with numbered badges and SVG icons.
Interactive split-screen demo showing inputs vs sanitized outputs.
3-column stakeholder value matrix.
Footer with 4 columns and open-source license attribution.
No emojis. Clean, institutional authority.
```

### Documentation / Specification Prompt Pattern
```text
A technical specification documentation screen for [Standard/RFC].
Sticky left sidebar Table of Contents with numbered sections and active rail indicator.
Main content area with RFC metadata header, DOI links, and RFC 2119 keywords (MUST/SHALL).
Mathematical proof blocks in dark monospace styling.
Interactive terminal CLI block with copy action.
Sticky right sidebar with download actions (PDF, Markdown, BibTeX) and SHA-256 verification hash.
```

### Directory / Catalog Prompt Pattern
```text
A verified implementations directory screen for [Standard] Registry.
Header with title, subtitle, and verified telemetry stat pill.
Filter bar with search input, category chips, and sort dropdown.
3-column grid of glassmorphic product cards with status checkmark pills, version tags, and detail links.
GitOps onboarding guide explaining GitHub PR submission and CI verification.
```
