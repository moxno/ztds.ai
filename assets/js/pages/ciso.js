(function () {
  'use strict';

const memoContent = `# CISO Procurement & Safe Harbor Pack: Zero-Trust Data Sanitization (ZTDS RFC v1.0)
DOCUMENT ID: ZTDS-CISO-2026-V1
STATUS: TECHNICAL SAFE HARBOR & PROCESSOR ELIMINATION
RATIFIED: September 2026
DOI: 10.5281/zenodo.22058770

TO: Chief Information Security Officer (CISO), Data Protection Officer (DPO), Enterprise Procurement
FROM: Ilya Sibiryakov, Specification Author & Chief Architect (ZTDS.ai / BrandMeWeb)
SUBJECT: Architectural & Statutory Grounds for Technical Safe Harbor and Elimination of Third-Party Data Processing Agreements (DPA) under GDPR Articles 28 & 32 and Israel PPL Amendment 13

## 1. Executive Summary & Core Principle
Software conforming to the Zero-Trust Data Sanitization (ZTDS RFC v1.0) specification operates strictly as a 100% client-side computational utility.
Because conforming software executes de-identification strictly within volatile client RAM before outbound network transmission, exactly zero (0.00) bytes of cleartext sensitive data are transmitted to or processed by external vendor servers.
Consequently, ZTDS-conforming architectures eliminate the third-party Data Processor relationship under GDPR Article 28 and BAA burdens under HIPAA for the utility itself. By stripping direct identifiers and reducing contextual entropy in client RAM, conforming deployments also establish an objective Technical Safe Harbor under GDPR Article 32 and Israel PPL Amendment 13 Section 17, minimizing statutory risk exposure.

## 2. The 4 Non-Negotiable Invariants (RFC v1.0)
- Invariant 1 (Zero External Egress): ΔEgress(S) ≡ 0.00 bytes across public sockets S_WAN.
- Invariant 2 (Deterministic Reversible Tokens): Bijective in-memory transformation P_final = T^-1(P_out, R).
- Invariant 3 (Verifiable Memory Isolation): Zero persistent disk/storage writes. RAM purges on termination.
- Invariant 4 (Subprocessor Exclusion): GDPR Article 28 disengaged; subprocessor liability chain = 0.

## 3. Statutory Grounds for Exemption & Regulatory Alignment
- EU GDPR Article 28: Zero external data processing occurs. Conforming tools do not act as data processors under EDPB Guidelines 07/2020.
- EU GDPR Recital 26: Anonymous data doctrine applies to masked prompts sent downstream to AI models.
- EU GDPR Article 17: Right to Erasure guaranteed without vector DB re-indexing by preventing PII ingestion into RAG embeddings.
- EU AI Act Phase 2 & Article 10: Enforces client-side pre-egress data governance for autonomous agentic workflows and tool-use loops.
- NIST AI RMF 600-1: Mitigates Generative AI Risk 12 (Sensitive Data Disclosure) via RAM-only execution and context-preserving tokenization.
- ISO/IEC 42001:2023 & ISO 27001 A.8.11: Fulfills AI Management System controls for data provenance, security, and presentation-layer masking.
- US HIPAA (45 CFR § 164.514): Safe Harbor 18 PHI identifier exclusion performed in client RAM prior to API egress.
- US FRE 502(b): Attorney-client privilege non-waiver protection for confidential discovery documents.

## 4. Statutory Penalty Ceilings & Actuarial Mitigation
- GDPR Article 83(5): Up to €20,000,000 or 4% of Global Annual Turnover.
- EU AI Act Article 99: Up to €15,000,000 or 3% of Global Annual Turnover.
- HIPAA HITECH Tier 4: $2,067,813 Statutory Annual Cap per Violation Category.
- US GLBA & SEC Item 106: Financial NPI protection & $7,500/record statutory civil remedies.

## 5. Subprocessor Chain Overhead Elimination ($25,000 / Vendor / Year)
- Legal DPA Contract Negotiation & SCCs: $8,000 / vendor / yr.
- TPRM & SIG Lite Annual Security Audits: $9,000 / vendor / yr.
- Continuous SOC 2 Subprocessor Chain Auditing: $8,000 / vendor / yr.
- Net Savings: $25,000 / vendor eliminated by in-RAM ZTDS execution.

## 6. Enterprise Security Questionnaire Responses (SIG Lite / CAIQ v4 / VSAQ)
- DSP-01 (Data Storage): Nowhere. Volatile host process RAM only. No persistent storage.
- NET-02 (External Egress): Exactly 0.00 bytes. Zero analytics, telemetry, or socket transmission.
- CRY-03 (Key Custody): Client-side volatile memory only. Zero vendor custody or remote escrow.
- CRY-04 (Team Handoff): Argon2id and XChaCha20-Poly1305 client-side encryption.
- TPR-05 (Subprocessors): None. Zero third-party subprocessors in data processing path.
- AUD-06 (Verification): 5-Step Airplane Mode protocol and "npx ztds-audit --dir ./src".

## 7. On-Premise Air-Gapped Source Code License Terms
- Perpetual internal execution rights within air-gapped networks, microservices, and private VPCs.
- 100% disconnected SCIF deployment with zero telemetry or phone-home heartbeats.
- Offline cryptographic Ed25519 token verification with built-in 60-day grace period.`;

    const sigLiteContent = `# ZTDS RFC v1.0 — Enterprise Security Questionnaire Answers (SIG Lite / CAIQ v4 / VSAQ)
DOCUMENT ID: ZTDS-SIG-2026-V1
SPECIFICATION: RFC v1.0 Canonical Standard
STATUS: RATIFIED & AUDIT-READY

## Control DSP-01 (Data Storage & Retention)
Q: Where is customer prompt data hosted or stored?
A: Nowhere. Cleartext sensitive data and token maps reside strictly in volatile RAM. No data is ever written to disk, databases, cookies, or cloud storage. Memory is purged immediately on process termination.

## Control NET-02 (External Egress & Telemetry)
Q: Does conforming software transmit telemetry, analytical data, or socket traffic to vendor servers?
A: Exactly 0.00 bytes. Conforming builds operate air-gapped with zero phone-home calls, analytics pings, or license heartbeats. All network interfaces are verifiable via "npx ztds-audit --network".

## Control CRY-03 (Reversible Key Custody)
Q: Who holds custody of reversible tokenization keys?
A: The customer process exclusively. Ephemeral keys are generated in volatile client RAM via CSPRNG and destroyed immediately upon process exit. Zero vendor key escrow or third-party custody exists.

## Control CRY-04 (Team Handoff Encryption)
Q: How are collaborative mappings secured between authorized team members?
A: Ephemeral keys are exchanged peer-to-peer via Argon2id key derivation and XChaCha20-Poly1305 authenticated symmetric encryption without crossing vendor servers.

## Control TPR-05 (Third-Party Subprocessors)
Q: Which third-party subprocessors process customer sensitive data?
A: None. Zero third-party subprocessors exist in the data path. Conforming software operates as a local computational binary, disengaging GDPR Article 28 DPA requirements.

## Control AUD-06 (Continuous Compliance Verification)
Q: How can enterprise compliance teams audit zero-egress invariants?
A: Compliance teams can execute the 5-Step Airplane Mode protocol and run "npx ztds-audit --dir ./src" in CI/CD pipelines to verify SHA-256 conformance test receipts.`;

    const hipaaContent = `# ZTDS RFC v1.0 — Healthcare & Statutory Safe Harbor Legal Memorandum
DOCUMENT ID: ZTDS-HIPAA-2026-V1
STATUTORY AUTHORITIES: 45 CFR § 164.514(b)(2), FRE 502(b), ABA Model Rule 1.6(c)

## 1. HIPAA Safe Harbor De-Identification Doctrine (45 CFR § 164.514(b)(2))
Under 45 CFR § 164.514(b)(2), health information is not Individually Identifiable Health Information if all 18 enumerated categories of identifiers are removed.
ZTDS deterministic client-side tokenization removes all 18 PHI identifiers (names, geographic subdivisions, dates, phone numbers, email addresses, SSNs, MRNs, health plan numbers, account numbers, certificate/license numbers, vehicle IDs, device serials, URLs, IP addresses, biometric identifiers, photos, and any unique characteristic) strictly within volatile client RAM before outbound network transmission.
Consequently, downstream cloud LLM providers (OpenAI, Anthropic, Google) receive only de-identified surrogate tokens, eliminating Business Associate Agreement (BAA) requirements.

## 2. Federal Rule of Evidence 502(b) Non-Waiver Privilege Defense
Inadvertent disclosure of attorney-client privileged material or corporate work product to an external LLM prompt does not constitute a waiver under FRE 502(b) if:
1. The disclosure is inadvertent;
2. The holder of the privilege took reasonable steps to prevent disclosure; and
3. The holder promptly took reasonable steps to rectify the error.
Deploying an automated client-side ZTDS tokenization filter establishes statutory evidence of "reasonable steps" under FRE 502(b)(2).

## 3. Financial Services & GLBA Non-Public Personal Information (NPI)
Under the Gramm-Leach-Bliley Act (15 U.S.C. § 6801) and SEC Regulation S-P, financial institutions must protect consumer NPI. ZTDS tokenizes PAN, account numbers, and SWIFT/IBAN data in volatile memory, preventing cleartext disclosure and avoiding statutory damages of up to $7,500 per record.`;

    const licenseContent = `# ZTDS RFC v1.0 — Enterprise Air-Gapped Source Code License Terms
DOCUMENT ID: ZTDS-LIC-2026-V1
LICENSOR: Ilya Sibiryakov (BrandMeWeb)
GOVERNING LAW: State of Israel & Paris Convention IP Framework

## 1. Perpetual Internal Execution Right
The Licensee receives a perpetual, non-exclusive, non-transferable license to inspect, compile, and execute the ZTDS core engine source code strictly within internal corporate networks, private cloud VPCs, and microservice architectures.

## 2. 100% Disconnected SCIF & Air-Gapped Authorization
Licensee is expressly authorized to deploy the engine in 100% disconnected, Sensitive Compartmented Information Facility (SCIF), or air-gapped environments with zero outbound network connectivity. The software contains zero phone-home mechanisms, analytics collectors, or mandatory network licensing heartbeats.

## 3. Offline Cryptographic Verification & Grace Period
Software validation operates via offline Ed25519 asymmetric cryptographic tokens. Conforming engines verify digital signatures locally in volatile memory (<0.2ms) without external socket calls, including a built-in 60-day operational grace period.

## 4. Proprietary IP Reservation
All rights under U.S. & International Patents Pending (Paris Convention Priority) and Trademark ZTDS™ #182655957 remain the sole intellectual property of Ilya Sibiryakov / BrandMeWeb. Conforming implementations are authorized under enterprise license schedules.`;

    // Copy & Markdown download triggers for Hero Header
    const copyMemoBtn = document.getElementById('copyMemoBtn');
    if (copyMemoBtn) {
      copyMemoBtn.addEventListener('click', () => {
        window.ztdsCopy(memoContent, () => {
          const toast = document.getElementById('copyToast');
          if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
          }
        });
      });
    }

    const downloadMdBtn = document.getElementById('downloadMdBtn');
    if (downloadMdBtn) {
      downloadMdBtn.addEventListener('click', () => {
        const blob = new Blob([memoContent], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ZTDS-CISO-Procurement-Memo-2026.md';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Downloads Hub Full Markdown Download
    const btnDownloadHubMd = document.getElementById('btnDownloadHubMd');
    if (btnDownloadHubMd) {
      btnDownloadHubMd.addEventListener('click', () => {
        const fullDossier = `# ZTDS RFC v1.0 — Enterprise CISO & Zero-DPA Procurement Dossier
RATIFIED: September 2026
CHIEF ARCHITECT: Ilya Sibiryakov (BrandMeWeb)

${memoContent}

---

${sigLiteContent}

---

${hipaaContent}

---

${licenseContent}`;

        const blob = new Blob([fullDossier], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ZTDS-CISO-Complete-Procurement-Dossier-2026.md';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // CISO Quick Scenario Estimator Logic
    function calculateCisoEstimator() {
      const callsSlider = document.getElementById('cisoCallsSlider');
      const vendorsSlider = document.getElementById('cisoVendorsSlider');
      const regimeSelect = document.getElementById('cisoRegimeSelect');

      if (!callsSlider || !vendorsSlider || !regimeSelect) return;

      const calls = parseInt(callsSlider.value, 10);
      const vendors = parseInt(vendorsSlider.value, 10);
      const regime = regimeSelect.value;

      // Direct DPA savings: $25k / vendor ($8k legal + $9k TPRM + $8k SOC2)
      const dpaSavings = vendors * 25000;

      // Actuarial breach avoidance: Ponemon $165/record * 0.5% breach prob * 7.8% AI share * records
      // annualRecords = calls * 0.25 (sensitive ratio) * 3 (avg sensitive records per prompt) * 12 (months)
      const annualRecords = calls * 0.25 * 3 * 12;
      const expectedBreachCost = annualRecords * 165 * 0.078 * 0.005;
      const normalizedBreachCost = Math.max(expectedBreachCost, 45000);

      // Regulatory fine mitigation buffer
      const regimeFineMap = {
        global: 75000,
        eu: 50000,
        us_hipaa: 125000,
        us_fintech: 52000,
        us_legal: 55000
      };
      const regimeFine = regimeFineMap[regime] || 50000;

      const totalExposure = dpaSavings + normalizedBreachCost + regimeFine;
      const roiMultiple = Math.max(1, Math.round(totalExposure / 12000));

      // Update readouts
      const callsValEl = document.getElementById('cisoCallsVal');
      const vendorsValEl = document.getElementById('cisoVendorsVal');
      if (callsValEl) callsValEl.textContent = calls.toLocaleString('en-US') + ' / mo';
      if (vendorsValEl) vendorsValEl.textContent = vendors + (vendors === 1 ? ' vendor' : ' vendors');

      const dpaSavingsEl = document.getElementById('cisoDpaSavings');
      const breachSavingsEl = document.getElementById('cisoBreachSavings');
      const totalExposureEl = document.getElementById('cisoTotalExposure');
      const roiMultipleEl = document.getElementById('cisoRoiMultiple');

      if (dpaSavingsEl) dpaSavingsEl.textContent = '$' + Math.round(dpaSavings).toLocaleString('en-US') + ' / yr';
      if (breachSavingsEl) breachSavingsEl.textContent = '$' + Math.round(normalizedBreachCost).toLocaleString('en-US') + ' / yr';
      if (totalExposureEl) totalExposureEl.textContent = '$' + Math.round(totalExposure).toLocaleString('en-US') + ' / yr';
      if (roiMultipleEl) roiMultipleEl.textContent = roiMultiple + 'x Multiple';

      // Update deep-dive ROI link
      const deepDiveBtn = document.getElementById('btnDeepDiveRoi');
      if (deepDiveBtn) {
        deepDiveBtn.href = `/roi/?calls=${calls}&vendors=${vendors}&regime=${encodeURIComponent(regime)}&ratio=25&records=3`;
      }
    }

    // Battlecard Tabs, URL Hash & Search Filter Logic
    function initBattlecards() {
      const tabBtns = document.querySelectorAll('.bc-tab-btn');
      const panes = document.querySelectorAll('.bc-pane');
      const searchInput = document.getElementById('bcSearchInput');
      const clearBtn = document.getElementById('bcSearchClear');
      const countEl = document.getElementById('bcSearchCount');

      function activateTab(slug) {
        let matchedBtn = null;
        tabBtns.forEach(btn => {
          const btnSlug = btn.getAttribute('data-slug');
          if (btnSlug === slug || btn.getAttribute('data-target') === 'pane' + slug.charAt(0).toUpperCase() + slug.slice(1)) {
            matchedBtn = btn;
          }
        });

        if (matchedBtn) {
          tabBtns.forEach(b => {
            b.classList.remove('active', 'bg-slate-900', 'text-white', 'border-slate-900');
            b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
            b.setAttribute('aria-selected', 'false');
          });
          matchedBtn.classList.add('active', 'bg-slate-900', 'text-white', 'border-slate-900');
          matchedBtn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
          matchedBtn.setAttribute('aria-selected', 'true');
          if (typeof matchedBtn.scrollIntoView === 'function') {
            matchedBtn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }

          const targetId = matchedBtn.getAttribute('data-target');
          panes.forEach(pane => {
            if (pane.id === targetId) {
              pane.classList.remove('hidden');
            } else {
              pane.classList.add('hidden');
            }
          });
        }
      }

      // Click on tabs
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug') || '';
          if (slug) {
            history.replaceState(null, '', '#' + slug);
          }
          activateTab(slug);
        });
      });

      // Check URL hash on load
      const currentHash = window.location.hash.replace('#', '').toLowerCase();
      if (currentHash) {
        const validSlugs = ['purview', 'nightfall', 'bigid', 'cloudapis', 'cyberhaven', 'skyflow', 'mcp'];
        if (validSlugs.includes(currentHash)) {
          activateTab(currentHash);
        }
      }

      // Hashchange listener
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const validSlugs = ['purview', 'nightfall', 'bigid', 'cloudapis', 'cyberhaven', 'skyflow', 'mcp'];
        if (validSlugs.includes(hash)) {
          activateTab(hash);
        }
      });

      // Search filter
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.trim().toLowerCase();
          if (clearBtn) clearBtn.classList.toggle('hidden', query.length === 0);

          let visibleCount = 0;
          tabBtns.forEach(btn => {
            const targetId = btn.getAttribute('data-target');
            const pane = document.getElementById(targetId);
            const textToSearch = ((btn.textContent || '') + ' ' + (pane ? pane.textContent : '')).toLowerCase();
            const matches = query.length === 0 || textToSearch.includes(query);

            if (matches) {
              btn.classList.remove('hidden');
              visibleCount++;
            } else {
              btn.classList.add('hidden');
            }
          });

          if (countEl) {
            if (query.length === 0) {
              countEl.textContent = 'Showing 7 comparison architectures';
            } else {
              countEl.textContent = `Found ${visibleCount} matching architecture${visibleCount === 1 ? '' : 's'}`;
            }
          }

          // If active tab is hidden, switch to first visible tab
          const activeBtn = document.querySelector('.bc-tab-btn.active');
          if (activeBtn && activeBtn.classList.contains('hidden')) {
            const firstVisible = document.querySelector('.bc-tab-btn:not(.hidden)');
            if (firstVisible) {
              firstVisible.click();
            }
          }
        });

        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
          });
        }
      }

      const printBtn = document.getElementById('btnPrintBattleCard');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      // 1-Click Copy Objection Response for Slack / Email
      document.querySelectorAll('.copy-objection-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const card = btn.closest('.p-4');
          const responseEl = card ? card.querySelector('.response-text') : null;
          if (responseEl) {
            let text = responseEl.innerText.replace(/^Your Response:\s*/i, '').trim();
            window.ztdsCopy(text, () => {
              const prev = btn.textContent;
              btn.textContent = 'Copied to Clipboard!';
              btn.classList.add('bg-emerald-100', 'text-emerald-800');
              btn.classList.remove('bg-slate-100', 'text-slate-700');
              setTimeout(() => {
                btn.textContent = prev;
                btn.classList.remove('bg-emerald-100', 'text-emerald-800');
                btn.classList.add('bg-slate-100', 'text-slate-700');
              }, 2000);
            });
          }
        });
      });
    }

    // Live Procurement Preview Modal Controller
    function initProcurementModal() {
      const modal = document.getElementById('procurementModal');
      const btnOpenHero = document.getElementById('btnPreviewProcurement');
      const btnOpenHub = document.getElementById('btnDownloadsPreview');
      const btnClose = document.getElementById('btnCloseProcurementModal');
      const btnCloseFooter = document.getElementById('btnCloseProcurementModalBtn');
      const tabBtns = document.querySelectorAll('.modal-tab-btn');
      const views = document.querySelectorAll('.modal-view');
      const btnCopyTab = document.getElementById('btnCopyModalTab');
      const btnDownloadTab = document.getElementById('btnDownloadModalMd');

      let activeTabKey = 'memo';

      function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (window.ztdsModal && typeof window.ztdsModal.open === 'function') {
          window.ztdsModal.open(modal, '#btnCloseProcurementModal');
        }
      }

      function closeModal() {
        if (!modal) return;
        if (window.ztdsModal && typeof window.ztdsModal.close === 'function') {
          window.ztdsModal.close(modal);
        } else {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
          document.body.style.overflow = '';
        }
      }

      if (btnOpenHero) btnOpenHero.addEventListener('click', openModal);
      if (btnOpenHub) btnOpenHub.addEventListener('click', openModal);
      if (btnClose) btnClose.addEventListener('click', closeModal);
      if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeModal);

      // Close on clicking backdrop outside modal dialog content
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });
      }

      // Switch tabs inside modal
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => {
            b.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm', 'border', 'border-slate-200', 'font-bold');
            b.classList.add('text-slate-600', 'font-medium');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm', 'border', 'border-slate-200', 'font-bold');
          btn.classList.remove('text-slate-600', 'font-medium');
          btn.setAttribute('aria-selected', 'true');
          if (typeof btn.scrollIntoView === 'function') {
            btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }

          const targetId = btn.getAttribute('data-target');
          views.forEach(v => {
            if (v.id === targetId) {
              v.classList.remove('hidden');
            } else {
              v.classList.add('hidden');
            }
          });

          if (targetId === 'modalViewMemo') activeTabKey = 'memo';
          else if (targetId === 'modalViewSig') activeTabKey = 'sig';
          else if (targetId === 'modalViewHipaa') activeTabKey = 'hipaa';
          else if (targetId === 'modalViewLicense') activeTabKey = 'license';
        });
      });

      const tabContentMap = {
        memo: memoContent,
        sig: sigLiteContent,
        hipaa: hipaaContent,
        license: licenseContent
      };

      const tabFilenameMap = {
        memo: 'ZTDS-CISO-Procurement-Memo-2026.md',
        sig: 'ZTDS-Enterprise-SIG-Lite-QA-2026.md',
        hipaa: 'ZTDS-HIPAA-Safe-Harbor-Legal-Memo-2026.md',
        license: 'ZTDS-Air-Gapped-Source-License-Terms-2026.md'
      };

      if (btnCopyTab) {
        btnCopyTab.addEventListener('click', () => {
          const content = tabContentMap[activeTabKey] || memoContent;
          window.ztdsCopy(content, () => {
            const prev = btnCopyTab.innerText;
            btnCopyTab.innerText = 'Copied!';
            setTimeout(() => { btnCopyTab.innerText = prev; }, 2000);
          });
        });
      }

      if (btnDownloadTab) {
        btnDownloadTab.addEventListener('click', () => {
          const content = tabContentMap[activeTabKey] || memoContent;
          const filename = tabFilenameMap[activeTabKey] || 'ZTDS-Document-2026.md';
          const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Battlecards
      initBattlecards();

      // Initialize Procurement Modal
      initProcurementModal();

      // Initialize CISO Quick Scenario Estimator
      const callsSlider = document.getElementById('cisoCallsSlider');
      const vendorsSlider = document.getElementById('cisoVendorsSlider');
      const regimeSelect = document.getElementById('cisoRegimeSelect');

      if (callsSlider && vendorsSlider && regimeSelect) {
        const syncCisoPresetState = () => {
          document.querySelectorAll('.ciso-preset-btn').forEach(b => {
            const match = b.getAttribute('data-calls') === callsSlider.value &&
                          b.getAttribute('data-vendors') === vendorsSlider.value &&
                          b.getAttribute('data-regime') === regimeSelect.value;
            b.classList.toggle('active', match);
            b.classList.toggle('bg-slate-900', match);
            b.classList.toggle('text-white', match);
            b.classList.toggle('border-slate-900', match);
            b.classList.toggle('shadow-sm', match);
            b.classList.toggle('font-bold', match);
            b.classList.toggle('bg-white', !match);
            b.classList.toggle('text-slate-700', !match);
            b.classList.toggle('border-slate-300', !match);
            b.classList.toggle('font-semibold', !match);
            b.setAttribute('aria-pressed', match ? 'true' : 'false');
          });
        };

        callsSlider.addEventListener('input', () => { syncCisoPresetState(); calculateCisoEstimator(); });
        vendorsSlider.addEventListener('input', () => { syncCisoPresetState(); calculateCisoEstimator(); });
        regimeSelect.addEventListener('change', () => { syncCisoPresetState(); calculateCisoEstimator(); });

        // Stepper Buttons
        document.querySelectorAll('.ciso-step-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            const val = btn.getAttribute('data-val');
            if (targetEl && val) {
              targetEl.value = val;
              syncCisoPresetState();
              calculateCisoEstimator();
            }
          });
        });

        // Preset Buttons
        document.querySelectorAll('.ciso-preset-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const calls = btn.getAttribute('data-calls');
            const vendors = btn.getAttribute('data-vendors');
            const regime = btn.getAttribute('data-regime');

            if (calls) callsSlider.value = calls;
            if (vendors) vendorsSlider.value = vendors;
            if (regime) regimeSelect.value = regime;

            syncCisoPresetState();
            calculateCisoEstimator();
          });
        });

        // Export Scenario JSON
        const btnExportCisoJson = document.getElementById('btnExportCisoJson');
        if (btnExportCisoJson) {
          btnExportCisoJson.addEventListener('click', () => {
            const calls = parseInt(callsSlider.value, 10);
            const vendors = parseInt(vendorsSlider.value, 10);
            const regime = regimeSelect.value;
            const dpaSavings = vendors * 25000;
            const annualRecords = calls * 0.25 * 3 * 12;
            const expectedBreachCost = annualRecords * 165 * 0.078 * 0.005;
            const normalizedBreachCost = Math.max(expectedBreachCost, 45000);
            const fineMap = { global: 75000, eu: 50000, us_hipaa: 125000, us_fintech: 52000, us_legal: 55000 };
            const regimeFine = fineMap[regime] || 50000;
            const totalExposure = dpaSavings + normalizedBreachCost + regimeFine;
            const roiMultiple = Math.max(1, Math.round(totalExposure / 12000));

            const exportData = {
              spec: "ZTDS RFC v1.0",
              documentId: "ZTDS-CISO-SCENARIO-2026",
              generatedAt: new Date().toISOString(),
              chiefArchitect: "Ilya Sibiryakov",
              authorAffiliation: "BrandMeWeb",
              parameters: {
                monthlyCalls: calls,
                vendorsReviewed: vendors,
                regulatoryRegime: regime
              },
              actuarialModel: {
                dpaReviewOverheadAvoidanceUsd: dpaSavings,
                actuarialBreachRiskAvoidanceUsd: Math.round(normalizedBreachCost),
                regulatoryMitigationBufferUsd: regimeFine,
                totalAnnualExposureAvoidanceUsd: Math.round(totalExposure),
                projectedRoiMultiple: roiMultiple + 'x',
                assumedEnterpriseTcoUsd: 12000
              },
              statutoryExemptionGrounds: [
                "EU GDPR Article 28: Zero external data custody; DPA disengaged",
                "EDPB Guidelines 07/2020: Pure client-side computational utility",
                "HIPAA Safe Harbor 45 CFR § 164.514: 18 PHI identifiers removed prior to egress",
                "FRE 502(b): Reasonable steps taken against privilege waiver"
              ],
              deepDiveUrl: `https://ztds.ai/roi/?calls=${calls}&vendors=${vendors}&regime=${encodeURIComponent(regime)}&ratio=25&records=3`
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ZTDS-CISO-Scenario-${calls}-${vendors}vendors.json`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        // Run initial calculation
        calculateCisoEstimator();
      }
    });
})();
