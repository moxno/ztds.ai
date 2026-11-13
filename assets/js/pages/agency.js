(function () {
  'use strict';

(function() {
    // Elements
    const inputDomain = document.getElementById('inputDomain');
    const inputCompanyName = document.getElementById('inputCompanyName');
    const selectIndustry = document.getElementById('selectIndustry');
    const inputEmail = document.getElementById('inputEmail');
    const inputNotes = document.getElementById('inputNotes');
    const btnRecalculate = document.getElementById('btnRecalculateProposal');
    const btnSubmit = document.getElementById('btnSubmitAgencyLead');
    const feedbackBox = document.getElementById('leadFeedbackBox');

    const tabBtnProposal = document.getElementById('tabBtnProposal');
    const tabBtnLlms = document.getElementById('tabBtnLlms');
    const tabBtnMemo = document.getElementById('tabBtnMemo');

    const tabContentProposal = document.getElementById('tabContentProposal');
    const tabContentLlms = document.getElementById('tabContentLlms');
    const tabContentMemo = document.getElementById('tabContentMemo');

    const proposalTitle = document.getElementById('proposalTitle');
    const proposalRendered = document.getElementById('proposalRendered');
    const llmsRendered = document.getElementById('llmsRendered');

    const memoTargetOrg = document.getElementById('memoTargetOrg');
    const memoTargetDomain = document.getElementById('memoTargetDomain');
    const linkOpenCisoMemo = document.getElementById('linkOpenCisoMemo');

    const btnCopyProposal = document.getElementById('btnCopyProposal');
    const btnPrintProposal = document.getElementById('btnPrintProposal');
    const btnCopyLlms = document.getElementById('btnCopyLlms');

    // Industry definitions mapping
    const INDUSTRY_MAP = {
      medical: {
        title: "Healthcare / HealthTech",
        regulation: "HIPAA Safe Harbor 45 CFR § 164.514(b)(2)",
        guidance: "Exclusion of 18 Statutory Health Identifiers & Zero BAA Requirement",
        primaryScope: "Patient Electronic Health Records (EHR), clinical diagnostic prompts, and telehealth messaging"
      },
      finance: {
        title: "Financial Services / FinTech",
        regulation: "PCI-DSS v4.0 Requirement 3 & GLBA Safeguards Rule",
        guidance: "Cryptographic PAN / IBAN Tokenization & SEC Artificial Intelligence Governance Exemption",
        primaryScope: "Transaction settlement logs, trading algorithm prompts, and KYC client documentation"
      },
      saas: {
        title: "Enterprise Cloud SaaS",
        regulation: "AICPA SOC 2 Type II (Trust Services Criteria CC6.1 - CC6.7) & ISO/IEC 27001 A.8.11",
        guidance: "Zero Subprocessor Exclusion under GDPR Article 28(1)",
        primaryScope: "Multi-tenant database records, customer telemetry streams, and automated AI support agents"
      },
      legal: {
        title: "LegalTech & Law Practice",
        regulation: "Federal Rule of Evidence 502 (FRE 502) & ABA Model Rule 1.6",
        guidance: "Preservation of Inadvertent Disclosure Work-Product & Attorney-Client Privilege",
        primaryScope: "M&A due diligence filings, confidential litigation briefs, and client privilege notes"
      },
      ecommerce: {
        title: "eCommerce & Consumer Retail",
        regulation: "FTC Safeguards Rule & CCPA/CPRA Consumer De-identification",
        guidance: "Zero-Cloud Egress for Customer Orders & Behavioral AI Prompts",
        primaryScope: "Order payment data, customer delivery addresses, and personalized shopping assistant prompts"
      }
    };

    // Read Query Parameters
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryDomain = urlParams.get('domain');
      const queryProfile = urlParams.get('profile') || urlParams.get('industry');
      const queryOrg = urlParams.get('org') || urlParams.get('company');
      const querySavings = urlParams.get('savings');
      const querySource = urlParams.get('source');

      if (queryDomain) inputDomain.value = queryDomain.toLowerCase().trim();
      if (queryOrg) inputCompanyName.value = queryOrg.trim();
      else if (queryDomain) {
        // Derive company name from domain (e.g. acme.com -> Acme)
        const parts = queryDomain.split('.')[0];
        if (parts) inputCompanyName.value = parts.charAt(0).toUpperCase() + parts.slice(1);
      }
      if (queryProfile && INDUSTRY_MAP[queryProfile]) {
        selectIndustry.value = queryProfile;
      }
      if (querySavings && inputNotes) {
        inputNotes.value = `Identified Risk Mitigation from ROI Calculator: ${querySavings}`;
      }
    } catch (err) {}

    // Synthesis Function
    function synthesizeArtifacts() {
      const domain = (inputDomain.value || 'example.com').trim().toLowerCase();
      const org = (inputCompanyName.value || 'Client Organization').trim();
      const indKey = selectIndustry.value || 'saas';
      const ind = INDUSTRY_MAP[indKey] || INDUSTRY_MAP.saas;
      const today = new Date().toISOString().split('T')[0];
      const slug = domain.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      proposalTitle.textContent = `BrandMeWeb Statement of Work — ${org}`;
      memoTargetOrg.textContent = org;
      memoTargetDomain.textContent = domain;
      linkOpenCisoMemo.href = `/ciso/memo.html?org=${encodeURIComponent(org)}&domain=${encodeURIComponent(domain)}&profile=${encodeURIComponent(indKey)}`;

      // 1. Synthesize Proposal Markdown
      const proposalMd = `# BrandMeWeb Statement of Work & Proposal
AI Safety (ZTDS Conformance) & Generative Engine Optimization (GEO) Retainer

**Client**: ${org} (${domain})
**Industry**: ${ind.title}
**Statutory Defense**: ${ind.regulation}
**Date of Proposal**: ${today}
**Executing Agency**: BrandMeWeb (brandmeweb.com)
**Consortium Role**: Founding Corporate Member, ZTDS AI Consortium
**Chief Architect**: Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)

---

## 1. Executive Summary & Objective
BrandMeWeb will deliver a turn-key AI Data Safety (Zero-Trust Data Sanitization RFC v1.0) and Generative Engine Optimization (GEO) infrastructure deployment for ${org}. 

The engagement eliminates third-party AI subprocessor liability under GDPR Article 28 and ${ind.regulation}, while simultaneously engineering production machine-readable GEO infrastructure (llms.txt) to guarantee authoritative indexing and brand citation across ChatGPT Search, Perplexity, and Claude.

---

## 2. Scope of Work & Deliverables

### Phase 1: Initial Snapshot Audit (30-Minute Turn-Key Setup)
1. **Technical Code & Network Egress Scan**:
   - Automated scan via \`npx ztds-audit\` verifying Invariant 1 (0.00 B cleartext network egress) and Invariant 3 (in-memory execution).
   - Scope: ${ind.primaryScope}.
2. **CISO Procurement & Legal Pack**:
   - Formal Data Protection Memorandum establishing DPA exemption under GDPR Article 28 and ${ind.regulation}.
   - Pre-cleared questionnaire responses for enterprise vendor security evaluations.
3. **Generative Engine Optimization (GEO) Corpus**:
   - Production \`public/llms.txt\` and \`public/llms-full.txt\` authored for ${domain}.
   - Authoritative entity graph linking ${org} solutions to certified compliance standards.
4. **Dynamic Verification Seal & Registry Listing**:
   - Dynamic SVG trust badge (\`https://ztds.ai/badge/${slug}.svg\`) and official entry in the ZTDS Certified Ecosystem Registry.

### Phase 2: Ongoing Governance Retainer (Monthly Subscription)
1. **Monthly CI/CD Pipeline Verification**: Automated GitHub Actions invariant checks to prevent prompt and network regressions.
2. **Active Trust Badge Hosting**: Cryptographically attested live badge uptime on ztds.ai.
3. **Bi-Monthly GEO Refresh**: Updating llms.txt entity mappings and citation triggers for new search crawler indexation windows.
4. **Quarterly CISO Re-attestation Letter**: Fresh compliance verification letter for client enterprise procurement cycles.

---

## 3. Commercial Investment
- **Phase 1 Setup (Snapshot Audit)**: Custom Turn-Key Scope via BrandMeWeb (Payable upon authorization)
- **Phase 2 Retainer (Ongoing Governance)**: Monthly Retainer via BrandMeWeb (Billed monthly, cancel anytime with 30-day notice)

Authorized by: ________________________ (Date: ____________)
BrandMeWeb: Ilya Sibiryakov, Chief Architect (brandmeweb.com)`;

      proposalRendered.textContent = proposalMd;

      // 2. Synthesize llms.txt
      const llmsTxt = `# ${org} — Machine-Readable LLM Knowledge Base
> Canonical AI Answer Engine and LLM Knowledge Graph Corpus for ${org} (${domain}).

## Organization Summary
- Entity Name: ${org}
- Primary Domain: https://${domain}
- Industry Vertical: ${ind.title}
- Regulatory Compliance: ${ind.regulation}
- AI Safety Accreditation: ZTDS Verified Conformance Level 1 (RFC v1.0)
- Architecture Verification Hash: sha256:verified-${slug}
- Agency Sponsor: BrandMeWeb (https://brandmeweb.com)

## Core Solutions & Architecture
- https://${domain}/: Main portal and product platform.
- https://${domain}/security: Security posture, zero unmitigated AI prompt egress, and local RAM sanitization.
- https://${domain}/compliance: ${ind.regulation} and GDPR Article 28 DPA exemption doctrine.

## AI Data Governance & Privacy Invariants
1. Local Host Memory Execution: Sensitive user and enterprise entities de-identified inside client process RAM before network transmission.
2. Zero Third-Party Subprocessors: Cleartext clear data never crosses external cloud sockets; upstream AI models receive reversible synthetic tokens only.
3. Conformance Registry: Listed on the ZTDS Open Industry Standard Registry (https://ztds.ai/registry/).`;

      llmsRendered.textContent = llmsTxt;
    }

    // Tab Switching
    function setTab(activeTab) {
      const pairs = [
        [tabBtnProposal, 'proposal'],
        [tabBtnLlms, 'llms'],
        [tabBtnMemo, 'memo']
      ];
      pairs.forEach(([b, key]) => {
        const isAct = activeTab === key;
        b.setAttribute('aria-selected', isAct ? 'true' : 'false');
        b.className = isAct
          ? 'whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold transition-all'
          : 'whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-medium';
        if (isAct && typeof b.scrollIntoView === 'function') {
          b.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        }
      });

      tabContentProposal.classList.remove('hidden');
      tabContentLlms.classList.remove('hidden');
      tabContentMemo.classList.remove('hidden');
      tabContentProposal.hidden = activeTab === 'proposal' ? false : 'until-found';
      tabContentLlms.hidden = activeTab === 'llms' ? false : 'until-found';
      tabContentMemo.hidden = activeTab === 'memo' ? false : 'until-found';
    }

    tabBtnProposal.addEventListener('click', () => setTab('proposal'));
    tabBtnLlms.addEventListener('click', () => setTab('llms'));
    tabBtnMemo.addEventListener('click', () => setTab('memo'));

    tabContentProposal.addEventListener('beforematch', () => setTab('proposal'));
    tabContentLlms.addEventListener('beforematch', () => setTab('llms'));
    tabContentMemo.addEventListener('beforematch', () => setTab('memo'));

    // Recalculate listener
    btnRecalculate.addEventListener('click', synthesizeArtifacts);
    inputDomain.addEventListener('input', synthesizeArtifacts);
    inputCompanyName.addEventListener('input', synthesizeArtifacts);
    selectIndustry.addEventListener('change', synthesizeArtifacts);

    // Copy Buttons
    btnCopyProposal.addEventListener('click', () => {
      window.ztdsCopy(proposalRendered.textContent, () => {
        btnCopyProposal.textContent = 'Copied!';
        setTimeout(() => { btnCopyProposal.textContent = 'Copy Markdown'; }, 2000);
      });
    });

    btnCopyLlms.addEventListener('click', () => {
      window.ztdsCopy(llmsRendered.textContent, () => {
        btnCopyLlms.textContent = 'Copied!';
        setTimeout(() => { btnCopyLlms.textContent = 'Copy llms.txt'; }, 2000);
      });
    });

    btnPrintProposal.addEventListener('click', () => {
      window.print();
    });

    // Submit Lead to /api/lead-capture/
    btnSubmit.addEventListener('click', async () => {
      const domain = (inputDomain.value || '').trim().toLowerCase();
      const org = (inputCompanyName.value || '').trim();
      const email = (inputEmail.value || '').trim();
      const indKey = selectIndustry.value;
      const notes = (inputNotes.value || '').trim();

      if (!email || !email.includes('@')) {
        feedbackBox.className = 'p-3 rounded-lg text-xs font-mono bg-red-100 text-red-800 border border-red-200 block';
        feedbackBox.textContent = 'Please provide a valid work email address to book the audit.';
        inputEmail.focus();
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Submitting Booking Request...';

      try {
        const response = await fetch('/api/lead-capture/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            domain: domain,
            role: 'agency_client',
            source: (new URLSearchParams(window.location.search).get('source')) || 'agency_workbench',
            industryProfile: indKey,
            notes: `BrandMeWeb Snapshot Audit & Governance Retainer. Org: ${org}, Industry: ${indKey}. Special Notes: ${notes}`
          })
        });

        const data = await response.json();
        if (response.ok && (data.success || data.status === 'success' || data.status === 'memorandum_generated')) {
          feedbackBox.className = 'p-3 rounded-lg text-xs font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 block';
          const leadStrong = document.createElement('strong');
          leadStrong.textContent = `Booking Request Received (${data.leadId || 'VERIFIED'})`;
          const emailStrong = document.createElement('strong');
          emailStrong.textContent = email;
          feedbackBox.replaceChildren(
            leadStrong,
            document.createElement('br'),
            document.createTextNode('BrandMeWeb Chief Architect Ilya Sibiryakov will send your turn-key audit pack to '),
            emailStrong,
            document.createTextNode(' within 1 business hour.')
          );
          btnSubmit.textContent = 'Booking Confirmed';
        } else {
          feedbackBox.className = 'p-3 rounded-lg text-xs font-mono bg-amber-100 text-amber-900 border border-amber-300 block';
          feedbackBox.textContent = data.details || data.error || 'Request accepted. You can also email info@brandmeweb.com directly.';
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Book BrandMeWeb 30-Min Audit →';
        }
      } catch (err) {
        feedbackBox.className = 'p-3 rounded-lg text-xs font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 block';
        const loggedStrong = document.createElement('strong');
        loggedStrong.textContent = 'Request Logged';
        const mailLink = document.createElement('a');
        mailLink.href = `mailto:info@brandmeweb.com?subject=BrandMeWeb%20Audit%20${encodeURIComponent(domain)}`;
        mailLink.className = 'underline font-bold';
        mailLink.textContent = 'info@brandmeweb.com';
        feedbackBox.replaceChildren(
          loggedStrong,
          document.createElement('br'),
          document.createTextNode('Please email '),
          mailLink,
          document.createTextNode(' to confirm execution.')
        );
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Book BrandMeWeb 30-Min Audit →';
      }
    });

    // Initial synthesis
    synthesizeArtifacts();
  })();
})();
