#!/usr/bin/env node

/**
 * ZTDS.ai Header Navigation & Mobile Drawer Synchronizer
 * 
 * Systemically enforces consistent header navigation and mobile drawer
 * architecture across all HTML pages in the repository.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const ignoredDirs = new Set([
  'node_modules',
  '.git',
  '.agents',
  '.agent',
  'public',
  'stitch_export',
  'tmp',
  '.gemini',
  'dist',
  'coverage'
]);

function findHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullSub = path.join(dir, entry.name);
      if (!ignoredDirs.has(entry.name) && !fullSub.endsWith(path.join('docs', 'legal', 'internal'))) {
        findHtmlFiles(fullSub, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const relPath = path.relative(rootDir, path.join(dir, entry.name));
      fileList.push(relPath);
    }
  }
  return fileList;
}

const allPages = findHtmlFiles(rootDir).sort();

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
      ? 'nav-link text-emerald-700 font-bold py-1 whitespace-nowrap'
      : 'nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap';
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  return `<nav class="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600" id="desktop-nav">
        ${link('/standard/', 'Standard', isStandard)}
        ${link('/registry/', 'Registry', isRegistry)}
        ${link('/fellows/', 'Fellows', isFellows)}
        ${link('/companies/', 'Adopters', isCompanies)}
        ${link('/scanner/', 'Scanner', isScanner)}
        ${link('/sdk/', 'SDK &amp; Connectors', isSdk)}
        ${link('/ciso/', 'CISO &amp; Trust', isCiso)}
      </nav>`;
}

let navUpdated = 0;
let drawerUpdated = 0;

for (const relPath of allPages) {
  const fullPath = path.join(rootDir, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // 1. Sync Desktop Navigation
  const navRegex = /<nav class="[^"]*" id="desktop-nav">[\s\S]*?<\/nav>/;
  if (navRegex.test(content)) {
    const newNav = getNavHtml(relPath);
    const existingNav = content.match(navRegex)[0];
    if (existingNav !== newNav) {
      content = content.replace(navRegex, newNav);
      changed = true;
      navUpdated++;
    }
  }

  // 2. Sync Mobile Backdrop and Drawer classes + A11y Attributes
  const backdropRegex = /<div id="mobile-backdrop"[^>]*>/i;
  const backdropMatch = content.match(backdropRegex);
  if (backdropMatch) {
    const expectedBackdrop = '<div id="mobile-backdrop" class="mobile-nav-backdrop drawer-backdrop" aria-hidden="true">';
    if (backdropMatch[0] !== expectedBackdrop) {
      content = content.replace(backdropRegex, expectedBackdrop);
      changed = true;
      drawerUpdated++;
    }
  }

  const drawerRegex = /<aside id="mobile-drawer"[^>]*>/i;
  const drawerMatch = content.match(drawerRegex);
  if (drawerMatch) {
    const expectedDrawer = '<aside id="mobile-drawer" class="mobile-nav-drawer drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">';
    if (drawerMatch[0] !== expectedDrawer) {
      content = content.replace(drawerRegex, expectedDrawer);
      changed = true;
      drawerUpdated++;
    }
  }

  // 3. Sync Skip-to-Main-Content Accessible Link
  if (content.includes('<header') && content.includes('<main') && !/class=["'][^"']*\bskip-link\b/i.test(content)) {
    const bodyMatch = content.match(/(<body[^>]*>)/i);
    if (bodyMatch) {
      const skipLinkTag = '\n  <!-- Skip to main content -->\n  <a href="#main-content" class="skip-link">Skip to main content</a>\n';
      content = content.replace(bodyMatch[0], `${bodyMatch[0]}${skipLinkTag}`);
      changed = true;
    }
  }

  // 4. Ensure <main> has id="main-content"
  if (content.includes('<main') && !content.includes('id="main-content"')) {
    content = content.replace(/<main(\s+[^>]*)?>/i, (match, attrs) => {
      if (!attrs) return '<main id="main-content">';
      if (/id=["'][^"']*["']/i.test(attrs)) return match;
      return `<main id="main-content"${attrs}>`;
    });
    changed = true;
  }

  // 5. Remove stacked top announcement/status bar <div> above standard sticky <header> (single-row header rule)
  if (content.includes('id="desktop-nav"')) {
    const stackedBarRegex = /(<a\s+href="#main-content"[^>]*>[\s\S]*?<\/a>)\s*(?:<!--\s*Top[^-]*-->\s*)?<div\s+class="bg-slate-900[^"]*"[^>]*>[\s\S]*?<\/div>\s*(?=(?:<!--[^-]*-->\s*)?<header\b)/i;
    // Safely remove top bar between skip-link and Institutional Top Header / <header>
    const headerIdx = content.indexOf('<header');
    const skipMatch = content.match(/<a\s+href="#main-content"[^>]*>[\s\S]*?<\/a>/i);
    if (headerIdx > -1 && skipMatch) {
      const afterSkipIdx = skipMatch.index + skipMatch[0].length;
      if (afterSkipIdx < headerIdx) {
        const between = content.slice(afterSkipIdx, headerIdx);
        if (/<div\b/i.test(between)) {
          const commentKeep = between.match(/<!--\s*Institutional Top Header\s*-->\s*$/i);
          content = content.slice(0, afterSkipIdx) + '\n\n  ' + (commentKeep ? commentKeep[0] : '') + content.slice(headerIdx);
          changed = true;
        }
      }
    }

    // 6. Enforce .ztds-sticky-header on standard sticky <header>
    const stickyHeaderRe = /<header\s+class="([^"]*\bsticky\b[^"]*)"/i;
    const shMatch = content.match(stickyHeaderRe);
    if (shMatch && !shMatch[1].split(/\s+/).includes('ztds-sticky-header')) {
      content = content.replace(stickyHeaderRe, `<header class="ztds-sticky-header ${shMatch[1]}"`);
      changed = true;
    }
  }

  // 7. Prune redundant archival draft-01 footer link to concentrate PageRank on active /ietf/ hub
  const draft01FooterRe = /^[ \t]*<li><a\s+href="\/ietf\/draft-sibiryakov-ztds-protocol-01\/"[^>]*>IETF Draft-01 Archival Spec<\/a><\/li>\r?\n/gm;
  if (draft01FooterRe.test(content)) {
    content = content.replace(draft01FooterRe, '');
    changed = true;
  }

  // 8. Deduplicate repeated /frameworks/ links inside #mobile-drawer
  const dupFrameworksDrawerRe = /(<a\s+href="\/frameworks\/"[^>]*>Framework Mappings \(OWASP, NIST, EU AI Act\)<\/a>)\s*<a\s+href="\/frameworks\/"[^>]*>Framework Mappings \(OWASP, NIST, EU AI Act\)<\/a>/g;
  if (dupFrameworksDrawerRe.test(content)) {
    content = content.replace(dupFrameworksDrawerRe, '$1');
    changed = true;
    drawerUpdated++;
  }

  // 9. Align browser <meta name="theme-color"> to #f8fafc on all light-header institutional pages
  if (content.includes('id="desktop-nav"')) {
    const themeColorRe = /<meta\s+name=["']theme-color["']\s+content=["'](?:#020617|#0f172a)["']\s*\/?>/i;
    if (themeColorRe.test(content)) {
      content = content.replace(themeColorRe, '<meta name="theme-color" content="#f8fafc">');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}

console.log(`Scan completed across ${allPages.length} HTML files.`);
console.log(`Updated desktop navigation in ${navUpdated} pages.`);
console.log(`Normalized mobile drawer classes & a11y in ${drawerUpdated} pages.`);
