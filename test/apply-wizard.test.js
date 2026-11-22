/**
 * ZTDS.ai — Accreditation Gateway 2-Step Audience-First Wizard Test Suite
 *
 * Verifies:
 * 1. 2-Step Wizard Navigation & Step Indicators (#wizardStepsBar, #stepIndicator1, #stepIndicator2)
 * 2. Unified Role Switcher & Progressive Step Panels (#step1Panel, #step2Panel, #step2ProductVerification, #step2NonProductNote)
 * 3. Action Buttons & Audience Sidebar (#btnStep1Continue, #btnStep2Back, #btnEditDetails, #submitBtn, #trackBenefitsCard)
 * 4. Preserved Form Inputs & Critical DOM IDs
 * 5. Bug-Fix & Security Ratchets (Default general profile, H1/H6 honeypots, pre-filled GitHub intake, Fast-Track Track A, awaited intake feedback, no simulated hash)
 * 6. Client-Side Script Engine & Deep-Link URL Hydration
 * 7. Mobile Ergonomics, Touch Targets, Zero Trusted-Types innerHTML Violations
 * 8. Strict Zero-Emoji, Legal Safe Harbor Wording, Two-Brand Firewall & BrandMeWeb Spelling SSOT
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Apply 2-Step Gateway Test Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const applyHtmlPath = path.join(ROOT, 'apply/index.html');
const applyJsPath = path.join(ROOT, 'assets/js/pages/apply.js');

assert(fs.existsSync(applyHtmlPath), 'apply/index.html must exist');
assert(fs.existsSync(applyJsPath), 'assets/js/pages/apply.js must exist');
const html = fs.readFileSync(applyHtmlPath, 'utf8');
const applyJs = fs.readFileSync(applyJsPath, 'utf8');
const bundle = html + '\n' + applyJs;

// Test 1: 2-Step Wizard Navigation & Step Indicators
console.log('--> Test 1: 2-Step Wizard Navigation & Step Indicators');
{
  assert(html.includes('id="wizardStepsBar"'), 'Must contain #wizardStepsBar');
  assert(html.includes('id="stepIndicator1"'), 'Must contain #stepIndicator1');
  assert(html.includes('id="stepIndicator2"'), 'Must contain #stepIndicator2');
  assert(!html.includes('id="stepIndicator3"'), 'Must NOT contain legacy 3rd step indicator #stepIndicator3');

  assert(html.includes('aria-label="Accreditation Wizard Steps"'), 'Must have accessible nav label');
  assert(html.includes('data-step="1"'), 'Must specify data-step="1"');
  assert(html.includes('data-step="2"'), 'Must specify data-step="2"');
  assert(html.includes('aria-current="step"'), 'Step 1 must initially declare aria-current="step"');

  console.log('    [PASS] 2-step wizard progress bar and step indicators verified.');
}

// Test 2: Unified Role Switcher & Progressive Panels
console.log('--> Test 2: Unified Role Switcher & Progressive Panels');
{
  assert(html.includes('role="tablist" aria-label="Accreditation Tracks" data-tabpanel="applyFormContainer"'), 'Must contain unified role tablist wired to #applyFormContainer');
  assert(html.includes('id="trackProductBtn"'), 'Must contain #trackProductBtn');
  assert(html.includes('id="trackCompanyBtn"'), 'Must contain #trackCompanyBtn');
  assert(html.includes('id="trackFellowBtn"'), 'Must contain #trackFellowBtn');
  assert(!html.includes('id="trackOverviewCards"'), 'Must NOT contain dead hidden #trackOverviewCards block');

  assert(html.includes('id="step1Panel"'), 'Must contain #step1Panel');
  assert(html.includes('id="step2Panel" class="wizard-panel space-y-5 hidden"'), 'Step 2 must be hidden by default');
  assert(!html.includes('id="step3Panel"'), 'Must NOT contain legacy #step3Panel');
  assert(html.includes('id="step2ProductVerification"'), 'Must contain #step2ProductVerification');
  assert(html.includes('id="step2NonProductNote"'), 'Must contain #step2NonProductNote');
  assert(html.includes('id="productFieldsContainer"'), 'Must contain #productFieldsContainer');
  assert(html.includes('id="companyFieldsContainer"'), 'Must contain #companyFieldsContainer');
  assert(html.includes('id="fellowFieldsContainer"'), 'Must contain #fellowFieldsContainer');
  assert(html.includes('id="trackBenefitsCard"'), 'Must contain dynamic #trackBenefitsCard sidebar');

  console.log('    [PASS] Unified role tablist, progressive step panels, and dynamic sidebar verified.');
}

// Test 3: Action Buttons & Navigation Controls
console.log('--> Test 3: Action Buttons & Navigation Controls');
{
  assert(html.includes('id="btnStep1Continue"'), 'Must contain #btnStep1Continue');
  assert(html.includes('id="btnStep2Back"'), 'Must contain #btnStep2Back');
  assert(html.includes('id="btnEditDetails"'), 'Must contain #btnEditDetails');
  assert(html.includes('id="submitBtn"'), 'Must contain #submitBtn');
  assert(!html.includes('id="simulateHashBtn"'), 'Must NOT contain #simulateHashBtn fake hash generator');

  console.log('    [PASS] Wizard action buttons verified.');
}

// Test 4: Preserved Form Inputs & Critical DOM IDs
console.log('--> Test 4: Preserved Form Inputs & Critical DOM IDs');
{
  const requiredIds = [
    'wizardStepsBar', 'stepIndicator1', 'stepIndicator2',
    'step1Panel', 'step2Panel', 'step2ProductVerification', 'step2NonProductNote',
    'btnStep1Continue', 'btnStep2Back', 'btnEditDetails', 'submitBtn',
    'step1Error', 'step1ErrorText', 'step2Error', 'step2ErrorText',
    'step1Subtitle', 'step2Subtitle', 'step1SelectedTrackLabel',
    'step2Subheading', 'step2TrackBadge', 'step2SummaryBar', 'summaryEntityName', 'summaryEntityUrl',
    'appName', 'labelAppName', 'appUrl', 'labelAppUrl', 'orgName', 'labelOrgName', 'contactEmail', 'labelContactEmail',
    'productFieldsContainer', 'appCategory', 'appProfile',
    'companyFieldsContainer', 'companyIndustry', 'companyHeadquarters', 'companyScope',
    'fellowFieldsContainer', 'fellowTrack', 'fellowOrcid', 'fellowContribution',
    'cliAuditCommand', 'copyCliCommandBtn', 'auditHash',
    'fwGdpr', 'fwHipaa', 'fwAiAct', 'fwSoc2', 'fwFre502', 'fwPciDss', 'fastTrackLicense',
    'confirmCheckbox', 'checkboxConfirmationText',
    'submissionSuccess', 'serverIntakeStatus', 'githubIssueLink', 'mailtoLink', 'copyMarkdownBtn', 'copyJsonBtn', 'downloadJsonBtn',
    'trackBenefitsCard', 'benefitsTrackLabel', 'benefitsTitle', 'benefitsList',
    'badgePreviewCard', 'badgePreviewContainer', 'badgePreviewMount', 'badgeTrackPill', 'badgeHintText', 'badgeEmbedDetails', 'badgeMarkdownSnippet', 'badgeHtmlSnippet', 'downloadBadgeSvgBtn'
  ];

  requiredIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required ID: #${id}`);
  });

  console.log(`    [PASS] All ${requiredIds.length} required DOM IDs verified.`);
}

// Test 5: Bug-Fix, Default Profile & Security Honeypot Ratchets
console.log('--> Test 5: Bug-Fix, Default Profile & Honeypot Ratchets');
{
  assert(html.includes('<option value="general" selected>'), 'Default Industry Profile must be general, not medical');
  assert(!html.includes('<option value="medical" selected>'), 'Medical profile must NOT be selected by default');
  assert(!html.includes('via `npx ztds-audit`'), 'FAQ must not render raw markdown backticks');

  assert(
    html.includes('name="website_url_confirm"') &&
      html.includes('name="org_fax_ext"') &&
      html.includes('name="botcheck"') &&
      html.includes('autocomplete="new-password"') &&
      html.includes('tabindex="-1"') &&
      html.includes('aria-hidden="true"'),
    'Form must include H1/H6 honeypot decoys safe from A11y and autofill'
  );

  assert(
    !applyJs.includes('sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24') &&
      applyJs.includes("'pending-board-audit'"),
    'Must use honest pending-board-audit status instead of hardcoded fake SHA-256'
  );

  assert(
    applyJs.includes('https://github.com/moxno/ztds.ai/issues/new?title=') &&
      bundle.includes('https://github.com/moxno/ztds.ai/pulls'),
    'Must build pre-filled GitHub issue URL AND keep live Pull Request link'
  );

  assert(
    applyJs.includes('Invariant Conformance Affirmation|Policy Affirmation|Affirmation'),
    'Must inject fastTrackLicense into Track A, Track B, and Track C submissions'
  );

  assert(
    applyJs.includes("fetch('/api/lead-capture/'") &&
      applyJs.includes("source: 'accreditation_wizard'") &&
      applyJs.includes('website_url_confirm:') &&
      applyJs.includes('serverIntakeStatus'),
    'Must await /api/lead-capture/ with honeypot fields and render intake status feedback'
  );

  assert(!applyJs.includes('innerHTML'), 'apply.js must comply with CSP Trusted Types (zero innerHTML)');

  console.log('    [PASS] All 4 functional bug fixes, H1/H6 honeypots, and CSP Trusted Types verified.');
}

// Test 6: Client-Side Script Engine & Deep-Link Hydration
console.log('--> Test 6: Client-Side Script Engine & Deep-Link Hydration');
{
  assert(html.includes('/assets/js/pages/apply.js'), 'apply/index.html must load external /assets/js/pages/apply.js');
  assert(applyJs.includes('function updateWizardStepsUI('), 'Must define updateWizardStepsUI');
  assert(applyJs.includes('function validateStep1('), 'Must define validateStep1');
  assert(applyJs.includes('function goToStep('), 'Must define goToStep');
  assert(applyJs.includes('function setTrack('), 'Must define setTrack');
  assert(applyJs.includes('function scrollToWizardForm('), 'Must define scrollToWizardForm');
  assert(applyJs.includes('btnStep1Continue.addEventListener'), 'Must bind btnStep1Continue');
  assert(applyJs.includes('btnStep2Back.addEventListener'), 'Must bind btnStep2Back');
  assert(applyJs.includes('btnEditDetails.addEventListener'), 'Must bind btnEditDetails');
  assert(applyJs.includes('stepIndicator1.addEventListener'), 'Must bind stepIndicator1');
  assert(applyJs.includes('stepIndicator2.addEventListener'), 'Must bind stepIndicator2');
  assert(applyJs.includes('currentStep !== 2'), 'Must guard against premature submit on Enter in Step 1');

  assert(applyJs.includes("urlParams.get('domain')"), 'Must hydrate ?domain=');
  assert(applyJs.includes("urlParams.get('profile')"), 'Must hydrate ?profile=');
  assert(applyJs.includes("urlParams.get('hash')"), 'Must hydrate ?hash=');
  assert(applyJs.includes("urlParams.get('company')"), 'Must hydrate ?company=');
  assert(applyJs.includes("urlParams.get('industry')"), 'Must hydrate ?industry=');

  console.log('    [PASS] Controller functions, IME-safe Step 1 Enter guard, and deep-link hydration verified.');
}

// Test 7: Mobile Ergonomics & Touch Target Sizing
console.log('--> Test 7: Mobile Ergonomics & Touch Target Sizing');
{
  assert(html.includes('id="btnStep1Continue" class="btn-trust w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold shadow-sm min-h-[48px] touch-target'), 'btnStep1Continue must have min-h-[48px]');
  assert(html.includes('id="submitBtn" class="btn-trust w-full sm:w-auto px-6 py-3.5 text-xs sm:text-base font-bold shadow-sm min-h-[48px] touch-target'), 'submitBtn must have min-h-[48px]');
  assert(html.includes('id="btnStep2Back" class="btn-outline w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold min-h-[44px] touch-target'), 'btnStep2Back must have min-h-[44px]');
  assert(html.includes('text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]'), 'Inputs must prevent iOS auto-zoom');

  console.log('    [PASS] Mobile touch targets and ergonomics verified.');
}

// Test 8: Zero-Emoji, Statutory Safe Harbor Wording, Two-Brand Firewall & BrandMeWeb SSOT
console.log('--> Test 8: Zero-Emoji, Legal Framing, Two-Brand Firewall & BrandMeWeb SSOT');
{
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const lines = html.split('\n');
  const emojiErrors = [];
  lines.forEach((line, i) => {
    if (emojiRegex.test(line)) {
      emojiErrors.push({ line: i + 1, content: line.trim() });
    }
  });
  assert.strictEqual(emojiErrors.length, 0, `Emoji violations in apply/index.html: ${JSON.stringify(emojiErrors)}`);

  const badBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  const brandErrors = [];
  lines.forEach((line, i) => {
    if (badBrandRegex.test(line)) {
      brandErrors.push({ line: i + 1, content: line.trim() });
    }
  });
  assert.strictEqual(brandErrors.length, 0, `Brand spelling violations in apply/index.html: ${JSON.stringify(brandErrors)}`);

  assert(!/eliminate DPA overhead|GDPR Art\. 28 Vendor Exemption|Zero-DPA compliance exclusion/i.test(bundle), 'Must use accurate Statutory Risk Minimization phrasing');
  assert(!/\$\s?\d/.test(html), 'apply/index.html must contain zero commercial prices');
  const applyJsStripped = applyJs.replace(/\$1/g, 'MATCH_1');
  assert(!/\$\s?\d/.test(applyJsStripped), 'apply.js must contain zero commercial prices');
  assert(!bundle.includes('github.com/ztds-ai/'), 'Must NOT contain dead 404 github.com/ztds-ai/ org links');

  console.log('    [PASS] Zero emojis, single-word BrandMeWeb, legal phrasing, and Two-Brand Firewall verified.');
}

console.log('\n[SUCCESS] All 8 Apply 2-Step Gateway tests passed successfully!\n');
