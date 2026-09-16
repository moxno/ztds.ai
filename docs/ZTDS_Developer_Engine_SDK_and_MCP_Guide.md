# ZTDS.ai — Developer Engine, SDK & Model Context Protocol (MCP) Guide (2026 SSOT)

## 1. Overview & Architectural Philosophy

The ZTDS Developer Engine (@privacyscrubber/sdk) is a zero-latency, headless sanitization library engineered for high-concurrency Node.js microservices, Next.js API routes, Python/WASM bridges, and autonomous agent runtime loops.

Unlike cloud DLP solutions that act as external HTTP network proxies, the ZTDS engine executes entirely within host process memory (V8 heap or WASM linear memory).

---

## 2. Core Technical Invariants & Performance

- **In-Memory Latency:** <0.8ms for payloads up to 10,000 characters; <1.8ms for 50,000 characters.
- **Network Egress:** Exactly 0 bytes. No external API calls, no background telemetry pinging prompt contents.
- **Zero Third-Party Dependency Tree:** Standalone compiled engine with zero dynamic remote code loading (Manifest V3 and strict air-gapped certified).
- **Two-Sided Lossless Tokenization:**
  - Forward Sanitization: Cleartext PII -> Non-informative contextual tokens ([NAME_1], [SSN_1]).
  - Reverse Sanitization: Model completion with surrogate tokens -> Restored cleartext PII using in-memory sessionMap.

---

## 3. Installation & Quickstart

```bash
# Install via npm
npm install @privacyscrubber/sdk

# Install via pnpm
pnpm add @privacyscrubber/sdk

# Install via yarn
yarn add @privacyscrubber/sdk
```

### Basic Node.js / TypeScript Example
```typescript
import { ZTDSEngine } from "@privacyscrubber/sdk";

// Initialize in-memory engine with industry profile
const ztds = new ZTDSEngine({
  profile: "healthcare", // Available: "general", "healthcare", "financial", "legal", "devops"
  maxLatencyMs: 2.0
});

// 1. Sanitize prompt before sending to OpenAI / Anthropic
const rawPrompt = "Patient Sarah Jenkins (SSN: 987-65-4321) diagnosed with acute bronchitis.";
const { sanitizedPrompt, sessionMap, latencyMs } = ztds.sanitize(rawPrompt);

console.log("Sanitized Egress:", sanitizedPrompt);
// Output: "Patient [NAME_1] (SSN: [SSN_1]) diagnosed with acute bronchitis."
console.log("Execution Time:", latencyMs + "ms"); // Output: ~0.7ms

// 2. Dispatch sanitized prompt to external LLM provider over the wire
const llmResponse = await callOpenAI(sanitizedPrompt);
// Simulated LLM Response: "For patient [NAME_1], prescribed Amoxicillin 500mg."

// 3. Losslessly restore cleartext strictly inside local memory
const finalResponse = ztds.reveal(llmResponse, sessionMap);
console.log("Final Restored Response:", finalResponse);
// Output: "For patient Sarah Jenkins, prescribed Amoxicillin 500mg."
```

---

## 4. Model Context Protocol (MCP) Server Architecture

For modern AI IDEs (Cursor, Windsurf) and desktop agents (Claude Desktop), ZTDS provides an air-gapped stdio-based MCP server (`@privacyscrubber/mcp-server`).

### MCP Stdio Communication Architecture
```
┌──────────────────┐       stdio (stdin/stdout)       ┌────────────────────────┐
│  Claude Desktop  │ ───────────────────────────────> │  privacyscrubber-mcp   │
│   or Cursor IDE  │ <─────────────────────────────── │ (In-Memory RAM Engine) │
└──────────────────┘     JSON-RPC 2.0 (Zero Network)  └────────────────────────┘
```

### Claude Desktop / Cursor `claude_desktop_config.json`
```json
{
  "mcpServers": {
    "privacyscrubber": {
      "command": "npx",
      "args": ["-y", "@privacyscrubber/mcp-server@latest"],
      "env": {
        "PRIVACYSCRUBBER_TELEMETRY": "false"
      }
    }
  }
}
```

### Available MCP Tools
1. `sanitize_prompt`: Intercepts raw developer prompts, redacts code secrets, database connection strings, and PII, returning sanitized prompt + session token dictionary.
2. `reveal_response`: Restores surrogate tokens back to original cleartext within the IDE interface.
3. `verify_ztds_compliance`: Runs real-time static check on active files to detect hardcoded secrets or unmasked PII.

---

## 5. RAG Pipeline De-Identification Architecture

In Retrieval-Augmented Generation (RAG) vector pipelines, embedding unmasked PII permanently poisons vector indices and causes GDPR Article 17 ("Right to Erasure") non-compliance.

### The ZTDS RAG Immunization Flow
1. **Document Ingestion:** Chunks are processed through `ZTDSEngine.sanitize(chunk)`.
2. **Vector Embedding:** Only sanitized text containing surrogate tokens is embedded and stored in Pinecone, Weaviate, pgvector, or Milvus.
3. **Deterministic Search:** Semantic similarity search operates on structural concepts without retaining personal data in vector space.
4. **Query Time:** User query is sanitized with the same session token dictionary, matching surrogate tokens in vector space.

---

## 6. Commercial Licensing & Pricing SSOT

- **Developer Monthly:** $199 / month  
  - Unlimited internal backend nodes and microservices.
  - Sub-1ms in-memory latency budget.
  - Zero network egress guarantee.
  - Standard email support.
- **Developer Annual (Early Adopter):** $1,990 / year (Save ~$398 / 17%)  
  - Everything in Developer Monthly.
  - Official ZTDS Verified Registry Badge & Backlink.
  - Entity inclusion in the global `ztds.ai/llms.txt` directory.
  - CISO Vendor Procurement Memo Pack.
  - On-premise air-gapped deployment license.
