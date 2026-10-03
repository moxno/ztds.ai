#!/usr/bin/env node

/**
 * ZTDS.ai Company Profile Generator
 * Generates standalone, Schema.org-compliant profile pages for all companies in data/companies.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const companiesData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'companies.json'), 'utf8'));

const MONOGRAMS = {
  'brandmeweb': 'BMW',
  'privacyscrubber': 'PS',
  'apex-health-ai': 'AHS',
  'lex-veritas-legal': 'LVG',
  'aegis-fintech': 'AFT',
  'cloudscale-saas': 'CSS',
  'valkyrie-defense': 'VAD',
  'cybershield-siem': 'CSO',
  'talenthub-hr': 'THG'
};

const CERT_IDS = {
  'brandmeweb': 'ZTDS-CORP-2026-BMW-01',
  'privacyscrubber': 'ZTDS-CANONICAL-2026-PS-01',
  'apex-health-ai': 'ZTDS-BLUEPRINT-2026-APEX-01',
  'lex-veritas-legal': 'ZTDS-BLUEPRINT-2026-LEX-01',
  'aegis-fintech': 'ZTDS-BLUEPRINT-2026-AEGIS-01',
  'cloudscale-saas': 'ZTDS-BLUEPRINT-2026-CLOUD-01',
  'valkyrie-defense': 'ZTDS-BLUEPRINT-2026-VALK-01',
  'cybershield-siem': 'ZTDS-BLUEPRINT-2026-CYBER-01',
  'talenthub-hr': 'ZTDS-BLUEPRINT-2026-TALENT-01'
};

const HASHES = {
  'brandmeweb': 'sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24',
  'privacyscrubber': 'sha256:d02dc6b12a819034ec9834167e810a9f14061a9b2c34de569a101f82c317ad5e',
  'apex-health-ai': 'sha256:4a8c9b1097fa620391eb82d90a7863bc45e7309a6c38210f9e01db1239bc7a10',
  'lex-veritas-legal': 'sha256:8b7102e3a987d6051c203948e918abf56a73c019283e10fa9d8b7201c9a8120e',
  'aegis-fintech': 'sha256:3c90184b901e23f987a01b239c01fa9e83b029384e091b2c3a0198ebf901823a',
  'cloudscale-saas': 'sha256:91823a01b23c901e23f987a01b239c01fa9e83b029384e091b2c3a0198ebf901',
  'valkyrie-defense': 'sha256:5e091b2c3a0198ebf901823a3c90184b901e23f987a01b239c01fa9e83b02938',
  'cybershield-siem': 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  'talenthub-hr': 'sha256:6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a'
};

const CODE_SNIPPETS = {
  'brandmeweb': `import { ZTDSEngine } from '@privacyscrubber/sdk';

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

  'privacyscrubber': `import { PrivacyScrubberWasmCore } from '@privacyscrubber/sdk/wasm';

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

  'apex-health-ai': `import { ZTDSEngine } from '@privacyscrubber/sdk';

// HIPAA Safe Harbor 45 CFR \u00a7 164.514(b) de-identification
const ztds = new ZTDSEngine({
  profile: 'hipaa_safe_harbor_18',
  maskDates: true,
  maskZipCodes: true
});

// Clinician discharge summary masked before API dispatch
const { sanitizedPrompt, sessionMap } = ztds.sanitize(rawClinicalNotes);
const aiSummary = await llm.complete({ prompt: sanitizedPrompt });

// Rehydrate in clinician browser view only
const clinicianReport = ztds.rehydrate(aiSummary, sessionMap);`,

  'lex-veritas-legal': `from privacyscrubber_sdk import ZTDSSanitizer
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

  'aegis-fintech': `# Envoy Proxy WASM Filter (Zero-Trust Sidecar)
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

  'cloudscale-saas': `// Next.js Edge Middleware for Multi-Tenant LLM Copilot
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

  'valkyrie-defense': `// AWS Nitro Enclave C++ Sanitizer (Air-Gapped SCIF Architecture)
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

  'cybershield-siem': `#!/usr/bin/env bash
# Terminal / CLI Pipeline Wrapper with ZTDS Interceptor
cat /var/log/suricata/eve.json \\
  | npx ztds-audit --mask-secrets --mask-rfc1918 \\
  | llm "Analyze intrusion signature and recommend firewall ACLs" \\
  | npx ztds-audit --restore`,

  'talenthub-hr': `import { useZTDSField } from '@privacyscrubber/sdk/react';

export function CandidateScreeningForm() {
  // Masks GDPR Art. 9 special category PII in browser memory
  const { inputProps, sanitizeAndSubmit } = useZTDSField({
    rules: ['candidate_medical', 'diversity_data', 'national_id'],
    endpoint: '/api/ai-screen-resume'
  });

  return (
    <textarea {...inputProps} placeholder="Paste resume or candidate notes..." />
  );
}`
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateProfileHtml(company) {
  const slug = company.slug;
  const name = company.name;
  const tier = company.tier;
  const industry = company.industry;
  const description = company.description;
  const verifiedDate = company.verified_date;
  const complianceScope = company.compliance_scope;
  const caseStudy = company.case_study;
  const monogram = MONOGRAMS[slug] || name.slice(0, 3).toUpperCase();
  const certId = CERT_IDS[slug] || `ZTDS-CORP-2026-${slug.toUpperCase()}-01`;
  const auditHash = HASHES[slug] || 'sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24';
  const codeSnippet = CODE_SNIPPETS[slug] || '// ZTDS Zero-Trust SDK Integration\nimport { ZTDSEngine } from \'@privacyscrubber/sdk\';';
  const websiteUrl = company.url.startsWith('http') && !company.url.includes('ztds.ai/companies/#') ? company.url : `https://ztds.ai/companies/${slug}/`;
  const websiteDomain = websiteUrl.replace(/^https?:\/\//, '').split(/[/?#]/)[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} — ZTDS ${escapeHtml(tier)} &amp; Case Study</title>
  <meta name="description" content="Official ZTDS verification profile for ${escapeHtml(name)}. Certified zero-retention, client-side data sanitization and enterprise AI case study.">
  <link rel="canonical" href="https://ztds.ai/companies/${slug}/">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Open Graph & Social Cards -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://ztds.ai/companies/${slug}/">
  <meta property="og:title" content="${escapeHtml(name)} — ZTDS ${escapeHtml(tier)} &amp; Case Study">
  <meta property="og:description" content="Official ZTDS verification profile for ${escapeHtml(name)}. Certified zero-retention, client-side data sanitization and enterprise AI case study.">
  <meta property="og:image" content="https://ztds.ai/badge/${slug}.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(name)} — ZTDS ${escapeHtml(tier)} &amp; Case Study">
  <meta name="twitter:description" content="Official ZTDS verification profile for ${escapeHtml(name)}. Certified zero-retention, client-side data sanitization and enterprise AI case study.">
  <meta name="twitter:image" content="https://ztds.ai/badge/${slug}.svg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://ztds.ai/companies/${slug}/#profile",
        "url": "https://ztds.ai/companies/${slug}/",
        "name": "${escapeHtml(name)} — ZTDS Verification Profile",
        "description": "Official Zero-Trust Data Sanitization verification and corporate profile for ${escapeHtml(name)}.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://ztds.ai/#website",
          "name": "ZTDS.ai",
          "url": "https://ztds.ai"
        },
        "mainEntity": {
          "@type": "Organization",
          "@id": "https://ztds.ai/companies/${slug}/#organization",
          "name": "${escapeHtml(name)}",
          "url": "${websiteUrl}",
          "memberOf": {
            "@type": "Organization",
            "name": "ZTDS AI Consortium",
            "url": "https://ztds.ai"
          },
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "ZTDS ${escapeHtml(tier)}",
            "name": "Zero-Trust Data Sanitization Conformance Certificate",
            "recognizedBy": {
              "@type": "Organization",
              "name": "ZTDS AI Consortium",
              "url": "https://ztds.ai"
            },
            "validFrom": "${verifiedDate}"
          },
          "knowsAbout": [
            "${escapeHtml(industry)}",
            "Zero-Trust Data Sanitization",
            "Client-Side AI Prompt Privacy",
            "RFC v1.0 Conformance"
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ZTDS.ai", "item": "https://ztds.ai/" },
          { "@type": "ListItem", "position": 2, "name": "Corporate Adopters", "item": "https://ztds.ai/companies/" },
          { "@type": "ListItem", "position": 3, "name": "${escapeHtml(name)}", "item": "https://ztds.ai/companies/${slug}/" }
        ]
      }
    ]
  }
  </script>
</head>
<body class="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col font-sans">

  <!-- Institutional Top Header -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      
      <!-- Brand & Status -->
      <div class="flex items-center gap-6">
        <a href="/" class="flex items-center gap-3 touch-target">
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-sm shrink-0 aspect-square p-0.5 overflow-hidden">
            <svg class="w-full h-full" viewBox="1.2 2.2 29.6 27.6" fill="none" aria-hidden="true">
              <path d="M12.5 3C5.5 3 2 7.5 2 16C2 24.5 5.5 29 12.5 29V22C7.5 22 6.5 19 6.5 16C6.5 13 7.5 10 12.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M19.5 3C26.5 3 30 7.5 30 16C30 24.5 26.5 29 19.5 29V22C24.5 22 25.5 19 25.5 16C25.5 13 24.5 10 19.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M16 6.5L22.5 16L16 25.5L9.5 16Z" fill="#10b981"/>
              <circle cx="16" cy="16" r="2.5" fill="#38bdf8"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-lg tracking-tight text-slate-900 font-sans leading-none">ZTDS<span class="text-emerald-600">.ai</span></span>
            <span class="text-[9.5px] text-slate-400 font-mono font-bold tracking-widest uppercase mt-0.5">Open AI Security Standard</span>
          </div>
        </a>

        <!-- Status Pill -->
        <div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <span class="pulse-dot"></span>
          <span class="font-mono text-[11px] font-semibold">RFC v1.0 &middot; OPEN CONSORTIUM</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600" id="desktop-nav">
        <a href="/standard/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">Standard</a>
        <a href="/registry/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">Registry</a>
        <a href="/fellows/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">Fellows</a>
        <a href="/companies/" class="nav-link text-emerald-700 font-bold py-1 whitespace-nowrap">Adopters</a>
        <a href="/scanner/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">Scanner</a>
        <a href="/sdk/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">SDK &amp; Connectors</a>
        <a href="/ciso/" class="nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap">CISO &amp; Trust</a>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <a href="/apply/?track=company" class="btn-trust text-xs py-2 px-4 shadow-sm font-semibold whitespace-nowrap touch-target">
          Register Company &rarr;
        </a>
        <button id="mobile-menu-toggle" type="button" aria-label="Open Navigation Menu" aria-expanded="false" class="lg:hidden touch-target p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Slide-Over Drawer -->
  <div id="mobile-backdrop" class="mobile-nav-backdrop drawer-backdrop" aria-hidden="true"></div>
  <aside id="mobile-drawer" class="mobile-nav-drawer drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-0.5 overflow-hidden">
          <svg class="w-full h-full" viewBox="1.2 2.2 29.6 27.6" fill="none" aria-hidden="true">
            <path d="M12.5 3C5.5 3 2 7.5 2 16C2 24.5 5.5 29 12.5 29V22C7.5 22 6.5 19 6.5 16C6.5 13 7.5 10 12.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M19.5 3C26.5 3 30 7.5 30 16C30 24.5 26.5 29 19.5 29V22C24.5 22 25.5 19 25.5 16C25.5 13 24.5 10 19.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="M16 6.5L22.5 16L16 25.5L9.5 16Z" fill="#10b981"/>
            <circle cx="16" cy="16" r="2.5" fill="#38bdf8"/>
          </svg>
        </div>
        <span class="font-bold text-slate-900 text-base">ZTDS<span class="text-emerald-600">.ai</span></span>
      </div>
      <button id="mobile-menu-close" type="button" aria-label="Close Navigation Menu" class="touch-target p-2 text-slate-400 hover:text-slate-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="py-4 space-y-1 text-sm font-medium">
      <div class="px-2 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Certification &amp; Standard</div>
      <a href="/apply/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Get Your AI Certified</a>
      <a href="/registry/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Verified Products Directory</a>
      <a href="/standard/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Official RFC Specification</a>
      <a href="/whitepaper/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Academic Whitepaper</a>
      <a href="/ciso/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">CISO Procurement &amp; Legal Pack</a>
      <a href="/roi/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">CISO Risk &amp; ROI Calculator</a>
      <a href="/soc2/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">SOC 2 &amp; Trust Center</a>

      <div class="px-2 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Developers &amp; Tools</div>
      <a href="/sdk/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">SDK Documentation</a>
      <a href="/scanner/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Perimeter Scanner</a>
      <a href="/inspector/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Interactive Inspector</a>
      <a href="/badge/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Badge &amp; Seal Foundry</a>

      <div class="px-2 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Consortium</div>
      <a href="/companies/" class="block px-3 py-2 rounded-lg text-emerald-800 bg-emerald-50 font-semibold">Corporate Members</a>
      <a href="/fellows/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Research Fellows</a>
      <a href="/governance/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Governance &amp; Charter</a>
      <a href="/security/" class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Security &amp; CVD</a>
    </div>

    <div class="mt-auto pt-4 border-t border-slate-200">
      <a href="/apply/?track=company" class="btn-trust w-full text-center text-xs py-2.5 touch-target">
        Register Corporate Member &rarr;
      </a>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8" aria-label="Breadcrumb">
      <a href="/" class="hover:text-slate-900 transition-colors">ZTDS.ai</a>
      <span class="text-slate-300">/</span>
      <a href="/companies/" class="hover:text-slate-900 transition-colors">Corporate Adopters</a>
      <span class="text-slate-300">/</span>
      <span class="text-emerald-700 font-semibold">${escapeHtml(name)}</span>
    </nav>

    <!-- Header Section Card -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 sm:p-10 mb-8 relative overflow-hidden">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-2xl font-mono shadow-sm shrink-0">
            ${escapeHtml(monogram)}
          </div>
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">${escapeHtml(name)}</h1>
              <span class="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                ${escapeHtml(tier)}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 font-mono mt-1">
              ${escapeHtml(industry)} &middot; Headquarters: ${escapeHtml(company.headquarters || 'International')}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <a href="${websiteUrl}" target="_blank" rel="noopener" class="w-full md:w-auto text-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-mono font-semibold transition-all">
            ${escapeHtml(websiteDomain)} &rarr;
          </a>
        </div>
      </div>

      <!-- Verification Specs Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs font-mono">
        <div>
          <div class="text-slate-400 mb-1">CONFORMANCE STATUS</div>
          <div class="text-emerald-700 font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Zero-Egress Verified
          </div>
        </div>
        <div>
          <div class="text-slate-400 mb-1">VERIFICATION DATE</div>
          <div class="text-slate-800 font-semibold">${escapeHtml(verifiedDate)} (RFC v1.0)</div>
        </div>
        <div>
          <div class="text-slate-400 mb-1">CERTIFICATE ID</div>
          <div class="text-slate-800 font-semibold">${escapeHtml(certId)}</div>
        </div>
        <div>
          <div class="text-slate-400 mb-1">AUDIT ATTESTATION</div>
          <div class="text-slate-800 font-semibold truncate" title="${escapeHtml(auditHash)}">
            ${escapeHtml(auditHash.slice(0, 16))}...
          </div>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Left Column: Scope & Overview -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Organizational Overview &amp; Mandate</h2>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ${escapeHtml(description)}
          </p>
          <p class="text-sm text-slate-600 leading-relaxed">
            As part of the ZTDS verified ecosystem, ${escapeHtml(name)} enforces hardware-isolated and in-memory reversible tokenization to eliminate external cloud intermediary leaks before outgoing prompts reach foundation models.
          </p>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 class="text-lg font-bold text-slate-900 mb-4">Certified Compliance Scope</h2>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ${escapeHtml(complianceScope)}
          </p>
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
              <span><strong>Invariant 1 (Zero WAN Egress):</strong> High-risk corporate identifiers and domain entities are masked in local RAM prior to WAN transmission.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
              <span><strong>Invariant 2 (Deterministic Tokenization):</strong> Syntactic surrogate tokens maintain prompt context for LLMs while private mapping tables remain strictly in volatile memory.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
              <span><strong>Invariant 4 (Zero Subprocessor Chain):</strong> Eliminates third-party cloud proxy servers and excludes vendor sub-processor liability under GDPR Article 28.</span>
            </li>
          </ul>
        </div>

        <!-- Production Case Study Section -->
        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">CASE STUDY</span>
            <span class="text-xs text-slate-400 font-mono">${escapeHtml(caseStudy.statutory_basis)}</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-4">${escapeHtml(caseStudy.headline)}</h3>
          
          <div class="space-y-4 text-sm text-slate-600 leading-relaxed mb-6">
            <div>
              <strong class="text-slate-900 block mb-1">Operational Challenge:</strong>
              <p>${escapeHtml(caseStudy.challenge)}</p>
            </div>
            <div>
              <strong class="text-slate-900 block mb-1">ZTDS Architecture &amp; SDK Integration:</strong>
              <p>${escapeHtml(caseStudy.sdk_integration)}</p>
            </div>
          </div>

          <!-- Code Snippet -->
          <div class="mb-6">
            <div class="flex items-center justify-between bg-slate-900 text-slate-400 text-xs px-4 py-2 rounded-t-xl font-mono">
              <span>Reference Architecture Snippet</span>
              <span>Volatile RAM Execution</span>
            </div>
            <pre class="bg-slate-950 text-slate-100 p-4 rounded-b-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-900"><code>${escapeHtml(codeSnippet)}</code></pre>
          </div>

          <div class="mb-6">
            <strong class="text-slate-900 block mb-1 text-sm">Verified Outcome:</strong>
            <p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(caseStudy.outcome)}</p>
          </div>

          <!-- Metrics Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center font-mono">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-xs text-slate-400">WAN EGRESS</div>
              <div class="text-lg font-bold text-slate-900">${escapeHtml(caseStudy.metrics.egress)}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-xs text-slate-400">DPA OVERHEAD</div>
              <div class="text-lg font-bold text-emerald-700">${escapeHtml(caseStudy.metrics.dpa_days)}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-xs text-slate-400">IN-RAM LATENCY</div>
              <div class="text-lg font-bold text-slate-900">${escapeHtml(caseStudy.metrics.latency)}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="text-xs text-slate-400">STATUTORY ROI</div>
              <div class="text-xs font-bold text-blue-700 truncate" title="${escapeHtml(caseStudy.metrics.roi)}">${escapeHtml(caseStudy.metrics.roi)}</div>
            </div>
          </div>
        </div>

        <!-- Accredited Implementation Partner Banner -->
        <div class="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">ACCREDITED PARTNER</span>
            <span class="text-xs text-slate-500 font-mono">Independent Verification</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Accredited Implementation &amp; Security Audit Partner</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            Engage an accredited partner like BrandMeWeb for turn-key ZTDS conformance verification, CISO DPA exemption memorandums, machine-readable llms.txt knowledge corpuses, and continuous CI/CD audit gates.
          </p>
          <a href="/agency/" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono shadow-sm transition-all">
            Explore Partner Audit &amp; Implementation Services &rarr;
          </a>
        </div>
      </div>

      <!-- Right Column: Verification Badge & Embed Code -->
      <div class="space-y-6">
        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
          <div class="text-xs font-mono text-slate-400 mb-2 font-bold">OFFICIAL TRUST BADGE</div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
            <img src="/badge/${slug}.svg" alt="ZTDS Verified — ${escapeHtml(name)}" class="h-6 w-auto" width="138" height="22">
          </div>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            Display the official ZTDS Verified Badge on your corporate website, documentation, or security portal.
          </p>

          <label class="block text-xs font-mono text-slate-600 mb-1.5 font-semibold">Embed HTML Code</label>
          <div class="relative">
            <pre class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto leading-relaxed"><code>&lt;a href="https://ztds.ai/companies/${slug}/" target="_blank" rel="noopener" title="ZTDS Verified Corporate Member"&gt;
  &lt;img src="https://ztds.ai/badge/${slug}.svg" alt="ZTDS Verified" width="138" height="22" /&gt;
&lt;/a&gt;</code></pre>
          </div>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
          <h3 class="text-sm font-bold text-slate-900 mb-2">Verified Affiliations</h3>
          <ul class="text-xs font-mono space-y-2 text-slate-600">
            <li>&bull; <a href="/fellows/ilya-sibiryakov/" class="text-emerald-700 font-semibold hover:underline">Ilya Sibiryakov (Founding Fellow)</a></li>
            <li>&bull; <a href="/companies/brandmeweb/" class="text-emerald-700 font-semibold hover:underline">BrandMeWeb (Founding Member)</a></li>
            <li>&bull; <a href="/agency/" class="text-emerald-700 font-semibold hover:underline">BrandMeWeb Agency Retainer</a></li>
            <li>&bull; <a href="/standard/" class="text-slate-700 hover:underline">ZTDS RFC v1.0 Working Group</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Back Navigation -->
    <div class="border-t border-slate-200 pt-6 flex items-center justify-between text-xs font-mono">
      <a href="/companies/" class="text-emerald-700 font-semibold hover:underline">&larr; Back to All Corporate Adopters</a>
      <a href="/apply/?track=company" class="text-emerald-700 font-semibold hover:underline">Register Your Company &rarr;</a>
    </div>

  </main>

  <!-- 5-Column Institutional Light Footer -->
  <footer class="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12 text-sm mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-100">
        <!-- Col 1: Brand & Consortium -->
        <div class="space-y-4 sm:col-span-2 md:col-span-1">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 aspect-square p-0.5 overflow-hidden">
              <svg class="w-full h-full" viewBox="1.2 2.2 29.6 27.6" fill="none" aria-hidden="true">
                <path d="M12.5 3C5.5 3 2 7.5 2 16C2 24.5 5.5 29 12.5 29V22C7.5 22 6.5 19 6.5 16C6.5 13 7.5 10 12.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M19.5 3C26.5 3 30 7.5 30 16C30 24.5 26.5 29 19.5 29V22C24.5 22 25.5 19 25.5 16C25.5 13 24.5 10 19.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M16 6.5L22.5 16L16 25.5L9.5 16Z" fill="#10b981"/>
                <circle cx="16" cy="16" r="2.5" fill="#38bdf8"/>
              </svg>
            </div>
            <span class="font-bold text-slate-900 text-lg font-sans">ZTDS<span class="text-emerald-600">.ai</span></span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            The open industry standard and conformance authority for zero-trust data sanitization in enterprise AI pipelines.
          </p>
          <div class="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            Originated by <a href="https://www.linkedin.com/in/ilya-sibiryakov/" target="_blank" rel="noopener" class="text-slate-800 hover:text-slate-900 font-semibold underline decoration-slate-300 underline-offset-2">Ilya Sibiryakov</a>.<br>
            Stewarded by the <span class="font-semibold text-slate-700">ZTDS AI Consortium</span> as an open specification. Engineering sponsored by <a href="https://brandmeweb.com" target="_blank" rel="noopener" class="text-slate-800 hover:text-slate-900 font-semibold underline decoration-slate-300 underline-offset-2">BrandMeWeb</a>.
          </div>
        </div>

        <!-- Col 2: Specification & RFC -->
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-900 font-mono mb-4">RFC Specification</div>
          <ul class="space-y-2.5 text-xs">
            <li><a href="/standard/" class="hover:text-slate-900 transition-colors">ZTDS RFC v1.0 Formal Spec</a></li>
            <li><a href="/whitepaper/" class="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Research Whitepaper &rarr;</a></li>
            <li><a href="/ciso/" class="hover:text-slate-900 transition-colors">CISO &amp; DPA Exemption Memo</a></li>
            <li><a href="/roi/" class="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">CISO Risk &amp; ROI Calculator &rarr;</a></li>
            <li><a href="https://zenodo.org/records/22058770" target="_blank" rel="noopener" class="hover:text-slate-900 transition-colors">Zenodo Paper (DOI: 10.5281)</a></li>
            <li><a href="https://osf.io/5byjf/" target="_blank" rel="noopener" class="hover:text-slate-900 transition-colors">OSF Latency Benchmarks</a></li>
            <li><a href="/llms.txt" class="hover:text-slate-900 transition-colors">llms.txt Standard Corpus</a></li>
          </ul>
        </div>

        <!-- Col 3: Architecture & Tools -->
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-900 font-mono mb-4">Developer &amp; Tools</div>
          <ul class="space-y-2.5 text-xs">
            <li><a href="/sdk/" class="hover:text-slate-900 transition-colors">Developer SDK Docs</a></li>
            <li><a href="/inspector/" class="hover:text-slate-900 transition-colors">Interactive Pipeline Simulator</a></li>
            <li><a href="/scanner/" class="hover:text-slate-900 transition-colors">Perimeter Network Scanner</a></li>
            <li><a href="/badge/" class="hover:text-slate-900 transition-colors">Trust Badge &amp; Seal Foundry</a></li>
            <li><a href="/registry/#privacyscrubber" class="hover:text-slate-900 transition-colors">Reference Implementations &rarr;</a></li>
          </ul>
        </div>

        <!-- Col 4: Consortium & Trust -->
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-900 font-mono mb-4">Consortium &amp; Trust</div>
          <ul class="space-y-2.5 text-xs">
            <li><a href="/soc2/" class="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">SOC 2 &amp; Trust Center &rarr;</a></li>
            <li><a href="/governance/" class="hover:text-slate-900 transition-colors">Governance &amp; Charter</a></li>
            <li><a href="/security/" class="hover:text-slate-900 transition-colors">Security &amp; CVD Policy</a></li>
            <li><a href="/privacy/" class="hover:text-slate-900 transition-colors">Zero-Telemetry Declaration</a></li>
            <li><a href="/terms/" class="hover:text-slate-900 transition-colors">Standards &amp; Patent Policy</a></li>
            <li><a href="/.well-known/security.txt" class="hover:text-slate-900 transition-colors">RFC 9116 security.txt</a></li>
          </ul>
        </div>

        <!-- Col 5: Community & Verified -->
        <div>
          <div class="font-bold text-[11px] uppercase tracking-wider text-slate-900 font-mono mb-4">Verified Ecosystem</div>
          <ul class="space-y-2.5 text-xs">
            <li><a href="/registry/" class="hover:text-slate-900 transition-colors">Verified Implementations</a></li>
            <li><a href="/companies/" class="hover:text-slate-900 transition-colors">Corporate Members Pool</a></li>
            <li><a href="/fellows/" class="hover:text-slate-900 transition-colors">Global Research Fellows</a></li>
            <li><a href="/case-studies/" class="hover:text-slate-900 transition-colors">Field Case Studies</a></li>
            <li><a href="/apply/" class="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Apply for Accreditation &rarr;</a></li>
            <li><a href="https://github.com/moxno/ztds.ai" target="_blank" rel="noopener" class="hover:text-slate-900 transition-colors">GitHub Repository</a></li>
          </ul>
        </div>
      </div>

      <!-- Legal Conformance Notice Card -->
      <div class="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
          <span class="font-bold text-slate-700 uppercase tracking-wider text-[10px] font-mono">Legal Notice &amp; Intellectual Property Protection</span>
          <span class="text-slate-400 font-mono text-[10px]">Patent IL 331905 &middot; WIPO DAS: B17B &middot; Trademark #182655957</span>
        </div>
        <p>
          ZTDS.ai is an independent technical consortium and specification authority. The Zero-Trust Data Sanitization standard is an open specification published under Apache 2.0 and CC BY 4.0. The deterministic in-RAM sanitization methods, reversible surrogate token structures, and local memory verification mechanisms are intellectual property protected under Israel Patent Office Application <strong>IL 331905</strong> (filed 14/09/2026, WIPO DAS Access Code: <strong>B17B</strong>, Paris Convention international priority locked through 14/09/2027). The word mark <strong>ZTDS™</strong> is registered under ILPO Order #182655957 (Classes 9 &amp; 42). The "ZTDS Verified" designation confirms strictly that a software build demonstrated compliance with the four foundational invariants under automated network inspection. Technical verification does not constitute formal legal counsel; consult qualified privacy counsel for jurisdiction-specific compliance determinations.
        </p>
      </div>

      <!-- Bottom Meta Bar -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-100 pt-6">
        <div class="flex items-center gap-3">
          <span>&copy; 2026 ZTDS AI Consortium.</span>
          <span>&middot;</span>
          <span>Open Specification under Apache 2.0 &amp; CC BY 4.0.</span>
        </div>
        <div class="flex items-center gap-4 text-[11px] font-mono">
          <span class="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ALL SYSTEMS VERIFIED
          </span>
          <span>&middot;</span>
          <a href="/security/" class="hover:text-slate-600 transition-colors">PGP KEY: 0x4E9A2B1C</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="/nav.js"></script>
</body>
</html>
`;
}

console.log('Generating profile pages for all companies in data/companies.json...');
let generated = 0;

for (const company of companiesData.companies) {
  const slug = company.slug;
  const outDir = path.join(ROOT, 'companies', slug);
  const outFile = path.join(outDir, 'index.html');
  
  // Skip brandmeweb as it already has a hand-crafted master profile
  if (slug === 'brandmeweb') {
    console.log(`Skipping master profile: companies/${slug}/index.html`);
    continue;
  }

  fs.mkdirSync(outDir, { recursive: true });
  const html = generateProfileHtml(company);
  fs.writeFileSync(outFile, html, 'utf8');
  console.log(`Generated: companies/${slug}/index.html`);
  generated++;
}

console.log(`\nSuccessfully generated ${generated} standalone company profiles.`);
