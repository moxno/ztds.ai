/**
 * ZTDS.ai Scanner Progressive Disclosure & Dynamic DAG Test Suite
 * Validates auditor mode tabs, section anchors, hash router, and dynamic DAG flow rendering.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Scanner UI & Progressive Disclosure Verification Suite...\n');

const scannerPath = path.join(__dirname, '..', 'scanner', 'index.html');
const indexPath = path.join(__dirname, '..', 'index.html');

assert(fs.existsSync(scannerPath), 'scanner/index.html does not exist');
assert(fs.existsSync(indexPath), 'index.html does not exist');

const scannerHtml = fs.readFileSync(scannerPath, 'utf8');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

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
assert(scannerHtml.includes('function setAuditorMode('), 'Missing setAuditorMode function');
assert(scannerHtml.includes('HASH_ALIAS_MAP'), 'Missing HASH_ALIAS_MAP for deep-link anchors');
assert(scannerHtml.includes('window.addEventListener(\'hashchange\''), 'Missing hashchange listener');
assert(scannerHtml.includes('setAuditorMode(\'mode1-socket-interceptor\', true)'), 'Airplane demo must transition to Mode 1 Socket Interceptor');
console.log('    [PASS] Tab switching controller, deep-linking, and airplane bridge verified.');

// Test 4: Dynamic DAG Flow & Progressive Disclosure Accordions
console.log('--> Test 4: Dynamic DAG Flow & Accordion Rendering');
assert(indexHtml.includes('ev.dagComparison'), 'index.html missing ev.dagComparison rendering');
assert(indexHtml.includes('dag.legacy.title'), 'index.html missing dag.legacy.title');
assert(indexHtml.includes('dag.ztds.title'), 'index.html missing dag.ztds.title');
assert(scannerHtml.includes('ev.dagComparison'), 'scanner/index.html missing ev.dagComparison rendering');
assert(scannerHtml.includes('dag.legacy.title'), 'scanner/index.html missing dag.legacy.title');
assert(scannerHtml.includes('dag.ztds.title'), 'scanner/index.html missing dag.ztds.title');
console.log('    [PASS] Dynamic DAG flows and progressive disclosure accordions validated across landing and scanner pages.');

console.log('\n[SUMMARY] ALL 4 SCANNER UI & PROGRESSIVE DISCLOSURE TESTS PASSED.\n');
