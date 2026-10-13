# ZTDS (Zero-Trust Data Sanitization)

[![IETF Draft](https://img.shields.io/badge/IETF_Draft-draft--sibiryakov--ztds--protocol--02-blue.svg)](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
[![PyPI version](https://img.shields.io/pypi/v/ztds.svg)](https://pypi.org/project/ztds/)
[![PyPI downloads](https://img.shields.io/pypi/dm/ztds.svg)](https://pypi.org/project/ztds/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ZTDS Verified](https://ztds.ai/badge/ztds-core.svg)](https://ztds.ai/registry/)

Canonical Python Reference Implementation of the **Zero-Trust Data Sanitization (ZTDS) Protocol** ([IETF `draft-sibiryakov-ztds-protocol-02`](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/), RFC v1.0).

ZTDS physically prevents PII, PHI, API tokens, and corporate secrets from crossing WAN sockets unmasked. It operates **100% in local process RAM** with zero external network egress, sub-millisecond execution (<0.05ms), and verifiable memory zeroization.

---

## 🏛️ Invariants Enforced (RFC v1.0)

1. **Invariant 1: Zero External Egress Prior to Sanitization**
   Every byte of prompt data is inspected and sanitized locally in volatile memory. Zero unmasked data touches network interfaces.
2. **Invariant 2: Deterministic Reversible Bijective Tokenization**
   Syntactic bracketed surrogates (`[NAME_1]`, `[EMAIL_1]`, `[API_SECRET_1]`) preserve entity coreference and LLM reasoning semantics while enabling exact bijective restoration ($f^{-1}(f(x)) = x$).
3. **Invariant 3: Ephemeral In-RAM Session Isolation & Zeroization (Theorem 2)**
   Cryptographic mapping tables reside strictly in volatile RAM, isolated per session, and are destructively overwritten upon session completion.
4. **Invariant 4: Zero Subprocessors & Zero Telemetry**
   No SaaS calls, no cloud APIs, and no telemetry side-channels. Eliminates GDPR Article 28 data processing agreements and vendor risk reviews.

---

## ⚡ Quickstart

Install the zero-dependency Python package:

```bash
pip install ztds
```

### 1. In-Memory Sanitization & Restoration

```python
import ztds

prompt = "Deploy microservice with key sk-ant-api03-0123456789abcdef0123456789abcdef and email dev@corp.internal"

# Use context manager for automatic Invariant 3 RAM zeroization
with ztds.session() as s:
    # Phase 1: Local In-Memory Sanitization (<0.05ms)
    sanitized, minted_tokens = s.sanitize(prompt)
    print(sanitized)
    # Output: "Deploy microservice with key [API_SECRET_1] and email [EMAIL_1]"

    # Phase 2: Send sanitized string safely to any frontier model
    # ai_raw_response = client.chat.completions.create(messages=[{"role": "user", "content": sanitized}])
    ai_raw_response = "Confirmed. Credentials for [EMAIL_1] are stored."

    # Phase 3: Bijective Restoration in Local RAM
    clean_response = s.reveal(ai_raw_response)
    print(clean_response)
    # Output: "Confirmed. Credentials for dev@corp.internal are stored."

# Memory mapping is completely wiped upon context exit (Theorem 2)
```

---

## 🔌 Framework Integrations

### LiteLLM Proxy / SDK

Install with LiteLLM extras:
```bash
pip install "ztds[litellm]"
```

```python
import litellm
from ztds.integrations import ZTDSGuardrail

# Intercept all calls locally before WAN socket dispatch
litellm.input_callbacks = [ZTDSGuardrail()]
litellm.output_callbacks = [ZTDSGuardrail()]

response = litellm.completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "My AWS key is AKIAIOSFODNN7EXAMPLE"}]
)
# Upstream OpenAI receives only "[API_SECRET_1]"
# Your application receives restored output automatically
```

### LangChain

```python
from langchain_openai import ChatOpenAI
from ztds.integrations import ZTDSSanitizingCallbackHandler

llm = ChatOpenAI(
    callbacks=[ZTDSSanitizingCallbackHandler()]
)
```

### CrewAI Multi-Agent Workflows

```python
from crewai import Agent
from ztds.integrations import ZTDSSanitizerTool

security_agent = Agent(
    role="Data Officer",
    goal="Sanitize customer logs before delegation",
    tools=[ZTDSSanitizerTool()]
)
```

### LlamaIndex RAG Node Postprocessor

```python
from llama_index.core import VectorStoreIndex
from ztds.integrations import ZTDSNodePostprocessor

query_engine = index.as_query_engine(
    node_postprocessors=[ZTDSNodePostprocessor()]
)
```

---

## 🛠️ CLI Tools

```bash
# Verify compliance with RFC v1.0 canonical test vectors
ztds conformance

# Output JSON for CI/CD pipelines
ztds conformance --json

# Audit local codebase for unmasked secrets and telemetry side-channels
ztds audit --dir ./src --strict

# Quick in-memory sanitization from command line
ztds sanitize "Contact alice@example.com with key sk-proj-12345678901234567890"
```

---

## 📊 Conformance & Performance

All 8 canonical RFC v1.0 test vectors pass with 100% Invariant fidelity:

| Test Vector ID | Category | Status | Latency |
| :--- | :--- | :--- | :--- |
| `VEC-CORE-001` | Universal Consumer PII | PASS | 0.04ms |
| `VEC-CORE-002` | Coreference Determinism | PASS | 0.02ms |
| `VEC-HEALTH-001` | Healthcare PHI & HIPAA Safe Harbor | PASS | 0.04ms |
| `VEC-FIN-001` | Financial & Banking (ISO 20022) | PASS | 0.03ms |
| `VEC-SEC-001` | Developer Secrets & Cloud Tokens | PASS | 0.03ms |
| `VEC-MULTI-001` | Multi-Lingual Global Entities | PASS | 0.04ms |
| `VEC-REDOS-001` | ReDoS Stress & Catastrophic Backtracking | PASS | 0.03ms |
| `VEC-UNICODE-001` | Unicode Normalization & Homoglyphs | PASS | 0.03ms |

Average latency per prompt: **~0.031 ms** (31 microseconds).

---

---

## 🏢 Certified Commercial Implementation (Enterprise & High ACV)

The open reference implementation (`ztds`) provides the universal baseline engine under the MIT License. For production corporate pipelines, regulatory safe harbors, and air-gapped enterprise workloads, refer to the Pioneer Certified Commercial Implementation:

- **[PrivacyScrubber Commercial SDK](https://privacyscrubber.com/sdk/?utm_source=pypi_ztds&utm_medium=readme&utm_campaign=commercial_sdk)**: Zero-egress in-memory Node.js & WASM engine engineered for ETL data lakes, RAG vector pipelines, and microservices (<0.05ms latency). Unlocks all 30 specialized industry profiles:
  - **Healthcare & PHI**: HIPAA Safe Harbor (18 PHI identifiers, clinical MRNs, ICD-10)
  - **Financial & Banking**: GLBA, ISO 20022 XML, SEPA pacs.008, SWIFT BIC, credit cards
  - **Legal & Dispute Resolution**: FRE 502 (Attorney-Client privilege, work product doctrine, case dockets)
  - **Tax & Accounting**: IRC § 7216 (W-2/1040 workpapers, EIN, PTIN, payroll ledgers)
  - **Defense & Aerospace**: CMMC & ITAR (CUI tags, defense contract numbers, NATO codification)
- **[TEAMS & Enterprise Governance](https://privacyscrubber.com/pricing?tier=teams&utm_source=pypi_ztds&utm_medium=readme&utm_campaign=teams_upgrade)**: Zero-knowledge cross-team session handoffs (Argon2id + XChaCha20-Poly1305), rootless air-gapped Docker sidecars, centralized regex governance, and DPO/CISO SHA-256 cryptographic compliance receipts.
- **[Zero-Trust MCP Server](https://privacyscrubber.com/pii-mcp/?utm_source=pypi_ztds&utm_medium=readme&utm_campaign=mcp_docs)**: Zero-Trust Data Sanitization stdio server for Claude Desktop, Cursor, and Windsurf (`uvx privacyscrubber-mcp` or `npx @privacyscrubber/mcp-server`).

---

## 📜 Intellectual Property & Standards

- **IETF Specification**: [draft-sibiryakov-ztds-protocol-02](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
- **Consortium & RFC Registry**: [https://ztds.ai](https://ztds.ai)
- **IPR Disclosure**: Filed under IETF RFC 8179 rules (Royalty-Free grant for Open-Source implementations with Defensive Termination).
- **Commercial Certified Reference Implementation**: [PrivacyScrubber](https://privacyscrubber.com) (30 specialized industry profiles, HIPAA/FRE 502/SOC 2 compliance packs, enterprise air-gapped on-premise engines).

## 📄 License

MIT License. Copyright (c) 2026 Ilya Sibiryakov & ZTDS AI Consortium.
