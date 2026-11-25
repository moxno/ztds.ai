# ZTDS.ai — Browser Extension & Client Runtime Conformance Specification

**Reference Implementation:** PrivacyScrubber (Web, Chrome Extension, MCP Server, Headless SDK)  
**Standard Authority:** ZTDS AI Consortium (RFC v1.0 / IETF draft-sibiryakov-ztds-protocol-02)  
**Engineering Steward:** BrandMeWeb (Founder & Chief Architect: Ilya Sibiryakov)  

---

## 1. Executive Summary & Client-Side Conformance Architecture

Browser extensions and local IDE runtimes operating under the Zero-Trust Data Sanitization (ZTDS RFC v1.0) standard enforce deterministic client-side PII/PHI/Secret neutralization directly inside browser V8 volatile memory before prompts reach external AI model providers.

```
+-------------------------------------------------------------------------+
|                CLIENT-SIDE CONFORMANCE ARCHITECTURE                     |
+-------------------------------------------------------------------------+
| 1. Local DOM Interception (Chrome Manifest V3)                          |
|    - 100% Client-Side In-Memory Sanitization                            |
|    - Sub-millisecond bijective surrogate tokenization (<0.1ms p50)      |
|                                                                         |
| 2. Institutional Trust & Cryptographic Verification                     |
|    - ZTDS RFC v1.0 Conformance Badge (https://ztds.ai/badge/)           |
|    - IETF Internet-Draft draft-sibiryakov-ztds-protocol-02              |
|    - Independent 3rd-Party Security Audit (0 Critical / 0 High)         |
|    - Offline WebCrypto Ed25519 Token Validator (https://ztds.ai/verify/)|
|                                                                         |
| 3. Certified Commercial & Enterprise Implementations                    |
|    - Commercial licensing (PRO, TEAMS, Developer SDK, Air-Gapped)       |
|      routes exclusively to https://privacyscrubber.com/pricing/         |
|    - Turn-key enterprise architecture & GEO governance routes to        |
|      https://brandmeweb.com                                             |
+-------------------------------------------------------------------------+
```

---

## 2. Chrome Web Store Manifest V3 Conformance Specification

### 2.1 Reference Extension Metadata
* **Extension Title:** PrivacyScrubber: Zero-Trust AI Prompt & PII Masker
* **Short Description:** Zero-server PII sanitization for ChatGPT, Claude, and Gemini. ZTDS RFC v1.0 certified with zero network egress and offline verification.

### 2.2 Normative Capabilities & Trust Anchors

```text
PrivacyScrubber is the pioneer certified implementation of the ZTDS (Zero-Trust Data Sanitization) open standard. It sanitizes sensitive corporate data, PII, PHI, API keys, and financial credentials directly in browser memory before prompts reach AI model providers.

INSTITUTIONAL TRUST ANCHORS:
- Standardized under IETF Internet-Draft: draft-sibiryakov-ztds-protocol-02 (https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
- Conforms to ZTDS RFC v1.0 (Zero Network Egress, Deterministic Tokens, In-Memory Isolation, Zero Subprocessors)
- Independent Third-Party Security Audit: 0 Critical / 0 High findings
- Cryptographically verifiable via offline WebCrypto Ed25519 signatures
- U.S. & International Patents Pending (Paris Convention Art. 4 & 35 U.S.C. § 119 Priority)
```

### 2.3 Chrome Web Store Permission Justifications (Manifest V3)
* **activeTab:** Required to inspect active browser tab input elements on AI service domains (ChatGPT, Claude, Gemini, Perplexity) strictly upon user invocation.
* **storage:** Required to persist local custom scrubbing preferences on the client device without external cloud synchronization.
* **scripting:** Required to execute in-memory surrogate replacement and reversible token restoration directly within the local DOM context.

---

## 3. In-App Trust Badge & Ed25519 Verification Integration

Certified browser extensions embed the ZTDS Verified Badge with direct offline Ed25519 cryptographic resolution:

```html
<div class="ztds-trust-seal-container">
  <a href="https://ztds.ai/verify/#cert=ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IiwiYmFkZ2VfdXJsIjoiaHR0cHM6Ly96dGRzLmFpL2JhZGdlL3ByaXZhY3lzY3J1YmJlci1jaHJvLnN2ZyIsImNlcnRpZmljYXRlX2lkIjoiWlREUy1DRVJULTIwMjYtUFJJVkFDWVNDUlVCQkVSLUNIUk8tQUJENUZDIiwiZXhwaXJlc19hdCI6IjIwMjctMTEtMjVUMjE6MzY6MzcuNjI2WiIsImludmFyaWFudHMiOnsiaW52YXJpYW50XzFfemVyb19lZ3Jlc3MiOiJQQVNTIiwiaW52YXJpYW50XzJfcmV2ZXJzaWJsZV90b2tlbnMiOiJQQVNTIiwiaW52YXJpYW50XzNfaW5fbWVtb3J5X2lzb2xhdGlvbiI6IlBBU1MiLCJpbnZhcmlhbnRfNF96ZXJvX3N1YnByb2Nlc3NvcnMiOiJQQVNTIn0sImlzc3VlZF9hdCI6IjIwMjYtMTEtMjVUMjE6MzY6MzcuNjI2WiIsImxldmVsIjoiTGV2ZWwgMjogVmVyaWZpZWQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uIiwicmVnaXN0cnlfdmVyaWZpY2F0aW9uX3VybCI6Imh0dHBzOi8venRkcy5haS9yZWdpc3RyeS8jcHJpdmFjeXNjcnViYmVyLWNocm8iLCJzcGVjaWZpY2F0aW9uX3VybCI6Imh0dHBzOi8venRkcy5haS9zdGFuZGFyZC8iLCJzdGFuZGFyZCI6IlpURFMgUkZDIHYxLjAiLCJzdWJqZWN0Ijp7ImFwcGxpY2FudCI6IlpURFMgQUkgQ29uc29ydGl1bSIsImF1ZGl0X2hhc2giOiJzaGEyNTY6MGYwMjY3ZTdjODY3NGQ3NzU5YTZjN2IyYzU1YTRhOTcyZjcwZmFlZTc2Y2RmOWM3MjdlY2NiMjk3ZmIxNmRjMCIsImNhdGVnb3J5IjoiQnJvd3NlciBTZWN1cml0eSAmIERPTSBJbnRlcmNlcHRvciIsInByb2R1Y3QiOiJQcml2YWN5U2NydWJiZXIgQ2hyb21lIEV4dGVuc2lvbiIsInJlcG9zaXRvcnkiOiJodHRwczovL2Nocm9tZXdlYnN0b3JlLmdvb2dsZS5jb20vZGV0YWlsL3ByaXZhY3lzY3J1YmJlci0lRTIlODAlOTQtemVyby10ci9waW1vZWpnZWZlaWxham1tYnBnaGlmZG1oZGxrZ2pvbCIsInNjYW5uZWRfZmlsZXNfY291bnQiOjB9LCJ2YWxpZGl0eV9kYXlzIjozNjV9.GyUtQ5tb3YI2ELG2AEHuT-MyuS7KKLWCgmHqc-WuzZ18nJ-b2xURGiuAyXLSN24FIhH8-EVKqDSaFIeIV7wRDA" target="_blank" rel="noopener noreferrer">
    <img src="https://ztds.ai/badge/privacyscrubber-extension.svg" alt="ZTDS Verified Reference Implementation" width="170" height="34" />
  </a>
</div>
```

---

## 4. Commercial Handoff & Two-Brand Firewall Governance

In accordance with the ZTDS Consortium Neutrality Mandate, `ztds.ai` maintains strict vendor neutrality and displays zero commercial price tags. All commercial licensing for the 30 Specialized Industry Profiles, team seat management, and headless SDK/MCP enterprise deployments is handled at `https://privacyscrubber.com/pricing/` and `https://brandmeweb.com`.
