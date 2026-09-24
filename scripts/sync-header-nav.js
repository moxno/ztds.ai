#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const pages = [
  'index.html',
  'standard/index.html',
  'ciso/index.html',
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
  'agency/index.html',
  'fellows/peter-van-gameren/index.html',
  'fellows/ilya-sibiryakov/index.html',
  'companies/brandmeweb/index.html',
  'companies/match2market/index.html',
  'case-studies/index.html',
  'case-studies/dutch-commercial-workflows/index.html',
  '404.html'
];

function getNavHtml(relPath) {
  const isStandard = relPath.startsWith('standard/');
  const isRegistry = relPath.startsWith('registry/');
  const isFellows = relPath.startsWith('fellows/');
  const isCompanies = relPath.startsWith('companies/');
  const isScanner = relPath.startsWith('scanner/');
  const isSdk = relPath.startsWith('sdk/');
  const isCiso = relPath.startsWith('ciso/');

  const link = (href, label, isActive) => {
    const cls = isActive
      ? 'nav-link text-emerald-700 font-bold py-1'
      : 'nav-link hover:text-slate-900 transition-colors py-1';
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  return `<nav class="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600" id="desktop-nav">
        ${link('/standard/', 'Standard', isStandard)}
        ${link('/registry/', 'Registry', isRegistry)}
        ${link('/fellows/', 'Fellows', isFellows)}
        ${link('/companies/', 'Adopters', isCompanies)}
        ${link('/scanner/', 'Scanner', isScanner)}
        ${link('/sdk/', 'SDK &amp; Connectors', isSdk)}
        ${link('/ciso/', 'CISO &amp; Trust', isCiso)}
      </nav>`;
}

let updated = 0;
for (const relPath of pages) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  const navRegex = /<nav class="[^"]*" id="desktop-nav">[\s\S]*?<\/nav>/;

  if (navRegex.test(content)) {
    const newNav = getNavHtml(relPath);
    content = content.replace(navRegex, newNav);
    fs.writeFileSync(fullPath, content, 'utf8');
    updated++;
  }
}

console.log(`Updated desktop navigation with Fellows & Adopters links in ${updated} pages.`);
