#!/usr/bin/env node
'use strict';

/**
 * Generates:
 *   - /incidents/index.html
 *   - /incidents/{slug}/index.html
 *   - /docs/ZTDS_Incident_Counterfactual_Compendium.md
 * Synchronizes idempotently:
 *   - /sitemap.xml
 *   - /llms.txt
 *   - /nav.js (SITE_INDEX AUTO-INCIDENTS block)
 *   - #ztds-ai-citation-bar on generated incident pages
 *   - Live Python reference replay verification against packages/ztds/src
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadIncidentData } = require('./data/incident-pages');
const { buildPromptForPage, buildCitationBarHtml, cleanTitle } = require('./sync-citation-bar');

const ROOT = path.resolve(__dirname, '..');
const HUB_OG_URL = 'https://ztds.ai/assets/img/og/og-incidents.png';

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escJsSingle(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function getPageOgImage(page, isHub) {
  if (isHub) return page.ogImage || HUB_OG_URL;
  return page.ogImage || HUB_OG_URL;
}

function loadChrome(badgeText) {
  const src = fs.readFileSync(path.join(ROOT, 'compliance', 'index.html'), 'utf8');
  const skipIdx = src.indexOf('<!-- Skip to main content -->');
  const mainIdx = src.indexOf('<main id="main-content"');
  const footerStart = src.indexOf('<footer class="bg-white border-t border-slate-200');
  const footerEnd = src.indexOf('</footer>', footerStart) + '</footer>'.length;

  if (skipIdx === -1 || mainIdx === -1 || footerStart === -1 || footerEnd === -1) {
    throw new Error('Failed to slice shared header/footer chrome from compliance/index.html');
  }

  let header = src.slice(skipIdx, mainIdx);
  header = header.replace(/FRAMEWORK MAPPINGS/g, badgeText);

  const footer = src.slice(footerStart, footerEnd);
  return { header, footer };
}

function buildDiagramSvg(diagram) {
  const titleId = `${diagram.id}-title`;
  const descId = `${diagram.id}-desc`;
  return `
      <figure class="my-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <figcaption class="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
          Trust Boundary Architecture Comparison
        </figcaption>
        <div class="overflow-x-auto">
          <svg viewBox="0 0 880 310" class="w-full min-w-[620px] h-auto" role="img" aria-labelledby="${escHtml(titleId)} ${escHtml(descId)}">
            <title id="${escHtml(titleId)}">${escHtml(diagram.title)}</title>
            <desc id="${escHtml(descId)}">${escHtml(diagram.desc)}</desc>

            <!-- Left Column: Without ZTDS -->
            <rect x="12" y="12" width="414" height="286" rx="14" fill="#fff1f2" stroke="#fecdd3" stroke-width="1.5" />
            <text x="28" y="40" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#9f1239">
              BASELINE PATH (WITHOUT LOCAL ZTDS ISOLATION)
            </text>

            <rect x="28" y="58" width="382" height="58" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="1.2" />
            <text x="42" y="82" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#0f172a">1. Local Context &amp; Input</text>
            <text x="42" y="102" font-family="system-ui, sans-serif" font-size="12" fill="#475569">${escHtml(diagram.topLeft)}</text>

            <line x1="219" y1="116" x2="219" y2="140" stroke="#e11d48" stroke-width="2" />
            <polygon points="214,136 224,136 219,144" fill="#e11d48" />

            <rect x="28" y="146" width="382" height="58" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="1.2" />
            <text x="42" y="170" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#0f172a">2. WAN Socket Egress</text>
            <text x="42" y="190" font-family="system-ui, sans-serif" font-size="12" fill="#475569">${escHtml(diagram.midLeft)}</text>

            <line x1="219" y1="204" x2="219" y2="228" stroke="#e11d48" stroke-width="2" />
            <polygon points="214,224 224,224 219,232" fill="#e11d48" />

            <rect x="28" y="234" width="382" height="50" rx="10" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1.5" />
            <text x="42" y="264" font-family="system-ui, sans-serif" font-size="12.5" font-weight="700" fill="#881337">${escHtml(diagram.botLeft)}</text>

            <!-- Right Column: With ZTDS -->
            <rect x="454" y="12" width="414" height="286" rx="14" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5" />
            <text x="470" y="40" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" fill="#065f46">
              ZTDS RFC v1.0 COUNTERFACTUAL BOUNDARY
            </text>

            <rect x="470" y="58" width="382" height="58" rx="10" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.2" />
            <text x="484" y="82" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#0f172a">1. Pre-Egress Volatile RAM Gate</text>
            <text x="484" y="102" font-family="system-ui, sans-serif" font-size="12" fill="#475569">${escHtml(diagram.topRight)}</text>

            <line x1="661" y1="116" x2="661" y2="140" stroke="#059669" stroke-width="2" />
            <polygon points="656,136 666,136 661,144" fill="#059669" />

            <rect x="470" y="146" width="382" height="58" rx="10" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.2" />
            <text x="484" y="170" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#0f172a">2. Sanitized Transport Only</text>
            <text x="484" y="190" font-family="system-ui, sans-serif" font-size="12" fill="#475569">${escHtml(diagram.midRight)}</text>

            <line x1="661" y1="204" x2="661" y2="228" stroke="#059669" stroke-width="2" />
            <polygon points="656,224 666,224 661,232" fill="#059669" />

            <rect x="470" y="234" width="382" height="50" rx="10" fill="#d1fae5" stroke="#10b981" stroke-width="1.5" />
            <text x="484" y="264" font-family="system-ui, sans-serif" font-size="12.5" font-weight="700" fill="#064e3b">${escHtml(diagram.botRight)}</text>
          </svg>
        </div>
      </figure>`;
}

function buildFaqHtml(faqs) {
  return `
      <section class="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" class="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <div class="space-y-3">
          ${faqs
            .map(
              (item, idx) => `
          <details id="faq-${idx + 1}" class="group rounded-xl border border-slate-200 bg-slate-50/60 p-4 open:bg-white open:border-emerald-300 transition-colors"${idx === 0 ? ' open' : ''}>
            <summary class="cursor-pointer list-none font-semibold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4">
              <span>${escHtml(item.q)}</span>
              <span class="font-mono text-xs text-slate-500 shrink-0 group-open:text-emerald-700">+/-</span>
            </summary>
            <p class="mt-3 text-sm text-slate-700 leading-relaxed">${escHtml(item.a)}</p>
          </details>`
            )
            .join('')}
        </div>
      </section>`;
}

function buildJsonLd(page, isHub, HUB, INCIDENTS) {
  const canonical = page.url;
  const ogImg = getPageOgImage(page, isHub);
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ztds.ai/' },
    { '@type': 'ListItem', position: 2, name: 'Incident Counterfactuals', item: HUB.url }
  ];
  if (!isHub) {
    breadcrumbs.push({ '@type': 'ListItem', position: 3, name: page.shortLabel, item: canonical });
  }

  const graph = [
    {
      '@type': 'WebSite',
      '@id': 'https://ztds.ai/#website',
      url: 'https://ztds.ai/',
      name: 'ZTDS.ai'
    },
    {
      '@type': 'Organization',
      '@id': 'https://ztds.ai/#organization',
      name: 'ZTDS AI Consortium',
      url: 'https://ztds.ai/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ztds.ai/assets/img/logo-512.png',
        width: 512,
        height: 512
      },
      founder: {
        '@type': 'Person',
        '@id': 'https://ztds.ai/#ilya-sibiryakov',
        name: 'Ilya Sibiryakov',
        jobTitle: 'Chief Architect & Lead Author',
        url: 'https://www.linkedin.com/in/ilya-sibiryakov/'
      }
    },
    {
      '@type': isHub ? ['WebPage', 'CollectionPage'] : ['WebPage'],
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.metaDescription,
      inLanguage: 'en-US',
      isPartOf: { '@id': 'https://ztds.ai/#website' },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.hero-lead', '.ztds-direct-answer']
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ogImg,
        width: 1200,
        height: 630
      },
      datePublished: page.publishedIso,
      dateModified: page.modifiedIso,
      publisher: { '@id': 'https://ztds.ai/#organization' }
    },
    {
      '@type': ['Article', 'TechArticle'],
      '@id': `${canonical}#article`,
      headline: page.headline,
      description: page.metaDescription,
      url: canonical,
      datePublished: page.publishedIso,
      dateModified: page.modifiedIso,
      inLanguage: 'en-US',
      proficiencyLevel: 'Expert',
      author: { '@id': 'https://ztds.ai/#ilya-sibiryakov' },
      publisher: { '@id': 'https://ztds.ai/#organization' },
      image: ogImg,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      citation: page.primarySources.map(s => s.url)
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      url: canonical,
      inLanguage: 'en-US',
      isPartOf: { '@id': 'https://ztds.ai/#website' },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.hero-lead', '.ztds-direct-answer']
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ogImg,
        width: 1200,
        height: 630
      },
      mainEntity: page.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a
        }
      }))
    }
  ];

  if (isHub) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonical}#incidents-list`,
      name: 'Verified AI Incident Counterfactuals Analyzed Under ZTDS RFC v1.0',
      numberOfItems: INCIDENTS.length,
      itemListElement: INCIDENTS.map((inc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: inc.headline,
        url: inc.url,
        description: inc.metaDescription
      }))
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function wrapDocument(page, isHub, mainHtml, chrome, HUB, INCIDENTS) {
  const ogType = isHub ? 'website' : 'article';
  const ogImg = getPageOgImage(page, isHub);
  const relPath = isHub ? 'incidents/index.html' : `incidents/${page.slug}/index.html`;
  const shortTitle = cleanTitle(page.title);
  const promptText = buildPromptForPage(relPath, page.url, shortTitle);
  const citationBar = buildCitationBarHtml(shortTitle, page.url, promptText);

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(page.title)}</title>
  <meta name="description" content="${escHtml(page.metaDescription)}">
  <meta name="author" content="Ilya Sibiryakov">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="${escHtml(page.url)}">
  <link rel="alternate" hreflang="en" href="${escHtml(page.url)}">
  <link rel="alternate" hreflang="x-default" href="${escHtml(page.url)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">
  <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon-96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="ZTDS LLM Knowledge Base">
  <link rel="alternate" type="text/plain" href="/llms-full.txt" title="ZTDS Full Normative LLM Compendium">

  <!-- Open Graph & Social Cards -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${escHtml(page.url)}">
  <meta property="og:title" content="${escHtml(page.title)}">
  <meta property="og:description" content="${escHtml(page.metaDescription)}">
  <meta property="og:site_name" content="ZTDS.ai">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${escHtml(ogImg)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escHtml(page.title)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escHtml(page.title)}">
  <meta name="twitter:description" content="${escHtml(page.metaDescription)}">
  <meta name="twitter:image" content="${escHtml(ogImg)}">
  <meta name="twitter:image:alt" content="${escHtml(page.title)}">

  <!-- Fonts & Styles -->
  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css">

  <!-- JSON-LD Knowledge Graph -->
  <script type="application/ld+json">
${buildJsonLd(page, isHub, HUB, INCIDENTS)}
  </script>
</head>
<body class="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col font-sans antialiased">
  ${chrome.header}
  <main id="main-content" class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
${mainHtml}
  </main>

${citationBar}

  ${chrome.footer}
  <script src="/nav.js" defer></script>
</body>
</html>
`;
}

function renderHubMain(HUB, INCIDENTS) {
  return `
    <nav aria-label="Breadcrumb" class="mb-6 text-xs font-mono text-slate-500">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="/" class="hover:text-slate-900 underline">Home</a></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-slate-900 font-semibold">Incident Counterfactuals</li>
      </ol>
    </nav>

    <header class="mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-4">
        <span>${escHtml(HUB.heroEyebrow)}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
        ${escHtml(HUB.headline)}
      </h1>
      <p class="hero-lead text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
        ${escHtml(HUB.heroLead)}
      </p>
    </header>

    <section class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-sm mb-10" aria-labelledby="direct-answer-heading">
      <div id="direct-answer-heading" class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
        Counterfactual Summary (Primary Source Grounded)
      </div>
      <p class="ztds-direct-answer text-sm sm:text-base text-slate-200 leading-relaxed">
        ${escHtml(HUB.directAnswer)}
      </p>
    </section>

    <section class="mb-10" aria-labelledby="spokes-heading">
      <h2 id="spokes-heading" class="text-2xl font-bold text-slate-900 mb-4">Verified AI Incident Post-Mortems</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${INCIDENTS.map(
          (inc, idx) => {
            const caseNum = String(idx + 1).padStart(2, '0');
            return `
        <article class="ztds-card bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-colors">
          <div>
            <div class="flex items-center justify-between gap-2 text-xs font-mono text-emerald-700 font-bold mb-2">
              <span>CASE ${caseNum}</span>
              <span class="text-slate-500">${escHtml(inc.dateLabel)}</span>
            </div>
            <h3 id="case-${caseNum}" class="text-lg font-bold text-slate-900 mb-2">
              <a href="${escHtml(inc.path)}" class="hover:text-emerald-700 transition-colors">${escHtml(inc.headline)}</a>
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">${escHtml(inc.heroLead)}</p>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <a href="${escHtml(inc.path)}" class="font-bold text-emerald-700 hover:text-emerald-900 underline">Read Post-Mortem &rarr;</a>
            <a href="${escHtml(inc.primarySources[0].url)}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 underline">Primary Bulletin</a>
          </div>
        </article>`;
          }
        ).join('')}
        <article class="ztds-card bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 flex flex-col justify-between">
          <div>
            <div class="text-xs font-mono text-slate-500 font-bold mb-2">LOCAL VERIFICATION</div>
            <h3 id="local-verification" class="text-lg font-bold text-slate-900 mb-2">Test Your Pipeline Before Egress</h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">
              Run conformance checks locally in zero-egress RAM using the Apache-2.0 CLI auditor or inspect browser telemetry live.
            </p>
          </div>
          <div class="pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-mono">
            <a href="/scanner/" class="font-bold text-slate-900 underline hover:text-emerald-700">Perimeter Scanner &rarr;</a>
            <a href="/mcp/" class="font-bold text-slate-900 underline hover:text-emerald-700">MCP Gateway &rarr;</a>
          </div>
        </article>
      </div>
    </section>

    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10" aria-labelledby="matrix-heading">
      <h2 id="matrix-heading" class="text-xl font-bold text-slate-900 mb-4">Cross-Incident Control &amp; Boundary Matrix</h2>
      <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Cross-incident counterfactual matrix">
        <table class="w-full text-left border-collapse text-sm">
          <caption class="text-xs text-slate-500 font-mono text-left mb-3">
            Comparison of verified vendor incident exposure paths, ZTDS local invariant coverage, and remaining perimeter controls.
          </caption>
          <thead>
            <tr class="border-b border-slate-200 text-xs font-mono uppercase text-slate-500">
              <th scope="col" class="py-3 pr-4">Incident Post-Mortem</th>
              <th scope="col" class="py-3 pr-4">Observed Root Vector</th>
              <th scope="col" class="py-3 pr-4">ZTDS Mitigation</th>
              <th scope="col" class="py-3">Explicit Boundary Limit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${HUB.crossCuttingMatrix
              .map(
                row => `
            <tr>
              <th scope="row" class="py-3.5 pr-4 font-semibold text-slate-900 align-top">
                <a href="${escHtml(row.link)}" class="text-emerald-800 hover:underline">${escHtml(row.incident)}</a>
              </th>
              <td class="py-3.5 pr-4 text-slate-600 align-top">${escHtml(row.rootVector)}</td>
              <td class="py-3.5 pr-4 text-slate-700 align-top">${escHtml(row.ztdsControl)}</td>
              <td class="py-3.5 text-slate-600 align-top">${escHtml(row.boundaryLimit)}</td>
            </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10" aria-labelledby="hub-links-heading">
      <h2 id="hub-links-heading" class="text-xl font-bold text-slate-900 mb-3">Primary Advisories &amp; Architecture References</h2>
      <p class="text-sm text-slate-600 mb-5">
        Inspect vendor security advisories directly alongside RFC v1.0 conformance specifications and commercial implementation directories.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        ${HUB.primarySources
          .map(
            s => `
        <a href="${escHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between gap-2 text-slate-800">
          <span class="font-semibold">${escHtml(s.label)}</span>
          <span class="text-emerald-700">Primary Source &rarr;</span>
        </a>`
          )
          .join('')}
        <a href="/standard/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">ZTDS RFC v1.0 Specification</span>
          <span class="text-emerald-700">Normative &rarr;</span>
        </a>
        <a href="/frameworks/client-side-sanitization-vs-proxy-dlp/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">Client-Side RAM vs. Cloud Proxy DLP</span>
          <span class="text-emerald-700">Comparison &rarr;</span>
        </a>
        <a href="/ciso/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">CISO Zero-DPA Procurement Pack</span>
          <span class="text-emerald-700">Governance &rarr;</span>
        </a>
        <a href="/registry/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">ZTDS Verified Implementations Registry</span>
          <span class="text-emerald-700">Directory &rarr;</span>
        </a>
        <a href="/sdk/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">Headless SDK &amp; Python Reference</span>
          <span class="text-emerald-700">Developers &rarr;</span>
        </a>
        <a href="/case-studies/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 flex items-center justify-between gap-2 text-slate-900">
          <span class="font-semibold">Enterprise Deployment Case Studies</span>
          <span class="text-emerald-700">Blueprints &rarr;</span>
        </a>
      </div>
    </section>

    ${buildFaqHtml(HUB.faqs)}
  `;
}

function buildSiblingAndRelatedLinks(inc, idx, allIncidents) {
  const seen = new Set([inc.path, '/incidents/', '/standard/']);
  const combined = [];
  const total = allIncidents.length;

  // Deterministic incoming-link ring: guarantee every incident links to 2 cyclic neighbors
  // so every new spoke automatically gets >= 3 inbound <main> links (Hub + 2 siblings).
  for (let offset = 1; offset <= Math.min(2, total - 1); offset++) {
    const neighbor = allIncidents[(idx + offset) % total];
    if (neighbor && !seen.has(neighbor.path)) {
      seen.add(neighbor.path);
      combined.push({ label: `${neighbor.shortLabel} Post-Mortem`, url: neighbor.path });
    }
  }

  for (const l of inc.relatedLinks || []) {
    if (l && l.url && !seen.has(l.url)) {
      seen.add(l.url);
      combined.push(l);
    }
  }

  return combined;
}

function renderIncidentMain(inc, idx, allIncidents) {
  const companionHtml =
    inc.companionAdvisory && inc.companionAdvisory.url
      ? `
          <a href="${escHtml(inc.companionAdvisory.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold">
            ${escHtml(inc.companionAdvisory.title)} &rarr;
          </a>`
      : '';

  const related = buildSiblingAndRelatedLinks(inc, idx, allIncidents);

  return `
    <nav aria-label="Breadcrumb" class="mb-6 text-xs font-mono text-slate-500">
      <ol class="flex flex-wrap items-center gap-2">
        <li><a href="/" class="hover:text-slate-900 underline">Home</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/incidents/" class="hover:text-slate-900 underline">Incident Counterfactuals</a></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-slate-900 font-semibold">${escHtml(inc.shortLabel)}</li>
      </ol>
    </nav>

    <article>
      <header class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-4">
          <span>${escHtml(inc.heroEyebrow)}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          ${escHtml(inc.headline)}
        </h1>
        <p class="hero-lead text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          ${escHtml(inc.heroLead)}
        </p>
      </header>

      <section class="p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-sm mb-8" aria-labelledby="direct-answer-heading">
        <div id="direct-answer-heading" class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
          Protocol Counterfactual Answer
        </div>
        <p class="ztds-direct-answer text-sm sm:text-base text-slate-200 leading-relaxed">
          ${escHtml(inc.directAnswer)}
        </p>
      </section>

      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8" aria-labelledby="sources-heading">
        <h2 id="sources-heading" class="text-xl font-bold text-slate-900 mb-3">Verified Primary Sources &amp; Timeline</h2>
        <div class="flex flex-wrap gap-3 mb-5 text-xs font-mono">
          ${inc.primarySources
            .map(
              s => `
          <a href="${escHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-800 border border-slate-200 hover:border-emerald-300 font-semibold">
            ${escHtml(s.label)} &rarr;
          </a>`
            )
            .join('')}${companionHtml}
        </div>

        <div class="overflow-x-auto" tabindex="0" role="region" aria-label="Verified primary advisory timeline">
          <table class="w-full text-left border-collapse text-sm">
            <caption class="text-xs text-slate-500 font-mono text-left mb-2">
              Chronology grounded exclusively in published vendor security bulletins.
            </caption>
            <thead>
              <tr class="border-b border-slate-200 text-xs font-mono uppercase text-slate-500">
                <th scope="col" class="py-2.5 pr-4">Verified Window</th>
                <th scope="col" class="py-2.5 pr-4">Milestone</th>
                <th scope="col" class="py-2.5">Confirmed Bulletin Record</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${inc.timeline
                .map(
                  row => `
              <tr>
                <th scope="row" class="py-3 pr-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap align-top">${escHtml(row.window)}</th>
                <td class="py-3 pr-4 font-semibold text-slate-900 align-top">${escHtml(row.event)}</td>
                <td class="py-3 text-slate-600 align-top">${escHtml(row.verifiedDetail)}</td>
              </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      ${buildDiagramSvg(inc.diagram)}

      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8" aria-labelledby="invariants-heading">
        <h2 id="invariants-heading" class="text-xl font-bold text-slate-900 mb-4">ZTDS RFC v1.0 Counterfactual Mapping</h2>
        <div class="overflow-x-auto" tabindex="0" role="region" aria-label="ZTDS RFC v1.0 counterfactual invariant mapping">
          <table class="w-full text-left border-collapse text-sm">
            <caption class="text-xs text-slate-500 font-mono text-left mb-2">
              How ZTDS RFC v1.0 invariants alter upstream exposure when applied locally prior to dispatch.
            </caption>
            <thead>
              <tr class="border-b border-slate-200 text-xs font-mono uppercase text-slate-500">
                <th scope="col" class="py-2.5 pr-4">ZTDS Invariant</th>
                <th scope="col" class="py-2.5 pr-4">Protocol Enforcement</th>
                <th scope="col" class="py-2.5">Counterfactual Outcome</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${inc.invariants
                .map(
                  inv => `
              <tr>
                <th scope="row" class="py-3 pr-4 font-mono text-xs font-bold text-emerald-800 align-top">${escHtml(inv.id)}</th>
                <td class="py-3 pr-4 text-slate-700 align-top">${escHtml(inv.howItHelps)}</td>
                <td class="py-3 text-slate-700 align-top">${escHtml(inv.outcome)}</td>
              </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-amber-50/70 rounded-2xl border border-amber-200 p-6 sm:p-8 mb-8" aria-labelledby="limits-heading">
        <h2 id="limits-heading" class="text-xl font-bold text-slate-900 mb-3">What ZTDS Does NOT Prevent</h2>
        <p class="text-sm text-slate-700 mb-3">
          ZTDS enforces pre-egress payload confidentiality. It complements — rather than replaces — infrastructure isolation, identity controls, and package integrity checks:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-sm text-slate-700">
          ${inc.notPrevented.map(item => `<li>${escHtml(item)}</li>`).join('')}
        </ul>
      </section>

      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8" aria-labelledby="replay-heading">
        <h2 id="replay-heading" class="text-xl font-bold text-slate-900 mb-3">Reproducible Synthetic Replay &amp; CLI Audit</h2>
        <p class="text-sm text-slate-600 mb-4">
          Verify tokenization behavior locally using the Apache-2.0 CLI conformance check or the Python reference package with synthetic test fixtures:
        </p>
        <div class="mb-4">
          <div class="text-xs font-mono font-bold text-slate-500 uppercase mb-1.5">1. Local CLI Verification</div>
          <pre class="overflow-x-auto rounded-xl bg-slate-900 text-emerald-300 p-4 text-xs font-mono"><code>${escHtml(inc.replay.cliCmd)}</code></pre>
        </div>
        <div class="mb-4">
          <div class="text-xs font-mono font-bold text-slate-500 uppercase mb-1.5">2. Python Reference Replay (pip install ztds)</div>
          <pre class="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs font-mono"><code>${escHtml(inc.replay.pythonCode)}</code></pre>
        </div>
        <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900">
          Verified Egress Output: ${escHtml(inc.replay.sampleOutput)}
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8" aria-labelledby="legal-heading">
        <h2 id="legal-heading" class="text-xl font-bold text-slate-900 mb-3">Statutory Risk Minimization &amp; Safe Harbor Framing</h2>
        <p class="text-sm text-slate-700 leading-relaxed mb-4">
          ${escHtml(inc.statutoryNote)}
        </p>
        <div class="flex flex-wrap gap-3 text-xs font-mono">
          <a href="/ciso/" class="px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">Download CISO Zero-DPA Pack &rarr;</a>
          <a href="/registry/" class="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold hover:bg-emerald-100">Explore ZTDS Verified Implementations &rarr;</a>
          <a href="https://privacyscrubber.com/pricing/?utm_source=ztds_incidents" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-lg bg-white text-slate-800 border border-slate-300 font-semibold hover:border-slate-500">Evaluate PrivacyScrubber Commercial Suite &rarr;</a>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8" aria-labelledby="related-heading">
        <h2 id="related-heading" class="text-xl font-bold text-slate-900 mb-3">Related Incident Briefs &amp; Technical Specifications</h2>
        <p class="text-sm text-slate-600 mb-4">
          Continue exploring verified counterfactual post-mortems, trust boundaries, and developer tooling across ZTDS.ai:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <a href="/incidents/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 font-semibold text-slate-900">
            All Incident Counterfactuals (Hub) &rarr;
          </a>
          <a href="/standard/" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 font-semibold text-slate-900">
            ZTDS RFC v1.0 Protocol Standard &rarr;
          </a>
          ${related
            .map(
              l => `
          <a href="${escHtml(l.url)}" class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 font-semibold text-slate-900">
            ${escHtml(l.label)} &rarr;
          </a>`
            )
            .join('')}
        </div>
      </section>

      ${buildFaqHtml(inc.faqs)}
    </article>
  `;
}

function writeCompendiumMarkdown(HUB, INCIDENTS) {
  const lines = [
    '# ZTDS Incident Counterfactual Compendium (RFC v1.0 Post-Mortems)',
    '',
    'This compendium grounds verified primary vendor security advisories against the four ZTDS RFC v1.0 invariants, including explicit perimeter boundaries where client-side tokenization stops.',
    '',
    '## Hub Overview',
    `- Canonical URL: ${HUB.url}`,
    `- Summary: ${HUB.directAnswer}`,
    ''
  ];

  for (const inc of INCIDENTS) {
    lines.push(`## ${inc.headline}`);
    lines.push(`- Canonical URL: ${inc.url}`);
    lines.push(`- Protocol Answer: ${inc.directAnswer}`);
    lines.push(`- Primary Sources: ${inc.primarySources.map(s => `${s.label} (${s.url})`).join('; ')}`);
    if (inc.companionAdvisory && inc.companionAdvisory.url) {
      lines.push(`- Companion Commercial Advisory: ${inc.companionAdvisory.title} (${inc.companionAdvisory.url})`);
    }
    lines.push('- Timeline:');
    for (const t of inc.timeline) {
      lines.push(`  - ${t.window} (${t.event}): ${t.verifiedDetail}`);
    }
    lines.push('- What ZTDS Does NOT Prevent:');
    for (const np of inc.notPrevented) {
      lines.push(`  - ${np}`);
    }
    lines.push(`- Reproducible CLI Check: \`${inc.replay.cliCmd}\``);
    lines.push('');
  }

  fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, 'docs', 'ZTDS_Incident_Counterfactual_Compendium.md'),
    lines.join('\n') + '\n',
    'utf8'
  );
}

function updateSitemapXml(HUB, INCIDENTS) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const hubLastmod = (HUB.modifiedIso || '2026-11-21').slice(0, 10);

  const entries = [
    { url: HUB.url, title: HUB.title, priority: '0.8', lastmod: hubLastmod, ogImage: getPageOgImage(HUB, true) },
    ...INCIDENTS.map(i => ({
      url: i.url,
      title: i.title,
      priority: '0.8',
      lastmod: (i.modifiedIso || i.publishedIso || '2026-11-21').slice(0, 10),
      ogImage: getPageOgImage(i, false)
    }))
  ];

  let added = 0;
  let updated = 0;

  for (const item of entries) {
    const escapedUrl = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const urlBlockRe = new RegExp(`<url>\\s*<loc>${escapedUrl}</loc>[\\s\\S]*?</url>`, 'm');
    const match = xml.match(urlBlockRe);

    if (!match) {
      const block = [
        '  <url>',
        `    <loc>${item.url}</loc>`,
        `    <lastmod>${item.lastmod}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${item.priority}</priority>`,
        '    <image:image>',
        `      <image:loc>${escHtml(item.ogImage)}</image:loc>`,
        `      <image:title>${escHtml(item.title)}</image:title>`,
        '    </image:image>',
        '  </url>'
      ].join('\n');
      xml = xml.replace('</urlset>', `${block}\n</urlset>`);
      added++;
    } else {
      let updatedBlock = match[0]
        .replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${item.lastmod}</lastmod>`)
        .replace(/<image:loc>[^<]+<\/image:loc>/, `<image:loc>${escHtml(item.ogImage)}</image:loc>`)
        .replace(/<image:title>[^<]+<\/image:title>/, `<image:title>${escHtml(item.title)}</image:title>`);
      if (updatedBlock !== match[0]) {
        xml = xml.replace(match[0], updatedBlock);
        updated++;
      }
    }
  }

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  return { added, updated };
}

function updateLlmsTxt(HUB, INCIDENTS) {
  const llmsPath = path.join(ROOT, 'llms.txt');
  let txt = fs.readFileSync(llmsPath, 'utf8');

  const linesToInsert = [
    `- [AI Breach Post-Mortems & ZTDS Counterfactuals](${HUB.url}): ${HUB.metaDescription}`,
    ...INCIDENTS.map(i => `- [${i.title}](${i.url}): ${i.metaDescription}`)
  ];

  const missing = linesToInsert.filter(line => {
    const match = line.match(/\((https:\/\/[^)]+)\)/);
    return match && !txt.includes(match[1]);
  });

  if (missing.length > 0) {
    const anchor = '- [Enterprise Case Studies & Reference Architectures](https://ztds.ai/case-studies/):';
    if (txt.includes(anchor)) {
      txt = txt.replace(anchor, `${missing.join('\n')}\n${anchor}`);
    } else {
      txt = txt.trimEnd() + '\n\n## Incident Counterfactuals\n' + missing.join('\n') + '\n';
    }
    fs.writeFileSync(llmsPath, txt, 'utf8');
  }
  return missing.length;
}

function updateNavJs(HUB, INCIDENTS) {
  const navPath = path.join(ROOT, 'nav.js');
  let nav = fs.readFileSync(navPath, 'utf8');
  const startMarker = '// AUTO-INCIDENTS-START';
  const endMarker = '// AUTO-INCIDENTS-END';
  const startIdx = nav.indexOf(startMarker);
  const endIdx = nav.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error('nav.js missing // AUTO-INCIDENTS-START .. // AUTO-INCIDENTS-END markers');
  }

  const rows = [
    `      { title: 'AI Incident Counterfactuals & Post-Mortems', cat: 'Incidents', url: '${escJsSingle(HUB.path)}', kw: '${escJsSingle(HUB.keywords || 'breach post-mortems counterfactuals incidents')}' }`,
    ...INCIDENTS.map(inc => {
      const navTitle = inc.shortLabel || inc.title;
      const kw = inc.keywords || `${inc.slug.replace(/-/g, ' ')} incident counterfactual`;
      return `      { title: '${escJsSingle(navTitle)}', cat: 'Incidents', url: '${escJsSingle(inc.path)}', kw: '${escJsSingle(kw)}' }`;
    })
  ];

  const block = `${startMarker}\n${rows.join(',\n')},\n      ${endMarker}`;
  const updated = nav.slice(0, startIdx) + block + nav.slice(endIdx + endMarker.length);
  if (updated !== nav) {
    fs.writeFileSync(navPath, updated, 'utf8');
    return true;
  }
  return false;
}

function verifyPythonReplays(INCIDENTS) {
  if (process.argv.includes('--skip-python')) return 0;
  const pythonSrc = path.join(ROOT, 'packages', 'ztds', 'src');
  if (!fs.existsSync(pythonSrc)) return 0;

  let verified = 0;
  for (const inc of INCIDENTS) {
    const out = execFileSync('python3', ['-c', inc.replay.pythonCode], {
      cwd: ROOT,
      env: { ...process.env, PYTHONPATH: pythonSrc },
      encoding: 'utf8'
    });
    if (!out.includes(inc.replay.sampleOutput)) {
      throw new Error(
        `Python replay mismatch for ${inc.slug}: expected output containing "${inc.replay.sampleOutput}", got:\n${out}`
      );
    }
    verified++;
  }
  return verified;
}

function validateGeneratedData(HUB, INCIDENTS) {
  const all = [HUB, ...INCIDENTS];
  const badWords = /\b(empower\w*|paradigm\w*|delve|testament|tapestry|game-changer|cutting-edge|synergy)\b/i;
  for (const p of all) {
    if (p.title.length < 30 || p.title.length > 68) {
      throw new Error(`Title length out of range (${p.title.length}): ${p.title}`);
    }
    if (p.metaDescription.length < 70 || p.metaDescription.length > 165) {
      throw new Error(`Meta description length out of SERP range (${p.metaDescription.length}): ${p.url}`);
    }
    if (!p.title.includes('ZTDS')) {
      throw new Error(`Title must include ZTDS: ${p.title}`);
    }
    const leadWords = p.heroLead.trim().split(/\s+/).length;
    if (leadWords > 32) {
      throw new Error(`.heroLead exceeds 32 words (${leadWords}): ${p.url}`);
    }
    if (badWords.test(p.heroLead) || badWords.test(p.directAnswer)) {
      throw new Error(`Prohibited slop term detected in ${p.url}`);
    }
  }
}

function main() {
  const { HUB, INCIDENTS } = loadIncidentData();
  validateGeneratedData(HUB, INCIDENTS);
  const pyVerified = verifyPythonReplays(INCIDENTS);
  const chrome = loadChrome(HUB.badgeText || 'INCIDENT COUNTERFACTUALS');

  const hubDir = path.join(ROOT, 'incidents');
  fs.mkdirSync(hubDir, { recursive: true });
  fs.writeFileSync(
    path.join(hubDir, 'index.html'),
    wrapDocument(HUB, true, renderHubMain(HUB, INCIDENTS), chrome, HUB, INCIDENTS),
    'utf8'
  );

  for (let i = 0; i < INCIDENTS.length; i++) {
    const inc = INCIDENTS[i];
    const dir = path.join(hubDir, inc.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      wrapDocument(inc, false, renderIncidentMain(inc, i, INCIDENTS), chrome, HUB, INCIDENTS),
      'utf8'
    );
  }

  writeCompendiumMarkdown(HUB, INCIDENTS);
  const sm = updateSitemapXml(HUB, INCIDENTS);
  const llmsAdded = updateLlmsTxt(HUB, INCIDENTS);
  const navChanged = updateNavJs(HUB, INCIDENTS);

  console.log(
    `[ZTDS Incidents] Generated hub + ${INCIDENTS.length} spokes (Python replays=${pyVerified}), compendium doc, sitemap (+${sm.added}/~${sm.updated}), llms.txt (+${llmsAdded}), nav.js=${navChanged ? 'updated' : 'ok'}.`
  );
}

main();
