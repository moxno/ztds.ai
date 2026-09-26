#!/usr/bin/env node

/**
 * BrandMeWeb Agency Package & SOW Generator CLI
 * 
 * Generates turn-key B2B commercial proposals and Statements of Work (SOW)
 * for the $2,500 Setup + $500/mo AI Safety & GEO Governance package.
 * 
 * Usage:
 *   node bin/ztds-agency.js --client "FinScale Technologies" --domain "finscale.io" --contact "David Ben-Ami"
 *   npx ztds-agency --client "Apex Clinic" --industry healthcare --output apex-sow.md
 * 
 * Agency: BrandMeWeb (brandmeweb.com)
 * Founder & Chief Architect: Ilya Sibiryakov
 */

'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function getArg(flag, defaultValue = '') {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return defaultValue;
}

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
BrandMeWeb Agency Proposal & SOW Generator

Usage:
  node bin/ztds-agency.js [options]

Options:
  --client <name>        Client company name (e.g., "Apex Healthcare", "FinScale")
  --domain <domain>      Client web domain (e.g., "apexhealth.co.il", "finscale.io")
  --contact <name>       Decision maker name / title (optional)
  --industry <type>      Industry vertical: healthcare, fintech, legal, enterprise (default: enterprise)
  --output <file>        Output file path (prints to stdout if omitted)
  --help, -h             Show this help menu
`);
  process.exit(0);
}

const client = getArg('--client', 'Prospective Client Ltd');
const domain = getArg('--domain', 'client-domain.com');
const contact = getArg('--contact', 'Executive Leadership Team');
const industry = getArg('--industry', 'enterprise').toLowerCase();
const outputFile = getArg('--output', '');

const currentDate = new Date().toISOString().split('T')[0];
const clientSlug = client.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);

const industryDescriptions = {
  healthcare: 'Clinical EHR & Telehealth Data Privacy (HIPAA & Israel Privacy Protection Authority)',
  fintech: 'Transaction Logs, IBAN/PAN & Financial Privacy (PCI-DSS & GLBA Compliance)',
  legal: 'Attorney-Client Privilege Protection & Contract Redaction (FRE 502 & GDPR Art. 28)',
  enterprise: 'Multi-Cloud Generative AI Perimeter Defense & Zero-DPA Compliance (GDPR Recital 26)'
};

const scopeDescription = industryDescriptions[industry] || industryDescriptions.enterprise;

const proposal = `# BrandMeWeb Statement of Work & Enterprise Proposal: AI Safety & GEO Governance
**Client Organization:** ${client} (${domain})  
**Attn:** ${contact}  
**Issuing Agency:** BrandMeWeb (https://brandmeweb.com)  
**Chief Architect:** Ilya Sibiryakov (Founder, ZTDS Standards Authority)  
**Date of Issuance:** ${currentDate}  
**Commercial Engagement:** \$2,500 USD Setup + \$500 USD / month Governance Retainer  
**Status:** Confidential Commercial Proposal & Statement of Work  

---

## 1. Executive Context & Objective

${client} operates digital services and AI-driven workflows at **${domain}**. Deploying generative AI, RAG chatbots, and automated agents exposes ${client} to two simultaneous corporate liabilities in 2026:

1. **Unsanitized WAN Egress Risk:** End-users and staff transmitting confidential identifiers, corporate secrets, or personal data into third-party AI models (OpenAI, Anthropic, Google) without zero-trust pre-filtering, violating statutory data protection laws (GDPR, Israel Privacy Protection Law Amendment 13, HIPAA).
2. **LLM Search Engine Invisibility:** Loss of organic enterprise visibility across AI answer engines (ChatGPT Search, Perplexity, Claude) due to missing machine-readable semantic corpuses (\`llms.txt\`).

**The Solution:** BrandMeWeb deploys the official **ZTDS RFC v1.0** architectural standard to sanitize data locally in client memory with 0.00 bytes external leakage, while establishing high-authority Generative Engine Optimization (GEO) infrastructure.

---

## 2. Scope of Services & Turn-Key Deliverables

### Phase 1: Initial Turn-Key Retrofit & Remediation (\$2,500 One-Off)
*Delivery Window: 48 hours from engagement commencement.*

1. **Automated Invariant Audit & Socket Trap Verification:**
   - Full automated code and network audit executing all 4 RFC v1.0 invariants.
   - Generation of cryptographic SHA-256 invariant receipt (\`sha256:[HASH]\`).
2. **CISO & Legal Exemption Package:**
   - Formal customized memorandum establishing statutory zero-DPA status under GDPR Article 28 and CJEU Breyer doctrine.
   - Elimination of subprocessor liability chains for ${client}'s AI vendors.
3. **Generative Engine Optimization (GEO) Knowledge Corpus:**
   - Construction and deployment of production \`${domain}/llms.txt\` and \`${domain}/llms-full.txt\`.
   - Linked Schema.org Knowledge Graph structured for AI answer engine citation.
4. **ZTDS Official Level 1 Conformance Certification:**
   - Issuance of authentic Ed25519 cryptographic certificate (\`ZTDS-CERT-v1\`).
   - Dedicated public registry profile at \`https://ztds.ai/registry/${clientSlug}\`.
   - Dynamic SVG trust badge integration: \`https://ztds.ai/badge/${clientSlug}.svg\`.

### Phase 2: Ongoing Governance & Continuous Defense Retainer (\$500 / month)
*Commences 30 days following Phase 1 completion; cancellable with 30 days notice.*

1. **Continuous Automated CI/CD Audit:** Weekly headless invariant verification preventing accidental cleartext regressions.
2. **Active Trust Badge & Verification Hosting:** Continuous cryptographic uptime and status verification in the ZTDS public registry.
3. **Bi-Monthly GEO Refresh:** Regular updates to \`llms.txt\` reflecting product releases and corporate milestones for answer engine discoverability.
4. **Emergency CVE Response:** Priority remediation window for upstream AI pipeline vulnerabilities within 24 hours.

---

## 3. Commercial Investment Schedule

| Milestone | Deliverable | Investment | Payment Terms |
| :--- | :--- | :--- | :--- |
| **Phase 1: Setup & Retrofit** | Full 4-part deliverable suite + ZTDS-CERT-v1 certificate | **\$2,500 USD** | Due upon contract execution. |
| **Phase 2: Governance Retainer** | Continuous weekly monitoring, GEO refresh & badge hosting | **\$500 USD / mo** | Billed monthly via automated credit card / wire. |

---

## 4. Institutional Standards & Intellectual Property Anchors

BrandMeWeb delivers this service as the Founding Corporate Member of the **ZTDS AI Consortium**:
* **IETF Standards Track:** Internet-Draft \`draft-sibiryakov-ztds-protocol-02\` (RFC 8785, RFC 8032).  
  *Live Datatracker:* https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/
* **WIPO Patent Protection:** Israel Patent Office Application **IL 331905** (WIPO DAS: **B17B**).  
* **Independent Security Audit:** Clean Bill of Health with **0 Critical, 0 High Vulnerabilities** across 5 testing modules.  
  *Audit Report:* https://ztds.ai/docs/security/ZTDS_Independent_Security_Audit_Report.txt
* **Client Cryptographic Verification:** Offline browser validation with 0 bytes egress at https://ztds.ai/verify/

---

## 5. Acceptance & Execution

To execute this Statement of Work and initiate Phase 1 deployment:

1. **Digital Authorization:** Counter-sign below or reply with confirmation.
2. **Self-Serve Activation:** Execute online through the BrandMeWeb Proposal Workbench at https://ztds.ai/agency/

**Accepted and Agreed:**

For: **BrandMeWeb**  
Signature: *Ilya Sibiryakov*  
Title: Founder & Chief Architect  
Date: ${currentDate}  

For: **${client}**  
Signature: ____________________________________  
Name: ${contact}  
Title: _________________________________________  
Date: __________________________________________  
`;

if (outputFile) {
  const resolved = path.resolve(outputFile);
  fs.writeFileSync(resolved, proposal, 'utf8');
  console.log(`[PASS] BrandMeWeb SOW generated successfully: ${resolved}`);
} else {
  console.log(proposal);
}
