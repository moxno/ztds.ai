(function () {
  'use strict';

// Enhanced Search, Filter & Category Engine
    const searchInput = document.getElementById('registrySearch');
    const filterTabsContainer = document.getElementById('filterTabs');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#registryGrid > div[data-category]');
    const resultsCountEl = document.getElementById('registryResultsCount');
    const btnClearFilters = document.getElementById('btnClearFilters');
    const registryEmptyState = document.getElementById('registryEmptyState');
    const btnEmptyReset = document.getElementById('btnEmptyReset');

    const totalCardsCount = cards.length;

    function setActiveTab(category, shouldScroll) {
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

    function filterCards() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const activeBtn = document.querySelector('.filter-btn.active') || document.querySelector('.filter-btn[data-filter="all"]');
      const activeCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

      let visibleCount = 0;

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categories = category.split(/\s+/);
        const text = card.innerText.toLowerCase();
        
        const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
        const matchesQuery = !query || text.includes(query);

        if (matchesCategory && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update counter
      if (resultsCountEl) {
        if (visibleCount === 0) {
          resultsCountEl.textContent = '0 solutions found';
        } else if (visibleCount === totalCardsCount && !query && activeCategory === 'all') {
          resultsCountEl.textContent = `Showing all ${totalCardsCount} certified solutions`;
        } else {
          resultsCountEl.textContent = `Showing ${visibleCount} of ${totalCardsCount} certified solutions`;
        }
      }

      // Toggle Clear Filters button
      const hasActiveFilters = query.length > 0 || activeCategory !== 'all';
      if (btnClearFilters) {
        if (hasActiveFilters) {
          btnClearFilters.classList.remove('hidden');
        } else {
          btnClearFilters.classList.add('hidden');
        }
      }

      // Toggle Empty State
      if (registryEmptyState) {
        if (visibleCount === 0) {
          registryEmptyState.classList.remove('hidden');
        } else {
          registryEmptyState.classList.add('hidden');
        }
      }
    }

    function resetAllFilters() {
      if (searchInput) searchInput.value = '';
      setActiveTab('all');
      filterCards();
      if (window.location.hash && ['#all', '#mcp', '#rag', '#sdk', '#app', '#proxy'].includes(window.location.hash.toLowerCase())) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        setActiveTab(filter, true);
        if (filter !== 'all') {
          history.replaceState(null, '', '#' + filter);
        } else if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', filterCards);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          filterCards();
        }
      });
    }

    if (btnClearFilters) {
      btnClearFilters.addEventListener('click', resetAllFilters);
    }
    if (btnEmptyReset) {
      btnEmptyReset.addEventListener('click', resetAllFilters);
    }

    // Initialize from URL hash or query parameters (?category=...&q=...)
    window.addEventListener('DOMContentLoaded', () => {
      const regParams = new URLSearchParams(window.location.search);
      const qVal = (regParams.get('q') || regParams.get('search') || '').trim();
      if (qVal && searchInput) {
        searchInput.value = qVal;
      }
      const hash = (regParams.get('category') || window.location.hash.replace('#', '')).toLowerCase();
      const validCategories = ['all', 'mcp', 'rag', 'sdk', 'app', 'proxy'];
      if (validCategories.includes(hash)) {
        setActiveTab(hash);
      }
      filterCards();
    });

    // Cryptographic Certificate Modal Controller
    const certModal = document.getElementById('certModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDoneBtn = document.getElementById('modalDoneBtn');
    const btnCopySha = document.getElementById('btnCopySha');
    const btnCopyEmbed = document.getElementById('btnCopyEmbed');
    const modalDownloadCertBtn = document.getElementById('modalDownloadCertBtn');
    const modalCopyTokenBtn = document.getElementById('modalCopyTokenBtn');
    const formatBtns = document.querySelectorAll('.embed-format-btn');

    let activeModalCertToken = "";
    let activeModalCertSlug = "";
    let activeModalBadgeUrl = "";
    let currentEmbedFormat = "markdown";

    function updateEmbedCode() {
      const codeEl = document.getElementById('modalEmbedCode');
      if (!codeEl) return;
      const targetUrl = `https://ztds.ai/registry/#${activeModalCertSlug}`;
      const badgeUrl = activeModalBadgeUrl || 'https://ztds.ai/badge/privacyscrubber-web.svg';

      if (currentEmbedFormat === 'markdown') {
        codeEl.textContent = `[![ZTDS Verified](${badgeUrl})](${targetUrl})`;
      } else if (currentEmbedFormat === 'html') {
        codeEl.textContent = `<a href="${targetUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="ZTDS Verified Conformance" width="168" height="32" decoding="async" /></a>`;
      } else if (currentEmbedFormat === 'jsx') {
        codeEl.textContent = `<a href="${targetUrl}" target="_blank" rel="noopener">\n  <img src="${badgeUrl}" alt="ZTDS Verified Conformance" width={168} height={32} decoding="async" />\n</a>`;
      }
    }

    function openCertModal(data) {
      document.getElementById('modalTitle').textContent = data.name || 'Verified Solution';
      activeModalCertToken = data.certToken || "";
      activeModalCertSlug = (data.name || "certificate").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      activeModalBadgeUrl = data.badge || "https://ztds.ai/badge/privacyscrubber-web.svg";
      
      const modalCertId = document.getElementById("modalCertId");
      if (modalCertId) modalCertId.textContent = data.certId || "ZTDS-CERT-PENDING";
      
      const modalCertLevel = document.getElementById("modalCertLevel");
      if (modalCertLevel) modalCertLevel.textContent = data.certLevel || "Level 1: Automated CTS";

      const modalVerifyBtn = document.getElementById("modalVerifyBtn");
      if (modalVerifyBtn) {
        modalVerifyBtn.href = data.certVerifyUrl || "/verify/";
      }
      document.getElementById('modalCategory').textContent = data.categoryDesc || 'Software Utility';
      document.getElementById('modalDate').textContent = data.date || '2026-09-15';
      document.getElementById('modalSha').textContent = data.sha || 'sha256:7f83b165...';
      document.getElementById('modalFrameworks').textContent = data.frameworks || 'GDPR Art. 28, HIPAA Safe Harbor, SOC 2 Type II';
      
      const docLink = document.getElementById('modalDocLink');
      docLink.href = data.url || '/standard/';
      docLink.textContent = data.url && data.url.startsWith('http') ? 'Visit Solution Website \u2192' : 'View Technical Blueprint \u2192';

      updateEmbedCode();

      if (window.ztdsModal) {
        window.ztdsModal.open(certModal, modalCloseBtn);
        certModal.classList.add('flex');
      } else {
        certModal.classList.remove('hidden');
        certModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeCertModal() {
      if (window.ztdsModal) {
        window.ztdsModal.close(certModal);
      } else {
        certModal.classList.add('hidden');
        certModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    }

    formatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        formatBtns.forEach(b => {
          b.className = 'embed-format-btn px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        });
        btn.className = 'embed-format-btn px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-900 text-white';
        currentEmbedFormat = btn.getAttribute('data-format');
        updateEmbedCode();
      });
    });

    document.querySelectorAll('.btn-cert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCertModal({
          name: btn.getAttribute('data-name'),
          tier: btn.getAttribute('data-tier'),
          categoryDesc: btn.getAttribute('data-category-desc'),
          sha: btn.getAttribute('data-sha'),
          date: btn.getAttribute('data-date'),
          url: btn.getAttribute('data-url'),
          badge: btn.getAttribute('data-badge'),
          frameworks: btn.getAttribute('data-frameworks'),
          certId: btn.getAttribute('data-cert-id'),
          certToken: btn.getAttribute('data-cert-token'),
          certVerifyUrl: btn.getAttribute('data-cert-verify-url'),
          certLevel: btn.getAttribute('data-cert-level'),
          certDownloadUrl: btn.getAttribute('data-cert-download-url')
        });
      });
    });

    modalCloseBtn.addEventListener('click', closeCertModal);
    modalDoneBtn.addEventListener('click', closeCertModal);
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !certModal.classList.contains('hidden')) {
        closeCertModal();
      }
    });

    btnCopySha.addEventListener('click', () => {
      const shaText = document.getElementById('modalSha').textContent;
      window.ztdsCopy(shaText, () => {
        btnCopySha.textContent = 'Copied!';
        btnCopySha.classList.add('text-emerald-400');
        setTimeout(() => {
          btnCopySha.textContent = 'Copy Hash';
          btnCopySha.classList.remove('text-emerald-400');
        }, 2000);
      });
    });

    btnCopyEmbed.addEventListener('click', () => {
      const embedText = document.getElementById('modalEmbedCode').textContent;
      window.ztdsCopy(embedText, () => {
        btnCopyEmbed.textContent = 'Copied!';
        btnCopyEmbed.classList.add('text-emerald-400');
        setTimeout(() => {
          btnCopyEmbed.textContent = 'Copy Snippet';
          btnCopyEmbed.classList.remove('text-emerald-400');
        }, 2000);
      });
    });

    if (modalCopyTokenBtn) {
      modalCopyTokenBtn.addEventListener('click', () => {
        if (!activeModalCertToken) return;
        window.ztdsCopy(activeModalCertToken, () => {
          modalCopyTokenBtn.textContent = 'Copied!';
          modalCopyTokenBtn.classList.add('text-emerald-400');
          setTimeout(() => {
            modalCopyTokenBtn.textContent = 'Copy Token';
            modalCopyTokenBtn.classList.remove('text-emerald-400');
          }, 2000);
        });
      });
    }

    if (modalDownloadCertBtn) {
      modalDownloadCertBtn.addEventListener('click', () => {
        if (!activeModalCertToken) return;
        const blob = new Blob([activeModalCertToken], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (activeModalCertSlug || 'ztds-certificate') + '.cert';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
})();
