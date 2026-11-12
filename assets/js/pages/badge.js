(function () {
  'use strict';

(function() {
      const KNOWN_VERIFIED_SLUGS = [
        'privacyscrubber-web',
        'privacyscrubber-extension',
        'privacyscrubber-wp-guard',
        'privacyscrubber-mcp',
        'privacyscrubber-sdk',
        'learningcenterusa',
        'ztds-core',
        'ztds-python',
        'ztds-mcp',
        'langchain-ztds',
        'llamaindex-ztds',
        'crewai-ztds',
        'ollama-ztds-filter',
        'envoy-ztds-wasm',
        'fastmcp-ztds',
        'ilya-sibiryakov',
        'cliford-fanyuy',
        'wg1-crypto',
        'wg2-grc',
        'wg3-systems',
        'wg4-profiles',
        'barrelswood.com',
        'barrelswood-com',
        'barrelswood-com-ztds'
      ];

      const registeredSlugs = new Set(KNOWN_VERIFIED_SLUGS);
      const domainTargetMap = new Map([
        ['barrelswood.com', 'barrelswood.com'],
        ['barrelswood-com', 'barrelswood.com'],
        ['barrelswood-com-ztds', 'barrelswood.com']
      ]);

      // DOM Elements
      const slugInput = document.getElementById('slugInput');
      const registryQuickSelect = document.getElementById('registryQuickSelect');
      const customLabelInput = document.getElementById('customLabelInput');
      const clearCustomLabelBtn = document.getElementById('clearCustomLabelBtn');
      const registryStatusPill = document.getElementById('registryStatusPill');
      const badgePreviewContainer = document.getElementById('badgePreviewContainer');
      const badgePreviewLink = document.getElementById('badgePreviewLink');
      const btnApplyAccreditation = document.getElementById('btnApplyAccreditation');
      const badgeSvgMount = document.getElementById('badgeSvgMount');
      const badgePreviewHelper = document.getElementById('badgePreviewHelper');
      const codeMd = document.getElementById('codeMd');
      const codeHtml = document.getElementById('codeHtml');
      const codeSvg = document.getElementById('codeSvg');
      const codeReact = document.getElementById('codeReact');
      const btnDownloadBadgeSvg = document.getElementById('btnDownloadBadgeSvg');
      const tierBtns = document.querySelectorAll('.tier-btn');
      const themeBtns = document.querySelectorAll('.theme-btn');
      const canvasBgBtns = document.querySelectorAll('.canvas-bg-btn');
      const canvasZoomBtns = document.querySelectorAll('.canvas-zoom-btn');
      const presetLabelChips = document.querySelectorAll('.preset-label-chip');

      // State
      let currentTier = 'VERIFIED';
      let currentTheme = 'dark';
      let currentCanvasBg = 'light';
      let currentZoom = 1;
      let currentSvgXml = '';

      // Attempt to load dynamic registry, corporate adopters, fellows, and protected web domains
      Promise.all([
        fetch('/data/registry.json').then(r => r.json()).catch(() => ({ entities: [] })),
        fetch('/data/companies.json').then(r => r.json()).catch(() => ({ companies: [] })),
        fetch('/data/fellows.json').then(r => r.json()).catch(() => ({ fellows: [] })),
        fetch('/data/domains.json').then(r => r.json()).catch(() => ({ domains: [] }))
      ])
        .then(([regData, compData, fellowData, domData]) => {
          if (regData && Array.isArray(regData.entities)) {
            regData.entities.forEach(e => {
              if (e.slug) registeredSlugs.add(e.slug.toLowerCase());
              if (e.id) registeredSlugs.add(e.id.toLowerCase());
            });
          }
          if (compData && Array.isArray(compData.companies)) {
            compData.companies.forEach(c => {
              if (c.slug) registeredSlugs.add(c.slug.toLowerCase());
              if (c.id) registeredSlugs.add(c.id.toLowerCase());
            });
          }
          if (fellowData && Array.isArray(fellowData.fellows)) {
            fellowData.fellows.forEach(f => {
              if (f.slug) registeredSlugs.add(f.slug.toLowerCase());
              if (f.id) registeredSlugs.add(f.id.toLowerCase());
            });
          }
          if (domData && Array.isArray(domData.domains)) {
            domData.domains.forEach(d => {
              const canonicalDom = String(d.domain || d.slug || '').toLowerCase();
              if (d.domain) {
                registeredSlugs.add(d.domain.toLowerCase());
                domainTargetMap.set(d.domain.toLowerCase(), canonicalDom);
              }
              if (d.slug) {
                registeredSlugs.add(d.slug.toLowerCase());
                domainTargetMap.set(d.slug.toLowerCase(), canonicalDom);
              }
              if (d.id) {
                const idLower = d.id.toLowerCase();
                registeredSlugs.add(idLower);
                registeredSlugs.add(idLower + '-ztds');
                domainTargetMap.set(idLower, canonicalDom);
                domainTargetMap.set(idLower + '-ztds', canonicalDom);
              }
            });
          }
          updateBadge();
        })
        .catch(() => {});

      function isSlugVerified(slug) {
        if (!slug) return false;
        const s = slug.trim().toLowerCase();
        return registeredSlugs.has(s) || s.includes('privacyscrubber') || s === 'reference';
      }

      function generateBadgeSvg(label, tier, theme) {
        const isLight = (theme === 'light');
        let colorRight = '#059669'; // Emerald for VERIFIED
        let textColorRight = '#ffffff';

        if (tier === 'SOVEREIGN') {
          colorRight = '#2563eb'; // Blue
          textColorRight = '#ffffff';
        } else if (tier === 'DPA EXEMPT') {
          colorRight = isLight ? '#f8fafc' : '#0f172a'; // Slate-50 on light, Slate-900 on dark
          textColorRight = isLight ? '#047857' : '#10b981'; // Emerald
        } else if (tier === 'AIR-GAPPED') {
          colorRight = '#4f46e5'; // Indigo
          textColorRight = '#ffffff';
        } else if (tier === 'SELF-ATTESTED') {
          colorRight = '#d97706'; // Amber
          textColorRight = '#ffffff';
        }

        const rawLabel = String(label || 'VERIFIED').trim().toUpperCase();
        const cleanLabel = rawLabel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const wLeft = 58;
        const charWidth = 6.8;
        const wRight = Math.max(64, Math.round(rawLabel.length * charWidth + 16));
        const totalWidth = wLeft + wRight;
        const textXRight = wLeft + Math.round(wRight / 2);

        const bgLeft = isLight ? '#f1f5f9' : '#0f172a';
        const textLeft = isLight ? '#0f172a' : '#f8fafc';
        const strokeBorder = isLight ? '#cbd5e1' : '#0f172a';
        const archFill = isLight ? '#ffffff' : '#020617';
        const archStroke = isLight ? '#059669' : '#10b981';
        const diamondFill = '#10b981';
        const circleFill = isLight ? '#0284c7' : '#38bdf8';

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="badgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#badgeClip)">
    <rect width="${wLeft}" height="22" fill="${bgLeft}"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="${colorRight}"/>
    <rect width="${totalWidth}" height="22" stroke="${strokeBorder}" stroke-width="1" fill="none"/>
    <!-- Official ZTDS Air-Gap Monolith Vector Mark -->
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="${archFill}" stroke="${archStroke}" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="${archFill}" stroke="${archStroke}" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="${diamondFill}"/>
      <circle cx="7" cy="7" r="1" fill="${circleFill}"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="${textLeft}" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="${textColorRight}" letter-spacing="0.6">${cleanLabel}</text>
  </g>
</svg>`.trim();
      }

      function updateBadge(explicitSlug) {
        let activeSlug = (explicitSlug !== undefined ? explicitSlug : slugInput.value).trim().toLowerCase();
        if (!activeSlug) activeSlug = 'privacyscrubber-web';
        slugInput.value = activeSlug;

        // Sync dropdown if matching
        if (registryQuickSelect) {
          let matched = false;
          for (let i = 0; i < registryQuickSelect.options.length; i++) {
            if (registryQuickSelect.options[i].value === activeSlug) {
              registryQuickSelect.selectedIndex = i;
              matched = true;
              break;
            }
          }
          if (!matched) {
            registryQuickSelect.value = 'custom';
          }
        }

        const verified = isSlugVerified(activeSlug);
        const isDomain = domainTargetMap.has(activeSlug) || activeSlug.includes('.');
        const canonicalDomain = domainTargetMap.get(activeSlug) || activeSlug;
        
        // Update Registry Status Pill
        const setRegistryStatusPill = (dotCls, labelText) => {
          const dot = document.createElement('span');
          dot.className = 'w-1.5 h-1.5 rounded-full ' + dotCls;
          registryStatusPill.replaceChildren(dot, document.createTextNode(' ' + labelText));
        };
        if (verified && isDomain) {
          registryStatusPill.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200';
          setRegistryStatusPill('bg-emerald-500', 'VERIFIED PROTECTED DOMAIN');
        } else if (verified) {
          registryStatusPill.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200';
          setRegistryStatusPill('bg-emerald-500', 'VERIFIED REGISTRY ENTITY');
        } else {
          registryStatusPill.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200';
          setRegistryStatusPill('bg-amber-500', 'UNREGISTERED / SELF-ATTESTED');
        }

        const customLabel = customLabelInput.value.trim().toUpperCase();
        if (customLabel) {
          clearCustomLabelBtn.classList.remove('hidden');
        } else {
          clearCustomLabelBtn.classList.add('hidden');
        }

        const effectiveLabel = customLabel || currentTier;

        // Generate SVG vector markup in-memory with theme
        currentSvgXml = generateBadgeSvg(effectiveLabel, currentTier, currentTheme);

        // Mount SVG into DOM preview safely via createElementNS (zero innerHTML)
        const isLight = (currentTheme === 'light');
        let colorRight = '#059669';
        let textColorRight = '#ffffff';
        if (currentTier === 'SOVEREIGN') { colorRight = '#2563eb'; }
        else if (currentTier === 'DPA EXEMPT') { colorRight = isLight ? '#f8fafc' : '#0f172a'; textColorRight = isLight ? '#047857' : '#10b981'; }
        else if (currentTier === 'AIR-GAPPED') { colorRight = '#4f46e5'; }
        else if (currentTier === 'SELF-ATTESTED') { colorRight = '#d97706'; }

        if (window.ztdsCreateBadgeSvg) {
          const svgEl = window.ztdsCreateBadgeSvg(effectiveLabel, colorRight, textColorRight, 'ZTDS');
          if (isLight) {
            const rects = svgEl.querySelectorAll('g[clip-path] > rect');
            if (rects[0]) rects[0].setAttribute('fill', '#f1f5f9');
            if (rects[2]) rects[2].setAttribute('stroke', '#cbd5e1');
            const leftTextEl = svgEl.querySelector('g[clip-path] > text');
            if (leftTextEl) leftTextEl.setAttribute('fill', '#0f172a');
            const paths = svgEl.querySelectorAll('g[transform] path');
            if (paths[0]) { paths[0].setAttribute('fill', '#ffffff'); paths[0].setAttribute('stroke', '#059669'); }
            if (paths[1]) { paths[1].setAttribute('fill', '#ffffff'); paths[1].setAttribute('stroke', '#059669'); }
            const circle = svgEl.querySelector('g[transform] circle');
            if (circle) circle.setAttribute('fill', '#0284c7');
          }
          badgeSvgMount.replaceChildren(svgEl);
        }
        badgeSvgMount.style.transform = `scale(${currentZoom})`;
        badgeSvgMount.style.transformOrigin = 'left center';

        // Calculate remote URL query parameters if non-default
        let remoteUrl = `https://ztds.ai/badge/${activeSlug}.svg`;
        const queryParams = [];

        if (currentTheme === 'light') {
          queryParams.push('theme=light');
        }

        if (currentTier === 'SOVEREIGN') queryParams.push('status=sovereign');
        else if (currentTier === 'DPA EXEMPT') queryParams.push('status=dpa');
        else if (currentTier === 'AIR-GAPPED') queryParams.push('status=air-gapped');
        else if (currentTier === 'SELF-ATTESTED' && !customLabel) queryParams.push('label=SELF-ATTESTED');

        if (customLabel) {
          queryParams.push(`label=${encodeURIComponent(customLabel)}`);
        }

        if (queryParams.length > 0) {
          remoteUrl += `?${queryParams.join('&')}`;
        }

        const verifyUrl = isDomain
          ? `https://ztds.ai/verify/?domain=${encodeURIComponent(canonicalDomain)}`
          : `https://ztds.ai/verify/?target=${encodeURIComponent(activeSlug)}`;
        if (badgePreviewLink) {
          badgePreviewLink.href = verifyUrl;
        }
        if (btnApplyAccreditation) {
          btnApplyAccreditation.href = isDomain
            ? `/apply/?track=company&domain=${encodeURIComponent(canonicalDomain)}`
            : `/apply/?track=product&slug=${encodeURIComponent(activeSlug)}`;
        }
        codeMd.textContent = `[![ZTDS ${effectiveLabel}](${remoteUrl})](${verifyUrl})`;
        codeHtml.textContent = `<a href="${verifyUrl}"><img src="${remoteUrl}" alt="ZTDS ${effectiveLabel}" width="168" height="22" decoding="async"></a>`;
        codeSvg.textContent = currentSvgXml;
        if (codeReact) {
          codeReact.textContent = `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${remoteUrl}" alt="ZTDS ${effectiveLabel}" width={168} height={22} decoding="async" />\n</a>`;
        }
      }

      // Theme Selector handlers
      themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          themeBtns.forEach(b => {
            b.setAttribute('aria-pressed', String(b === btn));
            b.classList.remove('active', 'bg-slate-900', 'border-slate-900', 'text-white');
            b.classList.add('bg-white', 'border-slate-200', 'text-slate-700');
          });
          btn.classList.add('active', 'bg-slate-900', 'border-slate-900', 'text-white');
          btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-700');
          currentTheme = btn.getAttribute('data-theme');
          updateBadge();
        });
      });

      // Tier Selector handlers
      tierBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tierBtns.forEach(b => {
            b.setAttribute('aria-pressed', String(b === btn));
            b.classList.remove('active', 'bg-emerald-50', 'border-emerald-500', 'text-emerald-800', 'shadow-sm');
            b.classList.add('bg-white', 'border-slate-200', 'text-slate-700');
          });
          btn.classList.add('active', 'bg-emerald-50', 'border-emerald-500', 'text-emerald-800', 'shadow-sm');
          btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-700');
          currentTier = btn.getAttribute('data-tier');
          updateBadge();
        });
      });

      // Canvas Background Switcher
      canvasBgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          canvasBgBtns.forEach(b => {
            b.setAttribute('aria-pressed', String(b === btn));
            b.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
            b.classList.add('text-slate-600');
          });
          btn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
          btn.classList.remove('text-slate-600');

          currentCanvasBg = btn.getAttribute('data-bg');
          if (badgePreviewContainer) {
            badgePreviewContainer.classList.remove('bg-white', 'border-slate-200', 'bg-slate-950', 'border-slate-800', 'canvas-bg-grid', 'border-slate-300');
            if (currentCanvasBg === 'dark') {
              badgePreviewContainer.classList.add('bg-slate-950', 'border-slate-800');
              if (badgePreviewHelper) badgePreviewHelper.className = 'text-xs font-mono text-emerald-400 font-semibold group-hover:underline hidden sm:inline';
            } else if (currentCanvasBg === 'grid') {
              badgePreviewContainer.classList.add('canvas-bg-grid', 'border-slate-300');
              if (badgePreviewHelper) badgePreviewHelper.className = 'text-xs font-mono text-emerald-700 font-semibold group-hover:underline hidden sm:inline';
            } else {
              badgePreviewContainer.classList.add('bg-white', 'border-slate-200');
              if (badgePreviewHelper) badgePreviewHelper.className = 'text-xs font-mono text-emerald-600 font-semibold group-hover:underline hidden sm:inline';
            }
          }
        });
      });

      // Canvas Zoom Switcher
      canvasZoomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          canvasZoomBtns.forEach(b => {
            b.setAttribute('aria-pressed', String(b === btn));
            b.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
            b.classList.add('text-slate-600');
          });
          btn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
          btn.classList.remove('text-slate-600');

          currentZoom = parseFloat(btn.getAttribute('data-zoom')) || 1;
          if (badgeSvgMount) {
            badgeSvgMount.style.transform = `scale(${currentZoom})`;
            badgeSvgMount.style.transformOrigin = 'left center';
          }
        });
      });

      // Quick Preset Label Chips
      presetLabelChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const preset = chip.getAttribute('data-preset');
          if (preset) {
            customLabelInput.value = preset.toUpperCase();
            updateBadge();
          }
        });
      });

      // Registry Quick Select dropdown
      if (registryQuickSelect) {
        registryQuickSelect.addEventListener('change', () => {
          const val = registryQuickSelect.value;
          if (val === 'custom') {
            slugInput.focus();
          } else if (val) {
            slugInput.value = val;
            updateBadge(val);
          }
        });
      }

      slugInput.addEventListener('input', () => updateBadge());
      customLabelInput.addEventListener('input', () => {
        customLabelInput.value = customLabelInput.value.toUpperCase();
        updateBadge();
      });

      clearCustomLabelBtn.addEventListener('click', () => {
        customLabelInput.value = '';
        updateBadge();
      });

      // Quick preset slugs
      document.querySelectorAll('.preset-slug').forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug');
          updateBadge(slug);
        });
      });

      // Download SVG handler
      btnDownloadBadgeSvg.addEventListener('click', () => {
        const slug = slugInput.value.trim().toLowerCase() || 'ztds-badge';
        const themeSuffix = currentTheme === 'light' ? '-light' : '';
        const tierSuffix = `-${currentTier.toLowerCase().replace(/\s+/g, '-')}`;
        const blob = new Blob([currentSvgXml], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}${tierSuffix}${themeSuffix}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // Copy Markdown
      document.getElementById('copyMdBtn').addEventListener('click', () => {
        window.ztdsCopy(codeMd.textContent, () => {
          const btn = document.getElementById('copyMdBtn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy Markdown', 2000);
        });
      });

      // Copy HTML
      document.getElementById('copyHtmlBtn').addEventListener('click', () => {
        window.ztdsCopy(codeHtml.textContent, () => {
          const btn = document.getElementById('copyHtmlBtn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy HTML', 2000);
        });
      });

      // Copy Raw SVG
      document.getElementById('copySvgBtn').addEventListener('click', () => {
        window.ztdsCopy(codeSvg.textContent, () => {
          const btn = document.getElementById('copySvgBtn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy SVG', 2000);
        });
      });

      // Copy React / Next.js JSX
      const copyReactBtn = document.getElementById('copyReactBtn');
      if (copyReactBtn) {
        copyReactBtn.addEventListener('click', () => {
          window.ztdsCopy(codeReact.textContent, () => {
            copyReactBtn.textContent = 'Copied!';
            setTimeout(() => copyReactBtn.textContent = 'Copy JSX', 2000);
          });
        });
      }

      // Copy Seal HTML Embed
      document.querySelectorAll('.copy-seal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.getAttribute('data-url');
          const snippet = `<a href="https://ztds.ai/registry/" target="_blank" rel="noopener"><img src="${url}" alt="ZTDS Conformance Seal" width="280" height="56" decoding="async"></a>`;
          window.ztdsCopy(snippet, () => {
            const original = btn.textContent;
            btn.textContent = 'Copied Snippet!';
            setTimeout(() => btn.textContent = original, 2000);
          });
        });
      });

      // Download Seal Vector
      document.querySelectorAll('.download-seal-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const file = btn.getAttribute('data-file');
          try {
            const res = await fetch(`/badge/${file}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (_) {
            window.open(`/badge/${file}`, '_blank');
          }
        });
      });

      // Hydrate from URL query parameters (?slug=, ?domain=, ?tier=, ?theme=, ?label=)
      try {
        const params = new URLSearchParams(window.location.search);
        const qDomain = params.get('domain');
        const qSlug = params.get('slug') || params.get('entity');
        const qTier = params.get('tier');
        const qTheme = params.get('theme') || params.get('style');
        const qLabel = params.get('label');
        if (qDomain) {
          const cleanDom = qDomain
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '')
            .split('/')[0]
            .replace(/[^a-z0-9.-]/g, '');
          if (cleanDom) slugInput.value = cleanDom;
        } else if (qSlug) {
          slugInput.value = qSlug.trim().toLowerCase().replace(/[^a-z0-9.-]/g, '');
        }
        if (qTier) {
          const matchTier = Array.from(tierBtns).find(b => (b.getAttribute('data-tier') || '').toLowerCase() === qTier.trim().toLowerCase());
          if (matchTier) matchTier.click();
        }
        if (qTheme) {
          const matchTheme = Array.from(themeBtns).find(b => (b.getAttribute('data-theme') || '').toLowerCase() === qTheme.trim().toLowerCase());
          if (matchTheme) matchTheme.click();
        }
        if (qLabel) {
          customLabelInput.value = qLabel.trim().toUpperCase().slice(0, 24);
        }
      } catch (_) {}

      // Initial render
      updateBadge();
    })();
})();
