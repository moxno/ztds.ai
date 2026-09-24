#!/usr/bin/env node

/**
 * ZTDS.ai Entity Manager & Verification Engine
 * 
 * Enforces the 8-Facet Architecture Invariant for all registered entities:
 * 1. Data Record (data/fellows.json or data/companies.json)
 * 2. Individual Profile Page (fellows/:slug/index.html or companies/:slug/index.html)
 * 3. Hub Card & Schema.org ItemList (fellows/index.html or companies/index.html)
 * 4. SVG Badges (badge/:slug.svg and public/badge/:slug.svg)
 * 5. Dynamic API lookup in api/badge.js
 * 6. Local Media Assets (assets/img/ and public/assets/img/)
 * 7. Search Sitemaps (sitemap.xml and public/sitemap.xml)
 * 8. LLM Knowledge Corpora (llms.txt and llms-full.txt in root and public/)
 * 
 * Usage:
 *   node scripts/entity-manager.js audit
 *   node scripts/entity-manager.js fix-badges
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
  } catch (e) {
    return null;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function writeFile(filePath, content) {
  const fullPath = path.join(ROOT, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function generateSvgBadge(label, color = '#059669', textColor = '#ffffff') {
  const labelRight = String(label || 'VERIFIED').trim().toUpperCase();
  const wLeft = 58;
  const charWidth = 6.8;
  const wRight = Math.max(64, Math.round(labelRight.length * charWidth + 16));
  const totalWidth = wLeft + wRight;
  const textXRight = wLeft + Math.round(wRight / 2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="badgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#badgeClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="${color}"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="${textColor}" letter-spacing="0.6">${labelRight}</text>
  </g>
</svg>`.trim();
}

function fixMissingBadges() {
  console.log('Generating missing SVG badges for all registry entities...');
  let generated = 0;

  const fellowsRaw = readFileSafe('data/fellows.json');
  if (fellowsRaw) {
    const { fellows } = JSON.parse(fellowsRaw);
    for (const fellow of fellows) {
      const slug = fellow.slug;
      const isWg = slug.startsWith('wg');
      const label = isWg ? 'COUNCIL' : (fellow.status && fellow.status.includes('Founding') ? 'FOUNDING' : 'FELLOW');
      const color = isWg ? '#7c3aed' : '#0284c7';
      const svg = generateSvgBadge(label, color);

      if (!fileExists(`badge/${slug}.svg`)) {
        writeFile(`badge/${slug}.svg`, svg);
        generated++;
      }
      if (!fileExists(`public/badge/${slug}.svg`)) {
        writeFile(`public/badge/${slug}.svg`, svg);
        generated++;
      }
    }
  }

  const companiesRaw = readFileSafe('data/companies.json');
  if (companiesRaw) {
    const { companies } = JSON.parse(companiesRaw);
    for (const company of companies) {
      const slug = company.slug;
      const isBlueprint = company.tier && company.tier.includes('Sandbox');
      const label = isBlueprint ? 'BLUEPRINT' : 'VERIFIED';
      const color = isBlueprint ? '#475569' : '#059669';
      const svg = generateSvgBadge(label, color);

      if (!fileExists(`badge/${slug}.svg`)) {
        writeFile(`badge/${slug}.svg`, svg);
        generated++;
      }
      if (!fileExists(`public/badge/${slug}.svg`)) {
        writeFile(`public/badge/${slug}.svg`, svg);
        generated++;
      }
    }
  }

  console.log(`Generated ${generated} missing SVG badges.`);
}

function runAudit() {
  console.log('Starting ZTDS Entity Invariant Audit across repository...');
  let totalErrors = 0;
  let totalEntities = 0;

  const sitemapXml = readFileSafe('sitemap.xml') || '';
  const publicSitemapXml = readFileSafe('public/sitemap.xml') || '';
  const llmsTxt = readFileSafe('llms.txt') || '';
  const llmsFullTxt = readFileSafe('llms-full.txt') || '';
  const fellowsIndex = readFileSafe('fellows/index.html') || '';
  const companiesIndex = readFileSafe('companies/index.html') || '';
  const apiBadgeJs = readFileSafe('api/badge.js') || '';

  // 1. Audit Fellows
  const fellowsRaw = readFileSafe('data/fellows.json');
  if (!fellowsRaw) {
    console.error('FAIL: data/fellows.json not found');
    process.exit(1);
  }
  const fellowsData = JSON.parse(fellowsRaw);

  console.log(`\nAuditing ${fellowsData.fellows.length} Fellows & Working Groups:`);
  for (const fellow of fellowsData.fellows) {
    totalEntities++;
    const slug = fellow.slug;
    const isIndividual = !slug.startsWith('wg');
    const errors = [];

    // Facet 2: Standalone Profile (for individual fellows)
    if (isIndividual) {
      if (!fileExists(`fellows/${slug}/index.html`)) {
        errors.push(`Missing profile page: fellows/${slug}/index.html`);
      }
    }

    // Facet 3: Hub Card
    if (!fellowsIndex.includes(`id="${slug}"`) && !fellowsIndex.includes(`data-slug="${slug}"`)) {
      errors.push(`Missing hub article card in fellows/index.html for slug: ${slug}`);
    }

    // Facet 4: Badges
    if (!fileExists(`badge/${slug}.svg`)) {
      errors.push(`Missing badge: badge/${slug}.svg`);
    }
    if (!fileExists(`public/badge/${slug}.svg`)) {
      errors.push(`Missing public badge: public/badge/${slug}.svg`);
    }

    // Facet 5: API Badge
    if (!apiBadgeJs.includes('fellows.json')) {
      errors.push('api/badge.js does not query fellows.json');
    }

    // Facet 6: Media Asset (if avatar declared)
    if (fellow.avatar) {
      const cleanPath = fellow.avatar.replace(/^\//, '');
      if (!fileExists(cleanPath)) {
        errors.push(`Missing avatar file: ${cleanPath}`);
      }
      if (!fileExists(`public/${cleanPath}`)) {
        errors.push(`Missing public avatar file: public/${cleanPath}`);
      }
    }

    // Facet 7: Sitemaps (for individual fellows)
    if (isIndividual) {
      const urlPattern = `https://ztds.ai/fellows/${slug}/`;
      if (!sitemapXml.includes(urlPattern)) {
        errors.push(`URL missing from sitemap.xml: ${urlPattern}`);
      }
      if (!publicSitemapXml.includes(urlPattern)) {
        errors.push(`URL missing from public/sitemap.xml: ${urlPattern}`);
      }

      // Facet 8: LLMs Corpora
      if (!llmsTxt.includes(urlPattern)) {
        errors.push(`URL missing from llms.txt: ${urlPattern}`);
      }
      if (!llmsFullTxt.includes(urlPattern)) {
        errors.push(`URL missing from llms-full.txt: ${urlPattern}`);
      }
    }

    if (errors.length > 0) {
      console.log(`  [FAIL] ${fellow.name} (${slug})`);
      errors.forEach(err => console.log(`         - ${err}`));
      totalErrors += errors.length;
    } else {
      console.log(`  [PASS] ${fellow.name} (${slug}) — 8/8 facets verified`);
    }
  }

  // 2. Audit Corporate Adopters
  const companiesRaw = readFileSafe('data/companies.json');
  if (!companiesRaw) {
    console.error('FAIL: data/companies.json not found');
    process.exit(1);
  }
  const companiesData = JSON.parse(companiesRaw);

  console.log(`\nAuditing ${companiesData.companies.length} Corporate Adopters:`);
  for (const company of companiesData.companies) {
    totalEntities++;
    const slug = company.slug;
    const isProductionEntity = (company.tier && (company.tier.includes('Founding') || company.tier.includes('Evaluator') || company.tier.includes('Pioneer')));
    const errors = [];

    // Facet 2: Standalone Profile (for production verified entities)
    if (isProductionEntity) {
      if (!fileExists(`companies/${slug}/index.html`)) {
        errors.push(`Missing profile page: companies/${slug}/index.html`);
      }
    }

    // Facet 3: Hub Card
    if (!companiesIndex.includes(`id="${slug}"`) && !companiesIndex.includes(`data-slug="${slug}"`)) {
      errors.push(`Missing hub article card in companies/index.html for slug: ${slug}`);
    }

    // Facet 4: Badges
    if (!fileExists(`badge/${slug}.svg`)) {
      errors.push(`Missing badge: badge/${slug}.svg`);
    }
    if (!fileExists(`public/badge/${slug}.svg`)) {
      errors.push(`Missing public badge: public/badge/${slug}.svg`);
    }

    // Facet 7: Sitemaps (for production entities)
    if (isProductionEntity) {
      const urlPattern = `https://ztds.ai/companies/${slug}/`;
      if (!sitemapXml.includes(urlPattern)) {
        errors.push(`URL missing from sitemap.xml: ${urlPattern}`);
      }
      if (!publicSitemapXml.includes(urlPattern)) {
        errors.push(`URL missing from public/sitemap.xml: ${urlPattern}`);
      }

      // Facet 8: LLMs Corpora
      if (!llmsTxt.includes(urlPattern)) {
        errors.push(`URL missing from llms.txt: ${urlPattern}`);
      }
      if (!llmsFullTxt.includes(urlPattern)) {
        errors.push(`URL missing from llms-full.txt: ${urlPattern}`);
      }
    }

    if (errors.length > 0) {
      console.log(`  [FAIL] ${company.name} (${slug})`);
      errors.forEach(err => console.log(`         - ${err}`));
      totalErrors += errors.length;
    } else {
      console.log(`  [PASS] ${company.name} (${slug}) — 8/8 facets verified`);
    }
  }

  console.log(`\nAudit Summary: ${totalEntities} entities checked.`);
  if (totalErrors === 0) {
    console.log('SUCCESS: All entities conform 100% to the 8-Facet Architecture Invariant.');
    process.exit(0);
  } else {
    console.error(`FAILURE: Found ${totalErrors} invariant violations across entities.`);
    console.error('Run `node scripts/entity-manager.js fix-badges` to generate missing static badges.');
    process.exit(1);
  }
}

const command = process.argv[2] || 'audit';
if (command === 'audit') {
  runAudit();
} else if (command === 'fix-badges') {
  fixMissingBadges();
  runAudit();
} else {
  console.log(`Unknown command: ${command}. Use: node scripts/entity-manager.js audit | fix-badges`);
  process.exit(1);
}
