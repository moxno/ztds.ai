# ZTDS.ai — Conformity Assessment, Certification & Revocation Policy
## Formal Governance, Invariant Audit Criteria, Cryptographic Attestation & Trademark Rules (RFC v1.0 SSOT)

**Standards Authority:** ZTDS AI Consortium & Standards Authority (BrandMeWeb Ecosystem)  
**Lead Author & Chief Architect:** Ilya Sibiryakov (ORCID: [0009-0002-0642-5985](https://orcid.org/0009-0002-0642-5985))  
**Document ID:** ZTDS-POL-2026-CAP-V1  
**Status:** Canonical Governance SSOT &middot; Legally Binding Policy  
**Effective Date:** 26 September 2026  

---

## 1. Institutional Authority, Intellectual Property & Legal Anchor

### 1.1. Standards Body Mandate
The **Zero-Trust Data Sanitization AI Consortium (ZTDS AI Consortium)** functions as an independent, vendor-neutral standards authority and conformity assessment body (CAB). Its charter is to define, maintain, benchmark, and certify technical implementations of client-side, in-memory data sanitization for artificial intelligence, machine learning, and autonomous agent workflows.

### 1.2. Intellectual Property & Statutory Priority
1. **Registered Word Mark:** The word mark **ZTDS™** is registered with the Israel Patent Office (ILPO), Classes 9 and 42 (Order #182655957, filed 20/09/2026). International priority under Article 4 of the Paris Convention for the Protection of Industrial Property is locked through 20/03/2027.
2. **Patent Application:** In-memory client-side de-identification and surrogate mapping methods are claimed under Israel Patent Application **IL 331905** (filed 14/09/2026, WIPO DAS Access Code: `B17B`), locking international Patent Cooperation Treaty (PCT) priority through 14/09/2027.
3. **Open Specification:** The core technical standard [ZTDS_Specification_RFC_v1.md](https://ztds.ai/standard/) is published under Apache 2.0 (code primitives) and Creative Commons Attribution 4.0 International (CC BY 4.0) (specification prose).
4. **Permanent Academic DOIs:**
   - Mathematical Model & Invariants: CERN / Zenodo [10.5281/zenodo.22058770](https://doi.org/10.5281/zenodo.22058770)
   - Empirical Latency Benchmark: Center for Open Science / OSF [10.17605/OSF.IO/5BYJF](https://doi.org/10.17605/OSF.IO/5BYJF)
   - Legal Treatise & Privilege Defense: Law Archive / OSF [preprints/lawarchive/4wc86](https://osf.io/preprints/lawarchive/4wc86/)
   - Regulatory Compliance (EU AI Act & UK GDPR): SSRN / Elsevier [Abstract ID: 7335581](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7335581)
   - Clinical PHI & HIPAA Safe Harbor: Research Square / Springer Nature [10.21203/rs.3.rs-11117457/v1](https://doi.org/10.21203/rs.3.rs-11117457/v1)

### 1.3. Two-Brand Firewall (Commercial Isolation)
The ZTDS AI Consortium maintains strict institutional neutrality:
- **`ztds.ai`:** Independent open standard, RFC specification, conformity assessment authority, and verified registry. Does not sell consumer subscriptions, commercial licenses, or proprietary software.
- **`privacyscrubber.com`:** Commercial pioneer product within Ilya Sibiryakov's ecosystem, designated in the open registry as **Certified Reference Implementation #001**.
- Commercial vendors (including PrivacyScrubber) may monetise their implementations under commercial licenses, but certification authority resides exclusively within the ZTDS AI Consortium.

---

## 2. The 4 Non-Negotiable Conformance Invariants

To achieve and maintain **ZTDS Certified** or **ZTDS Verified** accreditation, an applicant's software, agent, RAG pipeline, or enterprise deployment must mathematically and empirically satisfy all four foundational invariants of RFC v1.0:

### Invariant 1: Zero External Egress Prior to Sanitization ($\Delta Egress \equiv 0.00\text{ B}$)
- Under no circumstances may raw, unmasked Personally Identifiable Information (PII), Protected Health Information (PHI), financial account credentials, developer secrets, or proprietary corporate data cross the local host or client execution boundary.
- De-identification must occur strictly prior to serialization across network sockets (`TCP`, `UDP`, `WebSocket`, `HTTP`).
- Verification standard: Physical Airplane Mode Audit and socket-level packet inspection must confirm exactly $0.00$ bytes of cleartext sensitive payload egress.

### Invariant 2: Deterministic Reversible Tokenization ($T = M(V, C)$)
- Surrogate tokens must preserve syntax, grammatical role, and semantic distance to enable Large Language Models (LLMs) to reason correctly without hallucination or contextual collapse.
- Token mappings must follow the standardized bracketed taxonomy (`[NAME_N]`, `[EMAIL_N]`, `[PHONE_N]`, `[ID_N]`, `[IBAN_N]`, `[SECRET_KEY_N]`).
- The reverse transformation $T^{-1}$ must execute locally upon receipt of model inference, restoring cleartext strictly on the user display or local application tier.

### Invariant 3: Verifiable In-Memory Isolation (Volatile RAM Boundary)
- Cleartext entity values and session token maps $R = \{(m_i, s_i)\}$ must reside exclusively in volatile memory (ephemeral heap/RAM) and must never be written to non-volatile secondary storage.
- Strict prohibition: Writing session token maps to browser `localStorage`, `sessionStorage`, `IndexedDB`, `document.cookie`, disk caches, swap files, or unencrypted persistent logs is an automatic, disqualifying invariant violation.
- Session maps must be scoped strictly to the ephemeral thread, process, or browser tab instance, and must be permanently wiped upon session termination.

### Invariant 4: Zero Sub-Processor Chain & Telemetry Elimination
- The sanitization engine must operate as a pure local computational utility.
- It must not transmit operational telemetry, prompt hashes, entity metadata, or analytical events to third-party collectors (Mixpanel, Segment, Datadog, Sentry, Google Analytics) from within the sanitization execution path.
- Legal impact: Zero data custody eliminates Data Processor status under European Union GDPR Article 28, exempting deployments from Data Processing Agreements (DPAs) and HIPAA Business Associate Agreements (BAAs).

---

## 3. Accreditation Tracks & Taxonomy

Conformity assessment is structured across three distinct accreditation tracks:

| Track | Target Audience | Registry Endpoint | Badge Label | Attestation Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **Track A** | Software, RAG Pipelines, AI Agents, IDE Extensions, SDKs | `/registry/` | `VERIFIED` | Cryptographic Certificate (`ZTDS-CERT-v1`) |
| **Track B** | Enterprises, Law Firms, Healthcare Systems, Agencies | `/companies/` | `VERIFIED` / `PIONEER` | CISO Attestation & DPA Exemption Memo |
| **Track C** | Cryptographers, CISOs, Legal Counsel, Security Auditors | `/fellows/` | `FELLOW` / `COUNCIL` | ORCID / Zenodo Fellow Accreditation |

---

## 4. Verification Levels & Conformance Testing

The Consortium recognizes three escalating levels of assurance:

```
[Level 1: Automated CTS] ───> [Level 2: Independent Code Audit] ───> [Level 3: Enclave Attestation]
  npx ztds-audit               Maintainer Source Code Review        Hardware Attestation (Nitro/WASM)
  0 Invariant Violations       Clean Whitebox Audit Report          Cryptographic Ephemeral Isolation
  Self-Serve GitOps            Registry Listing & Seal              Enterprise Defense Shield
```

### Level 1: Automated Conformance Test Suite (CTS)
- Executed via the official CLI:
  ```bash
  npx ztds-audit --dir ./src --cert --applicant "Entity Name" --product "Product Name"
  ```
- Scans source trees against the full ZTDS regex heuristics database.
- Must yield: `0 Critical findings`, `0 High findings`, `Invariant 1: PASS`, `Invariant 3: PASS`.
- Generates a deterministic SHA-256 tree hash and Ed25519-signed certificate token.

### Level 2: Independent Maintainer Code Audit & GitOps Review
- Required for inclusion in the official registry (`data/registry.json`).
- Consortium maintainers review source repositories or compiled artifacts to ensure:
  1. No background socket transmissions serialize unmasked strings.
  2. Tab isolation and RAM scoping are strictly enforced.
  3. Latency benchmarks demonstrate sub-2ms median execution on standard hardware.
- Upon successful review, maintainers commit the entity record and issue an official Level 2 Conformance Certificate.

### Level 3: Air-Gapped Hardware Attestation & Enclave Validation
- Designed for high-assurance defense, financial, and clinical deployments.
- Code execution is bound to cryptographically verifiable enclaves (e.g., AWS Nitro Enclaves, Apple Silicon Secure Enclave) or strictly sandboxed WebAssembly runtimes with network access denied by sandbox boundary policies.
- Cryptographic attestation receipts verify hardware-rooted ephemeral isolation.

---

## 5. Cryptographic Certificate Specification

### 5.1. Token Format & Cryptographic Standard
All official ZTDS Conformance Certificates are minted as compact, deterministic tokens:
```
ZTDS-CERT-v1.{canonical_payload_b64url}.{ed25519_signature_b64url}
```

- **Algorithm:** Asymmetric Ed25519 (RFC 8032) via Edwards-curve Digital Signature Algorithm (EdDSA).
- **Signing Authority:** ZTDS AI Consortium Root Authority Key.
- **Verification:** Native Node.js `crypto.verify` or Web Crypto API without external network calls.
- **Canonicalization:** Keys sorted alphabetically across all nesting depths prior to signing.

### 5.2. Certificate Schema
```json
{
  "certificate_id": "ZTDS-CERT-2026-PRODUCTNAME-XXXXXX",
  "standard": "ZTDS RFC v1.0",
  "specification_url": "https://ztds.ai/standard/",
  "authority": "ZTDS AI Consortium & Standards Authority (BrandMeWeb Ecosystem)",
  "level": "Level 1: Automated CTS Invariant Conformance",
  "subject": {
    "applicant": "Legal Entity or Maintainer Name",
    "product": "Product or Library Identifier",
    "category": "Autonomous AI Software & Sanitization Node",
    "repository": "https://github.com/example/product",
    "audit_hash": "sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24",
    "scanned_files_count": 42
  },
  "invariants": {
    "invariant_1_zero_egress": "PASS",
    "invariant_2_reversible_tokens": "PASS",
    "invariant_3_in_memory_isolation": "PASS",
    "invariant_4_zero_subprocessors": "PASS"
  },
  "issued_at": "2026-09-26T12:00:00.000Z",
  "expires_at": "2027-09-26T12:00:00.000Z",
  "validity_days": 365,
  "registry_verification_url": "https://ztds.ai/registry/#productname",
  "badge_url": "https://ztds.ai/badge/productname.svg"
}
```

### 5.3. Third-Party CLI Verification Protocol
Any enterprise customer, auditor, or security researcher can independently verify certificate authenticity in air-gapped environments without network access:
```bash
npx ztds-verify ZTDS-CERT-v1.<payload>.<signature>
# Or verify from file:
npx ztds-verify --cert path/to/certificate.cert
```

---

## 6. Strict Revocation Policy & Enforcement Mechanism

The integrity and market trust of the ZTDS standard depend on immediate and transparent revocation when certified entities fail to preserve the 4 Invariants.

### 6.1. Grounds for Mandatory Revocation
A certificate shall be revoked immediately upon discovery of any of the following conditions:
1. **Cleartext Egress Breach (Invariant 1 Failure):** Any release or patch of the certified product transmits unmasked PII, PHI, or credentials across network interfaces.
2. **Persistence Leakage (Invariant 3 Failure):** Introduction of features that persist session token maps to `localStorage`, `IndexedDB`, cookies, or unencrypted disk partitions.
3. **Telemetry Introduction (Invariant 4 Failure):** Embedding third-party telemetry, tracking pixels, or data collection SDKs within the sanitization hot path.
4. **Audit Hash Fraud:** Falsification of codebase hashes, misrepresentation of scanned directories, or submitting mock repositories while deploying non-conformant production binaries.
5. **Deceptive Marketing:** Using the ZTDS Certified mark on uncertified cloud services, proxy networks, or third-party servers.

### 6.2. Revocation Procedure & Timelines
1. **Incident Triage & Vulnerability Notice:** Upon receiving a verified vulnerability report or automated test regression, the Consortium issues a formal **Notice of Non-Conformance (NNC)** to the maintainer.
2. **Emergency Revocation (Active Breach):** If an active PII leak or cleartext egress is confirmed in production, the certificate is revoked within **4 hours (0-day emergency action)** without cure period.
3. **Remediation Window (Non-Critical Regression):** For minor configuration defects not resulting in active cleartext egress, the maintainer has **7 calendar days** to patch the defect and submit a clean audit receipt.
4. **Certificate Revocation List (CRL) & Transparency Log:**
   - The certificate ID is marked as `REVOKED` in the public registry.
   - The revocation timestamp, cryptographic hash, and causal rationale are permanently committed to Git history.
5. **Dynamic Badge Invalidation:**
   - The dynamic SVG endpoint (`/api/badge.js` and `/badge/{slug}.svg`) automatically transforms the badge visual from green (`VERIFIED` / `#059669`) to dark red (`REVOKED` / `#dc2626`).

---

## 7. Trademark & Trust Badge Usage Rules

### 7.1. Permitted Uses
Entities possessing an active, unexpired, and unrevoked ZTDS Certificate are granted a non-exclusive, revocable license to:
1. Display the official ZTDS Verified Trust Badge on their website, pricing page, documentation, and source repository:
   ```markdown
   [![ZTDS Verified](https://ztds.ai/badge/your-product.svg)](https://ztds.ai/registry/)
   ```
2. State truthfully in commercial collateral: *"Certified compliant with the Zero-Trust Data Sanitization standard (ZTDS RFC v1.0)"*.
3. Include the cryptographic certificate ID in enterprise RFPs, SOC 2 Type II audit packages, and SIG Lite questionnaires.

### 7.2. Prohibited Uses & Infringement
1. **Calques and Imitations:** Modifying the SVG badge geometry, altering color tokens to mimic active status while revoked, or substituting generic calques like "Zero-Egress Certified".
2. **Scope Overreach:** Claiming that an entire cloud infrastructure is "ZTDS Certified" when only a local client plugin conforms to the standard.
3. **Uncertified Commercial Use:** Using the registered trademark **ZTDS™** in product names or domain names without prior written authorization from the ZTDS AI Consortium.

---

## 8. Limitation of Liability & Third-Party Defense Shield

1. **Independent Verification Limitation:** ZTDS certification evaluates software architecture and code artifacts against RFC v1.0 specifications at the time of audit. The ZTDS AI Consortium does not operate, host, or execute third-party software.
2. **No Guarantee of Error-Free Operation:** While the ZTDS standard enforces mathematical and empirical guarantees of in-memory isolation, the Consortium does not guarantee that third-party implementations are immune from OS-level exploits, host kernel compromises, physical RAM side-channel attacks (e.g., Rowhammer), or developer misconfigurations.
3. **Statutory Compliance Responsibility:** Compliance with global privacy statutes (GDPR, HIPAA, CCPA, EU AI Act) remains the exclusive legal responsibility of the Data Controller. ZTDS provides technical architectural primitives; overall regulatory posture depends on enterprise data governance.
4. **CAB Defense Shield:** To the maximum extent permitted by applicable law, neither the ZTDS AI Consortium, BrandMeWeb, nor its architects and fellows shall be liable for indirect, punitive, or consequential damages resulting from third-party implementation failures, breaches, or regulatory enforcement actions.

---

*Authored and ratifying on behalf of the ZTDS AI Consortium & Standards Authority:*  
**Ilya Sibiryakov**  
Founder & Chief Architect &middot; BrandMeWeb Ecosystem  
*Lead Author, ZTDS RFC v1.0 (ORCID: 0009-0002-0642-5985)*
