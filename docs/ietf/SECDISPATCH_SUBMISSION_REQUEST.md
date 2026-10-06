# IETF SECDISPATCH Submission Request

**To**: `secdispatch@ietf.org`  
**CC**: Security Area Directors (Roman Danyliw `<rdd@cert.org>`, Paul Wouters `<paul.wouters@aiven.io>`), SECDISPATCH Chairs  
**From**: Ilya Sibiryakov `<ilya@brandmeweb.com>`  
**Date**: October 2026  
**Subject**: `[dispatch] Dispatch Request: The Zero-Trust Data Sanitization (ZTDS) Protocol (draft-sibiryakov-ztds-protocol-02)`

---

## 1. Document Information

* **Title**: The Zero-Trust Data Sanitization (ZTDS) Protocol for Frontier Artificial Intelligence Ingestion
* **Document Name**: `draft-sibiryakov-ztds-protocol-02`
* **IETF DataTracker URL**: [https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
* **Intended Status**: Standards Track / Informational
* **Area**: Security (SEC) / Applications and Real-Time (ART)
* **Current Lifecycle**: Active Individual Internet-Draft (Published: 27 September 2026; Expires: 31 March 2027)

---

## 2. Problem Statement

The rapid enterprise integration of Generative Artificial Intelligence (GenAI), Large Language Model (LLM) APIs, Retrieval-Augmented Generation (RAG) vector pipelines, and autonomous agent architectures (such as the Model Context Protocol, MCP) requires transmitting unstructured, high-context operational prompts across the Public Internet to third-party model inference endpoints.

This paradigm introduces catastrophic data exposure risks:
1. **Unintentional Egress**: Personally Identifiable Information (PII), Protected Health Information (PHI), primary account numbers (PAN), developer API tokens, database connection strings, and proprietary intellectual property are inadvertently serialized into network sockets and permanently retained in external model training corpora, telemetry caches, or third-party log pipelines.
2. **Deficiencies of Perimeter-Based Cloud DLP**: Existing Data Loss Prevention (Cloud DLP) proxies and Cloud Access Security Brokers (CASBs) inspect traffic in transit via intermediate multi-tenant cloud gateways. This model suffers from fatal architectural flaws:
   - **Severe Latency Overhead**: Introduces 150ms to 350ms of intermediate WAN round-trip latency, degrading streaming LLM generation (`time-to-first-token`).
   - **Expanded Attack Surface & Regulatory Liability**: Introduces a third-party Data Processor under GDPR Article 28, HIPAA Business Associate Agreement (BAA) requirements, and cross-border data transfer restrictions, creating a single point of failure and subpoena target.
   - **The Shadow AI Paradox**: Outright network blocking or gateway friction forces knowledge workers to circumvent corporate controls via unmanaged personal browsers and devices ("Shadow AI").

---

## 3. What ZTDS Proposes

The Zero-Trust Data Sanitization (ZTDS) protocol shifts the data security and privacy boundary directly into the local volatile memory (RAM) of the executing host before network serialization.

The protocol specifies four normative invariants:
1. **Invariant 1: Local In-Memory Transformation**: Sensitive substrings matching defined compliance taxonomies are intercepted and substituted with structured surrogate tokens exclusively within volatile client RAM before socket dispatch.
2. **Invariant 2: Deterministic Bijective Reversibility**: Each unique sensitive entity maps deterministically to a typed surrogate token within the session context, preserving syntactic and semantic relationships for model reasoning, and enabling bit-for-bit local restoration upon receipt of the model inference response.
3. **Invariant 3: Zero Outgoing Network Transmission (Airplane Mode Standard)**: Cleartext entities MUST NOT be emitted across any network interface. The protocol defines an empirical zero-egress test verifiable in disconnected network states.
4. **Invariant 4: Ephemeral Session Isolation & Zero Sub-Processor Chain**: Session mapping dictionaries are strictly tab/process isolated, never persisted to unencrypted disk, and zeroized upon session termination. Inter-client handoff employs authenticated, zero-knowledge cryptographic transport envelopes (XChaCha20-Poly1305 + Argon2id).

---

## 4. Running Code & Implementation Status

In accordance with IETF principles ("rough consensus and running code"), the protocol is backed by multiple production and reference implementations:

1. **Production Reference Implementation (PrivacyScrubber)**:
   - Web Application & Browser Sandbox (`privacyscrubber.com`).
   - Manifest V3 Chrome Extension operating in-DOM on native LLM prompt interfaces (ChatGPT, Claude, Gemini, DeepSeek).
   - Headless Node.js/WASM runtime package (`@privacyscrubber/sdk`) delivering <2ms in-memory processing.
   - Stdio Model Context Protocol daemon (`@privacyscrubber/mcp-server`) for AI IDE agent environments (Cursor, Windsurf, Claude Desktop).
2. **Open Conformance Tooling (`npx ztds-audit`)**:
   - Standalone CLI auditor verifying zero-egress compliance, deterministic surrogate syntax, and memory zeroization.
3. **Open Reference Integrations**:
   - Native middleware and callback adapters for LangChain, LlamaIndex, LiteLLM, CrewAI, and FastMCP.
4. **Empirical Benchmarks**:
   - 30 standardized enterprise test vectors across 7 regulatory domains (Healthcare/HIPAA, Banking/PCI, Legal/Attorney-Client Privilege, HR/GDPR, DevOps/Cloud Credentials, Accounting/IRC § 7216, and Multimodal Bounding-Box Sanitization).

---

## 5. Dispatch Question

We seek guidance from the SECDISPATCH working group on the appropriate venue and path for standardizing the ZTDS protocol within the IETF.

Specifically, we propose the following options for community discussion:

* **Option A (New Working Group)**: Charter a focused Working Group within the Security Area (e.g., `ztds` or `aiprivacy`) to standardize the client-side data sanitization protocol, surrogate token grammar, ephemeral session mapping exchange format, and conformance verification criteria for frontier AI ingestion.
* **Option B (Existing Working Group Assignment)**: Dispatch the work to an existing Security or Applications Area Working Group whose charter intersects with transport encryption, application-layer privacy, and zero-trust credential encapsulation.
* **Option C (AD-Sponsored / Independent Stream)**: Pursue AD-sponsored publication on the Standards Track or Informational RFC stream with cross-area review from Security and Applications Area Directorates.

---

## 6. Presentation Request

The author requests a **10-15 minute presentation slot** during the upcoming IETF meeting (or virtual interim session) to present the problem statement, protocol mechanics, running code, and to field questions from the working group.

---

### Author Contact Information

**Ilya Sibiryakov**  
ZTDS AI Consortium / BrandMeWeb  
Email: `ilya@brandmeweb.com`  
Web: [https://ztds.ai](https://ztds.ai)  
IETF Profile: [https://datatracker.ietf.org/person/ilya@brandmeweb.com](https://datatracker.ietf.org/person/ilya@brandmeweb.com)
