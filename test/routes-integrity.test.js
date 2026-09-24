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
  'apply/index.html',
  'roi/index.html',
  'security/index.html',
  'privacy/index.html',
  'terms/index.html',
  'inspector/index.html',
  'soc2/index.html',
  'deck/index.html',
  'agency/index.html',
  'fellows/peter-van-gameren/index.html',
  'fellows/ilya-sibiryakov/index.html',
  'fellows/cliford-fanyuy/index.html',
  'companies/brandmeweb/index.html',
  'companies/match2market/index.html',
  'case-studies/index.html',
  'case-studies/dutch-commercial-workflows/index.html',
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

console.log('\n[SUMMARY] ALL 4 ROUTES INTEGRITY & COMPLIANCE TESTS PASSED.');
