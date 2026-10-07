/**
 * ZTDS.ai — Corporate Adopters & Case Studies Interactive Search & Filter Test Suite
 * 
 * Verifies:
 * 1. Existence and integrity of search input and industry filter tabs
 * 2. Exact 1:1 parity between data/companies.json (9 entities) and companies/index.html cards
 * 3. Exact industry distribution across all 9 sectors
 * 4. Zero duplicate company cards or slug collisions
 * 5. Interactive empty state and reset button controls
 * 6. Client-side reactive controller functions and hash deep-linking
 * 7. Strict zero-emoji compliance and BrandMeWeb single word rule
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Companies Interactive Search & Filter Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const companiesHtmlPath = path.join(ROOT, 'companies/index.html');
const companiesJsonPath = path.join(ROOT, 'data/companies.json');

assert(fs.existsSync(companiesHtmlPath), 'companies/index.html must exist');
assert(fs.existsSync(companiesJsonPath), 'data/companies.json must exist');

const html = fs.readFileSync(companiesHtmlPath, 'utf8');
const companiesData = JSON.parse(fs.readFileSync(companiesJsonPath, 'utf8'));

// Test 1: DOM Elements & Industry Filter Tabs Integrity
console.log('--> Test 1: Search & Industry Filter Tabs DOM Integrity');
{
  assert(html.includes('id="companySearch"'), 'Must have #companySearch input element');
  assert(html.includes('id="companyFilterTabs"'), 'Must have #companyFilterTabs container');
  assert(html.includes('id="companyResultsCount"'), 'Must have #companyResultsCount element');
  assert(html.includes('id="btnClearCompanyFilters"'), 'Must have #btnClearCompanyFilters button');
  assert(html.includes('id="companyEmptyState"'), 'Must have #companyEmptyState container');
  assert(html.includes('id="btnEmptyCompanyReset"'), 'Must have #btnEmptyCompanyReset button');

  // Verify all 10 filter tabs exist
  const expectedFilters = [
    'all',
    'healthcare',
    'fintech',
    'legal',
    'saas',
    'defense',
    'cyber',
    'hr',
    'agency',
    'privacy'
  ];
  expectedFilters.forEach(f => {
    assert(html.includes(`data-filter="${f}"`), `Filter tab for "${f}" must exist`);
  });

  console.log('    [PASS] All 10 industry filter tabs and search controls verified.');
}

// Test 2: Corporate Adopter Count and JSON Parity (9 Verified Companies + 1 Open Seat)
console.log('--> Test 2: Corporate Adopter Parity with data/companies.json');
{
  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-industry="([^"]+)"[^>]*>/g;
  const cards = [];
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    cards.push({ id: match[1], industry: match[2] });
  }

  assert.strictEqual(companiesData.companies.length, 9, 'data/companies.json must contain exactly 9 companies');
  assert.strictEqual(cards.length, 10, `companies/index.html must contain exactly 10 cards (9 verified + 1 open seat), found ${cards.length}`);

  const verifiedCards = cards.filter(c => c.id !== 'open-company-card');
  assert.strictEqual(verifiedCards.length, 9, 'Must have exactly 9 verified company cards');

  // Verify every company in data/companies.json has a matching card in HTML
  companiesData.companies.forEach(company => {
    const found = verifiedCards.find(c => c.id === company.slug);
    assert(found, `Company "${company.slug}" from data/companies.json must exist in companies/index.html`);
  });

  console.log('    [PASS] Exact parity confirmed: 9 verified companies matching data/companies.json + 1 open seat.');
}

// Test 3: Industry Sector Distribution
console.log('--> Test 3: Industry Sector Distribution');
{
  const industryCounts = {
    agency: 0,
    privacy: 0,
    healthcare: 0,
    legal: 0,
    fintech: 0,
    saas: 0,
    defense: 0,
    cyber: 0,
    hr: 0
  };

  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-industry="([^"]+)"[^>]*>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const id = match[1];
    const ind = match[2];
    if (id !== 'open-company-card') {
      assert(industryCounts[ind] !== undefined, `Unknown industry "${ind}" on card "${id}"`);
      industryCounts[ind]++;
    }
  }

  assert.strictEqual(industryCounts.agency, 1, 'Expected 1 Agency & GEO member (BrandMeWeb)');
  assert.strictEqual(industryCounts.privacy, 1, 'Expected 1 Zero-Server Privacy member (PrivacyScrubber)');
  assert.strictEqual(industryCounts.healthcare, 1, 'Expected 1 Clinical Healthcare member (Apex Health AI)');
  assert.strictEqual(industryCounts.legal, 1, 'Expected 1 Corporate Law member (Lex Veritas Legal)');
  assert.strictEqual(industryCounts.fintech, 1, 'Expected 1 Banking & FinTech member (Aegis FinTech)');
  assert.strictEqual(industryCounts.saas, 1, 'Expected 1 Enterprise SaaS member (CloudScale SaaS)');
  assert.strictEqual(industryCounts.defense, 1, 'Expected 1 Defense & Sovereign Enclaves member (Valkyrie Defense)');
  assert.strictEqual(industryCounts.cyber, 1, 'Expected 1 Cybersecurity & SIEM member (CyberShield SIEM)');
  assert.strictEqual(industryCounts.hr, 1, 'Expected 1 Human Resources member (TalentHub HR)');

  console.log('    [PASS] Industry distribution verified across all 9 sectors.');
}

// Test 4: Card ID and Slug Uniqueness
console.log('--> Test 4: Zero Duplicate IDs or Slugs');
{
  const cardRegex = /<article[^>]*id="([^"]+)"[^>]*data-industry="([^"]+)"[^>]*>/g;
  const ids = [];
  let m;
  while ((m = cardRegex.exec(html)) !== null) {
    ids.push(m[1]);
  }

  const uniqueIds = new Set(ids);
  assert.strictEqual(ids.length, 10, `Expected 10 total cards, found ${ids.length}`);
  assert.strictEqual(uniqueIds.size, 10, 'All 10 card IDs must be completely unique');

  console.log('    [PASS] 10 unique article card IDs verified with zero collisions.');
}

// Test 5: Client-Side Controller Functions & Hash Deep-Linking
console.log('--> Test 5: JavaScript Controller Functions & Event Listeners');
{
  assert(html.includes('function filterCompanies()'), 'Must define filterCompanies() function');
  assert(html.includes('function setActiveCompanyTab('), 'Must define setActiveCompanyTab() function');
  assert(html.includes('function resetAllCompanyFilters()'), 'Must define resetAllCompanyFilters() function');
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
  assert(!emojiRegex.test(html), 'companies/index.html must not contain any emoji characters');

  console.log('    [PASS] Zero emojis verified across test suite and companies HTML.');
}

// Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)
console.log('--> Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
{
  const invalidBrandPattern = /\bBrand\s+Me\s+Web\b/i;
  assert(!invalidBrandPattern.test(html), 'companies/index.html must never spell "Brand Me Web" with spaces');
  assert(html.includes('BrandMeWeb'), 'companies/index.html must reference BrandMeWeb');

  console.log('    [PASS] BrandMeWeb single word rule verified.');
}

console.log('\n[SUMMARY] ALL 7 COMPANIES SEARCH & FILTER TESTS PASSED WITH 100% SUCCESS.\n');
