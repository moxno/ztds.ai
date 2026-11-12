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

// Test 6: Zero External <img> Pings / ORB Leaks, Zero Orphan <label> Elements & Scoped URL Params
console.log('--> Test 6: Zero External <img> Pings, Zero Orphan <label> Elements & Scoped URLSearchParams');
{
  const externalImgs = [];
  const orphanLabels = [];

  for (const relPath of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');

    const imgMatches = html.match(/<img\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];
    for (const m of imgMatches) {
      externalImgs.push(`${relPath}: ${m}`);
    }

    const labelRe = /<label\b([^>]*)>([\s\S]*?)<\/label>/gi;
    let lm;
    while ((lm = labelRe.exec(html)) !== null) {
      const attrs = lm[1];
      const inner = lm[2];
      if (!/\bfor\s*=/.test(attrs) && !/<(?:input|select|textarea)\b/i.test(inner)) {
        orphanLabels.push(`${relPath}: ${lm[0].replace(/\s+/g, ' ').slice(0, 100)}`);
      }
    }
  }

  assert.strictEqual(
    externalImgs.length,
    0,
    `External <img src="https://..."> causes third-party IP leakage and ORB/CORB failures:\n${externalImgs.join('\n')}`
  );
  assert.strictEqual(
    orphanLabels.length,
    0,
    `Orphan <label> tags without for= or nested form controls trigger Chrome DevTools a11y issues:\n${orphanLabels.join('\n')}`
  );

  const sdkJs = fs.readFileSync(path.join(ROOT, 'assets/js/pages/sdk.js'), 'utf8');
  assert(
    sdkJs.includes('const urlParams = new URLSearchParams(window.location.search);'),
    'assets/js/pages/sdk.js must declare urlParams before reading preset deep-link parameters'
  );

  console.log(`    [PASS] All ${HTML_FILES.length} HTML pages contain 0 external <img> pings and 0 orphan <label> elements.`);
}

// Test 7: Wave 3 Screen-1 DOM Order, Skip-Link Deduplication, Light Theme-Color, Sitemap/GEO/CmdK 55/55 Parity & WAI-ARIA Widgets
console.log('--> Test 7: Screen-1 Main-Before-Aside Order, Single Skip-Link, Theme-Color #f8fafc, 55/55 Sitemap Parity & WAI-ARIA Widgets');
{
  const duplicateSkipLinks = [];
  const unhiddenBackdrops = [];
  const themeColorViolations = [];

  for (const relPath of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');

    if (/<main\b/i.test(html)) {
      const skipCount = (html.match(/<a\b[^>]*\bclass=["'][^"']*\bskip-link\b[^"']*["'][^>]*>/gi) || []).length;
      if (skipCount !== 1) {
        duplicateSkipLinks.push(`${relPath}: found ${skipCount} .skip-link anchors`);
      }
    }

    const backdropMatch = html.match(/<div\b[^>]*\bid=["']mobile-backdrop["'][^>]*>/i);
    if (backdropMatch && !/\baria-hidden=["']true["']/i.test(backdropMatch[0])) {
      unhiddenBackdrops.push(relPath);
    }

    if (!SPECIALIZED_LAYOUT_PAGES.has(relPath)) {
      const tcMatch = html.match(/<meta\b[^>]*\bname=["']theme-color["'][^>]*\bcontent=["']([^"']+)["']/i) ||
                      html.match(/<meta\b[^>]*\bcontent=["']([^"']+)["'][^>]*\bname=["']theme-color["']/i);
      if (!tcMatch || tcMatch[1].toLowerCase() !== '#f8fafc') {
        themeColorViolations.push(`${relPath}: theme-color=${tcMatch ? tcMatch[1] : 'missing'}`);
      }
    }
  }

  assert.strictEqual(
    duplicateSkipLinks.length,
    0,
    `Pages with <main> must contain exactly 1 .skip-link:\n${duplicateSkipLinks.join('\n')}`
  );
  assert.strictEqual(
    unhiddenBackdrops.length,
    0,
    `#mobile-backdrop must carry aria-hidden="true":\n${unhiddenBackdrops.join('\n')}`
  );
  assert.strictEqual(
    themeColorViolations.length,
    0,
    `Light-chrome pages must set <meta name="theme-color" content="#f8fafc">:\n${themeColorViolations.join('\n')}`
  );

  // Verify webmanifest theme_color + background_color parity
  for (const manifestRel of ['site.webmanifest', 'public/site.webmanifest']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, manifestRel), 'utf8'));
    assert.strictEqual(manifest.theme_color, '#f8fafc', `${manifestRel} theme_color must be #f8fafc`);
    assert.strictEqual(manifest.background_color, '#f8fafc', `${manifestRel} background_color must be #f8fafc`);
  }

  // Verify Screen-1 DOM order (<main id="main-content"> precedes <aside) on long-form RFC & Whitepaper treatises
  for (const treatiseRel of ['standard/index.html', 'whitepaper/index.html']) {
    const html = fs.readFileSync(path.join(ROOT, treatiseRel), 'utf8');
    const mainIdx = html.search(/<main\b[^>]*\bid=["']main-content["']/i);
    const asideIdx = html.indexOf('<aside aria-label=');
    assert(mainIdx !== -1 && asideIdx !== -1, `Missing <main> or TOC <aside> in ${treatiseRel}`);
    assert(
      mainIdx < asideIdx,
      `${treatiseRel} must place <main id="main-content"> before <aside> so mobile Screen 1 shows <h1> first and DOM focus order matches visual order`
    );
  }

  // Verify 100% parity (55/55 routes) across sitemap.xml, llms.txt, and nav.js SITE_INDEX
  const sitemapXml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(https:\/\/ztds\.ai[^<]+)<\/loc>/g)].map(m => m[1]);
  assert(sitemapUrls.length >= 55, `Expected >= 55 URLs in sitemap.xml, found ${sitemapUrls.length}`);

  const llmsTxt = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
  const navCode = fs.readFileSync(path.join(ROOT, 'nav.js'), 'utf8');

  const missingInLlms = sitemapUrls.filter(u => !llmsTxt.includes(u));
  assert.strictEqual(
    missingInLlms.length,
    0,
    `Every sitemap.xml route must be indexed in llms.txt; missing:\n${missingInLlms.join('\n')}`
  );

  const missingInCmdK = sitemapUrls
    .map(u => new URL(u).pathname)
    .filter(pathname => !navCode.includes(`url: '${pathname}'`));
  assert.strictEqual(
    missingInCmdK.length,
    0,
    `Every sitemap.xml pathname must be discoverable in nav.js SITE_INDEX (Cmd+K); missing:\n${missingInCmdK.join('\n')}`
  );

  // Verify WAI-ARIA Combobox, centralized polite clipboard live region, and Scanner tablist semantics
  assert(navCode.includes("input.setAttribute('role', 'combobox')"), 'nav.js Cmd+K input must expose role="combobox"');
  assert(navCode.includes('aria-activedescendant'), 'nav.js Cmd+K input must sync aria-activedescendant');
  assert(navCode.includes('ztds-copy-announcer') && navCode.includes("region.setAttribute('role', 'status')"), 'nav.js ztdsCopy must announce via centralized role="status" live region');

  const scannerHtml = fs.readFileSync(path.join(ROOT, 'scanner/index.html'), 'utf8');
  assert(scannerHtml.includes('role="tablist"') && scannerHtml.includes('role="tab"') && scannerHtml.includes('role="tabpanel"'), 'scanner/index.html output switcher must implement WAI-ARIA tablist/tab/tabpanel');
  assert(!/<button\b[^>]*role="tab"[^>]*aria-controls=/i.test(scannerHtml), 'role="tab" buttons must omit unused aria-controls');

  console.log(`    [PASS] Screen-1 main-before-aside order, single skip-links, #f8fafc theme-color, ${sitemapUrls.length}/${sitemapUrls.length} Sitemap/llms.txt/Cmd+K parity, and WAI-ARIA widgets verified.`);
}

// Test 8: Wave 4 Roving Tablist Navigation, Modal Inert Locking, IME-Safe Enter, Form Ergonomics & 100% Schema.org WebPage Parity
console.log('--> Test 8: Roving Tablists, Modal Inert Locking, IME-Safe Enter, :user-invalid Sync, <search> & 100% WebPage Graph Parity');
{
  const WEBPAGE_TYPES = new Set([
    'WebPage',
    'CollectionPage',
    'AboutPage',
    'ProfilePage',
    'ItemPage',
    'ContactPage',
    'CheckoutPage'
  ]);

  const missingAutocomplete = [];
  const resizeNoneTextareas = [];
  const tabAriaControls = [];
  const modalDialogViolations = [];
  const missingWebPageGraph = [];

  for (const relPath of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, relPath), 'utf8');

    for (const m of html.matchAll(/<input\b[^>]*>/gi)) {
      const tag = m[0];
      const type = (tag.match(/\btype=["']([^"']+)["']/i) || [, 'text'])[1].toLowerCase();
      if (['hidden', 'checkbox', 'radio', 'range', 'file', 'submit', 'button'].includes(type)) continue;
      if (/\breadonly\b/i.test(tag)) continue;
      if (!/\bautocomplete=/i.test(tag)) {
        missingAutocomplete.push(`${relPath}: ${tag}`);
      }
    }

    for (const m of html.matchAll(/<textarea\b[^>]*>/gi)) {
      if (/\bresize-none\b/.test(m[0]) && !/field-sizing\s*:\s*content/i.test(m[0])) {
        resizeNoneTextareas.push(`${relPath}: ${m[0]}`);
      }
    }

    for (const m of html.matchAll(/<[^>]*\brole=["']tab["'][^>]*>/gi)) {
      if (/\baria-controls=/i.test(m[0])) {
        tabAriaControls.push(`${relPath}: ${m[0]}`);
      }
    }

    for (const m of html.matchAll(/<div\b[^>]*\bid=["'][^"']*Modal[^"']*["'][^>]*>/gi)) {
      const tag = m[0];
      const id = (tag.match(/\bid=["']([^"']+)["']/i) || [, ''])[1];
      if (!/^(?:procurementModal|caseStudyModal|badgeModal|fellowBadgeModal|cisoLeadModal|certModal|memoPreviewModal|modalCisoAuditReport|checkoutModal|modalCertificatePrint)$/.test(id)) {
        continue;
      }
      if (!/\brole=["']dialog["']/i.test(tag) || !/\baria-modal=["']true["']/i.test(tag)) {
        modalDialogViolations.push(`${relPath}: ${tag}`);
      }
    }

    if (relPath !== '404.html') {
      const ldBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      let hasWebPage = false;
      for (const block of ldBlocks) {
        const parsed = JSON.parse(block[1]);
        const graph = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
        if (graph.some((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).some((t) => WEBPAGE_TYPES.has(t)))) {
          hasWebPage = true;
        }
      }
      if (!hasWebPage) {
        missingWebPageGraph.push(relPath);
      }
    }
  }

  assert.strictEqual(missingAutocomplete.length, 0, `Editable text-like <input> controls must specify autocomplete:\n${missingAutocomplete.join('\n')}`);
  assert.strictEqual(resizeNoneTextareas.length, 0, `<textarea> controls must not disable resizing via resize-none:\n${resizeNoneTextareas.join('\n')}`);
  assert.strictEqual(tabAriaControls.length, 0, `[role="tab"] controls must omit unused aria-controls:\n${tabAriaControls.join('\n')}`);
  assert.strictEqual(modalDialogViolations.length, 0, `Custom modal overlays must carry role="dialog" and aria-modal="true":\n${modalDialogViolations.join('\n')}`);
  assert.strictEqual(missingWebPageGraph.length, 0, `Every indexable route must define a WebPage node in Schema.org @graph:\n${missingWebPageGraph.join('\n')}`);

  // Verify semantic <search> + type="search" across all 6 directory filter pages
  for (const searchPage of [
    'benchmarks/index.html',
    'case-studies/index.html',
    'ciso/index.html',
    'companies/index.html',
    'fellows/index.html',
    'registry/index.html'
  ]) {
    const html = fs.readFileSync(path.join(ROOT, searchPage), 'utf8');
    assert(/<search\b[\s\S]*?<input\b[^>]*\btype=["']search["']/i.test(html), `${searchPage} must wrap its filter <input type="search"> in a semantic <search> landmark`);
  }

  // Verify preset button groups expose role="group" + aria-pressed across all 4 interactive workbenches
  for (const [presetPage, cls] of [
    ['index.html', 'hero-preset-btn'],
    ['ciso/index.html', 'ciso-preset-btn'],
    ['mcp/index.html', 'sim-preset-btn'],
    ['scanner/index.html', 'mode0-preset-btn']
  ]) {
    const html = fs.readFileSync(path.join(ROOT, presetPage), 'utf8');
    assert(new RegExp(`role=["']group["'][\\s\\S]*?${cls}`).test(html), `${presetPage} must wrap .${cls} controls in a labeled role="group"`);
    const btns = [...html.matchAll(new RegExp(`<button\\b[^>]*\\bclass=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>`, 'gi'))];
    assert(btns.length >= 3, `Expected >= 3 .${cls} buttons in ${presetPage}`);
    for (const b of btns) {
      assert(/\baria-pressed=["'](?:true|false)["']/i.test(b[0]), `${presetPage} .${cls} missing aria-pressed: ${b[0]}`);
    }
  }

  // Verify printable legal/memo top bars use <header> rather than complementary <aside> before <main>
  for (const printPage of ['ciso/memo/index.html', 'ciso/memo.html', 'docs/legal/order-form/index.html', 'docs/legal/order-form.html']) {
    const html = fs.readFileSync(path.join(ROOT, printPage), 'utf8');
    const mainIdx = html.indexOf('<main');
    assert(mainIdx !== -1 && !/<aside\b/i.test(html.slice(0, mainIdx)), `${printPage} must use <header> rather than <aside> before <main>`);
  }

  // Verify global nav.js + apply.js + input.css runtime invariants
  const navJs = fs.readFileSync(path.join(ROOT, 'nav.js'), 'utf8');
  const applyJs = fs.readFileSync(path.join(ROOT, 'assets/js/pages/apply.js'), 'utf8');
  const inputCssNoComments = fs.readFileSync(path.join(ROOT, 'src/input.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  assert(navJs.includes('function syncBackgroundInert()') && navJs.includes('child.inert = true'), 'nav.js must lock outside landmarks with inert when a custom dialog opens');
  assert(navJs.includes("document.querySelectorAll('[role=\"tablist\"]')") && navJs.includes('tab.tabIndex = tab === selectedTab ? 0 : -1'), 'nav.js must bind roving tabIndex and arrow-key navigation across [role="tablist"] widgets');
  assert(navJs.includes('e.isComposing || e.keyCode === 229') && applyJs.includes('e.isComposing || e.keyCode === 229'), 'Custom Enter keydown handlers in nav.js and apply.js must guard against active IME composition');
  assert(navJs.includes("el.matches(':user-invalid')") && navJs.includes("el.setAttribute('aria-invalid', 'false')"), 'nav.js must synchronize aria-invalid with :user-invalid');
  assert(inputCssNoComments.includes(':user-invalid') && !/(?:^|[^a-z-]):invalid\b/.test(inputCssNoComments), 'src/input.css must style validation errors via :user-invalid rather than raw :invalid');

  console.log(`    [PASS] Roving tablists, modal inert locking, IME-safe Enter, :user-invalid sync, <search> landmarks, and ${HTML_FILES.length - 1}/${HTML_FILES.length - 1} Schema.org WebPage nodes verified.`);
}

console.log('\n[SUMMARY] ALL 8 SITE-WIDE CLARITY, SEO & BROWSER SECURITY INVARIANT TESTS PASSED.\n');
