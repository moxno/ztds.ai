(function () {
  'use strict';

(function() {
      // Universal Clipboard Helper
      window.ztdsCopy = function(text, onSuccess) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
        } else {
          fallbackCopy(text, onSuccess);
        }
      };

      function fallbackCopy(text, onSuccess) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          if (onSuccess) onSuccess();
        } catch (e) {}
        document.body.removeChild(ta);
      }

      // Search & Filter Controller
      const searchInput = document.getElementById('companySearch');
      const filterBtns = document.querySelectorAll('#companyFilterTabs .filter-btn');
      const cards = document.querySelectorAll('#companiesGrid > article[data-industry]');
      const resultsCountEl = document.getElementById('companyResultsCount');
      const btnClearFilters = document.getElementById('btnClearCompanyFilters');
      const companyEmptyState = document.getElementById('companyEmptyState');
      const btnEmptyReset = document.getElementById('btnEmptyCompanyReset');
      const totalCompaniesCount = 9;

      function setActiveCompanyTab(category, shouldScroll) {
        filterBtns.forEach(btn => {
          const isMatch = btn.getAttribute('data-filter') === category;
          if (isMatch) {
            btn.className = 'filter-btn active px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white shadow-sm cursor-pointer transition-all whitespace-nowrap';
            btn.setAttribute('aria-selected', 'true');
            if (shouldScroll && typeof btn.scrollIntoView === 'function') {
              btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
            }
          } else {
            btn.className = 'filter-btn px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-all whitespace-nowrap';
            btn.setAttribute('aria-selected', 'false');
          }
        });
      }

      function filterCompanies() {
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const activeBtn = document.querySelector('#companyFilterTabs .filter-btn.active') || document.querySelector('#companyFilterTabs .filter-btn[data-filter="all"]');
        const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        let visibleCount = 0;

        cards.forEach(card => {
          const isSeat = card.id === 'open-company-card';
          const industry = card.getAttribute('data-industry') || '';
          const text = (card.innerText || '').toLowerCase();
          
          let matchesFilter = false;
          if (isSeat) {
            matchesFilter = activeFilter === 'all';
          } else {
            matchesFilter = activeFilter === 'all' || industry === activeFilter;
          }

          const matchesQuery = !query || text.includes(query);

          if (matchesFilter && matchesQuery) {
            card.style.display = 'flex';
            if (!isSeat) visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Update counter
        if (resultsCountEl) {
          if (visibleCount === 0) {
            resultsCountEl.textContent = '0 enterprise case studies found';
          } else if (visibleCount === totalCompaniesCount && !query && activeFilter === 'all') {
            resultsCountEl.textContent = `Showing all ${totalCompaniesCount} enterprise case studies`;
          } else {
            resultsCountEl.textContent = `Showing ${visibleCount} of ${totalCompaniesCount} enterprise case studies`;
          }
        }

        // Toggle clear filters button
        const hasActiveFilters = query.length > 0 || activeFilter !== 'all';
        if (btnClearFilters) {
          if (hasActiveFilters) {
            btnClearFilters.classList.remove('hidden');
          } else {
            btnClearFilters.classList.add('hidden');
          }
        }

        // Toggle empty state
        if (companyEmptyState) {
          if (visibleCount === 0) {
            companyEmptyState.classList.remove('hidden');
          } else {
            companyEmptyState.classList.add('hidden');
          }
        }
      }

      function resetAllCompanyFilters() {
        if (searchInput) searchInput.value = '';
        setActiveCompanyTab('all');
        filterCompanies();
        if (window.location.hash && ['#all', '#healthcare', '#fintech', '#legal', '#saas', '#defense', '#cyber', '#hr', '#agency', '#privacy'].includes(window.location.hash.toLowerCase())) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter') || 'all';
          setActiveCompanyTab(filter, true);
          if (filter !== 'all') {
            history.replaceState(null, '', '#' + filter);
          } else if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          filterCompanies();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', filterCompanies);
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            searchInput.value = '';
            filterCompanies();
          }
        });
      }

      if (btnClearFilters) {
        btnClearFilters.addEventListener('click', resetAllCompanyFilters);
      }
      if (btnEmptyReset) {
        btnEmptyReset.addEventListener('click', resetAllCompanyFilters);
      }

      // Initialize from URL hash or query parameters (?industry=...&q=...)
      const compUrlParams = new URLSearchParams(window.location.search);
      const initialCompQuery = (compUrlParams.get('q') || compUrlParams.get('search') || '').trim();
      if (initialCompQuery && searchInput) {
        searchInput.value = initialCompQuery;
      }
      const initialCompanyHash = (compUrlParams.get('industry') || window.location.hash.replace('#', '')).toLowerCase();
      const validCompanyIndustries = ['all', 'healthcare', 'fintech', 'legal', 'saas', 'defense', 'cyber', 'hr', 'agency', 'privacy'];
      if (validCompanyIndustries.includes(initialCompanyHash)) {
        setActiveCompanyTab(initialCompanyHash);
      }
      filterCompanies();

      function escapeXml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      }

      function generateBadgeSvg(label) {
        const rawLabel = String(label || 'ADOPTER').trim().toUpperCase();
        const cleanLabel = escapeXml(rawLabel);
        const wLeft = 58;
        const charWidth = 6.8;
        const wRight = Math.max(64, Math.round(rawLabel.length * charWidth + 16));
        const totalWidth = wLeft + wRight;
        const textXRight = wLeft + Math.round(wRight / 2);

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="companyBadgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#companyBadgeClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="#2563eb"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="#ffffff" letter-spacing="0.6">${cleanLabel}</text>
  </g>
</svg>`.trim();
      }

      // Interactive Enterprise Onboarding Seat Controller
      const companyNomineeInput = document.getElementById('companyNomineeInput');
      const companySeatBadgeMount = document.getElementById('companySeatBadgeMount');
      const btnClaimCompanyCta = document.getElementById('btnClaimCompanyCta');
      const sectorBtns = document.querySelectorAll('.corp-sector-btn');
      let currentNomineeSector = 'saas';

      function updateNomineeSeat() {
        const rawName = (companyNomineeInput && companyNomineeInput.value.trim()) || 'ACME CORP';
        const cleanName = rawName.slice(0, 32);
        if (companySeatBadgeMount && window.ztdsMountBadgeSvg) {
          window.ztdsMountBadgeSvg(companySeatBadgeMount, `${cleanName.toUpperCase()} · ADOPTER`, '#059669');
        }
        if (btnClaimCompanyCta) {
          btnClaimCompanyCta.href = `/apply/?track=company&company=${encodeURIComponent(cleanName)}&industry=${encodeURIComponent(currentNomineeSector)}`;
        }
      }

      if (companyNomineeInput) {
        companyNomineeInput.addEventListener('input', updateNomineeSeat);
      }

      sectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          sectorBtns.forEach(b => {
            b.className = 'corp-sector-btn px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 text-left transition-colors';
          });
          btn.className = 'corp-sector-btn px-2 py-1 rounded bg-blue-600 text-white font-bold border border-blue-400 text-left transition-colors';
          currentNomineeSector = btn.getAttribute('data-industry') || 'saas';
          updateNomineeSeat();
        });
      });

      // Initialize live badge preview on load
      updateNomineeSeat();

      // Case Studies Dataset (SSOT)
      const CASE_STUDIES = {
        'brandmeweb': {
          title: 'BrandMeWeb',
          tier: 'Founding Corporate Member',
          sector: 'Technical SEO & GEO Agency',
          monogram: 'BMW',
          headline: '100% Client Strategic Assets Shielded Across Automated GEO Workflows',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.5ms',
          roi: '100% Client IP Shielded',
          challenge: 'Agency AI pipelines process proprietary keyword intelligence, conversion logs, and client strategies daily. Sending raw corpora to cloud foundation models risked competitor data contamination and client breach liability.',
          integration: 'Deployed @privacyscrubber/sdk with Node.js and LangChain callback middleware running in local volatile memory. Reversible surrogates ensure client entity tokens are rehydrated in browser views only.',
          code: `import { ZTDSEngine } from '@privacyscrubber/sdk';

// Initialize in-memory zero-egress sanitizer
const ztds = new ZTDSEngine({
  mode: 'in-ram',
  enableReversibleSurrogates: true,
  profiles: ['seo_brand_assets', 'client_intelligence', 'analytics_ids']
});

// Intercept outgoing prompt to foundation model
const { sanitizedPrompt, sessionTable } = ztds.sanitize(rawClientBrief);
const response = await aiClient.generateText({ prompt: sanitizedPrompt });

// Restore entity values locally before rendering to strategist
const finalBrief = ztds.restore(response.text, sessionTable);`,
          outcome: 'Zero client data leaked into model training corpora. DPA-free enterprise client onboarding with 100% data sovereignty under GDPR Recital 26 and US DTSA trade secret shielding.',
          statutory: 'GDPR Recital 26 (Anonymous Data) & Trade Secret Defend Trade Secrets Act (DTSA)'
        },
        'privacyscrubber': {
          title: 'PrivacyScrubber',
          tier: 'Canonical Reference Implementation',
          sector: 'Zero-Server Privacy & Data Sanitization',
          monogram: 'PS',
          headline: '1,000,000+ Sensitive Entities Sanitized Locally with Zero Server Overhead',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.4ms',
          roi: '1M+ Records Protected',
          challenge: 'Enterprises and knowledge workers need client-side PII protection when pasting data into ChatGPT, Claude, and Gemini, but traditional proxy tools act as centralized honeypots requiring complex DPAs and security audits.',
          integration: 'Native WebAssembly (WASM) core compiled from Rust running in browser extensions and headless CLI SDKs with zero server logging and pure local volatile state.',
          code: `import { PrivacyScrubberWasmCore } from '@privacyscrubber/sdk/wasm';

// Pure client-side WebAssembly engine — zero cloud ingress/egress
const scrubber = await PrivacyScrubberWasmCore.init();

// Sanitizes 100+ PII / financial tokens in local V8 memory
const result = scrubber.tokenize({
  text: userPastedPrompt,
  preserveFormatting: true,
  strictMode: true
});

// Dispatched directly to LLM endpoint with zero PII
console.log('Sanitized payload:', result.maskedText);
console.log('Perimeter network egress bytes:', result.egressBytes); // 0`,
          outcome: '100% elimination of cloud proxy server infrastructure costs. Sub-millisecond deterministic tokenization with instant local reversal across 1M+ sensitive entities.',
          statutory: 'GDPR Article 28 Subprocessor Exclusion & ISO/IEC 27001 CC6.7'
        },
        'apex-health-ai': {
          title: 'Apex Health Systems',
          tier: 'Sandbox Blueprint',
          sector: 'Clinical Healthcare & Hospital EHR',
          monogram: 'AHS',
          headline: '$180,000 Annual Savings in Cloud BAA Fees with Zero PHI Exposure',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.6ms',
          roi: '$180k/yr Saved in BAA Proxy Fees',
          challenge: 'Clinicians across 12 hospitals used commercial LLMs for discharge summaries, risking catastrophic HIPAA breach penalties ($50k/violation) and requiring complex Business Associate Agreements (BAAs) with AI vendors.',
          integration: '@privacyscrubber/sdk browser extension deployed across 3,500 clinical Epic/Cerner workstations, de-identifying 18 PHI identifiers in local RAM before prompt dispatch.',
          code: `import { ZTDSEngine } from '@privacyscrubber/sdk';

// HIPAA Safe Harbor 45 CFR § 164.514(b) de-identification
const ztds = new ZTDSEngine({
  profile: 'hipaa_safe_harbor_18',
  maskDates: true,
  maskZipCodes: true
});

// Clinician discharge summary masked before API dispatch
const { sanitizedPrompt, tokenMap } = ztds.sanitize(rawClinicalNotes);
const aiSummary = await llm.complete({ prompt: sanitizedPrompt });

// Rehydrate in clinician browser view only
const clinicianReport = ztds.rehydrate(aiSummary, tokenMap);`,
          outcome: 'Zero PHI entities cross the network boundary. Eliminated cloud proxy subscription fees and achieved immediate HIPAA Safe Harbor compliance without vendor BAA friction.',
          statutory: 'HIPAA Privacy Rule 45 CFR § 164.514(b) (Safe Harbor De-Identification)'
        },
        'lex-veritas-legal': {
          title: 'Lex Veritas Global LLP',
          tier: 'Sandbox Blueprint',
          sector: 'Corporate Law, M&A & AI Litigation',
          monogram: 'LVG',
          headline: '4,500+ M&A Contracts Analyzed with Inviolable Attorney-Client Privilege',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.7ms',
          roi: '100% FRE 502 Privilege Shield',
          challenge: 'Commercial AI contract review tools threaten statutory attorney-client privilege under Federal Rule of Evidence (FRE) 502 and UK privilege doctrine if confidential work-product leaves legal custody unmasked.',
          integration: 'In-memory Python FastAPI middleware wrapping legal LLM analysis engines with local volatile reversible surrogate substitution.',
          code: `from privacyscrubber_sdk import ZTDSSanitizer
from fastapi import FastAPI, Request

app = FastAPI()
ztds = ZTDSSanitizer(mode="volatile-in-memory")

@app.post("/api/ai-contract-review")
async def review_contract(req: Request):
    payload = await req.json()
    # Preserves FRE 502 statutory attorney-client privilege
    masked_doc, vault_key = ztds.mask_privileged_matter(payload["contract_text"])
    
    ai_analysis = await call_external_llm(masked_doc)
    return {"analysis": ztds.unmask(ai_analysis, vault_key)}`,
          outcome: 'Preserved 100% attorney work-product privilege across 4,500 cross-border M&A contracts. Accelerated due diligence timelines from 3 weeks to 48 hours.',
          statutory: 'US Federal Rule of Evidence (FRE) 502 & UK Legal Professional Privilege (LPP)'
        },
        'aegis-fintech': {
          title: 'Aegis Financial Technologies',
          tier: 'Sandbox Blueprint',
          sector: 'Commercial Banking & Wire Operations',
          monogram: 'AFT',
          headline: 'PCI-DSS v4.0 Scope Elimination Across Real-Time Fraud Telemetry',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.8ms',
          roi: 'PCI-DSS Zero-Scope Exemption',
          challenge: 'Banking fraud investigation copilot processed millions of payment transactions containing primary account numbers (PAN) and SWIFT BIC codes, creating massive PCI-DSS audit scope and cross-border Swiss FADP transfer liabilities.',
          integration: 'Proxy-wasm Envoy sidecar filter intercepting core banking payload streams, replacing payment entities with reversible surrogates before API dispatch.',
          code: `# Envoy Proxy WASM Filter (Zero-Trust Sidecar)
filters:
  - name: ztds-fintech-filter
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.filters.http.wasm.v3.Wasm
      config:
        name: ztds_sanitizer
        root_id: ztds_pci_filter
        vm_config:
          runtime: "envoy.wasm.runtime.v8"
          code:
            local: { filename: "/opt/ztds/ztds_pci_sanitizer.wasm" }
        configuration: |
          { "target": "pci_dss_pan_iban", "reversible": true }`,
          outcome: 'De-scoped AI copilot infrastructure entirely from PCI-DSS audit boundaries. Zero Data Processing Agreement (DPA) delays across Swiss and EU banking jurisdictions.',
          statutory: 'PCI-DSS v4.0 Requirement 3.4 & GDPR Article 28 Subprocessor Exclusion'
        },
        'cloudscale-saas': {
          title: 'CloudScale Software Inc.',
          tier: 'Sandbox Blueprint',
          sector: 'B2B Enterprise SaaS & Cloud Systems',
          monogram: 'CSS',
          headline: 'Enterprise CISO Win Rate Jumped from 12% to 94% on Copilot Launch',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.5ms',
          roi: '94% CISO Security Approval Rate',
          challenge: 'Enterprise customers blocked CloudScale\'s new AI workflow copilot during security review due to fears of cross-tenant proprietary data contamination and lack of continuous tenant isolation evidence.',
          integration: '@privacyscrubber/sdk integrated directly into Next.js Edge frontend API routes, masking customer names, financial IDs, and emails before LLM transmission.',
          code: `// Next.js Edge Middleware for Multi-Tenant LLM Copilot
import { NextRequest, NextResponse } from 'next/server';
import { ZTDSEdgeEngine } from '@privacyscrubber/sdk/edge';

export async function middleware(req: NextRequest) {
  const body = await req.text();
  const { masked, surrogateTable } = ZTDSEdgeEngine.process(body, {
    tenantId: req.headers.get('x-tenant-id')
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ prompt: masked })
  });
  
  return ZTDSEdgeEngine.revertResponse(response, surrogateTable);
}`,
          outcome: 'Enterprise CISO security review pass rate increased from 12% to 94%. Guaranteed zero customer data persistence in external model training memory.',
          statutory: 'SOC 2 Type II CC6.7 (Logical Boundary Separation) & ISO 27001 Annex A.12'
        },
        'valkyrie-defense': {
          title: 'Valkyrie Aerospace & Defense',
          tier: 'Sandbox Blueprint',
          sector: 'Sovereign Enclaves & Defense Systems',
          monogram: 'VAD',
          headline: 'SCIF AI Operations Deployed with Cryptographic Zero-Egress Attestation',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.9ms',
          roi: 'ITAR / SCIF Air-Gapped Clearance',
          challenge: 'Defense technical specifications, munitions identifiers, and aerospace telemetry are subject to strict ITAR and European export controls, making commercial cloud AI strictly illegal without verified air-gap perimeters.',
          integration: 'Hardware-attested AWS Nitro Enclave C++ runtime executing ZTDS deterministic tokenization with cryptographic PCR hash verification and no network sockets.',
          code: `// AWS Nitro Enclave C++ Sanitizer (Air-Gapped SCIF Architecture)
#include <ztds/nitro_engine.hpp>

int main() {
    ztds::NitroEngine engine;
    engine.init_airgapped(); // Network socket disabled by Nitro hypervisor

    while (auto prompt = engine.read_vsock()) {
        // CMMC Level 3 / ITAR Compliant Sanitization in enclave memory
        auto sanitized = engine.sanitize_itar_identifiers(*prompt);
        engine.write_vsock(sanitized);
    }
    return 0;
}`,
          outcome: 'Successfully deployed LLM assistance in secure compartmented information facilities (SCIF). 100% audit clearance under CMMC Level 3 and ITAR mandates.',
          statutory: 'US ITAR 22 CFR § 120-130 & CMMC Level 3 Confidential Compute'
        },
        'cybershield-siem': {
          title: 'CyberShield SOC Operations',
          tier: 'Sandbox Blueprint',
          sector: 'Cybersecurity & SIEM Telemetry',
          monogram: 'CSO',
          headline: '50,000+ Incident Alerts Taged Without Exposing API Keys or Internal Subnets',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.4ms',
          roi: 'Zero Secret Compromise in 50k Logs',
          challenge: 'Tier-1 SOC analysts investigating breaches were pasting raw firewall logs, AWS IAM secrets, and internal network IP topologies into generative AI models, creating massive second-order attack vectors.',
          integration: 'Local CLI daemon (npx ztds-audit interceptor) and terminal wrapper filtering stdout/stdin before forwarding incident payloads to external AI analysis.',
          code: `#!/usr/bin/env bash
# Terminal / CLI Pipeline Wrapper with ZTDS Interceptor
cat /var/log/suricata/eve.json \\
  | npx ztds-audit --mask-secrets --mask-rfc1918 \\
  | llm "Analyze intrusion signature and recommend firewall ACLs" \\
  | npx ztds-audit --restore`,
          outcome: 'Over 50,000 security incidents resolved with 0 leaked credentials and zero exposed RFC 1918 internal subnets across 2 years of production SOC operations.',
          statutory: 'NIST SP 800-53 Rev. 5 (System & Information Integrity) & MITRE ATT&CK T1552'
        },
        'talenthub-hr': {
          title: 'TalentHub Global PeopleOps',
          tier: 'Sandbox Blueprint',
          sector: 'Human Resources & Global Workforce',
          monogram: 'THG',
          headline: 'GDPR Article 9 Special Category PII Cleared for AI Interview Analytics',
          egress: '0.00 B',
          dpa: '0 Days',
          latency: '< 0.5ms',
          roi: '100% GDPR Art. 9 Consent Waiver',
          challenge: 'Candidate resumes and interview transcripts contained sensitive health data, diversity disclosures, and national IDs. Processing these on third-party cloud AI violated GDPR Article 9 special category restrictions.',
          integration: 'Client-side React and Vue form hooks sanitizing applicant CVs and scorecards in the recruiter\'s browser before transmission to scoring models.',
          code: `import { useZTDSField } from '@privacyscrubber/sdk/react';

export function CandidateScreeningForm() {
  // Masks GDPR Art. 9 special category PII in browser memory
  const { inputProps, sanitizeAndSubmit } = useZTDSField({
    rules: ['candidate_medical', 'diversity_data', 'national_id'],
    endpoint: '/api/ai-screen-resume'
  });

  return (
    <textarea {...inputProps} placeholder="Paste resume or candidate notes..." />
  );
}`,
          outcome: '100% compliance with Canadian PIPEDA and GDPR Article 9. Allowed continuous deployment of AI candidate screening without requiring individual applicant data processing consent forms.',
          statutory: 'GDPR Article 9 (Special Categories of Data) & Canadian PIPEDA Schedule 1'
        }
      };

      // Case Study Modal Controller
      const caseStudyModal = document.getElementById('caseStudyModal');
      const caseStudyCloseBtn = document.getElementById('caseStudyCloseBtn');
      const csModalMonogram = document.getElementById('csModalMonogram');
      const csModalName = document.getElementById('csModalName');
      const csModalTier = document.getElementById('csModalTier');
      const csModalSector = document.getElementById('csModalSector');
      const csModalHeadline = document.getElementById('csModalHeadline');
      const csModalEgress = document.getElementById('csModalEgress');
      const csModalDpa = document.getElementById('csModalDpa');
      const csModalLatency = document.getElementById('csModalLatency');
      const csModalRoi = document.getElementById('csModalRoi');
      const csModalChallenge = document.getElementById('csModalChallenge');
      const csModalIntegration = document.getElementById('csModalIntegration');
      const csModalCode = document.getElementById('csModalCode');
      const csModalOutcome = document.getElementById('csModalOutcome');
      const csModalStatutory = document.getElementById('csModalStatutory');
      const csModalClaimCta = document.getElementById('csModalClaimCta');
      const copyCsCodeBtn = document.getElementById('copyCsCodeBtn');

      function openCaseStudyModal(slug) {
        const data = CASE_STUDIES[slug];
        if (!data || !caseStudyModal) return;

        if (csModalMonogram) csModalMonogram.textContent = data.monogram;
        if (csModalName) csModalName.textContent = data.title;
        if (csModalTier) csModalTier.textContent = data.tier;
        if (csModalSector) csModalSector.textContent = data.sector;
        if (csModalHeadline) csModalHeadline.textContent = data.headline;
        if (csModalEgress) csModalEgress.textContent = data.egress;
        if (csModalDpa) csModalDpa.textContent = data.dpa;
        if (csModalLatency) csModalLatency.textContent = data.latency;
        if (csModalRoi) csModalRoi.textContent = data.roi;
        if (csModalChallenge) csModalChallenge.textContent = data.challenge;
        if (csModalIntegration) csModalIntegration.textContent = data.integration;
        if (csModalCode) csModalCode.textContent = data.code;
        if (csModalOutcome) csModalOutcome.textContent = data.outcome;
        if (csModalStatutory) csModalStatutory.textContent = data.statutory;
        if (csModalClaimCta) {
          csModalClaimCta.href = `/apply/?track=company&company=${encodeURIComponent(data.title)}&industry=${encodeURIComponent(data.sector)}`;
        }

        if (window.ztdsModal) {
          window.ztdsModal.open(caseStudyModal, caseStudyCloseBtn);
        } else {
          caseStudyModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeCaseStudyModal() {
        if (!caseStudyModal) return;
        if (window.ztdsModal) {
          window.ztdsModal.close(caseStudyModal);
        } else {
          caseStudyModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      document.querySelectorAll('.btn-view-case-study').forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug');
          openCaseStudyModal(slug);
        });
      });

      if (caseStudyCloseBtn) {
        caseStudyCloseBtn.addEventListener('click', closeCaseStudyModal);
      }

      if (caseStudyModal) {
        caseStudyModal.addEventListener('click', (e) => {
          if (e.target === caseStudyModal) closeCaseStudyModal();
        });
      }

      if (copyCsCodeBtn) {
        copyCsCodeBtn.addEventListener('click', () => {
          window.ztdsCopy(csModalCode.textContent, () => {
            copyCsCodeBtn.textContent = 'Copied!';
            setTimeout(() => { copyCsCodeBtn.textContent = 'Copy Code'; }, 2000);
          });
        });
      }

      // Dynamic Badge Modal Controller
      const badgeModal = document.getElementById('badgeModal');
      const modalCloseBtn = document.getElementById('modalCloseBtn');
      const modalTitle = document.getElementById('modalTitle');
      const modalSubtitle = document.getElementById('modalSubtitle');
      const modalBadgeMount = document.getElementById('modalBadgeMount');
      const modalMdSnippet = document.getElementById('modalMdSnippet');
      const modalHtmlSnippet = document.getElementById('modalHtmlSnippet');
      const copyModalMdBtn = document.getElementById('copyModalMdBtn');
      const copyModalHtmlBtn = document.getElementById('copyModalHtmlBtn');
      const modalBadgeUrlText = document.getElementById('modalBadgeUrlText');
      const modalDirectSvgLink = document.getElementById('modalDirectSvgLink');

      function openBadgeModal(slug, name) {
        if (!badgeModal) return;
        const badgeLabel = (name ? name.toUpperCase() : 'ENTERPRISE') + ' · ADOPTER';
        const badgeUrl = `https://ztds.ai/badge/${slug}.svg`;
        const companyUrl = `https://ztds.ai/companies/#${slug}`;

        modalTitle.textContent = `${name} — Trust Seal`;
        modalSubtitle.textContent = `RFC v1.0 Corporate Adopter Seal for ${name}`;
        if (modalBadgeMount && window.ztdsMountBadgeSvg) {
          window.ztdsMountBadgeSvg(modalBadgeMount, badgeLabel, '#059669');
        }
        modalMdSnippet.value = `[![ZTDS Corporate Adopter](${badgeUrl})](${companyUrl})`;
        modalHtmlSnippet.value = `<a href="${companyUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="ZTDS Corporate Adopter - ${name}" width="168" height="22" decoding="async"></a>`;
        modalBadgeUrlText.textContent = badgeUrl;
        modalDirectSvgLink.href = badgeUrl;

        if (window.ztdsModal) {
          window.ztdsModal.open(badgeModal, modalCloseBtn);
        } else {
          badgeModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeBadgeModal() {
        if (!badgeModal) return;
        if (window.ztdsModal) {
          window.ztdsModal.close(badgeModal);
        } else {
          badgeModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      document.querySelectorAll('.btn-embed-seal').forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug');
          const name = btn.getAttribute('data-name');
          openBadgeModal(slug, name);
        });
      });

      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeBadgeModal);
      }

      if (badgeModal) {
        badgeModal.addEventListener('click', (e) => {
          if (e.target === badgeModal) closeBadgeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (caseStudyModal && !caseStudyModal.classList.contains('hidden')) {
            closeCaseStudyModal();
          }
          if (badgeModal && !badgeModal.classList.contains('hidden')) {
            closeBadgeModal();
          }
        }
      });

      if (copyModalMdBtn) {
        copyModalMdBtn.addEventListener('click', () => {
          window.ztdsCopy(modalMdSnippet.value, () => {
            copyModalMdBtn.textContent = 'Copied!';
            setTimeout(() => { copyModalMdBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      if (copyModalHtmlBtn) {
        copyModalHtmlBtn.addEventListener('click', () => {
          window.ztdsCopy(modalHtmlSnippet.value, () => {
            copyModalHtmlBtn.textContent = 'Copied!';
            setTimeout(() => { copyModalHtmlBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      // Hash scroll highlight support
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2');
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    })();
})();
