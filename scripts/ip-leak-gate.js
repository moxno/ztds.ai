#!/usr/bin/env node
/**
 * ZTDS.ai — Unified IP, Secret & Confidential Asset Leak Prevention Gate (SSOT)
 *
 * Single deterministic enforcement engine shared identically across:
 *   1. Local Git Pre-Commit Hook (`scripts/pre-commit` -> `.git/hooks/pre-commit` via `--staged`)
 *   2. Local Automated Test Suite (`npm test` via `test/ip-leak-gate.test.js`)
 *   3. GitHub Actions Server-Side CI (`.github/workflows/ip-guard.yml` via `--ci`)
 *
 * Eliminates bash `set -o pipefail` + `grep -q` SIGPIPE (exit 141) fail-open bugs
 * and guarantees 100% rule parity between local commits and GitHub Actions.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_ROOT = path.resolve(__dirname, '..');

const BLOCKED_PATH_PREFIXES = [
  '.agents/',
  '.agent/',
  'keys/ztds_license_private',
  'keys/ztds_ed25519_private',
  'src/core/pii-engine-core',
  'src/core/tree-scrubber',
  'src/core/token-processor',
  'src/core/quota-engine',
  'src/core/worker-manager',
  'src/core/dom.js',
  'src/core/state.js',
  'src/modules/'
];

const REQUIRED_GITIGNORE_ENTRIES = [
  '.agents/',
  '.agent/',
  'keys/ztds_license_private',
  '*.private.pem',
  '*.key.pem'
];

const SELF_GUARD_FILES = new Set([
  'scripts/ip-leak-gate.js',
  'scripts/pre-commit',
  '.github/workflows/ip-guard.yml',
  '.gitignore',
  'test/ip-leak-gate.test.js',
  'test/consortium-neutrality.test.js'
]);

const SYNTHETIC_FIXTURE_PREFIXES = [
  'benchmarks/',
  'public/benchmarks/',
  'conformance/',
  'packages/ztds/'
];

const PRIVATE_KEY_ID_ALLOWED_FILES = new Set([
  'bin/ztds-license-generator.js',
  'test/license.test.js'
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.pdf', '.zip', '.gz', '.tar', '.wasm', '.mp4', '.mp3'
]);

const LARGE_FILE_EXEMPT_EXTENSIONS = new Set([
  '.svg', '.html', '.css', '.json'
]);

// Build sensitive marker patterns dynamically so this file stays clean even under naive external grep
const PEM_PHRASE = ['PRIVATE', 'KEY'].join(' ');
const NOTEBOOK_ID = ['2d2138bf', '851b', '4911', '95d6', '94b17729c8a4'].join('-');
const PATENT_NUM = ['IL', '331905'].join('\\s*');
const PATENT_DATE = ['14', '09', '2026'].join('\\/');
const WIPO_DAS = ['B1', '7B'].join('');
const PRIVATE_REPO = ['github\\.com', 'moxno', 'PrivacyScrubber'].join('\\/');

const SECRET_RULES = [
  {
    id: 'PEM_PRIVATE_KEY',
    desc: 'Private key material or literal PEM key marker',
    regex: new RegExp(`-----BEGIN[^-\\n]*${PEM_PHRASE}-----|\\b${PEM_PHRASE}\\b`)
  },
  {
    id: 'API_KEY_SK',
    desc: 'Live/synthetic sk-* secret key literal',
    regex: /\bsk-[a-zA-Z0-9_-]{20,}\b/
  },
  {
    id: 'STRIPE_SECRET_KEY',
    desc: 'Stripe secret key literal',
    regex: /\bsk_(?:live|test)_[a-zA-Z0-9]+\b/
  },
  {
    id: 'GITHUB_PAT',
    desc: 'GitHub personal access token literal',
    regex: /\bghp_[a-zA-Z0-9]{36}\b/
  },
  {
    id: 'GOOGLE_API_KEY',
    desc: 'Google Cloud / Firebase API key literal',
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/
  },
  {
    id: 'AWS_ACCESS_KEY',
    desc: 'AWS IAM access key ID literal',
    regex: /\bAKIA(?![0-9A-Z]*EXAMPLE\b)[0-9A-Z]{16}\b/
  },
  {
    id: 'PADDLE_SECRET_KEY',
    desc: 'Paddle API secret key literal',
    regex: /\bpaddle(?:secret|_live|_test)_[a-zA-Z0-9]+\b/i
  },
  {
    id: 'HARDCODED_ENV_SECRET',
    desc: 'Hardcoded secret assignment to sensitive environment variable',
    regex: /\b(?:SERPER_API_KEY|SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|PADDLE_API_KEY|STRIPE_SECRET|RESEND_API_KEY)\s*=\s*["'][^"']+/
  }
];

const COMMERCIAL_IP_RULES = [
  {
    id: 'COMMERCIAL_ENGINE_ID',
    desc: 'PrivacyScrubber closed-source engine identifier',
    regex: /\b(?:pii-engine-core|piiEngineCore|tree-scrubber|treeScrubber|quota-engine|quotaEngine|worker-manager|workerManager|HIPAA_PHI_PATTERNS|IBAN_PATTERNS|FRE_502_PATTERNS|CLOUD_SECRET_PATTERNS)\b|(?:PROFILE_RULES|industryProfiles)\s*=/
  },
  {
    id: 'NOTEBOOKLM_INTERNAL_ID',
    desc: 'Internal NotebookLM grounding notebook identifier',
    regex: new RegExp(`NotebookLM[^\\n]{0,40}Notebook[^\\n]{0,20}ID|${NOTEBOOK_ID}`, 'i')
  },
  {
    id: 'PRIVATE_REPO_URL',
    desc: 'Confidential private repository URL',
    regex: new RegExp(PRIVATE_REPO, 'i')
  },
  {
    id: 'UNPUBLISHED_PATENT_DETAIL',
    desc: 'Unpublished patent application number, filing date, or WIPO DAS access code',
    regex: new RegExp(`\\b${PATENT_NUM}\\b|\\b${PATENT_DATE}\\b|\\b${WIPO_DAS}\\b`)
  }
];

const PRIVATE_KEY_FILENAME_REGEX = /\b(?:ztds_license_private|ztds_ed25519_private)\b/;

function normalizeRelPath(relPath) {
  return relPath.split(path.sep).join('/').replace(/^\.\//, '');
}

function isBlockedPath(relPath) {
  if (relPath.includes('.example')) return null;

  for (const prefix of BLOCKED_PATH_PREFIXES) {
    if (relPath === prefix.replace(/\/$/, '') || relPath.startsWith(prefix) || relPath.includes(`/${prefix}`)) {
      return `matches protected path pattern "${prefix}"`;
    }
  }

  const base = path.posix.basename(relPath);
  if ((base === '.env' || base.startsWith('.env.')) && !base.endsWith('.example')) {
    return 'environment file (.env*) must never be committed';
  }
  if (relPath.endsWith('.private.pem') || relPath.endsWith('.key.pem')) {
    return 'private PEM key file (*.private.pem / *.key.pem) must never be committed';
  }

  return null;
}

function isBinaryBuffer(buf) {
  const sampleLen = Math.min(buf.length, 4096);
  for (let i = 0; i < sampleLen; i++) {
    if (buf[i] === 0) return true;
  }
  return false;
}

function listCandidateFiles(rootDir, includeStaged) {
  const fileMap = new Map(); // relPath -> { source: 'index' | 'worktree', stagedBlob: boolean }

  const trackedOut = execFileSync('git', ['ls-files', '-z'], {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });
  for (const raw of trackedOut.split('\0')) {
    if (!raw) continue;
    fileMap.set(normalizeRelPath(raw), { stagedBlob: false });
  }

  if (includeStaged) {
    const stagedStatusOut = execFileSync('git', ['diff', '--cached', '--name-status', '-z'], {
      cwd: rootDir,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024
    });
    const tokens = stagedStatusOut.split('\0').filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      const status = tokens[i];
      if (status.startsWith('R') || status.startsWith('C')) {
        const oldPath = normalizeRelPath(tokens[++i] || '');
        const newPath = normalizeRelPath(tokens[++i] || '');
        if (status.startsWith('R') && oldPath) fileMap.delete(oldPath);
        if (newPath) fileMap.set(newPath, { stagedBlob: true });
      } else {
        const filePath = normalizeRelPath(tokens[++i] || '');
        if (!filePath) continue;
        if (status === 'D') {
          fileMap.delete(filePath);
        } else {
          fileMap.set(filePath, { stagedBlob: true });
        }
      }
    }
  }

  return fileMap;
}

function readCandidateBuffer(rootDir, relPath, meta) {
  if (meta && meta.stagedBlob) {
    try {
      return execFileSync('git', ['show', `:${relPath}`], {
        cwd: rootDir,
        maxBuffer: 32 * 1024 * 1024
      });
    } catch (_) {
      // Fall back to working tree if index lookup fails
    }
  }
  const absPath = path.join(rootDir, relPath);
  if (!fs.existsSync(absPath)) return null;
  const stat = fs.statSync(absPath);
  if (!stat.isFile()) return null;
  return fs.readFileSync(absPath);
}

function findLineNumber(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function auditRepository(options = {}) {
  const rootDir = options.rootDir ? path.resolve(options.rootDir) : DEFAULT_ROOT;
  const includeStaged = Boolean(options.includeStaged);
  const violations = [];
  const warnings = [];

  // 1. Verify .gitignore mandatory exclusions
  const gitignoreBuf = readCandidateBuffer(rootDir, '.gitignore', { stagedBlob: includeStaged });
  if (!gitignoreBuf) {
    violations.push({
      file: '.gitignore',
      line: 1,
      rule: 'GITIGNORE_MISSING',
      message: '.gitignore file is missing from repository root'
    });
  } else {
    const gitignoreText = gitignoreBuf.toString('utf8');
    for (const requiredEntry of REQUIRED_GITIGNORE_ENTRIES) {
      if (!gitignoreText.includes(requiredEntry)) {
        violations.push({
          file: '.gitignore',
          line: 1,
          rule: 'GITIGNORE_EXCLUSION_MISSING',
          message: `.gitignore is missing required exclusion "${requiredEntry}"`
        });
      }
    }
  }

  // 2. Enumerate tracked (+ staged) files
  const candidates = listCandidateFiles(rootDir, includeStaged);

  for (const [relPath, meta] of candidates.entries()) {
    const blockedReason = isBlockedPath(relPath);
    if (blockedReason) {
      violations.push({
        file: relPath,
        line: 1,
        rule: 'BLOCKED_PATH',
        message: blockedReason
      });
      continue;
    }

    if (SELF_GUARD_FILES.has(relPath)) continue;
    if (relPath.includes('.example')) continue;

    const ext = path.posix.extname(relPath).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;

    const buf = readCandidateBuffer(rootDir, relPath, meta);
    if (!buf) continue;

    if (buf.length > 512000 && !LARGE_FILE_EXEMPT_EXTENSIONS.has(ext)) {
      warnings.push({
        file: relPath,
        bytes: buf.length,
        message: `Large file (${buf.length} bytes) — verify no sensitive data dump`
      });
    }

    if (isBinaryBuffer(buf)) continue;

    const content = buf.toString('utf8');
    const isSyntheticFixture = SYNTHETIC_FIXTURE_PREFIXES.some((p) => relPath.startsWith(p));

    if (!isSyntheticFixture) {
      for (const rule of SECRET_RULES) {
        const match = rule.regex.exec(content);
        if (match) {
          violations.push({
            file: relPath,
            line: findLineNumber(content, match.index),
            rule: rule.id,
            message: `${rule.desc} ("${match[0].slice(0, 32)}...")`
          });
        }
      }
    }

    for (const rule of COMMERCIAL_IP_RULES) {
      const match = rule.regex.exec(content);
      if (match) {
        violations.push({
          file: relPath,
          line: findLineNumber(content, match.index),
          rule: rule.id,
          message: `${rule.desc} ("${match[0].slice(0, 40)}")`
        });
      }
    }

    if (!PRIVATE_KEY_ID_ALLOWED_FILES.has(relPath)) {
      const keyNameMatch = PRIVATE_KEY_FILENAME_REGEX.exec(content);
      if (keyNameMatch) {
        violations.push({
          file: relPath,
          line: findLineNumber(content, keyNameMatch.index),
          rule: 'PRIVATE_KEY_FILENAME_REF',
          message: `Reference to private key identifier "${keyNameMatch[0]}" outside authorized CLI/test scope`
        });
      }
    }
  }

  return {
    ok: violations.length === 0,
    scannedFiles: candidates.size,
    violations,
    warnings
  };
}

function runCli() {
  const args = new Set(process.argv.slice(2));
  const includeStaged = args.has('--staged');
  const ciMode = args.has('--ci') || process.env.GITHUB_ACTIONS === 'true';
  const jsonMode = args.has('--json');

  const startMs = Date.now();
  const result = auditRepository({ rootDir: DEFAULT_ROOT, includeStaged });
  const elapsedMs = Date.now() - startMs;

  if (jsonMode) {
    process.stdout.write(JSON.stringify({ ...result, elapsedMs }, null, 2) + '\n');
    process.exit(result.ok ? 0 : 1);
  }

  const scopeLabel = includeStaged ? 'staged + tracked git index' : 'tracked git tree';
  console.log(`[ZTDS IP Guard] Scanned ${result.scannedFiles} files (${scopeLabel}) in ${elapsedMs}ms.`);

  for (const w of result.warnings) {
    console.warn(`[WARNING] ${w.file}: ${w.message}`);
  }

  if (!result.ok) {
    for (const v of result.violations) {
      if (ciMode) {
        console.error(`::error file=${v.file},line=${v.line}::[${v.rule}] ${v.message}`);
      } else {
        console.error(`[BLOCKED] ${v.file}:${v.line} [${v.rule}] — ${v.message}`);
      }
    }
    console.error(`\n[ZTDS IP Guard] FAILED: ${result.violations.length} violation(s) detected.`);
    process.exit(1);
  }

  console.log('[ZTDS IP Guard] PASS: 0 secret, key, path, or commercial IP leaks detected.');
}

if (require.main === module) {
  runCli();
}

module.exports = {
  auditRepository
};
