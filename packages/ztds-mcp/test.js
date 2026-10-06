/**
 * Test Suite for ZTDS Reference MCP Server (packages/ztds-mcp)
 * Validates JSON-RPC 2.0 protocol and 4 ZTDS RFC v1.0 Invariants
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { 
  handleMessage, 
  sanitizeText, 
  restoreText, 
  auditText, 
  auditFileDetailed,
  collectFilesToAudit,
  resetSessionStore, 
  runSelfTest,
  getClientPaths,
  configureTarget,
  TOOLS 
} from './index.js';

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

  // 9. Formatted Credit Cards (Dashes & Spaces)
  console.log('--> Test 9: Formatted Credit Cards (Dashes & Spaces)');
  const cardText = 'Visa: 4532-1234-5678-9010, Mastercard: 5412 3456 7890 1234';
  const cardRes = sanitizeText(cardText, 'sess-cards');
  assert(!cardRes.sanitizedText.includes('4532-1234-5678-9010'));
  assert(!cardRes.sanitizedText.includes('5412 3456 7890 1234'));
  assert.strictEqual(cardRes.entitiesMasked, 2);
  const cardRestored = restoreText(cardRes.sanitizedText, 'sess-cards');
  assert.strictEqual(cardRestored.restoredText, cardText);
  console.log('    [PASS] Formatted credit cards sanitized and restored accurately.');

  // 10. Non-Phone Numeric Sequences (SKUs, Order IDs, Ports)
  console.log('--> Test 10: Non-Phone Numeric Sequences Protection (No False Positives)');
  const nonPhoneText = 'Product SKU 123456789012345 and Order #182655957 on port 8080 in year 2026';
  const nonPhoneRes = sanitizeText(nonPhoneText, 'sess-non-phone');
  assert.strictEqual(nonPhoneRes.sanitizedText, nonPhoneText, 'Non-phone numeric sequences must not be masked');
  assert.strictEqual(nonPhoneRes.entitiesMasked, 0);
  console.log('    [PASS] Numeric IDs and ports preserved without false-positive masking.');

  // 11. International Phone Formats
  console.log('--> Test 11: International Phone Formats');
  const intlText = 'Call Tel Aviv: +972 54 123 4567, London: +44 20 7946 0912, Mobile: 054-1234567';
  const intlRes = sanitizeText(intlText, 'sess-intl');
  assert(!intlRes.sanitizedText.includes('+972 54 123 4567'));
  assert(!intlRes.sanitizedText.includes('+44 20 7946 0912'));
  assert(!intlRes.sanitizedText.includes('054-1234567'));
  assert.strictEqual(intlRes.entitiesMasked, 3);
  const intlRestored = restoreText(intlRes.sanitizedText, 'sess-intl');
  assert.strictEqual(intlRestored.restoredText, intlText);
  console.log('    [PASS] International and local phone numbers masked and restored accurately.');

  // 12. Second-Order Token Injection Resistance (Atomic Single-Pass Unmasking)
  console.log('--> Test 12: Second-Order Token Injection Resistance');
  const store = (await import('./index.js')).resetSessionStore('sess-inject');
  // Adversarial cleartext containing another token
  const injectText = 'Target: secret_with_[EMAIL_TOKEN_1] and real: admin@secure.net';
  const injectRes = sanitizeText(injectText, 'sess-inject');
  // LLM echoes back the sanitized text
  const injectRestored = restoreText(injectRes.sanitizedText, 'sess-inject');
  assert.strictEqual(injectRestored.restoredText, injectText);
  console.log('    [PASS] Atomic single-pass replacement immune to cascade injection.');

  // 13. Input Length Safety Boundary (DoS Protection)
  console.log('--> Test 13: Input Length Safety Boundary');
  const oversizedText = 'A'.repeat(500001);
  let errorCaught = false;
  try {
    sanitizeText(oversizedText, 'sess-oversized');
  } catch (err) {
    errorCaught = true;
    assert(err.message.includes('exceeds maximum safety limit'));
  }
  assert(errorCaught, 'Oversized text must be rejected');
  console.log('    [PASS] DoS safety boundary verified (500 KB limit enforced).');

  // 14. In-RAM Self-Test Engine
  console.log('--> Test 14: In-RAM Engine Self-Test Verification');
  const selfTestResult = runSelfTest();
  assert.strictEqual(selfTestResult, true, 'runSelfTest must return true');
  console.log('    [PASS] In-RAM engine self-test passed (mask, restore, zeroize).');

  // 15. Client Paths Resolution
  console.log('--> Test 15: Client Paths Resolution');
  const clientPaths = getClientPaths();
  assert(clientPaths.claude && typeof clientPaths.claude === 'string');
  assert(clientPaths.cursorWorkspace && typeof clientPaths.cursorWorkspace === 'string');
  assert(clientPaths.windsurf && typeof clientPaths.windsurf === 'string');
  console.log('    [PASS] Client configuration paths resolved accurately across platforms.');

  // 16. Target Configurator on Isolated Temp Directory
  console.log('--> Test 16: Target Configurator (Isolated Temp Target)');
  const tmpDir = path.join(os.tmpdir(), `ztds_test_${Date.now()}`);
  const tmpTarget = path.join(tmpDir, 'mcp.json');
  try {
    const configResult = configureTarget('Test Client', tmpTarget);
    assert.strictEqual(configResult.success, true);
    assert(fs.existsSync(tmpTarget));
    const savedConfig = JSON.parse(fs.readFileSync(tmpTarget, 'utf8'));
    assert(savedConfig.mcpServers && savedConfig.mcpServers.ztds);
    assert.strictEqual(savedConfig.mcpServers.ztds.command, 'npx');
    assert(savedConfig.mcpServers.ztds.args.includes('ztds-mcp'));
    console.log('    [PASS] Configurator generates valid MCP configuration without error.');
  } finally {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  // 17. Detailed File Audit (Clean File)
  console.log('--> Test 17: Detailed File Audit (Clean File)');
  const cleanAudit = auditFileDetailed(path.join(__dirname, 'package.json'));
  assert.strictEqual(cleanAudit.totalFindings, 0);
  assert(cleanAudit.fileHash && cleanAudit.fileHash.startsWith('sha256:'));
  console.log('    [PASS] Clean file audit returns zero findings and valid SHA-256 hash.');

  // 18. Detailed File Audit (Finding Detection & Line Numbers)
  console.log('--> Test 18: Detailed File Audit (Finding Detection & Line Numbers)');
  const tmpAuditDir = path.join(os.tmpdir(), `ztds_audit_test_${Date.now()}`);
  fs.mkdirSync(tmpAuditDir, { recursive: true });
  const sampleSecret = ['sk', 'ant', 'sampletestsecret1234567890'].join('-');
  const testFilePath = path.join(tmpAuditDir, '.env.test');
  fs.writeFileSync(testFilePath, `# Test env\nPORT=8080\nAPI_KEY=${sampleSecret}\nCONTACT=admin@hospital.org\n`, 'utf8');

  try {
    const findingAudit = auditFileDetailed(testFilePath);
    assert.strictEqual(findingAudit.totalFindings, 2);
    assert.strictEqual(findingAudit.categoryTotals.API_SECRET, 1);
    assert.strictEqual(findingAudit.categoryTotals.EMAIL, 1);
    assert.strictEqual(findingAudit.lineFindings[0].line, 3);
    assert.strictEqual(findingAudit.lineFindings[1].line, 4);
    console.log('    [PASS] Detailed audit correctly identifies findings, categories, and line numbers.');
  } finally {
    fs.rmSync(tmpAuditDir, { recursive: true, force: true });
  }

  // 19. Directory Collection Filtering (Ignored Directories)
  console.log('--> Test 19: Directory Collection Filtering (Ignored Directories)');
  const filesFound = collectFilesToAudit(__dirname, 50);
  assert(filesFound.length > 0);
  const hasNodeModules = filesFound.some(f => f.includes('node_modules'));
  assert.strictEqual(hasNodeModules, false);
  console.log('    [PASS] Directory scanner respects ignored paths (node_modules, .git).');

  console.log('\n[SUMMARY] ALL 19 ZTDS MCP SERVER TESTS PASSED (100% CONFORMANCE).\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
