#!/usr/bin/env node
/**
 * ZTDS.ai — Publications Catalog Deduplication, Isolation & Version-Parity Auditor
 * Validates .agents/publications-ztds.json against .agents/catalogs-registry.md
 * and live workspace package manifests without touching network or git history.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, '.agents', 'publications-ztds.json');
const MD_PATH = path.join(ROOT, '.agents', 'catalogs-registry.md');

const VALID_CATEGORIES = new Set([
  'standards_and_academic',
  'ip_filings',
  'packages_and_repos',
  'mcp_and_developer_directories',
  'articles_and_syndications',
  'ecosystem_prs_and_issues'
]);

const FORBIDDEN_COMMERCIAL_PATTERNS = [
  'privacyscrubber.com',
  '@privacyscrubber/',
  'privacyscrubber-mcp',
  'privacyscrubber-sdk',
  'privacyscrubber-ztds-guard',
  'pimoejgefeilajmmbpghifdmhdlkgjol'
];

function normalizeUrl(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '');
}

function normalizeTitle(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.log('[SKIP] .agents/publications-ztds.json not present (public checkout mode).');
    process.exit(0);
  }

  const rawJson = fs.readFileSync(JSON_PATH, 'utf8');
  const catalog = JSON.parse(rawJson);
  const errors = [];

  if (catalog.project !== 'ztds') {
    errors.push(`Expected project="ztds", found "${catalog.project}"`);
  }
  if (!Array.isArray(catalog.entries) || catalog.entries.length === 0) {
    errors.push('catalog.entries must be a non-empty array');
  }

  const mdContent = fs.existsSync(MD_PATH) ? fs.readFileSync(MD_PATH, 'utf8') : '';
  if (!mdContent) {
    errors.push('Missing .agents/catalogs-registry.md companion file');
  }

  const seenIds = new Set();
  const seenSlugs = new Set();
  const seenUrls = new Set();
  const seenTitles = new Set();
  const byId = new Map();

  for (const [idx, entry] of (catalog.entries || []).entries()) {
    const label = entry.id || `index:${idx}`;
    for (const reqField of ['id', 'slug', 'category', 'platform', 'title', 'url', 'status', 'last_verified']) {
      if (typeof entry[reqField] !== 'string' || !entry[reqField].trim()) {
        errors.push(`[${label}] Missing or empty required field "${reqField}"`);
      }
    }
    if (!VALID_CATEGORIES.has(entry.category)) {
      errors.push(`[${label}] Invalid category "${entry.category}"`);
    }

    if (seenIds.has(entry.id)) errors.push(`Duplicate id detected: ${entry.id}`);
    seenIds.add(entry.id);

    if (seenSlugs.has(entry.slug)) errors.push(`Duplicate slug detected: ${entry.slug}`);
    seenSlugs.add(entry.slug);

    const nUrl = normalizeUrl(entry.url);
    if (seenUrls.has(nUrl)) errors.push(`Duplicate URL detected: ${entry.url}`);
    seenUrls.add(nUrl);

    const nTitle = normalizeTitle(entry.title);
    if (seenTitles.has(nTitle)) errors.push(`Duplicate normalized title detected: ${entry.title}`);
    seenTitles.add(nTitle);

    for (const forbidden of FORBIDDEN_COMMERCIAL_PATTERNS) {
      if (nUrl.includes(forbidden) || normalizeUrl(entry.canonical_url).includes(forbidden)) {
        errors.push(`[${label}] Project isolation violation: commercial PrivacyScrubber reference "${forbidden}" found in ZTDS catalog`);
      }
    }

    if (entry.url && entry.url.startsWith('https://') && mdContent && !mdContent.includes(entry.url)) {
      errors.push(`[${label}] URL missing from .agents/catalogs-registry.md: ${entry.url}`);
    }

    byId.set(entry.id, entry);
  }

  // Live workspace package version parity checks
  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const mcpPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages', 'ztds-mcp', 'package.json'), 'utf8'));

  const auditEntry = byId.get('npm-ztds-audit');
  if (!auditEntry || auditEntry.version_published !== rootPkg.version) {
    errors.push(`Version drift on npm-ztds-audit: catalog=${auditEntry && auditEntry.version_published}, package.json=${rootPkg.version}`);
  }

  const mcpEntry = byId.get('npm-ztds-mcp');
  if (!mcpEntry || mcpEntry.version_published !== mcpPkg.version) {
    errors.push(`Version drift on npm-ztds-mcp: catalog=${mcpEntry && mcpEntry.version_published}, packages/ztds-mcp/package.json=${mcpPkg.version}`);
  }

  if (errors.length > 0) {
    console.error(`[FAIL] ZTDS Publications Audit found ${errors.length} violation(s):`);
    for (const err of errors) console.error('  - ' + err);
    process.exit(1);
  }

  console.log(`[PASS] ZTDS Publications Audit: ${catalog.entries.length} entries verified (0 duplicates, 0 commercial leaks, npm/repo version parity 100%).`);
}

main();
