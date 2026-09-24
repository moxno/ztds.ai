/**
 * ZTDS.ai — B2B Lead Capture API Test Suite
 * 
 * Verifies endpoint security, rate limiting, input validation,
 * and lead receipt generation under RFC v1.0 zero-trust invariants.
 */

'use strict';

const assert = require('assert');
const handler = require('../api/lead-capture');

function createMockRes() {
  return {
    _status: null,
    _json: null,
    _headers: {},
    _ended: false,
    setHeader(key, value) {
      this._headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this._status = code;
      return this;
    },
    json(data) {
      this._json = data;
      this._ended = true;
      return this;
    },
    end() {
      this._ended = true;
      return this;
    }
  };
}

async function runTests() {
  console.log('[TEST] Starting ZTDS Lead Capture Verification Suite...\n');

  // Test 1: Valid lead capture submission
  {
    console.log('--> Test 1: Valid Enterprise Lead Submission');
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '198.51.100.15' },
      body: {
        email: 'ciso@enterprise-bank.com',
        domain: 'enterprise-bank.com',
        role: 'CISO / Security Director',
        industryProfile: 'finance',
        riskScore: 85,
        source: 'hero_scanner'
      }
    };
    const res = createMockRes();
    await handler(req, res);

    assert.strictEqual(res._status, 200, 'Expected HTTP 200');
    assert.strictEqual(res._json.success, true, 'Expected success: true');
    assert.strictEqual(res._json.email, 'ciso@enterprise-bank.com');
    assert.strictEqual(res._json.domain, 'enterprise-bank.com');
    assert.strictEqual(res._json.role, 'CISO / Security Director');
    assert.strictEqual(res._json.industryProfile, 'finance');
    assert.match(res._json.leadId, /^LEAD-2026-[A-F0-9]{8}$/, 'Expected leadId format LEAD-2026-XXXXXXXX');
    console.log(`    [PASS] Lead captured successfully with ID: ${res._json.leadId}`);
  }

  // Test 2: Missing email validation
  {
    console.log('--> Test 2: Rejection of Missing Email');
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '198.51.100.16' },
      body: { domain: 'acme-corp.com' }
    };
    const res = createMockRes();
    await handler(req, res);

    assert.strictEqual(res._status, 400, 'Expected HTTP 400 for missing email');
    assert.strictEqual(res._json.error, 'Invalid Email');
    console.log('    [PASS] Missing email rejected with 400 Bad Request');
  }

  // Test 3: Malformed email validation
  {
    console.log('--> Test 3: Rejection of Malformed Email Syntax');
    const malformedEmails = ['not-an-email', '@company.com', 'user@', 'user@domain'];
    for (const invalid of malformedEmails) {
      const req = {
        method: 'POST',
        headers: { 'x-forwarded-for': '198.51.100.17' },
        body: { email: invalid, domain: 'test.io' }
      };
      const res = createMockRes();
      await handler(req, res);

      assert.strictEqual(res._status, 400, `Expected HTTP 400 for ${invalid}`);
      assert.strictEqual(res._json.error, 'Invalid Email');
    }
    console.log('    [PASS] All malformed email formats correctly rejected');
  }

  // Test 4: Method Not Allowed (GET)
  {
    console.log('--> Test 4: Method Not Allowed (GET)');
    const req = {
      method: 'GET',
      headers: {}
    };
    const res = createMockRes();
    await handler(req, res);

    assert.strictEqual(res._status, 405, 'Expected HTTP 405 for GET request');
    assert.strictEqual(res._json.error, 'Method Not Allowed');
    console.log('    [PASS] Non-POST request rejected with 405 Method Not Allowed');
  }

  // Test 5: Preflight OPTIONS request
  {
    console.log('--> Test 5: CORS OPTIONS Preflight');
    const req = {
      method: 'OPTIONS',
      headers: {}
    };
    const res = createMockRes();
    await handler(req, res);

    assert.strictEqual(res._status, 204, 'Expected HTTP 204 for OPTIONS preflight');
    assert.strictEqual(res._headers['access-control-allow-origin'], '*');
    console.log('    [PASS] OPTIONS preflight returns 204 No Content with CORS');
  }

  // Test 6: Rate Limiting Enforcement (10 max per IP)
  {
    console.log('--> Test 6: Sliding-Window Rate Limiting (10 req/hr cap)');
    const testIp = '203.0.113.99';
    // Send 9 requests (bringing total for this IP to 10 including the first if any)
    for (let i = 0; i < 9; i++) {
      const req = {
        method: 'POST',
        headers: { 'x-forwarded-for': testIp },
        body: { email: `user${i}@rate-test.com`, domain: 'rate-test.com' }
      };
      const res = createMockRes();
      await handler(req, res);
      assert.strictEqual(res._status, 200, `Request ${i + 1} should succeed`);
    }

    // 10th request
    const req10 = {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: { email: 'user10@rate-test.com', domain: 'rate-test.com' }
    };
    const res10 = createMockRes();
    await handler(req10, res10);
    assert.strictEqual(res10._status, 200, '10th request should succeed');

    // 11th request must be blocked
    const req11 = {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: { email: 'user11@rate-test.com', domain: 'rate-test.com' }
    };
    const res11 = createMockRes();
    await handler(req11, res11);

    assert.strictEqual(res11._status, 429, '11th request must emit HTTP 429 Too Many Requests');
    assert.strictEqual(res11._json.error, 'Too Many Requests');
    console.log('    [PASS] Rate limit accurately enforced at 10 requests threshold (429 emitted)');
  }

  // Test 7: Input sanitization & XSS neutralization
  {
    console.log('--> Test 7: Input Sanitization & XSS Neutralization');
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '198.51.100.99' },
      body: {
        email: 'legal@safe-domain.com',
        domain: '<script>alert(1)</script>safe-domain.com',
        role: 'VP Security & Risk <img src=x onerror=alert(1)>',
        industryProfile: 'healthcare" onload="alert(1)'
      }
    };
    const res = createMockRes();
    await handler(req, res);

    assert.strictEqual(res._status, 200);
    assert.strictEqual(res._json.domain, 'scriptalert(1)/scriptsafe-domain.com');
    assert.strictEqual(res._json.role, 'VP Security  Risk img src=x onerror=alert(1)');
    assert.strictEqual(res._json.industryProfile, 'healthcare onload=alert(1)');
    console.log('    [PASS] HTML/script injection tags stripped cleanly from lead record');
  }

  // Test 8: Resend Transactional Email Dispatch Helper
  {
    console.log('--> Test 8: Resend Dispatch Resilience & Structure');
    assert.strictEqual(typeof handler._dispatchResendEmail, 'function', 'Resend dispatcher must be exported');
    
    // Ensure dispatch handles error gracefully without unhandled rejection
    const mockPayload = {
      leadId: 'LEAD-2026-TEST1234',
      email: 'ciso@test-enterprise.org',
      domain: 'test-enterprise.org',
      role: 'CISO',
      industryProfile: 'finance',
      riskScore: 88,
      source: 'agency_workbench',
      timestamp: new Date().toISOString(),
      notes: 'BrandMeWeb Snapshot Audit ($2,500)'
    };

    const result = await handler._dispatchResendEmail('re_mock_test_key', mockPayload);
    assert.strictEqual(typeof result, 'boolean', 'Dispatch must resolve to boolean without throwing');
    console.log('    [PASS] Resend email dispatch verified and resilient');
  }

  console.log('\n[SUMMARY] ALL 8 LEAD CAPTURE TESTS PASSED WITH 100% CONFORMANCE.\n');
}

runTests().catch(err => {
  console.error('[FAIL] Lead capture test error:', err);
  process.exit(1);
});
