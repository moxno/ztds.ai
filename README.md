# ztds-mcp & ztds-audit — Zero-Trust Data Sanitization (ZTDS™ RFC v1.0) MCP Server & Invariant Auditor

[![Specification](https://img.shields.io/badge/RFC-v1.0_Proposed_Standard-059669.svg)](https://ztds.ai/standard/)
[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05_Stdio-2563eb.svg)](https://modelcontextprotocol.io)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Zenodo DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.22058770-blue.svg)](https://doi.org/10.5281/zenodo.22058770)
[![OSF DOI](https://img.shields.io/badge/OSF-10.17605%2FOSF.IO%2F5BYJF-blue.svg)](https://doi.org/10.17605/OSF.IO/5BYJF)
[![Patent Pending](https://img.shields.io/badge/Patents_Pending-Paris_Priority-purple.svg)](https://ztds.ai/certification/)
[![WAN Egress](https://img.shields.io/badge/Sensitive_WAN_Egress-0.00_Bytes-emerald.svg)](https://ztds.ai/scanner/)
[![Smithery Badge](https://smithery.ai/badge/ilsimox/ztds-mcp)](https://smithery.ai/servers/ilsimox/ztds-mcp)
[![MCPRush Grade A](https://img.shields.io/badge/MCPRush-Grade_A_Verified-10b981.svg)](https://mcprush.com/to/ztds-mcp?ref=badge)

[![Ztds MCP server](https://mcprush.com/badge/ztds-mcp/card.svg)](https://mcprush.com/to/ztds-mcp?ref=badge)

This repository contains the official **Model Context Protocol (MCP) Server implementation (`ztds-mcp`)** and **Codebase Invariant Auditor (`ztds-audit`)** for the **Zero-Trust Data Sanitization (ZTDS™ RFC v1.0)** standard. Maintained by the **ZTDS AI Consortium**.

- **MCP Server Source Code (in this repository)**: [`packages/ztds-mcp/index.js`](packages/ztds-mcp/index.js)
- **MCP Manifest & Server Card**: [`packages/ztds-mcp/manifest.json`](packages/ztds-mcp/manifest.json) | [`server-card.json`](server-card.json) | [`smithery.yaml`](smithery.yaml)
- **MCP Server Test Suite**: [`packages/ztds-mcp/test.js`](packages/ztds-mcp/test.js)
- **CLI Invariant Auditor**: [`bin/ztds-audit.js`](bin/ztds-audit.js)

ZTDS™ governs in-memory data sanitization for AI agents, IDE assistants (Claude Desktop, Claude Code, Cursor, Windsurf, Zed), retrieval-augmented generation (RAG), and Large Language Model (LLM) pipelines. It executes **100% locally in volatile device memory (RAM)** with zero external network calls, zero disk writes, and zero subprocessors.

---

## 1. MCP Server Implementation (`ztds-mcp`)

The reference MCP server (`packages/ztds-mcp/index.js`) implements the Model Context Protocol (`2024-11-05`) over `stdio` JSON-RPC 2.0 transport with zero external runtime dependencies. It intercepts sensitive cleartext (PII, PHI, API secrets, IBANs, credit cards) in client RAM prior to LLM dispatch, substitutes deterministic surrogate tokens (`[EMAIL_TOKEN_1]`, `[API_SECRET_TOKEN_1]`), and restores authentic values locally in LLM responses.

### 1.1 Installation & MCP Client Configuration

#### Option A: 1-Click Automated Setup
```bash
npx ztds-mcp init
```

#### Option B: Claude Desktop (`claude_desktop_config.json`) & Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "ztds": {
      "command": "npx",
      "args": ["-y", "ztds-mcp"]
    }
  }
}
```

#### Option C: Run Directly from Repository Source
```json
{
  "mcpServers": {
    "ztds": {
      "command": "node",
      "args": ["/absolute/path/to/ztds.ai/packages/ztds-mcp/index.js"]
    }
  }
}
```

#### Option D: Claude Code CLI
```bash
claude mcp add ztds -- npx -y ztds-mcp
```

---

### 1.2 MCP Tools (`tools/list` & `tools/call`)

Implemented in [`packages/ztds-mcp/index.js`](packages/ztds-mcp/index.js):

| Tool Name | Input Schema (`properties`) | Description |
| :--- | :--- | :--- |
| `ztds_sanitize` | `text` (`string`, required), `sessionId` (`string`, optional) | Masks sensitive PII, PHI, and credentials in client volatile RAM with deterministic surrogate tokens (`[EMAIL_TOKEN_1]`, `[API_SECRET_TOKEN_1]`) before LLM ingestion and emits a cryptographic SHA-256 `ZTDS-RECEIPT-*` attestation. |
| `ztds_restore` | `text` (`string`, required), `sessionId` (`string`, optional) | Restores original unmasked cleartext from surrogate tokens locally in volatile RAM using atomic single-pass lookup (preventing second-order token injection). |
| `ztds_audit` | `text` (`string`, required) | Audits text or file contents for exposed credentials and PII against ZTDS RFC v1.0, returning category breakdowns, risk level (`LOW`/`HIGH`/`CRITICAL`), and a SHA-256 compliance receipt. |
| `ztds_info` | `{}` (no arguments) | Returns active ZTDS RFC v1.0 protocol status, IETF Standards Track metadata, and volatile RAM session metrics. |
| `ztds_reset_session` | `sessionId` (`string`, optional) | Explicitly zeroizes and destroys the volatile in-memory surrogate mapping table (Theorem 2 RAM zeroization). |

#### Example JSON-RPC `tools/call` (`ztds_sanitize` -> `ztds_restore`)

**Request (`ztds_sanitize`)**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "ztds_sanitize",
    "arguments": {
      "text": "Customer alice@acme.org reported failure with key sk-proj-demo-key.",
      "sessionId": "ide-session-01"
    }
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Customer [EMAIL_TOKEN_1] reported failure with key [API_SECRET_TOKEN_1].\n\n> [ZTDS Invariant 1 Attested] Zero external network egress.\n> Receipt: ZTDS-RECEIPT-8F4B2C19E0A3D712 | Execution: 42µs | Entities Masked: 2"
      }
    ],
    "isError": false
  }
}
```

---

### 1.3 MCP Resources (`resources/list` & `resources/read`)

The MCP server exposes structured read-only protocol and telemetry resources via `resources/list` and `resources/read`:

| Resource URI | MIME Type | Description |
| :--- | :--- | :--- |
| `ztds://spec/rfc-v1` | `application/json` | Formal ZTDS RFC v1.0 / IETF `draft-sibiryakov-ztds-protocol` specification metadata and the 4 core mathematical invariants. |
| `ztds://session/telemetry` | `application/json` | Real-time volatile RAM session count, capacity limits, and zero-egress attestation status (zero cleartext exposure). |

---

### 1.4 MCP Prompts (`prompts/list` & `prompts/get`)

| Prompt Name | Arguments | Description |
| :--- | :--- | :--- |
| `ztds_guard` | `task` (`string`, required) | Activates the ZTDS Zero-Trust Data Sanitization guardrail for the current IDE/agent workflow, instructing the model to invoke `ztds_sanitize` prior to external reasoning and `ztds_restore` on output. |

---

### 1.5 Programmatic / Node.js SDK Usage (`packages/ztds-mcp/index.js`)

The MCP server module exports its JSON-RPC dispatcher and in-memory sanitization primitives for direct programmatic integration and testing:

```javascript
import {
  handleMessage,
  sanitizeText,
  restoreText,
  auditText,
  resetSessionStore,
  TOOLS,
  PROMPTS,
  RESOURCES
} from './packages/ztds-mcp/index.js';

// 1. Direct in-memory sanitization & restoration
const scrubbed = sanitizeText('Send wire to DE89370400440532013000 for john@example.com', 'session-1');
console.log(scrubbed.sanitizedText); // "Send wire to [IBAN_TOKEN_1] for [EMAIL_TOKEN_1]"

const restored = restoreText(`Confirmed transfer to ${scrubbed.sanitizedText}`, 'session-1');
console.log(restored.restoredText);

// 2. Direct MCP JSON-RPC 2.0 protocol invocation
const rpcResponse = await handleMessage({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
});

// 3. Zeroize volatile session memory (Theorem 2)
resetSessionStore('session-1');
```

Run the MCP server verification suite locally:
```bash
node packages/ztds-mcp/test.js
```

---

## 2. The 4 Fundamental Invariants (RFC v1.0)

Every AI pipeline protected by `ztds-mcp` and audited by `ztds-audit` is verified against the 4 core mathematical and architectural invariants:

1. **Invariant 1: Zero External Egress Prior to Sanitization**: Raw sensitive cleartext (PII, PHI, API secrets, private financial numbers) must never cross the local execution boundary prior to reversible surrogate tokenization.
2. **Invariant 2: Deterministic Reversible Tokenization**: Semantic, syntactic, and structural context must be preserved for LLM reasoning while de-identification lookup tables remain strictly in local host volatile memory.
3. **Invariant 3: Cryptographic & In-Memory Isolation**: Operations run in volatile heap or hardware-attested enclaves (WASM, Nitro Enclaves, C-ABI) with zero unencrypted disk spill and immediate memory zeroization.
4. **Invariant 4: Continuous Subprocessor Exclusion**: Local client-side execution eliminates third-party transmission, legally exempting deployments from GDPR Article 28 data processing agreements (Zero-DPA).

---

## 3. Codebase Invariant Auditor CLI (`ztds-audit`)

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

## 4. GitHub Actions CI/CD Integration

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
        uses: moxno/ztds.ai@main
        with:
          dir: './src'
          strict: true
```

---

## 5. Empirical AI Safety Benchmark (Frontier LLMs)

Verify cleartext leakage prevention, bijective fidelity, and microsecond latency across OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 2.0 Pro, and DeepSeek-V3:

```bash
# Execute 25 multi-domain enterprise scenarios across 4 frontier LLM families
npx ztds-bench

# Generate formal Markdown evaluation report & Ed25519 cryptographic certificate
npx ztds-bench --out-report benchmark-report.md --cert
```

| Frontier Model | Raw Egress (No ZTDS) | Protected Egress (ZTDS) | Leakage Prevention Rate | Bijective Fidelity |
| :--- | :--- | :--- | :--- | :--- |
| `openai/gpt-4o` | **100.0%** | **0.00%** | **100.0%** | **100.0%** |
| `anthropic/claude-3-5-sonnet` | **100.0%** | **0.00%** | **100.0%** | **100.0%** |
| `google/gemini-2.0-pro` | **100.0%** | **0.00%** | **100.0%** | **100.0%** |
| `deepseek/deepseek-v3` | **100.0%** | **0.00%** | **100.0%** | **100.0%** |

Full report: [ZTDS AI Safety Benchmark Report (2026)](docs/security/ZTDS_AI_SAFETY_BENCHMARK_2026.md)

---

## 6. Remediation & Certified Implementation Engines

| Tier | Package | License | Role & Deployment |
| :--- | :--- | :--- | :--- |
| **Open Reference Core** | `@ztds/core` ([`packages/ztds-core`](packages/ztds-core)) | Apache-2.0 | Vendor-neutral in-memory TypeScript/JS baseline. Universal regex rules (Email, Phone, PAN, SSN, API Keys). [Docs](https://ztds.ai/sdk/) |
| **Open Reference MCP** | `ztds-mcp` ([`packages/ztds-mcp`](packages/ztds-mcp)) | Apache-2.0 | Official zero-dependency reference MCP server (`io.github.moxno/ztds` on Anthropic Registry) for Cursor, Claude Desktop, and Zed. [MCP Guide](https://ztds.ai/sdk/) |
| **Certified Pioneer SDK** | `@privacyscrubber/sdk` | Commercial / Air-Gapped | High-throughput WASM engine with 30 Specialized Industry Profiles (HIPAA, PCI-DSS, Legal FRE-502), multi-threaded pipeline bindings, offline Ed25519 node licensing. [Get SDK](https://privacyscrubber.com/sdk/?utm_source=ztds.ai&utm_medium=readme&utm_campaign=certified_pioneer) |
| **Air-Gapped IDE MCP** | `@privacyscrubber/mcp-server` | Commercial / Stdio | Stdio MCP proxy (`io.github.moxno/privacyscrubber-mcp`) for Cursor, Windsurf, Claude Code, and autonomous developer agents with 30 enterprise profiles. [MCP Guide](https://ztds.ai/sdk/) |

---

## 7. Ecosystem Demarcation & Neutrality

- **ZTDS.ai (`ztds.ai`)**: Independent, vendor-neutral open standard, certification authority, and technical consortium. Governs RFC v1.0 specifications under Apache 2.0 / CC BY 4.0.
- **PrivacyScrubber (`privacyscrubber.com`)**: Commercial reference implementation and pioneer engine provider.

---

## 8. Intellectual Property & Statutory Governance

- **Patent Application**: **U.S. & International Patents Pending** (*System and Method for Client-Side Zero-Trust Data Sanitization and Cryptographic Multi-Party Pipeline Handoff*). Paris Convention & 35 U.S.C. § 119 Priority ().
- **Registered Trademark**: **ZTDS™** (ILPO Order #182655957, Classes 9 & 42).
- **Academic DOIs**:
  - Zenodo: [10.5281/zenodo.22058770](https://doi.org/10.5281/zenodo.22058770)
  - Open Science Framework (OSF): [10.17605/OSF.IO/5BYJF](https://doi.org/10.17605/OSF.IO/5BYJF)
  - SSRN: [7335581](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7335581)
- **Author & Founder**: Ilya Sibiryakov (BrandMeWeb)

---

## 9. License

Licensed under the [Apache License, Version 2.0](LICENSE).
Copyright 2024–2026 Ilya Sibiryakov (ZTDS AI Consortium / BrandMeWeb).
