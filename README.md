# ztds-audit — Zero-Trust Data Sanitization (ZTDS RFC v1.0) Invariant Auditor

[![Specification](https://img.shields.io/badge/RFC-v1.0_Proposed_Standard-059669.svg)](https://ztds.ai/standard/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Zenodo DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.22058770-blue.svg)](https://doi.org/10.5281/zenodo.22058770)
[![OSF DOI](https://img.shields.io/badge/OSF-10.17605%2FOSF.IO%2F5BYJF-blue.svg)](https://doi.org/10.17605/OSF.IO/5BYJF)
[![Patent Pending](https://img.shields.io/badge/Patent_Pending-IL_331905_%2F_DAS_B17B-purple.svg)](https://ztds.ai/standard/)
[![WAN Egress](https://img.shields.io/badge/Sensitive_WAN_Egress-0.00_Bytes-emerald.svg)](https://ztds.ai/scanner/)

The official developer CLI and automated CI/CD auditor for the **Zero-Trust Data Sanitization (ZTDS RFC v1.0)** architecture. Maintained by the **ZTDS AI Consortium**.

ZTDS is an open industry standard governing in-memory data sanitization for artificial intelligence, retrieval-augmented generation (RAG), and Large Language Model (LLM) pipelines.

---

## 1. The 4 Fundamental Invariants (RFC v1.0)

Every AI pipeline audited by `ztds-audit` is verified against the 4 core mathematical and architectural invariants:

1. **Invariant 1: Zero External Egress Prior to Sanitization**: Raw sensitive cleartext (PII, PHI, API secrets, private financial numbers) must never cross the local execution boundary prior to reversible surrogate tokenization.
2. **Invariant 2: Deterministic Reversible Tokenization**: Semantic, syntactic, and structural context must be preserved for LLM reasoning while de-identification lookup tables remain strictly in local host volatile memory.
3. **Invariant 3: Cryptographic & In-Memory Isolation**: Operations run in volatile heap or hardware-attested enclaves (WASM, Nitro Enclaves, C-ABI) with zero unencrypted disk spill and immediate memory zeroization.
4. **Invariant 4: Continuous Subprocessor Exclusion**: Local client-side execution eliminates third-party transmission, legally exempting deployments from GDPR Article 28 data processing agreements (Zero-DPA).

---

## 2. Quickstart

Run a zero-install security and invariant audit across your codebase or AI agent repository:

```bash
npx ztds-audit --dir ./src --strict
```

### Command-Line Flags

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-d, --dir <path>` | Target directory to audit | Current working directory |
| `--json` | Output structured machine-readable JSON report | `false` |
| `--strict` | Fail build on any low-severity or informational finding | `false` |
| `-h, --help` | Display CLI options and usage | N/A |

### Example Output

```text
[ZTDS] ZTDS.ai In-Memory Codebase Auditor (RFC v1.0 Conformance)
----------------------------------------------------------------------
Directory:     /home/runner/work/ai-agent/src
Files Scanned: 48 files in 18ms
Audit Hash:    sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
----------------------------------------------------------------------

[PASS] CONFORMANCE CONFIRMED: 0 INVARIANT VIOLATIONS DETECTED
All scanned files comply with ZTDS Invariant 1 (Zero-Egress) and Invariant 3 (RAM isolation).

[LEGAL STATUS] Qualifies for GDPR Article 28 DPA Exemption (Zero-Subprocessor Chain)
[PERFORMANCE]  0.00 Bytes Sensitive WAN Egress | Pure In-Memory Execution

Next Steps for Builders & Maintainers:
1. Include this audit hash in your pull request: https://ztds.ai/apply/
2. Embed your Verified Trust Badge in README.md to claim your registry backlink:
   [![ZTDS Verified](https://ztds.ai/badge/your-app.svg)](https://ztds.ai/registry/)
```

---

## 3. GitHub Actions CI/CD Integration

Enforce zero-trust data sanitization on every pull request by creating `.github/workflows/ztds-audit.yml`:

```yaml
name: ZTDS Zero-Trust Compliance Audit

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  audit:
    name: Verify ZTDS RFC v1.0 Invariants
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Execute ZTDS Invariant Audit
        run: npx ztds-audit --dir ./src --strict
```

---

## 4. Remediation & Certified Implementation Engines

If `ztds-audit` detects sensitive credentials, unmasked PII, or third-party telemetry in your AI pipeline, install a certified ZTDS execution engine to achieve instant conformance:

| Tier | Package | License | Role & Deployment |
| :--- | :--- | :--- | :--- |
| **Open Reference Core** | `@ztds/core` | Apache-2.0 | Vendor-neutral in-memory TypeScript/JS baseline. Universal regex rules (Email, Phone, PAN, SSN, API Keys). [Docs](https://ztds.ai/sdk/) |
| **Certified Pioneer SDK** | `@privacyscrubber/sdk` | Commercial / Air-Gapped | High-throughput WASM engine with 30 high-ACV industry profiles (HIPAA, PCI-DSS, Legal FRE-502), multi-threaded pipeline bindings, offline Ed25519 node licensing. [Get SDK](https://privacyscrubber.com/pricing/?tier=SDK) |
| **Air-Gapped IDE MCP** | `@privacyscrubber/mcp-server` | Commercial / Stdio | Stdio MCP proxy for Cursor, Windsurf, Claude Code, and autonomous developer agents. [MCP Guide](https://ztds.ai/sdk/) |

---

## 5. Ecosystem Demarcation & Neutrality

- **ZTDS.ai (`ztds.ai`)**: Independent, vendor-neutral open standard, certification authority, and technical consortium. Governs RFC v1.0 specifications under Apache 2.0 / CC BY 4.0.
- **PrivacyScrubber (`privacyscrubber.com`)**: Commercial reference implementation and pioneer engine provider.

---

## 6. Intellectual Property & Statutory Governance

- **Patent Application**: Israel Patent Office (ILPO) Application No. **IL 331905** (*System and Method for Client-Side Zero-Trust Data Sanitization and Cryptographic Multi-Party Pipeline Handoff*). WIPO DAS Access Code: **B17B**. Paris Convention international priority locked through 14/09/2027.
- **Registered Trademark**: **ZTDS™** (ILPO Order #182655957, Classes 9 & 42).
- **Academic DOIs**:
  - Zenodo: [10.5281/zenodo.22058770](https://doi.org/10.5281/zenodo.22058770)
  - Open Science Framework (OSF): [10.17605/OSF.IO/5BYJF](https://doi.org/10.17605/OSF.IO/5BYJF)
  - SSRN: [7335581](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7335581)
- **Author & Founder**: Ilya Sibiryakov (BrandMeWeb)

---

## 7. License

Licensed under the [Apache License, Version 2.0](LICENSE).
Copyright 2024–2026 Ilya Sibiryakov (ZTDS AI Consortium / BrandMeWeb).
