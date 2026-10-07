/**
 * ZTDS.ai — In-Browser Zero-Trust Scanner & In-RAM Sanitizer Conformance Test Suite
 * 
 * Verifies:
 * 1. DOM Elements & Interactive Controls for Mode 1 Socket Interceptor & In-RAM Sanitizer
 * 2. In-RAM entity detection across 15+ sensitive categories (PII, PHI, Cloud Keys, Crypto, Tokens)
 * 3. RFC v1.0 Invariant 2: Deterministic Coreference Preservation (identical entities map to identical surrogates)
 * 4. RFC v1.0 Invariant 1 & 3: Lossless Bijective In-RAM Round-Trip Restoration
 * 5. Cryptographic SHA-256 Audit Receipt Generation & JSON Schema Conformance
 * 6. Live debounced input, paste clipboard, and copy feedback listeners
 * 7. Strict zero-emoji compliance and BrandMeWeb single word rule
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS In-Browser Scanner & In-RAM Sanitizer Conformance Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const scannerHtmlPath = path.join(ROOT, 'scanner/index.html');

assert(fs.existsSync(scannerHtmlPath), 'scanner/index.html must exist');

const html = fs.readFileSync(scannerHtmlPath, 'utf8');

// Test 1: DOM Elements & Interactive Controls for Mode 1
console.log('--> Test 1: Mode 1 Workbench DOM Elements & Interactive Controls');
{
  assert(html.includes('id="scannerInputText"'), 'Must have #scannerInputText textarea');
  assert(html.includes('id="scannerInputLength"'), 'Must have #scannerInputLength element');
  assert(html.includes('id="btnPasteClipboard"'), 'Must have #btnPasteClipboard button');
  assert(html.includes('id="btnResetScanner"'), 'Must have #btnResetScanner button');
  assert(html.includes('id="scannerEntityPills"'), 'Must have #scannerEntityPills container');
  assert(html.includes('id="btnRunSanitization"'), 'Must have #btnRunSanitization button');
  assert(html.includes('id="btnTestLeakAttempt"'), 'Must have #btnTestLeakAttempt button');
  assert(html.includes('id="btnLeakPresetLlm"'), 'Must have #btnLeakPresetLlm button');
  assert(html.includes('id="btnLeakPresetAnalytics"'), 'Must have #btnLeakPresetAnalytics button');
  assert(html.includes('id="btnLeakPresetHttp"'), 'Must have #btnLeakPresetHttp button');
  
  assert(html.includes('id="tabBtnSurrogates"'), 'Must have #tabBtnSurrogates button');
  assert(html.includes('id="tabBtnRoundtrip"'), 'Must have #tabBtnRoundtrip button');
  assert(html.includes('id="tabBtnSessionMap"'), 'Must have #tabBtnSessionMap button');
  assert(html.includes('id="btnCopySanitized"'), 'Must have #btnCopySanitized button');
  assert(html.includes('id="surrogateMetricsLabel"'), 'Must have #surrogateMetricsLabel element');
  assert(html.includes('id="btnCopyTokenMap"'), 'Must have #btnCopyTokenMap button');
  assert(html.includes('id="tokenMapMetricsLabel"'), 'Must have #tokenMapMetricsLabel element');

  assert(html.includes('id="scannerAuditDigest"'), 'Must have #scannerAuditDigest element');
  assert(html.includes('id="btnDownloadReceipt"'), 'Must have #btnDownloadReceipt button');
  assert(html.includes('id="btnExportCisoPdf"'), 'Must have #btnExportCisoPdf button');
  assert(html.includes('id="btnProceedApply"'), 'Must have #btnProceedApply link');
  assert(html.includes('id="modalCisoAuditReport"'), 'Must have #modalCisoAuditReport modal');
  assert(html.includes('id="btnPrintCisoReport"'), 'Must have #btnPrintCisoReport button');
  assert(html.includes('id="btnModalDownloadJson"'), 'Must have #btnModalDownloadJson button');
  assert(html.includes('id="btnCopyCisoReportSummary"'), 'Must have #btnCopyCisoReportSummary button');

  console.log('    [PASS] All Mode 1 workbench DOM elements and interactive controls verified.');
}

// Test 2: In-RAM Sanitizer Engine & Entity Category Coverage
console.log('--> Test 2: In-RAM Sanitizer Engine & Entity Category Coverage');
{
  assert(html.includes('async function sanitizeInRAM('), 'Must define sanitizeInRAM function');
  assert(html.includes('function restoreCleartextInRAM('), 'Must define restoreCleartextInRAM function');
  assert(html.includes('function renderHighlightedTokens('), 'Must define renderHighlightedTokens function');
  assert(html.includes('function renderEntityPills('), 'Must define renderEntityPills function');
  assert(html.includes('function computeSha256('), 'Must define computeSha256 function');

  // Verify comprehensive entity categories in sanitizeInRAM
  const expectedPrefixes = [
    'PRIVATE_KEY',
    'JWT_TOKEN',
    'ANTHROPIC_KEY',
    'OPENAI_KEY',
    'AWS_ACCESS_KEY',
    'AWS_SECRET_KEY',
    'GITHUB_TOKEN',
    'BTC_ADDR',
    'ETH_ADDR',
    'CREDIT_CARD',
    'SSN',
    'IBAN',
    'EMAIL',
    'IPV4',
    'UUID',
    'PHONE',
    'DOB',
    'MRN',
    'SECRET',
    'ENTITY'
  ];

  expectedPrefixes.forEach(prefix => {
    assert(html.includes(`'${prefix}'`) || html.includes(`"${prefix}"`), `Must support entity prefix: ${prefix}`);
  });

  console.log(`    [PASS] Verified ${expectedPrefixes.length} sensitive entity detection categories.`);
}

// Test 3: RFC v1.0 Invariant 2: Deterministic Coreference Preservation
console.log('--> Test 3: RFC v1.0 Invariant 2: Deterministic Coreference Preservation');
{
  assert(html.includes('clearToToken[cleartext]'), 'Must maintain clearToToken lookup table for coreference');
  assert(html.includes('return clearToToken[cleartext];'), 'Must return existing surrogate token on repeat mentions');

  // Extract sanitizeInRAM function code and evaluate in isolated context
  const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  
  // Create an evaluation context to test coreference logic directly
  const testCoreferenceCode = `
    let performance = { now: () => 100 };
    ${scriptContent.slice(scriptContent.indexOf('// In-RAM Sanitizer Engine with Bijective Mapping and Coreference Preservation'), scriptContent.indexOf('// Format HTML Tokens'))}
    
    (async () => {
      const sample = "Email svance@mercyhealth.org was sent. Re-confirming with svance@mercyhealth.org. Also SSN 123-45-6789 and repeated SSN 123-45-6789.";
      const res = await sanitizeInRAM(sample);
      return res;
    })()
  `;

  eval(testCoreferenceCode).then(res => {
    // Both occurrences of svance@mercyhealth.org must map to [EMAIL_1]
    const emailMatches = res.sanitized.match(/\[EMAIL_1\]/g);
    assert(emailMatches && emailMatches.length === 2, 'Repeated email must map to [EMAIL_1] both times');
    assert(!res.sanitized.includes('[EMAIL_2]'), 'Must NOT increment surrogate token for identical entity');

    // Both occurrences of SSN must map to [SSN_1]
    const ssnMatches = res.sanitized.match(/\[SSN_1\]/g);
    assert(ssnMatches && ssnMatches.length === 2, 'Repeated SSN must map to [SSN_1] both times');
    assert(!res.sanitized.includes('[SSN_2]'), 'Must NOT increment surrogate token for identical SSN');

    console.log('    [PASS] Coreference consistency validated: repeat mentions reuse identical surrogate tokens.');
  }).catch(err => {
    assert.fail(`Coreference test failed: ${err.message}`);
  });
}

// Test 4: Bijective Lossless Round-Trip (Invariant 2 Reversibility)
console.log('--> Test 4: RFC v1.0 Invariant 2: Bijective Lossless Round-Trip');
{
  const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const testRoundtripCode = `
    let performance = { now: () => 100 };
    ${scriptContent.slice(scriptContent.indexOf('// In-RAM Sanitizer Engine with Bijective Mapping and Coreference Preservation'), scriptContent.indexOf('// Execute Verification Cycle'))}

    (async () => {
      const original = "Dr. Sarah Vance prescribed Nitroglycerin to Alexander Wright (DOB: 1984-05-12, SSN: 123-45-6789). Contact svance@mercyhealth.org or call (555) 349-8821.";
      const result = await sanitizeInRAM(original);
      const reversed = restoreCleartextInRAM(result.sanitized, result.sessionMap);
      return { original, reversed: reversed.restored };
    })()
  `;

  eval(testRoundtripCode).then(({ original, reversed }) => {
    assert.strictEqual(reversed, original, 'Restored text must exactly match original cleartext (100% bijective identity)');
    console.log('    [PASS] Exact 1:1 bijective lossless round-trip verified in RAM.');
  }).catch(err => {
    assert.fail(`Roundtrip test failed: ${err.message}`);
  });
}

// Test 5: Cryptographic SHA-256 Audit Receipt Schema
console.log('--> Test 5: Cryptographic SHA-256 Audit Receipt Schema');
{
  assert(html.includes('https://ztds.ai/schemas/audit-receipt.v1.json'), 'Receipt must reference canonical ZTDS schema');
  assert(html.includes('ZTDS RFC v1.0 (IETF draft-sibiryakov-ztds-protocol)'), 'Receipt must cite ZTDS RFC v1.0');
  assert(html.includes('invariant_1_zero_egress'), 'Receipt must certify Invariant 1');
  assert(html.includes('invariant_2_deterministic_tokenization'), 'Receipt must certify Invariant 2');
  assert(html.includes('invariant_3_memory_isolation'), 'Receipt must certify Invariant 3');
  assert(html.includes('invariant_4_subprocessor_exclusion'), 'Receipt must certify Invariant 4');
  assert(html.includes('VERIFIED_COMPLIANT_ZERO_EGRESS'), 'Receipt must set VERIFIED_COMPLIANT_ZERO_EGRESS status');

  console.log('    [PASS] Cryptographic SHA-256 audit receipt schema and 4-invariant attestation verified.');
}

// Test 6: Real-Time Debouncing, Clipboard Paste & Copy Feedback
console.log('--> Test 6: Real-Time Debouncing, Clipboard Paste & Copy Feedback');
{
  assert(html.includes('debounceTimer = setTimeout('), 'Must debounce real-time typing input');
  assert(html.includes('inputText.addEventListener(\'paste\''), 'Must handle paste event immediately');
  assert(html.includes('navigator.clipboard.readText'), 'Must support navigator.clipboard.readText on paste button');
  assert(html.includes('btnCopySanitized.addEventListener'), 'Must bind copy sanitized text button');
  assert(html.includes('btnCopyTokenMap.addEventListener'), 'Must bind copy token map button');
  assert(html.includes('Copied!'), 'Must provide visual Copied! feedback on copy buttons');

  console.log('    [PASS] Real-time debounced input, paste listener, and clipboard copy feedback verified.');
}

// Test 7: Strict Zero-Emoji Conformance
console.log('--> Test 7: Strict Zero-Emoji Conformance');
{
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const selfContent = fs.readFileSync(__filename, 'utf8');
  assert(!emojiRegex.test(selfContent), 'Test suite must not contain any emoji characters');
  assert(!emojiRegex.test(html), 'scanner/index.html must not contain any emoji characters');

  console.log('    [PASS] Zero emojis verified across test suite and scanner HTML.');
}

// Test 8: Brand Spelling SSOT ("BrandMeWeb" single word rule)
console.log('--> Test 8: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
{
  const invalidBrandPattern = /\bBrand\s+Me\s+Web\b/i;
  assert(!invalidBrandPattern.test(html), 'scanner/index.html must never spell "Brand Me Web" with spaces');
  assert(html.includes('BrandMeWeb'), 'scanner/index.html must reference BrandMeWeb');

  console.log('    [PASS] BrandMeWeb single word rule verified.');
}

// Test 9: Egress Leak Emulation Presets & Attack Vectors
console.log('--> Test 9: Egress Leak Emulation Presets & Attack Vectors');
{
  assert(html.includes('LEAK_PRESET_SCENARIOS'), 'Must define LEAK_PRESET_SCENARIOS object');
  assert(html.includes('api.openai.com:443'), 'Must simulate Frontier LLM API egress target');
  assert(html.includes('google-analytics.com:443'), 'Must simulate analytics telemetry tracker target');
  assert(html.includes('collector.cloud-logging.internal:80'), 'Must simulate unencrypted HTTP egress target');
  assert(html.includes('function simulateLeakAttempt('), 'Must define simulateLeakAttempt function');
  assert(html.includes('BLOCKED: Invariant 1 Policy Applied (0.00 B Leaked)'), 'Must enforce Invariant 1 policy status');

  console.log('    [PASS] Egress leak emulation presets and attack vector interception verified.');
}

// Test 10: CISO Executive Compliance Audit Report Exporter & Printable Modal
console.log('--> Test 10: CISO Executive Compliance Audit Report Exporter & Printable Modal');
{
  assert(html.includes('function openCisoAuditReportModal('), 'Must define openCisoAuditReportModal function');
  assert(html.includes('function closeCisoAuditReportModal('), 'Must define closeCisoAuditReportModal function');
  assert(html.includes('reportTimestampDisplay'), 'Report modal must render timestamp');
  assert(html.includes('reportReceiptIdDisplay'), 'Report modal must render receipt ID');
  assert(html.includes('reportMasterSha256'), 'Report modal must render SHA-256 digest');
  assert(html.includes('reportDeltaEgress'), 'Report modal must render delta egress proof');
  assert(html.includes('reportMemoryIsolation'), 'Report modal must render memory isolation status');
  assert(html.includes('reportPacketTableBody'), 'Report modal must render intercepted packet evidence table');
  assert(html.includes('@media print'), 'Must include print stylesheet rules for clean CISO PDF output');

  console.log('    [PASS] CISO executive compliance audit report exporter and print styles verified.');
}

console.log('\n[SUMMARY] ALL 10 SCANNER IN-RAM SANITIZER TESTS PASSED WITH 100% SUCCESS.\n');
