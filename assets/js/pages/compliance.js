(function () {
  'use strict';

(function () {
      var filterBtns = document.querySelectorAll('.reg-filter-btn');
      var cards = document.querySelectorAll('.reg-card');
      function applyRegionFilter(region, updateUrl) {
        filterBtns.forEach(function (b) {
          var isMatch = b.getAttribute('data-reg-filter') === region;
          b.className = isMatch
            ? 'reg-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 text-white font-semibold cursor-pointer transition-all'
            : 'reg-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-all';
        });
        cards.forEach(function (card) {
          if (region === 'all' || card.getAttribute('data-region') === region) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        if (updateUrl && history.replaceState) {
          var nextUrl = region === 'all' ? window.location.pathname : (window.location.pathname + '?region=' + encodeURIComponent(region));
          try { history.replaceState(null, '', nextUrl); } catch (_) {}
        }
      }
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var region = btn.getAttribute('data-reg-filter');
          applyRegionFilter(region, true);
        });
      });
      try {
        var compParams = new URLSearchParams(window.location.search);
        var initRegion = (compParams.get('region') || '').trim();
        if (initRegion) applyRegionFilter(initRegion, false);
      } catch (_) {}

      var copyBtns = document.querySelectorAll('.copy-clause-btn');
      copyBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var clause = btn.getAttribute('data-copy-clause');
          if (!clause || !navigator.clipboard) return;
          navigator.clipboard.writeText(clause).then(function () {
            var orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(function () {
              btn.textContent = orig;
            }, 1800);
          });
        });
      });

      var copyAllBtn = document.getElementById('copy-all-vsaq-btn');
      if (copyAllBtn) {
        copyAllBtn.addEventListener('click', function () {
          var matrixText = [
            'ZTDS RFC v1.0 — VENDOR RISK QUESTIONNAIRE RESPONSES (SIG Lite / CSA CAIQ / VSAQ)',
            '1. Data Egress & Storage (SIG Lite D.1.2 / CAIQ DSP-01): NO. 100% client-side volatile RAM execution. Zero payloads or mapping tables egress to vendor servers.',
            '2. Subprocessors (SIG Lite P.2.4 / CAIQ STA-09): NONE (0 Subprocessors — ZTDS Invariant 4). No third-party cloud or analytics in the data path.',
            '3. Key & Token Map Isolation (SIG Lite K.3.1 / CAIQ CEK-03): Ephemeral client volatile RAM only; zeroized on session close via resetSession(). Offline Ed25519 license verification.'
          ].join('\n\n');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(matrixText).then(function () {
              var orig = copyAllBtn.textContent;
              copyAllBtn.textContent = 'Copied Full Matrix!';
              setTimeout(function () {
                copyAllBtn.textContent = orig;
              }, 1800);
            });
          }
        });
      }
    })();
})();
