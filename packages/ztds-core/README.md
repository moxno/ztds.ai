# @ztds/core — Zero-Trust Data Sanitization Reference Engine (RFC v1.0)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Specification](https://img.shields.io/badge/RFC-v1.0_Proposed_Standard-059669.svg)](https://ztds.ai/standard/)
[![Zero Egress](https://img.shields.io/badge/WAN_Egress-0.00_Bytes-emerald.svg)](https://ztds.ai/scanner/)

The official vendor-neutral open reference implementation and TypeScript interface for the **Zero-Trust Data Sanitization (ZTDS RFC v1.0)** specification. Maintained by the **ZTDS AI Consortium** (Working Groups WG-1 Core RFC and WG-4 Industry Profiles).

---

## 🏛️ Ecosystem Architecture & Demarcation

ZTDS is an open industry standard. To preserve vendor neutrality while delivering production performance, the ecosystem operates on a two-tier implementation model:

| Tier | Package | License | Scope & Capabilities |
| :--- | :--- | :--- | :--- |
| **Open Reference Engine** | `@ztds/core` | Apache-2.0 | Pure JavaScript / TypeScript in-memory baseline engine. Enforces RFC v1.0 4 Invariants, universal base regex entities (Email, Phone, PAN, SSN, IPv4, Secrets). Free forever for open-source and academic development. |
| **Enterprise Production Engine** | `@privacyscrubber/sdk` | Commercial / Air-Gapped | High-throughput SIMD WebAssembly engine with 30 certified high-ACV industry profiles (HIPAA PHI-18, PCI-DSS 4.0, Legal FRE-502, Defense CMMC, FinTech), multi-threaded pipeline bridges, and offline Ed25519 node licensing. |

---

## 📦 Quickstart

```bash
npm install @ztds/core
```

### Basic In-Memory Masking & De-Tokenization

```typescript
import { ZTDSEngine, ZTDSClient } from '@ztds/core';

const engine = new ZTDSEngine();

// 1. Sanitize prompt locally in volatile memory
const rawPrompt = "Summarize clinical inquiry for john.doe@example.com (SSN: 000-12-3456).";
const { sanitizedText, tokenMap, zeroEgressAttested } = engine.mask(rawPrompt);

console.log(sanitizedText);
// "Summarize clinical inquiry for [EMAIL_TOKEN_1] (SSN: [SSN_TOKEN_2])."

// 2. Dispatch sanitized prompt to external LLM (OpenAI, Anthropic, Ollama)
// ... LLM computes safely over context tokens ...

// 3. De-tokenize response synchronously using local volatile mapping table
const modelResponse = "Follow-up email sent to [EMAIL_TOKEN_1].";
const { restoredText } = engine.reveal(modelResponse, tokenMap);

console.log(restoredText);
// "Follow-up email sent to john.doe@example.com."

// 4. Zeroize memory buffer
engine.flush();
```

---

## 🛡️ The 4 Fundamental Invariants (RFC v1.0)

1. **Invariant 1: Zero External Egress Prior to Sanitization**: Raw sensitive cleartext never leaves host volatile RAM.
2. **Invariant 2: Deterministic Reversible Tokenization**: Semantic context is preserved for LLM reasoning while mapping tables remain isolated locally.
3. **Invariant 3: Cryptographic & In-Memory Isolation**: Volatile heap execution with zero disk spill and hardware enclave / WASM sandboxing.
4. **Invariant 4: Continuous Subprocessor Exclusion**: Vendor operates strictly as a local computational utility, eliminating GDPR Article 28 data processor obligations.

---

## 🔗 Resources

- **Specification RFC v1.0**: [https://ztds.ai/standard/](https://ztds.ai/standard/)
- **Perimeter Scanner**: [https://ztds.ai/scanner/](https://ztds.ai/scanner/)
- **Verified Implementations**: [https://ztds.ai/registry/](https://ztds.ai/registry/)
- **Consortium Governance**: [https://ztds.ai/governance/](https://ztds.ai/governance/)
