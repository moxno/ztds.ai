/**
 * ZTDS.ai Registry & Ecosystem JSON Schema Verification Suite
 * Validates data/registry.json, data/companies.json, and data/fellows.json against RFC v1.0 specifications.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Registry & Ecosystem Schema Verification Suite...\n');

const dataDir = path.join(__dirname, '..', 'data');

// Test 1: Registry Manifest (data/registry.json)
console.log('--> Test 1: data/registry.json Conformance');
const registryRaw = fs.readFileSync(path.join(dataDir, 'registry.json'), 'utf8');
const registry = JSON.parse(registryRaw);

assert.strictEqual(registry.$schema, 'https://ztds.ai/schemas/registry-v1.json');
assert(Array.isArray(registry.entities), 'entities must be an array');
assert(registry.entities.length >= 8, `Expected at least 8 certified entities, got ${registry.entities.length}`);

const sha256Regex = /^sha256:[a-f0-9]{64}$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const slugRegex = /^[a-z0-9-]+$/;

const registryIds = new Set();
for (const item of registry.entities) {
  assert(item.id && slugRegex.test(item.id), `Invalid or non-slug entity id: ${item.id}`);
  assert(!registryIds.has(item.id), `Duplicate entity id in registry: ${item.id}`);
  registryIds.add(item.id);

  assert(item.name && item.name.length > 2, `Missing or invalid name for ${item.id}`);
  assert(item.url && item.url.startsWith('http'), `Invalid url for ${item.id}`);
  assert(item.category && item.tier, `Missing category or tier for ${item.id}`);
  assert(item.license, `Missing license for ${item.id}`);
  assert(item.description && item.description.length > 10, `Missing description for ${item.id}`);
  assert(item.architecture, `Missing architecture specification for ${item.id}`);
  assert(isoDateRegex.test(item.verified_date), `Invalid verified_date format for ${item.id}: ${item.verified_date}`);
  const isValidHash = sha256Regex.test(item.verified_hash) || item.verified_hash.startsWith('pending-');
  assert(isValidHash, `Invalid verified_hash (must be sha256:64hex or pending-*) for ${item.id}: ${item.verified_hash}`);
  assert(Array.isArray(item.frameworks) && item.frameworks.length > 0, `Missing frameworks array for ${item.id}`);
}
console.log(`    [PASS] Verified ${registry.entities.length} certified entities in registry.json.`);

// Test 2: Corporate Members (data/companies.json)
console.log('--> Test 2: data/companies.json Conformance');
const companiesRaw = fs.readFileSync(path.join(dataDir, 'companies.json'), 'utf8');
const companies = JSON.parse(companiesRaw);

assert.strictEqual(companies.$schema, 'https://ztds.ai/schemas/companies-v1.json');
assert(Array.isArray(companies.companies), 'companies must be an array');
assert(companies.companies.length >= 3, 'Expected corporate adopters');

const companyIds = new Set();
for (const comp of companies.companies) {
  assert(comp.id && slugRegex.test(comp.id), `Invalid company id: ${comp.id}`);
  assert(!companyIds.has(comp.id), `Duplicate company id: ${comp.id}`);
  companyIds.add(comp.id);

  assert(comp.name, `Missing company name for ${comp.id}`);
  assert(comp.tier, `Missing tier for ${comp.id}`);
  assert(comp.industry, `Missing industry for ${comp.id}`);
  assert(comp.url && comp.url.startsWith('http'), `Invalid url for ${comp.id}`);
  assert(comp.headquarters, `Missing headquarters for ${comp.id}`);
  assert(comp.description, `Missing description for ${comp.id}`);
  assert(isoDateRegex.test(comp.verified_date), `Invalid verified_date for ${comp.id}`);
  assert(comp.compliance_scope, `Missing compliance_scope for ${comp.id}`);

  if (comp.case_study) {
    assert(comp.case_study.headline, `Case study missing headline in ${comp.id}`);
    assert(comp.case_study.challenge, `Case study missing challenge in ${comp.id}`);
    assert(comp.case_study.metrics, `Case study missing metrics in ${comp.id}`);
  }
}
console.log(`    [PASS] Verified ${companies.companies.length} corporate adopters in companies.json.`);

// Test 3: Research Fellows (data/fellows.json)
console.log('--> Test 3: data/fellows.json Conformance');
const fellowsRaw = fs.readFileSync(path.join(dataDir, 'fellows.json'), 'utf8');
const fellows = JSON.parse(fellowsRaw);

assert.strictEqual(fellows.$schema, 'https://ztds.ai/schemas/fellows-v1.json');
assert(Array.isArray(fellows.fellows), 'fellows must be an array');
assert(fellows.fellows.length >= 3, 'Expected fellows and working groups');

const fellowIds = new Set();
for (const f of fellows.fellows) {
  assert(f.id && slugRegex.test(f.id), `Invalid fellow id: ${f.id}`);
  assert(!fellowIds.has(f.id), `Duplicate fellow id: ${f.id}`);
  fellowIds.add(f.id);

  assert(f.name, `Missing name for ${f.id}`);
  assert(f.role, `Missing role for ${f.id}`);
  assert(f.status, `Missing status for ${f.id}`);
  assert(f.track, `Missing track for ${f.id}`);
  assert(f.affiliation, `Missing affiliation for ${f.id}`);
  assert(f.contribution && f.contribution.length > 15, `Missing or brief contribution for ${f.id}`);
  assert(isoDateRegex.test(f.verified_date), `Invalid verified_date for ${f.id}`);
}
console.log(`    [PASS] Verified ${fellows.fellows.length} research fellows and working group chairs.`);

console.log('\n[SUMMARY] ALL 3 REGISTRY & ECOSYSTEM SCHEMA TESTS PASSED.');
