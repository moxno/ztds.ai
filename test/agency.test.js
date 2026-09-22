/**
 * ZTDS.ai — BrandMeWeb Agency Package & Proposal Generator Test Suite
 * Validates /agency/ landing page, Schema.org entities, pricing tiers,
 * Proposal & SOW workbench, and scanner/companies cross-link integration.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n[TEST] Starting BrandMeWeb Agency Package Verification Suite...\n');

const agencyHtmlPath = path.join(__dirname, '../agency/index.html');
const indexHtmlPath = path.join(__dirname, '../index.html');
const scannerHtmlPath = path.join(__dirname, '../scanner/index.html');
const companiesHtmlPath = path.join(__dirname, '../companies/index.html');
const sitemapPath = path.join(__dirname, '../sitemap.xml');
const llmsPath = path.join(__dirname, '../llms.txt');

// Test 1: /agency/index.html file existence and HTML5 integrity
console.log('--> Test 1: /agency/index.html HTML5 Structure & Meta Tags');
assert(fs.existsSync(agencyHtmlPath), 'agency/index.html must exist');
const agencyHtml = fs.readFileSync(agencyHtmlPath, 'utf8');

assert(agencyHtml.includes('<!DOCTYPE html>'), 'agency/index.html must contain HTML5 DOCTYPE');
assert(agencyHtml.includes('<title>AI Safety &amp; GEO Audit Retainer — BrandMeWeb Enterprise Snapshot | ZTDS.ai</title>'), 'Title must declare BrandMeWeb Enterprise Snapshot');
assert(agencyHtml.includes('rel="canonical" href="https://ztds.ai/agency/"'), 'Canonical link must point to https://ztds.ai/agency/');
assert(agencyHtml.includes('name="description"'), 'Meta description must be present');
console.log('    [PASS] HTML5 structure, title, canonical, and meta tags validated.');

// Test 2: Schema.org @graph Validation (Service, Organization, FAQPage, BreadcrumbList)
console.log('--> Test 2: Schema.org @graph Structured Data Validation');
const jsonLdMatch = agencyHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch, 'agency/index.html must contain JSON-LD structured data block');
const jsonLd = JSON.parse(jsonLdMatch[1]);
assert(jsonLd['@context'] === 'https://schema.org', '@context must be https://schema.org');
assert(Array.isArray(jsonLd['@graph']), '@graph must be an array');

const types = jsonLd['@graph'].map(item => item['@type']);
assert(types.includes('Service'), 'Schema must declare Service entity');
assert(types.includes('BreadcrumbList'), 'Schema must declare BreadcrumbList');
assert(types.includes('FAQPage'), 'Schema must declare FAQPage');

const serviceEntity = jsonLd['@graph'].find(item => item['@type'] === 'Service');
assert.strictEqual(serviceEntity.name, 'BrandMeWeb Enterprise AI Safety & GEO Audit Package');
assert.strictEqual(serviceEntity.provider.name, 'BrandMeWeb');
assert.strictEqual(serviceEntity.provider.founder.name, 'Ilya Sibiryakov');
assert(Array.isArray(serviceEntity.offers) && serviceEntity.offers.length === 2, 'Service must include 2 commercial offers');
assert.strictEqual(serviceEntity.offers[0].price, '2500.00');
assert.strictEqual(serviceEntity.offers[1].price, '500.00');
console.log('    [PASS] Service, Provider (BrandMeWeb), Founder, Offers, BreadcrumbList, and FAQPage validated.');

// Test 3: Commercial Pricing & 4 Core Deliverables
console.log('--> Test 3: Commercial Pricing ($2,500 / $500/mo) & Deliverables');
assert(agencyHtml.includes('$2,500'), 'Page must display $2,500 setup audit price');
assert(agencyHtml.includes('$500'), 'Page must display $500/mo retainer price');
assert(agencyHtml.includes('Initial Snapshot Audit'), 'Page must display Initial Snapshot Audit title');
assert(agencyHtml.includes('Ongoing Governance &amp; GEO') || agencyHtml.includes('Ongoing Governance'), 'Page must display Ongoing Governance title');

// Verify 4 Deliverables
assert(agencyHtml.includes('Zero-Egress Code &amp; Network Scan Report') || agencyHtml.includes('Technical Audit Report'), 'Must include Technical Audit Report deliverable');
assert(agencyHtml.includes('CISO DPA Exemption Legal Memorandum') || agencyHtml.includes('CISO Procurement &amp; Legal Pack'), 'Must include CISO memo deliverable');
assert(agencyHtml.includes('llms.txt'), 'Must include llms.txt deliverable');
assert(agencyHtml.includes('badge.svg') || agencyHtml.includes('Verification Badge'), 'Must include Trust Badge deliverable');
console.log('    [PASS] Two-phase commercial matrix and 4 turn-key deliverables verified.');

// Test 4: Proposal & SOW Workbench DOM Elements
console.log('--> Test 4: Interactive Proposal & SOW Workbench DOM Elements');
const requiredIds = [
  'inputDomain',
  'inputCompanyName',
  'selectIndustry',
  'inputEmail',
  'btnRecalculateProposal',
  'btnSubmitAgencyLead',
  'leadFeedbackBox',
  'tabBtnProposal',
  'tabBtnLlms',
  'tabBtnMemo',
  'tabContentProposal',
  'tabContentLlms',
  'tabContentMemo',
  'proposalRendered',
  'llmsRendered',
  'btnCopyProposal',
  'btnPrintProposal',
  'btnCopyLlms',
  'linkOpenCisoMemo'
];

for (const id of requiredIds) {
  assert(agencyHtml.includes(`id="${id}"`), `DOM element #${id} must be present in agency/index.html`);
}
assert(agencyHtml.includes('/api/lead-capture/'), 'Workbench must submit lead to /api/lead-capture/');
console.log('    [PASS] All 19 Proposal & SOW Workbench DOM IDs and lead dispatch verified.');

// Test 5: Scanner & Homepage Cross-Link Integration
console.log('--> Test 5: Scanner Cross-Link & Parameter Routing Integration');
const scannerHtml = fs.readFileSync(scannerHtmlPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

assert(scannerHtml.includes('id="m0AgencyPackageLink"'), 'scanner/index.html must include #m0AgencyPackageLink');
assert(scannerHtml.includes('/agency/?domain='), 'scanner/index.html link must route to /agency/?domain=');

assert(indexHtml.includes('id="heroAgencyPackageLink"'), 'index.html must include #heroAgencyPackageLink');
assert(indexHtml.includes('/agency/?domain='), 'index.html link must route to /agency/?domain=');
console.log('    [PASS] Scanner and homepage banner bridges confirmed with parameter routing.');

// Test 6: Companies Catalog & Sitemap & Knowledge Corpus Coverage
console.log('--> Test 6: Companies Catalog, Sitemap & GEO Corpus Coverage');
const companiesHtml = fs.readFileSync(companiesHtmlPath, 'utf8');
assert(companiesHtml.includes('href="/agency/"'), 'companies/index.html BrandMeWeb card must link to /agency/');

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemap.includes('https://ztds.ai/agency/'), 'sitemap.xml must include https://ztds.ai/agency/');

const llmsTxt = fs.readFileSync(llmsPath, 'utf8');
assert(llmsTxt.includes('https://ztds.ai/agency/'), 'llms.txt must reference https://ztds.ai/agency/');
assert(llmsTxt.includes('BrandMeWeb Enterprise AI Safety & GEO Retainer'), 'llms.txt must name the BrandMeWeb retainer');
console.log('    [PASS] Catalog, sitemap, and GEO corpus coverage verified.');

console.log('\n[SUMMARY] ALL 6 AGENCY PACKAGE & PROPOSAL SUITE TESTS PASSED WITH 100% CONFORMANCE.\n');
