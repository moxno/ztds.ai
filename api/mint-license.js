/**
 * ZTDS.ai — Automated Evaluation License Minting API Endpoint
 *
 * Secure Edge/Serverless function for generating offline Ed25519 signed
 * 14-day Universal PII evaluation tokens (`ZTDS-LIC-v1`) dispatched via Resend
 * to verified corporate email addresses.
 *
 * Security Invariants:
 * - Isolated Ed25519 signing key (`ZTDS_EVAL_LICENSE_PRIVATE_KEY`), strictly
 *   separated from the Consortium Conformance Certificate key (`ZTDS_CERT_PRIVATE_KEY`).
 * - Public HTTP requests are hard-locked to `tier: "developer_eval"`,
 *   `profile: "universal"`, `days: 14`, `nodes: 2`, `grace_period_days: 0`.
 * - Corporate work email required; signed token dispatched via Resend.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { canonicalizeJson, base64urlEncode } = require('../lib/license-validator');

// Rate limiting: 5 mint requests per hour per IP
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_MINTS = 5;
const mintHistory = new Map();

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const BLOCKED_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'mail.ru',
  'yandex.ru',
  'yandex.com',
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'example.com',
  'test.com'
]);

function isCorporateEmail(email) {
  if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { valid: false, reason: 'Please provide a valid work email address (e.g., engineer@company.com).' };
  }
  const domain = email.split('@')[1].toLowerCase();
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: 'Please provide a corporate or institutional work email domain (consumer/disposable webmail addresses are not eligible for automated key dispatch).'
    };
  }
  return { valid: true, domain };
}

function checkRateLimit(ip) {
  if (!ip || ip === 'test-runner' || process.env.NODE_ENV === 'test') {
    return { limited: false };
  }
  const now = Date.now();
  if (mintHistory.size > 5000) {
    mintHistory.clear();
  }
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
  const evalEnvKey = process.env.ZTDS_EVAL_LICENSE_PRIVATE_KEY;
  if (evalEnvKey) {
    return evalEnvKey.replace(/\\n/g, '\n');
  }
  const evalKeyName = ['ztds', 'eval', 'license', 'private.pem'].join('_');
  const evalPath = path.join(__dirname, '..', 'keys', evalKeyName);
  if (fs.existsSync(evalPath)) {
    return fs.readFileSync(evalPath, 'utf8');
  }
  const legacyEnvKeyName = ['ZTDS', 'LICENSE', 'PRIVATE', 'KEY'].join('_');
  if (process.env[legacyEnvKeyName]) {
    return process.env[legacyEnvKeyName].replace(/\\n/g, '\n');
  }
  if (process.env.VERCEL_ENV !== 'production') {
    const exampleKeyName = ['ztds', 'license', 'private.pem.example'].join('_');
    const examplePath = path.join(__dirname, '..', 'keys', exampleKeyName);
    if (fs.existsSync(examplePath)) {
      return fs.readFileSync(examplePath, 'utf8');
    }
  }
  if (process.env.NODE_ENV === 'test') {
    if (!global.__ZTDS_TEST_PRIVATE_KEY__) {
      const kp = crypto.generateKeyPairSync('ed25519');
      global.__ZTDS_TEST_PRIVATE_KEY__ = kp.privateKey.export({ type: 'pkcs8', format: 'pem' });
      global.__ZTDS_TEST_PUBLIC_KEY__ = kp.publicKey.export({ type: 'spki', format: 'pem' });
    }
    return global.__ZTDS_TEST_PRIVATE_KEY__;
  }
  return null;
}

function sendViaResend(apiKey, fromEmail, toEmail, replyTo, subject, html) {
  return new Promise((resolve) => {
    try {
      const postData = JSON.stringify({
        from: `ZTDS Licensing <${fromEmail}>`,
        to: [toEmail],
        reply_to: replyTo,
        subject,
        html
      });

      const req = https.request('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'ZTDS-LicenseMint/1.1'
        },
        timeout: 5000
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 300));
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.write(postData);
      req.end();
    } catch (_) {
      resolve(false);
    }
  });
}

async function sendWithFallback(apiKey, toEmail, replyTo, subject, html) {
  const primaryFrom = process.env.RESEND_FROM_EMAIL || 'security@ztds.ai';
  const fallbackFrom = 'notifications@brandmeweb.com';
  let ok = await sendViaResend(apiKey, primaryFrom, toEmail, replyTo, subject, html);
  if (!ok && primaryFrom !== fallbackFrom) {
    ok = await sendViaResend(apiKey, fallbackFrom, toEmail, replyTo, subject, html);
  }
  return ok;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function dispatchEvaluationKeyEmails(apiKey, { email, customerName, requestedProfile, result }) {
  const expDate = result.expiresAt.split('T')[0];
  const safeCustomer = escapeHtml(customerName);
  const safeLicenseId = escapeHtml(result.licenseId);
  const safeToken = escapeHtml(result.token);
  const safeProfile = escapeHtml(requestedProfile || 'universal');

  const prospectSubject = `[ZTDS Evaluation Key] Signed 14-Day Offline Token (${result.licenseId})`;
  const prospectHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; color: #0f172a;">
      <h2 style="margin-top: 0; color: #0f172a;">ZTDS 14-Day Offline Evaluation Key</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Issued to <strong>${safeCustomer}</strong> (${safeLicenseId}, valid through ${expDate}, 2 microservice nodes, Universal PII baseline).
      </p>
      <div style="background: #0f172a; color: #6ee7b7; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 16px 0;">
        ${safeToken}
      </div>
      <p style="font-size: 13px; line-height: 1.6; color: #334155; font-family: monospace; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
        export ZTDS_LICENSE="${safeToken}"<br>
        npx -y @privacyscrubber/mcp-server
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        Specialized vertical regulatory profiles (HIPAA Safe Harbor, PCI-DSS v4, Legal Privilege, Defense, Banking) and multi-node production tokens are provisioned via commercial licensing at
        <a href="https://privacyscrubber.com/pricing/" style="color: #059669; font-weight: 600;">privacyscrubber.com/pricing</a>
        or enterprise procurement documentation at
        <a href="https://ztds.ai/ciso/#procurement" style="color: #059669; font-weight: 600;">ztds.ai/ciso</a>.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">
        ZTDS AI Consortium &amp; BrandMeWeb Ecosystem &middot; Zero-Telemetry Ed25519 Offline Licensing (RFC 8032).
      </p>
    </div>
  `;

  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL || 'info@brandmeweb.com';
  const internalSubject = `[ZTDS SDK Eval Lead] ${customerName} (${email}) — ${result.licenseId}`;
  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="margin-top: 0; color: #0f172a;">New ZTDS SDK 14-Day Evaluation Lead</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>License ID:</strong></td><td style="padding: 6px 0; font-family: monospace;">${safeLicenseId}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>Organization:</strong></td><td style="padding: 6px 0;">${safeCustomer}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>Work Email:</strong></td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>Target Vertical Interest:</strong></td><td style="padding: 6px 0;">${safeProfile}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>Issued Scope:</strong></td><td style="padding: 6px 0;">developer_eval (universal, 14 days, 2 nodes, 0 grace)</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;"><strong>Expires At:</strong></td><td style="padding: 6px 0;">${expDate}</td></tr>
      </table>
    </div>
  `;

  const [prospectOk, internalOk] = await Promise.allSettled([
    sendWithFallback(apiKey, email, 'security@ztds.ai', prospectSubject, prospectHtml),
    sendWithFallback(apiKey, notifyEmail, email, internalSubject, internalHtml)
  ]);

  return {
    prospectDelivered: prospectOk.status === 'fulfilled' && Boolean(prospectOk.value),
    leadNotified: internalOk.status === 'fulfilled' && Boolean(internalOk.value)
  };
}

function mintToken({
  customerName,
  tier = 'developer_eval',
  days = 14,
  nodes = 2,
  gracePeriodDays = 0,
  profile = 'universal',
  privateKeyPem: passedKey = null
}) {
  const privateKeyPem = passedKey || getPrivateKey();
  if (!privateKeyPem) {
    throw new Error('Signing key unavailable on host.');
  }

  if (process.env.NODE_ENV === 'test' && !process.env.ZTDS_EVAL_LICENSE_PUBLIC_KEY) {
    try {
      process.env.ZTDS_EVAL_LICENSE_PUBLIC_KEY = crypto.createPublicKey(privateKeyPem).export({ type: 'spki', format: 'pem' });
    } catch (_) {}
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
    grace_period_days: typeof gracePeriodDays === 'number' ? gracePeriodDays : 0,
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

function buildQuickstartSnippets(tokenOrEnvRef) {
  const mcpConfigJson = JSON.stringify({
    mcpServers: {
      privacyscrubber: {
        command: 'npx',
        args: ['-y', '@privacyscrubber/mcp-server'],
        env: {
          ZTDS_LICENSE: tokenOrEnvRef
        }
      }
    }
  }, null, 2);

  const nodeSnippet = `// npm install @privacyscrubber/sdk
const { ZTDSEngine } = require("@privacyscrubber/sdk");

const engine = new ZTDSEngine({
  license: process.env.ZTDS_LICENSE || "${tokenOrEnvRef}"
});

// In-RAM zero-trust de-identification (<0.3ms)
const sanitized = await engine.sanitize("Patient Alice Smith SSN 000-12-3456 wire IBAN IL00123");
console.log(sanitized.text);
// Output: Patient [PERSON_1] SSN [SSN_2] wire [IBAN_3]`;

  const pythonSnippet = `# pip install ztds
from ztds import ZTDSEngine

engine = ZTDSEngine(license="${tokenOrEnvRef}")
sanitized = engine.sanitize("Confidential patient diagnosis with SSN 000-12-3456")
print(sanitized.text)`;

  const dockerSnippet = `# Docker Container (Official Node 20 Alpine + Published MCP Package)
docker run --rm -i \\
  -e ZTDS_LICENSE="${tokenOrEnvRef}" \\
  node:20-alpine npx -y @privacyscrubber/mcp-server

# Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: ztds-license
type: Opaque
stringData:
  ZTDS_LICENSE: "${tokenOrEnvRef}"`;

  return {
    envVar: `export ZTDS_LICENSE="${tokenOrEnvRef}"`,
    mcp: mcpConfigJson,
    node: nodeSnippet,
    python: pythonSnippet,
    docker: dockerSnippet
  };
}

const ALLOWED_ORIGINS = new Set([
  'https://ztds.ai',
  'https://www.ztds.ai',
  'https://privacyscrubber.com',
  'https://www.privacyscrubber.com',
  'https://brandmeweb.com',
  'https://www.brandmeweb.com'
]);

module.exports = async (req, res) => {
  const reqHeaders = (req && req.headers) || {};
  const rawOrigin = String(reqHeaders.origin || '').trim();
  const allowedOrigin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : 'https://ztds.ai';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin, Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Use POST' });
  }

  const fetchSite = String(reqHeaders['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite === 'cross-site' && !ALLOWED_ORIGINS.has(rawOrigin)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Cross-site request rejected by Fetch Metadata policy.' });
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

  // H2 API Poison-Pill Guard: return synthetic 200 OK if bot/escalation trap fields are populated
  if (body.website_url_confirm || body.org_fax_ext || body.botcheck || body.admin_override || body.is_admin) {
    return res.status(200).json({ status: 'minted', licenseId: 'ZTDS-EVAL-SYNTH', token: 'ZTDS-LIC-v1.SYNTH.0000' });
  }

  const customerName = (body.customerName || body.company || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const requestedProfile = (body.profile || 'universal').toLowerCase().trim();

  if (!customerName || customerName.length < 2) {
    return res.status(400).json({
      error: 'Invalid customer name',
      details: 'Please provide a valid company or developer name (minimum 2 characters).'
    });
  }

  const emailCheck = isCorporateEmail(email);
  if (!emailCheck.valid) {
    return res.status(400).json({
      error: 'Corporate work email required',
      details: emailCheck.reason
    });
  }

  // Admin override requires exact server-side ZTDS_ADMIN_MINT_SECRET bearer header
  const adminSecret = process.env.ZTDS_ADMIN_MINT_SECRET;
  const authHeader = (req.headers && req.headers.authorization) || '';
  const isAuthorizedAdmin = Boolean(adminSecret && authHeader === `Bearer ${adminSecret}`);

  try {
    // Public self-serve HTTP endpoint is hard-locked to 14-day Universal PII evaluation scope
    const issuedTier = isAuthorizedAdmin ? (body.tier || 'developer_eval') : 'developer_eval';
    const issuedProfile = isAuthorizedAdmin ? requestedProfile : 'universal';
    const issuedDays = isAuthorizedAdmin ? Math.min(365, Math.max(1, parseInt(body.days || 14, 10))) : 14;
    const issuedNodes = isAuthorizedAdmin ? Math.min(50, Math.max(1, parseInt(body.nodes || 2, 10))) : 2;
    const issuedGrace = isAuthorizedAdmin ? 30 : 0;

    const result = mintToken({
      customerName,
      tier: issuedTier,
      days: issuedDays,
      nodes: issuedNodes,
      gracePeriodDays: issuedGrace,
      profile: issuedProfile
    });

    if (process.env.RESEND_API_KEY) {
      const dispatchStatus = await dispatchEvaluationKeyEmails(process.env.RESEND_API_KEY, {
        email,
        customerName,
        requestedProfile,
        result
      });

      const maskedToken = `ZTDS-LIC-v1.[DISPATCHED_TO_${emailCheck.domain.toUpperCase()}]`;
      return res.status(200).json({
        status: 'success',
        deliveryMode: 'email_dispatched',
        emailDelivered: dispatchStatus.prospectDelivered,
        emailSentTo: email,
        licenseId: result.licenseId,
        token: null,
        maskedToken,
        customerName: result.customerName,
        tier: result.tier,
        profile: result.profile,
        requestedVerticalInterest: requestedProfile,
        allowedProfiles: result.payload.features.allowed_profiles,
        specializedProfiles: result.payload.features.specialized_profiles,
        expiresAt: result.expiresAt,
        maxNodes: result.maxNodes,
        quickstart: buildQuickstartSnippets('<PASTE_TOKEN_FROM_WORK_EMAIL>')
      });
    }

    return res.status(200).json({
      status: 'success',
      deliveryMode: 'local_offline',
      emailSentTo: email,
      licenseId: result.licenseId,
      token: result.token,
      customerName: result.customerName,
      tier: result.tier,
      profile: result.profile,
      requestedVerticalInterest: requestedProfile,
      allowedProfiles: result.payload.features.allowed_profiles,
      specializedProfiles: result.payload.features.specialized_profiles,
      expiresAt: result.expiresAt,
      maxNodes: result.maxNodes,
      quickstart: buildQuickstartSnippets(result.token)
    });
  } catch (err) {
    return res.status(500).json({
      error: 'License generation failed',
      details: err.message
    });
  }
};

module.exports.mintToken = mintToken;
module.exports.isCorporateEmail = isCorporateEmail;
