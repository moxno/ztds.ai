/**
 * ZTDS.ai — Automated License Minting API Endpoint
 * 
 * Secure Edge/Serverless function for generating offline Ed25519 signed
 * license tokens for developer evaluations, CI/CD pipelines, and trials.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { canonicalizeJson, base64urlEncode } = require('../lib/license-validator');

// Rate limiting: 5 mint requests per hour per IP
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_MINTS = 5;
const mintHistory = new Map();

function checkRateLimit(ip) {
  if (!ip || ip === 'test-runner' || process.env.NODE_ENV === 'test') {
    return { limited: false };
  }
  const now = Date.now();
  const timestamps = mintHistory.get(ip) || [];
  const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (valid.length >= RATE_LIMIT_MAX_MINTS) {
    mintHistory.set(ip, valid);
    return { limited: true };
  }
  valid.push(now);
  mintHistory.set(ip, valid);
  return { limited: false };
}

function getPrivateKey() {
  if (process.env.ZTDS_LICENSE_PRIVATE_KEY) {
    return process.env.ZTDS_LICENSE_PRIVATE_KEY;
  }
  const defaultPath = path.join(__dirname, '../keys/ztds_license_private.pem');
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf8');
  }
  const examplePath = path.join(__dirname, '../keys/ztds_license_private.pem.example');
  if (process.env.NODE_ENV === 'test' && fs.existsSync(examplePath)) {
    return fs.readFileSync(examplePath, 'utf8');
  }
  return null;
}

function mintToken({ customerName, tier = 'developer_pro', days = 14, nodes = 3 }) {
  const privateKeyPem = getPrivateKey();
  if (!privateKeyPem) {
    throw new Error('Signing key unavailable on host.');
  }

  const now = new Date();
  const expiresDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const tierPrefix = tier.includes('eval') ? 'EVAL' : (tier === 'teams' ? 'TEAMS' : 'DEV');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const licenseId = `ZTDS-2026-${tierPrefix}-${randomSuffix}`;

  const payload = {
    license_id: licenseId,
    customer_id: `cust_${customerName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24)}`,
    customer_name: customerName,
    tier: tier,
    issued_at: now.toISOString(),
    expires_at: expiresDate.toISOString(),
    grace_period_days: 7,
    max_nodes: nodes,
    features: {
      universal_pii: true,
      specialized_profiles: false,
      allowed_profiles: [],
      evidence_binder: false,
      airgapped_enclave: true
    }
  };

  const canonicalPayload = canonicalizeJson(payload);
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalPayload), 'utf8');
  const signatureBuffer = crypto.sign(null, canonicalBytes, privateKeyPem);

  const payloadB64 = base64urlEncode(canonicalBytes);
  const signatureB64 = base64urlEncode(signatureBuffer);

  const token = `ZTDS-LIC-v1.${payloadB64}.${signatureB64}`;

  return {
    licenseId,
    token,
    customerName,
    tier,
    expiresAt: expiresDate.toISOString(),
    maxNodes: nodes,
    payload
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Use POST' });
  }

  const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip']);
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket && req.socket.remoteAddress) || 'test-runner';

  const { limited } = checkRateLimit(clientIp);
  if (limited) {
    res.setHeader('Retry-After', '3600');
    return res.status(429).json({
      error: 'Rate limit exceeded',
      details: 'Maximum 5 evaluation license mints per hour per client IP.'
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

  const customerName = (body.customerName || body.company || '').trim();
  const email = (body.email || '').trim();

  if (!customerName || customerName.length < 2) {
    return res.status(400).json({
      error: 'Invalid customer name',
      details: 'Please provide a valid company or developer name (minimum 2 characters).'
    });
  }

  try {
    const days = Math.min(30, Math.max(1, parseInt(body.days || 14, 10)));
    const result = mintToken({
      customerName,
      tier: body.tier || 'developer_pro',
      days,
      nodes: 3
    });

    return res.status(200).json({
      status: 'success',
      licenseId: result.licenseId,
      token: result.token,
      customerName: result.customerName,
      tier: result.tier,
      expiresAt: result.expiresAt,
      maxNodes: result.maxNodes,
      quickstart: {
        envVar: `export ZTDS_LICENSE="${result.token}"`,
        installCmd: 'npm install @privacyscrubber/sdk',
        codeSnippet: `const { ZTDSEngine } = require("@privacyscrubber/sdk");\nconst engine = new ZTDSEngine({ license: process.env.ZTDS_LICENSE });`
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: 'License generation failed',
      details: err.message
    });
  }
};

module.exports.mintToken = mintToken;
