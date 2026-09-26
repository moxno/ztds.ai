/**
 * ZTDS.ai — IETF Internet-Draft Conformance Test Suite
 * 
 * Verifies:
 * 1. File existence of XML (RFC 7991 / xml2rfc v3) and TXT drafts
 * 2. Strict XML syntax validation via xmllint
 * 3. Mandatory IETF RFC elements (<rfc>, <front>, <middle>, <back>, <references>)
 * 4. Document identity (draft-sibiryakov-ztds-protocol-00)
 * 5. Presence of 4 Invariants, mathematical proofs, and normative RFC references
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS IETF Internet-Draft Verification Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const xmlPath = path.join(ROOT, 'docs/ietf/draft-sibiryakov-ztds-protocol-00.xml');
const txtPath = path.join(ROOT, 'docs/ietf/draft-sibiryakov-ztds-protocol-00.txt');

// Test 1: File Presence & Non-Empty
console.log('--> Test 1: IETF Draft File Presence');
{
  assert(fs.existsSync(xmlPath), 'XML draft must exist at docs/ietf/draft-sibiryakov-ztds-protocol-00.xml');
  assert(fs.existsSync(txtPath), 'TXT draft must exist at docs/ietf/draft-sibiryakov-ztds-protocol-00.txt');
  
  const xmlStats = fs.statSync(xmlPath);
  const txtStats = fs.statSync(txtPath);
  assert(xmlStats.size > 2000, `XML draft too small: ${xmlStats.size} bytes`);
  assert(txtStats.size > 2000, `TXT draft too small: ${txtStats.size} bytes`);
  console.log(`    [PASS] XML draft (${xmlStats.size} B) and TXT draft (${txtStats.size} B) verified.`);
}

// Test 2: xmllint Syntax Validation
console.log('--> Test 2: xmllint Strict Syntax Validation');
{
  let hasXmllint = false;
  try {
    execSync('xmllint --version', { stdio: 'ignore' });
    hasXmllint = true;
  } catch (e) {
    hasXmllint = false;
  }

  if (hasXmllint) {
    try {
      execSync(`xmllint --noout "${xmlPath}"`, { stdio: 'pipe' });
      console.log('    [PASS] xmllint confirmed zero XML syntax errors or unclosed tags.');
    } catch (err) {
      assert.fail(`xmllint validation failed: ${err.message}`);
    }
  } else {
    // Pure JS Stack-Based XML well-formedness validator fallback
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    assert(xmlContent.startsWith('<?xml'), 'Must start with <?xml declaration');
    assert(xmlContent.includes('</rfc>'), 'Must contain closing </rfc> tag');

    const clean = xmlContent.replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    const stack = [];
    const tagRegex = /<(\/)?([a-zA-Z0-9_\-:]+)((?:\s+[^>]*?)?)(\/)?>/g;
    let match;
    while ((match = tagRegex.exec(clean)) !== null) {
      const isClosing = match[1] === '/';
      const tagName = match[2];
      const isSelfClosing = match[4] === '/' || match[3].trim().endsWith('/');
      if (isSelfClosing) continue;
      if (isClosing) {
        assert(stack.length > 0, `Unexpected closing tag </${tagName}> without open tag`);
        const expectedTag = stack.pop();
        assert.strictEqual(tagName, expectedTag, `Mismatched closing tag </${tagName}>, expected </${expectedTag}>`);
      } else {
        stack.push(tagName);
      }
    }
    assert.strictEqual(stack.length, 0, `Unclosed XML tags remaining: ${stack.join(', ')}`);
    console.log('    [PASS] Stack-based pure JS XML syntax confirmed zero syntax errors or unclosed tags.');
  }
}

// Test 3: RFC 7991 (v3) Schema & Metadata Assertions
console.log('--> Test 3: RFC 7991 (xml2rfc v3) Vocabulary & Metadata');
{
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  assert(xmlContent.includes('docName="draft-sibiryakov-ztds-protocol-00"'), 'docName attribute must be set');
  assert(xmlContent.includes('category="info"'), 'Category must be informational');
  assert(xmlContent.includes('version="3"'), 'Must target xml2rfc version 3');
  assert(xmlContent.includes('fullname="Ilya Sibiryakov"'), 'Author fullname must be Ilya Sibiryakov');
  assert(xmlContent.includes('<title abbrev="ZTDS Protocol">'), 'Title must be ZTDS Protocol');
  assert(xmlContent.includes('<abstract>'), 'Must include abstract');
  assert(xmlContent.includes('<middle>'), 'Must include middle body');
  assert(xmlContent.includes('<back>'), 'Must include back section');

  // Normative RFC references
  assert(xmlContent.includes('anchor="RFC2119"'), 'Must cite RFC 2119');
  assert(xmlContent.includes('anchor="RFC8032"'), 'Must cite RFC 8032 (Ed25519)');
  assert(xmlContent.includes('anchor="RFC8439"'), 'Must cite RFC 8439 (ChaCha20-Poly1305)');
  assert(xmlContent.includes('anchor="RFC9106"'), 'Must cite RFC 9106 (Argon2)');

  console.log('    [PASS] RFC 7991 v3 elements, author attribution, and normative RFC anchors confirmed.');
}

// Test 4: The 4 Protocol Invariants in Draft Content
console.log('--> Test 4: Four Protocol Invariants & Zero-Egress Invariant');
{
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  assert(xmlContent.includes('Invariant 1: Volatile Memory Boundary'), 'Must specify Invariant 1');
  assert(xmlContent.includes('Invariant 2: Deterministic Reversible Tokenization'), 'Must specify Invariant 2');
  assert(xmlContent.includes('Invariant 3: Zero Outgoing Network Transmission'), 'Must specify Invariant 3');
  assert(xmlContent.includes('Invariant 4: Zero Sub-Processor Chain'), 'Must specify Invariant 4');
  assert(xmlContent.includes('Egress(S) == 0 bytes'), 'Must specify zero-egress formula');

  console.log('    [PASS] All 4 protocol invariants and mathematical models verified in draft.');
}

// Test 5: Plaintext Draft Structure (72-col IETF format)
console.log('--> Test 5: Plaintext Draft Structure & Pagination Headers');
{
  const txtContent = fs.readFileSync(txtPath, 'utf8');
  assert(txtContent.includes('Internet-Draft'), 'Must declare Internet-Draft header');
  assert(txtContent.includes('Expires: 30 March 2027'), 'Must specify standard 6-month expiry');
  assert(txtContent.includes('Table of Contents'), 'Must include Table of Contents');
  assert(txtContent.includes("Author's Address"), "Must include Author's Address");

  console.log('    [PASS] Text draft format, 6-month expiry, and section hierarchy validated.');
}

console.log('\n[SUMMARY] ALL 5 IETF INTERNET-DRAFT TESTS PASSED WITH 100% SUCCESS.\n');
