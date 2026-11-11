#!/usr/bin/env node
/**
 * ZTDS.ai — Framework Spoke Generator
 *
 * Generates /frameworks/ (hub) and /frameworks/{slug}/ (spokes) from compliance/index.html chrome
 * (header, mobile drawer, canonical footer) so that every page inherits the repository invariants
 * enforced by test/routes-integrity.test.js, test/schema.test.js and test/consortium-neutrality.test.js.
 *
 * Usage: node scripts/generate-framework-pages.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-11-03';
const TS = '2026-11-03T00:00:00Z';
const OG = 'https://ztds.ai/assets/img/og/og-compliance.png';
const OG_ALT = 'ZTDS Framework Mappings for Client-Side AI Data Sanitization | ZTDS.ai';

const { PAGES, HUB } = require('./data/framework-pages.js');

const shell = fs.readFileSync(path.join(ROOT, 'compliance/index.html'), 'utf8');

function slice(startMarker, endMarker, from = 0) {
  const s = shell.indexOf(startMarker, from);
  const e = shell.indexOf(endMarker, s);
  if (s < 0 || e < 0) throw new Error(`Marker not found: ${startMarker} / ${endMarker}`);
  return shell.slice(s, e);
}

const bodyOpen = shell.match(/<body[^>]*>/)[0];
let chrome = slice('<!-- Skip to main content -->', '<main id="main-content"');
chrome = chrome.replace(
  /<!-- Top Institutional Status Bar -->[\s\S]*?<!-- Institutional Top Header -->/,
  `<!-- Top Institutional Status Bar -->
  <div class="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2 px-4">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="font-mono font-semibold text-white">ZTDS FRAMEWORK MAPPINGS v1.0</span>
        <span class="hidden sm:inline text-slate-400">&middot; Defense-in-Depth &amp; Statutory Risk Minimization</span>
      </div>
      <div class="flex items-center gap-4 font-mono text-xs">
        <a href="/frameworks/" class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">All Framework Mappings</a>
        <a href="/compliance/" class="text-slate-300 hover:text-white">Compliance Matrix &rarr;</a>
      </div>
    </div>
  </div>

  <!-- Institutional Top Header -->`
);
chrome = chrome
  .replace('class="block px-3 py-2 rounded-lg text-emerald-700 font-semibold bg-emerald-50/70">Global Regulatory Compliance Matrix</a>',
    'class="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Global Regulatory Compliance Matrix</a>\n      <a href="/frameworks/" class="block px-3 py-2 rounded-lg text-emerald-700 font-semibold bg-emerald-50/70">Framework Mappings (OWASP, NIST, EU AI Act)</a>')
  .replace(/<div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50[\s\S]*?<\/div>\s*<\/div>\s*<!-- Navigation Links/,
    `<div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <span class="pulse-dot"></span>
          <span class="font-mono text-xs font-semibold">FRAMEWORK MAPPINGS</span>
        </div>
      </div>

      <!-- Navigation Links`);

const footerStart = shell.indexOf('<footer class="bg-white border-t border-slate-200');
const footerEnd = shell.indexOf('</footer>', footerStart) + '</footer>'.length;
const footer = shell.slice(footerStart, footerEnd);
const head1 = shell.slice(0, shell.indexOf('<title>'));
const fontsBlock = (() => {
  const s = shell.indexOf('<!-- Fonts & Styles -->');
  const e = shell.indexOf('<!-- JSON-LD', s);
  return shell.slice(s, e);
})();

const esc = (s) => s.replace(/&/g, '&amp;');
const jsonStr = (s) => JSON.stringify(s);

function headBlock({ url, title, desc, keywords, jsonLd }) {
  return `${head1}<title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="Ilya Sibiryakov">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#020617">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon-96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="ZTDS LLM Knowledge Base">
  <link rel="alternate" type="text/plain" href="/llms-full.txt" title="ZTDS Full Normative LLM Compendium">

  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:site_name" content="ZTDS.ai">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${OG}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(OG_ALT)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${OG}">
  <meta name="twitter:image:alt" content="${esc(OG_ALT)}">

  ${fontsBlock}<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
`;
}

const ORG = {
  '@type': 'Organization',
  '@id': 'https://ztds.ai/#organization',
  name: 'ZTDS AI Consortium',
  url: 'https://ztds.ai/',
  logo: { '@type': 'ImageObject', url: 'https://ztds.ai/assets/img/logo-512.png', width: 512, height: 512 },
  founder: {
    '@type': 'Person',
    '@id': 'https://ztds.ai/#ilya-sibiryakov',
    name: 'Ilya Sibiryakov',
    jobTitle: 'Chief Architect & Lead Author',
    url: 'https://www.linkedin.com/in/ilya-sibiryakov/'
  }
};

function pageNode(url, faq) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    })),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    url,
    inLanguage: 'en-US',
    isPartOf: { '@id': 'https://ztds.ai/#website' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'main h2'] },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG, width: 1200, height: 630 },
    dateModified: TS,
    publisher: { '@id': 'https://ztds.ai/#organization' }
  };
}

function breadcrumbNode(url, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ztds.ai/' },
      ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: c.url }))
    ]
  };
}

function articleNode(url, headline, description) {
  return {
    '@type': ['Article', 'TechArticle'],
    '@id': `${url}#article`,
    headline,
    description,
    url,
    datePublished: TS,
    dateModified: TS,
    inLanguage: 'en-US',
    proficiencyLevel: 'Expert',
    author: { '@id': 'https://ztds.ai/#ilya-sibiryakov' },
    publisher: { '@id': 'https://ztds.ai/#organization' },
    isPartOf: { '@id': 'https://ztds.ai/standard/#specification' },
    image: OG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
}

function breadcrumbHtml(items) {
  const lis = items
    .map((it, i) =>
      i === items.length - 1
        ? `<li class="text-emerald-400 font-semibold" aria-current="page">${esc(it.name)}</li>`
        : `<li><a href="${it.url}" class="hover:text-white transition-colors">${esc(it.name)}</a></li><li aria-hidden="true">/</li>`
    )
    .join('\n            ');
  return `<nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
            ${lis}
          </ol>
        </nav>`;
}

function hero({ crumbs, badge, h1, lead }) {
  return `<main id="main-content" class="flex-grow">
    <section class="relative bg-slate-900 text-white py-14 lg:py-20 border-b border-slate-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        ${breadcrumbHtml(crumbs)}
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/70 text-emerald-300 text-xs font-mono mb-4">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            ${esc(badge)}
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">${h1}</h1>
          <p class="text-slate-300 text-base sm:text-lg leading-relaxed">${lead}</p>
        </div>
      </div>
    </section>
`;
}

function section(id, title, inner, alt) {
  return `    <section class="py-12 border-b border-slate-200 ${alt ? 'bg-white' : 'bg-[#f8fafc]'}">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="${id}" class="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 scroll-mt-24">${esc(title)}</h2>
        ${inner}
      </div>
    </section>
`;
}

const P = (t) => `<p class="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">${t}</p>`;

function table(headers, rows) {
  const th = headers.map((h) => `<th scope="col" class="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-slate-600">${esc(h)}</th>`).join('');
  const tr = rows
    .map(
      (r) =>
        `<tr class="border-t border-slate-200">${r
          .map((c, i) =>
            i === 0
              ? `<th scope="row" class="px-4 py-3 text-left text-sm font-semibold text-slate-900 align-top">${c}</th>`
              : `<td class="px-4 py-3 text-sm text-slate-700 align-top">${c}</td>`
          )
          .join('')}</tr>`
    )
    .join('\n          ');
  return `<div class="overflow-x-auto rounded-xl border border-slate-200 bg-white" tabindex="0" role="region" aria-label="Control mapping table">
        <table class="min-w-full">
          <thead class="bg-slate-50"><tr>${th}</tr></thead>
          <tbody>
          ${tr}
          </tbody>
        </table>
      </div>`;
}

const UL = (items) =>
  `<ul class="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed mb-4">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

function faqSection(faq) {
  const items = faq
    .map(
      (f, i) => `<details id="faq-${i + 1}" class="group rounded-xl border border-slate-200 bg-white p-4 mb-3">
          <summary class="cursor-pointer text-sm sm:text-base font-semibold text-slate-900">${esc(f.q)}</summary>
          <p class="mt-3 text-sm text-slate-700 leading-relaxed">${esc(f.a)}</p>
        </details>`
    )
    .join('\n        ');
  return section('frequently-asked-questions', 'Frequently Asked Questions', items, false);
}

function related(links) {
  const items = links
    .map((l) => `<li><a href="${l.url}" class="text-emerald-700 font-semibold hover:text-emerald-800 underline underline-offset-2">${esc(l.name)}</a> &mdash; ${esc(l.note)}</li>`)
    .join('');
  return section(
    'related-resources',
    'Related Specifications and Tools',
    `<ul class="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">${items}</ul>`,
    true
  );
}

const SCOPE_NOTICE = `<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>Scope notice.</strong> This page maps a technical control to a published framework as a Statutory Risk Minimization and Defense-in-Depth measure. It is not legal advice, not a certification by the framework owner, and not a statement that any regulation is fully satisfied. Consult qualified counsel for jurisdiction-specific determinations.
        </div>`;

function writePage(relDir, html) {
  const dir = path.join(ROOT, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

const tail = `
  <script src="/nav.js" defer></script>
</body>
</html>
`;

// ---------- Spokes ----------
for (const pg of PAGES) {
  const url = `https://ztds.ai/frameworks/${pg.slug}/`;
  const crumbs = [
    { name: 'Framework Mappings', url: 'https://ztds.ai/frameworks/' },
    { name: pg.crumb, url }
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [ORG, articleNode(url, pg.headline, pg.desc), breadcrumbNode(url, crumbs), pageNode(url, pg.faq)]
  };
  const siblings = PAGES.filter((p) => p.slug !== pg.slug)
    .map((p) => ({ name: p.crumb, url: `/frameworks/${p.slug}/`, note: p.blurb }));
  const relatedLinks = [
    ...pg.related,
    { name: 'Framework Mappings Hub', url: '/frameworks/', note: 'All framework mappings in one index.' },
    ...siblings
  ];

  const body =
    hero({
      crumbs: [
        { name: 'ZTDS.ai', url: '/' },
        { name: 'Framework Mappings', url: '/frameworks/' },
        { name: pg.crumb, url: '' }
      ],
      badge: pg.badge,
      h1: pg.h1,
      lead: pg.lead
    }) +
    section('summary', 'Summary', pg.summary.map(P).join('\n        ') + '\n        ' + SCOPE_NOTICE, true) +
    section('control-mapping', pg.mapTitle, table(pg.mapHeaders, pg.mapRows), false) +
    section('how-ztds-applies', 'How ZTDS Applies', pg.apply.map((x) => (Array.isArray(x) ? UL(x) : P(x))).join('\n        '), true) +
    section('limits', 'What This Control Does Not Cover', UL(pg.limits), false) +
    faqSection(pg.faq) +
    related(relatedLinks) +
    '  </main>\n\n  ' +
    footer;

  const html =
    headBlock({ url, title: pg.title, desc: pg.desc, keywords: pg.keywords, jsonLd }) +
    bodyOpen +
    '\n  ' +
    chrome +
    body +
    tail;
  writePage(`frameworks/${pg.slug}`, html);
}

// ---------- Hub ----------
{
  const url = 'https://ztds.ai/frameworks/';
  const crumbs = [{ name: 'Framework Mappings', url }];
  const itemList = {
    '@type': 'ItemList',
    '@id': `${url}#frameworks`,
    name: 'ZTDS Framework Mappings',
    numberOfItems: PAGES.length,
    itemListElement: PAGES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.crumb,
      url: `https://ztds.ai/frameworks/${p.slug}/`
    }))
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [ORG, articleNode(url, HUB.headline, HUB.desc), itemList, breadcrumbNode(url, crumbs), pageNode(url, HUB.faq)]
  };
  const cards = PAGES.map(
    (p) => `<a href="/frameworks/${p.slug}/" class="block rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-400 hover:shadow-sm transition">
          <div class="text-xs font-mono uppercase tracking-wider text-emerald-700 mb-1">${esc(p.tag)}</div>
          <div class="font-bold text-slate-900 mb-2">${esc(p.crumb)}</div>
          <p class="text-sm text-slate-600 leading-relaxed">${esc(p.blurb)}</p>
        </a>`
  ).join('\n        ');
  const body =
    hero({
      crumbs: [
        { name: 'ZTDS.ai', url: '/' },
        { name: 'Framework Mappings', url: '' }
      ],
      badge: 'FRAMEWORK MAPPINGS · OWASP · NIST · EU AI ACT · GDPR · HIPAA · MCP',
      h1: HUB.h1,
      lead: HUB.lead
    }) +
    section('mappings-index', 'Framework Mappings Index', `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">\n        ${cards}\n      </div>`, true) +
    section('method', 'Mapping Method', HUB.method.map((x) => (Array.isArray(x) ? UL(x) : P(x))).join('\n        ') + '\n        ' + SCOPE_NOTICE, false) +
    faqSection(HUB.faq) +
    related(HUB.related) +
    '  </main>\n\n  ' +
    footer;
  const html =
    headBlock({ url, title: HUB.title, desc: HUB.desc, keywords: HUB.keywords, jsonLd }) +
    bodyOpen +
    '\n  ' +
    chrome +
    body +
    tail;
  writePage('frameworks', html);
}

// ---------- Sitemap ----------
for (const sm of ['sitemap.xml']) {
  const p = path.join(ROOT, sm);
  let xml = fs.readFileSync(p, 'utf8');
  const entries = [
    { u: '/frameworks/', t: HUB.title },
    ...PAGES.map((x) => ({ u: `/frameworks/${x.slug}/`, t: x.title }))
  ];
  for (const { u, t } of entries) {
    if (xml.includes(`<loc>https://ztds.ai${u}</loc>`)) continue;
    const xmlTitle = String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const entry = `  <url>
    <loc>https://ztds.ai${u}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '/frameworks/' ? '0.8' : '0.7'}</priority>
    <image:image>
      <image:loc>${OG}</image:loc>
      <image:title>${xmlTitle}</image:title>
    </image:image>
  </url>
`;
    xml = xml.replace('</urlset>', entry + '</urlset>');
  }
  fs.writeFileSync(p, xml, 'utf8');
}

// ---------- llms.txt ----------
{
  const p = path.join(ROOT, 'llms.txt');
  let txt = fs.readFileSync(p, 'utf8');
  if (!txt.includes('https://ztds.ai/frameworks/')) {
    const lines = [
      `- [ZTDS Framework Mappings Hub](https://ztds.ai/frameworks/): Index of technical-control mappings from ZTDS RFC v1.0 to OWASP LLM02:2025, NIST AI RMF GenAI Profile (AI 600-1), EU AI Act Article 10, GDPR Articles 25/32, HIPAA Safe Harbor, MCP stdio, RAG pipelines, and proxy DLP comparison.`,
      ...PAGES.map((x) => `- [${x.crumb}](https://ztds.ai/frameworks/${x.slug}/): ${x.blurb}`)
    ].join('\n');
    txt = txt.replace(/(- \[Global Regulatory Compliance[^\n]*\n)/, `$1${lines}\n`);
    fs.writeFileSync(p, txt, 'utf8');
  }
}

console.log(`[ZTDS Frameworks] Generated hub + ${PAGES.length} spokes.`);
