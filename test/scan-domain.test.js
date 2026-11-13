/**
 * Automated Verification Suite for ZTDS Domain Perimeter Scanner Engine
 * 
 * Verifies:
 * 1. Anti-SSRF protection: rejects localhost, private IPs (RFC 1918), metadata service IPs (169.254.169.254).
 * 2. Input validation: rejects malformed domain syntax.
 * 3. Heuristic surface analyzer: detects frameworks, chat widgets, sensory inputs, tracker sinkholes.
 * 4. ZTDS RFC v1.0 invariant evaluator: generates riskScore, invariant statuses, and tailored blueprints.
 * 5. Zero-persistence & stateless compliance.
 */

'use strict';

const assert = require('assert');
const scanDomainHandler = require('../api/scan-domain');

// Mock request and response helpers
function createMockReqRes({ method = 'POST', query = {}, body = null, headers = {} }) {
  const req = {
    method,
    query,
    body,
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  };

  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
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

async function runTests() {
  console.log('[TEST] Starting ZTDS Domain Scanner Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  [PASS] ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`  [FAIL] ${name}: ${err.message}`);
        failed++;
      });
  }

  // 1. Missing Parameter Check
  await test('Missing domain parameter returns 400 Bad Request', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: {} });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.data.error.includes('Missing domain'));
  });

  // 2. Malformed Domain Check
  await test('Malformed domain returns 400 Bad Request', async () => {
    const invalidDomains = ['not_a_domain', 'http://', '..com', 'test..domain.com', 'a'.repeat(260) + '.com'];
    for (const d of invalidDomains) {
      const { req, res } = createMockReqRes({ method: 'GET', query: { domain: d } });
      await scanDomainHandler(req, res);
      assert.strictEqual(res.statusCode, 400, `Expected 400 for ${d}`);
    }
  });

  // 3. Anti-SSRF: Localhost and Loopback Rejection
  await test('Anti-SSRF: rejects localhost and 127.0.0.1', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: { domain: 'localhost' } });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
  });

  await test('Anti-SSRF: rejects 127.0.0.1 directly', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: { domain: '127.0.0.1' } });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.data.error.includes('Restricted domain target') || res.data.error.includes('Invalid domain'));
  });

  // 4. Anti-SSRF: Cloud Metadata Service Rejection
  await test('Anti-SSRF: rejects link-local / AWS / GCP metadata IP (169.254.169.254)', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: { domain: '169.254.169.254' } });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
  });

  // 5. Anti-SSRF: Private Network (RFC 1918) Rejection
  await test('Anti-SSRF: rejects private RFC 1918 addresses', async () => {
    const privateIps = ['10.0.0.1', '192.168.1.1', '172.16.0.1'];
    for (const ip of privateIps) {
      const { req, res } = createMockReqRes({ method: 'POST', body: { domain: ip } });
      await scanDomainHandler(req, res);
      assert.strictEqual(res.statusCode, 400, `Expected 400 for private IP ${ip}`);
    }
  });

  // 6. Non-existent domain returns 404 Not Found
  await test('Non-existent domain returns 404 Not Found', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: { domain: 'this-domain-definitely-does-not-exist-981247.com' } });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.ok(res.data.error.includes('Domain not found'));
  });

  // 7. Options CORS Preflight & Fetch Metadata Guard Check
  await test('OPTIONS preflight returns 204 with strict origin CORS and blocks cross-site POST', async () => {
    const { req, res } = createMockReqRes({ method: 'OPTIONS' });
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 204);
    assert.strictEqual(res.headers['access-control-allow-origin'], 'https://ztds.ai');
    assert.strictEqual(res.headers['access-control-allow-methods'], 'GET, POST, OPTIONS');

    const cross = createMockReqRes({
      method: 'POST',
      headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' },
      body: { domain: 'google.com' }
    });
    await scanDomainHandler(cross.req, cross.res);
    assert.strictEqual(cross.res.statusCode, 403);
  });

  // 8. Schema and Conformance Structure Check
  await test('Valid public domain scan produces compliant ZTDS schema', async () => {
    const { req, res } = createMockReqRes({ method: 'POST', body: { domain: 'google.com' } });
    await scanDomainHandler(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.domain, 'google.com');
    assert.ok(res.data.scanDurationMs >= 0);
    assert.strictEqual(res.data.telemetry.rawWanEgress, '0.00 Bytes');
    assert.ok(res.data.telemetry.executionPerimeter.includes('Volatile Edge Memory'));

    // Findings schema
    assert.ok(Array.isArray(res.data.findings.frameworks));
    assert.ok(Array.isArray(res.data.findings.sensorySurfaces));
    assert.ok(Array.isArray(res.data.findings.thirdPartySinks));
    assert.ok(res.data.findings.cspAnalysis);

    // Evaluation schema
    const ev = res.data.evaluation;
    assert.ok(typeof ev.riskScore === 'number');
    assert.ok(ev.riskScore >= 0 && ev.riskScore <= 100);
    assert.ok(['OPTIMAL', 'MODERATE_RISK', 'HIGH_EXPOSURE'].includes(ev.conformanceRating));
    assert.ok(ev.invariantStatus.invariant1);
    assert.ok(ev.invariantStatus.invariant2);
    assert.ok(ev.invariantStatus.invariant3);
    assert.ok(ev.invariantStatus.invariant4);
    assert.ok(ev.recommendedBlueprint.codeSnippet.length > 50);
    assert.ok(ev.recommendedBlueprint.dpaStatus.includes('EXEMPT'));
    assert.ok(ev.cisoExecutiveSummary.includes('google.com'));

    // Multi-Framework Blueprints (Sprint 3)
    assert.ok(ev.blueprints.nextjs && ev.blueprints.nextjs.codeSnippet.includes('middleware'));
    assert.ok(ev.blueprints.cloudflare && ev.blueprints.cloudflare.codeSnippet.includes('worker'));
    assert.ok(ev.blueprints.python && ev.blueprints.python.codeSnippet.includes('FastAPI'));
    assert.ok(ev.blueprints.client && ev.blueprints.client.codeSnippet.includes('script'));
    assert.ok(ev.blueprints.wordpress && ev.blueprints.wordpress.codeSnippet.includes('privacyscrubber-ztds-guard'));
    assert.ok(ev.dagComparison.legacy && ev.dagComparison.ztds);

    // Industry Taxonomy Check
    assert.ok(ev.industry);
    assert.strictEqual(ev.industry.activeProfile, 'general');
    assert.ok(ev.industry.targetEntities.length >= 5);
    assert.ok(Object.keys(ev.industry.allProfiles).length >= 5);
  });

  // 9. Industry Profile Passive Detection
  await test('detectIndustryProfile accurately classifies vertical domains and keywords', async () => {
    const { detectIndustryProfile } = scanDomainHandler;
    assert.strictEqual(detectIndustryProfile('myclinic-health.com').profile, 'medical');
    assert.strictEqual(detectIndustryProfile('fintech-pay-gateway.com').profile, 'finance');
    assert.strictEqual(detectIndustryProfile('apex-lawfirm-litigation.com').profile, 'legal');
    assert.strictEqual(detectIndustryProfile('workforce-talent-recruit.com').profile, 'hr');
    assert.strictEqual(detectIndustryProfile('cloud-cyber-security.com').profile, 'security');
    assert.strictEqual(detectIndustryProfile('random-generic-store.com').profile, 'general');
  });

  // 10. Explicit Profile Override & HIPAA Blueprint Customization
  await test('Explicit profile parameter (?profile=medical) customizes blueprints with HIPAA rules', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
      query: { domain: 'google.com', profile: 'medical' }
    });
    await scanDomainHandler(req, res);

    assert.strictEqual(res.statusCode, 200);
    const ev = res.data.evaluation;
    assert.strictEqual(ev.industry.activeProfile, 'medical');
    assert.ok(ev.industry.statute.includes('HIPAA'));
    assert.ok(ev.industry.targetEntities.some(e => e.includes('MRN') || e.includes('Safe Harbor')));
    assert.ok(ev.recommendedBlueprint.dpaStatus.includes('BAA-EXEMPT'));

    // Verify blueprints code includes medical profile initialization
    assert.ok(ev.blueprints.nextjs.codeSnippet.includes("profiles: ['medical', 'hipaa']"));
    assert.ok(ev.blueprints.cloudflare.codeSnippet.includes("profiles: ['medical', 'hipaa']"));
    assert.ok(ev.blueprints.python.codeSnippet.includes("profiles=['medical', 'hipaa']"));
    assert.ok(ev.blueprints.client.codeSnippet.includes("profiles: ['medical', 'hipaa']"));
  });

  // 11. FinTech Profile Parameter Customization
  await test('FinTech profile (?profile=finance) customizes blueprints with PCI-DSS rules', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { domain: 'google.com', profile: 'finance' }
    });
    await scanDomainHandler(req, res);

    assert.strictEqual(res.statusCode, 200);
    const ev = res.data.evaluation;
    assert.strictEqual(ev.industry.activeProfile, 'finance');
    assert.ok(ev.industry.statute.includes('PCI-DSS'));
    assert.ok(ev.industry.targetEntities.some(e => e.includes('IBAN') || e.includes('PAN')));
    assert.ok(ev.blueprints.nextjs.codeSnippet.includes("profiles: ['finance', 'pci_dss']"));
  });

  // 12. Rate Limiting Enforcement (S-3)
  await test('Rate limiter enforces max requests per IP and emits 429 when threshold exceeded', async () => {
    const testIp = '198.51.100.77';
    let lastStatusCode = 200;
    let lastRes = null;
    for (let i = 0; i < 26; i++) {
      const { req, res } = createMockReqRes({
        method: 'POST',
        body: {}
      });
      req.headers['x-forwarded-for'] = testIp;
      await scanDomainHandler(req, res);
      lastStatusCode = res.statusCode;
      lastRes = res;
      if (i === 0) {
        assert.strictEqual(res.headers['x-ratelimit-limit'], '25');
        assert.strictEqual(res.statusCode, 400); // validated pre-scan without network delay
      }
    }
    assert.strictEqual(lastStatusCode, 429);
    assert.strictEqual(lastRes.headers['retry-after'], '60');
    assert.strictEqual(lastRes.headers['x-ratelimit-remaining'], '0');
  });

  // 13. Plane 6 WordPress Detection & Active ZTDS Guard Invariant Scoring
  await test('WordPress detection & active ZTDS Form Guard elevate Invariants 2 & 3 to VERIFIED and recommend wordpress blueprint', async () => {
    const { analyzePerimeterSurface, evaluateZtdsConformance } = scanDomainHandler;
    const wpHtml = '<html><head><link rel="stylesheet" href="/wp-content/themes/theme/style.css"></head><body><form data-ztds-form-seal="1"><textarea name="msg"></textarea></form></body></html>';
    const findings = analyzePerimeterSurface({}, wpHtml);
    assert.strictEqual(findings.ztdsGuardActive, true);
    assert.ok(findings.frameworks.some(f => f.name === 'WordPress'));

    const ev = evaluateZtdsConformance(findings, 'barrelswood.com');
    assert.strictEqual(ev.recommendedVector, 'wordpress');
    assert.strictEqual(ev.invariantStatus.invariant2.status, 'VERIFIED');
    assert.strictEqual(ev.invariantStatus.invariant3.status, 'VERIFIED');
    assert.strictEqual(ev.riskScore, 100);
  });

  // 14. Anti-Forgery Regression: ?mint=1 MUST NEVER issue ZTDS-CERT-v1 to unverified third-party domains
  await test('Anti-Forgery: ?mint=1 on unverified public domain returns domainCertificate === null', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
      query: { domain: 'google.com', mint: '1' }
    });
    req.headers['x-forwarded-for'] = '198.51.100.88';
    await scanDomainHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.findings.ztdsGuardActive, false);
    assert.strictEqual(res.data.domainCertificate, null, '?mint=1 must never forge a ZTDS-CERT-v1 certificate for unverified domains');
  });

  // 15. Anti-SSRF IPv6 Hex-Mapped & NAT64 Regression
  await test('Anti-SSRF: rejects hex IPv4-mapped IPv6 (::ffff:7f00:1, ::ffff:a9fe:a9fe) and NAT64 (64:ff9b::1)', async () => {
    const { isDisallowedIp } = scanDomainHandler;
    assert.strictEqual(isDisallowedIp('::ffff:7f00:1'), true, 'Hex IPv4-mapped loopback must be blocked');
    assert.strictEqual(isDisallowedIp('0:0:0:0:0:ffff:a9fe:a9fe'), true, 'Expanded IPv4-mapped metadata IP must be blocked');
    assert.strictEqual(isDisallowedIp('64:ff9b::1'), true, 'NAT64 prefix must be blocked');
    assert.strictEqual(isDisallowedIp('2001:db8::1'), true, 'Documentation IPv6 prefix must be blocked');
    assert.strictEqual(isDisallowedIp('ff02::1'), true, 'Multicast IPv6 prefix must be blocked');
    assert.strictEqual(isDisallowedIp('2606:4700:4700::1111'), false, 'Public IPv6 (1.1.1.1) must remain allowed');
  });

  // 16. Spoofed X-Forwarded-For Rate-Limit Bypass Regression
  await test('Rate limiter rejects spoofed X-Forwarded-For: test-runner sentinel after 25 requests', async () => {
    let lastStatusCode = 200;
    for (let i = 0; i < 26; i++) {
      const { req, res } = createMockReqRes({
        method: 'POST',
        headers: { 'x-forwarded-for': 'test-runner' },
        body: {}
      });
      await scanDomainHandler(req, res);
      lastStatusCode = res.statusCode;
    }
    assert.strictEqual(lastStatusCode, 429, 'Spoofed X-Forwarded-For: test-runner must NEVER bypass rate limiting');
  });

  console.log(`\n[TEST SUMMARY] ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
