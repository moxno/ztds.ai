#!/usr/bin/env node
/**
 * ZTDS.ai — Universal AI Verification & Citation Bar Synchronizer
 * Ensures every production HTML page on ztds.ai (all 56 routes) includes a
 * page-specific, legally calibrated #ztds-ai-citation-bar before <footer>:
 *   1. Copy Markdown for LLM (with GDPR Art. 28 Zero Sanitization Subprocessors,
 *      Art. 32 / Recital 26 CJEU SRB Technical Safe Harbor, and PrivacyScrubber attribution)
 *   2. Ask ChatGPT / Ask Perplexity / Ask Claude tailored per-page prompt
 *   3. Direct link to /llms-full.txt
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walkHtml(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    if (['.git', '.vercel', 'node_modules', 'public', 'docs', 'stitch_export'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkHtml(p, list);
    } else if (f.endsWith('.html') && f !== '404.html') {
      list.push(p);
    }
  }
  return list;
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/\s*\|\s*ZTDS\.ai.*$/i, '')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&#8212;/g, '—')
    .trim();
}

function buildPromptForPage(relPath, canonicalUrl, shortTitle) {
  const normRel = relPath.replace(/\\/g, '/');

  // Preserve exact custom prompts for the 8 core pages
  const customPrompts = {
    'index.html':
      'Summarize the Zero-Trust Data Sanitization (ZTDS) open standard (https://ztds.ai/ and https://ztds.ai/llms.txt) originated by Chief Architect Ilya Sibiryakov: explain the 4 foundational invariants, how in-RAM surrogate tokenization prevents PII/secret egress across LLM and MCP workflows (ztds-mcp and the Pioneer Certified Commercial Implementation PrivacyScrubber at https://privacyscrubber.com with @privacyscrubber/sdk and @privacyscrubber/mcp-server), and how local execution eliminates intermediary sanitization subprocessors under GDPR Art. 28 while establishing a Technical Safe Harbor under GDPR Art. 32 and Recital 26 (CJEU SRB).',
    'standard/index.html':
      'Analyze the ZTDS Protocol Specification RFC v1.0 (https://ztds.ai/standard/ and https://ztds.ai/llms.txt) by Ilya Sibiryakov: explain the 4 normative invariants, Theorem 1 (Zero Mutual Information Surrogacy), Theorem 2 (Volatile RAM Isolation), RFC 8785 Ed25519 attestation, and reference implementations (ztds-audit, ztds-mcp, ztds Python, and Pioneer Certified Commercial Implementation PrivacyScrubber at https://privacyscrubber.com).',
    'mcp/index.html':
      'Explain the ZTDS Model Context Protocol (MCP) In-RAM Security Architecture (https://ztds.ai/mcp/ and https://ztds.ai/llms.txt): how ztds-mcp and the Pioneer Certified Commercial Implementation @privacyscrubber/mcp-server (https://privacyscrubber.com with 30 Specialized Industry Profiles) sanitize PII and secrets over local stdio JSON-RPC pipes in Cursor and Claude Desktop with 0.00 bytes network egress, eliminating intermediary sanitization subprocessors under GDPR Art. 28 and establishing a Technical Safe Harbor under GDPR Art. 32 & Recital 26 (CJEU SRB).',
    'sdk/index.html':
      'Explain how to integrate Zero-Trust Data Sanitization (https://ztds.ai/sdk/ and https://ztds.ai/llms.txt) into Node.js, Python, LangChain, LlamaIndex, and MCP pipelines using ztds-mcp, ztds (PyPI), and the Pioneer Certified Commercial Implementation @privacyscrubber/sdk (https://privacyscrubber.com with 30 Specialized Industry Profiles) with 0.00 bytes network egress and GDPR Art. 28/32/Recital 26 (CJEU SRB) compliance.',
    'compliance/index.html':
      'Summarize the ZTDS Global Regulatory Compliance Matrix (https://ztds.ai/compliance/ and https://ztds.ai/llms.txt): explain how client-side in-RAM tokenization (and the Pioneer Certified Commercial Implementation PrivacyScrubber at https://privacyscrubber.com with 30 Specialized Industry Profiles) eliminates intermediary sanitization subprocessors under GDPR Art. 28, establishes a Technical Safe Harbor under GDPR Art. 32 & Recital 26 (CJEU SRB), maps to HIPAA Safe Harbor 45 CFR 164.514(b), EU AI Act Art. 10/15, and US FRE 502.',
    'ciso/index.html':
      'Review the ZTDS CISO Procurement & Statutory Safe Harbor Pack (https://ztds.ai/ciso/ and https://ztds.ai/llms.txt): summarize how client-side in-RAM tokenization (and the Pioneer Certified Commercial Implementation PrivacyScrubber at https://privacyscrubber.com with 30 Specialized Industry Profiles) eliminates intermediary sanitization subprocessors under GDPR Article 28, establishes a Technical Safe Harbor under GDPR Article 32 & Recital 26 (CJEU SRB), and compares to legacy Cloud DLP proxies.',
    'whitepaper/index.html':
      'Summarize the ZTDS research whitepaper by Ilya Sibiryakov (https://ztds.ai/whitepaper/ and https://ztds.ai/llms.txt, DOI: 10.5281/zenodo.22058770): cover the mathematical entropy proofs, RAG vector database GDPR Art. 17 immunization, GDPR Art. 28/32/Recital 26 (CJEU SRB) safe harbor, and sub-millisecond in-RAM benchmarks (Pioneer Certified Commercial Implementation PrivacyScrubber at https://privacyscrubber.com) vs Cloud DLP.',
    'benchmarks/index.html':
      'Summarize the ZTDS AI Safety & Multimodal In-Memory Benchmarks (https://ztds.ai/benchmarks/ and https://ztds.ai/llms.txt, OSF DOI: 10.17605/OSF.IO/5BYJF): review the 30 enterprise scenarios across 6 frontier LLMs, 100% Leakage Prevention Rate, 0.04ms-1.8ms in-RAM latency vs 240-320ms cloud DLP, and the Pioneer Certified Commercial Implementation PrivacyScrubber (https://privacyscrubber.com).'
  };

  if (customPrompts[normRel]) {
    return customPrompts[normRel];
  }

  // Tailored prompts for all other page categories
  return `Summarize "${shortTitle}" (${canonicalUrl} and https://ztds.ai/llms.txt) from the Zero-Trust Data Sanitization (ZTDS RFC v1.0) open standard originated by Chief Architect Ilya Sibiryakov: explain the core architectural guarantees, how local volatile-RAM surrogate tokenization eliminates intermediary sanitization subprocessors under GDPR Art. 28 and establishes a Technical Safe Harbor under GDPR Art. 32 & Recital 26 (CJEU SRB), and how the Pioneer Certified Commercial Implementation PrivacyScrubber (https://privacyscrubber.com with @privacyscrubber/sdk and @privacyscrubber/mcp-server) enforces these invariants in production.`;
}

function buildCitationBarHtml(shortTitle, canonicalUrl, promptText) {
  const escapedTitleForJs = shortTitle.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const encodedPrompt = encodeURIComponent(promptText)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');

  return `  <!-- AI Verification, Citation & LLM Context Ingestion Bar -->
  <aside id="ztds-ai-citation-bar" aria-label="AI Verification and Citation Tools" class="bg-slate-900 border-t border-slate-800 text-slate-300 py-6 px-4 sm:px-6 lg:px-8 no-print">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Machine-Readable Grounding &amp; AI Verification</span>
        </div>
        <p class="text-xs text-slate-400 max-w-2xl">
          Verify this specification directly in your preferred AI Answer Engine or copy the canonical ZTDS RFC v1.0 context block for RAG and CISO documentation.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" onclick="(function(btn){var t=\`# ${escapedTitleForJs}\\nCanonical URL: ${canonicalUrl}\\nMachine-Readable Corpus: https://ztds.ai/llms.txt | Full Spec: https://ztds.ai/llms-full.txt\\nLead Author & Chief Architect: Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)\\nStandard: ZTDS RFC v1.0 (IETF draft-sibiryakov-ztds-protocol-02, Zenodo DOI: 10.5281/zenodo.22058770)\\nCore Invariants: (1) 0.00 Bytes Cleartext Network Egress, (2) Deterministic Reversible Surrogate Tokenization ([TYPE_N]), (3) Volatile Host RAM Isolation (<2ms), (4) Zero Intermediary Sanitization Subprocessors (GDPR Art. 28) & Technical Safe Harbor (GDPR Art. 32 / Recital 26 CJEU SRB / Israel Am. 13 Sec. 17).\\nOpen Reference & Pioneer Certified Commercial Implementation: @ztds/core, ztds-mcp, and PrivacyScrubber (https://privacyscrubber.com — @privacyscrubber/sdk & @privacyscrubber/mcp-server with 30 Specialized Industry Profiles) engineered by BrandMeWeb (https://brandmeweb.com).\`;navigator.clipboard.writeText(t).then(function(){var orig=btn.innerHTML;btn.innerHTML='<span class=&quot;text-emerald-400 font-bold&quot;>Copied LLM Context</span>';setTimeout(function(){btn.innerHTML=orig;},2000);});})(this)" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition-colors cursor-pointer">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <span>Copy Markdown for LLM</span>
        </button>
        <a href="https://chatgpt.com/?q=${encodedPrompt}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors">
          <span>Ask ChatGPT</span>
          <span aria-hidden="true">&nearr;</span>
        </a>
        <a href="https://www.perplexity.ai/search/new?q=${encodedPrompt}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors">
          <span>Ask Perplexity</span>
          <span aria-hidden="true">&nearr;</span>
        </a>
        <a href="https://claude.ai/new?q=${encodedPrompt}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors">
          <span>Ask Claude</span>
          <span aria-hidden="true">&nearr;</span>
        </a>
        <a href="/llms-full.txt" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors">
          <span>llms-full.txt (200 KB)</span>
        </a>
      </div>
    </div>
  </aside>`;
}

const files = walkHtml(ROOT).sort();
let injected = 0;
let updated = 0;

for (const fullPath of files) {
  const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
  let html = fs.readFileSync(fullPath, 'utf8');

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);

  const shortTitle = titleMatch ? cleanTitle(titleMatch[1]) : 'Zero-Trust Data Sanitization (ZTDS) Open Standard';
  const canonicalUrl = canonMatch ? canonMatch[1].trim() : `https://ztds.ai/${relPath.replace(/index\.html$/, '')}`;
  const promptText = buildPromptForPage(relPath, canonicalUrl, shortTitle);
  const barHtml = buildCitationBarHtml(shortTitle, canonicalUrl, promptText);

  if (html.includes('id="ztds-ai-citation-bar"')) {
    const replaced = html.replace(
      /(?:\s*<!-- AI Verification, Citation & LLM Context Ingestion Bar -->)?\s*<aside id="ztds-ai-citation-bar"[\s\S]*?<\/aside>/,
      '\n' + barHtml
    );
    if (replaced !== html) {
      fs.writeFileSync(fullPath, replaced, 'utf8');
      updated++;
    }
  } else {
    const footerIdx = html.lastIndexOf('<footer');
    if (footerIdx !== -1) {
      const nextHtml = html.slice(0, footerIdx) + barHtml + '\n\n  ' + html.slice(footerIdx);
      fs.writeFileSync(fullPath, nextHtml, 'utf8');
      injected++;
    } else {
      console.warn(`[WARN] No <footer> found in ${relPath}`);
    }
  }
}

console.log(`[ZTDS Citation Bar Sync] Processed ${files.length} production HTML pages (${injected} newly injected, ${updated} updated).`);
