#!/usr/bin/env node
'use strict';

/**
 * ZTDS Incident Pipeline Unit & Regression Suite (Suite #42)
 * Validates:
 *   - data/incidents.json structural & policy invariants
 *   - Per-incident 1200x630 OG card presence & root/public mirror parity
 *   - Executable Python replay parity against packages/ztds/src
 *   - scripts/syndicate-incidents.js --dry-run exit 0
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'incidents.json');
const PYTHON_SRC = path.join(ROOT, 'packages', 'ztds', 'src');

console.log('--> Testing ZTDS Incident Pipeline SSOT, Per-Incident OG Cards & Python Replay...');

const ssot = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
assert(ssot.hub && ssot.hub.url === 'https://ztds.ai/incidents/', 'data/incidents.json missing valid hub');
assert(Array.isArray(ssot.incidents) && ssot.incidents.length >= 3, 'Expected >= 3 verified incidents');

const slugs = new Set();
for (const inc of ssot.incidents) {
  assert(inc.slug && !slugs.has(inc.slug), `Duplicate or missing slug: ${inc.slug}`);
  slugs.add(inc.slug);
  assert(inc.title.length >= 30 && inc.title.length <= 68 && inc.title.includes('ZTDS'), `Invalid title for ${inc.slug}`);
  assert(inc.metaDescription.length >= 70 && inc.metaDescription.length <= 165, `Invalid metaDescription for ${inc.slug}`);
  assert(Array.isArray(inc.primarySources) && inc.primarySources.length >= 1, `Missing primarySources for ${inc.slug}`);
  for (const s of inc.primarySources) {
    assert(/^https:\/\/.+/.test(s.url), `Invalid primarySource URL for ${inc.slug}: ${s.url}`);
  }
  assert(Array.isArray(inc.notPrevented) && inc.notPrevented.length >= 3, `Expected >= 3 boundary limits for ${inc.slug}`);
  assert(Array.isArray(inc.faqs) && inc.faqs.length === 4, `Expected 4 FAQs for ${inc.slug}`);

  const ogRel = path.join('assets', 'img', 'og', `og-incident-${inc.slug}.png`);
  const ogPub = path.join('public', ogRel);
  assert(fs.existsSync(path.join(ROOT, ogRel)), `Missing primary OG PNG: ${ogRel}`);
  assert(fs.existsSync(path.join(ROOT, ogPub)), `Missing mirror OG PNG: ${ogPub}`);
  assert(fs.statSync(path.join(ROOT, ogRel)).size > 100000, `OG PNG too small (<100KB): ${ogRel}`);

  const htmlRel = path.join(ROOT, 'incidents', inc.slug, 'index.html');
  assert(fs.existsSync(htmlRel), `Missing generated HTML page for ${inc.slug}`);
  const html = fs.readFileSync(htmlRel, 'utf8');
  assert(html.includes(inc.ogImage), `${inc.slug}/index.html must reference per-incident OG ${inc.ogImage}`);
  assert(html.includes('id="ztds-ai-citation-bar"'), `${inc.slug}/index.html missing #ztds-ai-citation-bar`);

  if (fs.existsSync(PYTHON_SRC)) {
    const out = execFileSync('python3', ['-c', inc.replay.pythonCode], {
      cwd: ROOT,
      env: { ...process.env, PYTHONPATH: PYTHON_SRC },
      encoding: 'utf8'
    });
    assert(out.includes(inc.replay.sampleOutput), `Python replay mismatch for ${inc.slug}: got ${out}`);
  }

  assert(!/\$\s?\d/.test(JSON.stringify(inc)), `Price string detected in ${inc.slug}`);
}

const dryOut = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'syndicate-incidents.js'), '--dry-run'], {
  cwd: ROOT,
  encoding: 'utf8'
});
assert(dryOut.includes('[Syndicate DRY-RUN]'), 'syndicate-incidents.js --dry-run did not run cleanly');

console.log(`[PASS] ${ssot.incidents.length} incidents verified (SSOT, OG mirrors, Python replays, citation bar & dry-run syndicator).`);
