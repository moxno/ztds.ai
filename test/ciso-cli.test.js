/**
 * ZTDS.ai — CISO Dossier Generator CLI Test Suite
 * 
 * Verifies:
 * 1. CLI help output and argument parsing
 * 2. Generation of tailored industry dossiers (healthcare, fintech, legal, enterprise)
 * 3. File output writing and clean directory cleanup
 * 4. Presence of institutional authority anchors (IETF, WIPO IL 331905, #182655957, Clean Bill of Health)
 * 5. Strict Zero-Emoji compliance and BrandMeWeb spelling SSOT
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('[TEST] Starting ZTDS CISO Dossier Generator Test Suite...\n');

// Test 1: Help Output
console.log('--> Test 1: CLI Help Output & Usage Specification');
{
  const help = execSync('node bin/ztds-ciso.js --help', { encoding: 'utf8' });
  assert(help.includes('CISO & Enterprise Executive Dossier Generator'), 'Must describe CLI tool');
  assert(help.includes('--company'), 'Must document --company option');
  assert(help.includes('--ciso'), 'Must document --ciso option');
  assert(help.includes('--industry'), 'Must document --industry option');
  console.log('    [PASS] CLI help output verified.');
}

// Test 2: Industry Dossier Generation & Institutional Anchors
console.log('\n--> Test 2: Tailored Industry Dossier & Institutional Anchors');
{
  const output = execSync('node bin/ztds-ciso.js --company "Pfizer Global" --ciso "Dr. John Vance" --industry healthcare', { encoding: 'utf8' });
  
  assert(output.includes('**Target Organization:** Pfizer Global'), 'Must personalize target organization');
  assert(output.includes('**Attn:** Dr. John Vance'), 'Must personalize CISO recipient');
  assert(output.includes('HIPAA Safe Harbor (45 CFR § 164.514)'), 'Must cite HIPAA Safe Harbor for healthcare');
  assert(output.includes('draft-sibiryakov-ztds-protocol-00'), 'Must cite IETF Internet-Draft');
  assert(output.includes('IL 331905'), 'Must cite Israel Patent Application IL 331905');
  assert(output.includes('B17B'), 'Must cite WIPO DAS Access Code B17B');
  assert(output.includes('182655957'), 'Must cite Trademark Order #182655957');
  assert(output.includes('0 Critical, 0 High Vulnerabilities'), 'Must cite Independent Security Audit findings');
  assert(output.includes('https://ztds.ai/verify/'), 'Must link to Web Crypto validator');
  assert(output.includes('https://ztds.ai/certification/'), 'Must link to certification hub');

  console.log('    [PASS] Tailored healthcare dossier and institutional anchors validated.');
}

// Test 3: Output to File & Integrity
console.log('\n--> Test 3: File Output Writing & Temp Cleanup');
{
  const tmpFile = path.join(os.tmpdir(), `ztds-ciso-test-${Date.now()}.md`);
  execSync(`node bin/ztds-ciso.js --company "Barclays Capital" --industry fintech --output "${tmpFile}"`, { encoding: 'utf8' });

  assert(fs.existsSync(tmpFile), 'Dossier file must be written to disk');
  const fileContent = fs.readFileSync(tmpFile, 'utf8');

  assert(fileContent.includes('**Target Organization:** Barclays Capital'), 'Must contain Barclays Capital');
  assert(fileContent.includes('PCI-DSS v4.0, GLBA'), 'Must cite fintech statutes');
  assert(fileContent.includes('https://ztds.ai/docs/legal/order-form.html'), 'Must link to order form');

  // Zero-Emoji check
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(fileContent), 'Zero-emoji policy violated in generated CISO dossier');

  // BrandMeWeb spelling check
  const improperBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  assert(!improperBrandRegex.test(fileContent), 'BrandMeWeb must be spelled as a single word');

  fs.unlinkSync(tmpFile);
  console.log('    [PASS] File output, zero-emoji policy, and BrandMeWeb spelling validated.');
}

console.log('\n[PASS] All 3 CISO Dossier Generator Tests Passed Successfully!\n');
