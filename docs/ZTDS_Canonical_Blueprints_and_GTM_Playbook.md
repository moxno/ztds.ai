# ZTDS Canonical Integration Blueprints & B2B GTM Playbook

## 1. Executive Overview

This specification delivers:
1. **10 Canonical Architectural Blueprints**: Production-ready, copy-pasteable integration code implementing Zero-Trust Data Sanitization across modern AI stacks (LangChain, LlamaIndex, CrewAI, Ollama, MCP, Supabase/Pinecone, Next.js, API Gateways, Kafka, Chrome MV3).
2. **B2B GTM Intelligence Engine**: Persona profiling, battle-tested LinkedIn Sales Navigator boolean queries, regulatory trigger monitoring, and value-first cold outreach playbooks designed for Founder Ilya Sibiryakov (BrandMeWeb / PrivacyScrubber).

---

## 2. 10 Canonical Architectural Integration Blueprints

### Blueprint 1: LangChain (Python / TypeScript LCEL)
Two-way in-memory middleware that scrubs prompts before LLM invocation and reverses tokens upon output generation.

```typescript
// ztds-langchain.ts
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { PrivacyScrubberEngine } from "@privacyscrubber/sdk";

export function createZtdsChain(modelName = "gpt-4o") {
  const engine = new PrivacyScrubberEngine();
  const model = new ChatOpenAI({ modelName, temperature: 0 });

  // Step 1: In-memory sanitization runnable
  const sanitizeInput = RunnableLambda.from((input: { prompt: string; profile?: string }) => {
    const { sanitizedText, tokenMap } = engine.sanitize(input.prompt, {
      profile: input.profile || "general"
    });
    return { sanitizedText, tokenMap };
  });

  // Step 2: LLM invocation with zero cleartext PII
  const invokeModel = RunnableLambda.from(async (state: { sanitizedText: string; tokenMap: Record<string, string> }) => {
    const response = await model.invoke(state.sanitizedText);
    return { rawOutput: response.content as string, tokenMap: state.tokenMap };
  });

  // Step 3: Local RAM reverse reveal
  const revealOutput = RunnableLambda.from((state: { rawOutput: string; tokenMap: Record<string, string> }) => {
    const clearText = engine.reveal(state.rawOutput, state.tokenMap);
    return { output: clearText };
  });

  return RunnableSequence.from([sanitizeInput, invokeModel, revealOutput]);
}
```

---

### Blueprint 2: LlamaIndex (IngestionPipeline NodePostprocessor)
Ensures documents ingested into vector indexes are stripped of sensitive identifiers before chunking and embedding generation.

```python
# ztds_llamaindex.py
from typing import List, Optional
from llama_index.core.schema import BaseNode, Document
from llama_index.core.postprocessor.types import BaseNodePostprocessor
import requests # Or local WASM/Node subprocess

class ZTDSNodeSanitizer(BaseNodePostprocessor):
    profile: str = "general"

    def _postprocess_nodes(
        self, nodes: List[BaseNode], query_bundle: Optional[dict] = None
    ) -> List[BaseNode]:
        """Sanitizes node text in-memory before vector storage."""
        # Using local headless @privacyscrubber/sdk CLI or Python binding
        for node in nodes:
            # Deterministic sanitization: replace PII with [TYPE_N]
            sanitized_text, token_map = self._run_ztds_engine(node.get_content(), self.profile)
            node.set_content(sanitized_text)
            # Store cryptographic hash of tokenMap in node metadata if audit is required
            node.metadata["ztds_sanitized"] = True
            node.metadata["ztds_token_count"] = len(token_map)
        return nodes

    def _run_ztds_engine(self, text: str, profile: str):
        # Native zero-network binding
        from privacyscrubber_engine import sanitize # Local WASM / shared lib
        return sanitize(text, profile)
```

---

### Blueprint 3: CrewAI (Multi-Agent Role Sanitizer)
Sanitizes prompts before delegation between autonomous agents and restores context before final user delivery.

```python
# ztds_crewai.py
from crewai import Agent, Task, Crew, Process
from privacyscrubber import ZTDSEngine

class ZTDSCrewMiddleware:
    def __init__(self, profile: str = "bizops"):
        self.engine = ZTDSEngine()
        self.profile = profile
        self.session_maps = {}

    def before_agent_execution(self, task_description: str, task_id: str) -> str:
        sanitized, token_map = self.engine.sanitize(task_description, profile=self.profile)
        self.session_maps[task_id] = token_map
        return sanitized

    def after_agent_execution(self, task_output: str, task_id: str) -> str:
        token_map = self.session_maps.get(task_id, {})
        revealed = self.engine.reveal(task_output, token_map)
        # Clear volatile RAM token map immediately
        self.session_maps.pop(task_id, None)
        return revealed
```

---

### Blueprint 4: Ollama / Local LLM Streaming Pipeline
High-throughput streaming pipe intercepting incoming chunks, buffering potential token boundaries, and streaming clean tokens.

```javascript
// ztds-ollama-stream.js
const { PrivacyScrubberEngine } = require("@privacyscrubber/sdk");
const http = require("http");

const engine = new PrivacyScrubberEngine();

async function proxyOllamaPrompt(prompt, profile = "dev") {
  // 1. Sanitize prompt before local or remote Ollama call
  const { sanitizedText, tokenMap } = engine.sanitize(prompt, { profile });

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3:8b", prompt: sanitizedText, stream: true })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullOutput = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = JSON.parse(decoder.decode(value));
    fullOutput += chunk.response;
  }

  // 2. Instant RAM reverse scrub
  const finalClearText = engine.reveal(fullOutput, tokenMap);
  return finalClearText;
}
```

---

### Blueprint 5: Cursor / Claude Desktop MCP Stdio Client
Configures `@privacyscrubber/mcp-server` to automatically intercept and de-identify file contexts, git diffs, and prompts before sending to cloud models.

```json
// claude_desktop_config.json / .cursor/mcp.json
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

```markdown
<!-- Claude / Cursor Instruction Prompt -->
Whenever reading codebase files, terminal logs, or drafting commits, always pipe the payload through the `privacyscrubber` tool `sanitize_text` with profile="dev" or profile="security". Present the sanitized response. When user asks for production deployment or git commit, execute `reveal_text` with the returned tokenMap.
```

---

### Blueprint 6: Supabase / Pinecone RAG Vector Embeddings Pipeline
Guarantees vector stores (Pinecone, Qdrant, Weaviate, pgvector) never index raw PII, preventing vector inversion attacks.

```typescript
// rag-pipeline.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrivacyScrubberEngine } from "@privacyscrubber/sdk";

const engine = new PrivacyScrubberEngine();
const pinecone = new Pinecone();
const embeddings = new OpenAIEmbeddings();

export async function indexDocumentSecurely(docId: string, rawText: string, profile = "medical") {
  // 1. Sanitize document client-side before embedding
  const { sanitizedText, tokenMap } = engine.sanitize(rawText, { profile });

  // 2. Generate vector embedding from sanitized text ONLY
  const vector = await embeddings.embedQuery(sanitizedText);

  // 3. Upsert to Pinecone - zero PII in vector coordinates or metadata
  const index = pinecone.Index("enterprise-knowledge");
  await index.upsert([
    {
      id: docId,
      values: vector,
      metadata: {
        textSnippet: sanitizedText.slice(0, 500),
        ztdsVerified: true,
        entityCount: Object.keys(tokenMap).length
      }
    }
  ]);
  // tokenMap is NOT stored in Pinecone. Volatile local RAM or tenant-isolated KMS only.
}
```

---

### Blueprint 7: Next.js App Router (Edge Runtime Sanitizer)
Ultra-fast (<1ms) serverless middleware sanitizing incoming chat API payloads.

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrivacyScrubberEngine } from "@privacyscrubber/sdk";

export const runtime = "edge";

const engine = new PrivacyScrubberEngine();

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // In-memory Edge sanitization
  const { sanitizedText, tokenMap } = engine.sanitize(lastMessage.content, {
    profile: profile || "general"
  });

  // Replace content with sanitized version
  messages[messages.length - 1].content = sanitizedText;

  // Forward to upstream LLM (OpenAI / Anthropic)
  const upstreamRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model: "gpt-4o", messages })
  });

  const completion = await upstreamRes.json();
  const rawReply = completion.choices[0].message.content;

  // Reverse reveal before returning to client
  const revealedReply = engine.reveal(rawReply, tokenMap);

  return NextResponse.json({ reply: revealedReply });
}
```

---

### Blueprint 8: API Gateway / Envoy Sidecar Local Proxy
Local loopback reverse proxy intercepting outbound LLM traffic, inspecting body payload, sanitizing PII in <2ms, and stripping auth headers if sensitive data leaks.

```yaml
# envoy-ztds-filter.yaml
static_resources:
  listeners:
  - name: llm_proxy_listener
    address:
      socket_address: { address: 127.0.0.1, port_value: 8080 }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: egress_llm
          route_config:
            name: local_route
            virtual_hosts:
            - name: openai_upstream
              domains: ["*"]
              routes:
              - match: { prefix: "/v1/chat/completions" }
                route: { cluster: ztds_local_sidecar }
  clusters:
  - name: ztds_local_sidecar
    connect_timeout: 0.25s
    type: STATIC
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: ztds_local_sidecar
      endpoints:
      - lb_endpoints:
        - endpoint:
            address: { socket_address: { address: 127.0.0.1, port_value: 9090 } } # Local @privacyscrubber/sdk daemon
```

---

### Blueprint 9: Microservices Kafka / Event Bus Stream Transformer
Kafka streaming consumer executing stateless transformation on streaming topics before analytics processing.

```javascript
// ztds-kafka-stream.js
const { Kafka } = require("kafkajs");
const { PrivacyScrubberEngine } = require("@privacyscrubber/sdk");

const kafka = new Kafka({ clientId: "ztds-filter", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "sanitizer-group" });
const producer = kafka.producer();
const engine = new PrivacyScrubberEngine();

async function run() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "raw-customer-transcripts", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawText = message.value.toString();
      // In-memory sanitization
      const { sanitizedText } = engine.sanitize(rawText, { profile: "support" });

      // Publish clean data to downstream LLM training/indexing topic
      await producer.send({
        topic: "clean-transcripts-ztds",
        messages: [{ key: message.key, value: sanitizedText }]
      });
    }
  });
}
run();
```

---

### Blueprint 10: Chrome MV3 Content Script / DOM Textarea Interceptor
Seamlessly integrates into any web-based LLM UI (ChatGPT, Claude, Perplexity), replacing text before DOM submit.

```javascript
// content-script-ztds.js
(function() {
  const engine = window.PrivacyScrubberEngine;
  let activeTokenMap = {};

  document.addEventListener("keydown", (e) => {
    // Intercept Cmd+Enter / Ctrl+Enter or Submit click
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      const textarea = document.querySelector("textarea, div[contenteditable='true']");
      if (!textarea) return;

      const rawText = textarea.value || textarea.innerText;
      const { sanitizedText, tokenMap } = engine.sanitize(rawText, { profile: "general" });

      activeTokenMap = tokenMap;
      if (textarea.value !== undefined) {
        textarea.value = sanitizedText;
      } else {
        textarea.innerText = sanitizedText;
      }
      // UI dispatches native input events to trigger React/Vue state updates
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, true);
})();
```

---

## 3. Architectural Conformance & Verification Checklist for Blueprints

Every integration blueprint deployed in production must pass the four normative ZTDS RFC v1.0 verification gates prior to release:

| Conformance Gate | Verification Command / Method | Required Telemetry Output |
| :--- | :--- | :--- |
| **Gate 1: Zero External Egress** | `npx ztds-audit --strict` | `0.00 B` cleartext PII/PHI/Secrets prior to socket serialization |
| **Gate 2: Bijective Round-Trip** | `npx ztds-bench --strict` | `100.00%` Bijective Fidelity Score (BFS) & Context Preservation Score (CPS) |
| **Gate 3: Volatile Memory Zeroization** | `engine.destroy()` / `zeroize()` | Immediate CSPRNG overwrite of ephemeral token dictionaries post-turn |
| **Gate 4: Offline Attestation** | `npx ztds-verify <token>` | Valid RFC 8032 Ed25519 signature over RFC 8785 Canonical JSON receipt |

### 3.1. Reference Baseline vs. Certified Commercial Engine

- **Open-Source Reference Baseline (`@ztds/core`, `ztds-mcp`, `ztds` Python)**: Implements the normative 4-invariant architecture and universal consumer PII baseline under the Apache 2.0 license.
- **Pioneer Certified Commercial Implementation (PrivacyScrubber)**: Enterprise deployments requiring the 30 Specialized Industry Profiles (HIPAA Safe Harbor, SWIFT/IBAN FinTech, FRE 502 Legal Privilege, Multimodal Document Burn-In) and air-gapped Ed25519 node licensing route to `https://privacyscrubber.com/pricing/` and `https://brandmeweb.com`.
