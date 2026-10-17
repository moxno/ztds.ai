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
  <a href="https://ztds.ai/verify/#cert=ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IChCcmFuZE1lV2ViIEVjb3N5c3RlbSkiLCJiYWRnZV91cmwiOiJodHRwczovL3p0ZHMuYWkvYmFkZ2UvcHJpdmFjeXNjcnViYmVyLWNocm8uc3ZnIiwiY2VydGlmaWNhdGVfaWQiOiJaVERTLUNFUlQtMjAyNi1QUklWQUNZU0NSVUJCRVItQ0hSTy0wRjlFMTciLCJleHBpcmVzX2F0IjoiMjAyNy0wOS0yNlQxOTozNTo0NS4zMzdaIiwiaW52YXJpYW50cyI6eyJpbnZhcmlhbnRfMV96ZXJvX2VncmVzcyI6IlBBU1MiLCJpbnZhcmlhbnRfMl9yZXZlcnNpYmxlX3Rva2VucyI6IlBBU1MiLCJpbnZhcmlhbnRfM19pbl9tZW1vcnlfaXNvbGF0aW9uIjoiUEFTUyIsImludmFyaWFudF80X3plcm9fc3VicHJvY2Vzc29ycyI6IlBBU1MifSwiaXNzdWVkX2F0IjoiMjAyNi0wOS0yNlQxOTozNTo0NS4zMzdaIiwibGV2ZWwiOiJMZXZlbCAyOiBWZXJpZmllZCBSZWZlcmVuY2UgSW1wbGVtZW50YXRpb24iLCJyZWdpc3RyeV92ZXJpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3JlZ2lzdHJ5LyNwcml2YWN5c2NydWJiZXItY2hybyIsInNwZWNpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3N0YW5kYXJkLyIsInN0YW5kYXJkIjoiWlREUyBSRkMgdjEuMCIsInN1YmplY3QiOnsiYXBwbGljYW50IjoiSWx5YSBTaWJpcnlha292IChCcmFuZE1lV2ViKSIsImF1ZGl0X2hhc2giOiJzaGEyNTY6MGYwMjY3ZTdjODY3NGQ3NzU5YTZjN2IyYzU1YTRhOTcyZjcwZmFlZTc2Y2RmOWM3MjdlY2NiMjk3ZmIxNmRjMCIsImNhdGVnb3J5IjoiQnJvd3NlciBTZWN1cml0eSAmIERPTSBJbnRlcmNlcHRvciIsInByb2R1Y3QiOiJQcml2YWN5U2NydWJiZXIgQ2hyb21lIEV4dGVuc2lvbiIsInJlcG9zaXRvcnkiOiJodHRwczovL2Nocm9tZXdlYnN0b3JlLmdvb2dsZS5jb20vZGV0YWlsL3ByaXZhY3lzY3J1YmJlci9kYWpta21lcGlnbGxmZGxqb2NpbWNoZmlqZGZtY25wbSIsInNjYW5uZWRfZmlsZXNfY291bnQiOjB9LCJ2YWxpZGl0eV9kYXlzIjozNjV9.I-3tB5YbFb-JehyeBoljvmiIF5ugdp-eZZ9dkFxb_u5BC8saXlZ0jypKdiHBkAOgFEz6ltH_zEHAsEGHhlLqDQ" target="_blank" rel="noopener noreferrer">
    <img src="https://ztds.ai/badge/privacyscrubber-extension.svg" alt="ZTDS Verified Reference Implementation" width="170" height="34" />
  </a>
</div>
```

---

## 4. Commercial Handoff & Two-Brand Firewall Governance

In accordance with the ZTDS Consortium Neutrality Mandate, `ztds.ai` maintains strict vendor neutrality and displays zero commercial price tags. All commercial licensing for the 30 Specialized Industry Profiles, team seat management, and headless SDK/MCP enterprise deployments is handled at `https://privacyscrubber.com/pricing/` and `https://brandmeweb.com`.
