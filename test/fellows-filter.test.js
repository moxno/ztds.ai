/**
 * ZTDS.ai — Research Fellows & Working Groups Interactive Search & Filter Test Suite
 * 
 * Verifies:
 * 1. Existence and integrity of search input and fellowship track filter tabs
 * 2. Exact 1:1 parity between data/fellows.json (6 entities) and fellows/index.html cards
 * 3. Exact track distribution across all 5 Working Groups / Council Tracks
 * 4. Zero duplicate fellow cards or slug collisions
 * 5. Interactive empty state and reset button controls
 * 6. Client-side reactive controller functions and hash deep-linking
 * 7. Strict zero-emoji compliance and BrandMeWeb single word rule
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Fellows Interactive Search & Filter Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const fellowsHtmlPath = path.join(ROOT, 'fellows/index.html');
const fellowsJsonPath = path.join(ROOT, 'data/fellows.json');

assert(fs.existsSync(fellowsHtmlPath), 'fellows/index.html must exist');
assert(fs.existsSync(fellowsJsonPath), 'data/fellows.json must exist');

const html = fs.readFileSync(fellowsHtmlPath, 'utf8');
const fellowsData = JSON.parse(fs.readFileSync(fellowsJsonPath, 'utf8'));

// Test 1: DOM Elements & Track Filter Tabs Integrity
console.log('--> Test 1: Search & Track Filter Tabs DOM Integrity');
{
  assert(html.includes('id="fellowSearch"'), 'Must have #fellowSearch input element');
  assert(html.includes('id="fellowFilterTabs"'), 'Must have #fellowFilterTabs container');
  assert(html.includes('id="fellowResultsCount"'), 'Must have #fellowResultsCount element');
  assert(html.includes('id="btnClearFellowFilters"'), 'Must have #btnClearFellowFilters button');
  assert(html.includes('id="fellowEmptyState"'), 'Must have #fellowEmptyState container');
  assert(html.includes('id="btnEmptyFellowReset"'), 'Must have #btnEmptyFellowReset button');

  // Verify all 6 filter tabs exist
  const expectedFilters = [
    'all',
    'governance',
    'crypto',
    'grc',
    'systems',
    'profiles'
  ];
  expectedFilters.forEach(f => {
    assert(html.includes(`data-filter="${f}"`), `Filter tab for "${f}" must exist`);
  });

  console.log('    [PASS] All 6 track filter tabs and search controls verified.');
}

// Test 2: Fellows & Working Groups Parity with data/fellows.json (6 Verified + 1 Open Seat)
console.log('--> Test 2: Fellows Parity with data/fellows.json');
{
  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-track="([^"]+)"[^>]*>/g;
  const cards = [];
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    cards.push({ id: match[1], track: match[2] });
  }

  assert.strictEqual(fellowsData.fellows.length, 6, 'data/fellows.json must contain exactly 6 fellows/WGs');
  assert.strictEqual(cards.length, 7, `fellows/index.html must contain exactly 7 cards (6 verified + 1 open seat), found ${cards.length}`);

  const verifiedCards = cards.filter(c => c.id !== 'open-fellow-seat');
  assert.strictEqual(verifiedCards.length, 6, 'Must have exactly 6 verified fellow cards');

  // Verify every fellow in data/fellows.json has a matching card in HTML
  fellowsData.fellows.forEach(fellow => {
    const found = verifiedCards.find(c => c.id === fellow.slug);
    assert(found, `Fellow "${fellow.slug}" from data/fellows.json must exist in fellows/index.html`);
  });

  console.log('    [PASS] Exact parity confirmed: 6 verified fellows matching data/fellows.json + 1 open seat.');
}

// Test 3: Fellowship Track Distribution
console.log('--> Test 3: Fellowship Track Distribution');
{
  const trackCounts = {
    governance: 0,
    crypto: 0,
    grc: 0,
    systems: 0,
    profiles: 0
  };

  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-track="([^"]+)"[^>]*>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const id = match[1];
    const tracks = match[2].split(/\s+/);
    if (id !== 'open-fellow-seat') {
      tracks.forEach(t => {
        assert(trackCounts[t] !== undefined, `Unknown track "${t}" on card "${id}"`);
        trackCounts[t]++;
      });
    }
  }

  assert.strictEqual(trackCounts.governance, 1, 'Expected 1 Architecture & Governance fellow (Ilya Sibiryakov)');
  assert.strictEqual(trackCounts.crypto, 2, 'Expected 2 Cryptography members (Cliford Fanyuy + WG-1 Cryptography)');
  assert.strictEqual(trackCounts.grc, 1, 'Expected 1 Legal & GRC member (WG-2 Legal & GRC)');
  assert.strictEqual(trackCounts.systems, 2, 'Expected 2 Systems & WASM members (Cliford Fanyuy + WG-3 Systems)');
  assert.strictEqual(trackCounts.profiles, 1, 'Expected 1 Industry Taxonomy member (WG-4 Industry Taxonomy)');

  console.log('    [PASS] Track distribution verified: Governance (1), Crypto (2), GRC (1), Systems (2), Profiles (1).');
}

// Test 4: Card ID and Slug Uniqueness
console.log('--> Test 4: Zero Duplicate IDs or Slugs');
{
  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-track="([^"]+)"[^>]*>/g;
  const ids = [];
  let m;
  while ((m = cardRegex.exec(html)) !== null) {
    ids.push(m[1]);
  }

  const uniqueIds = new Set(ids);
  assert.strictEqual(ids.length, 7, `Expected 7 total cards, found ${ids.length}`);
  assert.strictEqual(uniqueIds.size, 7, 'All 7 card IDs must be completely unique');

  console.log('    [PASS] 7 unique article card IDs verified with zero collisions.');
}

// Test 5: Client-Side Controller Functions & Hash Deep-Linking
console.log('--> Test 5: JavaScript Controller Functions & Event Listeners');
{
  assert(html.includes('function filterFellows()'), 'Must define filterFellows() function');
  assert(html.includes('function setActiveFellowTab('), 'Must define setActiveFellowTab() function');
  assert(html.includes('function resetAllFellowFilters()'), 'Must define resetAllFellowFilters() function');
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
  assert(!emojiRegex.test(html), 'fellows/index.html must not contain any emoji characters');

  console.log('    [PASS] Zero emojis verified across test suite and fellows HTML.');
}

// Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)
console.log('--> Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
{
  const invalidBrandPattern = /\bBrand\s+Me\s+Web\b/i;
  assert(!invalidBrandPattern.test(html), 'fellows/index.html must never spell "Brand Me Web" with spaces');
  assert(html.includes('BrandMeWeb'), 'fellows/index.html must reference BrandMeWeb');

  console.log('    [PASS] BrandMeWeb single word rule verified.');
}

console.log('\n[SUMMARY] ALL 7 FELLOWS SEARCH & FILTER TESTS PASSED WITH 100% SUCCESS.\n');
