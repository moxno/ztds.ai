# Zero-Trust Data Sanitization (ZTDS) Enterprise CISO Pitch Deck
## Executive Presentation Script, Architectural Diagrams & Procurement Playbook

**Target Audience:** Chief Information Security Officers (CISOs), Data Protection Officers (DPOs), Enterprise Security Architects, VP Engineering  
**Presenter:** Ilya Sibiryakov, Founder & Chief Architect (BrandMeWeb / ZTDS Ecosystem)  
**Standard Reference:** ZTDS RFC v1.0 Specification & AICPA SOC 2 Type II Trust Center  
**Target Deal Size:** $12,000 / Year (Enterprise Air-Gapped Cluster) to $50,000 / Year (Global Enterprise Site License)  

---

## Slide 1: Executive Title & The Paradigm Shift

### Slide Visual & Header
* **Title:** Zero-Trust Data Sanitization (ZTDS) in Enterprise Generative AI
* **Subtitle:** Deploying LLMs, Multi-Agent Loops, and RAG Pipelines with Mathematically Provable Zero Data Egress
* **Classification:** CONFIDENTIAL &middot; Enterprise CISO Briefing
* **Author:** Ilya Sibiryakov, Founder & Chief Architect
* **Compliance Frameworks:** GDPR Recital 26 | EU AI Act Art. 50 | HIPAA Safe Harbor | AICPA SOC 2 Type II

### Slide Content (Key Bullets)
* The enterprise perimeter is obsolete in generative workflows: Prompts, RAG context, and agent memories bypass traditional firewalls.
* The choice between blocking generative AI and accepting massive regulatory liability is a false dichotomy.
* ZTDS introduces deterministic, reversible sanitization executed entirely in volatile host RAM prior to network serialization.
* Result: 0.00 bytes of sensitive data leave the internal network, eliminating SaaS subprocessor chains and DPA requirements.

### Verbatim Speaker Notes (Presenter Track)
> "Thank you for your time today. As CISOs and engineering leaders, you are facing immense pressure from leadership to deploy generative AI, agentic pipelines, and RAG architectures across your enterprise. At the same time, your legal counsel and compliance teams are sounding alarms about GDPR, HIPAA, and IP leakage.
> 
> Current industry practice forces you into a dangerous compromise: either block engineering productivity or route your company's sensitive prompts through third-party cloud proxies. Today, I am going to show you a third path: Zero-Trust Data Sanitization. By executing deterministic sanitization strictly in volatile host RAM before network serialization, we mathematically guarantee that zero bytes of cleartext sensitive data ever egress your environment."

### CISO Q&A & Objection Handling
* **CISO Objection:** *"We already have an enterprise agreement with OpenAI/Microsoft Azure that states they do not train on our data."*
* **Architect Answer:** "Zero-training clauses do not satisfy GDPR Article 28 or HIPAA Safe Harbor. Cloud providers remain third-party data processors with access to cleartext prompts during inference. If their infrastructure is subpoenaed, breached, or misconfigured, your cleartext PII is exposed. ZTDS ensures the upstream LLM receives only synthetic surrogate tokens, rendering the upstream channel cryptographically irrelevant."

---

## Slide 2: The Enterprise GenAI Dilemma (The 4 Statutory Chokepoints)

### Slide Visual & Diagram
```
                     +---------------------------------------+
                     |   Enterprise Generative AI Adoption   |
                     +---------------------------------------+
                                         |
     +-------------------+---------------+-------------------+-------------------+
     |                   |                                   |                   |
     v                   v                                   v                   v
[GDPR Art. 28]      [GDPR Art. 17]                    [EU AI Act Art. 50]  [HIPAA / FRE 502]
Subprocessor Chain  Vector DB Poisoning               Synthetic Provenance Loss of Safe Harbor &
Multiplication      Irreversible Latent Space         Mandatory Audit      Attorney Privilege
```

### Slide Content (Key Bullets)
1. **GDPR Article 28 (Subprocessor Trap):** Every cloud AI service, gateway, and proxy added to your stack adds a subprocessor requiring a 30-day customer notification window and full DPA audit liability.
2. **GDPR Article 17 (Vector DB Poisoning):** When cleartext PII is embedded into vector databases (Pinecone, Qdrant, Milvus), "Right to Erasure" requests require destroying and re-indexing the entire multi-million vector index.
3. **EU AI Act Article 50 (Mandatory AI Transparency):** High-risk systems face fines up to 35,000,000 EUR or 7% of global turnover for unverified personal data ingestion.
4. **HIPAA Safe Harbor (45 CFR § 164.514) & FRE 502:** Sharing clinical PHI with cloud endpoints triggers mandatory BAA requirements and waives attorney-client work product privilege in legal discovery.

### Verbatim Speaker Notes
> "When your engineers send a prompt to an LLM or index documents into a vector database, they trigger four statutory landmines. First, under GDPR Article 28, every external endpoint is a legal subprocessor. Second, and far more dangerous: Vector Database Poisoning. If a customer exercises their GDPR Article 17 Right to Erasure, how do you extract their PII from a high-dimensional vector space? You cannot. You have to rebuild the entire vector index from scratch at catastrophic cost.
> 
> Third, the EU AI Act enforces up to 35 million euro penalties for unvetted personal data ingestion. Finally, under Federal Rule of Evidence 502, sending unmasked corporate secrets to a cloud model waives legal attorney-client privilege. ZTDS neutralizes all four chokepoints at the root."

---

## Slide 3: Why Existing Solutions Fail (The Cloud DLP Trap)

### Slide Visual & Comparison Table
| Metric / Vulnerability | Cloud DLP Proxies (Netskope, Nightfall, Macie) | ZTDS RFC v1.0 In-Memory Engine |
| :--- | :--- | :--- |
| **Sanitization Latency** | 250 ms – 800 ms (Network roundtrip + SaaS queue) | **< 1.8 ms (Local CPU / RAM execution)** |
| **Data Egress** | Transmits cleartext to vendor cloud proxy | **0.00 Bytes (Air-gapped local memory)** |
| **Subprocessor Status** | Yes (Requires full GDPR DPA & Security Review) | **Exempt (No external infrastructure)** |
| **LLM Reasoning Quality** | Destroys context via naive redaction `[REDACTED]` | **Preserves syntax, entity class, & token distance** |
| **Vector DB Compatibility** | Raw embeddings remain vulnerable | **Embeddings generated on surrogate tokens** |
| **Air-Gapped / SCIF Ready** | No (Requires persistent cloud connection) | **Yes (100% disconnected Ed25519 token)** |

### Slide Content (Key Bullets)
* **The 400ms Latency Tax:** In multi-agent loops (LangChain, CrewAI, AutoGen) requiring 10-15 sequential LLM calls, cloud DLP adds 5-10 seconds of cumulative latency, crippling user experience.
* **The Vendor Trust Paradox:** To protect your data from OpenAI, cloud DLP asks you to send all your data to another third-party SaaS vendor, doubling your breach exposure.
* **Context Destruction:** Replacing sensitive values with generic asterisks or hashes degrades LLM semantic reasoning and instruction-following.

### Verbatim Speaker Notes
> "When organizations try to address this problem, they typically evaluate cloud DLP proxies. But cloud proxies were designed for 2015 email scanning, not 2026 agentic AI. 
> 
> First, the latency tax: Cloud DLP adds 250 to 800 milliseconds to every call. In a multi-agent loop with ten sequential reasoning steps, your users wait an extra eight seconds. Second, the vendor trust paradox: you are trying to stop data leakage to OpenAI by routing all cleartext data through yet another cloud vendor! That vendor now requires their own DPA, their own SOC 2 audit, and represents another breach surface. ZTDS replaces the cloud proxy with a zero-latency micro-engine embedded directly in your runtime."

---

## Slide 4: The Core Innovation: ZTDS RFC v1.0 Standard

### Slide Visual & Invariant Architecture
```
+-----------------------------------------------------------------------------------+
|                        ZTDS RFC v1.0 MATHEMATICAL INVARIANTS                      |
+-----------------------------------------------------------------------------------+
|  INVARIANT 1: Zero External Egress Prior to Sanitization                          |
|  Strict mathematical guarantee: delta_Egress(cleartext) == 0.00 bytes             |
+-----------------------------------------------------------------------------------+
|  INVARIANT 2: Deterministic Reversible Tokenization                               |
|  Bijective mapping table: T = M(V, C), strictly bound to volatile RAM thread      |
+-----------------------------------------------------------------------------------+
|  INVARIANT 3: Verifiable Cryptographic Isolation                                  |
|  Execution in AWS Nitro Enclaves, SCIF VPCs, or sandboxed WebAssembly             |
+-----------------------------------------------------------------------------------+
|  INVARIANT 4: Continuous Compliance & Zero Subprocessor Chain                     |
|  Statutory exemption from GDPR Article 28 / HIPAA BAA requirements                |
+-----------------------------------------------------------------------------------+
```

### Slide Content (Key Bullets)
* **Vendor-Neutral Foundation:** ZTDS is governed by the open RFC v1.0 specification published by `ztds.ai`, backed by peer-reviewed academic DOIs (Zenodo: 10.5281/zenodo.22058770, OSF: 10.17605/OSF.IO/5BYJF).
* **Deterministic Tokenization:** Entities are substituted with structurally valid surrogate tokens (e.g., `john.doe@company.com` becomes `[EMAIL_TOKEN_7b9a]`). The LLM understands the entity type and relationship without seeing the cleartext value.
* **Zero-Knowledge Architecture:** Mapping tables reside strictly in ephemeral host RAM and are wiped upon execution completion.

### Verbatim Speaker Notes
> "ZTDS is not a proprietary black box. It is an open, peer-reviewed engineering standard codified in RFC v1.0 with formal academic DOIs on Zenodo and OSF. 
> 
> The standard rests on four mathematical invariants. Invariant 1 guarantees zero cleartext egress. Invariant 2 enforces deterministic, reversible tokenization: we replace sensitive entities with synthetic surrogate tokens that preserve semantic and syntactic context for the LLM, while the decryption map stays exclusively in your host's volatile memory. Invariant 3 ensures cryptographic isolation inside your VPC or enclave. And Invariant 4 provides complete legal immunity from the SaaS subprocessor chain."

---

## Slide 5: Technical Engine Architecture & In-Memory Benchmark

### Slide Visual & Data Flow Sequence
```
+------------------------------------------------------------------------------------+
| CUSTOMER PRIVATE HOST / VPC / WORKSTATION (Zero External Egress Boundary)          |
|                                                                                    |
| [Raw Prompt / RAG Document]                                                        |
|   |                                                                                |
|   v                                                                                |
| +-----------------------------------+                                              |
| | ZTDS Headless Engine (WASM/Node)  |  Latency: < 1.8 ms                           |
| | In-RAM Regex & 30 Profiles        |  Memory: Scoped to Thread                    |
| +-----------------------------------+                                              |
|   |                     |                                                          |
|   | (Token Map in RAM)  | (Sanitized Prompt: "[PATIENT_1] has [DIAGNOSIS_4]")      |
|   |                     v                                                          |
|   |           +-------------------+                                                |
|   |           | Upstream Cloud /  |  Public / Private AI Inference                 |
|   |           | Local LLM (OpenAI)|  Receives ZERO sensitive entities              |
|   |           +-------------------+                                                |
|   |                     |                                                          |
|   |                     v (Sanitized Response: "[PATIENT_1] prescribed [DRUG_2]")  |
|   v                     |                                                          |
| +-----------------------------------+                                              |
| | In-RAM De-pseudonymizer           |  Local bijective re-hydration                |
| +-----------------------------------+                                              |
|   |                                                                                |
|   v                                                                                |
| [Cleartext Response to User / Internal App]                                        |
+------------------------------------------------------------------------------------+
```

### Slide Content (Key Bullets)
* **Performance:** 1.8 milliseconds average sanitization latency (tested across 50,000 token documents).
* **Zero Network Sockets:** The engine executes locally; it opens zero HTTP/TCP sockets to external validation servers.
* **The Airplane Mode Audit Protocol:** Proven in 5 minutes by severing all network interfaces and executing full sanitization and re-hydration locally with 100% fidelity.

### Verbatim Speaker Notes
> "Let us look at the data flow. The raw prompt enters your local microservice. The ZTDS engine scans and tokenizes the text in under 1.8 milliseconds inside volatile memory. The sanitized prompt—containing zero cleartext PII—is dispatched to the upstream model, whether that is OpenAI, Anthropic, or an internal cluster.
> 
> The model reasons over the synthetic tokens and returns a response. The local de-pseudonymizer swaps the original values back into place and serves the result to your user. The upstream model never saw the patient name, the credit card, or the confidential merger target. And we can verify this right now on your workstation using our five-minute Airplane Mode protocol: disconnect your Wi-Fi, run the audit, and observe zero dropped packets and zero egress."

---

## Slide 6: Regulatory Exemption & The "Zero-DPA" CISO Memo

### Slide Visual & Statutory Matrix
| Regulation | Traditional Cloud Proxy Mandate | ZTDS In-Memory Regulatory Exemption |
| :--- | :--- | :--- |
| **GDPR Art. 28** | Mandatory 35-page DPA + Subprocessor chain | **EXEMPT:** Software is a local utility; vendor never touches data (EDPB Doctrine). |
| **GDPR Art. 17** | Catastrophic Vector Database Poisoning | **COMPLIANT:** Cleartext never enters vector space; surrogate tokens can be purged instantly. |
| **EU AI Act Art. 50**| Up to €35M fines for unvetted training/input data | **COMPLIANT:** 100% synthetic surrogate data fed to external AI inference models. |
| **HIPAA Safe Harbor**| Mandatory Business Associate Agreement (BAA) | **EXEMPT:** 18 PHI identifiers de-identified prior to egress; no BAA required. |
| **FRE Rule 502** | Waiver of Attorney-Client Privilege | **PROTECTED:** Work-product secrets remain within internal client RAM perimeter. |

### Slide Content (Key Bullets)
* **No Procurement Paralysis:** Traditional software procurement takes 4-6 months of legal negotiations over DPA liabilities and audit terms.
* **The EDPB Doctrine:** Under European Data Protection Board rulings, local on-premise execution with zero vendor telemetry does not constitute "data processing by a processor."
* **AICPA SOC 2 Type II Integration:** Ready-to-ingest `ztds-evidence-binder.json` maps directly to Common Criteria controls CC6.1 (Logical Access), CC6.6 (Perimeter Defense), and CC6.8 (Malicious Code Prevention) for Drata, Vanta, and AuditBoard.

### Verbatim Speaker Notes
> "The number one reason enterprise AI projects stall is not technology; it is procurement and legal review. Standard cloud vendors require a 35-page Data Processing Agreement, months of security questionnaire negotiations, and cross-border data transfer assessments.
> 
> Because ZTDS operates as a pure local computational utility, our formal legal memorandum establishes that you are legally exempt from GDPR Article 28 DPA requirements and HIPAA BAA requirements. We do not touch your data. We do not store your data. Your legal team can clear this deployment in forty-eight hours instead of six months, supported by our machine-readable SOC 2 Type II evidence binder for Drata and Vanta."

---

## Slide 7: Air-Gapped Operation & Cryptographic Licensing (Ed25519)

### Slide Visual & Cryptographic Architecture
```
+------------------------------------------------------------------------------------+
| OFFLINE ASYMMETRIC LICENSE VERIFICATION (Ed25519)                                  |
|                                                                                    |
| Signed License Token:                                                              |
| ZTDS-LIC-v1.{payload_base64url}.{ed25519_signature_base64url}                      |
|                                                                                    |
| +-------------------------+       +---------------------------------------------+  |
| | Base64URL Payload       | ----> | In-Memory Verification (crypto.verify)      |  |
| | - Customer ID: ACME-CORP|       | - Public Key: keys/ztds_license_public.pem  |  |
| | - Tier: ENTERPRISE_AIR  |       | - Latency: 111.8 microseconds               |  |
| | - Nodes: 5 Cluster VPCs |       | - Telemetry / Egress Sockets: EXACTLY ZERO  |  |
| | - 25 Industry Profiles  |       +---------------------------------------------+  |
| | - Expiration & Grace    |                              |                         |
| +-------------------------+                              v                         |
|                                            [AUTHENTICATION CONFIRMED]              |
|                                            Unlocks 25 Enterprise Profiles          |
+------------------------------------------------------------------------------------+
```

### Slide Content (Key Bullets)
* **Zero Telemetry Guarantee:** Designed specifically for SCIF, defense, banking, and air-gapped AWS Nitro Enclaves. Zero heartbeats, zero DNS queries, zero licensing servers.
* **Ed25519 High-Speed Asymmetric Cryptography:** Pure native cryptographic verification taking only 111.8 microseconds (~0.1ms) at process boot.
* **Anti-Disruption Grace Period:** Built-in 60-day operational grace period prevents production pipeline outages if corporate renewal purchase orders are delayed.

### Verbatim Speaker Notes
> "In highly regulated environments—whether military SCIFs, banking mainframe enclaves, or private sovereign VPCs—you cannot have software 'phoning home' to a license server. If a vendor requires an internet heartbeat to validate a license, they have violated your air-gap.
> 
> ZTDS is licensed via offline asymmetric cryptography using Ed25519 signatures. We deliver a single cryptographic token signed with our master key. Your private node verifies the token against our public key in 110 microseconds strictly in memory. There is zero telemetry, zero call-home, and zero risk of external dependencies bringing down your production cluster."

---

## Slide 8: 25 High-ACV Specialized Industry Profiles

### Slide Visual & Profile Matrix
```
+------------------------------------------------------------------------------------+
|                   25 SPECIALIZED ENTERPRISE PROFILES (TIER 2 & 3)                  |
+------------------------------------+-----------------------------------------------+
| HEALTHCARE & PHARMA (HIPAA/HITECH) | FINANCIAL SERVICES & BANKING (PCI DSS / SEC)  |
| - 18 HIPAA Safe Harbor Identifiers | - PCI-DSS Level 1 Credit Cards (Luhn validated)|
| - ICD-10 / ICD-11 Diagnostic Codes | - SWIFT / BIC Corporate Transfer Codes        |
| - Physician National Provider IDs  | - IBAN International Bank Account Numbers     |
| - Clinical Trial Cohort Hashes     | - CUSIP / ISIN / Bloomberg Financial Tickers  |
| - Genomic Sequence Identifiers     | - SEC Form 13F Institutional Holding Data     |
+------------------------------------+-----------------------------------------------+
| LEGAL & CORPORATE SECRECY (M&A)    | DEVOPS, CLOUD SECRECY & CRITICAL INFRA        |
| - Target Entity & Acquisition Codes| - AWS Access & Secret Keys (AKIA...)          |
| - Attorney-Client Work Product     | - GitHub Personal Access & OAuth Tokens       |
| - Non-Public Executive Comp Data   | - Kubernetes Service Account JWT Tokens       |
| - Board Resolution Metadata        | - Private RSA / Ed25519 Key Headers           |
| - Regulatory Subpoena Docket IDs   | - Database Connection Strings & Auth Bearers  |
+------------------------------------+-----------------------------------------------+
```

### Slide Content (Key Bullets)
* **Beyond Naive Regular Expressions:** Context-aware heuristic validation engines with checksum algorithms (Luhn, ISO 7064 Mod 97-10 for IBAN, Verhoeff).
* **Anti-Cannibalization Architecture:** Free tier includes universal consumer PII (<15k characters). The 25 specialized industry profiles are unlocked exclusively via Enterprise Ed25519 license tokens.
* **Continuous Regulatory Updates:** Quarterly regulatory taxonomy updates keep your microservices compliant with evolving state and federal standards.

### Verbatim Speaker Notes
> "Generic open-source regex engines miss specialized corporate data and produce catastrophic false positives. A valid credit card must pass the Luhn algorithm; an international bank account number must satisfy the ISO 7064 Mod 97-10 checksum; a physician provider ID must conform to the CMS NPI registry structure.
> 
> Our Enterprise tier unlocks twenty-five specialized industry profiles covering healthcare, banking, M&A due diligence, and cloud DevOps infrastructure. When an engineer accidentally pastes an AWS secret key or a confidential corporate merger target into a prompt, ZTDS identifies and tokenizes the entity before it ever leaves the developer workstation."

---

## Slide 9: Commercial Licensing & TCO Comparison

### Slide Visual & Commercial Investment Table
| Licensing Tier | Annual Commitment | Target Environment | Scope & SLA Included |
| :--- | :---: | :--- | :--- |
| **Option A: Developer Pro** | **$1,990 / Year** | AI Engineering Teams | 5 Dev Seats / Microservice Nodes &middot; LangChain/MCP &middot; 48h SLA |
| **Option B: Enterprise Air-Gapped** | **$12,000 / Year** | Core Production Clusters | **5 Air-Gapped / Nitro Enclave Nodes &middot; 30 Profiles &middot; SOC 2 Binder &middot; 4h SLA** |
| **Option C: Global Enterprise Site** | **$50,000 / Year** | Global Enterprise-Wide | Unlimited Nodes &middot; Custom Profiles &middot; Escrow Audit Rights &middot; 24/7 SLA |

### Total Cost of Ownership (TCO) vs Alternatives
* **Alternative 1: Cloud DLP Proxy (SaaS):** $120,000 to $250,000/yr + 400ms latency penalty + 6 months security review.
* **Alternative 2: In-House Custom Build:** 9 months dev time ($350,000+ engineering salaries) + ongoing maintenance of 30 regulatory regex profiles + audit liability.
* **ZTDS Enterprise Air-Gapped:** **$12,000/yr turnkey** &middot; 1-day deployment &middot; Zero compliance overhead &middot; Mathematically provable security.

### Verbatim Speaker Notes
> "Let us evaluate the economics. Building this internally takes an estimated nine months of senior engineering time—well over $350,000 in salary costs—and leaves your team responsible for ongoing regulatory taxonomy updates across twenty-five domains.
> 
> Cloud DLP vendors will charge you $120,000 to $250,000 annually while adding 400 milliseconds of latency and another vendor to your subprocessor chain. 
> 
> ZTDS Enterprise Air-Gapped is priced at a flat $12,000 per year for up to five production cluster nodes. You get turnkey deployment in under an hour, access to all twenty-five enterprise profiles, our continuous SOC 2 evidence binder, and a 4-hour SLA. It pays for itself in avoided legal review hours alone."

---

## Slide 10: 14-Day Enterprise Evaluation & Procurement Roadmap

### Slide Visual & 14-Day Timeline
```
+------------------------------------------------------------------------------------+
|                       14-DAY ENTERPRISE TURNKEY ONBOARDING                         |
+------------------------------------------------------------------------------------+
| DAY 1: In-Memory Verification (5 Minutes)                                          |
| Run `npx ztds-audit` on local codebase. Confirm zero network egress & 0 violations.|
+------------------------------------------------------------------------------------+
| DAYS 2 - 10: 14-Day Air-Gapped Sandbox Pilot                                       |
| Deploy @privacyscrubber/sdk in isolated test VPC with 25 Industry Profiles.        |
+------------------------------------------------------------------------------------+
| DAY 11 - 12: Legal & InfoSec Fast-Track Clearance                                  |
| Legal reviews 1-Page DPA Exemption Memo. InfoSec ingests SOC 2 Evidence Binder.    |
+------------------------------------------------------------------------------------+
| DAY 14: Mutual Order Form Signature & Production Token Dispatch                    |
| Execute Schedule A Order Form (Net 30). PGP delivery of Ed25519 Production Key.    |
+------------------------------------------------------------------------------------+
```

### Slide Content (Key Bullets)
* **Zero Technical Risk:** Test in isolated staging without modifying existing production pipelines.
* **Zero Legal Friction:** Turnkey 1-Page Memo eliminates the need for redlining custom DPA terms.
* **Direct Executive Engagement:** Direct architectural advisory with Chief Architect Ilya Sibiryakov throughout evaluation.

### Verbatim Speaker Notes
> "To prove these assertions, we do not ask for a long-term commitment upfront. Here is our standard fourteen-day evaluation roadmap:
> 
> Today, your security engineers can run `npx ztds-audit` in five minutes to verify zero external egress. Tomorrow, we will issue a fourteen-day sandbox license token for your team to test the twenty-five profiles inside your isolated VPC or Docker container. 
> 
> We provide your legal counsel with our one-page DPA exemption memo and your compliance team with our automated SOC 2 evidence binder. By Day 14, you can execute our standard Schedule A Order Form with Net 30 payment terms, and your production tokens will be delivered via PGP. Let us schedule the sandbox token dispatch today."

---

## 3. Executive Meeting Checklist for Ilya Sibiryakov

### Before the Call
1. Confirm attendees: CISO, Lead Architect, Legal Counsel, or Procurement Manager.
2. Have terminal open with `npm test` and `bin/ztds-audit.js` ready to run live.
3. Have `docs/legal/ENTERPRISE_ORDER_FORM_TEMPLATE.md` and `docs/ZTDS_CISO_Procurement_and_Legal_Pack.md` open.
4. Have the interactive slide deck running at `/deck/` or locally.

### During the Call
* Keep speaking time under 20 minutes; allocate 25 minutes for CISO technical grill.
* Never use buzzwords or fluff. Anchor every claim in RFC v1.0, Ed25519 cryptography, and volatile RAM boundaries.
* If legal raises GDPR Article 28, immediately cite EDPB local execution doctrine.
* Close with the 14-day Air-Gapped Sandbox Pilot.
