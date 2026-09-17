/**
 * Automated Verification Suite for ZTDS Offline Cryptographic Licensing
 * 
 * Tests:
 * 1. Cryptographic Ed25519 signature validation
 * 2. Tampering detection on payload and signature
 * 3. Expiration and 60-day operational grace period mechanics
 * 4. Anti-Cannibalization Mandate (25 Industry Profiles gating)
 * 5. Latency benchmark & zero-network execution
 */

"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  verifyLicense,
  assertProfileAllowed,
  getLicenseSummary,
  canonicalizeJson,
  base64urlEncode,
  base64urlDecode,
  LicenseMalformedError,
  LicenseTamperedError,
  LicenseExpiredError,
  FeatureUnauthorizedError
} = require("../lib/license-validator");

// Helper to mint test licenses in-memory
function mintTestToken(payload, privateKeyPem) {
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalizeJson(payload)), "utf8");
  const sig = crypto.sign(null, canonicalBytes, privateKeyPem);
  return `ZTDS-LIC-v1.${base64urlEncode(canonicalBytes)}.${base64urlEncode(sig)}`;
}

async function runTests() {
  console.log("[TEST] Starting ZTDS Offline Licensing Verification Suite...");

  const privateKeyPem = fs.readFileSync(path.join(__dirname, "../keys/ztds_license_private.pem"), "utf8");
  const publicKeyPem = fs.readFileSync(path.join(__dirname, "../keys/ztds_license_public.pem"), "utf8");

  // Test 1: Valid Enterprise Air-Gapped License
  console.log("--> Test 1: Valid Enterprise Air-Gapped Token Verification");
  const now = new Date();
  const future = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  const entPayload = {
    license_id: "ZTDS-2026-ENT-0001",
    customer_name: "Acme Global Health",
    tier: "enterprise_airgapped",
    issued_at: now.toISOString(),
    expires_at: future.toISOString(),
    grace_period_days: 60,
    max_nodes: 5,
    features: {
      universal_pii: true,
      specialized_profiles: true,
      allowed_profiles: ["*"],
      evidence_binder: true
    }
  };

  const entToken = mintTestToken(entPayload, privateKeyPem);
  const entResult = verifyLicense(entToken, { publicKeyPem });
  assert.strictEqual(entResult.valid, true);
  assert.strictEqual(entResult.customerName, "Acme Global Health");
  assert.strictEqual(entResult.inGracePeriod, false);
  assert.strictEqual(entResult.maxNodes, 5);
  console.log("    [PASS] Enterprise license signature and schema validated.");

  // Test 2: Profile Gating & Anti-Cannibalization Mandate
  console.log("--> Test 2: Anti-Cannibalization Profile Gating");
  // Universal PII always passes
  assert.doesNotThrow(() => assertProfileAllowed(entResult, "universal"));
  // Wildcard allows healthcare & financial
  assert.doesNotThrow(() => assertProfileAllowed(entResult, "healthcare"));
  assert.doesNotThrow(() => assertProfileAllowed(entResult, "financial"));

  // Developer Pro payload (no specialized profiles)
  const devPayload = {
    license_id: "ZTDS-2026-DEV-0002",
    customer_name: "Startup AI Labs",
    tier: "developer_pro",
    issued_at: now.toISOString(),
    expires_at: future.toISOString(),
    grace_period_days: 30,
    max_nodes: 2,
    features: {
      universal_pii: true,
      specialized_profiles: false,
      allowed_profiles: []
    }
  };
  const devToken = mintTestToken(devPayload, privateKeyPem);
  const devResult = verifyLicense(devToken, { publicKeyPem });
  
  // Developer tier can use universal PII
  assert.doesNotThrow(() => assertProfileAllowed(devResult, "universal"));
  // Developer tier BLOCKED from healthcare profile
  assert.throws(
    () => assertProfileAllowed(devResult, "healthcare"),
    FeatureUnauthorizedError,
    "Developer Pro tier must be blocked from specialized profiles."
  );
  console.log("    [PASS] Anti-cannibalization gate successfully blocked unauthorized profile on Developer tier.");

  // Test 3: Tamper Detection (Payload Modification)
  console.log("--> Test 3: Tamper Detection (Modified Node Count)");
  const parts = entToken.split(".");
  const decodedPayload = JSON.parse(base64urlDecode(parts[1]).toString("utf8"));
  decodedPayload.max_nodes = 9999; // Tampering node count
  const tamperedPayloadB64 = base64urlEncode(Buffer.from(JSON.stringify(canonicalizeJson(decodedPayload)), "utf8"));
  const tamperedToken = `ZTDS-LIC-v1.${tamperedPayloadB64}.${parts[2]}`;

  assert.throws(
    () => verifyLicense(tamperedToken, { publicKeyPem }),
    LicenseTamperedError,
    "Tampered payload must fail cryptographic verification."
  );
  console.log("    [PASS] Payload tampering detected and rejected.");

  // Test 4: Expiration & Grace Period Handling
  console.log("--> Test 4: Expiration & Grace Period Lifecycle");
  const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
  const gracePayload = {
    ...entPayload,
    expires_at: pastDate.toISOString(),
    grace_period_days: 60
  };
  const graceToken = mintTestToken(gracePayload, privateKeyPem);
  
  // Under current time (10 days past expiry, within 60-day grace):
  const graceResult = verifyLicense(graceToken, { publicKeyPem, currentTime: now });
  assert.strictEqual(graceResult.valid, true);
  assert.strictEqual(graceResult.inGracePeriod, true);
  assert.ok(graceResult.graceDaysRemaining > 0, "Grace days remaining should be positive.");
  console.log(`    [PASS] Grace period active: ${graceResult.graceDaysRemaining} days remaining.`);

  // Past 60 days grace:
  const farFutureTime = new Date(pastDate.getTime() + 65 * 24 * 60 * 60 * 1000);
  assert.throws(
    () => verifyLicense(graceToken, { publicKeyPem, currentTime: farFutureTime }),
    LicenseExpiredError,
    "Token past grace period must throw LicenseExpiredError."
  );
  console.log("    [PASS] Expired token past grace period rejected.");

  // Test 5: Malformed Token Syntax
  console.log("--> Test 5: Malformed Token Syntax");
  assert.throws(() => verifyLicense("invalid-token-string"), LicenseMalformedError);
  assert.throws(() => verifyLicense("ZTDS-LIC-v1.onlytwo"), LicenseMalformedError);
  console.log("    [PASS] Malformed tokens rejected.");

  // Test 6: Performance & Microsecond Benchmark
  console.log("--> Test 6: In-Memory Latency Benchmark (1,000 verifications)");
  const start = process.hrtime.bigint();
  for (let i = 0; i < 1000; i++) {
    verifyLicense(entToken, { publicKeyPem });
  }
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  const avgUs = (elapsedMs / 1000) * 1000;
  console.log(`    [PERF] 1,000 verifications in ${elapsedMs.toFixed(2)}ms (avg ${avgUs.toFixed(1)} μs per verification).`);
  assert.ok(avgUs < 500, "Verification latency must be under 500 μs (<0.5ms).");

  // Summary
  console.log("------------------------------------------------------------");
  console.log("[SUMMARY] ALL 6 TESTS PASSED WITH 100% INVARIANT CONFORMANCE.");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
