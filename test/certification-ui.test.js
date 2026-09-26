/**
 * ZTDS.ai — Standardization & Certification Authority UI & Artifacts Test Suite
 * 
 * Asserts the integrity of:
 * 1. /certification/index.html HTML5 document structure, meta tags, and canonical link.
 * 2. Schema.org WebPage and BreadcrumbList JSON-LD metadata.
 * 3. Institutional Authority Anchors (IETF, WIPO Patent, WIPO Trademark, CAB Governance, Security Audit).
 * 4. Desktop Navigation Invariant (7 canonical links in order with whitespace-nowrap).
 * 5. Mirroring and physical existence of all linked public/docs/ artifacts.
 * 6. Strict Zero-Emoji compliance and BrandMeWeb spelling SSOT.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Standardization & Certification Authority Test Suite...\n');

const ROOT_DIR = path.join(__dirname, '..');
const CERTIFICATION_HTML_PATH = path.join(ROOT_DIR, 'certification', 'index.html');

// Test 1: File Existence & HTML5 Document Structure
console.log('--> Test 1: File Existence & HTML5 Document Structure');
{
  assert(fs.existsSync(CERTIFICATION_HTML_PATH), 'certification/index.html must exist');
  const html = fs.readFileSync(CERTIFICATION_HTML_PATH, 'utf8');

  // Title check
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch, 'Missing <title> tag in certification/index.html');
  assert(titleMatch[1].includes('ZTDS'), 'Title must mention ZTDS');
  assert(titleMatch[1].includes('Standardization') || titleMatch[1].includes('Certification Authority'), 'Title must mention Standardization or Certification Authority');

  // Canonical check
  assert(html.includes('<link rel="canonical" href="https://ztds.ai/certification/">'), 'Must have canonical link to https://ztds.ai/certification/');

  // Viewport and OpenGraph check
  assert(html.includes('<meta name="viewport"'), 'Must have viewport meta tag');
  assert(html.includes('property="og:title"'), 'Must have og:title meta tag');
  assert(html.includes('property="og:description"'), 'Must have og:description meta tag');
  assert(html.includes('property="og:url" content="https://ztds.ai/certification/"'), 'Must have og:url meta tag pointing to /certification/');

  console.log('    [PASS] HTML5 structure, title, canonical, and OG tags validated.');
}

// Test 2: Schema.org WebPage & BreadcrumbList Validation
console.log('\n--> Test 2: Schema.org WebPage & BreadcrumbList Validation');
{
  const html = fs.readFileSync(CERTIFICATION_HTML_PATH, 'utf8');
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const match = schemaRegex.exec(html);
  assert(match, 'Missing JSON-LD block in certification/index.html');

  const schema = JSON.parse(match[1]);
  assert.strictEqual(schema['@context'], 'https://schema.org', 'Schema @context must be https://schema.org');
  assert(Array.isArray(schema['@graph']), 'Schema must have @graph array');

  const webPage = schema['@graph'].find(item => item['@type'] === 'WebPage');
  assert(webPage, 'Missing WebPage entity in Schema.org graph');
  assert.strictEqual(webPage.url, 'https://ztds.ai/certification/');
  assert.strictEqual(webPage['@id'], 'https://ztds.ai/certification/#page');

  const breadcrumbs = schema['@graph'].find(item => item['@type'] === 'BreadcrumbList');
  assert(breadcrumbs, 'Missing BreadcrumbList in Schema.org graph');
  assert.strictEqual(breadcrumbs.itemListElement.length, 2);
  assert.strictEqual(breadcrumbs.itemListElement[0].name, 'Home');
  assert.strictEqual(breadcrumbs.itemListElement[1].name, 'Standardization & Certification');
  assert.strictEqual(breadcrumbs.itemListElement[1].item, 'https://ztds.ai/certification/');

  console.log('    [PASS] Schema.org WebPage and BreadcrumbList validated.');
}

// Test 3: Institutional Authority Anchors & Key Content
console.log('\n--> Test 3: Institutional Authority Anchors & Key Content');
{
  const html = fs.readFileSync(CERTIFICATION_HTML_PATH, 'utf8');

  // IETF Internet-Draft
  assert(html.includes('draft-sibiryakov-ztds-protocol-02'), 'Must reference IETF Internet-Draft identifier');
  assert(html.includes('/docs/ietf/draft-sibiryakov-ztds-protocol-02.txt'), 'Must link to IETF txt artifact');
  assert(html.includes('/docs/ietf/draft-sibiryakov-ztds-protocol-02.xml'), 'Must link to IETF xml artifact');
  assert(html.includes('https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/'), 'Must link to live IETF Datatracker');

  // WIPO Patent Anchor
  assert(html.includes('IL 331905'), 'Must reference Israel Patent Application IL 331905');
  assert(html.includes('B17B'), 'Must reference WIPO DAS Access Code B17B');
  assert(html.includes('14/09/2026'), 'Must reference patent filing date');
  assert(html.includes('14/09/2027'), 'Must reference patent international priority deadline');
  assert(html.includes('/docs/legal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.txt'), 'Must link to WIPO PCT claims document');

  // WIPO Trademark & Certification Mark Anchor
  assert(html.includes('182655957'), 'Must reference ILPO Trademark Order #182655957');
  assert(html.includes('20/09/2026'), 'Must reference trademark filing date');
  assert(html.includes('20/03/2027'), 'Must reference trademark Paris priority deadline');
  assert(html.includes('Classes 9 &amp; 42') || html.includes('Classes 9 & 42'), 'Must reference Nice Classes 9 & 42');
  assert(html.includes('/docs/legal/WIPO_MADRID_TRADEMARK_FILING_DOSSIER.txt'), 'Must link to Madrid filing dossier');

  // Conformity Assessment Body (CAB) Governance
  assert(html.includes('Conformity Assessment Body') || html.includes('CAB Governance'), 'Must describe CAB Governance');
  assert(html.includes('Track A') && html.includes('Track B') && html.includes('Track C'), 'Must detail Tracks A, B, and C');
  assert(html.includes('24-Hour Emergency Zero-Day Revocation') || html.includes('24-Hour Zero-Day Revocation') || html.includes('24 hours'), 'Must specify emergency revocation protocol');
  assert(html.includes('/docs/legal/ZTDS_Conformity_Assessment_Policy.txt'), 'Must link to CAB conformity assessment policy');

  // Independent Security Audit
  assert(html.includes('Independent Security Audit') || html.includes('Clean Bill of Health'), 'Must reference Independent Security Audit');
  assert(html.includes('0 Critical') || html.includes('Zero Critical'), 'Must cite 0 Critical findings');
  assert(html.includes('0 High') || html.includes('Zero High'), 'Must cite 0 High findings');
  assert(html.includes('/docs/security/ZTDS_Independent_Security_Audit_Report.txt'), 'Must link to Security Audit Report');

  // Four Foundational Invariants
  assert(html.includes('Invariant 1') && html.includes('Zero External Egress'), 'Must detail Invariant 1');
  assert(html.includes('Invariant 2') && html.includes('Reversible Tokenization'), 'Must detail Invariant 2');
  assert(html.includes('Invariant 3') && html.includes('Volatile RAM Isolation'), 'Must detail Invariant 3');
  assert(html.includes('Invariant 4') && html.includes('Zero Subprocessors'), 'Must detail Invariant 4');

  // Interactive Tools & Actions
  assert(html.includes('/verify/'), 'Must link to online certificate validator');
  assert(html.includes('/scanner/'), 'Must link to CLI scanner');
  assert(html.includes('/registry/'), 'Must link to certified registry');
  assert(html.includes('/apply/'), 'Must link to accreditation gateway');

  console.log('    [PASS] IETF draft, WIPO patent, WIPO trademark, CAB governance, audit report, and 4 invariants validated.');
}

// Test 4: Desktop Navigation Invariant (7 Canonical Links)
console.log('\n--> Test 4: Desktop Navigation Invariant (7 Canonical Links)');
{
  const html = fs.readFileSync(CERTIFICATION_HTML_PATH, 'utf8');
  const navMatch = html.match(/<nav[^>]*id="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/i);
  assert(navMatch, 'Missing #desktop-nav in certification/index.html');

  const navContent = navMatch[1];
  const linkMatches = [...navContent.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  assert.strictEqual(linkMatches.length, 7, 'Desktop navigation must contain exactly 7 links');

  const expectedLinks = [
    { href: '/standard/', label: 'Standard' },
    { href: '/registry/', label: 'Registry' },
    { href: '/fellows/', label: 'Fellows' },
    { href: '/companies/', label: 'Adopters' },
    { href: '/scanner/', label: 'Scanner' },
    { href: '/sdk/', label: 'SDK & Connectors' },
    { href: '/ciso/', label: 'CISO & Trust' }
  ];

  expectedLinks.forEach((expected, idx) => {
    const actual = linkMatches[idx];
    assert.strictEqual(actual[1], expected.href, `Nav link ${idx + 1} href must be ${expected.href}, got ${actual[1]}`);
    assert(actual[0].includes('whitespace-nowrap'), `Nav link ${expected.href} must have whitespace-nowrap class`);
  });

  console.log('    [PASS] Exactly 7 canonical desktop navigation links verified in strict order.');
}

// Test 5: Static Documentation Artifacts Physical Existence
console.log('\n--> Test 5: Static Documentation Artifacts Physical Existence');
{
  const requiredArtifacts = [
    'docs/ietf/draft-sibiryakov-ztds-protocol-00.txt',
    'public/docs/ietf/draft-sibiryakov-ztds-protocol-00.txt',
    'docs/ietf/draft-sibiryakov-ztds-protocol-00.xml',
    'public/docs/ietf/draft-sibiryakov-ztds-protocol-00.xml',
    'docs/legal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.txt',
    'public/docs/legal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.txt',
    'docs/legal/WIPO_MADRID_TRADEMARK_FILING_DOSSIER.txt',
    'public/docs/legal/WIPO_MADRID_TRADEMARK_FILING_DOSSIER.txt',
    'docs/legal/WIPO_IP_PORTFOLIO_AND_CALENDAR_SSOT.txt',
    'public/docs/legal/WIPO_IP_PORTFOLIO_AND_CALENDAR_SSOT.txt',
    'docs/legal/ZTDS_Conformity_Assessment_Policy.txt',
    'public/docs/legal/ZTDS_Conformity_Assessment_Policy.txt',
    'docs/security/ZTDS_Independent_Security_Audit_Report.txt',
    'public/docs/security/ZTDS_Independent_Security_Audit_Report.txt',
    'docs/security/ZTDS_Third_Party_Security_Audit_Specification.txt',
    'public/docs/security/ZTDS_Third_Party_Security_Audit_Specification.txt'
  ];

  requiredArtifacts.forEach(relPath => {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert(fs.existsSync(fullPath), `Artifact missing from disk: ${relPath}`);
    const stats = fs.statSync(fullPath);
    assert(stats.size > 100, `Artifact appears empty (<100 bytes): ${relPath}`);
  });

  console.log(`    [PASS] All ${requiredArtifacts.length} required documentation artifacts exist in root and public mirrors.`);
}

// Test 6: Zero-Emoji Compliance & BrandMeWeb Spelling SSOT
console.log('\n--> Test 6: Zero-Emoji Compliance & BrandMeWeb Spelling SSOT');
{
  const html = fs.readFileSync(CERTIFICATION_HTML_PATH, 'utf8');

  // Zero Emoji check
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(html), 'Zero-emoji policy violated in certification/index.html');

  // BrandMeWeb spelling check (never "Brand Me Web")
  const improperBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  assert(!improperBrandRegex.test(html), 'BrandMeWeb must be spelled as a single word in certification/index.html');

  console.log('    [PASS] Zero emojis and BrandMeWeb spelling verified.');
}

console.log('\n[PASS] All 6 Standardization & Certification Authority Tests Passed Successfully!\n');
