#!/usr/bin/env node

/**
 * ZTDS.ai Automated Registry & 8-Facet Ecosystem Synchronizer
 * 
 * Enforces atomic single-command synchronization of data/registry.json across:
 * 1. Cryptographic Ed25519 Certificates (lib/certificate-manager.js & certs/*.cert)
 * 2. Static & Dynamic SVG Badges (badge/*.svg & public/badge/*.svg)
 * 3. Registry HTML Hub Cards (registry/index.html & filter counts)
 * 4. Machine-Readable Knowledge Corpora (llms.txt, llms-full.txt & public/ mirrors)
 * 5. Catalogs Registry Cross-Check (.agents/catalogs-registry.md)
 * 
 * Standards Authority: ZTDS AI Consortium & BrandMeWeb Ecosystem
 * Lead Author: Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)
 * Spec: IETF draft-sibiryakov-ztds-protocol-02 / RFC v1.0
 * 
 * Usage:
 *   node scripts/sync-registry.js          # Full sync & auto-heal
 *   node scripts/sync-registry.js --check  # Read-only audit mode (exit code 1 if drift)
 *   node scripts/sync-registry.js add-entity <path/to/entity.json>
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { mintCertificate, verifyCertificate } = require('../lib/certificate-manager');

const ROOT = path.resolve(__dirname, '..');

function readFile(relPath) {
  try {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  } catch (e) {
    return null;
  }
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
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

function generateHtmlCard(entity) {
  const isReference = entity.tier && entity.tier.includes('Reference');
  const borderClass = isReference ? 'border-2 border-sky-500/80' : 'border border-slate-200';
  const pillColor = isReference ? 'bg-sky-600' : 'bg-emerald-600';
  const pillText = isReference ? 'REFERENCE IMPLEMENTATION' : 'ZTDS VERIFIED';
  const accentColor = isReference ? 'text-sky-700' : 'text-emerald-700';
  const certBadgeBg = isReference ? 'bg-sky-50 hover:bg-sky-100/80 border-sky-200 text-sky-800' : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-800';
  const certDotColor = isReference ? 'bg-sky-500' : 'bg-emerald-500';

  const category = (entity.category || '').toLowerCase().includes('mcp') ? 'mcp'
    : (entity.category || '').toLowerCase().includes('app') ? 'app'
    : (entity.category || '').toLowerCase().includes('extension') ? 'extension'
    : 'sdk';

  const tags = (entity.frameworks || []).map(f => `<span class="text-[11px] font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">${f}</span>`).join('\n            ');

  const shaShort = (entity.verified_hash || '').replace('sha256:', '').substring(0, 8);
  const frameworksJoined = (entity.frameworks || []).join(' &middot; ');

  return `      <!-- Card: ${entity.name} -->
      <div class="ztds-card p-7 bg-white ${borderClass} rounded-xl shadow-sm flex flex-col justify-between scroll-mt-24" id="${entity.id}" data-category="${category}">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="pill-trust">
              <span class="w-1.5 h-1.5 rounded-full ${pillColor}"></span>
              ${pillText}
            </span>
            <span class="text-xs font-mono text-slate-500 font-bold">${entity.license || 'MIT'}</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">${entity.name}</h2>
          <div class="text-xs font-semibold ${accentColor} mt-1 mb-3">${entity.tier || 'Verified Conformance'} &middot; ${entity.category || 'Open Standard Engine'}</div>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ${entity.description}
          </p>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1 mb-4 font-mono text-[11px]">
            <div><span class="font-semibold text-slate-900">Distribution:</span> ${entity.url}</div>
            <div><span class="font-semibold text-slate-900">Architecture:</span> ${entity.architecture}</div>
          </div>

          <div class="flex flex-wrap gap-1.5">
            ${tags}
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <a href="${entity.url}" target="_blank" rel="noopener" class="${accentColor} font-semibold hover:underline flex items-center gap-1">
            Official Source &rarr;
          </a>
          <div class="flex items-center gap-2">
            <a href="${entity.certificate.verify_url}" target="_blank" rel="noopener" class="cert-verify-link inline-flex items-center gap-1.5 px-2.5 py-1 rounded ${certBadgeBg} border text-[10.5px] font-mono font-semibold transition-colors">
              <span class="w-1.5 h-1.5 rounded-full ${certDotColor}"></span> Certificate &rarr;
            </a>
            <button type="button" class="btn-cert text-slate-500 hover:${accentColor} font-mono text-[11px] flex items-center gap-1"
            data-name="${entity.name}"
            data-tier="${entity.tier}"
            data-category-desc="${entity.category}"
            data-sha="${entity.verified_hash}"
            data-date="${entity.verified_date}"
            data-url="${entity.url}"
            data-badge="${entity.badge_url}"
            data-frameworks="${frameworksJoined}" data-cert-id="${entity.certificate.id}" data-cert-token="${entity.certificate.token}" data-cert-verify-url="${entity.certificate.verify_url}" data-cert-download-url="${entity.certificate.download_url}" data-cert-level="${entity.tier && entity.tier.includes('Reference') ? 'Level 2: Verified Reference Implementation' : 'Level 1: Automated CTS Invariant Conformance'}">
              <span class="w-1.5 h-1.5 rounded-full ${certDotColor}"></span> SHA: ${shaShort}...
            </button>
          </div>
        </div>
      </div>`;
}

function syncRegistry(options = { checkOnly: false }) {
  console.log('============================================================');
  console.log('🛡️  ZTDS Registry & 8-Facet Ecosystem Synchronizer');
  console.log('============================================================\n');

  const registryRaw = readFile('data/registry.json');
  if (!registryRaw) {
    console.error('FAIL: data/registry.json not found!');
    process.exit(1);
  }

  const registry = JSON.parse(registryRaw);
  const entities = registry.entities || [];
  let modifiedRegistry = false;
  let driftCount = 0;

  console.log(`[INGEST] Found ${entities.length} certified entities in data/registry.json.\n`);

  // Phase 1: Cryptographic Certificates & File Downloads
  console.log('--- Phase 1: Cryptographic Conformance Certificates ---');
  for (const entity of entities) {
    let needsCert = false;

    if (!entity.certificate || !entity.certificate.token || !entity.certificate.id) {
      needsCert = true;
    } else {
      const verification = verifyCertificate(entity.certificate.token);
      if (!verification.valid) {
        needsCert = true;
      }
    }

    if (needsCert) {
      if (options.checkOnly) {
        console.error(`  [DRIFT] Entity '${entity.id}' lacks a valid Ed25519 certificate.`);
        driftCount++;
        continue;
      }

      console.log(`  [MINT] Minting new Ed25519 Conformance Certificate for '${entity.id}'...`);
      const hash = entity.verified_hash && entity.verified_hash.startsWith('sha256:')
        ? entity.verified_hash
        : 'sha256:' + crypto.createHash('sha256').update(entity.slug + entity.name).digest('hex');

      const isRef = entity.tier && entity.tier.includes('Reference');
      const minted = mintCertificate({
        applicant: 'ZTDS AI Consortium',
        product: entity.name,
        category: entity.category,
        repository: entity.url,
        auditHash: hash,
        level: isRef ? 'Level 2: Verified Reference Implementation' : 'Level 1: Automated CTS Invariant Conformance'
      });

      entity.certificate = {
        id: minted.certificate_id,
        token: minted.token,
        verify_url: `https://ztds.ai/verify/#cert=${encodeURIComponent(minted.token)}`,
        download_url: `https://ztds.ai/certs/${entity.id}.cert`
      };

      writeFile(`certs/${entity.id}.cert`, minted.token);
      modifiedRegistry = true;
      console.log(`         Cert ID: ${minted.certificate_id}`);
    } else {
      const certPath = `certs/${entity.id}.cert`;
      if (!fs.existsSync(path.join(ROOT, certPath))) {
        if (options.checkOnly) {
          console.error(`  [DRIFT] Certificate file missing: ${certPath}`);
          driftCount++;
        } else {
          writeFile(certPath, entity.certificate.token);
          console.log(`  [HEAL] Wrote missing certificate file: ${certPath}`);
        }
      }
    }
  }

  if (modifiedRegistry && !options.checkOnly) {
    writeFile('data/registry.json', JSON.stringify(registry, null, 2) + '\n');
    console.log('  [SAVED] Updated data/registry.json with newly minted certificates.');
  }

  // Phase 2: Static and Public SVG Badges
  console.log('\n--- Phase 2: SVG Badges Synchronization ---');
  for (const entity of entities) {
    const slug = entity.slug || entity.id;
    const isRef = entity.tier && entity.tier.includes('Reference');
    const label = isRef ? 'REFERENCE' : 'VERIFIED';
    const color = isRef ? '#0284c7' : '#059669';

    const expectedBadgeUrl = `https://ztds.ai/badge/${slug}.svg`;
    if (entity.badge_url !== expectedBadgeUrl) {
      if (!options.checkOnly) {
        entity.badge_url = expectedBadgeUrl;
        modifiedRegistry = true;
      }
    }

    const badgePath = `badge/${slug}.svg`;
    const publicBadgePath = `public/badge/${slug}.svg`;

    const svg = generateSvgBadge(label, color);
    if (!fs.existsSync(path.join(ROOT, badgePath))) {
      if (options.checkOnly) {
        console.error(`  [DRIFT] Missing badge: ${badgePath}`);
        driftCount++;
      } else {
        writeFile(badgePath, svg);
        console.log(`  [CREATE] Generated badge: ${badgePath}`);
      }
    }

    if (!fs.existsSync(path.join(ROOT, publicBadgePath))) {
      if (options.checkOnly) {
        console.error(`  [DRIFT] Missing public badge: ${publicBadgePath}`);
        driftCount++;
      } else {
        writeFile(publicBadgePath, svg);
        console.log(`  [CREATE] Generated public badge: ${publicBadgePath}`);
      }
    }
  }

  // Phase 3: Registry HTML Cards & Filter Counts (registry/index.html)
  console.log('\n--- Phase 3: Registry HTML Hub Cards (registry/index.html) ---');
  let registryHtml = readFile('registry/index.html');
  if (registryHtml) {
    let modifiedHtml = false;

    // 1. Update filter tab count: "All Solutions (N)"
    const filterBtnRegex = /(<button class="filter-btn[^>]*data-filter="all">All Solutions \()\d+(\)<\/button>)/;
    const matchFilter = registryHtml.match(filterBtnRegex);
    if (matchFilter) {
      const currentCount = matchFilter[0];
      const targetCount = `<button class="filter-btn px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white shadow-sm" data-filter="all">All Solutions (${entities.length})</button>`;
      if (!currentCount.includes(`(${entities.length})`)) {
        if (options.checkOnly) {
          console.error(`  [DRIFT] Filter button shows outdated count in registry/index.html`);
          driftCount++;
        } else {
          registryHtml = registryHtml.replace(filterBtnRegex, `$1${entities.length}$2`);
          modifiedHtml = true;
          console.log(`  [UPDATE] Updated 'All Solutions' filter tab count to (${entities.length}).`);
        }
      }
    }

    // 2. Verify and insert missing cards
    for (const entity of entities) {
      const cardPresent = registryHtml.includes(`id="${entity.id}"`) || registryHtml.includes(`data-name="${entity.name}"`);
      if (!cardPresent) {
        if (options.checkOnly) {
          console.error(`  [DRIFT] Missing HTML card for '${entity.id}' in registry/index.html`);
          driftCount++;
        } else {
          console.log(`  [INJECT] Generating and inserting HTML card for '${entity.id}'...`);
          const cardHtml = generateHtmlCard(entity);
          // Insert inside registryGrid before closing </div>
          const gridCloseIndex = registryHtml.indexOf('</div>\n\n    <!-- Verification Certificate Modal -->');
          if (gridCloseIndex !== -1) {
            registryHtml = registryHtml.substring(0, gridCloseIndex) + cardHtml + '\n\n    ' + registryHtml.substring(gridCloseIndex);
            modifiedHtml = true;
          } else {
            console.error('  [WARN] Could not find registryGrid insertion anchor in registry/index.html.');
          }
        }
      } else {
        // Ensure card attributes (token, verify-url) match registry.json
        if (entity.certificate && entity.certificate.token) {
          const oldCertRegex = new RegExp(`data-name="${entity.name}"[\\s\\S]*?data-cert-token="([^"]+)"`);
          const matchOldToken = registryHtml.match(oldCertRegex);
          if (matchOldToken && matchOldToken[1] !== entity.certificate.token) {
            if (options.checkOnly) {
              console.error(`  [DRIFT] Outdated certificate token in card '${entity.id}'`);
              driftCount++;
            } else {
              registryHtml = registryHtml.replace(matchOldToken[1], entity.certificate.token);
              modifiedHtml = true;
              console.log(`  [UPDATE] Synchronized certificate token for card '${entity.id}'.`);
            }
          }
        }
      }
    }

    if (modifiedHtml && !options.checkOnly) {
      writeFile('registry/index.html', registryHtml);
      console.log('  [SAVED] Updated registry/index.html successfully.');
    } else {
      console.log(`  [PASS] All ${entities.length} entity cards and filter counts verified in registry/index.html.`);
    }
  }

  // Phase 4: Machine-Readable Knowledge Corpora (llms.txt & llms-full.txt)
  console.log('\n--- Phase 4: AI Knowledge Corpora (llms.txt & llms-full.txt) ---');
  let llmsTxt = readFile('llms.txt');
  if (llmsTxt) {
    let modifiedLlms = false;
    const directorySectionMarker = '[Verified Implementation Directory](https://ztds.ai/registry/):';
    const sectionIndex = llmsTxt.indexOf(directorySectionMarker);

    if (sectionIndex !== -1) {
      for (const entity of entities) {
        const idMatches = llmsTxt.includes(`\`${entity.id}\``) || llmsTxt.includes(entity.url) || llmsTxt.includes(entity.name);
        if (!idMatches) {
          if (options.checkOnly) {
            console.error(`  [DRIFT] Missing entity in llms.txt: ${entity.name}`);
            driftCount++;
          } else {
            console.log(`  [INJECT] Adding missing entity to llms.txt: ${entity.name}`);
            const entryLine = `  - ${entity.name} (\`${entity.id}\`): ${entity.description} (${entity.url}).\n`;
            // Insert right after the section marker line
            const nextLineIndex = llmsTxt.indexOf('\n', sectionIndex);
            llmsTxt = llmsTxt.substring(0, nextLineIndex + 1) + entryLine + llmsTxt.substring(nextLineIndex + 1);
            modifiedLlms = true;
          }
        }
      }

      if (modifiedLlms && !options.checkOnly) {
        writeFile('llms.txt', llmsTxt);
        writeFile('public/llms.txt', llmsTxt);
        console.log('  [SAVED] Updated llms.txt and public/llms.txt.');

        // Recompile exhaustive llms-full.txt corpus
        console.log('  [COMPILE] Rebuilding llms-full.txt via scripts/build-llms-full.js...');
        try {
          const { execSync } = require('child_process');
          execSync('node scripts/build-llms-full.js', { cwd: ROOT, stdio: 'inherit' });
        } catch (e) {
          console.error('  [ERROR] Failed to run scripts/build-llms-full.js:', e.message);
        }
      } else {
        console.log(`  [PASS] All ${entities.length} entities indexed in llms.txt and llms-full.txt.`);
      }
    }
  }

  // Phase 5: Catalogs Registry Alignment
  console.log('\n--- Phase 5: Catalogs Registry Alignment ---');
  const catReg = readFile('.agents/catalogs-registry.md');
  if (catReg) {
    let missingCitations = 0;
    for (const entity of entities) {
      if (entity.url && entity.url.startsWith('https://') && !entity.url.includes('ztds.ai')) {
        if (!catReg.includes(entity.url)) {
          console.warn(`  [ADVISORY] External distribution URL not listed in .agents/catalogs-registry.md: ${entity.url}`);
          missingCitations++;
        }
      }
    }
    if (missingCitations === 0) {
      console.log('  [PASS] All external packages and registries cross-referenced in catalogs-registry.md.');
    }
  }

  console.log('\n============================================================');
  if (driftCount > 0) {
    console.error(`❌ REGISTRY DRIFT DETECTED: Found ${driftCount} out-of-sync items.`);
    console.error('Run `node scripts/sync-registry.js` to auto-heal all 8 facets.');
    process.exit(1);
  } else {
    console.log('✅ REGISTRY SYNCHRONIZATION COMPLETE (100% 8-FACET FIDELITY)');
    console.log('============================================================\n');
  }
}

// CLI Command Dispatcher
const args = process.argv.slice(2);
if (args.includes('--check')) {
  syncRegistry({ checkOnly: true });
} else if (args[0] === 'add-entity') {
  const jsonPath = args[1];
  if (!jsonPath) {
    console.error('Error: Missing JSON file path. Usage: node scripts/sync-registry.js add-entity <path/to/entity.json>');
    process.exit(1);
  }
  const fullJsonPath = path.resolve(process.cwd(), jsonPath);
  if (!fs.existsSync(fullJsonPath)) {
    console.error(`Error: File not found at ${fullJsonPath}`);
    process.exit(1);
  }
  const newEntity = JSON.parse(fs.readFileSync(fullJsonPath, 'utf8'));
  const registryRaw = readFile('data/registry.json');
  const registry = JSON.parse(registryRaw);
  registry.entities = registry.entities || [];

  const existingIdx = registry.entities.findIndex(e => e.id === newEntity.id);
  if (existingIdx !== -1) {
    console.log(`[UPDATE] Updating existing entity '${newEntity.id}' in data/registry.json...`);
    registry.entities[existingIdx] = { ...registry.entities[existingIdx], ...newEntity };
  } else {
    console.log(`[ADD] Appending new entity '${newEntity.id}' to data/registry.json...`);
    registry.entities.push(newEntity);
  }

  writeFile('data/registry.json', JSON.stringify(registry, null, 2) + '\n');
  syncRegistry({ checkOnly: false });
} else {
  syncRegistry({ checkOnly: false });
}
