(function () {
  'use strict';

document.getElementById('run-audit-btn').addEventListener('click', function() {
      const btn = this;
      btn.innerText = 'Auditing...';
      setTimeout(() => {
        const cookieLen = document.cookie.length;
        const cookieEl = document.getElementById('cookie-status');
        cookieEl.innerText = cookieLen === 0 ? '0 Bytes Detected' : cookieLen + ' Bytes Found';
        
        const storageKeys = Object.keys(localStorage).filter(k => !k.startsWith('ztds_test_'));
        const storageEl = document.getElementById('storage-status');
        storageEl.innerText = storageKeys.length === 0 ? '0 Tracking Keys' : storageKeys.length + ' Keys Stored';
        
        btn.innerText = 'Audit Re-verified';
      }, 350);
    });
})();
