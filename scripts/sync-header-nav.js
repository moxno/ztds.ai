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
  const isMcp = relPath.startsWith('mcp/');
  const isSdk = relPath.startsWith('sdk/');
  const isScanner = relPath.startsWith('scanner/');
  const isFrameworks = relPath.startsWith('frameworks/');
  const isCompliance = relPath.startsWith('compliance/');
  const isCiso = relPath.startsWith('ciso/');

  const link = (href, label, isActive) => {
    const cls = isActive
      ? 'nav-link text-emerald-700 font-bold py-1 whitespace-nowrap'
      : 'nav-link hover:text-slate-900 transition-colors py-1 whitespace-nowrap';
    return `<a href="${href}" class="${cls}">${label}</a>`;
  };

  return `<nav class="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600" id="desktop-nav">
        ${link('/standard/', 'Standard', isStandard)}
        ${link('/mcp/', 'MCP', isMcp)}
        ${link('/sdk/', 'SDK', isSdk)}
        ${link('/scanner/', 'Scanner', isScanner)}
        ${link('/frameworks/', 'Frameworks', isFrameworks)}
        ${link('/compliance/', 'Compliance', isCompliance)}
        ${link('/ciso/', 'CISO &amp; Trust', isCiso)}
      </nav>`;
}

function getFooterHtml() {
  return `<footer class="bg-white border-t border-slate-200 text-slate-600 pt-14 pb-10 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-slate-100">
        <!-- Col 1: Brand & Consortium -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 aspect-square p-0.5 overflow-hidden">
              <svg class="w-full h-full" viewBox="1.2 2.2 29.6 27.6" fill="none" aria-hidden="true">
                <path d="M12.5 3C5.5 3 2 7.5 2 16C2 24.5 5.5 29 12.5 29V22C7.5 22 6.5 19 6.5 16C6.5 13 7.5 10 12.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M19.5 3C26.5 3 30 7.5 30 16C30 24.5 26.5 29 19.5 29V22C24.5 22 25.5 19 25.5 16C25.5 13 24.5 10 19.5 10V3Z" fill="#0f172a" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M16 6.5L22.5 16L16 25.5L9.5 16Z" fill="#10b981"/>
                <circle cx="16" cy="16" r="2.5" fill="#38bdf8"/>
              </svg>
            </div>
            <span class="font-bold text-slate-900 text-lg font-sans">ZTDS<span class="text-emerald-600">.ai</span></span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            The open industry standard and conformance authority for zero-trust data sanitization in enterprise AI pipelines.
          </p>
          <div class="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            Originated by <a href="https://www.linkedin.com/in/ilya-sibiryakov/" target="_blank" rel="noopener" class="text-slate-800 hover:text-slate-900 font-semibold underline decoration-slate-300 underline-offset-2">Ilya Sibiryakov</a>.<br>
            Stewarded by the <span class="font-semibold text-slate-700">ZTDS AI Consortium</span>. Engineering sponsored by <a href="https://brandmeweb.com" target="_blank" rel="noopener" class="text-slate-800 hover:text-slate-900 font-semibold underline decoration-slate-300 underline-offset-2">BrandMeWeb</a>.
          </div>
        </div>

        <!-- Col 2: Specification & CISO -->
        <div>
          <div class="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono mb-3.5">Specification &amp; CISO</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/standard/" class="hover:text-slate-900 transition-colors">ZTDS RFC v1.0 Spec</a></li>
            <li><a href="/ietf/" class="hover:text-slate-900 transition-colors">IETF Protocol Draft</a></li>
            <li><a href="/ciso/" class="hover:text-slate-900 transition-colors">CISO Safe Harbor Pack</a></li>
            <li><a href="/compliance/" class="hover:text-slate-900 transition-colors">GDPR, HIPAA &amp; NIST</a></li>
            <li><a href="/benchmarks/" class="hover:text-slate-900 transition-colors">Safety &amp; Latency Benchmarks</a></li>
          </ul>
        </div>

        <!-- Col 3: Developer Stack -->
        <div>
          <div class="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono mb-3.5">Developer Stack</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/mcp/" class="hover:text-slate-900 transition-colors">MCP Stdio Server</a></li>
            <li><a href="/sdk/" class="hover:text-slate-900 transition-colors">Developer SDK</a></li>
            <li><a href="/blueprints/" class="hover:text-slate-900 transition-colors">RAG &amp; Agent Blueprints</a></li>
            <li><a href="/frameworks/" class="hover:text-slate-900 transition-colors">OWASP &amp; AI Act Mappings</a></li>
            <li><a href="/scanner/" class="hover:text-slate-900 transition-colors">Perimeter Scanner</a></li>
          </ul>
        </div>

        <!-- Col 4: Registry & Ecosystem -->
        <div>
          <div class="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono mb-3.5">Registry &amp; Ecosystem</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/registry/" class="hover:text-slate-900 transition-colors">Verified Registry</a></li>
            <li><a href="/companies/" class="hover:text-slate-900 transition-colors">Corporate Adopters</a></li>
            <li><a href="/case-studies/" class="hover:text-slate-900 transition-colors">Enterprise Case Studies</a></li>
            <li><a href="/fellows/" class="hover:text-slate-900 transition-colors">Research Fellows</a></li>
            <li><a href="/apply/" class="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Apply for Verification &rarr;</a></li>
          </ul>
        </div>
      </div>

      <!-- Legal Conformance Notice Card -->
      <div class="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
          <span class="font-bold text-slate-700 uppercase tracking-wider text-xs font-mono">Legal Notice &amp; Intellectual Property Protection</span>
          <span class="text-slate-400 font-mono text-xs">U.S. &amp; Int'l Patents Pending (Paris Convention Priority) &middot; Trademark ZTDS&trade; #182655957</span>
        </div>
        <p>
          ZTDS.ai is an independent technical consortium and specification authority. The Zero-Trust Data Sanitization standard is an open specification published under Apache 2.0 and CC BY 4.0. The deterministic in-RAM sanitization methods, reversible surrogate token structures, and local memory verification mechanisms are intellectual property protected under <strong>U.S. &amp; International Patents Pending</strong> (Paris Convention &amp; 35 U.S.C. &sect; 119 Priority). The word mark <strong>ZTDS&trade;</strong> is registered under ILPO Order #182655957 (Classes 9 &amp; 42). The "ZTDS Verified" designation confirms strictly that a software build demonstrated compliance with the four foundational invariants under automated network inspection. Technical verification does not constitute formal legal counsel; consult qualified privacy counsel for jurisdiction-specific compliance determinations.
        </p>
      </div>

      <!-- Bottom Legal & Accessibility Bar -->
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100 pt-6">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>&copy; 2026 ZTDS AI Consortium.</span>
          <span>&middot;</span>
          <span>Apache 2.0 &amp; CC BY 4.0.</span>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
          <a href="/privacy/" class="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="/terms/" class="hover:text-slate-900 transition-colors">Terms</a>
          <a href="/governance/" class="hover:text-slate-900 transition-colors">Governance</a>
          <a href="/security/" class="hover:text-slate-900 transition-colors">Security</a>
          <a href="/accessibility/" class="hover:text-slate-900 transition-colors">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>`;
}

let navUpdated = 0;
let footerUpdated = 0;
let drawerUpdated = 0;

for (const relPath of allPages) {
  const fullPath = path.join(rootDir, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // 1. Sync Desktop Navigation
  const navRegex = /<nav\b[^>]*id=["']desktop-nav["'][^>]*>[\s\S]*?<\/nav>/;
  if (navRegex.test(content)) {
    const newNav = getNavHtml(relPath);
    const existingNav = content.match(navRegex)[0];
    if (existingNav !== newNav) {
      content = content.replace(navRegex, newNav);
      changed = true;
      navUpdated++;
    }
  }

  // 1b. Sync Pyramid 4-Column Light Footer (20 high-signal internal links)
  const footerRegex = /<footer class="bg-white border-t border-slate-200[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    const newFooter = getFooterHtml();
    const existingFooter = content.match(footerRegex)[0];
    if (existingFooter !== newFooter) {
      content = content.replace(footerRegex, newFooter);
      changed = true;
      footerUpdated++;
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
console.log(`Updated pyramid footer in ${footerUpdated} pages.`);
console.log(`Normalized mobile drawer classes & a11y in ${drawerUpdated} pages.`);
