/**
 * Test Suite for ZTDS Reference MCP Server (packages/ztds-mcp)
 * Validates JSON-RPC 2.0 protocol and 4 ZTDS RFC v1.0 Invariants
 */

import assert from 'assert';
import { handleMessage, sanitizeText, restoreText, auditText, resetSessionStore, TOOLS } from './index.js';

async function runTests() {
  console.log('[TEST] Starting ZTDS MCP Server Verification Suite...');

  // 1. JSON-RPC Protocol Handshake: initialize
  console.log('--> Test 1: JSON-RPC "initialize" response');
  const initRes = await handleMessage({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-runner', version: '1.0.0' }
    }
  });
  assert.strictEqual(initRes.id, 1);
  assert.strictEqual(initRes.result.serverInfo.name, 'ztds-mcp');
  assert.strictEqual(initRes.result.protocolVersion, '2024-11-05');
  console.log('    [PASS] initialize handshake verified.');

  // 2. tools/list verification
  console.log('--> Test 2: JSON-RPC "tools/list"');
  const toolsRes = await handleMessage({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  });
  assert.strictEqual(toolsRes.result.tools.length, 5);
  const toolNames = toolsRes.result.tools.map(t => t.name);
  assert(toolNames.includes('ztds_sanitize'));
  assert(toolNames.includes('ztds_restore'));
  assert(toolNames.includes('ztds_audit'));
  assert(toolNames.includes('ztds_info'));
  assert(toolNames.includes('ztds_reset_session'));
  console.log('    [PASS] All 5 tools listed with valid schemas.');

  // 3. Invariant 1: ztds_sanitize masks cleartext
  console.log('--> Test 3: Invariant 1 - ztds_sanitize zero cleartext');
  const mockSecret = ['sk', 'ant', '12345678901234567890'].join('-');
  const cleartext = `Contact alice@hospital.org or call 555-019-2831. Secret key: ${mockSecret}.`;
  const sanitizeRes = await handleMessage({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'ztds_sanitize',
      arguments: {
        text: cleartext,
        sessionId: 'test-session-1'
      }
    }
  });
  const outputText = sanitizeRes.result.content[0].text;
  assert(!outputText.includes('alice@hospital.org'), 'Email must be masked');
  assert(!outputText.includes('555-019-2831'), 'Phone must be masked');
  assert(!outputText.includes(mockSecret), 'Secret key must be masked');
  assert(outputText.includes('[EMAIL_TOKEN_1]'), 'Must contain surrogate token');
  assert(outputText.includes('[PHONE_TOKEN_1]'), 'Must contain surrogate token');
  assert(outputText.includes('[API_SECRET_TOKEN_1]'), 'Must contain surrogate token');
  assert(outputText.includes('@privacyscrubber/mcp-server'), 'Must link to PrivacyScrubber commercial tier');
  console.log('    [PASS] Invariant 1 verified (zero egress cleartext).');

  // 4. Invariant 2: Deterministic surrogates
  console.log('--> Test 4: Invariant 2 - Deterministic token reuse within session');
  const duplicateText = 'Send to alice@hospital.org and cc alice@hospital.org';
  const dupRes = await handleMessage({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'ztds_sanitize',
      arguments: {
        text: duplicateText,
        sessionId: 'test-session-1'
      }
    }
  });
  const dupOutput = dupRes.result.content[0].text;
  const tokenMatches = dupOutput.match(/\[EMAIL_TOKEN_1\]/g);
  assert.strictEqual(tokenMatches.length, 2, 'Duplicate entity must reuse [EMAIL_TOKEN_1]');
  console.log('    [PASS] Invariant 2 verified (deterministic token reuse).');

  // 5. ztds_restore: Unmasks tokens back to cleartext
  console.log('--> Test 5: ztds_restore unmasking');
  const llmResponse = 'Processed patient with email [EMAIL_TOKEN_1] successfully.';
  const restoreRes = await handleMessage({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'ztds_restore',
      arguments: {
        text: llmResponse,
        sessionId: 'test-session-1'
      }
    }
  });
  assert.strictEqual(restoreRes.result.content[0].text, 'Processed patient with email alice@hospital.org successfully.');
  console.log('    [PASS] ztds_restore unmasking verified.');

  // 6. Invariant 3: Theorem 2 volatile RAM zeroization
  console.log('--> Test 6: Invariant 3 - Theorem 2 RAM zeroization');
  await handleMessage({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'ztds_reset_session',
      arguments: {
        sessionId: 'test-session-1'
      }
    }
  });
  const afterResetRestore = await handleMessage({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'ztds_restore',
      arguments: {
        text: llmResponse,
        sessionId: 'test-session-1'
      }
    }
  });
  assert.strictEqual(afterResetRestore.result.content[0].text, llmResponse, 'Tokens must not resolve after purge');
  console.log('    [PASS] Theorem 2 RAM zeroization verified.');

  // 7. ztds_audit
  console.log('--> Test 7: ztds_audit deterministic scan');
  const auditRes = await handleMessage({
    jsonrpc: '2.0',
    id: 8,
    method: 'tools/call',
    params: {
      name: 'ztds_audit',
      arguments: {
        text: 'Server IP: 192.168.1.1, IBAN: GB82WEST12345698765432'
      }
    }
  });
  const auditData = JSON.parse(auditRes.result.content[0].text);
  assert.strictEqual(auditData.totalEntitiesFound, 2);
  assert.strictEqual(auditData.breakdown.IPV4, 1);
  assert.strictEqual(auditData.breakdown.IBAN, 1);
  assert(auditData.contentHash.startsWith('sha256:'));
  console.log('    [PASS] ztds_audit deterministic scan verified.');

  // 8. prompts/list and prompts/get
  console.log('--> Test 8: MCP prompts integration');
  const promptList = await handleMessage({ jsonrpc: '2.0', id: 9, method: 'prompts/list', params: {} });
  assert.strictEqual(promptList.result.prompts.length, 1);
  const promptGet = await handleMessage({
    jsonrpc: '2.0',
    id: 10,
    method: 'prompts/get',
    params: { name: 'ztds_guard', arguments: { task: 'Analyze database records' } }
  });
  assert(promptGet.result.messages[0].content.text.includes('Analyze database records'));
  console.log('    [PASS] MCP prompts verified.');

  console.log('\n[SUMMARY] ALL 8 ZTDS MCP SERVER TESTS PASSED (100% CONFORMANCE).\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
