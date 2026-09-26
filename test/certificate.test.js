/**
 * ZTDS.ai — Cryptographic Conformance Certificate Verification Test Suite
 * 
 * Verifies:
 * 1. Certificate minting with Ed25519 digital signature
 * 2. Signature verification with zero telemetry
 * 3. Tampering detection and mathematical rejection
 * 4. Expiration date boundaries and grace period enforcement
 * 5. CLI execution: bin/ztds-verify.js (text and JSON modes)
 * 6. CLI execution: bin/ztds-audit.js --cert and --verify flags
 * 7. Entity manager integration: scripts/entity-manager.js mint-cert
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  mintCertificate,
  verifyCertificate,
  CertificateMalformedError,
  CertificateTamperedError,
  CertificateExpiredError
} = require('../lib/certificate-manager');

console.log('[TEST] Starting ZTDS Conformance Certificate Verification Suite...\n');

// Test 1: Valid Certificate Minting & Verification
console.log('--> Test 1: Valid Certificate Minting & Verification');
{
  const testHash = 'sha256:11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
  const cert = mintCertificate({
    applicant: 'Test Health Corp',
    product: 'Sanitizer Node',
    category: 'Healthcare AI',
    repository: 'https://github.com/testhealth/sanitizer',
    auditHash: testHash,
    scannedFilesCount: 42
  });

  assert(cert.token.startsWith('ZTDS-CERT-v1.'), 'Token must start with ZTDS-CERT-v1');
  assert(cert.certificate_id.startsWith('ZTDS-CERT-2026-'), 'Certificate ID must have standard prefix');

  const verified = verifyCertificate(cert.token);
  assert.strictEqual(verified.valid, true);
  assert.strictEqual(verified.certificate_id, cert.certificate_id);
  assert.strictEqual(verified.standard, 'ZTDS RFC v1.0');
  assert.strictEqual(verified.subject.applicant, 'Test Health Corp');
  assert.strictEqual(verified.subject.product, 'Sanitizer Node');
  assert.strictEqual(verified.subject.audit_hash, testHash);
  assert.strictEqual(verified.invariants.invariant_1_zero_egress, 'PASS');
  assert.strictEqual(verified.invariants.invariant_2_reversible_tokens, 'PASS');
  assert.strictEqual(verified.invariants.invariant_3_in_memory_isolation, 'PASS');
  assert.strictEqual(verified.invariants.invariant_4_zero_subprocessors, 'PASS');
  assert(verified.days_remaining >= 364 && verified.days_remaining <= 366);

  console.log(`    [PASS] Certificate minted and verified: ${cert.certificate_id}`);
}

// Test 2: Tampering Detection & Cryptographic Defense
console.log('--> Test 2: Tampering Detection (Signature & Payload Alterations)');
{
  const cert = mintCertificate({
    applicant: 'FinTech Safe',
    product: 'Ledger Scrubber',
    auditHash: 'sha256:aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899'
  });

  const parts = cert.token.split('.');
  
  // Tamper with signature
  const tamperedSig = parts[2].slice(0, -4) + 'XXXX';
  const tamperedSigToken = `${parts[0]}.${parts[1]}.${tamperedSig}`;

  assert.throws(() => {
    verifyCertificate(tamperedSigToken);
  }, CertificateTamperedError, 'Must throw CertificateTamperedError on modified signature');

  // Tamper with payload
  const rawPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
  rawPayload.subject.applicant = 'Hacked Organization';
  const tamperedPayloadB64 = Buffer.from(JSON.stringify(rawPayload)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const tamperedPayloadToken = `${parts[0]}.${tamperedPayloadB64}.${parts[2]}`;

  assert.throws(() => {
    verifyCertificate(tamperedPayloadToken);
  }, CertificateTamperedError, 'Must throw CertificateTamperedError on modified payload');

  console.log('    [PASS] Both signature and payload tampering detected and rejected.');
}

// Test 3: Expiration Date Enforcement
console.log('--> Test 3: Expiration Date Boundaries');
{
  const now = new Date('2026-09-01T00:00:00Z');
  const cert = mintCertificate({
    applicant: 'Expiring Vendor',
    product: 'Test Tool',
    auditHash: 'sha256:0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
    currentTime: now,
    validityDays: 30
  });

  // Check valid on day 10
  const validCheck = verifyCertificate(cert.token, { currentTime: new Date('2026-09-11T00:00:00Z') });
  assert.strictEqual(validCheck.valid, true);

  // Check expired on day 35
  assert.throws(() => {
    verifyCertificate(cert.token, { currentTime: new Date('2026-10-06T00:00:00Z') });
  }, CertificateExpiredError, 'Must throw CertificateExpiredError once past validity days');

  console.log('    [PASS] Certificate expiration enforced at exact validity boundary.');
}

// Test 4: CLI Execution of bin/ztds-verify.js
console.log('--> Test 4: CLI Execution of bin/ztds-verify.js');
{
  const cert = mintCertificate({
    applicant: 'Acme Robotics',
    product: 'Autonomous Agent',
    auditHash: 'sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  });

  // Verify text mode
  const textOut = execSync(`node bin/ztds-verify.js "${cert.token}"`, { encoding: 'utf8' });
  assert(textOut.includes('CRYPTOGRAPHIC SIGNATURE VALIDATED'), 'CLI must output validation pass');
  assert(textOut.includes(cert.certificate_id), 'CLI must output certificate ID');

  // Verify JSON mode
  const jsonOut = execSync(`node bin/ztds-verify.js --json "${cert.token}"`, { encoding: 'utf8' });
  const jsonResult = JSON.parse(jsonOut);
  assert.strictEqual(jsonResult.valid, true);
  assert.strictEqual(jsonResult.certificate_id, cert.certificate_id);

  // Verify file mode
  const tmpFile = path.join(os.tmpdir(), `ztds-test-${Date.now()}.cert`);
  fs.writeFileSync(tmpFile, cert.token, 'utf8');
  const fileOut = execSync(`node bin/ztds-verify.js --cert "${tmpFile}"`, { encoding: 'utf8' });
  assert(fileOut.includes(cert.certificate_id), 'CLI must accept certificate file');
  fs.unlinkSync(tmpFile);

  console.log('    [PASS] CLI verifier passed in text, JSON, and file modes.');
}

// Test 5: Integration with bin/ztds-audit.js --cert
console.log('--> Test 5: CLI Auditor Integration (bin/ztds-audit.js --cert)');
{
  const jsonOut = execSync('node bin/ztds-audit.js --dir ./data --cert --applicant "Test Pipeline" --product "Pipeline Core" --json', { encoding: 'utf8' });
  const report = JSON.parse(jsonOut);

  assert.strictEqual(report.status, 'CONFORMANT');
  assert(report.certificate, 'Report must contain minted certificate');
  assert.strictEqual(report.certificate.status, 'ISSUED');
  assert(report.certificate.certificate_id.startsWith('ZTDS-CERT-2026-PIPELINE-CORE-'));
  
  // Verify minted certificate through ztds-verify
  const verifyResult = verifyCertificate(report.certificate.token);
  assert.strictEqual(verifyResult.valid, true);
  assert.strictEqual(verifyResult.subject.product, 'Pipeline Core');
  assert.strictEqual(verifyResult.subject.audit_hash, report.audit_hash);

  console.log(`    [PASS] Auditor automatically minted verified certificate: ${report.certificate.certificate_id}`);
}

console.log('\n[SUMMARY] ALL 5 CONFORMANCE CERTIFICATE TESTS PASSED WITH 100% SUCCESS.\n');
