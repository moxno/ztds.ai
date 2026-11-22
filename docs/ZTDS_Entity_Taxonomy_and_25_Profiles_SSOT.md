# ZTDS Entity Taxonomy and 30 Specialized Industry Profiles (SSOT)

## 1. Executive Summary & Architectural Separation

The Zero-Trust Data Sanitization (ZTDS) standard establishes a strict, mathematically verifiable entity classification hierarchy. To prevent data leakage while preserving AI model cognitive context and reasoning capability, entity detection is decoupled into two distinct operational layers:

1. **Universal Consumer PII (Baseline Layer)**: The foundational baseline covering ubiquitous human identifiers (names, emails, phone numbers, standard national IDs, IPv4/IPv6, file paths, physical addresses).
2. **30 Specialized Industry Profiles (Vertical Layer)**: Specialized vertical vocabularies, regulatory codes, enterprise credentials, and domain-specific schemas covering 30 regulated business sectors.

---

## 2. Two-Tier Classification Governance (SSOT)

The structural separation between the Universal Consumer PII Layer and the 30 Specialized Industry Profiles ensures high-precision contextual tokenization without cross-domain false positives:

* **Baseline Scope**: Universal consumer identifiers are evaluated across all workloads as the foundational privacy perimeter.
* **Vertical Isolation**: Domain-specific identifiers, regulatory reference numbers, ticket formats, cloud infrastructure secrets, and vertical financial terms are scoped to their respective industry profiles (`[PHI_1]`, `[LEGAL_1]`, `[SECRET_1]`, `[FINANCIAL_1]`).
* **Semantic Preservation**: Scoping vertical patterns to dedicated sector profiles prevents over-redaction of domain terminology while guaranteeing deterministic protection for regulated workflows.

---

## 3. Universal Consumer PII Taxonomy (Baseline Layer)

The Universal Consumer PII layer operates across conforming profiles as the baseline filter:

| Entity Type | Black-Box Scope | Token Format | Normalization Guarantee |
| :--- | :--- | :--- | :--- |
| **`EMAIL`** | Electronic mail addresses | `[EMAIL_N]` | Preserves non-identifying prose context |
| **`PHONE`** | Domestic and international telephone numbers | `[PHONE_N]` | Format- and punctuation-agnostic matching |
| **`ID`** | Government tax, passport, license, and national IDs | `[ID_N]` | Protects full and partially masked identifiers |
| **`NAME`** | Personal names across common honorific and payroll forms | `[NAME_N]` | Unicode-safe boundary preservation |
| **`ADDRESS`** | Physical street and postal delivery locations | `[ADDRESS_N]` | Multi-line mailing block integrity |
| **`IP`** | Public and private network host addresses | `[IP_N]` | Separates network ports from host addresses |
| **`LOCATION`** | Geographic coordinates and identifying locality pairs | `[LOCATION_N]` | Retains broad non-identifying regional context |
| **`DATE`** | Dates of birth and person-linked calendar milestones | `[DATE_N]` | Excludes static statutory publication dates |
| **`FINANCIAL`** | Payment cards, settlement accounts, and wallet addresses | `[FINANCIAL_N]` | Preserves monetary structure via safe surrogates |

---

## 4. The 30 Specialized Industry Profiles (Black-Box Vertical Specifications)

Conforming commercial distributions expose 30 domain-scoped vertical profiles evaluated strictly by inputs, surrogate outputs, and statutory alignment:

### 4.1. Legal (`legal`)
* **Target Personas**: Law firm partners, general counsel, litigation support, paralegals.
* **Regulatory Scope**: Federal Rules of Evidence Rule 502, ABA Model Rule 1.6, attorney-client privilege & work-product preservation.
* **Protected Domain Categories**: Litigation party names linked to formal legal roles, civil/criminal docket and matter identifiers, Bates production stamps, bar admission numbers, and trust/escrow settlement disclosures.

### 4.2. Human Resources & Recruiting (`hr`)
* **Target Personas**: VP of People, HR Directors, Talent Acquisition, Recruiters.
* **Regulatory Scope**: GDPR Article 9 special category employment records, EEOC confidentiality, local labor privacy mandates.
* **Protected Domain Categories**: Applicant and employee identifiers, internal HRIS and ATS record IDs, workplace dispute or works-council tracking references, and personal employment-authorization numbers.

### 4.3. Finance & Banking (`finance`)
* **Target Personas**: CFOs, Investment Bankers, Quantitative Analysts, FinTech Engineers.
* **Regulatory Scope**: PCI-DSS, GLBA Safeguards Rule, SWIFT CSP, SEC/FINRA market recordkeeping.
* **Protected Domain Categories**: Cross-border bank routing and IBAN coordinates, standardized global security identifiers (CUSIP/ISIN/SEDOL/LEI), brokerage/custodial account numbers, and transaction-bound monetary figures.

### 4.4. Medical & Healthcare (`medical`)
* **Target Personas**: Chief Medical Information Officers (CMIO), Clinical Researchers, EHR Admins.
* **Regulatory Scope**: HIPAA Safe Harbor 45 CFR § 164.514(b), HITECH Act, GDPR Article 9 health data protection.
* **Protected Domain Categories**: Patient and provider identities across free-text notes and clinical interoperability payloads, medical record numbers, beneficiary policy codes, regulated prescriber identifiers, medical device serials, and room/encounter references.

### 4.5. DevSecOps & Security (`security`)
* **Target Personas**: CISOs, SOC Managers, Penetration Testers, Incident Response Leads.
* **Regulatory Scope**: SOC 2 Type II confidentiality criteria, ISO 27001, NIS2 incident handling.
* **Protected Domain Categories**: Cryptographic private keys and platform bearer tokens, confidential incident and breach tracking numbers, internal detection policies, and proprietary IOC artifacts.

### 4.6. Software Development (`dev`)
* **Target Personas**: Software Architects, Full-Stack Engineers, DevOps Engineers.
* **Regulatory Scope**: OWASP LLM02:2025 Sensitive Information Disclosure, pre-commit secret hygiene.
* **Protected Domain Categories**: Frontier AI and cloud API credentials, internal private-subnet endpoints and ports, webhook signing secrets, and credential-bearing database connection strings.

### 4.7. Marketing & AdTech (`marketing`)
* **Target Personas**: CMOs, Growth Hackers, Performance Marketing Leads.
* **Regulatory Scope**: ePrivacy Directive, GDPR Consent Mode, CCPA behavioral tracking limits.
* **Protected Domain Categories**: Click and session attribution tokens, analytics client and measurement identifiers, CRM/automation contact IDs, and internal customer-acquisition financial metrics.

### 4.8. Business Operations & M&A (`bizops`)
* **Target Personas**: COOs, VPs of Strategy, Private Equity Associates, Corporate Development.
* **Regulatory Scope**: SEC Regulation FD, MNPI confidentiality, corporate fiduciary non-disclosure.
* **Protected Domain Categories**: Corporate registry identifiers, virtual data room and deal-room tracking numbers, cap-table/equity grant records, and non-public M&A financial KPIs.

### 4.9. Sales & Revenue Operations (`sales`)
* **Target Personas**: CROs, VPs of Sales, RevOps Managers, Account Executives.
* **Regulatory Scope**: B2B commercial confidentiality, enterprise procurement privacy.
* **Protected Domain Categories**: CRM opportunity and account object IDs, e-signature envelope and MSA contract references, recorded call-intelligence IDs, and rep-level commercial pipeline values.

### 4.10. Customer Support & Care (`support`)
* **Target Personas**: VPs of Customer Experience, Tier 3 Support Leads, Contact Center Managers.
* **Regulatory Scope**: GDPR Art. 5 data minimization, SOC 2 customer data isolation.
* **Protected Domain Categories**: Helpdesk incident and service-request tickets, return merchandise and refund tracking numbers, respondent feedback tokens, and customer loyalty account IDs.

### 4.11. Real Estate & Title (`realestate`)
* **Target Personas**: Title Agents, Real Estate Brokers, Escrow Officers, Underwriters.
* **Regulatory Scope**: GLBA title/escrow safeguards, CFPB TRID borrower confidentiality.
* **Protected Domain Categories**: Property parcel and MLS listing identifiers, escrow closing and mortgage insurance file numbers, tenant/lease credentials, and transaction price disclosures.

### 4.12. Regulatory Compliance & GRC (`compliance`)
* **Target Personas**: Chief Compliance Officers, DPOs, Audit Managers, Risk Officers.
* **Regulatory Scope**: GDPR Art. 15/28/32, EU AI Act Art. 10, NIST SP 800-53, FedRAMP.
* **Protected Domain Categories**: Data subject access/erasure request dockets, international VAT and supervisory authority registration numbers, and internal governance or audit tracking codes.

### 4.13. California Privacy / CCPA (`ccpa`)
* **Target Personas**: California Privacy Officers, Consumer Rights Managers.
* **Regulatory Scope**: California Consumer Privacy Act (CCPA) & CPRA statutory categories.
* **Protected Domain Categories**: California state identification numbers, opt-out and consumer-request tracking tokens, biometric template digests, and precise California geolocation coordinates.

### 4.14. Cloud Infrastructure Engineering (`engineering`)
* **Target Personas**: Cloud Engineers, SREs, Kubernetes Operators.
* **Regulatory Scope**: Cloud topology protection, zero-disclosure infrastructure posture.
* **Protected Domain Categories**: Container digests and internal cluster DNS topologies, cloud IAM resource ARNs and tenant paths, commit provenance hashes, and private repository locations.

### 4.15. Autonomous AI Agents (`agents`)
* **Target Personas**: AI Engineers, LLM Pipeline Developers, Agent Framework Builders.
* **Regulatory Scope**: Agentic telemetry isolation, RAG memory tenant separation.
* **Protected Domain Categories**: Model platform assistant/run/vector-store handles, vector database namespace identifiers, and hosted model-hub access credentials.

### 4.16. Academic & Research (`academic`)
* **Target Personas**: University Registrars, Institutional Review Board (IRB) Chairs, Grant PIs.
* **Regulatory Scope**: FERPA student privacy, NIH/IRB human-subjects confidentiality.
* **Protected Domain Categories**: IRB protocol and student/alumni identifiers, researcher ORCID handles linked to non-public review dossiers, and protected academic transcript records.

### 4.17. Creative & Entertainment (`creative`)
* **Target Personas**: Entertainment Lawyers, Production Executives, Talent Agents.
* **Regulatory Scope**: Pre-release IP embargo, guild & royalty accounting confidentiality.
* **Protected Domain Categories**: Guild registrations and talent release numbers, standard audio/visual royalty and publishing codes, and embargoed production accounting identifiers.

### 4.18. Core Technology & IT (`tech`)
* **Target Personas**: IT Directors, Systems Administrators, Cloud Admins.
* **Regulatory Scope**: Enterprise asset confidentiality, SOC 2 IT general controls.
* **Protected Domain Categories**: Cloud compute instance, VPC, subnet, and security-group identifiers, multi-cloud tenant GUIDs, and infrastructure-state tracking tokens.

### 4.19. Personal & Executive Protection (`personal`)
* **Target Personas**: Family Offices, High-Net-Worth Individuals, Executive Assistants.
* **Regulatory Scope**: Executive threat-surface minimization, household physical/travel security.
* **Protected Domain Categories**: Kinship-linked family and household emergency contacts, personal device/access passcodes, passport details, and private travel loyalty accounts.

### 4.20. Wealth Management & Family Office (`wealthmgmt`)
* **Target Personas**: Private Wealth Managers, Estate Planning Attorneys, Family Office Principals.
* **Regulatory Scope**: SEC Advisers Act fiduciary privacy, FINRA Rule 4512, Regulation S-P.
* **Protected Domain Categories**: Named trust entities and estate instruments, advisory/broker license references, tax-advantaged custodial accounts, and client net-worth/AUM disclosures.

### 4.21. Insurance & Risk Management (`insurance`)
* **Target Personas**: Underwriters, Claims Adjusters, Actuaries.
* **Regulatory Scope**: NAIC Insurance Data Security Model Law, GLBA, HIPAA (health plans).
* **Protected Domain Categories**: Policy, binder, and claim dossier numbers, carrier regulatory codes, insured vehicle/asset identifiers, and reserve or settlement valuations.

### 4.22. Accounting & Tax Preparation (`accounting`)
* **Target Personas**: CPAs, Tax Preparers, Corporate Controllers.
* **Regulatory Scope**: IRS Publication 4557, IRC § 7216 taxpayer confidentiality, SOX financial controls.
* **Protected Domain Categories**: Tax return and information-filing identifiers, licensed preparer/electronic-filer numbers, general-ledger and invoice codes, and taxpayer income or refund figures.

### 4.23. Pharmaceuticals & Life Sciences (`pharma`)
* **Target Personas**: Clinical Data Managers, Bio-statisticians, Regulatory Affairs Specialists.
* **Regulatory Scope**: 21 CFR Part 11, GDPR clinical trial blinding, EMA Policy 0070.
* **Protected Domain Categories**: Registered trial and regulatory submission IDs, blinded subject randomization codes, medication kit serials, and pharmacovigilance adverse-event reports.

### 4.24. Underwriting & Mortgage Underwriting (`underwriting`)
* **Target Personas**: Mortgage Underwriters, Credit Analysts, Loan Processors.
* **Regulatory Scope**: GLBA, Fair Credit Reporting Act (FCRA), agency underwriting security.
* **Protected Domain Categories**: Wage and tax-statement employer/employee blocks, loan origination and agency underwriting dossier numbers, and payroll verification instruments.

### 4.25. Automotive & Telematics (`automotive`)
* **Target Personas**: Fleet Managers, Connected Vehicle Engineers, Telematics Analysts, EV Infrastructure Operators.
* **Regulatory Scope**: UNECE R155 connected-vehicle cybersecurity, GDPR location/telematics privacy.
* **Protected Domain Categories**: Vehicle identification numbers and registration plates, embedded controller and diagnostic fault codes, charging infrastructure session IDs, and driver telemetry logs.

### 4.26. Energy & Utilities (`energy`)
* **Target Personas**: SCADA Operators, Substation Engineers, Grid Dispatchers, NERC CIP Compliance Leads.
* **Regulatory Scope**: NERC CIP critical cyber asset protection, Critical Infrastructure Security.
* **Protected Domain Categories**: Smart meter and substation asset identifiers, industrial telemetry control tags and hardware serials, and grid switching or compliance facility codes.

### 4.27. Hospitality & Travel (`hospitality`)
* **Target Personas**: Hotel Revenue Managers, Front Desk Leads, Passenger Services, Travel Counselors.
* **Regulatory Scope**: EU PNR Directive, PCI-DSS hospitality cardholder protection, GDPR travel privacy.
* **Protected Domain Categories**: Passenger name records and airline e-tickets, reservation folios and electronic room-access tokens, and traveler loyalty membership identifiers.

### 4.28. Biotechnology & Genomics (`biotech`)
* **Target Personas**: Bioinformaticians, Molecular Biologists, Genomic Research PIs, Biobank Curators.
* **Regulatory Scope**: GINA genetic privacy, GDPR Art. 9 genetic/biometric protection, HIPAA Safe Harbor.
* **Protected Domain Categories**: Rare-disease ontology codes linked to individuals, biobank specimen/aliquot tracking barcodes, and sequencing instrument run identifiers tied to donor cohorts.

### 4.29. Telecommunications & Contact Centers (`telecom`)
* **Target Personas**: Telecom Network Engineers, Contact Center Directors, VoIP Architects, CDR Analysts.
* **Regulatory Scope**: FCC Customer Proprietary Network Information (CPNI), ePrivacy Directive, PCI-DSS IVR scoping.
* **Protected Domain Categories**: Mobile subscriber and hardware device identifiers, cellular tower/sector topology codes, VoIP session URIs and interaction records, and call-detail network session IDs.

### 4.30. General / Universal Baseline (`general`)
* **Target Personas**: Individual users, general-purpose AI prompt sanitization.
* **Regulatory Scope**: Universal baseline PII protection under GDPR Art. 32 / Israel PPL Sec. 17.
* **Protected Domain Categories**: Applies the universal consumer PII baseline layer with standard quota boundaries.

### 4.31. Crypto Forensics, Web3 AML & Evidentiary Investigations (`crypto_forensics`)
* **Target Personas**: Crypto AML Officers, Blockchain Forensic Analysts, Financial Intelligence Units (FIU), Risk Managers, Fraud Investigators, Sanctions Compliance Officers.
* **Regulatory Scope**: BSA 31 U.S.C. § 5318(g)(2) SAR non-disclosure, FRE 901/902/502, OFAC sanctions screening, EU AMLR/MiCA Travel Rule.
* **Protected Domain Categories**: Multi-chain public wallet/contract addresses, transaction digests and UTXO/signature links, proprietary forensic intelligence cluster attributions, mixer/bridge hop labels, statutory AML filing numbers, and sanctions watchlist match identifiers.

---

## 5. Black-Box Output & Context Preservation Invariants

Conforming ZTDS implementations are evaluated strictly as deterministic black-box appliances by their external inputs, sanitized outputs, and cryptographic compliance receipts across all 30 specialized industry profiles:

### 5.1. Atomic Financial & Numeric Tokenization
Monetary values, currency indicators, and magnitude suffixes are tokenized atomically as unified financial surrogates (`[FINANCIAL_N]`) so that neither currency denominations nor raw transaction figures leak in cleartext.

### 5.2. Structural Role & Domain Terminology Preservation
To preserve downstream LLM reasoning accuracy without leaking personal identities, conforming engines retain structural role titles (such as clinical, legal, or organizational titles) and statutory domain terminology in cleartext while replacing only the identifying personal or corporate entity with a typed surrogate token (`[NAME_N]`, `[ORG_N]`).

### 5.3. Zero False-Positive Prose Guarantee
Domain-scoped identifiers (such as legal dockets, clinical records, and enterprise support tickets) are evaluated under strict contextual isolation so that ordinary English prose and technical documentation are never over-redacted.

### 5.4. Multimodal & Document Stream Normalization
When processing scanned documents or multi-format enterprise records in volatile memory, conforming engines normalize character encoding variations locally prior to entity evaluation to maintain zero-egress guarantees across noisy inputs.

### 5.5. Blockchain Graph Correlation & Temporal Clamping (Anti-Reidentification Invariants)
In crypto-forensics and AML graph investigations, masking only public addresses is structurally insufficient against ledger triangulation:
* **Invariant 5.5.1: Amount Quantization**: High-precision token transfer values are tokenized into discrete surrogates (`[TX_VALUE_1]`) or order-of-magnitude intervals (`[RANGE_10_TO_50_ETH]`).
* **Invariant 5.5.2: Temporal Clamping**: Exact block timestamps and heights are clamped to chronological windows (`[EPOCH_INTERVAL_4]`) to prevent block-sequence correlation.
* **Invariant 5.5.3: DAG Topology Preservation**: Multi-input transaction clusters assign deterministic coreference surrogates (`[HOP_1]`, `[HOP_2]`) within the active session, preserving directed acyclic graph (DAG) structure for AI reasoning while zeroizing underlying public key hashes.

---

## 6. Two-Sided Verification Invariants

Every sanitization profile must strictly satisfy two bidirectional mathematical conditions:

$$\text{Leakage}(T_{\text{sanitized}}) = 0 \quad \land \quad \text{Distortion}(T_{\text{revealed}}, T_{\text{original}}) = 0$$

1. **Zero Cleartext Leakage (Side A)**:
   * Not a single byte of sensitive PII, PHI, or credential strings may remain in $T_{\text{sanitized}}$.
   * All extracted tokens must conform to `[TYPE_N]` formatting.
2. **Context & Semantic Integrity (Side B)**:
   * Jargon, clinical diagnoses, statutory legal citations, and role frameworks must NOT be redacted.
   * On reverse reveal ($T_{\text{revealed}}$), replacing `[TYPE_N]` tokens with values from the volatile in-memory token map must yield the exact original text with zero whitespace or grammatical drift.

---

## 7. Conformance Packaging & Offline Cryptographic Licensing

Conforming commercial distributions of the 30 Specialized Industry Profiles enforce strict offline verification:

1. **Layer 1: Baseline Consumer PII Engine**:
   - Universal consumer PII detection (email, phone, standard national IDs, credit cards, IP addresses) operates locally in host process memory with zero external dependencies.

2. **Layer 2: 30 Specialized Vertical Profiles**:
   - The 30 Specialized Industry Profiles execute deterministically in isolated local memory across browser, IDE (MCP stdio), and backend microservice runtimes.
   - Commercial tier entitlements are authenticated via asymmetric Ed25519 cryptographic license tokens (`ZTDS-LIC-v1`).
   - License verification executes 100% offline in volatile RAM without network callbacks, preserving the 0.00 B Egress Invariant.
