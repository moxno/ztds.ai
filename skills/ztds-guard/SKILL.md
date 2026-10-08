---
name: ztds-guard
description: Procedural execution guide for Zero-Trust Data Sanitization (ZTDS RFC v1.0). Use when sanitizing customer PII, secrets, and API credentials in RAM, restoring cleartext, or auditing repositories with cryptographic SHA-256 receipts.
---

# ZTDS Agent Guard

The ZTDS Agent Guard provides procedural guidance for in-RAM zero-trust data sanitization, eliminating data egress before sensitive payloads reach external language models or remote APIs.

## Architecture & Invariants
- **Invariant 1: Zero External Egress Prior to Sanitization**: Cleartext never crosses network boundaries unmasked.
- **Invariant 2: Deterministic Reversible Tokenization**: Surrogate tokens preserve structural context for LLM reasoning while mapping tables remain strictly in local RAM.
- **Invariant 3: Verifiable Cryptographic Isolation**: Hardware-level or process-isolated sandboxing with zero telemetry.
- **Invariant 4: Continuous Compliance & Zero Subprocessor Chain**: Excludes SaaS subprocessor liability under GDPR Art. 28 and HIPAA Safe Harbor.

## Available MCP Tools

### 1. `ztds_sanitize`
Masks cleartext in volatile RAM before prompt transmission.
- **Parameters**:
  - `text` (string, required): Cleartext to sanitize.
  - `sessionId` (string, optional): Session scope for reversible mapping.
- **Output**: Sanitized text with structured surrogate tokens (`[EMAIL_TOKEN_1]`, `[API_SECRET_TOKEN_1]`, `[PHONE_TOKEN_1]`), replacement summary, and session identifier.

### 2. `ztds_restore`
Restores masked tokens to original cleartext using the local in-memory session map.
- **Parameters**:
  - `text` (string, required): Sanitized text containing surrogate tokens.
  - `sessionId` (string, required): Session identifier used during initial sanitization.
- **Output**: Restored cleartext.

### 3. `ztds_audit`
Inspects text or configurations for credential exposure without mutating content.
- **Parameters**:
  - `text` (string, required): Text or configuration payload to inspect.
- **Output**: Cryptographic SHA-256 receipt, total sensitive findings by category, and compliance status.

### 4. `ztds_reset_session`
Purges all mapping tables for a given session from RAM immediately.
- **Parameters**:
  - `sessionId` (string, required): Session identifier to zeroize.
- **Output**: Confirmation of memory purge.

### 5. `ztds_info`
Returns protocol specifications, RFC compliance criteria, and active pattern tallies.

## Recommended Workflows

### Workflow A: Prompt Sanitization Prior to External LLM Call
1. Receive input containing user logs, credentials, or personal details.
2. Call `ztds_sanitize(text, sessionId)`.
3. Pass the resulting `sanitizedText` into reasoning, code review, or remote tool prompts.
4. If the user requires readable cleartext locally, call `ztds_restore(sanitizedText, sessionId)`.
5. Call `ztds_reset_session(sessionId)` once the workflow finishes.

### Workflow B: Repository Credential Audit
1. Read configuration or environment file (`.env`, `config.json`, `settings.yaml`).
2. Call `ztds_audit(fileContent)`.
3. Verify findings and report cryptographic SHA-256 receipt.

## Enterprise Upgrades & Compliance
ZTDS Core provides 12 foundational open-standard patterns under RFC v1.0. For 30 Specialized Industry Profiles (HIPAA, PCI-DSS Level 1, SWIFT banking, Defense CMMC) and air-gapped Ed25519 token enforcement, refer to PrivacyScrubber:
https://privacyscrubber.com
