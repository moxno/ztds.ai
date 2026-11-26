#!/usr/bin/env node
/**
 * ZTDS IndexNow Instant Search Engine Notification Utility
 * Default mode: Diff-only (submits only new or modified URLs since last run).
 * Flags:
 *   --all       Submit every URL in public/sitemap.xml regardless of diff
 *   --dry-run   Preview URLs queued for submission without calling IndexNow API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const KEY = '3e691e75a7af4e158e48ab001cab95ef';
const HOST = 'ztds.ai';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const LOG_PATH = path.join(__dirname, '.indexnow-last-submit.json');

const args = process.argv.slice(2);
const SUBMIT_ALL = args.includes('--all');
const DRY_RUN = args.includes('--dry-run');

function loadLog() {
  if (!fs.existsSync(LOG_PATH)) {
    return { lastSubmit: null, totalSubmitted: 0, fingerprints: {} };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
    return {
      lastSubmit: parsed.lastSubmit || null,
      totalSubmitted: Number(parsed.totalSubmitted) || 0,
      fingerprints: parsed.fingerprints && typeof parsed.fingerprints === 'object' ? parsed.fingerprints : {},
    };
  } catch {
    return { lastSubmit: null, totalSubmitted: 0, fingerprints: {} };
  }
}

function saveLog(prevLog, submittedEntries) {
  const mergedFingerprints = { ...prevLog.fingerprints };
  for (const { url, lastmod } of submittedEntries) {
    mergedFingerprints[url] = lastmod;
  }
  fs.writeFileSync(
    LOG_PATH,
    JSON.stringify(
      {
        lastSubmit: new Date().toISOString(),
        totalSubmitted: submittedEntries.length,
        fingerprints: mergedFingerprints,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
}

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const urlBlocks = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || [];

const entries = urlBlocks
  .map((block) => {
    const locMatch = block.match(/<loc>(https:\/\/[^<]+)<\/loc>/);
    if (!locMatch) return null;
    const modMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    return {
      url: locMatch[1].trim(),
      lastmod: modMatch ? modMatch[1].trim() : '',
    };
  })
  .filter(Boolean);

if (entries.length === 0) {
  console.error('[INDEXNOW] Error: No URLs found in public/sitemap.xml');
  process.exit(1);
}

const prevLog = loadLog();
const toSubmit = SUBMIT_ALL
  ? entries
  : entries.filter(({ url, lastmod }) => prevLog.fingerprints[url] !== lastmod);

console.log(`[INDEXNOW] Total URLs in sitemap: ${entries.length}`);
console.log(
  `[INDEXNOW] ${SUBMIT_ALL ? 'Full-sitemap mode' : 'Diff-only mode'}: ${toSubmit.length} URL(s) queued for ${HOST}.`
);

if (toSubmit.length === 0) {
  console.log('[INDEXNOW] No new or updated URLs since last run. Skipping API call.');
  process.exit(0);
}

if (DRY_RUN) {
  console.log('[INDEXNOW] Dry run — URLs that would be submitted:');
  toSubmit.forEach(({ url, lastmod }) => console.log(`  - ${url} (${lastmod || 'no-lastmod'})`));
  process.exit(0);
}

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: toSubmit.map((e) => e.url),
});

const req = https.request(
  {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  },
  (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 202) {
        saveLog(prevLog, toSubmit);
        console.log(
          `[INDEXNOW] Success! HTTP ${res.statusCode} — ${toSubmit.length} URL(s) submitted to IndexNow.`
        );
      } else {
        console.warn(
          `[INDEXNOW] Response status: HTTP ${res.statusCode} — ${responseData || res.statusMessage}`
        );
        process.exitCode = 1;
      }
    });
  }
);

req.on('error', (err) => {
  console.error('[INDEXNOW] Network error submitting to IndexNow:', err.message);
  process.exitCode = 1;
});

req.write(payload);
req.end();
