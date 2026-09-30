# ZTDS MCP Server (`ztds-mcp`)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Specification: RFC v1.0](https://img.shields.io/badge/Specification-RFC_v1.0-emerald.svg)](https://ztds.ai/standard/)
[![IETF Draft](https://img.shields.io/badge/IETF_Draft-sibiryakov--ztds--protocol--02-purple.svg)](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22058770.svg)](https://doi.org/10.5281/zenodo.22058770)
[![Zero Network Egress](https://img.shields.io/badge/Zero_Network_Egress-Attested-brightgreen.svg)](https://ztds.ai)

Open-source reference implementation of the **Zero-Trust Data Sanitization (ZTDS)** protocol for the Model Context Protocol (MCP) ecosystem. Conforms to the open architectural specification and IETF Internet-Draft `draft-sibiryakov-ztds-protocol-00`.

Runs **100% locally** with zero network calls, zero external subprocessors, zero disk writes, and zero telemetry.

---

## The 4 Core Protocol Invariants

1. **Invariant 1: Zero External Egress Prior to Sanitization**  
   Cleartext PII, PHI, and credentials never cross the local execution boundary unmasked.
2. **Invariant 2: Deterministic Context-Preserving Reversible Tokenization**  
   Sensitive values are replaced by synthetic tokens (`[EMAIL_TOKEN_1]`, `[API_SECRET_TOKEN_1]`) maintaining syntactic context for LLMs.
3. **Invariant 3: Verifiable Ephemeral RAM Isolation (Theorem 2 Zeroization)**  
   Mapping tables exist strictly in volatile memory and are zeroized upon session termination.
4. **Invariant 4: Subprocessor Chain Exclusion**  
   Operates strictly as a local computational utility under GDPR Recital 26, rendering Data Processing Agreements (DPAs) unnecessary.

---

## Installation & Client Configuration

### 1. Claude Desktop

Add to your `claude_desktop_config.json`:

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

Config file locations:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

### 2. Cursor IDE

Add to your Cursor MCP settings (`Settings` -> `Features` -> `MCP` -> `Add New MCP Server`):
- **Name**: `ztds`
- **Type**: `command`
- **Command**: `npx -y ztds-mcp`

Or add to `.cursor/mcp.json` in your workspace:

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

### 3. Windsurf / Codeium

Add to `~/.codeium/windsurf/mcp_config.json`:

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

---

## Available MCP Tools

| Tool | Description |
| :--- | :--- |
| `ztds_sanitize` | Masks sensitive PII/credentials with deterministic surrogate tokens prior to LLM transmission. |
| `ztds_restore` | Restores original cleartext from volatile in-memory mapping into LLM output. |
| `ztds_audit` | Scans text for exposed credentials and PII, returning SHA-256 integrity receipt and risk score. |
| `ztds_info` | Retrieves RFC v1.0 standard details, academic citations, and enterprise documentation. |
| `ztds_reset_session` | Purges and zeroizes all volatile session token mappings (Theorem 2). |

---

## Universal Baseline vs Commercial Production Profiles

This open-source server covers universal baseline entities (Email, Phone, SSN, Credit Cards, IPv4, IBAN, API Secrets).

For production enterprise workloads requiring:
- **30+ Specialized Industry Profiles**: HIPAA PHI (18 identifiers), PCI-DSS (cardholder data & CVV), GLBA Financial, SEC 17a-4, CJIS Law Enforcement, FERPA Student Records, European National IDs.
- **Agentic Guard Automation**: Autonomous zero-trust tool wrappers (`guard_exec`, `guard_read_file`, `guard_apply_patch`).
- **Team Seat Licensing**: Offline air-gapped license tokens without cloud telemetry.
- **Headless SDK**: Backend RAG pipeline redaction for Node.js / TypeScript / Python.

Deploy the production commercial engine:

```bash
# Production MCP Server
npm install -g @privacyscrubber/mcp-server

# Headless Backend SDK
npm install @privacyscrubber/sdk
```

Website: [https://privacyscrubber.com](https://privacyscrubber.com)

---

## Verification & Self-Test

To run the offline test suite:

```bash
node test.js
```

Conforms to standard JSON-RPC 2.0 stdio protocol. Zero runtime dependencies.

---

## License

Apache-2.0. Maintained by the ZTDS AI Consortium (Working Group WG-1).
Website: [https://ztds.ai](https://ztds.ai)
