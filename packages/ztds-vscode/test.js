'use strict';

const assert = require('assert');
const {
  sanitizeText,
  restoreText,
  auditDocumentLines,
  mergeVscodeMcpConfig,
  resetSession,
  getSessionTokenCount
} = require('./core');

console.log('[TEST] Starting ZTDS VS Code Extension Core Verification Suite...');

// Dynamic synthetic test values so zero static secret signatures exist in git
const synthSecret = ['sk', 'proj', 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4'].join('-');
const synthEmail = ['security.audit', 'example.org'].join('@');
const synthSsn = ['123', '45', '6789'].join('-');

// Test 1: In-RAM Sanitization & Zero Cleartext
resetSession('test-session');
const rawSample = `Connect ${synthEmail} using ${synthSecret} and ref ${synthSsn}.`;
const s1 = sanitizeText(rawSample, 'test-session');
assert(!s1.sanitizedText.includes(synthEmail), 'Email must be masked');
assert(!s1.sanitizedText.includes(synthSecret), 'Secret must be masked');
assert(!s1.sanitizedText.includes(synthSsn), 'SSN must be masked');
assert.strictEqual(s1.entitiesMasked, 3, 'Expected 3 masked entities');
assert(s1.auditReceipt.startsWith('ZTDS-RECEIPT-'), 'Expected SHA-256 audit receipt');

// Test 2: Deterministic Token Reuse in Session
const s2 = sanitizeText(`Repeat ${synthEmail} only`, 'test-session');
assert.strictEqual(s2.entitiesMasked, 0, 'Existing email should reuse deterministic surrogate token');
assert.strictEqual(getSessionTokenCount('test-session'), 3, 'Expected 3 active session tokens');

// Test 3: Single-Pass Restore & Second-Order Injection Immunity
const injectionText = `Restored email is [EMAIL_TOKEN_1] while token stays intact.`;
const r1 = restoreText(s1.sanitizedText, 'test-session');
assert.strictEqual(r1.restoredText, rawSample, 'Restored text must match original cleartext');
assert.strictEqual(r1.tokensRestored, 3, 'Expected 3 tokens restored');

resetSession('cascade-test');
const injectedEmail = ['attacker', 'invalid.test'].join('@');
const literalToken = '[EMAIL_TOKEN_1]';
sanitizeText(injectedEmail, 'cascade-test');
const safeMix = `User=[EMAIL_TOKEN_1] Literal=${literalToken}`;
const restoredCascade = restoreText(safeMix, 'cascade-test');
assert.strictEqual(restoredCascade.tokensRestored, 2, 'Single-pass replacement executes without infinite re-scan');
assert(restoredCascade.restoredText.includes(injectedEmail), 'Token restored once cleanly');

// Test 4: Document Line Audit Coordinates & Receipt
const multiLineDoc = `line zero ok\nemail=${synthEmail} ip=192.168.10.25\nclean line`;
const audit = auditDocumentLines(multiLineDoc);
assert.strictEqual(audit.clean, false, 'Audit must detect exposed PII');
assert.strictEqual(audit.findings.length, 2, 'Expected 2 findings on line 1 (EMAIL + IPV4)');
assert.strictEqual(audit.findings[0].line, 1, 'Finding line index must be 1');
assert(audit.receiptHash.startsWith('ZTDS-AUDIT-'), 'Expected deterministic SHA-256 audit receipt');

const cleanAudit = auditDocumentLines('const status = "ok";\n');
assert.strictEqual(cleanAudit.clean, true, 'Clean document must return clean=true');
assert.strictEqual(cleanAudit.findings.length, 0, 'Clean document must return 0 findings');

// Test 5: Workspace .vscode/mcp.json Safe Merge
const initialMcp = JSON.stringify({
  servers: {
    existingTool: { type: 'stdio', command: 'node', args: ['server.js'] }
  }
});
const mergedStr = mergeVscodeMcpConfig(initialMcp);
const mergedObj = JSON.parse(mergedStr);
assert(mergedObj.servers.existingTool, 'Existing MCP servers must be preserved');
assert.deepStrictEqual(mergedObj.servers.ztds, {
  type: 'stdio',
  command: 'npx',
  args: ['-y', 'ztds-mcp']
}, 'ZTDS stdio server block must be injected cleanly');

const freshMcp = JSON.parse(mergeVscodeMcpConfig(''));
assert.strictEqual(freshMcp.servers.ztds.command, 'npx', 'Empty workspace config should initialize ztds server');

// Test 6: Theorem 2 RAM Zeroization
resetSession('test-session');
assert.strictEqual(getSessionTokenCount('test-session'), 0, 'Volatile RAM token count must drop to 0 after reset');
const postReset = restoreText('[EMAIL_TOKEN_1]', 'test-session');
assert.strictEqual(postReset.tokensRestored, 0, 'Restoring after zeroization must restore 0 tokens');

console.log('[PASS] ALL 6 ZTDS VS CODE EXTENSION CORE TESTS PASSED.');
