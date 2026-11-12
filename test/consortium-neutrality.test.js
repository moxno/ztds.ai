/**
 * ZTDS.ai — Consortium Neutrality, Two-Brand Firewall & Black-Box Guard Test Suite
 *
 * Enforces:
 * 1. Two-Brand Firewall (Option 1 SSOT): Zero commercial subscription prices, agency retainer fees,
 *    or cash bug bounty pools across public HTML pages, CLI tools, API routes, legal order templates,
 *    and LLM corpora (llms.txt, llms-full.txt).
 * 2. Black-Box Appliance Guard: Zero internal regex mechanism terms, commercial client-side
 *    parsing library names, or internal commercial storage/rule/state identifiers on public surfaces.
 * 3. Patent Prosecution Guard: Zero unpublished patent application numbers, filing dates,
 *    WIPO DAS codes, or internal filing order numbers across the repository.
 * 4. Commercial Handoff Routing: Certified commercial engine references route cleanly to
 *    https://privacyscrubber.com/pricing/ and https://brandmeweb.com.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Consortium Neutrality, Two-Brand Firewall & Black-Box Guard Suite...\n');

const ROOT = path.resolve(__dirname, '..');

function collectHtmlFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'docs' || entry.name === 'public' || entry.name === 'stitch_export') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(fullPath, list);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      list.push(path.relative(ROOT, fullPath));
    }
  }
  return list;
}

function collectJsFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath, list);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      list.push(path.relative(ROOT, fullPath));
    }
  }
  return list;
}

const PUBLIC_HTML_FILES = collectHtmlFiles(ROOT);
const CLIENT_JS_FILES = ['nav.js', ...collectJsFiles(path.join(ROOT, 'assets/js'))];

const CLI_AND_API_FILES = [
  'bin/ztds-audit.js',
  'bin/ztds-verify.js',
  'bin/ztds-agent.js',
  'bin/ztds-ciso.js',
  'bin/ztds-agency.js',
  'bin/ztds-bench.js',
  'api/scan-domain.js',
  'api/lead-capture.js'
];

const LEGAL_AND_CORPUS_FILES = [
  'llms.txt',
  'llms-full.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'docs/legal/order-form.html',
  'public/docs/legal/order-form.html',
  'docs/legal/OFFLINE_LICENSING_SPECIFICATION.md',
  'public/docs/legal/OFFLINE_LICENSING_SPECIFICATION.md',
  'docs/legal/ENTERPRISE_ORDER_FORM_TEMPLATE.md',
  'public/docs/legal/ENTERPRISE_ORDER_FORM_TEMPLATE.md',
  'docs/legal/README_LEGAL_PROCUREMENT_GUIDE.md',
  'public/docs/legal/README_LEGAL_PROCUREMENT_GUIDE.md',
  'docs/ZTDS_Technical_API_CLI_and_Action_Spec.md',
  'docs/ZTDS_Developer_Engine_SDK_and_MCP_Guide.md',
  'docs/ZTDS_Canonical_Blueprints_and_GTM_Playbook.md',
  'docs/ZTDS_Entity_Taxonomy_and_25_Profiles_SSOT.md'
];

const ALL_SURFACES = [
  ...PUBLIC_HTML_FILES,
  ...CLIENT_JS_FILES,
  ...CLI_AND_API_FILES,
  ...LEGAL_AND_CORPUS_FILES
];

// Test 1: Zero Commercial Price Tags & Cash Bounty Pools (Two-Brand Firewall)
console.log('--> Test 1: Two-Brand Firewall — Zero Commercial Price Tags & Cash Bounties');
{
  const forbiddenPricePatterns = [
    { regex: /\$15\s*\/\s*mo/i, label: 'PRO monthly price ($15/mo)' },
    { regex: /\$110\s+Lifetime/i, label: 'PRO lifetime price ($110 Lifetime)' },
    { regex: /\$99\s*\/\s*mo/i, label: 'TEAMS monthly price ($99/mo)' },
    { regex: /\$990\s*\/\s*(?:yr|year)/i, label: 'TEAMS annual price ($990/yr)' },
    { regex: /\$199\s*\/\s*(?:mo|month)/i, label: 'Legacy SDK monthly price ($199/mo)' },
    { regex: /\$1,990\b/i, label: 'Legacy SDK annual price ($1,990)' },
    { regex: /\$299\s*\/\s*(?:mo|month)/i, label: 'Commercial SDK monthly price ($299/mo) on consortium surface' },
    { regex: /\$2,990\b/i, label: 'Commercial SDK annual price ($2,990) on consortium surface' },
    { regex: /\$12,000\s*(?:USD\s*)?\/\s*(?:yr|year)/i, label: 'Enterprise Air-Gapped price ($12,000/yr)' },
    { regex: /\$12,000\.00/i, label: 'Hardcoded $12,000.00 order total' },
    { regex: /\$12k\s*\/\s*yr/i, label: 'Enterprise $12k/yr shorthand' },
    { regex: /(?:Global.*Site\s+License|global_site|Option C:)[^\n]*\$50,000|\$50,000\s+USD\s*\/\s*Year/i, label: 'Global Site License price ($50,000/yr)' },
    { regex: /\$2,500\b/i, label: 'Agency setup fee ($2,500) or cash bounty' },
    { regex: /\$2\.5k\b/i, label: 'Agency setup fee ($2.5k)' },
    { regex: /\$500\s*\/\s*mo/i, label: 'Agency monthly retainer fee ($500/mo)' },
    { regex: /\$150,000\s*(?:USD|bug\s+bounty|bounty\s+pool)/i, label: 'Cash bug bounty pool ($150,000)' }
  ];

  for (const relPath of ALL_SURFACES) {
    const fullPath = path.join(ROOT, relPath);
    assert(fs.existsSync(fullPath), `Surface file missing: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');

    for (const { regex, label } of forbiddenPricePatterns) {
      const match = content.match(regex);
      assert(
        !match,
        `[Two-Brand Firewall Violation] Forbidden ${label} ("${match ? match[0] : ''}") found in ${relPath}`
      );
    }
  }

  console.log(`    [PASS] Verified ${ALL_SURFACES.length} public surfaces contain 0 commercial price tags or cash bounties.`);
}

// Test 2: Black-Box Appliance Guard (Zero Internal Mechanism & Library Leaks)
console.log('\n--> Test 2: Black-Box Appliance Guard — Zero Internal Mechanism & Library Disclosures');
{
  const mechRegex = new RegExp(`\\b${['look', '(?:around|behind|ahead)s?'].join('')}\\b`, 'i');
  const libNames = [
    ['Tesseract', 'js'].join('\\.'),
    ['Mammoth', 'js'].join('\\.'),
    ['Sheet', 'JS'].join(''),
    ['PDF', 'js'].join('\\.'),
    ['lib', 'sodium'].join('')
  ];
  const internalIds = [
    ['ps', 'vault'].join('_'),
    ['ps_custom', 'rules'].join('_'),
    ['REGEX', 'RULES'].join('_'),
    ['PROFILE', 'RULES'].join('_'),
    ['customMatch', 'Rules'].join(''),
    ['_ztds_encrypted', 'vault'].join('_'),
    ['ztds-form-guard', 'min\\.js'].join('\\.'),
    ['bW94bm8v', 'UHJpdmFjeVNjcnViYmVy'].join('')
  ];
  const privRepoEsc = ['github\\.com', 'moxno', 'PrivacyScrubber'].join('\\/');
  const sessionMapKey = ['session', 'Map'].join('');

  const forbiddenMechanismPatterns = [
    { regex: mechRegex, label: 'Regex mechanism disclosure' },
    { regex: new RegExp(`\\b(?:${libNames.join('|')})\\b`, 'i'), label: 'Third-party library name' },
    { regex: new RegExp(`\\b(?:${internalIds.join('|')})\\b|${privRepoEsc}`, 'i'), label: 'Internal storage/variable/bundle/private-repo identifier' },
    { regex: new RegExp(['regex fails:\\s*no', 'Luhn validation'].join(' '), 'i'), label: 'Internal checksum mechanism comparison' }
  ];

  for (const relPath of ALL_SURFACES) {
    const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    for (const { regex, label } of forbiddenMechanismPatterns) {
      const match = content.match(regex);
      assert(
        !match,
        `[Black-Box Violation] Forbidden ${label} ("${match ? match[0] : ''}") found in ${relPath}`
      );
    }
  }

  // Verify public corpora and SDK docs use tokenMap instead of internal state map key
  const sessionMapCheckedFiles = [
    'llms.txt',
    'llms-full.txt',
    'public/llms.txt',
    'public/llms-full.txt',
    'sdk/index.html',
    'companies/index.html',
    'companies/apex-health-ai/index.html',
    'docs/ZTDS_Technical_API_CLI_and_Action_Spec.md',
    'docs/ZTDS_Developer_Engine_SDK_and_MCP_Guide.md',
    'docs/ZTDS_Canonical_Blueprints_and_GTM_Playbook.md'
  ];

  const sessionMapRegex = new RegExp(`\\b${sessionMapKey}\\b`, 'i');
  for (const relPath of sessionMapCheckedFiles) {
    const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    assert(
      !sessionMapRegex.test(content),
      `[Black-Box Violation] Internal map identifier found in ${relPath} (use tokenMap)`
    );
  }

  console.log('    [PASS] Zero internal regex mechanisms, storage keys, or library names leaked.');
}

// Test 3: Patent Prosecution Guard (Zero Application Number, Filing Date, or DAS Code Leaks)
console.log('\n--> Test 3: Patent Prosecution Guard — Zero Internal Patent Filing Details on Public Surfaces');
{
  const patAppNum = ['331', '905'].join('');
  const patFilingDate = ['14', '09', '2026'].join('/');
  const patFilingDateEn = ['September 14,', ' 2026'].join('');
  const wipoDasCode = ['B1', '7B'].join('');
  const internalOrderId = ['942', '21'].join('');

  for (const relPath of ALL_SURFACES) {
    const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    assert(!content.includes(patAppNum), `[Patent Guard Violation] Internal patent number found in ${relPath}`);
    assert(!content.includes(patFilingDate), `[Patent Guard Violation] Internal patent filing date found in ${relPath}`);
    assert(!content.includes(patFilingDateEn), `[Patent Guard Violation] Internal patent filing date (EN) found in ${relPath}`);
    assert(!new RegExp(`\\b${wipoDasCode}\\b`).test(content), `[Patent Guard Violation] WIPO DAS code found in ${relPath}`);
    assert(!new RegExp(`\\b${internalOrderId}\\b`).test(content), `[Patent Guard Violation] Internal filing order ID found in ${relPath}`);
  }

  const termsHtml = fs.readFileSync(path.join(ROOT, 'terms/index.html'), 'utf8');
  const llmsTxt = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
  assert(
    termsHtml.includes('U.S. &amp; International Patents Pending') || termsHtml.includes('U.S. & International Patents Pending'),
    'terms/index.html must include public statutory Patents Pending notice'
  );
  assert(
    llmsTxt.includes('U.S. & International Patents Pending'),
    'llms.txt must include public statutory Patents Pending notice'
  );

  console.log('    [PASS] Zero internal patent numbers, filing dates, or WIPO DAS codes exposed on public surfaces.');
}

// Test 4: Commercial Handoff & Rule File Presence
console.log('\n--> Test 4: Institutional Handoff Routing & Permanent Rule Integrity');
{
  const sdkHtml = fs.readFileSync(path.join(ROOT, 'sdk/index.html'), 'utf8');
  const securityHtml = fs.readFileSync(path.join(ROOT, 'security/index.html'), 'utf8');
  const agencyBundle = fs.readFileSync(path.join(ROOT, 'agency/index.html'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'assets/js/pages/agency.js'), 'utf8');

  assert(sdkHtml.includes('https://privacyscrubber.com/pricing'), 'sdk/index.html must route commercial licensing to privacyscrubber.com/pricing');
  assert(securityHtml.includes('Vulnerability Severity &amp; Recognition Matrix'), 'security/index.html must display non-monetary Vulnerability Severity & Recognition Matrix');
  assert(agencyBundle.includes('Phase 1: Initial Snapshot Audit') && agencyBundle.includes('Phase 2: Ongoing Governance Retainer'), 'agency page/module must display scope-based two-phase structure');

  console.log('    [PASS] Institutional handoff routing and recognition matrices verified.');
}

// Test 5: Repository-Wide 7-Vector & Zero-Hebrew Ratchet (git ls-files)
console.log('\n--> Test 5: Repository-Wide 7-Vector & Zero-Hebrew Ratchet (All Tracked Files)');
{
  const { execSync } = require('child_process');
  const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  const hebrewRegex = /[\u0590-\u05FF]/;
  const patAppNum = ['331', '905'].join('');
  const patFilingDate = ['14', '09', '2026'].join('/');
  const patDeadlineDate = ['14', '09', '2027'].join('/');
  const tmFilingDate = ['20', '09', '2026'].join('/');
  const tmDeadlineDate = ['20', '03', '2027'].join('/');
  const wipoDasCode = ['B1', '7B'].join('');
  const attorneyDomain = ['levy', 'patent'].join('');
  const privRepo = ['github.com/moxno/', 'PrivacyScrubber'].join('');
  const mrrTarget = ['40,000', ' ILS'].join('');
  const sessionMapRegex = new RegExp(`\\b${['session', 'Map'].join('')}\\b`, 'i');
  const fuzzyRegex = new RegExp(`\\b${['FUZZY_RECOVERY', 'REGEX'].join('_')}\\b`);
  const gtmJargonRegex = new RegExp(`\\b${['anti', 'cannibalization'].join('-')}\\b`, 'i');

  let checkedCount = 0;
  for (const relPath of trackedFiles) {
    if (relPath.startsWith('.agents/') || relPath.startsWith('.agent/')) {
      continue;
    }
    const fullPath = path.join(ROOT, relPath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) continue;
    if (/\.(png|jpg|jpeg|webp|ico|woff2?|ttf|eot|pdf|zip)$/i.test(relPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    checkedCount++;

    assert(!hebrewRegex.test(content), `[Zero-Hebrew Violation] Hebrew character found in tracked file: ${relPath}`);
    assert(!content.includes(patAppNum), `[V6 Patent Number Leak] Found in tracked file: ${relPath}`);
    assert(!content.includes(patFilingDate), `[V6 Patent Filing Date Leak] Found in tracked file: ${relPath}`);
    assert(!content.includes(patDeadlineDate), `[V6 Patent Priority Deadline Leak] Found in tracked file: ${relPath}`);
    assert(!content.includes(tmFilingDate), `[V6 Trademark Filing Date Leak] Found in tracked file: ${relPath}`);
    assert(!content.includes(tmDeadlineDate), `[V6 Trademark Deadline Leak] Found in tracked file: ${relPath}`);
    assert(!new RegExp(`\\b${wipoDasCode}\\b`).test(content), `[V6 WIPO DAS Code Leak] Found in tracked file: ${relPath}`);
    assert(!new RegExp(attorneyDomain, 'i').test(content), `[V6 Attorney Email Leak] Found in tracked file: ${relPath}`);
    assert(!new RegExp(privRepo, 'i').test(content), `[V6 Private Repo URL Leak] Found in tracked file: ${relPath}`);
    assert(!content.includes(mrrTarget), `[V5 Internal MRR Target Leak] Found in tracked file: ${relPath}`);
    assert(!sessionMapRegex.test(content), `[V2 Internal Key Leak] Found in tracked file: ${relPath}`);
    assert(!fuzzyRegex.test(content), `[V2 Internal Regex Key Leak] Found in tracked file: ${relPath}`);
    assert(!gtmJargonRegex.test(content), `[V5 Internal GTM Jargon Leak] Found in tracked file: ${relPath}`);
  }

  console.log(`    [PASS] Scanned ${checkedCount} tracked files across git index: 0 Hebrew characters, 0 IP/Date leaks, 0 internal keys.`);
}

console.log('\n[PASS] All 5 ZTDS Consortium Neutrality, Two-Brand Firewall & Black-Box Guard Tests Passed!\n');
