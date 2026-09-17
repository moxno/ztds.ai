---
name: ZTDS.ai
version: "3.0"
theme: "Light Institutional Trust & Certification Portal"
colors:
  bg-canvas: "#f8fafc"          # Clean, high-prestige soft slate background
  bg-surface: "#ffffff"         # Pure white crisp card surfaces
  bg-surface-subtle: "#f1f5f9"  # Soft slate for sub-panels and active states
  bg-surface-elevated: "#ffffff"# Elevated white cards with drop shadow
  bg-dark-accent: "#0f172a"     # Deep executive navy for dark callouts and headers
  
  border-subtle: "#e2e8f0"      # Light hairline slate border
  border-subtle-hover: "#cbd5e1"# Slightly darker slate border on hover
  border-trust: "#059669"       # Emerald green border for verified badges
  border-dev: "#2563eb"         # Royal blue border for developer tools
  
  text-heading: "#0f172a"       # Deep executive navy headings (maximum contrast)
  text-body: "#334155"          # Highly legible slate body text
  text-muted: "#64748b"         # Neutral muted text for captions and metadata
  text-inverse: "#ffffff"       # White text on dark elements
  
  accent-trust: "#059669"       # Emerald green (Certification, Verified Badges, Security)
  accent-trust-light: "#ecfdf5" # Soft emerald tint for badge backgrounds
  accent-dev: "#2563eb"         # Royal blue (Developer docs, Quickstart, Code snippets)
  accent-dev-light: "#eff6ff"   # Soft blue tint for developer tags
  accent-amber: "#d97706"       # Warm amber for warnings and notices
  accent-amber-light: "#fffbeb" # Soft amber tint
  
typography:
  display:
    fontFamily: "Inter"
    fontSize: "3.5rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
    lineHeight: 1.1
  h1:
    fontFamily: "Inter"
    fontSize: "2.5rem"
    fontWeight: 700
    letterSpacing: "-0.025em"
    lineHeight: 1.2
  h2:
    fontFamily: "Inter"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
    lineHeight: 1.3
  h3:
    fontFamily: "Inter"
    fontSize: "1.25rem"
    fontWeight: 600
    letterSpacing: "-0.015em"
    lineHeight: 1.4
  body-lg:
    fontFamily: "Inter"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: "Inter"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "JetBrains Mono"
    fontSize: "0.85rem"
    lineHeight: 1.5

components:
  buttons:
    btn-trust:
      background: "#059669"
      color: "#ffffff"
      hover: "#047857"
      borderRadius: "0.5rem"
    btn-navy:
      background: "#0f172a"
      color: "#ffffff"
      hover: "#1e293b"
      borderRadius: "0.5rem"
    btn-outline:
      background: "#ffffff"
      border: "1px solid #cbd5e1"
      color: "#0f172a"
      hover: "#f8fafc"
      borderRadius: "0.5rem"
  cards:
    ztds-card:
      background: "#ffffff"
      border: "1px solid #e2e8f0"
      borderRadius: "0.75rem"
      shadow: "0 1px 3px rgba(0,0,0,0.05)"
      hoverShadow: "0 10px 15px -3px rgba(0,0,0,0.08)"
---
