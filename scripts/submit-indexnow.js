#!/usr/bin/env node
/**
 * ZTDS IndexNow Instant Search Engine Notification Utility
 * Automatically submits all URLs from public/sitemap.xml to the IndexNow API
 * (Indexing Bing, Yandex, Seznam, Naver in real-time).
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const KEY = '3e691e75a7af4e158e48ab001cab95ef';
const HOST = 'ztds.ai';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Extract URLs from sitemap.xml
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = sitemapXml.match(/<loc>(https:\/\/[^<]+)<\/loc>/g);

if (!urlMatches || urlMatches.length === 0) {
  console.error('[INDEXNOW] Error: No URLs found in sitemap.xml');
  process.exit(1);
}

const urlList = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

console.log(`[INDEXNOW] Preparing submission of ${urlList.length} URLs for host ${HOST}...`);

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

const req = https.request({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let responseData = '';
  res.on('data', chunk => { responseData += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`[INDEXNOW] Success! HTTP ${res.statusCode} — ${urlList.length} URLs submitted to IndexNow (Bing, Yandex, Naver).`);
    } else {
      console.warn(`[INDEXNOW] Response status: HTTP ${res.statusCode} — ${responseData || res.statusMessage}`);
    }
  });
});

req.on('error', (err) => {
  console.error('[INDEXNOW] Network error submitting to IndexNow:', err.message);
});

req.write(payload);
req.end();
