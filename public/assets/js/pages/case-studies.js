(function () {
  'use strict';

(function() {
      const searchInput = document.getElementById('caseStudySearch');
      const filterBtns = document.querySelectorAll('.cs-filter-btn');
      const cards = document.querySelectorAll('.cs-card');
      const resultsCount = document.getElementById('csResultsCount');
      const btnClear = document.getElementById('btnClearCsFilters');
      let activeIndustry = 'all';

      function updateView(syncHistory) {
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        let visible = 0;

        cards.forEach((card) => {
          const ind = card.getAttribute('data-industry') || '';
          const matchInd = activeIndustry === 'all' || ind === activeIndustry;
          const matchQuery = !q || (card.textContent || '').toLowerCase().includes(q);
          if (matchInd && matchQuery) {
            card.classList.remove('hidden');
            visible++;
          } else {
            card.classList.add('hidden');
          }
        });

        filterBtns.forEach((b) => {
          const isCurrent = (b.getAttribute('data-filter') || 'all') === activeIndustry;
          b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
          b.className = isCurrent
            ? 'cs-filter-btn whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white shadow-sm cursor-pointer transition-all'
            : 'cs-filter-btn whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-all';
          if (isCurrent && syncHistory && typeof b.scrollIntoView === 'function') {
            b.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }
        });

        if (resultsCount) {
          resultsCount.textContent = visible === cards.length && !q && activeIndustry === 'all'
            ? `Showing all ${cards.length} enterprise case studies`
            : `Showing ${visible} of ${cards.length} enterprise case studies`;
        }
        if (btnClear) {
          btnClear.classList.toggle('hidden', !q && activeIndustry === 'all');
        }

        if (syncHistory && window.history && window.history.replaceState) {
          const params = new URLSearchParams(window.location.search);
          if (activeIndustry !== 'all') params.set('industry', activeIndustry);
          else { params.delete('industry'); params.delete('filter'); }
          if (q) params.set('q', q);
          else params.delete('q');
          const qs = params.toString();
          window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
        }
      }

      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          activeIndustry = btn.getAttribute('data-filter') || 'all';
          updateView(true);
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', () => updateView(true));
      }

      if (btnClear) {
        btnClear.addEventListener('click', () => {
          activeIndustry = 'all';
          if (searchInput) searchInput.value = '';
          updateView(true);
        });
      }

      const initParams = new URLSearchParams(window.location.search);
      const initInd = initParams.get('industry') || initParams.get('filter');
      const initQ = initParams.get('q') || initParams.get('search');
      if (initInd) activeIndustry = initInd;
      if (initQ && searchInput) searchInput.value = initQ;
      if (initInd || initQ) updateView(false);
    })();
})();
