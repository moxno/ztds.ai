#!/usr/bin/env node

/**
 * ZTDS Unified Ecosystem Version Parity Manager (bump-ztds-version)
 * 
 * Atomically enforces universal version parity across:
 * 1. Root & Core Package Manifests (package.json, packages/ztds-core/package.json)
 * 2. Python Reference Package (packages/ztds/pyproject.toml & src/ztds/__init__.py)
 * 3. Standalone Mirrors (/Users/ilya/Desktop/ZTDS_Ecosystem/ztds-python)
 * 4. RFC v1.0 Conformance Test Vectors (conformance/ztds-test-vectors.json)
 * 5. Ecosystem Schema Manifests (data/registry.json, data/companies.json, data/fellows.json)
 * 6. Public Registry Hub Cards (registry/index.html)
 * 7. Catalogs Registry (.agents/catalogs-registry.md)
 * 8. 8-Facet Automated Sync & CI Conformance Verification
 * 
 * Standards Authority: ZTDS AI Consortium & BrandMeWeb Ecosystem
 * Lead Author: Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)
 * 
 * Usage:
 *   node scripts/bump-ztds-version.js 1.2.0           # Explicit SemVer target
 *   node scripts/bump-ztds-version.js patch           # 1.1.0 -> 1.1.1
 *   node scripts/bump-ztds-version.js minor           # 1.1.0 -> 1.2.0
 *   node scripts/bump-ztds-version.js major           # 1.1.0 -> 2.0.0
 *   node scripts/bump-ztds-version.js 1.2.0 --dry-run # Preview changes only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STANDALONE_PYTHON_DIR = '/Users/ilya/Desktop/ZTDS_Ecosystem/ztds-python';

function readFile(relPath) {
  try {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  } catch (e) {
    return null;
  }
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function parseSemVer(ver) {
  const match = String(ver).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.]+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null,
    raw: ver
  };
}

function computeNextVersion(currentVerStr, bumpType) {
  const parsed = parseSemVer(currentVerStr);
  if (!parsed) {
    throw new Error(`Invalid current version string: ${currentVerStr}`);
  }

  if (bumpType === 'major') {
    return `${parsed.major + 1}.0.0`;
  } else if (bumpType === 'minor') {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  } else if (bumpType === 'patch') {
    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }

  const explicit = parseSemVer(bumpType);
  if (explicit) {
    return explicit.raw;
  }

  throw new Error(`Invalid bump target: '${bumpType}'. Must be SemVer (e.g. 1.2.0) or 'patch' | 'minor' | 'major'.`);
}

function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const targetArg = args.find(a => !a.startsWith('--'));

  if (!targetArg) {
    console.error('Usage: node scripts/bump-ztds-version.js <version|patch|minor|major> [--dry-run]');
    process.exit(1);
  }

  console.log('============================================================');
  console.log('ZTDS Unified Ecosystem Version Parity Manager');
  console.log('============================================================\n');

  // 1. Ingest baseline version from packages/ztds-core/package.json
  const corePkgRaw = readFile('packages/ztds-core/package.json');
  if (!corePkgRaw) {
    console.error('FAIL: packages/ztds-core/package.json not found!');
    process.exit(1);
  }
  const corePkg = JSON.parse(corePkgRaw);
  const currentVersion = corePkg.version;
  const nextVersion = computeNextVersion(currentVersion, targetArg);

  console.log(`Current Ecosystem Version: ${currentVersion}`);
  console.log(`Target  Ecosystem Version: ${nextVersion}`);
  if (isDryRun) {
    console.log('[DRY RUN MODE ENABLED: No files will be modified]\n');
  } else {
    console.log('');
  }

  const updates = [];

  // Target 1: packages/ztds-core/package.json
  updates.push({
    name: 'Node.js Core Package (ztds-core)',
    file: 'packages/ztds-core/package.json',
    apply: (content) => {
      const pkg = JSON.parse(content);
      pkg.version = nextVersion;
      return JSON.stringify(pkg, null, 2) + '\n';
    }
  });

  // Target 2: Root package.json
  updates.push({
    name: 'Root Package Manifest (ztds-audit)',
    file: 'package.json',
    apply: (content) => {
      const pkg = JSON.parse(content);
      pkg.version = nextVersion;
      return JSON.stringify(pkg, null, 2) + '\n';
    }
  });

  // Target 3: Python pyproject.toml
  updates.push({
    name: 'Python Package Config (pyproject.toml)',
    file: 'packages/ztds/pyproject.toml',
    apply: (content) => {
      return content.replace(/version\s*=\s*["'][^"']+["']/, `version = "${nextVersion}"`);
    }
  });

  // Target 4: Python __init__.py
  updates.push({
    name: 'Python Module __init__.py',
    file: 'packages/ztds/src/ztds/__init__.py',
    apply: (content) => {
      return content.replace(/__version__\s*=\s*["'][^"']+["']/, `__version__ = "${nextVersion}"`);
    }
  });

  // Target 5: Conformance Test Vectors
  updates.push({
    name: 'RFC v1.0 Test Vectors (ztds-test-vectors.json)',
    file: 'conformance/ztds-test-vectors.json',
    apply: (content) => {
      const data = JSON.parse(content);
      data.version = nextVersion;
      return JSON.stringify(data, null, 2) + '\n';
    }
  });

  // Target 6: data/registry.json
  updates.push({
    name: 'Registry Manifest (data/registry.json)',
    file: 'data/registry.json',
    apply: (content) => {
      const data = JSON.parse(content);
      data.version = nextVersion;
      return JSON.stringify(data, null, 2) + '\n';
    }
  });

  // Target 7: data/companies.json
  updates.push({
    name: 'Corporate Members (data/companies.json)',
    file: 'data/companies.json',
    apply: (content) => {
      const data = JSON.parse(content);
      data.version = nextVersion;
      return JSON.stringify(data, null, 2) + '\n';
    }
  });

  // Target 8: data/fellows.json
  updates.push({
    name: 'Research Fellows (data/fellows.json)',
    file: 'data/fellows.json',
    apply: (content) => {
      const data = JSON.parse(content);
      data.version = nextVersion;
      return JSON.stringify(data, null, 2) + '\n';
    }
  });

  // Target 9: registry/index.html (card tags)
  updates.push({
    name: 'Registry Hub Cards (registry/index.html)',
    file: 'registry/index.html',
    apply: (content) => {
      return content.replace(/MIT &middot; v\d+\.\d+\.\d+/g, `MIT &middot; v${nextVersion}`);
    }
  });

  // Target 10: .agents/catalogs-registry.md
  updates.push({
    name: 'Catalog Registry (.agents/catalogs-registry.md)',
    file: '.agents/catalogs-registry.md',
    apply: (content) => {
      return content
        .replace(/\|\s*\*\*PyPI Registry \(ztds\)\*\*\s*\|[^|]+\|\s*([^|]+)\(v\d+\.\d+\.\d+\)/g, `| **PyPI Registry (ztds)** | https://pypi.org/project/ztds/ | $1(v${nextVersion})`)
        .replace(/\|\s*\*\*GitHub Standalone Repo \(ztds-python\)\*\*\s*\|[^|]+\|\s*([^|]+)\(v\d+\.\d+\.\d+\)/g, `| **GitHub Standalone Repo (ztds-python)** | https://github.com/moxno/ztds-python | $1(v${nextVersion})`);
    }
  });

  // Execute file updates
  let appliedCount = 0;
  for (const item of updates) {
    const original = readFile(item.file);
    if (!original) {
      console.warn(`  [SKIP] File not found: ${item.file}`);
      continue;
    }

    const modified = item.apply(original);
    if (modified !== original) {
      if (!isDryRun) {
        writeFile(item.file, modified);
        console.log(`  [UPDATE] ${item.name.padEnd(46)} -> ${nextVersion}`);
      } else {
        console.log(`  [WOULD UPDATE] ${item.name.padEnd(40)} -> ${nextVersion}`);
      }
      appliedCount++;
    } else {
      console.log(`  [UNCHANGED] ${item.name.padEnd(43)} (already ${nextVersion})`);
    }
  }

  // Update standalone mirror if directory exists
  if (fs.existsSync(STANDALONE_PYTHON_DIR)) {
    console.log(`\n--- Mirroring Version to Standalone Repository (${STANDALONE_PYTHON_DIR}) ---`);
    const pyprojectPath = path.join(STANDALONE_PYTHON_DIR, 'pyproject.toml');
    const initPath = path.join(STANDALONE_PYTHON_DIR, 'src/ztds/__init__.py');

    if (fs.existsSync(pyprojectPath)) {
      const orig = fs.readFileSync(pyprojectPath, 'utf8');
      const mod = orig.replace(/version\s*=\s*["'][^"']+["']/, `version = "${nextVersion}"`);
      if (!isDryRun) fs.writeFileSync(pyprojectPath, mod, 'utf8');
      console.log(`  [MIRROR] Standalone pyproject.toml -> ${nextVersion}`);
    }

    if (fs.existsSync(initPath)) {
      const orig = fs.readFileSync(initPath, 'utf8');
      const mod = orig.replace(/__version__\s*=\s*["'][^"']+["']/, `__version__ = "${nextVersion}"`);
      if (!isDryRun) fs.writeFileSync(initPath, mod, 'utf8');
      console.log(`  [MIRROR] Standalone src/ztds/__init__.py -> ${nextVersion}`);
    }
  }

  if (isDryRun) {
    console.log(`\n[DRY RUN SUMMARY] Tested ${appliedCount} targets. No modifications applied.`);
    process.exit(0);
  }

  console.log(`\n--- Running 8-Facet Registry Synchronization ---`);
  try {
    execSync('node scripts/sync-registry.js', { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error('[ERROR] Registry synchronization failed after version bump:', err.message);
    process.exit(1);
  }

  console.log(`\n--- Verifying Conformance & Test Suites ---`);
  try {
    execSync('node test/conformance.test.js', { cwd: ROOT, stdio: 'inherit' });
    console.log('[PASS] Conformance Test Suite Passed at 100% Invariant Fidelity.');
  } catch (err) {
    console.error('[ERROR] Conformance tests failed after version bump:', err.message);
    process.exit(1);
  }

  console.log('\n============================================================');
  console.log(`UNIVERSAL VERSION PARITY ACHIEVED: v${nextVersion}`);
  console.log('============================================================\n');
}

main();
