# ZTDS.ai — Commercial PLG Flywheel & Chrome Web Store Package

**Target Product:** PrivacyScrubber (Web, Chrome Extension, MCP Server, Headless SDK)  
**Standard Authority:** ZTDS AI Consortium (RFC v1.0 / IETF draft-sibiryakov-ztds-protocol-00)  
**Parent Ecosystem:** BrandMeWeb (Founder: Ilya Sibiryakov)  
**Revenue Goal:** 40,000 ILS (~$11,000 USD) MRR by 14/05/2027  

---

## 1. Executive Summary & Flywheel Mechanics

The Product-Led Growth (PLG) flywheel creates a deterministic transition from individual, free, and self-serve consumer users into high-ACV B2B enterprise subscriptions and BrandMeWeb agency retainers.

```
+-------------------------------------------------------------------------+
|                         PLG FLYWHEEL ARCHITECTURE                       |
+-------------------------------------------------------------------------+
| 1. Acquisition: Chrome Web Store & Web App (Free / Self-Serve)          |
|    - 100% Client-Side In-Memory PII Scrubber                            |
|    - Instant value: paste prompt -> masked tokens in <1ms               |
|                                                                         |
| 2. Trust Anchor: Institutional Verification                             |
|    - ZTDS RFC v1.0 Conformance Badge (https://ztds.ai/badge/)           |
|    - IETF Internet-Draft draft-sibiryakov-ztds-protocol-00              |
|    - Independent 3rd-Party White-Box Audit (0 Critical / 0 High)        |
|    - Offline Web Crypto Ed25519 Token Validator (https://ztds.ai/verify/)|
|                                                                         |
| 3. Commercial Tiers (Paddle Merchant of Record):                        |
|    - PRO ($15/mo / $110 Lifetime): Custom regex, batch doc scrubbing    |
|    - TEAMS ($99/mo flat): 10 seats, shared policies, workspace audit    |
|    - Developer SDK ($199/mo or $1,990/yr): @privacyscrubber/sdk + MCP   |
|                                                                         |
| 4. Enterprise Retainer Handoff:                                         |
|    - BrandMeWeb Turn-Key Architecture ($2,500 setup + $500/mo retainer) |
|    - Custom RAG/LLM pipelines, zero-DPA legal memo, SOC2/HIPAA packs    |
+-------------------------------------------------------------------------+
```

---

## 2. Chrome Web Store Updated Listing Copy

### 2.1 Store Title & Short Description
* **Extension Title:** PrivacyScrubber: Zero-Trust AI Prompt & PII Masker
* **Short Description (132 chars max):** Zero-server PII sanitization for ChatGPT, Claude, and Gemini. ZTDS RFC v1.0 certified with zero network egress and offline verification.

### 2.2 Detailed Store Description (Long Form)

```text
PrivacyScrubber is the pioneer reference implementation of the ZTDS (Zero-Trust Data Sanitization) open standard. It sanitizes sensitive corporate data, PII, PHI, API keys, and financial credentials directly in browser memory before prompts reach AI model providers.

INSTITUTIONAL TRUST ANCHORS:
- Standardized under IETF Internet-Draft: draft-sibiryakov-ztds-protocol-00
- Conforms to ZTDS RFC v1.0 (Zero Network Egress, Deterministic Tokens, In-Memory Isolation, Zero Subprocessors)
- Independent Third-Party White-Box Security Audit: 0 Critical / 0 High findings
- Cryptographically verifiable via offline Web Crypto Ed25519 signatures
- Patent pending under IL 331905 (WIPO DAS Access Code: B17B)

WHY ZERO-SERVER SANITIZATION MATTERS:
Traditional cloud-based "privacy gateways" route your confidential data through third-party proxy servers, introducing new breach liabilities, vendor lock-in, and complex GDPR Article 28 DPA requirements. 

PrivacyScrubber runs 100% locally in device memory (V8 engine). Zero bytes of raw sensitive information ever cross your machine boundary. Turn on Airplane Mode: the sanitizer continues to function identically.

CORE CAPABILITIES:
1. Universal Browser DOM Interception:
   Automatically protects input boxes on ChatGPT, Claude, Google Gemini, Microsoft Copilot, and Perplexity.
2. Deterministic Context-Preserving Tokens:
   Replaces sensitive entities with syntactic equivalents (e.g., [PERSON_TOKEN_1], [IBAN_TOKEN_2]) so LLMs retain full analytical reasoning without hallucination.
3. Bidirectional Reversible Unmasking:
   When the AI model responds, tokens are seamlessly translated back into the original values on your screen using volatile RAM maps that self-destruct upon tab closure.
4. Comprehensive Entity Coverage:
   Detects names, emails, phone numbers, SSNs, credit cards, IBANs, medical codes (HIPAA Safe Harbor), API tokens, AWS secrets, and JWT headers.
5. Ed25519 Cryptographic Trust Badge:
   Every build contains an immutable Ed25519 certificate verified at https://ztds.ai/verify/.

PERMISSIONS AND PRIVACY TRANSPARENCY:
PrivacyScrubber requires minimal permissions:
- activeTab: To inspect input fields only on active AI chat tabs upon user action.
- storage: To persist your local custom scrubbing preferences (no data uploaded).
- scripting: To inject local regex sanitizers into active LLM interface inputs.

PRIVACY POLICY & ZERO-EGRESS GUARANTEE:
PrivacyScrubber does not collect, log, transmit, or monetize your prompt data, personal identities, or browsing history. There are no backend telemetry trackers, no analytics SDKs, and no external API calls for scrubbing.

STANDARDIZATION & AUDIT SPECIFICATION:
Open Standard RFC: https://ztds.ai/standard/
Independent Security Audit Report: https://ztds.ai/docs/security/ZTDS_Independent_Security_Audit_Report.txt
Live Cryptographic Validator: https://ztds.ai/verify/
Official Registry: https://ztds.ai/registry/
Developed by BrandMeWeb Ecosystem: https://brandmeweb.com
```

### 2.3 Single Purpose Description (Chrome Web Store Dashboard)
> "PrivacyScrubber sanitizes and de-identifies sensitive personal information (PII), credentials, and corporate secrets locally inside web form inputs before prompts are submitted to external artificial intelligence chat services."

### 2.4 Permission Justification Disclosures
* **activeTab:** "Required to access the active browser tab input elements on AI service domains (ChatGPT, Claude, Gemini, Perplexity) only when the user invokes data sanitization."
* **storage:** "Required to save user-defined regex rules and tokenization preferences locally on the client device. No settings are synced to external cloud servers."
* **scripting:** "Required to execute in-memory string replacement and reversible token restoration directly within the local DOM execution context."

---

## 3. In-App Trust Badge & Ed25519 Verification Integration

Certified products embed the ZTDS Verified Badge with direct cryptographic resolution.

### 3.1 SVG Badge Embed Code (HTML/React)

```html
<!-- ZTDS Certified Reference Implementation Trust Seal -->
<div class="ztds-trust-seal-container" style="display: inline-flex; align-items: center; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <a href="https://ztds.ai/verify/#cert=ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IChCcmFuZE1lV2ViIEVjb3N5c3RlbSkiLCJiYWRnZV91cmwiOiJodHRwczovL3p0ZHMuYWkvYmFkZ2UvcHJpdmFjeXNjcnViYmVyLWNocm8uc3ZnIiwiY2VydGlmaWNhdGVfaWQiOiJaVERTLUNFUlQtMjAyNi1QUklWQUNZU0NSVUJCRVItQ0hSTy0wRjlFMTciLCJleHBpcmVzX2F0IjoiMjAyNy0wOS0yNlQxOTozNTo0NS4zMzdaIiwiaW52YXJpYW50cyI6eyJpbnZhcmlhbnRfMV96ZXJvX2VncmVzcyI6IlBBU1MiLCJpbnZhcmlhbnRfMl9yZXZlcnNpYmxlX3Rva2VucyI6IlBBU1MiLCJpbnZhcmlhbnRfM19pbl9tZW1vcnlfaXNvbGF0aW9uIjoiUEFTUyIsImludmFyaWFudF80X3plcm9fc3VicHJvY2Vzc29ycyI6IlBBU1MifSwiaXNzdWVkX2F0IjoiMjAyNi0wOS0yNlQxOTozNTo0NS4zMzdaIiwibGV2ZWwiOiJMZXZlbCAyOiBWZXJpZmllZCBSZWZlcmVuY2UgSW1wbGVtZW50YXRpb24iLCJyZWdpc3RyeV92ZXJpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3JlZ2lzdHJ5LyNwcml2YWN5c2NydWJiZXItY2hybyIsInNwZWNpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3N0YW5kYXJkLyIsInN0YW5kYXJkIjoiWlREUyBSRkMgdjEuMCIsInN1YmplY3QiOnsiYXBwbGljYW50IjoiSWx5YSBTaWJpcnlha292IChCcmFuZE1lV2ViKSIsImF1ZGl0X2hhc2giOiJzaGEyNTY6MGYwMjY3ZTdjODY3NGQ3NzU5YTZjN2IyYzU1YTRhOTcyZjcwZmFlZTc2Y2RmOWM3MjdlY2NiMjk3ZmIxNmRjMCIsImNhdGVnb3J5IjoiQnJvd3NlciBTZWN1cml0eSAmIERPTSBJbnRlcmNlcHRvciIsInByb2R1Y3QiOiJQcml2YWN5U2NydWJiZXIgQ2hyb21lIEV4dGVuc2lvbiIsInJlcG9zaXRvcnkiOiJodHRwczovL2Nocm9tZXdlYnN0b3JlLmdvb2dsZS5jb20vZGV0YWlsL3ByaXZhY3lzY3J1YmJlci9kYWpta21lcGlnbGxmZGxqb2NpbWNoZmlqZGZtY25wbSIsInNjYW5uZWRfZmlsZXNfY291bnQiOjB9LCJ2YWxpZGl0eV9kYXlzIjozNjV9.I-3tB5YbFb-JehyeBoljvmiIF5ugdp-eZZ9dkFxb_u5BC8saXlZ0jypKdiHBkAOgFEz6ltH_zEHAsEGHhlLqDQ" 
     target="_blank" 
     rel="noopener noreferrer"
     title="Cryptographically verified by ZTDS AI Standards Authority (Ed25519 Web Crypto)">
    <img src="https://ztds.ai/badge/privacyscrubber-extension.svg" 
         alt="ZTDS Verified Reference Implementation" 
         width="170" 
         height="34" 
         style="border: none; display: block;" />
  </a>
</div>
```

---

## 4. Bottom-Up PLG Expansion & Conversion Mechanics

### 4.1 In-App Conversion Triggers

| User Action | Detected Context | Non-Intrusive Prompt | Target Commercial Offer |
| :--- | :--- | :--- | :--- |
| User scrubs > 5 documents in 1 hour | Heavy professional workflow | "Need automatic batch document de-identification and custom compliance taxonomies?" | PRO Upgrade ($15/mo / $110 Lifetime) |
| User scrubs corporate email domain (`@acme.corp`) | Enterprise employee | "Enforce unified zero-trust masking policies across your team without managing servers." | TEAMS ($99/mo flat, 10 seats) |
| User scrubs code with API keys / SQL schemas | Developer / AI Engineer | "Automate zero-trust PII sanitization in your Python/Node.js pipelines with 0 network latency." | Developer SDK ($199/mo or $1,990/yr) |
| User clicks "Compliance / DPA FAQ" | CISO / Compliance Officer | "Eliminate subprocessor vendor risk assessments with statutory DPA exemption." | BrandMeWeb Turn-Key ($2,500 + $500/mo) |

### 4.2 Commercial Pricing Matrix (Paddle Checkout Integration)

```javascript
const ZTDS_COMMERCIAL_TIERS = {
  pro: {
    monthly: { price: 15, currency: "USD", interval: "month", paddle_price_id: "pri_pro_monthly" },
    lifetime: { price: 110, currency: "USD", interval: "one_time", paddle_price_id: "pri_pro_lifetime" },
    scope: "Single-user client-side web & extension unlimited sanitization"
  },
  teams: {
    monthly: { price: 99, currency: "USD", interval: "month", paddle_price_id: "pri_teams_monthly" },
    scope: "10 developer/seat licenses, unified team policies, central Ed25519 license minting"
  },
  sdk: {
    monthly: { price: 199, currency: "USD", interval: "month", paddle_price_id: "pri_sdk_monthly" },
    annual: { price: 1990, currency: "USD", interval: "year", paddle_price_id: "pri_sdk_annual" },
    scope: "Headless @privacyscrubber/sdk, MCP server stdio, CI/CD audit gate, WASM binary"
  },
  enterprise_agency: {
    setup: 2500,
    retainer: 500,
    currency: "USD",
    provider: "BrandMeWeb Agency",
    scope: "Custom air-gapped deployment, DPA exemption memo, continuous security audit SLA"
  }
};
```

---

## 5. Revenue Contribution Towards 40,000 ILS (~$11,000 USD) MRR

Target Milestone Date: 14/05/2027

| Stream | Unit Price | Target Active Units | Monthly Revenue (USD) | Monthly Revenue (ILS) |
| :--- | :--- | :--- | :--- | :--- |
| BrandMeWeb Agency Retainers | $500/mo | 12 clients | $6,000 | ~21,600 ILS |
| TEAMS Subscriptions | $99/mo | 30 teams | $2,970 | ~10,692 ILS |
| Developer SDK Subscriptions | $199/mo | 8 companies | $1,592 | ~5,731 ILS |
| PRO Self-Serve Subscriptions | $15/mo | 30 users | $450 | ~1,620 ILS |
| **Combined Ecosystem Total** | — | — | **$11,012/mo** | **~39,643 ILS/mo** |

---

## 6. Self-Serve Checkout & License Minting Protocol

Purchases completed through Paddle automatically invoke the webhook handler at `https://ztds.ai/api/paddle-webhook`, which:
1. Validates the Paddle HMAC-SHA256 signature against `PADDLE_WEBHOOK_SECRET_KEY`.
2. Inspects the transaction item ID for tier match (`teams`, `sdk`, `developer_pro`).
3. Executes `mintLicense()` in `api/license.js` using the master Ed25519 key.
4. Returns an offline zero-telemetry license token (`ZTDS-2026-TEAMS-XXXX` or `ZTDS-2026-DEV-XXXX`).
5. Dispatches an automated onboarding email containing the certificate, offline key file, and SOW documentation via Resend.
