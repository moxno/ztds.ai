const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Interactive Trust Badge Generator Test Suite...');

const badgeHtmlPath = path.join(__dirname, '../badge/index.html');
const badgeHtml = fs.readFileSync(badgeHtmlPath, 'utf8');

// --> Test 1: DOM Elements & Structural Controls
console.log('\n--> Test 1: DOM Elements & Structural Controls');
const requiredIds = [
  'slugInput',
  'registryQuickSelect',
  'registryStatusPill',
  'themeSelector',
  'themeDarkBtn',
  'themeLightBtn',
  'tierSelector',
  'customLabelInput',
  'clearCustomLabelBtn',
  'badgePreviewContainer',
  'badgePreviewLink',
  'badgeSvgMount',
  'canvasBgSwitcher',
  'canvasZoomSwitcher',
  'btnDownloadBadgeSvg',
  'codeMd',
  'codeHtml',
  'codeSvg',
  'codeReact'
];

requiredIds.forEach(id => {
  assert(badgeHtml.includes(`id="${id}"`), `Must contain element with id="${id}"`);
});
console.log('    [PASS] All 18 core DOM elements and structural controls verified.');

// --> Test 2: Badge Visual Theme Switcher
console.log('\n--> Test 2: Badge Visual Theme Switcher');
assert(badgeHtml.includes('data-theme="dark"'), 'Must have dark theme switcher button');
assert(badgeHtml.includes('data-theme="light"'), 'Must have light theme switcher button');
assert(badgeHtml.includes('Dark Badge'), 'Must have Dark Badge label');
assert(badgeHtml.includes('Light Badge'), 'Must have Light Badge label');
console.log('    [PASS] Dark & Light theme switcher buttons verified.');

// --> Test 3: Conformance Tiers Coverage (including AIR-GAPPED)
console.log('\n--> Test 3: Conformance Tiers Coverage');
const requiredTiers = [
  'VERIFIED',
  'SOVEREIGN',
  'DPA EXEMPT',
  'AIR-GAPPED',
  'SELF-ATTESTED'
];

requiredTiers.forEach(tier => {
  assert(badgeHtml.includes(`data-tier="${tier}"`), `Must support conformance tier: ${tier}`);
});
console.log('    [PASS] All 5 conformance tiers including AIR-GAPPED verified.');

// --> Test 4: Quick Preset Label Chips
console.log('\n--> Test 4: Quick Preset Label Chips');
const requiredPresets = [
  'WASM-ONLY',
  'AIR-GAPPED',
  'GDPR-SAFE',
  'PCI-DSS',
  'ZERO-EGRESS',
  'SOC-2-READY',
  'OFFLINE-FIRST'
];

requiredPresets.forEach(preset => {
  assert(badgeHtml.includes(`data-preset="${preset}"`), `Must include quick label chip for: ${preset}`);
});
console.log('    [PASS] All 7 quick preset label chips verified.');

// --> Test 5: Live Preview Canvas Controls (Background & Zoom)
console.log('\n--> Test 5: Live Preview Canvas Controls (Background & Zoom)');
assert(badgeHtml.includes('data-bg="light"'), 'Must support light canvas background');
assert(badgeHtml.includes('data-bg="dark"'), 'Must support dark canvas background');
assert(badgeHtml.includes('data-bg="grid"'), 'Must support grid canvas background');
assert(badgeHtml.includes('data-zoom="1"'), 'Must support 1x zoom');
assert(badgeHtml.includes('data-zoom="1.5"'), 'Must support 1.5x zoom');
assert(badgeHtml.includes('data-zoom="2"'), 'Must support 2x zoom');
console.log('    [PASS] Canvas background switcher and retina zoom controls verified.');

// --> Test 6: Certified Solutions Quick Select from Registry
console.log('\n--> Test 6: Certified Solutions Quick Select from Registry');
const expectedSolutions = [
  'privacyscrubber-web',
  'privacyscrubber-extension',
  'privacyscrubber-mcp',
  'privacyscrubber-sdk',
  'ztds-core',
  'ztds-python',
  'ztds-mcp',
  'langchain-ztds',
  'llamaindex-ztds',
  'ollama-ztds-filter',
  'envoy-ztds-wasm',
  'fastmcp-ztds'
];

expectedSolutions.forEach(slug => {
  assert(badgeHtml.includes(`value="${slug}"`), `Quick select must include certified solution: ${slug}`);
});
console.log('    [PASS] 12 flagship certified solutions verified in quick select.');

// --> Test 7: Dynamic API Handler Test (api/badge.js)
console.log('\n--> Test 7: Dynamic API Handler Test (api/badge.js)');
const badgeApi = require('../api/badge.js');

function testBadgeRequest(query) {
  let output = '';
  let status = 0;
  let headers = {};
  const req = { query };
  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (s) => {
      status = s;
      return {
        send: (body) => { output = body; }
      };
    }
  };
  badgeApi(req, res);
  return { status, headers, output };
}

// 7a: Default Dark Theme
const darkRes = testBadgeRequest({ slug: 'privacyscrubber-web' });
assert.strictEqual(darkRes.status, 200);
assert(darkRes.output.includes('fill="#0f172a"'), 'Dark theme must have slate-900 left wing');
assert(darkRes.output.includes('fill="#f8fafc"'), 'Dark theme must have white text for ZTDS');
assert(darkRes.output.includes('VERIFIED'), 'Must display VERIFIED');

// 7b: Light Theme
const lightRes = testBadgeRequest({ slug: 'privacyscrubber-web', theme: 'light' });
assert.strictEqual(lightRes.status, 200);
assert(lightRes.output.includes('fill="#f1f5f9"'), 'Light theme must have slate-100 left wing');
assert(lightRes.output.includes('fill="#0f172a"'), 'Light theme must have dark text for ZTDS');
assert(lightRes.output.includes('stroke="#cbd5e1"'), 'Light theme must have slate-300 border');

// 7c: AIR-GAPPED Tier
const airGappedRes = testBadgeRequest({ slug: 'privacyscrubber-web', tier: 'air-gapped' });
assert.strictEqual(airGappedRes.status, 200);
assert(airGappedRes.output.includes('AIR-GAPPED'), 'Must display AIR-GAPPED');
assert(airGappedRes.output.includes('fill="#4f46e5"'), 'AIR-GAPPED tier must have indigo right wing');

// 7d: DPA EXEMPT in Light Theme
const dpaLightRes = testBadgeRequest({ slug: 'privacyscrubber-web', tier: 'dpa', theme: 'light' });
assert.strictEqual(dpaLightRes.status, 200);
assert(dpaLightRes.output.includes('DPA EXEMPT'), 'Must display DPA EXEMPT');
assert(dpaLightRes.output.includes('fill="#047857"'), 'DPA light theme must have emerald text');

// 7e: Custom Label
const customRes = testBadgeRequest({ slug: 'my-app', label: 'WASM-ONLY' });
assert.strictEqual(customRes.status, 200);
assert(customRes.output.includes('WASM-ONLY'), 'Must render custom label WASM-ONLY');

console.log('    [PASS] Dynamic API endpoint passed all theme, tier, and custom label validations.');

// --> Test 8: Mobile Touch Target & Ergonomics
console.log('\n--> Test 8: Mobile Touch Target & Ergonomics');
assert(badgeHtml.includes('touch-target'), 'Must contain touch-target utility classes');
assert(badgeHtml.includes('min-h-[44px]'), 'Must enforce min-h-[44px] on primary action targets');
console.log('    [PASS] Mobile touch target ergonomics verified.');

// --> Test 9: Zero-Emoji Policy Audit
console.log('\n--> Test 9: Zero-Emoji Policy Audit');
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
assert(!emojiRegex.test(badgeHtml), 'badge/index.html must contain ZERO emojis');
const apiBadgeCode = fs.readFileSync(path.join(__dirname, '../api/badge.js'), 'utf8');
assert(!emojiRegex.test(apiBadgeCode), 'api/badge.js must contain ZERO emojis');
console.log('    [PASS] Zero emojis verified across badge HTML and API.');

// --> Test 10: Brand Spelling SSOT ("BrandMeWeb" single word rule)
console.log('\n--> Test 10: Brand Spelling SSOT');
assert(badgeHtml.includes('BrandMeWeb'), 'Must contain BrandMeWeb');
assert(!badgeHtml.includes('Brand Me Web'), 'Must not contain Brand Me Web with spaces');
console.log('    [PASS] Strict single-word BrandMeWeb spelling verified.');

console.log('\n[SUMMARY] ALL 10 INTERACTIVE TRUST BADGE GENERATOR TESTS PASSED WITH 100% SUCCESS.\n');
