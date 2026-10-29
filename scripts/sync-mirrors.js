#!/usr/bin/env node
/**
 * ZTDS.ai — Deterministic Build Mirror Synchronizer
 * Ensures root <-> public/ and directory <-> .html mirror pairs never drift.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const mirrorPairs = [
  ['assets/js/scanner-engine.js', 'public/assets/js/scanner-engine.js'],
  ['sitemap.xml', 'public/sitemap.xml'],
  ['llms.txt', 'public/llms.txt'],
  ['llms-full.txt', 'public/llms-full.txt'],
  ['robots.txt', 'public/robots.txt'],
  ['favicon.svg', 'public/favicon.svg'],
  ['favicon.ico', 'public/favicon.ico'],
  ['assets/img/favicon-48.png', 'public/assets/img/favicon-48.png'],
  ['assets/img/favicon-96.png', 'public/assets/img/favicon-96.png'],
  ['assets/img/favicon-192.png', 'public/assets/img/favicon-192.png'],
  ['assets/img/apple-touch-icon.png', 'public/assets/img/apple-touch-icon.png'],
  ['assets/img/logo-512.png', 'public/assets/img/logo-512.png'],
  ['site.webmanifest', 'public/site.webmanifest'],
  ['og-image.png', 'public/og-image.png'],
  ['mcp_config.json', 'public/mcp_config.json'],
  ['plugin.json', 'public/plugin.json'],
  ['server-card.json', 'public/server-card.json'],
  ['server-card.json', 'public/.well-known/mcp/server-card.json'],
  ['.well-known/security.txt', 'public/.well-known/security.txt'],
  ['.well-known/mcp.json', 'public/.well-known/mcp.json'],
  ['.well-known/agent.json', 'public/.well-known/agent.json'],
  ['.well-known/ai-plugin.json', 'public/.well-known/ai-plugin.json'],
  ['ciso/memo/index.html', 'ciso/memo.html'],
  ['ietf/draft-sibiryakov-ztds-protocol-01/index.html', 'ietf/draft-sibiryakov-ztds-protocol-01.html'],
  ['ietf/draft-sibiryakov-ztds-protocol-02/index.html', 'ietf/draft-sibiryakov-ztds-protocol-02.html'],
  ['docs/legal/order-form/index.html', 'docs/legal/order-form.html'],
  ['docs/legal/order-form/index.html', 'public/docs/legal/order-form/index.html'],
  ['docs/legal/order-form/index.html', 'public/docs/legal/order-form.html']
];

let syncedCount = 0;

for (const [srcRel, dstRel] of mirrorPairs) {
  const srcPath = path.join(rootDir, srcRel);
  const dstPath = path.join(rootDir, dstRel);
  if (!fs.existsSync(srcPath)) continue;

  const srcBuf = fs.readFileSync(srcPath);
  const dstExists = fs.existsSync(dstPath);
  const dstBuf = dstExists ? fs.readFileSync(dstPath) : null;

  if (!dstBuf || !srcBuf.equals(dstBuf)) {
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.writeFileSync(dstPath, srcBuf);
    syncedCount++;
  }
}

// Synchronize badge/*.svg <-> public/badge/*.svg
const badgeDir = path.join(rootDir, 'badge');
const pubBadgeDir = path.join(rootDir, 'public/badge');
if (fs.existsSync(badgeDir) && fs.existsSync(pubBadgeDir)) {
  for (const file of fs.readdirSync(badgeDir)) {
    if (!file.endsWith('.svg')) continue;
    const src = path.join(badgeDir, file);
    const dst = path.join(pubBadgeDir, file);
    const srcBuf = fs.readFileSync(src);
    if (!fs.existsSync(dst) || !srcBuf.equals(fs.readFileSync(dst))) {
      fs.writeFileSync(dst, srcBuf);
      syncedCount++;
    }
  }
}

// Synchronize assets/img/companies/*.svg <-> public/assets/img/companies/*.svg
const compLogoDir = path.join(rootDir, 'assets/img/companies');
const pubCompLogoDir = path.join(rootDir, 'public/assets/img/companies');
if (fs.existsSync(compLogoDir)) {
  fs.mkdirSync(pubCompLogoDir, { recursive: true });
  for (const file of fs.readdirSync(compLogoDir)) {
    if (!file.endsWith('.svg')) continue;
    const src = path.join(compLogoDir, file);
    const dst = path.join(pubCompLogoDir, file);
    const srcBuf = fs.readFileSync(src);
    if (!fs.existsSync(dst) || !srcBuf.equals(fs.readFileSync(dst))) {
      fs.writeFileSync(dst, srcBuf);
      syncedCount++;
    }
  }
}

console.log(`[ZTDS Build] Mirror sync complete (${mirrorPairs.length} canonical pairs verified, ${syncedCount} updated).`);
