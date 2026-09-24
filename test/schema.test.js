/**
 * ZTDS.ai Schema.org & GEO Knowledge Graph Test Suite
 * Validates JSON-LD schema syntax, BreadcrumbList coverage, SearchAction, and publication dates.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting ZTDS Schema.org & GEO Knowledge Graph Verification Suite...\n');

const prodPages = [
  'index.html',
  'standard/index.html',
  'ciso/index.html',
  'ciso/memo.html',
  'sdk/index.html',
  'whitepaper/index.html',
  'scanner/index.html',
  'registry/index.html',
  'companies/index.html',
  'fellows/index.html',
  'governance/index.html',
  'badge/index.html',
  'apply/index.html',
  'roi/index.html',
  'security/index.html',
  'privacy/index.html',
  'terms/index.html',
  'inspector/index.html',
  'soc2/index.html',
  'deck/index.html',
  'agency/index.html',
  'fellows/ilya-sibiryakov/index.html',
  'fellows/cliford-fanyuy/index.html',
  'companies/brandmeweb/index.html',
  'case-studies/index.html',
  '404.html',
  'docs/legal/order-form.html'
];

let totalChecks = 0;

// Test 1: Validate syntax of all JSON-LD blocks across production pages
console.log('--> Test 1: JSON-LD Syntax & @context Validation');
for (const page of prodPages) {
  const fullPath = path.join(__dirname, '..', page);
  assert(fs.existsSync(fullPath), `Production page missing: ${page}`);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let found = 0;
  while ((match = regex.exec(html)) !== null) {
    found++;
    totalChecks++;
    const parsed = JSON.parse(match[1]);
    assert(parsed['@context'] === 'https://schema.org', `Invalid @context in ${page}`);
  }
  assert(found >= 1, `No JSON-LD found in ${page}`);
}
console.log(`    [PASS] ${totalChecks} JSON-LD blocks parsed successfully with valid @context.`);

// Test 2: SearchAction validation on index.html
console.log('--> Test 2: WebSite SearchAction & Founder Entity in index.html');
{
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const indexSchema = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i.exec(indexHtml)[1]);
  const graph = indexSchema['@graph'];
  
  const website = graph.find(e => e['@type'] === 'WebSite');
  assert(website, 'WebSite entity missing in index.html');
  assert(website.potentialAction, 'potentialAction missing on WebSite');
  assert(website.potentialAction['@type'] === 'SearchAction', 'SearchAction missing');
  assert(website.potentialAction.target.urlTemplate.includes('{search_term_string}'), 'SearchAction URL template invalid');
  
  const person = graph.find(e => e['@type'] === 'Person');
  assert(person && person.name === 'Ilya Sibiryakov', 'Person entity for Ilya Sibiryakov missing');
  assert(person.sameAs.includes('https://www.linkedin.com/in/ilya-sibiryakov/'), 'LinkedIn missing on Person entity');

  const org = graph.find(e => e['@type'] === 'Organization');
  assert(org && org.sameAs.includes('https://github.com/moxno/ztds.ai'), 'GitHub repository missing on Organization sameAs');
  console.log('    [PASS] WebSite SearchAction, Person founder, and Organization entities validated.');
}

// Test 3: BreadcrumbList coverage on all subpages
console.log('--> Test 3: BreadcrumbList Coverage on Subpages');
for (const page of prodPages) {
  if (page === 'index.html') continue;
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let hasBreadcrumb = false;
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    if (items.some(e => e['@type'] === 'BreadcrumbList')) {
      hasBreadcrumb = true;
      const bc = items.find(e => e['@type'] === 'BreadcrumbList');
      assert(Array.isArray(bc.itemListElement) && bc.itemListElement.length >= 2, `BreadcrumbList incomplete in ${page}`);
      assert(bc.itemListElement[0].item === 'https://ztds.ai/' || bc.itemListElement[0].item === 'https://ztds.ai', `Home breadcrumb root invalid in ${page}`);
    }
  }
  assert(hasBreadcrumb, `Missing BreadcrumbList in ${page}`);
}
console.log(`    [PASS] All ${prodPages.length - 1} subpages feature valid Schema.org BreadcrumbList.`);

// Test 4: Article publication date integrity
console.log('--> Test 4: Article Publication & Modification Date Integrity');
const articlePages = ['standard/index.html', 'ciso/index.html', 'ciso/memo.html', 'whitepaper/index.html', 'scanner/index.html'];
for (const page of articlePages) {
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let checked = false;
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    const article = items.find(e => ['TechArticle', 'ScholarlyArticle'].includes(e['@type']));
    if (article) {
      assert(article.datePublished, `datePublished missing in ${page}`);
      assert(article.dateModified, `dateModified missing in ${page}`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished), `datePublished format invalid in ${page}`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified), `dateModified format invalid in ${page}`);
      checked = true;
    }
  }
  assert(checked, `No article entity validated in ${page}`);
}
console.log(`    [PASS] All ${articlePages.length} article pages feature valid publication and modification timestamps.`);

console.log('\n[SUMMARY] ALL 4 SCHEMA & GEO KNOWLEDGE GRAPH TESTS PASSED.\n');
