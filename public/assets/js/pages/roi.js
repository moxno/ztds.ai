(function () {
  'use strict';

document.addEventListener('DOMContentLoaded', () => {
      // Element references
      const inputCalls = document.getElementById('inputCalls');
      const labelCalls = document.getElementById('labelCalls');
      const inputRatio = document.getElementById('inputRatio');
      const labelRatio = document.getElementById('labelRatio');
      const inputRecords = document.getElementById('inputRecords');
      const labelRecords = document.getElementById('labelRecords');
      const inputVendors = document.getElementById('inputVendors');
      const labelVendors = document.getElementById('labelVendors');
      const selectRegime = document.getElementById('selectRegime');
      const selectIndustry = document.getElementById('selectIndustry');
      const selectRevenue = document.getElementById('selectRevenue');
      const selectTier = document.getElementById('selectTier');
      const regimeDescription = document.getElementById('regimeDescription');

      // Display outputs
      const dispNetSavings = document.getElementById('dispNetSavings');
      const dispRoiMultiple = document.getElementById('dispRoiMultiple');
      const dispTotalExposure = document.getElementById('dispTotalExposure');
      const dispDpaSavings = document.getElementById('dispDpaSavings');
      const dispTco = document.getElementById('dispTco');
      const dispAnnualRecords = document.getElementById('dispAnnualRecords');
      const dispBreachCost = document.getElementById('dispBreachCost');
      const dispVendorOverhead = document.getElementById('dispVendorOverhead');
      const dispRegulatoryFine = document.getElementById('dispRegulatoryFine');
      const dispRegulatoryFineSub = document.getElementById('dispRegulatoryFineSub');
      const statutoryLabelBadge = document.getElementById('statutoryLabelBadge');
      
      // Statutory Decomposition Elements
      const dispActiveRegimeCode = document.getElementById('dispActiveRegimeCode');
      const dispStatutoryCeiling = document.getElementById('dispStatutoryCeiling');
      const dispStatutoryCeilingNote = document.getElementById('dispStatutoryCeilingNote');
      const dispActuarialFine = document.getElementById('dispActuarialFine');
      const dispStatutoryDefense = document.getElementById('dispStatutoryDefense');

      // Subprocessor Decomposition Elements
      const dispVendorsCountBadge = document.getElementById('dispVendorsCountBadge');
      const dispSubLegal = document.getElementById('dispSubLegal');
      const dispSubTprm = document.getElementById('dispSubTprm');
      const dispSubSoc2 = document.getElementById('dispSubSoc2');

      const barLabelUnmitigated = document.getElementById('barLabelUnmitigated');
      const barLabelZtds = document.getElementById('barLabelZtds');
      const barZtds = document.getElementById('barZtds');
      // Action Elements
      const btnPreviewMemo = document.getElementById('btnPreviewMemo');
      const btnPrintMemo = document.getElementById('btnPrintMemo');
      const btnDownloadJson = document.getElementById('btnDownloadJson');
      const btnDownloadMemo = document.getElementById('btnDownloadMemo');
      const btnCopyMemo = document.getElementById('btnCopyMemo');
      const copyMemoText = document.getElementById('copyMemoText');
      const btnShareScenario = document.getElementById('btnShareScenario');
      const shareScenarioText = document.getElementById('shareScenarioText');

      // Modal Elements
      const memoPreviewModal = document.getElementById('memoPreviewModal');
      const memoPreviewText = document.getElementById('memoPreviewText');
      const memoModalCloseBtn = document.getElementById('memoModalCloseBtn');
      const memoModalCloseBtnBottom = document.getElementById('memoModalCloseBtnBottom');
      const modalPrintMemo = document.getElementById('modalPrintMemo');
      const modalDownloadJson = document.getElementById('modalDownloadJson');
      const modalDownloadMemo = document.getElementById('modalDownloadMemo');
      const modalCopyMemo = document.getElementById('modalCopyMemo');
      const modalCopyText = document.getElementById('modalCopyText');
      const memoModalRegimeBadge = document.getElementById('memoModalRegimeBadge');

      const toggleMethodologyBtn = document.getElementById('toggleMethodologyBtn');
      const methodologyContent = document.getElementById('methodologyContent');
      const toggleMethodologyIcon = document.getElementById('toggleMethodologyIcon');

      // Print-Only Elements
      const printNetSavings = document.getElementById('printNetSavings');
      const printRoiMultiple = document.getElementById('printRoiMultiple');
      const printTotalExposure = document.getElementById('printTotalExposure');
      const printDpaSavings = document.getElementById('printDpaSavings');
      const printParamCalls = document.getElementById('printParamCalls');
      const printParamRatio = document.getElementById('printParamRatio');
      const printParamRecords = document.getElementById('printParamRecords');
      const printParamAnnualRecords = document.getElementById('printParamAnnualRecords');
      const printParamVendors = document.getElementById('printParamVendors');
      const printParamRevenue = document.getElementById('printParamRevenue');
      const printParamRegime = document.getElementById('printParamRegime');

      // Currency / Number Formatters
      const fmtCur = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
      const fmtNum = new Intl.NumberFormat('en-US');

      function calculate() {
        const calls = parseFloat(inputCalls.value) || 0;
        const ratio = (parseFloat(inputRatio.value) || 0) / 100;
        const recordsPerPrompt = parseFloat(inputRecords.value) || 1;
        const vendors = parseFloat(inputVendors.value) || 1;
        const regime = selectRegime.value;
        
        const selectedOpt = selectIndustry.options[selectIndustry.selectedIndex];
        const costPerRecord = parseFloat(selectedOpt.getAttribute('data-cost')) || 165;
        const revenue = parseFloat(selectRevenue.value) || 50000000;
        const tco = parseFloat(selectTier.value) || 12000;

        // 1. Annual Records Ingested
        const annualRecords = calls * ratio * recordsPerPrompt * 12;

        // 2. Actuarial Breach Liability
        // Ponemon / IBM 2025 statistical incidence factor ~7.8% across unmitigated LLM logs & caching
        const incidentProbability = 0.078;
        const expectedBreachCost = annualRecords * costPerRecord * incidentProbability * 0.005; // dampened actuarial risk exposure
        const normalizedBreachCost = Math.max(expectedBreachCost, 45000);

        // 3. Subprocessor DPA & TPRM Overhead Elimination
        // Legal ($8k) + TPRM ($9k) + SOC 2 subprocessor chain audit ($8k) = $25,000 / vendor / year
        const subLegal = vendors * 8000;
        const subTprm = vendors * 9000;
        const subSoc2 = vendors * 8000;
        const dpaSavings = vendors * 25000;

        // 4. Regulatory Fine Statutory Ceilings & Actuarial Weighted Risk
        let statutoryCeiling = 0;
        let statutoryCeilingNote = '';
        let actuarialFine = 0;
        let statutoryDefenseTitle = '';
        let statutoryDefenseBody = '';
        let regimeCode = 'GDPR 4% · EU AI ACT';
        let badgeLabel = 'GDPR & EU AI ACT';

        if (regime === 'global') {
          regimeCode = 'GLOBAL MULTI-REGIME';
          badgeLabel = 'GLOBAL STATUTORY';
          // GDPR Art. 83(5) 4% ($2M for $50M) + EU AI Act Art. 99(4) 3% ($1.5M for $50M) + US State Laws
          statutoryCeiling = (revenue * 0.07) + 2067813;
          statutoryCeilingNote = `GDPR Art. 83(5) 4% (${fmtCur.format(revenue * 0.04)}) + EU AI Act Art. 99 3% (${fmtCur.format(revenue * 0.03)}) + US HITECH/State Cap`;
          actuarialFine = (revenue * 0.04 * 0.02) + 35000;
          statutoryDefenseTitle = 'GDPR Recital 26, EU AI Act Art. 50 & US State Shield:';
          statutoryDefenseBody = ' Principles of data protection do not apply to anonymous information. By enforcing Invariant 1 (Zero-Egress) client-side in RAM prior to network serialization, external LLM APIs receive only syntactic surrogate tokens. Downstream model vendors are excluded from GDPR Article 28 subprocessor chains and US statutory discovery scope.';
          regimeDescription.textContent = 'Evaluates combined GDPR Recital 26 de-identification and statutory fine caps across international jurisdictions.';
        } else if (regime === 'eu') {
          regimeCode = 'EU GDPR & AI ACT';
          badgeLabel = 'GDPR ART. 83';
          statutoryCeiling = revenue * 0.07;
          statutoryCeilingNote = `Maximum statutory ceiling under GDPR Art. 83(5) (4% of turnover) and EU AI Act Art. 99(4) (3% transparency/data governance)`;
          actuarialFine = revenue * 0.04 * 0.025;
          statutoryDefenseTitle = 'GDPR Recital 26 & EU AI Act Art. 50 Technical Safe Harbor:';
          statutoryDefenseBody = ' Personal data is tokenized in volatile host RAM prior to traversing the client execution boundary. Downstream foundation models never receive raw personal identifiers, removing intermediary sanitization subprocessors under Article 28 and establishing proactive GDPR Art. 32 technical due diligence.';
          regimeDescription.textContent = 'Enforces GDPR Article 83(5) (up to 4% worldwide turnover or €20M) and EU AI Act Article 99 penalties.';
        } else if (regime === 'us_hipaa') {
          regimeCode = 'US HIPAA SAFE HARBOR';
          badgeLabel = 'HITECH TIER 4';
          statutoryCeiling = 2067813;
          statutoryCeilingNote = 'HITECH Tier 4 statutory annual penalty cap ($2,067,813 per calendar year for uncorrected willful neglect)';
          actuarialFine = Math.min(2067813, (annualRecords * 0.012) + 48000);
          statutoryDefenseTitle = 'HIPAA Safe Harbor 45 CFR § 164.514(b):';
          statutoryDefenseBody = ' All 18 statutory PHI identifiers are purged locally in workstation volatile RAM before API transmission. Zero Protected Health Information crosses external sockets, eliminating the requirement for third-party Business Associate Agreements (BAAs) with LLM vendors.';
          regimeDescription.textContent = 'Enforces HIPAA Safe Harbor de-identification and HITECH statutory penalty ceilings for clinical healthcare.';
        } else if (regime === 'us_fintech') {
          regimeCode = 'US GLBA & SEC 106';
          badgeLabel = 'FINANCIAL RISK';
          statutoryCeiling = Math.min(revenue * 0.02, 25000000);
          statutoryCeilingNote = 'GLBA 15 U.S.C. § 6801 safeguard penalties and SEC Item 106 material cybersecurity disclosure exposure';
          actuarialFine = (revenue * 0.02 * 0.02) + 32000;
          statutoryDefenseTitle = 'GLBA Safeguards Rule & PCI-DSS 4.0:';
          statutoryDefenseBody = ' Primary Account Numbers (PAN), CVVs, and wire routing identifiers are masked in-RAM with bijective tokens. Third-party LLM providers never touch non-public personal information (NPI), preserving SOC 2 Type II boundary controls.';
          regimeDescription.textContent = 'Evaluates Gramm-Leach-Bliley Act (GLBA) and SEC cybersecurity disclosure compliance for banking & fintech.';
        } else if (regime === 'us_legal') {
          regimeCode = 'US FRE 502 PRIVILEGE';
          badgeLabel = 'FRE 502 NON-WAIVER';
          statutoryCeiling = Math.min(revenue * 0.015, 10000000);
          statutoryCeilingNote = 'Subject-matter privilege waiver liability across commercial discovery and civil litigation under Federal Rule of Evidence 502';
          actuarialFine = (revenue * 0.015 * 0.02) + 40000;
          statutoryDefenseTitle = 'Federal Rule of Evidence 502(b) Statutory Privilege Defense:';
          statutoryDefenseBody = ' Client-side deterministic surrogate tokenization establishes proactive reasonable precautions against inadvertent disclosure. Prevents subject-matter privilege waiver during AI-assisted discovery, litigation review, and M&A due diligence.';
          regimeDescription.textContent = 'Calculates statutory attorney-client privilege protection and work-product doctrine defense under FRE 502.';
        }

        const regulatoryExposure = Math.round(actuarialFine);

        // 5. Total Exposure & Net Savings
        const totalExposure = Math.round(normalizedBreachCost + dpaSavings + regulatoryExposure);
        const netSavings = Math.max(0, totalExposure - tco);
        const roiMultiple = tco > 0 ? (totalExposure / tco) : 0;

        // Update Labels
        labelCalls.textContent = fmtNum.format(calls);
        labelRatio.textContent = Math.round(ratio * 100) + '%';
        labelRecords.textContent = recordsPerPrompt + (recordsPerPrompt === 1 ? ' record' : ' records');
        labelVendors.textContent = vendors + (vendors === 1 ? ' provider' : ' providers');

        // Update Outputs
        dispNetSavings.textContent = fmtCur.format(netSavings) + ' / yr';
        dispRoiMultiple.textContent = roiMultiple.toFixed(1) + 'x';
        dispTotalExposure.textContent = fmtCur.format(totalExposure);
        dispDpaSavings.textContent = fmtCur.format(dpaSavings);
        dispTco.textContent = fmtCur.format(tco);

        dispAnnualRecords.textContent = fmtNum.format(Math.round(annualRecords));
        dispBreachCost.textContent = fmtCur.format(Math.round(normalizedBreachCost));
        dispVendorOverhead.textContent = fmtCur.format(dpaSavings);
        dispRegulatoryFine.textContent = fmtCur.format(regulatoryExposure);
        statutoryLabelBadge.textContent = badgeLabel;
        dispRegulatoryFineSub.textContent = `Actuarial annual liability under ${regimeCode} given probabilistic enforcement audits.`;

        // Update Statutory Decomposition Box
        dispActiveRegimeCode.textContent = regimeCode;
        dispStatutoryCeiling.textContent = fmtCur.format(Math.round(statutoryCeiling));
        dispStatutoryCeilingNote.textContent = statutoryCeilingNote;
        dispActuarialFine.textContent = fmtCur.format(regulatoryExposure) + ' / yr';
        if (dispStatutoryDefense) {
          const strongEl = document.createElement('strong');
          strongEl.textContent = statutoryDefenseTitle;
          dispStatutoryDefense.replaceChildren(strongEl, document.createTextNode(statutoryDefenseBody));
        }

        // Update Subprocessor Decomposition Box
        dispVendorsCountBadge.textContent = `${vendors} Connected LLM Provider${vendors > 1 ? 's' : ''}`;
        dispSubLegal.textContent = fmtCur.format(subLegal) + ' / yr';
        dispSubTprm.textContent = fmtCur.format(subTprm) + ' / yr';
        dispSubSoc2.textContent = fmtCur.format(subSoc2) + ' / yr';

        barLabelUnmitigated.textContent = fmtCur.format(totalExposure);
        const pctZtds = Math.min(100, Math.max(1, (tco / totalExposure) * 100));
        barLabelZtds.textContent = fmtCur.format(tco) + ' (' + pctZtds.toFixed(1) + '%)';
        barZtds.style.width = pctZtds + '%';

        // Update Print-Only Header & Parameters
        if (printNetSavings) printNetSavings.textContent = fmtCur.format(netSavings) + ' / yr';
        if (printRoiMultiple) printRoiMultiple.textContent = roiMultiple.toFixed(1) + 'x';
        if (printTotalExposure) printTotalExposure.textContent = fmtCur.format(totalExposure);
        if (printDpaSavings) printDpaSavings.textContent = fmtCur.format(dpaSavings);

        if (printParamCalls) printParamCalls.textContent = fmtNum.format(calls) + ' / mo';
        if (printParamRatio) printParamRatio.textContent = Math.round(ratio * 100) + '%';
        if (printParamRecords) printParamRecords.textContent = recordsPerPrompt + ' records';
        if (printParamAnnualRecords) printParamAnnualRecords.textContent = fmtNum.format(Math.round(annualRecords));
        if (printParamVendors) printParamVendors.textContent = vendors + ' providers';
        if (printParamRevenue) printParamRevenue.textContent = fmtCur.format(revenue);
        if (printParamRegime) printParamRegime.textContent = regimeCode;

        // Update BrandMeWeb Agency Bridge Links
        const agencyTargetUrl = `/agency/?profile=${encodeURIComponent(selectIndustry.value || 'saas')}&savings=${encodeURIComponent(fmtCur.format(netSavings))}&source=roi_calculator`;
        const roiAgencyBridgeBtn = document.getElementById('roiAgencyBridgeBtn');
        if (roiAgencyBridgeBtn) roiAgencyBridgeBtn.href = agencyTargetUrl;
        const heroRoiAgencyLink = document.getElementById('heroRoiAgencyLink');
        if (heroRoiAgencyLink) heroRoiAgencyLink.href = agencyTargetUrl;

        updateQuickStepHighlights();
      }

      function parseCurrency(str) {
        if (typeof str === 'number') return str;
        if (!str) return 0;
        const cleaned = String(str).replace(/[^0-9.-]+/g, '');
        return parseFloat(cleaned) || 0;
      }

      function generateMemoMarkdown() {
        const calls = parseFloat(inputCalls.value) || 0;
        const ratio = parseFloat(inputRatio.value) || 0;
        const recordsPerPrompt = parseFloat(inputRecords.value) || 1;
        const vendors = parseFloat(inputVendors.value) || 1;
        const revenue = parseFloat(selectRevenue.value) || 50000000;
        const tco = parseFloat(selectTier.value) || 12000;
        const annualRecords = calls * (ratio / 100) * recordsPerPrompt * 12;

        const netSavingsStr = dispNetSavings.textContent;
        const roiMultipleStr = dispRoiMultiple.textContent;
        const totalExposureStr = dispTotalExposure.textContent;
        const dpaSavingsStr = dispDpaSavings.textContent;
        const breachCostStr = dispBreachCost.textContent;
        const fineStr = dispRegulatoryFine.textContent;
        const ceilingStr = dispStatutoryCeiling.textContent;
        const ceilingNoteStr = dispStatutoryCeilingNote.textContent;
        const activeRegimeStr = dispActiveRegimeCode ? dispActiveRegimeCode.textContent : 'GLOBAL MULTI-REGIME';
        const memoRefId = `ZTDS-MEMO-${Date.now().toString(36).toUpperCase()}`;

        return `# EXECUTIVE CISO AUDIT MEMORANDUM & ACTUARIAL RISK ASSESSMENT

**DOCUMENT ID:** ${memoRefId}
**TO:** Chief Information Security Officer (CISO), Chief Legal Officer (CLO), Board Risk Committee
**FROM:** Enterprise Information Security & AI Governance
**DATE:** September 2026
**SUBJECT:** Enterprise Generative AI Actuarial Risk, Statutory Regulatory Caps & Zero-Trust Sanitization ROI
**SPECIFICATION:** ZTDS RFC v1.0 (Zenodo DOI: 10.5281/zenodo.22058770)
**BENCHMARKS:** IBM Cost of a Data Breach 2025 | GDPR Art. 83 | EU AI Act Art. 99 | HIPAA Safe Harbor | FRE 502
**CLASSIFICATION:** PRIVILEGED WORK PRODUCT // RESTRICTED

---

## 1. Executive Summary & Financial Return
- **Net Annual Enterprise Savings:** ${netSavingsStr}
- **Calculated ROI Multiple:** ${roiMultipleStr}
- **Unmitigated Risk Exposure:** ${totalExposureStr}
- **Subprocessor Chain DPA Overhead Elimination:** ${dpaSavingsStr} / yr
- **Estimated Infrastructure Deployment TCO (Annual Benchmark):** ${fmtCur.format(tco)}

---

## 2. Configured Model Pipeline & Ingestion Profile
- **Monthly LLM Prompts / Ingestion Volume:** ${fmtNum.format(calls)} calls / month
- **Sensitive Payload Ratio:** ${ratio}%
- **Average Sensitive Records per Prompt:** ${recordsPerPrompt} records
- **Total Annual Sensitive Records Ingested:** ${fmtNum.format(Math.round(annualRecords))} records / year
- **Connected Foundation Model Providers:** ${vendors} providers (OpenAI, Anthropic, Google Vertex, etc.)
- **Primary Statutory Enforcement Regime:** ${activeRegimeStr}
- **Corporate Annual Worldwide Turnover:** ${fmtCur.format(revenue)}

---

## 3. Actuarial Risk Decomposition
1. **Actuarial Breach Liability Exposure:** ${breachCostStr}
   - Modeling statistical incidence (7.8%) across LLM model caches, telemetry logging, and prompt retention under the IBM 2025 benchmark.
2. **Subprocessor Chain Elimination (GDPR Article 28 / HIPAA BAA):** ${dpaSavingsStr} / yr
   - Legal Counsel Contract Negotiation & Outside Counsel: ${fmtCur.format(vendors * 8000)} / yr ($8,000 / vendor)
   - TPRM SIG Lite Reviews & CAIQ Questionnaires: ${fmtCur.format(vendors * 9000)} / yr ($9,000 / vendor)
   - Continuous SOC 2 Subprocessor Chain Auditing: ${fmtCur.format(vendors * 8000)} / yr ($8,000 / vendor)
3. **Statutory Regulatory Penalty Risk:**
   - **Maximum Statutory Legal Ceiling:** ${ceilingStr} (${ceilingNoteStr})
   - **Actuarial Risk-Weighted Expected Annual Loss:** ${fineStr}

---

## 4. Statutory Safe Harbor & Technical Grounds for Defense
- **EU GDPR Article 32 Safe Harbor & Article 28 Subprocessor Scope Exclusion:** By enforcing Invariant 1 (Zero-Egress) client-side in RAM prior to network serialization, external LLM APIs receive only syntactic surrogate tokens. Downstream model vendors are excluded from intermediary sanitization subprocessor chains under GDPR Article 28 while documenting proactive technical due diligence under GDPR Article 32 and Israel Amendment 13 Sec. 17.
- **EU AI Act Article 10 & 50:** Mathematical zero-entropy leakage ($I(X; T) = 0.00\\text{ bits}$) satisfies mandatory transparency and data governance obligations for high-risk AI workflows.
- **US HIPAA Safe Harbor (45 CFR § 164.514(b)):** Local workstation RAM sanitization strips all 18 statutory PHI identifiers before transit, eliminating mandatory Business Associate Agreement (BAA) requirements.
- **US Federal Rule of Evidence 502(b):** In-memory deterministic pseudonymization proves reasonable precautions against inadvertent disclosure, preserving attorney-client privilege during AI contract review and M&A discovery.

---

## 5. Architectural Recommendation
Deploy Zero-Trust Data Sanitization (ZTDS RFC v1.0) client-side in volatile WebAssembly / AWS Nitro Enclaves to enforce Invariant 1 (Zero Egress), Invariant 2 (Deterministic Tokenization), Invariant 3 (RAM Isolation), and Invariant 4 (Subprocessor Chain Exclusion).

Commercial turn-key deployment and audit verification available via BrandMeWeb: https://ztds.ai/agency/
Generated via ZTDS CISO Actuarial Engine: https://ztds.ai/roi/
`;
      }

      function generateReportJson() {
        const calls = parseFloat(inputCalls.value) || 0;
        const ratio = parseFloat(inputRatio.value) || 0;
        const recordsPerPrompt = parseFloat(inputRecords.value) || 1;
        const vendors = parseFloat(inputVendors.value) || 1;
        const regime = selectRegime.value;
        const selectedOpt = selectIndustry.options[selectIndustry.selectedIndex];
        const industry = selectIndustry.value;
        const industryName = selectedOpt ? (selectedOpt.getAttribute('data-name') || selectIndustry.value) : selectIndustry.value;
        const costPerRecord = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-cost')) || 165) : 165;
        const revenue = parseFloat(selectRevenue.value) || 50000000;
        const tco = parseFloat(selectTier.value) || 12000;
        const annualRecords = calls * (ratio / 100) * recordsPerPrompt * 12;

        const netSavings = parseCurrency(dispNetSavings.textContent);
        const roiMultiple = parseFloat(dispRoiMultiple.textContent) || 0;
        const totalExposure = parseCurrency(dispTotalExposure.textContent);
        const breachCost = parseCurrency(dispBreachCost.textContent);
        const dpaSavings = parseCurrency(dispDpaSavings.textContent);
        const regulatoryFine = parseCurrency(dispRegulatoryFine.textContent);
        const statutoryCeiling = parseCurrency(dispStatutoryCeiling.textContent);
        const activeRegimeStr = dispActiveRegimeCode ? dispActiveRegimeCode.textContent : regime;

        return {
          $schema: "https://ztds.ai/schemas/ciso-risk-assessment-v1.json",
          standard: "ZTDS RFC v1.0",
          specification_doi: "10.5281/zenodo.22058770",
          generated_at: new Date().toISOString(),
          memo_reference_id: `ZTDS-MEMO-${Date.now().toString(36).toUpperCase()}`,
          document_title: "EXECUTIVE CISO AUDIT MEMORANDUM & ACTUARIAL RISK ASSESSMENT",
          classification: "PRIVILEGED WORK PRODUCT // RESTRICTED",
          parameters: {
            monthly_prompts: calls,
            sensitive_payload_ratio_pct: ratio,
            records_per_prompt: recordsPerPrompt,
            annual_sensitive_records: Math.round(annualRecords),
            connected_llm_providers: vendors,
            enforcement_regime: regime,
            regime_label: activeRegimeStr,
            industry_sector: industry,
            industry_name: industryName,
            cost_per_record_usd: costPerRecord,
            worldwide_annual_turnover_usd: revenue,
            ztds_tier_annual_cost_usd: tco
          },
          actuarial_decomposition: {
            net_annual_enterprise_savings_usd: netSavings,
            roi_multiple: roiMultiple,
            unmitigated_risk_exposure_usd: totalExposure,
            annual_breach_liability_usd: breachCost,
            subprocessor_chain_dpa_savings_usd: dpaSavings,
            statutory_regulatory_fine_risk_usd: regulatoryFine,
            maximum_statutory_legal_ceiling_usd: statutoryCeiling,
            statutory_ceiling_note: dispStatutoryCeilingNote ? dispStatutoryCeilingNote.textContent : '',
            ztds_in_memory_tco_usd: tco
          },
          subprocessor_overhead_breakdown: {
            connected_providers: vendors,
            legal_dpa_contract_review_usd: vendors * 8000,
            tprm_sig_lite_audits_usd: vendors * 9000,
            soc2_continuous_monitoring_usd: vendors * 8000,
            total_annual_dpa_overhead_usd: dpaSavings
          },
          statutory_defenses: {
            gdpr: "Recital 26 and Article 28 Exemption: anonymous data is excluded from subprocessor chains",
            eu_ai_act: "Article 10 and 50 data governance and zero-entropy compliance",
            us_hipaa: "45 CFR 164.514(b) Safe Harbor de-identification without third-party BAAs",
            us_fre: "Federal Rule of Evidence 502(b) attorney-client privilege non-waiver defense"
          },
          architectural_invariants: [
            "Invariant 1: Zero External Egress Prior to Sanitization",
            "Invariant 2: Deterministic Reversible Tokenization",
            "Invariant 3: Verifiable Cryptographic RAM Isolation",
            "Invariant 4: Exclusion from Subprocessor Chain"
          ],
          auditor: {
            authority: "ZTDS.ai Zero-Trust Data Sanitization Consortium",
            cli_engine: "npx ztds-audit",
            ciso_tool: "https://ztds.ai/roi/",
            advisory_partner: "BrandMeWeb"
          }
        };
      }

      // Presets Configuration Map
      const presetConfigs = {
        saas: {
          calls: 400000,
          ratio: 20,
          records: 3,
          vendors: 3,
          regime: 'eu',
          industry: 'saas',
          revenue: '50000000',
          tier: '12000'
        },
        fintech: {
          calls: 750000,
          ratio: 40,
          records: 5,
          vendors: 4,
          regime: 'us_fintech',
          industry: 'fintech',
          revenue: '250000000',
          tier: '12000'
        },
        health: {
          calls: 300000,
          ratio: 65,
          records: 6,
          vendors: 2,
          regime: 'us_hipaa',
          industry: 'healthcare',
          revenue: '100000000',
          tier: '12000'
        },
        legal: {
          calls: 200000,
          ratio: 50,
          records: 4,
          vendors: 2,
          regime: 'us_legal',
          industry: 'legal',
          revenue: '50000000',
          tier: '12000'
        },
        enterprise: {
          calls: 2500000,
          ratio: 35,
          records: 8,
          vendors: 6,
          regime: 'global',
          industry: 'saas',
          revenue: '1000000000',
          tier: '35000'
        }
      };

      let currentActivePreset = null;

      function setActivePresetButton(activeKey) {
        currentActivePreset = activeKey;
        document.querySelectorAll('.preset-btn').forEach(btn => {
          const key = btn.getAttribute('data-preset');
          const isActive = key === activeKey;
          btn.setAttribute('aria-pressed', String(isActive));
          if (isActive) {
            btn.className = 'preset-btn px-3 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-900 text-xs font-semibold shadow-sm transition-all cursor-pointer';
          } else {
            btn.className = 'preset-btn px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 shadow-sm transition-all cursor-pointer';
          }
        });
      }

      function applyPreset(key) {
        const cfg = presetConfigs[key];
        if (!cfg) return;
        inputCalls.value = cfg.calls;
        inputRatio.value = cfg.ratio;
        inputRecords.value = cfg.records;
        inputVendors.value = cfg.vendors;
        selectRegime.value = cfg.regime;
        selectIndustry.value = cfg.industry;
        selectRevenue.value = cfg.revenue;
        selectTier.value = cfg.tier;
        setActivePresetButton(key);
        calculate();
      }

      function updateQuickStepHighlights() {
        document.querySelectorAll('.quick-step-btn').forEach(btn => {
          const targetId = btn.getAttribute('data-target');
          const val = btn.getAttribute('data-val');
          const targetEl = document.getElementById(targetId);
          const isMatched = Boolean(targetEl && String(targetEl.value) === String(val));
          btn.setAttribute('aria-pressed', String(isMatched));
          if (isMatched) {
            btn.className = 'quick-step-btn px-2 py-0.5 rounded text-xs font-mono bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold transition-colors cursor-pointer';
          } else {
            btn.className = 'quick-step-btn px-2 py-0.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer';
          }
        });
      }

      // Live Preview Modal
      function openMemoPreview() {
        if (!memoPreviewModal || !memoPreviewText) return;
        const memo = generateMemoMarkdown();
        memoPreviewText.textContent = memo;
        if (memoModalRegimeBadge) {
          memoModalRegimeBadge.textContent = dispActiveRegimeCode ? dispActiveRegimeCode.textContent : 'GLOBAL MULTI-REGIME';
        }
        if (window.ztdsModal) {
          window.ztdsModal.open(memoPreviewModal);
        } else {
          memoPreviewModal.classList.remove('hidden');
          document.body.classList.add('overflow-hidden');
        }
      }

      function closeMemoPreview() {
        if (!memoPreviewModal) return;
        if (window.ztdsModal) {
          window.ztdsModal.close(memoPreviewModal);
        } else {
          memoPreviewModal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      }

      if (btnPreviewMemo) btnPreviewMemo.addEventListener('click', openMemoPreview);
      if (memoModalCloseBtn) memoModalCloseBtn.addEventListener('click', closeMemoPreview);
      if (memoModalCloseBtnBottom) memoModalCloseBtnBottom.addEventListener('click', closeMemoPreview);

      if (memoPreviewModal) {
        memoPreviewModal.addEventListener('click', (e) => {
          if (e.target === memoPreviewModal) closeMemoPreview();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && memoPreviewModal && !memoPreviewModal.classList.contains('hidden')) {
          closeMemoPreview();
        }
      });

      // Share Scenario Link
      function buildScenarioUrl() {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('calls', inputCalls.value);
        url.searchParams.set('ratio', inputRatio.value);
        url.searchParams.set('records', inputRecords.value);
        url.searchParams.set('vendors', inputVendors.value);
        url.searchParams.set('regime', selectRegime.value);
        url.searchParams.set('industry', selectIndustry.value);
        url.searchParams.set('revenue', selectRevenue.value);
        url.searchParams.set('tier', selectTier.value);
        if (currentActivePreset) {
          url.searchParams.set('preset', currentActivePreset);
        }
        return url.toString();
      }

      function shareScenario() {
        const url = buildScenarioUrl();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', url);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            if (shareScenarioText) {
              const orig = shareScenarioText.textContent;
              shareScenarioText.textContent = 'Link Copied!';
              setTimeout(() => { shareScenarioText.textContent = orig; }, 2500);
            }
          }).catch(() => {
            prompt('Copy scenario URL:', url);
          });
        } else {
          prompt('Copy scenario URL:', url);
        }
      }

      if (btnShareScenario) btnShareScenario.addEventListener('click', shareScenario);

      // JSON Download
      function downloadJsonReport() {
        const report = generateReportJson();
        const jsonStr = JSON.stringify(report, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `ZTDS-CISO-Actuarial-Risk-Report-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      if (btnDownloadJson) btnDownloadJson.addEventListener('click', downloadJsonReport);
      if (modalDownloadJson) modalDownloadJson.addEventListener('click', downloadJsonReport);

      // Markdown Download
      function downloadMarkdownReport() {
        const md = generateMemoMarkdown();
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `ZTDS-CISO-Board-Memo-${dateStr}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      if (btnDownloadMemo) btnDownloadMemo.addEventListener('click', downloadMarkdownReport);
      if (modalDownloadMemo) modalDownloadMemo.addEventListener('click', downloadMarkdownReport);

      // Copy Memo Markdown
      function copyMarkdownToClipboard(targetSpan, defaultLabel) {
        const md = generateMemoMarkdown();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(md).then(() => {
            if (targetSpan) {
              targetSpan.textContent = 'Copied to Clipboard!';
              setTimeout(() => { targetSpan.textContent = defaultLabel; }, 2500);
            }
          }).catch(() => {
            if (targetSpan) {
              targetSpan.textContent = 'Copy Failed';
              setTimeout(() => { targetSpan.textContent = defaultLabel; }, 2500);
            }
          });
        }
      }

      if (btnCopyMemo && copyMemoText) {
        btnCopyMemo.addEventListener('click', () => copyMarkdownToClipboard(copyMemoText, 'Copy (.md)'));
      }
      if (modalCopyMemo && modalCopyText) {
        modalCopyMemo.addEventListener('click', () => copyMarkdownToClipboard(modalCopyText, 'Copy Text'));
      }

      // Print / PDF
      if (btnPrintMemo) {
        btnPrintMemo.addEventListener('click', () => window.print());
      }
      if (modalPrintMemo) {
        modalPrintMemo.addEventListener('click', () => window.print());
      }

      // Load scenario from URL query params
      function loadScenarioFromUrl() {
        try {
          const params = new URLSearchParams(window.location.search);
          if (!params || ![...params.keys()].length) return false;

          const presetParam = params.get('preset');
          if (presetParam && presetConfigs[presetParam]) {
            applyPreset(presetParam);
            return true;
          }

          let hasCustom = false;
          if (params.has('calls')) { inputCalls.value = params.get('calls'); hasCustom = true; }
          if (params.has('ratio')) { inputRatio.value = params.get('ratio'); hasCustom = true; }
          if (params.has('records')) { inputRecords.value = params.get('records'); hasCustom = true; }
          if (params.has('vendors')) { inputVendors.value = params.get('vendors'); hasCustom = true; }
          if (params.has('regime')) { selectRegime.value = params.get('regime'); hasCustom = true; }
          if (params.has('industry')) { selectIndustry.value = params.get('industry'); hasCustom = true; }
          if (params.has('revenue')) { selectRevenue.value = params.get('revenue'); hasCustom = true; }
          if (params.has('tier')) { selectTier.value = params.get('tier'); hasCustom = true; }

          if (hasCustom) {
            setActivePresetButton(null);
            calculate();
            return true;
          }
        } catch (e) {
          // ignore invalid search string
        }
        return false;
      }

      // Preset Button Handlers
      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.getAttribute('data-preset');
          if (presetKey && presetConfigs[presetKey]) {
            applyPreset(presetKey);
          }
        });
      });

      // Quick Step Buttons
      document.querySelectorAll('.quick-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const val = btn.getAttribute('data-val');
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.value = val;
            setActivePresetButton(null);
            calculate();
          }
        });
      });

      // Input change listeners
      [inputCalls, inputRatio, inputRecords, inputVendors, selectRegime, selectIndustry, selectRevenue, selectTier].forEach(el => {
        el.addEventListener('input', () => {
          setActivePresetButton(null);
          calculate();
        });
        el.addEventListener('change', () => {
          setActivePresetButton(null);
          calculate();
        });
      });

      // Toggle Methodology Accordion
      if (toggleMethodologyBtn && methodologyContent && toggleMethodologyIcon) {
        toggleMethodologyBtn.addEventListener('click', () => {
          const isHidden = methodologyContent.classList.contains('hidden');
          toggleMethodologyBtn.setAttribute('aria-expanded', String(isHidden));
          if (isHidden) {
            methodologyContent.classList.remove('hidden');
            toggleMethodologyIcon.textContent = '- Hide Formulas';
          } else {
            methodologyContent.classList.add('hidden');
            toggleMethodologyIcon.textContent = '+ Show Formulas';
          }
        });
      }

      // Initial execution
      const loadedFromUrl = loadScenarioFromUrl();
      if (!loadedFromUrl) {
        setActivePresetButton('saas');
        calculate();
      }
    });
})();
