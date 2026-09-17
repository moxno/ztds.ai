# ZTDS Enterprise Legal & Procurement Playbook

**INTERNAL STRATEGIC GUIDE FOR ILYA SIBIRYAKOV (CHIEF ARCHITECT & FOUNDER)**  
*Confidential & Proprietary &middot; BrandMeWeb Ecosystem*

---

## 1. Executive Summary & Suite Architecture

Enterprise deals with Annual Contract Value (ACV) between $10,000 and $50,000+ require navigating enterprise procurement, legal redlines, and InfoSec Vendor Risk Assessments (VRA). 

This suite provides the four foundational contracts to close enterprise sales efficiently without sacrificing intellectual property, taking on unlimited liability, or allowing proprietary algorithms to be open-sourced:

| File | Purpose | When to Send |
| :--- | :--- | :--- |
| **`MUTUAL_NDA_TEMPLATE.md`** | Two-way non-disclosure agreement | Before technical architecture deep-dive or demo. |
| **`ENTERPRISE_ORDER_FORM_TEMPLATE.md`** | Commercial terms, node count, price | Sent as the primary commercial signature document. |
| **`ENTERPRISE_MASTER_SERVICES_AGREEMENT_MSA.md`** | Master terms, IP defense, liability cap | Attached to Order Form (Schedule A). |
| **`AIR_GAPPED_ENTERPRISE_EULA.md`** | License for SCIF, Nitro Enclave, VPC nodes | Attached when customer deploys on-premise or offline. |

---

## 2. The 10 Most Common Enterprise Redlines & Exact Counter-Clauses

### Redline 1: "Customer requires an uncapped liability limit for data breaches."
* **Customer Legal Argument:** "If your software fails to sanitize PII and we get fined by GDPR/HIPAA, you must cover the full cost."
* **The Trap:** Agreeing to uncapped liability turns your company into an unpaid cyber-insurance policy. A single breach could trigger millions in claims.
* **Our Response:** 
  > "ZTDS operates as a localized computational utility within your host RAM. We do not store, host, or transmit your data to our servers. Because we have zero custody over your data, our liability is strictly limited to mutual aggregate fees paid in the prior 12 months, consistent with standard enterprise software licensing (e.g., Snowflake, HashiCorp, Datadog)."
* **Fallback Position:** Offer a "super-cap" equal to 2x or 3x annual fees paid specifically for material breach of Invariant 1, but NEVER uncapped.

---

### Redline 2: "Customer requires Licensor to sign our standard 35-page Data Processing Agreement (DPA)."
* **Customer Legal Argument:** "Our procurement policy mandates a DPA with all software vendors under GDPR Article 28."
* **The Trap:** Signing a DPA admits that you are a "Data Processor", subjecting you to subprocessor audit burdens, breach notification timelines, and EU regulatory liability.
* **Our Response:**
  > "Under European Data Protection Board (EDPB) doctrine and GDPR Article 28, a DPA is only legally applicable when personal data is processed by a third party on behalf of the controller. Because ZTDS is executed locally inside client volatile RAM with 0.00 bytes transmitted to vendor infrastructure, Licensor never processes personal data. ZTDS is legally exempt from DPA requirements as an endpoint utility."
* **Reference:** Provide the CISO DPA Exemption Memo (`/ciso/` or `ZTDS_CISO_Procurement_and_Legal_Pack.md`).

---

### Redline 3: "Customer demands source code escrow or full source code access."
* **Customer Legal Argument:** "We cannot rely on an external vendor for critical AI security without business continuity source escrow."
* **The Trap:** Leaking the core proprietary regex heuristics, 25 specialized profiles, or token mapping algorithms destroys the commercial moat.
* **Our Response:**
  > "Source code inspection is available exclusively under our Tier C Global Enterprise Site License ($50,000/yr) under strict air-gapped non-compete terms. For standard deployments, the compiled WebAssembly and Docker containers operate 100% offline with no external dependencies, ensuring complete business continuity even if vendor communication is interrupted."

---

### Redline 4: "Customer requires physical on-site audit rights of vendor facilities."
* **Customer Legal Argument:** "Our compliance framework requires annual on-site inspections of vendor data centers."
* **The Trap:** We do not operate a multi-tenant SaaS data center for sanitization; agreeing to physical audits creates unmanageable logistical friction.
* **Our Response:**
  > "Because Licensor does not host or store Customer Data, physical facility audits are not applicable. In lieu of on-site audits, Licensor provides annual cryptographic SHA-256 test receipts (`npx ztds-audit`) and an executive attestation letter for Customer's AICPA SOC 2 audit team." (Enforced in Section 4 of `AIR_GAPPED_ENTERPRISE_EULA.md`).

---

### Redline 5: "Customer requires a Business Associate Agreement (BAA) under HIPAA."
* **Customer Legal Argument:** "Our hospital or health-tech app processes Protected Health Information (PHI)."
* **The Trap:** Signing a BAA creates direct statutory liability under US HHS for medical data breaches.
* **Our Response:**
  > "Under 45 CFR § 164.514(b) (HIPAA Safe Harbor), clinical text stripped of the 18 designated personal identifiers is legally classified as de-identified and ceases to be PHI. Because de-identification occurs locally inside customer memory prior to network dispatch, neither Licensor nor the upstream LLM receives PHI. Therefore, no BAA is required."

---

### Redline 6: "Customer wants perpetual, irrevocable rights with no annual renewal."
* **Customer Legal Argument:** "We cannot have our production AI microservices stop running if an annual PO is delayed."
* **The Trap:** Perpetual rights eliminate recurring annual revenue (MRR/ARR).
* **Our Response:**
  > "Licenses are term-based annual subscriptions. However, to prevent operational disruption, we include a 60-day renewal grace period during which offline licenses remain valid while annual renewal invoices are processed by Accounts Payable."

---

### Redline 7: "Customer wants full indemnification against any regulatory fines (GDPR, EU AI Act, FTC)."
* **Customer Legal Argument:** "If a regulator investigates our AI system, you must defend and indemnify us."
* **The Trap:** Fines under the EU AI Act can reach €35M or 7% of global turnover; no software vendor can indemnify against customer's statutory fines.
* **Our Response:**
  > "Licensor provides full indemnification against third-party intellectual property infringement (patents, copyrights, trade secrets). However, statutory compliance with privacy laws remains the legal responsibility of the Data Controller. ZTDS provides the technical primitives, but overall compliance depends on customer's enterprise data governance."

---

### Redline 8: "Customer wants governing law set to their home state (e.g., California, New York, Texas)."
* **Standard Policy:** Default is **State of Delaware** (universal neutral ground for US enterprise contracts) or **State of Israel** (for EMEA contracts).
* **Acceptable Concessions:** 
  - Agree to State of New York or State of Delaware if requested by US Fortune 500 companies.
  - Agree to English law (England & Wales) for UK/EU corporate clients.
  - NEVER accept California (plaintiff-friendly jury laws and unpredictable statutory damages).

---

### Redline 9: "Customer demands Net 60 or Net 90 payment terms."
* **Standard Policy:** Net 30 days.
* **Acceptable Concessions:**
  - Net 45 is acceptable for Fortune 500 enterprises with fixed AP batch cycles, provided the subscription term is multi-year or billed annually in advance.
  - Reject Net 90 unless a 5% administrative surcharge is added to the contract price.

---

### Redline 10: "Customer wants an express warranty that no PII will ever pass through undetected."
* **Customer Legal Argument:** "We need a guarantee that your engine catches 100% of all PII."
* **The Trap:** In natural language processing, absolute 100% zero false negatives across unstructured text is statistically impossible without over-blocking context.
* **Our Response:**
  > "Licensor warrants that the Software enforces Invariant 1 (zero network egress prior to sanitization) and substantially conforms to the documented regex entity profiles. No software vendor can warrant 100% zero-shot classification across infinite unstructured human language variants. The engine provides mathematical context preservation and multi-pass filtering, but does not warrant unconstrained language perfection."

---

## 3. Deal Closing Checklist & Step-by-Step Flow

```
[Inbound Inquiry / Outbound Outreach]
                 |
                 v
      [1. Execute Mutual NDA]  <--- docs/legal/MUTUAL_NDA_TEMPLATE.md
                 |
                 v
   [2. Technical Demo & CISO Review]
   - Live Airplane Mode audit
   - CISO Risk & ROI Calculator (/roi/)
   - SOC 2 Trust Center (/soc2/)
                 |
                 v
   [3. Send Order Form + MSA]  <--- docs/legal/ENTERPRISE_ORDER_FORM_TEMPLATE.md
   - Pre-select Tier ($12K Air-Gapped) <--- docs/legal/ENTERPRISE_MASTER_SERVICES_AGREEMENT_MSA.md
   - Include Air-Gapped EULA     <--- docs/legal/AIR_GAPPED_ENTERPRISE_EULA.md
                 |
                 v
   [4. Procurement & Legal Review]
   - Use Section 2 of this Guide for Redlines
                 |
                 v
      [5. Signature & Invoice]
   - Send Net 30 Invoice
                 |
                 v
   [6. Offline License Delivery]
   - Issue PGP-signed Ed25519 license key
   - Deliver private container registry access / signed tarball
```
