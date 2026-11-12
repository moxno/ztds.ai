/**
 * ZTDS.ai — IETF Internet-Draft Reader Controller (CSP + Trusted Types Safe)
 * Handles mobile TOC toggle, heading collapse, keyboard Escape, and top-of-page scroll.
 */
(function () {
  'use strict';

  function initIetfDraftReader() {
    const toc = document.getElementById('toc');
    const toggleBtn = document.getElementById('mobile-menu-toggle');

    function setTocActive(nextState) {
      if (!toc) return;
      const isActive = typeof nextState === 'boolean'
        ? (toc.classList.toggle('active', nextState), nextState)
        : toc.classList.toggle('active');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', String(isActive));
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        setTocActive();
      });
    }

    if (toc) {
      const tocHeading = toc.querySelector('h2');
      if (tocHeading) {
        tocHeading.addEventListener('click', () => {
          setTocActive();
        });
      }
      const tocNav = toc.querySelector('nav');
      if (tocNav) {
        tocNav.addEventListener('click', () => {
          setTocActive(false);
        });
      }
    }

    document.querySelectorAll('a.toplink').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toc && toc.classList.contains('active')) {
        setTocActive(false);
        if (toggleBtn) toggleBtn.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIetfDraftReader);
  } else {
    initIetfDraftReader();
  }
})();
