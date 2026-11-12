#!/usr/bin/env node
/**
 * ZTDS.ai — Unified IP & Secret Leak Gate Verification Suite
 *
 * Verifies:
 *   1. Current repository passes `scripts/ip-leak-gate.js` with 0 violations.
 *   2. `.git/hooks/pre-commit`, `scripts/pre-commit`, and `.github/workflows/ip-guard.yml`
 *      all bind to `scripts/ip-leak-gate.js` (zero split-brain drift, zero `pipefail` + `grep -q` bugs).
 *   3. Adversarial regression tests in isolated temporary git repositories prove the gate
 *      deterministically blocks blocked paths, PEM keys, API secrets, commercial engine IP,
 *      private repo URLs, unpublished patent details, and >200KB multi-chunk files with secrets
 *      on line 1 (preventing SIGPIPE exit-141 fail-open regressions).
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { auditRepository } = require('../scripts/ip-leak-gate');

const ROOT = path.resolve(__dirname, '..');

console.log('[TEST] Starting Unified IP & Secret Leak Gate Suite...\n');

// Test 1: Live Repository Tree Passes SSOT Gate
console.log('--> Test 1: Live Repository Tree Conformance');
{
  const res = auditRepository({ rootDir: ROOT, includeStaged: false });
  assert.strictEqual(
    res.ok,
    true,
    `Expected 0 IP/secret violations in tracked repository, found:\n${res.violations.map(v => `${v.file}:${v.line} [${v.rule}] ${v.message}`).join('\n')}`
  );
  assert(res.scannedFiles >= 150, `Expected >=150 tracked files scanned, got ${res.scannedFiles}`);
  console.log(`    [PASS] ${res.scannedFiles} tracked repository files passed with 0 violations.`);
}

// Test 2: Zero Split-Brain Drift Between Pre-Commit Hook, CI Workflow & Test Runner
console.log('--> Test 2: Three-Plane SSOT Binding (Pre-Commit <-> CI <-> Test Suite)');
{
  const preCommitScript = fs.readFileSync(path.join(ROOT, 'scripts/pre-commit'), 'utf8');
  const preCommitCodeOnly = preCommitScript.replace(/^\s*#.*$/gm, '');
  assert(
    preCommitCodeOnly.includes('scripts/ip-leak-gate.js') && preCommitCodeOnly.includes('--staged'),
    'scripts/pre-commit must delegate directly to scripts/ip-leak-gate.js --staged'
  );
  assert(
    !preCommitCodeOnly.includes('pipefail') && !preCommitCodeOnly.includes('grep -q'),
    'scripts/pre-commit must not use bash pipefail + grep -q (causes SIGPIPE exit-141 fail-open)'
  );

  const liveHookPath = path.join(ROOT, '.git/hooks/pre-commit');
  if (fs.existsSync(liveHookPath)) {
    const liveHook = fs.readFileSync(liveHookPath, 'utf8');
    assert.strictEqual(
      liveHook,
      preCommitScript,
      '.git/hooks/pre-commit must match scripts/pre-commit byte-for-byte (run npm run build:sync)'
    );
  }

  const workflowYml = fs.readFileSync(path.join(ROOT, '.github/workflows/ip-guard.yml'), 'utf8');
  assert(
    workflowYml.includes('node scripts/ip-leak-gate.js --ci'),
    '.github/workflows/ip-guard.yml must execute node scripts/ip-leak-gate.js --ci'
  );

  console.log('    [PASS] Local pre-commit hook, GitHub Actions workflow, and test suite share 100% SSOT.');
}

// Test 3: Adversarial Detection & Large-Payload SIGPIPE Fail-Open Regression Suite
console.log('--> Test 3: Adversarial Leak Detection & Large-Payload Regression Checks');
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ztds-ip-gate-test-'));
  try {
    execFileSync('git', ['init', '-q'], { cwd: tmpDir });
    execFileSync('git', ['config', 'user.email', 'test@ztds.ai'], { cwd: tmpDir });
    execFileSync('git', ['config', 'user.name', 'ZTDS Test'], { cwd: tmpDir });

    const baselineGitignore = [
      '.agents/',
      '.agent/',
      'keys/ztds_license_private',
      '*.private.pem',
      '*.key.pem',
      ''
    ].join('\n');
    fs.writeFileSync(path.join(tmpDir, '.gitignore'), baselineGitignore);
    fs.writeFileSync(path.join(tmpDir, 'clean.js'), 'export const ok = true;\n');
    execFileSync('git', ['add', '.gitignore', 'clean.js'], { cwd: tmpDir });
    execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: tmpDir });

    // Clean baseline must pass
    const cleanRes = auditRepository({ rootDir: tmpDir, includeStaged: true });
    assert.strictEqual(cleanRes.ok, true, 'Clean fixture repository must pass');

    // Case A: Forced staged .agents/ file must be blocked
    fs.mkdirSync(path.join(tmpDir, '.agents'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.agents/strategy.md'), 'internal strategy\n');
    execFileSync('git', ['add', '-f', '.agents/strategy.md'], { cwd: tmpDir });
    const resAgents = auditRepository({ rootDir: tmpDir, includeStaged: true });
    assert(resAgents.violations.some(v => v.rule === 'BLOCKED_PATH' && v.file === '.agents/strategy.md'), 'Must block staged .agents/ file');
    execFileSync('git', ['rm', '-rf', '--cached', '-q', '.agents'], { cwd: tmpDir });
    fs.rmSync(path.join(tmpDir, '.agents'), { recursive: true, force: true });

    // Case B: Large (>220KB) staged JS bundle with PEM marker on line 1 (SIGPIPE exit-141 regression test)
    const pemHeader = ['-----BEGIN', 'RSA', 'PRIVATE', 'KEY-----'].join(' ');
    const largePayload = `${pemHeader}\n` + '// safe padding line\n'.repeat(11000);
    assert(Buffer.byteLength(largePayload) > 220000, 'Fixture must exceed OS 64KB pipe buffer');
    fs.writeFileSync(path.join(tmpDir, 'large-bundle.js'), largePayload);
    execFileSync('git', ['add', 'large-bundle.js'], { cwd: tmpDir });
    const resLarge = auditRepository({ rootDir: tmpDir, includeStaged: true });
    assert(
      resLarge.violations.some(v => v.rule === 'PEM_PRIVATE_KEY' && v.file === 'large-bundle.js' && v.line === 1),
      'Must deterministically catch PEM marker on line 1 of >220KB staged file without SIGPIPE fail-open'
    );
    execFileSync('git', ['rm', '-f', '--cached', '-q', 'large-bundle.js'], { cwd: tmpDir });
    fs.unlinkSync(path.join(tmpDir, 'large-bundle.js'));

    // Case C: Secret token, commercial engine identifier, private repo URL & unpublished patent detail
    const fakeSk = 'sk-proj-' + 'AbCdEfGhIjKlMnOpQrStUvWxYz012345';
    const fakeEngine = ['pii', 'engine', 'core'].join('-');
    const fakeRepo = ['github.com', 'moxno', 'PrivacyScrubber'].join('/');
    const fakePatent = ['IL', '331905'].join(' ');
    fs.writeFileSync(
      path.join(tmpDir, 'leaks.js'),
      `const k = "${fakeSk}";\nimport "${fakeEngine}";\n// ${fakeRepo} ${fakePatent}\n`
    );
    execFileSync('git', ['add', 'leaks.js'], { cwd: tmpDir });
    const resLeaks = auditRepository({ rootDir: tmpDir, includeStaged: true });
    const triggeredRules = new Set(resLeaks.violations.map(v => v.rule));
    assert(triggeredRules.has('API_KEY_SK'), 'Must detect sk-* secret token');
    assert(triggeredRules.has('COMMERCIAL_ENGINE_ID'), 'Must detect commercial engine identifier');
    assert(triggeredRules.has('PRIVATE_REPO_URL'), 'Must detect private repository URL');
    assert(triggeredRules.has('UNPUBLISHED_PATENT_DETAIL'), 'Must detect unpublished patent detail');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('    [PASS] Blocked paths, >220KB PEM payloads, API secrets, engine IP, private repo URLs, and patent details caught deterministically.');
}

console.log('\n[SUMMARY] ALL 3 UNIFIED IP & SECRET LEAK GATE TESTS PASSED.\n');
