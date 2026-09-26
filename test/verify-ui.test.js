/**
 * ZTDS.ai — Certificate Validator UI & Cryptographic Verification Test Suite
 * 
 * Asserts the integrity of:
 * 1. /verify/index.html HTML5 document structure, meta tags, and canonical link.
 * 2. Schema.org WebApplication and BreadcrumbList JSON-LD metadata.
 * 3. Interactive Workbench DOM IDs and responsive layout elements.
 * 4. Preset sample tokens (Authentic, Tampered, Expired) cryptographically verified.
 * 5. Strict Zero-Emoji compliance and BrandMeWeb spelling SSOT.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { verifyCertificate, CertificateTamperedError, CertificateExpiredError } = require('../lib/certificate-manager');
const { canonicalizeJson } = require('../lib/license-validator');

console.log('[TEST] Starting ZTDS Certificate Validator UI & Cryptographic Test Suite...\n');

const VERIFY_HTML_PATH = path.join(__dirname, '..', 'verify', 'index.html');

// Test 1: File Existence & HTML5 Document Structure
console.log('--> Test 1: File Existence & HTML5 Document Structure');
{
  assert(fs.existsSync(VERIFY_HTML_PATH), 'verify/index.html must exist');
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');

  // Title check
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch, 'Missing <title> tag in verify/index.html');
  assert(titleMatch[1].includes('ZTDS'), 'Title must mention ZTDS');
  assert(titleMatch[1].includes('Validator') || titleMatch[1].includes('Certificate'), 'Title must mention Validator or Certificate');

  // Canonical check
  assert(html.includes('<link rel="canonical" href="https://ztds.ai/verify/">'), 'Must have canonical link to https://ztds.ai/verify/');

  // Viewport and OpenGraph check
  assert(html.includes('<meta name="viewport"'), 'Must have viewport meta tag');
  assert(html.includes('property="og:title"'), 'Must have og:title meta tag');
  assert(html.includes('property="og:description"'), 'Must have og:description meta tag');

  console.log('    [PASS] HTML5 structure, title, canonical, and OG tags validated.');
}

// Test 2: Schema.org WebApplication & BreadcrumbList Validation
console.log('\n--> Test 2: Schema.org WebApplication & BreadcrumbList Validation');
{
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const match = schemaRegex.exec(html);
  assert(match, 'Missing JSON-LD block in verify/index.html');

  const schema = JSON.parse(match[1]);
  assert.strictEqual(schema['@context'], 'https://schema.org', 'Schema @context must be https://schema.org');
  assert(Array.isArray(schema['@graph']), 'Schema must have @graph array');

  const webApp = schema['@graph'].find(item => item['@type'] === 'WebApplication');
  assert(webApp, 'Missing WebApplication entity in Schema.org graph');
  assert.strictEqual(webApp.url, 'https://ztds.ai/verify/');

  const breadcrumbs = schema['@graph'].find(item => item['@type'] === 'BreadcrumbList');
  assert(breadcrumbs, 'Missing BreadcrumbList in Schema.org graph');
  assert.strictEqual(breadcrumbs.itemListElement.length, 2);
  assert.strictEqual(breadcrumbs.itemListElement[0].name, 'Home');
  assert.strictEqual(breadcrumbs.itemListElement[1].name, 'Certificate Validator');

  console.log('    [PASS] Schema.org WebApplication and BreadcrumbList validated.');
}

// Test 3: Essential DOM IDs & Interactive Workbench Controls
console.log('\n--> Test 3: Essential DOM IDs & Interactive Workbench Controls');
{
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');
  const requiredIds = [
    'certInput',
    'dropZone',
    'dropOverlay',
    'btnVerify',
    'btnClear',
    'btnLoadValid',
    'btnLoadTampered',
    'btnLoadExpired',
    'emptyState',
    'resultsCard',
    'statusBanner',
    'statusIconMount',
    'statusTitle',
    'statusPill',
    'statusDescription',
    'metaCertId',
    'metaApplicant',
    'metaProduct',
    'metaLevel',
    'metaIssued',
    'metaExpires',
    'metaHash',
    'metaFilesCount',
    'invariantsGrid',
    'btnToggleJson',
    'jsonContainer',
    'jsonPayloadMount',
    'btnCopyJson',
    'btnCopyReport'
  ];

  for (const id of requiredIds) {
    assert(html.includes(`id="${id}"`), `Missing required DOM element: #${id}`);
  }

  // Verify Four Foundational Invariants mentions in DOM
  assert(html.includes('Invariant 1: Zero External Egress'), 'Must include Invariant 1 card');
  assert(html.includes('Invariant 2: Reversible Surrogates'), 'Must include Invariant 2 card');
  assert(html.includes('Invariant 3: Volatile RAM Isolation'), 'Must include Invariant 3 card');
  assert(html.includes('Invariant 4: Zero Subprocessors'), 'Must include Invariant 4 card');

  console.log(`    [PASS] All ${requiredIds.length} required DOM IDs and invariant cards verified.`);
}

// Test 4: Embedded Sample Tokens Cryptographic Conformance
console.log('\n--> Test 4: Embedded Sample Tokens Cryptographic Conformance');
{
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');

  // Extract SAMPLES object from script block
  const samplesMatch = html.match(/const\s+SAMPLES\s*=\s*\{([\s\S]*?)\};/);
  assert(samplesMatch, 'SAMPLES definition must be present in client script');

  const validTokenMatch = samplesMatch[1].match(/valid:\s*"(ZTDS-CERT-v1\.[^"]+)"/);
  const tamperedTokenMatch = samplesMatch[1].match(/tampered:\s*"(ZTDS-CERT-v1\.[^"]+)"/);
  const expiredTokenMatch = samplesMatch[1].match(/expired:\s*"(ZTDS-CERT-v1\.[^"]+)"/);

  assert(validTokenMatch, 'Valid token must be defined in SAMPLES');
  assert(tamperedTokenMatch, 'Tampered token must be defined in SAMPLES');
  assert(expiredTokenMatch, 'Expired token must be defined in SAMPLES');

  const validToken = validTokenMatch[1];
  const tamperedToken = tamperedTokenMatch[1];
  const expiredToken = expiredTokenMatch[1];

  // 1. Verify that valid token passes cryptographic verification
  const validRes = verifyCertificate(validToken);
  assert.strictEqual(validRes.valid, true, 'Valid sample token must pass verification');
  assert(validRes.certificate_id.startsWith('ZTDS-CERT-2026-'), 'Certificate ID must have standard format');
  assert.strictEqual(validRes.invariants.invariant_1_zero_egress, 'PASS');
  assert.strictEqual(validRes.invariants.invariant_4_zero_subprocessors, 'PASS');

  // 2. Verify that tampered token throws CertificateTamperedError
  assert.throws(
    () => verifyCertificate(tamperedToken),
    /Cryptographic signature validation failed|tampered with/,
    'Tampered sample token must fail signature check'
  );

  // 3. Verify that expired token throws CertificateExpiredError
  assert.throws(
    () => verifyCertificate(expiredToken),
    /Certificate .* expired/,
    'Expired sample token must fail expiry check'
  );

  console.log('    [PASS] Embedded sample tokens: Authentic (verified), Tampered (detected), Expired (detected).');
}

// Test 5: SubtleCrypto & SPKI Key Match
console.log('\n--> Test 5: SubtleCrypto & SPKI Key Match');
{
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');
  assert(
    html.includes('DEFAULT_SPKI_B64 = "MCowBQYDK2VwAyEAg3N98ZgL4Uqbu0PmqvG8KN8vUicYkgKfUNVgwlLObr4="'),
    'Client SPKI key must match ZTDS AI Consortium Ed25519 root key'
  );
  assert(html.includes('window.crypto.subtle.importKey'), 'Must use SubtleCrypto importKey for Ed25519');
  assert(html.includes('window.crypto.subtle.verify'), 'Must use SubtleCrypto verify for Ed25519');
  assert(html.includes('canonicalizeJson'), 'Must implement RFC 8785 JSON canonicalization');

  console.log('    [PASS] SPKI root key matches and SubtleCrypto primitives verified.');
}

// Test 6: Zero-Emoji & BrandMeWeb Spelling SSOT
console.log('\n--> Test 6: Zero-Emoji Compliance & BrandMeWeb Spelling SSOT');
{
  const html = fs.readFileSync(VERIFY_HTML_PATH, 'utf8');

  // Zero Emoji check
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(html), 'Zero-emoji policy violated in verify/index.html');

  // BrandMeWeb spelling check (never "Brand Me Web")
  const improperBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  assert(!improperBrandRegex.test(html), 'BrandMeWeb must be spelled as a single word in verify/index.html');

  console.log('    [PASS] Zero emojis and BrandMeWeb spelling verified.');
}

console.log('\n[PASS] All 6 Certificate Validator UI & Cryptographic Tests Passed Successfully!\n');
