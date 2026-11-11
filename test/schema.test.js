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
  'ciso/memo/index.html',
  'sdk/index.html',
  'whitepaper/index.html',
  'scanner/index.html',
  'registry/index.html',
  'companies/index.html',
  'fellows/index.html',
  'governance/index.html',
  'badge/index.html',
  'verify/index.html',
  'certification/index.html',
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
  'evidentiary-sovereignty/index.html',
  'mcp/index.html',
  'benchmarks/index.html',
  'blueprints/index.html',
  'compliance/index.html',
  'ietf/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-01/index.html',
  'ietf/draft-sibiryakov-ztds-protocol-02/index.html',
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

// Test 3: BreadcrumbList coverage & WebPage.#breadcrumb linkage on all subpages
console.log('--> Test 3: BreadcrumbList Coverage & WebPage.#breadcrumb Linkage on Subpages');
for (const page of prodPages) {
  if (page === 'index.html') continue;
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let hasBreadcrumb = false;
  let bcId = null;
  let pageBreadcrumbRef = null;
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    if (items.some(e => e['@type'] === 'BreadcrumbList')) {
      hasBreadcrumb = true;
      const bc = items.find(e => e['@type'] === 'BreadcrumbList');
      assert(Array.isArray(bc.itemListElement) && bc.itemListElement.length >= 2, `BreadcrumbList incomplete in ${page}`);
      assert(bc.itemListElement[0].item === 'https://ztds.ai/' || bc.itemListElement[0].item === 'https://ztds.ai', `Home breadcrumb root invalid in ${page}`);
      assert(bc['@id'] && bc['@id'].endsWith('#breadcrumb'), `BreadcrumbList missing @id "#breadcrumb" in ${page}`);
      bcId = bc['@id'];
    }
    const pageNode = items.find(e => {
      const types = Array.isArray(e['@type']) ? e['@type'] : [e['@type']];
      return types.some(t => ['WebPage', 'CollectionPage', 'ProfilePage', 'AboutPage', 'ItemPage', 'ContactPage', 'FAQPage'].includes(t));
    });
    if (pageNode && pageNode.breadcrumb) {
      pageBreadcrumbRef = pageNode.breadcrumb['@id'];
    }
  }
  assert(hasBreadcrumb, `Missing BreadcrumbList in ${page}`);
  if (page !== '404.html') {
    assert(pageBreadcrumbRef === bcId, `WebPage.breadcrumb (@id: ${pageBreadcrumbRef}) does not match BreadcrumbList (@id: ${bcId}) in ${page}`);
  }
}
console.log(`    [PASS] All ${prodPages.length - 1} subpages feature valid Schema.org BreadcrumbList linked to WebPage.#breadcrumb.`);

// Test 4: Article publication date integrity
console.log('--> Test 4: Article Publication & Modification Date Integrity');
const articlePages = ['standard/index.html', 'ciso/index.html', 'ciso/memo.html', 'whitepaper/index.html', 'scanner/index.html', 'sdk/index.html', 'mcp/index.html', 'benchmarks/index.html', 'compliance/index.html'];
for (const page of articlePages) {
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let checked = false;
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    const article = items.find(e => {
      const types = Array.isArray(e['@type']) ? e['@type'] : [e['@type']];
      return types.some(t => ['TechArticle', 'ScholarlyArticle', 'Article'].includes(t));
    });
    if (article) {
      assert(article.datePublished, `datePublished missing in ${page}`);
      assert(article.dateModified, `dateModified missing in ${page}`);
      assert(article.image, `image missing on article in ${page}`);
      assert(article.mainEntityOfPage, `mainEntityOfPage missing on article in ${page}`);
      assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(article.datePublished), `datePublished must be full ISO-8601 timestamp with timezone in ${page}`);
      assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(article.dateModified), `dateModified must be full ISO-8601 timestamp with timezone in ${page}`);
      checked = true;
    }
  }
  assert(checked, `No article entity validated in ${page}`);
}
console.log(`    [PASS] All ${articlePages.length} article pages feature valid ISO-8601 timestamps and mainEntityOfPage.`);

// Test 5: SoftwareApplication & WebApplication Rich Results offers + Universal ISO-8601 Date & WebPage Graph Validation
console.log('--> Test 5: SoftwareApplication Offers & Universal Graph Completeness');
let appEntitiesChecked = 0;
for (const page of prodPages) {
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  const pageTypes = [];
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    for (const node of items) {
      if (node['@type']) {
        pageTypes.push(...(Array.isArray(node['@type']) ? node['@type'] : [node['@type']]));
      }
      for (const dateKey of ['datePublished', 'dateModified', 'uploadDate']) {
        if (node[dateKey]) {
          assert(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(node[dateKey]),
            `${dateKey} on ${node['@type']} in ${page} must include ISO-8601 timezone offset: "${node[dateKey]}"`
          );
        }
      }
      if (['SoftwareApplication', 'WebApplication'].includes(node['@type'])) {
        assert(node.applicationCategory, `Missing applicationCategory on ${node['@type']} in ${page}`);
        assert(node.operatingSystem, `Missing operatingSystem on ${node['@type']} in ${page}`);
        assert(node.offers && node.offers.price === '0' && node.offers.priceCurrency === 'USD', `Missing free Offer on ${node['@type']} in ${page}`);
        appEntitiesChecked++;
      }
      const nodeTypes = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (page !== '404.html' && nodeTypes.some(t => ['WebPage', 'CollectionPage', 'ProfilePage', 'AboutPage', 'FAQPage'].includes(t))) {
        assert(node.isPartOf && node.isPartOf['@id'] === 'https://ztds.ai/#website', `Missing isPartOf #website on ${node['@type']} in ${page}`);
        assert(node.inLanguage === 'en-US', `Missing inLanguage "en-US" on ${node['@type']} in ${page}`);
        assert(node.speakable && node.speakable['@type'] === 'SpeakableSpecification', `Missing SpeakableSpecification on ${node['@type']} in ${page}`);
        assert(
          node.primaryImageOfPage &&
          node.primaryImageOfPage['@type'] === 'ImageObject' &&
          node.primaryImageOfPage.width === 1200 &&
          node.primaryImageOfPage.height === 630,
          `Missing 1200x630 primaryImageOfPage ImageObject on ${node['@type']} in ${page}`
        );
      }
      if (page !== '404.html' && nodeTypes.some(t => ['WebPage', 'CollectionPage', 'ProfilePage', 'AboutPage', 'ContactPage', 'ItemPage'].includes(t))) {
        assert(node.dateModified, `Missing dateModified on ${node['@type']} in ${page}`);
        assert(node.publisher && node.publisher['@id'] === 'https://ztds.ai/#organization', `Missing publisher #organization on ${node['@type']} in ${page}`);
      }
    }
  }
  if (page !== '404.html') {
    assert(
      pageTypes.some(t => ['WebPage', 'CollectionPage', 'ProfilePage', 'AboutPage', 'FAQPage', 'ItemPage', 'ContactPage'].includes(t)),
      `Missing WebPage/CollectionPage/ProfilePage schema entity in ${page}`
    );
  }
}
console.log(`    [PASS] All ${appEntitiesChecked} SoftwareApplication/WebApplication entities and ${prodPages.length} page graphs verified.`);

// Test 6: 100% Visible DOM <-> JSON-LD FAQPage Question Parity & Directory Hub ItemList Parity
console.log('--> Test 6: 100% Visible DOM <-> JSON-LD FAQPage Question Parity & Directory Hub ItemList Parity');
const regRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'registry.json'), 'utf8'));
const compRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'companies.json'), 'utf8'));
const felRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'fellows.json'), 'utf8'));
const regItems = Array.isArray(regRaw) ? regRaw : (regRaw.entities || regRaw.products || regRaw.registry || []);
const compItems = Array.isArray(compRaw) ? compRaw : (compRaw.companies || []);
const felItems = Array.isArray(felRaw) ? felRaw : (felRaw.fellows || []);
const expectedHubItemLists = {
  'registry/index.html': regItems.length,
  'companies/index.html': compItems.length,
  'fellows/index.html': felItems.length,
  'case-studies/index.html': compItems.filter(c => c.case_study || c.case_study_url || c.caseStudy).length
};
let faqQuestionsVerified = 0;
let hubItemListsVerified = 0;
for (const page of prodPages) {
  const fullPath = path.join(__dirname, '..', page);
  const html = fs.readFileSync(fullPath, 'utf8');
  const bodyHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/&amp;/g, '&')
    .replace(/&sect;/g, '§')
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const data = JSON.parse(match[1]);
    const items = data['@graph'] || [data];
    for (const node of items) {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('FAQPage') && Array.isArray(node.mainEntity)) {
        for (const q of node.mainEntity) {
          assert(q.name && bodyHtml.includes(q.name), `FAQPage Question "${q.name}" in ${page} is missing from visible DOM (Google FAQ Rich Results spam risk)`);
          faqQuestionsVerified++;
        }
      }
      if (expectedHubItemLists[page] !== undefined && types.includes('ItemList')) {
        const expectedCount = expectedHubItemLists[page];
        assert(
          node.numberOfItems === expectedCount && Array.isArray(node.itemListElement) && node.itemListElement.length === expectedCount,
          `${page} ItemList must match SSOT data count (${expectedCount}), got numberOfItems=${node.numberOfItems}, length=${node.itemListElement && node.itemListElement.length}`
        );
        hubItemListsVerified++;
      }
    }
  }
}
assert.strictEqual(hubItemListsVerified, 4, `Expected all 4 directory hub ItemLists to be verified, got ${hubItemListsVerified}`);
console.log(`    [PASS] All ${faqQuestionsVerified} FAQPage JSON-LD questions and ${hubItemListsVerified} Directory Hub ItemLists verified against SSOT.`);

// Test 7: Ahrefs Schema.org & Inlink Guard (Zero Orphan/Single-Inlink & AI Discoverability)
console.log('--> Test 7: Schema.org Strict Type Guard, Article AI Discoverability & Sitemap >=2 Inlinks');
{
  const rootDir = path.join(__dirname, '..');
  const sitemapXml = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>https:\/\/ztds\.ai([^<]*)<\/loc>/g)].map(m => m[1]);

  function walkHtml(d) {
    let res = [];
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      if (['.git', 'node_modules', '.vercel', 'public'].includes(f.name)) continue;
      const p = path.join(d, f.name);
      if (f.isDirectory()) res.push(...walkHtml(p));
      else if (f.name.endsWith('.html') && !f.name.startsWith('404')) res.push(p);
    }
    return res;
  }

  const allHtmlFiles = walkHtml(rootDir).filter(
    f => !f.endsWith('memo.html') && !f.endsWith('protocol-01.html') && !f.endsWith('protocol-02.html') && !f.endsWith('order-form.html')
  );

  for (const f of allHtmlFiles) {
    const rel = path.relative(rootDir, f);
    const html = fs.readFileSync(f, 'utf8');
    assert(!html.includes('"@type": "SecurityService"'), `Invalid Schema.org type SecurityService in ${rel}`);
    assert(!html.includes('"billingDuration"'), `Invalid Offer.billingDuration property in ${rel}`);
    assert(!html.includes('"validFrom"'), `Invalid EducationalOccupationalCredential.validFrom property in ${rel}`);
    const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      const data = JSON.parse(m[1]);
      const items = data['@graph'] || [data];
      for (const node of items) {
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
        if (types.includes('TechArticle') || types.includes('ScholarlyArticle')) {
          assert(types.includes('Article'), `TechArticle/ScholarlyArticle in ${rel} must include "Article" in @type array for AI Discoverability`);
        }
      }
    }
  }

  for (const u of sitemapUrls) {
    let inlinks = 0;
    for (const f of allHtmlFiles) {
      const relUrl = '/' + path.relative(rootDir, f).replace(/index\.html$/, '');
      if (relUrl === u) continue;
      const content = fs.readFileSync(f, 'utf8');
      const re = new RegExp(`href=["'](?:https://ztds\\.ai)?${u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:#[^"']*)?["']`, 'i');
      if (re.test(content)) inlinks++;
    }
    assert(inlinks >= 2, `Sitemap URL ${u} has only ${inlinks} incoming internal links (requires >= 2 to prevent Ahrefs orphan/single-inlink warnings)`);
  }
  console.log(`    [PASS] All ${allHtmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs verified (>= 2 inlinks, 0 invalid Schema.org properties).`);
}

console.log('\n[SUMMARY] ALL 7 SCHEMA & GEO KNOWLEDGE GRAPH TESTS PASSED.\n');
