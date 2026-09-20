# ZTDS Entity Taxonomy and 30 Specialized Industry Profiles (SSOT)

## 1. Executive Summary & Architectural Separation

The Zero-Trust Data Sanitization (ZTDS) standard establishes a strict, mathematically verifiable entity classification hierarchy. To prevent data leakage while preserving AI model cognitive context and reasoning capability, entity detection is decoupled into two distinct operational layers:

1. **Universal Consumer PII (`REGEX_RULES`)**: The foundational baseline covering ubiquitous human identifiers (names, emails, phone numbers, standard national IDs, IPv4/IPv6, file paths, physical addresses). This engine runs with a 15,000-character single-scrub quota on the Free Tier across all client platforms.
2. **30 Specialized Industry Profiles (`PROFILE_RULES`)**: Highly specialized vertical vocabularies, regulatory codes, enterprise credentials, and domain-specific schemas covering 30 business sectors. These profiles run in a 5,000-character trial quota on the Free Tier and require a commercial tier (PRO at $15/mo, TEAMS at $99/mo flat, or DEVELOPER SDK at $199/mo) for unlimited throughput.

---

## 2. The Anti-Cannibalization Mandate (SSOT)

The separation between `REGEX_RULES` and `PROFILE_RULES` is an immutable economic and architectural invariant:

* **Rule**: Universal consumer PII MUST live exclusively in `REGEX_RULES`. Domain-specific identifiers, regulatory reference numbers, proprietary ticket formats, enterprise cloud secrets, and vertical financial terms MUST live exclusively in `PROFILE_RULES[sector]`.
* **Prohibition**: Never migrate specialized, vertical, or regulatory entities into `REGEX_RULES` to pass a generic QA test or convenience check.
* **Commercial Rationale**: Specialized vertical tokens (e.g., `[PHI_1]`, `[LEGAL_1]`, `[SECRET_1]`, `[FINANCIAL_1]`) represent the primary commercial value driver compelling enterprise personas (DPOs, CISOs, Legal Counsel, Chief Compliance Officers) to upgrade from the 5,000-character trial tier to PRO, TEAMS, and SDK licenses. Diluting the baseline cannibalizes enterprise conversion.

---

## 3. Universal Consumer PII Taxonomy (`REGEX_RULES`)

`REGEX_RULES` is active across all 30 profiles as the baseline filter. It extracts:

| Entity Type | Scope & Patterns | Token Format | Edge Handling |
| :--- | :--- | :--- | :--- |
| **`EMAIL`** | Standard RFC 5322 email patterns (`user@domain.tld`) | `[EMAIL_N]` | Preserves domain context when isolated |
| **`PHONE`** | International E.164, US formatted (`(555) 000-0000`), UK mobile (`07xxx`), extensions | `[PHONE_N]` | Punctuation agnostic, lookbehind guarded |
| **`ID`** | US SSN (`XXX-XX-XXXX`), EIN (`XX-XXXXXXX`), Passport, Driver License, National IDs | `[ID_N]` | Handles masked variants (`***-**-1234`, `XXX-XX-1234`) |
| **`NAME`** | First + Last, honorifics (Dr., Mr., Mrs., Ms., Prof.), corporate entities, payroll inverted | `[NAME_N]` | Unicode-safe (`\p{Lu}\p{Ll}`), aggressive multi-token guard |
| **`ADDRESS`**| Street addresses, P.O. Boxes, City/State/ZIP combos, Box f W-2 employee addresses | `[ADDRESS_N]`| Multi-line boundary preservation |
| **`IP`** | IPv4 (`192.168.1.1`), IPv6 (`2001:db8::1`) | `[IP_N]` | Localhost port separation |
| **`LOCATION`**| Geographic coordinates (Lat/Long decimal & DMS), City/State pairs | `[LOCATION_N]`| Preserves country when general context |
| **`DATE`** | Dates of Birth (DOB), specific calendar dates tied to persons | `[DATE_N]` | Excludes standard regulatory publication dates |
| **`FINANCIAL`**| Credit/debit card numbers (Luhn compliant), Bitcoin/Ethereum addresses, Bank Routing | `[FINANCIAL_N]`| Direct deposit masked accounts (`*****1234`) |

---

## 4. The 30 Specialized Industry Profiles (`PROFILE_RULES`)

### 4.1. Legal (`legal`)
* **Target Personas**: Law firm partners, general counsel, litigation support, paralegals.
* **Target Entities**:
  * Role-Prefixed Names: `Claimant`, `Respondent`, `Plaintiff`, `Defendant`, `Petitioner`, `Appellant`, `Appellee`, `Principal`, `Grantor`, `Grantee`, `Trustee`, `Fiduciary`, `Attorney-in-Fact`, `Lead Counsel`, `Managing Partner`, `Escrow Officer`.
  * Case Identifiers: `CASE-XXXX`, `MATTER-XXXX`, Docket numbers, Federal civil/criminal case formats (`1:24-cv-01234`), ECLI European Case Law Identifiers.
  * Privilege Markers: `ATTORNEY-CLIENT PRIVILEGED`, Attorney Work-Product doctrine notices.
  * Production & Bates Stamps: `BATES-XXXX`, `PROD-XXXX`, `PLTF-XXXX`, `EXHIBIT-XXXX`.
  * Legal Credentials: State Bar Registration numbers, Attorney SBN, CRD/Broker IDs, CIK.
  * Trust & Escrow: Escrow/Trust/Disputed Account numbers, Fedwire/ABA routing numbers.
  * Monetary Damages: Lookbehind capture of `Settlement Amount`, `Retainer Fee`, `Hourly Rate`, `Damages Claimed`, `Sanctions`, `Judgment`, `Restitution`.

### 4.2. Human Resources & Recruiting (`hr`)
* **Target Personas**: VP of People, HR Directors, Talent Acquisition, Recruiters.
* **Target Entities**:
  * Candidate & Manager Roles: `Candidate`, `Applicant`, `Employee`, `Reporting To`, `Manager`, `Direct Report`.
  * Employee Identifiers: `EEID`, `EMP-XXXX`, `Associate ID (AOID)`, Security Badge IDs.
  * Recruitment & ATS: Workday IDs (`WKDY-XXXX`), Candidate IDs (`CAND-XXXX`), Resume reference tokens.
  * Labor & Works Council: `Works Council / Betriebsrat` reference IDs, Performance Improvement Plans (`PIP-XXXX`).
  * Demographic Screening: Graduation years (`Class of 2020`), personal LinkedIn URLs (`linkedin.com/in/*`), GitHub profile handles.
  * Statutory & Immigration: E-Verify case numbers, EEOC charge numbers, USCIS Alien Registration numbers (`A-Number`).

### 4.3. Finance & Banking (`finance`)
* **Target Personas**: CFOs, Investment Bankers, Quantitative Analysts, FinTech Engineers.
* **Target Entities**:
  * Banking Routing & Identifiers: SWIFT/BIC codes, International Bank Account Numbers (IBAN).
  * Securities & Assets: CUSIP (9-digit), ISIN (12-digit), SEDOL (7-digit), Bloomberg Tickers (`BBGXXXXXXXXX`).
  * Institutional Identifiers: Legal Entity Identifier (`LEI` 20-char alpha), SEC Central Index Key (`CIK` 10-digit), CRD IDs.
  * Account Taxonomy: Brokerage, 401(k), IRA, Roth, Trust, Portfolio account numbers.
  * Transactional Amounts: Lookbehind extraction of `Wire Transfer`, `Balance`, `Deposit`, `Withdrawal`, `Remittance`, `Payout`, `Principal`, `Interest`.

### 4.4. Medical & Healthcare (`medical`)
* **Target Personas**: Chief Medical Information Officers (CMIO), Clinical Researchers, EHR Admins.
* **Target Entities**:
  * Clinical Roles & Emergency Contacts: `Patient`, `Pt.`, `Legal Guardian`, `Proxy`, `Emergency Contact`, `Attending Physician`, `Surgeon`, `Provider`, `Subscriber`.
  * Health Records: Medical Record Numbers (`MRN`), Electronic Health Record (`EHR`) identifiers.
  * HL7 v2 Protocol Delimiters: Caret-delimited patient/provider names (`Guillermo^Maricela^C`), segment-delimited birthdates (`YYYYMMDD` in PID-7).
  * Insurance & Coverage: Policy numbers, Subscriber IDs, Group numbers, Health Plan Beneficiary IDs (`HPN`), BCBS, Aetna, Humana, Medicare/Medicaid policy codes.
  * Regulatory Provider IDs: National Provider Identifier (`NPI` 10-digit Luhn), DEA registration numbers, NHS numbers (UK), CHI numbers (Scotland).
  * Medical Devices & Encounters: Unique Device Identifiers (`UDI`), FHIR resource paths (`Patient/123`, `Observation/456`), Hospital Bed/Room/Ward identifiers.

### 4.5. DevSecOps & Security (`security`)
* **Target Personas**: CISOs, SOC Managers, Penetration Testers, Incident Response Leads.
* **Target Entities**:
  * DevOps Secrets: AWS credentials (`AKIA...`), JWT tokens, GitHub/Slack/NPM API tokens, Stripe/OpenAI keys, Database URIs, Private Keys (RSA/EC/PGP/OpenSSH).
  * Threat Intel & CVE: Common Vulnerabilities and Exposures (`CVE-YYYY-NNNNN`), CWE identifiers, MITRE ATT&CK techniques (`T1059.001`), Threat Actor aliases (`APT29`, `UNC2452`).
  * Incident Management: Breach Incident IDs (`INC-XXXXXX`), Security Advisory IDs (`GHSA`, `RHSA`).
  * SIEM & Firewall Rules: Sigma rules, Splunk query IDs, Snort/Suricata rules, Firewall ACL policies.
  * Defanged Indicators: Defanged URLs (`hxxps://`), Cryptographic Hashes (MD5, SHA-1, SHA-256).

### 4.6. Software Development (`dev`)
* **Target Personas**: Software Architects, Full-Stack Engineers, DevOps Engineers.
* **Target Entities**:
  * Cloud API Keys: Anthropic keys (`sk-ant-api03-*`), OpenAI project keys (`sk-proj-*`), Google API keys (`AIza*`), Twilio, SendGrid (`SG.*`), Docker PATs.
  * Internal Endpoints: Private RFC 1918 IP addresses with ports (`10.x.x.x:8080`, `192.168.x.x:3000`), localhost bindings.
  * Webhook Secrets: Stripe webhook secrets (`whsec_*`), generic signing secrets.
  * Database Connection Strings: Full connection URIs with embedded user/pass authentication.

### 4.7. Marketing & AdTech (`marketing`)
* **Target Personas**: CMOs, Growth Hackers, Performance Marketing Leads.
* **Target Entities**:
  * Ad Tracking Identifiers: Google Click IDs (`GCLID`), Facebook Click IDs (`FBCLID`), Campaign IDs.
  * Web Analytics: Google Analytics Measurement IDs (`G-XXXXXX`, `UA-XXXXX-X`), GA Client IDs (`_ga` cookies).
  * Marketing Automation: HubSpot Contact IDs, Marketo Lead IDs, Klaviyo Profile IDs, Pardot prospects.
  * Unit Economics: Customer Acquisition Cost (`CAC`), Lifetime Value (`LTV`) amounts.
  * Campaign URLs: Detailed UTM parameter strings (`utm_source`, `utm_campaign`, `utm_term`).

### 4.8. Business Operations & M&A (`bizops`)
* **Target Personas**: COOs, VPs of Strategy, Private Equity Associates, Corporate Development.
* **Target Entities**:
  * Corporate Registries: D-U-N-S numbers (`XX-XXX-XXXX`), SEC Central Index Keys (`CIK`).
  * M&A Confidentiality: Virtual Data Room IDs (`VDR-XXXX`), Term Sheet reference codes, Letter of Intent (`LOI`) IDs.
  * Equity & Cap Tables: Equity option grants, Safe notes, Convertible notes, Shareholder IDs (`RSU-XXXX`, `SAFE-XXXX`).
  * Financial KPIs: EBITDA amounts, Net Profit margins, ARR metrics tied to undisclosed deals.

### 4.9. Sales & Revenue Operations (`sales`)
* **Target Personas**: CROs, VPs of Sales, RevOps Managers, Account Executives.
* **Target Entities**:
  * CRM Records: Salesforce IDs (15/18 char alphanumeric), HubSpot Deal IDs.
  * Contracts & E-Signatures: DocuSign envelope UUIDs, Order Form numbers, Master Services Agreement (`MSA`) codes.
  * Conversation Intelligence: Gong call recording IDs, Chorus transcripts, SalesLoft cadence steps.
  * Commercial Quotas: Individual rep quotas, pipeline deal values, annual recurring revenue numbers.

### 4.10. Customer Support & Care (`support`)
* **Target Personas**: VPs of Customer Experience, Tier 3 Support Leads, Contact Center Managers.
* **Target Entities**:
  * Helpdesk Tickets: ServiceNow Incident/Request IDs (`INCXXXXXXX`, `RITMXXXXXXX`), Jira tickets, Zendesk tickets.
  * Hardware & Returns: Return Merchandise Authorization (`RMA-XXXX`), Refund reference IDs.
  * Feedback & CSAT: CSAT survey tokens, Net Promoter Score (`NPS`) respondent hashes.
  * Loyalty Programs: Rewards card numbers, Customer loyalty account IDs.

### 4.11. Real Estate & Title (`realestate`)
* **Target Personas**: Title Agents, Real Estate Brokers, Escrow Officers, Underwriters.
* **Target Entities**:
  * Property Identification: Multiple Listing Service (`MLS`) numbers, Assessor Parcel Numbers (`APN`), Parcel IDs.
  * Closing & Title: Escrow file numbers, Title insurance commitment IDs, FHA case numbers (`XXX-XXXXXXX`).
  * Tenant & Leases: Tenant profile IDs, Lease agreement IDs, Gate/Lobby access PIN codes.
  * Real Estate Values: Lookbehind extraction of `Purchase Price`, `Listing Price`, `Down Payment`, `Closing Costs`, `Rent`.

### 4.12. Regulatory Compliance & GRC (`compliance`)
* **Target Personas**: Chief Compliance Officers, DPOs, Audit Managers, Risk Officers.
* **Target Entities**:
  * Data Subject Requests: GDPR/CCPA Data Subject Access Request IDs (`DSAR-XXXX`, `SAR-XXXX`).
  * International VAT Registrations: Full EU VIES VAT numbers (AT, BE, DE, FR, IT, NL, PL, ES, etc.), UK VAT, Swiss TVA.
  * Cross-Border Data Transfers: Standard Contractual Clauses (`SCC 2021/914`), Binding Corporate Rules (`BCR`).
  * Regulatory Registrations: UK Information Commissioner's Office registration numbers (`ICO ZXXXXXXX`), Data Protection Officer IDs.
  * Security Controls: NIST SP 800-53 control identifiers (`AC-2`, `SC-28`), FedRAMP package numbers.

### 4.13. California Privacy / CCPA (`ccpa`)
* **Target Personas**: California Privacy Officers, Consumer Rights Managers.
* **Target Entities**:
  * California Identifiers: California Driver's Licenses, State ID numbers.
  * Consumer Rights Requests: CPRA Opt-Out records, "Do Not Sell My Info" inquiry tokens.
  * Biometric Templates: Face recognition template hashes, voiceprints, fingerprint vectors.
  * Precise Geolocation: Latitude and longitude coordinates within California jurisdiction.

### 4.14. Cloud Infrastructure Engineering (`engineering`)
* **Target Personas**: Cloud Engineers, SREs, Kubernetes Operators.
* **Target Entities**:
  * Container Architecture: Docker image tags, Container digest SHA-256 hashes, Kubernetes cluster-internal DNS (`*.svc.cluster.local`).
  * Cloud Resource Names: AWS Amazon Resource Names (`arn:aws:iam::123456789012:role/*`), Azure Resource IDs.
  * Git Commits: Full 40-character Git commit SHAs, internal private repository paths.

### 4.15. Autonomous AI Agents (`agents`)
* **Target Personas**: AI Engineers, LLM Pipeline Developers, Agent Framework Builders.
* **Target Entities**:
  * OpenAI Platform IDs: Assistant IDs (`asst_*`), Thread IDs (`thread_*`), Run IDs (`run_*`), Batch IDs (`msgbatch_*`), Vector Store IDs (`vs_*`).
  * Vector Database Collections: Pinecone index names, Weaviate collections, Qdrant cluster namespaces.
  * Open Source Weights: Hugging Face user tokens (`hf_*`), model fine-tuning job IDs (`ftjob-*`).

### 4.16. Academic & Research (`academic`)
* **Target Personas**: University Registrars, Institutional Review Board (IRB) Chairs, Grant PIs.
* **Target Entities**:
  * Institutional Governance: IRB protocol numbers, FERPA student record IDs, Student/Alumni numbers.
  * Academic Identifiers: Researcher ORCID iDs (`0000-0002-1825-0097`), PubMed IDs (`PMID`), PubMed Central (`PMC`).
  * Academic Publications: Digital Object Identifiers (`10.xxxx/...`), arXiv preprint IDs.
  * Transcripts & Grades: Specific course grade attributions, diploma registration serials.

### 4.17. Creative & Entertainment (`creative`)
* **Target Personas**: Entertainment Lawyers, Production Executives, Talent Agents.
* **Target Entities**:
  * Guild Registrations: Writers Guild of America (`WGAW`/`WGAE`) registration numbers.
  * Talent Management: SAG-AFTRA member IDs, Talent/Model release form numbers.
  * Music & Royalties: International Standard Recording Codes (`ISRC`), ASCAP/BMI party IDs, IPI/CAE numbers.
  * Media Standards: International Standard Audiovisual Numbers (`ISAN`), International Standard Book Numbers (`ISBN`).

### 4.18. Core Technology & IT (`tech`)
* **Target Personas**: IT Directors, Systems Administrators, Cloud Admins.
* **Target Entities**:
  * Cloud Compute: AWS EC2 Instance IDs (`i-0123456789abcdef0`), VPC IDs, Subnet IDs, Security Group IDs.
  * GCP & Azure Tenants: Google Cloud Project IDs, Azure Subscription IDs, Azure Tenant GUIDs.
  * Infrastructure State: Terraform state file identifiers (`tfstate`), Kubernetes configuration tokens.

### 4.19. Personal & Executive Protection (`personal`)
* **Target Personas**: Family Offices, High-Net-Worth Individuals, Executive Assistants.
* **Target Entities**:
  * Family Relational Records: Kinship-tied emergency contact names (`Wife: ...`, `Child: ...`).
  * Personal Credentials: Safe/Alarm passcodes, Master device PINs, Home Wi-Fi credentials.
  * Travel & Loyalty: Passport numbers, Airline Frequent Flyer numbers (Delta SkyMiles, United MileagePlus), Hotel loyalty numbers.

### 4.20. Wealth Management & Family Office (`wealthmgmt`)
* **Target Personas**: Private Wealth Managers, Estate Planning Attorneys, Family Office Principals.
* **Target Entities**:
  * Trust Architecture: Living, Revocable, and Irrevocable Trust legal entities (`THE JOHN DOE IRREVOCABLE TRUST`).
  * Advisory Governance: SEC Form ADV registration files (`801-XXXXX`), FINRA Series 7/65/66 license numbers.
  * Retirement Accounts: Custodial accounts, SEP-IRA, 401(k) plan numbers, Required Minimum Distribution (`RMD`) amounts.
  * Portfolio Assets: Total Net Worth, Assets Under Management (`AUM`), Market Value lookbehind amounts.

### 4.21. Insurance & Risk Management (`insurance`)
* **Target Personas**: Underwriters, Claims Adjusters, Actuaries.
* **Target Entities**:
  * Claims & Policies: Insurance Claim numbers (`CLM-XXXXX`), Policy numbers (`POL-XXXXX`), Insurance Binder IDs.
  * Regulatory Codes: National Association of Insurance Commissioners (`NAIC`) company codes (5-digit), Lloyd's Syndicate numbers, UK FCA FRN.
  * Financial Reserves: Lookbehind extraction of `Claim Settlement`, `Loss Reserve`, `Indemnity`, `Deductible`, `Premium`.
  * Physical Assets: Vehicle Identification Numbers (`VIN` 17-char ISO 3779), Certificate of Insurance (`COI`) numbers.

### 4.22. Accounting & Tax Preparation (`accounting`)
* **Target Personas**: CPAs, Tax Preparers, Corporate Controllers.
* **Target Entities**:
  * Tax Filings: IRS Form numbers (Form 1040, W-2, 1099-MISC, K-1, Form 941).
  * Preparer Credentials: Preparer Tax Identification Number (`PTIN`), Electronic Filing Identification Number (`EFIN`), Centralized Authorization File (`CAF`).
  * Ledger & Invoices: General Ledger account numbers (`GL-6010-CLOUD`), Purchase Order (`PO`) numbers, Invoice identifiers.
  * Tax Calculations: Adjusted Gross Income (`AGI`), Taxable Income, Balance Due, Refund amounts.

### 4.23. Pharmaceuticals & Life Sciences (`pharma`)
* **Target Personas**: Clinical Data Managers, Bio-statisticians, Regulatory Affairs Specialists.
* **Target Entities**:
  * Clinical Trial Registries: ClinicalTrials.gov identifiers (`NCTXXXXXXXX`), European Clinical Trials Database (`EudraCT`).
  * Regulatory Submissions: Investigational New Drug (`IND`), New Drug Application (`NDA`), Biologics License Application (`BLA`).
  * Clinical Subjects: Subject Unique Identifier (`USUBJID`), Patient randomization codes, Medication kit serial numbers.
  * Drug Safety: Individual Case Safety Reports (`ICSR`), Council for International Organizations of Medical Sciences (`CIOMS`) report IDs.

### 4.24. Underwriting & Mortgage Underwriting (`underwriting`)
* **Target Personas**: Mortgage Underwriters, Credit Analysts, Loan Processors.
* **Target Entities**:
  * W-2 Calibration: Box c (Employer name/address), Box d (Control number), Box e (Employee Name), Box f (Employee Address).
  * Loan Files: Loan application numbers, Underwriting file numbers, Fannie Mae / Freddie Mac reference IDs.
  * Banking Verification: Direct deposit account verification codes, Paystub check advice numbers, Pay group codes.

### 4.25. Automotive & Telematics (`automotive`)
* **Target Personas**: Fleet Managers, Connected Vehicle Engineers, Telematics Analysts, EV Infrastructure Operators.
* **Target Entities**:
  * Vehicle Identifiers: 17-character VIN (ISO 3779), License Plate numbers, Vehicle Registration Numbers.
  * In-Vehicle Systems: Electronic Control Unit IDs (`ECU-*`), CAN bus message IDs, OBD-II Diagnostic Trouble Codes (`DTC P0300`, etc.).
  * Telematics & Charging: EV Charging Station IDs, EVSE IDs, GPS telematics device serials, In-cabin safety driver logs.

### 4.26. Energy & Utilities (`energy`)
* **Target Personas**: SCADA Operators, Substation Engineers, Grid Dispatchers, NERC CIP Compliance Leads.
* **Target Entities**:
  * Grid Infrastructure: Smart Meter IDs, RTU (Remote Terminal Unit) IDs, Substation codes, Feeder line identifiers.
  * Supervisory Control: SCADA tag names, PLC serial numbers, DNP3/Modbus addressing, EMS point IDs.
  * Compliance & Safety: NERC CIP facility identifiers, Power Plant Outage notice IDs, High-voltage switching order numbers.

### 4.27. Hospitality & Travel (`hospitality`)
* **Target Personas**: Hotel Revenue Managers, Front Desk Leads, Passenger Services, Travel Counselors.
* **Target Entities**:
  * Passenger Records: Passenger Name Records (6-char alphanumeric PNR / Record Locators), E-Ticket numbers.
  * Reservations & Folios: Guest Folio numbers, Hotel confirmation codes, Room/Cabin electronic keycards.
  * Loyalty Programs: Airline frequent flyer numbers, Hotel rewards member IDs, Travel agency booking vouchers.

### 4.28. Biotechnology & Genomics (`biotech`)
* **Target Personas**: Bioinformaticians, Molecular Biologists, Genomic Research PIs, Biobank Curators.
* **Target Entities**:
  * Genomic Databases: OMIM disease codes, Orphanet IDs (`ORPHA*`), Human Phenotype Ontology (`HP:0000000`), Cytogenetic karyotypes.
  * Specimens & Samples: Biobank sample IDs, Cryotube barcodes, Aliquot tracking IDs, FFPE tissue block codes.
  * Sequencing Platforms: Next-Gen Sequencing run IDs (Illumina NovaSeq, NextSeq, MiSeq, Oxford Nanopore MinION, PacBio), FACS sorting identifiers.

### 4.29. Telecommunications & Contact Centers (`telecom`)
* **Target Personas**: Telecom Network Engineers, Contact Center Directors, VoIP Architects, CDR Analysts.
* **Target Entities**:
  * Mobile Hardware & SIM: IMSI (14-15 digit), IMEI/IMEISV (15-16 digit), ICCID SIM card numbers (89-prefix), MSISDN.
  * Cellular Infrastructure: Cell Global Identity (`CGI`), eNodeB/gNodeB IDs, Physical Cell IDs (`PCI`), Tracking Area Codes (`TAC`).
  * Telephony & VoIP: Session Initiation Protocol URIs (`sip:user@host`), SIP Call-IDs, CTI interaction sessions, IVR payment tokens.
  * Call Detail Records: CDR record UUIDs, Trunk Group IDs, Point of Interconnect (`POI`) codes, RADIUS/Diameter shared session IDs.

### 4.30. General / Universal Baseline (`general`)
* **Target Personas**: Consumer users, generic AI prompt sanitization.
* **Target Entities**: Relies purely on the zero-trust universal `REGEX_RULES` baseline (15,000 character allowance).

---

## 5. Adversarial Red-Team Gym Rules (Spark Invariants)

Through continuous automated adversarial red-teaming (the Gemini Spark Gym loop), the following regex calibration patterns are mandatory across all 5 product planes:

### 5.1. Trailing Currency Boundary Trap
Word boundaries (`\b`) match between word characters (`\w`) and non-word characters (`\W`). Because currency glyphs (`$`, `€`, `£`, `¥`, `₪`, `₽`, `₹`) are non-word characters, appending a `\b` directly after a currency glyph fails when followed by whitespace or numbers.
* **Flawed**: `/(?:[$€£¥₪₽₹]\b)\d+/` (Engine backtracks and leaks currency symbol in cleartext).
* **Calibrated Standard**: `/(?:(?:\b(?:USD|EUR|GBP|CHF|ILS|RUB)\s*|[$€£¥₪₽₹]\s*)[0-9,.'’]*\d[KMB]?\b|\b\d[0-9,.'’]*\d?[KMB]?\s*(?:\b(?:USD|EUR|GBP|CHF|ILS|RUB)\b|[$€£¥₪₽₹]))/gi`

### 5.2. Role Prefix Protection & Name Truncation
When extracting party or professional names, regexes must not swallow the preceding role title or drop the first name:
* **Invariant**: Legal and clinical role titles (`Claimant`, `Respondent`, `Patient`, `Counsel`, `Physician`) MUST be explicitly defined in lookbehind or non-capturing prefix groups.
* **Jargon Allowlisting**: All vertical role nouns must be mirrored in `PROFILE_JARGON[sector]` to prevent downstream token collision.

### 5.3. Case Prefix Explicit Delimiters
In legal, compliance, and support ticketing, case and docket regexes must require explicit prefix triggers (`No.`, `Number`, `#`, `:`):
* **Flawed**: `/\b(?:Case|Matter)\s+([A-Za-z0-9_-]+)\b/` (Swallows legitimate English words like "Case Studies").
* **Calibrated Standard**: `/\b(?:Case|Matter|Arbitration|Docket|Proceeding)\s*(?:(?:No\.?|Number|#)[:\s#]*|[:#]\s*)([A-Za-z0-9_-]{4,25})\b/gi`

### 5.4. OCR Homoglyph Normalization
When parsing scanned documents (PDFs/images via Tesseract.js OCR), letters and numbers frequently interchange (e.g. `O` vs `0`, `I` or `l` vs `1`):
* **Calibrated Standard**: Regulatory ID patterns (such as State Bar numbers or NPIs) must evaluate OCR-ambiguous character sets: `[0-9OIloA-Za-z]{4,10}`.

### 5.5. Lookbehind Context Label Preservation
In financial and accounting documents, the contextual label (e.g., `Settlement Amount:`, `Rent:`, `Total Paid:`) must remain in cleartext to provide the LLM with semantic comprehension of what the masked token represents:
* **Calibrated Standard**:
  `/(?<=\b(?:Settlement(?:\s+Amount)?|Retainer(?:\s+Fee)?|Hourly\s+Rate|Damages(?:\s+Claimed)?|Legal\s+Fees?)[:\s]+)(?:...amount regex...)/gi`

---

## 6. Two-Sided Verification Invariants

Every sanitization profile must strictly satisfy two bidirectional mathematical conditions:

$$\text{Leakage}(T_{\text{sanitized}}) = 0 \quad \land \quad \text{Distortion}(T_{\text{revealed}}, T_{\text{original}}) = 0$$

1. **Zero Cleartext Leakage (Side A)**:
   * Not a single byte of sensitive PII, PHI, or credential strings may remain in $T_{\text{sanitized}}$.
   * All extracted tokens must conform to `[TYPE_N]` formatting.
2. **Context & Semantic Integrity (Side B)**:
   * Jargon, clinical diagnoses, statutory legal citations, and role frameworks must NOT be redacted.
   * On reverse reveal ($T_{\text{revealed}}$), replacing `[TYPE_N]` tokens with values from the volatile RAM `sessionMap` must yield the exact original text with zero whitespace or grammatical drift.

---

## 7. Commercial Packaging & Intellectual Property Protection

To protect the 25 High-ACV Industry Profiles from unauthorized extraction or competitive reverse engineering:

1. **Layer 1: Open Core (`REGEX_RULES`)**:
   - Universal consumer PII (email, phone, standard national IDs, credit cards, IP addresses) is distributed openly under the MIT License in `@privacyscrubber/sdk` on npm.
   - Designed for zero-barrier developer adoption, public GitHub auditing, and indexing by autonomous LLM crawlers.

2. **Layer 2: Commercial Vertical Engine (`PROFILE_RULES`)**:
   - The 25 Industry Profiles are packaged as a compiled WebAssembly binary (`ps-engine-core.wasm`) compiled from Rust state machines (Aho-Corasick & deterministic finite automata).
   - Plain-text regular expressions are NOT exposed in client-side JavaScript bundles.
   - Commercial activation is authenticated via asymmetric Ed25519 cryptographic license tokens (`ZTDS-LIC-v1`).
   - The engine validates licenses 100% offline in client volatile RAM without network callbacks, preserving the 0.00 B Egress Invariant.
