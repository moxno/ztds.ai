# ZTDS.ai — Zero-Trust Pipeline Scanner & Verification Architecture (2026 SSOT)

## 1. The Zero-Trust Dilemma in Third-Party Scanners

Traditional SaaS code scanners require users to grant read access to their private GitHub repositories or upload code snippets to cloud servers. 
For a Zero-Trust standard, this creates an irreconcilable conflict:
- Asking developers to send private proprietary code to `ztds.ai` servers to check for "zero server transmission" directly violates Invariant 3.
- Browser cross-origin security (CORS) blocks any client-side JavaScript from scanning arbitrary third-party domains or private APIs without an intermediary proxy.

---

## 2. The Hybrid Resolution: 100% In-Browser Linter + Standalone CLI

To resolve this conflict without compromise, ZTDS deploys a dual-mode verification model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ZTDS HYBRID SCANNER MODES                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       ▼                                                               ▼
[MODE 1: IN-BROWSER LINTER]                                [MODE 2: TERMINAL CLI AUDIT]
• Location: ztds.ai/scanner/                               • Command: npx ztds-audit ./src
• Scope: Snippets, Prompts, RAG Logic                      • Scope: Full private repositories
• Runtime: In-Memory Web Worker                            • Runtime: Local developer machine
• Network Egress: EXACTLY 0 BYTES                          • Network Egress: 0 BYTES (Air-Gapped)
• Output: 0-100% Readiness Score + Fixes                   • Output: Cryptographic Audit Receipt
```

---

## 3. Mode 1: In-Browser Static Linter (`/scanner/`)

### Execution Mechanics
- Operates 100% within the browser client without sending a single byte over the wire.
- Evaluates code snippets, system prompt templates, or API middleware against deterministic heuristic rules:
  1. **Cleartext PII Presence (-30 pts):** Detects hardcoded SSNs, patient identifiers, phone numbers, or credit cards in uncompiled prompt templates.
  2. **Persistence Storage Violations (-25 pts):** Flags calls to `localStorage`, `sessionStorage`, `IndexedDB`, or `document.cookie` for session tokens (Invariant 1 violation).
  3. **Unprotected LLM Invocations (-25 pts):** Flags direct SDK calls (`openai.chat.completions.create`, `anthropic.messages.create`) without an preceding in-memory sanitization layer.
- **Readiness Scoring:**
  - 80 - 100%: ZTDS Compliant (Green)
  - 50 - 79%: Partial Compliance / Remediation Required (Amber)
  - <50%: Critical Exposure / Cloud DLP Violations (Red)

---

## 4. Mode 2: Terminal CLI Audit (`npx ztds-audit`)

### Workflow
```bash
# Run local AST analysis on AI service code
npx ztds-audit ./src/ai/pipeline.ts --json

# Run deep scan on entire repository
npx ztds-audit --profile=healthcare --fail-on-leak
```

### Output & Cryptographic Proof
The CLI produces a deterministic, air-gapped audit receipt containing:
- SHA-256 code tree digest.
- Number of files audited.
- Identified sensitive entity patterns.
- Verified in-memory sanitization wrapper.
- Cryptographic hash suitable for submission to `ztds.ai/data/registry.json`.

---

## 5. The 5-Step Airplane Mode Verification Protocol

Every ZTDS auditor can verify any compliant implementation in 30 seconds:
1. Open the tool or pipeline in Google Chrome or Firefox.
2. Open DevTools (`F12`) -> **Network** tab -> Check "Preserve log".
3. Disconnect all network adapters (Toggle **Airplane Mode**).
4. Paste a sensitive cleartext payload (e.g. medical record with SSN, patient name, and email) and click Sanitize.
5. Verify:
   - Sanitized surrogate tokens appear immediately (<2ms).
   - Network tab shows **0 requests** dispatched.
   - Re-identification restores original values locally with **0 requests**.
