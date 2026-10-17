#!/usr/bin/env node

/**
 * ZTDS.ai — Deterministic Institutional Open Graph (1200x630 PNG) Generator
 *
 * Visual World: "Institutional Technical Editorial" (Stripe Press × NIST Lab × IETF RFC)
 * Renders 8 canonical 1200x630 PNG Open Graph / Twitter large summary cards using
 * Headless Chrome with embedded base64 portrait of Ilya Sibiryakov (Chief Architect).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const PORTRAIT_PATH = path.join(ROOT, 'assets', 'img', 'ilya-sibiryakov.jpg');
const OUT_DIRS = [
  path.join(ROOT, 'assets', 'img', 'og'),
  path.join(ROOT, 'public', 'assets', 'img', 'og')
];

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];

function findChrome() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Google Chrome binary not found for deterministic OG rendering.');
}

const portraitBase64 = fs.existsSync(PORTRAIT_PATH)
  ? `data:image/jpeg;base64,${fs.readFileSync(PORTRAIT_PATH).toString('base64')}`
  : '';

const CARDS = [
  {
    filename: 'og-default.png',
    alsoRootOg: true,
    kicker: 'IETF INTERNET-DRAFT (DRAFT-02) · ZTDS™ RFC V1.0',
    routeLabel: 'ztds.ai',
    accent: '#10b981',
    accentSecondary: '#38bdf8',
    title: 'Zero-Trust Data Sanitization',
    subtitle: 'Deterministic In-Memory Surrogate Tokenization & Cryptographic Egress Verification for Enterprise AI, RAG & Autonomous Agent Workflows.',
    metrics: [
      { value: '0.00 B', label: 'Raw PII Network Egress' },
      { value: '42.8 µs', label: 'Median p50 RAM Latency' },
      { value: '4 Invariants', label: 'GDPR Art. 28 Safe Harbor' }
    ],
    diagramTitle: 'CLIENT VOLATILE RAM BOUNDARY // RFC V1.0',
    diagramRows: [
      { badge: 'INPUT', code: 'Customer PII / PHI / API Keys', status: 'LOCAL RAM', statusColor: '#38bdf8' },
      { badge: 'INV-1', code: 'Deterministic Surrogate Minting', status: '42.8 µs', statusColor: '#10b981' },
      { badge: 'TOKEN', code: '[EMAIL_TOKEN_1] · [IBAN_TOKEN_2]', status: 'SYNTAX SAFE', statusColor: '#10b981' },
      { badge: 'EGRESS', code: 'External LLM / RAG / Vector DB', status: '0.00 B RAW PII', statusColor: '#10b981' },
      { badge: 'PROOF', code: 'Ed25519 Signed SHA-256 Receipt', status: 'ATTESTED', statusColor: '#a78bfa' }
    ]
  },
  {
    filename: 'og-blueprints.png',
    kicker: 'CANONICAL ARCHITECTURE HUB · 10 REFERENCE BLUEPRINTS',
    routeLabel: 'ztds.ai/blueprints',
    accent: '#10b981',
    accentSecondary: '#38bdf8',
    title: 'AI, Agent & RAG Integration Blueprints',
    subtitle: 'Drop-In Pre-Egress Sanitization Topologies for LangChain, LlamaIndex, CrewAI, Model Context Protocol (MCP), Vector Databases & AI Gateways.',
    metrics: [
      { value: '10 Specs', label: 'Production Topologies' },
      { value: '100%', label: 'Bijective Local Restore' },
      { value: '< 0.05 ms', label: 'Zero GPU / Sidecar Tax' }
    ],
    diagramTitle: 'CANONICAL INTERCEPTION TOPOLOGIES // BP-01..10',
    diagramRows: [
      { badge: 'BP-01', code: 'LangChain RunnableSanitizer', status: 'PRE-PROMPT', statusColor: '#10b981' },
      { badge: 'BP-02', code: 'LlamaIndex TransformComponent', status: 'RAG INGEST', statusColor: '#10b981' },
      { badge: 'BP-03', code: 'CrewAI & AutoGen Shared Bus', status: 'MULTI-AGENT', statusColor: '#38bdf8' },
      { badge: 'BP-05', code: 'MCP Stdio JSON-RPC Firewall', status: 'IDE BOUNDARY', statusColor: '#10b981' },
      { badge: 'BP-08', code: 'Envoy / Kong Wasm Edge Filter', status: 'INLINE PROXY', statusColor: '#a78bfa' }
    ]
  },
  {
    filename: 'og-compliance.png',
    kicker: 'CISO & DPO STATUTORY SAFE HARBOR · ZERO-DPA DOSSIER',
    routeLabel: 'ztds.ai/compliance',
    accent: '#38bdf8',
    accentSecondary: '#10b981',
    title: 'Global Regulatory & Statutory Crosswalk',
    subtitle: 'Architectural Pre-Processing Alignment Across GDPR Recital 26 & Art. 28/32, HIPAA §164.514(b), EU AI Act Art. 10, NIST AI RMF & FRE 502.',
    metrics: [
      { value: '8 Statutes', label: 'Article-Level Crosswalk' },
      { value: 'Zero DPAs', label: 'No SaaS Subprocessors' },
      { value: 'SIG / CAIQ', label: 'Pre-Completed Responder' }
    ],
    diagramTitle: 'STATUTORY TECHNICAL SAFE HARBOR // MATRIX',
    diagramRows: [
      { badge: 'GDPR', code: 'Recital 26 · Art. 25, 28 & 32', status: 'NO SUBPROCESSOR', statusColor: '#10b981' },
      { badge: 'HIPAA', code: '45 CFR §164.514(b)(2) Safe Harbor', status: '18 IDENTIFIERS', statusColor: '#10b981' },
      { badge: 'AI ACT', code: 'EU AI Act Art. 10 & Art. 15', status: 'DATA GOVERNANCE', statusColor: '#38bdf8' },
      { badge: 'SOC 2', code: 'AICPA TSC CC6.1 / CC6.6 / CC6.7', status: 'SHA-256 RECEIPT', statusColor: '#10b981' },
      { badge: 'LEGAL', code: 'FRE 502(b) & ABA Rule 1.6(c)', status: 'PRIVILEGE SHIELD', statusColor: '#a78bfa' }
    ]
  },
  {
    filename: 'og-benchmarks.png',
    kicker: 'EMPIRICAL EVALUATION SUITE · RFC V1.0 TEST VECTORS',
    routeLabel: 'ztds.ai/benchmarks',
    accent: '#10b981',
    accentSecondary: '#f59e0b',
    title: 'AI DLP Latency & F1 Accuracy Benchmarks',
    subtitle: 'Reproducible Head-to-Head Evaluation: ZTDS Deterministic In-RAM Engine vs. Transformer NER Sidecars & Cloud REST DLP APIs.',
    metrics: [
      { value: '42.8 µs', label: '1,030× Faster Than NER' },
      { value: '0.994 F1', label: 'Composite Recall & Precision' },
      { value: '14.2 MB', label: 'Zero-GPU RAM Footprint' }
    ],
    diagramTitle: 'EMPIRICAL BENCHMARK COMPARISON // 10K CORPUS',
    diagramRows: [
      { badge: 'ZTDS', code: 'p50: 42.8 µs · F1: 0.994 · RAM: 14MB', status: '0.00 B EGRESS', statusColor: '#10b981' },
      { badge: 'NER-L', code: 'BERT Sidecar · p50: 44.2 ms · F1: 0.891', status: '1.8 GB VRAM', statusColor: '#f59e0b' },
      { badge: 'CLOUD', code: 'REST DLP API · p50: 185 ms · F1: 0.912', status: '100% EGRESS', statusColor: '#ef4444' },
      { badge: 'REGEX', code: 'Naive Redact · Destroys Syntax [***]', status: '0% RESTORE', statusColor: '#ef4444' },
      { badge: 'VERIFY', code: 'npx ztds-audit --benchmark', status: 'REPRODUCIBLE', statusColor: '#38bdf8' }
    ]
  },
  {
    filename: 'og-mcp.png',
    kicker: 'MODEL CONTEXT PROTOCOL · STDIO FIREWALL & SDK',
    routeLabel: 'ztds.ai/mcp',
    accent: '#10b981',
    accentSecondary: '#a78bfa',
    title: 'MCP Security & Headless SDK Architecture',
    subtitle: 'Zero-Egress Stdio JSON-RPC 2.0 Sanitization Proxy & TypeScript / Python / WASM Engine for Claude Desktop, Cursor, Windsurf & IDE Agents.',
    metrics: [
      { value: '5 Tools', label: 'MCP Stdio JSON-RPC Suite' },
      { value: 'TS & Py', label: 'Headless In-RAM SDKs' },
      { value: 'Ed25519', label: 'Air-Gapped Offline Tokens' }
    ],
    diagramTitle: 'MCP STDIO SECURITY PERIMETER // JSON-RPC 2.0',
    diagramRows: [
      { badge: 'TOOL 1', code: 'ztds_sanitize(payload, profile)', status: 'IN-RAM MASK', statusColor: '#10b981' },
      { badge: 'TOOL 2', code: 'ztds_restore(response, session)', status: 'BIJECTIVE', statusColor: '#10b981' },
      { badge: 'TOOL 3', code: 'ztds_audit(target, strict_mode)', status: 'SHA-256 PROOF', statusColor: '#38bdf8' },
      { badge: 'TOOL 4', code: 'ztds_reset_session()', status: 'RAM ZEROIZE', statusColor: '#a78bfa' },
      { badge: 'DEPLOY', code: 'npx -y @privacyscrubber/mcp-server', status: 'ZERO EGRESS', statusColor: '#10b981' }
    ]
  },
  {
    filename: 'og-scanner.png',
    kicker: 'LIVE ZERO-TRUST AUDITOR · CLI & BROWSER INSPECTOR',
    routeLabel: 'ztds.ai/scanner',
    accent: '#10b981',
    accentSecondary: '#38bdf8',
    title: 'Cryptographic Egress & Leakage Scanner',
    subtitle: 'Verify Zero External Network Egress in Airplane Mode and Mint Tamper-Evident SHA-256 Compliance Receipts in GitHub Actions CI/CD.',
    metrics: [
      { value: 'CLI + Web', label: 'npx ztds-audit Inspector' },
      { value: 'SHA-256', label: 'Cryptographic Audit Receipt' },
      { value: 'Offline', label: 'Airplane Mode Verifiable' }
    ],
    diagramTitle: 'AUTOMATED INVARIANT AUDIT // TERMINAL',
    diagramRows: [
      { badge: 'CMD', code: '$ npx ztds-audit ./src --strict', status: 'EXIT CODE 0', statusColor: '#38bdf8' },
      { badge: 'INV-1', code: 'Zero Pre-Sanitization Network Egress', status: 'VERIFIED PASS', statusColor: '#10b981' },
      { badge: 'INV-2', code: 'Bijective Surrogate Token Integrity', status: 'VERIFIED PASS', statusColor: '#10b981' },
      { badge: 'INV-3', code: 'Cryptographic Memory Isolation', status: 'VERIFIED PASS', statusColor: '#10b981' },
      { badge: 'HASH', code: 'sha256:8f434346648f6b96df89dda901c5176b', status: 'SIGNED', statusColor: '#a78bfa' }
    ]
  },
  {
    filename: 'og-registry.png',
    kicker: 'ACCREDITED ECOSYSTEM · VERIFIED CONFORMANCE REGISTRY',
    routeLabel: 'ztds.ai/registry',
    accent: '#10b981',
    accentSecondary: '#38bdf8',
    title: 'ZTDS Verified Registry & Enterprise Adopters',
    subtitle: 'Cryptographically Attested Implementations, Pioneer Commercial Engines & Reference Case Studies Across FinTech, Healthcare, Defense & Legal.',
    metrics: [
      { value: 'Ed25519', label: 'Signed Conformance Seals' },
      { value: '8 Sectors', label: 'Enterprise Case Studies' },
      { value: 'GitOps', label: 'Public Reproducible Audits' }
    ],
    diagramTitle: 'ACCREDITED REGISTRY MANIFEST // ED25519',
    diagramRows: [
      { badge: 'GOLD', code: 'PrivacyScrubber (Web / SDK / MCP)', status: 'PIONEER REF', statusColor: '#10b981' },
      { badge: 'R&D', code: 'BrandMeWeb Digital Engineering', status: 'FOUNDING LAB', statusColor: '#38bdf8' },
      { badge: 'FIN', code: 'Aegis FinTech · PCI-DSS & SWIFT', status: 'VERIFIED', statusColor: '#10b981' },
      { badge: 'MED', code: 'Apex Health AI · HIPAA Safe Harbor', status: 'VERIFIED', statusColor: '#10b981' },
      { badge: 'LAW', code: 'Lex Veritas Legal · FRE 502 Shield', status: 'VERIFIED', statusColor: '#a78bfa' }
    ]
  },
  {
    filename: 'og-fellows.png',
    kicker: 'RESEARCH CONSORTIUM · ACCREDITED ZTDS FELLOWS',
    routeLabel: 'ztds.ai/fellows',
    accent: '#38bdf8',
    accentSecondary: '#10b981',
    title: 'ZTDS Research Fellows & Working Group',
    subtitle: 'Principal Protocol Architects, Empirical Benchmarking Researchers & Regulatory Governance Contributors Advancing ZTDS RFC v1.0.',
    metrics: [
      { value: 'Draft-02', label: 'IETF Internet-Draft Track' },
      { value: '3 DOIs', label: 'Zenodo · OSF · SSRN' },
      { value: 'ORCID', label: 'Verified Academic Lineage' }
    ],
    diagramTitle: 'CONSORTIUM PUBLICATIONS & AUTHORSHIP // SSOT',
    diagramRows: [
      { badge: 'LEAD', code: 'Ilya Sibiryakov · Chief Architect', status: 'FIRST AUTHOR', statusColor: '#10b981' },
      { badge: 'IETF', code: 'draft-sibiryakov-ztds-protocol-02', status: 'STANDARDS TRACK', statusColor: '#38bdf8' },
      { badge: 'DOI-1', code: 'Zenodo: 10.5281/zenodo.22058770', status: 'PUBLISHED', statusColor: '#10b981' },
      { badge: 'DOI-2', code: 'OSF: 10.17605/OSF.IO/5BYJF · SSRN', status: 'INDEXED', statusColor: '#10b981' },
      { badge: 'EVAL', code: 'Empirical Validation Working Group', status: 'ACCREDITED', statusColor: '#a78bfa' }
    ]
  }
];

function buildCardHtml(card) {
  const metricsHtml = card.metrics
    .map(
      (m) => `
      <div class="metric-card">
        <div class="metric-val">${m.value}</div>
        <div class="metric-lbl">${m.label}</div>
      </div>`
    )
    .join('');

  const rowsHtml = card.diagramRows
    .map(
      (r) => `
      <div class="diag-row">
        <span class="diag-badge">${r.badge}</span>
        <span class="diag-code">${r.code}</span>
        <span class="diag-status" style="color:${r.statusColor};border-color:${r.statusColor}44;background:${r.statusColor}14">${r.status}</span>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #070b12;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .canvas {
    position: relative;
    width: 1200px;
    height: 630px;
    background:
      radial-gradient(circle at 14% 18%, ${card.accent}22 0%, transparent 42%),
      radial-gradient(circle at 86% 78%, ${card.accentSecondary}1c 0%, transparent 45%),
      linear-gradient(180deg, #070b12 0%, #0b111e 60%, #070b12 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 38px 48px 32px 48px;
    border: 1px solid rgba(148, 163, 184, 0.18);
  }
  /* Subtle technical blueprint grid */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(148, 163, 184, 0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(148, 163, 184, 0.045) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
  .top-accent-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${card.accent} 0%, ${card.accentSecondary} 55%, #10b981 100%);
    z-index: 2;
  }
  /* Header Bar */
  .header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .shield-box {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
  .brand-name span {
    color: #10b981;
  }
  .brand-sep {
    color: rgba(148, 163, 184, 0.35);
    font-weight: 400;
    margin: 0 4px;
  }
  .kicker-pill {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.25);
    padding: 6px 12px;
    border-radius: 6px;
  }
  .spec-coord {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 11.5px;
    font-weight: 600;
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.35);
    padding: 6px 12px;
    border-radius: 6px;
    letter-spacing: 0.05em;
  }

  /* Main Split Body */
  .main {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.15fr 0.95fr;
    gap: 34px;
    align-items: center;
    margin: auto 0;
  }
  .left-col {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .title {
    font-size: 44px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #ffffff;
  }
  .subtitle {
    font-size: 17px;
    line-height: 1.48;
    font-weight: 400;
    color: #94a3b8;
    max-width: 600px;
  }
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 6px;
  }
  .metric-card {
    background: rgba(15, 23, 42, 0.82);
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-left: 3px solid ${card.accent};
    border-radius: 8px;
    padding: 12px 14px;
  }
  .metric-val {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }
  .metric-lbl {
    font-size: 11.5px;
    font-weight: 500;
    color: #94a3b8;
    margin-top: 3px;
  }

  /* Right Column Technical Schematic */
  .right-col {
    background: rgba(11, 17, 30, 0.92);
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 12px;
    padding: 18px 20px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55);
  }
  .diag-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  }
  .diag-dots {
    display: flex;
    gap: 6px;
  }
  .diag-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(148, 163, 184, 0.35);
  }
  .diag-dot.active {
    background: #10b981;
  }
  .diag-title {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #94a3b8;
  }
  .diag-rows {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .diag-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 7px;
    padding: 9px 11px;
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
  }
  .diag-badge {
    font-size: 10px;
    font-weight: 700;
    color: #e2e8f0;
    background: rgba(51, 65, 85, 0.65);
    padding: 3px 7px;
    border-radius: 4px;
    min-width: 54px;
    text-align: center;
  }
  .diag-code {
    font-size: 11.5px;
    color: #cbd5e1;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .diag-status {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* Footer Bar with Author Portrait */
  .footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }
  .author-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #10b981;
  }
  .author-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .author-name {
    font-size: 14px;
    font-weight: 700;
    color: #f8fafc;
  }
  .author-role {
    font-size: 12px;
    color: #94a3b8;
  }
  .footer-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .route-tag {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    font-weight: 700;
    color: #f8fafc;
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.25);
    padding: 6px 14px;
    border-radius: 6px;
  }
  .consortium-tag {
    font-family: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    color: #64748b;
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>
  <div class="canvas">
    <div class="top-accent-line"></div>
    <div class="grid-overlay"></div>

    <div class="header">
      <div class="brand">
        <div class="shield-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div class="brand-name">ZTDS<span>.ai</span></div>
        <span class="brand-sep">//</span>
        <div class="kicker-pill">${card.kicker}</div>
      </div>
      <div class="spec-coord">SPEC REV 1.0 · VERIFIED</div>
    </div>

    <div class="main">
      <div class="left-col">
        <h1 class="title">${card.title}</h1>
        <p class="subtitle">${card.subtitle}</p>
        <div class="metrics-row">
          ${metricsHtml}
        </div>
      </div>

      <div class="right-col">
        <div class="diag-header">
          <div class="diag-dots">
            <div class="diag-dot active"></div>
            <div class="diag-dot"></div>
            <div class="diag-dot"></div>
          </div>
          <div class="diag-title">${card.diagramTitle}</div>
        </div>
        <div class="diag-rows">
          ${rowsHtml}
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="author-block">
        ${portraitBase64 ? `<img class="author-avatar" src="${portraitBase64}" alt="Ilya Sibiryakov" />` : ''}
        <div class="author-meta">
          <div class="author-name">Ilya Sibiryakov · Chief Architect &amp; Lead Author</div>
          <div class="author-role">IETF draft-sibiryakov-ztds-protocol · ORCID 0009-0002-0642-5985</div>
        </div>
      </div>
      <div class="footer-right">
        <div class="consortium-tag">ZERO-TRUST DATA SANITIZATION STANDARD</div>
        <div class="route-tag">${card.routeLabel}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function resolveOgImageForFile(relPath) {
  const p = relPath.replace(/\\/g, '/');
  if (p.startsWith('blueprints/')) return 'https://ztds.ai/assets/img/og/og-blueprints.png';
  if (
    p.startsWith('compliance/') ||
    p.startsWith('ciso/') ||
    p.startsWith('soc2/') ||
    p.startsWith('evidentiary-sovereignty/') ||
    p.startsWith('roi/') ||
    p.includes('docs/legal/')
  ) {
    return 'https://ztds.ai/assets/img/og/og-compliance.png';
  }
  if (p.startsWith('benchmarks/')) return 'https://ztds.ai/assets/img/og/og-benchmarks.png';
  if (p.startsWith('mcp/') || p.startsWith('sdk/')) return 'https://ztds.ai/assets/img/og/og-mcp.png';
  if (p.startsWith('scanner/') || p.startsWith('inspector/')) return 'https://ztds.ai/assets/img/og/og-scanner.png';
  if (
    p.startsWith('registry/') ||
    p.startsWith('companies/') ||
    p.startsWith('case-studies/') ||
    p.startsWith('certification/')
  ) {
    return 'https://ztds.ai/assets/img/og/og-registry.png';
  }
  if (p.startsWith('fellows/')) return 'https://ztds.ai/assets/img/og/og-fellows.png';
  return 'https://ztds.ai/assets/img/og/og-default.png';
}

function syncHtmlOgMeta() {
  const { execSync } = require('child_process');
  const files = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter((f) => f && f !== 'public/logo-foundry.html');

  let updatedCount = 0;

  for (const relPath of files) {
    const absPath = path.join(ROOT, relPath);
    const orig = fs.readFileSync(absPath, 'utf8');
    let html = orig;
    const ogUrl = resolveOgImageForFile(relPath);

    // Remove existing og:image:type, og:image:width, og:image:height to avoid duplicates
    html = html.replace(/^[ \t]*<meta[^>]+property=["']og:image:(type|width|height)["'][^>]*>\r?\n?/gim, '');

    const ogBlock = [
      `  <meta property="og:image" content="${ogUrl}">`,
      `  <meta property="og:image:type" content="image/png">`,
      `  <meta property="og:image:width" content="1200">`,
      `  <meta property="og:image:height" content="630">`
    ].join('\n');

    if (/<meta[^>]+property=["']og:image["'][^>]*>/i.test(html)) {
      html = html.replace(/^[ \t]*<meta[^>]+property=["']og:image["'][^>]*>/im, ogBlock);
    } else if (/<meta[^>]+property=["']og:description["'][^>]*>/i.test(html)) {
      html = html.replace(
        /(^[ \t]*<meta[^>]+property=["']og:description["'][^>]*>)/im,
        `$1\n${ogBlock}`
      );
    }

    // Ensure twitter:image is present and updated
    if (/<meta[^>]+name=["']twitter:image["'][^>]*>/i.test(html)) {
      html = html.replace(
        /^[ \t]*<meta[^>]+name=["']twitter:image["'][^>]*>/im,
        `  <meta name="twitter:image" content="${ogUrl}">`
      );
    } else {
      const hasTwitterCard = /<meta[^>]+name=["']twitter:card["'][^>]*>/i.test(html);
      const twInsert = hasTwitterCard
        ? `  <meta name="twitter:image" content="${ogUrl}">`
        : `  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:image" content="${ogUrl}">`;
      html = html.replace(
        /(<meta property="og:image:height" content="630">)/i,
        `$1\n${twInsert}`
      );
    }

    if (html !== orig) {
      fs.writeFileSync(absPath, html, 'utf8');
      updatedCount++;
    }
  }

  console.log(`[OG Generator] Synchronized OG & Twitter meta tags across ${updatedCount} HTML files.`);
}

function main() {
  const syncOnly = process.argv.includes('--sync-only');
  if (!syncOnly) {
    const chromeBin = findChrome();
    for (const dir of OUT_DIRS) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ztds-og-'));

    try {
      for (const card of CARDS) {
        const htmlPath = path.join(tmpDir, `${card.filename}.html`);
        const outPrimary = path.join(OUT_DIRS[0], card.filename);
        const outPublic = path.join(OUT_DIRS[1], card.filename);

        fs.writeFileSync(htmlPath, buildCardHtml(card), 'utf8');

        execFileSync(
          chromeBin,
          [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--force-device-scale-factor=1',
            '--window-size=1200,630',
            `--screenshot=${outPrimary}`,
            `file://${htmlPath}`
          ],
          { stdio: 'ignore' }
        );

        fs.copyFileSync(outPrimary, outPublic);

        if (card.alsoRootOg) {
          fs.copyFileSync(outPrimary, path.join(ROOT, 'og-image.png'));
          fs.copyFileSync(outPrimary, path.join(ROOT, 'public', 'og-image.png'));
        }

        const stat = fs.statSync(outPrimary);
        console.log(`[OG Generator] Rendered ${card.filename} (${(stat.size / 1024).toFixed(1)} KB)`);
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  syncHtmlOgMeta();
}

if (require.main === module) {
  main();
}

