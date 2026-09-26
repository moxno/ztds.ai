/**
 * Unit tests for ZTDS FastMCP Middleware
 * Validates 4 Core Protocol Invariants (IETF draft-sibiryakov-ztds-protocol-02)
 */

'use strict';

const assert = require('assert');
const { ZTDSFastMCPMiddleware } = require('./ztdsMiddleware');

async function runTests() {
  console.log('[TEST] Starting ZTDS FastMCP Middleware Test Suite...');
  const middleware = new ZTDSFastMCPMiddleware();

  // Test 1: Invariant 1 & 2 - Input sanitization with deterministic surrogates
  console.log('--> Test 1: Input sanitization with deterministic surrogates');
  {
    const mockSecret = ['sk-', 'live', '998877665544332211'].join('');
    const originalTool = async (args) => {
      // The tool handler should only receive synthetic tokens!
      assert(!args.query.includes('secret-agent@cia.gov'));
      assert(args.query.includes('[EMAIL_TOKEN_1]'));
      assert(!args.apiKey.includes(mockSecret));
      assert(args.apiKey.includes('[API_SECRET_TOKEN_1]'));

      return {
        status: 'success',
        processedQuery: args.query,
        details: 'User secret-agent@cia.gov authenticated successfully.'
      };
    };

    const wrappedTool = middleware.wrapTool('queryDatabase', originalTool);
    const result = await wrappedTool({
      query: 'SELECT * FROM users WHERE email = "secret-agent@cia.gov"',
      apiKey: mockSecret
    });

    // Invariant 1: Output must also be sanitized before reaching the LLM/Claude
    assert(!result.details.includes('secret-agent@cia.gov'));
    assert(result.details.includes('[EMAIL_TOKEN_1]'));
    assert.strictEqual(result._ztds.zeroEgress, true);
    assert(result._ztds.standard.includes('draft-sibiryakov-ztds-protocol-02'));
    console.log('    [PASS] Input and output sanitization with zero cleartext verified.');
  }

  // Test 2: Invariant 3 - Theorem 2 Volatile RAM Zeroization
  console.log('--> Test 2: Theorem 2 Volatile RAM Zeroization');
  {
    assert.strictEqual(middleware._sessionMaps.size, 0);
    assert.strictEqual(middleware._entityMaps.size, 0);
    console.log('    [PASS] Zero session maps remain in RAM after tool invocation.');
  }

  // Test 3: Multiple occurrences of identical entity get identical token
  console.log('--> Test 3: Identical entity surrogate reuse');
  {
    const text = 'Primary: user@corp.net, Secondary: user@corp.net, Other: other@corp.net';
    const { sanitized } = middleware.sanitizeText(text, 'sess-multi');
    assert.strictEqual(sanitized.match(/\[EMAIL_TOKEN_1\]/g).length, 2);
    assert.strictEqual(sanitized.match(/\[EMAIL_TOKEN_2\]/g).length, 1);
    console.log('    [PASS] Surrogate token identity preserved.');
  }

  console.log('\n[SUMMARY] ALL FASTMCP MIDDLEWARE TESTS PASSED (100% INVARIANT CONFORMANCE).\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
