#!/usr/bin/env node
/**
 * ZTDS.ai — Parallel Verification Suite Orchestrator
 * Executes all 39 repository verification and test suites concurrently across CPU cores.
 */

'use strict';

const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const TASKS = [
  ['bin/ztds-audit.js', '--dir', './data'],
  ['scripts/audit-memory-ttl.js'],
  ['scripts/sync-registry.js', '--check'],
  ['scripts/entity-manager.js', 'audit'],
  ['test/consortium-neutrality.test.js'],
  ['test/license.test.js'],
  ['test/certificate.test.js'],
  ['test/ietf-draft.test.js'],
  ['test/agent.test.js'],
  ['test/security-audit.test.js'],
  ['test/wipo-ip.test.js'],
  ['test/verify-ui.test.js'],
  ['test/certification-ui.test.js'],
  ['test/ciso-cli.test.js'],
  ['test/agency-cli.test.js'],
  ['test/plg-flywheel.test.js'],
  ['test/scan-domain.test.js'],
  ['test/lead-capture.test.js'],
  ['test/schema.test.js'],
  ['test/scanner-ui.test.js'],
  ['test/scanner-sanitizer.test.js'],
  ['test/agency.test.js'],
  ['test/routes-integrity.test.js'],
  ['test/registries-schema.test.js'],
  ['test/geo-corpus.test.js'],
  ['test/ztds-audit-cli.test.js'],
  ['test/not-found.test.js'],
  ['test/integrations.test.js'],
  ['test/benchmark.test.js'],
  ['test/conformance.test.js'],
  ['test/mcp-configurator.test.js'],
  ['test/registry-filter.test.js'],
  ['test/companies-filter.test.js'],
  ['test/fellows-filter.test.js'],
  ['test/roi-calculator.test.js'],
  ['test/ciso-page.test.js'],
  ['test/apply-wizard.test.js'],
  ['test/badge-ui.test.js'],
  ['test/trial-workbench.test.js']
];

function runNodeTask(args) {
  return new Promise((resolve) => {
    const start = Date.now();
    execFile(process.execPath, args, { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({
        label: args.join(' '),
        ok: !err,
        durationMs: Date.now() - start,
        stdout,
        stderr,
        err
      });
    });
  });
}

async function main() {
  const startAll = Date.now();
  const concurrency = Math.max(2, Math.min(os.cpus().length, 8));
  console.log(`[ZTDS TEST RUNNER] Executing ${TASKS.length} verification suites (concurrency: ${concurrency})...`);

  const results = new Array(TASKS.length);
  let cursor = 0;

  async function worker() {
    while (cursor < TASKS.length) {
      const idx = cursor++;
      const res = await runNodeTask(TASKS[idx]);
      results[idx] = res;
      if (!res.ok) {
        console.error(`  [FAIL] ${res.label} (${res.durationMs}ms)`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const failed = results.filter(r => !r.ok);
  const totalMs = Date.now() - startAll;

  if (failed.length > 0) {
    for (const f of failed) {
      console.error(`\n=== FAILURE IN: ${f.label} ===`);
      if (f.stdout) process.stderr.write(f.stdout);
      if (f.stderr) process.stderr.write(f.stderr);
    }
    console.error(`\n[FAILED] ${failed.length}/${TASKS.length} suites failed in ${totalMs}ms.`);
    process.exit(1);
  }

  console.log(`[SUCCESS] All ${TASKS.length}/${TASKS.length} ZTDS verification suites passed in ${totalMs}ms.`);
}

main();
