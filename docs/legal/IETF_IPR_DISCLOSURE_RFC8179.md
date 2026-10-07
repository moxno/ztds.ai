# Official IETF IPR Disclosure (RFC 8179 Compliant)

**SUBMISSION TO THE IETF SECRETARIAT (https://www.ietf.org/ipr/)**  
**Governing Standard**: RFC 8179 ("Intellectual Property Rights in IETF Technology")  
**Date of Statement**: October 2026  
**Document Referenced**: `draft-sibiryakov-ztds-protocol-02` (*The Zero-Trust Data Sanitization (ZTDS) Protocol for Frontier Artificial Intelligence Ingestion*)

---

## Section I: Contributing / Submitting Organization & Contact

* **Submitter Full Name**: Ilya Sibiryakov
* **Submitter Email**: `info@ztds.ai`
* **Submitter Legal Entity**: Sole Proprietorship (עוסק מורשה) under the laws of the State of Israel
* **Commercial Operations**: Founder & Chief Architect, BrandMeWeb / Lead Systems Architect, PrivacyScrubber
* **Standards Consortium Role**: Lead Author & Chief Architect, ZTDS AI Consortium (`https://ztds.ai`)
* **Address**: Ra'anana, Israel

---

## Section II: IETF Document Information

* **Document Type**: Internet-Draft
* **Title**: The Zero-Trust Data Sanitization (ZTDS) Protocol for Frontier Artificial Intelligence Ingestion
* **Draft String**: `draft-sibiryakov-ztds-protocol-02`
* **IETF DataTracker URI**: [https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
* **Relevant Sections**:
  - Section 4: Architecture Overview and Invariants
  - Section 5: The Four Core ZTDS Invariants (Normative Requirements)
  - Section 6: Surrogate Token Syntax and Notation
  - Section 7: Ephemeral Session Key Cryptographic Transport Protocol

---

## Section III: Patent Application Information

* **Patent Owner / Applicant**: Ilya Sibiryakov (Sole Proprietor)
* **Country of Application**: State of Israel (Israel Patent Office / ILPO)
* **Application Number**: **IL 331905** (Internal Filing Order: 94221)
* **Filing Date**: **14 September 2026 (14/09/2026)**
* **WIPO Digital Access Service (DAS) Access Code**: **`B17B`**
* **Title of Invention**: *Zero-Trust Data Sanitization Method, System, Apparatus, and Computer-Readable Medium for Deterministic In-RAM Privacy Preservation in Artificial Intelligence and Distributed Workflows*
* **Convention Priority**: Paris Convention Article 4 (12-month international priority locked through **14 September 2027**)
* **Anticipated PCT Filing**: Patent Cooperation Treaty (PCT) application claiming priority from IL 331905 via WIPO DAS code `B17B` before 14/09/2027.

---

## Section IV: Claim Boundary & Technical Scope

The claims in Israeli Patent Application IL 331905 (and future PCT national entries) that pertain to the implementation of `draft-sibiryakov-ztds-protocol-02` encompass:

1. **System and Method for In-Memory Sanitization (Claims 1–4)**: Intercepting cleartext payloads within an isolated host volatile memory buffer (RAM sandbox), executing a single-pass deterministic finite automaton ($O(N)$), substituting sensitive substrings with synthetic surrogate tokens sorted in descending offset order, and restricting outbound serialization to sanitized surrogate payloads ($0$ bytes cleartext egress).
2. **Deterministic Bijective Token Mapping (Claims 5–7)**: Managing an ephemeral mapping table ($M_s$) linking typed surrogate tokens (`[TYPE_N]`) to cleartext originals strictly in volatile memory, preventing disk persistence, and rehydrating incoming model responses via local RAM reverse detokenization.
3. **Hardware-Isolated Cryptographic Handoff (Claims 8–12)**: Cryptographic state encapsulation and inter-node session transfer utilizing authenticated encryption (XChaCha20-Poly1305 with Argon2id key derivation) and isolated virtual communication channels (`AF_VSOCK`) terminating in confidential hardware enclaves.

---

## Section V: Licensing Declaration (RFC 8179 Section 5.4 Option)

The Patent Owner hereby grants the following licensing commitment with respect to any patent claims owned or controlled by the Patent Owner that would be infringed by making, using, selling, offering to sell, or importing a compliant implementation of the normative portions of the IETF Standard:

### **Pledge: Royalty-Free for Standards-Compliant Open-Source Implementations / Reciprocal RAND for Commercial Systems (RFC 8179 Section 5.4(a) / (c))**

1. **Royalty-Free Open-Source Grant**:  
   The Patent Owner commits that a license will be made available on a royalty-free basis to any person or entity for the purpose of making, implementing, using, and distributing software implementations that strictly conform to the normative specifications of `draft-sibiryakov-ztds-protocol` (and any resulting RFC), provided that:
   - The implementation is distributed under an OSI-approved open-source license;
   - The licensee does not initiate patent litigation or assert patent infringement claims against the Patent Owner, BrandMeWeb, or other conformant implementers regarding ZTDS technology (Reciprocity / Defensive Termination Clause).

2. **Reasonable and Non-Discriminatory (RAND) Terms for Commercial Proprietary Additions**:  
   For proprietary, commercial closed-source implementations or hardware integrations that extend beyond the open specification, the Patent Owner is prepared to grant non-exclusive licenses on Fair, Reasonable, and Non-Discriminatory (FRAND) terms.

3. **Reservation of Rights on Commercial Brand & Verification Marks**:  
   This IPR disclosure pertains exclusively to patent claims under IL 331905 and does not grant any license, express or implied, to the registered word marks **ZTDS™** or **ZTDS VERIFIED™**, nor to commercial software source code of **PrivacyScrubber**. Use of the certification marks is subject to formal conformity assessment under consortium rules.

---

## Section VI: Sign-off & Verification

* **Declarant**: Ilya Sibiryakov
* **Title**: Principal Inventor & Sole Applicant
* **Filing Channel**: Automated IETF IPR Online Submission Portal (`https://datatracker.ietf.org/ipr/submit/`)
