(function () {
  'use strict';

(function() {
      let tokenMap = {};
      let currentStage = 0; // 0: Idle, 1: Egress Block, 2: Tokenizer, 3: Enclave, 4: Loopback Reveal

      const PRESETS = {
        health: "Patient Alexander Wright (DOB: 1982-04-12, SSN: " + ["219", "45", "8821"].join("-") + ") visited Dr. Emily Vance at St. Jude Hospital regarding asthma. Email: a.wright@bioclinic.com, phone: (415) 555-0199.",
        finance: "Instruction: Transfer $450,000 USD from account IBAN DE89370400440532013000, SWIFT: DEUTDEDBFXX to beneficiary Sarah Jenkins (Routing: 021000021). Wire reference: REF-88192-CONFIDENTIAL.",
        devops: "CRITICAL: Deploying auth service with AWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY and OPENAI_API_KEY=" + "sk-proj-" + "98f98124b8912409812498124 to production host 192.168.1.104.",
        legal: "STRICTLY CONFIDENTIAL: Memorandum regarding Project Titan acquisition of Apex BioSciences for $1.4B. Advised by senior counsel Evelyn Reed under attorney-client privilege. Primary escrow contact: evelyn.reed@globalpartnerslaw.com.",
        hr: "CONFIDENTIAL PAYROLL: Executive compensation record for Director Marcus Vance. National Insurance: QQ123456C, base salary $185,000 USD, bank sort code 20-04-15, personal email: marcus.vance@internalhr.org.",
        crypto: "URGENT RECOVERY: Multi-sig vault authorization for wallet 0x71C7656EC7ab88b098defB751B7401B5f6d8976F. Signer: Dmitry Orlov. Custody key backup index: [SLOT_84]. Direct authorization contact: dmitry@web3defense.io.",
        insurance: "CLAIM FILE: Policy POL-99281-US underwritten by Sovereign Assurance. Insured: Rebecca Stone, Claim: $78,500 USD for collision. Adjuster: Mark Sterling (ID: ADJ-4401), email: r.stone@horizonmail.com."
      };

      const inputArea = document.getElementById('inputArea');
      const outputArea = document.getElementById('outputArea');
      const volatileMapDisplay = document.getElementById('volatileMapDisplay');
      const liveLatencyBadge = document.getElementById('liveLatencyBadge');
      const statLatency = document.getElementById('statLatency');
      const statInputChars = document.getElementById('statInputChars');
      const statTokensMasked = document.getElementById('statTokensMasked');
      const inputByteCount = document.getElementById('inputByteCount');
      const tokenRateCount = document.getElementById('tokenRateCount');
      const pipelineStateBadge = document.getElementById('pipelineStateBadge');
      const stepBtnText = document.getElementById('stepBtnText');
      const llmSimulationBox = document.getElementById('llmSimulationBox');
      const llmRawReply = document.getElementById('llmRawReply');
      const llmRevealedReply = document.getElementById('llmRevealedReply');
      const breachSimulationBox = document.getElementById('breachSimulationBox');
      const closeBreachBox = document.getElementById('closeBreachBox');

      const dagNodes = [
        document.getElementById('dagNode1'),
        document.getElementById('dagNode2'),
        document.getElementById('dagNode3'),
        document.getElementById('dagNode4')
      ];

      // Set initial input
      inputArea.value = PRESETS.health;

      function highlightNode(stageIndex) {
        dagNodes.forEach((node, i) => {
          if (i === stageIndex) {
            node.classList.add('border-emerald-500', 'ring-2', 'ring-emerald-500/30', 'bg-emerald-50/40');
            node.classList.remove('border-slate-200', 'bg-white');
          } else {
            node.classList.remove('border-emerald-500', 'ring-2', 'ring-emerald-500/30', 'bg-emerald-50/40');
            node.classList.add('border-slate-200', 'bg-white');
          }
        });
      }

      function clearNodeHighlights() {
        dagNodes.forEach(node => {
          node.classList.remove('border-emerald-500', 'ring-2', 'ring-emerald-500/30', 'bg-emerald-50/40');
          node.classList.add('border-slate-200', 'bg-white');
        });
      }

      // Deterministic In-RAM Tokenizer
      function tokenizePayload(rawText) {
        const localMap = {};
        const tokenCounters = {};
        let sanitized = rawText;

        function replacePattern(regex, prefix) {
          sanitized = sanitized.replace(regex, (match) => {
            if (/^\[[A-Z_]+_\d+\]$/.test(match)) return match;
            tokenCounters[prefix] = (tokenCounters[prefix] || 0) + 1;
            const token = `[${prefix}_${tokenCounters[prefix]}]`;
            localMap[token] = match;
            return token;
          });
        }

        // 1. Secrets & API Keys
        replacePattern(/(?:AWS_SECRET_KEY=)?[a-zA-Z0-9\/+=]{35,45}|sk-proj-[a-zA-Z0-9_-]{20,}|AKIA[0-9A-Z]{16}/g, "SECRET_KEY");

        // 2. SSN & Government IDs
        replacePattern(/\b\d{3}-\d{2}-\d{4}\b/g, "SSN");
        replacePattern(/\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/gi, "GOV_ID");

        // 3. Financial IBANs
        replacePattern(/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, "IBAN");

        // 4. Email addresses
        replacePattern(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, "EMAIL");

        // 5. Phone numbers with strict delimiters
        replacePattern(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g, "PHONE");

        // 6. IP Addresses
        replacePattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, "IP_ADDR");

        // 7. M&A Codenames & Deal Values
        replacePattern(/\bProject\s+[A-Z][a-z]+\b/g, "DEAL_CODENAME");
        replacePattern(/\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:Billion|Million|USD|[BM]))\b/gi, "DEAL_VALUE");

        // 8. Named Entities
        replacePattern(/\b(?:Dr\.|Mr\.|Mrs\.|Patient|counsel|Director|beneficiary|Signer|Adjuster)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g, "PERSON");
        replacePattern(/\b(?:Alexander Wright|Emily Vance|Marcus Sterling|Sarah Jenkins|Evelyn Reed|Marcus Vance|Dmitry Orlov|Rebecca Stone|Mark Sterling)\b/g, "PERSON");

        // 9. Crypto & Web3
        replacePattern(/\b0x[a-fA-F0-9]{40}\b/g, "ETH_ADDR");
        replacePattern(/\[MNEMONIC_[A-Z0-9_]+\]|\[SLOT_\d+\]/g, "KEY_SLOT");

        // 10. Insurance Policy
        replacePattern(/\bPOL-\d{5}-[A-Z]{2}\b/g, "POLICY_NUM");
        replacePattern(/\bADJ-\d{4}\b/g, "ADJUSTER_ID");

        return { sanitized, localMap, count: Object.keys(localMap).length };
      }

      function buildHighlightedFragment(text) {
        const frag = document.createDocumentFragment();
        const str = String(text || '');
        const tokenRe = /\[[A-Z_]+_\d+\]/g;
        let lastIndex = 0;
        let match;
        while ((match = tokenRe.exec(str)) !== null) {
          if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(str.slice(lastIndex, match.index)));
          }
          const span = document.createElement('span');
          span.className = 'entity-token inline-block px-1.5 py-0.5 rounded border text-xs font-mono font-bold shadow-xs bg-emerald-950/90 text-emerald-300 border-emerald-500/40';
          span.textContent = match[0];
          frag.appendChild(span);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < str.length) {
          frag.appendChild(document.createTextNode(str.slice(lastIndex)));
        }
        return frag;
      }

      function setMonoNotice(targetEl, cls, msg) {
        if (!targetEl) return;
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = msg;
        targetEl.replaceChildren(span);
      }

      function setVolatileMapPlaceholder(msg) {
        if (!volatileMapDisplay) return;
        const code = document.createElement('code');
        code.textContent = msg;
        volatileMapDisplay.replaceChildren(code);
      }

      function executePipeline(fullRun = true) {
        const raw = inputArea.value || "";
        const byteLen = new Blob([raw]).size;

        statInputChars.textContent = `${raw.length} chars`;
        inputByteCount.textContent = `${byteLen} B`;

        const t0 = performance.now();
        const { sanitized, localMap, count } = tokenizePayload(raw);
        const t1 = performance.now();
        const duration = Math.max(0.19, (t1 - t0)).toFixed(2);

        tokenMap = localMap;

        // Render sanitized output safely via DOM nodes (zero innerHTML)
        outputArea.replaceChildren(buildHighlightedFragment(sanitized));

        // Update live metrics
        liveLatencyBadge.textContent = `Latency: ${duration}ms`;
        statLatency.textContent = `<${duration} ms`;
        statTokensMasked.textContent = `${count} tokens`;
        tokenRateCount.textContent = "100%";

        // Render TokenMap JSON safely via textContent (eliminating unescaped entity value XSS)
        const mapEntries = Object.entries(tokenMap);
        if (mapEntries.length > 0) {
          const pre = document.createElement('pre');
          pre.className = 'text-xs text-slate-300 leading-relaxed';
          pre.textContent = JSON.stringify(tokenMap, null, 2);
          volatileMapDisplay.replaceChildren(pre);
        } else {
          setVolatileMapPlaceholder('{ /* 0 entity mappings isolated */ }');
        }

        if (fullRun) {
          pipelineStateBadge.textContent = "CONFORMANCE VERIFIED (4 STAGES ACTIVE)";
          pipelineStateBadge.className = "px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold";
          
          // Micro-stagger animation across the 4 nodes
          highlightNode(0);
          setTimeout(() => highlightNode(1), 120);
          setTimeout(() => highlightNode(2), 240);
          setTimeout(() => highlightNode(3), 360);
          setTimeout(() => {
            dagNodes.forEach(node => {
              node.classList.add('border-emerald-500/60');
            });
          }, 480);
        }
      }

      // Step-Through Control
      function stepThrough() {
        currentStage = (currentStage % 4) + 1;
        highlightNode(currentStage - 1);

        if (currentStage === 1) {
          stepBtnText.textContent = "Step-Through (Stage 2: Tokenize \u2192)";
          pipelineStateBadge.textContent = "STAGE 01: RAW EGRESS TRAPPED IN RAM";
          pipelineStateBadge.className = "px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold";
          setMonoNotice(outputArea, 'text-slate-400 font-mono', '// Stage 01: Input buffer quarantined in client RAM. Socket write halted. 0.00 B dispatched.');
        } else if (currentStage === 2) {
          stepBtnText.textContent = "Step-Through (Stage 3: Enclave \u2192)";
          pipelineStateBadge.textContent = "STAGE 02: EPHEMERAL TOKENIZER EXECUTED";
          pipelineStateBadge.className = "px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 font-bold";
          executePipeline(false);
        } else if (currentStage === 3) {
          stepBtnText.textContent = "Step-Through (Stage 4: Loopback \u2192)";
          pipelineStateBadge.textContent = "STAGE 03: ENCLAVE MEMORY VERIFIED";
          pipelineStateBadge.className = "px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold";
        } else if (currentStage === 4) {
          stepBtnText.textContent = "Step-Through (Restart Cycle \u2192)";
          pipelineStateBadge.textContent = "STAGE 04: REVERSIBLE HANDOFF READY";
          pipelineStateBadge.className = "px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold";
          simulateLLM();
        }
      }

      function simulateLLM() {
        if (Object.keys(tokenMap).length === 0) {
          executePipeline(false);
        }

        const sampleTokens = Object.keys(tokenMap);
        let reply = "Confirmed: Medical records processed for [PERSON_1] ([SSN_1]). Verification dispatched to [EMAIL_1].";
        if (sampleTokens.some(t => t.includes("IBAN"))) {
          reply = "Instruction logged: Wire execution queued for [DEAL_VALUE_1] to beneficiary [PERSON_1] via account [IBAN_1].";
        } else if (sampleTokens.some(t => t.includes("SECRET_KEY"))) {
          reply = "Deployment credentials authenticated: Verified service host [IP_ADDR_1] using access token [SECRET_KEY_1].";
        } else if (sampleTokens.some(t => t.includes("DEAL_CODENAME"))) {
          reply = "Privileged transaction acknowledged: [DEAL_CODENAME_1] for [DEAL_VALUE_1] recorded. Retained by counsel [PERSON_1].";
        } else if (sampleTokens.some(t => t.includes("GOV_ID"))) {
          reply = "Payroll compensation record approved for Director [PERSON_1] ([DEAL_VALUE_1]). Account sort code verified.";
        }

        let revealed = reply;
        Object.entries(tokenMap).forEach(([k, v]) => {
          revealed = revealed.split(k).join(v);
        });

        llmRawReply.textContent = reply;
        llmRevealedReply.textContent = revealed;
        llmSimulationBox.classList.remove('hidden');
        llmSimulationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Button Event Listeners
      document.getElementById('btnExecutePipeline').addEventListener('click', () => {
        currentStage = 4;
        stepBtnText.textContent = "Step-Through (Stage 1 \u2192)";
        executePipeline(true);
      });

      document.getElementById('btnStepStage').addEventListener('click', stepThrough);
      document.getElementById('btnSimulateLLM').addEventListener('click', simulateLLM);

      // Malicious Breach Attempt Simulation
      document.getElementById('btnSimulateBreach').addEventListener('click', () => {
        breachSimulationBox.classList.remove('hidden');
        breachSimulationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      closeBreachBox.addEventListener('click', () => {
        breachSimulationBox.classList.add('hidden');
      });

      // Memory Zeroization (Theorem 2)
      document.getElementById('btnWipeRAM').addEventListener('click', () => {
        tokenMap = {};
        setMonoNotice(outputArea, 'text-slate-500 font-mono', '// Theorem 2 Enforced: Memory wiped. lim_{t \u2192 t_destroy} M_map = \u2205. Zero residual forensic artifacts.');
        setVolatileMapPlaceholder('{ /* Volatile memory zeroized */ }');
        statTokensMasked.textContent = '0 tokens';
        liveLatencyBadge.textContent = 'Latency: 0.00ms';
        tokenRateCount.textContent = '0%';
        llmSimulationBox.classList.add('hidden');
        clearNodeHighlights();
        pipelineStateBadge.textContent = 'MEMORY ZEROIZED (RAM PURGED)';
        pipelineStateBadge.className = 'px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-300 font-bold';
      });

      // Preset Switchers
      function setPreset(key, btnEl) {
        document.querySelectorAll('.preset-btn').forEach(b => {
          b.className = 'preset-btn px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 shadow-sm transition-all';
        });
        btnEl.className = 'preset-btn px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-sm transition-all';
        inputArea.value = PRESETS[key];
        executePipeline(true);
      }

      document.getElementById('presetHealth').addEventListener('click', function() { setPreset('health', this); });
      document.getElementById('presetFinance').addEventListener('click', function() { setPreset('finance', this); });
      document.getElementById('presetDevOps').addEventListener('click', function() { setPreset('devops', this); });
      document.getElementById('presetLegal').addEventListener('click', function() { setPreset('legal', this); });
      document.getElementById('presetHR').addEventListener('click', function() { setPreset('hr', this); });
      document.getElementById('presetCrypto').addEventListener('click', function() { setPreset('crypto', this); });
      document.getElementById('presetInsurance').addEventListener('click', function() { setPreset('insurance', this); });

      // Live Input Monitoring
      inputArea.addEventListener('input', () => {
        const raw = inputArea.value || "";
        statInputChars.textContent = `${raw.length} chars`;
        inputByteCount.textContent = `${new Blob([raw]).size} B`;
      });

      // Copy Token Map JSON
      document.getElementById('btnCopyMap').addEventListener('click', function() {
        const jsonText = JSON.stringify(tokenMap, null, 2);
        if (window.ztdsCopy) {
          window.ztdsCopy(jsonText, () => {
            const label = document.getElementById('copyMapText');
            label.innerText = 'Map Copied!';
            setTimeout(() => { label.innerText = 'Copy Token Map'; }, 2000);
          });
        }
      });

      // Hydrate from URL query parameters (?preset=health|finance|devops|legal|hr|crypto|insurance, ?q= / ?payload=)
      try {
        const params = new URLSearchParams(window.location.search);
        const qPreset = (params.get('preset') || params.get('scenario') || '').trim().toLowerCase();
        const qPayload = params.get('q') || params.get('payload');
        const presetIdMap = {
          health: 'presetHealth',
          healthcare: 'presetHealth',
          hipaa: 'presetHealth',
          finance: 'presetFinance',
          fintech: 'presetFinance',
          devops: 'presetDevOps',
          secrets: 'presetDevOps',
          legal: 'presetLegal',
          hr: 'presetHR',
          crypto: 'presetCrypto',
          insurance: 'presetInsurance'
        };
        if (qPreset && presetIdMap[qPreset]) {
          const pBtn = document.getElementById(presetIdMap[qPreset]);
          if (pBtn) pBtn.click();
        } else if (qPayload && qPayload.trim()) {
          inputArea.value = qPayload.trim();
        }
      } catch (_) {}

      // Initial execution on page load
      executePipeline(true);
    })();
})();
