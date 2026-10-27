/**
 * ZTDS.ai — Shared Accessible Mobile Navigation Controller
 * Handles mobile hamburger drawer open/close, backdrop blur, ESC key dismiss, and focus.
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');

  let lastDrawerTrigger = null;

  if (toggleBtn && drawer && backdrop) {
    if (!drawer.getAttribute('role')) drawer.setAttribute('role', 'dialog');
    if (!drawer.getAttribute('aria-modal')) drawer.setAttribute('aria-modal', 'true');
    if (!drawer.getAttribute('aria-label')) drawer.setAttribute('aria-label', 'Mobile Navigation');

    function openMenu() {
      lastDrawerTrigger = document.activeElement;
      drawer.classList.add('active');
      backdrop.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
    }

    function closeMenu() {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      
      const openModals = document.querySelectorAll('[role="dialog"]:not(.hidden)');
      if (openModals.length === 0) {
        document.body.style.overflow = '';
      }
      
      if (lastDrawerTrigger && typeof lastDrawerTrigger.focus === 'function') {
        try { lastDrawerTrigger.focus(); } catch (_) {}
        lastDrawerTrigger = null;
      }
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    backdrop.addEventListener('click', closeMenu);

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (drawer.classList.contains('active')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeMenu();
        } else if (e.key === 'Tab') {
          const focusables = drawer.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (!focusables.length) {
            e.preventDefault();
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  // Universal Accessible Modal Manager
  window.ztdsModal = {
    triggerMap: new WeakMap(),

    open: function(modalEl, focusTarget) {
      if (!modalEl) return;
      this.triggerMap.set(modalEl, document.activeElement);
      modalEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      let target = focusTarget;
      if (typeof target === 'string') {
        target = modalEl.querySelector(target);
      }
      if (!target) {
        target = modalEl.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), button:not([disabled]):not([aria-label*="lose"]), [tabindex]:not([tabindex="-1"])') ||
                 modalEl.querySelector('button, [href], input');
      }
      if (target && typeof target.focus === 'function') {
        setTimeout(() => target.focus(), 50);
      }
    },

    close: function(modalEl) {
      if (!modalEl) return;
      modalEl.classList.add('hidden');
      modalEl.classList.remove('flex');

      const openModals = document.querySelectorAll('[role="dialog"]:not(.hidden)');
      if (openModals.length === 0) {
        document.body.style.overflow = '';
      }

      const prev = this.triggerMap.get(modalEl);
      if (prev && typeof prev.focus === 'function') {
        try { prev.focus(); } catch (_) {}
        this.triggerMap.delete(modalEl);
      }
    },

    trapFocus: function(e, modalEl) {
      if (!modalEl || modalEl.classList.contains('hidden')) return;
      if (e.key === 'Tab') {
        const focusables = modalEl.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && (document.activeElement === first || !modalEl.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !modalEl.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  // Global keydown handler for open dialogs
  document.addEventListener('keydown', (e) => {
    const openDialog = document.querySelector('[role="dialog"]:not(.hidden)');
    if (openDialog && openDialog.id !== 'mobile-drawer') {
      if (e.key === 'Escape') {
        window.ztdsModal.close(openDialog);
      } else if (e.key === 'Tab') {
        window.ztdsModal.trapFocus(e, openDialog);
      }
    }
  });

  // Automatically detect and highlight active desktop & drawer navigation link
  try {
    const rawPath = window.location.pathname.replace(/\/$/, '') || '/';
    const desktopLinks = document.querySelectorAll('#desktop-nav a');
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      const cleanHref = href.replace(/\/$/, '') || '/';
      if (cleanHref === rawPath || (cleanHref !== '/' && rawPath.startsWith(cleanHref))) {
        link.classList.add('text-emerald-700', 'font-bold', 'active');
        link.classList.remove('text-slate-600');
        if (cleanHref === rawPath) link.setAttribute('aria-current', 'page');
      }
    });

    const drawerLinks = document.querySelectorAll('#mobile-drawer a');
    drawerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      const cleanHref = href.replace(/\/$/, '') || '/';
      if (cleanHref === rawPath || (cleanHref !== '/' && rawPath.startsWith(cleanHref))) {
        link.classList.add('text-emerald-800', 'bg-emerald-50', 'font-semibold');
        link.classList.remove('text-slate-700', 'hover:bg-slate-100');
        if (cleanHref === rawPath) link.setAttribute('aria-current', 'page');
      }
    });
  } catch (err) {
    // Graceful fallback
  }

  // Global UX 1: Floating Scroll-to-Top Button for long technical pages
  try {
    if (!document.getElementById('ztds-back-to-top')) {
      const backBtn = document.createElement('button');
      backBtn.id = 'ztds-back-to-top';
      backBtn.type = 'button';
      backBtn.setAttribute('aria-label', 'Scroll to top');
      backBtn.setAttribute('title', 'Scroll to top');
      backBtn.className = 'no-print fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 pointer-events-none translate-y-2 hover:bg-emerald-600 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer';
      backBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>';
      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(backBtn);

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 500) {
              backBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
              backBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
              backBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
              backBtn.classList.remove('opacity-100', 'translate-y-0');
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  } catch (_) {}

  // Global UX 2: Keyboard shortcut "/" to focus directory/matrix search input
  try {
    const searchInput = document.querySelector('input[type="search"], input[id*="search" i], input[placeholder*="Search" i], input[placeholder*="Filter" i]');
    if (searchInput) {
      document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        const active = document.activeElement;
        const tag = active ? active.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (active && active.isContentEditable)) return;
        if (searchInput.offsetParent === null) return;
        e.preventDefault();
        searchInput.focus();
        if (typeof searchInput.select === 'function') searchInput.select();
      });
    }
  } catch (_) {}

  // Global UX 3: Automatic 1-Click Copy Button on standalone <pre> code blocks
  try {
    document.querySelectorAll('main pre').forEach((pre) => {
      if (pre.dataset.ztdsCopyInit) return;
      const parent = pre.parentElement;
      if (!parent) return;
      // Skip if parent or grandparent already has a dedicated copy button
      const container = parent.parentElement || parent;
      if (container.querySelector('button[onclick*="Copy" i], button[onclick*="copy" i], button[class*="copy" i], button[id*="copy" i]')) {
        return;
      }
      const rawText = (pre.innerText || pre.textContent || '').trim();
      if (!rawText || rawText.length < 12) return;

      pre.dataset.ztdsCopyInit = '1';
      if (window.getComputedStyle(pre).position === 'static') {
        pre.style.position = 'relative';
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code snippet');
      btn.className = 'no-print absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded bg-slate-800/90 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 font-mono text-xs font-semibold transition-colors shadow-sm cursor-pointer';
      btn.textContent = 'Copy';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeEl = pre.querySelector('code');
        const textToCopy = (codeEl ? (codeEl.innerText || codeEl.textContent) : (pre.innerText || pre.textContent)).replace(/\bCopy$|\bCopied!$/g, '').trim();
        window.ztdsCopy(textToCopy, () => {
          btn.textContent = 'Copied!';
          btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-500');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-500');
          }, 1800);
        });
      });
      pre.appendChild(btn);
    });
  } catch (_) {}

  // Global UX 4: Deep-link anchor copy (#) on section & subsection headings (h2[id], section[id] > h2, h3[id])
  try {
    document.querySelectorAll('main h2[id], main section[id] > h2:not([id]), main h3[id]').forEach((heading) => {
      if (heading.dataset.ztdsAnchorInit || heading.querySelector('a, button')) return;
      const targetId = heading.id || (heading.parentElement && heading.parentElement.id);
      if (!targetId) return;
      heading.dataset.ztdsAnchorInit = '1';
      heading.classList.add('group');

      const anchorBtn = document.createElement('button');
      anchorBtn.type = 'button';
      anchorBtn.setAttribute('aria-label', 'Copy link to section');
      anchorBtn.setAttribute('title', 'Copy link to section');
      anchorBtn.className = 'no-print ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-mono text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer align-middle';
      anchorBtn.textContent = '#';
      anchorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = window.location.origin + window.location.pathname + '#' + targetId;
        if (history.replaceState) {
          try { history.replaceState(null, '', '#' + targetId); } catch (_) {}
        }
        window.ztdsCopy(url, () => {
          anchorBtn.textContent = 'Copied';
          anchorBtn.classList.add('opacity-100', 'text-emerald-700', 'bg-emerald-50');
          setTimeout(() => {
            anchorBtn.textContent = '#';
            anchorBtn.classList.remove('text-emerald-700', 'bg-emerald-50');
          }, 1600);
        });
      });
      heading.appendChild(anchorBtn);
    });
  } catch (_) {}

  // Global UX 4b: Auto-expand <details> FAQ accordions when targeted via URL #hash + TOC ScrollSpy
  try {
    function expandDetailsForHash() {
      const rawHash = (window.location.hash || '').replace(/^#/, '');
      if (!rawHash) return;
      let target = null;
      try { target = document.getElementById(decodeURIComponent(rawHash)); } catch (_) { target = document.getElementById(rawHash); }
      if (!target) return;
      const detailsEl = target.tagName === 'DETAILS' ? target : target.closest('details');
      if (detailsEl && !detailsEl.open) {
        detailsEl.open = true;
        setTimeout(() => {
          if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 40);
      }
    }
    expandDetailsForHash();
    window.addEventListener('hashchange', expandDetailsForHash);

    // TOC ScrollSpy for in-page sidebar navigation links
    const tocLinks = Array.from(document.querySelectorAll('aside a[href^="#"]:not([href="#"]):not([href="#main-content"])'));
    if (tocLinks.length >= 2 && 'IntersectionObserver' in window) {
      const targetMap = new Map();
      tocLinks.forEach((a) => {
        const id = (a.getAttribute('href') || '').slice(1);
        const el = id ? document.getElementById(id) : null;
        if (el) targetMap.set(el, a);
      });
      if (targetMap.size >= 2) {
        const spy = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const activeLink = targetMap.get(entry.target);
              if (!activeLink) return;
              tocLinks.forEach((l) => {
                l.classList.remove('text-emerald-700', 'font-bold');
                l.removeAttribute('aria-current');
              });
              activeLink.classList.add('text-emerald-700', 'font-bold');
              activeLink.setAttribute('aria-current', 'location');
            }
          });
        }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
        targetMap.forEach((_, el) => spy.observe(el));
      }
    }
  } catch (_) {}

  // Global UX 5: Top Reading Progress Bar on long-form specification pages
  try {
    if (!document.getElementById('ztds-reading-progress') && document.documentElement.scrollHeight > window.innerHeight * 2.2) {
      const progressWrap = document.createElement('div');
      progressWrap.id = 'ztds-reading-progress';
      progressWrap.setAttribute('aria-hidden', 'true');
      progressWrap.className = 'no-print fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none';
      const bar = document.createElement('div');
      bar.className = 'h-full bg-emerald-500 transition-all duration-75';
      bar.style.width = '0%';
      progressWrap.appendChild(bar);
      document.body.appendChild(progressWrap);

      let progTicking = false;
      window.addEventListener('scroll', () => {
        if (!progTicking) {
          window.requestAnimationFrame(() => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
            bar.style.width = pct.toFixed(1) + '%';
            progTicking = false;
          });
          progTicking = true;
        }
      }, { passive: true });
    }
  } catch (_) {}

  // Global UX 6: Accessible Command Palette (Cmd+K / Ctrl+K) + Header Trigger
  try {
    const SITE_INDEX = [
      { title: 'Official RFC v1.0 Specification', cat: 'Standard', url: '/standard/', kw: 'rfc 8821 invariants math proofs normative' },
      { title: 'IETF Standards Track Hub (draft-02)', cat: 'Standard', url: '/ietf/', kw: 'ietf internet draft datatracker protocol' },
      { title: 'Academic Whitepaper & DOIs', cat: 'Standard', url: '/whitepaper/', kw: 'zenodo osf ssrn doi peer reviewed treatise' },
      { title: '10 Canonical AI & RAG Blueprints', cat: 'Standard', url: '/blueprints/', kw: 'langchain llamaindex crewai pinecone envoy nitro' },
      { title: 'AI Safety & Latency Benchmarks', cat: 'Standard', url: '/benchmarks/', kw: 'latency throughput memory overhead wasm' },
      { title: 'Evidentiary Sovereignty & Legal Privilege', cat: 'Standard', url: '/evidentiary-sovereignty/', kw: 'fre 502 attorney client privilege discovery' },
      { title: 'CISO Procurement & Legal Defense Pack', cat: 'CISO & GRC', url: '/ciso/', kw: 'sig lite caiq vsaq vendor risk dpo' },
      { title: '1-Page CISO Safe Harbor Memorandum', cat: 'CISO & GRC', url: '/ciso/memo/', kw: 'gdpr art 28 32 amendment 13 dpa elimination pdf' },
      { title: 'Global Regulatory Compliance Matrix', cat: 'CISO & GRC', url: '/compliance/', kw: 'gdpr hipaa eu ai act pci dss ccpa' },
      { title: 'AICPA SOC 2 Type II & Trust Center', cat: 'CISO & GRC', url: '/soc2/', kw: 'soc2 evidence binder controls audit' },
      { title: 'CISO Breach Liability & ROI Calculator', cat: 'CISO & GRC', url: '/roi/', kw: 'calculator savings breach fine cost' },
      { title: 'Enterprise Order Form (Schedule A)', cat: 'CISO & GRC', url: '/docs/legal/order-form/', kw: 'contract msa po invoice procurement' },
      { title: 'Executive CISO Pitch Deck', cat: 'CISO & GRC', url: '/deck/', kw: 'slides presentation briefing board' },
      { title: 'Developer SDK & Offline Licensing', cat: 'Developers', url: '/sdk/', kw: 'npm pip typescript python wasm ed25519 trial' },
      { title: 'Model Context Protocol (MCP) Hub', cat: 'Developers', url: '/mcp/', kw: 'claude desktop cursor windsurf stdio agent' },
      { title: 'Live Domain Perimeter Scanner', cat: 'Tools', url: '/scanner/', kw: 'audit egress network inspector airplane mode' },
      { title: 'Interactive In-RAM DAG Inspector', cat: 'Tools', url: '/inspector/', kw: 'playground tokenize surrogate detokenize' },
      { title: 'Ed25519 Certificate Validator', cat: 'Tools', url: '/verify/', kw: 'cryptographic signature receipt verify' },
      { title: 'ZTDS Verified SVG Badge Generator', cat: 'Tools', url: '/badge/', kw: 'embed seal shield markdown html' },
      { title: 'Verified Implementations Registry', cat: 'Ecosystem', url: '/registry/', kw: 'certified software privacyscrubber directory' },
      { title: 'Corporate Adopters & Members', cat: 'Ecosystem', url: '/companies/', kw: 'enterprise adopters brandmeweb case studies' },
      { title: 'Accredited Research Fellows & WGs', cat: 'Ecosystem', url: '/fellows/', kw: 'ilya sibiryakov cliford fanyuy working groups' },
      { title: 'Enterprise Architecture Case Studies', cat: 'Ecosystem', url: '/case-studies/', kw: 'healthcare fintech legal defense deployments' },
      { title: 'Certification Authority & CAB', cat: 'Ecosystem', url: '/certification/', kw: 'conformity assessment accreditation tracks' },
      { title: 'Apply for ZTDS Accreditation', cat: 'Ecosystem', url: '/apply/', kw: 'gitops pr submit claim badge' },
      { title: 'Consortium Governance & Charter', cat: 'Governance', url: '/governance/', kw: 'bylaws working groups voting steering' },
      { title: 'Security Policy & CVD (PGP)', cat: 'Governance', url: '/security/', kw: 'vulnerability disclosure security.txt' },
      { title: 'Standards, RAND-Z Patent Policy & Terms', cat: 'Governance', url: '/terms/', kw: 'cc-by-4.0 apache 2.0 trademark covenant' },
      { title: 'Zero-Telemetry Privacy Policy', cat: 'Governance', url: '/privacy/', kw: 'zero cookies zero analytics gdpr' }
    ];

    function buildCmdPalette() {
      let modal = document.getElementById('ztds-cmd-palette');
      if (modal) return modal;

      modal = document.createElement('div');
      modal.id = 'ztds-cmd-palette';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Quick Jump Command Palette');
      modal.className = 'no-print hidden fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs';

      const panel = document.createElement('div');
      panel.className = 'w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden';

      const topBar = document.createElement('div');
      topBar.className = 'flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50';

      const searchIcon = document.createElement('span');
      searchIcon.className = 'text-slate-400 font-mono text-xs font-bold shrink-0';
      searchIcon.textContent = 'JUMP //';

      const input = document.createElement('input');
      input.type = 'search';
      input.id = 'ztds-cmd-input';
      input.setAttribute('aria-label', 'Search pages, sections, and tools');
      input.placeholder = 'Jump to specification, CISO memo, SDK, scanner, or section...';
      input.className = 'w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-sans';

      const escBtn = document.createElement('button');
      escBtn.type = 'button';
      escBtn.className = 'px-2 py-0.5 rounded bg-slate-200/80 text-slate-600 font-mono text-xs font-semibold hover:bg-slate-300 cursor-pointer shrink-0';
      escBtn.textContent = 'ESC';
      escBtn.addEventListener('click', () => window.ztdsModal.close(modal));

      topBar.appendChild(searchIcon);
      topBar.appendChild(input);
      topBar.appendChild(escBtn);

      const list = document.createElement('div');
      list.id = 'ztds-cmd-list';
      list.setAttribute('role', 'listbox');
      list.className = 'max-h-80 overflow-y-auto divide-y divide-slate-100 p-1.5';

      const footer = document.createElement('div');
      footer.className = 'px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500';
      footer.innerHTML = '<span>&uarr;&darr; to navigate &middot; Enter to open</span><span>ZTDS.ai Quick Jump</span>';

      panel.appendChild(topBar);
      panel.appendChild(list);
      panel.appendChild(footer);
      modal.appendChild(panel);
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.ztdsModal.close(modal);
      });

      // Collect current page h2, h3, and FAQ details sections dynamically
      const pageSections = [];
      document.querySelectorAll('main h2[id], main h3[id], main details[id] > summary').forEach((el) => {
        const isSummary = el.tagName === 'SUMMARY';
        const idOwner = isSummary ? el.parentElement : el;
        const cleanTitle = (el.textContent || '').replace(/#$/, '').replace(/Copied$/, '').trim();
        if (cleanTitle && idOwner && idOwner.id) {
          pageSections.push({
            title: cleanTitle,
            cat: isSummary ? 'Page FAQ' : 'On This Page',
            url: '#' + idOwner.id,
            kw: cleanTitle.toLowerCase() + (isSummary ? ' faq question' : ' section anchor')
          });
        }
      });

      const allItems = pageSections.concat(SITE_INDEX);
      let activeIdx = 0;
      let filtered = allItems.slice(0, 12);

      function renderList(q) {
        const query = (q || '').trim().toLowerCase();
        if (!query) {
          filtered = pageSections.slice(0, 4).concat(SITE_INDEX.slice(0, 10));
        } else {
          const terms = query.split(/\s+/);
          filtered = allItems.filter((item) => {
            const hay = (item.title + ' ' + item.cat + ' ' + item.url + ' ' + item.kw).toLowerCase();
            return terms.every((t) => hay.includes(t));
          }).slice(0, 14);
        }
        activeIdx = 0;
        list.textContent = '';
        if (filtered.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'py-8 px-4 text-center text-xs font-mono text-slate-500';
          empty.textContent = 'No matching route found. Try "rfc", "memo", "sdk", "mcp", or "scanner".';
          list.appendChild(empty);
          return;
        }
        filtered.forEach((item, idx) => {
          const a = document.createElement('a');
          a.href = item.url;
          a.setAttribute('role', 'option');
          a.setAttribute('aria-selected', idx === activeIdx ? 'true' : 'false');
          a.className = 'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ' +
            (idx === activeIdx ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'text-slate-700 hover:bg-slate-50');

          const left = document.createElement('div');
          left.className = 'truncate';
          left.textContent = item.title;

          const right = document.createElement('div');
          right.className = 'flex items-center gap-2 shrink-0 font-mono text-xs';
          const badge = document.createElement('span');
          badge.className = 'px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200';
          badge.textContent = item.cat;
          right.appendChild(badge);

          a.appendChild(left);
          a.appendChild(right);
          a.addEventListener('click', () => {
            window.ztdsModal.close(modal);
          });
          list.appendChild(a);
        });
      }

      function updateActiveHighlight() {
        const opts = list.querySelectorAll('[role="option"]');
        opts.forEach((el, idx) => {
          const isAct = idx === activeIdx;
          el.setAttribute('aria-selected', isAct ? 'true' : 'false');
          el.className = 'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ' +
            (isAct ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'text-slate-700 hover:bg-slate-50');
          if (isAct && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ block: 'nearest' });
          }
        });
      }

      input.addEventListener('input', () => renderList(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filtered.length > 0) {
            activeIdx = (activeIdx + 1) % filtered.length;
            updateActiveHighlight();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filtered.length > 0) {
            activeIdx = (activeIdx - 1 + filtered.length) % filtered.length;
            updateActiveHighlight();
          }
        } else if (e.key === 'Enter') {
          if (filtered[activeIdx]) {
            e.preventDefault();
            const targetUrl = filtered[activeIdx].url;
            window.ztdsModal.close(modal);
            window.location.href = targetUrl;
          }
        }
      });

      modal._renderInitial = () => {
        input.value = '';
        renderList('');
      };
      return modal;
    }

    function openCmdPalette() {
      const modal = buildCmdPalette();
      if (modal._renderInitial) modal._renderInitial();
      window.ztdsModal.open(modal, '#ztds-cmd-input');
    }

    // Inject compact Cmd+K trigger button in header action bar (accessible on both mobile & desktop)
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    if (mobileMenuBtn && mobileMenuBtn.parentElement && !document.getElementById('ztds-cmd-trigger')) {
      const actionContainer = mobileMenuBtn.parentElement;
      const cmdBtn = document.createElement('button');
      cmdBtn.type = 'button';
      cmdBtn.id = 'ztds-cmd-trigger';
      cmdBtn.setAttribute('aria-label', 'Quick Jump Search (Command+K)');
      cmdBtn.setAttribute('title', 'Quick Jump Search (⌘K / Ctrl+K)');
      cmdBtn.className = 'no-print inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 font-mono text-xs font-medium transition-colors cursor-pointer';
      cmdBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><span class="hidden sm:inline">&#8984;K</span>';
      cmdBtn.addEventListener('click', openCmdPalette);
      actionContainer.insertBefore(cmdBtn, actionContainer.firstChild);
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const existing = document.getElementById('ztds-cmd-palette');
        if (existing && !existing.classList.contains('hidden')) {
          window.ztdsModal.close(existing);
        } else {
          openCmdPalette();
        }
      }
    });
  } catch (_) {}
});

/**
 * Universal Zero-Failure Clipboard Copier
 * Seamlessly handles HTTPS navigator.clipboard and fallback document.execCommand
 */
window.ztdsCopy = function(text, onSuccess, onError) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => { if (onSuccess) onSuccess(); })
      .catch(() => fallbackCopy(text, onSuccess, onError));
  } else {
    fallbackCopy(text, onSuccess, onError);
  }
};

function fallbackCopy(text, onSuccess, onError) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      if (onSuccess) onSuccess();
    } else if (onError) {
      onError();
    }
  } catch (err) {
    if (onError) onError(err);
  }
}
