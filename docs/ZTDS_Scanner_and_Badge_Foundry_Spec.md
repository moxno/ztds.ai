# PART 14: PERIMETER SCANNER, NETWORK LEAK EMULATION & DYNAMIC BADGE FOUNDRY SPECIFICATION

## 1. Architectural Purpose & Trust Model
The ZTDS Perimeter Scanner and Dynamic Badge Foundry provide reproducible, client-side verification tooling and visual compliance infrastructure for the Zero-Trust Data Sanitization ecosystem.

Traditional SaaS compliance tools introduce an architectural paradox: assessing whether a pipeline leaks private data requires sending confidential code or runtime traces to an external analysis server, immediately violating ZTDS Invariant 1 (Zero External Egress) and Invariant 3 (In-Memory Isolation). 

The ZTDS verification model eliminates this dilemma:
1. 100% In-Browser Execution: Network inspection and leak emulation run entirely within client memory using Web Workers and native browser APIs. Exactly 0.00 bytes of code or payload data are transmitted across the network perimeter during evaluation.
2. Airplane Mode Guarantee: The scanner operates deterministically with physical network adapters completely disabled.
3. Dynamic Vector Infrastructure: Conformance badges are rendered as standalone, lightweight vector SVGs with zero external font dependencies or tracking beacons, supporting high-DPI retina display, dual visual themes (Dark/Light), and five standardized conformance tiers.

---

## 2. Interactive Network Egress Leak Emulation Engine
The ZTDS Perimeter Scanner (/scanner/) incorporates an interactive network egress emulation engine designed to benchmark client-side filtering pipelines against standard enterprise leak vectors in real time.

### 2.1 Egress Emulation Presets
The engine provides four standard pre-configured network traffic scenarios:

1. Frontier AI API Call (Violation Scenario):
   - Method: POST /v1/chat/completions
   - Payload: Unsanitized enterprise customer records containing National ID/SSN, full legal names, and credit card numbers transmitted directly to external hyperscaler endpoints.
   - Diagnostic Outcome: Fails Invariant 1. Flags 100% cleartext data egress and calculates total leaked payload bytes.

2. Analytics Tracker Beacon (Violation Scenario):
   - Method: POST /analytics/v1/track
   - Payload: Background client telemetry payload transmitting employee corporate email addresses, IP identifiers, and unmasked session metadata.
   - Diagnostic Outcome: Fails Invariant 1 and Invariant 4. Identifies unauthorized subprocessor data egress and telemetry leakage.

3. Unprotected HTTP Egress (Violation Scenario):
   - Method: GET /api/v1/user/export?user=alice@company.com
   - Payload: Unencrypted cleartext transmission with bearer authentication tokens and PII passed via URI query parameters.
   - Diagnostic Outcome: Critical security violation. Flags lack of transport encryption and exposure of credentials and PII.

4. Zero-Trust Sanitized Stream (Compliant Scenario):
   - Method: POST /v1/chat/completions
   - Payload: Evaluated stream pre-processed through the ZTDS in-RAM engine. All sensitive entities are transformed into deterministic surrogate tokens ([PERSON_1], [EMAIL_2], [IBAN_3]).
   - Diagnostic Outcome: Passes Invariants 1 through 4. Confirms 0.00 bytes of personal data transmitted, preserving full LLM semantic utility while eliminating subprocessor DPA liability.

### 2.2 Real-Time Diagnostic Telemetry
The emulation engine calculates three deterministic audit metrics:
- Egress Byte Counter: Total byte volume transmitted (distinguishing cleartext PII vs. zero-trust surrogate tokens).
- Leak Detection Ratio: Mathematical percentage of unmasked sensitive entities escaping the local execution boundary.
- Four Invariant Status Grid: Real-time PASS/FAIL matrix across Invariants 1 through 4.

---

## 3. CISO Executive Compliance Audit Report Exporter
To bridge technical AST evaluations with institutional governance, the Perimeter Scanner incorporates a dual-mode executive reporting engine:

### 3.1 Printable Executive CISO Memo
- Delivery Surface: Formatted for board risk committees, Data Protection Officers (DPOs), and external compliance auditors via optimized print media stylesheets (window.print()).
- Document Structure:
  - Header: Formal ZTDS Standards Authority letterhead and document issuance timestamp.
  - Executive Summary: Cleartext exposure status, compliance readiness score (0-100%), and statutory risk evaluation.
  - Invariant Verification Ledger: Itemized breakdown of Invariants 1 to 4 with technical proofs.
  - Statutory Exemption Mapping: Formal legal citations documenting compliance with GDPR Article 28, HIPAA Safe Harbor (45 CFR Section 164.514(b)), EU AI Act Section 10, and US Federal Rule of Evidence 502(d).
  - Evaluated Test Vectors: Audit trace of inspected endpoints and payload parameters.
  - Cryptographic Signature: Verification block containing the evaluation timestamp and SHA-256 audit digest.

### 3.2 Deterministic JSON Audit Export
- Machine-readable audit export serialized under RFC 8785 canonical JSON principles.
- Schema Fields:
  - report_id: Globally unique audit identifier (e.g., ZTDS-AUDIT-2026-XXXX).
  - generated_at: ISO 8601 UTC timestamp.
  - readiness_score: Integer score from 0 to 100.
  - status: Conformance classification (COMPLIANT, PARTIAL, CRITICAL_LEAK).
  - invariants: Boolean evaluation results for Invariants 1 through 4.
  - audit_hash: SHA-256 digest computed across the test payload and evaluation metrics.
- Enterprise Ingestion: Ready for automated ingestion into vendor risk management (VRM) systems, SOC 2 compliance evidence binders (Vanta, Drata), and CI/CD security gates.

---

## 4. Dynamic Badge Foundry Vector Architecture & Geometry
The ZTDS Badge Foundry (/badge/) generates standardized, dynamic vector trust seals (SVG) engineered for software documentation, marketing landing pages, and application footers.

### 4.1 Vector Geometry Specifications
- Dimensions: Exactly 280px width by 56px height.
- SVG ViewBox: 0 0 280 56.
- Corner Curvature: rx="10" ry="10" for modern container integration.
- Iconography: Native SVG path depicting an interlocking zero-trust cryptographic shield and in-memory keyhole (fill="currentColor", zero external bitmaps).
- Typography: Native CSS system font stack:
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
- Zero Dependencies: Zero external HTTP requests for web fonts, stylesheets, or external images.

---

## 5. Dual Visual Theme Architecture & Token Matrix
The Badge Foundry provides complete visual ergonomics across light and dark user interfaces via the theme parameter:

| Token / Element | Dark Theme (theme=dark) | Light Theme (theme=light) |
| :--- | :--- | :--- |
| Background Fill | #0B0F17 (Obsidian Dark) | #F8FAFC (Porcelain Slate) |
| Border Stroke | #1E293B (Subtle Slate, 1px) | #CBD5E1 (Defined Light Slate, 1px) |
| Primary Heading | #E6EDF3 (Crisp Off-White) | #0F172A (Deep Slate) |
| Secondary Subtitle | #94A3B8 (Muted Slate) | #475569 (Dark Muted Slate) |
| Divider Bar | #1E293B | #E2E8F0 |
| Shield Icon Container | #161B22 | #EDF2F7 |

---

## 6. Conformance Tier Taxonomy & Accent Matrix
The Badge Foundry standardizes five distinct compliance tiers to accurately communicate the technical verification level:

1. VERIFIED (Accent: Emerald #10B981)
   - Scope: Fully certified under automated Conformance Test Suite (CTS) evaluation.
   - Typical Subtitle: RFC v1.0 Invariant Conforming.
2. SOVEREIGN (Accent: Cyan #06B6D4)
   - Scope: On-premise, air-gapped, or cryptographic hardware enclave execution (AWS Nitro Enclaves).
   - Typical Subtitle: Isolated Enclave Execution.
3. DPA EXEMPT (Accent: Amber #F59E0B)
   - Scope: Zero personal data egress; statutory exemption from GDPR Article 28 and HIPAA BAA processor requirements.
   - Typical Subtitle: Zero WAN Egress / GDPR Recital 26.
4. AIR-GAPPED (Accent: Purple #8B5CF6 / #A78BFA)
   - Scope: Strictly offline execution verified in SCIF or network-disconnected environments with 0 network sockets.
   - Typical Subtitle: 100% Offline / Zero Sockets.
5. SELF-ATTESTED (Accent: Slate #94A3B8)
   - Scope: Preliminary developer self-attestation pending formal consortium cryptographic verification.
   - Typical Subtitle: Vendor Self-Declaration.

---

## 7. Custom Label Preset Chips
The badge generator allows customizing the primary badge text via predefined industry presets:
- WASM-ONLY: Certified sub-millisecond WebAssembly client-side sandbox.
- AIR-GAPPED: Verified 100% offline operational guarantee.
- GDPR-SAFE: Absolute zero-PII egress to external processing servers.
- PCI-DSS: Complete scope elimination for cardholder data environments.
- ZERO-EGRESS: Deterministic physical boundary enforcement.
- SOC-2-READY: Pre-mapped AICPA CC6.7 tenant isolation evidence.
- OFFLINE-FIRST: Native offline architectural resilience.

---

## 8. Dynamic Edge API & Query Parameter Specification
The dynamic badge API operates at the edge (/api/badge/) generating valid vector SVGs on-the-fly:

### 8.1 API Signature
GET /api/badge/?slug={slug}&tier={tier}&theme={theme}&label={label}

### 8.2 Parameter Definitions
- slug (string, optional): Unique entity identifier matching records in data/registry.json, data/fellows.json, or data/companies.json. When provided, automatically resolves official entity name and verified status.
- tier (string, optional, default: "verified"): One of "verified", "sovereign", "dpa-exempt", "air-gapped", "self-attested".
- theme (string, optional, default: "dark"): One of "dark", "light".
- label (string, optional): Custom alphanumeric badge header text (e.g., "AIR-GAPPED", "PCI-DSS").

### 8.3 Response Headers & Performance Invariants
- Content-Type: image/svg+xml; charset=utf-8
- Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
- Access-Control-Allow-Origin: *
- Zero Telemetry: Dynamic SVG generation executes with 0 database roundtrips, 0 tracking cookies, and 0 IP logging, maintaining consortium zero-knowledge principles.

---

## 9. Interactive Foundry Ergonomics
The client-side Foundry UI (/badge/) provides instant verification capabilities:
- Canvas Background Modes: Instant contrast auditing against Light (#FFFFFF), Dark (#0B0F17), or Checkerboard Transparency backgrounds.
- Retina Zoom: 1x, 1.5x, and 2x magnification preview for subpixel line alignment.
- Live Embed Snippets: Real-time generation of Markdown, HTML <img>, and direct URL snippets with 1-click clipboard integration.
