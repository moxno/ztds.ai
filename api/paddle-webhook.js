/**
 * ZTDS.ai — Paddle Billing v2 Webhook Ingestion Engine
 * 
 * Handles transactions and subscription lifecycle events from Paddle MoR.
 * Verifies cryptographic Paddle-Signature header via HMAC-SHA256.
 * Automatically mints offline Ed25519 ZTDS-LIC-v1 license tokens upon successful payment.
 */

'use strict';

const crypto = require('crypto');
const { mintToken } = require('./mint-license');

/**
 * Verifies Paddle Billing v2 webhook signature.
 * Header format: ts=1689260400;h1=a96b...
 * Signature payload: {ts}:{rawBody}
 */
function verifyPaddleSignature(rawBody, signatureHeader, secretKey) {
  if (!signatureHeader || !secretKey) {
    return false;
  }

  const parts = signatureHeader.split(';').reduce((acc, part) => {
    const [key, val] = part.split('=');
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
  }, {});

  const ts = parts.ts;
  const h1 = parts.h1;

  if (!ts || !h1) {
    return false;
  }

  // Prevent replay attacks (allow max 5 minutes drift)
  const tsMs = parseInt(ts, 10) * 1000;
  const now = Date.now();
  if (Math.abs(now - tsMs) > 5 * 60 * 1000 && process.env.NODE_ENV !== 'test') {
    return false;
  }

  const payloadToSign = `${ts}:${rawBody}`;
  const computedHmac = crypto.createHmac('sha256', secretKey).update(payloadToSign).digest('hex');

  try {
    const computedBuf = Buffer.from(computedHmac, 'hex');
    const receivedBuf = Buffer.from(h1, 'hex');
    if (computedBuf.length !== receivedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, receivedBuf);
  } catch (e) {
    return false;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Paddle-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Raw body collection for cryptographic HMAC verification
  let rawBody = '';
  if (typeof req.body === 'string') {
    rawBody = req.body;
  } else if (Buffer.isBuffer(req.body)) {
    rawBody = req.body.toString('utf8');
  } else if (req.body && typeof req.body === 'object') {
    rawBody = JSON.stringify(req.body);
  }

  let event = {};
  try {
    event = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(rawBody);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const signatureHeader = req.headers['paddle-signature'] || req.headers['Paddle-Signature'];
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET_KEY || 'pdl_whsec_test_development';

  // Signature verification (enforced in production, bypassed if explicitly marked test in mock suite)
  const isTestEnvironment = process.env.NODE_ENV === 'test' && (!signatureHeader || signatureHeader === 'test-bypass');
  if (!isTestEnvironment) {
    const isValid = verifyPaddleSignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid Paddle signature',
        details: 'HMAC-SHA256 signature mismatch against Paddle-Signature header.'
      });
    }
  }

  const eventType = event.event_type || '';
  const data = event.data || {};

  // We process transaction.completed and subscription.created / subscription.activated
  const isPaymentEvent = eventType === 'transaction.completed' ||
    eventType === 'subscription.created' ||
    eventType === 'subscription.activated';

  if (!isPaymentEvent) {
    return res.status(200).json({
      status: 'ignored',
      message: `Event type ${eventType} does not require license minting.`
    });
  }

  const customData = data.custom_data || {};
  const customerEmail = (data.customer && data.customer.email) || customData.email || 'licensee@customer.com';
  const customerName = customData.company_name || (data.customer && data.customer.name) || customerEmail.split('@')[0];
  const tier = customData.tier || 'developer_pro';

  // Determine duration (annual vs monthly)
  let months = 12; // default annual
  if (data.billing_cycle && data.billing_cycle.interval === 'month') {
    months = 1;
  } else if (customData.interval === 'month') {
    months = 1;
  }

  try {
    const days = months * 30;
    const license = mintToken({
      customerName,
      tier,
      days,
      nodes: tier === 'developer_pro' ? 5 : 10
    });

    console.log(`[PADDLE WEBHOOK] Minted ${license.licenseId} for ${customerName} (${customerEmail}) - Tier: ${tier}`);

    return res.status(200).json({
      status: 'processed',
      event_type: eventType,
      license_id: license.licenseId,
      customer_name: customerName,
      tier: license.tier,
      expires_at: license.expiresAt,
      token: license.token
    });
  } catch (err) {
    console.error('[PADDLE WEBHOOK ERROR]', err);
    return res.status(500).json({
      error: 'License minting failed',
      details: err.message
    });
  }
};

module.exports.verifyPaddleSignature = verifyPaddleSignature;
