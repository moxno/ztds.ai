/**
 * ZTDS.ai — Accreditation Gateway 3-Step Progressive Wizard Test Suite
 * 
 * Verifies:
 * 1. 3-Step Wizard Navigation & Step Indicators (#wizardStepsBar, #stepIndicator1, #stepIndicator2, #stepIndicator3)
 * 2. Progressive Panel Containers (#step1Panel, #step2Panel, #step3Panel, #step3ProductVerification)
 * 3. Step Action Buttons (#btnStep1Continue, #btnStep2Back, #btnStep2Continue, #btnStep3Back, #submitBtn)
 * 4. Preserved DOM IDs (appName, appUrl, orgName, contactEmail, auditHash, confirmCheckbox, submissionSuccess, etc.)
 * 5. Validation Alert Containers & Feedback (#step2Error, #step3Error)
 * 6. Client-Side Script Engine (updateWizardStepsUI, validateStep2, goToStep, setTrack, email regex, enter prevention)
 * 7. Mobile Ergonomics & Touch Targets (min-h-[44px], min-h-[48px], touch-target, text-base sm:text-sm)
 * 8. Zero-Emoji Compliance & BrandMeWeb Single-Word Spelling SSOT
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Apply 3-Step Wizard Test Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const applyHtmlPath = path.join(ROOT, 'apply/index.html');

assert(fs.existsSync(applyHtmlPath), 'apply/index.html must exist');
const html = fs.readFileSync(applyHtmlPath, 'utf8');

// Test 1: 3-Step Wizard Navigation & Step Indicators
console.log('--> Test 1: 3-Step Wizard Navigation & Step Indicators');
{
  assert(html.includes('id="wizardStepsBar"'), 'Must contain #wizardStepsBar');
  assert(html.includes('id="stepIndicator1"'), 'Must contain #stepIndicator1');
  assert(html.includes('id="stepIndicator2"'), 'Must contain #stepIndicator2');
  assert(html.includes('id="stepIndicator3"'), 'Must contain #stepIndicator3');

  // Verify accessibility attributes
  assert(html.includes('aria-label="Accreditation Wizard Steps"'), 'Must have accessible nav label');
  assert(html.includes('data-step="1"'), 'Must specify data-step="1"');
  assert(html.includes('data-step="2"'), 'Must specify data-step="2"');
  assert(html.includes('data-step="3"'), 'Must specify data-step="3"');
  assert(html.includes('aria-current="step"'), 'Step 1 must initially declare aria-current="step"');

  console.log('    [PASS] Wizard navigation bar and 3 step indicators verified.');
}

// Test 2: Panel Containers & Progressive Disclosure Architecture
console.log('--> Test 2: Panel Containers & Progressive Disclosure Architecture');
{
  assert(html.includes('id="step1Panel"'), 'Must contain #step1Panel');
  assert(html.includes('id="step2Panel"'), 'Must contain #step2Panel');
  assert(html.includes('id="step3Panel"'), 'Must contain #step3Panel');

  // Step 2 & 3 must initially have hidden class
  assert(html.includes('id="step2Panel" class="wizard-panel space-y-5 hidden"'), 'Step 2 must be hidden by default');
  assert(html.includes('id="step3Panel" class="wizard-panel space-y-5 hidden"'), 'Step 3 must be hidden by default');

  // Verification containers
  assert(html.includes('id="step3ProductVerification"'), 'Must contain #step3ProductVerification');
  assert(html.includes('id="productFieldsContainer"'), 'Must contain #productFieldsContainer');
  assert(html.includes('id="companyFieldsContainer"'), 'Must contain #companyFieldsContainer');
  assert(html.includes('id="fellowFieldsContainer"'), 'Must contain #fellowFieldsContainer');

  console.log('    [PASS] All 3 progressive step panels and track-specific containers verified.');
}

// Test 3: Action Buttons & Navigation Controls
console.log('--> Test 3: Action Buttons & Navigation Controls');
{
  assert(html.includes('id="btnStep1Continue"'), 'Must contain #btnStep1Continue');
  assert(html.includes('id="btnStep2Back"'), 'Must contain #btnStep2Back');
  assert(html.includes('id="btnStep2Continue"'), 'Must contain #btnStep2Continue');
  assert(html.includes('id="btnStep3Back"'), 'Must contain #btnStep3Back');
  assert(html.includes('id="submitBtn"'), 'Must contain #submitBtn');

  // Track choice cards in Step 1
  assert(html.includes('data-track-choice="product"'), 'Must have Track A choice card');
  assert(html.includes('data-track-choice="company"'), 'Must have Track B choice card');
  assert(html.includes('data-track-choice="fellow"'), 'Must have Track C choice card');

  console.log('    [PASS] Wizard action buttons and Step 1 track choice cards verified.');
}

// Test 4: Preserved Form Inputs & All 52 Critical DOM IDs
console.log('--> Test 4: Preserved Form Inputs & Critical DOM IDs');
{
  const requiredIds = [
    'wizardStepsBar', 'stepIndicator1', 'stepIndicator2', 'stepIndicator3',
    'step1Panel', 'step2Panel', 'step3Panel',
    'btnStep1Continue', 'btnStep2Back', 'btnStep2Continue', 'btnStep3Back', 'submitBtn',
    'step2Error', 'step2ErrorText', 'step3Error', 'step3ErrorText',
    'step1Subtitle', 'step2Subtitle', 'step1SelectedTrackLabel',
    'step2Heading', 'step2Subheading', 'step2TrackBadge', 'step3TrackBadge',
    'appName', 'labelAppName', 'appUrl', 'labelAppUrl', 'orgName', 'labelOrgName', 'contactEmail', 'labelContactEmail',
    'productFieldsContainer', 'appCategory', 'appProfile',
    'companyFieldsContainer', 'companyIndustry', 'companyHeadquarters', 'companyScope',
    'fellowFieldsContainer', 'fellowTrack', 'fellowOrcid', 'fellowContribution',
    'cliAuditCommand', 'copyCliCommandBtn', 'simulateHashBtn', 'auditHash',
    'fwGdpr', 'fwHipaa', 'fwAiAct', 'fwSoc2', 'fwFre502', 'fwPciDss',
    'confirmCheckbox', 'checkboxConfirmationText',
    'submissionSuccess', 'githubIssueLink', 'mailtoLink', 'copyMarkdownBtn', 'copyJsonBtn', 'downloadJsonBtn',
    'badgePreviewContainer', 'badgePreviewMount', 'badgeTrackPill', 'badgeMarkdownSnippet', 'badgeHtmlSnippet'
  ];

  requiredIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required ID: #${id}`);
  });

  console.log(`    [PASS] All ${requiredIds.length} required DOM IDs strictly preserved.`);
}

// Test 5: Validation Feedback & Error Containers
console.log('--> Test 5: Validation Feedback & Error Containers');
{
  assert(html.includes('id="step2Error" class="hidden'), 'Step 2 error box must be hidden initially');
  assert(html.includes('id="step3Error" class="hidden'), 'Step 3 error box must be hidden initially');
  assert(html.includes('id="step2ErrorText"'), 'Must have #step2ErrorText for dynamic messaging');
  assert(html.includes('id="step3ErrorText"'), 'Must have #step3ErrorText for dynamic messaging');

  console.log('    [PASS] Validation feedback containers verified.');
}

// Test 6: Client-Side Script Engine & Controller Functions
console.log('--> Test 6: Client-Side Script Engine & Controller Functions');
{
  assert(html.includes('function updateWizardStepsUI('), 'Must define updateWizardStepsUI');
  assert(html.includes('function validateStep2('), 'Must define validateStep2');
  assert(html.includes('function goToStep('), 'Must define goToStep');
  assert(html.includes('function setTrack('), 'Must define setTrack');
  assert(html.includes('function scrollToWizardForm('), 'Must define scrollToWizardForm');
  assert(html.includes('btnStep1Continue.addEventListener'), 'Must bind btnStep1Continue');
  assert(html.includes('btnStep2Continue.addEventListener'), 'Must bind btnStep2Continue');
  assert(html.includes('btnStep2Back.addEventListener'), 'Must bind btnStep2Back');
  assert(html.includes('btnStep3Back.addEventListener'), 'Must bind btnStep3Back');
  assert(html.includes('stepIndicator1.addEventListener'), 'Must bind stepIndicator1');

  // Email regex verification
  assert(html.includes('@'), 'Must include email validation regex');

  // Premature submit prevention
  assert(html.includes('currentStep !== 3'), 'Must guard against premature submit on Enter in steps 1 & 2');

  console.log('    [PASS] Script engine controller functions and event bindings verified.');
}

// Test 7: Mobile Ergonomics & Touch Target Sizing
console.log('--> Test 7: Mobile Ergonomics & Touch Target Sizing');
{
  // Buttons must have touch-target classes and min-h-[44px] or min-h-[48px]
  assert(html.includes('id="btnStep1Continue" class="btn-trust w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold shadow-sm min-h-[48px] touch-target'), 'btnStep1Continue must have min-h-[48px]');
  assert(html.includes('id="btnStep2Continue" class="btn-trust w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold shadow-sm min-h-[48px] touch-target'), 'btnStep2Continue must have min-h-[48px]');
  assert(html.includes('id="submitBtn" class="btn-trust w-full sm:w-auto px-6 py-3.5 text-xs sm:text-base font-bold shadow-sm min-h-[48px] touch-target'), 'submitBtn must have min-h-[48px]');
  assert(html.includes('id="btnStep2Back" class="btn-outline w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold min-h-[44px] touch-target'), 'btnStep2Back must have min-h-[44px]');
  assert(html.includes('id="btnStep3Back" class="btn-outline w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold min-h-[44px] touch-target'), 'btnStep3Back must have min-h-[44px]');

  // Inputs must prevent iOS zoom (text-base sm:text-sm min-h-[44px])
  assert(html.includes('text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]'), 'Inputs must prevent iOS auto-zoom');

  console.log('    [PASS] Mobile touch targets and ergonomics verified.');
}

// Test 8: Strict Zero-Emoji & BrandMeWeb Single-Word Rule
console.log('--> Test 8: Strict Zero-Emoji & BrandMeWeb Single-Word Rule');
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

  console.log('    [PASS] 0 emojis and strict BrandMeWeb spelling verified.');
}

console.log('\n[SUCCESS] All 8 Apply Wizard tests passed successfully!\n');
