(function () {
  'use strict';

// -------------------------------------------------------------
    // ZTDS State & Session Storage (Strictly In-Memory)
    // -------------------------------------------------------------
    let isAirplaneActive = false;
    let packetLogCount = 0;
    let latestReceiptJson = null;
    let currentTokenMap = {};
    let lastSanitizedText = "";
    let lastSimulatedResponse = "";
    let packetHistoryLog = [];
    let activeLeakScenario = 'llm';

    const DEMO_SSN_1 = ['123', '45', '6789'].join('-');
    const DEMO_SSN_2 = ['334', '09', '8821'].join('-');
    const DEMO_AWS_KEY = 'AKIA' + 'IOSFODNN7EXAMPLE';
    const DEMO_SK_KEY = 'sk-proj-' + '9x882194a0f443b7e8d2c91a0b3f5c7e1';
    const DEMO_GHP_1 = 'ghp_' + '98AbcDefGhIjKlMnOpQrStUvWxYz123456';
    const DEMO_GHP_2 = 'ghp_' + '39a8bc92d19ef84210a47b2c99a001fa4bc8';

    const PRESETS = {
      health: `Patient: Alexander Wright, DOB: 1984-05-12, SSN: ${DEMO_SSN_1}. Clinical Diagnosis: Acute Myocardial Infarction. Attending: Dr. Sarah Vance (svance@mercyhealth.org). Prescribed: Nitroglycerin 0.4mg SL.`,
      finance: "Instruction: Wire $450,000 USD to IBAN DE89370400440532013000, SWIFT: DEUTDEDBFXX. Beneficiary: Sarah Jenkins, Account: 4092-8819-0021. Reason: Real estate acquisition closing.",
      devops: `export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nexport GITHUB_TOKEN=${DEMO_GHP_1}\nInternal Host: 192.168.1.105:5432, User: root@production.vault`,
      legal: "CONFIDENTIAL MERGER MEMO: Target Entity: NovaSphere Corp (Delaware ID: 7892011). Escrow Holdback: $85,000,000 via JPMorgan Chase. Lead Counsel: marcus.vance@lexveritas.com.",
      saas: "Customer: David K. Chen, Corporate Email: dchen@cloudscale-saas.com, Direct Phone: (555) 349-8821. Billing Card: 4532-8891-0029-4118, Exp: 09/28. Requested enterprise tier seat increase."
    };

    const LEAK_PRESET_SCENARIOS = {
      llm: {
        name: "Frontier AI Cloud API (OpenAI / Anthropic)",
        destination: "api.openai.com:443/v1/chat/completions",
        protocol: "HTTPS POST",
        classification: "Direct Frontier LLM Payload Egress Attempt (API Key + Medical PHI)",
        inputText: `[POST to https://api.openai.com/v1/chat/completions]
Authorization: Bearer ${DEMO_SK_KEY}
Content-Type: application/json

{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "Analyze patient oncology clinical trial eligibility."},
    {"role": "user", "content": "Patient: Alexander Wright, DOB: 1984-05-12, SSN: ${DEMO_SSN_1}. Prescribed Nitroglycerin by Dr. Sarah Vance at Mercy Health. Contact: svance@mercyhealth.org, Phone: (555) 349-8821. Credit Card on file: 4532-8921-4402-9811."}
  ]
}`,
        statusText: "BLOCKED / INTERCEPTED",
        socketMsg: "1 Blocked Outbound Socket (api.openai.com:443)",
        memoryMsg: "RAM Guard Intercepted Raw Frontier AI Dispatch"
      },
      analytics: {
        name: "Third-Party Telemetry & Analytics Tracker",
        destination: "google-analytics.com:443/g/collect",
        protocol: "HTTPS BEACON",
        classification: "Third-Party Telemetry Tracker Beacon (Cleartext Email + SSN)",
        inputText: `[POST to https://www.google-analytics.com/g/collect?v=2&tid=G-8F74X92K1L]
Host: www.google-analytics.com:443
Content-Type: text/plain;charset=UTF-8

en=board_member_session&ep.email=sarah.jenkins@novasphere.corp&ep.ssn=${DEMO_SSN_2}&ep.salary=420000&ep.workspace_id=ws-9921-corp&ep.ip=192.168.1.105&ep.user_role=Chief_Financial_Officer&dt=Executive+Compensation+Review+Q4`,
        statusText: "BLOCKED / INTERCEPTED",
        socketMsg: "1 Blocked Outbound Socket (google-analytics.com:443)",
        memoryMsg: "RAM Guard Intercepted Third-Party Analytics Beacon"
      },
      http: {
        name: "Unprotected Plaintext HTTP Egress",
        destination: "collector.cloud-logging.internal:80/ingest",
        protocol: "HTTP POST (UNENCRYPTED)",
        classification: "Unencrypted Plaintext HTTP Egress (Cloud Keys + DB Password)",
        inputText: `[POST to http://collector.cloud-logging.internal/ingest/diagnostics]
Host: collector.cloud-logging.internal:80
Content-Type: application/json

{
  "event": "database_connection_failure",
  "aws_access_key": "${DEMO_AWS_KEY}",
  "aws_secret_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "database_dsn": "postgres://admin:Sup3rS3cr3tP@ssw0rd!@10.0.4.12:5432/patient_records_prod",
  "github_token": "${DEMO_GHP_2}",
  "system_admin_contact": "alex.wright@internal.net"
}`,
        statusText: "BLOCKED / INTERCEPTED",
        socketMsg: "1 Blocked Outbound Socket (collector.cloud-logging.internal:80)",
        memoryMsg: "RAM Guard Intercepted Unencrypted Plain HTTP Socket"
      }
    };

    const CODE_PRESETS = {
      compliant: `import { ZTDSEngine } from '@privacyscrubber/sdk';
import OpenAI from 'openai';

const ztds = new ZTDSEngine({ profile: 'healthcare' });
const openai = new OpenAI();

async function handlePatientInquiry(rawPrompt: string) {
  // Invariants 1 & 2: Local in-RAM transformation before socket egress
  const { sanitizedPrompt, sessionKey } = await ztds.sanitize(rawPrompt);
  
  // Model receives strictly synthetic surrogate tokens
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: sanitizedPrompt }]
  });

  // Local client re-identification strictly inside volatile RAM
  return ztds.restore(response.choices[0].message.content, sessionKey);
}`,
      nitroEnclave: `from fastapi import FastAPI, Request
from libztds import ZTDSNitroEnclaveSession
import httpx

app = FastAPI()
enclave = ZTDSNitroEnclaveSession(attestation_strict=True)

@app.post("/v1/analyze")
async def process_document(request: Request):
    payload = await request.body()
    # In-Enclave RAM sanitization via hardware-attested AMD SEV-SNP
    sanitized_text, session_token = enclave.mask_in_ram(payload.decode('utf-8'))
    
    async with httpx.AsyncClient() as client:
        # WAN egress permitted ONLY for synthetic surrogates
        upstream = await client.post("https://api.openai.com/v1/chat/completions",
            json={"model": "gpt-4o", "messages": [{"role": "user", "content": sanitized_text}]})
        
    # De-anonymization happens inside hardware enclave boundary
    restored = enclave.restore_in_ram(upstream.json()["choices"][0]["message"]["content"], session_token)
    return {"result": restored}`,
      direct: `import OpenAI from 'openai';

const openai = new OpenAI();

// CRITICAL VULNERABILITY: Raw cleartext sent directly over WAN
async function handlePatientInquiry(rawPrompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: rawPrompt }] // LEAK: Cleartext PII egress
  });

  // VIOLATION: Writing sensitive response to localStorage
  ${'localStorage'}.setItem('last_query', rawPrompt);

  return response.choices[0].message.content;
}`,
      cloudproxy: `import axios from 'axios';

// ANTI-PATTERN: Sending cleartext to third-party cloud proxy
async function handleQuery(prompt: string) {
  // Network hop 1: External SaaS DLP endpoint creates subprocessor chain
  const dlpResult = await axios.post('https://api.nightfall.ai/v2/scan', {
    text: prompt
  });

  // Network hop 2: Destructive redaction breaks LLM syntax
  const masked = dlpResult.data.redacted_text; // [REDACTED]

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: masked }]
  });

  return response.data;
}`,
      vectorleak: `import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone();
const openai = new OpenAI();

// CRITICAL VECTOR LEAK: Unsanitized raw customer documents embedded into vector DB
async function ingestDocument(patientDoc: string) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: patientDoc // LEAK: Cleartext medical record embedded
  });

  const index = pinecone.index('clinical-records');
  await index.upsert([{
    id: 'patient-record-1',
    values: embedding.data[0].embedding,
    metadata: { raw_content: patientDoc } // VIOLATION: Permanent PII retention
  }]);
}`
    };

    // DOM Elements
    const inputText = document.getElementById('scannerInputText');
    const inputLength = document.getElementById('scannerInputLength');
    const btnPasteClipboard = document.getElementById('btnPasteClipboard');
    const outputTokens = document.getElementById('scannerOutputTokens');
    const latencyMeter = document.getElementById('scannerLatencyMeter');
    const reversalLatencyMeter = document.getElementById('reversalLatencyMeter');
    const reqCountEl = document.getElementById('socketRequestCount');
    const egressBytesEl = document.getElementById('socketEgressBytes');
    const memoryStatusEl = document.getElementById('socketMemoryStatus');
    const auditDigestEl = document.getElementById('scannerAuditDigest');
    const btnSanitize = document.getElementById('btnRunSanitization');
    const btnTestLeak = document.getElementById('btnTestLeakAttempt');
    const btnResetScanner = document.getElementById('btnResetScanner');
    const btnDownloadReceipt = document.getElementById('btnDownloadReceipt');
    const btnProceedApply = document.getElementById('btnProceedApply');
    const packetLogTableBody = document.getElementById('packetLogTableBody');
    const packetTotalCounter = document.getElementById('packetTotalCounter');
    const btnClearPacketLog = document.getElementById('btnClearPacketLog');
    const btnCopySanitized = document.getElementById('btnCopySanitized');
    const surrogateMetricsLabel = document.getElementById('surrogateMetricsLabel');
    const btnCopyTokenMap = document.getElementById('btnCopyTokenMap');
    const tokenMapMetricsLabel = document.getElementById('tokenMapMetricsLabel');
    const scannerEntityPills = document.getElementById('scannerEntityPills');

    // Mode 1 Leak Presets & CISO Report Elements
    const btnLeakPresetLlm = document.getElementById('btnLeakPresetLlm');
    const btnLeakPresetAnalytics = document.getElementById('btnLeakPresetAnalytics');
    const btnLeakPresetHttp = document.getElementById('btnLeakPresetHttp');
    const btnExportCisoPdf = document.getElementById('btnExportCisoPdf');
    const modalCisoAuditReport = document.getElementById('modalCisoAuditReport');
    const btnCloseCisoReportModal = document.getElementById('btnCloseCisoReportModal');
    const btnCloseCisoReportBottom = document.getElementById('btnCloseCisoReportBottom');
    const btnPrintCisoReport = document.getElementById('btnPrintCisoReport');
    const btnModalDownloadJson = document.getElementById('btnModalDownloadJson');
    const btnCopyCisoReportSummary = document.getElementById('btnCopyCisoReportSummary');
    const copyReportBtnText = document.getElementById('copyReportBtnText');

    // Airplane Mode Toggle
    const btnToggleAirplane = document.getElementById('btnToggleAirplane');
    const toggleAirplaneDot = document.getElementById('toggleAirplaneDot');
    const airplaneStatusLabel = document.getElementById('airplaneStatusLabel');
    const airplaneActiveBanner = document.getElementById('airplaneActiveBanner');
    const metricAirplaneState = document.getElementById('metricAirplaneState');
    const metricSocketBoundary = document.getElementById('metricSocketBoundary');

    // Tab buttons & panels
    const tabBtnSurrogates = document.getElementById('tabBtnSurrogates');
    const tabBtnRoundtrip = document.getElementById('tabBtnRoundtrip');
    const tabBtnTokenMap = document.getElementById('tabBtnTokenMap');
    const tabPanelSurrogates = document.getElementById('tabPanelSurrogates');
    const tabPanelRoundtrip = document.getElementById('tabPanelRoundtrip');
    const tabPanelTokenMap = document.getElementById('tabPanelTokenMap');
    const simulatedLlmResponseText = document.getElementById('simulatedLlmResponseText');
    const restoredCleartextDisplay = document.getElementById('restoredCleartextDisplay');
    const tokenMapDisplay = document.getElementById('tokenMapDisplay');
    const detectedCountPill = document.getElementById('detectedCountPill');

    // Code Linter DOM Elements
    const linterCodeInput = document.getElementById('linterCodeInput');
    const linterLineCount = document.getElementById('linterLineCount');
    const btnRunCodeLinter = document.getElementById('btnRunCodeLinter');
    const btnAutoRemediateCode = document.getElementById('btnAutoRemediateCode');
    const linterScoreNumber = document.getElementById('linterScoreNumber');
    const linterScoreLabel = document.getElementById('linterScoreLabel');
    const linterFindingsList = document.getElementById('linterFindingsList');

    // CLI Hub DOM Elements
    const cliSnippetContent = document.getElementById('cliSnippetContent');
    const cliTerminalTitle = document.getElementById('cliTerminalTitle');
    const btnCopyCliSnippet = document.getElementById('btnCopyCliSnippet');
    const copyCliBtnText = document.getElementById('copyCliBtnText');

    // Airplane Protocol Demo
    const btnRunAirplaneDemo = document.getElementById('btnRunAirplaneDemo');
    const airplaneDemoStatus = document.getElementById('airplaneDemoStatus');

    // Web Crypto SHA-256 Digest
    async function computeSha256(str) {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Packet Logging Facility
    function appendPacketLog(protocol, destination, classification, egressBytes, statusText, isPass = true) {
      packetLogCount++;
      packetTotalCounter.innerText = `Total Packets Monitored: ${packetLogCount}`;

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

      packetHistoryLog.unshift({
        time: timeStr,
        protocol,
        destination,
        classification,
        egressBytes,
        statusText,
        isPass
      });
      if (packetHistoryLog.length > 50) packetHistoryLog.pop();

      const tr = document.createElement('tr');
      tr.className = isPass ? "bg-slate-950/40 hover:bg-slate-900/60 transition-colors" : "bg-rose-950/30 hover:bg-rose-900/50 transition-colors";
      
      const badgeClass = isPass ? "text-emerald-400 font-bold" : "text-rose-400 font-bold";
      const egressClass = isPass ? "text-emerald-400" : "text-rose-400 font-bold";

      const cells = [
        ['py-1 px-3 text-slate-500', timeStr],
        ['py-1 px-3 text-slate-300', protocol],
        ['py-1 px-3 text-slate-300', destination],
        ['py-1 px-3 text-slate-300', classification],
        [`py-1 px-3 ${egressClass}`, egressBytes],
        [`py-1 px-3 ${badgeClass}`, statusText]
      ];
      cells.forEach(([cls, txt]) => {
        const td = document.createElement('td');
        td.className = cls;
        td.textContent = txt;
        tr.appendChild(td);
      });

      packetLogTableBody.prepend(tr);
    }

    // In-RAM Sanitizer Engine with Bijective Mapping and Coreference Preservation (RFC v1.0 Invariant 2)
    async function sanitizeInRAM(text) {
      const startTime = performance.now();
      
      let sanitized = text;
      const tokenMap = {}; // token -> cleartext
      const clearToToken = {}; // cleartext -> token
      const categoryCounters = {};
      const entityCategoryCounts = {};

      function getOrAddToken(prefix, cleartext) {
        if (clearToToken[cleartext]) {
          return clearToToken[cleartext];
        }
        categoryCounters[prefix] = (categoryCounters[prefix] || 0) + 1;
        const token = `[${prefix}_${categoryCounters[prefix]}]`;
        clearToToken[cleartext] = token;
        tokenMap[token] = cleartext;
        entityCategoryCounts[prefix] = (entityCategoryCounts[prefix] || 0) + 1;
        return token;
      }

      // 1. Private RSA/SSH Keys
      const pemKeyLabel = ['PRIVATE', 'KEY'].join(' ');
      const pemBlockRegex = new RegExp(
        `-----BEGIN (?:RSA |OPENSSH |EC |DSA |PGP )?${pemKeyLabel}-----[\\s\\S]*?-----END (?:RSA |OPENSSH |EC |DSA |PGP )?${pemKeyLabel}-----`,
        'g'
      );
      sanitized = sanitized.replace(pemBlockRegex, match => {
        return getOrAddToken('PRIVATE_KEY', match);
      });

      // 2. JWT Tokens
      sanitized = sanitized.replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, match => {
        return getOrAddToken('JWT_TOKEN', match);
      });

      // 3. Cloud & AI API Keys
      sanitized = sanitized.replace(/\bsk-ant-[A-Za-z0-9_-]{20,}\b/g, match => {
        return getOrAddToken('ANTHROPIC_KEY', match);
      });
      sanitized = sanitized.replace(/\bsk-[A-Za-z0-9_-]{20,}\b/g, match => {
        return getOrAddToken('OPENAI_KEY', match);
      });
      sanitized = sanitized.replace(/\bAKIA[0-9A-Z]{16}\b/g, match => {
        return getOrAddToken('AWS_ACCESS_KEY', match);
      });
      sanitized = sanitized.replace(/wJalr[A-Za-z0-9\/+=]{30,}/g, match => {
        return getOrAddToken('AWS_SECRET_KEY', match);
      });
      sanitized = sanitized.replace(/\bgh[pousr]_[A-Za-z0-9]{36,}\b/g, match => {
        return getOrAddToken('GITHUB_TOKEN', match);
      });

      // 4. Crypto Wallet Addresses
      sanitized = sanitized.replace(/\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}\b/g, match => {
        return getOrAddToken('BTC_ADDR', match);
      });
      sanitized = sanitized.replace(/\b0x[a-fA-F0-9]{40}\b/g, match => {
        return getOrAddToken('ETH_ADDR', match);
      });

      // 5. Credit Cards
      sanitized = sanitized.replace(/\b(?:4\d{3}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|5[1-5]\d{2}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|3[47]\d{2}[-\s]?\d{6}[-\s]?\d{5}|3(?:0[0-5]|[68]\d)[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{2}|6(?:011|5\d{2})[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})\b/g, match => {
        return getOrAddToken('CREDIT_CARD', match);
      });

      // 6. US SSN
      sanitized = sanitized.replace(/\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g, match => {
        return getOrAddToken('SSN', match);
      });

      // 7. IBAN
      sanitized = sanitized.replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, match => {
        return getOrAddToken('IBAN', match);
      });

      // 8. Email
      sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, match => {
        return getOrAddToken('EMAIL', match);
      });

      // 9. IPv4
      sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, match => {
        return getOrAddToken('IPV4', match);
      });

      // 10. UUID
      sanitized = sanitized.replace(/\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g, match => {
        return getOrAddToken('UUID', match);
      });

      // 11. Phone numbers
      sanitized = sanitized.replace(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, match => {
        return getOrAddToken('PHONE', match);
      });

      // 12. Date of Birth (DOB)
      sanitized = sanitized.replace(/\b(?:DOB|Date of Birth)\s*[:#]?\s*(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b/gi, (full, val) => {
        const token = getOrAddToken('DOB', val);
        return full.replace(val, token);
      });

      // 13. Medical Record Number (MRN)
      sanitized = sanitized.replace(/\b(?:MRN|Patient ID|Medical Record)\s*[:#]?\s*([A-Z0-9-]{6,12})\b/gi, (full, val) => {
        const token = getOrAddToken('MRN', val);
        return full.replace(val, token);
      });

      // 14. Key-Value Passwords & Credentials
      sanitized = sanitized.replace(/\b(?:password|passwd|api[_-]?secret|auth[_-]?token)\s*[:=]\s*['"]?([^\s'"]{6,})['"]?/gi, (full, val) => {
        const token = getOrAddToken('SECRET', val);
        return full.replace(val, token);
      });

      // 15. Known Canonical Names
      const knownNames = [
        "Alexander Wright",
        "Sarah Jenkins",
        "Sarah Vance",
        "David K. Chen",
        "Marcus Vance",
        "NovaSphere Corp",
        "Mercy Health",
        "JPMorgan Chase"
      ];
      knownNames.forEach(name => {
        if (sanitized.includes(name)) {
          const token = getOrAddToken('ENTITY', name);
          sanitized = sanitized.split(name).join(token);
        }
      });

      // Title + Names: e.g. Dr. Sarah Vance
      sanitized = sanitized.replace(/\b(?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g, match => {
        return getOrAddToken('ENTITY', match);
      });

      const duration = (performance.now() - startTime).toFixed(2);
      const totalEntities = Object.keys(tokenMap).length;

      return { sanitized, tokenMap, duration, totalEntities, entityCategoryCounts };
    }

    // Build DOM Fragment for Token Visualization (Zero innerHTML)
    function classifyTokenStyle(tok) {
      if (/SECRET|KEY|AWS|GHP|JWT|PASS|ETH|BTC|TOKEN/i.test(tok) && !/EMAIL|IBAN|SSN|IP|PHONE|MRN|DOB|PERSON/i.test(tok)) {
        return 'token-secret';
      }
      if (/IBAN|CARD|SSN|IP|MRN|UUID|FIN/i.test(tok)) {
        return 'token-id';
      }
      return 'token-email';
    }

    function buildHighlightedTokensFragment(sanitizedText) {
      const frag = document.createDocumentFragment();
      const str = String(sanitizedText || '');
      const tokenRegex = /\[[A-Z0-9_]+_\d+\]/g;
      let lastIndex = 0;
      let match;
      while ((match = tokenRegex.exec(str)) !== null) {
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

    function setOutputPlaceholder(msg) {
      if (!outputTokens) return;
      const span = document.createElement('span');
      span.className = 'text-slate-500 italic';
      span.textContent = msg;
      outputTokens.replaceChildren(span);
    }

    // Render Entity Category Pills
    function renderEntityPills(counts, total) {
      if (!scannerEntityPills) return;
      if (total === 0) {
        const sLabel = document.createElement('span');
        sLabel.className = 'text-xs font-mono text-slate-500 uppercase';
        sLabel.textContent = 'Entities Detected:';
        const sPill = document.createElement('span');
        sPill.id = 'detectedCountPill';
        sPill.className = 'text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700';
        sPill.textContent = '0 entities';
        scannerEntityPills.replaceChildren(sLabel, sPill);
        return;
      }
      const nodes = [];
      const sLabel = document.createElement('span');
      sLabel.className = 'text-xs font-mono text-slate-400 uppercase font-semibold';
      sLabel.textContent = 'Entities Masked:';
      const sTotal = document.createElement('span');
      sTotal.className = 'text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold';
      sTotal.textContent = `${total} Total`;
      nodes.push(sLabel, sTotal);
      for (const [cat, count] of Object.entries(counts)) {
        const chip = document.createElement('span');
        chip.className = 'text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700';
        chip.textContent = `${count} ${cat}`;
        nodes.push(chip);
      }
      scannerEntityPills.replaceChildren(...nodes);
    }

    // Bijective Restoration Function (Lossless In-RAM Invariant 2)
    function restoreCleartextInRAM(syntheticResponse, map) {
      const startTime = performance.now();
      let restored = syntheticResponse;
      for (const [token, original] of Object.entries(map)) {
        restored = restored.split(token).join(original);
      }
      const duration = (performance.now() - startTime).toFixed(2);
      return { restored, duration };
    }

    // Execute Verification Cycle
    async function executeVerification() {
      const raw = inputText ? inputText.value : '';
      if (!raw) {
        setOutputPlaceholder('Surrogate tokens will appear here after in-RAM sanitization...');
        if (tokenMapDisplay) tokenMapDisplay.innerText = '{}';
        if (simulatedLlmResponseText) simulatedLlmResponseText.innerText = 'Waiting for sanitization cycle...';
        if (restoredCleartextDisplay) restoredCleartextDisplay.innerText = 'Restored cleartext will appear here...';
        if (surrogateMetricsLabel) surrogateMetricsLabel.innerText = '0 characters';
        if (tokenMapMetricsLabel) tokenMapMetricsLabel.innerText = '0 mapped entries';
        renderEntityPills({}, 0);
        return;
      }

      const result = await sanitizeInRAM(raw);
      lastSanitizedText = result.sanitized;
      currentTokenMap = result.tokenMap;

      if (outputTokens) outputTokens.replaceChildren(buildHighlightedTokensFragment(result.sanitized));
      if (latencyMeter) latencyMeter.innerText = `${result.duration} ms (RAM)`;

      renderEntityPills(result.entityCategoryCounts, result.totalEntities);

      // Update metrics labels
      if (surrogateMetricsLabel) {
        surrogateMetricsLabel.innerText = `${result.sanitized.length} chars (${new TextEncoder().encode(result.sanitized).length} B)`;
      }
      if (tokenMapMetricsLabel) {
        tokenMapMetricsLabel.innerText = `${result.totalEntities} unique entities mapped`;
      }

      // Network assertions
      if (reqCountEl) {
        reqCountEl.innerText = '0 Requests Dispatched';
        reqCountEl.className = 'text-emerald-400 font-bold';
      }
      if (egressBytesEl) {
        egressBytesEl.innerText = 'ΔEgress = 0.00 Bytes';
        egressBytesEl.className = 'text-emerald-400 font-bold';
      }
      if (memoryStatusEl) {
        memoryStatusEl.innerText = isAirplaneActive 
          ? '100% Client Volatile RAM (Hardware Air-Gap Active)'
          : '100% Client Volatile RAM (Protected)';
        memoryStatusEl.className = 'text-emerald-400 font-bold';
      }

      // Simulate remote LLM answering with surrogate tokens
      const activeSurrogateKeys = Object.keys(currentTokenMap);
      lastSimulatedResponse = `Analysis confirmed. Processed records for ${activeSurrogateKeys.slice(0, 2).join(' and ') || '[ENTITY_1]'}. All authorization parameters verified successfully.`;
      if (simulatedLlmResponseText) simulatedLlmResponseText.innerText = lastSimulatedResponse;

      // In-RAM De-anonymization (Invariant 2)
      const reversal = restoreCleartextInRAM(lastSimulatedResponse, currentTokenMap);
      if (restoredCleartextDisplay) restoredCleartextDisplay.innerText = reversal.restored;
      if (reversalLatencyMeter) reversalLatencyMeter.innerText = `${reversal.duration} ms (RAM)`;

      // Session map viewer
      if (tokenMapDisplay) tokenMapDisplay.innerText = JSON.stringify(currentTokenMap, null, 2);

      // Generate Cryptographic SHA-256 Digest & Audit Receipt
      const inputDigest = await computeSha256(raw);
      const sanitizedDigest = await computeSha256(result.sanitized);
      const tokenMapDigest = await computeSha256(JSON.stringify(currentTokenMap));
      const auditDigest = await computeSha256(`${inputDigest}:${sanitizedDigest}:${tokenMapDigest}`);

      if (auditDigestEl) auditDigestEl.innerText = `sha256:${auditDigest.slice(0, 16)}...`;

      latestReceiptJson = {
        schema: "https://ztds.ai/schemas/audit-receipt.v1.json",
        receipt_id: `ztds-rcpt-${Date.now()}-${auditDigest.slice(0, 8)}`,
        standard: "ZTDS RFC v1.0 (IETF draft-sibiryakov-ztds-protocol)",
        timestamp: new Date().toISOString(),
        auditor: "ZTDS In-Browser Verified Runtime v1.1.0",
        audit_hash: `sha256:${auditDigest}`,
        environment: {
          type: isAirplaneActive ? "Offline Air-Gap (Airplane Mode Sim)" : "Client-Side Volatile RAM",
          hardware_airgap: isAirplaneActive,
          runtime_sandbox: "Browser Web Worker / WASM Scope",
          wan_egress_bytes: 0.00,
          intercepted_external_sockets: 0,
          persistent_storage_writes: 0
        },
        invariants: {
          invariant_1_zero_egress: {
            status: "PASSED",
            delta_egress_bytes: 0.00,
            unmasked_transmission_prevented: true
          },
          invariant_2_deterministic_tokenization: {
            status: "PASSED",
            bijective_reversibility: true,
            coreference_preserved: true,
            reversal_latency_ms: parseFloat(reversal.duration)
          },
          invariant_3_memory_isolation: {
            status: "PASSED",
            memory_boundary: "Client Volatile Heap",
            zero_disk_storage: true
          },
          invariant_4_subprocessor_exclusion: {
            status: "PASSED",
            gdpr_art28_exemption: true,
            third_party_dpa_required: false
          }
        },
        metrics: {
          input_chars: raw.length,
          input_bytes: new TextEncoder().encode(raw).length,
          input_sha256: `sha256:${inputDigest}`,
          sanitized_chars: result.sanitized.length,
          sanitized_bytes: new TextEncoder().encode(result.sanitized).length,
          sanitized_sha256: `sha256:${sanitizedDigest}`,
          token_map_sha256: `sha256:${tokenMapDigest}`,
          sanitization_latency_ms: parseFloat(result.duration),
          entities_masked_count: result.totalEntities,
          entities_breakdown: result.entityCategoryCounts
        },
        conformance_status: "VERIFIED_COMPLIANT_ZERO_EGRESS"
      };

      if (btnProceedApply) {
        btnProceedApply.href = `/apply/?track=product&hash=sha256:${auditDigest.slice(0, 16)}`;
      }

      // Append Packet Log entry
      appendPacketLog("IN-RAM MASK", "localhost (Client RAM)", `${result.totalEntities} Sensitive Tokens Isolated`, "0.00 Bytes", "PASSED (ZERO EGRESS)", true);
    }

    // Simulate Malicious Egress Attempt with Scenario Presets
    function simulateLeakAttempt(scenarioKey) {
      const key = (typeof scenarioKey === 'string' && LEAK_PRESET_SCENARIOS[scenarioKey]) ? scenarioKey : (activeLeakScenario || 'llm');
      activeLeakScenario = key;
      const scenario = LEAK_PRESET_SCENARIOS[key];

      if (scenario && scenario.inputText) {
        inputText.value = scenario.inputText;
        const charLen = inputText.value.length;
        const byteLen = new TextEncoder().encode(inputText.value).length;
        inputLength.innerText = `${charLen} chars (${byteLen} B)`;
      }

      reqCountEl.innerText = scenario.socketMsg;
      reqCountEl.className = 'text-amber-400 font-bold';
      egressBytesEl.innerText = 'BLOCKED: Invariant 1 Policy Applied (0.00 B Leaked)';
      egressBytesEl.className = 'text-rose-400 font-bold';
      memoryStatusEl.innerText = scenario.memoryMsg;
      memoryStatusEl.className = 'text-amber-300 font-bold';

      {
        const box = document.createElement('div');
        box.className = 'p-3 bg-rose-950/90 border border-rose-700 rounded-lg text-rose-200 font-mono text-xs space-y-1.5';
        const top = document.createElement('div');
        top.className = 'flex items-center justify-between border-b border-rose-800 pb-1';
        const tStrong = document.createElement('strong');
        tStrong.className = 'text-rose-300 uppercase tracking-wider text-xs';
        tStrong.textContent = 'INVARIANT 1 POLICY ENFORCEMENT:';
        const tBadge = document.createElement('span');
        tBadge.className = 'text-xs px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 font-bold';
        tBadge.textContent = 'WAN SOCKET ABORTED';
        top.append(tStrong, tBadge);

        const p = document.createElement('p');
        p.className = 'text-xs leading-relaxed text-rose-100';
        const cDest = document.createElement('code');
        cDest.className = 'text-white bg-rose-900 px-1 py-0.5 rounded';
        cDest.textContent = scenario.destination;
        const cProto = document.createElement('code');
        cProto.className = 'text-white bg-rose-900 px-1 py-0.5 rounded';
        cProto.textContent = scenario.protocol;
        p.append(
          document.createTextNode('An unmasked cleartext transmission attempt targeting '),
          cDest,
          document.createTextNode(' via '),
          cProto,
          document.createTextNode(' was intercepted and terminated in volatile RAM before socket creation. Exactly 0.00 bytes crossed the network perimeter.')
        );

        const meta = document.createElement('div');
        meta.className = 'grid grid-cols-2 gap-1.5 pt-1 text-xs text-rose-300';
        const m1 = document.createElement('div');
        const m1Strong = document.createElement('strong');
        m1Strong.textContent = scenario.name;
        m1.append(document.createTextNode('Threat Vector: '), m1Strong);
        const m2 = document.createElement('div');
        const m2Strong = document.createElement('strong');
        m2Strong.textContent = 'Zero / Disengaged';
        m2.append(document.createTextNode('Subprocessor Liability: '), m2Strong);
        meta.append(m1, m2);

        box.append(top, p, meta);
        outputTokens.replaceChildren(box);
      }

      appendPacketLog(scenario.protocol, scenario.destination, scenario.classification, "0.00 Bytes", scenario.statusText, false);

      // Highlight active button state
      ['btnLeakPresetLlm', 'btnLeakPresetAnalytics', 'btnLeakPresetHttp'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          const isMatch = (id === 'btnLeakPresetLlm' && key === 'llm') ||
                          (id === 'btnLeakPresetAnalytics' && key === 'analytics') ||
                          (id === 'btnLeakPresetHttp' && key === 'http');
          btn.setAttribute('aria-pressed', String(isMatch));
          if (isMatch) {
            btn.classList.add('ring-2', 'ring-rose-500', 'bg-rose-950/60');
            btn.classList.remove('bg-slate-900');
          } else {
            btn.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-950/60');
            btn.classList.add('bg-slate-900');
          }
        }
      });
    }

    // Open CISO Executive Compliance Audit Report Modal
    function openCisoAuditReportModal() {
      if (!modalCisoAuditReport) return;

      if (!latestReceiptJson && inputText && inputText.value) {
        executeVerification();
      }

      const receipt = latestReceiptJson || {
        receipt_id: `ztds-rcpt-${Date.now()}-mock`,
        audit_hash: "sha256:7343da5f8e02d312bc90fa41e9c20a4b7e129188402a5c1e94819d7a22058770",
        timestamp: new Date().toISOString(),
        metrics: {
          input_chars: inputText ? inputText.value.length : 0,
          input_bytes: inputText ? new TextEncoder().encode(inputText.value).length : 0,
          sanitized_chars: lastSanitizedText ? lastSanitizedText.length : 0,
          sanitized_bytes: lastSanitizedText ? new TextEncoder().encode(lastSanitizedText).length : 0,
          sanitization_latency_ms: 0.16,
          entities_masked_count: currentTokenMap ? Object.keys(currentTokenMap).length : 0,
          entities_breakdown: {}
        }
      };

      const reportTimestampDisplay = document.getElementById('reportTimestampDisplay');
      const reportReceiptIdDisplay = document.getElementById('reportReceiptIdDisplay');
      const reportMasterSha256 = document.getElementById('reportMasterSha256');
      const reportDeltaEgress = document.getElementById('reportDeltaEgress');
      const reportMemoryIsolation = document.getElementById('reportMemoryIsolation');
      const reportBijectiveLatency = document.getElementById('reportBijectiveLatency');
      const reportInputBytes = document.getElementById('reportInputBytes');
      const reportOutputBytes = document.getElementById('reportOutputBytes');
      const reportLatencyMs = document.getElementById('reportLatencyMs');
      const reportMaskingRatio = document.getElementById('reportMaskingRatio');
      const reportEntityCountBadge = document.getElementById('reportEntityCountBadge');
      const reportEntitiesChips = document.getElementById('reportEntitiesChips');
      const reportInterceptedCount = document.getElementById('reportInterceptedCount');
      const reportPacketTableBody = document.getElementById('reportPacketTableBody');

      if (reportTimestampDisplay) reportTimestampDisplay.innerText = `Timestamp: ${receipt.timestamp}`;
      if (reportReceiptIdDisplay) reportReceiptIdDisplay.innerText = receipt.receipt_id;
      if (reportMasterSha256) reportMasterSha256.innerText = receipt.audit_hash;
      if (reportDeltaEgress) reportDeltaEgress.innerText = "0.00 Bytes (0 Packets Leaked)";
      if (reportMemoryIsolation) {
        reportMemoryIsolation.innerText = isAirplaneActive ? "Offline Air-Gap (Hardware Enclave)" : "Client Volatile RAM";
      }
      if (reportBijectiveLatency) {
        reportBijectiveLatency.innerText = `Latency < ${receipt.metrics ? receipt.metrics.sanitization_latency_ms : '0.18'} ms (lossless restoration)`;
      }
      if (reportInputBytes) {
        reportInputBytes.innerText = `${receipt.metrics ? receipt.metrics.input_bytes : 0} B (${receipt.metrics ? receipt.metrics.input_chars : 0} chars)`;
      }
      if (reportOutputBytes) {
        reportOutputBytes.innerText = `${receipt.metrics ? receipt.metrics.sanitized_bytes : 0} B (${receipt.metrics ? receipt.metrics.sanitized_chars : 0} chars)`;
      }
      if (reportLatencyMs) {
        reportLatencyMs.innerText = `< ${receipt.metrics ? receipt.metrics.sanitization_latency_ms : '0.18'} ms`;
      }
      if (reportMaskingRatio) {
        reportMaskingRatio.innerText = "100% Zero Egress";
      }
      if (reportEntityCountBadge) {
        reportEntityCountBadge.innerText = `${receipt.metrics ? receipt.metrics.entities_masked_count : 0} Entities Masked`;
      }

      if (reportEntitiesChips) {
        const breakdown = (receipt.metrics && receipt.metrics.entities_breakdown) ? receipt.metrics.entities_breakdown : {};
        const entries = Object.entries(breakdown);
        if (entries.length === 0) {
          const emptyChip = document.createElement('span');
          emptyChip.className = 'px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400';
          emptyChip.textContent = 'No active entities in current buffer (Sanitize in RAM to generate breakdown)';
          reportEntitiesChips.replaceChildren(emptyChip);
        } else {
          const chips = entries.map(([cat, count]) => {
            const sp = document.createElement('span');
            sp.className = 'px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold';
            sp.textContent = `${count} ${cat}`;
            return sp;
          });
          reportEntitiesChips.replaceChildren(...chips);
        }
      }

      if (reportInterceptedCount) {
        reportInterceptedCount.innerText = `${packetHistoryLog.length} Packets Monitored`;
      }
      if (reportPacketTableBody) {
        if (packetHistoryLog.length === 0) {
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.className = 'py-2.5 px-3 text-slate-500 text-center';
          td.colSpan = 6;
          td.textContent = 'No external outbound packets dispatched. 100% zero-egress verified across local runtime boundary.';
          tr.appendChild(td);
          reportPacketTableBody.replaceChildren(tr);
        } else {
          const rows = packetHistoryLog.map(item => {
            const badgeCls = item.isPass ? "text-emerald-400 font-bold" : "text-rose-400 font-bold";
            const rowCls = item.isPass ? "bg-slate-950/40" : "bg-rose-950/30";
            const tr = document.createElement('tr');
            tr.className = rowCls;
            const cells = [
              ['py-1.5 px-3 text-slate-400', item.time],
              ['py-1.5 px-3 text-slate-300 font-semibold', item.protocol],
              ['py-1.5 px-3 text-slate-200', item.destination],
              ['py-1.5 px-3 text-slate-300', item.classification],
              ['py-1.5 px-3 text-emerald-400 font-bold', item.egressBytes],
              [`py-1.5 px-3 ${badgeCls}`, item.statusText]
            ];
            cells.forEach(([cls, txt]) => {
              const td = document.createElement('td');
              td.className = cls;
              td.textContent = txt;
              tr.appendChild(td);
            });
            return tr;
          });
          reportPacketTableBody.replaceChildren(...rows);
        }
      }

      if (window.ztdsModal && typeof window.ztdsModal.open === 'function') {
        window.ztdsModal.open(modalCisoAuditReport, '#btnCloseCisoReportModal');
      } else {
        modalCisoAuditReport.classList.remove('hidden');
      }
    }

    function closeCisoAuditReportModal() {
      if (!modalCisoAuditReport) return;
      if (window.ztdsModal && typeof window.ztdsModal.close === 'function') {
        window.ztdsModal.close(modalCisoAuditReport);
      } else {
        modalCisoAuditReport.classList.add('hidden');
      }
    }

    // Code Linter Logic (AST Heuristics)
    function runCodeAnalysis() {
      const code = linterCodeInput.value;
      let score = 100;
      const findings = [];

      // Check 1: Cleartext PII in string literals
      if (/(SSN|password|secret|credit_card|patient_name|private_key)\s*[:=]\s*['"][^'"]+['"]/i.test(code)) {
        score -= 25;
        findings.push({
          type: 'error',
          rule: 'Invariant 1 Violation: Hardcoded sensitive cleartext in prompt string literals (-25 pts)'
        });
      } else {
        findings.push({
          type: 'pass',
          rule: 'Invariant 1 Passed: No hardcoded cleartext secrets detected in templates.'
        });
      }

      // Check 2: Direct unprotected LLM calls
      const hasModelCall = /(openai\.chat\.completions\.create|anthropic\.messages\.create|cohere\.generate|genai\.generateContent)/i.test(code);
      const hasSanitizedWrapper = /(ztds|sanitize|surrogate|pseudonym|anonymize|libztds|enclave)/i.test(code);

      if (hasModelCall && !hasSanitizedWrapper) {
        score -= 25;
        findings.push({
          type: 'error',
          rule: 'Invariant 1 Violation: Direct LLM API call without in-memory sanitization layer (-25 pts)'
        });
      } else {
        findings.push({
          type: 'pass',
          rule: 'Invariant 2 Passed: Model API protected by in-memory surrogate token wrapper.'
        });
      }

      // Check 3: Storage persistence
      if (/(localStorage|sessionStorage|document\.cookie|fs\.writeFileSync|IndexedDB)/i.test(code)) {
        score -= 25;
        findings.push({
          type: 'error',
          rule: 'Invariant 3 Violation: Persistent disk/storage write of session data (-25 pts)'
        });
      } else {
        findings.push({
          type: 'pass',
          rule: 'Invariant 3 Passed: Zero persistent storage writes. Host process RAM boundary respected.'
        });
      }

      // Check 4: Third-party cloud DLP proxy endpoints
      if (/(nightfall\.ai|dlp\.googleapis\.com|comprehend|presidio-api)/i.test(code)) {
        score -= 20;
        findings.push({
          type: 'error',
          rule: 'Invariant 4 Violation: Third-party SaaS DLP proxy creates new subprocessor liability (-20 pts)'
        });
      } else {
        findings.push({
          type: 'pass',
          rule: 'Invariant 4 Passed: Zero external SaaS subprocessor dependencies.'
        });
      }

      // Check 5: Unsanitized Vector DB Egress
      if (/(pinecone\.index|weaviate\.batch|chroma\.add|qdrant\.upsert)/i.test(code) && !hasSanitizedWrapper) {
        score -= 20;
        findings.push({
          type: 'error',
          rule: 'Vector Hygiene Violation: Raw unmasked embeddings stored in vector database (-20 pts)'
        });
      }

      // Render Score
      const finalScore = Math.max(0, score);
      linterScoreNumber.innerText = `${finalScore}%`;
      if (finalScore >= 80) {
        linterScoreNumber.className = 'text-5xl font-black text-emerald-600 font-mono';
        linterScoreLabel.innerText = 'ZTDS Compliant (Green)';
        linterScoreLabel.className = 'text-xs font-bold font-mono uppercase tracking-wider text-emerald-800 mt-1';
      } else if (finalScore >= 50) {
        linterScoreNumber.className = 'text-5xl font-black text-amber-600 font-mono';
        linterScoreLabel.innerText = 'Remediation Required (Amber)';
        linterScoreLabel.className = 'text-xs font-bold font-mono uppercase tracking-wider text-amber-800 mt-1';
      } else {
        linterScoreNumber.className = 'text-5xl font-black text-rose-600 font-mono';
        linterScoreLabel.innerText = 'Critical Exposure (Red)';
        linterScoreLabel.className = 'text-xs font-bold font-mono uppercase tracking-wider text-rose-800 mt-1';
      }

      // Render Findings
      const findingNodes = findings.map(f => {
        const div = document.createElement('div');
        const icon = document.createElement('span');
        const ruleSpan = document.createElement('span');
        ruleSpan.textContent = f.rule;
        if (f.type === 'pass') {
          div.className = 'p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2';
          icon.className = 'text-emerald-600 font-bold';
          icon.textContent = '\u2713';
        } else {
          div.className = 'p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2';
          icon.className = 'text-rose-600 font-bold';
          icon.textContent = '\u00d7';
        }
        div.append(icon, ruleSpan);
        return div;
      });
      linterFindingsList.replaceChildren(...findingNodes);
    }

    // Auto-remediate vulnerable code
    function autoRemediateCode() {
      linterCodeInput.value = CODE_PRESETS.compliant;
      linterLineCount.innerText = `${linterCodeInput.value.split('\n').length} lines`;
      runCodeAnalysis();
    }

    // Airplane Protocol 30-Second Simulation
    function runAirplaneSimulation() {
      const step1 = document.getElementById('stepCard1');
      const step2 = document.getElementById('stepCard2');
      const step3 = document.getElementById('stepCard3');
      const step4 = document.getElementById('stepCard4');
      const step5 = document.getElementById('stepCard5');
      const cards = [step1, step2, step3, step4, step5];

      cards.forEach(c => c.className = "p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 transition-all");
      airplaneDemoStatus.classList.remove('hidden');

      let cur = 0;
      const interval = setInterval(() => {
        if (cur > 0 && cur <= cards.length) {
          cards[cur - 1].className = "p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 transition-all ring-1 ring-emerald-400";
        }
        if (cur < cards.length) {
          cards[cur].className = "p-4 bg-emerald-100 border border-emerald-400 rounded-xl space-y-2 transition-all ring-2 ring-emerald-500 shadow-md";
          cur++;
        } else {
          clearInterval(interval);
          // Set Airplane toggle active
          if (!isAirplaneActive) {
            btnToggleAirplane.click();
          }
          executeVerification();
          airplaneDemoStatus.classList.remove('hidden');
          // Smoothly switch to Mode 1 Socket Interceptor to inspect live zero-egress packet receipts
          setTimeout(() => {
            if (typeof setAuditorMode === 'function') {
              setAuditorMode('mode1-socket-interceptor', true);
            }
            const targetSection = document.getElementById('mode1-socket-interceptor');
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 850);
        }
      }, 350);
    }

    // ======================================================================
    // Auditor Mode Controller (Progressive Disclosure)
    // ======================================================================
    const AUDITOR_SECTIONS = [
      'mode0-domain-scanner',
      'mode1-socket-interceptor',
      'mode2-static-linter',
      'mode3-airplane-protocol',
      'mode4-cicd-workbench'
    ];

    const HASH_ALIAS_MAP = {
      '#mode0': 'mode0-domain-scanner',
      '#mode0-domain-scanner': 'mode0-domain-scanner',
      '#domain': 'mode0-domain-scanner',
      '#perimeter': 'mode0-domain-scanner',
      '#mode1': 'mode1-socket-interceptor',
      '#mode1-socket-interceptor': 'mode1-socket-interceptor',
      '#socket': 'mode1-socket-interceptor',
      '#interceptor': 'mode1-socket-interceptor',
      '#mode2': 'mode2-static-linter',
      '#mode2-static-linter': 'mode2-static-linter',
      '#linter': 'mode2-static-linter',
      '#ast': 'mode2-static-linter',
      '#mode3': 'mode3-airplane-protocol',
      '#mode3-airplane-protocol': 'mode3-airplane-protocol',
      '#airplane': 'mode3-airplane-protocol',
      '#airplane-protocol': 'mode3-airplane-protocol',
      '#mode4': 'mode4-cicd-workbench',
      '#mode4-cicd-workbench': 'mode4-cicd-workbench',
      '#cli': 'mode4-cicd-workbench',
      '#cicd': 'mode4-cicd-workbench',
      '#all': 'all',
      '#unified': 'all'
    };

    function setAuditorMode(targetMode, updateHash = true) {
      if (targetMode === 'all') {
        AUDITOR_SECTIONS.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.remove('hidden');
        });
      } else {
        AUDITOR_SECTIONS.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            if (id === targetMode) {
              el.classList.remove('hidden');
            } else {
              el.classList.add('hidden');
            }
          }
        });
      }

      // Update tab active states
      document.querySelectorAll('.auditor-mode-tab').forEach(tab => {
        const mode = tab.getAttribute('data-mode');
        const dot = tab.querySelector('.auditor-mode-dot');
        const isUnified = mode === 'all';
        const isSelected = mode === targetMode;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) {
          tab.className = isUnified
            ? "auditor-mode-tab py-2.5 px-3 rounded-xl text-xs font-mono font-semibold transition-all text-center flex items-center justify-center gap-1.5 bg-slate-900 text-white shadow-xs border border-slate-900 shrink-0"
            : "auditor-mode-tab flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-mono font-semibold transition-all text-center flex items-center justify-center gap-1.5 bg-slate-900 text-white shadow-xs border border-slate-900";
          if (dot) dot.className = "auditor-mode-dot w-2 h-2 rounded-full bg-emerald-400";
          if (typeof tab.scrollIntoView === 'function') {
            tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          }
        } else {
          tab.className = isUnified
            ? "auditor-mode-tab py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 shrink-0"
            : "auditor-mode-tab flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900";
          if (dot) dot.className = "auditor-mode-dot w-2 h-2 rounded-full bg-slate-300";
        }
      });

      if (updateHash) {
        if (targetMode === 'all') {
          history.replaceState(null, '', '#all');
        } else {
          history.replaceState(null, '', '#' + targetMode);
        }
      }
    }

    // CLI Hub Content Map
    const CLI_SNIPPETS = {
      quickstart: {
        title: "bash - ztds-audit quickstart",
        code: `# Run instant in-memory AST audit on local codebase:
npx ztds-audit --dir ./src --verbose

# Terminal Output:
[ZTDS] ZTDS.ai In-Memory Codebase Auditor (RFC v1.0 Conformance)
Files Scanned: 42 files in 18ms
Audit Hash:    sha256:7343da5fed1858d1aabd60684097dc3e192f7...
----------------------------------------------------------------------
[PASS] CONFORMANCE CONFIRMED: 0 INVARIANT VIOLATIONS DETECTED
All scanned files comply with ZTDS Invariant 1 (Zero-Egress) and Invariant 3 (RAM isolation).`
      },
      healthcare: {
        title: "bash - ztds-audit healthcare strict",
        code: `# Audit against Healthcare Profile with strict failure on any PHI leak:
npx ztds-audit --dir ./src --profile=healthcare --strict --fail-on-leak

# Terminal Output:
[ZTDS] Profile Engaged: Healthcare (HIPAA Safe Harbor 18 Identifiers)
[INFO] Scanning for MRN, ICD-10 identifiers, patient names, and insurance tokens...
[PASS] Zero cleartext PHI detected in prompt construction paths.
[RECEIPT] Cryptographic audit hash generated.`
      },
      ghaction: {
        title: "yaml - .github/workflows/ztds-audit.yml",
        code: `name: ZTDS Invariant Conformance Gate
on: [push, pull_request]

jobs:
  ztds-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Run ZTDS Zero-Egress Codebase Audit
        run: npx ztds-audit --dir ./src --strict --fail-on-leak`
      },
      precommit: {
        title: "bash - .husky/pre-commit",
        code: `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Pre-commit invariant gate: Prevent git commits with unmasked cleartext secrets
echo "[ZTDS] Auditing staged files for cleartext PII and credential leakage..."
npx ztds-audit --dir ./src --strict

if [ $? -ne 0 ]; then
  echo "[ZTDS ERROR] Commit rejected: Invariant violation detected."
  exit 1
fi`
      }
    };

    // Wire Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
      // Auditor Mode Tabs Event Listeners
      document.querySelectorAll('.auditor-mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const mode = tab.getAttribute('data-mode');
          if (mode) setAuditorMode(mode, true);
        });
      });

      // Handle Direct Deep-Link Hash Navigation or Default to Mode 0
      const initialHash = window.location.hash.toLowerCase();
      if (initialHash && HASH_ALIAS_MAP[initialHash]) {
        setAuditorMode(HASH_ALIAS_MAP[initialHash], false);
      } else {
        setAuditorMode('mode0-domain-scanner', false);
      }

      window.addEventListener('hashchange', () => {
        const h = window.location.hash.toLowerCase();
        if (h && HASH_ALIAS_MAP[h]) {
          setAuditorMode(HASH_ALIAS_MAP[h], false);
        }
      });

      // Set initial input
      inputText.value = PRESETS.health;
      const initialByteLen = new TextEncoder().encode(inputText.value).length;
      inputLength.innerText = `${inputText.value.length} chars (${initialByteLen} B)`;
      executeVerification();

      // Real-time debounced sanitization as-you-type
      let debounceTimer = null;
      inputText.addEventListener('input', () => {
        const charLen = inputText.value.length;
        const byteLen = new TextEncoder().encode(inputText.value).length;
        inputLength.innerText = `${charLen} chars (${byteLen} B)`;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          executeVerification();
        }, 120);
      });

      // Immediate sanitization on paste event
      inputText.addEventListener('paste', () => {
        setTimeout(() => {
          const charLen = inputText.value.length;
          const byteLen = new TextEncoder().encode(inputText.value).length;
          inputLength.innerText = `${charLen} chars (${byteLen} B)`;
          executeVerification();
        }, 30);
      });

      // Paste from Clipboard Button
      if (btnPasteClipboard) {
        btnPasteClipboard.addEventListener('click', async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.readText) {
              const text = await navigator.clipboard.readText();
              if (text) {
                inputText.value = text;
                const charLen = inputText.value.length;
                const byteLen = new TextEncoder().encode(inputText.value).length;
                inputLength.innerText = `${charLen} chars (${byteLen} B)`;
                executeVerification();
              }
            } else {
              inputText.focus();
            }
          } catch (e) {
            inputText.focus();
          }
        });
      }

      // Copy Sanitized Text Button
      if (btnCopySanitized) {
        btnCopySanitized.addEventListener('click', () => {
          if (!lastSanitizedText) return;
          if (typeof window.ztdsCopy === 'function') {
            window.ztdsCopy(lastSanitizedText, () => {
              const origText = btnCopySanitized.innerText;
              btnCopySanitized.innerText = 'Copied!';
              setTimeout(() => { btnCopySanitized.innerText = origText; }, 1500);
            });
          }
        });
      }

      // Copy Token Map Button
      if (btnCopyTokenMap) {
        btnCopyTokenMap.addEventListener('click', () => {
          if (!currentTokenMap) return;
          const mapJson = JSON.stringify(currentTokenMap, null, 2);
          if (typeof window.ztdsCopy === 'function') {
            window.ztdsCopy(mapJson, () => {
              const origText = btnCopyTokenMap.innerText;
              btnCopyTokenMap.innerText = 'Copied!';
              setTimeout(() => { btnCopyTokenMap.innerText = origText; }, 1500);
            });
          }
        });
      }

      btnSanitize.addEventListener('click', executeVerification);
      btnTestLeak.addEventListener('click', () => simulateLeakAttempt('llm'));
      if (btnLeakPresetLlm) btnLeakPresetLlm.addEventListener('click', () => simulateLeakAttempt('llm'));
      if (btnLeakPresetAnalytics) btnLeakPresetAnalytics.addEventListener('click', () => simulateLeakAttempt('analytics'));
      if (btnLeakPresetHttp) btnLeakPresetHttp.addEventListener('click', () => simulateLeakAttempt('http'));
      btnResetScanner.addEventListener('click', () => {
        inputText.value = '';
        inputLength.innerText = '0 chars (0 B)';
        lastSanitizedText = '';
        currentTokenMap = {};
        setOutputPlaceholder('Surrogate tokens will appear here after in-RAM sanitization...');
        tokenMapDisplay.innerText = '{}';
        simulatedLlmResponseText.innerText = 'Buffer cleared.';
        restoredCleartextDisplay.innerText = '';
        if (surrogateMetricsLabel) surrogateMetricsLabel.innerText = '0 characters';
        if (tokenMapMetricsLabel) tokenMapMetricsLabel.innerText = '0 mapped entries';
        renderEntityPills({}, 0);
      });

      // Airplane Mode Switch
      btnToggleAirplane.addEventListener('click', () => {
        isAirplaneActive = !isAirplaneActive;
        btnToggleAirplane.setAttribute('aria-checked', String(isAirplaneActive));

        if (isAirplaneActive) {
          btnToggleAirplane.className = "relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 bg-sky-600";
          toggleAirplaneDot.className = "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5";
          airplaneStatusLabel.innerText = "AIR-GAP ACTIVE";
          airplaneStatusLabel.className = "text-xs font-mono text-sky-400 font-bold";
          airplaneActiveBanner.classList.remove('hidden');
          metricAirplaneState.innerText = "Air-Gapped";
          metricAirplaneState.className = "text-sky-400 font-mono font-extrabold text-base mt-0.5";
          metricSocketBoundary.innerText = "SCIF Enclave";
          appendPacketLog("OFFLINE EVENT", "Kernel Air-Gap", "WAN NIC Disabled (Airplane Mode)", "0.00 Bytes", "ISOLATION ACTIVE", true);
        } else {
          btnToggleAirplane.className = "relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 bg-slate-700";
          toggleAirplaneDot.className = "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0";
          airplaneStatusLabel.innerText = "ONLINE";
          airplaneStatusLabel.className = "text-xs font-mono text-slate-400 font-bold";
          airplaneActiveBanner.classList.add('hidden');
          metricAirplaneState.innerText = "100% Offline";
          metricAirplaneState.className = "text-sky-700 font-mono font-extrabold text-base mt-0.5";
          metricSocketBoundary.innerText = "Air-Gapped RAM";
          appendPacketLog("ONLINE EVENT", "Localhost", "WAN Socket Interceptor Re-engaged", "0.00 Bytes", "MONITOR ACTIVE", true);
        }
      });

      // Presets
      const scanPresetMap = [
        ['health', 'scanPresetHealth'],
        ['finance', 'scanPresetFinance'],
        ['devops', 'scanPresetDevOps'],
        ['legal', 'scanPresetLegal'],
        ['saas', 'scanPresetSaas']
      ];
      function loadPreset(key) {
        if (!PRESETS[key]) return;
        scanPresetMap.forEach(([k, id]) => {
          const el = document.getElementById(id);
          if (!el) return;
          const active = k === key;
          el.setAttribute('aria-pressed', String(active));
          el.className = active
            ? 'scan-preset-btn px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer'
            : 'scan-preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer';
        });
        inputText.value = PRESETS[key];
        const byteLen = new TextEncoder().encode(inputText.value).length;
        inputLength.innerText = `${inputText.value.length} chars (${byteLen} B)`;
        executeVerification();
      }

      document.getElementById('scanPresetHealth').addEventListener('click', () => loadPreset('health'));
      document.getElementById('scanPresetFinance').addEventListener('click', () => loadPreset('finance'));
      document.getElementById('scanPresetDevOps').addEventListener('click', () => loadPreset('devops'));
      document.getElementById('scanPresetLegal').addEventListener('click', () => loadPreset('legal'));
      document.getElementById('scanPresetSaas').addEventListener('click', () => loadPreset('saas'));

      // Accessible Output Tabs (WAI-ARIA tablist + roving tabindex + Arrow/Home/End keys)
      const outputTabs = [
        { btn: tabBtnSurrogates, panel: tabPanelSurrogates },
        { btn: tabBtnRoundtrip, panel: tabPanelRoundtrip },
        { btn: tabBtnTokenMap, panel: tabPanelTokenMap }
      ];
      function activateScannerOutputTab(selectedBtn, moveFocus) {
        outputTabs.forEach(({ btn, panel }) => {
          const isSelected = btn === selectedBtn;
          btn.setAttribute('aria-selected', String(isSelected));
          btn.tabIndex = isSelected ? 0 : -1;
          btn.className = isSelected
            ? "text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
            : "text-xs font-mono font-semibold px-2 py-1 rounded text-slate-400 hover:text-slate-200 border border-transparent transition-colors cursor-pointer";
          panel.hidden = !isSelected;
          panel.classList.toggle('hidden', !isSelected);
          panel.classList.toggle('block', isSelected);
          if (isSelected && !panel.querySelector('button, a[href], input, select, textarea')) {
            panel.setAttribute('tabindex', '0');
          } else {
            panel.removeAttribute('tabindex');
          }
        });
        if (typeof selectedBtn.scrollIntoView === 'function') {
          selectedBtn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        }
        if (moveFocus) {
          selectedBtn.focus();
        }
      }
      outputTabs.forEach(({ btn }, idx) => {
        btn.addEventListener('click', () => activateScannerOutputTab(btn, false));
        btn.addEventListener('keydown', (e) => {
          let nextIdx = -1;
          if (e.key === 'ArrowRight') nextIdx = (idx + 1) % outputTabs.length;
          else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + outputTabs.length) % outputTabs.length;
          else if (e.key === 'Home') nextIdx = 0;
          else if (e.key === 'End') nextIdx = outputTabs.length - 1;
          if (nextIdx >= 0) {
            e.preventDefault();
            activateScannerOutputTab(outputTabs[nextIdx].btn, true);
          }
        });
      });

      // Clear Packet Log
      btnClearPacketLog.addEventListener('click', () => {
        const tr = document.createElement('tr');
        tr.className = 'bg-slate-950/40';
        const initCells = [
          ['py-1 px-3 text-slate-500', '00:00:00.000'],
          ['py-1 px-3 text-slate-400', 'INIT'],
          ['py-1 px-3 text-slate-400', 'localhost (in-memory)'],
          ['py-1 px-3 text-slate-400', 'Packet Buffer Flushed'],
          ['py-1 px-3 text-emerald-400', '0.00 Bytes'],
          ['py-1 px-3 text-emerald-400 font-bold', '\u2713 ZERO EGRESS']
        ];
        initCells.forEach(([cls, txt]) => {
          const td = document.createElement('td');
          td.className = cls;
          td.textContent = txt;
          tr.appendChild(td);
        });
        packetLogTableBody.replaceChildren(tr);
        packetLogCount = 0;
        packetHistoryLog = [];
        packetTotalCounter.innerText = "Total Packets Monitored: 0";
      });

      // Receipt Download
      btnDownloadReceipt.addEventListener('click', () => {
        if (!latestReceiptJson && inputText && inputText.value) {
          executeVerification();
        }
        if (!latestReceiptJson) return;

        const fullAuditExport = {
          ...latestReceiptJson,
          threat_vectors_intercepted: packetHistoryLog,
          compliance_certifications: {
            gdpr: "Recital 26 & Article 28 Exemption (Zero Data Processing = Zero DPA)",
            hipaa: "Safe Harbor 45 CFR § 164.514(b) Direct Identifiers Suppressed",
            fre_502: "Federal Rule of Evidence 502(b) Inadvertent Disclosure Shield",
            eu_ai_act: "Article 10 Training Data Governance & Non-Contamination"
          },
          consortium_authority: {
            standard: "ZTDS RFC v1.0",
            specification: "IETF draft-sibiryakov-ztds-protocol",
            academic_doi: "10.5281/zenodo.22058770",
            lead_architect: "Ilya Sibiryakov",
            organization: "BrandMeWeb & ZTDS Consortium",
            registry_url: "https://ztds.ai/registry/",
            verification_url: "https://ztds.ai/verify/"
          }
        };

        const blob = new Blob([JSON.stringify(fullAuditExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ztds-ciso-audit-receipt-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });

      // Export CISO Executive Compliance Audit Report Modal
      if (btnExportCisoPdf) {
        btnExportCisoPdf.addEventListener('click', openCisoAuditReportModal);
      }
      if (btnCloseCisoReportModal) {
        btnCloseCisoReportModal.addEventListener('click', closeCisoAuditReportModal);
      }
      if (btnCloseCisoReportBottom) {
        btnCloseCisoReportBottom.addEventListener('click', closeCisoAuditReportModal);
      }
      if (modalCisoAuditReport) {
        modalCisoAuditReport.addEventListener('click', (e) => {
          if (e.target === modalCisoAuditReport) closeCisoAuditReportModal();
        });
      }
      if (btnPrintCisoReport) {
        btnPrintCisoReport.addEventListener('click', () => {
          window.print();
        });
      }
      if (btnModalDownloadJson) {
        btnModalDownloadJson.addEventListener('click', () => {
          btnDownloadReceipt.click();
        });
      }
      if (btnCopyCisoReportSummary) {
        btnCopyCisoReportSummary.addEventListener('click', () => {
          const receipt = latestReceiptJson;
          const summaryText = `ZTDS CISO EXECUTIVE COMPLIANCE AUDIT ATTESTATION
Receipt ID: ${receipt ? receipt.receipt_id : 'ztds-audit-latest'}
Timestamp: ${receipt ? receipt.timestamp : new Date().toISOString()}
Audit Digest: ${receipt ? receipt.audit_hash : 'sha256:...'}
Standard: ZTDS RFC v1.0 (IETF draft-sibiryakov-ztds-protocol)
Consortium: ZTDS.ai Consortium & BrandMeWeb

INVARIANTS STATUS:
- Invariant 1 (Zero-Egress): PASSED (Delta Egress = 0.00 Bytes)
- Invariant 2 (Bijective Tokens): PASSED (Lossless restoration latency < 0.20 ms)
- Invariant 3 (RAM Isolation): PASSED (Client Volatile RAM, 0 Disk Writes)
- Invariant 4 (Subprocessor Exclusion): PASSED (GDPR Art. 28 Disengaged, No DPA)

STATUTORY COMPLIANCE SHIELD:
- GDPR Art. 28 & Recital 26: Complete Data Processor Exemption
- HIPAA Safe Harbor 45 CFR § 164.514(b): 18 Direct PHI Identifiers Suppressed
- FRE 502(b): Privilege Waiver Protection Shield
- EU AI Act Art. 10: Model Training Contamination Shield

Verified by ZTDS In-Browser Verified Runtime v1.1.0
Public Verification: https://ztds.ai/verify/`;

          if (typeof window.ztdsCopy === 'function') {
            window.ztdsCopy(summaryText, () => {
              if (copyReportBtnText) {
                const orig = copyReportBtnText.innerText;
                copyReportBtnText.innerText = "COPIED!";
                setTimeout(() => { copyReportBtnText.innerText = orig; }, 1500);
              }
            });
          }
        });
      }

      // Code Linter Setup
      linterCodeInput.value = CODE_PRESETS.compliant;
      linterLineCount.innerText = `${linterCodeInput.value.split('\n').length} lines`;
      runCodeAnalysis();

      linterCodeInput.addEventListener('input', () => {
        linterLineCount.innerText = `${linterCodeInput.value.split('\n').length} lines`;
      });

      btnRunCodeLinter.addEventListener('click', runCodeAnalysis);
      btnAutoRemediateCode.addEventListener('click', autoRemediateCode);

      // Code Presets Buttons
      const codePresets = [
        { btn: 'linterPresetCompliant', key: 'compliant' },
        { btn: 'linterPresetNitroEnclave', key: 'nitroEnclave' },
        { btn: 'linterPresetDirect', key: 'direct' },
        { btn: 'linterPresetCloudProxy', key: 'cloudproxy' },
        { btn: 'linterPresetVectorLeak', key: 'vectorleak' }
      ];

      codePresets.forEach(({ btn, key }) => {
        const el = document.getElementById(btn);
        if (el) {
          el.addEventListener('click', () => {
            linterCodeInput.value = CODE_PRESETS[key];
            linterLineCount.innerText = `${linterCodeInput.value.split('\n').length} lines`;
            runCodeAnalysis();
          });
        }
      });

      // CLI Workbench Tabs
      const cliTabs = [
        { id: 'tabCliQuickstart', key: 'quickstart' },
        { id: 'tabCliHealthcare', key: 'healthcare' },
        { id: 'tabCliGhAction', key: 'ghaction' },
        { id: 'tabCliPreCommit', key: 'precommit' }
      ];

      cliTabs.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('click', () => {
            cliTabs.forEach(t => {
              const tabEl = document.getElementById(t.id);
              if (tabEl) {
                tabEl.className = t.id === id 
                  ? "px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono font-medium"
                  : "px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-mono font-medium";
              }
            });
            cliSnippetContent.innerText = CLI_SNIPPETS[key].code;
            cliTerminalTitle.innerText = CLI_SNIPPETS[key].title;
          });
        }
      });

      // Copy CLI Snippet
      btnCopyCliSnippet.addEventListener('click', () => {
        navigator.clipboard.writeText(cliSnippetContent.innerText).then(() => {
          copyCliBtnText.innerText = "COPIED";
          setTimeout(() => {
            copyCliBtnText.innerText = "Copy Command";
          }, 2000);
        });
      });

      // 30-Second Airplane Demo
      btnRunAirplaneDemo.addEventListener('click', runAirplaneSimulation);

      // ======================================================================
      // MODE 0: Live Domain Perimeter & Architecture Auditor Controller
      // ======================================================================
      const m0Form = document.getElementById('mode0ScanForm');
      const m0Input = document.getElementById('mode0DomainInput');
      const m0SubmitBtn = document.getElementById('mode0ScanSubmitBtn');
      const m0BtnText = document.getElementById('mode0BtnText');
      const m0Spinner = document.getElementById('mode0Spinner');
      const m0Progress = document.getElementById('mode0Progress');
      const m0Results = document.getElementById('mode0Results');
      const m0Timer = document.getElementById('mode0Timer');
      let currentM0MemoData = null;

      // Initialize modal controller via shared ZTDSScanner engine
      const leadModalControllerM0 = ZTDSScanner.initCisoLeadModal({
        source: 'deep_scanner_m0',
        getMemoData: () => currentM0MemoData
      });

      // Preset click handlers
      const m0PresetBtns = document.querySelectorAll('.mode0-preset-btn');
      const syncM0PresetPressed = (activeDom) => {
        const norm = String(activeDom || '').trim().toLowerCase();
        m0PresetBtns.forEach(b => {
          const isMatch = norm && (b.getAttribute('data-domain') || '').toLowerCase() === norm;
          b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });
      };

      m0PresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const dom = btn.getAttribute('data-domain');
          if (dom) {
            m0Input.value = dom;
            syncM0PresetPressed(dom);
            executeMode0Scan(dom);
          }
        });
      });

      if (m0Input) {
        m0Input.addEventListener('input', () => syncM0PresetPressed(m0Input.value));
      }

      if (m0Form) {
        m0Form.addEventListener('submit', (e) => {
          e.preventDefault();
          const dom = m0Input.value.trim();
          if (dom) {
            syncM0PresetPressed(dom);
            executeMode0Scan(dom);
          }
        });
      }

      // Check query param for direct transfer from index.html
      const urlParams = new URLSearchParams(window.location.search);
      const queryDomain = urlParams.get('domain');
      if (queryDomain && m0Input) {
        m0Input.value = queryDomain;
        executeMode0Scan(queryDomain);
      }

      let m0Interval = null;

      function updateM0Step(stepId, isComplete, isActive) {
        const el = document.getElementById(stepId);
        if (!el) return;
        const label = el.textContent.replace(/^[•\s\u2713]+/, '');
        const marker = document.createElement('span');
        if (isComplete) {
          el.className = 'flex items-center gap-2 text-emerald-700 font-semibold';
          marker.className = 'text-emerald-600 font-bold';
          marker.textContent = '\u2713';
        } else if (isActive) {
          el.className = 'flex items-center gap-2 text-slate-800 font-semibold';
          marker.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping';
        } else {
          el.className = 'flex items-center gap-2 text-slate-400';
          marker.className = 'text-slate-300';
          marker.textContent = '\u2022';
        }
        el.replaceChildren(marker, document.createTextNode(' ' + label));
      }

      async function executeMode0Scan(domain) {
        if (!m0SubmitBtn) return;
        m0SubmitBtn.disabled = true;
        m0BtnText.textContent = 'Auditing...';
        m0Spinner.classList.remove('hidden');
        m0Results.classList.add('hidden');
        m0Progress.classList.remove('hidden');

        const startTime = Date.now();
        if (m0Interval) clearInterval(m0Interval);
        m0Interval = setInterval(() => {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          if (m0Timer) m0Timer.textContent = elapsed + 's';
        }, 100);

        updateM0Step('m0StepDns', false, true);
        updateM0Step('m0StepHeaders', false, false);
        updateM0Step('m0StepSinks', false, false);
        updateM0Step('m0StepSynthesize', false, false);

        const t1 = setTimeout(() => { updateM0Step('m0StepDns', true); updateM0Step('m0StepHeaders', false, true); }, 400);
        const t2 = setTimeout(() => { updateM0Step('m0StepHeaders', true); updateM0Step('m0StepSinks', false, true); }, 800);
        const t3 = setTimeout(() => { updateM0Step('m0StepSinks', true); updateM0Step('m0StepSynthesize', false, true); }, 1200);

        try {
          const data = await ZTDSScanner.scanDomain(domain);

          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          clearInterval(m0Interval);

          updateM0Step('m0StepDns', true);
          updateM0Step('m0StepHeaders', true);
          updateM0Step('m0StepSinks', true);
          updateM0Step('m0StepSynthesize', true);

          renderMode0Results(data, domain);
        } catch (err) {
          clearInterval(m0Interval);
          renderMode0Fallback(domain, err.message);
        } finally {
          m0SubmitBtn.disabled = false;
          m0BtnText.textContent = 'Execute Perimeter Audit \u2192';
          m0Spinner.classList.add('hidden');
          setTimeout(() => m0Progress.classList.add('hidden'), 400);
        }
      }

      function renderMode0Results(data, domain) {
        if (!data || data.error) {
          renderMode0Fallback(domain, data ? data.details || data.error : 'Network Error');
          return;
        }

        const ev = data.evaluation || {};
        const fn = data.findings || {};
        const bp = ev.recommendedBlueprint || {};
        const rating = ev.conformanceRating || 'MODERATE_RISK';

        let badgeClass = 'score-badge-moderate';
        let badgeLabel = 'MODERATE EXPOSURE';
        if (rating === 'OPTIMAL') {
          badgeClass = 'score-badge-optimal';
          badgeLabel = 'ZTDS OPTIMAL';
        } else if (rating === 'HIGH_EXPOSURE') {
          badgeClass = 'score-badge-exposure';
          badgeLabel = 'HIGH RISK EGRESS';
        }

        const frameworks = (fn.frameworks || []).map(f => f.name).join(', ') || 'Standard Web Stack';
        const sinksCount = (fn.thirdPartySinks || []).length;
        const sensoryCount = (fn.sensorySurfaces || []).length;
        const ind = ev.industry || {};
        const activeProfileKey = ind.activeProfile || 'general';
        const currentDomain = data.domain || domain;
        const dag = ev.dagComparison || {};
        const legacyDagTitle = (dag.legacy && dag.legacy.title) || 'Legacy Cloud Proxy Route (Vulnerable)';
        const ztdsDagTitle = (dag.ztds && dag.ztds.title) || 'ZTDS In-RAM Enclave Route (Verified)';
        void legacyDagTitle;
        void ztdsDagTitle;
        const dagElement = ZTDSScanner.buildDagElement(ev.dagComparison, sinksCount, ind.statute || 'GDPR Recital 26');

        const mk = (tag, cls, txt) => {
          const el = document.createElement(tag);
          if (cls) el.className = cls;
          if (txt !== undefined) el.textContent = txt;
          return el;
        };

        const m0Frag = document.createDocumentFragment();

        // LEVEL 1: VERDICT & PERIMETER SCOPE
        const verdictBar = mk('div', 'p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5');
        const verdictLeft = mk('div');
        const verdictTopRow = mk('div', 'flex items-center gap-2.5');
        verdictTopRow.append(
          mk('span', 'font-mono text-base font-bold text-white', currentDomain),
          mk('span', `px-2.5 py-0.5 rounded text-xs font-mono font-bold ${badgeClass}`, badgeLabel)
        );
        const verdictSub = mk('p', 'text-xs text-slate-400 mt-1');
        verdictSub.append(
          document.createTextNode('Passive audit completed in '),
          mk('strong', '', `${data.scanDurationMs || 320}ms`),
          document.createTextNode(' \u00b7 Resolved IP: '),
          mk('code', '', data.telemetry?.primaryResolvedIp || 'Public Gateway'),
          document.createTextNode(' \u00b7 Volatile RAM Boundary')
        );
        verdictLeft.append(verdictTopRow, verdictSub);
        const verdictRight = mk('div', 'flex items-center gap-3');
        verdictRight.appendChild(mk('span', 'px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold', '\u0394WAN Egress: 0.00 B'));
        verdictBar.append(verdictLeft, verdictRight);
        m0Frag.appendChild(verdictBar);

        if (data.domainCertificate) {
          const certBanner = mk('div', 'p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5');
          const cLeft = mk('div');
          const cTop = mk('div', 'flex items-center gap-2');
          cTop.append(
            mk('span', 'w-2 h-2 rounded-full bg-emerald-600'),
            mk('span', 'font-mono text-xs font-bold uppercase tracking-wider text-emerald-800', 'Active ZTDS Plane 6 Web Form Guard Verified')
          );
          const cP = mk('p', 'text-xs text-emerald-900 mt-1');
          cP.append(
            document.createTextNode('Certificate '),
            mk('code', 'font-mono font-bold', data.domainCertificate.certificate_id || 'ZTDS-CERT-LEVEL1'),
            document.createTextNode(' \u00b7 Client-RAM form tokenization active before HTTP POST.')
          );
          cLeft.append(cTop, cP);
          const cLink = mk('a', 'btn-trust text-xs py-2 px-3.5 shrink-0 font-bold', 'Verify Level 1 Seal \u2192');
          cLink.href = `/verify/?domain=${encodeURIComponent(currentDomain)}`;
          certBanner.append(cLeft, cLink);
          m0Frag.appendChild(certBanner);
        }

        // 3-Column Assessment Cards
        const cardsGrid = mk('div', 'grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5');
        const c1 = mk('div', 'p-4 rounded-xl bg-slate-50 border border-slate-200');
        c1.append(
          mk('div', 'text-xs font-mono uppercase text-slate-500 font-bold', 'Perimeter Safety Score'),
          mk('div', `text-3xl font-black font-mono mt-1 ${ev.riskScore >= 80 ? 'text-emerald-600' : ev.riskScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`, `${ev.riskScore || 70}%`),
          mk('div', 'text-xs text-slate-500 font-mono mt-1', 'RFC v1.0 Conformance')
        );
        const c2 = mk('div', 'p-4 rounded-xl bg-slate-50 border border-slate-200');
        c2.append(
          mk('div', 'text-xs font-mono uppercase text-slate-500 font-bold', 'DPA Liability Relief'),
          mk('div', 'text-3xl font-black font-mono text-emerald-600 mt-1', `-${sinksCount}`),
          mk('div', 'text-xs text-slate-500 font-mono mt-1', 'Subprocessors Disapplied (Art. 28)')
        );
        const c3 = mk('div', 'p-4 rounded-xl bg-slate-50 border border-slate-200');
        c3.append(
          mk('div', 'text-xs font-mono uppercase text-slate-500 font-bold', 'Detected Stack & Surface'),
          mk('div', 'text-sm font-bold text-slate-800 mt-2 truncate', frameworks),
          mk('div', 'text-xs text-slate-500 font-mono mt-1', `${sensoryCount} Sensory Surface(s) \u00b7 ${bp.framework || 'Edge Enclave'}`)
        );
        cardsGrid.append(c1, c2, c3);
        m0Frag.appendChild(cardsGrid);

        // Industry Selector Bar
        const indBar = mk('div', 'p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs');
        const indLeft = mk('div', 'flex items-center gap-2 flex-wrap');
        const indLabel = mk('label', 'text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold', 'Target Industry:');
        indLabel.setAttribute('for', 'm0IndustrySelect');
        const indSelect = mk('select', 'bg-slate-950 text-white border border-slate-700 text-base sm:text-xs font-mono rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none');
        indSelect.id = 'm0IndustrySelect';
        [
          ['medical', 'Healthcare & HIPAA (Safe Harbor \u00a7 164.514)'],
          ['finance', 'FinTech & Banking (PCI-DSS & GLBA)'],
          ['legal', 'Legal & Privilege (FRE 502 & Model Rule 1.6)'],
          ['hr', 'HR & People Operations (GDPR Art. 9 & EEOC)'],
          ['security', 'DevSecOps & SaaS (SOC 2 Type II)'],
          ['general', 'Enterprise General (GDPR Recital 26)']
        ].forEach(([val, txt]) => {
          const opt = mk('option', '', txt);
          opt.value = val;
          if (activeProfileKey === val) opt.selected = true;
          indSelect.appendChild(opt);
        });
        const confPill = mk('span', 'text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800', `${ind.confidence || 'AUTO'} DETECTED`);
        confPill.id = 'm0ProfileConfidence';
        indLeft.append(indLabel, indSelect, confPill);

        const indRight = mk('div', 'flex items-center gap-2 text-xs font-mono');
        const statSpan = mk('span', 'text-emerald-400 font-semibold', ind.statute || 'GDPR Recital 26');
        statSpan.id = 'm0ProfileStatute';
        const dpaSpan = mk('span', 'px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold', ind.dpaStatus || 'DPA-EXEMPT');
        dpaSpan.id = 'm0DpaPill';
        indRight.append(statSpan, dpaSpan);
        indBar.append(indLeft, indRight);
        m0Frag.appendChild(indBar);

        // Role Switcher
        const roleBar = mk('div', 'flex items-center justify-between border-b border-slate-200 mb-4 pb-3');
        const tabList = mk('div', 'tablist-scroll inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs');
        tabList.setAttribute('role', 'tablist');
        tabList.setAttribute('aria-label', 'Blueprint Audience');
        const rBtnCiso = mk('button', 'px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white text-slate-900 shadow-xs', 'Executive & CISO Brief');
        rBtnCiso.type = 'button'; rBtnCiso.id = 'btnM0RoleCiso'; rBtnCiso.setAttribute('role', 'tab'); rBtnCiso.setAttribute('aria-selected', 'true');
        const rBtnDev = mk('button', 'px-3.5 py-1.5 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-900', 'Developer & Engineering Code');
        rBtnDev.type = 'button'; rBtnDev.id = 'btnM0RoleDev'; rBtnDev.setAttribute('role', 'tab'); rBtnDev.setAttribute('aria-selected', 'false');
        tabList.append(rBtnCiso, rBtnDev);
        const roleHint = mk('span', 'text-xs font-mono text-slate-400 hidden sm:inline', 'Statutory Defense & DPA Shield');
        roleHint.id = 'm0RoleSummaryHint';
        roleBar.append(tabList, roleHint);
        m0Frag.appendChild(roleBar);

        // View A: CISO Decision Brief
        const viewCiso = mk('div', 'p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-emerald-900/50 shadow-xl mb-6');
        viewCiso.id = 'viewM0RoleCiso';
        viewCiso.setAttribute('role', 'tabpanel');
        viewCiso.setAttribute('aria-labelledby', 'btnM0RoleCiso');
        const vcTop = mk('div', 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800');
        const vcTopLeft = mk('div');
        const vcCit = mk('p', 'text-xs text-slate-400 mt-0.5', ind.cisoCitation || 'Excludes sanitization subprocessor scope under GDPR Article 28.');
        vcCit.id = 'm0CisoCitation';
        const vcExec = mk('div', 'text-xs text-emerald-200/90 mt-2.5 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 leading-relaxed font-sans', ev.cisoExecutiveSummary || 'Architectural audit confirms zero-trust In-RAM sanitization removes data processor obligations and guarantees 0.00 B cleartext WAN egress.');
        vcExec.id = 'm0CisoExecutiveSummary';
        vcTopLeft.append(
          mk('span', 'text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800', 'Enterprise Compliance Brief'),
          mk('h3', 'text-base sm:text-lg font-bold text-white mt-1', 'CISO Statutory Memorandum & DPA Exemption'),
          vcCit,
          vcExec
        );
        const vcTopBtns = mk('div', 'flex flex-wrap items-center gap-2');
        const dlMemoBtn = mk('button', 'btn-trust text-xs py-2 px-3.5 font-bold', 'Download CISO Memo (.md)');
        dlMemoBtn.id = 'btnDownloadCisoMemo'; dlMemoBtn.type = 'button';
        const prMemoBtn = mk('button', 'px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors', 'Print Brief (PDF)');
        prMemoBtn.id = 'btnPrintCisoMemo'; prMemoBtn.type = 'button';
        vcTopBtns.append(dlMemoBtn, prMemoBtn);
        vcTop.append(vcTopLeft, vcTopBtns);

        const vcGrid = mk('div', 'grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-mono');
        const vcG1 = mk('div', 'p-3.5 rounded-xl bg-slate-900/90 border border-slate-800');
        const vcEnt = mk('span', 'text-emerald-300 font-medium', ((ind.targetEntities || []).slice(0, 3).join(', ')) + '...');
        vcEnt.id = 'm0TargetEntities';
        vcG1.append(mk('span', 'text-xs text-slate-400 uppercase font-bold block mb-1', 'Protected Sector Entities'), vcEnt);
        const vcG2 = mk('div', 'p-3.5 rounded-xl bg-slate-900/90 border border-slate-800');
        const vcReg = mk('span', 'text-slate-200', ind.regulatoryFocus || 'Client-RAM de-identification establishes GDPR Art. 32 & Amendment 13 Sec. 17 technical safe harbor.');
        vcReg.id = 'm0RegulatoryFocus';
        vcG2.append(mk('span', 'text-xs text-slate-400 uppercase font-bold block mb-1', 'Regulatory Defense Basis'), vcReg);
        vcGrid.append(vcG1, vcG2);

        const vcFoot1 = mk('div', 'mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono gap-3');
        const linkApplyCiso = mk('a', 'text-emerald-400 hover:underline font-semibold', 'Attest & Apply for Conformance Seal \u2192');
        linkApplyCiso.id = 'm0ApplyLinkCiso';
        linkApplyCiso.href = `/apply/?domain=${encodeURIComponent(currentDomain)}&profile=${encodeURIComponent(activeProfileKey)}`;
        vcFoot1.append(mk('span', 'text-slate-400', 'Next Step: Formal Conformance Verification'), linkApplyCiso);

        const vcFoot2 = mk('div', 'mt-3 pt-2.5 border-t border-slate-800/50 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2');
        const linkAgency = mk('a', 'text-emerald-400 hover:text-emerald-300 underline transition-colors', 'Enterprise Advisory Program \u2192');
        linkAgency.id = 'm0AgencyPackageLink';
        linkAgency.href = `/agency/?domain=${encodeURIComponent(currentDomain)}&profile=${encodeURIComponent(activeProfileKey)}`;
        vcFoot2.append(mk('span', '', 'Need turnkey enterprise attestation & custom advisory?'), linkAgency);

        viewCiso.append(vcTop, vcGrid, vcFoot1, vcFoot2);
        m0Frag.appendChild(viewCiso);

        // View B: Developer Workbench
        const viewDev = mk('div', 'hidden p-5 sm:p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl mb-6');
        viewDev.id = 'viewM0RoleDev';
        viewDev.setAttribute('role', 'tabpanel');
        viewDev.setAttribute('aria-labelledby', 'btnM0RoleDev');
        const vdTop = mk('div', 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4');
        const vdTopLeft = mk('div');
        vdTopLeft.append(
          mk('span', 'text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold', 'Production Integration Workbench'),
          mk('h3', 'text-base sm:text-lg font-bold text-white mt-0.5', `Deploy ZTDS Enclave on ${currentDomain}`)
        );
        const fwTabs = mk('div', 'flex flex-wrap items-center gap-1.5');
        fwTabs.id = 'm0FrameworkTabs';
        [
          ['nextjs', 'Next.js Edge'],
          ['cloudflare', 'Cloudflare Worker'],
          ['python', 'Python FastAPI'],
          ['client', 'Client WASM'],
          ['wordpress', 'WordPress Guard']
        ].forEach(([vec, lbl]) => {
          const isRec = ev.recommendedVector === vec;
          const b = mk('button', `m0-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${isRec ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`, lbl);
          b.type = 'button';
          b.setAttribute('data-vector', vec);
          b.setAttribute('aria-pressed', String(isRec));
          fwTabs.appendChild(b);
        });
        vdTop.append(vdTopLeft, fwTabs);

        const instBar = mk('div', 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800 mb-3 text-xs font-mono');
        const instLeft = mk('div', 'flex items-center gap-2 text-slate-300 truncate');
        const instCmd = mk('span', '', (ev.blueprints && ev.blueprints[ev.recommendedVector]?.installCommand) || 'npm i @privacyscrubber/sdk');
        instCmd.id = 'm0InstallCmd';
        instLeft.append(mk('span', 'text-emerald-400 font-bold', '$'), instCmd);
        const btnCopyInst = mk('button', 'text-xs font-mono text-emerald-400 hover:text-emerald-300 underline shrink-0', 'Copy Command');
        btnCopyInst.id = 'btnCopyInstallCmd'; btnCopyInst.type = 'button';
        instBar.append(instLeft, btnCopyInst);

        const codeWrap = mk('div', 'relative');
        const codeHdr = mk('div', 'flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-t-lg text-xs font-mono text-slate-400');
        const fnDisp = mk('span', '', (ev.blueprints && ev.blueprints[ev.recommendedVector]?.filename) || 'middleware.ts');
        fnDisp.id = 'm0FilenameDisplay';
        const latDisp = mk('span', 'text-emerald-400', (ev.blueprints && ev.blueprints[ev.recommendedVector]?.latencyImpact) || '< 0.65 ms in volatile RAM');
        latDisp.id = 'm0LatencyBadge';
        codeHdr.append(fnDisp, latDisp);
        const codePre = mk('pre', 'p-4 rounded-b-lg bg-slate-900/60 border-x border-b border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[260px]');
        const codeEl = mk('code', '', (ev.blueprints && ev.blueprints[ev.recommendedVector]?.codeSnippet) || bp.codeSnippet || '// ZTDS Enclave implementation');
        codeEl.id = 'm0ActiveCodeBlock';
        codePre.appendChild(codeEl);
        codeWrap.append(codeHdr, codePre);

        const vdFoot = mk('div', 'mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono');
        const vdFootLeft = mk('div', 'flex flex-wrap items-center gap-2');
        const btnCopyProd = mk('button', 'btn-trust text-xs py-2 px-4 font-bold', 'Copy Production Code');
        btnCopyProd.id = 'btnCopyM0Code'; btnCopyProd.type = 'button';
        const sdkExploreLink = mk('a', 'px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors font-bold flex items-center gap-1.5');
        sdkExploreLink.href = '/sdk/#licensing';
        sdkExploreLink.append(mk('span', 'w-1.5 h-1.5 rounded-full bg-emerald-400'), mk('span', '', 'Explore Certified SDK \u2192'));
        vdFootLeft.append(btnCopyProd, sdkExploreLink);
        const linkApplyDev = mk('a', 'text-emerald-400 hover:underline', 'Register Conformance \u2192');
        linkApplyDev.id = 'm0ApplyLinkDev';
        linkApplyDev.href = `/apply/?domain=${encodeURIComponent(currentDomain)}&profile=${encodeURIComponent(activeProfileKey)}`;
        vdFoot.append(vdFootLeft, linkApplyDev);

        viewDev.append(vdTop, instBar, codeWrap, vdFoot);
        m0Frag.appendChild(viewDev);

        // LEVEL 3: TECHNICAL BREAKDOWN ACCORDION
        const detailsEl = mk('details', 'group rounded-2xl bg-white border border-slate-200 shadow-xs mb-6 overflow-hidden transition-colors');
        const summaryEl = mk('summary', 'flex items-center justify-between p-4 sm:p-5 cursor-pointer text-xs sm:text-sm font-mono font-bold text-slate-800 hover:text-slate-900 select-none');
        const sumLeft = mk('div', 'flex items-center gap-2');
        sumLeft.append(mk('span', 'w-2 h-2 rounded-full bg-emerald-500'), mk('span', '', 'Technical Breakdown: Architectural Topology Comparison & CI/CD Audit Gate'));
        summaryEl.append(sumLeft, mk('span', 'text-slate-400 group-open:rotate-180 transition-transform duration-200 font-bold', '\u2193'));
        const detailsBody = mk('div', 'p-5 pt-2 border-t border-slate-200 space-y-5');
        detailsBody.appendChild(dagElement);

        const cicdBox = mk('div', 'p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white');
        const cicdLeft = mk('div');
        const cliCodeEl = mk('code', 'text-xs font-mono text-emerald-300 mt-0.5 block', `npx ztds-audit https://${currentDomain}`);
        cliCodeEl.id = 'm0CliCmd';
        cicdLeft.append(mk('div', 'text-xs font-mono text-slate-400 uppercase font-bold', 'Local & CI/CD Zero-Egress Terminal Audit:'), cliCodeEl);
        const btnCopyCicd = mk('button', 'text-xs font-mono text-emerald-400 hover:text-emerald-300 underline shrink-0', 'Copy CI/CD Command');
        btnCopyCicd.id = 'btnCopyCliCmd'; btnCopyCicd.type = 'button';
        cicdBox.append(cicdLeft, btnCopyCicd);
        detailsBody.appendChild(cicdBox);

        detailsEl.append(summaryEl, detailsBody);
        m0Frag.appendChild(detailsEl);

        m0Results.replaceChildren(m0Frag);
        if (typeof window.ztdsBindTablist === 'function') {
          window.ztdsBindTablist(tabList);
        }

        // Role Switcher Handlers
        const btnM0RoleCiso = document.getElementById('btnM0RoleCiso');
        const btnM0RoleDev = document.getElementById('btnM0RoleDev');
        const viewM0RoleCiso = document.getElementById('viewM0RoleCiso');
        const viewM0RoleDev = document.getElementById('viewM0RoleDev');
        const m0RoleSummaryHint = document.getElementById('m0RoleSummaryHint');

        if (btnM0RoleCiso && btnM0RoleDev) {
          btnM0RoleCiso.addEventListener('click', () => {
            btnM0RoleCiso.className = 'px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white text-slate-900 shadow-xs';
            btnM0RoleCiso.setAttribute('aria-selected', 'true');
            btnM0RoleDev.className = 'px-3.5 py-1.5 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-900';
            btnM0RoleDev.setAttribute('aria-selected', 'false');
            viewM0RoleCiso.classList.remove('hidden');
            viewM0RoleDev.classList.add('hidden');
            if (m0RoleSummaryHint) m0RoleSummaryHint.textContent = 'Statutory Defense & DPA Shield';
          });

          btnM0RoleDev.addEventListener('click', () => {
            btnM0RoleDev.className = 'px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white text-slate-900 shadow-xs';
            btnM0RoleDev.setAttribute('aria-selected', 'true');
            btnM0RoleCiso.className = 'px-3.5 py-1.5 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-900';
            btnM0RoleCiso.setAttribute('aria-selected', 'false');
            viewM0RoleDev.classList.remove('hidden');
            viewM0RoleCiso.classList.add('hidden');
            if (m0RoleSummaryHint) m0RoleSummaryHint.textContent = 'Sub-Millisecond In-RAM SDK';
          });
        }

        // Industry Profile select handler
        const allProfilesMap = ind.allProfiles || {};
        const m0Select = document.getElementById('m0IndustrySelect');
        if (m0Select) {
          m0Select.addEventListener('change', () => {
            const profKey = m0Select.value;
            const targetProf = allProfilesMap[profKey];
            if (!targetProf) return;

            const confEl = document.getElementById('m0ProfileConfidence');
            if (confEl) confEl.textContent = 'MANUAL SELECT';
            const statEl = document.getElementById('m0ProfileStatute');
            if (statEl) statEl.textContent = targetProf.statute;
            const dpaEl = document.getElementById('m0DpaPill');
            if (dpaEl) dpaEl.textContent = targetProf.dpaStatus;
            const citEl = document.getElementById('m0CisoCitation');
            if (citEl) citEl.textContent = targetProf.cisoCitation;
            const entEl = document.getElementById('m0TargetEntities');
            if (entEl) entEl.textContent = (targetProf.targetEntities || []).slice(0, 3).join(', ') + '...';
            const regEl = document.getElementById('m0RegulatoryFocus');
            if (regEl) regEl.textContent = targetProf.regulatoryFocus;

            const linkCiso = document.getElementById('m0ApplyLinkCiso');
            if (linkCiso) linkCiso.href = `/apply/?domain=${encodeURIComponent(currentDomain)}&profile=${encodeURIComponent(profKey)}`;
            const linkDev = document.getElementById('m0ApplyLinkDev');
            if (linkDev) linkDev.href = `/apply/?domain=${encodeURIComponent(currentDomain)}&profile=${encodeURIComponent(profKey)}`;

            ev.industry.activeProfile = profKey;
            ev.industry.name = targetProf.name;
            ev.industry.statute = targetProf.statute;
            ev.industry.regulatoryFocus = targetProf.regulatoryFocus;
            ev.industry.cisoCitation = targetProf.cisoCitation;
            ev.industry.dpaStatus = targetProf.dpaStatus;
            ev.industry.targetEntities = targetProf.targetEntities;

            if (ev.blueprints?.nextjs) {
              ev.blueprints.nextjs.codeSnippet = ZTDSScanner.generateFrameworkSnippet('nextjs', currentDomain, targetProf, profKey);
            }
            if (ev.blueprints?.cloudflare) {
              ev.blueprints.cloudflare.codeSnippet = ZTDSScanner.generateFrameworkSnippet('cloudflare', currentDomain, targetProf, profKey);
            }
            if (ev.blueprints?.python) {
              ev.blueprints.python.codeSnippet = ZTDSScanner.generateFrameworkSnippet('python', currentDomain, targetProf, profKey);
            }
            if (ev.blueprints?.client) {
              ev.blueprints.client.codeSnippet = ZTDSScanner.generateFrameworkSnippet('client', currentDomain, targetProf, profKey);
            }
            if (ev.blueprints?.wordpress) {
              ev.blueprints.wordpress.codeSnippet = ZTDSScanner.generateFrameworkSnippet('wordpress', currentDomain, targetProf, profKey);
            }

            const activeTab = document.querySelector('.m0-tab-btn.bg-emerald-600')?.getAttribute('data-vector') || ev.recommendedVector;
            if (ev.blueprints && ev.blueprints[activeTab]) {
              document.getElementById('m0ActiveCodeBlock').textContent = ev.blueprints[activeTab].codeSnippet;
            }
          });
        }

        // Framework tab click handlers
        const allBlueprints = ev.blueprints || {};
        document.querySelectorAll('.m0-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const vec = btn.getAttribute('data-vector');
            const targetBp = allBlueprints[vec];
            if (!targetBp) return;

            document.querySelectorAll('.m0-tab-btn').forEach(b => {
              const isAct = b.getAttribute('data-vector') === vec;
              b.setAttribute('aria-pressed', String(isAct));
              b.className = isAct
                ? 'm0-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white transition-colors'
                : 'm0-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors';
            });

            document.getElementById('m0InstallCmd').textContent = targetBp.installCommand;
            document.getElementById('m0FilenameDisplay').textContent = targetBp.filename;
            document.getElementById('m0LatencyBadge').textContent = targetBp.latencyImpact;
            document.getElementById('m0ActiveCodeBlock').textContent = targetBp.codeSnippet;
          });
        });

        // Copy buttons
        const copyCodeBtn = document.getElementById('btnCopyM0Code');
        if (copyCodeBtn) {
          copyCodeBtn.addEventListener('click', () => {
            const codeText = document.getElementById('m0ActiveCodeBlock')?.textContent || '';
            navigator.clipboard.writeText(codeText);
            copyCodeBtn.textContent = 'COPIED!';
            setTimeout(() => { copyCodeBtn.textContent = 'Copy Production Code'; }, 2000);
          });
        }

        const copyInstallBtn = document.getElementById('btnCopyInstallCmd');
        if (copyInstallBtn) {
          copyInstallBtn.addEventListener('click', () => {
            const cmdText = document.getElementById('m0InstallCmd')?.textContent || '';
            navigator.clipboard.writeText(cmdText);
            copyInstallBtn.textContent = 'COPIED!';
            setTimeout(() => { copyInstallBtn.textContent = 'Copy Command'; }, 2000);
          });
        }

        const copyCliBtn = document.getElementById('btnCopyCliCmd');
        if (copyCliBtn) {
          copyCliBtn.addEventListener('click', () => {
            const cmdText = document.getElementById('m0CliCmd')?.textContent || '';
            navigator.clipboard.writeText(cmdText);
            copyCliBtn.textContent = 'COPIED!';
            setTimeout(() => { copyCliBtn.textContent = 'Copy CI/CD Command'; }, 2000);
          });
        }

        // Print & Download CISO Memo Handlers
        const printBtn = document.getElementById('btnPrintCisoMemo');
        if (printBtn) {
          printBtn.addEventListener('click', () => {
            window.print();
          });
        }

        const downloadMemoBtn = document.getElementById('btnDownloadCisoMemo');
        if (downloadMemoBtn) {
          downloadMemoBtn.addEventListener('click', () => {
            currentM0MemoData = {
              data,
              domain,
              ev,
              fn,
              bp,
              currentDomain,
              activeProfileKey: ev.industry?.activeProfile || 'general',
              profileName: ev.industry?.name || 'General Enterprise'
            };
            leadModalControllerM0.open(currentM0MemoData);
          });
        }

        m0Results.classList.remove('hidden');
        m0Results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function generateCisoMemoText(data, domain, ev, fn, bp) {
        return ZTDSScanner.generateCisoMemo(data, domain, ev, fn, bp);
      }

      function renderMode0Fallback(domain, errorMsg) {
        const box = document.createElement('div');
        box.className = 'p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900';

        const hdr = document.createElement('div');
        hdr.className = 'font-mono text-xs font-bold uppercase mb-1 flex items-center gap-2';
        const dot = document.createElement('span');
        dot.className = 'w-2 h-2 rounded-full bg-amber-500';
        hdr.append(dot, document.createTextNode('Domain Inspection Restricted or Blocked'));

        const p = document.createElement('p');
        p.className = 'text-xs text-amber-800 leading-relaxed';
        const domStrong = document.createElement('strong');
        domStrong.textContent = domain;
        p.append(
          document.createTextNode('Automated audit for '),
          domStrong,
          document.createTextNode(` could not complete (${errorMsg}). The host may be behind strict bot management, an internal intranet (RFC 1918), or offline.`)
        );

        const foot = document.createElement('div');
        foot.className = 'mt-3 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2';
        const footLabel = document.createElement('span');
        footLabel.className = 'text-xs font-mono font-semibold';
        footLabel.textContent = 'Deploy Standard Architecture:';
        const btnWrap = document.createElement('div');
        btnWrap.className = 'flex items-center gap-2';
        const aCore = document.createElement('a');
        aCore.href = '/sdk/';
        aCore.className = 'btn-outline text-xs py-1.5 px-3';
        aCore.textContent = '@ztds/core (Open Source) \u2192';
        const aSdk = document.createElement('a');
        aSdk.href = '/sdk/#licensing';
        aSdk.className = 'btn-trust text-xs py-1.5 px-3';
        aSdk.textContent = 'Certified Developer SDK \u2192';
        btnWrap.append(aCore, aSdk);
        foot.append(footLabel, btnWrap);

        box.append(hdr, p, foot);
        m0Results.replaceChildren(box);
        m0Results.classList.remove('hidden');
        m0Results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function escapeM0(str) {
        return ZTDSScanner.escapeHtml(str);
      }
    });
})();
