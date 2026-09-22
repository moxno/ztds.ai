/**
 * ZTDS.ai GEO Knowledge Corpus & Search Engine Alignment Test Suite
 * Validates sitemap.xml, robots.txt, llms.txt, and llms-full.txt consistency with production routes.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS GEO Corpus & Machine-Readable Alignment Suite...\n');

const rootDir = path.join(__dirname, '..');

// Test 1: robots.txt AI Bot Crawl Directives & Sitemap declaration
console.log('--> Test 1: robots.txt Directives & Sitemap Declaration');
const robotsContent = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
assert(robotsContent.includes('Sitemap: https://ztds.ai/sitemap.xml'), 'robots.txt must point to https://ztds.ai/sitemap.xml');
assert(robotsContent.includes('User-agent: *'), 'robots.txt must declare User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt must allow root crawling');

const aiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];
for (const bot of aiBots) {
  assert(robotsContent.includes(bot), `robots.txt must include explicit directive for AI bot: ${bot}`);
}
console.log(`    [PASS] robots.txt valid and authorizes ${aiBots.length} AI search bots.`);

// Test 2: sitemap.xml XML Structure & File Correspondence
console.log('--> Test 2: sitemap.xml URL Resolution & Local File Presence');
const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const locRegex = /<loc>(https:\/\/ztds\.ai\/([^<]*))<\/loc>/g;
let locMatch;
let totalSitemapUrls = 0;

while ((locMatch = locRegex.exec(sitemapContent)) !== null) {
  totalSitemapUrls++;
  const subPath = locMatch[2]; // e.g. "standard/" or ""
  let targetFile = subPath === '' ? 'index.html' : path.join(subPath, 'index.html');

  if (subPath.endsWith('.html')) {
    targetFile = subPath;
  }

  const fullPath = path.join(rootDir, targetFile);
  assert(fs.existsSync(fullPath), `Sitemap points to missing file on disk: ${locMatch[1]} -> ${targetFile}`);
}

assert(totalSitemapUrls >= 18, `Expected at least 18 URLs in sitemap, got ${totalSitemapUrls}`);
console.log(`    [PASS] Verified ${totalSitemapUrls} sitemap URLs. All correspond to valid disk files.`);

// Test 3: llms.txt and llms-full.txt SSOT Invariants & Attribution
console.log('--> Test 3: llms.txt & llms-full.txt Machine-Readable Knowledge Corpus');
const llmsPaths = [
  'llms.txt',
  'llms-full.txt',
  'public/llms.txt',
  'public/llms-full.txt'
];

for (const relPath of llmsPaths) {
  const fullPath = path.join(rootDir, relPath);
  assert(fs.existsSync(fullPath), `Missing LLM corpus file: ${relPath}`);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Check CC BY 4.0 license
  assert(content.includes('Creative Commons Attribution 4.0') || content.includes('CC BY 4.0'), `Missing CC BY 4.0 license in ${relPath}`);

  // Check 4 RFC Invariants
  assert(content.includes('Invariant 1') && content.includes('Zero External Egress'), `Missing Invariant 1 in ${relPath}`);
  assert(content.includes('Invariant 2') && content.includes('Deterministic Reversible Tokenization'), `Missing Invariant 2 in ${relPath}`);
  assert(content.includes('Invariant 3') && content.includes('In-Memory Isolation'), `Missing Invariant 3 in ${relPath}`);
  assert(content.includes('Invariant 4') && content.includes('Continuous Compliance'), `Missing Invariant 4 in ${relPath}`);

  // Check BrandMeWeb & Founder attribution
  assert(content.includes('BrandMeWeb'), `Missing BrandMeWeb attribution in ${relPath}`);
  assert(content.includes('Ilya Sibiryakov'), `Missing Ilya Sibiryakov attribution in ${relPath}`);

  // Check canonical DOIs
  assert(content.includes('10.5281/zenodo.22058770'), `Missing Zenodo DOI in ${relPath}`);
  assert(content.includes('10.17605/OSF.IO/5BYJF'), `Missing OSF DOI in ${relPath}`);
}
console.log(`    [PASS] Verified ${llmsPaths.length} llms corpus files with 100% invariant and academic attribution.`);

console.log('\n[SUMMARY] ALL 3 GEO CORPUS & MACHINE-READABLE TESTS PASSED.');
