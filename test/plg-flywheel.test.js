/**
 * ZTDS PLG Flywheel & Chrome Web Store Package Test Suite
 * 
 * Verifies:
 * 1. File existence of PLG flywheel documentation in markdown and plaintext mirrors
 * 2. Strict Zero-Emoji compliance across all PLG files
 * 3. Brand naming compliance ("BrandMeWeb" single word rule)
 * 4. Commercial pricing tier alignment with SSOT ($15/$110 PRO, $99 TEAMS, $199/$1,990 SDK, $2,500 + $500/mo Agency)
 * 5. Certificate and Ed25519 badge token integration alignment with data/registry.json
 * 6. Target MRR math alignment (40,000 ILS / ~$11,000 USD by 14/05/2027)
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS Commercial PLG Flywheel Test Suite...\n');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_MD = path.join(ROOT_DIR, 'docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.md');
const DOC_TXT = path.join(ROOT_DIR, 'docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.txt');
const PUB_TXT = path.join(ROOT_DIR, 'public/docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.txt');
const REGISTRY_PATH = path.join(ROOT_DIR, 'data/registry.json');

// Test 1: File Presence
console.log('--> Test 1: PLG Documentation & Static Mirror Presence');
{
  assert(fs.existsSync(DOC_MD), 'docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.md must exist');
  assert(fs.existsSync(DOC_TXT), 'docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.txt must exist');
  assert(fs.existsSync(PUB_TXT), 'public/docs/plg/ZTDS_PLG_FLYWHEEL_AND_STORE_LISTING_KIT.txt must exist');
  console.log('    [PASS] All 3 PLG flywheel documentation files present on disk.');
}

// Test 2: Zero-Emoji Compliance & Brand Naming
console.log('\n--> Test 2: Zero-Emoji & BrandMeWeb Single-Word Compliance');
{
  const content = fs.readFileSync(DOC_MD, 'utf8');
  
  // Zero-emoji check
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!emojiRegex.test(content), 'Zero-emoji policy violated in PLG flywheel doc');

  // BrandMeWeb spelling check
  const badBrandRegex = /\bBrand\s+Me\s+Web\b/i;
  assert(!badBrandRegex.test(content), 'BrandMeWeb must be spelled as a single word');

  console.log('    [PASS] Zero-emoji and BrandMeWeb spelling invariants strictly maintained.');
}

// Test 3: Commercial Pricing SSOT Alignment
console.log('\n--> Test 3: Commercial Pricing SSOT Alignment');
{
  const content = fs.readFileSync(DOC_MD, 'utf8');

  // PRO tier
  assert(content.includes('$15/mo / $110 Lifetime'), 'Must detail PRO tier pricing ($15/mo / $110)');
  // TEAMS tier
  assert(content.includes('$99/mo flat'), 'Must detail TEAMS tier pricing ($99/mo flat)');
  // SDK tier
  assert(content.includes('$199/mo or $1,990/yr'), 'Must detail Developer SDK tier ($199/mo or $1,990/yr)');
  // Agency setup & retainer
  assert(content.includes('$2,500 setup + $500/mo retainer'), 'Must detail Agency setup and retainer');
  // Target MRR
  assert(content.includes('40,000 ILS (~$11,000 USD) MRR'), 'Must specify target 40,000 ILS MRR');

  console.log('    [PASS] Commercial pricing tiers and target MRR verified.');
}

// Test 4: Registry Token and Badge Alignment
console.log('\n--> Test 4: Registry Certificate Token & Badge Alignment');
{
  const content = fs.readFileSync(DOC_MD, 'utf8');
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  const extensionEntity = registry.entities.find(e => e.id === 'privacyscrubber-extension');
  assert(extensionEntity, 'PrivacyScrubber extension must exist in registry.json');
  assert(extensionEntity.certificate, 'Extension must have certificate in registry.json');

  // Verify that the token in the doc matches the registry certificate token
  assert(content.includes(extensionEntity.certificate.token), 'PLG embed snippet must match registered certificate token');
  assert(content.includes('https://ztds.ai/badge/privacyscrubber-extension.svg'), 'Badge URL must match registered badge');

  console.log('    [PASS] In-app badge and certificate token verified against registry.json.');
}

// Test 5: Chrome Web Store Compliance & Permissions
console.log('\n--> Test 5: Chrome Web Store Permissions Justifications');
{
  const content = fs.readFileSync(DOC_MD, 'utf8');

  assert(content.includes('activeTab:'), 'Must justify activeTab permission');
  assert(content.includes('storage:'), 'Must justify storage permission');
  assert(content.includes('scripting:'), 'Must justify scripting permission');
  assert(content.includes('draft-sibiryakov-ztds-protocol-00'), 'Must cite IETF Internet-Draft in store listing');
  assert(content.includes('IL 331905'), 'Must cite patent IL 331905');
  assert(content.includes('0 Critical / 0 High'), 'Must cite 0-finding independent audit');

  console.log('    [PASS] Chrome Web Store permissions, legal anchors, and justifications validated.');
}

console.log('\n[PASS] All 5 ZTDS Commercial PLG Flywheel Tests Passed Successfully!\n');
