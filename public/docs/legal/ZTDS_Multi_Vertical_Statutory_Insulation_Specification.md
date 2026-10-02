# ZTDS Multi-Vertical Statutory Insulation & Non-Reliance Specification (2026 SSOT)

## 1. Executive Doctrine & Scope of Demarcation

This Specification establishes the definitive normative framework governing statutory non-reliance, risk allocation, and regulatory liability demarcation across nine specialized industry verticals for:
1. **The ZTDS Standard & Consortium (`ztds.ai`)**: As an independent, vendor-neutral open technical specification maintainer, RFC author, and mathematical conformance authority.
2. **Reference Implementations (including PrivacyScrubber / `privacyscrubber.com`)**: As endpoint-executed computational software utilities operating strictly within local volatile random-access memory (RAM).
3. **Data Controllers & Enterprise Licensees**: As the sole statutory custodians exercising ultimate operational discretion over the transmission of tokenized outputs to third-party artificial intelligence platforms (such as OpenAI, Anthropic, Google, Microsoft, or open-weight hosting clusters).

---

## 2. Core Legal Presumptions & Three-Tier Shield Doctrine

All interactions across the ZTDS ecosystem are governed by three irrebuttable legal presumptions:

### 2.1 The Computational Utility Presumption (No Custodial Status)
Neither the ZTDS standard nor conforming software implementations act as a data processor, subprocessor, custodian, bailee, or escrow agent. Because processing executes 100% locally within the client workstation CPU/RAM with zero server-side egress ($\Delta \text{Egress} = 0.00$), software maintainers never obtain possession, custody, or control of raw customer inputs under Rule 34 of the Federal Rules of Civil Procedure (FRCP) or Article 4(8) of the EU GDPR.

### 2.2 The Downstream Transmission Presumption (Independent Act of Egress)
The mathematical substitution of sensitive entities with deterministic surrogate tokens (e.g., `[NAME_1]`, `[IBAN_2]`) terminates at the local memory boundary. Any subsequent transmission of tokenized prompts over the network to external LLM APIs is an independent, affirmative action initiated solely by the user. Maintaining zero network leakage to external third-party clouds is the joint operational responsibility of the software's local perimeter and the user's network routing.

### 2.3 The Non-Delegable Regulatory Duty Presumption
Statutory compliance obligations imposed by sectoral laws (including HIPAA, GLBA, BSA, FERPA, and ITAR) are non-delegable duties that adhere strictly to the regulated enterprise (Covered Entity, Financial Institution, or Government Contractor). Utilizing algorithmic data sanitization software does not transfer, subrogate, or diminish these statutory duties.

---

## 3. Multi-Vertical Risk Matrix & Statutory Demarcation

```
+---------------------------------------------------------------------------------------------------+
|                                 ZTDS THREE-TIER DEFENSIVE SHIELD                                  |
+------------------------------------+----------------------------------+---------------------------+
| TIER 1: THE STANDARD (ztds.ai)     | TIER 2: THE ENGINE (Software)    | TIER 3: DOWNSTREAM (User) |
| - Open RFC Specification Author    | - Client-side Volatile Memory    | - Data Controller Choice  |
| - Objective Mathematical Invariants| - Zero Network Egress (Local)    | - Third-Party LLM Policy  |
| - Express AS-IS Warranty Disclaimer| - Capped Liability ($12m / $100) | - Prompt Dispatch Intent  |
| - Emergency Revocation Protocol    | - Non-Escrow Ephemeral Keys      | - Non-Delegable Duty      |
+------------------------------------+----------------------------------+---------------------------+
```

### 3.1 Vertical 1: Healthcare, Medicine & Life Sciences
* **Target Statutes**: Health Insurance Portability and Accountability Act (HIPAA, 45 CFR Parts 160 & 164), HITECH Act (42 U.S.C. § 17931), FDA 21 CFR Part 11, EU GDPR Article 9 (Special Category Data).
* **Primary Liability Vectors**:
  1. *Business Associate Trap*: Claim by covered entities that the software provider is an uncontracted "Business Associate" under 45 CFR § 160.103.
  2. *OCR / Edge-Case Missed Identifier*: A non-standard medical record number (MRN) or handwritten pathology report escapes regex/OCR, is transmitted to an external LLM, and triggers an HHS Office for Civil Rights (OCR) breach investigation.
  3. *Statutory Misrepresentation*: Claims that the software "certifies" or "guarantees" statutory HIPAA Safe Harbor status.
* **Mandatory Statutory Demarcation**:
  - **No Business Associate Status**: Conforming software is an unhosted computational utility running in local RAM. Because it never receives, maintains, or transmits Protected Health Information (PHI) to its own servers, no Business Associate Agreement (BAA) is statutorily required or executed under 45 CFR § 164.502(e).
  - **Safe Harbor Assistant Only**: Conforming software assists covered entities in satisfying the 18-identifier Safe Harbor de-identification standard (45 CFR § 164.514(b)(2)). It does NOT constitute an Expert Determination under § 164.514(b)(1).
  - **Mandatory Pre-Dispatch Clinical Audit**: Healthcare professionals retain the affirmative statutory duty to visually review tokenized outputs before external transmission.

### 3.2 Vertical 2: Legal Practice, Litigation & Privileged Communications
* **Target Statutes**: Federal Rule of Evidence 502 (Attorney-Client Privilege and Work Product; Limitations on Waiver), ABA Model Rules of Professional Conduct (Rule 1.1 Competence, Rule 1.6 Confidentiality of Information), State Bar Ethics Opinions on Generative AI.
* **Primary Liability Vectors**:
  1. *Inadvertent Waiver of Privilege*: An attorney submits privileged deposition transcripts or mental impressions to a commercial LLM via the software. Opposing counsel moves to compel production under FRE 502, arguing waiver through disclosure to a third-party cloud.
  2. *Unauthorized Practice of Law (UPL)*: Allegation that software assessing privilege markers or Bates stamps renders legal advice.
* **Mandatory Statutory Demarcation**:
  - **No Legal Representation or UPL**: Software and standard maintainers do not practice law, render legal advice, or issue formal privilege determinations.
  - **No Guaranteed FRE 502 Privilege Shield**: Masking entities with synthetic surrogates does not guarantee that a judicial tribunal will find privilege preserved if the underlying substantive legal analysis is exposed to external model logs. Counsel bears the ethical duty under ABA Model Rule 1.6(c) to verify third-party AI provider confidentiality terms.

### 3.3 Vertical 3: Financial Services, Banking, Underwriting & Tax
* **Target Statutes**: Gramm-Leach-Bliley Act (GLBA, 15 U.S.C. § 6801), PCI DSS v4.0 (Requirement 3), Sarbanes-Oxley Act (SOX Section 404), SEC Rule 10b-5 (Material Non-Public Information / MNPI), IRS Publication 1075 & Circular 230.
* **Primary Liability Vectors**:
  1. *MNPI / Insider Trading Leak*: Leaking proprietary M&A targets or financial metrics to public LLM training corpuses.
  2. *Loan Underwriting / W-2 Wage Corruption*: Modifying numeric tax records during sanitization leading to flawed mortgage approvals.
  3. *Cardholder Data Scope Creep*: Merchant transmitting unmasked Primary Account Numbers (PAN) to LLMs resulting in PCI DSS fines.
* **Mandatory Statutory Demarcation**:
  - **No Investment, Tax, or Underwriting Advice**: Software performs lexical and syntactic entity substitution; it does not audit accounting integrity or validate loan underwriting models.
  - **PCI DSS Non-Storage**: Conforming software never persists cardholder data (PAN/SAD) to disk or cloud servers. Regulated financial entities remain solely responsible for PCI DSS network scope.
  - **MNPI Custom Rules Duty**: Enterprise finance teams must configure bespoke regex rules for proprietary deal names, ticker symbols, and confidential transaction codes.

### 3.4 Vertical 4: Crypto-Forensics, Web3 AML & Law Enforcement Investigations
* **Target Statutes**: Bank Secrecy Act (BSA), 31 U.S.C. § 5318(g)(2) (SAR Secrecy & Anti-Tipping Off), FATF Recommendations 15/16, EU AMLD6, Federal Rules of Evidence 901/902 (Chain of Custody).
* **Primary Liability Vectors**:
  1. *Felony Tipping-Off Disclosure*: Exposing a Suspicious Activity Report (SAR) narrative to external cloud LLMs that are subsequently compromised or subpoenaed.
  2. *Chain of Custody Suppression*: A defense attorney successfully excludes blockchain analysis because investigative prompts were processed through non-air-gapped third-party AI models.
* **Mandatory Statutory Demarcation**:
  - **Adherence to Invariants F-1 through F-4**: Conforming forensic implementations must enforce Amount Binning, Temporal Clamping, and Ed25519 Docket Receipts.
  - **No Expert Witness Status**: Software maintainers do not serve as expert witnesses or warrant evidence admissibility under FRE 902.
  - **Sole SAR Custody**: Regulated AML officers retain sole criminal and civil liability under 31 U.S.C. § 5318(g)(2) for any transmission that identifies subjects of confidential filings.

### 3.5 Vertical 5: Human Resources, Talent Acquisition & Employment
* **Target Statutes**: Title VII of the Civil Rights Act of 1964 (42 U.S.C. § 2000e), EEOC Uniform Guidelines on Employee Selection Procedures (UGESP), Age Discrimination in Employment Act (ADEA), Americans with Disabilities Act (ADA), NYC Local Law 144 (Automated Employment Decision Tools - AEDT).
* **Primary Liability Vectors**:
  1. *Disparate Impact & Algorithmic Bias*: An employer uses "Blind Recruitment" sanitization, but downstream LLM selection models still exhibit demographic bias, triggering EEOC class-action lawsuits.
  2. *AEDT Statutory Violation*: Claiming software serves as a certified bias audit under NYC Local Law 144.
* **Mandatory Statutory Demarcation**:
  - **Non-AEDT Classification**: Conforming software is a data redaction utility, NOT an Automated Employment Decision Tool, candidate scoring system, or resume evaluation engine.
  - **No Guarantee of Non-Discrimination**: Redacting explicit personal identifiers (names, dates, zip codes) does not eliminate latent semantic proxy variables in downstream LLMs. Employers maintain sole statutory duty to conduct independent bias audits and maintain EEOC compliance.

### 3.6 Vertical 6: National Security, Aerospace, Defense & Export Controls
* **Target Statutes**: International Traffic in Arms Regulations (ITAR, 22 CFR Parts 120-130), Export Administration Regulations (EAR, 15 CFR Parts 730-774), DFARS 252.204-7012, CMMC 2.0, FBI Criminal Justice Information Services (CJIS).
* **Primary Liability Vectors**:
  1. *Unauthorized Defense Data Export*: Contractor pasting ITAR United States Munitions List (USML) technical data into commercial LLMs hosted on multi-tenant or foreign cloud servers.
  2. *CJIS Violation*: Police agency processing unredacted criminal history record information (CHRI) without background-screened cloud personnel.
* **Mandatory Statutory Demarcation**:
  - **Strict ITAR / EAR / Classified Prohibition**: Standard web extensions and unauthenticated SaaS tiers are STRICTLY PROHIBITED from processing classified national security information, ITAR technical data, or EAR controlled items.
  - **Air-Gapped SCIF Requirement**: Export-controlled data may only be processed using verified air-gapped, on-premise, or AWS Nitro Enclave deployments where network interfaces are physically severed or cryptographically attested.

### 3.7 Vertical 7: Cybersecurity Incident Response, SOC & Vulnerability Management
* **Target Statutes**: SEC Cybersecurity Disclosure Rules (Item 1.05 of Form 8-K), CISA CIRCIA, EU GDPR Articles 33/34 (72-hour breach notice), FTC Act Section 5.
* **Primary Liability Vectors**:
  1. *Zero-Day / Secret Exfiltration*: Security analyst scrubbing core dumps or firewall logs containing active API tokens; unmasked secrets leak to public LLM training sets.
  2. *Breach Notice Tolling Failure*: Enterprise claims software sanitization delayed statutory 4-day SEC or 72-hour GDPR reporting timers.
* **Mandatory Statutory Demarcation**:
  - **No Statutory Tolling**: The use of ZTDS software does NOT toll, delay, or satisfy mandatory breach notification timelines under SEC Form 8-K or GDPR Article 33.
  - **Analyst Validation Duty**: Incident response teams must independently verify that ephemeral access keys, internal hostnames, and zero-day exploit payloads are fully masked prior to dispatch.

### 3.8 Vertical 8: Education, Academia & Minor Privacy
* **Target Statutes**: Family Educational Rights and Privacy Act (FERPA, 34 CFR Part 99), Children's Online Privacy Protection Act (COPPA, 16 CFR Part 312).
* **Primary Liability Vectors**:
  1. *Improper Education Record Disclosure*: Educational institutions submitting student IEPs, behavioral notes, or transcripts to commercial AI platforms without parental consent.
* **Mandatory Statutory Demarcation**:
  - **FERPA Institutional Custody**: Educational institutions remain the designated legal custodians of educational records under 34 CFR § 99.31 and must obtain requisite parental/student consent prior to submitting student data to third-party AI platforms.

### 3.9 Vertical 9: Autonomous AI Agents, RAG Pipelines & Model Context Protocol (MCP)
* **Target Statutes**: EU AI Act (Regulation (EU) 2024/1689), Model Context Protocol (Anthropic MCP standard), General Tort & Agency Law.
* **Primary Liability Vectors**:
  1. *Autonomous Agent Erroneous Action*: An autonomous agent equipped with an MCP sanitizer tool executes a destructive shell command or unauthorized database deletion due to malformed desanitization.
  2. *EU AI Act Provider Misclassification*: Claim that an SDK or MCP middleware qualifies as a "High-Risk AI System Provider" under EU AI Act Article 3(3).
* **Mandatory Statutory Demarcation**:
  - **Deterministic Middleware Status**: Conforming SDKs and MCP servers are deterministic tokenization middlewares, NOT autonomous AI decision systems or generative foundation models.
  - **No Prompt Injection Immunity**: Conforming software guarantees architectural memory isolation; it does NOT warrant immunity against semantic prompt injection, indirect adversarial jailbreaks, or external LLM hallucination.

---

## 4. Standard Contractual Terms & Mandatory Clauses

Every commercial agreement, EULA, Terms of Service, and SDK documentation across the ecosystem MUST incorporate the following immutable clauses:

```markdown
### SECTION X. MULTI-VERTICAL STATUTORY NON-RELIANCE & REGULATORY SHIELD
1. Independent Custody & Non-Delegable Duty: Licensee acknowledges and agrees that 
   compliance with industry-specific privacy, security, and evidentiary statutes 
   (including HIPAA, GLBA, BSA, FERPA, Title VII, ITAR, and EU AI Act) constitutes 
   a non-delegable statutory obligation resting solely upon Licensee as Data Controller.
2. Computational Utility Status: Licensor's Software functions strictly as an endpoint-executed, 
   memory-isolated algorithmic filter. Licensor does not act as a Business Associate, 
   Financial Advisor, Legal Counsel, Sworn Forensic Examiner, Employment Agency, 
   or Defense Export Custodian.
3. Third-Party Model Egress Exclusion: Licensor maintains zero custody over data once 
   dispatched by Licensee to third-party artificial intelligence platforms (including 
   OpenAI, Anthropic, Google, Microsoft, or open-source hosting nodes). Licensor disclaims 
   all liability for third-party cloud data breaches, sovereign subpoena disclosures, 
   or downstream model training ingestion.
4. Maximum Aggregate Liability: In no event shall Licensor's total aggregate liability 
   arising under any vertical, statutory theory, or tort claim exceed the fees actually 
   paid by Licensee in the twelve (12) months immediately preceding the incident, 
   or $100 USD for Community Tier usage.
```

---

## 5. Verification & Governance Protocol

1. **Audit SSOT**: The conformance auditor CLI (`npx ztds-audit`) validates that all documentation, legal pages, and codebases do not contain prohibited statutory claims (e.g., "HIPAA Certified", "Guaranteed Privilege Shield", "100% Blind Recruitment Warranty").
2. **Revocation Trigger**: Any registered implementation or certified fellow advertising deceptive statutory guarantees shall have its ZTDS Verified accreditation revoked within twenty-four (24) hours pursuant to the ZTDS Emergency Egress & Compliance Revocation Protocol.
