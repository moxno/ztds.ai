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

function mintToken({ customerName, tier = 'developer_pro', days = 14, nodes = 3, profile = 'universal' }) {
  const privateKeyPem = getPrivateKey();
  if (!privateKeyPem) {
    throw new Error('Signing key unavailable on host.');
  }

  const now = new Date();
  const expiresDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const tierPrefix = tier.includes('eval') ? 'EVAL' : (tier === 'teams' ? 'TEAMS' : 'DEV');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const licenseId = `ZTDS-2026-${tierPrefix}-${randomSuffix}`;

  // Configure profile authorization
  let specializedProfiles = false;
  let allowedProfiles = ['universal'];

  const normProfile = (profile || 'universal').toLowerCase().trim();
  if (normProfile === 'fintech' || normProfile === 'financial') {
    specializedProfiles = true;
    allowedProfiles = ['fintech', 'financial'];
  } else if (normProfile === 'healthcare' || normProfile === 'hipaa') {
    specializedProfiles = true;
    allowedProfiles = ['healthcare', 'hipaa'];
  } else if (normProfile === 'legal' || normProfile === 'privilege') {
    specializedProfiles = true;
    allowedProfiles = ['legal', 'privilege'];
  } else if (normProfile === 'all' || normProfile === '*' || normProfile === 'enterprise') {
    specializedProfiles = true;
    allowedProfiles = ['*'];
  }

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
      specialized_profiles: specializedProfiles,
      allowed_profiles: allowedProfiles,
      evidence_binder: specializedProfiles,
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
    profile: normProfile,
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
      nodes: 3,
      profile: body.profile || 'universal'
    });

    const mcpConfigJson = JSON.stringify({
      mcpServers: {
        "privacyscrubber": {
          command: "npx",
          args: ["-y", "@privacyscrubber/mcp-server"],
          env: {
            ZTDS_LICENSE: result.token
          }
        }
      }
    }, null, 2);

    const nodeSnippet = `// npm install @privacyscrubber/sdk
const { ZTDSEngine } = require("@privacyscrubber/sdk");

const engine = new ZTDSEngine({
  license: process.env.ZTDS_LICENSE || "${result.token}"
});

// In-RAM zero-trust de-identification (<0.3ms)
const sanitized = await engine.sanitize("Patient Alice Smith SSN 000-12-3456 wire IBAN IL00123");
console.log(sanitized.text);
// Output: Patient [PERSON_1] SSN [SSN_2] wire [IBAN_3]`;

    const pythonSnippet = `# pip install ztds
from ztds import ZTDSEngine

engine = ZTDSEngine(license="${result.token}")
sanitized = engine.sanitize("Confidential patient diagnosis with SSN 000-12-3456")
print(sanitized.text)`;

    const dockerSnippet = `# Docker Run
docker run -d \\
  -e ZTDS_LICENSE="${result.token}" \\
  -p 8080:8080 \\
  privacyscrubber/agent-gateway:latest

# Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: ztds-license
type: Opaque
stringData:
  ZTDS_LICENSE: "${result.token}"`;

    return res.status(200).json({
      status: 'success',
      licenseId: result.licenseId,
      token: result.token,
      customerName: result.customerName,
      tier: result.tier,
      profile: result.profile,
      allowedProfiles: result.payload.features.allowed_profiles,
      expiresAt: result.expiresAt,
      maxNodes: result.maxNodes,
      quickstart: {
        envVar: `export ZTDS_LICENSE="${result.token}"`,
        mcp: mcpConfigJson,
        node: nodeSnippet,
        python: pythonSnippet,
        docker: dockerSnippet
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
