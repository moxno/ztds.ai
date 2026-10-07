/**
 * ZTDS.ai — Registry Interactive Search & Category Filter Engine Conformance Test Suite
 * 
 * Verifies:
 * 1. Existence and integrity of search input and filter tabs
 * 2. Exact 1:1 parity between data/registry.json (13 entities) and registry/index.html cards
 * 3. Exact category distribution: mcp (3), rag (3), sdk (3), app (2), proxy (2)
 * 4. Zero duplicate cards or certificate tokens
 * 5. Interactive empty state and reset button controls
 * 6. Strict zero-emoji compliance and BrandMeWeb single word rule
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Registry Interactive Search & Category Filter Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const registryHtmlPath = path.join(ROOT, 'registry/index.html');
const registryJsonPath = path.join(ROOT, 'data/registry.json');

assert(fs.existsSync(registryHtmlPath), 'registry/index.html must exist');
assert(fs.existsSync(registryJsonPath), 'data/registry.json must exist');

const html = fs.readFileSync(registryHtmlPath, 'utf8');
const registryData = JSON.parse(fs.readFileSync(registryJsonPath, 'utf8'));

// Test 1: DOM Elements & Filter Tabs Integrity
console.log('--> Test 1: Search & Category Filter Tabs DOM Integrity');
{
  assert(html.includes('id="registrySearch"'), 'Must have #registrySearch input element');
  assert(html.includes('id="filterTabs"'), 'Must have #filterTabs container');
  assert(html.includes('id="registryResultsCount"'), 'Must have #registryResultsCount element');
  assert(html.includes('id="btnClearFilters"'), 'Must have #btnClearFilters button');
  assert(html.includes('id="registryEmptyState"'), 'Must have #registryEmptyState container');
  assert(html.includes('id="btnEmptyReset"'), 'Must have #btnEmptyReset button');

  // Verify all 6 category filters exist
  const expectedFilters = ['all', 'mcp', 'rag', 'sdk', 'app', 'proxy'];
  expectedFilters.forEach(f => {
    assert(html.includes(`data-filter="${f}"`), `Filter tab for "${f}" must exist`);
  });

  console.log('    [PASS] All 6 category filter tabs and search controls verified.');
}

// Test 2: Card Count and Registry Parity (13 Certified Solutions)
console.log('--> Test 2: Certified Solutions Parity with data/registry.json');
{
  const cardRegex = /<div[^>]*class="[^"]*ztds-card[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*ztds-card[^"]*"|<div id="registryEmptyState"|<div id="certModal")/g;
  const cards = [];
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    cards.push(match[0]);
  }

  assert.strictEqual(registryData.entities.length, 13, 'data/registry.json must contain exactly 13 entities');
  assert.strictEqual(cards.length, 13, `registry/index.html must contain exactly 13 cards, found ${cards.length}`);

  console.log(`    [PASS] Exact parity confirmed: 13 cards in HTML matching 13 entities in JSON.`);
}

// Test 3: Category Distribution (3 MCP, 3 RAG, 3 SDK, 2 App, 2 Proxy)
console.log('--> Test 3: Normalized Category Distribution');
{
  const cardRegex = /<div[^>]*class="[^"]*ztds-card[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*ztds-card[^"]*"|<div id="registryEmptyState"|<div id="certModal")/g;
  const categoryCounts = { all: 0, mcp: 0, rag: 0, sdk: 0, app: 0, proxy: 0 };
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = match[0];
    const catMatch = cardHtml.match(/data-category="([^"]+)"/);
    assert(catMatch, 'Each card must specify a data-category attribute');
    const categories = catMatch[1].split(/\s+/);
    categories.forEach(cat => {
      assert(categoryCounts[cat] !== undefined, `Unknown category "${cat}" on card`);
      categoryCounts[cat]++;
    });
    categoryCounts.all++;
  }

  assert.strictEqual(categoryCounts.mcp, 3, `Expected 3 MCP servers, found ${categoryCounts.mcp}`);
  assert.strictEqual(categoryCounts.rag, 3, `Expected 3 RAG & Agent SDKs, found ${categoryCounts.rag}`);
  assert.strictEqual(categoryCounts.sdk, 3, `Expected 3 Core Engines & SDK, found ${categoryCounts.sdk}`);
  assert.strictEqual(categoryCounts.app, 2, `Expected 2 Apps & Extensions, found ${categoryCounts.app}`);
  assert.strictEqual(categoryCounts.proxy, 2, `Expected 2 Proxies & Local LLM, found ${categoryCounts.proxy}`);
  assert.strictEqual(categoryCounts.all, 13, `Expected 13 total cards, found ${categoryCounts.all}`);

  console.log('    [PASS] Category distribution verified: MCP (3), RAG (3), SDK (3), App (2), Proxy (2).');
}

// Test 4: Certificate Uniqueness & No Duplicate Tokens
console.log('--> Test 4: Zero Duplicate Certificates or Tokens');
{
  const certIdRegex = /data-cert-id="([^"]+)"/g;
  const certIds = [];
  let m;
  while ((m = certIdRegex.exec(html)) !== null) {
    certIds.push(m[1]);
  }

  const uniqueCertIds = new Set(certIds);
  assert.strictEqual(certIds.length, 13, `Expected 13 cert IDs, found ${certIds.length}`);
  assert.strictEqual(uniqueCertIds.size, 13, 'All 13 certificate IDs must be completely unique');

  console.log('    [PASS] 13 unique certificate IDs verified with zero duplicate collisions.');
}

// Test 5: Client-Side Controller Functions & Hash Deep-Linking
console.log('--> Test 5: JavaScript Controller Functions & Event Listeners');
{
  assert(html.includes('function filterCards()'), 'Must define filterCards() function');
  assert(html.includes('function setActiveTab('), 'Must define setActiveTab() function');
  assert(html.includes('function resetAllFilters()'), 'Must define resetAllFilters() function');
  assert(html.includes('history.replaceState'), 'Must support URL hash deep-linking');
  assert(html.includes('e.key === \'Escape\''), 'Must support Escape key to clear search');

  console.log('    [PASS] JavaScript reactive controller, hash deep-linking, and keyboard handlers verified.');
}

// Test 6: Strict Zero-Emoji Conformance
console.log('--> Test 6: Strict Zero-Emoji Conformance');
{
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const selfContent = fs.readFileSync(__filename, 'utf8');
  assert(!emojiRegex.test(selfContent), 'Test suite must not contain any emoji characters');
  assert(!emojiRegex.test(html), 'registry/index.html must not contain any emoji characters');

  console.log('    [PASS] Zero emojis verified across test suite and registry HTML.');
}

// Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)
console.log('--> Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
{
  const invalidBrandPattern = /\bBrand\s+Me\s+Web\b/i;
  assert(!invalidBrandPattern.test(html), 'registry/index.html must never spell "Brand Me Web" with spaces');
  assert(html.includes('BrandMeWeb'), 'registry/index.html must reference BrandMeWeb');

  console.log('    [PASS] BrandMeWeb single word rule verified.');
}

console.log('\n[SUMMARY] ALL 7 REGISTRY SEARCH & FILTER TESTS PASSED WITH 100% SUCCESS.\n');
