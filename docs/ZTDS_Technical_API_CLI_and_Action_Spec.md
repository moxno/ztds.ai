# ZTDS.ai — Technical API, CLI & GitHub Action Specification (2026 SSOT)

## 1. Headless Developer SDK: TypeScript / WASM API Reference

Package Name: `@privacyscrubber/sdk`  
Runtimes: Node.js (>=18), Next.js, Cloudflare Workers (Node compat), Bun, Deno, WebAssembly.  
License: Commercial B2B Developer License ($199/mo or $1,990/yr).  

### 1.1 Type Definitions
```typescript
export type IndustryProfile = 
  | "general" 
  | "healthcare" 
  | "financial" 
  | "legal" 
  | "hr" 
  | "devops" 
  | "realestate" 
  | "custom";

export interface ZTDSConfig {
  profile?: IndustryProfile;
  customRules?: Array<{
    name: string;
    regex: RegExp;
    tokenType: string;
  }>;
  maxLatencyMs?: number; // Default: 2.0
  preserveContextLabels?: boolean; // Default: true
}

export interface SessionMap {
  [surrogateToken: string]: string; // e.g. { "[NAME_1]": "John Doe" }
}

export interface SanitizeResult {
  sanitizedPrompt: string;
  sessionMap: SessionMap;
  tokenCount: number;
  entityBreakdown: Record<string, number>;
  latencyMs: number;
  auditHash: string; // SHA-256 digest of sanitization event
}

export interface AuditReceipt {
  version: "1.0";
  timestamp: string;
  auditHash: string;
  tokensIsolated: number;
  frameworksTriggered: Array<"GDPR" | "HIPAA" | "SOC2" | "PCI_DSS" | "NIST">;
  networkEgressBytes: 0;
  latencyMs: number;
}
```

### 1.2 Core Class Methods
```typescript
export class ZTDSEngine {
  constructor(config?: ZTDSConfig);

  // 1. Forward In-Memory Sanitization (Egress: 0 bytes, Latency: <2ms)
  public sanitize(rawText: string): SanitizeResult;

  // 2. Reverse Lossless De-tokenization (Restores cleartext in local RAM)
  public reveal(sanitizedText: string, sessionMap: SessionMap): string;

  // 3. Cryptographic Team Transport Export (Argon2id + XChaCha20-Poly1305)
  public exportEncryptedSession(sessionMap: SessionMap, passphrase: string): Promise<string>;

  // 4. Cryptographic Team Transport Import
  public importEncryptedSession(encryptedPayload: string, passphrase: string): Promise<SessionMap>;

  // 5. Generate CISO Audit Receipt
  public generateAuditReceipt(result: SanitizeResult): AuditReceipt;
}
```

---

## 2. CLI Tool Specification: `ztds-audit`

The standalone open-source CLI scanner allows developers and DevSecOps teams to lint code repositories, system prompts, and RAG ingestion scripts before deployment.

### 2.1 Command Line Invocation
```bash
npx ztds-audit [path] [flags]
```

### 2.2 CLI Flags & Options
| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--profile` | String | `general` | Regulatory profile (`healthcare`, `financial`, `legal`, `devops`). |
| `--fail-on-leak`| Boolean | `true` | Return non-zero exit code if unmasked PII or secrets are detected. |
| `--strict` | Boolean | `false` | Enforce Invariant 1 (fail if `localStorage` or disk caching detected). |
| `--json` | Boolean | `false` | Output structured machine-readable JSON report. |
| `--output` | String | `stdout` | Path to write audit receipt file. |
| `--exclude` | Array | `node_modules,dist` | Glob patterns to ignore during scan. |

### 2.3 Process Exit Codes (CI/CD Determinism)
- **Exit Code 0:** All scanned files are 100% compliant with ZTDS v1.0. Zero leaks detected.
- **Exit Code 1:** Unmasked PII, unredacted API secrets, or unshielded LLM calls detected.
- **Exit Code 2:** Execution error (invalid CLI arguments, missing files, or syntax error).

---

## 3. GitHub Action CI/CD Specification

Automate zero-trust compliance on every Pull Request to prevent sensitive data or unmasked prompts from entering production.

### Official Action: `ztds-ai/ztds-audit-action@v1`

### Ready-to-Use Workflow Template: `.github/workflows/ztds-audit.yml`
```yaml
name: ZTDS Zero-Trust Pipeline Audit

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  ztds-security-scan:
    name: Verify In-Memory Sanitization & Zero-Egress
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run ZTDS Pipeline Audit
        uses: ztds-ai/ztds-audit-action@v1
        with:
          path: "./src"
          profile: "healthcare"
          fail-on-leak: true
          strict: true

      - name: Upload Audit Receipt Artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ztds-audit-receipt
          path: ztds-audit-receipt.json
```

---

## 4. Model Context Protocol (MCP) Tool Contracts

The official MCP server (`@privacyscrubber/mcp-server`) communicates over stdio via JSON-RPC 2.0 for Cursor, Windsurf, and Claude Desktop.

### Tool 1: `sanitize_prompt`
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "prompt": { "type": "string", "description": "Raw prompt text containing potential PII or code secrets" },
      "profile": { "type": "string", "enum": ["general", "devops", "healthcare", "financial", "legal"], "default": "general" }
    },
    "required": ["prompt"]
  }
  ```
- **Output Schema:**
  ```json
  {
    "sanitized_prompt": "string",
    "token_count": 4,
    "session_token_map": { "[NAME_1]": "John Doe", "[SECRET_1]": "sk-proj-..." },
    "latency_ms": 0.82
  }
  ```

### Tool 2: `reveal_response`
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "response_text": { "type": "string", "description": "AI completion containing surrogate tokens" },
      "session_token_map": { "type": "object", "description": "Mapping dictionary from sanitize_prompt" }
    },
    "required": ["response_text", "session_token_map"]
  }
  ```
- **Output Schema:**
  ```json
  {
    "restored_text": "string",
    "tokens_restored": 4
  }
  ```
