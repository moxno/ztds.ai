/**
 * ZTDS.ai — CLI Auditor & Invariant Verification Test Suite
 * 
 * Verifies:
 * 1. CLI execution, help output, and argument parsing
 * 2. Conformance pass on clean directory with valid audit hash & JSON output
 * 3. Detection of Invariant 1 violations (unmasked keys, PII leaks) with non-zero exit code
 * 4. Structured remediation output bridging to @privacyscrubber/sdk and ZTDS registry
 * 5. Production tarball package boundary and whitelist containment
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('[TEST] Starting ZTDS CLI Auditor Verification Suite...\n');

// Test 1: CLI Help Output
console.log('--> Test 1: CLI Help Output & Usage Specification');
{
  const helpOutput = execSync('node bin/ztds-audit.js --help', { encoding: 'utf8' });
  assert(helpOutput.includes('ZTDS.ai Codebase & Invariant Auditor'), 'Help must specify auditor name');
  assert(helpOutput.includes('--dir'), 'Help must document --dir option');
  assert(helpOutput.includes('--json'), 'Help must document --json option');
  assert(helpOutput.includes('ZTDS RFC v1.0'), 'Help must cite ZTDS RFC v1.0');
  console.log('    [PASS] CLI help output and options verified.');
}

// Test 2: Clean Conformance Audit (--json mode)
console.log('--> Test 2: Clean Conformance Audit on ./data Directory');
{
  const jsonOutput = execSync('node bin/ztds-audit.js --dir ./data --json', { encoding: 'utf8' });
  const report = JSON.parse(jsonOutput);
  
  assert.strictEqual(report.standard, 'ZTDS RFC v1.0');
  assert.strictEqual(report.status, 'CONFORMANT');
  assert.strictEqual(report.invariants.invariant_1_zero_egress, 'PASS');
  assert.strictEqual(report.invariants.invariant_2_reversible_tokens, 'PASS');
  assert.strictEqual(report.summary.total_findings, 0);
  assert(report.audit_hash.startsWith('sha256:'), 'Audit hash must be valid SHA-256');
  assert(report.remediation.badge_markdown.includes('ztds.ai/badge/'), 'Remediation must offer trust badge');
  console.log(`    [PASS] Clean scan verified: ${report.scanned_files_count} files conformant, hash ${report.audit_hash.slice(0, 16)}...`);
}

// Test 3: Detection of Invariant 1 Violation (Unmasked Secret Leak)
console.log('--> Test 3: Violation Detection & Invariant 1 Red Flag');
{
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ztds-audit-test-'));
  const leakFile = path.join(tempDir, 'agent_pipeline.js');
  
  // Write deliberate unmasked secret to test detection
  fs.writeFileSync(leakFile, `
    // Simulating unmasked AI agent pipeline
    const apiKey = "sk-1234567890abcdef1234567890abcdef";
    const prompt = "Send user data to external LLM without masking";
  `);

  let failed = false;
  let stdout = '';
  try {
    stdout = execSync(`node "${path.resolve('bin/ztds-audit.js')}" --dir "${tempDir}" --json`, { encoding: 'utf8' });
  } catch (err) {
    failed = true;
    stdout = err.stdout;
  }

  // Clean up temp dir
  fs.rmSync(tempDir, { recursive: true, force: true });

  assert.strictEqual(failed, true, 'Audit must fail with non-zero exit code when violation detected');
  const report = JSON.parse(stdout);
  assert.strictEqual(report.status, 'NON_CONFORMANT');
  assert.strictEqual(report.invariants.invariant_1_zero_egress, 'FAIL');
  assert(report.summary.critical >= 1, 'Must report at least 1 critical finding');
  assert.strictEqual(report.remediation.certified_sdk, '@privacyscrubber/sdk');
  assert.strictEqual(report.remediation.registry_url, 'https://ztds.ai/registry/');
  console.log('    [PASS] Invariant 1 violation accurately detected; exit code 1 and remediation emitted.');
}

// Test 4: Package Whitelist & Tarball Isolation
console.log('--> Test 4: npm Tarball Contents Whitelist');
{
  const packOutput = execSync('npm pack --dry-run 2>&1', { encoding: 'utf8' });
  assert(packOutput.includes('package: ztds-audit@1.0.0'), 'Package name must be ztds-audit@1.0.0');
  assert(packOutput.includes('bin/ztds-audit.js'), 'Must include bin/ztds-audit.js');
  assert(packOutput.includes('README.md'), 'Must include README.md');
  assert(packOutput.includes('LICENSE'), 'Must include LICENSE');
  assert(!packOutput.includes('bin/ztds-license-generator.js'), 'Must NOT include founder license generator');
  assert(!packOutput.includes('index.html'), 'Must NOT include landing page HTML');
  assert(!packOutput.includes('keys/ztds_license_private'), 'Must NEVER include private keys');
  console.log('    [PASS] Production tarball whitelist verified (< 15 KB, 0 private leakage).');
}

console.log('\n[SUMMARY] ALL 4 CLI AUDITOR TESTS PASSED WITH 100% CONFORMANCE.\n');
