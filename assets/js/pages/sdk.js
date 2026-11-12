(function () {
  'use strict';

document.addEventListener('DOMContentLoaded', () => {
      // 1. Package Manager & Engine Switcher
      const pkgEngineBtns = document.querySelectorAll('.pkg-engine-btn');
      const pkgTabs = document.querySelectorAll('.pkg-tab-btn');
      const installDisplay = document.getElementById('installCmdDisplay');
      const copyInstallBtn = document.getElementById('copyInstallBtn');
      const copyInstallText = document.getElementById('copyInstallText');

      let currentEngine = 'enterprise'; // 'enterprise' | 'oss'
      let activePkg = 'npm';

      const pkgCommands = {
        enterprise: {
          npm: 'npm install @privacyscrubber/sdk',
          pnpm: 'pnpm add @privacyscrubber/sdk',
          yarn: 'yarn add @privacyscrubber/sdk',
          pip: 'pip install privacyscrubber'
        },
        oss: {
          npm: 'npx ztds-audit && npx ztds-mcp',
          pnpm: 'pnpm dlx ztds-audit',
          yarn: 'npx ztds-audit',
          pip: 'pip install ztds'
        }
      };

      function updateInstallCmd() {
        if (installDisplay) {
          installDisplay.textContent = pkgCommands[currentEngine][activePkg] || pkgCommands.enterprise.npm;
        }
      }

      pkgEngineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          pkgEngineBtns.forEach(b => {
            b.classList.remove('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
            b.classList.add('text-slate-600');
          });
          btn.classList.add('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
          btn.classList.remove('text-slate-600');
          currentEngine = btn.getAttribute('data-engine') || 'enterprise';
          updateInstallCmd();
        });
      });

      pkgTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          pkgTabs.forEach(t => {
            t.classList.remove('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
            t.classList.add('text-slate-600');
          });
          tab.classList.add('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
          tab.classList.remove('text-slate-600');

          activePkg = tab.getAttribute('data-mgr') || 'npm';
          updateInstallCmd();
        });
      });

      if (copyInstallBtn && copyInstallText) {
        copyInstallBtn.addEventListener('click', () => {
          const cmd = pkgCommands[currentEngine][activePkg] || pkgCommands.enterprise.npm;
          window.ztdsCopy(cmd, () => {
            copyInstallText.textContent = 'Copied!';
            setTimeout(() => { copyInstallText.textContent = 'Copy'; }, 2000);
          });
        });
      }

      // 1.1 30-Second Quickstart Language Tab Switcher
      const qsTabs = document.querySelectorAll('.quickstart-tab-btn');
      const qsTsBlock = document.getElementById('quickstartTsBlock');
      const qsPyBlock = document.getElementById('quickstartPyBlock');
      const copyQsBtn = document.getElementById('copyQuickstartBtn');
      let currentQsLang = 'ts';

      qsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          qsTabs.forEach(t => {
            t.classList.remove('bg-slate-800', 'text-emerald-400', 'font-bold');
            t.classList.add('text-slate-400');
          });
          tab.classList.add('bg-slate-800', 'text-emerald-400', 'font-bold');
          tab.classList.remove('text-slate-400');
          currentQsLang = tab.getAttribute('data-lang') || 'ts';
          if (currentQsLang === 'ts') {
            if (qsTsBlock) qsTsBlock.classList.remove('hidden');
            if (qsPyBlock) qsPyBlock.classList.add('hidden');
          } else {
            if (qsPyBlock) qsPyBlock.classList.remove('hidden');
            if (qsTsBlock) qsTsBlock.classList.add('hidden');
          }
        });
      });

      if (copyQsBtn) {
        copyQsBtn.addEventListener('click', () => {
          const activeBlock = currentQsLang === 'ts' ? qsTsBlock : qsPyBlock;
          const code = activeBlock ? (activeBlock.querySelector('code')?.innerText || activeBlock.innerText) : '';
          window.ztdsCopy(code, () => {
            copyQsBtn.textContent = 'Copied!';
            setTimeout(() => { copyQsBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      // 2. Recipe Framework Tab Switcher
      const recipeTabs = document.querySelectorAll('.recipe-tab-btn');
      const recipePanes = document.querySelectorAll('.recipe-pane');
      const activeFileName = document.getElementById('activeFileName');
      const btnCopyActiveCode = document.getElementById('btnCopyActiveCode');

      const fileNames = {
        langchain: 'ztds-langchain-callback.ts',
        llamaindex: 'ztds_llamaindex_transform.py',
        crewai: 'ztds_crewai_role_filter.py',
        ollama: 'ztds-ollama-stream.js',
        mcp: 'mcp-config.json',
        pinecone: 'ztds-pinecone-rag.ts',
        nextjs: 'app/api/chat/route.ts',
        envoy: 'envoy-ztds-filter.yaml',
        kafka: 'ztds-kafka-stream.js',
        chromemv3: 'content-script-ztds.js'
      };

      let currentRecipe = 'langchain';

      recipeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          recipeTabs.forEach(t => {
            t.classList.remove('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
            t.classList.add('text-slate-600');
          });
          tab.classList.add('bg-white', 'text-slate-900', 'font-bold', 'shadow-xs');
          tab.classList.remove('text-slate-600');

          currentRecipe = tab.getAttribute('data-recipe');
          if (activeFileName) {
            activeFileName.textContent = fileNames[currentRecipe] || 'recipe.ts';
          }

          recipePanes.forEach(pane => {
            if (pane.id === 'recipe' + currentRecipe.charAt(0).toUpperCase() + currentRecipe.slice(1)) {
              pane.classList.remove('hidden');
            } else {
              pane.classList.add('hidden');
            }
          });
        });
      });

      // 3. Copy Active Snippet Button
      if (btnCopyActiveCode) {
        btnCopyActiveCode.addEventListener('click', () => {
          const targetPaneId = 'recipe' + currentRecipe.charAt(0).toUpperCase() + currentRecipe.slice(1);
          const activePane = document.getElementById(targetPaneId);
          if (!activePane) return;
          const codeEl = activePane.querySelector('code');
          const codeText = codeEl ? codeEl.innerText : activePane.innerText;

          window.ztdsCopy(codeText, () => {
            btnCopyActiveCode.textContent = 'Copied!';
            setTimeout(() => { btnCopyActiveCode.textContent = 'Copy Snippet'; }, 2000);
          });
        });
      }

      // 4. MCP Client Config Tab Switcher
      const mcpClientBtns = document.querySelectorAll('.mcp-client-btn');
      const mcpConfigFilePath = document.getElementById('mcpConfigFilePath');
      const mcpConfigCodeDisplay = document.getElementById('mcpConfigCodeDisplay');
      const copyMcpConfigBtn = document.getElementById('copyMcpConfigBtn');

      const mcpConfigs = {
        cursor: {
          path: '.cursor/mcp.json',
          code: `{\n  "mcpServers": {\n    "ztds": {\n      "command": "npx",\n      "args": ["-y", "ztds-mcp"]\n    },\n    "privacyscrubber": {\n      "command": "npx",\n      "args": ["-y", "@privacyscrubber/mcp-server@latest"],\n      "env": {\n        "ZTDS_PROFILE": "dev",\n        "ZTDS_LOCAL_ONLY": "true"\n      }\n    }\n  }\n}`
        },
        desktop: {
          path: 'claude_desktop_config.json',
          code: `{\n  "mcpServers": {\n    "ztds": {\n      "command": "npx",\n      "args": ["-y", "ztds-mcp"]\n    },\n    "privacyscrubber": {\n      "command": "npx",\n      "args": ["-y", "@privacyscrubber/mcp-server@latest"],\n      "env": {\n        "ZTDS_PROFILE": "dev"\n      }\n    }\n  }\n}`
        },
        cli: {
          path: 'Terminal Command',
          code: `# Open Reference Server (Anthropic Registry io.github.moxno/ztds):\nclaude mcp add ztds npx -y ztds-mcp\n\n# Enterprise 30-Profile Suite (Anthropic Registry io.github.moxno/privacyscrubber-mcp):\nclaude mcp add privacyscrubber npx -y @privacyscrubber/mcp-server@latest`
        },
        zed: {
          path: 'settings.json (context_servers)',
          code: `{\n  "context_servers": {\n    "ztds": {\n      "command": "npx",\n      "args": ["-y", "ztds-mcp"]\n    },\n    "privacyscrubber": {\n      "command": "npx",\n      "args": ["-y", "@privacyscrubber/mcp-server@latest"]\n    }\n  }\n}`
        }
      };

      let activeMcpClient = 'cursor';

      mcpClientBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          mcpClientBtns.forEach(b => {
            b.className = 'mcp-client-btn px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 font-semibold text-xs touch-target';
            b.setAttribute('aria-selected', 'false');
          });
          btn.className = 'mcp-client-btn px-2.5 py-1 rounded-md bg-slate-900 text-white font-bold shadow-xs text-xs touch-target';
          btn.setAttribute('aria-selected', 'true');

          activeMcpClient = btn.getAttribute('data-client') || 'cursor';
          const cfg = mcpConfigs[activeMcpClient] || mcpConfigs.cursor;
          if (mcpConfigFilePath) mcpConfigFilePath.textContent = cfg.path;
          if (mcpConfigCodeDisplay) mcpConfigCodeDisplay.textContent = cfg.code;
        });
      });

      if (copyMcpConfigBtn) {
        copyMcpConfigBtn.addEventListener('click', () => {
          const cfg = mcpConfigs[activeMcpClient] || mcpConfigs.cursor;
          window.ztdsCopy(cfg.code, () => {
            copyMcpConfigBtn.textContent = 'Copied!';
            setTimeout(() => { copyMcpConfigBtn.textContent = 'Copy Config'; }, 2000);
          });
        });
      }

      // 5. GitHub Actions Workflow Copier
      const copyGhActionBtn = document.getElementById('copyGhActionBtn');
      const ghActionYamlDisplay = document.getElementById('ghActionYamlDisplay');

      if (copyGhActionBtn && ghActionYamlDisplay) {
        copyGhActionBtn.addEventListener('click', () => {
          window.ztdsCopy(ghActionYamlDisplay.innerText, () => {
            copyGhActionBtn.textContent = 'Copied!';
            setTimeout(() => { copyGhActionBtn.textContent = 'Copy Workflow YAML'; }, 2000);
          });
        });
      }

      // 6. Interactive Offline Ed25519 License Tester
      const btnLoadEntSample = document.getElementById('btnLoadEntSample');
      const btnLoadDevSample = document.getElementById('btnLoadDevSample');
      const btnDecodeLicense = document.getElementById('btnDecodeLicense');
      const licenseTokenInput = document.getElementById('licenseTokenInput');
      const licenseResultContainer = document.getElementById('licenseResultContainer');
      const licenseStatusBadge = document.getElementById('licenseStatusBadge');
      const licenseVerifyMetric = document.getElementById('licenseVerifyMetric');

      const resLicenseId = document.getElementById('resLicenseId');
      const resCustomer = document.getElementById('resCustomer');
      const resTier = document.getElementById('resTier');
      const resMaxNodes = document.getElementById('resMaxNodes');
      const resValidity = document.getElementById('resValidity');
      const resProfiles = document.getElementById('resProfiles');

      const LICENSE_SPKI_B64 = 'MCowBQYDK2VwAyEA4aQfaGa+ZbbAGWDjKBblHpO71vEqQaDsUG8FPhtYBJU=';
      const SAMPLE_ENT_TOKEN = 'ZTDS-LIC-v1.eyJjdXN0b21lcl9uYW1lIjoiQWNtZSBHbG9iYWwgSGVhbHRoIiwiZXhwaXJlc19hdCI6IjIwMjgtMDktMTVUMDA6MDA6MDAuMDAwWiIsImZlYXR1cmVzIjp7ImFsbG93ZWRfcHJvZmlsZXMiOlsiKiJdLCJldmlkZW5jZV9iaW5kZXIiOnRydWUsInNwZWNpYWxpemVkX3Byb2ZpbGVzIjp0cnVlLCJ1bml2ZXJzYWxfcGlpIjp0cnVlfSwiZ3JhY2VfcGVyaW9kX2RheXMiOjYwLCJpc3N1ZWRfYXQiOiIyMDI2LTA5LTE1VDAwOjAwOjAwLjAwMFoiLCJsaWNlbnNlX2lkIjoiWlREUy0yMDI2LUVOVC0wMDAxIiwibWF4X25vZGVzIjo1LCJ0aWVyIjoiZW50ZXJwcmlzZV9haXJnYXBwZWQifQ.pYZlq_Vn0B6DPHord9GUiocE5sPzuVkw6yI6vqskXVHr43qrujJREaBsa2VusgX1CyGzVoM4eYWDprM5VCVTBA';
      const SAMPLE_DEV_TOKEN = 'ZTDS-LIC-v1.eyJjdXN0b21lcl9uYW1lIjoiU3RhcnR1cCBBSSBMYWJzIiwiZXhwaXJlc19hdCI6IjIwMjgtMDktMTZUMDA6MDA6MDAuMDAwWiIsImZlYXR1cmVzIjp7ImFsbG93ZWRfcHJvZmlsZXMiOlsidW5pdmVyc2FsIl0sInNwZWNpYWxpemVkX3Byb2ZpbGVzIjpmYWxzZSwidW5pdmVyc2FsX3BpaSI6dHJ1ZX0sImdyYWNlX3BlcmlvZF9kYXlzIjowLCJpc3N1ZWRfYXQiOiIyMDI2LTA5LTE2VDAwOjAwOjAwLjAwMFoiLCJsaWNlbnNlX2lkIjoiWlREUy0yMDI2LUVWQUwtMDAwMiIsIm1heF9ub2RlcyI6MiwidGllciI6ImRldmVsb3Blcl9ldmFsIn0.jpkhNbUz8O917wM5ofoC6XVfnPrHmr_AWF9JK8hx6ihUe8gCX-7NcoH6DFC1YUP-3WhD8pppXXX8iUUqmoEdDw';

      function base64UrlToBytes(str) {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const bin = window.atob(base64);
        const out = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
        return out;
      }

      function canonicalizeJsonBrowser(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(canonicalizeJsonBrowser);
        const sorted = {};
        Object.keys(obj).sort().forEach(k => { sorted[k] = canonicalizeJsonBrowser(obj[k]); });
        return sorted;
      }

      async function executeLicenseCheck() {
        const token = (licenseTokenInput.value || '').trim();
        if (!token) return;

        const t0 = performance.now();
        const parts = token.split('.');
        if (parts.length !== 3 || parts[0] !== 'ZTDS-LIC-v1') {
          licenseResultContainer.classList.remove('hidden');
          licenseStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
          licenseStatusBadge.textContent = 'FAIL: MALFORMED TOKEN SYNTAX (Expected ZTDS-LIC-v1.<payload>.<sig>)';
          resLicenseId.textContent = 'ERROR';
          resCustomer.textContent = 'ERROR';
          resTier.textContent = 'INVALID';
          resMaxNodes.textContent = '0';
          resValidity.textContent = 'Malformed token payload';
          resProfiles.textContent = 'None';
          licenseVerifyMetric.textContent = 'Verification Latency: < 0.05 ms';
          return;
        }

        try {
          const payloadBytes = base64UrlToBytes(parts[1]);
          const sigBytes = base64UrlToBytes(parts[2]);
          const payloadJson = new TextDecoder().decode(payloadBytes);
          const payload = JSON.parse(payloadJson);
          const canonicalBytes = new TextEncoder().encode(JSON.stringify(canonicalizeJsonBrowser(payload)));

          let sigValid = false;
          if (window.crypto && window.crypto.subtle) {
            const spkiBytes = base64UrlToBytes(LICENSE_SPKI_B64);
            const pubKey = await window.crypto.subtle.importKey('spki', spkiBytes.buffer, { name: 'Ed25519' }, false, ['verify']);
            sigValid = await window.crypto.subtle.verify('Ed25519', pubKey, sigBytes.buffer, canonicalBytes.buffer);
          }

          const t1 = performance.now();
          const latencyUs = Math.max(80, Math.round((t1 - t0) * 1000));
          licenseResultContainer.classList.remove('hidden');

          if (!sigValid) {
            licenseStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
            licenseStatusBadge.textContent = 'FAIL: INVALID ED25519 SIGNATURE (TAMPERED OR UNTRUSTED KEY)';
            resLicenseId.textContent = 'TAMPERED';
            resCustomer.textContent = 'REJECTED';
            resTier.textContent = 'UNAUTHORIZED';
            resMaxNodes.textContent = '0';
            resValidity.textContent = 'Cryptographic signature verification failed';
            resProfiles.textContent = 'None';
            licenseVerifyMetric.textContent = `Verification Latency: ${latencyUs} μs (WebCrypto Ed25519)`;
            return;
          }

          const expMs = payload.expires_at ? Date.parse(payload.expires_at) : 0;
          const graceMs = ((payload.grace_period_days || 0) * 86400000);
          if (expMs && Date.now() > expMs + graceMs) {
            licenseStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
            licenseStatusBadge.textContent = 'FAIL: LICENSE EXPIRED PAST GRACE WINDOW';
          } else {
            licenseStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            licenseStatusBadge.textContent = 'PASS: VALID ED25519 CRYPTOGRAPHIC SIGNATURE';
          }

          resLicenseId.textContent = payload.license_id || 'ZTDS-CUSTOM';
          resCustomer.textContent = payload.customer_name || 'Enterprise Customer';
          resTier.textContent = (payload.tier || 'standard').toUpperCase();
          resMaxNodes.textContent = `${payload.max_nodes || 1} Microservice Nodes`;

          const expDate = payload.expires_at ? payload.expires_at.split('T')[0] : 'PERPETUAL';
          resValidity.textContent = `Valid through ${expDate} · ${payload.grace_period_days ?? 0}-day Grace Window`;

          if (payload.features && payload.features.specialized_profiles) {
            resProfiles.textContent = 'Wildcard [*] · All 30 Regulatory Profiles (HIPAA, PCI-DSS, Legal, Telecom, Energy)';
          } else {
            resProfiles.textContent = 'Universal PII Baseline (14-Day Eval / Standard)';
          }

          licenseVerifyMetric.textContent = `Verification Latency: ${latencyUs} μs (WebCrypto Ed25519)`;
        } catch (err) {
          licenseResultContainer.classList.remove('hidden');
          licenseStatusBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
          licenseStatusBadge.textContent = 'FAIL: CRYPTOGRAPHIC DECODE ERROR';
        }
      }

      if (btnLoadEntSample) {
        btnLoadEntSample.addEventListener('click', () => {
          licenseTokenInput.value = SAMPLE_ENT_TOKEN;
          executeLicenseCheck();
        });
      }

      if (btnLoadDevSample) {
        btnLoadDevSample.addEventListener('click', () => {
          licenseTokenInput.value = SAMPLE_DEV_TOKEN;
          executeLicenseCheck();
        });
      }

      if (btnDecodeLicense) {
        btnDecodeLicense.addEventListener('click', executeLicenseCheck);
      }

      // ==========================================
      // 8. COMMERCIAL GATEWAY & TRIAL MODAL CONTROLLER
      // ==========================================
      const modal = document.getElementById('checkoutModal');
      const btnOpenModal = document.getElementById('btnOpenCheckoutModal');
      const btnCloseModal = document.getElementById('btnCloseCheckoutModal');

      const tabBuy = document.getElementById('tabCheckoutBuy');
      const tabTrial = document.getElementById('tabCheckoutTrial');
      const tabInvoice = document.getElementById('tabCheckoutInvoice');

      const paneBuy = document.getElementById('paneCheckoutBuy');
      const paneTrial = document.getElementById('paneCheckoutTrial');
      const paneInvoice = document.getElementById('paneCheckoutInvoice');

      const btnIntervalAnnual = document.getElementById('btnIntervalAnnual');
      const btnIntervalMonthly = document.getElementById('btnIntervalMonthly');
      const btnLaunchPaddle = document.getElementById('btnLaunchPaddleCheckout');
      const btnLaunchPaddleText = document.getElementById('btnLaunchPaddleText');

      const btnTierDeveloper = document.getElementById('btnTierDeveloper');
      const btnTierTeams = document.getElementById('btnTierTeams');
      const dotTierDeveloper = document.getElementById('dotTierDeveloper');
      const dotTierTeams = document.getElementById('dotTierTeams');

      let currentInterval = 'annual'; // 'annual' | 'monthly'
      let currentTier = 'developer_pro'; // 'developer_pro' | 'teams'

      function openModal(preselectedTier = null) {
        if (modal) {
          if (window.ztdsModal) {
            window.ztdsModal.open(modal, '#btnCloseCheckoutModal');
          } else {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
          }
          switchTab('buy');
          if (preselectedTier) selectTier(preselectedTier);
        }
      }

      function closeModal() {
        if (modal) {
          if (window.ztdsModal) {
            window.ztdsModal.close(modal);
          } else {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          }
        }
      }

      const btnOpenTeams = document.getElementById('btnOpenCheckoutTeams');
      if (btnOpenModal) btnOpenModal.addEventListener('click', () => openModal('developer_pro'));
      if (btnOpenTeams) btnOpenTeams.addEventListener('click', () => openModal('teams'));
      if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });

      function switchTab(tabKey) {
        const tabs = [tabBuy, tabTrial, tabInvoice];
        const panes = [paneBuy, paneTrial, paneInvoice];

        tabs.forEach(t => {
          if (t) {
            t.classList.remove('border-emerald-600', 'text-emerald-700', 'font-bold');
            t.classList.add('border-transparent', 'text-slate-500', 'font-semibold');
          }
        });
        panes.forEach(p => {
          if (p) p.classList.add('hidden');
        });

        if (tabKey === 'buy') {
          if (tabBuy) {
            tabBuy.classList.add('border-emerald-600', 'text-emerald-700', 'font-bold');
            tabBuy.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
          }
          if (paneBuy) paneBuy.classList.remove('hidden');
        } else if (tabKey === 'trial') {
          if (tabTrial) {
            tabTrial.classList.add('border-emerald-600', 'text-emerald-700', 'font-bold');
            tabTrial.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
          }
          if (paneTrial) paneTrial.classList.remove('hidden');
        } else if (tabKey === 'invoice') {
          if (tabInvoice) {
            tabInvoice.classList.add('border-emerald-600', 'text-emerald-700', 'font-bold');
            tabInvoice.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
          }
          if (paneInvoice) paneInvoice.classList.remove('hidden');
        }
      }

      if (tabBuy) tabBuy.addEventListener('click', () => switchTab('buy'));
      if (tabTrial) tabTrial.addEventListener('click', () => switchTab('trial'));
      if (tabInvoice) tabInvoice.addEventListener('click', () => switchTab('invoice'));

      function updatePricingLabels() {
        const isAnnual = currentInterval === 'annual';
        const labelPriceDev = document.getElementById('labelPriceDeveloper');
        const labelPriceTeams = document.getElementById('labelPriceTeams');
        if (labelPriceDev) labelPriceDev.textContent = 'Certified via PrivacyScrubber';
        if (labelPriceTeams) labelPriceTeams.textContent = 'Certified via PrivacyScrubber';

        const labelIntervalAnn = document.getElementById('labelIntervalAnnual');
        const labelIntervalMon = document.getElementById('labelIntervalMonthly');
        if (labelIntervalAnn) labelIntervalAnn.textContent = 'Annual Licensing';
        if (labelIntervalMon) labelIntervalMon.textContent = 'Monthly Licensing';

        if (btnLaunchPaddleText) {
          const tierLabel = currentTier === 'developer_pro' ? 'Developer Pro SDK' : 'ZTDS TEAMS';
          const cycleLabel = isAnnual ? 'Annual' : 'Monthly';
          btnLaunchPaddleText.textContent = `Continue to PrivacyScrubber.com (${tierLabel} · ${cycleLabel}) →`;
        }
      }

      function selectTier(tier) {
        currentTier = tier;
        if (tier === 'developer_pro') {
          if (btnTierDeveloper) btnTierDeveloper.className = 'p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 text-left transition-all cursor-pointer';
          if (btnTierTeams) btnTierTeams.className = 'p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer';
          if (dotTierDeveloper) dotTierDeveloper.className = 'w-2 h-2 rounded-full bg-emerald-500';
          if (dotTierTeams) dotTierTeams.className = 'w-2 h-2 rounded-full bg-slate-300';
        } else {
          if (btnTierTeams) btnTierTeams.className = 'p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 text-left transition-all cursor-pointer';
          if (btnTierDeveloper) btnTierDeveloper.className = 'p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer';
          if (dotTierTeams) dotTierTeams.className = 'w-2 h-2 rounded-full bg-emerald-500';
          if (dotTierDeveloper) dotTierDeveloper.className = 'w-2 h-2 rounded-full bg-slate-300';
        }
        updatePricingLabels();
      }

      if (btnTierDeveloper) btnTierDeveloper.addEventListener('click', () => selectTier('developer_pro'));
      if (btnTierTeams) btnTierTeams.addEventListener('click', () => selectTier('teams'));

      // Interval Toggle
      if (btnIntervalAnnual && btnIntervalMonthly) {
        btnIntervalAnnual.addEventListener('click', () => {
          currentInterval = 'annual';
          btnIntervalAnnual.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 font-bold shadow-xs transition-all flex items-center justify-center gap-1.5';
          btnIntervalMonthly.className = 'flex-1 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-all';
          updatePricingLabels();
        });

        btnIntervalMonthly.addEventListener('click', () => {
          currentInterval = 'monthly';
          btnIntervalMonthly.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 font-bold shadow-xs transition-all flex items-center justify-center gap-1.5';
          btnIntervalAnnual.className = 'flex-1 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-all flex items-center justify-center gap-1.5';
          updatePricingLabels();
        });
      }

      // PrivacyScrubber Commercial Gateway Redirect (Two-Brand Firewall)
      if (btnLaunchPaddle) {
        btnLaunchPaddle.addEventListener('click', () => {
          const company = (document.getElementById('checkoutCompany')?.value || '').trim();
          const email = (document.getElementById('checkoutEmail')?.value || '').trim();
          const domain = (document.getElementById('checkoutDomain')?.value || '').trim();

          const targetUrl = new URL('https://privacyscrubber.com/pricing/');
          const targetTier = currentTier === 'developer_pro' ? 'SDK' : 'TEAMS';
          targetUrl.searchParams.set('tier', targetTier);
          targetUrl.searchParams.set('interval', currentInterval);
          if (company) targetUrl.searchParams.set('company', company);
          if (email) targetUrl.searchParams.set('email', email);
          if (domain) targetUrl.searchParams.set('domain', domain);
          targetUrl.searchParams.set('utm_source', 'ztds.ai');
          targetUrl.searchParams.set('utm_medium', 'consortium_ref');
          targetUrl.searchParams.set('utm_campaign', 'sdk_pricing');

          window.open(targetUrl.toString(), '_blank', 'noopener,noreferrer');
        });
      }

      // 9. Initial Hash & Hashchange Navigation Controller
      function handleUrlHash() {
        const hash = window.location.hash.toLowerCase();
        if (!hash) return;

        if (hash === '#trial' || hash === '#trial-workbench') {
          const el = document.getElementById('trial') || document.getElementById('trial-workbench');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash === '#mcp' || hash === '#mcp-gateway') {
          const el = document.getElementById('mcp') || document.getElementById('mcp-gateway');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (hash === '#mcp-recipe' || hash === '#recipe-mcp') {
          const mcpTab = document.querySelector('.recipe-tab-btn[data-recipe="mcp"]');
          if (mcpTab) mcpTab.click();
          const connectorsEl = document.getElementById('connectors');
          if (connectorsEl) connectorsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash.startsWith('#blueprint-') || hash.startsWith('#recipe-') || hash.startsWith('#recipe')) {
          const recipeName = hash.replace(/^#(?:blueprint|recipe)-?/, '');
          const tab = document.querySelector('.recipe-tab-btn[data-recipe="' + recipeName + '"]');
          if (tab) tab.click();
          const connectorsEl = document.getElementById('connectors');
          if (connectorsEl) connectorsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash === '#commercial-checkout' || hash === '#licensing' || hash === '#pricing') {
          const el = document.getElementById('licensing') || document.getElementById('commercial-checkout');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash === '#middleware') {
          const el = document.getElementById('connectors');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash === '#faq') {
          const el = document.getElementById('faq');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (hash === '#teams') {
          const el = document.getElementById('licensing');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          openModal('teams');
        }
      }

      setTimeout(handleUrlHash, 100);
      window.addEventListener('hashchange', handleUrlHash);

      // ==========================================
      // 10. TRIAL WORKBENCH CONTROLLER (#trial)
      // ==========================================
      const trialCompanyInput = document.getElementById('trialWorkbenchCompany');
      const trialEmailInput = document.getElementById('trialWorkbenchEmail');
      const trialProfileSelect = document.getElementById('trialWorkbenchProfile');
      const targetPills = document.querySelectorAll('.trial-target-pill');
      const btnMintWorkbench = document.getElementById('btnMintWorkbench');
      const btnMintWorkbenchText = document.getElementById('btnMintWorkbenchText');
      const trialMintStatus = document.getElementById('trialMintStatus');

      const trialWorkbenchResults = document.getElementById('trialWorkbenchResults');
      const workbenchStatusBadge = document.getElementById('workbenchStatusBadge');
      const workbenchExpiresAt = document.getElementById('workbenchExpiresAt');
      const workbenchLicenseId = document.getElementById('workbenchLicenseId');
      const workbenchCustomerName = document.getElementById('workbenchCustomerName');
      const workbenchMaxNodes = document.getElementById('workbenchMaxNodes');
      const workbenchProfileBadge = document.getElementById('workbenchProfileBadge');
      const workbenchTokenDisplay = document.getElementById('workbenchTokenDisplay');

      const snippetTabBtns = document.querySelectorAll('.snippet-tab-btn');
      const workbenchSnippetCode = document.getElementById('workbenchSnippetCode');
      const btnCopyWorkbenchToken = document.getElementById('btnCopyWorkbenchToken');
      const btnCopyWorkbenchSnippet = document.getElementById('btnCopyWorkbenchSnippet');
      const btnDownloadWorkbenchJson = document.getElementById('btnDownloadWorkbenchLicenseJson');
      const btnVerifyWorkbenchDecoder = document.getElementById('btnVerifyWorkbenchInDecoder');

      let currentWorkbenchTarget = 'mcp';
      let currentWorkbenchSnippets = null;
      let currentWorkbenchData = null;

      const PROFILE_LABELS = {
        universal: 'Universal PII (Baseline)',
        fintech: 'Fintech (PCI-DSS v4 & IBAN)',
        healthcare: 'Healthcare (HIPAA PHI)',
        legal: 'Legal (FRE 502 Privilege)',
        all: 'Wildcard [*] All 30 Profiles'
      };

      // Target Pills Switcher
      targetPills.forEach(pill => {
        pill.addEventListener('click', () => {
          targetPills.forEach(p => {
            p.className = 'trial-target-pill px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium transition-all cursor-pointer';
          });
          pill.className = 'trial-target-pill px-3 py-1.5 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer';
          currentWorkbenchTarget = pill.getAttribute('data-target') || 'mcp';
          updateWorkbenchSnippetTab(currentWorkbenchTarget);
        });
      });

      function updateWorkbenchSnippetTab(targetKey) {
        currentWorkbenchTarget = targetKey;
        snippetTabBtns.forEach(btn => {
          if (btn.getAttribute('data-target') === targetKey) {
            btn.className = 'snippet-tab-btn active px-2.5 py-1 rounded text-xs bg-slate-800 text-emerald-400 font-bold transition-colors cursor-pointer';
          } else {
            btn.className = 'snippet-tab-btn px-2.5 py-1 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer';
          }
        });

        if (!currentWorkbenchSnippets) return;

        let codeText = '';
        if (targetKey === 'mcp') {
          codeText = typeof currentWorkbenchSnippets.mcp === 'object'
            ? JSON.stringify(currentWorkbenchSnippets.mcp, null, 2)
            : (currentWorkbenchSnippets.mcp || '');
        } else if (targetKey === 'node') {
          codeText = currentWorkbenchSnippets.node || '';
        } else if (targetKey === 'python') {
          codeText = currentWorkbenchSnippets.python || '';
        } else if (targetKey === 'docker') {
          codeText = currentWorkbenchSnippets.docker || '';
        }

        if (workbenchSnippetCode) {
          workbenchSnippetCode.textContent = codeText;
        }
      }

      snippetTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.getAttribute('data-target');
          if (t) {
            // Also sync target pills if present
            targetPills.forEach(p => {
              if (p.getAttribute('data-target') === t) {
                p.className = 'trial-target-pill px-3 py-1.5 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer';
              } else {
                p.className = 'trial-target-pill px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium transition-all cursor-pointer';
              }
            });
            updateWorkbenchSnippetTab(t);
          }
        });
      });

      // Mint 14-Day Evaluation Key (Workbench)
      if (btnMintWorkbench) {
        btnMintWorkbench.addEventListener('click', async () => {
          const company = (trialCompanyInput?.value || '').trim();
          const email = (trialEmailInput?.value || '').trim();
          const profile = trialProfileSelect?.value || 'universal';

          if (!company || company.length < 2) {
            if (trialMintStatus) {
              trialMintStatus.classList.remove('hidden');
              trialMintStatus.textContent = 'Please enter your company or developer name (at least 2 characters).';
            }
            trialCompanyInput?.focus();
            return;
          }

          if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
            if (trialMintStatus) {
              trialMintStatus.classList.remove('hidden');
              trialMintStatus.textContent = 'Please enter a valid corporate work email address (e.g., engineer@company.com) to receive your signed 14-day evaluation key.';
            }
            trialEmailInput?.focus();
            return;
          }

          if (trialMintStatus) trialMintStatus.classList.add('hidden');
          const savedWorkbenchBtnNodes = Array.from(btnMintWorkbench.childNodes).map(n => n.cloneNode(true));
          btnMintWorkbench.disabled = true;
          if (btnMintWorkbenchText) btnMintWorkbenchText.textContent = 'Dispatching Signed Ed25519 Key...';

          try {
            const res = await fetch('/api/mint-license/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerName: company,
                email: email,
                tier: 'developer_eval',
                days: 14,
                profile: profile
              })
            });

            const data = await res.json();
            if (res.ok && (data.token || data.deliveryMode === 'email_dispatched')) {
              currentWorkbenchData = data;
              currentWorkbenchSnippets = data.quickstart;

              if (trialWorkbenchResults) trialWorkbenchResults.classList.remove('hidden');
              if (workbenchLicenseId) workbenchLicenseId.textContent = data.licenseId;
              if (workbenchCustomerName) workbenchCustomerName.textContent = data.customerName;
              if (workbenchExpiresAt) workbenchExpiresAt.textContent = 'Valid through ' + (data.expiresAt ? data.expiresAt.split('T')[0] : '14 days');
              if (workbenchMaxNodes) workbenchMaxNodes.textContent = `${data.maxNodes || 2} Microservice Nodes`;
              if (workbenchProfileBadge) workbenchProfileBadge.textContent = PROFILE_LABELS[data.profile] || data.profile;
              if (workbenchTokenDisplay) {
                workbenchTokenDisplay.textContent = data.token
                  ? data.token
                  : `DISPATCHED TO VERIFIED INBOX (${data.emailSentTo || email}) — License ID ${data.licenseId} (Universal PII 14-Day Eval). Check your work inbox for the signed ZTDS-LIC-v1 token.`;
              }

              updateWorkbenchSnippetTab(currentWorkbenchTarget);

              // Smoothly scroll to results
              trialWorkbenchResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              if (trialMintStatus) {
                trialMintStatus.classList.remove('hidden');
                trialMintStatus.textContent = 'License generation error: ' + (data.details || data.error || 'Server error');
              }
            }
          } catch (err) {
            if (trialMintStatus) {
              trialMintStatus.classList.remove('hidden');
              trialMintStatus.textContent = 'Network error during license minting: ' + err.message;
            }
          } finally {
            btnMintWorkbench.disabled = false;
            btnMintWorkbench.replaceChildren(...savedWorkbenchBtnNodes);
          }
        });
      }

      // Copy Token
      if (btnCopyWorkbenchToken) {
        btnCopyWorkbenchToken.addEventListener('click', () => {
          if (!currentWorkbenchData || !currentWorkbenchData.token) return;
          const savedNodes = Array.from(btnCopyWorkbenchToken.childNodes).map(n => n.cloneNode(true));
          window.ztdsCopy(currentWorkbenchData.token, () => {
            btnCopyWorkbenchToken.textContent = 'Copied!';
            setTimeout(() => { btnCopyWorkbenchToken.replaceChildren(...savedNodes); }, 2000);
          });
        });
      }

      // Copy Snippet
      if (btnCopyWorkbenchSnippet) {
        btnCopyWorkbenchSnippet.addEventListener('click', () => {
          const code = workbenchSnippetCode?.innerText || '';
          if (!code) return;
          const savedNodes = Array.from(btnCopyWorkbenchSnippet.childNodes).map(n => n.cloneNode(true));
          window.ztdsCopy(code, () => {
            btnCopyWorkbenchSnippet.textContent = 'Copied!';
            setTimeout(() => { btnCopyWorkbenchSnippet.replaceChildren(...savedNodes); }, 2000);
          });
        });
      }

      // Download JSON
      if (btnDownloadWorkbenchJson) {
        btnDownloadWorkbenchJson.addEventListener('click', () => {
          if (!currentWorkbenchData) return;
          const licenseBlob = new Blob([JSON.stringify(currentWorkbenchData, null, 2)], { type: 'application/json' });
          const blobUrl = URL.createObjectURL(licenseBlob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `ztds-license-${currentWorkbenchData.licenseId}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        });
      }

      // Verify in Local RAM Decoder
      if (btnVerifyWorkbenchDecoder) {
        btnVerifyWorkbenchDecoder.addEventListener('click', () => {
          const tokenToTest = (currentWorkbenchData && currentWorkbenchData.token) ? currentWorkbenchData.token : SAMPLE_DEV_TOKEN;
          const inputDecoder = document.getElementById('licenseTokenInput');
          const btnDecode = document.getElementById('btnDecodeLicense');
          const decoderSection = document.getElementById('offlineLicenseTester');
          if (inputDecoder) {
            inputDecoder.value = tokenToTest;
          }
          if (btnDecode) {
            btnDecode.click();
          }
          if (decoderSection) {
            decoderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      // Deep-link preset parameter handling (supports both ?preset=...#trial and legacy #trial?preset=...)
      let presetParam = urlParams.get('preset');
      if (!presetParam && window.location.hash && window.location.hash.includes('?')) {
        try {
          const hashQuery = new URLSearchParams(window.location.hash.split('?')[1]);
          presetParam = hashQuery.get('preset');
        } catch (_) {}
      }
      if (presetParam) {
        const lowerPreset = presetParam.toLowerCase();
        if (['universal', 'fintech', 'healthcare', 'legal', 'all'].includes(lowerPreset)) {
          if (trialProfileSelect) trialProfileSelect.value = lowerPreset;
        } else if (['mcp', 'node', 'python', 'docker'].includes(lowerPreset)) {
          targetPills.forEach(p => {
            if (p.getAttribute('data-target') === lowerPreset) p.click();
          });
        }
        const trialEl = document.getElementById('trial');
        if (trialEl && window.location.hash.startsWith('#trial')) {
          setTimeout(() => trialEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }
      }

      // Mint 14-Day Evaluation Key via Serverless API
      const btnMintTrial = document.getElementById('btnMintTrialLicense');
      if (btnMintTrial) {
        btnMintTrial.addEventListener('click', async () => {
          const company = (document.getElementById('trialCompany')?.value || '').trim();
          const email = (document.getElementById('trialEmail')?.value || '').trim();

          if (!company || company.length < 2) {
            alert('Please provide a company or developer name.');
            document.getElementById('trialCompany')?.focus();
            return;
          }
          if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
            alert('Please provide a valid corporate work email address to receive your signed 14-day evaluation key.');
            document.getElementById('trialEmail')?.focus();
            return;
          }

          const savedTrialBtnNodes = Array.from(btnMintTrial.childNodes).map(n => n.cloneNode(true));
          btnMintTrial.disabled = true;
          const pulseDot = document.createElement('span');
          pulseDot.className = 'pulse-dot mr-1';
          btnMintTrial.replaceChildren(pulseDot, document.createTextNode(' Dispatching Signed Ed25519 Key...'));

          try {
            const res = await fetch('/api/mint-license/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerName: company,
                email: email,
                tier: 'developer_eval',
                days: 14
              })
            });

            const data = await res.json();
            if (res.ok && (data.token || data.deliveryMode === 'email_dispatched')) {
              const resultBox = document.getElementById('trialResultBox');
              const licenseIdEl = document.getElementById('trialLicenseId');
              const expiryEl = document.getElementById('trialExpiryDate');
              const tokenDisplay = document.getElementById('trialTokenDisplay');
              const quickstartCmd = document.getElementById('trialQuickstartCmd');
              const displayedToken = data.token || `Dispatched to ${data.emailSentTo || email} (check work inbox)`;

              if (resultBox) resultBox.classList.remove('hidden');
              if (licenseIdEl) licenseIdEl.textContent = data.licenseId;
              if (expiryEl) expiryEl.textContent = `Valid through ${data.expiresAt.split('T')[0]}`;
              if (tokenDisplay) tokenDisplay.textContent = displayedToken;
              if (quickstartCmd) quickstartCmd.textContent = data.token ? `export ZTDS_LICENSE="${data.token}"` : 'export ZTDS_LICENSE="<PASTE_TOKEN_FROM_WORK_EMAIL>"';

              const copyBtn = document.getElementById('btnCopyTrialToken');
              if (copyBtn) {
                copyBtn.onclick = () => {
                  if (typeof window.ztdsCopy === 'function') {
                    window.ztdsCopy(data.token, copyBtn, 'Token Copied!');
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(data.token).then(() => {
                      copyBtn.textContent = 'Token Copied!';
                      setTimeout(() => { copyBtn.textContent = 'Copy Token'; }, 2000);
                    });
                  }
                };
              }
            } else {
              alert(`Error minting token: ${data.details || data.error || 'Server error'}`);
            }
          } catch (err) {
            alert(`Network error during license minting: ${err.message}`);
          } finally {
            btnMintTrial.disabled = false;
            btnMintTrial.replaceChildren(...savedTrialBtnNodes);
          }
        });
      }
    });
})();
