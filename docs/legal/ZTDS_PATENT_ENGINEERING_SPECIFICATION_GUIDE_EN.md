# ZTDS™ Patent Specification & Drawings Engineering Guide
**Israel Patent Application No. IL 331905 • Priority Filing Date: 14/09/2026 • WIPO DAS Code: B17B**  
*Title of Invention:* ZERO-TRUST DATA SANITIZATION METHOD, SYSTEM, APPARATUS, AND COMPUTER-READABLE MEDIUM FOR DETERMINISTIC IN-RAM PRIVACY PRESERVATION IN ARTIFICIAL INTELLIGENCE AND DISTRIBUTED WORKFLOWS  
*Inventor & Sole Applicant:* Ilya Sibiryakov  
*Prepared for:* Patent Attorney Naftali (Continuation Application & WIPO PCT International Prosecution)

---

## 1. Executive Summary: What Specifically Are We Patenting?

### The Core Problem in Prior Art
Enterprises transmitting unstructured prompt payloads and documents to external cloud Artificial Intelligence (AI) and Large Language Models (LLMs) risk catastrophic disclosure of Personally Identifiable Information (PII), Protected Health Information (PHI), financial data, and credentials. Existing solutions suffer from critical flaws:
1. **Cloud Proxy Architectures (Egress Vulnerability):** Traditional Data Loss Prevention (DLP) tools route unmasked cleartext to third-party cloud proxies for inspection. Under GDPR Article 28 and HIPAA, this creates extensive subprocessor liabilities and vulnerability to man-in-the-middle interception.
2. **Attention Degradation in Transformers:** Destructive redaction (e.g. replacing text with `[REDACTED]` or `XXX-XX-XXXX`) destroys grammatical role, syntactic category, and position embeddings in transformer attention matrices, resulting in hallucinated or degraded AI output.
3. **Catastrophic Backtracking (ReDoS):** Non-linear regular expression engines incur exponential processing times (50–500ms per KiB) on unstructured enterprise text.
4. **Untrusted Return Paths:** Existing tools lack cryptographic attestation linking upstream tokenized responses back to the originating client session, enabling cross-session context confusion.

### The Patented Solution (Core Technical Claims)
We patent a coordinated, physical-and-software architecture guaranteeing **zero network cleartext egress** prior to data dispatch:
1. **Pre-Socket RAM Interception:** Raw text is intercepted before network serialization. Entity detection executes in volatile host memory locked against disk swapping (`mlock`).
2. **Bijective Attention-Preserving Tokenization:** Entities are substituted with deterministic bracketed surrogate tokens `[TYPE_N]` (e.g. `[EMAIL_1]`, `[NAME_1]`), preserving syntactic structure for transformer models.
3. **Descending Character Offset Sorter (Core Mechanical Novelty):** Entity matches are sorted by start offset in **descending order (right-to-left)**. Because replacing variable-length text with a fixed-length token alters string length, replacing from back-to-front guarantees earlier character coordinates are never corrupted.
4. **Hardware-Attested Execution Enclave:** Confidential computing enclaves (AWS Nitro) execute without network interface cards (NICs) over an isolated hypervisor channel (`AF_VSOCK`), gated by cryptographic PCR attestation.
5. **Ephemeral Zeroization & Return Continuity:** Enclave responses are authenticated back to the client session; cleartext is restored in volatile RAM, and the private mapping table is cryptographically zeroized (`explicit_bzero`).

---

## 2. Comprehensive Figure-by-Figure Engineering Guide (Sheets 1–6)

### Sheet 1: FIG. 1 — Three Decoupled Trust Planes Architecture
FIG. 1 illustrates a distributed data-processing system operating across three physically and logically isolated computing tiers:
* **[100] Client Endpoint Plane:** Runs on host device CPU and volatile RAM sandbox (Browser V8, IDE, CLI). Strictly isolated from persistent disk storage.
  * **[102] User Cleartext Input Buffer:** Unstructured text containing sensitive entities.
  * **[104] Client DFA Engine (S_RAM):** Linear $O(N)$ regex scanner with zero ReDoS risk.
  * **[106] Token Substitution Engine:** Slices and replaces sensitive spans with tokens.
  * **[108] Volatile Session Map ($M_s$):** Bijective map in RAM; zeroized on session close.
  * **[110] Sanitized Query Buffer ($Q_T$):** Transmits tokens only (0 bytes cleartext egress).
  * **[112] Local Rehydration Unit:** Replaces tokens back to cleartext locally in user UI.
* **[200] Policy Decision Plane (PDP):** Dedicated security verifier with hardware TRNG [202] generating 256-bit nonces, evidence appraisal [204], and session token gate [206].
* **[300] Hardware Confidential Enclave (AWS Nitro):** Physical CPU enclave with zero network NICs, isolated `AF_VSOCK` link [302], hardware attester [304], and model AI core [306].

### Sheet 2: FIG. 2 — 7-Phase Remote Hardware Attestation Protocol
FIG. 2 shows the step-by-step cryptographic life-cycle:
* **Step 1 (Fresh Challenge):** Policy Decision Point [200] generates a fresh 256-bit cryptographic nonce ($n_e$) to prevent replay attacks.
* **Step 2 (Hardware Evidence Generation):** Enclave Security Module (NSM) [304] signs PCR0 (image hash), PCR1 (kernel hash), and PCR2 (app hash) with $n_e$ via COSE.
* **Step 3 (Appraisal & CA Audit):** PDP verifies the digital signature chain against the hardware manufacturer's Root of Trust (AWS Nitro CA).
* **Step 4 (Scoped Authorization Token):** PDP mints a short-lived authorization ticket ($\tau_s$) cryptographically bound to the enclave identity and PCR measurements.
* **Step 5a (Volatile In-Memory Sanitization):** Client Endpoint sanitizes prompt in RAM, populates volatile bijective map $M_s$, and locks memory.
* **Step 5b (Authorized Dispatch):** Sanitized query $Q_T$ and ticket $\tau_s$ are transmitted over air-gapped `AF_VSOCK`. Enclave processes inference on masked tokens.
* **Step 6 (Tokenized Enclave Return):** Enclave returns tokenized inference response $R_T$.
* **Step 7 (Local Client Rehydration):** Client UI restores cleartext in local RAM via $M_s$. Immediate zeroization ensures zero residual persistence.

### Sheet 3: FIG. 3 — Client-Side S_RAM Engine & Descending Sorter
FIG. 3 exposes the internal architecture of the endpoint sanitization engine:
* **[302] Raw Input Stream Buffer:** Receives unbounded cleartext streams.
* **[304] Multi-Profile DFA Lexical Matcher:** 4 specialized parallel profiles:
  * **[304A] General Profile:** Personal names, national IDs/SSNs, phones, emails.
  * **[304B] Financial Profile:** IBAN accounts, routing numbers, GL accounts, W-2 fields.
  * **[304C] Medical Profile:** 18 HIPAA Safe Harbor identifiers, clinical MRN codes.
  * **[304D] DevOps / API Profile:** AWS keys, JWT tokens, DB URIs, private keys.
* **[306] Offset Extraction Buffer:** Captures tuple `{type, start_offset, end_offset, cleartext}`.
* **[308] Descending Character Offset Sorter (CORE MECHANICAL INVENTIVE STEP):**
  * *Technical Problem:* Substituting a variable-length string (e.g. 20 chars) with a fixed-length token (e.g. 8 chars) alters character index positions downstream.
  * *Solution:* Matches are sorted by `start_offset` in **descending order (right-to-left)**. Substituting backwards guarantees earlier character coordinates are never corrupted.
* **[310] Token Allocator -> [312] Volatile Map $M_s$ -> [314] $Q_T$ Output -> [316] Detokenizer.**

### Sheet 4: FIG. 4 — Empirical Latency & Throughput Scaling
FIG. 4 provides statutory proof of technical effect, overcoming 35 U.S.C. § 101:
* **FIG. 4A: Mean Latency Scaling vs Payload Size (Lower is better):**
  * 1 KiB Payload: ZTDS achieves **0.553 ms** mean latency vs **0.929 ms** for centralized HTTPS DLP proxies (1.68x faster).
  * 4 KiB Payload: ZTDS achieves **1.360 ms** vs **1.768 ms** (1.30x faster).
  * Convergence at 16–64 KiB as payload serialization dominates fixed network overhead.
* **FIG. 4B: Steady-State Throughput Scaling (Higher is better):**
  * 1 KiB Payload: ZTDS sustains **1,808 Requests Per Second (RPS)** vs 1,057 RPS for proxies (1.71x higher throughput advantage).
  * 4 KiB Payload: ZTDS sustains **735 RPS** vs 556 RPS (1.32x higher throughput).
  * Root Cause: Elimination of network round-trip time (RTT) to centralized cloud inspection proxies.

### Sheet 5: FIG. 5 — Validation Matrix & Hardware Egress Verification
FIG. 5 details empirical audit proofs of zero data egress:
* **[500] Held-Out Detector Validation Matrix:** Evaluated on 1,925 frozen annotated enterprise entities across 3 real-world synthetic distributions:
  * **[502A] W-2 Corporate Payroll (625 entities):** Precision 1.000, Recall 1.000, F1 1.000.
  * **[502B] Clinical Notes / EHR (600 entities):** Precision 1.000, Recall 1.000, F1 1.000.
  * **[502C] DevOps / Cloud Code Logs (700 entities):** Precision 1.000, Recall 1.000, F1 1.000.
  * **[504] Aggregate:** 1,925/1,925 verified with zero false positives or false negatives.
* **[510] Hardware & Network Egress Audit Invariants:**
  * **[512] Socket Trap Invariant:** OS kernel and Libc network monitoring confirms 0 outbound cleartext TCP/UDP/TLS sockets opened. Net egress: 0 bytes.
  * **[514] RAM Isolation Invariant:** Memory allocation verified in tab-scoped volatile heap. Zero persistent cookies, zero local storage, and 0 bytes residual dump on session close.
  * **[516] Cryptographic PCR State Binding:** Any 1-bit mismatch in enclave image (PCR0), kernel (PCR1), or application (PCR2) triggers fail-closed termination in <1 ms.

### Sheet 6: FIG. 6 — Cross-Platform Enclaves & Multi-Plane Deployment
FIG. 6 establishes cross-platform hardware enablement:
* **FIG. 6A: Cross-Platform Hardware Replication Benchmarks:**
  * **[602] Intel Xeon Platinum C6i (Ice Lake 3.5 GHz):** Attestation doc gen: 14.2 ms; COSE verification: 1.84 ms; `AF_VSOCK` latency: 0.118 ms; Throughput: 1,808 RPS.
  * **[604] AMD EPYC 7R13 C6a (Milan Zen 3):** Attestation doc gen: 16.1 ms; COSE verification: 2.05 ms; `AF_VSOCK` latency: 0.124 ms; Throughput: 1,642 RPS.
* **FIG. 6B: Three Unified Endpoint Topologies Enforcing 0 Bytes Egress:**
  * **[610] Web Browser Extension:** Manifest V3 sandbox, in-page DOM input field injection, zero remote code execution (<1.8 ms latency, 0 bytes egress).
  * **[612] Local MCP Guard:** Intercepts Model Context Protocol `stdio` JSON-RPC streams in AI IDEs (Claude Desktop, Cursor, Windsurf) (<0.4 ms latency, 0 bytes egress).
  * **[614] Backend Headless SDK:** In-memory stream hook for Python/Node.js/WASM pipelines prior to vector database ingestion (<0.15 ms latency, 0 bytes egress).
* **[620] Multi-Plane Parity:** Encrypted state handoff via `XChaCha20-Poly1305` between planes.

---

## 3. Recommended Patent Claims Hierarchy for Continuation Application

* **Claim 1 (Independent Method Claim - Core Engine):** A computer-implemented method for zero-trust data sanitization within volatile RAM of a client computing device prior to network socket dispatch, comprising: intercepting raw text; linear $O(N)$ DFA parsing; descending-offset string replacement with bracketed surrogate tokens `[TYPE_N]`; populating volatile bijective map; dispatching sanitized query $Q_T$ with 0 bytes cleartext; receiving model response; and reconstructing cleartext locally via volatile map zeroization.
* **Claim 2 (Dependent Claim - Hardware Memory Locking):** The method of claim 1, wherein volatile memory allocated for the session mapping table is locked using operating system `mlock` primitives to prevent cleartext leakage into disk swap partitions (Supported by FIG. 1 [108], FIG. 5 [514]).
* **Claim 3 (Dependent Claim - Descending Character Sorter):** The method of claim 1, wherein token replacement executes strictly in descending order of character start offsets, preventing upstream token insertions from displacing downstream index positions (Supported by FIG. 3 [308]).
* **Claim 4 (Dependent Claim - Hardware Enclave Attestation):** The method of claim 1, further comprising authenticating an AWS Nitro enclave via COSE-signed PCR0, PCR1, PCR2 measurements against Root CA over air-gapped `AF_VSOCK` (Supported by FIG. 1 [300], FIG. 2).
* **Claim 5 (Dependent Claim - Attested Rehydration Continuity / Return-Path Binding):** The method of claim 1, wherein the enclave response payload is cryptographically bound to the originating request identifier and client mapping epoch to eliminate cross-session context confusion (Supported by FIG. 2, Step 6-7).
* **Claim 6 (Independent Apparatus Claim):** Physical data processing system comprising host CPU, locked volatile RAM, and `AF_VSOCK` communications controller executing client DFA and hardware attester (Supported by FIG. 1, FIG. 6).
* **Claim 7 (Independent Non-Transitory Computer-Readable Medium):** Medium storing instructions for intercepting `stdio` streams in Model Context Protocol (MCP) AI agents and WebAssembly sandboxes (Supported by FIG. 6B [612, 614]).
