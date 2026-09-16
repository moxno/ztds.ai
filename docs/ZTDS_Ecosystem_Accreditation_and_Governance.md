# ZTDS.ai — Ecosystem Accreditation, Fellows Taxonomy & Community Governance (2026 SSOT)

## 1. Governance Model & The Zero-Database Philosophy

The ZTDS ecosystem operates on a transparent, GitOps-driven governance model without centralized SQL databases, user tracking, or bureaucratic gatekeeping:
- **Single Source of Truth (SSOT):** All accredited products, corporate adopters, and global fellows are committed directly as structured JSON in Git (`ztds-ai/data/`).
- **Autonomous CI/CD Verification:** Every submission (via Web3Forms portal or direct GitHub Pull Request) undergoes automated static linting and schema validation.
- **Instant Global Sync:** Merging a PR automatically rebuilds the static catalog and updates `ztds.ai/llms.txt` within 15 seconds on Vercel Edge infrastructure.

---

## 2. Track A: Verified AI Products & Tools Registry (`/registry/`)

### Purpose & Requirements
Track A certifies software products, browser extensions, open-source libraries, and autonomous AI agents that comply with the 4 ZTDS invariants.

### Verification Criteria
1. **Volatile RAM Invariant:** Code review confirming session mappings are not written to persistent storage (localStorage, IndexedDB, disk).
2. **Zero Cleartext Egress:** Network packet audit confirming zero PII egress during sanitization.
3. **Sub-2ms Latency:** Local execution performance validation.
4. **Badge Placement:** The verified product must embed the dynamic SVG trust badge in its documentation, website footer, or pricing table:
   ```markdown
   [![ZTDS Verified](https://ztds.ai/badge/your-product.svg)](https://ztds.ai/registry/)
   ```

### Data Schema (`data/registry.json`)
```json
{
  "id": "privacyscrubber-web",
  "name": "PrivacyScrubber Web",
  "url": "https://privacyscrubber.com",
  "category": "Zero-Trust Web Sanitizer",
  "verified_at": "2026-09-15",
  "audit_hash": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "status": "active"
}
```

---

## 3. Track B: Corporate Adopters & Enterprise Partners Pool (`/companies/`)

### Purpose & Benefits
Track B showcases corporations, law firms, healthcare systems, and agencies that enforce client-side ZTDS protocols across their internal employee workflows.

### Flagship Founding Member: BrandMeWeb
- **Company:** BrandMeWeb (brandmeweb.com)
- **Sector:** Technical SEO & Generative Engine Optimization (GEO)
- **Role:** Founding Corporate Member
- **Compliance Policy:** Enforces 100% client-side sanitization across internal AI copywriting, keyword intelligence, and client analytics workflows to prevent client IP leakage into LLM training sets.

### Corporate Adopter Benefits
1. Verified profile in the ZTDS corporate catalog.
2. 1-Click CISO Procurement & DPA Exemption Memos.
3. Priority inclusion in the federated `llms.txt` knowledge base.
4. Demonstration of proactive AI governance to enterprise clients.

---

## 4. Track C: Global Fellows & Contributors Gallery (`/fellows/`)

### Gender-Neutral Academic Taxonomy
The fellowship structure follows prestigious international scientific bodies (IEEE, ACM, Royal Society) using strictly gender-neutral nomenclature:

1. **Founding Fellow / Research Fellow:**
   - *Target Persona:* Authors of mathematical proofs, core RFC specifications, and peer-reviewed preprints.
   - *Founding Anchor:* Ilya Sibiryakov (Author of ZTDS v1.0, ORCID: 0009-0002-0642-5985).
2. **Invited Expert / Advisory Member:**
   - *Target Persona:* CISOs, DPOs, and legal counsel contributing regulatory frameworks (GDPR, HIPAA, EU AI Act, CCPA).
3. **Core Contributor:**
   - *Target Persona:* Software engineers maintaining WASM runtimes, regex models, and open-source MCP adapters.
4. **Ambassador:**
   - *Target Persona:* Community leaders lecturing at cybersecurity conferences (DEF CON, Black Hat, OWASP).

### Admission Process
- 100% merit-based. Zero financial application fees.
- Peer nomination via `ztds.ai/apply/?track=fellow` or GitHub Pull Request.

---

## 5. Automated Intake & Webhook Architecture (`/apply/`)

The intake portal at `ztds.ai/apply/` uses a zero-database webhook pipeline:
```
[Applicant Form] ──POST──> [Web3Forms Webhook API] ──E-Mail / GitHub Dispatch──> [Maintainer Triage] ──PR Merge──> [Vercel Global Deploy]
```
- Form includes real-time SVG badge preview as the applicant types their product name.
- Web3Forms Access Key: `99aa0991-62fa-48b0-8f9f-5c94293f0b24`.
- All applicant data is triaged via email and committed to Git, preserving zero-server architecture.
