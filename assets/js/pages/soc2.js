(function () {
  'use strict';

// Controls Matrix Filter
    const filterBtns = document.querySelectorAll(".filter-btn");
    const controlRows = document.querySelectorAll(".control-row");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => {
          b.classList.remove("bg-slate-900", "text-white");
          b.classList.add("bg-white", "border", "border-slate-200", "text-slate-600");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("bg-slate-900", "text-white");
        btn.classList.remove("bg-white", "border", "border-slate-200", "text-slate-600");
        btn.setAttribute("aria-selected", "true");
        if (typeof btn.scrollIntoView === "function") {
          btn.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
        }

        const filter = btn.getAttribute("data-filter");
        controlRows.forEach(row => {
          if (filter === "all" || row.getAttribute("data-category") === filter) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });
    });

    // Copy All SIG Lite Answers
    document.getElementById("copyAllSigBtn").addEventListener("click", function() {
      const sigData = `# ZTDS.ai Pre-Filled Vendor Risk Assessment Pack (SIG Lite & CAIQ v4)\n\n` +
`## 1. Where is customer prompt data hosted or stored?\n` +
`**Response:** Nowhere. Cleartext data and session mappings reside strictly in volatile RAM. No data is written to disk, database, cookies, or cloud storage. When the user session closes or process terminates, state is permanently reclaimed.\n\n` +
`## 2. What data egresses to vendor servers during sanitization?\n` +
`**Response:** Exactly 0.00 bytes. Sanitization is completely self-contained in local WebAssembly/JavaScript. Proven via 5-Step DevTools Airplane Mode audit.\n\n` +
`## 3. Does vendor have access to customer encryption keys?\n` +
`**Response:** No. Token maps are encrypted client-side using Argon2id and XChaCha20-Poly1305. Vendor maintains zero access to keys (zero-knowledge architecture).\n\n` +
`## 4. What third-party subprocessors have access to customer cleartext data?\n` +
`**Response:** None. Zero third-party sanitization subprocessors are involved. Software operates strictly in host RAM as a local computational utility, eliminating intermediary sanitization subprocessor DPAs under GDPR Art. 28 and establishing a Technical Safe Harbor under GDPR Art. 32 & Recital 26 (CJEU SRB).\n\n` +
`## 5. How are vulnerabilities disclosed and audited?\n` +
`**Response:** Under RFC 9116 security.txt policy and ZTDS Coordinated Vulnerability Disclosure (CVD). PGP key: 0x1ECD5BB7.\n\n` +
`## 6. How does the software protect against prompt injection or malicious runtime tampering?\n` +
`**Response:** The engine runs in an isolated WebAssembly sandbox or pure JavaScript parser with zero dynamic eval() or external script injection. In-memory AST heuristic linting neutralizes malicious structures. Enterprise license tokens and entity profiles are signed with offline Ed25519 asymmetric signatures.\n\n` +
`## 7. What is the business continuity risk if ZTDS.ai experiences an infrastructure outage?\n` +
`**Response:** Exactly zero. Conforming ZTDS implementations operate with complete architectural independence. The runtime requires zero live connection to ZTDS.ai servers, APIs, or licensing databases. All core logic executes locally on client hardware or private enclaves, guaranteeing continuous operation.\n\n` +
`*Source: ZTDS.ai SOC 2 Trust Center (https://ztds.ai/soc2/)*`;

      window.ztdsCopy(sigData, () => {
        const textEl = document.getElementById("copyAllSigText");
        textEl.innerText = "Copied All Responses to Clipboard!";
        setTimeout(() => {
          textEl.innerText = "Copy All Responses (Markdown)";
        }, 2500);
      });
    });

    // Copy JSON Evidence Schema
    document.getElementById("copyJsonBtn").addEventListener("click", function() {
      const jsonText = document.getElementById("jsonContent").innerText;
      window.ztdsCopy(jsonText, () => {
        const textEl = document.getElementById("copyJsonText");
        textEl.innerText = "Copied JSON!";
        setTimeout(() => {
          textEl.innerText = "Copy JSON";
        }, 2000);
      });
    });
})();
