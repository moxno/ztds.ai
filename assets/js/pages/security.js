(function () {
  'use strict';

document.getElementById('copy-pgp-btn').addEventListener('click', function() {
      const keyBlock = document.getElementById('pgp-key-block').innerText;
      window.ztdsCopy(keyBlock, () => {
        const textSpan = document.getElementById('copy-pgp-text');
        const origText = textSpan.innerText;
        textSpan.innerText = 'Key Copied to Clipboard';
        setTimeout(() => { textSpan.innerText = origText; }, 2500);
      });
    });
})();
