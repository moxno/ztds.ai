(function () {
  'use strict';

document.getElementById('btnCopyBibtex').addEventListener('click', () => {
      const bibtex = `@techreport{sibiryakov2026ztds,
  title={Zero-Trust Data Sanitization (ZTDS) Specification v1.0},
  author={Sibiryakov, Ilya},
  year={2026},
  institution={ZTDS AI Consortium},
  doi={10.5281/zenodo.22058770},
  url={https://ztds.ai/standard/}
}`;
      window.ztdsCopy(bibtex, () => {
        const btn = document.getElementById('btnCopyBibtex');
        if (!btn) return;
        const makeContent = (label, symbol, symbolClass) => {
          const s1 = document.createElement('span');
          s1.textContent = label;
          const s2 = document.createElement('span');
          s2.className = symbolClass;
          s2.textContent = symbol;
          btn.replaceChildren(s1, s2);
        };
        makeContent('Copied BibTeX!', '\u2713', 'text-emerald-600 font-bold');
        setTimeout(() => {
          makeContent('Copy BibTeX Entry', '\u2193', 'text-xs text-slate-400 font-mono');
        }, 2000);
      });
    });
})();
