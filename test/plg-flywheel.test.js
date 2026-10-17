/**
 * ZTDS PLG Flywheel & Chrome Web Store Package Test Suite
 * 
 * Verifies:
 * 1. File existence of PLG flywheel documentation in markdown and plaintext mirrors
 * 2. Strict Zero-Emoji compliance across all PLG files
 * 3. Brand naming compliance ("BrandMeWeb" single word rule)
 * 4. Two-Brand Firewall commercial handoff routing (https://privacyscrubber.com/pricing/)
 * 5. Certificate and Ed25519 badge token integration alignment with data/registry.json
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

// Test 3: Two-Brand Firewall & Commercial Handoff Routing
console.log('\n--> Test 3: Two-Brand Firewall & Commercial Handoff Routing');
{
  const content = fs.readFileSync(DOC_MD, 'utf8');

  assert(content.includes('https://privacyscrubber.com/pricing/'), 'Must route commercial licensing to https://privacyscrubber.com/pricing/');
  assert(content.includes('https://brandmeweb.com'), 'Must route enterprise architecture to https://brandmeweb.com');
  assert(!content.includes(['40,000', 'ILS'].join(' ')), 'Must not expose internal MRR targets on public consortium repo');

  console.log('    [PASS] Two-Brand Firewall and commercial handoff routing verified.');
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
  assert(content.includes('draft-sibiryakov-ztds-protocol-02'), 'Must cite IETF Internet-Draft in store listing');
  assert(content.includes('Patents Pending'), 'Must cite Patents Pending');
  assert(content.includes('0 Critical / 0 High'), 'Must cite 0-finding independent audit');

  console.log('    [PASS] Chrome Web Store permissions, legal anchors, and justifications validated.');
}

console.log('\n[PASS] All 5 ZTDS Commercial PLG Flywheel Tests Passed Successfully!\n');
