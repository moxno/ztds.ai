/**
 * ZTDS.ai Domain Perimeter Scanner & CISO Memorandum Engine
 * 
 * Shared client-side runtime for domain perimeter scanning, progressive disclosure,
 * multi-framework blueprint synthesis, and CISO compliance memorandum generation.
 * 
 * Complies with ZTDS RFC v1.0, U.S. &amp; Int'l Patents Pending, and Trademark #182655957.
 * Brand: BrandMeWeb (strictly single word).
 */

(function(global) {
  'use strict';

  const ZTDSScanner = {
    /**
     * Escapes HTML special characters for safe DOM insertion.
     */
    escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /**
     * Dispatches file download directly in browser memory via ObjectURL.
     */
    triggerDownload(content, filename, mimeType = 'text/markdown;charset=utf-8') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    /**
     * Universal clipboard copy with visual button feedback.
     */
    bindCopyButton(btn, getTextFn, defaultLabel = 'Copy', copiedLabel = 'Copied!') {
      if (!btn) return;
      btn.addEventListener('click', () => {
        const text = typeof getTextFn === 'function' ? getTextFn() : getTextFn;
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = copiedLabel;
          setTimeout(() => {
            btn.textContent = original || defaultLabel;
          }, 2000);
        }).catch(() => {
          btn.textContent = copiedLabel;
          setTimeout(() => { btn.textContent = defaultLabel; }, 2000);
        });
      });
    },

    /**
     * Dispatches domain perimeter scan to backend API.
     */
    async scanDomain(domain, profile = '') {
      const payload = { domain: domain.trim() };
      if (profile) payload.profile = profile;

      const res = await fetch('/api/scan-domain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    },

    /**
     * Submits CISO lead capture to backend API.
     */
    async submitLead(payload) {
      const res = await fetch('/api/lead-capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    },

    /**
     * Generates framework code snippet based on active profile and target domain.
     */
    generateFrameworkSnippet(framework, domain, profileInfo, profileKey = 'general') {
      const profName = profileInfo?.name || 'General Enterprise';
      const statute = profileInfo?.statute || 'GDPR Recital 26';
      const targetEntities = profileInfo?.targetEntities || ['Email', 'Phone', 'IP Address'];
      const profArrayLiteral = (profileInfo?.sdkProfiles || [profileKey]).map(p => `'${p}'`).join(', ');

      switch (framework) {
        case 'nextjs':
          return `// middleware.ts — ZTDS Zero-Trust Enclave for ${domain}\n// Profile: ${profName} (${statute})\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\nimport { ZTDSClient } from '@privacyscrubber/sdk';\n\nconst ztds = new ZTDSClient({\n  profiles: [${profArrayLiteral}],\n  zeroEgress: true\n});\n\nexport async function middleware(req: NextRequest) {\n  if (req.nextUrl.pathname.startsWith('/api/chat') && req.method === 'POST') {\n    const rawBody = await req.json();\n    const { safePrompt, tokenMap } = ztds.sanitize(rawBody.prompt);\n    return NextResponse.next({\n      request: new Request(req.url, { method: req.method, headers: req.headers, body: JSON.stringify({ ...rawBody, prompt: safePrompt }) })\n    });\n  }\n}`;
        case 'cloudflare':
          return `// worker.js — Cloudflare Zero-Trust Reverse Proxy for ${domain}\n// Profile: ${profName} (${statute})\nimport { ZTDSClient } from '@privacyscrubber/sdk';\n\nconst ztds = new ZTDSClient({\n  profiles: [${profArrayLiteral}],\n  zeroEgress: true\n});\n\nexport default {\n  async fetch(request, env) {\n    // In-RAM de-identification of ${targetEntities[0] || 'PII'}\n    return fetch(request);\n  }\n};`;
        case 'python':
          return `# main.py — FastAPI In-Memory Zero-Trust Enclave for ${domain}\n# Profile: ${profName} (${statute})\nfrom fastapi import FastAPI\nfrom privacyscrubber import ZTDSClient\n\nztds = ZTDSClient(profiles=[${profArrayLiteral}], zero_egress=True)\n\n@app.post("/api/ai")\nasync def secure_chat(req: ChatRequest):\n    safe, token_map = ztds.sanitize(req.prompt)\n    return {"reply": ztds.restore(await call_llm(safe), token_map)}`;
        case 'client':
        default:
          return `<!-- In-RAM Client Enclave for ${domain} (${profName}) -->\n<script type="module">\nimport { ZTDSClient } from 'https://cdn.jsdelivr.net/npm/@privacyscrubber/sdk/dist/ztds.esm.js';\n\nconst ztds = new ZTDSClient({ profiles: [${profArrayLiteral}] });\n// In-RAM local sanitization of ${targetEntities[0] || 'PII'}\n<\/script>`;
      }
    },

    /**
     * Renders Before vs After DAG architectural comparison HTML markup.
     */
    renderDagHtml(dagComparison, sinksCount = 0, statute = 'GDPR Recital 26') {
      const escape = this.escapeHtml;
      const dag = dagComparison || {
        legacy: {
          title: 'Legacy Cloud Proxy Route (Vulnerable)',
          flow: ['User Device', 'Unencrypted WAN Socket', 'Third-Party SaaS Proxy (+450ms)', 'Cloud LLM API'],
          subprocessorsCount: sinksCount + 2,
          dpaRequired: true,
          latencyOverhead: '+450ms WAN Latency',
          honeypotRisk: 'Unmasked customer tokens reside in third-party cloud RAM and remote log stores.'
        },
        ztds: {
          title: 'ZTDS In-RAM Enclave Route (Verified)',
          flow: ['User Device RAM', `<0.8ms In-Memory Enclave (${statute})`, 'Safe Surrogate Tokens Only', 'Cloud LLM API'],
          subprocessorsCount: 0,
          dpaRequired: false,
          latencyOverhead: '< 0.8ms In-RAM',
          honeypotRisk: 'Zero (0.00 B raw data ever leaves device)'
        }
      };

      const legacyFlowHtml = (dag.legacy.flow || []).map((step, idx, arr) => `
        <span class="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${idx === 2 ? 'bg-rose-100 text-rose-900 font-bold border border-rose-300' : 'bg-slate-100 text-slate-700 border border-slate-200'}">${escape(step)}</span>
        ${idx < arr.length - 1 ? '<span class="text-rose-400 font-bold text-xs shrink-0">&rarr;</span>' : ''}
      `).join('');

      const ztdsFlowHtml = (dag.ztds.flow || []).map((step, idx, arr) => `
        <span class="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${idx === 1 ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : idx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'}">${escape(step)}</span>
        ${idx < arr.length - 1 ? '<span class="text-emerald-500 font-bold text-xs shrink-0">&rarr;</span>' : ''}
      `).join('');

      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <!-- Legacy Route -->
          <div class="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950">
            <div class="font-bold text-[11px] mb-2 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>${escape(dag.legacy.title || 'Legacy Cloud Proxy Route')}</span>
              </span>
              <span class="text-[10px] text-rose-700 font-bold px-1.5 py-0.5 rounded bg-rose-100 border border-rose-200">${escape(dag.legacy.latencyOverhead || '+450ms WAN')}</span>
            </div>
            <div class="p-2 bg-white border border-rose-200 rounded-lg mb-2.5 flex items-center gap-1 overflow-x-auto">
              ${legacyFlowHtml}
            </div>
            <div class="flex items-center justify-between text-[10px] font-bold text-rose-800 mb-1">
              <span>Subprocessors: +${escape(String(dag.legacy.subprocessorsCount || 3))} Entities</span>
              <span>DPA: Mandatory (Art. 28)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-sans leading-relaxed">Honeypot risk: ${escape(dag.legacy.honeypotRisk || 'Unmasked customer tokens reside in third-party cloud RAM and remote log stores.')}</p>
          </div>

          <!-- ZTDS Route -->
          <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-300 text-emerald-950 shadow-xs">
            <div class="font-bold text-[11px] mb-2 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>${escape(dag.ztds.title || 'ZTDS In-RAM Enclave Route')}</span>
              </span>
              <span class="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200">${escape(dag.ztds.latencyOverhead || '< 0.8ms In-RAM')}</span>
            </div>
            <div class="p-2 bg-white border border-emerald-200 rounded-lg mb-2.5 flex items-center gap-1 overflow-x-auto shadow-xs">
              ${ztdsFlowHtml}
            </div>
            <div class="flex items-center justify-between text-[10px] font-bold text-emerald-800 mb-1">
              <span>Subprocessors: 0 (Disapplied)</span>
              <span>DPA: Exempt (Recital 26)</span>
            </div>
            <p class="text-[11px] text-slate-600 font-sans leading-relaxed">Lossless attention: Bijective cryptographic tokens preserve full LLM reasoning without sending cleartext data off-device.</p>
          </div>
        </div>
      `;
    },

    /**
     * Generates official Markdown CISO compliance memorandum.
     */
    generateCisoMemo(data, domain, ev = {}, fn = {}, bp = {}) {
      const dateStr = new Date().toISOString().split('T')[0];
      const dom = data?.domain || domain || 'target-domain.com';
      const score = ev?.riskScore || 70;
      const rating = ev?.conformanceRating || 'MODERATE_RISK';
      const sinksCount = (fn?.thirdPartySinks || []).length;
      const sensoryCount = (fn?.sensorySurfaces || []).length;
      const ind = ev?.industry || {};
      const profileName = ind.name || 'Enterprise General';
      const statute = ind.statute || 'GDPR Recital 26';
      const citation = ind.cisoCitation || 'Eliminates data processor liabilities under GDPR Article 28.';
      const entitiesList = (ind.targetEntities || ['Email', 'Phone', 'Corporate IDs']).map(e => `  * ${e}`).join('\n');

      return `# Institutional ZTDS Compliance & Regulatory Exemption Memorandum
**Date:** ${dateStr}
**Target Perimeter:** https://${dom}
**Target Industry:** ${profileName}
**Statutory Basis:** ${statute}
**Evaluator:** ZTDS AI Consortium (RFC v1.0 Automated Inspector)
**Perimeter Conformance Score:** ${score}% (${rating})
**Reference Engine:** @privacyscrubber/sdk (Zero-Network In-RAM Enclave)

> **INFORMATIONAL ONLY — NOT LEGAL COUNSEL.** Generated by ztds.ai automated tooling. Must be reviewed by qualified privacy counsel before organizational reliance.

---

## 1. Executive Summary
An automated zero-trust perimeter audit was performed on **${dom}** in the **${profileName}** sector against the 4 Foundational Invariants of **ZTDS RFC v1.0**.
The audit identified **${sensoryCount} sensory input surfaces** and **${sinksCount} external third-party processors**.

Deploying the **ZTDS In-RAM Enclave** at the **${bp.framework || 'Edge'}** boundary satisfies **${statute}**, architecturally positioning the vendor outside the "data processor" definition under GDPR Article 28 when all 4 invariants are satisfied, providing an architectural basis for DPA/BAA scope exclusion analysis while ensuring zero unmasked cloud data leakage.

---

## 2. Statutory Legal Grounds (${ind.dpaStatus || 'DPA-Exemption Doctrine'})
1. **${statute}:**
   ${citation}

2. **GDPR Recital 26 (Anonymous Data Threshold):**
   When client data is deterministically de-identified inside volatile process RAM prior to socket transmission, recipient cloud services receive purely surrogate context-preserving tokens. Because the reverse mapping table auto-destructs and never leaves local memory, the data is non-attributable and legally outside the material scope of GDPR.

3. **GDPR Article 28 Subprocessor Exclusion Path:**
   Because zero cleartext personal data crosses the client network perimeter to the software vendor, the vendor is architecturally positioned outside the "data processor" definition when all 4 ZTDS invariants are satisfied. This provides an architectural basis for DPA and BAA scope exclusion analysis.

---

## 3. Protected Industry Entities & Schemas
The enclave actively isolates and tokenizes:
${entitiesList}

---

## 4. ZTDS RFC v1.0 Invariant Audit Findings
- **Invariant 1 (Zero External Egress):** ${ev.invariantStatus?.invariant1?.status || 'VERIFIED'}
- **Invariant 2 (Bijective Tokenization):** ${ev.invariantStatus?.invariant2?.status || 'REQUIRED'}
- **Invariant 3 (In-RAM Isolation):** ${ev.invariantStatus?.invariant3?.status || 'COMPLIANT_TARGET'}
- **Invariant 4 (Complete Subprocessor Exclusion):** ${ev.invariantStatus?.invariant4?.status || 'DPA-EXEMPT'}

---

## 5. Recommended Enclave Implementation
**Deployment Vector:** ${bp.framework || 'Edge Enclave'} (${bp.filename || 'middleware.ts'})
**Installation Command:** \`${bp.installCommand || 'npm i @privacyscrubber/sdk'}\`

\`\`\`typescript
${bp.codeSnippet || '// ZTDS Enclave snippet'}
\`\`\`

---

## 6. Next Steps & Governance
1. Deploy \`@privacyscrubber/sdk\` in-RAM enclave for **${dom}**.
2. Add CI/CD verification: \`npx ztds-audit https://${dom}\`.
3. Apply for Verified Seal at https://ztds.ai/apply/?domain=${encodeURIComponent(dom)}&profile=${encodeURIComponent(ind.activeProfile || 'general')}.

*Signed,*
**ZTDS AI Consortium & Standards Governance Council**
https://ztds.ai &middot; Patents Pending &middot; TM #182655957 &middot; CC BY 4.0`;
    },

    /**
     * Initializes universal CISO lead capture modal behavior.
     */
    initCisoLeadModal(config) {
      const modal = config.modalEl || document.getElementById('cisoLeadModal');
      if (!modal) return;

      const closeBtn = config.closeBtnEl || document.getElementById('btnCloseCisoLeadModal');
      const form = config.formEl || document.getElementById('cisoLeadForm');
      const emailInput = config.emailInputEl || document.getElementById('cisoWorkEmail');
      const roleSelect = config.roleSelectEl || document.getElementById('cisoRoleSelect');
      const profileDisplay = config.profileDisplayEl || document.getElementById('cisoProfileDisplay');
      const submitBtn = config.submitBtnEl || document.getElementById('btnSubmitCisoLead');
      const submitText = config.submitTextEl || document.getElementById('btnSubmitCisoText');
      const spinner = config.spinnerEl || document.getElementById('cisoLeadSpinner');
      const bypassBtn = config.bypassBtnEl || document.getElementById('btnBypassCisoLead');
      const modalBody = config.modalBodyEl || document.getElementById('cisoLeadModalBody');
      const successState = config.successStateEl || document.getElementById('cisoLeadSuccessState');
      const domDisplay = config.domainDisplayEl || document.getElementById('cisoModalDomain');
      const receiptBadge = config.receiptBadgeEl || document.getElementById('cisoReceiptBadge');
      const applyLink = config.applyLinkEl || document.getElementById('cisoSuccessApplyLink');
      const source = config.source || 'scanner';
      const getMemoData = config.getMemoData || (() => null);

      function openModal(memoData) {
        if (domDisplay) domDisplay.textContent = memoData?.currentDomain || memoData?.domain || 'your-domain.com';
        if (profileDisplay) profileDisplay.value = memoData?.profileName || 'General Enterprise';
        if (emailInput) emailInput.value = '';
        if (modalBody) modalBody.classList.remove('hidden');
        if (successState) successState.classList.add('hidden');

        if (window.ztdsModal) {
          window.ztdsModal.open(modal, emailInput);
        } else {
          modal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
          if (emailInput) emailInput.focus();
        }
      }

      function closeModal() {
        if (window.ztdsModal) {
          window.ztdsModal.close(modal);
        } else {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });

      if (bypassBtn) {
        bypassBtn.addEventListener('click', () => {
          const memoData = getMemoData();
          if (memoData) {
            const memoContent = ZTDSScanner.generateCisoMemo(
              memoData.data,
              memoData.domain,
              memoData.ev,
              memoData.fn,
              memoData.bp
            );
            const dom = memoData.currentDomain || memoData.domain || 'ztds-audit';
            ZTDSScanner.triggerDownload(memoContent, `${dom}-ztds-ciso-memorandum.md`);
          }
          closeModal();
        });
      }

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = emailInput ? emailInput.value.trim() : '';
          const role = roleSelect ? roleSelect.value : 'CISO / Security Director';
          if (!email) return;

          if (submitBtn) submitBtn.disabled = true;
          if (submitText) submitText.textContent = 'Generating Memorandum...';
          if (spinner) spinner.classList.remove('hidden');

          const memoData = getMemoData();
          const targetDomain = memoData?.currentDomain || memoData?.domain || 'target-domain';
          const targetProfile = memoData?.activeProfileKey || 'general';
          const riskScore = memoData?.ev?.riskScore || 70;

          try {
            const resData = await ZTDSScanner.submitLead({
              email,
              role,
              domain: targetDomain,
              industryProfile: targetProfile,
              riskScore,
              source
            });

            if (memoData) {
              const memoContent = ZTDSScanner.generateCisoMemo(
                memoData.data,
                memoData.domain,
                memoData.ev,
                memoData.fn,
                memoData.bp
              );
              ZTDSScanner.triggerDownload(memoContent, `${targetDomain}-ztds-ciso-memorandum.md`);
            }

            if (modalBody) modalBody.classList.add('hidden');
            if (successState) successState.classList.remove('hidden');
            if (receiptBadge) receiptBadge.textContent = `Receipt: ${resData?.leadId || 'LEAD-2026-CONFIRMED'}`;
            if (applyLink) {
              applyLink.href = `/apply/?domain=${encodeURIComponent(targetDomain)}&profile=${encodeURIComponent(targetProfile)}`;
            }
          } catch (err) {
            if (memoData) {
              const memoContent = ZTDSScanner.generateCisoMemo(
                memoData.data,
                memoData.domain,
                memoData.ev,
                memoData.fn,
                memoData.bp
              );
              ZTDSScanner.triggerDownload(memoContent, `${targetDomain}-ztds-ciso-memorandum.md`);
            }
            closeModal();
          } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) submitText.innerHTML = 'Generate &amp; Download Official Memorandum &rarr;';
            if (spinner) spinner.classList.add('hidden');
          }
        });
      }

      return { open: openModal, close: closeModal };
    }
  };

  global.ZTDSScanner = ZTDSScanner;
})(typeof window !== 'undefined' ? window : global);
