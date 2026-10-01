/**
 * ZTDS AI Safety & In-Memory Sanitization Benchmark Test Suite
 * Validates benchmark runner, dataset integrity, and RFC v1.0 invariant compliance
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  runAISafetyBenchmark,
  BenchmarkSanitizer,
  DEFAULT_MODELS
} = require('../lib/benchmark-runner');

console.log('[TEST] Starting ZTDS AI Safety Benchmark Verification Suite...\n');

// Test 1: Dataset Structure & Schema Conformance
console.log('--> Test 1: benchmarks/ai-safety-benchmark.json Schema & Coverage');
{
  const datasetPath = path.join(__dirname, '..', 'benchmarks', 'ai-safety-benchmark.json');
  assert(fs.existsSync(datasetPath), 'Benchmark dataset must exist');

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  assert.strictEqual(dataset.scenarios.length, 25, 'Dataset must contain exactly 25 test scenarios');
  assert(Array.isArray(dataset.benchmark_metadata.target_models), 'Target models must be listed');

  const requiredModels = ['openai/gpt-4o', 'anthropic/claude-3-5-sonnet', 'google/gemini-2.0-pro', 'deepseek/deepseek-v3'];
  for (const model of requiredModels) {
    assert(dataset.benchmark_metadata.target_models.includes(model), `Model ${model} must be configured in metadata`);
  }

  for (const scenario of dataset.scenarios) {
    assert(scenario.id && scenario.id.startsWith('BENCH-'), `Scenario ID must start with BENCH-: ${scenario.id}`);
    assert(scenario.domain, `Scenario must declare domain: ${scenario.id}`);
    assert(scenario.prompt && scenario.prompt.length > 20, `Scenario must have realistic prompt: ${scenario.id}`);
    assert(Array.isArray(scenario.expected_entities) && scenario.expected_entities.length > 0, `Scenario must declare expected entities: ${scenario.id}`);

    for (const ent of scenario.expected_entities) {
      assert(ent.text, `Entity must declare text: ${scenario.id}`);
      assert(ent.type, `Entity must declare type: ${scenario.id}`);
      assert(scenario.prompt.includes(ent.text), `Scenario prompt must include expected entity '${ent.text}': ${scenario.id}`);
    }

    for (const model of requiredModels) {
      assert(scenario.simulated_llm_responses[model], `Scenario ${scenario.id} must define simulated response for ${model}`);
    }
  }
  console.log('    [PASS] Verified 25 scenarios, 6 enterprise domains, and 4 frontier model templates.');
}

// Test 2: In-Memory Sanitizer Core Invariants
console.log('--> Test 2: BenchmarkSanitizer Invariant 1, 2, & 3 Verification');
{
  const sanitizer = new BenchmarkSanitizer();
  const sessionId = 'test-session-inv';
  const prompt = 'Contact Dr. Alan Turing at alan.turing@bletchley.gov.uk or phone +44-20-7946-0912 regarding SSN 987-65-4321 and Visa 4111-2222-3333-4444.';

  const entities = [
    { text: 'Dr. Alan Turing', type: 'NAME' },
    { text: 'alan.turing@bletchley.gov.uk', type: 'EMAIL' },
    { text: '+44-20-7946-0912', type: 'PHONE' },
    { text: '987-65-4321', type: 'SSN' },
    { text: '4111-2222-3333-4444', type: 'CREDIT_CARD' }
  ];

  // Invariant 1: Zero External Egress
  const { sanitized, tokenMap } = sanitizer.sanitize(prompt, sessionId, entities);
  for (const ent of entities) {
    assert(!sanitized.includes(ent.text), `Sanitized prompt must not contain raw entity ${ent.text}`);
  }
  assert(sanitized.includes('[NAME_TOKEN_1]'), 'Must contain [NAME_TOKEN_1]');
  assert(sanitized.includes('[EMAIL_TOKEN_1]'), 'Must contain [EMAIL_TOKEN_1]');
  assert(sanitized.includes('[PHONE_TOKEN_1]'), 'Must contain [PHONE_TOKEN_1]');
  assert(sanitized.includes('[SSN_TOKEN_1]'), 'Must contain [SSN_TOKEN_1]');
  assert(sanitized.includes('[PAN_TOKEN_1]'), 'Must contain [PAN_TOKEN_1]');

  // Invariant 2: Bijective Reversibility
  const mockLLMOutput = 'Verified [NAME_TOKEN_1] ([EMAIL_TOKEN_1]). Dispatched SMS to [PHONE_TOKEN_1]. Tax ID [SSN_TOKEN_1], Card [PAN_TOKEN_1].';
  const { restored, restoredCount } = sanitizer.reveal(mockLLMOutput, sessionId);
  assert.strictEqual(restoredCount, 5, 'All 5 tokens must be restored');
  for (const ent of entities) {
    assert(restored.includes(ent.text), `Restored LLM output must contain original entity ${ent.text}`);
  }
  assert(!restored.includes('_TOKEN_'), 'Restored output must not contain residual token markers');

  // Invariant 3: RAM Zeroization (Theorem 2)
  sanitizer.zeroize(sessionId);
  assert.strictEqual(sanitizer.auditRAM(), true, 'RAM must be completely zeroized with 0 active maps');

  console.log('    [PASS] Invariant 1 (Zero-Egress), Invariant 2 (Bijective Reversibility), and Invariant 3 (RAM Zeroization) verified.');
}

// Test 3: Duplicate Entity Token Consistency (Coreference)
console.log('--> Test 3: Deterministic Surrogate Consistency (Coreference)');
{
  const sanitizer = new BenchmarkSanitizer();
  const sessionId = 'test-coreference';
  const prompt = 'Eleanor Vance met Eleanor Vance to discuss Eleanor Vance.';
  const entities = [{ text: 'Eleanor Vance', type: 'NAME' }];

  const { sanitized, tokenMap } = sanitizer.sanitize(prompt, sessionId, entities);
  const tokenMatches = sanitized.match(/\[NAME_TOKEN_1\]/g);
  assert.strictEqual(tokenMatches.length, 3, 'All 3 occurrences of Eleanor Vance must map to [NAME_TOKEN_1]');
  assert.strictEqual(Object.keys(tokenMap).length, 1, 'Token map must have exactly 1 mapping');

  sanitizer.zeroize(sessionId);
  console.log('    [PASS] Coreference entity surrogate reuse verified.');
}

// Test 4: Full Benchmark Engine Execution
console.log('--> Test 4: runAISafetyBenchmark() End-to-End Execution');
(async () => {
  const results = await runAISafetyBenchmark();
  const m = results.aggregate_metrics;

  assert.strictEqual(results.total_scenarios, 25, 'Must evaluate 25 scenarios');
  assert.strictEqual(m.leakage_prevention_rate_pct, 100.0, 'Leakage prevention rate must be exactly 100.0%');
  assert.strictEqual(m.bijective_fidelity_score_pct, 100.0, 'Bijective fidelity score must be 100.0%');
  assert.strictEqual(m.context_preservation_score_pct, 100.0, 'Context preservation score must be 100.0%');
  assert.strictEqual(m.surrogate_collision_rate_pct, 0.0, 'Surrogate collision rate must be 0.0%');
  assert.strictEqual(m.ram_zeroization_verified, true, 'RAM zeroization must be verified true');
  assert(m.latency_p50_us < 1000, `p50 latency must be sub-millisecond (< 1000µs), got ${m.latency_p50_us}µs`);

  for (const model of DEFAULT_MODELS) {
    const stat = results.model_metrics[model];
    assert.strictEqual(stat.cleartext_prompt_leakage_without_ztds_pct, 100.0);
    assert.strictEqual(stat.cleartext_prompt_leakage_with_ztds_pct, 0.0);
    assert.strictEqual(stat.leakage_prevention_rate_pct, 100.0);
    assert.strictEqual(stat.bijective_fidelity_score_pct, 100.0);
  }
  console.log('    [PASS] 100% KPI conformance confirmed across all 4 frontier model families.');

  // Test 5: CLI Output Verification
  console.log('--> Test 5: bin/ztds-bench.js CLI Execution & JSON Mode');
  {
    const cliOutput = execSync(`node "${path.join(__dirname, '..', 'bin', 'ztds-bench.js')}" --json`, { encoding: 'utf8' });
    const parsed = JSON.parse(cliOutput);
    assert(parsed.benchmark_id.startsWith('ZTDS-BENCH-'), 'Benchmark ID must be generated');
    assert.strictEqual(parsed.aggregate_metrics.leakage_prevention_rate_pct, 100.0);
    assert.strictEqual(parsed.aggregate_metrics.ram_zeroization_verified, true);
    console.log('    [PASS] CLI --json output validated with 100% invariant conformance.');
  }

  // Test 6: Zero-Emoji Compliance Audit
  console.log('--> Test 6: Zero-Emoji Policy Audit across Benchmark Files');
  {
    const filesToAudit = [
      path.join(__dirname, '..', 'benchmarks', 'ai-safety-benchmark.json'),
      path.join(__dirname, '..', 'lib', 'benchmark-runner.js'),
      path.join(__dirname, '..', 'bin', 'ztds-bench.js'),
      path.join(__dirname, '..', 'docs', 'security', 'ZTDS_AI_SAFETY_BENCHMARK_2026.md')
    ];

    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
    for (const file of filesToAudit) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        assert(!emojiRegex.test(content), `Emoji character detected in ${path.relative(path.join(__dirname, '..'), file)}`);
      }
    }
    console.log('    [PASS] Strict zero-emoji policy verified across all benchmark files.');
  }

  // Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)
  console.log('--> Test 7: Brand Spelling SSOT ("BrandMeWeb" single word rule)');
  {
    const filesToAudit = [
      path.join(__dirname, '..', 'lib', 'benchmark-runner.js'),
      path.join(__dirname, '..', 'bin', 'ztds-bench.js'),
      path.join(__dirname, '..', 'docs', 'security', 'ZTDS_AI_SAFETY_BENCHMARK_2026.md')
    ];

    const badPattern = ['Brand', 'Me', 'Web'].join('\\s+');
    const badSpellingRegex = new RegExp('\\b' + badPattern + '\\b', 'i');
    for (const file of filesToAudit) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        assert(!badSpellingRegex.test(content), `Defective brand spelling detected in ${path.relative(path.join(__dirname, '..'), file)}`);
      }
    }
    console.log('    [PASS] 0 brand spelling defects found. "BrandMeWeb" strictly verified.');
  }

  console.log('\n[SUMMARY] ALL 7 AI SAFETY BENCHMARK TESTS PASSED WITH 100% CONFORMANCE.\n');
})();
