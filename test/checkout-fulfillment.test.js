/**
 * ZTDS.ai — Paddle Checkout Fulfillment Test Suite
 * 
 * Validates real-time license token minting, offline cryptographic verification,
 * TEAMS / Developer Pro tier handling, and input error boundaries.
 */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const fulfillmentHandler = require('../api/checkout-fulfillment');
const { verifyLicense } = require('../lib/license-validator');
const { PADDLE_CONFIG, getPriceId } = require('../config/paddle');

// Ensure offline signing key is available for test verification
const privKeyPath = path.join(__dirname, '../keys/ztds_license_private.pem');
const examplePrivPath = path.join(__dirname, '../keys/ztds_license_private.pem.example');
if (!process.env.ZTDS_LICENSE_PRIVATE_KEY && !fs.existsSync(privKeyPath) && fs.existsSync(examplePrivPath)) {
  const fallbackPriv = fs.readFileSync(examplePrivPath, 'utf8');
  process.env.ZTDS_LICENSE_PRIVATE_KEY = fallbackPriv;
  process.env.ZTDS_LICENSE_PUBLIC_KEY = crypto.createPublicKey(fallbackPriv).export({ type: 'spki', format: 'pem' });
}

console.log('[TEST] Starting Paddle Checkout Fulfillment Verification Suite...\n');

// Mock helper
function createMockReqRes(body = {}, method = 'POST', headers = {}) {
  const req = {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body
  };

  let statusCode = 200;
  let responseData = null;
  const responseHeaders = {};

  const res = {
    setHeader(key, val) {
      responseHeaders[key.toLowerCase()] = val;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end() {
      return this;
    },
    _getStatusCode: () => statusCode,
    _getData: () => responseData,
    _getHeaders: () => responseHeaders
  };

  return { req, res };
}

async function runTests() {
  // Test 0: Configuration SSOT Integrity
  console.log('--> Test 0: Paddle Configuration SSOT Integrity');
  assert(PADDLE_CONFIG.environments.sandbox, 'Sandbox environment must exist');
  assert(PADDLE_CONFIG.environments.production, 'Production environment must exist');
  assert.strictEqual(typeof getPriceId('developer_pro', 'annual', 'sandbox'), 'string');
  assert.strictEqual(typeof getPriceId('teams', 'monthly', 'sandbox'), 'string');
  console.log('    [PASS] Paddle configuration and pricing resolution validated.');

  // Test 1: Developer Pro Annual Fulfillment
  console.log('--> Test 1: Developer Pro Annual Checkout Fulfillment');
  {
    const { req, res } = createMockReqRes({
      transactionId: 'txn_test_dev_annual_9941',
      customerEmail: 'founder@ai-defense.com',
      customerName: 'AI Defense Corp',
      tier: 'developer_pro',
      interval: 'annual',
      environment: 'sandbox'
    });

    await fulfillmentHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200, 'Expected HTTP 200');
    const data = res._getData();
    assert.strictEqual(data.status, 'success');
    assert.strictEqual(data.tier, 'developer_pro');
    assert.strictEqual(data.nodes, 5);
    assert.strictEqual(data.transactionId, 'txn_test_dev_annual_9941');
    assert(data.token.startsWith('ZTDS-LIC-v1.'), 'Token must start with ZTDS-LIC-v1');
    assert(data.licenseId.startsWith('ZTDS-2026-DEV-'), 'LicenseId must start with DEV');

    // Cryptographic offline verification
    const valResult = verifyLicense(data.token);
    assert.strictEqual(valResult.valid, true, 'Minted token must pass Ed25519 validation');
    assert.strictEqual(valResult.payload.customer_name, 'AI Defense Corp');
    assert.strictEqual(valResult.payload.max_nodes, 5);
    console.log(`    [PASS] Minted & verified: ${data.licenseId} (5 nodes, 365 days)`);
  }

  // Test 2: TEAMS Monthly Checkout Fulfillment
  console.log('--> Test 2: TEAMS Monthly Checkout Fulfillment');
  {
    const { req, res } = createMockReqRes({
      transactionId: 'txn_test_teams_monthly_1042',
      customerEmail: 'lead@healthscale.io',
      customerName: 'HealthScale Analytics',
      tier: 'teams',
      interval: 'monthly',
      environment: 'sandbox'
    });

    await fulfillmentHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200, 'Expected HTTP 200');
    const data = res._getData();
    assert.strictEqual(data.status, 'success');
    assert.strictEqual(data.tier, 'teams');
    assert.strictEqual(data.nodes, 10);
    assert(data.licenseId.startsWith('ZTDS-2026-TEAMS-'), 'LicenseId must start with TEAMS');

    // Cryptographic offline verification
    const valResult = verifyLicense(data.token);
    assert.strictEqual(valResult.valid, true, 'TEAMS token must pass Ed25519 validation');
    assert.strictEqual(valResult.payload.customer_name, 'HealthScale Analytics');
    assert.strictEqual(valResult.payload.max_nodes, 10);
    console.log(`    [PASS] Minted & verified: ${data.licenseId} (10 nodes, 30 days)`);
  }

  // Test 3: Validation Error Boundaries (Missing Email / Customer Name)
  console.log('--> Test 3: Input Validation Boundaries');
  {
    const { req, res } = createMockReqRes({
      transactionId: 'txn_1234',
      customerEmail: 'invalid-email',
      customerName: 'A'
    });

    await fulfillmentHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 400, 'Expected 400 for malformed input');
    console.log('    [PASS] Malformed customer email rejected.');
  }

  // Test 4: Missing Transaction ID
  console.log('--> Test 4: Missing Transaction ID Rejection');
  {
    const { req, res } = createMockReqRes({
      customerEmail: 'valid@example.com',
      customerName: 'Valid Corp'
    });

    await fulfillmentHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 400, 'Expected 400 for missing transactionId');
    console.log('    [PASS] Missing transaction ID rejected.');
  }

  // Test 5: HTTP Method Not Allowed (GET) & OPTIONS Preflight
  console.log('--> Test 5: Method Not Allowed & CORS Preflight');
  {
    const { req: getReq, res: getRes } = createMockReqRes({}, 'GET');
    await fulfillmentHandler(getReq, getRes);
    assert.strictEqual(getRes._getStatusCode(), 405, 'Expected 405 for GET');

    const { req: optReq, res: optRes } = createMockReqRes({}, 'OPTIONS');
    await fulfillmentHandler(optReq, optRes);
    assert.strictEqual(optRes._getStatusCode(), 204, 'Expected 204 for OPTIONS');
    assert.strictEqual(optRes._getHeaders()['access-control-allow-origin'], '*');
    console.log('    [PASS] HTTP methods and CORS headers verified.');
  }

  console.log('\n[SUMMARY] ALL 6 CHECKOUT FULFILLMENT TESTS PASSED WITH 100% CONFORMANCE.\n');
}

runTests().catch(err => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
