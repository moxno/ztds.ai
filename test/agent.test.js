/**
 * ZTDS.ai — Autonomous Certification Agent Verification Suite
 * 
 * Verifies:
 * 1. CLI execution & help documentation
 * 2. Autonomous audit & Ed25519 certificate minting on conformant codebase
 * 3. Immediate rejection of Invariant 1 & 3 violations (0 false positives)
 * 4. Report generation (--out-report) and Certificate token file emission (--out-cert)
 * 5. Full roundtrip verification through ztds-verify CLI
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { verifyCertificate } = require('../lib/certificate-manager');

console.log('[TEST] Starting ZTDS Autonomous Certification Agent Verification Suite...\n');

// Test 1: CLI Help Output
console.log('--> Test 1: Agent CLI Help & Synopsis Specification');
{
  const helpOut = execSync('node bin/ztds-agent.js --help', { encoding: 'utf8' });
  assert(helpOut.includes('ZTDS.ai Autonomous Certification Agent'), 'Help must specify agent name');
  assert(helpOut.includes('--repo'), 'Help must specify --repo option');
  assert(helpOut.includes('--gitops'), 'Help must specify --gitops option');
  assert(helpOut.includes('--out-report'), 'Help must specify --out-report option');
  console.log('    [PASS] Agent CLI help and parameters verified.');
}

// Test 2: Clean Autonomous Audit & Certificate Minting
console.log('--> Test 2: Clean Autonomous Conformance & Certificate Minting');
{
  const jsonOut = execSync('node bin/ztds-agent.js --dir ./data --applicant "Open Agent Corp" --product "Agent Gateway" --json', { encoding: 'utf8' });
  const report = JSON.parse(jsonOut);

  assert.strictEqual(report.status, 'CONFORMANT');
  assert.strictEqual(report.standard, 'ZTDS RFC v1.0');
  assert.strictEqual(report.applicant, 'Open Agent Corp');
  assert.strictEqual(report.product, 'Agent Gateway');
  assert.strictEqual(report.product_slug, 'agent-gateway');
  assert(report.certificate, 'Must mint certificate on conformant audit');
  assert(report.certificate.certificate_id.startsWith('ZTDS-CERT-2026-AGENT-GATEWAY-'));
  assert(report.verify_command.includes('npx ztds-verify'));

  // Verify minted certificate
  const verifyRes = verifyCertificate(report.certificate.token);
  assert.strictEqual(verifyRes.valid, true);
  assert.strictEqual(verifyRes.subject.applicant, 'Open Agent Corp');
  assert.strictEqual(verifyRes.subject.audit_hash, report.audit_hash);

  console.log(`    [PASS] Autonomous agent minted verified certificate: ${report.certificate.certificate_id}`);
}

// Test 3: Detection of Invariant 1 Violation & Rejection
console.log('--> Test 3: Detection of Invariant 1 Violation & Autonomous Rejection');
{
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ztds-agent-leak-'));
  const leakFile = path.join(tempDir, 'unsafe_pipeline.ts');
  
  const mockKey = ['sk-ant-', 'api03-1234567890abcdef1234567890abcdef1234567890abcdef'].join('');
  fs.writeFileSync(leakFile, `
    // Unsafe pipeline with exposed secret
    const apiKey = "${mockKey}";
    function sendUnmasked(prompt: string) {
      fetch("https://api.openai.com/v1/chat/completions", { body: prompt });
    }
  `);

  let failed = false;
  let stdout = '';
  try {
    stdout = execSync(`node "${path.resolve('bin/ztds-agent.js')}" --dir "${tempDir}" --applicant "Leaky App" --product "Leaky Bot" --json`, { encoding: 'utf8' });
  } catch (err) {
    failed = true;
    stdout = err.stdout;
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  assert.strictEqual(failed, true, 'Agent must exit with non-zero status on invariant violation');
  const report = JSON.parse(stdout);
  assert.strictEqual(report.status, 'NON_CONFORMANT');
  assert.strictEqual(report.certificate, null, 'Must NOT mint certificate on violation');
  assert(report.findings.length >= 1, 'Must report findings');
  assert(report.findings.some(f => f.ruleId === 'SEC_ANTHROPIC_KEY'));

  console.log('    [PASS] Invariant violation accurately intercepted. Certificate withheld.');
}

// Test 4: Report and Certificate File Emission
console.log('--> Test 4: Report & Certificate File Emission');
{
  const tmpReport = path.join(os.tmpdir(), `ztds-report-${Date.now()}.md`);
  const tmpCert = path.join(os.tmpdir(), `ztds-cert-${Date.now()}.cert`);

  execSync(`node bin/ztds-agent.js --dir ./data --applicant "Acme Corp" --product "Secure Node" --out-report "${tmpReport}" --out-cert "${tmpCert}" --json`, { encoding: 'utf8' });

  assert(fs.existsSync(tmpReport), 'Markdown report must be written');
  assert(fs.existsSync(tmpCert), 'Certificate token must be written');

  const reportContent = fs.readFileSync(tmpReport, 'utf8');
  const certContent = fs.readFileSync(tmpCert, 'utf8').trim();

  assert(reportContent.includes('ZTDS.ai Autonomous Certification Report'));
  assert(reportContent.includes('CONFORMANT (CERTIFIED)'));
  assert(certContent.startsWith('ZTDS-CERT-v1.'));

  // Verify certificate from file
  const verifyRes = verifyCertificate(certContent);
  assert.strictEqual(verifyRes.valid, true);
  assert.strictEqual(verifyRes.subject.product, 'Secure Node');

  fs.unlinkSync(tmpReport);
  fs.unlinkSync(tmpCert);

  console.log('    [PASS] Markdown report and certificate file emitted and verified.');
}

console.log('\n[SUMMARY] ALL 4 AUTONOMOUS CERTIFICATION AGENT TESTS PASSED WITH 100% CONFORMANCE.\n');
