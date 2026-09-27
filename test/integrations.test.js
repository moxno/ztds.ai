/**
 * ZTDS Reference Integrations Test Suite
 * Validates FastMCP and LiteLLM middleware against RFC v1.0 4 Invariants
 */

'use strict';

const assert = require('assert');
const path = require('path');
const { execSync } = require('child_process');

console.log('[TEST] Starting ZTDS Reference Integrations Verification Suite...\n');

// Test 1: FastMCP Middleware Invariants
console.log('--> Test 1: FastMCP Middleware Invariants');
{
  const testFastMCPPath = path.join(__dirname, '..', 'integrations', 'fastmcp', 'test_fastmcp_middleware.js');
  const output = execSync(`node "${testFastMCPPath}"`, { encoding: 'utf8' });
  assert(output.includes('ALL FASTMCP MIDDLEWARE TESTS PASSED'), 'FastMCP middleware tests must pass');
  console.log('    [PASS] FastMCP middleware verified (Input/Output zero-egress, surrogate reuse, RAM zeroization).');
}

// Test 2: LiteLLM Guardrail Invariants
console.log('--> Test 2: LiteLLM Guardrail Invariants');
{
  const testLiteLLMPath = path.join(__dirname, '..', 'integrations', 'litellm', 'test_ztds_guardrail.py');
  const output = execSync(`python3 -m unittest "${testLiteLLMPath}"`, {
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: path.join(__dirname, '..', 'integrations', 'litellm') }
  });
  console.log('    [PASS] LiteLLM guardrail verified (Pre/Post call hooks, deterministic surrogates, RAM zeroization).');
}

// Test 3: CrewAI Sanitizer Tool Invariants
console.log('--> Test 3: CrewAI Sanitizer Tool Invariants');
{
  const testCrewAIPath = path.join(__dirname, '..', 'integrations', 'crewai', 'test_crewai_ztds.py');
  const output = execSync(`python3 -m unittest "${testCrewAIPath}"`, {
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: path.join(__dirname, '..', 'integrations', 'crewai') }
  });
  console.log('    [PASS] CrewAI tool verified (Task sanitization, response restore, RAM zeroization).');
}

// Test 4: LlamaIndex Postprocessor Invariants
console.log('--> Test 4: LlamaIndex Postprocessor Invariants');
{
  const testLlamaPath = path.join(__dirname, '..', 'integrations', 'llamaindex', 'test_llamaindex_ztds.py');
  const output = execSync(`python3 -m unittest "${testLlamaPath}"`, {
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: path.join(__dirname, '..', 'integrations', 'llamaindex') }
  });
  console.log('    [PASS] LlamaIndex postprocessor verified (Node content sanitization, restore, RAM zeroization).');
}

// Test 5: LangChain Callback Invariants
console.log('--> Test 5: LangChain Callback Invariants');
{
  const testLangChainPath = path.join(__dirname, '..', 'integrations', 'langchain', 'test_langchain_ztds.py');
  const output = execSync(`python3 -m unittest "${testLangChainPath}"`, {
    encoding: 'utf8',
    env: { ...process.env, PYTHONPATH: path.join(__dirname, '..', 'integrations', 'langchain') }
  });
  console.log('    [PASS] LangChain callback verified (on_llm_start, on_llm_end, RAM zeroization).');
}

// Test 6: ZTDS Open Reference MCP Server Invariants
console.log('--> Test 6: ZTDS Open Reference MCP Server Invariants');
{
  const testMCPPath = path.join(__dirname, '..', 'packages', 'ztds-mcp', 'test.js');
  const output = execSync(`node "${testMCPPath}"`, { encoding: 'utf8' });
  assert(output.includes('ALL 8 ZTDS MCP SERVER TESTS PASSED'), 'ZTDS MCP Server tests must pass');
  console.log('    [PASS] ZTDS MCP Server verified (Handshake, 5 tools, Invariants 1-4, RAM zeroization).');
}

console.log('\n[SUMMARY] ALL 6 REFERENCE INTEGRATIONS TESTS PASSED WITH 100% CONFORMANCE.\n');

