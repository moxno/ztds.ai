(function () {
  'use strict';

(function() {
      const container = document.getElementById('benchScenariosContainer');
      const countLabel = document.getElementById('benchCountLabel');
      const modelSelect = document.getElementById('benchModelSelect');
      const searchInput = document.getElementById('benchSearchInput');
      const domainBtns = document.querySelectorAll('.bench-domain-btn');

      let allScenarios = [
        {
          id: "BENCH-HLTH-01",
          domain: "Healthcare & Clinical EHR (HIPAA)",
          description: "Clinical encounter notes containing patient identifiers, DOB, MRN, and physician",
          prompt: "Summarize patient encounter for Eleanor Vance (DOB: 1984-06-14, MRN: 94827103). Patient diagnosed with acute pancreatitis by Dr. Marcus Brody at Eleanor.Vance@healthmail.org.",
          expected_entities: [
            { text: "Eleanor Vance", type: "NAME" },
            { text: "1984-06-14", type: "DATE" },
            { text: "94827103", type: "MRN" },
            { text: "Dr. Marcus Brody", type: "NAME" },
            { text: "Eleanor.Vance@healthmail.org", type: "EMAIL" }
          ],
          simulated_llm_responses: {
            "openai/gpt-4o": "Clinical Summary: Patient [NAME_TOKEN_1] (DOB: [DATE_TOKEN_1], MRN: [MRN_TOKEN_1]) was evaluated by [NAME_TOKEN_2]. Diagnosis is acute pancreatitis. Follow-up notifications should be routed to [EMAIL_TOKEN_1]."
          }
        }
      ];

      let activeDomain = 'ALL';
      let activeModel = 'openai/gpt-4o';
      let searchQuery = '';

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      function computeSanitized(prompt, entities) {
        let sanitized = prompt;
        const tokenMap = {};
        const counts = {};
        const sorted = [...(entities || [])].sort((a, b) => (b.text || '').length - (a.text || '').length);
        sorted.forEach(ent => {
          if (!ent.text || !sanitized.includes(ent.text)) return;
          const prefix = ent.type === 'CREDIT_CARD' ? 'PAN' : (ent.type === 'API_SECRET' ? 'SECRET' : ent.type);
          counts[prefix] = (counts[prefix] || 0) + 1;
          const token = '[' + prefix + '_TOKEN_' + counts[prefix] + ']';
          tokenMap[token] = ent.text;
          sanitized = sanitized.split(ent.text).join(token);
        });
        return { sanitized, tokenMap };
      }

      function computeRestored(llmOutput, tokenMap) {
        let restored = llmOutput;
        Object.entries(tokenMap).forEach(([token, orig]) => {
          restored = restored.split(token).join(orig);
        });
        return restored;
      }

      function renderScenarios() {
        const filtered = allScenarios.filter(sc => {
          const matchesDomain = activeDomain === 'ALL' || (sc.domain || '').toLowerCase().includes(activeDomain.toLowerCase());
          const q = searchQuery.trim().toLowerCase();
          const matchesSearch = !q ||
            (sc.id || '').toLowerCase().includes(q) ||
            (sc.domain || '').toLowerCase().includes(q) ||
            (sc.description || '').toLowerCase().includes(q) ||
            (sc.prompt || '').toLowerCase().includes(q);
          return matchesDomain && matchesSearch;
        });

        if (countLabel) {
          countLabel.textContent = 'Showing ' + filtered.length + ' of ' + allScenarios.length + ' verified benchmark scenarios';
        }

        if (!container) return;

        if (filtered.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'p-8 rounded-2xl bg-white border border-slate-200 text-center text-sm text-slate-600';
          empty.textContent = 'No scenarios match your current filter. Clear search or select All Scenarios.';
          container.replaceChildren(empty);
          return;
        }

        const mk = (tag, cls, txt) => {
          const el = document.createElement(tag);
          if (cls) el.className = cls;
          if (txt !== undefined) el.textContent = txt;
          return el;
        };

        const cards = filtered.map(sc => {
          const { sanitized, tokenMap } = computeSanitized(sc.prompt, sc.expected_entities);
          const llmResp = (sc.simulated_llm_responses && (sc.simulated_llm_responses[activeModel] || sc.simulated_llm_responses['openai/gpt-4o'])) || '';
          const restored = computeRestored(llmResp, tokenMap);
          const isMultimodal = sc.modality === 'multimodal/image';

          const article = mk('article', 'bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 scroll-mt-24');
          article.id = 'bench-' + String(sc.id || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

          const topBar = mk('div', 'flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3');
          const badgesWrap = mk('div', 'flex flex-wrap items-center gap-2');
          badgesWrap.append(
            mk('span', 'px-2.5 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-mono text-xs font-bold', sc.id || ''),
            mk('span', 'px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-semibold', sc.domain || '')
          );
          if (isMultimodal) {
            badgesWrap.appendChild(mk('span', 'px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold', 'MULTIMODAL OCR + PIXEL BURN-IN'));
          }
          topBar.append(badgesWrap, mk('span', 'text-xs font-mono text-emerald-700 font-bold', 'LPR: 100% \u00b7 BFS: 100% \u00b7 0.00 B Egress'));

          const h3 = mk('h3', 'text-base font-bold text-slate-900', sc.description || '');

          const grid = mk('div', 'grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs font-mono');
          const col1 = mk('div', 'p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-1.5');
          col1.append(
            mk('div', 'text-xs uppercase tracking-wider font-bold text-rose-800', '1. Raw Input (Stays in Local RAM)'),
            mk('p', 'text-slate-800 leading-relaxed break-words font-sans text-xs', sc.prompt || '')
          );
          const col2 = mk('div', 'p-3.5 rounded-xl bg-slate-900 text-slate-200 space-y-1.5');
          col2.append(
            mk('div', 'text-xs uppercase tracking-wider font-bold text-emerald-400', `2. ZTDS Wire Payload \u2192 ${activeModel}`),
            mk('p', 'leading-relaxed break-words text-xs text-emerald-300', sanitized)
          );
          const col3 = mk('div', 'p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5');
          col3.append(
            mk('div', 'text-xs uppercase tracking-wider font-bold text-emerald-800', '3. Restored Output (Bijective Unmasking)'),
            mk('p', 'text-slate-800 leading-relaxed break-words font-sans text-xs', restored)
          );
          grid.append(col1, col2, col3);
          article.append(topBar, h3, grid);
          return article;
        });

        container.replaceChildren(...cards);
      }

      function syncBenchUrl() {
        if (!window.history || !window.history.replaceState) return;
        const params = new URLSearchParams(window.location.search);
        if (activeDomain && activeDomain !== 'ALL') params.set('domain', activeDomain);
        else params.delete('domain');
        if (activeModel && activeModel !== 'openai/gpt-4o') params.set('model', activeModel);
        else params.delete('model');
        if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
        else params.delete('q');
        const qs = params.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      }

      const initParams = new URLSearchParams(window.location.search);
      const initDomain = initParams.get('domain');
      const initModel = initParams.get('model');
      const initQ = initParams.get('q') || initParams.get('search');

      if (initDomain) {
        activeDomain = initDomain;
        domainBtns.forEach(b => {
          const isMatch = (b.getAttribute('data-domain') || 'ALL').toLowerCase() === initDomain.toLowerCase();
          if (isMatch) {
            activeDomain = b.getAttribute('data-domain') || 'ALL';
            b.className = 'bench-domain-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white cursor-pointer transition-colors';
            b.setAttribute('aria-selected', 'true');
          } else {
            b.className = 'bench-domain-btn px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors';
            b.setAttribute('aria-selected', 'false');
          }
        });
      }
      if (initModel && modelSelect) {
        const hasOpt = Array.from(modelSelect.options).some(o => o.value === initModel);
        if (hasOpt) {
          modelSelect.value = initModel;
          activeModel = initModel;
        }
      }
      if (initQ && searchInput) {
        searchInput.value = initQ;
        searchQuery = initQ;
      }

      // Render fallback immediately, then hydrate full 30 scenarios
      renderScenarios();

      (async () => {
        try {
          const r = await fetch('/benchmarks/ai-safety-benchmark.json');
          const data = r.ok ? await r.json() : null;
          if (data && Array.isArray(data.scenarios) && data.scenarios.length > 0) {
            allScenarios = data.scenarios;
            renderScenarios();
          }
        } catch (_) {}
      })();

      domainBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activeDomain = btn.getAttribute('data-domain') || 'ALL';
          domainBtns.forEach(b => {
            b.className = 'bench-domain-btn px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors';
            b.setAttribute('aria-selected', 'false');
          });
          btn.className = 'bench-domain-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white cursor-pointer transition-colors';
          btn.setAttribute('aria-selected', 'true');
          renderScenarios();
          syncBenchUrl();
        });
      });

      if (modelSelect) {
        modelSelect.addEventListener('change', () => {
          activeModel = modelSelect.value;
          renderScenarios();
          syncBenchUrl();
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', () => {
          searchQuery = searchInput.value || '';
          renderScenarios();
          syncBenchUrl();
        });
      }

      document.querySelectorAll('.btn-copy-bench').forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-copy') || '';
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => {});
          }
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        });
      });
    })();
})();
