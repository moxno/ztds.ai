/**
 * Verification test for @ztds/core Open Reference Package
 */

'use strict';

const assert = require('assert');
const { ZTDSEngine, ZTDSClient, SPEC_VERSION, DEMARCATION } = require('./index');

console.log('[TEST] Verifying @ztds/core Open Reference Package...');

const engine = new ZTDSEngine();
assert.strictEqual(SPEC_VERSION, '1.0.0');
assert.strictEqual(DEMARCATION.license, 'Apache-2.0');

// Test 1: Invariant 1 (Zero-Egress) & Invariant 2 (Tokenization)
const mockSsn = ['123', '45', '6789'].join('-');
const raw = `Contact user test.dev@corp.internal at +1-415-555-0199 with SSN ${mockSsn}.`;
const { sanitizedText, tokenMap, zeroEgressAttested, entitiesDetected } = engine.mask(raw);

assert.strictEqual(zeroEgressAttested, true);
assert.strictEqual(entitiesDetected, 3);
assert.ok(!sanitizedText.includes('test.dev@corp.internal'), 'Cleartext email must not be in sanitized payload');
assert.ok(!sanitizedText.includes(mockSsn), 'Cleartext SSN must not be in sanitized payload');
assert.ok(sanitizedText.includes('[EMAIL_TOKEN_1]'));
assert.ok(sanitizedText.includes('[PHONE_TOKEN_2]'));
assert.ok(sanitizedText.includes('[SSN_TOKEN_3]'));

// Test 2: Invariant 2 (Deterministic Context-Preserving Reversible Tokenization)
const simulatedLlmReply = `Received request for user [EMAIL_TOKEN_1] (phone: [PHONE_TOKEN_2]). Processing complete.`;
const { restoredText, tokensRestored } = engine.reveal(simulatedLlmReply, tokenMap);

assert.strictEqual(tokensRestored, 2);
assert.ok(restoredText.includes('test.dev@corp.internal'));
assert.ok(restoredText.includes('+1-415-555-0199'));

// Test 3: Invariants verification
const audit = engine.verifyInvariants();
assert.strictEqual(audit.compliant, true);

// Test 4: High-level ZTDSClient wrapper
const client = new ZTDSClient();
const { sanitizedPrompt, unwrap } = client.wrapPrompt('Account sk-123456789012345678901234 active for user@domain.com');
assert.ok(!sanitizedPrompt.includes('user@domain.com'));
const unwrapped = unwrap(`Processed prompt for [EMAIL_TOKEN_1] with secret [SECRET_TOKEN_2]`);
assert.ok(unwrapped.includes('user@domain.com'));

console.log('[PASS] @ztds/core reference engine successfully verified.');
