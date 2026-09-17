# PrivacyScrubber Dual-Brand Messaging & GTM Playbook

**STRATEGIC GO-TO-MARKET GUIDE FOR privacyscrubber.com & COMMERCIAL CHANNELS**  
*Aligned with ZTDS.ai Standards Consortium &middot; BrandMeWeb Ecosystem*

---

## 1. Executive Strategic Positioning & Brand Isolation

To maximize institutional credibility and commercial revenue, the relationship between **ZTDS.ai** and **PrivacyScrubber** operates as a symbiotic flywheel under the **Two-Brand Strategic Mandate**:

| Entity | Role & Framing | Commercial Status |
| :--- | :--- | :--- |
| **ztds.ai** | Independent, vendor-neutral open standard consortium, RFC v1.0 specification author, and accreditation authority. | Open Specification (Apache 2.0 / CC BY 4.0). |
| **privacyscrubber.com** | The canonical Pioneer Reference Implementation and commercial engine provider. | Commercial PLG & High-ACV B2B Software. |

### The Golden Positioning Rule:
* **CORRECT:** 'PrivacyScrubber is the official pioneer reference implementation certified under the open ZTDS RFC v1.0 specification.'
* **INCORRECT:** 'PrivacyScrubber is ZTDS' or 'ZTDS is a product made by PrivacyScrubber.' (Blurring this line destroys the neutral authority of ZTDS and weakens enterprise trust).

---

## 2. Core Value Propositions by Target Persona

### Persona A: Individual Knowledge Worker / Developer (Free & PRO)
* **Pain Point:** Afraid to paste customer logs, financial data, or internal source code into ChatGPT, Claude, or Gemini due to corporate privacy bans.
* **The Message:**
  > 'Never send sensitive data to AI models unmasked. PrivacyScrubber intercepts your prompts right in your browser, masks PII locally in memory, and restores original values on the fly. Exactly 0 bytes leave your machine.'
* **Offer:** Free Chrome Extension & Web Scrubber &middot; PRO Tier (/mo or  Lifetime).

---

### Persona B: AI Engineer / Team Lead (Developer SDK)
* **Pain Point:** Building LangChain or RAG pipelines with OpenAI/Anthropic APIs, but blocked by InfoSec because cloud DLP proxies add 250ms+ latency and break LLM context.
* **The Message:**
  > 'A sub-millisecond in-memory data plane primitive. Drop @privacyscrubber/sdk into your LangChain callback handler or LlamaIndex pipeline. It replaces PII with contextual surrogate tokens in <1.8ms before network transmission, mathematically immunizing your vector database against GDPR Article 17 erasure orders.'
* **Offer:** Developer Pro Annual SDK (,990/yr).

---

### Persona C: Enterprise CISO / Data Protection Officer (Enterprise Air-Gapped)
* **Pain Point:** Enterprise AI adoption is frozen due to complex vendor risk assessments, third-party subprocessor chains under GDPR Article 28, and HIPAA BAA requirements.
* **The Message:**
  > 'Deploy sovereign AI without third-party vendor risk. PrivacyScrubber Enterprise executes inside your air-gapped VPC or AWS Nitro Enclaves with zero external telemetry. Because vendor servers never touch customer data, the software functions as a local computational utility legally exempt from DPA requirements.'
* **Offer:** Enterprise Air-Gapped Cluster (,000/yr).

---

## 3. Trust Anchors & Verification Backlinks

Every commercial touchpoint on privacyscrubber.com must feature these three verification badges linking back to institutional authorities:

1. **ZTDS Public Registry Link:**
   - Text: 'Audited & Verified under ZTDS RFC v1.0'
   - Link: https://ztds.ai/registry/#privacyscrubber-web
   - Audit Hash: sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24

2. **CERN / Zenodo Academic Paper:**
   - Text: 'Built on Formal De-Identification Entropy Proofs (DOI: 10.5281/zenodo.22058770)'
   - Link: https://doi.org/10.5281/zenodo.22058770

3. **OSF Empirical Benchmark Citation:**
   - Text: 'Peer-Reviewed 1.8ms Latency Benchmark (DOI: 10.17605/OSF.IO/5BYJF)'
   - Link: https://doi.org/10.17605/OSF.IO/5BYJF

---

## 4. Product Pricing Matrix on privacyscrubber.com

| Tier | Price | Primary Audience | Key Differentiators |
| :--- | :---: | :--- | :--- |
| **Free Tier** | zsh | Casual users & testers | 15,000 char quota, Universal Consumer PII (REGEX_RULES). |
| **PRO Tier** | /mo /  Lifetime | Developers, consultants, solo pros | Unlimited characters, multi-tab persistent RAM maps, priority updates. |
| **TEAMS Tier** | /mo flat | Law firms, medical clinics, SMBs | Up to 10 users, client-side Argon2id encrypted team token sharing. |
| **DEVELOPER SDK** | /mo / ,990/yr | SaaS founders & AI engineers | @privacyscrubber/sdk headless engine, LangChain/MCP connectors, 5 nodes. |
| **ENTERPRISE** | ,000/yr | Enterprise CISOs & healthcare | 100% air-gapped Nitro Enclaves, all 25 Specialized Profiles, SOC 2 Evidence Pack. |

---

## 5. Chrome Web Store & Marketing Copy Template

### Short Description (132 chars max):
Client-side zero-server PII & PHI sanitizer for ChatGPT, Claude, and Gemini. Mask sensitive data locally with 0 bytes network egress.

### Detailed Description (Excerpts):
PrivacyScrubber is a zero-trust, client-side data sanitization extension engineered for enterprise privacy in Generative AI.

Unlike traditional cloud DLP proxies that transmit your sensitive data to third-party servers for inspection, PrivacyScrubber executes 100% inside your browser local volatile RAM. 

Zero bytes of unmasked data ever cross external network sockets prior to sanitization.

### How It Works:
1. Intercepts sensitive prompts before DOM submission.
2. Replaces PII/PHI (names, emails, phones, SSNs, credit cards, medical identifiers) with reversible surrogate tokens ([NAME_1], [EMAIL_1]).
3. The AI model processes the tokenized prompt with full contextual reasoning.
4. When the AI responds, PrivacyScrubber seamlessly re-identifies original values in your local browser window.

### Built on Open Standards:
- Verified Reference Implementation under ZTDS RFC v1.0 (https://ztds.ai/registry/)
- Peer-reviewed research and formal proofs published on CERN/Zenodo (DOI: 10.5281/zenodo.22058770)
- Benchmarked on the Open Science Framework (DOI: 10.17605/OSF.IO/5BYJF)
