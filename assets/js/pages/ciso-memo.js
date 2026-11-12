(function () {
  'use strict';

(function() {
    try {
      const p = new URLSearchParams(window.location.search);
      const org = (p.get('org') || p.get('company') || '').trim();
      const domain = (p.get('domain') || '').trim();
      if (org || domain) {
        const toEl = document.getElementById('memoToRecipient');
        if (toEl) {
          toEl.textContent = 'Chief Information Security Officer · ';
          const span = document.createElement('span');
          span.className = 'text-emerald-800 font-bold';
          span.textContent = org || domain;
          toEl.appendChild(span);
        }
        const docIdEl = document.getElementById('memoDocId');
        if (docIdEl && domain) {
          docIdEl.textContent = `ZTDS-MEMO-${domain.toUpperCase().replace(/[^A-Z0-9]/g, '-')}`;
        }
      }
    } catch(e) {}
  })();
})();
