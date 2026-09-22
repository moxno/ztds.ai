/**
 * Automated Verification Suite for Paddle Billing v2 Webhook & License Minting
 * 
 * Verifies:
 * 1. Cryptographic HMAC-SHA256 signature verification (Paddle-Signature)
 * 2. Rejection of tampered payloads and forged signatures
 * 3. Automated Ed25519 license minting on transaction.completed
 * 4. In-memory validation of minted license via lib/license-validator.js
 */

'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const paddleWebhookHandler = require('../api/paddle-webhook');
const { verifyPaddleSignature } = require('../api/paddle-webhook');
const { verifyLicense } = require('../lib/license-validator');

// Helper to create mock req/res
function createMockReqRes({ method = 'POST', headers = {}, body = null }) {
  const req = {
    method,
    headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
    body
  };

  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    },
    end() {
      return this;
    }
  };

  return { req, res };
}

// Generate valid Paddle v2 signature header
function generatePaddleSignature(rawBody, secretKey, timestamp = Math.floor(Date.now() / 1000)) {
  const payloadToSign = `${timestamp}:${rawBody}`;
  const h1 = crypto.createHmac('sha256', secretKey).update(payloadToSign).digest('hex');
  return `ts=${timestamp};h1=${h1}`;
}

async function runTests() {
  console.log('[TEST] Starting Paddle Billing v2 Webhook Verification Suite...\n');

  const secretKey = 'pdl_whsec_test_secret_key_12345';
  process.env.PADDLE_WEBHOOK_SECRET_KEY = secretKey;
  process.env.NODE_ENV = 'production'; // Enforce strict signature check during test

  // Test 1: Signature Verification Success
  console.log('--> Test 1: Valid HMAC-SHA256 Signature Verification');
  const sampleBody = JSON.stringify({ event_type: 'transaction.completed', data: { id: 'txn_123' } });
  const validSig = generatePaddleSignature(sampleBody, secretKey);
  assert.strictEqual(verifyPaddleSignature(sampleBody, validSig, secretKey), true);
  console.log('    [PASS] Valid Paddle signature verified.');

  // Test 2: Tamper Detection (Modified Body)
  console.log('--> Test 2: Tamper Detection (Modified Body)');
  const tamperedBody = JSON.stringify({ event_type: 'transaction.completed', data: { id: 'txn_FORGED' } });
  assert.strictEqual(verifyPaddleSignature(tamperedBody, validSig, secretKey), false);
  console.log('    [PASS] Tampered payload correctly rejected.');

  // Test 3: Forged Secret Key
  console.log('--> Test 3: Forged Secret Key Detection');
  const forgedSig = generatePaddleSignature(sampleBody, 'wrong_secret_key');
  assert.strictEqual(verifyPaddleSignature(sampleBody, forgedSig, secretKey), false);
  console.log('    [PASS] Forged secret key signature rejected.');

  // Test 4: End-to-End Webhook Transaction Processing & License Minting
  console.log('--> Test 4: End-to-End Webhook Transaction & License Minting');
  const transactionEvent = {
    event_id: 'evt_test_01',
    event_type: 'transaction.completed',
    data: {
      id: 'txn_test_999',
      customer: {
        email: 'founder@cyber-defense.io',
        name: 'Cyber Defense Corp'
      },
      custom_data: {
        company_name: 'Cyber Defense Corp',
        tier: 'developer_pro'
      },
      billing_cycle: {
        interval: 'year'
      }
    }
  };

  const rawPayload = JSON.stringify(transactionEvent);
  const signature = generatePaddleSignature(rawPayload, secretKey);

  const { req, res } = createMockReqRes({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'paddle-signature': signature
    },
    body: rawPayload
  });

  await paddleWebhookHandler(req, res);

  assert.strictEqual(res.statusCode, 200, `Expected 200 OK but got ${res.statusCode}: ${JSON.stringify(res.data)}`);
  assert.strictEqual(res.data.status, 'processed');
  assert.ok(res.data.license_id.startsWith('ZTDS-2026-DEV-'));
  assert.ok(res.data.token.startsWith('ZTDS-LIC-v1.'));
  console.log(`    [PASS] License token minted: ${res.data.license_id}`);

  // Test 5: Verify Minted Token via Offline License Validator
  console.log('--> Test 5: Verify Minted License via Offline Validator');
  const publicKeyPem = fs.readFileSync(path.join(__dirname, '../keys/ztds_license_public.pem'), 'utf8');
  const verification = verifyLicense(res.data.token, { publicKeyPem });

  assert.strictEqual(verification.valid, true);
  assert.strictEqual(verification.customerName, 'Cyber Defense Corp');
  assert.strictEqual(verification.tier, 'developer_pro');
  assert.strictEqual(verification.maxNodes, 5);
  console.log('    [PASS] Minted license passes Ed25519 cryptographic validation.');

  // Test 6: Rejection of Unauthorized Webhook Request
  console.log('--> Test 6: Rejection of Unauthorized Webhook Request');
  const { req: badReq, res: badRes } = createMockReqRes({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'paddle-signature': 'ts=123456789;h1=bad_hash'
    },
    body: rawPayload
  });

  await paddleWebhookHandler(badReq, badRes);
  assert.strictEqual(badRes.statusCode, 401);
  console.log('    [PASS] 401 Unauthorized emitted for invalid signature.');

  // Test 7: TEAMS Tier Webhook Transaction & License Minting (10 nodes)
  console.log('--> Test 7: TEAMS Tier Webhook Transaction & License Minting');
  const teamsPayload = JSON.stringify({
    event_id: 'evt_test_teams_01',
    event_type: 'transaction.completed',
    data: {
      id: 'txn_test_teams_99',
      status: 'completed',
      customer: {
        email: 'ops@clinictrial.org',
        name: 'Clinic Trial Systems'
      },
      custom_data: {
        company_name: 'Clinic Trial Systems',
        tier: 'teams'
      },
      billing_cycle: {
        interval: 'month'
      }
    }
  });

  const teamsSig = generatePaddleSignature(teamsPayload, secretKey);
  const { req: teamsReq, res: teamsRes } = createMockReqRes({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'paddle-signature': teamsSig
    },
    body: teamsPayload
  });

  await paddleWebhookHandler(teamsReq, teamsRes);
  assert.strictEqual(teamsRes.statusCode, 200);
  assert.ok(teamsRes.data.license_id.startsWith('ZTDS-2026-TEAMS-'));
  const teamsVerification = verifyLicense(teamsRes.data.token, { publicKeyPem });
  assert.strictEqual(teamsVerification.valid, true);
  assert.strictEqual(teamsVerification.tier, 'teams');
  assert.strictEqual(teamsVerification.maxNodes, 10);
  console.log(`    [PASS] TEAMS license minted: ${teamsRes.data.license_id} (10 nodes).`);

  console.log('\n[SUMMARY] ALL 7 PADDLE WEBHOOK & MINTING TESTS PASSED.');
}

runTests().catch(err => {
  console.error('[FATAL TEST ERROR]', err);
  process.exit(1);
});
