(function () {
  'use strict';

(function() {
      // Universal Clipboard Helper
      window.ztdsCopy = function(text, onSuccess) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
        } else {
          fallbackCopy(text, onSuccess);
        }
      };

      function fallbackCopy(text, onSuccess) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          if (onSuccess) onSuccess();
        } catch (e) {}
        document.body.removeChild(ta);
      }

      // Search & Filter Controller
      const searchInput = document.getElementById('fellowSearch');
      const filterBtns = document.querySelectorAll('#fellowFilterTabs .filter-btn');
      const cards = document.querySelectorAll('#fellowsGrid > article[data-track]');
      const countAll = document.getElementById('countAllFellows');

      if (countAll) {
        countAll.textContent = cards.length;
      }

      function escapeXml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      }

      function generateBadgeSvg(label) {
        const rawLabel = String(label || 'FELLOW').trim().toUpperCase();
        const cleanLabel = escapeXml(rawLabel);
        const wLeft = 58;
        const charWidth = 6.8;
        const wRight = Math.max(64, Math.round(rawLabel.length * charWidth + 16));
        const totalWidth = wLeft + wRight;
        const textXRight = wLeft + Math.round(wRight / 2);

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="fellowBadgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#fellowBadgeClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="#0f172a"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="#10b981" letter-spacing="0.6">${cleanLabel}</text>
  </g>
</svg>`.trim();
      }

      const resultsCountEl = document.getElementById('fellowResultsCount');
      const btnClearFilters = document.getElementById('btnClearFellowFilters');
      const fellowEmptyState = document.getElementById('fellowEmptyState');
      const btnEmptyReset = document.getElementById('btnEmptyFellowReset');
      const totalFellowsCount = 6;

      function setActiveFellowTab(category, shouldScroll) {
        filterBtns.forEach(btn => {
          const isMatch = btn.getAttribute('data-filter') === category;
          if (isMatch) {
            btn.className = 'filter-btn active px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white shadow-sm cursor-pointer transition-all whitespace-nowrap';
            btn.setAttribute('aria-selected', 'true');
            if (shouldScroll && typeof btn.scrollIntoView === 'function') {
              btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
            }
          } else {
            btn.className = 'filter-btn px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer transition-all whitespace-nowrap';
            btn.setAttribute('aria-selected', 'false');
          }
        });
      }

      function filterFellows() {
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const activeBtn = document.querySelector('#fellowFilterTabs .filter-btn.active') || document.querySelector('#fellowFilterTabs .filter-btn[data-filter="all"]');
        const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        let visibleCount = 0;

        cards.forEach(card => {
          const track = card.getAttribute('data-track') || '';
          const tracks = track.split(/\s+/);
          const text = (card.innerText || '').toLowerCase();
          const isSeat = card.id === 'open-fellow-seat';
          
          let matchesFilter = false;
          if (isSeat) {
            matchesFilter = activeFilter === 'all';
          } else {
            matchesFilter = activeFilter === 'all' || tracks.includes(activeFilter);
          }

          const matchesQuery = !query || text.includes(query);

          if (matchesFilter && matchesQuery) {
            card.style.display = 'flex';
            if (!isSeat) visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Update counter
        if (resultsCountEl) {
          if (visibleCount === 0) {
            resultsCountEl.textContent = '0 fellows or working groups found';
          } else if (visibleCount === totalFellowsCount && !query && activeFilter === 'all') {
            resultsCountEl.textContent = `Showing all ${totalFellowsCount} research fellows and working groups`;
          } else {
            resultsCountEl.textContent = `Showing ${visibleCount} of ${totalFellowsCount} research fellows and working groups`;
          }
        }

        // Toggle clear filters button
        const hasActiveFilters = query.length > 0 || activeFilter !== 'all';
        if (btnClearFilters) {
          if (hasActiveFilters) {
            btnClearFilters.classList.remove('hidden');
          } else {
            btnClearFilters.classList.add('hidden');
          }
        }

        // Toggle empty state
        if (fellowEmptyState) {
          if (visibleCount === 0) {
            fellowEmptyState.classList.remove('hidden');
          } else {
            fellowEmptyState.classList.add('hidden');
          }
        }
      }

      function resetAllFellowFilters() {
        if (searchInput) searchInput.value = '';
        setActiveFellowTab('all');
        filterFellows();
        if (window.location.hash && ['#all', '#governance', '#crypto', '#grc', '#systems', '#profiles'].includes(window.location.hash.toLowerCase())) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter') || 'all';
          setActiveFellowTab(filter, true);
          if (filter !== 'all') {
            history.replaceState(null, '', '#' + filter);
          } else if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          filterFellows();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', filterFellows);
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            searchInput.value = '';
            filterFellows();
          }
        });
      }

      if (btnClearFilters) {
        btnClearFilters.addEventListener('click', resetAllFellowFilters);
      }
      if (btnEmptyReset) {
        btnEmptyReset.addEventListener('click', resetAllFellowFilters);
      }

      // Initialize from URL hash or query parameters (?track=...&q=...)
      const fellowUrlParams = new URLSearchParams(window.location.search);
      const initialFellowQuery = (fellowUrlParams.get('q') || fellowUrlParams.get('search') || '').trim();
      if (initialFellowQuery && searchInput) {
        searchInput.value = initialFellowQuery;
      }
      const initialFellowHash = (fellowUrlParams.get('track') || window.location.hash.replace('#', '')).toLowerCase();
      const validFellowTracks = ['all', 'governance', 'crypto', 'grc', 'systems', 'profiles'];
      if (validFellowTracks.includes(initialFellowHash)) {
        setActiveFellowTab(initialFellowHash);
      }
      filterFellows();

      // Seat #05 Interactive Live Seal & Track Controller
      const seatNomineeInput = document.getElementById('seatNomineeInput');
      const seatBadgeMount = document.getElementById('seatBadgeMount');
      const btnClaimSeatCta = document.getElementById('btnClaimSeatCta');
      const seatTrackBtns = document.querySelectorAll('#seatTrackSelector .seat-track-btn');
      let currentSeatFocus = 'profiles';

      function updateSeatCtaAndBadge() {
        const rawName = seatNomineeInput ? (seatNomineeInput.value || '').trim() : '';
        const badgeLabel = rawName ? (rawName.toUpperCase() + ' · FELLOW') : 'YOU · FELLOW';
        if (seatBadgeMount && window.ztdsMountBadgeSvg) {
          window.ztdsMountBadgeSvg(seatBadgeMount, badgeLabel, '#059669');
        }
        if (btnClaimSeatCta) {
          let ctaHref = `/apply/?track=fellow&focus=${encodeURIComponent(currentSeatFocus)}`;
          if (rawName) {
            ctaHref += `&name=${encodeURIComponent(rawName)}`;
          }
          btnClaimSeatCta.href = ctaHref;
        }
      }

      if (seatBadgeMount) {
        updateSeatCtaAndBadge();
      }

      if (seatNomineeInput) {
        seatNomineeInput.addEventListener('input', updateSeatCtaAndBadge);
      }

      seatTrackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          seatTrackBtns.forEach(b => {
            b.className = 'seat-track-btn px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 text-left transition-colors';
          });
          btn.className = 'seat-track-btn px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold border border-emerald-400 text-left transition-colors';
          currentSeatFocus = btn.getAttribute('data-focus') || 'profiles';
          updateSeatCtaAndBadge();
        });
      });

      // GitOps Fast-Track CLI Copy Handler
      const btnCopyGitOpsCli = document.getElementById('btnCopyGitOpsCli');
      const gitopsCliCode = document.getElementById('gitopsCliCode');
      if (btnCopyGitOpsCli && gitopsCliCode) {
        btnCopyGitOpsCli.addEventListener('click', () => {
          window.ztdsCopy(gitopsCliCode.textContent, () => {
            const savedChildren = Array.from(btnCopyGitOpsCli.childNodes).map(n => n.cloneNode(true));
            const copiedSpan = document.createElement('span');
            copiedSpan.textContent = 'Copied CLI!';
            btnCopyGitOpsCli.replaceChildren(copiedSpan);
            setTimeout(() => { btnCopyGitOpsCli.replaceChildren(...savedChildren); }, 2000);
          });
        });
      }

      // Dynamic Modal Controller
      const fellowBadgeModal = document.getElementById('fellowBadgeModal');
      const fellowModalCloseBtn = document.getElementById('fellowModalCloseBtn');
      const fellowModalTitle = document.getElementById('fellowModalTitle');
      const fellowModalSubtitle = document.getElementById('fellowModalSubtitle');
      const fellowModalBadgeMount = document.getElementById('fellowModalBadgeMount');
      const fellowModalMdSnippet = document.getElementById('fellowModalMdSnippet');
      const fellowModalHtmlSnippet = document.getElementById('fellowModalHtmlSnippet');
      const copyFellowModalMdBtn = document.getElementById('copyFellowModalMdBtn');
      const copyFellowModalHtmlBtn = document.getElementById('copyFellowModalHtmlBtn');
      const fellowModalBadgeUrlText = document.getElementById('fellowModalBadgeUrlText');
      const fellowModalDirectSvgLink = document.getElementById('fellowModalDirectSvgLink');

      function openFellowBadgeModal(slug, name) {
        if (!fellowBadgeModal) return;
        const badgeLabel = (name ? name.toUpperCase() : 'RESEARCH') + ' · FELLOW';
        const badgeUrl = `https://ztds.ai/badge/${slug}.svg`;
        const fellowUrl = `https://ztds.ai/fellows/#${slug}`;

        fellowModalTitle.textContent = `${name} — Fellow Seal`;
        fellowModalSubtitle.textContent = `RFC v1.0 Research Fellow Seal for ${name}`;
        if (fellowModalBadgeMount && window.ztdsMountBadgeSvg) {
          window.ztdsMountBadgeSvg(fellowModalBadgeMount, badgeLabel, '#059669');
        }
        fellowModalMdSnippet.value = `[![ZTDS Fellow](${badgeUrl})](${fellowUrl})`;
        fellowModalHtmlSnippet.value = `<a href="${fellowUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="ZTDS Research Fellow - ${name}" width="168" height="22" decoding="async"></a>`;
        fellowModalBadgeUrlText.textContent = badgeUrl;
        fellowModalDirectSvgLink.href = badgeUrl;

        if (window.ztdsModal) {
          window.ztdsModal.open(fellowBadgeModal, fellowModalCloseBtn);
        } else {
          fellowBadgeModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeFellowBadgeModal() {
        if (!fellowBadgeModal) return;
        if (window.ztdsModal) {
          window.ztdsModal.close(fellowBadgeModal);
        } else {
          fellowBadgeModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      document.querySelectorAll('.btn-embed-fellow-seal').forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug');
          const name = btn.getAttribute('data-name');
          openFellowBadgeModal(slug, name);
        });
      });

      if (fellowModalCloseBtn) {
        fellowModalCloseBtn.addEventListener('click', closeFellowBadgeModal);
      }

      if (fellowBadgeModal) {
        fellowBadgeModal.addEventListener('click', (e) => {
          if (e.target === fellowBadgeModal) closeFellowBadgeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fellowBadgeModal && !fellowBadgeModal.classList.contains('hidden')) {
          closeFellowBadgeModal();
        }
      });

      if (copyFellowModalMdBtn) {
        copyFellowModalMdBtn.addEventListener('click', () => {
          window.ztdsCopy(fellowModalMdSnippet.value, () => {
            copyFellowModalMdBtn.textContent = 'Copied!';
            setTimeout(() => { copyFellowModalMdBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      if (copyFellowModalHtmlBtn) {
        copyFellowModalHtmlBtn.addEventListener('click', () => {
          window.ztdsCopy(fellowModalHtmlSnippet.value, () => {
            copyFellowModalHtmlBtn.textContent = 'Copied!';
            setTimeout(() => { copyFellowModalHtmlBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      // Hash scroll highlight support
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2');
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    })();
})();
