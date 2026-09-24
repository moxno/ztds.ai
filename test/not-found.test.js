/**
 * ZTDS.ai — 404 Not Found Error Page Test Suite
 * Validates 404.html structure, zero-emoji conformance, infosec humor copy,
 * diagnostic terminal elements, XSS safety, and perimeter recovery routing.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n[TEST] Starting 404 Not Found Page Verification Suite...\n');

const notFoundPath = path.join(__dirname, '../404.html');

// Test 1: Existence and HTML5 DOCTYPE
console.log('--> Test 1: File Existence & HTML5 Structure');
assert(fs.existsSync(notFoundPath), '404.html must exist in workspace root');
const html = fs.readFileSync(notFoundPath, 'utf8');

assert(html.includes('<!DOCTYPE html>'), '404.html must contain HTML5 DOCTYPE');
assert(html.includes('<title>404: Route Sanitized in Volatile RAM — ZTDS.ai</title>'), 'Title must reflect zero-trust RAM sanitization');
assert(html.includes('name="robots" content="noindex, follow"'), 'Must contain noindex, follow to protect SEO indexing');
assert(html.includes('href="/styles.css"'), 'Must load styles.css');
assert(html.includes('src="/nav.js"'), 'Must load nav.js');
console.log('    [PASS] HTML5 structure, title, robots noindex, and asset links verified.');

// Test 2: Strict Zero-Emoji Rule Validation
console.log('--> Test 2: Strict Zero-Emoji Conformance');
const emojiRegex = /[\u{10000}-\u{10ffff}\u{2600}-\u{27ff}\u{2300}-\u{23ff}\u{2b50}\u{2b55}\u{200d}\u{fe0f}]/u;
assert(!emojiRegex.test(html), '404.html must NOT contain any emojis (strict user rule)');
console.log('    [PASS] Zero emojis verified across all text and code.');

// Test 3: Infosec Humor & Diagnostic Terminal Content
console.log('--> Test 3: Infosec Humor & Invariant Verification Telemetry');
assert(html.includes('INVARIANT_1_ENFORCED // 0.00 BYTES LEAKED'), 'Must include Invariant 1 zero-egress pill');
assert(html.includes('404: Route Sanitized in Volatile RAM'), 'Must include primary heading');
assert(html.includes('[SURROGATE_URI_TOKEN_0x404]'), 'Must include synthetic surrogate token representation');
assert(html.includes('0.00 Bytes (0 Packets Egressed)'), 'Must include zero-byte egress verification');
assert(html.includes('0 Subprocessors Incurred (GDPR Art. 28 Disapplied)'), 'Must include GDPR subprocessor exemption humor');
assert(html.includes('Notice for Automated Vulnerability Scanners'), 'Must include notice for vulnerability scanners');
assert(html.includes('/wp-admin') && html.includes('/.env'), 'Must mention common scanner traversal probes');
console.log('    [PASS] Infosec humor, zero-egress metrics, and scanner notice verified.');

// Test 4: Diagnostic DOM IDs and Interactive Elements
console.log('--> Test 4: Diagnostic DOM IDs and Interaction Controls');
assert(html.includes('id="displayAttemptedPath"'), 'Must include #displayAttemptedPath');
assert(html.includes('id="btnSimulateDetokenize"'), 'Must include #btnSimulateDetokenize');
assert(html.includes('id="detokenizeLogBox"'), 'Must include #detokenizeLogBox');
assert(html.includes('Simulate Memory De-Tokenization'), 'Must include de-tokenization button');
console.log('    [PASS] All diagnostic DOM IDs and simulation triggers verified.');

// Test 5: Authenticated Perimeter Recovery Routing
console.log('--> Test 5: Authenticated Perimeter Recovery Routes');
assert(html.includes('href="/"'), 'Must include recovery link to Home (/)');
assert(html.includes('href="/scanner/"'), 'Must include recovery link to Scanner (/scanner/)');
assert(html.includes('href="/standard/"'), 'Must include recovery link to Standard (/standard/)');
assert(html.includes('href="/ciso/"'), 'Must include recovery link to CISO Pack (/ciso/)');
assert(html.includes('href="/agency/"'), 'Must include link to BrandMeWeb Agency Retainer (/agency/)');
console.log('    [PASS] All recovery navigation paths verified.');

// Test 6: XSS Protection in Dynamic Path Reflection
console.log('--> Test 6: XSS Protection in Path Reflection Script');
assert(html.includes('displayPath.textContent = rawPath'), 'Script must use textContent for path reflection (never innerHTML)');
assert(!html.includes('displayPath.innerHTML = rawPath'), 'Script must NEVER use innerHTML for path reflection');
console.log('    [PASS] textContent-based XSS neutralization verified.');

// Test 7: Schema.org BreadcrumbList Validation
console.log('--> Test 7: Schema.org BreadcrumbList Validation');
const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(schemaMatch, '404.html must contain JSON-LD block');
const schema = JSON.parse(schemaMatch[1]);
assert.strictEqual(schema['@context'], 'https://schema.org');
assert.strictEqual(schema['@type'], 'BreadcrumbList');
assert(Array.isArray(schema.itemListElement) && schema.itemListElement.length === 2);
assert.strictEqual(schema.itemListElement[0].item, 'https://ztds.ai/');
assert.strictEqual(schema.itemListElement[1].item, 'https://ztds.ai/404.html');
console.log('    [PASS] Schema.org BreadcrumbList validated.');

console.log('\n[SUMMARY] ALL 7 404 NOT FOUND TESTS PASSED WITH 100% CONFORMANCE.\n');
