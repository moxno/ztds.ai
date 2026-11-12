/**
 * ZTDS.ai — Site-Wide Clarity, Top-Keyword SEO & Strict CSP + Trusted Types Verification Suite
 *
 * Programmatically enforces Wave 2 architectural, visual, SEO, and security invariants across:
 * - All 60 public HTML pages (root + hub/spoke routes + print/spec mirrors)
 * - All 30 client-side JavaScript modules (nav.js + assets/js/**)
 * - Generator templates (scripts/generate-company-profiles.js, scripts/generate-framework-pages.js)
 * - Vercel Edge security policy (vercel.json)
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Site-Wide Clarity, SEO & Strict CSP + Trusted Types Suite...\n');

const ROOT = path.resolve(__dirname, '..');

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  '.vercel',
  '.agent',
  '.agents',
  'public',
  'stitch_export'
]);

function collectHtmlFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (rel.startsWith('docs/legal/internal') || rel.startsWith('docs/legal/ilpo-filing-package')) {
      continue;
    }
    if (ent.isDirectory()) {
      collectHtmlFiles(full, out);
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out.sort();
}

function collectJsFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      collectJsFiles(full, out);
    } else if (ent.isFile() && ent.name.endsWith('.js')) {
      out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
    }
  }
  return out.sort();
}

const HTML_FILES = collectHtmlFiles(ROOT);
const CLIENT_JS_FILES = ['nav.js', ...collectJsFiles(path.join(ROOT, 'assets/js'))];

const SPECIALIZED_LAYOUT_PAGES = new Set([
  'ciso/memo/index.html',
  'ciso/memo.html',
  'docs/legal/order-form/index.html',
  'docs/legal/order-form.html',
  'deck/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-01/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-01.html',
  'ietf/draft-sibiryakov-ztds-protocol-02/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-02.html'
]);

// Test 1: Zero Inline Executable Scripts, Zero Inline Event Handlers & External Asset Mirror Parity
console.log('--> Test 1: Site-Wide Zero Inline Executable Scripts & Zero Inline Event Handlers');
{
  assert(HTML_FILES.length >= 60, `Expected at least 60 public HTML pages, found ${HTML_FILES.length}`);

  const inlineScriptViolations = [];
  const inlineHandlerViolations = [];
  const referencedScripts = new Set();

  for (const relPath of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const scriptMatches = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

    for (const match of scriptMatches) {
      const attrs = match[1] || '';
      const body = (match[2] || '').trim();
      if (/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;

      const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch || body.length > 0) {
        inlineScriptViolations.push(`${relPath}: <script${attrs}>`);
      } else {
        referencedScripts.add(srcMatch[1]);
      }
    }

    const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    const handlerMatches = withoutScripts.match(/<[a-zA-Z0-9-]+\b[^>]*?\s(on[a-z]+\s*=)/gi);
    if (handlerMatches) {
      inlineHandlerViolations.push(`${relPath}: ${handlerMatches.join(', ')}`);
    }
  }

  assert.strictEqual(
    inlineScriptViolations.length,
    0,
    `Inline executable <script> blocks violate script-src 'self':\n${inlineScriptViolations.join('\n')}`
  );
  assert.strictEqual(
    inlineHandlerViolations.length,
    0,
    `Inline on*= event handler attributes violate strict CSP:\n${inlineHandlerViolations.join('\n')}`
  );

  for (const scriptUrl of referencedScripts) {
    assert(scriptUrl.startsWith('/'), `External script src must be root-relative, got: ${scriptUrl}`);
    const cleanRel = scriptUrl.replace(/^\//, '').split('?')[0];
    const rootScriptPath = path.join(ROOT, cleanRel);
    assert(fs.existsSync(rootScriptPath), `Referenced script missing on disk: ${cleanRel}`);
    assert(fs.statSync(rootScriptPath).size > 0, `Referenced script is empty: ${cleanRel}`);

    if (cleanRel.startsWith('assets/js/')) {
      const publicScriptPath = path.join(ROOT, 'public', cleanRel);
      assert(fs.existsSync(publicScriptPath), `Missing public/ mirror for script: public/${cleanRel}`);
      assert(
        fs.readFileSync(rootScriptPath).equals(fs.readFileSync(publicScriptPath)),
        `Mirror drift between ${cleanRel} and public/${cleanRel}`
      );
    }
  }

  console.log(`    [PASS] ${HTML_FILES.length} HTML pages contain 0 inline executable scripts, 0 inline handlers, and ${referencedScripts.size} verified external JS bundles.`);
}

// Test 2: Zero DOM XSS Sinks & Zero Unescaped HTML Entities in Client JS (Trusted Types Readiness)
console.log('--> Test 2: Zero DOM XSS Sinks & Trusted Types Enforcement Readiness Across Client JS');
{
  assert(CLIENT_JS_FILES.length >= 30, `Expected at least 30 client JS files, found ${CLIENT_JS_FILES.length}`);

  const sinkViolations = [];
  const entityViolations = [];

  for (const relPath of CLIENT_JS_FILES) {
    const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');

    const sinkMatches = stripped.match(/\.(innerHTML|outerHTML|insertAdjacentHTML|setHTMLUnsafe)\b|\bdocument\.write(?:ln)?\s*\(|\beval\s*\(\s*[^)\s]/g);
    if (sinkMatches) {
      sinkViolations.push(`${relPath}: ${sinkMatches.join(', ')}`);
    }

    const literalEntities = stripped.match(/&(rarr|larr|bull|mdash|ndash|check|times|nbsp);/g);
    if (literalEntities) {
      entityViolations.push(`${relPath}: ${literalEntities.join(', ')}`);
    }
  }

  assert.strictEqual(
    sinkViolations.length,
    0,
    `Dangerous DOM sinks break Trusted Types ('none') policy:\n${sinkViolations.join('\n')}`
  );
  assert.strictEqual(
    entityViolations.length,
    0,
    `Raw HTML character entities inside client JS render literally under textContent:\n${entityViolations.join('\n')}`
  );

  console.log(`    [PASS] ${CLIENT_JS_FILES.length} client JS modules contain 0 DOM XSS sinks and 0 literal HTML entities.`);
}

// Test 3: Visual Clarity, Zero Cognitive Noise & Institutional Monochrome + Emerald Hierarchy
console.log('--> Test 3: Visual Clarity, Auto-Hiding Compact Chrome & Monochrome-Emerald Token Palette');
{
  let standardPortalPages = 0;

  for (const relPath of HTML_FILES) {
    if (SPECIALIZED_LAYOUT_PAGES.has(relPath)) continue;
    standardPortalPages++;

    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*)/i);
    assert(bodyMatch, `Missing <body> in ${relPath}`);
    const bodyContent = bodyMatch[1];

    const headerIdx = bodyContent.search(/<header\b/i);
    assert(headerIdx !== -1, `Missing <header> in standard portal page ${relPath}`);

    const beforeHeader = bodyContent.slice(0, headerIdx);
    assert(
      !/<div\b/i.test(beforeHeader),
      `Stacked announcement/status <div> above <header> creates cognitive noise in ${relPath}`
    );

    const headerTag = bodyContent.slice(headerIdx).match(/<header\b[^>]*>/i)[0];
    assert(
      headerTag.includes('ztds-sticky-header'),
      `Header in ${relPath} must include .ztds-sticky-header for compact auto-hide scroll behavior`
    );
  }

  // Verify generator templates preserve .ztds-sticky-header and zero announcement bars
  for (const genRel of ['scripts/generate-company-profiles.js', 'scripts/generate-framework-pages.js']) {
    const genCode = fs.readFileSync(path.join(ROOT, genRel), 'utf8');
    assert(genCode.includes('ztds-sticky-header'), `${genRel} must emit .ztds-sticky-header on generated pages`);
    assert(!genCode.includes('IETF Draft-01 Archival Spec'), `${genRel} must not emit pruned Draft-01 footer bloat`);
  }

  // Verify rubber-band overscroll clamping in nav.js scroll-state fallback
  const navCode = fs.readFileSync(path.join(ROOT, 'nav.js'), 'utf8');
  assert(
    navCode.includes('Math.max(0, Math.min(') && navCode.includes("CSS.supports('container-type', 'scroll-state')"),
    'nav.js must clamp rubber-band overscroll in .ztds-sticky-header fallback'
  );

  // Verify rainbow token badge classes are eliminated from interactive token visualizers (preserving 92% Slate / 6% Emerald / 2% Rose Alert)
  const rainbowClasses = /\b(bg-purple-950|bg-sky-950|bg-amber-950|bg-indigo-950|bg-teal-950|bg-cyan-950|bg-pink-950)\b/;
  for (const highlighterRel of [
    'assets/js/home-workbench.js',
    'assets/js/pages/inspector.js',
    'assets/js/pages/mcp.js',
    'assets/js/pages/scanner.js'
  ]) {
    const code = fs.readFileSync(path.join(ROOT, highlighterRel), 'utf8');
    assert(
      !rainbowClasses.test(code),
      `Rainbow token badge palette found in ${highlighterRel}; enforce monochrome + emerald hierarchy`
    );
  }

  console.log(`    [PASS] ${standardPortalPages} standard chrome pages, 2 generator templates, and 4 token highlighters pass visual clarity invariants.`);
}

// Test 4: Top-Keyword SEO, Schema.org @id Deduplication & PageRank Hygiene
console.log('--> Test 4: Schema.org @id Deduplication, Single <h1> & Normative Draft-02 Parity');
{
  for (const relPath of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');

    const h1Count = (html.match(/<h1\b/gi) || []).length;
    assert.strictEqual(h1Count, 1, `Expected exactly 1 <h1> in ${relPath}, found ${h1Count}`);

    assert(
      !/IETF Draft-01 Archival Spec/i.test(html),
      `Pruned archival footer link still present in ${relPath}`
    );

    const ldBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    assert(ldBlocks.length >= 1, `Missing Schema.org JSON-LD block in ${relPath}`);

    const fullDefinitionsById = new Set();
    for (const block of ldBlocks) {
      let parsed;
      try {
        parsed = JSON.parse(block[1]);
      } catch (err) {
        assert.fail(`Invalid JSON-LD in ${relPath}: ${err.message}`);
      }
      const graphNodes = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
      for (const node of graphNodes) {
        if (node && typeof node === 'object' && node['@id'] && Object.keys(node).length > 2) {
          assert(
            !fullDefinitionsById.has(node['@id']),
            `Duplicate full Schema.org @id definition "${node['@id']}" in ${relPath}`
          );
          fullDefinitionsById.add(node['@id']);
        }
      }
    }
  }

  const sdkHtml = fs.readFileSync(path.join(ROOT, 'sdk/index.html'), 'utf8');
  assert(!sdkHtml.includes('draft-sibiryakov-ztds-protocol-01'), 'sdk/index.html must reference active draft-02 rather than stale draft-01');
  assert(sdkHtml.includes('draft-sibiryakov-ztds-protocol-02'), 'sdk/index.html must reference active draft-sibiryakov-ztds-protocol-02');

  console.log(`    [PASS] All ${HTML_FILES.length} HTML pages have valid deduplicated JSON-LD graphs, single <h1>, and clean PageRank routing.`);
}

// Test 5: Site-Wide Enforced CSP + Trusted Types + CORP Policy in vercel.json
console.log('--> Test 5: Site-Wide Enforced CSP, Trusted Types & CORP Precedence in vercel.json');
{
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length > 0, 'vercel.json must define headers array');

  const globalRule = vercelConfig.headers[0];
  assert.strictEqual(
    globalRule.source,
    '/(.*)',
    `vercel.json headers[0] must be "/(.*)" so embeddable asset rules override CORP cleanly, got "${globalRule.source}"`
  );

  const headerMap = new Map(globalRule.headers.map(h => [h.key, h.value]));
  assert.strictEqual(headerMap.get('X-Content-Type-Options'), 'nosniff');
  assert.strictEqual(headerMap.get('X-Frame-Options'), 'DENY');
  assert.strictEqual(headerMap.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.strictEqual(headerMap.get('Cross-Origin-Opener-Policy'), 'same-origin-allow-popups');
  assert.strictEqual(headerMap.get('Cross-Origin-Resource-Policy'), 'same-origin');

  const csp = headerMap.get('Content-Security-Policy') || '';
  assert(csp.includes("default-src 'self'"), "CSP must enforce default-src 'self'");
  assert(csp.includes("script-src 'self' 'report-sample'"), "CSP must enforce script-src 'self' 'report-sample'");
  assert(!/script-src[^;]*'unsafe-inline'/.test(csp), "CSP script-src must NOT contain 'unsafe-inline'");
  assert(!/script-src[^;]*'unsafe-eval'/.test(csp), "CSP script-src must NOT contain 'unsafe-eval'");
  assert(csp.includes("object-src 'none'"), "CSP must enforce object-src 'none'");
  assert(csp.includes("base-uri 'none'"), "CSP must enforce base-uri 'none'");
  assert(csp.includes("frame-src 'none'"), "CSP must enforce frame-src 'none'");
  assert(csp.includes("frame-ancestors 'none'"), "CSP must enforce frame-ancestors 'none'");
  assert(csp.includes("form-action 'self'"), "CSP must enforce form-action 'self'");
  assert(csp.includes("require-trusted-types-for 'script'"), "CSP must enforce require-trusted-types-for 'script'");
  assert(csp.includes("trusted-types 'none'"), "CSP must enforce zero-sink trusted-types 'none' policy");

  // Verify embeddable badge and static asset routes follow /(.*) and override CORP to cross-origin
  for (const requiredCrossOriginSource of ['/badge/(.*)', '/api/badge(.*)']) {
    const idx = vercelConfig.headers.findIndex(r => r.source === requiredCrossOriginSource);
    assert(idx > 0, `Embeddable rule ${requiredCrossOriginSource} must appear after /(.*) in vercel.json`);
    const corp = vercelConfig.headers[idx].headers.find(h => h.key === 'Cross-Origin-Resource-Policy');
    assert(corp && corp.value === 'cross-origin', `${requiredCrossOriginSource} must set Cross-Origin-Resource-Policy: cross-origin`);
  }

  console.log('    [PASS] vercel.json enforces site-wide strict CSP, Trusted Types (\'none\'), COOP, and CORP precedence.');
}

console.log('\n[SUMMARY] ALL 5 SITE-WIDE CLARITY, SEO & BROWSER SECURITY INVARIANT TESTS PASSED.\n');
