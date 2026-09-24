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
      if (!ignoredDirs.has(entry.name)) {
        findHtmlFiles(path.join(dir, entry.name), fileList);
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

  // 2. Sync Mobile Backdrop and Drawer classes
  const backdropRegex = /<div id="mobile-backdrop" class="([^"]*)"/i;
  const backdropMatch = content.match(backdropRegex);
  if (backdropMatch) {
    const classList = backdropMatch[1].trim().split(/\s+/);
    if (!classList.includes('mobile-nav-backdrop') || !classList.includes('drawer-backdrop')) {
      content = content.replace(
        backdropRegex,
        '<div id="mobile-backdrop" class="mobile-nav-backdrop drawer-backdrop"'
      );
      changed = true;
      drawerUpdated++;
    }
  }

  const drawerRegex = /<aside id="mobile-drawer" class="([^"]*)"/i;
  const drawerMatch = content.match(drawerRegex);
  if (drawerMatch) {
    const classList = drawerMatch[1].trim().split(/\s+/);
    if (!classList.includes('mobile-nav-drawer') || !classList.includes('drawer')) {
      content = content.replace(
        drawerRegex,
        '<aside id="mobile-drawer" class="mobile-nav-drawer drawer"'
      );
      changed = true;
      drawerUpdated++;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}

console.log(`Scan completed across ${allPages.length} HTML files.`);
console.log(`Updated desktop navigation in ${navUpdated} pages.`);
console.log(`Normalized mobile drawer classes in ${drawerUpdated} pages.`);
