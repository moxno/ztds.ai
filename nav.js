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
