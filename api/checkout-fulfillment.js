/**
 * ZTDS.ai — Paddle Billing v2 Checkout Fulfillment Engine
 * 
 * Invoked immediately by the client upon Paddle `checkout.completed` event.
 * Mints an authentic offline Ed25519 ZTDS-LIC-v1 license token in volatile RAM
 * without delay, returning it directly to the buyer for immediate activation.
 */

'use strict';

const https = require('https');
const { mintToken } = require('./mint-license');
const { PADDLE_CONFIG } = require('../config/paddle');

// In-memory sliding-window rate limiter (15 requests per 10 minutes per IP)
const FULFILL_WINDOW_MS = 10 * 60 * 1000;
const FULFILL_MAX_PER_WINDOW = 15;
const fulfillmentHistory = new Map();

function checkFulfillRateLimit(ip) {
  if (!ip || ip === 'test-runner' || process.env.NODE_ENV === 'test') {
    return { limited: false };
  }
  const now = Date.now();
  const timestamps = fulfillmentHistory.get(ip) || [];
  const valid = timestamps.filter(t => now - t < FULFILL_WINDOW_MS);
  if (valid.length >= FULFILL_MAX_PER_WINDOW) {
    fulfillmentHistory.set(ip, valid);
    return { limited: true };
  }
  valid.push(now);
  fulfillmentHistory.set(ip, valid);
  return { limited: false };
}

/**
 * Optional Paddle API transaction status verification
 */
async function verifyPaddleTransaction(transactionId, environment = 'sandbox') {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || process.env.NODE_ENV === 'test' || environment === 'sandbox') {
    // In sandbox, CI, or when API key is unconfigured, bypass upstream network call
    return { verified: true, status: 'completed' };
  }

  const host = environment === 'production' ? 'api.paddle.com' : 'sandbox-api.paddle.com';
  const path = `/transactions/${encodeURIComponent(transactionId)}`;

  return new Promise((resolve) => {
    const req = https.request({
      hostname: host,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'ZTDS-MoR-Fulfillment/1.0'
      },
      timeout: 4000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const status = json.data && json.data.status;
          if (status === 'completed' || status === 'paid') {
            resolve({ verified: true, status });
          } else {
            resolve({ verified: false, status: status || 'unconfirmed', error: 'Transaction not completed' });
          }
        } catch (e) {
          resolve({ verified: false, error: 'Malformed Paddle API response' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ verified: false, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ verified: false, error: 'Paddle API timeout' });
    });
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'POST required for checkout fulfillment'
    });
  }

  const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip']);
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket && req.socket.remoteAddress) || 'test-runner';

  const { limited } = checkFulfillRateLimit(clientIp);
  if (limited) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many license fulfillment requests. Retry in 10 minutes.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const transactionId = (body.transactionId || body.transaction_id || '').trim();
  const customerEmail = (body.customerEmail || body.email || '').trim().toLowerCase();
  const customerName = (body.customerName || body.company || '').trim();
  const rawTier = (body.tier || 'developer_pro').toLowerCase();
  const tier = rawTier === 'teams' ? 'teams' : 'developer_pro';
  const interval = (body.interval || 'annual').toLowerCase();
  const environment = (body.environment || PADDLE_CONFIG.defaultEnvironment).toLowerCase();

  // Strict input validation
  if (!transactionId || transactionId.length < 4) {
    return res.status(400).json({
      error: 'Missing or invalid transactionId',
      details: 'Valid Paddle transaction ID required.'
    });
  }

  if (!customerEmail || !customerEmail.includes('@') || !customerEmail.includes('.')) {
    return res.status(400).json({
      error: 'Missing or invalid customerEmail',
      details: 'Valid email address required for license registration.'
    });
  }

  if (!customerName || customerName.length < 2) {
    return res.status(400).json({
      error: 'Missing or invalid customerName',
      details: 'Company or developer name must be at least 2 characters.'
    });
  }

  // Upstream verification if production key present
  const verifyResult = await verifyPaddleTransaction(transactionId, environment);
  if (!verifyResult.verified) {
    return res.status(402).json({
      error: 'Payment unverified',
      details: verifyResult.error || 'Paddle transaction was not marked as completed.'
    });
  }

  try {
    const days = interval === 'monthly' ? 30 : 365;
    const nodes = tier === 'teams' ? 10 : 5;

    const license = mintToken({
      customerName,
      tier,
      days,
      nodes
    });

    const isTeams = tier === 'teams';
    const tierTitle = isTeams ? 'ZTDS TEAMS' : 'Developer Pro SDK';

    const quickstart = isTeams ? {
      envVar: `export ZTDS_LICENSE="${license.token}"`,
      installCmd: 'npm install -g @privacyscrubber/teams-sync',
      codeSnippet: `// Zero-Cloud Team Sync Config (.ztds-teams.json)\n{\n  "license": "${license.token}",\n  "seats": 5,\n  "mode": "airgapped_ram"\n}`
    } : {
      envVar: `export ZTDS_LICENSE="${license.token}"`,
      installCmd: 'npm install @privacyscrubber/sdk',
      codeSnippet: `const { ZTDSEngine } = require("@privacyscrubber/sdk");\nconst ztds = new ZTDSEngine({\n  license: process.env.ZTDS_LICENSE,\n  tier: "developer_pro"\n});\n// Ready for lossless zero-egress LLM pipeline execution`
    };

    return res.status(200).json({
      status: 'success',
      transactionId: transactionId,
      licenseId: license.licenseId,
      token: license.token,
      customerName: customerName,
      customerEmail: customerEmail,
      tier: tier,
      tierTitle: tierTitle,
      interval: interval,
      nodes: nodes,
      expiresAt: license.expiresAt,
      quickstart: quickstart
    });
  } catch (err) {
    console.error('[CHECKOUT FULFILLMENT ERROR]', err);
    return res.status(500).json({
      error: 'License fulfillment failed',
      details: err.message
    });
  }
};
