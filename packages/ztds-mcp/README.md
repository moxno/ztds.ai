# ZTDS MCP Server (`ztds-mcp`)
### Local Security Firewall for AI Agents & IDEs (Cursor, Claude Code, Windsurf)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Specification: RFC v1.0](https://img.shields.io/badge/Specification-RFC_v1.0-emerald.svg)](https://ztds.ai/standard/)
[![IETF Standards Track](https://img.shields.io/badge/IETF_Standards_Track-sibiryakov--ztds--protocol-purple.svg)](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22058770.svg)](https://doi.org/10.5281/zenodo.22058770)
[![Zero Network Egress](https://img.shields.io/badge/Zero_Network_Egress-Attested-brightgreen.svg)](https://ztds.ai)

Open-source reference implementation of the **Zero-Trust Data Sanitization (ZTDS)** protocol for the Model Context Protocol (MCP) ecosystem. Conforms to the open architectural specification RFC v1.0 and IETF Standards Track `sibiryakov-ztds-protocol`.

Runs **100% locally in device volatile memory (RAM)** with zero network calls, zero external subprocessors, zero disk writes, and zero telemetry.

---

## 1-Click Quickstart (Automated Setup)

Auto-configure your installed AI IDEs and clients with a single command:

```bash
npx ztds-mcp init
```

The configurator automatically:
1. Detects installed clients: **Cursor IDE**, **Claude Desktop**, and **Windsurf**.
2. Creates or safely merges the `ztds` server block into their local configuration files.
3. Executes an in-memory cryptographic self-test to verify zero-leakage tokenization.

To verify existing client configurations:

```bash
npx ztds-mcp status
```

---

## Standalone CLI Pre-Execution Auditor

Audit sensitive files, configuration directories, or CI/CD pipelines for credential leakage prior to AI agent ingestion:

```bash
# Scan a single sensitive file
npx ztds-mcp audit .env

# Scan an entire repository/source directory
npx ztds-mcp audit ./src

# Machine-readable JSON output for CI/CD gates (exits 1 on violation)
npx ztds-mcp audit --json
```

Outputs line-by-line category breakdowns, risk assessment, and cryptographic SHA-256 attestation receipts.

---

## Why AI IDEs Leak Data & How ZTDS Stops It

Autonomous agents in modern IDEs (Cursor, Claude Code, Windsurf) routinely index repository files, including `.env` secrets, database credentials, production logs, customer emails, and API keys. When an agent crafts a prompt or calls a tool, these sensitive strings are transmitted in cleartext across the internet to frontier LLM APIs.

**ZTDS MCP acts as an in-memory local security firewall**:
- **Intercepts**: Tools and prompt text are evaluated inside client RAM prior to transmission.
- **De-identifies**: Real credentials and PII are replaced with bijective, context-preserving synthetic tokens (`[API_SECRET_TOKEN_1]`, `[EMAIL_TOKEN_1]`).
- **Restores**: When the model returns code or instructions containing synthetic tokens, the local MCP server re-maps the cleartext back into the IDE response.
- **Zero Egress**: Real private keys and customer data never touch the network unmasked.

---

## The 4 Core Protocol Invariants

1. **Invariant 1: Zero External Egress Prior to Sanitization**  
   Cleartext PII, PHI, and credentials never cross the local execution boundary unmasked.
2. **Invariant 2: Deterministic Context-Preserving Reversible Tokenization**  
   Sensitive values are replaced by synthetic tokens maintaining syntactic and semantic context for LLMs.
3. **Invariant 3: Verifiable Ephemeral RAM Isolation (Theorem 2 Zeroization)**  
   Mapping tables exist strictly in volatile memory and are zeroized upon session termination.
4. **Invariant 4: Subprocessor Chain Exclusion**  
   Operates strictly as a local computational utility under GDPR Recital 26, rendering Data Processing Agreements (DPAs) unnecessary.

---

## Manual Client Configuration

If you prefer configuring your clients manually without `npx ztds-mcp init`:

### 1. Claude Desktop

Add to `claude_desktop_config.json`:

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

Add to `.cursor/mcp.json` in your workspace root:

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

## Certified Commercial Reference Implementation (PrivacyScrubber)

ZTDS is an open, vendor-neutral standard. The open-source `ztds-mcp` package serves as the reference implementation covering universal baseline entities (Email, Phone, SSN, Credit Cards, IPv4, IBAN, API Secrets).

For production enterprise workloads requiring continuous regulatory compliance and air-gapped guarantees, **PrivacyScrubber** is the pioneer certified implementation offering:
- **30 Specialized Industry Profiles**: HIPAA PHI (18 identifiers), PCI-DSS 4.0, GLBA Financial, SEC 17a-4, CJIS Law Enforcement, FERPA Student Records, Defense ITAR/CMMC, FRE-502 Legal Work-Product.
- **Agentic Guard Automation**: Autonomous zero-trust tool wrappers (`guard_exec`, `guard_read_file`, `guard_apply_patch`).
- **Air-Gapped Node Licensing**: Disconnected Ed25519 cryptographic tokens without cloud telemetry.
- **Headless SDK**: Backend RAG pipeline redaction for Node.js / TypeScript / Python (`@privacyscrubber/sdk`).
- **SOC 2 Type II Evidence Binder**: Automated audit artifacts (`ztds-evidence-binder.json`) for Drata, Vanta, and AuditBoard.

Deploy the commercial implementation:

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
Lead Architect: Ilya Sibiryakov (Author of ZTDS RFC v1.0, IETF Standards Track `sibiryakov-ztds-protocol`, Patent App IL 331905).
