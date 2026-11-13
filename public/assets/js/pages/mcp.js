(function () {
  'use strict';

(function() {
      let currentEdition = 'open';
      let currentOS = 'macos';
      let currentClient = 'cursor';
      let enableDebug = false;
      let enableTimeout = false;

      const PATHS = {
        cursor: {
          macos: '~/.cursor/mcp.json',
          windows: '%USERPROFILE%\\.cursor\\mcp.json',
          linux: '~/.cursor/mcp.json',
          openCmd: {
            macos: 'cursor ~/.cursor/mcp.json',
            windows: 'notepad %USERPROFILE%\\.cursor\\mcp.json',
            linux: 'nano ~/.cursor/mcp.json'
          }
        },
        desktop: {
          macos: '~/Library/Application Support/Claude/claude_desktop_config.json',
          windows: '%APPDATA%\\Claude\\claude_desktop_config.json',
          linux: '~/.config/Claude/claude_desktop_config.json',
          openCmd: {
            macos: 'open ~/Library/Application\\ Support/Claude/claude_desktop_config.json',
            windows: 'notepad %APPDATA%\\Claude\\claude_desktop_config.json',
            linux: 'nano ~/.config/Claude/claude_desktop_config.json'
          }
        },
        cli: {
          macos: '~/.claude.json',
          windows: '%USERPROFILE%\\.claude.json',
          linux: '~/.claude.json',
          openCmd: {
            macos: 'claude mcp list',
            windows: 'claude mcp list',
            linux: 'claude mcp list'
          }
        },
        windsurf: {
          macos: '~/.codeium/windsurf/mcp_config.json',
          windows: '%USERPROFILE%\\.codeium\\windsurf\\mcp_config.json',
          linux: '~/.codeium/windsurf/mcp_config.json',
          openCmd: {
            macos: 'windsurf ~/.codeium/windsurf/mcp_config.json',
            windows: 'notepad %USERPROFILE%\\.codeium\\windsurf\\mcp_config.json',
            linux: 'nano ~/.codeium/windsurf/mcp_config.json'
          }
        },
        zed: {
          macos: '~/.config/zed/settings.json',
          windows: '%APPDATA%\\Zed\\settings.json',
          linux: '~/.config/zed/settings.json',
          openCmd: {
            macos: 'zed ~/.config/zed/settings.json',
            windows: 'notepad %APPDATA%\\Zed\\settings.json',
            linux: 'nano ~/.config/zed/settings.json'
          }
        },
        antigravity: {
          macos: '~/.gemini/config/plugins/ztds-guard',
          windows: '%USERPROFILE%\\.gemini\\config\\plugins\\ztds-guard',
          linux: '~/.gemini/config/plugins/ztds-guard',
          openCmd: {
            macos: 'agy plugin install https://github.com/moxno/ztds.ai',
            windows: 'agy plugin install https://github.com/moxno/ztds.ai',
            linux: 'agy plugin install https://github.com/moxno/ztds.ai'
          }
        }
      };

      const pathDisplay = document.getElementById('cfgActivePath');
      const codeDisplay = document.getElementById('cfgGeneratedCode');
      const terminalHint = document.getElementById('cfgTerminalHint');
      const btnCopyPath = document.getElementById('btnCopyConfigPath');
      const debugToggle = document.getElementById('cfgToggleDebug');
      const timeoutToggle = document.getElementById('cfgToggleTimeout');

      function updateConfig() {
        const pkg = currentEdition === 'open' ? 'ztds-mcp@latest' : '@privacyscrubber/mcp-server@latest';
        const serverKey = currentEdition === 'open' ? 'ztds' : 'privacyscrubber';

        const env = {};
        if (enableDebug) env.DEBUG = 'true';
        if (enableTimeout) env.ZTDS_SESSION_TIMEOUT_MS = '1800000';
        if (currentEdition === 'commercial') {
          env.ZTDS_PROFILES = 'financial,healthcare,dev_secrets';
        }

        const hasEnv = Object.keys(env).length > 0;

        let codeOutput = '';

        if (currentClient === 'cli') {
          let cmd = `claude mcp add ${serverKey} npx -y ${pkg}`;
          if (hasEnv) {
            for (const [k, v] of Object.entries(env)) {
              cmd += ` -e ${k}=${v}`;
            }
          }
          codeOutput = cmd;
        } else if (currentClient === 'antigravity') {
          codeOutput = `# Install directly in Google Antigravity:\nagy plugin install https://github.com/moxno/ztds.ai\n\n# Or auto-configure locally in 1 click:\nnpx ztds-mcp init --antigravity`;
        } else if (currentClient === 'zed') {
          const zedObj = {
            context_servers: {
              [serverKey]: {
                command: 'npx',
                args: ['-y', pkg]
              }
            }
          };
          if (hasEnv) zedObj.context_servers[serverKey].env = env;
          codeOutput = JSON.stringify(zedObj, null, 2);
        } else {
          // Cursor, Claude Desktop, Windsurf
          const mcpObj = {
            mcpServers: {
              [serverKey]: {
                command: 'npx',
                args: ['-y', pkg]
              }
            }
          };
          if (hasEnv) mcpObj.mcpServers[serverKey].env = env;
          codeOutput = JSON.stringify(mcpObj, null, 2);
        }

        if (codeDisplay) codeDisplay.textContent = codeOutput;

        const pathInfo = PATHS[currentClient] || PATHS.cursor;
        const currentPath = pathInfo[currentOS] || pathInfo.macos;
        const currentOpen = (pathInfo.openCmd && pathInfo.openCmd[currentOS]) || `open ${currentPath}`;

        if (pathDisplay) pathDisplay.textContent = currentPath;
        if (terminalHint) {
          if (currentClient === 'cli') {
            terminalHint.textContent = 'Run directly in terminal where claude CLI is authenticated';
          } else if (currentClient === 'antigravity') {
            terminalHint.textContent = 'Run in terminal to install plugin or run "npx ztds-mcp init --antigravity"';
          } else {
            terminalHint.textContent = `Terminal Open: ${currentOpen}`;
          }
        }
      }

      // Edition buttons
      document.querySelectorAll('.edition-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentEdition = btn.getAttribute('data-edition');
          document.querySelectorAll('.edition-toggle-btn').forEach(b => {
            b.classList.remove('active', 'bg-slate-900', 'text-white', 'shadow-sm');
            b.classList.add('text-slate-600');
            const sub = b.querySelector('.text-\\[10px\\]');
            if (sub) {
              sub.classList.remove('text-slate-300');
              sub.classList.add('text-slate-500');
            }
          });
          btn.classList.add('active', 'bg-slate-900', 'text-white', 'shadow-sm');
          btn.classList.remove('text-slate-600');
          const activeSub = btn.querySelector('.text-\\[10px\\]');
          if (activeSub) {
            activeSub.classList.remove('text-slate-500');
            activeSub.classList.add('text-slate-300');
          }
          updateConfig();
        });
      });

      // OS buttons
      document.querySelectorAll('.os-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentOS = btn.getAttribute('data-os');
          document.querySelectorAll('.os-toggle-btn').forEach(b => {
            b.classList.remove('active', 'bg-slate-900', 'text-white', 'shadow-sm');
            b.classList.add('text-slate-600');
          });
          btn.classList.add('active', 'bg-slate-900', 'text-white', 'shadow-sm');
          btn.classList.remove('text-slate-600');
          updateConfig();
        });
      });

      // Client tab buttons
      document.querySelectorAll('.client-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentClient = btn.getAttribute('data-client');
          document.querySelectorAll('.client-tab-btn').forEach(b => {
            b.classList.remove('active', 'bg-slate-900', 'text-white');
            b.classList.add('text-slate-600');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active', 'bg-slate-900', 'text-white');
          btn.classList.remove('text-slate-600');
          btn.setAttribute('aria-selected', 'true');
          if (typeof btn.scrollIntoView === 'function') {
            btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }
          updateConfig();
        });
      });

      // Toggles
      if (debugToggle) {
        debugToggle.addEventListener('change', () => {
          enableDebug = debugToggle.checked;
          updateConfig();
        });
      }
      if (timeoutToggle) {
        timeoutToggle.addEventListener('change', () => {
          enableTimeout = timeoutToggle.checked;
          updateConfig();
        });
      }

      // Copy Path
      if (btnCopyPath) {
        btnCopyPath.addEventListener('click', () => {
          const pathText = pathDisplay ? pathDisplay.textContent : '';
          if (pathText) {
            navigator.clipboard.writeText(pathText).then(() => {
              const orig = btnCopyPath.textContent;
              btnCopyPath.textContent = 'Path Copied!';
              setTimeout(() => {
                btnCopyPath.textContent = orig;
              }, 2000);
            }).catch(() => {});
          }
        });
      }

      // Generic code copy buttons
      document.querySelectorAll('.btn-copy-code').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const codeEl = document.getElementById(targetId);
          if (codeEl) {
            navigator.clipboard.writeText(codeEl.innerText || codeEl.textContent).then(() => {
              const orig = btn.textContent;
              btn.textContent = 'Copied!';
              setTimeout(() => {
                btn.textContent = orig;
              }, 2000);
            }).catch(() => {});
          }
        });
      });

      // Hydrate from URL query parameters (?client=, ?os=, ?edition=, ?debug=, ?timeout=)
      try {
        const params = new URLSearchParams(window.location.search);
        const qClient = (params.get('client') || '').trim().toLowerCase();
        const qOS = (params.get('os') || '').trim().toLowerCase();
        const qEdition = (params.get('edition') || '').trim().toLowerCase();
        if (qClient) {
          const cBtn = document.querySelector(`.client-tab-btn[data-client="${CSS.escape(qClient)}"]`);
          if (cBtn) cBtn.click();
        }
        if (qOS) {
          const oBtn = document.querySelector(`.os-toggle-btn[data-os="${CSS.escape(qOS)}"]`);
          if (oBtn) oBtn.click();
        }
        if (qEdition) {
          const eBtn = document.querySelector(`.edition-toggle-btn[data-edition="${CSS.escape(qEdition)}"]`);
          if (eBtn) eBtn.click();
        }
      } catch (_) {}

      // Initial render
      updateConfig();
    })();

    // Interactive MCP Protocol Simulator Controller
    (function() {
      const PRESETS = {
        api_key: 'const client = new OpenAI({\n  apiKey: "' + 'sk-proj-' + '9x8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",\n  organization: "org-internal-finance"\n});\nconst awsKey = "' + 'AKIA' + 'IOSFODNN7EXAMPLE";\nconst awsSecret = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";',
        pii: 'Instruction: Forward Q3 executive settlement memo to CFO sarah.connor@acme-global.com with wire transfer $485,250.00 USD to IBAN DE89370400440532013000 (Routing: 021000021, SSN: ' + ['219', '45', '8821'].join('-') + ').',
        database: 'DATABASE_URL="postgres://db_admin:SuperSecretPassw0rd2026!@prod-db.internal.aws:5432/core_banking"\nREDIS_HOST="192.168.1.104"\nREDIS_SECRET="AuthToken9876543210"'
      };

      let activeTool = 'ztds_sanitize';
      let activeOutTab = 'stdio';
      let activeSessionMap = {};
      let rpcMessageId = 1;

      const toolBtns = document.querySelectorAll('.sim-tool-btn');
      const presetBtns = document.querySelectorAll('.sim-preset-btn');
      const outTabs = document.querySelectorAll('.sim-out-tab');
      const payloadInput = document.getElementById('simPayloadInput');
      const sessionInput = document.getElementById('simSessionInput');
      const inputStats = document.getElementById('simInputStats');
      const btnExecute = document.getElementById('btnExecuteSim');
      const btnCopy = document.getElementById('btnCopySimOutput');
      const copyBtnText = document.getElementById('copySimBtnText');

      const stdioDisplay = document.getElementById('simStdioDisplay');
      const sessionDisplay = document.getElementById('simSessionDisplay');
      const maskedDisplay = document.getElementById('simMaskedDisplay');

      const metricEgress = document.getElementById('simMetricEgress');
      const metricLatency = document.getElementById('simMetricLatency');
      const metricTokens = document.getElementById('simMetricTokens');
      const metricState = document.getElementById('simMetricState');

      function updateInputStats() {
        if (!payloadInput) return;
        const text = payloadInput.value || '';
        const byteCount = new Blob([text]).size;
        if (inputStats) {
          inputStats.textContent = `${text.length} chars · ${byteCount} B`;
        }
      }

      function tokenize(rawText) {
        const localMap = {};
        const counters = {};
        let sanitized = rawText;

        function replacePattern(regex, prefix) {
          sanitized = sanitized.replace(regex, (match) => {
            if (/^\[[A-Z_]+_\d+\]$/.test(match)) return match;
            counters[prefix] = (counters[prefix] || 0) + 1;
            const token = `[${prefix}_${counters[prefix]}]`;
            localMap[token] = match;
            return token;
          });
        }

        // Secrets, Tokens, Keys
        replacePattern(/(?:AWS_SECRET_KEY=)?[a-zA-Z0-9\/+=]{35,45}|sk-proj-[a-zA-Z0-9_-]{20,}|AKIA[0-9A-Z]{16}|SuperSecretPassw0rd[0-9A-Za-z!@#$%^&*]+/g, "SECRET_KEY");
        replacePattern(/\bAuthToken[0-9A-Za-z]+\b/g, "SECRET_KEY");

        // SSN & Gov IDs
        replacePattern(/\b\d{3}-\d{2}-\d{4}\b/g, "SSN");
        replacePattern(/\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/gi, "GOV_ID");

        // IBAN & Banking
        replacePattern(/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, "IBAN");
        replacePattern(/\b(?:Routing:\s*)?\d{9}\b/g, "ROUTING_NUM");

        // Email
        replacePattern(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, "EMAIL");

        // Currency values
        replacePattern(/\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:USD|EUR|GBP|Billion|Million|[BM]))?\b/gi, "FIN_AMOUNT");

        // IP addresses
        replacePattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, "IP_ADDR");

        // Named person
        replacePattern(/\b(?:sarah\.connor|CFO)\b/gi, "PERSON");

        return { sanitized, localMap, count: Object.keys(localMap).length };
      }

      function classifyTokenStyle(tok) {
        if (/SECRET|KEY|DB_URL/i.test(tok)) return 'token-secret';
        if (/IBAN|SSN|IP_ADDR|ROUTING/i.test(tok)) return 'token-id';
        return 'token-email';
      }

      function buildMaskedFragment(text) {
        const frag = document.createDocumentFragment();
        const str = String(text || '');
        const tokenRe = /\[[A-Z_]+_\d+\]/g;
        let lastIndex = 0;
        let match;
        while ((match = tokenRe.exec(str)) !== null) {
          if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(str.slice(lastIndex, match.index)));
          }
          const span = document.createElement('span');
          span.className = 'entity-token ' + classifyTokenStyle(match[0]);
          span.textContent = match[0];
          frag.appendChild(span);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < str.length) {
          frag.appendChild(document.createTextNode(str.slice(lastIndex)));
        }
        return frag;
      }

      function executeSimulation() {
        rpcMessageId++;
        const raw = (payloadInput ? payloadInput.value : '') || '';
        const sessionId = (sessionInput ? sessionInput.value : 'sess_cursor_01') || 'sess_cursor_01';
        const t0 = performance.now();

        let reqFrame = {};
        let resFrame = {};
        let maskedNode = null;

        if (activeTool === 'ztds_sanitize') {
          const { sanitized, localMap, count } = tokenize(raw || PRESETS.api_key);
          activeSessionMap = Object.assign({}, activeSessionMap, localMap);
          const t1 = performance.now();
          const latency = Math.max(0.18, t1 - t0).toFixed(2);

          reqFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            method: "tools/call",
            params: {
              name: "ztds_sanitize",
              arguments: {
                text: raw || PRESETS.api_key,
                sessionId: sessionId
              }
            }
          };

          resFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    sanitized_prompt: sanitized,
                    masked_count: count,
                    session_id: sessionId,
                    in_ram_latency_ms: Number(latency),
                    egress_bytes: 0.00,
                    invariants_verified: ["INV-1", "INV-2", "INV-3", "INV-4"]
                  }, null, 2)
                }
              ]
            }
          };

          maskedNode = buildMaskedFragment(sanitized);

          if (metricEgress) metricEgress.textContent = "0.00 B";
          if (metricLatency) metricLatency.textContent = `<${latency}ms`;
          if (metricTokens) metricTokens.textContent = `${count}`;
          if (metricState) metricState.textContent = "Volatile RAM";
        }
        else if (activeTool === 'ztds_restore') {
          const targetText = raw || "Reviewed assistant completion: safe to deploy [SECRET_KEY_1] for [PERSON_1] with wire [IBAN_1].";
          let restored = targetText;
          let restoredCount = 0;
          for (const [tok, val] of Object.entries(activeSessionMap)) {
            if (restored.includes(tok)) {
              restored = restored.split(tok).join(val);
              restoredCount++;
            }
          }
          const t1 = performance.now();
          const latency = Math.max(0.12, t1 - t0).toFixed(2);

          reqFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            method: "tools/call",
            params: {
              name: "ztds_restore",
              arguments: {
                text: targetText,
                sessionId: sessionId
              }
            }
          };

          resFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    restored_text: restored,
                    restored_count: restoredCount,
                    session_id: sessionId,
                    in_ram_latency_ms: Number(latency)
                  }, null, 2)
                }
              ]
            }
          };

          {
            const frag = document.createDocumentFragment();
            const hdr = document.createElement('div');
            hdr.className = 'text-slate-300 font-semibold mb-2 text-xs text-emerald-400';
            hdr.textContent = 'Restored Cleartext in Local Editor Buffer:';
            const body = document.createElement('div');
            body.className = 'whitespace-pre-wrap';
            body.textContent = restored;
            frag.append(hdr, body);
            maskedNode = frag;
          }

          if (metricEgress) metricEgress.textContent = "0.00 B";
          if (metricLatency) metricLatency.textContent = `<${latency}ms`;
          if (metricTokens) metricTokens.textContent = `${restoredCount} restored`;
          if (metricState) metricState.textContent = "Client Heap";
        }
        else if (activeTool === 'ztds_audit') {
          const { localMap, count } = tokenize(raw || PRESETS.api_key);
          const t1 = performance.now();
          const latency = Math.max(0.24, t1 - t0).toFixed(2);

          reqFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            method: "tools/call",
            params: {
              name: "ztds_audit",
              arguments: {
                target: "active_editor_buffer.ts",
                strict: true
              }
            }
          };

          resFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: count > 0 ? "VIOLATION_INTERCEPTED" : "CONFORMANCE_VERIFIED",
                    leak_prevented_count: count,
                    categories_flagged: Object.keys(localMap),
                    receipt_hash: "sha256:7f4a9b2c8e1d5a3f6e8b0c2d4f6a8e1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e2f",
                    in_ram_latency_ms: Number(latency)
                  }, null, 2)
                }
              ]
            }
          };

          {
            const box = document.createElement('div');
            box.className = 'p-3 bg-slate-800 rounded-lg text-xs font-mono space-y-1';
            const l1 = document.createElement('div');
            l1.className = 'text-emerald-400 font-bold';
            l1.textContent = '[PASS] AST AUDIT COMPLETED';
            const l2 = document.createElement('div');
            l2.textContent = `Cleartext Leaks Prevented: ${count}`;
            const l3 = document.createElement('div');
            l3.textContent = 'Receipt: sha256:7f4a9b2c...';
            box.append(l1, l2, l3);
            maskedNode = box;
          }

          if (metricEgress) metricEgress.textContent = "0.00 B";
          if (metricLatency) metricLatency.textContent = `<${latency}ms`;
          if (metricTokens) metricTokens.textContent = `${count} flagged`;
          if (metricState) metricState.textContent = "Audit Hash SHA-256";
        }
        else if (activeTool === 'ztds_reset_session') {
          const purgedCount = Object.keys(activeSessionMap).length;
          activeSessionMap = {};
          const t1 = performance.now();
          const latency = Math.max(0.08, t1 - t0).toFixed(2);

          reqFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            method: "tools/call",
            params: {
              name: "ztds_reset_session",
              arguments: {
                sessionId: sessionId
              }
            }
          };

          resFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "SESSION_RAM_ZEROIZED",
                    session_id: sessionId,
                    purged_tokens_count: purgedCount,
                    zeroization_method: "crypto.randomFillSync",
                    theorem_2_conformance: "PASS"
                  }, null, 2)
                }
              ]
            }
          };

          {
            const box = document.createElement('div');
            box.className = 'p-3 bg-slate-800 rounded-lg text-xs font-mono text-emerald-300 font-semibold';
            box.textContent = `[THEOREM 2] Volatile RAM zeroized. All ${purgedCount} token surrogate mappings permanently overwritten.`;
            maskedNode = box;
          }

          if (metricEgress) metricEgress.textContent = "0.00 B";
          if (metricLatency) metricLatency.textContent = `<${latency}ms`;
          if (metricTokens) metricTokens.textContent = "0";
          if (metricState) metricState.textContent = "RAM ZEROIZED (0 B)";
        }
        else if (activeTool === 'ztds_status') {
          const t1 = performance.now();
          const latency = Math.max(0.09, t1 - t0).toFixed(2);

          reqFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            method: "tools/call",
            params: {
              name: "ztds_status",
              arguments: {}
            }
          };

          resFrame = {
            jsonrpc: "2.0",
            id: rpcMessageId,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    engine: "ztds-mcp",
                    version: "1.2.2",
                    protocol: "Model Context Protocol JSON-RPC 2.0 (stdio)",
                    license: "Apache-2.0 (Open Reference)",
                    clients_detected: [
                      "Cursor IDE (~/.cursor/mcp.json)",
                      "Claude Desktop (claude_desktop_config.json)",
                      "Windsurf (~/.codeium/windsurf/mcp_config.json)"
                    ],
                    active_sessions: 1,
                    invariants: {
                      "invariant_1_zero_egress": "PASS (0.00B)",
                      "invariant_2_reversibility": "PASS",
                      "invariant_3_ram_isolation": "PASS",
                      "invariant_4_zero_subprocessors": "PASS"
                    }
                  }, null, 2)
                }
              ]
            }
          };

          {
            const box = document.createElement('div');
            box.className = 'text-xs font-mono text-emerald-400 space-y-1.5';
            const l1 = document.createElement('div');
            l1.className = 'font-bold';
            l1.textContent = 'ZTDS MCP Server v1.2.2 (Healthy)';
            const l2 = document.createElement('div');
            l2.textContent = 'Transport: OS stdio (stdin/stdout)';
            const l3 = document.createElement('div');
            l3.textContent = 'Clients Connected: Cursor IDE, Claude Desktop';
            box.append(l1, l2, l3);
            maskedNode = box;
          }

          if (metricEgress) metricEgress.textContent = "0.00 B";
          if (metricLatency) metricLatency.textContent = `<${latency}ms`;
          if (metricTokens) metricTokens.textContent = Object.keys(activeSessionMap).length.toString();
          if (metricState) metricState.textContent = "Server Online";
        }

        // Render Stdio JSON-RPC
        const stdioText = 
`// [STDIN] Sent from AI Client (Cursor/Claude Desktop) via OS pipe:
--> ${JSON.stringify(reqFrame, null, 2)}

// [STDOUT] Returned from local ztds-mcp in volatile RAM (<0.35ms):
<-- ${JSON.stringify(resFrame, null, 2)}`;

        if (stdioDisplay) stdioDisplay.textContent = stdioText;

        // Render TokenMap
        if (sessionDisplay) {
          if (Object.keys(activeSessionMap).length > 0) {
            sessionDisplay.textContent = JSON.stringify(activeSessionMap, null, 2);
          } else {
            sessionDisplay.textContent = '{\n  /* 0 active entity mappings in volatile heap */\n}';
          }
        }

        // Render Masked View
        if (maskedDisplay) {
          if (maskedNode) maskedDisplay.replaceChildren(maskedNode);
          else maskedDisplay.replaceChildren();
        }
      }

      // Tool Tab click handlers
      toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activeTool = btn.getAttribute('data-tool');
          toolBtns.forEach(b => {
            b.classList.remove('active', 'bg-emerald-500', 'text-slate-950');
            b.classList.add('text-slate-300');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active', 'bg-emerald-500', 'text-slate-950');
          btn.classList.remove('text-slate-300');
          btn.setAttribute('aria-selected', 'true');
          if (typeof btn.scrollIntoView === 'function') {
            btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }

          if (btnExecute) {
            const label = btnExecute.querySelector('span:first-child');
            if (label) label.textContent = `Send Stdio Frame · ${activeTool}`;
          }

          if (payloadInput) {
            if (activeTool === 'ztds_restore' && (!payloadInput.value || !payloadInput.value.includes('['))) {
              payloadInput.value = "Assistant completion: Successfully configured AWS client using [SECRET_KEY_1] and authorized payment for [PERSON_1] via IBAN [IBAN_1].";
            } else if (activeTool === 'ztds_status') {
              payloadInput.placeholder = "(No input payload required for status handshake)";
            } else if (activeTool === 'ztds_reset_session') {
              payloadInput.placeholder = "(Target session will be cryptographically overwritten in volatile RAM)";
            } else {
              payloadInput.placeholder = "Type prompt or code containing API keys, PII, or credentials...";
            }
          }

          updateInputStats();
          executeSimulation();
        });
      });

      // Preset click handlers
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.getAttribute('data-preset');
          if (PRESETS[presetKey] && payloadInput) {
            presetBtns.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
            payloadInput.value = PRESETS[presetKey];
            if (activeTool === 'ztds_restore') {
              activeTool = 'ztds_sanitize';
              toolBtns.forEach(b => {
                const isSan = b.getAttribute('data-tool') === 'ztds_sanitize';
                b.classList.toggle('active', isSan);
                b.classList.toggle('bg-emerald-500', isSan);
                b.classList.toggle('text-slate-950', isSan);
                b.classList.toggle('text-slate-300', !isSan);
                b.setAttribute('aria-selected', isSan ? 'true' : 'false');
              });
              if (btnExecute) {
                const label = btnExecute.querySelector('span:first-child');
                if (label) label.textContent = "Send Stdio Frame · ztds_sanitize";
              }
            }
            updateInputStats();
            executeSimulation();
          }
        });
      });

      // Output Tab switchers
      outTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          activeOutTab = tab.getAttribute('data-out');
          outTabs.forEach(t => {
            t.classList.remove('active', 'bg-slate-800', 'text-emerald-400');
            t.classList.add('text-slate-400');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active', 'bg-slate-800', 'text-emerald-400');
          tab.classList.remove('text-slate-400');
          tab.setAttribute('aria-selected', 'true');
          if (typeof tab.scrollIntoView === 'function') {
            tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }

          document.querySelectorAll('.sim-out-pane').forEach(p => p.classList.add('hidden'));
          if (activeOutTab === 'stdio' && document.getElementById('simPaneStdio')) document.getElementById('simPaneStdio').classList.remove('hidden');
          else if (activeOutTab === 'session' && document.getElementById('simPaneSession')) document.getElementById('simPaneSession').classList.remove('hidden');
          else if (activeOutTab === 'masked' && document.getElementById('simPaneMasked')) document.getElementById('simPaneMasked').classList.remove('hidden');
        });
      });

      // Execute button
      if (btnExecute) {
        btnExecute.addEventListener('click', () => {
          executeSimulation();
        });
      }

      // Input changes
      if (payloadInput) {
        payloadInput.addEventListener('input', updateInputStats);
      }

      // Copy Output
      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          let textToCopy = '';
          if (activeOutTab === 'stdio' && stdioDisplay) textToCopy = stdioDisplay.textContent;
          else if (activeOutTab === 'session' && sessionDisplay) textToCopy = sessionDisplay.textContent;
          else if (activeOutTab === 'masked' && maskedDisplay) textToCopy = maskedDisplay.innerText || maskedDisplay.textContent;

          navigator.clipboard.writeText(textToCopy).then(() => {
            if (copyBtnText) copyBtnText.textContent = 'Copied!';
            setTimeout(() => {
              if (copyBtnText) copyBtnText.textContent = 'Copy Output';
            }, 2000);
          }).catch(() => {});
        });
      }

      // Initial execution
      if (payloadInput) {
        payloadInput.value = PRESETS.api_key;
        updateInputStats();
        executeSimulation();
      }
    })();
})();
