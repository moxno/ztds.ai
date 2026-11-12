/**
 * ZTDS.ai Scanner Progressive Disclosure & Dynamic DAG Test Suite
 * Validates auditor mode tabs, section anchors, hash router, and dynamic DAG flow rendering.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Scanner UI & Progressive Disclosure Verification Suite...\n');

const scannerPath = path.join(__dirname, '..', 'scanner', 'index.html');
const scannerJsPath = path.join(__dirname, '..', 'assets', 'js', 'pages', 'scanner.js');
const indexPath = path.join(__dirname, '..', 'index.html');
const homeWorkbenchPath = path.join(__dirname, '..', 'assets', 'js', 'home-workbench.js');

assert(fs.existsSync(scannerPath), 'scanner/index.html does not exist');
assert(fs.existsSync(scannerJsPath), 'assets/js/pages/scanner.js does not exist');
assert(fs.existsSync(indexPath), 'index.html does not exist');
assert(fs.existsSync(homeWorkbenchPath), 'assets/js/home-workbench.js does not exist');

const scannerHtml = fs.readFileSync(scannerPath, 'utf8');
const scannerJs = fs.readFileSync(scannerJsPath, 'utf8');
const scannerBundle = scannerHtml + '\n' + scannerJs;
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const homeWorkbenchJs = fs.readFileSync(homeWorkbenchPath, 'utf8');

// Test 1: Auditor Mode Navigation Bar & Tab Buttons
console.log('--> Test 1: Auditor Mode Navigation Bar & Tab Elements');
assert(scannerHtml.includes('id="auditorModeTabsContainer"'), 'Missing auditorModeTabsContainer');
const expectedModes = [
  'mode0-domain-scanner',
  'mode1-socket-interceptor',
  'mode2-static-linter',
  'mode3-airplane-protocol',
  'mode4-cicd-workbench',
  'all'
];
for (const mode of expectedModes) {
  assert(scannerHtml.includes(`data-mode="${mode}"`), `Missing tab button for mode: ${mode}`);
}
console.log('    [PASS] Auditor Mode Navigation Bar and 6 tab options validated.');

// Test 2: Section IDs & Anchors
console.log('--> Test 2: Core Auditor Section IDs');
const expectedSections = [
  'id="mode0-domain-scanner"',
  'id="mode1-socket-interceptor"',
  'id="mode2-static-linter"',
  'id="mode3-airplane-protocol"',
  'id="mode4-cicd-workbench"'
];
for (const sec of expectedSections) {
  assert(scannerHtml.includes(sec), `Missing section anchor: ${sec}`);
}
console.log('    [PASS] All 5 Core Auditor section anchors verified.');

// Test 3: JavaScript Progressive Disclosure Controller & Hash Router
console.log('--> Test 3: Progressive Disclosure Controller & Hash Router');
assert(scannerHtml.includes('/assets/js/pages/scanner.js'), 'scanner/index.html must load external /assets/js/pages/scanner.js');
assert(scannerJs.includes('function setAuditorMode('), 'Missing setAuditorMode function');
assert(scannerJs.includes('HASH_ALIAS_MAP'), 'Missing HASH_ALIAS_MAP for deep-link anchors');
assert(scannerJs.includes('window.addEventListener(\'hashchange\''), 'Missing hashchange listener');
assert(scannerJs.includes('setAuditorMode(\'mode1-socket-interceptor\', true)'), 'Airplane demo must transition to Mode 1 Socket Interceptor');
console.log('    [PASS] Tab switching controller, deep-linking, and airplane bridge verified.');

// Test 4: Dynamic DAG Flow, CSP-Strict External Workbench & Trusted Types Zero-Sink Invariant
console.log('--> Test 4: Dynamic DAG Flow, CSP-Strict External Workbench & Zero-Sink Rendering');
const indexLandingBundle = indexHtml + '\n' + homeWorkbenchJs;
assert(indexHtml.includes('/assets/js/home-workbench.js'), 'index.html must load external /assets/js/home-workbench.js');
const inlineExecScripts = (indexHtml.match(/<script\b[^>]*>/gi) || []).filter(
  tag => !/\bsrc=/i.test(tag) && !/application\/ld\+json/i.test(tag)
);
assert.strictEqual(inlineExecScripts.length, 0, 'index.html must contain zero inline executable <script> tags');
assert(!/\bon[a-z]+\s*=/i.test(indexHtml), 'index.html must contain zero inline event handler attributes');
assert(!/\.innerHTML\s*=/.test(homeWorkbenchJs), 'home-workbench.js must contain zero .innerHTML assignments for Trusted Types enforcement');
assert(!/\.innerHTML\s*=/.test(scannerJs), 'scanner.js must contain zero .innerHTML assignments for Trusted Types enforcement');
assert(indexLandingBundle.includes('ev.dagComparison'), 'Landing workbench missing ev.dagComparison rendering');
assert(indexLandingBundle.includes('dag.legacy.title'), 'Landing workbench missing dag.legacy.title');
assert(indexLandingBundle.includes('dag.ztds.title'), 'Landing workbench missing dag.ztds.title');
assert(scannerBundle.includes('ev.dagComparison'), 'scanner bundle missing ev.dagComparison rendering');
assert(scannerBundle.includes('dag.legacy.title'), 'scanner bundle missing dag.legacy.title');
assert(scannerBundle.includes('dag.ztds.title'), 'scanner bundle missing dag.ztds.title');
console.log('    [PASS] Dynamic DAG flows, strict CSP externalization, and Trusted Types zero-sink invariants validated.');

console.log('\n[SUMMARY] ALL 4 SCANNER UI & PROGRESSIVE DISCLOSURE TESTS PASSED.\n');
