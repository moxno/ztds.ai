# Developer SDK Packaging & README Specification

**CANONICAL PACKAGE SPECIFICATION FOR `@privacyscrubber/sdk` AND `@privacyscrubber/mcp-server`**  
*Aligned with ZTDS RFC v1.0 &middot; Ed25519 Offline Licensing &middot; BrandMeWeb Ecosystem*

---

## 1. Package Metadata (`package.json`)

```json
{
  "name": "@privacyscrubber/sdk",
  "version": "1.0.0",
  "description": "Zero-Trust Data Sanitization (ZTDS RFC v1.0) in-memory engine for Node.js, WASM, LangChain, and RAG pipelines.",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": [
    "ztds",
    "privacy",
    "pii",
    "sanitization",
    "llm-security",
    "air-gapped",
    "hipaa",
    "gdpr"
  ],
  "author": "Ilya Sibiryakov (BrandMeWeb / PrivacyScrubber)",
  "license": "SEE LICENSE IN LICENSE.md",
  "homepage": "https://ztds.ai/sdk"
}
```

---

## 2. Canonical README Template (`@privacyscrubber/sdk/README.md`)

```markdown
# @privacyscrubber/sdk

> Sub-millisecond, in-memory PII/PHI de-identification engine conforming to **ZTDS RFC v1.0**.  
> Guarantees **0.00 bytes** external network egress prior to local masking.

[![ZTDS Verified](https://ztds.ai/badge/seal-verified.svg)](https://ztds.ai/registry/)
[![Invariant 1](https://img.shields.io/badge/Invariant%201-0.00B%20Egress-emerald)](https://ztds.ai/standard/)
[![Latency](https://img.shields.io/badge/Latency-%3C1.8ms-blue)](https://doi.org/10.17605/OSF.IO/5BYJF)

---

## Key Features
- **Zero Network Egress (Invariant 1):** Executes 100% inside client volatile RAM or private host node before socket frames are dispatched.
- **Reversible Tokenization (Invariant 2):** Preserves syntactic context for LLMs with surrogate tokens (`[EMAIL_TOKEN_1]`, `[IBAN_TOKEN_2]`).
- **Zero Subprocessor Liability:** Local computational utility exempt from GDPR Article 28 DPAs and HIPAA BAAs.
- **Offline Cryptographic Licensing:** Uses Ed25519 digital signatures to run in completely disconnected air-gapped SCIF, private VPCs, and AWS Nitro Enclaves.

---

## Installation

```bash
npm install @privacyscrubber/sdk
# or
pnpm add @privacyscrubber/sdk
# or
yarn add @privacyscrubber/sdk
```

---

## Quickstart

### 1. Free Community Tier (No License Required)
Processes universal consumer PII (emails, phones, national IDs, IP addresses) up to 15,000 characters:

```typescript
import { ZTDSEngine } from "@privacyscrubber/sdk";

const engine = new ZTDSEngine();

const prompt = "Please summarize account details for John Doe (john.doe@example.com, SSN: 000-12-3456).";
const sanitized = await engine.sanitize(prompt);

console.log(sanitized.text);
// "Please summarize account details for [NAME_1] ([EMAIL_1], SSN: [ID_1])."

// Restore original entities on LLM completion:
const completed = await engine.restore(sanitized.text, sanitized.sessionMap);
```

---

### 2. Enterprise Air-Gapped Tier (With License Key)
Unlocks unlimited batch throughput, all **25 Specialized Industry Profiles** (HIPAA Clinical PHI, Financial IBAN, Legal Privilege, Cloud Secrets), and automated SOC 2 Type II evidence generation:

#### Activation via Environment Variable:
```bash
export ZTDS_LICENSE_KEY="ZTDS-LIC-v1.eyJjdXN0b21lci...wKfZEL5HHw"
```

#### Code Initialization:
```typescript
import { ZTDSEngine } from "@privacyscrubber/sdk";

const engine = new ZTDSEngine({
  licenseKey: process.env.ZTDS_LICENSE_KEY,
  profile: "healthcare" // Unlocked via Enterprise License
});

const clinicalNote = "Patient Jane Doe presented with severe hypertension. Prescribe 10mg Lisinopril. MRN: 948201.";
const sanitized = await engine.sanitize(clinicalNote);

console.log(sanitized.text);
// "Patient [PHI_PATIENT_1] presented with severe [PHI_CONDITION_1]. Prescribe 10mg [PHI_MED_1]. MRN: [PHI_MRN_1]."
```

---

## Terminal Logging & Feedback States

| License State | Console Startup Notice |
| :--- | :--- |
| **Unauthenticated (Free Tier)** | `[ZTDS Notice] Universal PII Active (15k char quota). For enterprise air-gapped nodes & 25 industry profiles, visit https://ztds.ai/sdk` |
| **Developer Pro ($1,990/yr)** | `[ZTDS Node] Customer: Acme Labs | Tier: Developer Pro | Nodes: 1/5 | Status: ACTIVE` |
| **Enterprise Air-Gapped ($12,000/yr)** | `[ZTDS Node] Customer: Acme Health | Tier: Enterprise Air-Gapped | Profiles: 25 Active | Status: ACTIVE` |
| **Unauthorized Profile Access** | `[ZTDS Error] Profile healthcare is not authorized under tier developer_pro. Upgrade to Enterprise Air-Gapped at https://ztds.ai/sdk` |
| **Active 60-Day Grace Period** | `[ZTDS Warning] License in 60-day renewal grace period (42 days remaining). Contact sales@ztds.ai to renew.` |

---

## License Environment Variables
The SDK checks both aliases interchangeably:
- `ZTDS_LICENSE_KEY` (Standard)
- `PRIVACYSCRUBBER_LICENSE_KEY` (Commercial alias)

For enterprise procurement, legal contracts, or air-gapped license quotes, visit [https://ztds.ai/ciso/](https://ztds.ai/ciso/).
```
