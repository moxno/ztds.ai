(function () {
  'use strict';

(function initWhitepaper() {
      const bibtexText = `@article{sibiryakov2026ztds,
  title     = {ZTDS: A Data-Plane Primitive for the AI Era -- Formal Specification, Cryptographic Isolation, and Subprocessor Elimination in Enterprise Generative Workloads},
  author    = {Sibiryakov, Ilya and {ZTDS AI Consortium Working Group}},
  journal   = {ZTDS Technical Consortium Publications},
  year      = {2026},
  month     = {September},
  doi       = {10.5281/zenodo.22058770},
  url       = {https://ztds.ai/whitepaper/},
  note      = {Ratified Specification RFC v1.0, OSF: 10.17605/OSF.IO/5BYJF, SSRN: 7335581}
}`;

      function handleCopy(btn) {
        if (window.ztdsCopy) {
          window.ztdsCopy(bibtexText, () => {
            if (btn) {
              const originalText = btn.innerText;
              btn.innerText = 'Citation Copied!';
              setTimeout(() => { btn.innerText = originalText; }, 2500);
            }
          });
        }
      }

      const btn1 = document.getElementById('btnCopyBibtex');
      if (btn1) btn1.addEventListener('click', () => handleCopy(btn1));

      const btn2 = document.getElementById('btnCopyBibtexBlock');
      if (btn2) btn2.addEventListener('click', () => handleCopy(btn2));

      const btnPrint = document.getElementById('btnPrintWhitepaper');
      if (btnPrint) {
        btnPrint.addEventListener('click', () => {
          window.print();
        });
      }
    })();
})();
