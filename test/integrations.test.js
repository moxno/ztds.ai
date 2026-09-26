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

console.log('\n[SUMMARY] ALL REFERENCE INTEGRATIONS TESTS PASSED WITH 100% CONFORMANCE.\n');
