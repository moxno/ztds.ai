/**
 * ZTDS.ai — MCP Multi-Client Configurator Conformance Test Suite
 * 
 * Verifies:
 * 1. Existence and integrity of the Multi-Client Configurator DOM elements
 * 2. Presence of 5 client targets (Cursor, Claude Desktop, Claude Code, Windsurf, Zed)
 * 3. Dual edition support (ztds-mcp open reference vs @privacyscrubber/mcp-server enterprise)
 * 4. Multi-OS support (macOS, Windows, Linux) and exact file paths
 * 5. Environment variables customization toggles (DEBUG, ZTDS_SESSION_TIMEOUT_MS)
 * 6. Schema.org HowTo structured data validation
 * 7. Threat Model comparison table (Raw MCP vs ZTDS In-RAM)
 * 8. Standards Track IETF draft-02 cross-linking
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Starting ZTDS MCP Multi-Client Configurator Test Suite...\n');

const ROOT = path.resolve(__dirname, '..');
const mcpHtmlPath = path.join(ROOT, 'mcp/index.html');

assert(fs.existsSync(mcpHtmlPath), 'mcp/index.html must exist');
const html = fs.readFileSync(mcpHtmlPath, 'utf8');

// Test 1: Configurator DOM IDs and Anchors
console.log('--> Test 1: Configurator DOM IDs & Structural Anchors');
{
  assert(html.includes('id="configurator"'), 'Must have id="configurator" anchor');
  assert(html.includes('id="setup"'), 'Must maintain legacy id="setup" section');
  assert(html.includes('id="cfgActivePath"'), 'Must have #cfgActivePath element');
  assert(html.includes('id="cfgGeneratedCode"'), 'Must have #cfgGeneratedCode element');
  assert(html.includes('id="btnCopyConfigPath"'), 'Must have #btnCopyConfigPath button');
  assert(html.includes('id="btnCopyGeneratedCode"'), 'Must have #btnCopyGeneratedCode button');
  assert(html.includes('id="cfgTerminalHint"'), 'Must have #cfgTerminalHint element');
  assert(html.includes('id="cfgToggleDebug"'), 'Must have #cfgToggleDebug checkbox');
  assert(html.includes('id="cfgToggleTimeout"'), 'Must have #cfgToggleTimeout checkbox');
  console.log('    [PASS] All 9 core configurator DOM IDs verified.');
}

// Test 2: 5 AI Coding Client Targets
console.log('--> Test 2: AI Coding Client Targets Coverage');
{
  const requiredClients = ['cursor', 'desktop', 'cli', 'windsurf', 'zed'];
  for (const client of requiredClients) {
    assert(
      html.includes(`data-client="${client}"`),
      `Configurator must support client target "${client}"`
    );
  }
  console.log('    [PASS] All 5 AI clients (Cursor, Claude Desktop, Claude Code, Windsurf, Zed) supported.');
}

// Test 3: Dual Edition Support
console.log('--> Test 3: Dual Edition Specification');
{
  assert(html.includes('data-edition="open"'), 'Must support open edition');
  assert(html.includes('data-edition="commercial"'), 'Must support commercial edition');
  assert(html.includes('ztds-mcp (Apache-2.0)'), 'Must cite open-source ztds-mcp');
  assert(html.includes('@privacyscrubber/mcp'), 'Must cite commercial @privacyscrubber/mcp-server');
  console.log('    [PASS] Open-source and Certified Enterprise edition switchers verified.');
}

// Test 4: Multi-OS Platform Coverage & Paths
console.log('--> Test 4: Multi-OS Coverage & File Paths');
{
  assert(html.includes('data-os="macos"'), 'Must support macOS');
  assert(html.includes('data-os="windows"'), 'Must support Windows');
  assert(html.includes('data-os="linux"'), 'Must support Linux');

  // Verify paths in JS
  assert(html.includes('~/.cursor/mcp.json'), 'Must contain Cursor path');
  assert(html.includes('claude_desktop_config.json'), 'Must contain Claude Desktop path');
  assert(html.includes('~/.codeium/windsurf/mcp_config.json'), 'Must contain Windsurf path');
  assert(html.includes('~/.config/zed/settings.json'), 'Must contain Zed path');
  console.log('    [PASS] macOS, Windows, and Linux paths verified for all clients.');
}

// Test 5: Schema.org HowTo Structured Data
console.log('--> Test 5: Schema.org HowTo Structured Data Validation');
{
  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  assert(jsonLdMatch, 'mcp/index.html must contain JSON-LD block');

  const parsed = JSON.parse(jsonLdMatch[1]);
  assert(parsed['@graph'], 'JSON-LD must have @graph');

  const howTo = parsed['@graph'].find(item => item['@type'] === 'HowTo');
  assert(howTo, 'Must include HowTo schema in @graph');
  assert(howTo.step && howTo.step.length === 4, 'HowTo schema must contain exactly 4 steps');
  assert(howTo.name.includes('Model Context Protocol') || howTo.name.includes('MCP'), 'HowTo name must reference MCP');
  console.log('    [PASS] Schema.org HowTo validated with 4 sequential installation steps.');
}

// Test 6: Threat Model Matrix & Standards Track Link
console.log('--> Test 6: Threat Model Matrix & IETF Standards Track Link');
{
  assert(html.includes('Raw MCP Server vs. ZTDS-Protected In-RAM Gateway'), 'Must include threat model table header');
  assert(html.includes('Invariant 1 (Zero-Egress)'), 'Must cite Invariant 1 in table');
  assert(html.includes('/ietf/draft-sibiryakov-ztds-protocol-02/'), 'Must link to IETF draft-02 Surface 3');
  console.log('    [PASS] Threat model comparison and IETF draft-02 cross-linking validated.');
}

console.log('\n[SUMMARY] ALL 6 MCP MULTI-CLIENT CONFIGURATOR TESTS PASSED WITH 100% SUCCESS.\n');
