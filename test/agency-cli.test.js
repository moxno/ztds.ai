/**
 * BrandMeWeb Agency SOW Generator CLI Test Suite
 * 
 * Verifies:
 * 1. CLI help output and parameter parsing
 * 2. Generation of tailored Statements of Work ($2,500 Setup + $500/mo Retainer)
 * 3. File output writing and temp file cleanup
 * 4. Presence of institutional authority anchors and BrandMeWeb links
 * 5. Strict Zero-Emoji compliance and BrandMeWeb spelling SSOT
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('[TEST] Starting BrandMeWeb Agency SOW Generator Test Suite...\n');

// Test 1: Help Output
console.log('--> Test 1: CLI Help Output & Parameter Parsing');
{
  const help = execSync('node bin/ztds-agency.js --help', { encoding: 'utf8' });
  assert(help.includes('BrandMeWeb Agency Proposal & SOW Generator'), 'Must identify tool');
  assert(help.includes('--client'), 'Must document --client option');
  assert(help.includes('--domain'), 'Must document --domain option');
  assert(help.includes('--industry'), 'Must document --industry option');
  console.log('    [PASS] CLI help output verified.');
}

// Test 2: Tailored SOW Generation
console.log('\n--> Test 2: Tailored SOW Generation ($2,500 + $500/mo)');
{
  const output = execSync('node bin/ztds-agency.js --client "Leumi Private Bank" --domain "leumi.co.il" --contact "Eli Dayan" --industry fintech', { encoding: 'utf8' });

  assert(output.includes('**Client Organization:** Leumi Private Bank (leumi.co.il)'), 'Must personalize client and domain');
  assert(output.includes('**Attn:** Eli Dayan'), 'Must personalize contact recipient');
  assert(output.includes('$2,500 USD Setup + $500 USD / month Governance Retainer'), 'Must cite commercial pricing');
  assert(output.includes('Phase 1: Initial Turn-Key Retrofit & Remediation ($2,500 One-Off)'), 'Must detail Phase 1 scope');
  assert(output.includes('Phase 2: Ongoing Governance & Continuous Defense Retainer ($500 / month)'), 'Must detail Phase 2 scope');
  assert(output.includes('https://brandmeweb.com'), 'Must link to BrandMeWeb');
  assert(output.includes('https://ztds.ai/agency/'), 'Must link to Proposal Workbench');
  assert(output.includes('https://ztds.ai/verify/'), 'Must link to Ed25519 validator');
  assert(output.includes('IL 331905'), 'Must cite Israel Patent IL 331905');
  assert(output.includes('draft-sibiryakov-ztds-protocol-00'), 'Must cite IETF Internet-Draft');

  console.log('    [PASS] Tailored fintech SOW and commercial milestones validated.');
}

// Test 3: File Output & Compliance
console.log('\n--> Test 3: File Output Writing & Policy Compliance');
{
  const tmpFile = path.join(os.tmpdir(), `brandmeweb-sow-test-${Date.now()}.md`);
  execSync(`node bin/ztds-agency.js --client "Clalit Tech" --domain "clalit.org.il" --industry healthcare --output "${tmpFile}"`, { encoding: 'utf8' });

  assert(fs.existsSync(tmpFile), 'SOW file must be created on disk');
  const fileContent = fs.readFileSync(tmpFile, 'utf8');

  assert(fileContent.includes('**Client Organization:** Clalit Tech (clalit.org.il)'), 'Must contain Clalit Tech');
  assert(fileContent.includes('Israel Privacy Protection Law Amendment 13'), 'Must reference Israeli Privacy Law');

  // Zero Emoji check
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(fileContent), 'Zero-emoji policy violated in generated SOW');

  // BrandMeWeb spelling check (never "Brand Me Web")
  const improperBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  assert(!improperBrandRegex.test(fileContent), 'BrandMeWeb must be spelled as a single word');

  fs.unlinkSync(tmpFile);
  console.log('    [PASS] File output, zero-emoji policy, and BrandMeWeb spelling validated.');
}

console.log('\n[PASS] All 3 BrandMeWeb Agency SOW Generator Tests Passed Successfully!\n');
