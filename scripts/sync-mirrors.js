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
  ['assets/js/home-workbench.js', 'public/assets/js/home-workbench.js'],
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
  ['assets/img/ilya-sibiryakov.jpg', 'public/assets/img/ilya-sibiryakov.jpg'],
  ['assets/img/cliford-fanyuy.jpg', 'public/assets/img/cliford-fanyuy.jpg'],
  ['site.webmanifest', 'public/site.webmanifest'],
  ['og-image.png', 'public/og-image.png'],
  ['mcp_config.json', 'public/mcp_config.json'],
  ['plugin.json', 'public/plugin.json'],
  ['server-card.json', 'public/server-card.json'],
  ['server-card.json', 'public/.well-known/mcp/server-card.json'],
  ['.well-known/security.txt', 'public/.well-known/security.txt'],
  ['.well-known/pgp-key.txt', 'public/.well-known/pgp-key.txt'],
  ['.well-known/mcp.json', 'public/.well-known/mcp.json'],
  ['.well-known/agent.json', 'public/.well-known/agent.json'],
  ['.well-known/agent-card.json', 'public/.well-known/agent-card.json'],
  ['.well-known/ai-plugin.json', 'public/.well-known/ai-plugin.json'],
  ['ciso/memo/index.html', 'ciso/memo.html'],
  ['ietf/draft-sibiryakov-ztds-protocol-01/index.html', 'ietf/draft-sibiryakov-ztds-protocol-01.html'],
  ['ietf/draft-sibiryakov-ztds-protocol-02/index.html', 'ietf/draft-sibiryakov-ztds-protocol-02.html'],
  ['docs/legal/order-form/index.html', 'docs/legal/order-form.html'],
  ['docs/legal/order-form/index.html', 'public/docs/legal/order-form/index.html'],
  ['docs/legal/order-form/index.html', 'public/docs/legal/order-form.html'],
  ['docs/enterprise/ZTDS_Enterprise_Security_Pack.zip', 'public/docs/ZTDS_Enterprise_Security_Pack.zip']
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

// Synchronize assets/js/pages/*.js <-> public/assets/js/pages/*.js
const pagesJsDir = path.join(rootDir, 'assets/js/pages');
const pubPagesJsDir = path.join(rootDir, 'public/assets/js/pages');
if (fs.existsSync(pagesJsDir)) {
  fs.mkdirSync(pubPagesJsDir, { recursive: true });
  for (const file of fs.readdirSync(pagesJsDir)) {
    if (!file.endsWith('.js')) continue;
    const src = path.join(pagesJsDir, file);
    const dst = path.join(pubPagesJsDir, file);
    const srcBuf = fs.readFileSync(src);
    if (!fs.existsSync(dst) || !srcBuf.equals(fs.readFileSync(dst))) {
      fs.writeFileSync(dst, srcBuf);
      syncedCount++;
    }
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

// Synchronize docs/legal/*.{md,txt} <-> public/docs/legal/*.{md,txt}
const legalDir = path.join(rootDir, 'docs/legal');
const pubLegalDir = path.join(rootDir, 'public/docs/legal');
if (fs.existsSync(legalDir) && fs.existsSync(pubLegalDir)) {
  for (const file of fs.readdirSync(legalDir)) {
    if (!file.endsWith('.md') && !file.endsWith('.txt')) continue;
    const src = path.join(legalDir, file);
    const dst = path.join(pubLegalDir, file);
    if (!fs.statSync(src).isFile()) continue;
    const srcBuf = fs.readFileSync(src);
    if (!fs.existsSync(dst) || !srcBuf.equals(fs.readFileSync(dst))) {
      fs.writeFileSync(dst, srcBuf);
      syncedCount++;
    }
  }
}

// Synchronize scripts/pre-commit <-> .git/hooks/pre-commit so local Git hooks never drift
const preCommitSrc = path.join(rootDir, 'scripts/pre-commit');
const gitHooksDir = path.join(rootDir, '.git/hooks');
if (fs.existsSync(preCommitSrc) && fs.existsSync(gitHooksDir)) {
  const preCommitDst = path.join(gitHooksDir, 'pre-commit');
  const srcBuf = fs.readFileSync(preCommitSrc);
  if (!fs.existsSync(preCommitDst) || !srcBuf.equals(fs.readFileSync(preCommitDst))) {
    fs.writeFileSync(preCommitDst, srcBuf, { mode: 0o755 });
    syncedCount++;
  }
  fs.chmodSync(preCommitDst, 0o755);
}

console.log(`[ZTDS Build] Mirror sync complete (${mirrorPairs.length} canonical pairs verified, ${syncedCount} updated).`);
