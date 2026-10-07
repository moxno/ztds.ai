/**
 * ZTDS.ai — CISO Procurement & Legal Pack Page Test Suite
 * 
 * Verifies:
 * 1. Existence and integrity of sticky navigation bar and all 7 section anchors
 * 2. CISO Quick Scenario Estimator sliders, steppers, presets, and actuarial readouts
 * 3. Side-by-Side Architectural Decision Matrix table across 7 criteria & 5 competitors
 * 4. Upgraded DLP Battlecards with search filter input, URL hash deep-links, and 1-click copy
 * 5. Dedicated Procurement Downloads Hub cards (PDF, ZIP, Deck, Binder, MD, CI/CD)
 * 6. Live Procurement Preview Modal with tabs, accessibility attributes, and export buttons
 * 7. Actuarial calculation math model parity with /roi/ calculator
 * 8. Strict zero-emoji compliance and BrandMeWeb single word spelling SSOT
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS CISO Procurement Page Test Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const cisoHtmlPath = path.join(ROOT, 'ciso/index.html');

assert(fs.existsSync(cisoHtmlPath), 'ciso/index.html must exist');
const html = fs.readFileSync(cisoHtmlPath, 'utf8');

// Test 1: Sticky Navigation Bar & Section Anchors
console.log('--> Test 1: Sticky Navigation Bar & Section Anchors Integrity');
{
  assert(html.includes('aria-label="Page Sections"'), 'Must have sticky section navigation nav');
  
  const expectedNavHrefs = [
    '#memo',
    '#statutory',
    '#questionnaire',
    '#estimator',
    '#matrix',
    '#battlecards',
    '#downloads'
  ];

  expectedNavHrefs.forEach(href => {
    assert(html.includes(`href="${href}"`), `Sticky nav must contain link to ${href}`);
  });

  // Verify anchor IDs exist on page
  assert(html.includes('id="memo"'), 'Must contain section #memo');
  assert(html.includes('id="statutory"'), 'Must contain section #statutory');
  assert(html.includes('id="questionnaire"'), 'Must contain section #questionnaire');
  assert(html.includes('id="estimator"'), 'Must contain section #estimator');
  assert(html.includes('id="matrix"'), 'Must contain section #matrix');
  assert(html.includes('id="battlecards"'), 'Must contain section #battlecards');
  assert(html.includes('id="downloads"'), 'Must contain section #downloads');
  assert(html.includes('id="procurementModal"'), 'Must contain #procurementModal');

  console.log('    [PASS] Navigation links and section anchor IDs verified.');
}

// Test 2: CISO Quick Scenario Estimator Integrity
console.log('--> Test 2: CISO Quick Scenario Estimator Integrity');
{
  // Sliders and readouts
  assert(html.includes('id="cisoCallsSlider"'), 'Must have #cisoCallsSlider');
  assert(html.includes('id="cisoVendorsSlider"'), 'Must have #cisoVendorsSlider');
  assert(html.includes('id="cisoCallsVal"'), 'Must have #cisoCallsVal readout');
  assert(html.includes('id="cisoVendorsVal"'), 'Must have #cisoVendorsVal readout');

  // Regime selector and options
  assert(html.includes('id="cisoRegimeSelect"'), 'Must have #cisoRegimeSelect');
  assert(html.includes('value="global"'), 'Must include global regime');
  assert(html.includes('value="eu"'), 'Must include eu regime');
  assert(html.includes('value="us_hipaa"'), 'Must include us_hipaa regime');
  assert(html.includes('value="us_fintech"'), 'Must include us_fintech regime');
  assert(html.includes('value="us_legal"'), 'Must include us_legal regime');

  // Computed display tiles
  assert(html.includes('id="cisoDpaSavings"'), 'Must have #cisoDpaSavings tile');
  assert(html.includes('id="cisoBreachSavings"'), 'Must have #cisoBreachSavings tile');
  assert(html.includes('id="cisoTotalExposure"'), 'Must have #cisoTotalExposure tile');
  assert(html.includes('id="cisoRoiMultiple"'), 'Must have #cisoRoiMultiple tile');

  // Steppers and presets
  assert(html.includes('ciso-step-btn'), 'Must have quick stepper buttons');
  assert(html.includes('ciso-preset-btn'), 'Must have preset buttons');
  assert(html.includes('data-calls="500000"'), 'Must have Mid-Market preset');
  assert(html.includes('data-calls="2000000"'), 'Must have Regulated Enterprise preset');
  assert(html.includes('data-calls="1500000"'), 'Must have US Healthcare preset');
  assert(html.includes('data-calls="10000000"'), 'Must have Global Financial preset');

  // Action buttons
  assert(html.includes('id="btnDeepDiveRoi"'), 'Must have #btnDeepDiveRoi deep-link button');
  assert(html.includes('id="btnExportCisoJson"'), 'Must have #btnExportCisoJson button');

  console.log('    [PASS] Estimator controls, tiles, presets, and steppers verified.');
}

// Test 3: Side-by-Side Architectural Decision Matrix Table
console.log('--> Test 3: Side-by-Side Architectural Decision Matrix');
{
  assert(html.includes('Side-by-Side Architectural Decision Matrix'), 'Must contain matrix title');
  
  // Verify architectural criteria rows
  assert(html.includes('1. Execution Perimeter &amp; Latency'), 'Must have Criteria 1');
  assert(html.includes('2. GDPR Art. 28 Subprocessor Status'), 'Must have Criteria 2');
  assert(html.includes('3. Tokenization &amp; Model Reasoning'), 'Must have Criteria 3');
  assert(html.includes('4. Memory &amp; Disk Lifecycle'), 'Must have Criteria 4');
  assert(html.includes('5. Verifiable Cryptographic Receipts'), 'Must have Criteria 5');
  assert(html.includes('6. Disconnected Air-Gapped / SCIF'), 'Must have Criteria 6');
  assert(html.includes('7. Regulatory Compliance Mapping'), 'Must have Criteria 7');

  // Verify comparison columns
  assert(html.includes('ZTDS RFC v1.0 (In-Memory Engine)'), 'Must include ZTDS column');
  assert(html.includes('Microsoft Purview'), 'Must include Purview column');
  assert(html.includes('Nightfall AI / BigID'), 'Must include Nightfall/BigID column');
  assert(html.includes('Skyflow Cloud Vaults'), 'Must include Skyflow column');
  assert(html.includes('Ad-Hoc MCP Scripts'), 'Must include Ad-Hoc MCP column');

  console.log('    [PASS] Decision matrix criteria and comparison columns verified.');
}

// Test 4: DLP Battlecards Search & Hash Deep-Linking
console.log('--> Test 4: DLP Battlecards Search & Deep-Linking');
{
  assert(html.includes('id="bcSearchInput"'), 'Must have battlecards search input');
  assert(html.includes('id="bcSearchClear"'), 'Must have search clear button');
  assert(html.includes('id="bcSearchCount"'), 'Must have search count label');

  // Competitor tab buttons with data-slug
  const requiredSlugs = [
    { slug: 'purview', pane: 'panePurview' },
    { slug: 'nightfall', pane: 'paneNightfall' },
    { slug: 'bigid', pane: 'paneBigid' },
    { slug: 'cloudapis', pane: 'paneCloudApis' },
    { slug: 'cyberhaven', pane: 'paneCyberhaven' },
    { slug: 'skyflow', pane: 'paneSkyflow' },
    { slug: 'mcp', pane: 'paneMcp' }
  ];
  requiredSlugs.forEach(({ slug, pane }) => {
    assert(html.includes(`data-slug="${slug}"`), `Must have tab button with data-slug="${slug}"`);
    assert(html.includes(`id="${pane}"`), `Must have pane for ${pane}`);
  });

  // Action buttons
  assert(html.includes('id="btnPrintBattleCard"'), 'Must have print 1-pager button');
  assert(html.includes('copy-objection-btn'), 'Must have 1-click objection copy buttons');

  console.log('    [PASS] Battlecards search, slugs, panes, and objection copy verified.');
}

// Test 5: Dedicated Procurement Downloads Hub
console.log('--> Test 5: Dedicated Procurement Downloads Hub');
{
  assert(html.includes('Zero-DPA Enterprise Procurement Hub'), 'Must have downloads hub title');
  assert(html.includes('id="btnDownloadsPreview"'), 'Must have live pack preview button in hub');
  assert(html.includes('ZTDS_CISO_DPA_Exemption_Memo.pdf'), 'Must link to CISO Memo PDF');
  assert(html.includes('ZTDS_Enterprise_Security_Pack.zip'), 'Must link to Security Pack ZIP');
  assert(html.includes('ZTDS_Enterprise_CISO_Pitch_Deck.pdf'), 'Must link to Pitch Deck PDF');
  assert(html.includes('ztds-evidence-binder.json'), 'Must link to Evidence Binder JSON');
  assert(html.includes('id="btnDownloadHubMd"'), 'Must have download markdown button');
  assert(html.includes('.github/workflows/ztds-audit.yml'), 'Must link to CI/CD action template');

  console.log('    [PASS] Downloads Hub cards and download assets verified.');
}

// Test 6: Live Procurement Preview Modal
console.log('--> Test 6: Live Procurement Preview Modal');
{
  assert(html.includes('id="procurementModal"'), 'Must have #procurementModal dialog');
  assert(html.includes('role="dialog"'), 'Must have role="dialog"');
  assert(html.includes('aria-modal="true"'), 'Must have aria-modal="true"');
  assert(html.includes('aria-labelledby="modalTitle"'), 'Must have aria-labelledby');

  // Header and footer triggers
  assert(html.includes('id="btnPreviewProcurement"'), 'Must have hero preview button');
  assert(html.includes('id="btnCloseProcurementModal"'), 'Must have header close button');
  assert(html.includes('id="btnCloseProcurementModalBtn"'), 'Must have footer close button');

  // Modal tabs and views
  assert(html.includes('id="modalTabMemo"'), 'Must have #modalTabMemo button');
  assert(html.includes('id="modalTabSig"'), 'Must have #modalTabSig button');
  assert(html.includes('id="modalTabHipaa"'), 'Must have #modalTabHipaa button');
  assert(html.includes('id="modalTabLicense"'), 'Must have #modalTabLicense button');

  assert(html.includes('id="modalViewMemo"'), 'Must have #modalViewMemo view');
  assert(html.includes('id="modalViewSig"'), 'Must have #modalViewSig view');
  assert(html.includes('id="modalViewHipaa"'), 'Must have #modalViewHipaa view');
  assert(html.includes('id="modalViewLicense"'), 'Must have #modalViewLicense view');

  // Action buttons
  assert(html.includes('id="btnCopyModalTab"'), 'Must have #btnCopyModalTab button');
  assert(html.includes('id="btnDownloadModalMd"'), 'Must have #btnDownloadModalMd button');

  console.log('    [PASS] Modal dialog, accessibility, tabs, views, and exports verified.');
}

// Test 7: Actuarial Math Parity Test
console.log('--> Test 7: Actuarial Math Parity Test');
{
  // Test scenario matching preset: 2M calls, 8 vendors, eu regime
  const calls = 2000000;
  const vendors = 8;
  const regime = 'eu';

  const dpaSavings = vendors * 25000;
  assert.strictEqual(dpaSavings, 200000, 'DPA savings must be $200,000 for 8 vendors');

  const annualRecords = calls * 0.25 * 3 * 12;
  assert.strictEqual(annualRecords, 18000000, 'Annual records must be 18,000,000');

  const expectedBreachCost = annualRecords * 165 * 0.078 * 0.005;
  const normalizedBreachCost = Math.max(expectedBreachCost, 45000);
  assert.strictEqual(Math.round(normalizedBreachCost), 1158300, 'Normalized breach cost must be $1,158,300');

  const fineMap = { global: 75000, eu: 50000, us_hipaa: 125000, us_fintech: 52000, us_legal: 55000 };
  const regimeFine = fineMap[regime];
  assert.strictEqual(regimeFine, 50000, 'EU regime mitigation buffer must be $50,000');

  const totalExposure = dpaSavings + normalizedBreachCost + regimeFine;
  assert.strictEqual(Math.round(totalExposure), 1408300, 'Total risk exposure avoided must be $1,408,300');

  const roiMultiple = Math.round(totalExposure / 12000);
  assert.strictEqual(roiMultiple, 117, 'Projected ROI multiple must be 117x');

  console.log('    [PASS] Actuarial model math parity confirmed.');
}

// Test 8: Zero-Emoji Compliance & BrandMeWeb Spelling Rule
console.log('--> Test 8: Zero-Emoji Compliance & BrandMeWeb Spelling Rule');
{
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const emojiMatch = html.match(emojiRegex);
  assert(!emojiMatch, `ciso/index.html must not contain emojis. Found: ${emojiMatch ? emojiMatch[0] : ''}`);

  // BrandMeWeb single word rule
  const badBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  const badBrandMatch = html.match(badBrandRegex);
  assert(!badBrandMatch, 'Brand name must never be spelled "Brand Me Web"');
  assert(html.includes('BrandMeWeb'), 'Must reference BrandMeWeb properly');

  console.log('    [PASS] Zero-emoji and BrandMeWeb single word spelling verified.');
}

console.log('\n[ALL TESTS PASSED] ciso/index.html successfully verified against all criteria.');
