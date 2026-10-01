# ZTDS.ai — Evidentiary Sovereignty and Forensics Specification
## Normative Conformance Specification for Crypto Asset Investigations, AML Intelligence and Judicial Chain of Custody (RFC v1.0 Extension)

**Standards Authority:** ZTDS AI Consortium & Standards Authority (BrandMeWeb Ecosystem)  
**Lead Author & Chief Architect:** Ilya Sibiryakov (ORCID: [0009-0002-0642-5985](https://orcid.org/0009-0002-0642-5985))  
**Document ID:** ZTDS-SPEC-2026-FORENSIC-V1  
**Status:** Canonical Technical & Legal Specification &middot; Standards Track Extension  
**Effective Date:** 02 October 2026  
**Permanent Repository Anchor:** `https://ztds.ai/docs/legal/ZTDS_Evidentiary_Sovereignty_and_Forensics_Specification.txt`

---

## 1. Executive Summary & The Web3 Architectural Paradox

The foundational ethos of decentralized cryptography and blockchain intelligence is encapsulated in a single non-negotiable axiom: **"Don't trust, verify."** In the financial crime, anti-money laundering (AML), and crypto-forensic domains, no certified investigator would ever entrust private keys, investigative clusters, or seed phrases to unverified third-party promises.

Yet, with the rapid enterprise adoption of Generative Artificial Intelligence (GAI) and autonomous agent workflows, the industry has encountered a profound systemic paradox:
1. Forensic analysts, compliance officers, and financial intelligence units (FIUs) paste raw suspect wallet addresses, unconfirmed transaction links, peel-chain graphs, and confidential Suspicious Activity Report (SAR / STR) drafts directly into external cloud-hosted Large Language Models (e.g., OpenAI, Microsoft Azure, Anthropic).
2. Organizations rely upon corporate **Data Processing Agreements (DPAs)** and administrative settings (such as "do not train on customer data") as substitute security perimeters.
3. In doing so, organizations surrender **Evidentiary Sovereignty**—physically transmitting unadjudicated suspect identifiers, proprietary cluster tags, and investigative working hypotheses into multi-tenant remote memory outside local jurisdictional custody.

This specification formalizes the **ZTDS Evidentiary Sovereignty Profile (`ZTDS-FORENSIC`)**, establishing mathematical and operational requirements that enable investigators to leverage the full reasoning and topological intelligence of leading language models while guaranteeing absolute zero data egress ($\Delta Egress \equiv 0.00\text{ B}$) and providing a cryptographically verifiable **Chain-of-Custody Docket Receipt**.

---

## 2. Threat Model: The Four Vectors of Investigative Degradation

Conforming implementations must defend against four distinct attack and exposure vectors:

```
[INVESTIGATOR WORKSTATION]
  │
  ├── Vector 1: Unauthorized Third-Party Ingestion (Breach of Statutory Secrecy)
  ├── Vector 2: Subpoena & Discovery Exposure (Defense Counsel Inquiries into Cloud Logs)
  ├── Vector 3: Evidentiary Chain of Custody Degradation (Inadmissibility / FRE 901/902)
  └── Vector 4: On-Chain Correlation Attacks (Re-Identification via Amounts & Timestamps)
```

### 2.1. Vector 1: Unauthorized Third-Party Ingestion & Breach of Statutory Secrecy
Under statutory financial intelligence regimes—including the **US Bank Secrecy Act (BSA, 31 U.S.C. § 5318(g)(2))** and equivalent international regulations—the unauthorized disclosure of a SAR or of the fact that an investigation is underway is a statutory felony ("tipping off"). Transmitting raw SAR narratives or target wallet clusters to commercial cloud APIs creates an external copy stored on third-party infrastructure, presenting direct regulatory liability.

### 2.2. Vector 2: Subpoena & Third-Party Discovery Exposure
In criminal prosecutions and contested civil asset forfeiture proceedings, defense counsel routinely subpoena external cloud service providers for all prompt logs, interaction histories, and model completions associated with the investigative team. If raw suspect addresses or draft theories were submitted to external models:
* Defense counsel can challenge investigative bias, exploratory hallucinations, or procedural irregularities.
* Premature disclosure of unindicted co-conspirators or confidential informants embedded in prompt context can compromise parallel operations.
* A signed DPA does not shield an enterprise from federal subpoenas, national security letters, or cross-border discovery orders served directly upon the cloud provider.

### 2.3. Vector 3: Evidentiary Chain of Custody Degradation
Under **US Federal Rules of Evidence (FRE 901/902)**, **FRE 502**, and international equivalents, evidence derived from computational processing must maintain an unbroken, verifiable chain of custody. When cleartext evidence is processed by proprietary, non-deterministic third-party black-box models:
* The investigator cannot mathematically prove that the model did not interpolate, fabricate, or cross-contaminate data with other multi-tenant enterprise sessions.
* The integrity of the evidentiary chain is vulnerable to severe challenge during cross-examination.

### 2.4. Vector 4: On-Chain Correlation & Heuristic Re-Identification
Masking only public keys (e.g., converting `0x71C...` to `[WALLET_1]`) does not prevent re-identification if high-precision transaction amounts (e.g., `14.89214712 ETH`) or exact block timestamps are submitted in cleartext. An adversary or untrusted cloud provider can query public block explorers (Etherscan, Mempool, Blockchain.info) and trivially recover the masked public addresses by matching unique floating-point outputs.

---

## 3. Normative Conformance Requirements: The Four Forensic Invariants

To achieve and maintain **ZTDS-FORENSIC** accreditation, a software implementation, analytical agent, or investigative workbench must strictly adhere to the following four normative invariants:

### Invariant F-1: Zero External Egress of Raw Target Entities ($\Delta Egress \equiv 0.00\text{ B}$)
* **Mandate:** Zero bytes of unmasked blockchain addresses, transaction hashes, smart contract addresses, raw private keys, SAR IDs, FIU case numbers, or cluster tags may be transmitted across the network interface.
* **Execution Boundary:** Sanitization must execute strictly on the investigator's local host in volatile RAM before socket serialization (`TCP/UDP/TLS`).

### Invariant F-2: Directed Acyclic Graph (DAG) Structural Tokenization
* **Mandate:** The sanitization engine must substitute target entities with syntactically stable, context-preserving bracketed surrogates:
  * Public Addresses: `[TARGET_WALLET_1]`, `[COUNTERPARTY_WALLET_2]`, `[INTERMEDIARY_HOP_3]`
  * Transaction Hashes: `[TX_HASH_1]`, `[TX_HASH_2]`
  * Clusters & Mixers: `[MIXER_POOL_1]`, `[CLUSTER_ALPHA_1]`
  * Case Identifiers: `[SAR_ID_1]`, `[CASE_DOCKET_1]`
* **Bijective Reasoning:** The tokenization must preserve the topological structure of fund flows (e.g., peeling chains, smurfing patterns, nesting exchanges), allowing the upstream LLM to analyze the typology and draft investigative summaries without learning any cleartext identifiers.
* **Local Reconstitution:** Reversal ($T^{-1}$) occurs strictly inside local workstation volatile memory upon receiving the model output.

### Invariant F-3: Value Quantization & Temporal Clamping (Anti-Correlation)
* Conforming implementations must implement automated anti-correlation sanitization:
  1. **Logarithmic Amount Binning:** Floating-point transaction values must either be substituted with abstract value surrogates (`[TX_VALUE_1]`) or clamped into order-of-magnitude ranges (e.g., `[RANGE_10_TO_50_ETH]`).
  2. **Temporal Window Clamping:** Exact Unix timestamps or block heights must be mapped to relative or discretized chronological intervals (e.g., `[WINDOW_T0_PLUS_2H]`, `[EPOCH_2026_Q3]`) to prevent block-height correlation against public ledgers.

### Invariant F-4: Verifiable Ephemeral In-RAM Execution
* Session mapping tables $R = \{(m_i, s_i)\}$ must reside solely in non-swappable volatile memory (`mlock` or sandboxed WebAssembly linear memory).
* Writing session maps to secondary storage (disk caches, browser storage, unencrypted swap) is strictly prohibited.
* Memory zeroization must be executed immediately upon completion of the investigative session.

---

## 4. Cryptographic Chain-of-Custody Docket Receipt (Ed25519)

To ensure evidentiary admissibility in judicial, regulatory, and arbitration proceedings, conforming implementations must generate an asymmetric, tamper-evident **Chain-of-Custody Docket Receipt**.

### 4.1. Canonical JSON Receipt Schema
The docket receipt must be minted prior to dispatching any prompt payload to an external model:

```json
{
  "$schema": "https://ztds.ai/schemas/v1/forensic-docket-receipt.json",
  "version": "ZTDS-FORENSIC-v1.0",
  "receipt_id": "ztds-rec-8f9c1e2b-4d6a-4c8e-9a1b-3f7d2e5a8b0c",
  "timestamp_utc": "2026-10-02T00:55:00.000Z",
  "investigator": {
    "organization_id": "ORG-FORENSIC-LE-904",
    "workstation_hw_hash": "sha256:7b2a9e...c41d",
    "engine_version": "ztds-forensic-wasm@1.4.0"
  },
  "attestation": {
    "standard": "ZTDS-RFC-v1.0",
    "profile": "FORENSIC-AML-EVIDENTIARY",
    "egress_bytes_detected": 0.00,
    "input_payload_hash": "sha256:9d4e1b...3f8a",
    "sanitized_payload_hash": "sha256:4a7c2e...8d1f",
    "entities_masked_summary": {
      "WALLET_BTC": 4,
      "WALLET_ETH": 2,
      "TX_HASH": 8,
      "SAR_ID": 1,
      "VALUE_QUANTIZED": 6
    },
    "correlation_safeguards": {
      "amount_binning_applied": true,
      "temporal_clamping_applied": true
    }
  },
  "cryptographic_signature": {
    "algorithm": "Ed25519",
    "public_key": "ed25519:e4b2...8f9a",
    "signature_b64url": "MEQCIE3v8K...9aF1="
  }
}
```

### 4.2. Verification Protocol
1. **Offline Verification:** Any forensic auditor, defense counsel, or presiding judge can independently verify the receipt offline using standard RFC 8032 Ed25519 routines.
2. **Admissibility Proof:** The receipt proves that:
   * The text delivered to the external AI vendor contained exclusively de-identified surrogate tokens.
   * Exactly $0.00$ bytes of cleartext target data exited the local workstation.
   * The investigative hypothesis was formulated using mathematically isolated abstractions, preserving the unbroken chain of custody.

---

## 5. Regulatory & Jurisprudential Mapping

| Legal / Regulatory Framework | Statutory Provision | ZTDS-FORENSIC Legal Ground |
| :--- | :--- | :--- |
| **US Federal Rules of Evidence** | **FRE Rule 901 & 902** (Self-Authenticating Evidence) | Cryptographic Ed25519 receipt authenticates that underlying target exhibits were not altered or contaminated by third-party AI systems. |
| **US Federal Rules of Evidence** | **FRE Rule 502(b)** (Attorney-Client Privilege & Work Product) | Eliminates third-party disclosure waiver; raw attorney-client investigative theories are never transmitted to LLM infrastructure. |
| **US Bank Secrecy Act (BSA)** | **31 U.S.C. § 5318(g)(2)** (Anti-Tipping Off & SAR Secrecy) | SAR draft narratives stripped of public addresses and case IDs do not constitute unauthorized disclosure under federal anti-tipping statutes. |
| **EU Anti-Money Laundering Directive** | **AMLD6 (Directive 2018/1673)** & FIU Confidentiality | Preserves European Financial Intelligence Unit statutory confidentiality mandates during automated analytical workflows. |
| **European Union GDPR** | **Article 28 & Recital 26** | Pure client-side tokenization eliminates external processor relationship; de-identified topological prompts fall outside GDPR personal data scope. |
| **FATF Recommendation 15** | **Virtual Assets & New Technologies** | Establishes provable risk-based operational safeguards for the adoption of artificial intelligence in virtual asset investigations. |

---

## 6. Conformity Assessment & Certification Path

Organizations, vendors of blockchain analytics tools, and financial institutions seeking official **ZTDS Verified: Forensic Workflow** certification must undergo the following three-stage evaluation:

1. **Phase 1: Automated AST & Socket Audit**  
   Execution of `npx ztds-audit --profile crypto_forensics` confirming zero external socket calls during prompt tokenization and proper amount/timestamp binning.
2. **Phase 2: Adversarial Re-Identification Testing**  
   Automated verification confirming that sanitized prompts cannot be reverse-mapped against public blockchain state (Mempool/Etherscan) via automated correlation attacks.
3. **Phase 3: Formal CAB Attestation & Docket Registry Listing**  
   Issuance of the official `ZTDS-FORENSIC-CERT-v1` digital certificate and publication within the ZTDS Verified Registry at `https://ztds.ai/registry/`.
