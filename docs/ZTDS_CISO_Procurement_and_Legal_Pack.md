# ZTDS.ai — CISO Procurement, Legal Defense & Enterprise Licensing Pack (2026 SSOT)

## 1. Official 1-Page CISO Data Protection & Exemption Memo

**MEMORANDUM**

**TO:** Chief Information Security Officer (CISO), Data Protection Officer (DPO), Enterprise Procurement  
**FROM:** Ilya Sibiryakov, Founder & Chief Architect (BrandMeWeb & PrivacyScrubber)  
**DATE:** 2026-09-16  
**SUBJECT:** Legal Basis for Zero-Trust Data Sanitization (ZTDS) Architecture & Exemption from Data Processor (DPA) Requirements  

---

### Executive Summary
This memorandum establishes the formal technical and regulatory basis under which software adhering to the Zero-Trust Data Sanitization (ZTDS v1.0) specification—including PrivacyScrubber Web, Chrome Extension, and the @privacyscrubber/sdk developer engine—operates as a 100% client-side computational utility. 

Because ZTDS executes de-identification and re-identification strictly within the volatile RAM of the user workstation or private internal host node, **zero bytes of cleartext sensitive data are transmitted to or processed by external vendor servers**. 

Consequently, ZTDS software is **legally exempt from Data Processing Agreement (DPA) requirements under GDPR Article 28, Business Associate Agreement (BAA) requirements under HIPAA, and third-party vendor risk assessment burdens**.

---

### Regulatory Defense & Legal Citations

#### 1. European Union GDPR (Regulation 2016/679) — Article 28 Exemption
- **Statutory Requirement:** Article 28(3) mandates a binding contract (DPA) whenever personal data is processed by a third party on behalf of the controller.
- **ZTDS Exemption Basis:** In a ZTDS architecture, the software provider maintains zero processing infrastructure, zero data ingress endpoints, and zero storage mechanisms. Cleartext data never leaves the client endpoint. The transformation occurs strictly in local host memory prior to network transmission. Under European Data Protection Board (EDPB) doctrine, the provision of local client software that does not transmit personal data to the vendor does not constitute "processing by a processor."
- **Conclusion:** No GDPR Data Processing Agreement (DPA) or Standard Contractual Clauses (SCCs) are required.

#### 2. GDPR Article 17 — Prevention of RAG Vector Poisoning
- **Statutory Requirement:** Article 17 grants data subjects the unconditional Right to Erasure ("Right to be Forgotten").
- **ZTDS Exemption Basis:** When cleartext PII is embedded into high-dimensional vector embeddings, the data cannot be isolated or deleted without full vector index re-computation. By substituting sensitive entities with surrogate tokens ([NAME_1], [SSN_1]) before embedding generation, vector databases are mathematically immunized against PII ingestion, ensuring permanent GDPR Art. 17 compliance.

#### 3. United States HIPAA (45 CFR § 164.514) — Safe Harbor Compliance
- **Statutory Requirement:** 45 CFR § 164.502(e) requires a Business Associate Agreement (BAA) when Protected Health Information (PHI) is disclosed to a vendor.
- **ZTDS Exemption Basis:** Under the Safe Harbor method (45 CFR § 164.514(b)), clinical text stripped of the 18 designated personal identifiers is legally classified as de-identified and ceases to be PHI. Because the de-identification occurs locally inside client RAM before transmission, the cloud AI provider receives only legally de-identified surrogate tokens. 
- **Conclusion:** No BAA is required with the ZTDS software provider or cloud AI endpoints for sanitized workflows.

#### 4. ISO/IEC 27001:2022 — Control A.8.11 (Data Masking)
- ZTDS directly satisfies Control A.8.11 ("Data masking shall be applied in accordance with the organization's topic-specific policy on access control...") by enforcing deterministic, contextual pseudonymization at the presentation layer.

---

## 2. Standard Security Questionnaire Answers (SIG Lite / CAIQ / VSAQ)

| Question / Control Domain | ZTDS Standard Response | Verification Evidence |
| :--- | :--- | :--- |
| **Where is customer prompt data hosted or stored?** | **Nowhere.** Cleartext data and session mappings reside strictly in volatile RAM. No data is written to disk, database, cookies, or cloud storage. | 5-Step Airplane Mode Audit (DevTools Network tab = 0 requests). |
| **What data egresses to vendor servers during sanitization?** | **Exactly 0.00 bytes.** The sanitization engine is completely self-contained in local JavaScript / WebAssembly. | Static code audit; browser network inspection; air-gapped test. |
| **How are session token maps protected?** | Scoped strictly to the active browser tab or memory process. Automatically wiped on tab reload or process exit. | Isolated RAM boundary; zero persistence to localStorage or IndexedDB. |
| **How does collaborative unmasking work across teams?** | Token maps are encrypted client-side using Argon2id (RFC 9106) and XChaCha20-Poly1305 (24-byte CSPRNG nonce). | Cryptographic source audit (libsodium-wrappers-sumo). |
| **Does the vendor have access to customer encryption keys?** | **No.** Keys are derived ephemeral passphrases held exclusively by authorized team members. | Zero-knowledge architecture; central relays act as blind conduits. |
| **What third-party sub-processors have access to customer data?** | **None.** Zero sub-processors are involved in data sanitization. | DPA exemption doctrine; self-contained engine. |

---

## 3. On-Premise Air-Gapped Enterprise Source Code License Agreement

*Licensing Model:* Custom Enterprise Quote / Annual Subscription (Custom Pricing via Inquiry).  
*Licensor:* Ilya Sibiryakov (Founder & Chief Architect).  

### Core Licensing Terms
1. **Grant of License:** Licensor grants Customer a non-exclusive, non-transferable, perpetual (for the term of the agreement) license to inspect, compile, and execute the ZTDS PII Engine source code strictly within Customer's internal, air-gapped networks, microservices, and private cloud VPCs.
2. **Permitted Use:** Customer may embed the engine into internal backend microservices, RAG pipelines, internal agentic loops, and employee workstations.
3. **Restrictions:** Customer shall not reverse engineer to sell a competing standalone PII sanitization SaaS, sublicense, distribute, or make the source code publicly available.
4. **Air-Gapped Operation:** Customer is authorized to deploy the engine in 100% disconnected, SCIF, or classified environments with zero telemetry or licensing heartbeats required.
5. **Warranty & Support:** Licensor provides annual regulatory regex updates, security patches, and direct architectural advisory.
