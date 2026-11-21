#!/usr/bin/env node
'use strict';

/**
 * Per-Incident Open Graph (1200x630 PNG) Card Generator
 *
 * Reads data/incidents.json via scripts/data/incident-pages.js and renders
 * unique 1200x630 OG cards (`assets/img/og/og-incident-<slug>.png` + `public/` mirror)
 * without touching any other PNGs or unrelated HTML pages.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { INCIDENTS } = require('./data/incident-pages');
const { buildCardHtml, findChrome } = require('./generate-og-images');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIRS = [
  path.join(ROOT, 'assets', 'img', 'og'),
  path.join(ROOT, 'public', 'assets', 'img', 'og')
];
const FALLBACK_OG = path.join(OUT_DIRS[0], 'og-incidents.png');

function truncateText(str, max) {
  const s = String(str || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 3)}...` : s;
}

function buildIncidentCardSpec(inc) {
  const ms = inc.matrixSummary || {};
  return {
    filename: `og-incident-${inc.slug}.png`,
    kicker: `ZTDS™ POST-MORTEM · ${String(inc.dateLabel || 'VERIFIED').toUpperCase()}`,
    routeLabel: `ztds.ai/incidents/${truncateText(inc.slug, 36)}`,
    accent: '#10b981',
    accentSecondary: '#f59e0b',
    title: truncateText(inc.title.replace(/\s*\|\s*ZTDS.*$/i, ''), 48),
    subtitle: truncateText(inc.metaDescription, 145),
    metrics: [
      { value: '0.00 B', label: 'Raw Payload Egress' },
      { value: 'RFC v1.0', label: 'Invariants 1–4 Mapped' },
      { value: 'Python/CLI', label: 'Verified Replay' }
    ],
    diagramTitle: `TRUST BOUNDARY // ${truncateText(inc.shortLabel || inc.slug, 32).toUpperCase()}`,
    diagramRows: [
      {
        badge: 'VECTOR',
        code: truncateText(ms.rootVector || inc.diagram?.midLeft || 'Unmasked external vendor dispatch', 42),
        status: 'INCIDENT',
        statusColor: '#ef4444'
      },
      {
        badge: 'RAM GATE',
        code: truncateText(inc.diagram?.topRight || 'ZTDS pre-egress volatile RAM gate', 42),
        status: '< 0.05 ms',
        statusColor: '#10b981'
      },
      {
        badge: 'CONTROL',
        code: truncateText(ms.ztdsControl || 'Bracketed surrogates cross socket only', 42),
        status: 'ZERO EGRESS',
        statusColor: '#10b981'
      },
      {
        badge: 'LIMIT',
        code: truncateText(ms.boundaryLimit || inc.notPrevented?.[0] || 'Orthogonal IAM & sandbox required', 42),
        status: 'BOUNDARY',
        statusColor: '#f59e0b'
      },
      {
        badge: 'REPLAY',
        code: truncateText(inc.replay?.cliCmd || 'npx ztds-audit --conformance', 42),
        status: 'VERIFIED',
        statusColor: '#38bdf8'
      }
    ]
  };
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const slugArg = args.find(a => a.startsWith('--slug='));
  const targetSlug = slugArg ? slugArg.split('=')[1] : null;

  for (const dir of OUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let chromeBin = null;
  try {
    chromeBin = findChrome();
  } catch (_) {
    chromeBin = null;
  }

  const targets = targetSlug ? INCIDENTS.filter(i => i.slug === targetSlug) : INCIDENTS;
  if (targetSlug && targets.length === 0) {
    throw new Error(`No incident found matching --slug=${targetSlug}`);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ztds-inc-og-'));
  let generated = 0;
  let mirrored = 0;

  try {
    for (const inc of targets) {
      const card = buildIncidentCardSpec(inc);
      const outPrimary = path.join(OUT_DIRS[0], card.filename);
      const outPublic = path.join(OUT_DIRS[1], card.filename);

      if (!force && fs.existsSync(outPrimary) && fs.statSync(outPrimary).size > 0) {
        if (!fs.existsSync(outPublic) || !fs.readFileSync(outPrimary).equals(fs.readFileSync(outPublic))) {
          fs.copyFileSync(outPrimary, outPublic);
          mirrored++;
        }
        continue;
      }

      if (chromeBin) {
        const htmlPath = path.join(tmpDir, `${card.filename}.html`);
        fs.writeFileSync(htmlPath, buildCardHtml(card), 'utf8');
        execFileSync(
          chromeBin,
          [
            '--headless=new',
            '--no-sandbox',
            '--disable-gpu',
            '--hide-scrollbars',
            '--force-device-scale-factor=1',
            '--window-size=1200,630',
            `--screenshot=${outPrimary}`,
            `file://${htmlPath}`
          ],
          { stdio: 'ignore' }
        );
      } else if (fs.existsSync(FALLBACK_OG)) {
        fs.copyFileSync(FALLBACK_OG, outPrimary);
        console.warn(`[Incident OG] Chrome not available; copied fallback for ${card.filename}`);
      } else {
        throw new Error(`No Chrome binary and missing fallback ${FALLBACK_OG}`);
      }

      fs.copyFileSync(outPrimary, outPublic);
      const kb = (fs.statSync(outPrimary).size / 1024).toFixed(1);
      console.log(`[Incident OG] Rendered ${card.filename} (${kb} KB)`);
      generated++;
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log(`[Incident OG] Complete (${generated} rendered, ${mirrored} mirror-synced, ${targets.length} total).`);
}

if (require.main === module) {
  main();
}

module.exports = { buildIncidentCardSpec };
