# PrivacyScrubber: 50 High-Liability B2B Document Blueprints Manifest (SSOT 2026)

## 1. Executive Context & Audience Coverage Strategy
This manifest codifies the 50 specialized B2B document blueprints implemented across PrivacyScrubber spoke guides. Each blueprint serves as a high-intent capture engine targeting specific enterprise personas (CISOs, General Counsel, CPAs, Clinicians, DevOps, Financial Crime Officers) who face severe regulatory liability under GDPR, HIPAA, SOC 2, GLBA, DORA, BSA, and IRC statutes when processing unstructured documents with AI.

### Architectural Guarantees
- **100% Client-Side ZTDS**: All tokenization and detokenization occurs exclusively in volatile local RAM.
- **Quantitative Utility Preservation**: Financial figures, diagnostic codes, and code logic remain intact in cleartext while identifying tokens are pseudonymized.
- **Schema.org HowTo & Speakable**: Fully indexed for Google AI Overviews, SearchGPT, and Perplexity with 40-50 word direct answer snippets.

---

## 2. Master Blueprints Registry (50 Documents across 5 Verticals)

### 1. IRS Form W-2, Form 1040 & Schedule K-1
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-irs-forms-1040-w2-k1-for-ai/
- **Target Persona**: CPA Tax Professionals, Mortgage Underwriters & Credit Analysts
- **Primary Statutory Liability**: IRC § 6103 (Confidentiality of Returns) & GLBA Safeguards Rule (16 CFR Part 314)
- **Direct Answer (Featured Snippet)**: To safely analyze IRS Forms W-2, 1040, and Schedule K-1 with AI, redact employee SSNs (Box a), employer EINs (Box b), and company addresses (Box c) while strictly preserving quantitative compensation figures (Box 1 Wages, Box 2 Withholding, Box 12 Deferrals). This allows LLMs to calculate Debt-to-Income (DTI) and effective tax rates without exposing federal taxpayer identification.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Box a: Employee Social Security Number (SSN) | **REDACT** | `[SSN_1]` | IRC § 6103 federal tax return information; severe statutory identity theft risk |
  | Box b: Employer Identification Number (EIN) | **REDACT** | `[TAX_ID_1]` | Commercial entity identifier subject to corporate filing spoofing |
  | Box c: Employer Name, Street Address & ZIP | **REDACT** | `[ORG_1], [ADDRESS_1]` | Direct employer corporate identity; leaks applicant workplace |
  | Box e: Employee Legal Name & Home Address | **REDACT** | `[NAME_1], [ADDRESS_2]` | Primary personal identity; strictly prohibited from external AI logs |
  | Box 1: Wages, tips, other compensation | **PRESERVE** | `Cleartext ($142,500.00)` | Core quantitative variable required for AI underwriting & DTI calculations |
  | Box 2: Federal income tax withheld | **PRESERVE** | `Cleartext ($28,450.00)` | Necessary for computing effective tax rates and net take-home liquidity |
  | Box 3: Social security wages (capped) | **PRESERVE** | `Cleartext ($168,600.00)` | Required for FICA payroll audit and compensation verification |
  | Box 12: Code D (401k elective deferrals) | **PRESERVE** | `Cleartext (Code D $23,000.00)` | Pre-tax retirement savings needed to reconcile gross vs adjusted qualifying income |

---

### 2. Deposition Transcripts & Hearing Records
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-pdf-transcripts-local/
- **Target Persona**: Litigation Paralegals, Trial Attorneys & General Counsel
- **Primary Statutory Liability**: Federal Rules of Civil Procedure (FRCP) Rule 5.2 & ABA Model Rule 1.6
- **Direct Answer (Featured Snippet)**: Redacting deposition transcripts for AI summarization requires removing witness identities, deponent addresses, minor names, and confidential settlement figures while keeping transcript line numbers, legal colloquy, and testimony narrative completely intact. Client-side RAM tokenization preserves attorney-client privilege without waiving work-product confidentiality.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Deponent & Witness Names | **REDACT** | `[WITNESS_1], [DEPONENT_1]` | FRCP Rule 5.2 privacy protection; prevents public witness disclosure |
  | Residential & Private Addresses | **REDACT** | `[ADDRESS_1]` | Personal privacy; prevents physical stalking or harassment of parties |
  | Case Docket & Claim Reference Numbers | **REDACT** | `[CASE_ID_1]` | Prevents LLMs from indexing the litigation docket into external training sets |
  | Confidential Settlement Figures | **REDACT** | `[SETTLEMENT_1]` | NDA-protected settlement considerations; discoverability risk |
  | Transcript Line Numbers (e.g. Lines 1-25) | **PRESERVE** | `Cleartext (0012:04)` | Mandatory for citation accuracy in court motions and trial cross-examinations |
  | Attorneys of Record & Questioning Counsel | **PRESERVE** | `Cleartext (Mr. Hastings)` | Maintains dialogue speaker continuity during AI testimony summarization |
  | Substantive Testimony & Factual Timeline | **PRESERVE** | `Cleartext` | Essential evidence needed for AI deposition digest and impeachment indexing |

---

### 3. Multifamily Rent Rolls & Commercial Tenant Ledgers
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-excel-spreadsheets-offline/
- **Target Persona**: Commercial Real Estate Underwriters, CRE Appraisers & Property Managers
- **Primary Statutory Liability**: Gramm-Leach-Bliley Act (GLBA) & Tenant Data Privacy Regulations
- **Direct Answer (Featured Snippet)**: Sanitizing multifamily rent rolls and commercial tenant ledgers for AI requires stripping tenant names, unit numbers, phone numbers, and lease account IDs while keeping square footage, contract rent, lease expiration dates, and security deposit amounts in cleartext. In-browser Wasm processing allows AI tools to calculate Net Operating Income (NOI) without exposing resident identities.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Tenant Legal Names | **REDACT** | `[TENANT_1]` | GLBA nonpublic personal information; exposes resident identities |
  | Specific Unit / Apartment Numbers | **REDACT** | `[UNIT_1]` | Exposes residential unit privacy; enables tenant re-identification |
  | Direct Phone & Email Contacts | **REDACT** | `[PHONE_1], [EMAIL_1]` | Direct PII subject to consumer telemarketing and privacy statutes |
  | Lease Account / Resident IDs | **REDACT** | `[ACCOUNT_1]` | Internal accounting references vulnerable to ledger enumeration |
  | Unit Type & Square Footage (SF) | **PRESERVE** | `Cleartext (2BR/2BA, 1,150 SF)` | Mandatory structural metrics for rent-per-square-foot valuation in AI |
  | Scheduled Contract Rent & Concessions | **PRESERVE** | `Cleartext ($2,450.00/mo)` | Required for gross potential rent and economic occupancy analysis |
  | Lease Start & Expiration Dates | **PRESERVE** | `Cleartext (09/01/2024 - 08/31/2026)` | Critical for rollover risk modeling and weighted average lease term (WALT) |

---

### 4. Clinical Trial eCRF & Patient Narrative Records
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/clinical-trial-data-redaction-for-chatgpt/
- **Target Persona**: Clinical Research Coordinators, Biostatisticians & Medical Writers
- **Primary Statutory Liability**: HIPAA Safe Harbor (45 CFR § 164.514) & FDA 21 CFR Part 11
- **Direct Answer (Featured Snippet)**: Sanitizing clinical trial electronic Case Report Forms (eCRF) for ChatGPT requires masking patient subject IDs, site investigator names, medical record numbers (MRNs), and exact admission dates, while preserving clinical endpoints, adverse event grades (CTCAE v5.0), and pharmacodynamic dosages in cleartext. Local RAM scrubbing ensures 100% HIPAA Safe Harbor compliance without cloud data sharing agreements.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Subject ID / Patient Study Screening # | **REDACT** | `[SUBJ_1]` | HIPAA Safe Harbor direct patient research identifier; re-identification risk |
  | Medical Record Number (MRN) & Hospital ID | **REDACT** | `[MRN_1]` | Direct healthcare identifier subject to HIPAA civil monetary penalties |
  | Treating Physician & Site Investigator Names | **REDACT** | `[PROVIDER_1]` | Clinical site personnel PII; leaks institutional trial site location |
  | Exact Admission & Dosing Calendar Dates | **REDACT** | `[DATE_1]` | HIPAA identifier; must be converted to relative study days (e.g. Day 1, Week 4) |
  | CTCAE Adverse Event Severity Grade (e.g. Grade 3) | **PRESERVE** | `Cleartext (Grade 3 Neutropenia)` | Mandatory clinical endpoint required for AI drug safety assessment |
  | Dosage, Regimen & Route of Administration | **PRESERVE** | `Cleartext (75 mg/m2 IV q3w)` | Pharmacokinetic data required for AI efficacy and toxicity modeling |
  | Laboratory Values & Biomarker Concentrations | **PRESERVE** | `Cleartext (ANC 0.8 x 10^9/L)` | Quantitative diagnostic metrics necessary for clinical trial reporting |

---

### 5. AWS CloudTrail Event Logs & Terraform State Files
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/prevent-aws-keys-leak-in-chatgpt/
- **Target Persona**: DevSecOps Engineers, Cloud Architects & SRE Leads
- **Primary Statutory Liability**: SOC 2 Type II (CC6.1 Logical Access) & CIS AWS Foundations Benchmark
- **Direct Answer (Featured Snippet)**: Sanitizing AWS CloudTrail logs and Terraform manifests before AI troubleshooting requires masking AWS access keys (AKIA/ASIA), account IDs, IAM user ARNs, and private CIDR IPs, while keeping event names (e.g. PutBucketPolicy), error codes (AccessDenied), and resource types in cleartext. Local pre-prompt sanitization blocks Shadow AI credential exposure without halting dev speed.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | AWS Access Key IDs (AKIA/ASIA...) | **REDACT** | `[API_KEY_1]` | Critical 20-character cloud credential; immediate account compromise risk |
  | AWS Secret Access Keys & Session Tokens | **REDACT** | `[SECRET_1]` | High-entropy cryptographic secret; grants full programmatic cloud control |
  | IAM User ARNs & Account 12-Digit IDs | **REDACT** | `[USER_ARN_1]` | Discloses internal infrastructure topology and corporate user identities |
  | Private IPv4 / IPv6 Subnet Addresses | **REDACT** | `[IP_1]` | Internal VPC footprinting vector; exposes internal network topography |
  | CloudTrail Event Names & Service RPCs | **PRESERVE** | `Cleartext (AssumeRole, Decrypt)` | Mandatory API action required for AI security root-cause analysis |
  | Error Codes & HTTP Response Status | **PRESERVE** | `Cleartext (AccessDenied, 403)` | Essential diagnostic codes required for AI debugging of IAM permission policies |
  | AWS Region & Service Identifiers | **PRESERVE** | `Cleartext (us-east-1, kms.amazonaws.com)` | Required context for multi-region architecture and latency troubleshooting |

---

### 6. SBA Form 1919 & Commercial Credit Underwriting Memo
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/commercial-lending-sba-loan-ai-privacy/
- **Target Persona**: Commercial Lending Underwriters, Credit Analysts & SBA Loan Officers
- **Primary Statutory Liability**: Equal Credit Opportunity Act (ECOA Reg B), GLBA & SBA SOP 50 10
- **Direct Answer (Featured Snippet)**: To safely analyze SBA 7(a) and 504 loan packages with AI, redact borrower SSNs, guarantor legal names, tax IDs, and residential addresses, while preserving Debt Service Coverage Ratios (DSCR), historical EBITDA, loan amounts, and collateral valuations in cleartext. Local RAM scrubbing enforces ECOA Reg B anti-bias protections and GLBA safeguards without disclosing nonpublic borrower financials.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Borrower & Guarantor Full Legal Names | **REDACT** | `[NAME_1], [NAME_2]` | GLBA nonpublic personal information; exposes guarantor identity to cloud models |
  | Guarantor SSN & Personal Tax IDs | **REDACT** | `[SSN_1]` | Statutory identity theft vector; strictly prohibited under FTC Safeguards Rule |
  | Operating Business FEIN & Street Address | **REDACT** | `[TAX_ID_1], [ADDRESS_1]` | Commercial entity identifier enabling direct commercial registry de-anonymization |
  | 10-Digit SBA Loan Application Number | **REDACT** | `[LOAN_ID_1]` | Federal agency tracking reference vulnerable to E-Tran database correlation |
  | Requested Loan Amount & Term | **PRESERVE** | `Cleartext ($1,750,000 / 120 mos)` | Core debt sizing metric required for AI amortization and payment scheduling |
  | Historical DSCR & Global Cash Flow | **PRESERVE** | `Cleartext (DSCR: 1.38x)` | Essential underwriting ratio required for repayment capacity verification |
  | Collateral Fair Market Value (FMV) & LTV | **PRESERVE** | `Cleartext ($2,400,000 / 72.9% LTV)` | Necessary for SBA loan-to-value coverage and recovery risk modeling |

---

### 7. Fannie Mae Form 1004 & CRE Lease Abstract Matrix
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/commercial-real-estate-rent-roll-ai-redaction/
- **Target Persona**: Commercial Real Estate Appraisers, Acquisitions Associates & Asset Managers
- **Primary Statutory Liability**: GLBA Nonpublic Information & Proprietary Tenant Lease Confidentiality
- **Direct Answer (Featured Snippet)**: Sanitizing commercial lease abstracts, estoppels, and rent rolls for AI requires redacting tenant company names, guarantor signatures, unit suite numbers, and notice addresses, while preserving rentable square footage, base rent per SF, escalation formulas, and lease expiration dates in cleartext. Local RAM tokenization safeguards proprietary tenant rosters while enabling AI to calculate weighted average lease term (WALT).
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Commercial Tenant Trade & Entity Names | **REDACT** | `[TENANT_1], [TENANT_2]` | Proprietary tenant roster; exposes corporate occupancy and expansion plans |
  | Suite / Unit Specific Numbers | **REDACT** | `[SUITE_1]` | Internal building floorplan identifier; allows spatial de-anonymization |
  | Notice Addresses & Resident Agent Contacts | **REDACT** | `[ADDRESS_1], [EMAIL_1]` | Corporate contact PII protected under commercial confidentiality covenants |
  | Rentable Square Footage (RSF) | **PRESERVE** | `Cleartext (14,250 RSF)` | Mandatory structural metric for pro-rata operating expense calculations |
  | Base Rent per SF & CPI Escalation Rate | **PRESERVE** | `Cleartext ($38.50/RSF NNN, 3.0% CPI)` | Core cashflow variables required for AI Net Operating Income (NOI) modeling |
  | Lease Commencement & Expiration Dates | **PRESERVE** | `Cleartext (04/01/2022 - 03/31/2032)` | Critical for rollover schedule and Weighted Average Lease Term (WALT) analysis |
  | Tenant Improvement Allowance & Concessions | **PRESERVE** | `Cleartext ($65.00/RSF TIA, 4 mos abated)` | Required for underwriting net effective rent and capital expenditure reserves |

---

### 8. M&A Confidential Information Memorandum (CIM) & VDR Data
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/mergers-acquisitions-due-diligence-ai/
- **Target Persona**: Investment Bankers, Private Equity Associates & M&A Legal Counsel
- **Primary Statutory Liability**: SEC Rule 10b-5 (Material Nonpublic Information / MNPI) & Non-Disclosure Agreements
- **Direct Answer (Featured Snippet)**: Redacting M&A Confidential Information Memorandums (CIM) and Virtual Data Room (VDR) exports for AI requires masking target company names, key executive salaries, major customer identities, and deal code names, while keeping EBITDA margins, churn rates, TAM sizing, and recurring revenue breakdowns in cleartext. Local RAM sanitization eliminates insider trading liabilities under SEC Rule 10b-5 and preserves strict NDA covenants.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Target Company Legal & Trade Names | **REDACT** | `[TARGET_1]` | Primary entity identifier; immediate Material Nonpublic Information (MNPI) disclosure |
  | Deal Code Names & Project Identifiers | **REDACT** | `[DEAL_CODE_1]` | Internal advisory code name vulnerable to cross-firm deal rumor matching |
  | Top 5 Customer & Vendor Enterprise Names | **REDACT** | `[CUSTOMER_1], [VENDOR_1]` | Confidential commercial relationships; violates non-solicitation & NDA terms |
  | Named Executive Officers (C-Suite) | **REDACT** | `[NAME_1], [NAME_2]` | Key personnel identity; triggers poaching risk during pre-signing diligence |
  | Annual Recurring Revenue (ARR) & Growth Rate | **PRESERVE** | `Cleartext ($42.8M ARR, 34% YoY)` | Core valuation benchmark essential for AI revenue multiple benchmarking |
  | Adjusted EBITDA & Gross Margin Percentage | **PRESERVE** | `Cleartext (EBITDA $9.4M / 22% margin)` | Required for DCF cashflow forecasting and buyout leverage modeling |
  | Net Retention Rate (NRR) & Logo Churn | **PRESERVE** | `Cleartext (118% NRR, 4.2% annual churn)` | Critical SaaS health metrics necessary for investment thesis evaluation |

---

### 9. Irrevocable Family Trust Agreement & Asset Schedules
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-irrevocable-trust-documents-for-chatgpt/
- **Target Persona**: Estate Planning Attorneys, Trust Officers & Family Office Advisors
- **Primary Statutory Liability**: Attorney-Client Privilege (FRE 502), Fiduciary Duty & Uniform Trust Code (UTC)
- **Direct Answer (Featured Snippet)**: Redacting irrevocable family trust agreements and estate schedules for ChatGPT requires stripping grantor names, trustee identities, beneficiary addresses, and trust tax IDs, while keeping distribution formulas, per stirpes shares, vesting ages, and powers of appointment in cleartext. In-browser RAM scrubbing prevents waiver of attorney-client privilege and protects generational wealth privacy.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Grantor / Settlor Legal Full Name | **REDACT** | `[GRANTOR_1]` | Establishes the family estate identity; subject to probate cross-matching |
  | Trustee & Successor Trustee Names | **REDACT** | `[TRUSTEE_1], [TRUSTEE_2]` | Fiduciary personal identity; exposes managing family members or trust counsel |
  | Beneficiary Names, DOBs & Family Ties | **REDACT** | `[BENEFICIARY_1], [DOB_1]` | Minor or descendant privacy; high risk for targeted family exploitation |
  | Trust Tax ID / Dedicated Trust EIN | **REDACT** | `[TAX_ID_1]` | Federal trust entity identifier subject to IRS fiduciary return matching |
  | Percentage Allocation & Per Stirpes Shares | **PRESERVE** | `Cleartext (50% equal shares per stirpes)` | Core structural formula required for AI estate tax and distribution modeling |
  | Distribution Milestones & Vesting Ages | **PRESERVE** | `Cleartext (One-third at 25, half at 30, balance at 35)` | Substantive trust terms necessary for AI trust lifecycle analysis |
  | Discretionary Principal & HEMS Standards | **PRESERVE** | `Cleartext (Health, Education, Maintenance, Support)` | Statutory standard required for fiduciary discretion review and drafting |

---

### 10. High-Net-Worth Portfolio & Custody Statement
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-portfolio-aum-values-in-ai-tools/
- **Target Persona**: Wealth Managers, Private Wealth Advisors & Fiduciary RIAs
- **Primary Statutory Liability**: SEC Regulation S-P (17 CFR Part 248) & FINRA Rule 2010
- **Direct Answer (Featured Snippet)**: Sanitizing high-net-worth portfolio statements and AUM allocations for AI tools requires masking client account numbers, individual client names, custodian clearing IDs, and private banking branches, while keeping asset class weightings, ticker symbols, dividend yields, and risk beta metrics in cleartext. Zero-server RAM processing ensures 100% SEC Reg S-P compliance without exposing client wealth figures to cloud training pools.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Client Full Legal Name & Co-Account Holders | **REDACT** | `[NAME_1], [NAME_2]` | SEC Reg S-P consumer identity; directly identifies high-net-worth individuals |
  | Brokerage & Custody Account Numbers | **REDACT** | `[ACCOUNT_1]` | Financial access identifier; exposes account to clearing house profiling |
  | Client Residential Address & Domicile | **REDACT** | `[ADDRESS_1]` | Physical location PII; enables targeted wealth and residency de-anonymization |
  | Custodian Clearing Agent & Branch Code | **REDACT** | `[CUSTODIAN_1]` | Discloses institutional banking routing and relationship manager details |
  | Asset Class Allocation Percentages | **PRESERVE** | `Cleartext (Equities 62%, Fixed Income 28%, Cash 10%)` | Core allocation metrics required for AI modern portfolio theory (MPT) rebalancing |
  | Public Equity Tickers & Security CUSIPs | **PRESERVE** | `Cleartext (AAPL, MSFT, BND, VTI)` | Public financial instruments necessary for AI sector exposure and correlation analysis |
  | Portfolio Weighted Yield & Duration | **PRESERVE** | `Cleartext (3.24% Yield, 5.8 yrs Duration)` | Required for evaluating fixed-income interest rate sensitivity and cash generation |

---

### 11. ACH Authorization & Commercial Wire Transfer Schedule
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/masking-aba-routing-and-account-numbers-for-ai/
- **Target Persona**: Corporate Treasurers, Accounts Payable Controllers & Bank Operations Officers
- **Primary Statutory Liability**: NACHA Operating Rules, GLBA 16 CFR Part 314 & UCC Article 4A
- **Direct Answer (Featured Snippet)**: Masking ABA routing transit numbers and Demand Deposit Account (DDA) numbers for AI financial processing requires tokenizing 9-digit ABA routing codes, beneficiary bank account numbers, SWIFT BICs, and signatory names, while keeping transaction batch totals, invoice reference amounts, and payment settlement dates in cleartext. Client-side RAM redaction eliminates unauthorized debit risks under NACHA rules and UCC Article 4A.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | 9-Digit ABA Routing Transit Number (RTN) | **REDACT** | `[ROUTING_1]` | Mandatory Federal Reserve routing code; exposes receiving financial institution |
  | Bank Account / DDA Checking Number | **REDACT** | `[ACCOUNT_1]` | Direct debit credential; immediate fraud and unauthorized ACH transfer risk |
  | Beneficiary Signatory & Authorized Officers | **REDACT** | `[NAME_1]` | Personal authorization identity protected under corporate treasury controls |
  | SWIFT BIC / Clearing Identifier | **REDACT** | `[SWIFT_1]` | International bank identifier enabling targeted correspondent routing profile |
  | Payment Settlement Date & Execution Terms | **PRESERVE** | `Cleartext (Effective: 03/15/2026, Same-Day ACH)` | Operational timeline necessary for AI cashflow forecasting and liquidity management |
  | Gross Payment & Line-Item Invoice Amounts | **PRESERVE** | `Cleartext ($384,150.00)` | Quantitative accounting figure required for ledger reconciliation and ERP sync |
  | Remittance Reference / General Ledger Code | **PRESERVE** | `Cleartext (GL: 2100-00-AP, INV-8891)` | Required for automated accounting classification and 3-way purchase order matching |

---

### 12. Insurance First Notice of Loss (FNOL) & Policy Declarations
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-claim-numbers-and-policy-ids-for-ai/
- **Target Persona**: Claims Adjusters, Insurance Underwriters & Special Investigation Unit (SIU) Leads
- **Primary Statutory Liability**: State Insurance Privacy Acts (NAIC Model #670), GLBA & HIPAA Title II
- **Direct Answer (Featured Snippet)**: Redacting insurance claim numbers and policy IDs for AI claims triage requires masking policyholder names, claimant VINs, policy serial numbers, and incident street addresses, while keeping claim loss types, policy deductible limits, damage severity codes, and liability coverage amounts in cleartext. Local RAM sanitization protects policyholder confidentiality and ensures compliance with NAIC Model #670.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Policyholder & Claimant Full Names | **REDACT** | `[NAME_1], [NAME_2]` | NAIC Model #670 personal identity; prevents public attribution of claims history |
  | Policy Number & Claim Docket ID | **REDACT** | `[POLICY_ID_1], [CLAIM_ID_1]` | Direct insurer policy identifier subject to CLUE insurance database correlation |
  | Vehicle Identification Number (VIN) | **REDACT** | `[VIN_1]` | Standard 17-character ISO 3779 vehicle identifier; enables vehicle history tracking |
  | Loss Location / Residential Street Address | **REDACT** | `[ADDRESS_1]` | Physical loss geography; creates privacy and neighborhood profiling risks |
  | Per-Occurrence & Aggregate Coverage Limits | **PRESERVE** | `Cleartext ($500,000 / $1,000,000 CSL)` | Mandatory contractual limits required for AI reserve calculation and exposure sizing |
  | Policy Deductible & Endorsement Terms | **PRESERVE** | `Cleartext ($1,000 Comprehensive / $1,000 Collision)` | Required for determining insurer net payout vs insured out-of-pocket obligation |
  | Loss Type & Property Damage Description | **PRESERVE** | `Cleartext (Rear-End Collision, Front Bumper / Radiator)` | Substantive claim facts required for AI repair estimation and fraud pattern triage |

---

### 13. Actuarial Loss Run Report & Case Reserve Ledger
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-loss-amounts-and-settlement-reserves/
- **Target Persona**: Property & Casualty Actuaries, Reinsurance Underwriters & Risk Managers
- **Primary Statutory Liability**: Confidentiality of Work Product, Actuarial Standards of Practice (ASOP 43) & GLBA
- **Direct Answer (Featured Snippet)**: Sanitizing actuarial loss runs and settlement reserve ledgers for AI analysis requires redacting specific claimant names, attorney law firm identities, claim reference numbers, and litigation case captions, while preserving paid losses, case reserves, Incurred But Not Reported (IBNR) totals, and policy year loss ratios in cleartext. Local client-side processing prevents disclosing strategic reserve figures to opposing trial counsel.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Claimant & Injured Party Legal Names | **REDACT** | `[NAME_1], [NAME_2]` | Personal identity; subject to HIPAA and state insurance privacy safeguards |
  | Opposing Plaintiff Law Firm & Counsel | **REDACT** | `[LAW_FIRM_1], [ATTORNEY_1]` | Identifies litigation counterparties; exposes trial bargaining tactics |
  | Claim File & Litigation Docket Numbers | **REDACT** | `[CLAIM_ID_1]` | Discloses active court dockets vulnerable to public court scraping |
  | Paid Loss & Legal Defense Incurred (ALAE) | **PRESERVE** | `Cleartext (Paid: $125,000 / ALAE: $42,500)` | Historical payout data essential for AI loss development triangle modeling |
  | Open Case Indemnity Reserve Allocation | **PRESERVE** | `Cleartext (Reserve: $350,000.00)` | Required for actuarial ultimate loss estimation and IBNR calibration |
  | Policy Accident Year & Valuation Date | **PRESERVE** | `Cleartext (AY 2023, Evaluated as of 12/31/2025)` | Mandatory cohort anchor required for age-to-age loss development factors |
  | Loss Ratio & Earned Premium Baseline | **PRESERVE** | `Cleartext (Loss Ratio: 64.2%, Earned: $2.4M)` | Necessary for evaluating reinsurance treaty attachment points and pricing |

---

### 14. SEC Form ADV Part 2A Brochure & Private Placement Memo (PPM)
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/wealth-management-sec-finra-ai/
- **Target Persona**: Chief Compliance Officers (CCO), Registered Investment Advisors & RIA Partners
- **Primary Statutory Liability**: SEC Regulation S-P, Investment Advisers Act Rule 204-2 & FINRA Rule 2210
- **Direct Answer (Featured Snippet)**: Safely using AI for RIA compliance reviews and PPM summaries requires redacting managing member identities, proprietary investor rosters, individual fee concessions, and private banking routing details, while keeping fee tier schedules, custodian names, investment strategies, and statutory disclaimers in cleartext. In-browser RAM detokenization ensures strict compliance with SEC Regulation S-P and Rule 204-2 recordkeeping.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Managing Members & Portfolio Manager Legal Names | **REDACT** | `[NAME_1], [NAME_2]` | Identifies individual investment personnel; subject to targeted recruiting and scrutiny |
  | High-Net-Worth Investor Names & Commitments | **REDACT** | `[INVESTOR_1]` | Proprietary client capital roster protected under SEC Reg S-P nonpublic rules |
  | Custom Fee Schedule Side Letters & Concessions | **REDACT** | `[FEE_TERM_1]` | Confidential commercial fee arrangement vulnerable to Most-Favored-Nation (MFN) breach |
  | Standard Published Advisory Fee Schedule | **PRESERVE** | `Cleartext (1.00% first $1M, 0.75% next $4M, 0.50% balance)` | Required for AI compliance review against Form ADV Part 2A fee disclosures |
  | Designated Institutional Custodians | **PRESERVE** | `Cleartext (Charles Schwab, Fidelity Clearing)` | Public custodial relationship required for RIA trading authority analysis |
  | Investment Strategy & Asset Selection Rules | **PRESERVE** | `Cleartext (Long-Horizon Global Quality Dividend Growth)` | Substantive investment thesis required for suitability analysis under Reg BI |
  | Statutory Risk Disclaimers & Conflicts of Interest | **PRESERVE** | `Cleartext (Past performance does not guarantee future results)` | Mandatory disclosure text required for FINRA Rule 2210 marketing compliance checks |

---

### 15. IRS Form 1099-NEC & 1099-MISC Information Returns
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-ein-and-tax-ids-for-chatgpt/
- **Target Persona**: Accounts Payable Managers, Corporate Controllers & CPA Tax Staff
- **Primary Statutory Liability**: IRC § 6103, IRC § 6721 (Information Return Penalties) & GLBA 16 CFR Part 314
- **Direct Answer (Featured Snippet)**: Redacting Form 1099-NEC and 1099-MISC returns for ChatGPT requires masking recipient SSNs, individual contractor names, payer EINs, and residential addresses, while keeping Box 1 Nonemployee Compensation, federal tax withholding, state allocations, and tax year dates in cleartext. Zero-server RAM detokenization eliminates corporate tax ID spoofing and protects contractor identity without halting AI tax reconciliation.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Recipient Contractor SSN or Individual Taxpayer ID (ITIN) | **REDACT** | `[SSN_1]` | IRC § 6103 confidential taxpayer info; severe identity theft vulnerability |
  | Payer Corporate Identification Number (FEIN) | **REDACT** | `[TAX_ID_1]` | Discloses corporate tax identity; enables fraudulent IRS information filings |
  | Recipient Legal Name & DBA Trade Name | **REDACT** | `[NAME_1]` | Independent contractor identity protected under employment privacy regulations |
  | Payer & Recipient Street Addresses | **REDACT** | `[ADDRESS_1], [ADDRESS_2]` | Corporate office and residential location PII subject to commercial profiling |
  | Box 1: Nonemployee Compensation | **PRESERVE** | `Cleartext ($87,450.00)` | Mandatory quantitative metric required for AI Form 1099-to-ledger reconciliation |
  | Box 4: Federal Income Tax Withheld | **PRESERVE** | `Cleartext ($17,490.00)` | Required for verifying backup withholding compliance under IRC § 3406 |
  | Box 5: State Tax Withheld & Box 7 State Income | **PRESERVE** | `Cleartext ($4,372.50 / $87,450.00)` | Necessary for state information return filing and apportionment calculations |

---

### 16. Bilateral Non-Disclosure Agreement (NDA) & Trade Secret Schedule
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-ndas-for-ai/
- **Target Persona**: Corporate Paralegals, Contract Managers & In-House Legal Counsel
- **Primary Statutory Liability**: Defend Trade Secrets Act (18 U.S.C. § 1836) & Uniform Trade Secrets Act (UTSA)
- **Direct Answer (Featured Snippet)**: Redacting bilateral NDAs and trade secret disclosure schedules for AI contract review requires masking disclosing party names, proprietary product codenames, technical formulas, and officer signatories, while preserving confidentiality term lengths, governing law, carve-out exclusions, and injunctive relief clauses in cleartext. Local RAM scrubbing preserves trade secret legal protections under 18 U.S.C. § 1836 without cloud data exposure.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Disclosing & Receiving Party Legal Entities | **REDACT** | `[ORG_1], [ORG_2]` | Corporate counterparty identity; exposes strategic partnerships and acquisition interest |
  | Authorized Officer Signatories & Titles | **REDACT** | `[NAME_1], [NAME_2]` | Personal executive identity protected under corporate privacy standards |
  | Confidential Project Codename & Technical IP | **REDACT** | `[PROJECT_1], [IP_TERM_1]` | Core trade secret subject to forfeiture if ingested into LLM training corpora |
  | Corporate Notice Street Addresses | **REDACT** | `[ADDRESS_1], [ADDRESS_2]` | Physical corporate location PII subject to commercial surveillance |
  | Confidentiality Term & Survival Duration | **PRESERVE** | `Cleartext (5 Years / Trade Secrets Perpetual)` | Core contractual duration required for AI contract lifecycle risk assessment |
  | Standard Confidentiality Carve-Outs | **PRESERVE** | `Cleartext (Publicly known, independently developed, court ordered)` | Substantive legal exceptions required for AI cross-examination and compliance check |
  | Governing Law & Dispute Jurisdiction | **PRESERVE** | `Cleartext (State of Delaware, Court of Chancery)` | Mandatory forum clause required for legal risk and enforceability analysis |

---

### 17. Deposition Testimony & Cross-Examination Record
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-deposition-transcripts-ai/
- **Target Persona**: Trial Attorneys, Litigation Associates & Certified Court Reporters
- **Primary Statutory Liability**: FRCP Rule 5.2 (Privacy Protection for Filings) & ABA Model Rule 1.6
- **Direct Answer (Featured Snippet)**: Anonymizing deposition transcripts for AI litigation digest requires stripping witness full names, residential addresses, minor identities, and confidential financial figures, while keeping transcript line numbers (e.g. 0014:02), examination colloquy, objections on the record, and factual testimony in cleartext. Client-side browser RAM tokenization safeguards work-product privilege under FRE 502 and prevents witness intimidation.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Deponent & Fact Witness Legal Names | **REDACT** | `[DEPONENT_1], [WITNESS_1]` | FRCP Rule 5.2 privacy safeguard; prevents witness harassment and doxxing |
  | Witness Residential Addresses & Telephones | **REDACT** | `[ADDRESS_1], [PHONE_1]` | Personal privacy; protected against public disclosure in trial records |
  | Litigation Case Number & Court Docket | **REDACT** | `[CASE_ID_1]` | Prevents commercial AI engines from correlating testimony with court docket filings |
  | Confidential Settlement & Severance Sums | **REDACT** | `[MONEY_1]` | Protected under private settlement agreements and judicial sealing orders |
  | Transcript Timestamp & Line Coordinates | **PRESERVE** | `Cleartext (0018:04 - 0018:22)` | Mandatory for precise trial citation, cross-examination, and impeachment |
  | Counsel of Record & Attorney Objections | **PRESERVE** | `Cleartext (Objection, form. Foundation.)` | Essential procedural context needed to evaluate testimony admissibility |
  | Substantive Factual Narrative & Admissions | **PRESERVE** | `Cleartext` | Core evidentiary facts required for AI chronologies and deposition summaries |

---

### 18. Asset Purchase Agreement (APA) & Disclosure Schedules
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/scrub-mergers-acquisitions-documents/
- **Target Persona**: M&A Partners, Corporate Associates & Transactional Legal Counsel
- **Primary Statutory Liability**: Securities Act § 11, SEC Rule 10b-5 (MNPI) & M&A Fiduciary Duties
- **Direct Answer (Featured Snippet)**: Scrubbing Asset Purchase Agreements (APA) and disclosure schedules before AI due diligence requires redacting buyer and seller corporate entities, purchase price escrows, key employee non-compete names, and undisclosed litigation targets, while preserving working capital peg formulas, indemnity caps, basket thresholds, and material adverse effect (MAE) clauses in cleartext. Local RAM sanitization neutralizes insider trading exposure and preserves deal exclusivity.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Buyer & Seller Parent Corporate Entities | **REDACT** | `[BUYER_1], [SELLER_1]` | Primary M&A transaction parties; immediate public leak of corporate takeover |
  | Specific Purchase Price & Escrow Dollar Values | **REDACT** | `[PURCHASE_PRICE_1]` | Confidential commercial valuation; leaks transaction consideration before 8-K filing |
  | Key Retained Executives & Founder Names | **REDACT** | `[FOUNDER_1], [EXEC_1]` | Exposes key personnel retention agreements and non-compete liabilities |
  | Disclosed Threatened Litigation Targets | **REDACT** | `[LITIGATION_1]` | Non-public legal liabilities listed in Schedule 3.14; critical privilege risk |
  | Indemnification Cap & Basket Percentages | **PRESERVE** | `Cleartext (0.50% Deductible Basket, 10% General Cap)` | Mandatory risk allocation formula required for AI deal term benchmarking |
  | Working Capital True-Up & Peg Formula | **PRESERVE** | `Cleartext (Target Net Working Capital: $4,500,000)` | Core post-closing adjustment mechanism required for balance sheet reconciliation |
  | Material Adverse Effect (MAE) Standards | **PRESERVE** | `Cleartext (Standard Delaware carve-outs including industry downturn)` | Essential closing condition clause required for deal certainty analysis |

---

### 19. E-Discovery Production Bates Sheet & Privilege Log
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/e-discovery-pii-redaction/
- **Target Persona**: E-Discovery Specialists, Litigation Support Managers & Review Attorneys
- **Primary Statutory Liability**: FRCP Rule 26(b)(5) (Privilege Logging) & Federal Rules of Evidence 502
- **Direct Answer (Featured Snippet)**: Sanitizing E-Discovery production dumps and privilege logs for AI document review requires redacting client employee names, external counsel email addresses, custodian phone numbers, and protected trade names, while preserving sequential Bates numbers (e.g. ABC-0019482), privilege justification codes (e.g. Attorney-Client / Work-Product), and document date metadata in cleartext. Local offline processing ensures zero waiver of evidentiary privilege.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Document Author, Custodian & Recipient Names | **REDACT** | `[NAME_1], [CUSTODIAN_1]` | Corporate personnel PII; exposes employee custodians to unauthorized profiling |
  | Internal & External Counsel Email Addresses | **REDACT** | `[EMAIL_1], [EMAIL_2]` | Direct legal counsel identifiers; subject to opposing counsel contact rules |
  | Confidential Internal Project Names | **REDACT** | `[PROJECT_1]` | Internal non-public operational terms; leaks proprietary corporate roadmaps |
  | Sequential Bates Numbers & Page Bounds | **PRESERVE** | `Cleartext (Bates: APEX-0048190 to APEX-0048205)` | Mandatory evidentiary tracking coordinates for court motions and exhibit marking |
  | Privilege Classification Basis & Ground | **PRESERVE** | `Cleartext (Attorney-Client Privilege / Work-Product Doctrine)` | Required legal categorization under FRCP Rule 26(b)(5) for AI privilege review |
  | Document Creation & Transmission Date | **PRESERVE** | `Cleartext (2025-11-14 16:42 UTC)` | Essential timeline coordinate required for chronological eDiscovery indexing |
  | Document Type & Production File Format | **PRESERVE** | `Cleartext (Email Thread .msg / Excel Model .xlsx)` | Required metadata for verifying technical production completeness |

---

### 20. Attorney-Client Legal Advice Memo & Work Product
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/attorney-client-privilege-ai-2026/
- **Target Persona**: General Counsel, Law Firm Partners & Compliance Legal Directors
- **Primary Statutory Liability**: Federal Rules of Evidence Rule 502, ABA Formal Opinion 512 & Restatement § 73
- **Direct Answer (Featured Snippet)**: Protecting attorney-client privilege in AI legal workflows requires tokenizing client names, adverse counterparty entities, confidential case facts, and attorney identifying credentials, while preserving statutory citations (e.g. 15 U.S.C. § 1), legal standards of review, procedural posture, and hypothetical arguments in cleartext. Local client-side RAM detokenization eliminates third-party waiver under FRE Rule 502 and ABA Formal Opinion 512.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Client Corporate & Individual Legal Names | **REDACT** | `[CLIENT_1]` | Direct client identity; third-party disclosure constitutes per se subject-matter privilege waiver |
  | Adverse Litigant & Investigating Agency Names | **REDACT** | `[ADVERSE_PARTY_1]` | Identifies opposing enforcement targets; risks premature disclosure of regulatory probes |
  | Confidential Client Factual Admissions | **REDACT** | `[FACT_STATEMENT_1]` | Sensitive admissions of internal liability; highest discoverability danger |
  | Statutory Citations & Legal Precedents | **PRESERVE** | `Cleartext (15 U.S.C. § 1, Sherman Act; FTC v. Actavis)` | Public legal authorities necessary for AI legal research and case law synthesis |
  | Standards of Review & Burden of Proof | **PRESERVE** | `Cleartext (Rule of Reason, Clear and Convincing Evidence)` | Mandatory judicial doctrine required for legal risk assessment |
  | Procedural Posture & Motion Deadlines | **PRESERVE** | `Cleartext (Motion to Dismiss due within 21 days under FRCP 12(b)(6))` | Procedural rules needed for AI litigation calendaring and motion outlining |

---

### 21. State & Federal Court Pleading / Complaint Filing
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/court-doc-redaction/
- **Target Persona**: Litigation Attorneys, Appellate Law Clerks & Legal Secretaries
- **Primary Statutory Liability**: FRCP Rule 5.2, Federal Rules of Appellate Procedure Rule 25 & State Court Privacy Rules
- **Direct Answer (Featured Snippet)**: Redacting civil and criminal court pleadings for AI drafting requires masking individual party names, SSNs, financial account numbers, dates of birth, and home addresses, while keeping legal causes of action (e.g. Breach of Contract, Fraud), jurisdictional grounds (e.g. 28 U.S.C. § 1332), prayers for relief, and procedural dates in cleartext. Local offline detokenization ensures 100% compliance with court filing privacy rules and prevents contempt of court sanctions.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Individual Plaintiff & Defendant Full Names | **REDACT** | `[PLAINTIFF_1], [DEFENDANT_1]` | Court privacy safeguard under FRCP Rule 5.2(a)(3); protects private civil parties |
  | Personal Social Security & National Tax IDs | **REDACT** | `[SSN_1]` | Mandatory federal filing redaction under Rule 5.2; severe identity theft penalty |
  | Financial Account & Credit Card Numbers | **REDACT** | `[ACCOUNT_1]` | FRCP 5.2(a)(4) mandate; must be truncated to last 4 digits or completely tokenized |
  | Minor Child Full Legal Names | **REDACT** | `[MINOR_1]` | Mandatory federal redaction under FRCP 5.2(a)(2); must only use initials |
  | Causes of Action & Legal Claims | **PRESERVE** | `Cleartext (Count I: Breach of Fiduciary Duty, Count II: Conversion)` | Substantive claims required for AI answer, motion to dismiss, and jury instruction drafting |
  | Federal Subject-Matter Jurisdiction Basis | **PRESERVE** | `Cleartext (28 U.S.C. § 1332 Diversity Jurisdiction, Amount in Controversy > $75k)` | Core jurisdictional elements required for AI removal and remand analysis |
  | Prayer for Relief & Specific Damages | **PRESERVE** | `Cleartext (Compensatory damages, exemplary damages, statutory interest)` | Remedy demands necessary for legal claim evaluation and settlement modeling |

---

### 22. Master Services Agreement (MSA) & Statement of Work (SOW)
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/secure-contract-ai/
- **Target Persona**: Procurement Specialists, Commercial Legal Directors & Contract Managers
- **Primary Statutory Liability**: Commercial Contract Breach, GLBA Safeguards & CUI/NIST SP 800-171
- **Direct Answer (Featured Snippet)**: Securing Master Services Agreements (MSAs) and Statements of Work (SOW) before AI ingestion requires stripping enterprise customer names, contractor payment routing details, key personnel names, and internal pricing tiers, while preserving limitation of liability multiples (e.g. 2x Annual Contract Value), indemnification scopes, SLA uptime percentages (99.9%), and termination for convenience windows in cleartext. Offline browser-side sanitization prevents leaks of commercial negotiating benchmarks.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Client & Enterprise Vendor Legal Names | **REDACT** | `[CLIENT_1], [VENDOR_1]` | Commercial customer entity identity; reveals corporate vendor ecosystem and pricing |
  | Contractor Payment Details & ACH Routing | **REDACT** | `[BANK_1], [ACCOUNT_1]` | Treasury banking credentials; critical financial fraud prevention |
  | Assigned Project Staff & Consultant Names | **REDACT** | `[NAME_1], [NAME_2]` | Individual service personnel identity protected under commercial consulting confidentiality |
  | Limitation of Liability (LoL) Multipliers | **PRESERVE** | `Cleartext (2x Fees Paid in Preceding 12 Months / Super-Cap $5M)` | Critical risk ceiling clause required for AI contract benchmark analysis |
  | SLA Uptime & Service Credit Percentages | **PRESERVE** | `Cleartext (99.9% Uptime / 10% Monthly Fee Credit for Outages)` | Core operational performance benchmarks required for SLA risk evaluation |
  | Termination for Convenience Windows | **PRESERVE** | `Cleartext (30 Days Prior Written Notice)` | Essential contract flexibility clause required for commercial commitment modeling |
  | Mutual Intellectual Property Assignment | **PRESERVE** | `Cleartext (Customer retains Work Product; Vendor retains Background IP)` | Core IP ownership terms required for corporate risk review |

---

### 23. Form I-140 / I-485 Immigration Petition & Consular Record
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/immigration-lawyer-ai/
- **Target Persona**: Immigration Attorneys, Global Mobility Specialists & DOJ Accredited Reps
- **Primary Statutory Liability**: INA § 222(f) (Confidentiality of Visa Records), Privacy Act of 1974 & USCIS Policies
- **Direct Answer (Featured Snippet)**: Sanitizing Form I-140 immigrant petitions and I-485 adjustment of status filings for AI immigration drafting requires masking Alien Registration Numbers (A-Numbers), petitioner FEINs, beneficiary passport numbers, and consular receipt numbers, while keeping SOC occupation codes (e.g. 15-1252), prevailing wage levels ($142,500/yr), priority dates, and EB-category criteria in cleartext. Local offline scrubbing protects immigrant privacy and prevents identity theft in visa processing.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Alien Registration Number (A-Number) | **REDACT** | `[A_NUMBER_1]` | Statutory 9-digit federal immigration identifier; direct immigrant tracing risk |
  | Beneficiary & Derivative Family Names | **REDACT** | `[NAME_1], [NAME_2]` | Foreign national personal identity; subject to visa confidentiality under INA § 222(f) |
  | Foreign Passport & Visa Foil Serial Numbers | **REDACT** | `[PASSPORT_1]` | Sovereign travel credential; immediate identity theft and forgery vulnerability |
  | USCIS 13-Character Receipt Number (LIN/WAC/IOE) | **REDACT** | `[RECEIPT_ID_1]` | Discloses active case docket status in public USCIS Case Status Online tool |
  | Standard Occupational Classification (SOC) Code | **PRESERVE** | `Cleartext (SOC 15-1252 Software Developers)` | Mandatory DOL classification required for AI prevailing wage and specialty occupation analysis |
  | Certified Prevailing Wage & Offered Wage | **PRESERVE** | `Cleartext (Offered: $165,000 / Prevailing Level IV: $152,000)` | Essential quantitative criteria required for immigration wage sufficiency validation |
  | EB Preference Category & Priority Date | **PRESERVE** | `Cleartext (EB-2 National Interest Waiver, Priority Date: 03/15/2023)` | Core statutory classification required for Visa Bulletin cut-off date evaluation |

---

### 24. Patent Application Specification & Invention Disclosure Record
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/ip-attorney-ai-safety/
- **Target Persona**: Patent Attorneys, Patent Agents & Chief Technology Officers (CTO)
- **Primary Statutory Liability**: 35 U.S.C. § 102 (Prior Art / Public Disclosure Bar) & USPTO Duty of Candor
- **Direct Answer (Featured Snippet)**: Redacting unpublished patent applications and invention disclosures for AI prior art drafting requires stripping inventor full names, assignee corporate entities, proprietary internal device codenames, and filing dates, while keeping technical system block diagrams, algorithm pseudo-code, patent claim structures, and statutory novelty claims in cleartext. Client-side browser RAM sanitization prevents triggering premature public disclosure bars under 35 U.S.C. § 102.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Inventor Full Legal Names & Residences | **REDACT** | `[INVENTOR_1], [INVENTOR_2]` | Mandatory USPTO inventorship entity; third-party disclosure triggers premature attribution |
  | Corporate Assignee & Technology Owner | **REDACT** | `[ASSIGNEE_1]` | Identifies corporate patent portfolio owner; exposes competitive R&D roadmaps |
  | Proprietary Internal Hardware Codenames | **REDACT** | `[CODENAME_1]` | Unreleased commercial branding subject to competitor reverse-engineering |
  | Independent & Dependent Claim Hierarchy | **PRESERVE** | `Cleartext (1. A system comprising: a processor; a volatile memory...)` | Core legal claim scope required for AI patent validity and prior art cross-examination |
  | Technical System Architecture & Flowchart Steps | **PRESERVE** | `Cleartext (Step 204: encrypting payload via ephemeral cipher stream)` | Substantive technical mechanics necessary for AI patent drafting under 35 U.S.C. § 112 |
  | International Patent Classification (IPC) Codes | **PRESERVE** | `Cleartext (G06F 21/62, H04L 9/00)` | Public technical classification required for patent examiner search field targeting |

---

### 25. Employee Disciplinary Record & Internal Workplace Investigation Report
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/reviewing-personnel-records-containing-pii/
- **Target Persona**: HR Business Partners (HRBP), Employee Relations Directors & Employment Counsel
- **Primary Statutory Liability**: EEOC Guidelines, Title VII Civil Rights Act & State Personnel Privacy Laws
- **Direct Answer (Featured Snippet)**: Reviewing employee disciplinary records and workplace investigation reports with AI requires masking subject employee names, complainant identities, supervisor names, and employee ID badges, while keeping workplace policy infraction types, disciplinary action tiers (e.g. Written Warning, Suspension), investigation timeline dates, and remediation plans in cleartext. Local RAM sanitization prevents algorithmic hiring bias and protects whistleblower confidentiality.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Subject Employee Full Legal Name & Badge ID | **REDACT** | `[EMPLOYEE_1], [BADGE_1]` | Personnel record identity; triggers severe defamation and privacy claims if leaked |
  | Complainant & Confidential Whistleblower Names | **REDACT** | `[COMPLAINANT_1]` | Mandatory retaliation protection under Title VII and OSHA whistleblower provisions |
  | Witness Legal Names & Coworker Identifiers | **REDACT** | `[WITNESS_1], [WITNESS_2]` | Coworker interview confidentiality; prevents workplace harassment and social hostility |
  | Corporate Workplace Policy Infraction Type | **PRESERVE** | `Cleartext (Violation of Anti-Harassment Policy Section 4.2)` | Substantive rule basis required for AI progressive discipline consistency evaluation |
  | Disciplinary Action Tier & Penalty Imposed | **PRESERVE** | `Cleartext (Final Written Warning & Mandatory Retraining)` | Required for evaluating proportionate employee relations corrective action |
  | Investigation Timeline & Procedural Milestones | **PRESERVE** | `Cleartext (Reported: Day 1; Interviews: Day 3-5; Concluded: Day 10)` | Timeline required for verifying prompt and thorough employer investigation defense |

---

### 26. Diagnostic Radiology & CT/MRI Scan Impression Report
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/anonymize-radiology-reports-ai/
- **Target Persona**: Radiologists, Clinical AI Researchers & Hospital Imaging Directors
- **Primary Statutory Liability**: HIPAA Safe Harbor (45 CFR § 164.514) & DICOM Supplement 142 De-Identification
- **Direct Answer (Featured Snippet)**: Sanitizing radiology narratives and CT/MRI imaging impressions for AI analysis requires masking patient full names, Medical Record Numbers (MRN), study accession numbers, and scan dates, while keeping anatomic imaging findings, radiologic measurements (e.g. 14mm nodule), BI-RADS/Lung-RADS scores, and impression texts in cleartext. Local RAM sanitization achieves HIPAA Safe Harbor compliance without requiring hospital business associate agreements.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Patient Full Legal Name & Date of Birth | **REDACT** | `[PATIENT_1], [DOB_1]` | HIPAA direct patient identifier; mandatory de-identification under 45 CFR § 164.514 |
  | Hospital Medical Record Number (MRN) | **REDACT** | `[MRN_1]` | Permanent clinical chart ID; enables unauthorized hospital system correlation |
  | Imaging Accession Number & PACS Study UID | **REDACT** | `[ACCESSION_1]` | DICOM study identifier vulnerable to PACS image database lookup |
  | Referring Physician & Reading Radiologist | **REDACT** | `[PROVIDER_1], [PROVIDER_2]` | Healthcare personnel PII; leaks institutional care facility details |
  | Anatomic Findings & Radiologic Observations | **PRESERVE** | `Cleartext (Ground-glass opacity in right lower lobe)` | Core diagnostic narrative required for AI diagnostic summarization and triage |
  | Quantitative Lesion Dimensions & Density | **PRESERVE** | `Cleartext (14mm x 11mm, +35 Hounsfield Units)` | Required metrics for measuring tumor progression and RECIST 1.1 response criteria |
  | Standardized Diagnostic Score (e.g. BI-RADS 4) | **PRESERVE** | `Cleartext (Lung-RADS Category 4A — Suspicious)` | Mandatory clinical classification required for follow-up biopsy decision modeling |

---

### 27. CMS-1500 / UB-04 Health Insurance Claim Form & Itemized Bill
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/billing-phi-redaction/
- **Target Persona**: Medical Biller, Revenue Cycle Managers (RCM) & Healthcare Compliance Officers
- **Primary Statutory Liability**: HIPAA Title II (45 CFR Part 162 EDI Standards) & False Claims Act (31 U.S.C. § 3729)
- **Direct Answer (Featured Snippet)**: Redacting CMS-1500 and UB-04 medical claim forms for AI revenue cycle analysis requires masking patient subscriber IDs, patient names, provider NPI numbers, and employer addresses, while keeping ICD-10-CM diagnosis codes, CPT/HCPCS procedure codes, billed charge amounts, and modifier tags in cleartext. Local offline RAM tokenization prevents payer profiling and eliminates HIPAA financial data exposure.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Insured / Patient Subscriber ID & Group # | **REDACT** | `[POLICY_ID_1], [GROUP_1]` | Direct health plan beneficiary identifier; exposes commercial payer eligibility |
  | Patient Legal Name & Home Street Address | **REDACT** | `[PATIENT_1], [ADDRESS_1]` | HIPAA Safe Harbor core identifier; exposes claimant personal residence |
  | Rendering Provider National Provider ID (NPI) | **REDACT** | `[NPI_1]` | 10-digit CMS identifier enabling direct lookup in NPPES registry |
  | Facility Billing Name & Tax ID (EIN) | **REDACT** | `[ORG_1], [TAX_ID_1]` | Clinical practice entity identifier; leaks hospital billing relationship |
  | ICD-10-CM Diagnosis Codes & Narrative | **PRESERVE** | `Cleartext (ICD-10 M54.50 Low back pain, unspecified)` | Mandatory clinical justification required for medical necessity verification in AI |
  | CPT / HCPCS Procedure Codes & Modifiers | **PRESERVE** | `Cleartext (CPT 99214-25, 72148 MRI Lumbar Spine)` | Standardized billing codes essential for claim scrubber denial analysis |
  | Billed Line-Item Charge & Units | **PRESERVE** | `Cleartext ($1,250.00 / 1 Unit)` | Core quantitative revenue figure required for fee schedule allowance benchmarking |

---

### 28. Patient Clinical Intake Questionnaire & Medical History
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/protect-patient-intake-forms-ai/
- **Target Persona**: Clinic Practice Managers, EHR Implementation Leads & Intake Coordinators
- **Primary Statutory Liability**: HIPAA Privacy Rule (45 CFR § 164.502) & State Medical Records Acts
- **Direct Answer (Featured Snippet)**: Protecting patient intake forms and medical history questionnaires before AI triage requires stripping patient names, emergency contact details, SSNs, and residential addresses, while keeping past surgical history, current prescription medications, drug allergies, and chief complaints in cleartext. In-browser client-side RAM sanitization preserves patient clinical confidentiality without violating HIPAA Privacy Rule mandates.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Patient Legal Full Name & Nickname | **REDACT** | `[PATIENT_1]` | Primary healthcare consumer identity; direct violation if exposed to LLMs |
  | Emergency Contact Person & Phone Number | **REDACT** | `[CONTACT_1], [PHONE_1]` | Secondary family PII; exposes familial relationships and private contacts |
  | Patient Social Security & Driver License # | **REDACT** | `[SSN_1]` | Critical government identifier; strictly prohibited from external AI logs |
  | Primary Care Physician (PCP) Clinic Name | **REDACT** | `[CLINIC_1]` | Healthcare provider association; enables cross-referencing care records |
  | Chief Complaint & History of Present Illness | **PRESERVE** | `Cleartext (Progressive shortness of breath x 2 weeks)` | Mandatory clinical reason for visit required for AI symptom checker and triage |
  | Current Prescription Medications & Dosages | **PRESERVE** | `Cleartext (Lisinopril 10mg daily, Metformin 500mg BID)` | Essential pharmacologic data required for AI drug-drug interaction screening |
  | Known Allergies & Adverse Drug Reactions | **PRESERVE** | `Cleartext (NKDA / Severe anaphylactic allergy to Penicillin)` | Critical clinical safety parameter required for medical decision support |

---

### 29. Electronic Prescription Order & Medication Dispensing Record
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/pharmacy-prescription-data-privacy/
- **Target Persona**: Clinical Pharmacists, Pharmacy Operations Directors & PBM Analysts
- **Primary Statutory Liability**: DEA 21 CFR Part 1311 (EPCS Standards), HIPAA & State Pharmacy Practice Acts
- **Direct Answer (Featured Snippet)**: Sanitizing electronic prescriptions (eRx) and dispensing logs for AI drug utilization review requires masking patient names, DEA registration numbers, prescription serial numbers, and retail pharmacy addresses, while keeping National Drug Codes (NDC), drug names, dosage forms, SIG administration directions, and refill counts in cleartext. Local RAM scrubbing prevents prescription drug monitoring program (PDMP) leaks.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Prescriber DEA Registration & State License # | **REDACT** | `[DEA_1], [LICENSE_1]` | Federal controlled substance authorization; severe fraud and drug diversion risk |
  | Patient Legal Name & Delivery Street Address | **REDACT** | `[PATIENT_1], [ADDRESS_1]` | Direct healthcare consumer PII; leaks patient residential location and medical treatment |
  | Prescription Serial Number (Rx#) | **REDACT** | `[RX_NUMBER_1]` | Internal pharmacy dispensing reference vulnerable to pharmacy system verification |
  | Retail Pharmacy Dispensing Location Name | **REDACT** | `[PHARMACY_1]` | Identifies local geographic pharmacy branch frequented by patient |
  | National Drug Code (NDC) 11-Digit Number | **PRESERVE** | `Cleartext (NDC: 00069-3150-66)` | FDA standard drug identifier required for exact AI generic equivalence checking |
  | Drug Name, Strength & Dosage Form | **PRESERVE** | `Cleartext (Sertraline HCl 50mg Oral Tablet)` | Mandatory active pharmaceutical ingredient required for therapeutic duplicate review |
  | SIG Administration Directions & Refill Limit | **PRESERVE** | `Cleartext (Take 1 tablet daily in the morning, Refills: 3)` | Prescription instructions needed for AI adherence checking and patient education drafting |

---

### 30. Psychotherapy Session Notes & Behavioral Health Intake
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/mental-health-ai-privacy/
- **Target Persona**: Licensed Clinical Social Workers (LCSW), Clinical Psychologists & Psychiatrists
- **Primary Statutory Liability**: HIPAA Psychotherapy Notes Rule (45 CFR § 164.501) & State Behavioral Privacy Laws
- **Direct Answer (Featured Snippet)**: Redacting psychotherapy notes and behavioral health intake records for AI session summaries requires masking patient full names, employer names, third-party family identities, and specific locations, while keeping DSM-5 diagnostic codes, clinical presentation mental status exams (MSE), therapeutic modality notes (CBT), and homework assignments in cleartext. Local offline processing ensures psychotherapy notes receive the highest tier of HIPAA privacy protection.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Client / Patient Full Legal Name | **REDACT** | `[PATIENT_1]` | Primary psychotherapy subject; highest stigma and reputational sensitivity |
  | Spouse, Children & Third-Party Family Names | **REDACT** | `[FAMILY_1], [FAMILY_2]` | Third-party individuals discussed in confidential therapy sessions |
  | Client Current Employer & Job Title | **REDACT** | `[EMPLOYER_1], [JOB_TITLE_1]` | Discloses workplace identity; creates severe professional discrimination vulnerability |
  | Residential Address & Private Locations | **REDACT** | `[ADDRESS_1]` | Personal geographic location PII subject to stalking and privacy risks |
  | DSM-5 Diagnostic Classification & Codes | **PRESERVE** | `Cleartext (DSM-5 F41.1 Generalized Anxiety Disorder)` | Mandatory clinical taxonomy required for AI treatment planning and goal setting |
  | Mental Status Examination (MSE) Findings | **PRESERVE** | `Cleartext (Affect congruent, thought process linear, insight fair)` | Objective psychiatric evaluation metrics required for longitudinal progress tracking |
  | Therapeutic Modality & Interventions Used | **PRESERVE** | `Cleartext (Cognitive restructuring, behavioral activation, 5-4-3-2-1 grounding)` | Core evidence-based interventions required for AI clinical progress note synthesis |

---

### 31. FDA Investigational New Drug (IND) & NDA Clinical Overview
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/secure-chatgpt-for-ind-nda-filings/
- **Target Persona**: Regulatory Affairs Directors, Clinical Pharmacology Leads & Biotech Executives
- **Primary Statutory Liability**: FDA 21 CFR Part 312 (IND Regulations), 21 CFR Part 11 & Commercial Trade Secrets
- **Direct Answer (Featured Snippet)**: Securing FDA IND applications and NDA Module 2 clinical overviews before AI drafting requires masking proprietary investigational drug codenames, contract research organization (CRO) identities, lead chemist full names, and preclinical CRO site locations, while keeping pharmacokinetics (AUC, Cmax), animal toxicity NOAEL values, clinical trial phase designs, and primary endpoints in cleartext. Local offline scrubbing protects multi-million dollar biopharma IP from premature patent publication bars.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Investigational Drug Internal Codename | **REDACT** | `[DRUG_CODE_1]` | Proprietary molecular asset code; leaks biopharma pipeline research priorities |
  | Contract Research Organization (CRO) Names | **REDACT** | `[CRO_1]` | Commercial outsourced partner identity; exposes preclinical testing partnerships |
  | Lead Research Scientists & Investigators | **REDACT** | `[SCIENTIST_1]` | Key corporate scientific personnel; subject to competitor recruiting |
  | Preclinical Testing Facility Physical Address | **REDACT** | `[ADDRESS_1]` | Laboratory site location PII; sensitive bio-research facility information |
  | Pharmacokinetic Parameters (Cmax, AUC0-inf) | **PRESERVE** | `Cleartext (Cmax 482 ng/mL, AUC 3,840 ng*h/mL)` | Mandatory pharmacokinetic parameters required for AI IND Module 2.7 summarization |
  | No-Observed-Adverse-Effect Level (NOAEL) | **PRESERVE** | `Cleartext (NOAEL: 30 mg/kg/day in Sprague-Dawley rats)` | Core toxicological threshold required for calculating Human Equivalent Dose (HED) |
  | Proposed First-in-Human (FIH) Phase 1 Dose | **PRESERVE** | `Cleartext (Starting dose: 0.5 mg/day, 10x safety margin)` | Regulatory dosing justification required for FDA IND Section 8 clinical protocol |

---

### 32. Institutional Review Board (IRB) Protocol & Informed Consent Form
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/masking-irb-protocol-numbers-in-ai-prompts/
- **Target Persona**: Principal Investigators, Clinical Ethics Chairs & Human Research Protection Leads
- **Primary Statutory Liability**: The Common Rule (45 CFR Part 46), FDA 21 CFR Part 56 & Belmont Report
- **Direct Answer (Featured Snippet)**: Masking Institutional Review Board (IRB) protocol numbers and informed consent forms for AI review requires redacting IRB approval tracking numbers, principal investigator names, hospital review committee chairs, and trial site addresses, while keeping vulnerable population criteria (e.g. pediatric, geriatric), risk-benefit ratios, protocol intervention timelines, and compensation amounts in cleartext. Local offline detokenization prevents unauthorized clinical trial identification.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | IRB Protocol Registration & Approval Number | **REDACT** | `[IRB_ID_1]` | Federal research protocol identifier; allows direct searching in OHRP database |
  | Principal Investigator (PI) & Sub-Investigator Names | **REDACT** | `[PI_NAME_1]` | Academic researcher identity; exposes institutional research projects |
  | Institutional Ethics Committee / Review Board Name | **REDACT** | `[IRB_NAME_1]` | Discloses local trial hospital or university oversight body |
  | Clinical Trial Site Physical Location | **REDACT** | `[ADDRESS_1]` | Institutional research facility PII subject to geographic de-anonymization |
  | Vulnerable Population Safeguards & Criteria | **PRESERVE** | `Cleartext (Subpart B pregnant women, Subpart D children excluded)` | Mandatory ethical parameters required for AI human subject protection compliance |
  | Subject Risk-Benefit Ratio Analysis | **PRESERVE** | `Cleartext (Minimal risk under 45 CFR 46.102(j), direct benefit plausible)` | Required ethical benchmark for IRB approval review under Common Rule |
  | Participant Stipend & Travel Reimbursement | **PRESERVE** | `Cleartext ($75 per clinic visit, total $450 completion bonus)` | Financial terms needed to evaluate undue inducement and coercion risks |

---

### 33. Next-Generation Sequencing (NGS) VCF Variant & Patient Phenotype Record
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/genomic-data-bioinformatics-pii-redaction/
- **Target Persona**: Bioinformaticians, Clinical Geneticists & Genomic Data Privacy Officers
- **Primary Statutory Liability**: GINA (Genetic Information Nondiscrimination Act), HIPAA Article 9 GDPR & Common Rule
- **Direct Answer (Featured Snippet)**: Sanitizing Next-Generation Sequencing (NGS) Variant Call Format (VCF) headers and clinical phenotype records for AI genomics analysis requires masking patient DNA/RNA sample barcodes, flowcell sequencing run IDs, clinical accession numbers, and family pedigree IDs, while preserving genomic coordinates (GRCh38), chromosome positions, HGVS variant nomenclature (c.1799T>A), dbSNP rsIDs, and allele frequencies in cleartext. Local offline scrubbing eliminates genetic discrimination risks under GINA.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Patient DNA / RNA Sample Barcode ID | **REDACT** | `[SAMPLE_ID_1]` | Direct bio-specimen identifier; cross-references biobank repositories |
  | Illumina / MGI Flowcell & Sequencing Run ID | **REDACT** | `[FLOWCELL_1]` | Hardware instrument run identifier; links directly to internal laboratory tracking |
  | Family Pedigree & Kinship Subject Numbers | **REDACT** | `[FAMILY_ID_1]` | Family lineage mapping identifier; high risk of genealogical re-identification |
  | Clinical Molecular Genetics Laboratory Name | **REDACT** | `[LAB_1]` | Healthcare testing institutional identity; leaks clinical hospital center |
  | Reference Genome Build & Chromosome Coordinate | **PRESERVE** | `Cleartext (GRCh38 chr7:140753336 A>T)` | Mandatory bioinformatic coordinate required for AI genomic locus annotation |
  | HGVS Variant Nomenclature & dbSNP rsID | **PRESERVE** | `Cleartext (BRAF p.Val600Glu, rs113488022)` | Standardized scientific variant name essential for AI oncologic targeted therapy matching |
  | Variant Allele Frequency (VAF) & Read Depth | **PRESERVE** | `Cleartext (VAF 42.5%, Depth 1240x)` | Quantitative sequencing metric required for determining somatic vs germline status |

---

### 34. Production Database Dump (.sql) & Connection URI
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-database-passwords-from-source-code-ai/
- **Target Persona**: Database Administrators (DBA), Backend Engineers & Data Platform Leads
- **Primary Statutory Liability**: PCI DSS v4.0 Requirement 8.3 & SOC 2 Type II CC6.1 (Logical Access Credentials)
- **Direct Answer (Featured Snippet)**: Redacting production database dumps (.sql) and connection strings for AI troubleshooting requires masking embedded database passwords, master admin usernames, TLS certificate keys, and host IP addresses, while keeping SQL table schemas, CREATE TABLE statements, index constraints, and foreign key relationships in cleartext. Local RAM sanitization prevents catastrophic database compromise and meets PCI DSS v4.0 Requirement 8.3.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | PostgreSQL / MySQL Password in URI | **REDACT** | `[PASSWORD_1]` | Critical credential in postgresql://user:pass@host URI; grants direct database access |
  | Production Database Hostname & IP | **REDACT** | `[DB_HOST_1]` | Internal VPC endpoint; exposes database network location to unauthorized ingress |
  | Master Superuser / Root Username | **REDACT** | `[DB_USER_1]` | Administrative account name; vulnerable to brute-force credential stuffing |
  | Client SSL/TLS Private Key Certificates | **REDACT** | `[CERT_1]` | Mutual TLS credential; bypasses database perimeter cryptographic controls |
  | SQL Table DDL & Schema Definitions | **PRESERVE** | `Cleartext (CREATE TABLE accounts (id UUID PRIMARY KEY...))` | Mandatory structural schema required for AI query optimization and indexing |
  | Query Performance & EXPLAIN ANALYZE Logs | **PRESERVE** | `Cleartext (Seq Scan on orders cost=0.00..4281.00 rows=10492)` | Execution plan metrics essential for AI SQL slow-query performance tuning |
  | Foreign Key Constraints & Triggers | **PRESERVE** | `Cleartext (CONSTRAINT fk_order_user FOREIGN KEY...)` | Relational logic required for analyzing schema referential integrity |

---

### 35. Kubernetes Kubeconfig (`.kube/config`) & Pod Manifest
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/masking-kubernetes-kubeconfig-ips-for-chatgpt/
- **Target Persona**: Site Reliability Engineers (SRE), Kubernetes Administrators & Platform Engineers
- **Primary Statutory Liability**: CIS Kubernetes Benchmark v1.8 & SOC 2 Type II CC6.6 (Boundary Protection)
- **Direct Answer (Featured Snippet)**: Masking Kubernetes kubeconfig manifests and pod configurations for ChatGPT troubleshooting requires redacting cluster control plane API URLs, client certificate data (client-certificate-data), auth tokens, and pod private IP addresses, while keeping container image tags, resource limits, namespace names, and readiness probes in cleartext. Local offline scrubbing eliminates cluster takeover vectors without slowing cloud-native debugging.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Kubernetes API Server Endpoint URL | **REDACT** | `[API_SERVER_1]` | Control plane master endpoint; exposes cluster control API to public scanning |
  | Client Certificate Data (base64 cert) | **REDACT** | `[CERT_DATA_1]` | Client mTLS credential; allows complete authentication as cluster-admin |
  | ServiceAccount Bearer Tokens & Secrets | **REDACT** | `[K8S_TOKEN_1]` | High-privilege JWT token; grants direct REST access to Kubernetes API |
  | Pod & Node Private IPv4 Addresses | **REDACT** | `[POD_IP_1]` | Internal container network overlay topology; exposes internal VPC subnetting |
  | Container Image Names & Semantic Tags | **PRESERVE** | `Cleartext (image: nginx:1.25.4-alpine, redis:7.2.4)` | Required for AI vulnerability scanning and container compatibility review |
  | Resource Limits & CPU/Memory Requests | **PRESERVE** | `Cleartext (cpu: 500m, memory: 512Mi / limit: 1Gi)` | Mandatory metrics needed for diagnosing OOMKilled errors and CPU throttling |
  | Liveness & Readiness HTTP Probe Paths | **PRESERVE** | `Cleartext (path: /healthz, port: 8080, initialDelay: 15s)` | Health check parameters required for AI pod crashloop troubleshooting |

---

### 36. Cursor AI / IDE Context Window & `.env` Environment File
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/cursor-ai-privacy-source-code/
- **Target Persona**: Software Engineers, Full-Stack Developers & Engineering Managers
- **Primary Statutory Liability**: SOC 2 CC6.1, OWASP Top 10 A07:2021 (Identification Failures) & Corporate IP NDA
- **Direct Answer (Featured Snippet)**: Preventing source code and secret leaks when using Cursor AI or Copilot requires redacting `.env` secrets, live API keys, internal microservice tokens, and proprietary employee emails from the context window, while keeping TypeScript interfaces, algorithm logic, function parameters, and unit tests in cleartext. Local offline RAM sanitization prevents accidental commit of secrets into external AI model fine-tuning caches.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Stripe, OpenAI & AWS Secret API Keys | **REDACT** | `[API_KEY_1]` | High-entropy secret token (sk_live_..., AKIA...); immediate financial and cloud compromise risk |
  | Database Connection String in .env | **REDACT** | `[DB_URL_1]` | Contains internal credentials; exposes backend data store to external LLM context |
  | Developer Personal Email & SSH Keys | **REDACT** | `[EMAIL_1], [SSH_KEY_1]` | Developer identity and cryptographic identity key; subject to git tracking and abuse |
  | Proprietary Company Microservice Domain | **REDACT** | `[DOMAIN_1]` | Internal staging or corporate domain; reveals private architectural namespaces |
  | TypeScript Interfaces & Type Signatures | **PRESERVE** | `Cleartext (export interface PaymentIntent { id: string; amount: number; })` | Mandatory type structures required for accurate AI code generation and autocomplete |
  | Function Implementation Logic & Loops | **PRESERVE** | `Cleartext (async function processRefund(intent: PaymentIntent))` | Substantive code logic needed for AI refactoring and bug fixing |
  | Jest / Vitest Unit Test Assertions | **PRESERVE** | `Cleartext (expect(result.status).toBe("succeeded"))` | Test fixtures essential for AI automated test generation |

---

### 37. Jira Production Incident Ticket & Bug Report
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/redact-jira-tickets-chatgpt/
- **Target Persona**: DevOps Engineers, QA Automation Leads & Technical Support Managers
- **Primary Statutory Liability**: Customer Confidentiality (SLAs), SOC 2 CC7.3 & Internal Threat Disclosure
- **Direct Answer (Featured Snippet)**: Redacting Jira incident tickets and bug reports before pasting into ChatGPT requires masking customer enterprise names, affected user email addresses, reporter names, and production IP addresses, while keeping stack traces, error codes (e.g. 504 Gateway Timeout), environment versions, and reproduction steps in cleartext. Local offline sanitization protects enterprise customers from public breach disclosures.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Impacted Customer Enterprise Organization | **REDACT** | `[CUSTOMER_1]` | Commercial customer identity; reveals customer outages and triggers SLA disputes |
  | Reporter & Assignee Full Legal Names | **REDACT** | `[NAME_1], [NAME_2]` | Internal employee PII; subject to external attribution and social engineering |
  | Customer End-User Emails & Accounts | **REDACT** | `[EMAIL_1], [ACCOUNT_1]` | Consumer PII protected under GDPR and state data privacy statutes |
  | Production Server Hostname & IPv4 Address | **REDACT** | `[IP_1], [HOST_1]` | Internal server routing coordinate; exposes vulnerable infrastructure to port scanning |
  | Exception Stack Trace & File Paths | **PRESERVE** | `Cleartext (Error: ConnectionPoolExhausted at pg-pool/index.js:142:11)` | Mandatory technical trace required for AI root-cause debugging and code fix |
  | HTTP Status Codes & Response Payloads | **PRESERVE** | `Cleartext (HTTP 504 Gateway Timeout, upstream response 30000ms exceeded)` | Essential diagnostic metrics needed for diagnosing proxy and load balancer timeouts |
  | Reproduction Steps & Bug Trigger Conditions | **PRESERVE** | `Cleartext (1. Send batch payload > 10MB; 2. Await worker pickup)` | Core workflow instructions required for AI bug reproduction and remediation |

---

### 38. Nginx / Apache Access Log & Systemd Journal
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/clean-prod-logs-ai-debugging/
- **Target Persona**: Systems Engineers, Cloud Ops Specialists & Incident Responders
- **Primary Statutory Liability**: GDPR Article 4(1) (IP Addresses as Personal Data) & PCI DSS Requirement 10.3
- **Direct Answer (Featured Snippet)**: Cleaning production server access logs and systemd journals for AI debugging requires redacting remote client IP addresses, session cookies, JWT bearer tokens in Authorization headers, and internal server usernames, while keeping HTTP request methods, URIs, response codes (e.g. 401 Unauthorized), bytes sent, and upstream latency in cleartext. Local offline scrubbing prevents GDPR violations from uploading IP access logs.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Remote Client Public & Private IPv4/IPv6 | **REDACT** | `[IP_1], [IP_2]` | GDPR Article 4(1) personal identifier; exposes end-user visitor locations |
  | Session Cookie & Auth Token in Request Header | **REDACT** | `[COOKIE_1], [TOKEN_1]` | Session hijack credential; permits impersonation of active logged-in users |
  | URL Query Parameters Containing User Email | **REDACT** | `[EMAIL_1]` | Direct consumer PII leaked into query strings (?email=user@example.com) |
  | HTTP Request Method & API Route Path | **PRESERVE** | `Cleartext (POST /api/v2/checkout/process HTTP/2.0)` | Mandatory routing endpoint required for AI API failure analysis |
  | HTTP Response Status Code & Bytes Sent | **PRESERVE** | `Cleartext (502 Bad Gateway, 1420 bytes)` | Core diagnostic status needed for identifying reverse proxy gateway failures |
  | Upstream Response Time & Request Duration | **PRESERVE** | `Cleartext (request_time=4.821 upstream_response_time=4.819)` | Essential latency metric needed to isolate backend microservice timeouts |

---

### 39. Model Context Protocol (MCP) Tool Call & JSON-RPC Payload
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/mcp-data-sanitization/
- **Target Persona**: AI Agent Engineers, AI Security Architects & IDE Extension Developers
- **Primary Statutory Liability**: Anthropic MCP Security Standard, SOC 2 CC6.8 & Zero-Trust Agent Mandates
- **Direct Answer (Featured Snippet)**: Sanitizing Model Context Protocol (MCP) tool calls and JSON-RPC payloads before forwarding to Claude Desktop or Cursor requires redacting user credentials in tool arguments, file paths leaking local usernames, and session tokens, while keeping tool names (e.g. read_file), JSON-RPC protocol IDs, schema definitions, and return types in cleartext. Local in-memory detokenization guarantees zero data leakage across local stdio and SSE transport streams.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Local User File Paths (/Users/username/...) | **REDACT** | `[PATH_1]` | Leads to developer machine profiling and leaks local workstation usernames |
  | Tool Arguments Containing API Passwords | **REDACT** | `[SECRET_1]` | Tool input argument leak; exposes database or service credentials to model logs |
  | Developer Personal Identifiers in Stdio | **REDACT** | `[USER_1]` | Developer identity PII transmitted in local JSON-RPC session envelopes |
  | MCP Tool Name & Functional Method | **PRESERVE** | `Cleartext (tools/call: "execute_sql_query")` | Mandatory RPC method required for LLM agent function dispatch |
  | JSON-RPC Protocol Structure (jsonrpc: "2.0") | **PRESERVE** | `Cleartext ({"jsonrpc": "2.0", "id": 42})` | Standard protocol framing necessary for JSON-RPC 2.0 parser validation |
  | Tool Parameter Types & Return Schemas | **PRESERVE** | `Cleartext (type: "object", properties: { "query": { "type": "string" } })` | Schema definitions essential for LLM tool invocation reasoning |

---

### 40. LangSmith / Langfuse Run Trace & Span Metadata
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/sanitize-llm-observability-traces/
- **Target Persona**: LLM Platform Engineers, Observability Leads & AI Governance Officers
- **Primary Statutory Liability**: GDPR Article 28 (Processor Telemetry), SOC 2 CC7.2 & Zero-Leakage LLM Monitoring
- **Direct Answer (Featured Snippet)**: Sanitizing LangSmith, Langfuse, and OpenTelemetry LLM traces before cloud ingestion requires masking prompt input PII, end-user session IDs, customer email addresses, and database connection strings in span attributes, while keeping token counts (prompt_tokens, completion_tokens), latency metrics (TTFT), model IDs (claude-3-5-sonnet), and finish reasons in cleartext. Local pre-ingestion scrubbing eliminates customer PII from external telemetry dashboards.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | User Input Prompt Raw Personal Data | **REDACT** | `[USER_PII_1]` | End-user raw text; leaks private customer inquiries into observability cloud SaaS |
  | End-User Tracking ID & Customer Email | **REDACT** | `[USER_ID_1], [EMAIL_1]` | Identifies individual consumers using the AI application |
  | Internal Database Connection Strings in Spans | **REDACT** | `[DB_URI_1]` | Exposes database topology and credentials recorded in span metadata |
  | Prompt & Completion Token Counts | **PRESERVE** | `Cleartext (prompt_tokens: 1420, completion_tokens: 384, total: 1804)` | Mandatory quantitative metrics required for AI cost and token budget tracking |
  | Time to First Token (TTFT) & Total Latency | **PRESERVE** | `Cleartext (ttft_ms: 240, total_duration_ms: 1840)` | Essential performance benchmarks needed for detecting model degradation |
  | Model Name & Temperature Parameters | **PRESERVE** | `Cleartext (model: "gpt-4o", temperature: 0.2, top_p: 0.95)` | Required configuration parameters for reproducible AI evaluation |

---

### 41. Pinecone / Qdrant / Chroma Vector Embedding Chunk
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/sanitize-rag-vector-database-pii/
- **Target Persona**: RAG Engineers, Vector Database Architects & AI Information Security Leads
- **Primary Statutory Liability**: GDPR Article 17 (Right to be Forgotten in Vector Embeddings) & CCPA
- **Direct Answer (Featured Snippet)**: Sanitizing text chunks before vector database embedding in Pinecone, Qdrant, or Chroma requires masking customer names, phone numbers, home addresses, and account numbers, while preserving semantic domain terminology, technical descriptions, document section titles, and chunk overlap context in cleartext. Local pre-embedding sanitization solves the GDPR Article 17 dilemma where PII cannot be excised from immutable mathematical vector weights.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Customer Legal Name & Resident Address | **REDACT** | `[NAME_1], [ADDRESS_1]` | GDPR Right to Erasure violation; once embedded into vectors, weights cannot be selectively deleted |
  | Direct Customer Telephone & Mobile | **REDACT** | `[PHONE_1]` | Direct consumer contact PII; leads to persistent vector lookup attribution |
  | Customer Account / Policy Identifier | **REDACT** | `[ACCOUNT_1]` | Internal indexing reference vulnerable to similarity search extraction |
  | Semantic Conceptual Content & Technical Terms | **PRESERVE** | `Cleartext (Zero-Trust Data Sanitization, Client-Side Redaction)` | Mandatory semantic meaning required for high-precision cosine similarity vector search |
  | Section Headings & Hierarchical Structure | **PRESERVE** | `Cleartext (## Section 4.2 Security Controls & Policy Governance)` | Structural context needed for hybrid sparse/dense BM25 vector retrieval |
  | Chunk Token Boundary Overlap Context | **PRESERVE** | `Cleartext (sliding window 100 token overlap)` | Preserves narrative continuity across contiguous text embedding slices |

---

### 42. Multi-Agent Tool Call Parameters & Ephemeral Memory
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/prevent-ai-agent-secrets-leak/
- **Target Persona**: AI Agent Developers, Autonomous Agent Architects & AI Security Engineers
- **Primary Statutory Liability**: OWASP Top 10 for LLM Applications (LLM02: Sensitive Information Disclosure)
- **Direct Answer (Featured Snippet)**: Preventing autonomous AI agents from leaking API keys and customer PII across tool calls requires intercepting multi-agent message envelopes and redacting OAuth tokens, private keys, and user personal data, while keeping agent role directives, step-by-step task plans, tool function names, and structured JSON results in cleartext. Local client-side filtering prevents compounding data leakage across recursive agent loops.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | OAuth Bearer Tokens & Webhook Secrets | **REDACT** | `[SECRET_1]` | Authorization credential; allows hijacked downstream agents to perform unauthorized actions |
  | User Passwords & MFA Authenticator Seeds | **REDACT** | `[PASSWORD_1]` | Critical authentication secret; immediate privilege escalation vulnerability |
  | End-User Real Names & Credit Details | **REDACT** | `[USER_NAME_1], [CARD_1]` | Consumer PII exposed in multi-agent thought and reasoning scratchpads |
  | Agent Role & Persona Directive (System Prompt) | **PRESERVE** | `Cleartext (You are a Research Agent responsible for technical synthesis)` | Mandatory operational persona needed for agent coordination and task alignment |
  | Hierarchical Task Decomposition Plan | **PRESERVE** | `Cleartext (1. Query database; 2. Summarize metrics; 3. Format report)` | Sequential plan required for multi-agent supervisor orchestrator execution |
  | Tool Invocation Return Status & Data Types | **PRESERVE** | `Cleartext (status: "success", count: 42, latency: 120ms)` | Operational telemetry required for autonomous error handling and retry logic |

---

### 43. CrewAI / AutoGen Agent State & Shared Scratchpad
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/crewai-autogen-agentic-memory-pii-redaction/
- **Target Persona**: Autonomous AI Developers, Multi-Agent System Architects & Enterprise AI Leads
- **Primary Statutory Liability**: SOC 2 Type II CC6.1, GDPR Article 25 (Privacy by Design) & OWASP LLM02
- **Direct Answer (Featured Snippet)**: Redacting shared memory scratchpads and agent state logs in CrewAI and AutoGen requires masking personal customer records, corporate API keys, private repository URLs, and credentials stored in memory vectors, while preserving inter-agent conversation histories, shared task states, agent persona configurations, and intermediate reasoning steps in cleartext. Local offline scrubbing prevents cross-agent contamination.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Shared Memory Cached Customer PII | **REDACT** | `[CUSTOMER_PII_1]` | Customer personal data persisted in agent long-term memory; cross-session leakage risk |
  | Private Git Repository Credentials & URLs | **REDACT** | `[GIT_TOKEN_1]` | Source code access token (ghp_...); allows automated agents to access private codebases |
  | Third-Party SaaS Integration Keys | **REDACT** | `[API_KEY_1]` | Exposes integrated cloud SaaS platforms (Slack, Notion, Jira) to agent abuse |
  | Agent Memory Key-Value Semantic Index | **PRESERVE** | `Cleartext (key: "quarterly_financial_summary", status: "completed")` | Required indexing state for multi-agent task resumption and context retrieval |
  | Inter-Agent Reflection & Critique Loops | **PRESERVE** | `Cleartext (Critic Agent: The technical feasibility score is 8/10...)` | Substantive reasoning steps needed for multi-agent iterative self-correction |
  | Agent Task Output Schemas & JSON Contracts | **PRESERVE** | `Cleartext ({"summary": string, "risk_level": "low" | "high"})` | Output data contract required for downstream agent tool consumption |

---

### 44. FinCEN SAR Form 111 & KYC Suspicious Activity Narratives
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/finance/fincen-sar-kyc-narratives-ai-redaction/
- **Target Persona**: Bank BSA/AML Compliance Officers, Financial Crime Investigators & MLROs
- **Primary Statutory Liability**: Bank Secrecy Act (BSA), 31 U.S.C. § 5318(g) Anti-Tipping-Off Mandate & 31 CFR § 1020.320
- **Direct Answer (Featured Snippet)**: To safely analyze FinCEN Suspicious Activity Reports (SAR) and KYC risk narratives with AI, redact subject personal identities, residential addresses, government IDs (SSN/Passport), and bank account numbers while strictly preserving transaction amounts, dates, velocity frequencies, and typology categories. This maintains anti-tipping-off compliance under 31 U.S.C. § 5318(g) without leaking customer or bank identity.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Subject Full Legal Name (Part I, Box 4-6) | **REDACT** | `[NAME_1]` | Primary subject personal identity; disclosure violates BSA anti-tipping-off provisions |
  | Social Security Number / ITIN (Part I, Box 15) | **REDACT** | `[SSN_1]` | Federal tax identifier; severe statutory identity theft risk under federal privacy acts |
  | Passport / Driver's License Number (Part I, Box 17-18) | **REDACT** | `[ID_1]` | Government-issued credential; directly re-identifies the investigated party |
  | Subject Residential / Business Street Address | **REDACT** | `[ADDRESS_1]` | Physical domicile or office location subject to re-identification and profiling |
  | Financial Institution Account Numbers (Part I, Box 21) | **REDACT** | `[ACCOUNT_1]` | Specific commercial bank ledger routing; vulnerable to balance enumeration |
  | Filing Institution & Law Enforcement Contact Names | **REDACT** | `[ORG_1], [AGENT_1]` | Bank entity and investigator identities protected under SAR confidentiality rules |
  | Suspicious Cash / Wire Amounts ($142,500.00) | **PRESERVE** | `Cleartext ($142,500.00)` | Quantitative metric essential for AI pattern recognition and BSA threshold modeling |
  | Transaction Timestamps & Velocity Frequency | **PRESERVE** | `Cleartext (2026-04-12 14:22 UTC)` | Required for AI chronological sequencing, structuring detection, and velocity audit |
  | Typology Category & FinCEN Suspicious Activity Codes | **PRESERVE** | `Cleartext (Structuring, Smurfing)` | Legal classification required for automated SAR narrative drafting and risk ranking |

---

### 45. ISO 20022 XML & SWIFT MT103 / pacs.008 Payment Payloads
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/finance/iso-20022-swift-payment-message-sanitization/
- **Target Persona**: Payment Systems Architects, Core Banking Engineers & FinTech Operations Analysts
- **Primary Statutory Liability**: Gramm-Leach-Bliley Act (GLBA Safeguards Rule 16 CFR Part 314), PCI DSS 4.0 & EPC SEPA Rules
- **Direct Answer (Featured Snippet)**: Sanitizing ISO 20022 XML (pacs.008, pacs.002) and SWIFT MT103 payment payloads for AI analysis requires removing debtor and creditor personal names, account IBANs/BBANs, postal addresses, and unmasked remittance notes while strictly keeping XML schema tags, interbank settlement amounts, currency codes, BICs, and settlement dates intact. This allows LLMs to debug payment routing failures without leaking customer financial identifiers.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Debtor Legal Name (`<Dbtr><Nm>`) | **REDACT** | `[NAME_1]` | Originating sender personal identity; GLBA nonpublic personal information (NPI) |
  | Debtor Account IBAN (`<DbtrAcct><Id><IBAN>`) | **REDACT** | `[IBAN_1]` | Direct bank account number; severe financial theft and account takeover risk |
  | Debtor Postal Address (`<Dbtr><PstlAdr>`) | **REDACT** | `[ADDRESS_1]` | Residential address; enables geographic tracking and identity resolution |
  | Creditor Legal Name (`<Cdtr><Nm>`) | **REDACT** | `[NAME_2]` | Beneficiary recipient individual identity subject to privacy regulations |
  | Creditor Account IBAN (`<CdtrAcct><Id><IBAN>`) | **REDACT** | `[IBAN_2]` | Beneficiary bank account number protected under international banking rules |
  | Unstructured Remittance Note (`<RmtInf><Ustrd>`) | **REDACT** | `[REMITTANCE_1]` | Free-text payment description frequently containing private invoice or medical PII |
  | Interbank Settlement Amount (`<IntrBkSttlmAmt>`) | **PRESERVE** | `Cleartext (EUR 350,000.00)` | Core quantitative value required for AI liquidity validation and reconciliation |
  | Settlement Date (`<IntrBkSttlmDt>`) | **PRESERVE** | `Cleartext (2026-09-24)` | Required for value date processing, interest calculation, and clearing deadlines |
  | Financial Institution BICs (`<InstgAgt>`, `<InstdAgt>`) | **REDACT** | `[FINANCIAL_1], [FINANCIAL_2]` | Bank routing identifiers; masked under specialized finance profile to prevent institutional routing enumeration |
  | ISO 20022 XML Message Structure & Schema Tags | **PRESERVE** | `Cleartext (<pacs.008.001.10>)` | Mandatory syntactic schema required for LLM XML validation and syntax debugging |

---

### 46. EU DORA Major ICT Incident Reports & Operational Resilience Dossiers
- **Spoke Guide URL**: https://privacyscrubber.com/compliance/eu-ai-act/eu-dora-ict-incident-reports-ai/
- **Target Persona**: Financial Entity CISOs, Chief Risk Officers & DORA Compliance Directors
- **Primary Statutory Liability**: EU Digital Operational Resilience Act (Regulation (EU) 2022/2554, Articles 17–23) & EBA RTS Guidelines
- **Direct Answer (Featured Snippet)**: Sanitizing EU DORA Major ICT Incident reports for AI triage requires redacting private network IPs, internal core server FQDNs, incident commander employee IDs, database credentials, and commercial client names while strictly preserving incident classification thresholds, client impact percentages, outage durations, RTO metrics, and root cause descriptions. This ensures compliance with DORA Article 19 without exposing internal bank infrastructure to AI model providers.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Incident Commander & Responder Names | **REDACT** | `[NAME_1], [NAME_2]` | Employee personal data protected under GDPR Article 6; prevents targeted social engineering |
  | Internal Infrastructure FQDNs & Hostnames | **REDACT** | `[HOSTNAME_1]` | Core banking server topology (`core-db01.fra.internal.bank.eu`); severe exploitation risk |
  | Private RFC 1918 IPv4 & IPv6 Addresses | **REDACT** | `[IP_1], [IP_2]` | Internal network layout (`10.140.22.41`); leaks network boundaries and firewalled subnets |
  | Database Credentials & API Access Tokens | **REDACT** | `[KEY_1]` | High-liability credentials; zero-trust violation if uploaded to external cloud LLM |
  | Commercial Institutional Client Names | **REDACT** | `[CLIENT_1], [CLIENT_2]` | Exposes financial institution institutional client relationship confidentialities |
  | Major ICT Incident Classification (DORA Art 18) | **PRESERVE** | `Cleartext (Major Incident Level 3)` | Statutory classification tier required for competent authority notification timelines |
  | Number of Affected Clients & Percentage | **PRESERVE** | `Cleartext (42,500 clients / 8.4%)` | Core quantitative metric mandated by EBA RTS to assess systemic impact on market |
  | Duration of Service Disruption & Downtime | **PRESERVE** | `Cleartext (3 hours 42 minutes)` | Mandatory operational resilience telemetry to verify Recovery Time Objective (RTO) |
  | Estimated Financial & Economic Impact | **PRESERVE** | `Cleartext (€185,000.00 gross)` | Direct financial threshold metric required for European Supervisory Authorities (ESA) |
  | Incident Root Cause Typology | **PRESERVE** | `Cleartext (Third-Party Payment Gateway Timeout)` | Essential engineering narrative needed for AI post-mortem synthesis and mitigation planning |

---

### 47. Electronic Health Record (EHR) & Clinical Discharge Summaries (Epic & Cerner)
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/medical/ehr-ai-safety/
- **Target Persona**: Chief Medical Information Officers (CMIO), CDI Specialists, Health Informatics Directors & Hospital Privacy Officers
- **Primary Statutory Liability**: HIPAA Privacy Rule § 164.502 (Unauthorized Disclosure) & § 164.514(b)(2) (Safe Harbor De-Identification)
- **Direct Answer (Featured Snippet)**: To safely analyze EHR clinical discharge summaries and SOAP notes with AI, redact patient names, Medical Record Numbers (MRN), dates of birth, attending physician NPIs, and health plan IDs using client-side tokens. Strictly preserve ICD-10 diagnostic codes, SNOMED concepts, vital signs, and lab values in cleartext so LLMs can execute clinical documentation improvement (CDI) and coding validation without cloud PHI egress.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Patient Legal Name & Date of Birth | **REDACT** | `[NAME_1], [DATE_1]` | HIPAA Safe Harbor direct identifiers #1 and #3; strictly prohibited from external AI logs |
  | Medical Record Number (MRN) & Encounter ID | **REDACT** | `[MRN_1], [ID_1]` | HIPAA Safe Harbor identifier #7; hospital master patient index tracking |
  | Attending Physician Name, NPI & Email | **REDACT** | `[NAME_2], [NPI_1], [EMAIL_1]` | Provider PII subject to workforce privacy and selective AI coding scrutiny |
  | Health Plan Payor & Beneficiary Member ID | **REDACT** | `[ORG_1], [ID_2]` | Insurance subscriber identity subject to cross-system correlation |
  | ICD-10-CM & SNOMED CT Diagnostic Codes | **PRESERVE** | `Cleartext (E11.22 / SNOMED: 73211009)` | Mandatory clinical ontology required for AI diagnostic coding and CDI validation |
  | Laboratory Test Results & Quantitative Vitals | **PRESERVE** | `Cleartext (HbA1c: 8.4%, eGFR: 48 mL/min, BP: 148/92)` | Essential physiological indicators needed for clinical progression and prognostic modeling |
  | Prescribed Medication Dosages & Regimens | **PRESERVE** | `Cleartext (Metformin 1000mg BID, Lisinopril 20mg daily)` | Pharmacological therapy data required for contraindication and drug-drug interaction analysis |

---

### 48. Contract Lifecycle Management (CLM) MSAs, SOWs & GDPR Article 28 DPAs
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/legal/clm-contract-lifecycle-ai-privacy/
- **Target Persona**: General Counsel, Legal Operations Directors, Commercial Contract Managers & Corporate DPOs
- **Primary Statutory Liability**: ABA Model Rule 1.6 (Confidentiality of Information), FRE 502 (Attorney-Client Privilege Waiver) & GDPR Article 28 (Data Processor Obligations)
- **Direct Answer (Featured Snippet)**: To safely review CLM contracts, master services agreements (MSAs), and data processing annexes with AI, redact corporate counterparty entities, signatory names and titles, DPA regulatory IDs, and internal counsel email tags into RAM tokens. Preserve commercial contract values ($2,400,000), gross margin percentages (68%), termination notice windows (60 days), and indemnification caps so LLMs can execute redline risk scoring without privilege waiver.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Counterparty Commercial Legal Entity Name | **REDACT** | `[ORG_1]` | Preserves negotiation posture; prevents competitor price discovery and privilege waiver |
  | Authorized Signatory Personal Identity & Title | **REDACT** | `[NAME_1]` | C-suite executive personal data subject to GDPR Art. 6 lawful basis scrutiny |
  | GDPR Article 28 DPA Registration & ICO Number | **REDACT** | `[ID_1]` | Direct regulatory data controller identifier subject to subprocessor registry exposure |
  | Negotiation Track-Changes Author Metadata | **REDACT** | `[EMAIL_1]` | Internal legal counsel authorship tags revealing attorney-client work product origin |
  | Annual Contract Value (ACV) & Total Fees | **PRESERVE** | `Cleartext ($2,400,000.00)` | Essential economic metric required for commercial deal modeling and liability thresholds |
  | Gross Margin Target & Pricing Floor % | **PRESERVE** | `Cleartext (68% gross margin)` | Required for AI contract viability and profitability assessment |
  | Notice of Termination & Renewal Periods | **PRESERVE** | `Cleartext (60-day notice for cause)` | Core procedural timeline required for CLM SLA and milestone extraction |
  | Aggregate Liability & Indemnification Multipliers | **PRESERVE** | `Cleartext (2x Twelve-Month Fees Capped)` | Legal risk threshold needed for automated contract risk scoring |

---

### 49. Mortgage Loan Origination (LOS) Form 1003 URLA, MISMO 3.4 XML & TRID Disclosures
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/finance/mortgage-underwriting-los-appraisal-ai-privacy/
- **Target Persona**: Mortgage Underwriters, Secondary Marketing Directors, Mortgage Compliance Officers & LOS Engineers
- **Primary Statutory Liability**: Gramm-Leach-Bliley Act (GLBA) Safeguards Rule (16 CFR Part 314), FCRA § 607 & CFPB Examination Standards
- **Direct Answer (Featured Snippet)**: To safely summarize mortgage loan origination files and appraisal packages with AI, redact borrower SSNs, co-borrower names, subject property street addresses, bank account numbers, and AMC appraiser license codes. Strictly preserve loan amounts ($485,000.00), interest rates (6.875%), APR (7.012%), monthly qualifying income, and DTI ratios so LLMs can generate condition letters and stare-and-compare appraisal reviews with zero GLBA exposure.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Form 1003 Primary Borrower SSN & DOB | **REDACT** | `[SSN_1], [DATE_1]` | Core GLBA Nonpublic Personal Information (NPI); severe identity theft exposure |
  | Co-Borrower Legal Name & Employer | **REDACT** | `[NAME_1], [ORG_1]` | Applicant family and employment identity subject to CFPB privacy protections |
  | Subject Property Street Address & APN | **REDACT** | `[ADDRESS_1], [ID_1]` | Direct consumer residential location and county parcel identifier |
  | Verification of Deposit (VOD) Bank Account # | **REDACT** | `[ACCT_1]` | Consumer banking credential protected by FTC Safeguards Rule |
  | Certified Appraiser Name & State License # | **REDACT** | `[NAME_2], [LICENSE_1]` | Real estate appraiser professional identity protected from bias correlation |
  | Total Note Loan Amount & Base Loan | **PRESERVE** | `Cleartext ($485,000.00)` | Principal debt obligation essential for loan-to-value (LTV) calculation |
  | Note Interest Rate & TRID Disclosed APR | **PRESERVE** | `Cleartext (6.875% Rate / 7.012% APR)` | Quantitative pricing variables required for QM and TRID tolerance tests |
  | Monthly Qualifying Borrower Gross Income | **PRESERVE** | `Cleartext ($9,850.00/mo)` | Core liquidity denominator needed for front-end and back-end DTI ratios |
  | Liquid Asset Balance Reserves | **PRESERVE** | `Cleartext ($47,200.00)` | Underwriting reserve threshold required for Fannie Mae/Freddie Mac AUS validation |

---

### 50. DevOps Incident Postmortems, PagerDuty Alerts & AWS CloudTrail Logs
- **Spoke Guide URL**: https://privacyscrubber.com/solutions/dev/devops-incident-response-postmortem-ai-privacy/
- **Target Persona**: Site Reliability Engineers (SRE), VP of Infrastructure, Cloud Security Architects & DevOps Leads
- **Primary Statutory Liability**: SOC 2 Type II Trust Services Criteria CC6.1 (Logical Access Controls), ISO/IEC 27001 Annex A.12 & SEC Item 1.05 Cybersecurity Disclosure Rules
- **Direct Answer (Featured Snippet)**: To safely draft incident postmortems and RCA summaries with AI, redact employee engineer names, IAM user ARNs, internal VPC IP addresses (10.x.x.x), production database hostnames, and exposed bearer tokens. Strictly preserve system outage durations (47 minutes), error status codes (HTTP 504), traffic degradation percentages (92%), and SLA downtime costs so LLMs can synthesize executive runbooks without exposing cloud topology.
- **Decision Matrix Summary**:
  | Field / Element | Action | Token / Output | Legal & Quantitative Rationale |
  |---|---|---|---|
  | Incident Commander & On-Call Engineer Names | **REDACT** | `[NAME_1], [NAME_2]` | Employee personnel PII protected from public or external breach attribution |
  | AWS IAM User / Role Amazon Resource Name (ARN) | **REDACT** | `[ARN_1]` | Cloud infrastructure identifier revealing account IDs and privilege hierarchies |
  | Internal VPC Subnet IPv4 Addresses (RFC 1918) | **REDACT** | `[IP_1], [IP_2]` | Private network topology data susceptible to lateral movement reconnaissance |
  | Production Database Cluster Internal Hostname | **REDACT** | `[HOSTNAME_1]` | Core database server DNS exposing internal routing infrastructure |
  | Exposed API Secret / JWT Session Bearer Token | **REDACT** | `[KEY_1]` | High-risk cryptographic secret triggering immediate access credential exposure |
  | Total Incident Outage Duration & MTTD/MTTR | **PRESERVE** | `Cleartext (47 minutes total / MTTD: 4m)` | Mandatory operational resilience metric required for postmortem timelines |
  | HTTP Error Status Codes & Failure Rates | **PRESERVE** | `Cleartext (HTTP 504 Gateway Timeout / 92% failure rate)` | Essential technical telemetry required for root cause analysis |
  | Financial SLA Credit & Customer Penalty Cost | **PRESERVE** | `Cleartext ($64,500.00 estimated SLA impact)` | Business impact calculation required for executive incident reporting |
  | Downstream Affected Service Microservices | **PRESERVE** | `Cleartext (auth-service, checkout-worker, payment-gateway)` | Generic architectural components needed for dependency graph modeling |



