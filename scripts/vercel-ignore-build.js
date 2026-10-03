#!/usr/bin/env node

/**
 * ZTDS.ai — Vercel Ignored Build Step Script
 *
 * Configured in vercel.json:
 * "git": { "ignoreCommand": "node scripts/vercel-ignore-build.js" }
 *
 * Vercel Exit Codes:
 *   Exit 0 = CANCEL/SKIP build (Saves Build CPU Minutes & keeps Edge CDN warm)
 *   Exit 1 = PROCEED with build (Deploys web changes)
 */

const { execSync } = require('child_process');
const fs = require('fs');

const EXCLUDED_PATTERNS = [
  ':!*.md',
  ':!.agent/*',
  ':!.agents/*',
  ':!.cursor/*',
  ':!.ruff_cache/*',
  ':!docs/*',
  ':!test/*',
  ':!benchmarks/*',
  ':!scratch/*',
  ':!.github/*',
  ':!.gitignore',
  ':!LICENSE',
  ':!bin/*',
  ':!integrations/*',
  ':!packages/*',
  ':!lib/*'
];

function checkCommitMessage() {
  try {
    const msg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).toLowerCase();
    const skipPatterns = ['[skip ci]', '[skip-ci]', '[skip vercel]', '[skip-vercel]', '[no ci]'];
    for (const pattern of skipPatterns) {
      if (msg.includes(pattern)) {
        console.log(`[ZTDS Ignore Guard] Commit message contains '${pattern}'. Skipping build (exit 0).`);
        return true;
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function main() {
  if (checkCommitMessage()) {
    process.exit(0);
  }

  let baseRef = 'HEAD^';
  if (process.env.VERCEL_GIT_PREVIOUS_SHA && process.env.VERCEL_GIT_PREVIOUS_SHA !== '0000000000000000000000000000000000000000') {
    baseRef = process.env.VERCEL_GIT_PREVIOUS_SHA;
  }

  try {
    execSync(`git rev-parse ${baseRef}`, { stdio: 'ignore' });
  } catch (_) {
    console.log('[ZTDS Ignore Guard] Initial or single commit detected. Proceeding with build (exit 1).');
    process.exit(1);
  }

  try {
    const changed = execSync(
      `git diff --name-only ${baseRef} HEAD -- ${EXCLUDED_PATTERNS.join(' ')}`,
      { encoding: 'utf8' }
    ).trim();

    if (!changed) {
      console.log('[ZTDS Ignore Guard] Only docs/tests/benchmarks/CLI changed. Skipping build to save CPU minutes (exit 0).');
      process.exit(0);
    } else {
      const files = changed.split('\n').map(f => '  - ' + f.trim()).join('\n');
      console.log(`[ZTDS Ignore Guard] Web-relevant changes detected:\n${files}\nProceeding with build (exit 1).`);
      process.exit(1);
    }
  } catch (err) {
    console.warn('[ZTDS Ignore Guard] Diff check error, failing open (exit 1):', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, EXCLUDED_PATTERNS };
