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

  function getOpenDialogs() {
    return Array.from(document.querySelectorAll('[role="dialog"]')).filter((el) => {
      if (el.id === 'mobile-drawer') return el.classList.contains('active');
      return !el.classList.contains('hidden');
    });
  }

  if (toggleBtn && drawer && backdrop) {
    backdrop.setAttribute('aria-hidden', 'true');
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
      
      if (getOpenDialogs().length === 0) {
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

      if (getOpenDialogs().length === 0) {
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
    const openDialogs = getOpenDialogs().filter((el) => el.id !== 'mobile-drawer');
    const openDialog = openDialogs[openDialogs.length - 1];
    if (openDialog) {
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
      const backSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      backSvg.setAttribute('class', 'w-5 h-5');
      backSvg.setAttribute('fill', 'none');
      backSvg.setAttribute('stroke', 'currentColor');
      backSvg.setAttribute('stroke-width', '2.2');
      backSvg.setAttribute('viewBox', '0 0 24 24');
      backSvg.setAttribute('aria-hidden', 'true');
      const backPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      backPath.setAttribute('stroke-linecap', 'round');
      backPath.setAttribute('stroke-linejoin', 'round');
      backPath.setAttribute('d', 'M5 15l7-7 7 7');
      backSvg.appendChild(backPath);
      backBtn.appendChild(backSvg);
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
      if (container.querySelector('button[data-ztds-copy], button[data-ztds-copy-target], button[class*="copy" i], button[id*="copy" i]')) {
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

    // 1-Click # deep-link copy inside expanded <details id="..."> body (never inside <summary>, preserving HTML5/ARIA a11y)
    document.querySelectorAll('main details[id]').forEach((detailsEl) => {
      if (detailsEl.dataset.ztdsFaqCopyInit || !detailsEl.id) return;
      detailsEl.dataset.ztdsFaqCopyInit = '1';

      const copyRow = document.createElement('div');
      copyRow.className = 'no-print mt-2.5 flex justify-end';
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.setAttribute('aria-label', 'Copy direct link to section');
      copyBtn.className = 'px-2 py-0.5 rounded text-xs font-mono text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer';
      copyBtn.textContent = 'Copy link #';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = window.location.origin + window.location.pathname + '#' + detailsEl.id;
        if (history.replaceState) {
          try { history.replaceState(null, '', '#' + detailsEl.id); } catch (_) {}
        }
        window.ztdsCopy(url, () => {
          copyBtn.textContent = 'Copied #';
          copyBtn.classList.add('text-emerald-700', 'bg-emerald-50');
          setTimeout(() => {
            copyBtn.textContent = 'Copy link #';
            copyBtn.classList.remove('text-emerald-700', 'bg-emerald-50');
          }, 1600);
        });
      });
      copyRow.appendChild(copyBtn);
      detailsEl.appendChild(copyRow);
    });

    // Inject Expand All / Collapse All bar above FAQ groups with >= 3 <details> items
    const detailsParents = new Set();
    document.querySelectorAll('main details').forEach((d) => {
      if (d.parentElement) detailsParents.add(d.parentElement);
    });
    detailsParents.forEach((parent) => {
      const childDetails = Array.from(parent.children).filter((c) => c.tagName === 'DETAILS');
      if (childDetails.length >= 3 && !parent.dataset.ztdsFaqToolbar) {
        parent.dataset.ztdsFaqToolbar = '1';
        const toolbar = document.createElement('div');
        toolbar.className = 'no-print flex items-center justify-end gap-2 mb-2 text-xs font-mono';
        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.type = 'button';
        toggleAllBtn.className = 'px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer shadow-2xs';

        function syncLabel() {
          const allOpen = childDetails.every((d) => d.open);
          toggleAllBtn.textContent = allOpen ? 'Collapse All FAQs' : 'Expand All FAQs';
          toggleAllBtn.setAttribute('aria-expanded', String(allOpen));
        }
        syncLabel();

        toggleAllBtn.addEventListener('click', () => {
          const allOpen = childDetails.every((d) => d.open);
          childDetails.forEach((d) => { d.open = !allOpen; });
          syncLabel();
        });
        childDetails.forEach((d) => d.addEventListener('toggle', syncLabel));

        toolbar.appendChild(toggleAllBtn);
        parent.insertBefore(toolbar, childDetails[0]);
      }
    });

    // Auto-open all <details> during print / PDF export and restore state afterwards
    let closedBeforePrint = [];
    window.addEventListener('beforeprint', () => {
      closedBeforePrint = [];
      document.querySelectorAll('main details:not([open])').forEach((d) => {
        closedBeforePrint.push(d);
        d.open = true;
      });
    });
    window.addEventListener('afterprint', () => {
      closedBeforePrint.forEach((d) => { d.open = false; });
      closedBeforePrint = [];
    });

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
      { title: 'ZTDS.ai — Open Standard & Interactive Playground', cat: 'Home', url: '/', kw: 'home overview playground zero trust data sanitization' },
      { title: 'Official RFC v1.0 Specification', cat: 'Standard', url: '/standard/', kw: 'rfc 8821 invariants math proofs normative' },
      { title: 'IETF Standards Track Hub (draft-02)', cat: 'Standard', url: '/ietf/', kw: 'ietf internet draft datatracker protocol' },
      { title: 'IETF Draft-02 Full Specification Text', cat: 'Standard', url: '/ietf/draft-sibiryakov-ztds-protocol-02/', kw: 'draft-sibiryakov-ztds-protocol-02 ietf normative' },
      { title: 'IETF Draft-01 Historical Archive', cat: 'Standard', url: '/ietf/draft-sibiryakov-ztds-protocol-01/', kw: 'draft-sibiryakov-ztds-protocol-01 ietf archive' },
      { title: 'Academic Whitepaper & DOIs', cat: 'Standard', url: '/whitepaper/', kw: 'zenodo osf ssrn doi peer reviewed treatise' },
      { title: '10 Canonical AI & RAG Blueprints', cat: 'Standard', url: '/blueprints/', kw: 'langchain llamaindex crewai pinecone envoy nitro' },
      { title: 'AI Safety & Latency Benchmarks', cat: 'Standard', url: '/benchmarks/', kw: 'latency throughput memory overhead wasm' },
      { title: 'Evidentiary Sovereignty & Legal Privilege', cat: 'Standard', url: '/evidentiary-sovereignty/', kw: 'fre 502 attorney client privilege discovery' },
      { title: 'CISO Procurement & Legal Defense Pack', cat: 'CISO & GRC', url: '/ciso/', kw: 'sig lite caiq vsaq vendor risk dpo' },
      { title: '1-Page CISO Safe Harbor Memorandum', cat: 'CISO & GRC', url: '/ciso/memo/', kw: 'gdpr art 28 32 amendment 13 dpa elimination pdf' },
      { title: 'Global Regulatory Compliance Matrix', cat: 'CISO & GRC', url: '/compliance/', kw: 'gdpr hipaa eu ai act pci dss ccpa' },
      { title: 'Regulatory & Security Framework Mappings', cat: 'CISO & GRC', url: '/frameworks/', kw: 'owasp llm02 nist ai rmf eu ai act gdpr art 25 32 hipaa mcp rag' },
      { title: 'OWASP Top 10 for LLM: LLM02 Sensitive Information Disclosure', cat: 'Framework', url: '/frameworks/owasp-llm02-sensitive-information-disclosure/', kw: 'owasp llm02 prompt leakage sensitive data disclosure' },
      { title: 'NIST AI RMF Generative AI Profile (NIST AI 600-1)', cat: 'Framework', url: '/frameworks/nist-ai-rmf-generative-ai-profile-pii/', kw: 'nist ai rmf 600-1 generative ai pii govern map measure manage' },
      { title: 'EU AI Act Article 10 Data Governance & Sanitization', cat: 'Framework', url: '/frameworks/eu-ai-act-article-10-data-governance/', kw: 'eu ai act article 10 high risk data governance privacy' },
      { title: 'GDPR Articles 25 & 32 Technical Safe Harbor for AI Prompts', cat: 'Framework', url: '/frameworks/gdpr-article-25-32-ai-prompts/', kw: 'gdpr article 25 32 privacy by design safe harbor prompts' },
      { title: 'HIPAA Safe Harbor (45 CFR 164.514) for LLM Prompts', cat: 'Framework', url: '/frameworks/hipaa-safe-harbor-llm-prompts/', kw: 'hipaa safe harbor 18 identifiers phi healthcare llm ehr' },
      { title: 'MCP Stdio Local PII Sanitization Architecture', cat: 'Framework', url: '/frameworks/mcp-stdio-pii-sanitization/', kw: 'model context protocol mcp stdio claude cursor local sanitization' },
      { title: 'RAG Pipeline In-Memory PII Sanitization & Right to Erasure', cat: 'Framework', url: '/frameworks/rag-pipeline-pii-sanitization/', kw: 'rag vector database pinecone qdrant gdpr article 17 erasure' },
      { title: 'Client-Side In-RAM Sanitization vs. Cloud Proxy DLP', cat: 'Framework', url: '/frameworks/client-side-sanitization-vs-proxy-dlp/', kw: 'cloud dlp proxy vs client ram latency subprocessor comparison' },
      { title: 'AICPA SOC 2 Type II & Trust Center', cat: 'CISO & GRC', url: '/soc2/', kw: 'soc2 evidence binder controls audit' },
      { title: 'CISO Breach Liability & ROI Calculator', cat: 'CISO & GRC', url: '/roi/', kw: 'calculator savings breach fine cost' },
      { title: 'Enterprise Order Form (Schedule A)', cat: 'CISO & GRC', url: '/docs/legal/order-form/', kw: 'contract msa po invoice procurement' },
      { title: 'Executive CISO Pitch Deck', cat: 'CISO & GRC', url: '/deck/', kw: 'slides presentation briefing board' },
      { title: 'Developer SDK & 6 Execution Surfaces', cat: 'Developers', url: '/sdk/', kw: 'npm pip typescript python wasm ed25519 trial wordpress form guard' },
      { title: 'Model Context Protocol (MCP) Hub', cat: 'Developers', url: '/mcp/', kw: 'claude desktop cursor windsurf stdio agent' },
      { title: 'Live Domain Perimeter Scanner', cat: 'Tools', url: '/scanner/', kw: 'audit egress network inspector airplane mode wordpress' },
      { title: 'Interactive In-RAM DAG Inspector', cat: 'Tools', url: '/inspector/', kw: 'playground tokenize surrogate detokenize' },
      { title: 'Ed25519 Certificate & Domain Validator', cat: 'Tools', url: '/verify/', kw: 'cryptographic signature receipt verify domain seal wordpress' },
      { title: 'ZTDS Verified SVG Badge Generator', cat: 'Tools', url: '/badge/', kw: 'embed seal shield markdown html' },
      { title: 'Verified Implementations Registry (15)', cat: 'Ecosystem', url: '/registry/', kw: 'certified software privacyscrubber directory wordpress plugin' },
      { title: 'Corporate Adopters & Members (10)', cat: 'Ecosystem', url: '/companies/', kw: 'enterprise adopters brandmeweb learningcenterusa case studies' },
      { title: 'Accredited Research Fellows & WGs', cat: 'Ecosystem', url: '/fellows/', kw: 'ilya sibiryakov cliford fanyuy working groups' },
      { title: 'Enterprise Architecture Case Studies (10)', cat: 'Ecosystem', url: '/case-studies/', kw: 'healthcare fintech legal defense voice deployments' },
      { title: 'Certification Authority & CAB', cat: 'Ecosystem', url: '/certification/', kw: 'conformity assessment accreditation tracks' },
      { title: 'Apply for ZTDS Accreditation', cat: 'Ecosystem', url: '/apply/', kw: 'gitops pr submit claim badge wordpress domain seal' },
      { title: 'BrandMeWeb Enterprise AI Safety & GEO Audit', cat: 'Ecosystem', url: '/agency/', kw: 'brandmeweb enterprise audit implementation retainer geo' },
      { title: 'Consortium Governance & Charter', cat: 'Governance', url: '/governance/', kw: 'bylaws working groups voting steering' },
      { title: 'Security Policy & CVD (PGP)', cat: 'Governance', url: '/security/', kw: 'vulnerability disclosure security.txt' },
      { title: 'Standards, RAND-Z Patent Policy & Terms', cat: 'Governance', url: '/terms/', kw: 'cc-by-4.0 apache 2.0 trademark covenant' },
      { title: 'Zero-Telemetry Privacy Policy', cat: 'Governance', url: '/privacy/', kw: 'zero cookies zero analytics gdpr' },
      { title: 'Accessibility Statement (WCAG 2.1 AA & IS 5568)', cat: 'Governance', url: '/accessibility/', kw: 'accessibility wcag 2.1 2.2 aa is 5568 keyboard screen reader' },
      { title: 'BrandMeWeb — Corporate Member & GEO Case Study', cat: 'Case Study', url: '/companies/brandmeweb/', kw: 'brandmeweb agency geo seo langchain' },
      { title: 'PrivacyScrubber — Pioneer Reference Implementation', cat: 'Case Study', url: '/companies/privacyscrubber/', kw: 'privacyscrubber wasm chrome extension sdk mcp wordpress' },
      { title: 'LearningCenterUsa.net — PSTN Voice & Transcript Enclave', cat: 'Case Study', url: '/companies/learningcenterusa/', kw: 'voice telephony pstn bipa cal penal code 632 call center' },
      { title: 'Apex Health Systems — HIPAA Clinical Blueprint', cat: 'Case Study', url: '/companies/apex-health-ai/', kw: 'hipaa safe harbor ehr epic cerner phi' },
      { title: 'Lex Veritas Global LLP — FRE 502 Legal Blueprint', cat: 'Case Study', url: '/companies/lex-veritas-legal/', kw: 'fre 502 attorney client privilege m&a legal' },
      { title: 'Aegis Financial Technologies — PCI-DSS FinTech Blueprint', cat: 'Case Study', url: '/companies/aegis-fintech/', kw: 'pci dss swift iban banking fintech' },
      { title: 'CloudScale Software Inc. — SOC 2 Multi-Tenant SaaS', cat: 'Case Study', url: '/companies/cloudscale-saas/', kw: 'soc 2 cc6.7 saas copilot nextjs' },
      { title: 'Valkyrie Aerospace & Defense — ITAR / CMMC SCIF Enclave', cat: 'Case Study', url: '/companies/valkyrie-defense/', kw: 'itar cmmc scif nitro enclave defense' },
      { title: 'CyberShield SOC Operations — SIEM & Secret Redaction', cat: 'Case Study', url: '/companies/cybershield-siem/', kw: 'siem soc mitre nist secrets logs' },
      { title: 'TalentHub Global PeopleOps — GDPR Art. 9 HR Analytics', cat: 'Case Study', url: '/companies/talenthub-hr/', kw: 'gdpr article 9 pipeda hr recruitment' },
      { title: 'Ilya Sibiryakov — Chief Architect & Lead Author', cat: 'Fellow', url: '/fellows/ilya-sibiryakov/', kw: 'founder author ietf draft rfc brandmeweb' },
      { title: 'Cliford Fanyuy — Accredited Research Fellow', cat: 'Fellow', url: '/fellows/cliford-fanyuy/', kw: 'fellow researcher benchmark validation' }
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
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', 'ztds-cmd-list');
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
      list.setAttribute('aria-label', 'Search results');
      list.className = 'max-h-80 overflow-y-auto divide-y divide-slate-100 p-1.5';

      const footer = document.createElement('div');
      footer.className = 'px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500';
      const footerLeft = document.createElement('span');
      footerLeft.textContent = '\u2191\u2193 to navigate \u00b7 Enter to open';
      const footerRight = document.createElement('span');
      footerRight.textContent = 'ZTDS.ai Quick Jump';
      footer.appendChild(footerLeft);
      footer.appendChild(footerRight);

      panel.appendChild(topBar);
      panel.appendChild(list);
      panel.appendChild(footer);
      modal.appendChild(panel);
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.ztdsModal.close(modal);
      });

      // Collect current page h2, h3, and FAQ details sections dynamically (excluding mobile-only .no-print TOCs)
      const pageSections = [];
      document.querySelectorAll('main h2[id], main h3[id], main details[id]:not(.no-print) > summary').forEach((el) => {
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
          input.removeAttribute('aria-activedescendant');
          const empty = document.createElement('div');
          empty.className = 'py-8 px-4 text-center text-xs font-mono text-slate-500';
          empty.textContent = 'No matching route found. Try "rfc", "memo", "sdk", "mcp", "owasp", or "scanner".';
          list.appendChild(empty);
          return;
        }
        filtered.forEach((item, idx) => {
          const a = document.createElement('a');
          a.id = 'ztds-cmd-opt-' + idx;
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
        input.setAttribute('aria-activedescendant', 'ztds-cmd-opt-' + activeIdx);
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
        if (opts.length > 0) {
          input.setAttribute('aria-activedescendant', 'ztds-cmd-opt-' + activeIdx);
        } else {
          input.removeAttribute('aria-activedescendant');
        }
      }

      input.addEventListener('input', () => renderList(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && input.value.trim().length > 0) {
          e.preventDefault();
          e.stopPropagation();
          input.value = '';
          renderList('');
        } else if (e.key === 'ArrowDown') {
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
      const cmdSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      cmdSvg.setAttribute('class', 'w-3.5 h-3.5 text-slate-500');
      cmdSvg.setAttribute('fill', 'none');
      cmdSvg.setAttribute('stroke', 'currentColor');
      cmdSvg.setAttribute('stroke-width', '2');
      cmdSvg.setAttribute('viewBox', '0 0 24 24');
      cmdSvg.setAttribute('aria-hidden', 'true');
      const cmdPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cmdPath.setAttribute('stroke-linecap', 'round');
      cmdPath.setAttribute('stroke-linejoin', 'round');
      cmdPath.setAttribute('d', 'M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z');
      cmdSvg.appendChild(cmdPath);
      const cmdKbd = document.createElement('span');
      cmdKbd.className = 'hidden sm:inline';
      cmdKbd.textContent = '\u2318K';
      cmdBtn.appendChild(cmdSvg);
      cmdBtn.appendChild(cmdKbd);
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
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && !(e.target && e.target.isContentEditable)) {
          if (getOpenDialogs().length === 0) {
            e.preventDefault();
            openCmdPalette();
          }
        }
      }
    });
  } catch (_) {}

  // Global UX 7: Accessible Region Naming & 1-Click Copy Table as Markdown for CISO/GRC Matrices
  try {
    document.querySelectorAll('main .overflow-x-auto > table').forEach((table) => {
      const wrapper = table.parentElement;
      if (!wrapper || wrapper.dataset.tableCopyBound === 'true') return;
      wrapper.dataset.tableCopyBound = 'true';

      if (!wrapper.hasAttribute('tabindex')) {
        wrapper.setAttribute('tabindex', '0');
      }
      if (!wrapper.hasAttribute('role')) {
        wrapper.setAttribute('role', 'region');
      }
      const existingLabel = wrapper.getAttribute('aria-label') || '';
      if (!wrapper.hasAttribute('aria-labelledby') && (!existingLabel || existingLabel === 'Scrollable data table')) {
        const captionWithId = table.querySelector('caption[id]');
        const sectionEl = wrapper.closest('section, article, div');
        const headingWithId = captionWithId || (sectionEl ? sectionEl.querySelector('h2[id], h3[id]') : null);
        if (headingWithId && headingWithId.id) {
          wrapper.setAttribute('aria-labelledby', headingWithId.id);
          wrapper.removeAttribute('aria-label');
        } else if (!existingLabel) {
          wrapper.setAttribute('aria-label', 'Scrollable data table');
        }
      }

      const bar = document.createElement('div');
      bar.className = 'no-print flex justify-end mb-1.5';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy table as Markdown');
      btn.className = 'px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 font-mono text-xs font-semibold transition-colors cursor-pointer';
      btn.textContent = 'Copy Table (MD)';

      btn.addEventListener('click', () => {
        const rows = Array.from(table.querySelectorAll('tr'));
        if (!rows.length) return;
        const mdLines = [];
        rows.forEach((tr, rIdx) => {
          const cells = Array.from(tr.querySelectorAll('th, td')).map(c =>
            (c.textContent || '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
          );
          if (!cells.length) return;
          mdLines.push('| ' + cells.join(' | ') + ' |');
          if (rIdx === 0) {
            mdLines.push('| ' + cells.map(() => '---').join(' | ') + ' |');
          }
        });
        window.ztdsCopy(mdLines.join('\n'), () => {
          btn.textContent = 'Copied Markdown!';
          setTimeout(() => { btn.textContent = 'Copy Table (MD)'; }, 1600);
        });
      });

      wrapper.parentNode.insertBefore(bar, wrapper);
      bar.appendChild(btn);
    });
  } catch (_) {}

  // Global UX 8: CSP-Safe AI Citation Bar Copy Button ([data-ztds-copy-llm])
  try {
    document.querySelectorAll('[data-ztds-copy-llm]').forEach((btn) => {
      if (btn.dataset.llmCopyBound === 'true') return;
      btn.dataset.llmCopyBound = 'true';
      btn.addEventListener('click', () => {
        const raw = btn.getAttribute('data-ztds-copy-llm') || '';
        if (!raw) return;
        const labelEl = btn.querySelector('[data-ztds-copy-label]') || btn;
        const origText = labelEl.textContent;
        window.ztdsCopy(raw, () => {
          labelEl.textContent = 'Copied LLM Context';
          labelEl.classList.add('text-emerald-300', 'font-bold');
          setTimeout(() => {
            labelEl.textContent = origText;
            labelEl.classList.remove('font-bold');
          }, 2000);
        });
      });
    });
  } catch (_) {}

  // Global UX 8b: Declarative CSP-Safe Action Attributes ([data-ztds-print], [data-ztds-copy], [data-ztds-copy-target], [data-ztds-scroll-to])
  try {
    document.querySelectorAll('[data-ztds-print]').forEach((btn) => {
      if (btn.dataset.ztdsPrintBound === 'true') return;
      btn.dataset.ztdsPrintBound = 'true';
      btn.addEventListener('click', () => window.print());
    });

    document.querySelectorAll('[data-ztds-copy]').forEach((btn) => {
      if (btn.dataset.ztdsCopyBound === 'true') return;
      btn.dataset.ztdsCopyBound = 'true';
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-ztds-copy') || '';
        if (!text) return;
        const origText = btn.getAttribute('data-ztds-reset-label') || btn.textContent;
        const copiedLabel = btn.getAttribute('data-ztds-copied-label') || 'Copied!';
        window.ztdsCopy(text, () => {
          btn.textContent = copiedLabel;
          setTimeout(() => { btn.textContent = origText; }, 2000);
        });
      });
    });

    document.querySelectorAll('[data-ztds-copy-target]').forEach((btn) => {
      if (btn.dataset.ztdsCopyTargetBound === 'true') return;
      btn.dataset.ztdsCopyTargetBound = 'true';
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-ztds-copy-target') || '';
        const targetEl = targetId ? document.getElementById(targetId) : null;
        const text = targetEl ? (targetEl.textContent || '') : '';
        if (!text) return;
        const origText = btn.getAttribute('data-ztds-reset-label') || btn.textContent;
        const copiedLabel = btn.getAttribute('data-ztds-copied-label') || 'Copied!';
        window.ztdsCopy(text, () => {
          btn.textContent = copiedLabel;
          setTimeout(() => { btn.textContent = origText; }, 2000);
        });
      });
    });

    document.querySelectorAll('[data-ztds-scroll-to]').forEach((el) => {
      if (el.dataset.ztdsScrollBound === 'true') return;
      el.dataset.ztdsScrollBound = 'true';
      el.addEventListener('click', (e) => {
        const clickSelector = el.getAttribute('data-ztds-click-selector');
        if (clickSelector) {
          const triggerTarget = document.querySelector(clickSelector);
          if (triggerTarget && typeof triggerTarget.click === 'function') triggerTarget.click();
        }
        const targetId = el.getAttribute('data-ztds-scroll-to');
        const targetEl = targetId ? document.getElementById(targetId) : null;
        if (targetEl && typeof targetEl.scrollIntoView === 'function') {
          if (el.getAttribute('data-ztds-prevent-default') === 'true') e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  } catch (_) {}

  // Global UX 9: Sticky Header Scroll-State Fallback for browsers without CSS scroll-state queries
  try {
    const stickyHeader = document.querySelector('.ztds-sticky-header');
    const supportsScrollState = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('container-type', 'scroll-state');
    if (stickyHeader && !supportsScrollState) {
      let lastScrollY = window.scrollY;
      let headerTicking = false;
      window.addEventListener('scroll', () => {
        if (!headerTicking) {
          window.requestAnimationFrame(() => {
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const currentY = Math.max(0, Math.min(window.scrollY, maxScroll));
            if (currentY !== lastScrollY) {
              if (stickyHeader.matches(':focus-within') || currentY <= stickyHeader.offsetHeight) {
                stickyHeader.classList.remove('is-hidden');
              } else if (currentY > lastScrollY + 6) {
                stickyHeader.classList.add('is-hidden');
              } else if (currentY < lastScrollY - 6) {
                stickyHeader.classList.remove('is-hidden');
              }
              lastScrollY = currentY;
            }
            headerTicking = false;
          });
          headerTicking = true;
        }
      }, { passive: true });
    }
  } catch (_) {}
});

/**
 * Trusted-Types-Safe ZTDS Official SVG Badge DOM Builder (Zero innerHTML / Zero DOMParser HTML sink)
 */
window.ztdsCreateBadgeSvg = function(label, color, textColor, leftText) {
  const ns = 'http://www.w3.org/2000/svg';
  const fillRight = color || '#059669';
  const txtRightColor = textColor || '#ffffff';
  const leftLabel = String(leftText || 'ZTDS').trim();
  const labelRight = String(label || 'VERIFIED').trim().toUpperCase();
  const wLeft = Math.max(58, Math.round(leftLabel.length * 6.8 + 30));
  const wRight = Math.max(64, Math.round(labelRight.length * 6.8 + 16));
  const totalWidth = wLeft + wRight;
  const textXRight = wLeft + Math.round(wRight / 2);
  const clipId = 'ztdsBadgeClip_' + Math.random().toString(36).slice(2, 8);

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', String(totalWidth));
  svg.setAttribute('height', '22');
  svg.setAttribute('viewBox', '0 0 ' + totalWidth + ' 22');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', leftLabel + ' ' + labelRight);

  const defs = document.createElementNS(ns, 'defs');
  const clipPath = document.createElementNS(ns, 'clipPath');
  clipPath.setAttribute('id', clipId);
  const clipRect = document.createElementNS(ns, 'rect');
  clipRect.setAttribute('width', String(totalWidth));
  clipRect.setAttribute('height', '22');
  clipRect.setAttribute('rx', '4');
  clipPath.appendChild(clipRect);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  const gMain = document.createElementNS(ns, 'g');
  gMain.setAttribute('clip-path', 'url(#' + clipId + ')');

  const rLeft = document.createElementNS(ns, 'rect');
  rLeft.setAttribute('width', String(wLeft));
  rLeft.setAttribute('height', '22');
  rLeft.setAttribute('fill', '#0f172a');
  gMain.appendChild(rLeft);

  const rRight = document.createElementNS(ns, 'rect');
  rRight.setAttribute('x', String(wLeft));
  rRight.setAttribute('width', String(wRight));
  rRight.setAttribute('height', '22');
  rRight.setAttribute('fill', fillRight);
  gMain.appendChild(rRight);

  const rBorder = document.createElementNS(ns, 'rect');
  rBorder.setAttribute('width', String(totalWidth));
  rBorder.setAttribute('height', '22');
  rBorder.setAttribute('stroke', '#0f172a');
  rBorder.setAttribute('stroke-width', '1');
  rBorder.setAttribute('fill', 'none');
  gMain.appendChild(rBorder);

  const gIcon = document.createElementNS(ns, 'g');
  gIcon.setAttribute('transform', 'translate(6, 4)');
  const p1 = document.createElementNS(ns, 'path');
  p1.setAttribute('d', 'M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z');
  p1.setAttribute('fill', '#020617');
  p1.setAttribute('stroke', '#10b981');
  p1.setAttribute('stroke-width', '0.8');
  const p2 = document.createElementNS(ns, 'path');
  p2.setAttribute('d', 'M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z');
  p2.setAttribute('fill', '#020617');
  p2.setAttribute('stroke', '#10b981');
  p2.setAttribute('stroke-width', '0.8');
  const p3 = document.createElementNS(ns, 'path');
  p3.setAttribute('d', 'M7 3L9.5 7L7 11L4.5 7Z');
  p3.setAttribute('fill', '#10b981');
  const c1 = document.createElementNS(ns, 'circle');
  c1.setAttribute('cx', '7');
  c1.setAttribute('cy', '7');
  c1.setAttribute('r', '1');
  c1.setAttribute('fill', '#38bdf8');
  gIcon.append(p1, p2, p3, c1);
  gMain.appendChild(gIcon);

  const tLeft = document.createElementNS(ns, 'text');
  tLeft.setAttribute('x', '24');
  tLeft.setAttribute('y', '15');
  tLeft.setAttribute('font-family', "-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif");
  tLeft.setAttribute('font-size', '10');
  tLeft.setAttribute('font-weight', '700');
  tLeft.setAttribute('fill', '#f8fafc');
  tLeft.setAttribute('letter-spacing', '0.5');
  tLeft.textContent = leftLabel;
  gMain.appendChild(tLeft);

  const tRight = document.createElementNS(ns, 'text');
  tRight.setAttribute('x', String(textXRight));
  tRight.setAttribute('y', '15');
  tRight.setAttribute('text-anchor', 'middle');
  tRight.setAttribute('font-family', "-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif");
  tRight.setAttribute('font-size', '9');
  tRight.setAttribute('font-weight', '700');
  tRight.setAttribute('fill', txtRightColor);
  tRight.setAttribute('letter-spacing', '0.6');
  tRight.textContent = labelRight;
  gMain.appendChild(tRight);

  svg.appendChild(gMain);
  return svg;
};

window.ztdsMountBadgeSvg = function(mountEl, label, color, textColor, leftText) {
  if (!mountEl) return null;
  const svg = window.ztdsCreateBadgeSvg(label, color, textColor, leftText);
  mountEl.replaceChildren(svg);
  return svg;
};

/**
 * Universal Zero-Failure Clipboard Copier with Centralized Screen-Reader Announcer
 * Reliably handles HTTPS navigator.clipboard, fallback document.execCommand, and VoiceOver repeat-announcement deduplication.
 */
let ztdsLastCopyAnnouncement = '';
let ztdsCopyAnnounceTimer = null;

function ztdsAnnounceCopyOutcome(ok) {
  try {
    if (!document.body) return;
    let region = document.getElementById('ztds-copy-announcer');
    if (!region) {
      region = document.createElement('span');
      region.id = 'ztds-copy-announcer';
      region.setAttribute('role', 'status');
      region.className = 'ztds-sr-only';
      document.body.appendChild(region);
    }
    clearTimeout(ztdsCopyAnnounceTimer);
    let message = ok ? 'Copied to clipboard' : 'Copy failed';
    if (message === ztdsLastCopyAnnouncement) {
      message += '\u00A0';
    }
    ztdsLastCopyAnnouncement = message;
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = message;
    });
    ztdsCopyAnnounceTimer = setTimeout(() => {
      region.textContent = '';
    }, 2000);
  } catch (_) {}
}

window.ztdsCopy = function(text, onSuccess, onError) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        ztdsAnnounceCopyOutcome(true);
        if (onSuccess) onSuccess();
      })
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
      ztdsAnnounceCopyOutcome(true);
      if (onSuccess) onSuccess();
    } else {
      ztdsAnnounceCopyOutcome(false);
      if (onError) onError();
    }
  } catch (err) {
    ztdsAnnounceCopyOutcome(false);
    if (onError) onError(err);
  }
}
