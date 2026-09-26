# WIPO PCT International Patent Specification & Claims

**INTERNATIONAL APPLICATION PUBLISHED UNDER THE PATENT COOPERATION TREATY (PCT)**  
**INTERNATIONAL BUREAU OF THE WORLD INTELLECTUAL PROPERTY ORGANIZATION (WIPO)**

---

## APPLICATION METADATA & PRIORITY PARTICULARS

| Administrative Field | Filing Specification |
| :--- | :--- |
| **Title of Invention** | ZERO-TRUST DATA SANITIZATION METHOD, SYSTEM, APPARATUS, AND COMPUTER-READABLE MEDIUM FOR DETERMINISTIC IN-RAM PRIVACY PRESERVATION IN ARTIFICIAL INTELLIGENCE AND DISTRIBUTED WORKFLOWS |
| **Applicant / Inventor** | Ilya Sibiryakov |
| **Citizenship / Domicile** | State of Israel (IL) |
| **Receiving Office (RO)** | Israel Patent Office (RO/IL) or International Bureau (RO/IB) |
| **Priority Application** | Israel Patent Application No. **IL 331905** |
| **Priority Filing Date** | **September 14, 2026 (14/09/2026)** |
| **WIPO DAS Access Code** | **B17B** (WIPO Digital Access Service) |
| **Governing Treaty** | Patent Cooperation Treaty (PCT), Paris Convention Art. 4 |
| **12-Month PCT Filing Deadline** | **September 14, 2027 (14/09/2027)** |
| **IPC Classification** | G06F 21/62 (2013.01), G06F 21/60 (2013.01), G06N 3/00 (2023.01), H04L 9/00 (2022.01) |
| **CPC Classification** | G06F 21/6245, G06F 21/6254, G06N 3/04, H04L 63/0428, H04L 63/08 |

---

## 1. TITLE OF THE INVENTION
ZERO-TRUST DATA SANITIZATION METHOD, SYSTEM, APPARATUS, AND COMPUTER-READABLE MEDIUM FOR DETERMINISTIC IN-RAM PRIVACY PRESERVATION IN ARTIFICIAL INTELLIGENCE AND DISTRIBUTED WORKFLOWS

---

## 2. TECHNICAL FIELD
The present invention relates generally to computerized data protection, cryptographic isolation, and information security in distributed networks. More specifically, the present invention pertains to methods, systems, apparatuses, and non-transitory computer-readable media for deterministic, sub-millisecond, in-memory sanitization, reversible context-preserving surrogate tokenization, and cryptographically attested zero network egress prior to data dispatch in artificial intelligence (AI), large language model (LLM), and model context protocol (MCP) agent environments.

---

## 3. BACKGROUND OF THE INVENTION AND PRIOR ART

### 3.1 The Proliferation of AI and LLM Architectures
In contemporary computing architectures, enterprises and individual users increasingly transmit unstructured prompt payloads, source code, clinical data, and corporate documentation to external cloud-hosted Large Language Models (LLMs) and distributed AI agent workflows. These systems rely on external Application Programming Interfaces (APIs) and agent orchestration frameworks (e.g., Model Context Protocol (MCP), LangChain, LlamaIndex, multi-agent frameworks) operating over public or third-party networks.

### 3.2 Limitations and Structural Flaws of Conventional Privacy Tools
Existing solutions for preventing the leakage of Personally Identifiable Information (PII), Protected Health Information (PHI), and sensitive intellectual property suffer from severe structural deficiencies:

1. **Cloud Proxy Architectures (Egress Vulnerability):**
   Conventional data loss prevention (DLP) and enterprise anonymization solutions route unmasked client payloads through an intermediary cloud proxy or multi-tenant Software-as-a-Service (SaaS) inspection server. Under European Union General Data Protection Regulation (GDPR) Article 28 and Health Insurance Portability and Accountability Act (HIPAA) rules, this intermediary routing creates an expansive chain of "Data Processors" (Subprocessors), mandating bilateral Data Processing Agreements (DPAs) and Business Associate Agreements (BAAs). In the event of proxy compromise, man-in-the-middle (MITM) interception, or misconfigured routing, raw cleartext is exposed to external third parties before any redaction occurs.

2. **Irreversible Redaction and Attention Degradation:**
   Prior art sanitization techniques employ destructive masking (e.g., replacing names, social security numbers, or account balances with black-box strings such as `[REDACTED]` or `XXX-XX-XXXX`). Destructive masking irrecoverably destroys the mathematical attention mechanism in transformer models. Because the surrogate token lacks grammatical category, syntactic role, and indexical uniqueness, upstream LLMs fail to correlate distinct entities (e.g., distinguishing a plaintiff from a defendant, or a patient from a physician), producing degraded or nonsensical generative responses.

3. **Computational Latency and Indeterministic Bottlenecks:**
   Traditional machine learning Named Entity Recognition (NER) models (such as BERT, RoBERTa, or spaCy-based local transformers) incur inference latencies ranging from 50 to 500 milliseconds per kilobyte of text. In high-throughput streaming systems, real-time agent tool dispatch, and command-line interfaces, this latency profile creates unacceptable operational bottlenecks. Furthermore, non-linear regular expression engines in prior art systems are vulnerable to Regular Expression Denial of Service (ReDoS) catastrophic backtracking.

4. **Lack of Verifiable Cryptographic Zero-Egress Attestation:**
   Existing client-side tools provide no tamper-evident cryptographic receipt proving to compliance officers, auditors, or downstream data consumers that sanitization was executed strictly inside local volatile host memory prior to external network dispatch. Consequently, Chief Information Security Officers (CISOs) cannot verify zero data egress without labor-intensive manual packet captures.

Accordingly, there is an urgent and unfulfilled need in the art for a deterministic, hardware-isolated or WebAssembly-sandboxed, in-RAM sanitization method that mathematically preserves transformer attention, enforces zero external network egress, executes within sub-millisecond computational bounds, and produces cryptographically verifiable attestation receipts.

---

## 4. SUMMARY OF THE INVENTION

The present invention solves the aforementioned problems by providing a deterministic, zero-trust data sanitization architecture executed entirely within the volatile memory boundary of a host client computing device prior to external network dispatch.

### 4.1 The Four Foundational Invariants
The invention establishes and enforces four immutable architectural invariants:

1. **Invariant 1 (Zero External Egress Prior to Sanitization):**
   Raw, unsanitized text payloads, identifiers, and sensitive tokens are physically and logically restricted to the volatile execution perimeter of the local client environment. Network socket dispatch (`http`, `https`, `fetch`, `WebSocket`, `IPC`) is intercepted or programmatically isolated such that transmission of unsanitized payloads across external network interfaces is impossible.

2. **Invariant 2 (Deterministic Reversible Tokenization):**
   Sanitization is executed through an indexed, bracketed surrogate token structure (e.g., `[EMAIL_1]`, `[IBAN_2]`, `[SSN_1]`, `[SECRET_KEY_1]`). Each identified entity is replaced by a deterministic surrogate preserving syntactic and grammatical context for transformer attention mechanisms. A private, bijective bidirectional mapping table $M: \{T_i \leftrightarrow S_i\}$ is instantiated exclusively within volatile host memory. When an upstream LLM returns a transformed response containing surrogate tokens, a local detokenization pipeline reverses the surrogates back to their original cleartext values entirely within volatile RAM, preventing the cloud model from ever possessing the cleartext.

3. **Invariant 3 (Verifiable Cryptographic Isolation in Volatile Memory):**
   The sanitization engine operates within a zero-telemetry, sandboxed runtime (such as a WebAssembly (WASM) virtual machine or hardware-attested enclave, e.g., AWS Nitro Enclaves). Ephemeral session states, mapping tables, and intermediate buffers reside exclusively in non-swappable volatile RAM (`mlock`) and are cryptographically scrubbed (`explicit_bzero` or memory overwrite) immediately upon session termination or socket transmission.

4. **Invariant 4 (Continuous Compliance & Zero Subprocessor Exclusion):**
   Because cleartext data undergoes zero egress, no vendor-controlled server or intermediary cloud node ever receives, stores, or processes personal data. Under GDPR Recital 26 and EDPB doctrine, the sanitization engine operates as a local utility, excluding vendor subprocessor liability under GDPR Article 28 and eliminating the statutory requirement for Data Processing Agreements (DPAs).

### 4.2 Cryptographic Conformance & Attestation Receipts
In another aspect of the invention, upon completion of a sanitization operation or conformance audit, the engine computes a cryptographic digest (e.g., SHA-256) of the input buffer state, the surrogate token profile, and execution parameters, and mints an asymmetric cryptographic certificate (e.g., Ed25519 digital signature per RFC 8032) verifying that the execution environment adhered to Invariants 1 through 4.

---

## 5. BRIEF DESCRIPTION OF THE DRAWINGS

- **FIG. 1** is a high-level architectural block diagram illustrating the localized in-RAM execution perimeter, the volatile sanitization engine, and the isolated external LLM cloud interface in accordance with an embodiment of the present invention.
- **FIG. 2** is a schematic flow diagram illustrating deterministic bracketed surrogate tokenization, the ephemeral volatile mapping table, and bidirectional detokenization of generative AI completions.
- **FIG. 3** is a sequence diagram illustrating socket-level network interception, catastrophic backtracking elimination, and cryptographic Ed25519 receipt generation.
- **FIG. 4** is a block diagram of an embodiment deployed within an air-gapped Model Context Protocol (MCP) stdio agent pipeline.

---

## 6. DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS

The following detailed description illustrates embodiments of the invention by way of example and not by way of limitation.

### 6.1 Mathematical Formulation of the Sanitization and Detokenization Transform
Let an arbitrary input text payload be defined as a character sequence $X = (c_1, c_2, \dots, c_n)$, where $X \in \Sigma^*$.  
Let $E = \{e_1, e_2, \dots, e_k\}$ denote a set of sensitive entity spans identified within $X$, where each entity $e_j = (s_j, f_j, \tau_j)$ is characterized by a start index $s_j$, an end index $f_j$, and an entity taxonomy category $\tau_j \in \mathcal{T}$ (e.g., $\tau \in \{\text{EMAIL}, \text{SSN}, \text{IBAN}, \text{CREDIT\_CARD}, \text{API\_KEY}, \text{NAME}\}$).

The localized in-RAM sanitization operator $S: \Sigma^* \to \Sigma^*$ maps $X$ to a sanitized payload $Y = S(X)$ such that:
$$Y = c_{1..s_1-1} \mathbin{\Vert} \sigma_1 \mathbin{\Vert} c_{f_1+1..s_2-1} \mathbin{\Vert} \sigma_2 \mathbin{\Vert} \dots \mathbin{\Vert} \sigma_k \mathbin{\Vert} c_{f_k+1..n}$$
where $\sigma_j$ is a bracketed surrogate token uniquely indexed to entity category $\tau_j$:
$$\sigma_j = \text{"["} \mathbin{\Vert} \tau_j \mathbin{\Vert} \text{"\_"} \mathbin{\Vert} \text{Index}(\tau_j) \mathbin{\Vert} \text{"]"}$$

Concurrently, a bijective private mapping structure $M$ is constructed in volatile RAM:
$$M = \{ (\sigma_j, X[s_j..f_j]) \mid j \in \{1, \dots, k\} \}$$

When payload $Y$ is transmitted over an external network interface to an external generative model $G$, the model produces an output payload $Z = G(Y)$, wherein $Z$ maintains the surrogate tokens $\sigma_j$ by virtue of attention weight retention. Upon receipt of $Z$ within the volatile memory boundary of the client computing device, the reverse detokenization operator $R: \Sigma^* \times M \to \Sigma^*$ reconstructs cleartext payload $\hat{X}$:
$$\hat{X} = R(Z, M) = Z[\sigma_j \mapsto M(\sigma_j)]$$

Following reconstruction, mapping structure $M$ is zeroized in volatile memory.

### 6.2 Volatile Memory Allocation and Non-Swap Boundary
In a preferred embodiment, volatile mapping structure $M$ and intermediate string buffers are allocated using operating system primitives that prevent paging or swapping to secondary persistent storage (e.g., POSIX `mlock()` or Windows `VirtualLock()`). Upon completion of the detokenization operation or upon closure of the user session, the allocated memory pages are overwritten with cryptographic pseudo-random bytes followed by zeros using an explicit zeroization instruction (`explicit_bzero` or `SecureZeroMemory`), precluding post-execution cold-boot or memory dump recovery of cleartext entities.

### 6.3 Linear Regex Parsing and Catastrophic Backtracking Immunity
To prevent ReDoS vulnerabilities, pattern matching across entity taxonomy $\mathcal{T}$ is constrained to deterministic finite automata (DFA) or linear regular expression graphs satisfying $O(N)$ execution time complexity with respect to payload length $N$. Nested unbounded quantifiers of the form `(a+)+` are strictly prohibited. In benchmarked execution, processing throughput exceeds 50 megabytes per second, maintaining total sanitization latency under 2.0 milliseconds for standard prompt payloads under 100 kilobytes.

### 6.4 Secure Multi-Party Session Vault via Authenticated Encryption
In distributed multi-agent embodiments where mapping table $M$ must be shared across isolated agent perimeters without exposing cleartext to untrusted intermediaries, table $M$ is serialized into a binary buffer, derived via Argon2id key derivation, and encrypted using XChaCha20-Poly1305 symmetric authenticated encryption with an ephemeral 192-bit nonce. Cleartext is never exposed during inter-agent transit.

### 6.5 Conformance Verification and Ed25519 Certificate Minting
Upon completion of an automated or continuous security audit, the verification engine constructs an attestation manifest comprising:
1. `certificate_id`: Unique cryptographic identifier (`ZTDS-CERT-v1-...`).
2. `applicant`: Designated entity name and version.
3. `target_hash`: SHA-256 digest of audited software binaries.
4. `invariants`: Formal Boolean assertions $\{I_1=1, I_2=1, I_3=1, I_4=1\}$.
5. `timestamp`: ISO 8601 UTC timestamp.

The manifest is normalized to canonical JSON (RFC 8785) and signed using an Ed25519 private key adhering to RFC 8032. The resulting compact token `ZTDS-CERT-v1.<base64url_payload>.<base64url_signature>` is verifiable offline by any third-party auditor possessing the public key, requiring zero network telemetry.

---

## 7. PATENT CLAIMS

WE CLAIM:

### Claim 1 (Independent Method Claim)
A computer-implemented method for deterministic zero-trust data sanitization within a local volatile execution perimeter of a client computing device prior to external network dispatch, the method comprising:
a) receiving, by a processor of the client computing device, an input data payload comprising unstructured text intended for transmission to an external destination;
b) intercepting said input data payload prior to serialization onto an external network interface socket, thereby enforcing zero network egress of unsanitized cleartext data;
c) parsing, within volatile memory of said client computing device, the input data payload utilizing deterministic finite automata pattern recognition to identify sensitive personal and confidential data entities;
d) generating, within volatile memory, for each identified sensitive entity, a bracketed surrogate token comprising an entity taxonomy designator and an incremental index, wherein the bracketed surrogate token preserves semantic and syntactic context for transformer neural network attention mechanisms;
e) substituting, within volatile memory, each identified sensitive entity in the input data payload with its corresponding bracketed surrogate token to generate a sanitized payload;
f) recording, within volatile memory, a bidirectional surrogate mapping table linking each bracketed surrogate token to its corresponding sensitive entity cleartext;
g) dispatching the sanitized payload containing bracketed surrogate tokens across the external network interface socket to the external destination, wherein the cleartext of said sensitive entities remains strictly confined to the local volatile memory of the client computing device;
h) receiving, from the external destination, a response payload generated based on the sanitized payload, wherein said response payload includes one or more of said bracketed surrogate tokens;
i) reconstructing, within volatile memory of the client computing device, a cleartext response payload by substituting each bracketed surrogate token in the received response payload with its linked sensitive entity cleartext from said bidirectional surrogate mapping table; and
j) cryptographically zeroizing the bidirectional surrogate mapping table in volatile memory upon completion of reconstruction.

### Claim 2 (Dependent Method Claim)
The method of claim 1, wherein the deterministic finite automata pattern recognition executes within a strictly linear $O(N)$ computational time complexity with respect to payload character length $N$, ensuring execution time under 2.0 milliseconds per 100 kilobytes of text without catastrophic regular expression backtracking.

### Claim 3 (Dependent Method Claim)
The method of claim 1, wherein said volatile memory allocated for the bidirectional surrogate mapping table is locked against secondary storage paging using an operating system memory lock primitive, preventing storage of sensitive entity cleartext in persistent disk swap partitions.

### Claim 4 (Dependent Method Claim)
The method of claim 1, wherein the local volatile execution perimeter comprises a sandboxed WebAssembly (WASM) virtual machine executing within a client application runtime without operating system socket-creation privileges.

### Claim 5 (Dependent Method Claim)
The method of claim 1, wherein the external destination is a Large Language Model (LLM) inference endpoint, and wherein said bracketed surrogate token preserves grammatical case, punctuation boundaries, and position embeddings within an attention matrix of said Large Language Model.

### Claim 6 (Dependent Method Claim)
The method of claim 1, further comprising:
computing a SHA-256 cryptographic digest of the input data payload, the sanitized payload, and runtime execution parameters; and
generating a digitally signed conformity certificate asserting that zero network egress of unsanitized cleartext occurred prior to sanitization.

### Claim 7 (Dependent Method Claim)
The method of claim 6, wherein the conformity certificate is signed using an Ed25519 asymmetric private key in accordance with RFC 8032 and formatted as a compact three-part token comprising a protocol prefix, a base64url-encoded canonical JSON payload, and a base64url-encoded cryptographic signature.

### Claim 8 (Dependent Method Claim)
The method of claim 1, wherein the input data payload is intercepted from a Model Context Protocol (MCP) standard input (`stdio`) stream of an autonomous AI agent process executing on the client computing device.

### Claim 9 (Dependent Method Claim)
The method of claim 1, further comprising:
encrypting said bidirectional surrogate mapping table using an XChaCha20-Poly1305 authenticated symmetric cipher with a key derived via an Argon2id key derivation function for secure multi-party state transfer between isolated agent execution environments.

### Claim 10 (Dependent Method Claim)
The method of claim 1, wherein the local execution perimeter excludes all third-party telemetry, tracking pixels, and cloud logging libraries, thereby excluding the client computing device from subprocessor regulatory liability under GDPR Article 28.

### Claim 11 (Independent Apparatus Claim)
A data processing apparatus for zero-trust data sanitization, the apparatus comprising:
a volatile memory storing instructions; and
a processor communicatively coupled to the volatile memory and configured to execute the instructions to:
isolate an execution perimeter within the volatile memory from external network interfaces;
intercept an unstructured prompt payload before socket transmission;
identify sensitive entity spans within the prompt payload using linear-time pattern recognition;
instantiate an ephemeral bidirectional mapping table in the volatile memory;
substitute each sensitive entity span with a deterministic bracketed surrogate token preserving transformer attention syntax;
transmit the sanitized prompt payload comprising surrogate tokens across an external network interface to a remote artificial intelligence inference server;
receive an inferential response from the remote artificial intelligence inference server;
detokenize the inferential response by replacing bracketed surrogate tokens with corresponding entity cleartext retrieved from the ephemeral bidirectional mapping table; and
execute an explicit memory zeroization instruction over the ephemeral bidirectional mapping table.

### Claim 12 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein the processor is further configured to execute the sanitization instructions within a hardware-attested isolated enclave.

### Claim 13 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein the processor is configured to terminate execution and generate an alert if any network socket transmission of unmasked cleartext is detected prior to substitution with surrogate tokens.

### Claim 14 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein said bracketed surrogate tokens conform to an alphanumeric pattern `[TYPE_INDEX]`, wherein `TYPE` is selected from the group consisting of: `EMAIL`, `PHONE`, `SSN`, `IBAN`, `CREDIT_CARD`, `IP_ADDRESS`, `API_KEY`, `JWT_TOKEN`, and `NAME`.

### Claim 15 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein the processor is further configured to calculate an execution latency metric and verify that sanitization latency does not exceed 2.0 milliseconds per 100,000 characters.

### Claim 16 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein the processor is configured to verify cryptographic receipts of the sanitization operation using an Ed25519 public key without transmitting verification requests to an external verification server.

### Claim 17 (Dependent Apparatus Claim)
The apparatus of claim 11, wherein the processor is further configured to operate in an offline, air-gapped network configuration wherein network interface controllers are disabled during sanitization and detokenization cycles.

### Claim 18 (Independent Non-Transitory Computer-Readable Medium Claim)
A non-transitory computer-readable storage medium storing instructions that, when executed by one or more processors of a computing device, cause the one or more processors to perform operations comprising:
intercepting an input text stream in volatile host memory prior to external network egress;
identifying sensitive data tokens within the input text stream using a deterministic parsing engine;
allocating an ephemeral surrogate mapping table in non-swappable volatile host memory;
replacing each sensitive data token in the input text stream with a bracketed syntactic surrogate token to produce an attention-preserving sanitized payload;
recording a reversible pairing between each bracketed syntactic surrogate token and its corresponding sensitive data token in the ephemeral surrogate mapping table;
transmitting the sanitized payload to an external artificial intelligence model;
receiving a generative response from the external artificial intelligence model containing one or more of said bracketed syntactic surrogate tokens;
substituting each bracketed syntactic surrogate token in the generative response with its corresponding sensitive data token from the ephemeral surrogate mapping table; and
scrubbing the ephemeral surrogate mapping table from volatile host memory using a secure memory zeroization routine.

### Claim 19 (Independent Distributed Multi-Agent System Claim)
A distributed artificial intelligence agent system with zero-trust privacy preservation, the system comprising:
a plurality of autonomous software agents executing on one or more computing devices and communicating via a standard inter-process communication protocol; and
a zero-trust sanitization layer configured to intercept messages transmitted between said autonomous software agents, wherein the sanitization layer:
identifies confidential tokens in agent dispatch payloads;
replaces confidential tokens with bracketed surrogate identifiers while retaining contextual syntactic roles;
maintains an isolated in-memory mapping table;
encrypts said in-memory mapping table into an authenticated cryptographic vault using Argon2id and XChaCha20-Poly1305 prior to inter-agent delegation; and
restores cleartext tokens within the isolated memory boundary of an authorized recipient agent upon cryptographic verification of vault authenticity.

### Claim 20 (Independent Cryptographic Conformance Verification Claim)
A computer-implemented method for cryptographically verifying compliance of a software application with zero-trust data sanitization invariants, the method comprising:
a) executing an automated test suite against the software application in an instrumented environment;
b) monitoring socket-level network traffic of the software application during data processing to verify zero transmission of unsanitized payload data across external network interfaces (Invariant 1);
c) inspecting volatile memory of the software application to confirm that private entity token mappings reside exclusively in volatile memory and are zeroized upon session termination (Invariant 3);
d) asserting that surrogate tokenization preserves syntactic structure and is bijectively reversible (Invariant 2);
e) verifying by abstract syntax tree analysis that the software application contains zero third-party subprocessor telemetry dependencies (Invariant 4);
f) computing a cryptographic SHA-256 digest of the software application build and test telemetry; and
g) minting an Ed25519 digitally signed conformity certificate encoding verified conformance with said Invariants 1 through 4.

---

## 8. ABSTRACT OF THE DISCLOSURE
Methods, systems, apparatuses, and non-transitory computer-readable media are disclosed for deterministic zero-trust data sanitization within a local volatile execution perimeter of a client computing device prior to external network dispatch. An input data payload is intercepted before network socket serialization. Sensitive personal, clinical, or confidential entities are parsed in volatile memory using linear-time pattern recognition. Each sensitive entity is substituted with a bracketed, indexed surrogate token preserving transformer neural network attention syntax, while a bijective mapping table is instantiated in non-swappable volatile RAM. The sanitized payload is dispatched to an external artificial intelligence model. Upon receipt of a model response, the bracketed surrogate tokens are detokenized back to cleartext within local volatile memory, and the mapping table is cryptographically zeroized. Ed25519 digital signature receipts certify zero external cleartext egress and invariant compliance without external telemetry.
