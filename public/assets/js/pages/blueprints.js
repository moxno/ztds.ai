(function () {
  'use strict';

(function() {
      const filterBtns = document.querySelectorAll('.bp-filter-btn');
      const cards = document.querySelectorAll('.bp-card');

      function applyFilter(cat, updateHistory) {
        const normalized = cat || 'ALL';
        filterBtns.forEach((b) => {
          const active = (b.getAttribute('data-cat') || 'ALL') === normalized;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.className = active
            ? 'bp-filter-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white cursor-pointer transition-colors'
            : 'bp-filter-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors';
          if (active && updateHistory && typeof b.scrollIntoView === 'function') {
            b.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }
        });
        cards.forEach((card) => {
          if (normalized === 'ALL' || card.getAttribute('data-cat') === normalized) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
        if (updateHistory && window.history && window.history.replaceState) {
          const params = new URLSearchParams(window.location.search);
          if (normalized !== 'ALL') params.set('cat', normalized);
          else { params.delete('cat'); params.delete('category'); }
          const qs = params.toString();
          window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
        }
      }

      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          applyFilter(btn.getAttribute('data-cat') || 'ALL', true);
        });
      });

      const initParams = new URLSearchParams(window.location.search);
      const initCat = initParams.get('cat') || initParams.get('category');
      if (initCat) {
        applyFilter(initCat, false);
      }

      document.querySelectorAll('.bp-copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const pre = btn.parentElement.querySelector('pre');
          if (!pre) return;
          navigator.clipboard.writeText(pre.textContent || '').then(() => {
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = orig; }, 1600);
          });
        });
      });
    })();
})();
