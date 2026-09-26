/**
 * ZTDS.ai — WIPO International IP Portfolio & Statutory Compliance Test Suite
 * 
 * Verifies the integrity of:
 * 1. Israel Patent Application IL 331905 anchor, WIPO DAS code B17B, and PCT 12-month timeline.
 * 2. Israel Trademark Application ILPO #182655957, Nice Classes 9 & 42, and Madrid 6-month timeline.
 * 3. PCT Specification & 20 Claims Tree (Claims 1, 11, 18, 19, 20 independent).
 * 4. Madrid System Form MM2 dossier, designated offices, and certification mark governance.
 * 5. Master IP Portfolio & Statutory Calendar SSOT chronogram.
 * 6. Two-brand isolation and zero commercial engine leakage gate.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS WIPO International IP Portfolio & Statutory Compliance Suite...\n');

const LEGAL_DIR = path.join(__dirname, '..', 'docs', 'legal');
const PCT_SPEC_PATH = path.join(LEGAL_DIR, 'WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.md');
const MADRID_DOSSIER_PATH = path.join(LEGAL_DIR, 'WIPO_MADRID_TRADEMARK_FILING_DOSSIER.md');
const MASTER_IP_SSOT_PATH = path.join(LEGAL_DIR, 'WIPO_IP_PORTFOLIO_AND_CALENDAR_SSOT.md');
const README_GUIDE_PATH = path.join(LEGAL_DIR, 'README_LEGAL_PROCUREMENT_GUIDE.md');

// Test 1: Patent IL 331905 Integrity & Statutory Dates
console.log('--> Test 1: Patent IL 331905 Priority Anchor & WIPO DAS Verification');
{
  assert(fs.existsSync(PCT_SPEC_PATH), 'PCT Patent Specification file must exist');
  const pctContent = fs.readFileSync(PCT_SPEC_PATH, 'utf8');

  // Verify Patent Application Number
  assert(pctContent.includes('IL 331905'), 'PCT spec must cite Israel Patent Application IL 331905');
  
  // Verify Priority Filing Date
  assert(pctContent.includes('14/09/2026') || pctContent.includes('September 14, 2026'), 'Filing date must be 14/09/2026');

  // Verify WIPO DAS Access Code
  assert(pctContent.includes('B17B'), 'WIPO DAS Access Code must be B17B');

  // Verify Statutory 12-Month PCT Filing Deadline
  assert(pctContent.includes('14/09/2027') || pctContent.includes('September 14, 2027'), 'PCT deadline must be 14/09/2027');

  // Verify International Patent Classifications
  assert(pctContent.includes('G06F 21/62'), 'Must include IPC G06F 21/62');
  assert(pctContent.includes('G06F 21/60'), 'Must include IPC G06F 21/60');
  assert(pctContent.includes('G06N 3/00'), 'Must include IPC G06N 3/00');
  assert(pctContent.includes('H04L 9/00'), 'Must include IPC H04L 9/00');

  // Verify Applicant / Inventor Identity
  assert(pctContent.includes('Ilya Sibiryakov'), 'Applicant/Inventor must be Ilya Sibiryakov');
  console.log('    [OK] Patent IL 331905 priority anchor and WIPO DAS B17B verified.');
}

// Test 2: Trademark ILPO Order #182655957 & Madrid Protocol Deadlines
console.log('\n--> Test 2: Trademark ILPO #182655957 Anchor & Madrid Protocol Verification');
{
  assert(fs.existsSync(MADRID_DOSSIER_PATH), 'Madrid Trademark Dossier file must exist');
  const madridContent = fs.readFileSync(MADRID_DOSSIER_PATH, 'utf8');

  // Verify Basic Application Number
  assert(madridContent.includes('182655957'), 'Madrid dossier must cite basic application #182655957');

  // Verify Basic Filing Date
  assert(madridContent.includes('20/09/2026') || madridContent.includes('September 20, 2026'), 'Basic application filing date must be 20/09/2026');

  // Verify Statutory 6-Month Paris Convention Deadline
  assert(madridContent.includes('20/03/2027') || madridContent.includes('March 20, 2027'), 'Madrid 6-month priority deadline must be 20/03/2027');

  // Verify Nice Classification Coverage (Classes 9 and 42)
  assert(madridContent.includes('Class 9') && madridContent.includes('Class 42'), 'Must cover Nice Classes 9 and 42');

  // Verify Designated Contracting Parties (US, EU, UK, JP, CA, CH, AU, SG)
  const designatedOffices = ['USPTO', 'EUIPO', 'UKIPO', 'JPO', 'CIPO', 'IPI', 'IP Australia', 'IPOS'];
  for (const office of designatedOffices) {
    assert(madridContent.includes(office), `Must include designated office ${office}`);
  }

  // Verify Standard Character Word Mark & Certification Mark
  assert(madridContent.includes('ZTDS') && madridContent.includes('ZTDS VERIFIED'), 'Must include word mark and certification mark');
  console.log('    [OK] Trademark #182655957, Madrid deadline 20/03/2027, and Classes 9 & 42 verified.');
}

// Test 3: PCT Patent Specification 20 Claims Tree Structure
console.log('\n--> Test 3: PCT Specification 20 Claims Tree & Technical Invariants');
{
  const pctContent = fs.readFileSync(PCT_SPEC_PATH, 'utf8');

  // Verify all 5 Independent Claims exist
  assert(pctContent.includes('Claim 1 (Independent Method Claim)'), 'Must include Claim 1 Independent Method');
  assert(pctContent.includes('Claim 11 (Independent Apparatus Claim)'), 'Must include Claim 11 Independent Apparatus');
  assert(pctContent.includes('Claim 18 (Independent Non-Transitory Computer-Readable Medium Claim)'), 'Must include Claim 18 Independent CRM');
  assert(pctContent.includes('Claim 19 (Independent Distributed Multi-Agent System Claim)'), 'Must include Claim 19 Independent Agent System');
  assert(pctContent.includes('Claim 20 (Independent Cryptographic Conformance Verification Claim)'), 'Must include Claim 20 Independent Verification');

  // Verify all 20 claims are enumerated
  for (let c = 1; c <= 20; c++) {
    assert(pctContent.includes(`Claim ${c}`), `Must contain Claim ${c}`);
  }

  // Verify 4 Foundational Invariants are referenced
  assert(pctContent.includes('Invariant 1') && pctContent.includes('Zero External Egress'), 'Must reference Invariant 1');
  assert(pctContent.includes('Invariant 2') && pctContent.includes('Deterministic Reversible Tokenization'), 'Must reference Invariant 2');
  assert(pctContent.includes('Invariant 3') && pctContent.includes('Verifiable Cryptographic Isolation'), 'Must reference Invariant 3');
  assert(pctContent.includes('Invariant 4') && pctContent.includes('Zero Subprocessor'), 'Must reference Invariant 4');

  // Verify Key Technical Primitives
  assert(pctContent.includes('[TYPE_INDEX]'), 'Must claim bracketed surrogate format [TYPE_INDEX]');
  assert(pctContent.includes('mlock') || pctContent.includes('non-swappable'), 'Must claim non-swappable volatile RAM');
  assert(pctContent.includes('explicit_bzero') || pctContent.includes('zeroization'), 'Must claim volatile zeroization');
  assert(pctContent.includes('Argon2id') && pctContent.includes('XChaCha20-Poly1305'), 'Must claim Argon2id + XChaCha20-Poly1305 session vault');
  assert(pctContent.includes('Ed25519') && pctContent.includes('RFC 8032'), 'Must claim Ed25519 verification per RFC 8032');
  console.log('    [OK] All 20 PCT claims and 4 technical invariants verified.');
}

// Test 4: Madrid Trademark Dossier Form MM2 Structure & Governance
console.log('\n--> Test 4: Madrid Dossier Form MM2 Structure & Certification Governance');
{
  const madridContent = fs.readFileSync(MADRID_DOSSIER_PATH, 'utf8');

  // Verify Form MM2 Items 1 to 12
  for (let item = 1; item <= 12; item++) {
    const itemRegex = new RegExp(`MM2\\s*(?:Item|\\()?\\s*${item}`, 'i');
    assert(itemRegex.test(madridContent), `Must address MM2 item ${item}`);
  }

  // Verify Form MM18 (US Intent to Use)
  assert(madridContent.includes('MM18') || madridContent.includes('Intent to Use'), 'Must reference Form MM18 for USPTO designation');

  // Verify Certification Mark Regulations
  assert(madridContent.includes('Certification Mark Regulations') || madridContent.includes('Standards of Certification'), 'Must include certification governance rules');
  assert(madridContent.includes('Revocation'), 'Must include revocation terms');
  console.log('    [OK] Form MM2 sections and certification mark regulations verified.');
}

// Test 5: Master IP Portfolio & Statutory Calendar SSOT Chronogram
console.log('\n--> Test 5: Master IP Portfolio & Statutory Calendar SSOT Verification');
{
  assert(fs.existsSync(MASTER_IP_SSOT_PATH), 'Master IP SSOT file must exist');
  const ssotContent = fs.readFileSync(MASTER_IP_SSOT_PATH, 'utf8');

  // Verify Timeline Chronogram Milestones
  const requiredMilestones = [
    'Month 0',
    'Month 0.2',
    'Month 6',
    'Month 12',
    'Month 16',
    'Month 18',
    'Month 22',
    'Month 30',
    'Month 31'
  ];
  for (const milestone of requiredMilestones) {
    assert(ssotContent.includes(milestone), `Must include chronogram milestone ${milestone}`);
  }

  // Verify Key Dates
  assert(ssotContent.includes('14/09/2026'), 'Must cite Priority Patent filing date 14/09/2026');
  assert(ssotContent.includes('20/09/2026'), 'Must cite Basic Trademark filing date 20/09/2026');
  assert(ssotContent.includes('20/03/2027'), 'Must cite Madrid 6-month statutory deadline 20/03/2027');
  assert(ssotContent.includes('14/09/2027'), 'Must cite PCT 12-month statutory deadline 14/09/2027');
  assert(ssotContent.includes('14/03/2028'), 'Must cite WIPO A1 publication date 14/03/2028');
  assert(ssotContent.includes('14/03/2029'), 'Must cite Month 30 National Phase entry date 14/03/2029');
  assert(ssotContent.includes('14/04/2029'), 'Must cite Month 31 Regional Phase entry date 14/04/2029');

  // Verify Two-Brand Isolation Matrix
  assert(ssotContent.includes('Two-Brand IP Isolation') || ssotContent.includes('TWO-BRAND IP ISOLATION'), 'Must include Two-Brand IP isolation table');
  assert(ssotContent.includes('PrivacyScrubber'), 'Must cite PrivacyScrubber as commercial counterpart');
  console.log('    [OK] Master IP timeline chronogram (Month 0 to Month 31) and boundaries verified.');
}

// Test 6: Cross-Repository IP Boundary & Anti-Slop / Brand Compliance
console.log('\n--> Test 6: Cross-Repository IP Boundary & Brand Compliance');
{
  const filesToCheck = [
    PCT_SPEC_PATH,
    MADRID_DOSSIER_PATH,
    MASTER_IP_SSOT_PATH,
    README_GUIDE_PATH
  ];

  for (const filePath of filesToCheck) {
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Zero commercial engine regex leakage gate
    const forbiddenPatterns = [
      ['pii', 'engine', 'core'].join('-'),
      ['tree', 'Scrubber'].join(''),
      ['PROFILE', '_', 'RULES', ' ='].join('')
    ];
    for (const pat of forbiddenPatterns) {
      assert(!content.includes(pat), `Commercial engine pattern ${pat} must not be mentioned in ${path.basename(filePath)}`);
    }

    // 2. Brand Naming Rule: BrandMeWeb (never "Brand Me Web")
    assert(!content.includes('Brand Me Web'), `BrandMeWeb must be spelled as a single word in ${path.basename(filePath)}`);

    // 3. Anti-Emoji Gate
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    assert(!emojiRegex.test(content), `No emojis allowed in legal dossier ${path.basename(filePath)}`);
  }

  console.log('    [OK] Zero commercial engine leakage, BrandMeWeb spelling, and zero emojis verified.');
}

console.log('\n[PASS] All 6 WIPO International IP Portfolio & Statutory Compliance Tests Passed Successfully!\n');
