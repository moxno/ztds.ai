(function () {
  'use strict';

(function() {
    try {
      const p = new URLSearchParams(window.location.search);
      const entityEl = document.getElementById('orderCustomerEntity');
      const signHeaderEl = document.getElementById('orderCustomerSignHeader');
      const orderIdEl = document.getElementById('orderIdField');
      const orderIdP2El = document.getElementById('orderIdHeaderPage2');
      const dateEl = document.getElementById('orderDateField');

      const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      if (dateEl && dateEl.textContent.indexOf('[Date') === 0) {
        dateEl.textContent = todayStr;
      }

      const org = (p.get('org') || p.get('company') || '').trim();
      if (org) {
        if (entityEl) entityEl.textContent = org;
        if (signHeaderEl) signHeaderEl.textContent = 'FOR CUSTOMER: ' + org.toUpperCase();
        const code = org.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'CORP';
        const generatedId = 'ZTDS-2026-OF-' + code;
        if (orderIdEl) orderIdEl.textContent = generatedId;
        if (orderIdP2El) orderIdP2El.textContent = 'ORDER ID: ' + generatedId;
      }

      if (entityEl && signHeaderEl) {
        entityEl.addEventListener('input', function() {
          const val = (entityEl.textContent || '').trim();
          if (val && val.indexOf('[') !== 0) {
            signHeaderEl.textContent = 'FOR CUSTOMER: ' + val.toUpperCase();
          }
        });
      }

      const fieldMap = {
        jurisdiction: 'orderCustomerJurisdiction',
        taxid: 'orderCustomerTaxId',
        address: 'orderCustomerAddress',
        contact: 'orderCustomerContact',
        ap: 'orderCustomerApEmail'
      };
      Object.keys(fieldMap).forEach(function(k) {
        const val = (p.get(k) || '').trim();
        const el = document.getElementById(fieldMap[k]);
        if (val && el) el.textContent = val;
      });

      const tierCards = document.querySelectorAll('.order-tier-card');
      const summaryTitle = document.getElementById('orderSummaryTierTitle');
      const summaryScope = document.getElementById('orderSummaryTierScope');

      function selectTier(tierCode) {
        const upper = String(tierCode || 'B').toUpperCase();
        tierCards.forEach(function(card) {
          const isMatch = card.getAttribute('data-tier') === upper;
          const check = card.querySelector('.order-tier-check');
          if (isMatch) {
            card.className = 'order-tier-card p-3 rounded-lg border-2 border-emerald-600 bg-emerald-50/40 flex items-start gap-3 relative cursor-pointer transition-colors';
            if (check) {
              check.className = 'order-tier-check w-4 h-4 rounded border-2 border-emerald-600 mt-0.5 shrink-0 flex items-center justify-center font-bold text-xs text-emerald-800';
              check.textContent = '\u2713';
            }
            if (summaryTitle) summaryTitle.textContent = card.getAttribute('data-title');
            if (summaryScope) summaryScope.textContent = card.getAttribute('data-scope');
          } else {
            card.className = 'order-tier-card p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3 cursor-pointer transition-colors';
            if (check) {
              check.className = 'order-tier-check w-4 h-4 rounded border border-slate-400 mt-0.5 shrink-0 flex items-center justify-center font-bold text-xs text-emerald-800';
              check.textContent = '';
            }
          }
        });
      }

      tierCards.forEach(function(card) {
        card.addEventListener('click', function() {
          const t = card.getAttribute('data-tier');
          selectTier(t);
          if (window.history && window.history.replaceState && t) {
            const np = new URLSearchParams(window.location.search);
            np.set('tier', t);
            window.history.replaceState(null, '', window.location.pathname + '?' + np.toString() + window.location.hash);
          }
        });
        card.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const t = card.getAttribute('data-tier');
            selectTier(t);
            if (window.history && window.history.replaceState && t) {
              const np = new URLSearchParams(window.location.search);
              np.set('tier', t);
              window.history.replaceState(null, '', window.location.pathname + '?' + np.toString() + window.location.hash);
            }
          }
        });
      });

      const paramTier = (p.get('tier') || '').trim();
      if (paramTier && ['A', 'B', 'C'].indexOf(paramTier.toUpperCase()) !== -1) {
        selectTier(paramTier);
      }
    } catch (e) {}
  })();
})();
