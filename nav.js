/**
 * ZTDS.ai — Shared Accessible Mobile Navigation Controller
 * Handles mobile hamburger drawer open/close, backdrop blur, ESC key dismiss, and focus.
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
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
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });
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
