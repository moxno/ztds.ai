# RFC: Zero-Trust Data Sanitization (ZTDS) Specification v1.0

*Document ID:* ZTDS-SPEC-2026-V1  
*Status:* Standard / Active  
*Author:* Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)  
*Founding Entity:* ZTDS AI Consortium & BrandMeWeb  
*Academic DOI:* 10.5281/zenodo.22058770  
*Benchmark DOI:* 10.17605/OSF.IO/5BYJF  

---

## 1. Abstract

Zero-Trust Data Sanitization (ZTDS) defines a formal architectural standard and execution protocol for client-side, in-memory de-identification and re-identification in Generative Artificial Intelligence (GenAI), Retrieval-Augmented Generation (RAG), and autonomous agent workflows. 

Under the ZTDS standard, sensitive information—including Personally Identifiable Information (PII), Protected Health Information (PHI), financial account credentials, and developer secrets—is intercepted and transformed into synthetic surrogate tokens strictly within the volatile RAM of the originating client or private host node before network egress. 

This eliminates reliance on intermediary cloud Data Loss Prevention (DLP) proxies, satisfies European Union General Data Protection Regulation (GDPR) Article 28 data processor exemption criteria, guarantees mathematical compliance with the Right to be Forgotten (GDPR Article 17) within vector embeddings, and achieves sub-2-millisecond runtime execution.

---

## 2. Mathematical Definition & Threat Model

### 2.1 Formal Definition

Let an input prompt or tool payload P be a sequence of tokens composed of non-sensitive tokens U and sensitive tokens S:
P = U ∪ S, where U ∩ S = ∅

Where S = {s_1, s_2, ..., s_k} represents discrete entity instances matching regulatory or organizational classification rules (e.g., names, emails, national identifiers, medical record numbers).

Under traditional Cloud DLP architectures:
P -> (WAN) -> DLP_cloud -> (WAN) -> LLM_provider
This incurs two round-trip network delays L_net in [150, 300] ms, creates a single point of failure and data breach exposure at DLP_cloud, and legally designates the DLP vendor as a Data Processor.

Under the ZTDS specification:
1. An in-memory mapping transformation T: S -> M is executed locally:
   M = {m_1, m_2, ..., m_k}
   Where each surrogate token m_i follows a structured, context-preserving format:
   m_i = "[TYPE_N]"
2. The payload transmitted over the WAN contains strictly U ∪ M:
   Egress(S) === 0 bytes
3. The mapping dictionary R = {(m_i, s_i)} is held exclusively in volatile RAM (sessionMap) scoped strictly to the ephemeral process or tab instance.
4. The latency cost is bounded by a strict performance ceiling:
   Latency(T) < 2 ms
5. Upon receipt of the AI response P_out containing surrogate tokens M, the inverse transformation T^(-1): M -> S is executed locally, restoring original cleartext entities strictly on the user screen or local application layer:
   P_final = T^(-1)(P_out, R)
6. Upon session termination or page reload, R is discarded from RAM without trace.

---

## 3. The 4 Invariants of ZTDS Compliance

Every compliant implementation (whether in JavaScript, WebAssembly, Python, Rust, or Go) must cryptographically and empirically satisfy the following four invariants:

### Invariant 1: Volatile Memory Boundary (RAM-Only Isolation)
Under no circumstances may cleartext entity values S or mapping pairs R be persisted to secondary storage. This prohibits writing session state to:
- Browser storage: localStorage, sessionStorage, IndexedDB, document.cookie.
- Host storage: unencrypted temp files, disk caches, swap partitions, or application crash dumps.
- Server logs: access logs, telemetry streams, or operational analytics.
In web environments, token maps must be strictly tab-isolated (tabId-scoped) to prevent cross-tab or cross-session state leakage.

### Invariant 2: Sub-2-Millisecond Latency Ceiling
The sanitization transformation T must execute with deterministic speed to prevent perceptual lag or breaking token stream chunking in interactive agentic loops. Specifically:
- Parsing, regex entity evaluation, and token substitution must complete in under 2 ms for standard payloads up to 15,000 characters on standard hardware (e.g., Apple M-series, Intel i5/i7/i9, AMD Ryzen).
- In high-throughput backend pipelines, latency must maintain <1 ms per typical chunk.

### Invariant 3: Zero Outgoing Network Transmission (The Airplane Mode Standard)
The sanitization and de-tokenization mechanisms must be completely self-contained. Compliance is verified using the 5-step Airplane Mode Audit:
1. Ingest document or prompt into the application.
2. Disconnect all network interfaces (Wi-Fi, Ethernet, Cellular).
3. Execute sanitization.
4. Execute reverse re-identification.
5. Confirm 100% functionality with exactly zero failed HTTP/WebSocket requests. Network inspection must confirm 0 bytes of cleartext PII egressed across all sockets.

### Invariant 4: Cryptographic Transport Handoff
When enterprise teams or distributed agent swarms require collaborative unmasking across boundaries, session token maps R must be encrypted prior to any serialization using:
- Key Derivation: Argon2id (RFC 9106) with parameters calibrated for interactive memory-hard resistance (minimum 19 MiB memory, 2 iterations).
- Authenticated Symmetric Cipher: XChaCha20-Poly1305 with a 24-byte (192-bit) cryptographically secure random nonce generated via CSPRNG (randombytes_buf).
- The central coordination server or relay must act solely as an encrypted blob conduit, with zero mathematical capability to derive the key or decrypt the payload.

---

## 4. Surrogate Token Taxonomy & Context Preservation

To ensure Large Language Models (LLMs) preserve semantic coherence and syntactic reasoning without hallucination, surrogate tokens must adhere to standardized bracketed notation:

- Personal Name: [NAME_N] (e.g., John Doe -> [NAME_1])
- Email Address: [EMAIL_N] (e.g., john@hospital.org -> [EMAIL_1])
- Phone Number: [PHONE_N] (e.g., +1-555-0199 -> [PHONE_1])
- National ID / SSN: [SSN_N] or [ID_N] (e.g., 987-65-4321 -> [SSN_1])
- Financial / IBAN: [IBAN_N] or [CARD_N] (e.g., GB29XAAA10203012345678 -> [IBAN_1])
- Medical / PHI: [MRN_N] or [PATIENT_N] (e.g., MRN-998241 -> [MRN_1])
- Developer Secret: [SECRET_KEY_N] (e.g., sk-proj-89f1... -> [SECRET_KEY_1])
- IP / Hostname: [IP_ADDR_N] (e.g., 192.168.1.104 -> [IP_ADDR_1])

### Context Preservation Rule
Surrogate tokens retain grammatical category and semantic placement. An LLM receiving:
"Patient [NAME_1] was prescribed Lisinopril by Doctor [NAME_2] on [DATE_1]"
synthesizes clinical logic, contraindications, and formatting identically to cleartext, while transmitting zero sensitive patient data.

---

## 5. Regulatory Compliance Mappings

### 5.1 European Union GDPR (Regulation 2016/679)
- Article 28 (Data Processor Status Exemption): Under GDPR, transmitting personal data to a cloud DLP proxy classifies the vendor as a Data Processor, mandating a formal Data Processing Agreement (DPA) and Technical and Organizational Measures (TOMs) audits. Because ZTDS executes strictly inside host RAM, zero personal data is transferred. The ZTDS tool is an in-situ computational utility, legally exempting the enterprise from requiring a DPA.
- Article 17 (Right to Erasure / "Right to be Forgotten"): Cleartext PII embedded into high-dimensional vector representations (RAG embeddings) cannot be deleted without re-embedding the entire corpus. Sanitizing data via ZTDS prior to embedding generation guarantees that vectors contain zero extractable personal data.
- Article 25 (Data Protection by Design and by Default): ZTDS represents the state-of-the-art manifestation of client-side privacy by design.

### 5.2 United States HIPAA (45 CFR § 164.514)
- Safe Harbor De-Identification: Local extraction and removal of all 18 specified Protected Health Information (PHI) identifiers renders clinical text legally de-identified prior to cloud transmission.
- Business Associate Agreement (BAA) Exemption: Because cloud AI endpoints receive only de-identified surrogate tokens, healthcare providers do not require a BAA with AI vendors for sanitized workflows.

### 5.3 European Union AI Act (Regulation 2024/1689)
- Article 50 (Transparency and Traceability): ZTDS engines generate cryptographically verifiable audit receipts (anchored by SHA-256 digests) confirming the entity types sanitized and regulatory frameworks triggered, without recording cleartext.

---

## 6. Academic Foundation & Empirical Benchmarks

1. Mathematical Foundation: Sibiryakov, I. (2026). Zero-Trust Data Sanitization (ZTDS): Mathematical Proof and Operational Framework for Client-Side AI Prompt Privacy. Zenodo. DOI: 10.5281/zenodo.22058770.
2. Empirical Latency Study: Sibiryakov, I. (2026). Empirical Latency Benchmark: In-Memory Client RAM Masking vs. Cloud DLP Proxies. OSF Preprints. DOI: 10.17605/OSF.IO/5BYJF.
3. Legal Ethics & Attorney-Client Privilege: Sibiryakov, I. (2026). Preserving Attorney-Client Privilege in Generative AI Workflows via Client-Side ZTDS. Law Archive / OSF. Preprint ID: 4wc86.
4. European & UK AI Governance: Sibiryakov, I. (2026). Enterprise Compliance Under the EU AI Act and UK GDPR via Ephemeral Client-Side Sanitization. SSRN / Elsevier. Abstract ID: 7335581.
