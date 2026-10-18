/**
 * ZTDS.ai Routes Integrity & Compliance Test Suite
 * Validates HTML5 document structure, meta tags, zero-emoji policy, and BrandMeWeb spelling SSOT.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Routes Integrity & Compliance Verification Suite...\n');

const rootDir = path.join(__dirname, '..');

const prodPages = [
  'index.html',
  'standard/index.html',
  'ciso/index.html',
  'ciso/memo.html',
  'sdk/index.html',
  'whitepaper/index.html',
  'scanner/index.html',
  'registry/index.html',
  'companies/index.html',
  'fellows/index.html',
  'governance/index.html',
  'badge/index.html',
  'verify/index.html',
  'certification/index.html',
  'apply/index.html',
  'roi/index.html',
  'security/index.html',
  'privacy/index.html',
  'terms/index.html',
  'inspector/index.html',
  'soc2/index.html',
  'deck/index.html',
  'agency/index.html',
  'fellows/ilya-sibiryakov/index.html',
  'fellows/cliford-fanyuy/index.html',
  'companies/brandmeweb/index.html',
  'companies/privacyscrubber/index.html',
  'companies/apex-health-ai/index.html',
  'companies/lex-veritas-legal/index.html',
  'companies/aegis-fintech/index.html',
  'companies/cloudscale-saas/index.html',
  'companies/valkyrie-defense/index.html',
  'companies/cybershield-siem/index.html',
  'companies/talenthub-hr/index.html',
  'case-studies/index.html',
  'evidentiary-sovereignty/index.html',
  'mcp/index.html',
  'benchmarks/index.html',
  'blueprints/index.html',
  'compliance/index.html',
  'ciso/memo/index.html',
  'ietf/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-01/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-02/index.html',
  '404.html'
];

// Test 1: HTML5 Document Structure & Essential Meta Tags
console.log('--> Test 1: HTML5 Document Structure & Meta Tags');
let metaChecks = 0;
for (const relPath of prodPages) {
  const fullPath = path.join(rootDir, relPath);
  assert(fs.existsSync(fullPath), `Missing production route: ${relPath}`);
  const html = fs.readFileSync(fullPath, 'utf8');

  // Title check
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch && titleMatch[1].trim().length > 5, `Missing or empty <title> in ${relPath}`);
  assert(
    titleMatch[1].includes('ZTDS') || titleMatch[1].includes('BrandMeWeb'),
    `Title in ${relPath} must include ZTDS or BrandMeWeb entity: "${titleMatch[1]}"`
  );

  // Canonical tag check
  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  assert(canonicalMatch && canonicalMatch[1].startsWith('https://ztds.ai'), `Missing or invalid canonical tag in ${relPath}`);

  // Viewport check
  assert(/<meta\s+[^>]*name=["']viewport["']/i.test(html), `Missing viewport meta in ${relPath}`);

  // OpenGraph check
  assert(/<meta\s+[^>]*property=["']og:title["']/i.test(html), `Missing og:title in ${relPath}`);
  assert(/<meta\s+[^>]*property=["']og:description["']/i.test(html), `Missing og:description in ${relPath}`);

  metaChecks++;
}
console.log(`    [PASS] All ${metaChecks} production routes have valid titles, canonicals, and OG metadata.`);

// Test 2: Zero-Emoji Compliance Audit across HTML & JSON
console.log('--> Test 2: Zero-Emoji Compliance Audit (Strict Policy)');
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const scanFiles = [
  ...prodPages,
  'data/registry.json',
  'data/companies.json',
  'data/fellows.json'
];

let emojiViolations = [];
for (const relPath of scanFiles) {
  const fullPath = path.join(rootDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (emojiRegex.test(line)) {
      emojiViolations.push({ file: relPath, line: index + 1, content: line.trim() });
    }
  });
}

assert.strictEqual(
  emojiViolations.length,
  0,
  `Detected emoji violations:\n${JSON.stringify(emojiViolations, null, 2)}`
);
console.log(`    [PASS] 0 emoji characters detected across ${scanFiles.length} production files.`);

// Test 3: Brand Spelling SSOT (BrandMeWeb - Never "Brand Me Web")
console.log('--> Test 3: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
const improperBrandRegex = /\bBrand\s+Me\s+Web\b/i;
let brandViolations = [];

for (const relPath of scanFiles) {
  const fullPath = path.join(rootDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (improperBrandRegex.test(line)) {
      brandViolations.push({ file: relPath, line: index + 1, snippet: line.trim() });
    }
  });
}

assert.strictEqual(
  brandViolations.length,
  0,
  `Detected incorrect brand spelling (must be 'BrandMeWeb'):\n${JSON.stringify(brandViolations, null, 2)}`
);
console.log(`    [PASS] 0 brand spelling defects found. "BrandMeWeb" strictly verified.`);

// Test 4: Critical Static Assets Integrity
console.log('--> Test 4: Critical Static Assets Integrity');
const criticalAssets = [
  'styles.css',
  'favicon.svg',
  'nav.js',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt'
];

for (const asset of criticalAssets) {
  const fullPath = path.join(rootDir, asset);
  assert(fs.existsSync(fullPath), `Critical static asset missing: ${asset}`);
  const stats = fs.statSync(fullPath);
  assert(stats.size > 0, `Critical asset is empty: ${asset}`);
}
console.log(`    [PASS] All ${criticalAssets.length} critical assets verified and non-empty.`);

// Test 5: Desktop Navigation & Mobile Drawer Structural Invariant
console.log('--> Test 5: Desktop Navigation & Mobile Drawer Structural Invariant');
const canonicalNavLinks = [
  '/standard/',
  '/registry/',
  '/fellows/',
  '/companies/',
  '/scanner/',
  '/sdk/',
  '/ciso/'
];

for (const relPath of prodPages) {
  const fullPath = path.join(rootDir, relPath);
  const html = fs.readFileSync(fullPath, 'utf8');

  // Verify desktop navigation 7 canonical links in exact order with whitespace-nowrap
  const desktopNavMatch = html.match(/<nav[^>]*id=["']desktop-nav["'][^>]*>([\s\S]*?)<\/nav>/i);
  if (desktopNavMatch) {
    const navContent = desktopNavMatch[1];
    const linkMatches = [...navContent.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    const hrefs = linkMatches.map(m => m[1]);

    canonicalNavLinks.forEach((expectedHref, idx) => {
      assert(
        hrefs[idx] === expectedHref,
        `Desktop nav link #${idx + 1} in ${relPath} is "${hrefs[idx]}", expected "${expectedHref}"`
      );
    });

    linkMatches.forEach((m, idx) => {
      assert(
        m[0].includes('whitespace-nowrap'),
        `Desktop nav link "${hrefs[idx]}" in ${relPath} missing "whitespace-nowrap" class`
      );
    });
  }

  // Verify mobile drawer backdrop and drawer classes + canonical links
  if (html.includes('id="mobile-drawer"')) {
    assert(
      html.includes('id="mobile-backdrop" class="mobile-nav-backdrop drawer-backdrop"'),
      `Missing #mobile-backdrop classes in ${relPath}`
    );
    assert(
      html.includes('id="mobile-drawer" class="mobile-nav-drawer drawer"'),
      `Missing #mobile-drawer classes in ${relPath}`
    );
    const mobileDrawerMatch = html.match(/<aside[^>]*id=["']mobile-drawer["'][^>]*>([\s\S]*?)<\/aside>/i);
    assert(mobileDrawerMatch, `Could not parse #mobile-drawer in ${relPath}`);
    const drawerContent = mobileDrawerMatch[1];
    canonicalNavLinks.forEach(expectedHref => {
      assert(
        drawerContent.includes(`href="${expectedHref}"`),
        `Mobile drawer in ${relPath} missing canonical link "${expectedHref}"`
      );
    });
  }
}
console.log(`    [PASS] Desktop navigation and mobile drawer structural invariant verified across all routes.`);

// Test 6: Fellow Profiles Architecture & Layout Invariant
console.log('--> Test 6: Fellow Profiles Architecture & Layout Invariant');
const fellowPages = [
  'fellows/ilya-sibiryakov/index.html',
  'fellows/cliford-fanyuy/index.html'
];

for (const relPath of fellowPages) {
  const fullPath = path.join(rootDir, relPath);
  assert(fs.existsSync(fullPath), `Fellow profile missing: ${relPath}`);
  const html = fs.readFileSync(fullPath, 'utf8');

  // Verify responsive 2-column layout grid: lg:grid-cols-3 and lg:col-span-2
  assert(
    html.includes('grid grid-cols-1 lg:grid-cols-3'),
    `Missing 3-column responsive grid container in ${relPath}`
  );
  assert(
    html.includes('lg:col-span-2'),
    `Missing lg:col-span-2 main content column in ${relPath}`
  );

  // Verify Specs Grid exists
  assert(
    html.includes('Specs Grid') || html.includes('FELLOWSHIP TIER'),
    `Missing Specs Grid in ${relPath}`
  );

  // Verify Badge section with interactive copy buttons (ztdsCopy)
  assert(
    html.includes('ztdsCopy'),
    `Missing ztdsCopy button triggers in ${relPath}`
  );
  assert(
    html.includes('Copy Markdown') && html.includes('Copy HTML'),
    `Missing Copy Markdown or Copy HTML buttons in ${relPath}`
  );

  // Verify image loading: all avatars and peer review photos must use loading="eager" (no lazy-load glitch)
  const imgMatches = [...html.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)];
  imgMatches.forEach(img => {
    const tag = img[0];
    const src = img[1];
    if (src.includes('/assets/img/')) {
      assert(
        tag.includes('loading="eager"'),
        `Avatar/photo ${src} in ${relPath} must have loading="eager", got: ${tag}`
      );
    }
  });

  // Verify institutional roles and peer review cross-links
  assert(
    html.includes('Institutional Roles'),
    `Missing Institutional Roles in ${relPath}`
  );
  assert(
    html.includes('Consortium Architecture') || html.includes('Consortium'),
    `Missing Consortium Architecture/peer section in ${relPath}`
  );
}
console.log(`    [PASS] All ${fellowPages.length} fellow profiles conform 100% to the layout & interactive architecture invariant.`);

// Test 7: Open Graph & Twitter Card Raster PNG Integrity (1200x630 Invariant)
console.log('--> Test 7: Open Graph & Twitter Card Raster PNG Integrity (1200x630 Invariant)');
assert(fs.existsSync(path.join(rootDir, 'og-image.png')), 'Missing root og-image.png');
assert(fs.existsSync(path.join(rootDir, 'public', 'og-image.png')), 'Missing public/og-image.png');

for (const relPath of prodPages) {
  const fullPath = path.join(rootDir, relPath);
  const html = fs.readFileSync(fullPath, 'utf8');

  const ogImgMatch = html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  assert(ogImgMatch, `Missing og:image in ${relPath}`);
  const ogImgUrl = ogImgMatch[1];
  assert(
    ogImgUrl.startsWith('https://ztds.ai/assets/img/og/') && ogImgUrl.endsWith('.png'),
    `og:image in ${relPath} must be a canonical raster PNG in /assets/img/og/, got: ${ogImgUrl}`
  );
  assert(
    /<meta\s+[^>]*property=["']og:image:width["'][^>]*content=["']1200["']/i.test(html),
    `Missing og:image:width="1200" in ${relPath}`
  );
  assert(
    /<meta\s+[^>]*property=["']og:image:height["'][^>]*content=["']630["']/i.test(html),
    `Missing og:image:height="630" in ${relPath}`
  );

  const twImgMatch = html.match(/<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  assert(twImgMatch && twImgMatch[1] === ogImgUrl, `Missing or mismatched twitter:image in ${relPath}`);

  const diskRel = ogImgUrl.replace('https://ztds.ai/', '');
  assert(fs.existsSync(path.join(rootDir, diskRel)), `Missing physical OG PNG file: ${diskRel}`);
  assert(fs.existsSync(path.join(rootDir, 'public', diskRel)), `Missing public mirror OG PNG file: public/${diskRel}`);
}
console.log(`    [PASS] All ${prodPages.length} production routes use verified 1200x630 raster PNG Open Graph & Twitter cards.`);

// Test 8: Typography Invariant (min 12px, self-hosted fonts, no third-party font CDN)
console.log('--> Test 8: Typography Invariant (min 12px, self-hosted fonts, no font CDN)');
const { execSync } = require('child_process');
const typoFiles = execSync('git ls-files "*.html"', { cwd: rootDir, encoding: 'utf8' }).trim().split('\n').filter(f => f && f !== 'public/logo-foundry.html');
const typoViolations = [];
for (const relPath of typoFiles) {
  const html = fs.readFileSync(path.join(rootDir, relPath), 'utf8');
  if (/text-\[(?:[0-9]|1[01])(?:\.\d+)?px\]/.test(html)) typoViolations.push(relPath + ': arbitrary text size below 12px');
  if (/font-size:\s*(?:[0-9]|1[01])(?:\.\d+)?px/.test(html)) typoViolations.push(relPath + ': inline/CSS font-size below 12px');
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) typoViolations.push(relPath + ': third-party font CDN');
}
assert.strictEqual(typoViolations.length, 0, 'Typography violations:\n' + typoViolations.join('\n'));
for (const f of ['inter-latin', 'inter-latin-ext', 'jetbrains-mono-latin', 'jetbrains-mono-latin-ext']) {
  assert(fs.existsSync(path.join(rootDir, 'assets/fonts', f + '.woff2')), 'Missing font assets/fonts/' + f + '.woff2');
  assert(fs.existsSync(path.join(rootDir, 'public/assets/fonts', f + '.woff2')), 'Missing mirror public/assets/fonts/' + f + '.woff2');
}
const builtCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
assert((builtCss.match(/@font-face/g) || []).length >= 4, 'styles.css missing self-hosted @font-face rules');
console.log('    [PASS] ' + typoFiles.length + ' pages: no text below 12px, no font CDN, local woff2 verified.');

// Test 9: Root vs. public/ Mirror Parity & Deployable Route Resolution Invariant
console.log('--> Test 9: Root vs. public/ Mirror Parity & Deployable Route Resolution Invariant');
const mirrorPairs = [
  ['assets/js/scanner-engine.js', 'public/assets/js/scanner-engine.js'],
  ['sitemap.xml', 'public/sitemap.xml'],
  ['llms.txt', 'public/llms.txt'],
  ['llms-full.txt', 'public/llms-full.txt'],
  ['robots.txt', 'public/robots.txt'],
  ['favicon.svg', 'public/favicon.svg'],
  ['og-image.png', 'public/og-image.png'],
  ['mcp_config.json', 'public/mcp_config.json'],
  ['plugin.json', 'public/plugin.json'],
  ['server-card.json', 'public/server-card.json'],
  ['server-card.json', 'public/.well-known/mcp/server-card.json'],
  ['docs/legal/order-form.html', 'public/docs/legal/order-form.html'],
  ['docs/legal/order-form/index.html', 'public/docs/legal/order-form/index.html']
];
for (const [srcRel, pubRel] of mirrorPairs) {
  const srcPath = path.join(rootDir, srcRel);
  const pubPath = path.join(rootDir, pubRel);
  assert(fs.existsSync(srcPath), `Missing root mirror source: ${srcRel}`);
  assert(fs.existsSync(pubPath), `Missing public mirror target: ${pubRel}`);
  assert(
    fs.readFileSync(srcPath).equals(fs.readFileSync(pubPath)),
    `Mirror drift detected between ${srcRel} and ${pubRel}`
  );
}
for (const relPath of typoFiles) {
  const html = fs.readFileSync(path.join(rootDir, relPath), 'utf8');
  assert(
    !html.includes('/docs/enterprise/'),
    `${relPath} references /docs/enterprise/ which is excluded by .vercelignore; use /docs/ instead`
  );
}
console.log(`    [PASS] All ${mirrorPairs.length} root-to-public mirror pairs are 100% synchronized and deployable routes verified.`);

console.log('\n[SUMMARY] ALL 9 ROUTES INTEGRITY & COMPLIANCE TESTS PASSED.');

