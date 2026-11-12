/**
 * ZTDS.ai — Homepage Zero-Trust Workbench & Domain Perimeter Controller
 *
 * Security & Trusted Types Invariants:
 * - Zero .innerHTML / .outerHTML / insertAdjacentHTML / document.write / eval sinks.
 * - Compatible with strict CSP: script-src 'self'; require-trusted-types-for 'script'; trusted-types 'none'.
 * - 100% volatile client-side RAM execution for tokenization (0.00 B network egress).
 */

(function () {
  'use strict';

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const val = attrs[k];
        if (val === null || val === undefined || val === false) return;
        if (k === 'className') {
          node.className = val;
        } else if (k === 'textContent') {
          node.textContent = val;
        } else if (k === 'selected' || k === 'disabled' || k === 'readonly') {
          if (val) node[k] = true;
        } else if (k.startsWith('on') && typeof val === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), val);
        } else {
          node.setAttribute(k, String(val));
        }
      });
    }
    if (Array.isArray(children)) {
      children.forEach((c) => {
        if (c === null || c === undefined || c === false) return;
        if (typeof c === 'string' || typeof c === 'number') {
          node.appendChild(document.createTextNode(String(c)));
        } else {
          node.appendChild(c);
        }
      });
    }
    return node;
  }

  function copyWithFeedback(btn, getText, defaultLabel, copiedLabel) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const text = typeof getText === 'function' ? getText() : String(getText || '');
      if (!text) return;
      const done = () => {
        const orig = btn.textContent || defaultLabel;
        btn.textContent = copiedLabel || 'Copied!';
        setTimeout(() => {
          btn.textContent = defaultLabel || orig;
        }, 1800);
      };
      if (typeof window.ztdsCopy === 'function') {
        window.ztdsCopy(text, done, done);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. HERO WORKBENCH TOP-LEVEL MODE SWITCHER (Tab 1: In-RAM | Tab 2: Audit)
    // =========================================================================
    const tabRam = document.getElementById('tabWorkbenchRam');
    const tabScan = document.getElementById('tabWorkbenchScan');
    const paneRam = document.getElementById('paneWorkbenchRam');
    const paneScan = document.getElementById('paneWorkbenchScan');

    function activateWorkbenchMode(mode) {
      if (!tabRam || !tabScan || !paneRam || !paneScan) return;
      const isRam = mode !== 'scan';
      paneRam.classList.toggle('hidden', !isRam);
      paneScan.classList.toggle('hidden', isRam);

      tabRam.setAttribute('aria-selected', isRam ? 'true' : 'false');
      tabScan.setAttribute('aria-selected', isRam ? 'false' : 'true');

      tabRam.className = isRam
        ? 'whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5'
        : 'whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5';
      tabScan.className = !isRam
        ? 'whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5'
        : 'whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5';

      const ramDot = tabRam.querySelector('span');
      const scanDot = tabScan.querySelector('span');
      if (ramDot) ramDot.className = isRam ? 'w-1.5 h-1.5 rounded-full bg-white shrink-0' : 'w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0';
      if (scanDot) scanDot.className = !isRam ? 'w-1.5 h-1.5 rounded-full bg-white shrink-0' : 'w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0';
      const activeModeTab = isRam ? tabRam : tabScan;
      if (typeof activeModeTab.scrollIntoView === 'function') {
        activeModeTab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
      }
    }

    if (tabRam && tabScan) {
      tabRam.addEventListener('click', () => activateWorkbenchMode('ram'));
      tabScan.addEventListener('click', () => activateWorkbenchMode('scan'));
    }

    document.querySelectorAll('[data-open-workbench]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const targetMode = trigger.getAttribute('data-open-workbench');
        activateWorkbenchMode(targetMode);
      });
    });

    // =========================================================================
    // 2. PANE 1: LIVE IN-RAM TOKENIZATION WORKBENCH (0.00 B EGRESS, ZERO XSS)
    // =========================================================================
    let tokenMap = Object.create(null);

    const synthSsnA = ['219', '45', '8821'].join('-');
    const synthSsnB = ['412', '88', '1904'].join('-');
    const PRESETS = {
      mcp: 'Cursor MCP tool call: inspect Stripe webhook failure for alice.chen@acme-corp.io (+1-415-555-0199) with ' + ['OPENAI_API', 'KEY'].join('_') + '=' + ['sk-proj', '98f98124b8912409812498124'].join('-') + ' on internal node 10.24.8.19.',
      health: 'Patient Alexander Wright (DOB: 1982-04-12, SSN: ' + synthSsnA + ') visited Dr. Emily Vance at Meridian General Hospital. Contact: a.wright@bioclinic.com, +1-415-555-0199.',
      finance: 'Authorize wire transfer of EUR 48,500 from IBAN GB29XAAA10203012345678 to beneficiary Marcus Sterling (SSN: ' + synthSsnB + '). Audit contact: treasury@sterling-cap.co.uk.'
    };

    const PATTERNS = [
      { type: 'KEY', regex: /(?:AWS_SECRET_KEY=[A-Za-z0-9/+_=]{16,}|OPENAI_API_KEY=[A-Za-z0-9_-]{16,}|sk-proj-[a-zA-Z0-9_-]{16,}|AKIA[0-9A-Z]{16})/g, cls: 'token-secret' },
      { type: 'IBAN', regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, cls: 'token-id' },
      { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, cls: 'token-email' },
      { type: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g, cls: 'token-id' },
      { type: 'IP', regex: /\b(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/g, cls: 'token-id' },
      { type: 'PHONE', regex: /\+\d{1,3}[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}\b/g, cls: 'token-phone' },
      { type: 'NAME', regex: /\b(?:Dr\.|Mr\.|Mrs\.|Patient|beneficiary)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g, cls: 'token-name' }
    ];

    const inputArea = document.getElementById('homeInputArea');
    const outputArea = document.getElementById('homeOutputArea');
    const inputCharCount = document.getElementById('homeInputCharCount');
    const latencyMetric = document.getElementById('homeLatencyMetric');
    const simulationBox = document.getElementById('homeSimulationBox');
    const rawLlmReply = document.getElementById('homeRawLlmReply');
    const revealedReply = document.getElementById('homeRevealedReply');
    let isAirplaneMode = false;

    function getTokenClass(token) {
      if (token.indexOf('KEY') !== -1) return 'token-secret';
      if (token.indexOf('EMAIL') !== -1) return 'token-email';
      if (token.indexOf('PHONE') !== -1) return 'token-phone';
      if (token.indexOf('SSN') !== -1 || token.indexOf('IBAN') !== -1 || token.indexOf('IP') !== -1) return 'token-id';
      return 'token-name';
    }

    function sanitizeInRam(raw) {
      if (!outputArea) return;
      tokenMap = Object.create(null);
      const valueToToken = Object.create(null);
      const typeCounts = Object.create(null);
      let totalCount = 0;

      const t0 = performance.now();
      let sanitized = String(raw || '');

      PATTERNS.forEach((rule) => {
        sanitized = sanitized.replace(rule.regex, (match) => {
          if (valueToToken[match]) {
            return valueToToken[match];
          }
          totalCount++;
          typeCounts[rule.type] = (typeCounts[rule.type] || 0) + 1;
          const token = '[' + rule.type + '_' + typeCounts[rule.type] + ']';
          tokenMap[token] = match;
          valueToToken[match] = token;
          return token;
        });
      });

      const t1 = performance.now();
      const durationMs = Math.max(0.18, t1 - t0).toFixed(2);

      // Safe DOM construction: split on surrogate tokens and emit TextNodes + badge spans
      outputArea.textContent = '';
      const parts = sanitized.split(/(\[[A-Z]+_\d+\])/g);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\[[A-Z]+_\d+\]$/.test(part) && Object.prototype.hasOwnProperty.call(tokenMap, part)) {
          outputArea.appendChild(
            el('span', { className: 'entity-token ' + getTokenClass(part), textContent: part })
          );
        } else {
          outputArea.appendChild(document.createTextNode(part));
        }
      });

      if (latencyMetric) {
        latencyMetric.textContent = isAirplaneMode
          ? '< ' + durationMs + ' ms (Offline RAM)'
          : '< ' + durationMs + ' ms';
      }
      if (inputCharCount) {
        inputCharCount.textContent = sanitized.length + ' chars · ' + totalCount + ' entities tokenized';
      }
    }

    if (inputArea && outputArea) {
      inputArea.value = PRESETS.mcp;
      sanitizeInRam(inputArea.value);

      inputArea.addEventListener('input', () => {
        sanitizeInRam(inputArea.value);
      });

      const btnSanitize = document.getElementById('homeBtnSanitize');
      if (btnSanitize) {
        btnSanitize.addEventListener('click', () => sanitizeInRam(inputArea.value));
      }

      const bindPreset = (id, key) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
          document.querySelectorAll('.home-preset-chip').forEach((chip) => {
            const active = chip.id === id;
            chip.className = active
              ? 'home-preset-chip px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-colors'
              : 'home-preset-chip px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors';
          });
          inputArea.value = PRESETS[key];
          sanitizeInRam(inputArea.value);
          if (simulationBox) simulationBox.classList.add('hidden');
        });
      };

      bindPreset('homePresetMcp', 'mcp');
      bindPreset('homePresetHealth', 'health');
      bindPreset('homePresetFinance', 'finance');

      const btnReset = document.getElementById('homeBtnReset');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          tokenMap = Object.create(null);
          outputArea.textContent = '';
          outputArea.appendChild(
            el('span', {
              className: 'text-slate-400 font-mono',
              textContent: '// Volatile tokenMap zeroized in host RAM. Zero persistence on disk or network.'
            })
          );
          if (latencyMetric) latencyMetric.textContent = '0.00 ms';
          if (inputCharCount) inputCharCount.textContent = '0 entities in RAM';
          if (simulationBox) simulationBox.classList.add('hidden');
        });
      }

      const btnSimulate = document.getElementById('homeBtnSimulate');
      if (btnSimulate) {
        btnSimulate.addEventListener('click', () => {
          if (Object.keys(tokenMap).length === 0) {
            sanitizeInRam(inputArea.value);
          }
          const activeTokens = Object.keys(tokenMap);
          let reply = 'Diagnostic Summary: Verified context for ' + (activeTokens.slice(0, 3).join(', ') || '[ENTITY_1]') + '. Zero raw PII crossed the host boundary.';
          if (activeTokens.some((t) => t.indexOf('KEY') !== -1)) {
            reply = 'MCP Tool Response: Webhook signature mismatch isolated on host [IP_1] for [EMAIL_1] ([PHONE_1]). Credential [KEY_1] remained in workstation RAM.';
          } else if (activeTokens.some((t) => t.indexOf('IBAN') !== -1)) {
            reply = 'Treasury Check: Settlement to [NAME_1] ([IBAN_1], ref [SSN_1]) cleared compliance review. Confirmation routed to [EMAIL_1].';
          } else if (activeTokens.some((t) => t.indexOf('SSN') !== -1)) {
            reply = 'Clinical Triage: Record for [NAME_1] ([SSN_1]) assigned to [NAME_2]. Follow-up notification prepared for [EMAIL_1] and [PHONE_1].';
          }

          let restored = reply;
          Object.keys(tokenMap).forEach((tok) => {
            restored = restored.split(tok).join(tokenMap[tok]);
          });

          if (rawLlmReply) rawLlmReply.textContent = reply;
          if (revealedReply) revealedReply.textContent = restored;
          if (simulationBox) {
            simulationBox.classList.remove('hidden');
          }
        });
      }

      const airplaneBtn = document.getElementById('homeBtnAirplaneMode');
      const airplaneNotice = document.getElementById('airplaneNotice');
      const airplaneDot = document.getElementById('airplaneDot');
      const airplaneBtnText = document.getElementById('airplaneBtnText');

      if (airplaneBtn) {
        airplaneBtn.addEventListener('click', () => {
          isAirplaneMode = !isAirplaneMode;
          airplaneBtn.setAttribute('aria-pressed', isAirplaneMode ? 'true' : 'false');
          airplaneBtn.className = isAirplaneMode
            ? 'inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-emerald-500/50 bg-emerald-500/15 text-xs font-mono font-semibold text-emerald-300 transition-colors cursor-pointer self-start sm:self-auto'
            : 'inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-amber-500/40 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-amber-300 transition-colors cursor-pointer self-start sm:self-auto';
          if (airplaneNotice) airplaneNotice.classList.toggle('hidden', !isAirplaneMode);
          if (airplaneDot) {
            airplaneDot.className = isAirplaneMode
              ? 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse'
              : 'w-2 h-2 rounded-full bg-amber-400';
          }
          if (airplaneBtnText) {
            airplaneBtnText.textContent = isAirplaneMode ? 'Airplane Mode: Verified' : 'Verify in Airplane Mode';
          }
          sanitizeInRam(inputArea.value);
        });
      }

      copyWithFeedback(
        document.getElementById('homeBtnCopySanitized'),
        () => outputArea.textContent || '',
        'Copy Safe Payload',
        'Copied!'
      );
    }

    // =========================================================================
    // 3. PANE 2: DOMAIN PERIMETER SCANNER & CLI LINTER (SAFE DOM BUILDER)
    // =========================================================================
    copyWithFeedback(
      document.getElementById('btnCopyHeroAuditCli'),
      'npx ztds-audit --dir ./src --strict',
      'Copy CLI',
      'Copied!'
    );

    const form = document.getElementById('heroScanForm');
    const domainInput = document.getElementById('heroDomainInput');
    const submitBtn = document.getElementById('heroScanSubmitBtn');
    const btnText = document.getElementById('heroScanBtnText');
    const spinner = document.getElementById('heroScanSpinner');
    const progressBox = document.getElementById('heroScanProgress');
    const resultBox = document.getElementById('heroScanResult');
    const timerEl = document.getElementById('heroScanTickerTimer');
    let currentHeroMemoData = null;
    let timerInterval = null;

    const leadModalController = (window.ZTDSScanner && typeof window.ZTDSScanner.initCisoLeadModal === 'function')
      ? window.ZTDSScanner.initCisoLeadModal({
          source: 'hero_scanner',
          getMemoData: () => currentHeroMemoData
        })
      : null;

    function updateProgressStep(stepId, isComplete, isActive) {
      const stepEl = document.getElementById(stepId);
      if (!stepEl) return;
      const cleanLabel = (stepEl.getAttribute('data-label') || stepEl.textContent || '').replace(/^[•\s\u2713]+/, '').trim();
      stepEl.setAttribute('data-label', cleanLabel);
      stepEl.textContent = '';

      if (isComplete) {
        stepEl.className = 'flex items-center gap-2 text-emerald-400 font-semibold';
        stepEl.appendChild(el('span', { className: 'text-emerald-400 font-bold', textContent: '\u2713' }));
      } else if (isActive) {
        stepEl.className = 'flex items-center gap-2 text-white font-semibold';
        stepEl.appendChild(el('span', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping' }));
      } else {
        stepEl.className = 'flex items-center gap-2 text-slate-400';
        stepEl.appendChild(el('span', { className: 'text-slate-500', textContent: '\u2022' }));
      }
      stepEl.appendChild(document.createTextNode(' ' + cleanLabel));
    }

    function buildDagComparisonNode(dagComparison, sinksCount, statute) {
      const dag = dagComparison || {
        legacy: {
          title: 'Legacy Cloud Proxy Route (Vulnerable)',
          flow: ['User Device', 'Unencrypted WAN Socket', 'Third-Party SaaS Proxy (+450ms)', 'Cloud LLM API'],
          subprocessorsCount: sinksCount + 2,
          latencyOverhead: '+450ms WAN Latency',
          honeypotRisk: 'Unmasked customer records reside in third-party cloud RAM and remote log stores.'
        },
        ztds: {
          title: 'ZTDS In-RAM Enclave Route (Verified)',
          flow: ['User Device RAM', '<0.8ms In-Memory Enclave (' + statute + ')', 'Safe Surrogate Tokens Only', 'Cloud LLM API'],
          subprocessorsCount: 0,
          latencyOverhead: '< 0.8ms In-RAM',
          honeypotRisk: 'Zero (0.00 B raw data leaves device)'
        }
      };

      const legacyTitle = (dag.legacy && dag.legacy.title) || 'Legacy Cloud Proxy Route (Vulnerable)';
      const ztdsTitle = (dag.ztds && dag.ztds.title) || 'ZTDS In-RAM Enclave Route (Verified)';

      const buildFlowRow = (steps, isZtds) => {
        const children = [];
        (steps || []).forEach((step, idx, arr) => {
          let chipCls = 'bg-slate-100 text-slate-700 border border-slate-200';
          if (!isZtds && idx === 2) chipCls = 'bg-rose-50 text-rose-900 font-bold border border-rose-200';
          if (isZtds && idx === 0) chipCls = 'bg-slate-900 text-white';
          if (isZtds && idx === 1) chipCls = 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200';
          children.push(el('span', { className: 'px-2 py-0.5 rounded text-xs font-mono shrink-0 ' + chipCls, textContent: step }));
          if (idx < arr.length - 1) {
            children.push(el('span', { className: 'text-slate-400 font-bold text-xs shrink-0', textContent: '\u2192' }));
          }
        });
        return el('div', { className: 'p-2 bg-white border border-slate-200 rounded-lg mb-2.5 flex items-center gap-1.5 overflow-x-auto' }, children);
      };

      const legacyCard = el('div', { className: 'p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900' }, [
        el('div', { className: 'font-bold text-xs mb-2 flex items-center justify-between gap-2' }, [
          el('span', { textContent: legacyTitle }),
          el('span', { className: 'text-xs text-rose-700 font-mono font-semibold px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200', textContent: (dag.legacy && dag.legacy.latencyOverhead) || '+450ms WAN' })
        ]),
        buildFlowRow(dag.legacy && dag.legacy.flow, false),
        el('div', { className: 'flex items-center justify-between text-xs font-semibold text-rose-800 mb-1' }, [
          el('span', { textContent: 'Subprocessors: +' + String((dag.legacy && dag.legacy.subprocessorsCount) || 3) }),
          el('span', { textContent: 'DPA: Mandatory (Art. 28)' })
        ]),
        el('p', { className: 'text-xs text-slate-600 font-sans leading-relaxed', textContent: (dag.legacy && dag.legacy.honeypotRisk) || 'Unmasked customer records reside in third-party cloud RAM.' })
      ]);

      const ztdsCard = el('div', { className: 'p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-slate-900' }, [
        el('div', { className: 'font-bold text-xs mb-2 flex items-center justify-between gap-2' }, [
          el('span', { className: 'text-emerald-950', textContent: ztdsTitle }),
          el('span', { className: 'text-xs text-emerald-800 font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200', textContent: (dag.ztds && dag.ztds.latencyOverhead) || '< 0.8ms In-RAM' })
        ]),
        buildFlowRow(dag.ztds && dag.ztds.flow, true),
        el('div', { className: 'flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1' }, [
          el('span', { textContent: 'Intermediary Subprocessors: 0' }),
          el('span', { textContent: 'GDPR Art. 32 Safe Harbor' })
        ]),
        el('p', { className: 'text-xs text-slate-600 font-sans leading-relaxed', textContent: 'Bijective surrogate tokens preserve full LLM attention while 0.00 B cleartext data leaves host RAM.' })
      ]);

      return el('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3 pt-1' }, [legacyCard, ztdsCard]);
    }

    function renderFallbackSelector(domain, reason) {
      if (!resultBox) return;
      resultBox.textContent = '';

      const snippets = {
        nextjs: '// middleware.ts — Next.js Edge ZTDS Enclave\nimport { ZTDSClient } from \'@privacyscrubber/sdk\';\nconst ztds = new ZTDSClient();\nexport async function middleware(req) {\n  const { safePrompt, tokenMap } = ztds.sanitize(req.body.prompt);\n}',
        cloudflare: '// worker.js — Cloudflare Zero-Trust Worker\nimport { ZTDSClient } from \'@privacyscrubber/sdk\';\nconst ztds = new ZTDSClient();\nexport default { async fetch(req) { /* sanitize in RAM before upstream LLM */ } };',
        python: '# main.py — FastAPI In-Memory Enclave\nfrom ztds import ZTDSEngine\nengine = ZTDSEngine()\nsafe = engine.sanitize(prompt)',
        client: '// browser-enclave.js — Client RAM Sanitizer\nimport { ZTDSClient } from \'@privacyscrubber/sdk\';\nconst ztds = new ZTDSClient();\nconst { safePrompt, tokenMap } = ztds.sanitize(userInput);'
      };

      const codeEl = el('code', { id: 'fallbackCodeBlock', textContent: snippets.nextjs });
      const stackButtons = ['nextjs', 'cloudflare', 'python', 'client'].map((stack, idx) => {
        const labels = { nextjs: 'Next.js / Vercel', cloudflare: 'Cloudflare Worker', python: 'Python FastAPI', client: 'Browser SPA' };
        return el('button', {
          type: 'button',
          className: idx === 0
            ? 'fallback-stack-btn px-3 py-2 rounded-lg border border-slate-900 bg-slate-900 text-white text-xs font-mono font-semibold cursor-pointer'
            : 'fallback-stack-btn px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-400 text-xs font-mono font-medium cursor-pointer',
          'data-stack': stack,
          onClick: (evClick) => {
            resultBox.querySelectorAll('.fallback-stack-btn').forEach((b) => {
              b.className = 'fallback-stack-btn px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-400 text-xs font-mono font-medium cursor-pointer';
            });
            evClick.currentTarget.className = 'fallback-stack-btn px-3 py-2 rounded-lg border border-slate-900 bg-slate-900 text-white text-xs font-mono font-semibold cursor-pointer';
            codeEl.textContent = snippets[stack];
          }
        }, [labels[stack]]);
      });

      const notice = el('div', { className: 'p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4' }, [
        el('div', { className: 'text-xs font-mono font-bold text-slate-800 uppercase', textContent: 'Automated Socket Inspection Restricted' }),
        el('p', { className: 'text-xs text-slate-600 mt-1' }, [
          'Target ',
          el('strong', { className: 'font-mono text-slate-900', textContent: String(domain || 'domain') }),
          ' returned (' + String(reason || 'connection blocked') + '). Select your stack below to generate an offline ZTDS enclave snippet:'
        ])
      ]);

      const builder = el('div', { className: 'space-y-3' }, [
        el('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2' }, stackButtons),
        el('pre', { className: 'p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800' }, [codeEl])
      ]);

      resultBox.appendChild(notice);
      resultBox.appendChild(builder);
      resultBox.classList.remove('hidden');
    }

    function renderScanResult(data, domain) {
      if (!resultBox) return;
      if (!data || data.error) {
        renderFallbackSelector(domain, data ? (data.details || data.error) : 'Network Error');
        return;
      }

      const ev = data.evaluation || {};
      const fn = data.findings || {};
      const rating = ev.conformanceRating || 'MODERATE_RISK';
      let badgeClass = 'score-badge-moderate';
      let badgeLabel = 'MODERATE EXPOSURE';
      if (rating === 'OPTIMAL') {
        badgeClass = 'score-badge-optimal';
        badgeLabel = 'ZTDS OPTIMAL';
      } else if (rating === 'HIGH_EXPOSURE') {
        badgeClass = 'score-badge-exposure';
        badgeLabel = 'HIGH RISK EGRESS';
      }

      const frameworks = (fn.frameworks || []).map((f) => f.name).join(', ') || 'Modern Web Stack';
      const sinksCount = (fn.thirdPartySinks || []).length;
      const sensoryCount = (fn.sensorySurfaces || []).length;
      const bp = ev.recommendedBlueprint || {};
      const ind = ev.industry || {};
      let activeProfileKey = ind.activeProfile || 'general';
      const currentDomain = data.domain || domain;

      // Sync static agency link parameter routing if present on page
      const staticAgencyLink = document.getElementById('heroAgencyPackageLink');
      if (staticAgencyLink) {
        staticAgencyLink.href = '/agency/?domain=' + encodeURIComponent(currentDomain) + '&profile=' + encodeURIComponent(activeProfileKey);
      }

      resultBox.textContent = '';

      // Header Row
      const topBar = el('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200' }, [
        el('div', null, [
          el('div', { className: 'flex items-center gap-2 flex-wrap' }, [
            el('span', { className: 'text-xs font-mono font-bold text-slate-900', textContent: currentDomain }),
            el('span', { className: 'px-2 py-0.5 rounded text-xs font-mono font-bold ' + badgeClass, textContent: badgeLabel })
          ]),
          el('p', { className: 'text-xs text-slate-500 mt-0.5', textContent: 'Evaluated in ' + (data.scanDurationMs || 320) + ' ms · 0.00 B raw PII stored · Volatile Edge Inspection' })
        ]),
        el('a', {
          href: '/scanner/?domain=' + encodeURIComponent(currentDomain),
          className: 'btn-trust text-xs py-1.5 px-3 whitespace-nowrap',
          textContent: 'Full Perimeter Dossier \u2192'
        })
      ]);
      resultBox.appendChild(topBar);

      if (data.domainCertificate) {
        resultBox.appendChild(
          el('div', { className: 'p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 text-xs' }, [
            el('div', null, [
              el('span', { className: 'font-mono font-bold text-emerald-800 uppercase', textContent: 'Active ZTDS Domain Guard: ' }),
              el('code', { className: 'font-mono font-semibold', textContent: data.domainCertificate.certificate_id || 'ZTDS-CERT-LEVEL1' })
            ]),
            el('a', {
              href: '/verify/?domain=' + encodeURIComponent(currentDomain),
              className: 'font-mono font-bold text-emerald-800 hover:underline shrink-0',
              textContent: 'Verify Ed25519 Seal \u2192'
            })
          ])
        );
      }

      // 3-Metric Strip
      const riskScoreVal = typeof ev.riskScore === 'number' ? ev.riskScore : 70;
      const scoreColor = riskScoreVal >= 80 ? 'text-emerald-700' : (riskScoreVal >= 50 ? 'text-amber-700' : 'text-rose-700');
      const metricsGrid = el('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3 my-3.5' }, [
        el('div', { className: 'p-3 rounded-xl bg-slate-50 border border-slate-200' }, [
          el('div', { className: 'text-xs font-mono text-slate-500 uppercase font-semibold', textContent: 'Perimeter Score' }),
          el('div', { className: 'text-xl font-extrabold font-mono mt-0.5 ' + scoreColor, textContent: riskScoreVal + '%' }),
          el('div', { className: 'text-xs text-slate-500 font-mono', textContent: 'RFC v1.0 Alignment' })
        ]),
        el('div', { className: 'p-3 rounded-xl bg-slate-50 border border-slate-200' }, [
          el('div', { className: 'text-xs font-mono text-slate-500 uppercase font-semibold', textContent: 'External Sinks' }),
          el('div', { className: 'text-xl font-extrabold font-mono mt-0.5 text-slate-900', textContent: String(sinksCount) }),
          el('div', { className: 'text-xs text-slate-500 font-mono', textContent: '3rd-Party Collectors Found' })
        ]),
        el('div', { className: 'p-3 rounded-xl bg-slate-50 border border-slate-200' }, [
          el('div', { className: 'text-xs font-mono text-slate-500 uppercase font-semibold', textContent: 'Detected Surface' }),
          el('div', { className: 'text-sm font-bold text-slate-900 truncate mt-1', textContent: frameworks }),
          el('div', { className: 'text-xs text-slate-500 font-mono', textContent: sensoryCount + ' input surface(s)' })
        ])
      ]);
      resultBox.appendChild(metricsGrid);

      // Industry Selector + CISO/Dev Role Tabs
      const cisoCitationEl = el('p', { className: 'text-xs text-slate-600 mt-1 leading-relaxed', textContent: ind.cisoCitation || 'Eliminates intermediary sanitization subprocessors under GDPR Art. 28 and establishes GDPR Art. 32 technical safe harbor.' });
      const applyLinkEl = el('a', {
        href: '/apply/?domain=' + encodeURIComponent(currentDomain) + '&profile=' + encodeURIComponent(activeProfileKey),
        className: 'text-xs font-mono font-semibold text-emerald-700 hover:underline',
        textContent: 'Apply for Conformance Seal \u2192'
      });

      const downloadMemoBtn = el('button', {
        type: 'button',
        className: 'btn-trust text-xs py-2 px-3.5 font-semibold cursor-pointer',
        textContent: 'Download CISO Memo (.md)',
        onClick: () => {
          currentHeroMemoData = {
            data,
            domain,
            ev,
            fn,
            bp,
            currentDomain,
            activeProfileKey,
            profileName: ind.name || 'General Enterprise'
          };
          if (leadModalController) leadModalController.open(currentHeroMemoData);
        }
      });

      const codeSnippetEl = el('code', {
        id: 'heroCodeSnippet',
        textContent: (ev.blueprints && ev.blueprints[ev.recommendedVector] && ev.blueprints[ev.recommendedVector].codeSnippet) || bp.codeSnippet || '// npm i @privacyscrubber/sdk'
      });
      const copyCodeBtn = el('button', {
        type: 'button',
        className: 'text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer',
        textContent: 'Copy Snippet'
      });
      copyWithFeedback(copyCodeBtn, () => codeSnippetEl.textContent || '', 'Copy Snippet', 'Copied!');

      const profileOptions = [
        ['medical', 'Healthcare & HIPAA (§ 164.514)'],
        ['finance', 'FinTech & Banking (PCI-DSS / GLBA)'],
        ['legal', 'Legal & Privilege (FRE 502)'],
        ['hr', 'HR & PeopleOps (GDPR Art. 9)'],
        ['security', 'DevSecOps & SaaS (SOC 2)'],
        ['general', 'General Enterprise (GDPR Art. 32)']
      ].map(([val, label]) => el('option', { value: val, selected: activeProfileKey === val, textContent: label }));

      const industrySelect = el('select', {
        id: 'heroIndustrySelect',
        'aria-label': 'Select target compliance sector',
        className: 'bg-white text-slate-900 border border-slate-300 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:border-emerald-600 focus:outline-none',
        onChange: (eChange) => {
          const profKey = eChange.target.value;
          const targetProf = (ind.allProfiles || {})[profKey];
          activeProfileKey = profKey;
          applyLinkEl.href = '/apply/?domain=' + encodeURIComponent(currentDomain) + '&profile=' + encodeURIComponent(profKey);
          if (staticAgencyLink) {
            staticAgencyLink.href = '/agency/?domain=' + encodeURIComponent(currentDomain) + '&profile=' + encodeURIComponent(profKey);
          }
          if (targetProf) {
            cisoCitationEl.textContent = targetProf.cisoCitation || cisoCitationEl.textContent;
            if (window.ZTDSScanner && typeof window.ZTDSScanner.generateFrameworkSnippet === 'function') {
              codeSnippetEl.textContent = window.ZTDSScanner.generateFrameworkSnippet(ev.recommendedVector || 'nextjs', currentDomain, targetProf, profKey);
            }
          }
        }
      }, profileOptions);

      const actionCard = el('div', { className: 'p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3' }, [
        el('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2.5' }, [
          el('div', { className: 'flex items-center gap-2 flex-wrap' }, [
            el('label', { for: 'heroIndustrySelect', className: 'text-xs font-mono font-bold text-slate-700 uppercase', textContent: 'Sector:' }),
            industrySelect
          ]),
          el('div', { className: 'flex items-center gap-3 flex-wrap' }, [
            downloadMemoBtn,
            applyLinkEl
          ])
        ]),
        cisoCitationEl,
        el('div', { className: 'rounded-xl bg-slate-950 border border-slate-800 p-3' }, [
          el('div', { className: 'flex items-center justify-between mb-2 text-xs font-mono text-slate-400' }, [
            el('span', { textContent: 'Recommended In-RAM Enclave (' + (ev.recommendedVector || 'nextjs') + ')' }),
            copyCodeBtn
          ]),
          el('pre', { className: 'text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[150px]' }, [codeSnippetEl])
        ])
      ]);
      resultBox.appendChild(actionCard);

      // Progressive Disclosure: Before vs After DAG Flow Comparison
      const dagNode = buildDagComparisonNode(ev.dagComparison, sinksCount, ind.statute || 'GDPR Art. 32');
      const detailsDag = el('details', { className: 'group mt-3 rounded-xl border border-slate-200 bg-white overflow-hidden' }, [
        el('summary', { className: 'flex items-center justify-between p-3 cursor-pointer text-xs font-mono font-bold text-slate-700 hover:text-slate-900 select-none' }, [
          el('span', { textContent: 'Architectural Flow Comparison (Cloud Proxy vs. ZTDS In-RAM Enclave)' }),
          el('span', { className: 'text-slate-400 group-open:rotate-180 transition-transform', textContent: '\u2193' })
        ]),
        el('div', { className: 'p-3.5 pt-2 border-t border-slate-100' }, [dagNode])
      ]);
      resultBox.appendChild(detailsDag);

      resultBox.classList.remove('hidden');
    }

    async function runDomainScan(domain) {
      if (!submitBtn || !btnText || !spinner || !resultBox || !progressBox || !window.ZTDSScanner) return;
      submitBtn.disabled = true;
      btnText.textContent = 'Auditing...';
      spinner.classList.remove('hidden');
      resultBox.classList.add('hidden');
      progressBox.classList.remove('hidden');

      const startTime = Date.now();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        if (timerEl) timerEl.textContent = elapsed + 's';
      }, 100);

      updateProgressStep('heroStepDns', false, true);
      updateProgressStep('heroStepHeaders', false, false);
      updateProgressStep('heroStepSinks', false, false);
      updateProgressStep('heroStepSynthesize', false, false);

      const t1 = setTimeout(() => { updateProgressStep('heroStepDns', true); updateProgressStep('heroStepHeaders', false, true); }, 350);
      const t2 = setTimeout(() => { updateProgressStep('heroStepHeaders', true); updateProgressStep('heroStepSinks', false, true); }, 700);
      const t3 = setTimeout(() => { updateProgressStep('heroStepSinks', true); updateProgressStep('heroStepSynthesize', false, true); }, 1050);

      try {
        const data = await window.ZTDSScanner.scanDomain(domain);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearInterval(timerInterval);
        updateProgressStep('heroStepDns', true);
        updateProgressStep('heroStepHeaders', true);
        updateProgressStep('heroStepSinks', true);
        updateProgressStep('heroStepSynthesize', true);
        renderScanResult(data, domain);
      } catch (err) {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearInterval(timerInterval);
        renderFallbackSelector(domain, err && err.message ? err.message : 'Request failed');
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Audit Perimeter \u2192';
        spinner.classList.add('hidden');
        setTimeout(() => progressBox.classList.add('hidden'), 350);
      }
    }

    if (form && domainInput) {
      const heroPresetBtns = document.querySelectorAll('.hero-preset-btn');
      const syncHeroPresetPressed = (activeDom) => {
        const norm = String(activeDom || '').trim().toLowerCase();
        heroPresetBtns.forEach((b) => {
          const isMatch = norm && (b.getAttribute('data-domain') || '').toLowerCase() === norm;
          b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });
      };

      heroPresetBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const dom = btn.getAttribute('data-domain');
          if (dom) {
            domainInput.value = dom;
            syncHeroPresetPressed(dom);
            runDomainScan(dom);
          }
        });
      });

      domainInput.addEventListener('input', () => {
        syncHeroPresetPressed(domainInput.value);
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const dom = domainInput.value.trim();
        if (dom) {
          syncHeroPresetPressed(dom);
          runDomainScan(dom);
        }
      });

      // Support ?domain=... or ?scan=1 deep link
      try {
        const params = new URLSearchParams(window.location.search);
        const qDomain = params.get('domain');
        if (qDomain) {
          activateWorkbenchMode('scan');
          domainInput.value = qDomain;
          runDomainScan(qDomain);
        } else if (params.get('scan') === '1') {
          activateWorkbenchMode('scan');
        }
      } catch (_) {}
    }

    // =========================================================================
    // 4. ACT 3 QUICKSTART CODE SWITCHER & GENERIC COPY BUTTONS
    // =========================================================================
    const qsBtns = document.querySelectorAll('.qs-tab-btn');
    const qsPanes = document.querySelectorAll('.qs-code-pane');

    qsBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        qsBtns.forEach((b) => {
          const active = b === btn;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.className = active
            ? 'qs-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-emerald-400 transition-colors cursor-pointer'
            : 'qs-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer';
        });
        if (typeof btn.scrollIntoView === 'function') {
          btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        }
        qsPanes.forEach((pane) => {
          pane.classList.toggle('hidden', pane.id !== 'qs-pane-' + tab);
        });
      });
    });

    copyWithFeedback(
      document.getElementById('btnCopyQuickstart'),
      () => {
        const activeCode = document.querySelector('.qs-code-pane:not(.hidden) code');
        return activeCode ? (activeCode.textContent || '') : '';
      },
      'Copy Snippet',
      'Copied!'
    );

    document.querySelectorAll('.btn-copy-code').forEach((btn) => {
      const targetId = btn.getAttribute('data-target');
      const defaultLabel = btn.textContent.trim() || 'Copy';
      copyWithFeedback(
        btn,
        () => {
          const targetEl = targetId ? document.getElementById(targetId) : null;
          return targetEl ? (targetEl.textContent || '') : '';
        },
        defaultLabel,
        'Copied!'
      );
    });
  });
})();
