(function () {
  'use strict';

  const appFormContainer = document.getElementById('applyFormContainer');
  const applyFormEl = document.getElementById('applyForm');
  const formMountedAt = Date.now();

  const appNameInput = document.getElementById('appName');
  const appUrlInput = document.getElementById('appUrl');
  const orgNameInput = document.getElementById('orgName');
  const contactEmailInput = document.getElementById('contactEmail');
  const trackBtns = document.querySelectorAll('.track-btn');

  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const trackBadge = document.getElementById('trackBadge');
  const labelAppName = document.getElementById('labelAppName');
  const labelAppUrl = document.getElementById('labelAppUrl');
  const labelOrgName = document.getElementById('labelOrgName');
  const labelContactEmail = document.getElementById('labelContactEmail');

  const productFields = document.getElementById('productFieldsContainer');
  const companyFields = document.getElementById('companyFieldsContainer');
  const fellowFields = document.getElementById('fellowFieldsContainer');
  const appCategorySelect = document.getElementById('appCategory');
  const appProfileSelect = document.getElementById('appProfile');

  // Step & Progress UI
  const stepIndicator1 = document.getElementById('stepIndicator1');
  const stepIndicator2 = document.getElementById('stepIndicator2');
  const step1Subtitle = document.getElementById('step1Subtitle');
  const step2Subtitle = document.getElementById('step2Subtitle');
  const step1SelectedTrackLabel = document.getElementById('step1SelectedTrackLabel');
  const step2TrackBadge = document.getElementById('step2TrackBadge');
  const step2Subheading = document.getElementById('step2Subheading');
  const step1Panel = document.getElementById('step1Panel');
  const step2Panel = document.getElementById('step2Panel');
  const step1Error = document.getElementById('step1Error');
  const step1ErrorText = document.getElementById('step1ErrorText');
  const step2Error = document.getElementById('step2Error');
  const step2ErrorText = document.getElementById('step2ErrorText');

  const btnStep1Continue = document.getElementById('btnStep1Continue');
  const btnStep2Back = document.getElementById('btnStep2Back');
  const btnEditDetails = document.getElementById('btnEditDetails');
  const submitBtn = document.getElementById('submitBtn');

  const summaryEntityName = document.getElementById('summaryEntityName');
  const summaryEntityUrl = document.getElementById('summaryEntityUrl');

  // Step 2 Verification Controls
  const step2ProductVerification = document.getElementById('step2ProductVerification');
  const step2NonProductNote = document.getElementById('step2NonProductNote');
  const nonProductNoteTitle = document.getElementById('nonProductNoteTitle');
  const nonProductNoteBody = document.getElementById('nonProductNoteBody');
  const cliAuditCommand = document.getElementById('cliAuditCommand');
  const copyCliCommandBtn = document.getElementById('copyCliCommandBtn');
  const auditHashInput = document.getElementById('auditHash');
  const checkboxConfirmationText = document.getElementById('checkboxConfirmationText');

  // Benefits Sidebar Card
  const benefitsTrackLabel = document.getElementById('benefitsTrackLabel');
  const benefitsTitle = document.getElementById('benefitsTitle');
  const benefitsList = document.getElementById('benefitsList');

  // Live Badge Preview
  const badgePreviewMount = document.getElementById('badgePreviewMount');
  const badgeTrackPill = document.getElementById('badgeTrackPill');
  const badgeHintText = document.getElementById('badgeHintText');
  const badgeEmbedDetails = document.getElementById('badgeEmbedDetails');
  const badgeMarkdownSnippet = document.getElementById('badgeMarkdownSnippet');
  const badgeHtmlSnippet = document.getElementById('badgeHtmlSnippet');
  const downloadBadgeSvgBtn = document.getElementById('downloadBadgeSvgBtn');

  // Submission Result Elements
  const submissionSuccess = document.getElementById('submissionSuccess');
  const successHeading = document.getElementById('successHeading');
  const serverIntakeStatus = document.getElementById('serverIntakeStatus');
  const jsonTargetFile = document.getElementById('jsonTargetFile');
  const jsonPayloadCode = document.getElementById('jsonPayloadCode');
  const githubIssueLink = document.getElementById('githubIssueLink');
  const mailtoLink = document.getElementById('mailtoLink');
  const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');

  let currentStep = 1;
  let currentTrack = 'product';
  let currentSvgXml = '';
  let compiledMarkdown = '';
  let compiledJson = '';

  const TRACK_BENEFITS = {
    product: {
      badge: 'Track A \u00b7 Software',
      badgeClass: 'text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold',
      title: 'What Certified Software Gets',
      items: [
        { text: 'Permanent listing in the public ', linkLabel: 'ZTDS Verified Registry', linkHref: '/registry/', suffix: '.' },
        { text: 'Ed25519 cryptographic receipt and public ', linkLabel: 'validator link', linkHref: '/verify/', suffix: ' for enterprise InfoSec reviews.' },
        { text: 'Dynamic SVG trust badge for GitHub READMEs, docs, and pricing pages.' },
        { text: 'Machine-readable citation across ', linkLabel: 'llms.txt', linkHref: '/llms.txt', suffix: ' for AI answer engines.' }
      ]
    },
    company: {
      badge: 'Track B \u00b7 Enterprise',
      badgeClass: 'text-xs font-mono uppercase tracking-wider text-blue-700 font-bold',
      title: 'What Corporate Adopters Get',
      items: [
        { text: 'Listing in the public ', linkLabel: 'Corporate Adopters Directory', linkHref: '/companies/', suffix: ' as verified organizational proof.' },
        { text: 'Documented technical due diligence for GDPR Art. 32 and Israel Amendment 13 Sec. 17.' },
        { text: 'Executive audit record demonstrating Zero Sanitization Subprocessors (GDPR Art. 28).' },
        { text: 'No GitHub account required \u2014 verified asynchronously within 48 hours via form or email.' }
      ]
    },
    fellow: {
      badge: 'Track C \u00b7 Academic',
      badgeClass: 'text-xs font-mono uppercase tracking-wider text-purple-700 font-bold',
      title: 'What Research Fellows Get',
      items: [
        { text: 'Standalone profile and Schema.org Person graph in the ', linkLabel: 'Research Fellows Council', linkHref: '/fellows/', suffix: '.' },
        { text: 'Canonical ORCID / Zenodo DOI cross-citation across ZTDS RFC documentation and ', linkLabel: 'llms.txt', linkHref: '/llms.txt', suffix: '.' },
        { text: 'Dedicated Fellow trust seal SVG and Working Group attribution.' },
        { text: 'Peer review and induction completed asynchronously within 48 hours.' }
      ]
    }
  };

  function generateSlug(val) {
    if (!val) return 'your-app';
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-app';
  }

  function normalizeHttpUrl(raw) {
    const val = String(raw || '').trim();
    if (!val) return '';
    if (/^https?:\/\//i.test(val)) return val;
    if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(val)) return 'https://' + val;
    return val;
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function createCheckSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'w-4 h-4 text-emerald-600 shrink-0 mt-0.5');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M5 13l4 4L19 7');
    svg.appendChild(path);
    return svg;
  }

  function createStepDoneSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'w-3.5 h-3.5');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M5 13l4 4L19 7');
    svg.appendChild(path);
    return svg;
  }

  function renderBenefitsCard(track) {
    const cfg = TRACK_BENEFITS[track] || TRACK_BENEFITS.product;
    if (benefitsTrackLabel) {
      benefitsTrackLabel.textContent = cfg.badge;
      benefitsTrackLabel.className = cfg.badgeClass;
    }
    if (benefitsTitle) benefitsTitle.textContent = cfg.title;
    if (!benefitsList) return;

    const nodes = cfg.items.map((item) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      li.appendChild(createCheckSvg());
      const span = document.createElement('span');
      if (item.linkLabel && item.linkHref) {
        span.appendChild(document.createTextNode(item.text));
        const a = document.createElement('a');
        a.href = item.linkHref;
        a.className = 'underline font-semibold text-slate-800';
        a.textContent = item.linkLabel;
        span.appendChild(a);
        if (item.suffix) span.appendChild(document.createTextNode(item.suffix));
      } else {
        span.textContent = item.text;
      }
      li.appendChild(span);
      return li;
    });
    benefitsList.replaceChildren(...nodes);
  }

  function generateBadgeSvg(label, colorRight, textColorRight) {
    const rawLabel = String(label || 'VERIFIED').trim().toUpperCase();
    const cleanLabel = escapeXml(rawLabel);
    const wLeft = 58;
    const charWidth = 6.8;
    const wRight = Math.max(64, Math.round(rawLabel.length * charWidth + 16));
    const totalWidth = wLeft + wRight;
    const textXRight = wLeft + Math.round(wRight / 2);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="applyBadgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#applyBadgeClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="${colorRight}"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="${textColorRight}" letter-spacing="0.6">${cleanLabel}</text>
  </g>
</svg>`.trim();
  }

  function updateCliCommand() {
    if (!cliAuditCommand) return;
    const rawUrl = normalizeHttpUrl(appUrlInput ? appUrlInput.value : '') || 'https://example.com';
    const profile = appProfileSelect ? appProfileSelect.value : 'general';
    cliAuditCommand.textContent = `npx ztds-audit --target ${rawUrl} --dir ./src --profile ${profile}`;
  }

  function updateBadgeAndSnippets() {
    const name = appNameInput ? appNameInput.value.trim() : '';
    const slug = generateSlug(name);

    let badgeLabel = 'VERIFIED';
    let colorRight = '#059669';
    let textColorRight = '#ffffff';

    if (currentTrack === 'product') {
      if (badgeTrackPill) {
        badgeTrackPill.textContent = 'Track A: Verified';
        badgeTrackPill.className = 'text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200';
      }
      badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... \u00b7 VERIFIED' : name.toUpperCase() + ' \u00b7 VERIFIED') : 'VERIFIED';
      colorRight = '#059669';
      textColorRight = '#ffffff';
    } else if (currentTrack === 'company') {
      if (badgeTrackPill) {
        badgeTrackPill.textContent = 'Track B: Adopter';
        badgeTrackPill.className = 'text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200';
      }
      badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... \u00b7 ADOPTER' : name.toUpperCase() + ' \u00b7 ADOPTER') : 'ADOPTER';
      colorRight = '#2563eb';
      textColorRight = '#ffffff';
    } else {
      if (badgeTrackPill) {
        badgeTrackPill.textContent = 'Track C: Fellow';
        badgeTrackPill.className = 'text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200';
      }
      badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... \u00b7 FELLOW' : name.toUpperCase() + ' \u00b7 FELLOW') : 'FELLOW';
      colorRight = '#0f172a';
      textColorRight = '#10b981';
    }

    currentSvgXml = generateBadgeSvg(badgeLabel, colorRight, textColorRight);
    if (badgePreviewMount && window.ztdsMountBadgeSvg) {
      window.ztdsMountBadgeSvg(badgePreviewMount, badgeLabel, colorRight, textColorRight);
    }

    const badgeUrl = `https://ztds.ai/badge/${slug}.svg`;
    const targetUrl = currentTrack === 'company'
      ? `https://ztds.ai/companies/${slug}/`
      : (currentTrack === 'fellow' ? `https://ztds.ai/fellows/${slug}/` : `https://ztds.ai/registry/#${slug}`);

    if (badgeMarkdownSnippet) badgeMarkdownSnippet.value = `[![ZTDS ${badgeLabel}](${badgeUrl})](${targetUrl})`;
    if (badgeHtmlSnippet) badgeHtmlSnippet.value = `<a href="${targetUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="ZTDS Conformance" width="168" height="22" decoding="async"></a>`;

    if (badgeHintText) {
      badgeHintText.textContent = name.length >= 2
        ? `Live preview for "${name}" (${slug}.svg after Board approval).`
        : 'Enter your product or entity name in Step 1 to generate personalized embed snippets.';
    }
    if (badgeEmbedDetails && name.length >= 2 && !badgeEmbedDetails.dataset.userToggled) {
      badgeEmbedDetails.open = true;
    }

    updateCliCommand();
  }

  function updateSummaryBar() {
    if (summaryEntityName && appNameInput) {
      summaryEntityName.textContent = appNameInput.value.trim() || 'Pending Entity';
    }
    if (summaryEntityUrl && appUrlInput) {
      summaryEntityUrl.textContent = normalizeHttpUrl(appUrlInput.value) || 'https://example.com';
    }
  }

  function updateWizardStepsUI(step) {
    currentStep = step;

    if (step1Panel) step1Panel.classList.toggle('hidden', step !== 1);
    if (step2Panel) step2Panel.classList.toggle('hidden', step !== 2);

    if (stepIndicator1) {
      const num1 = stepIndicator1.querySelector('.step-num');
      if (step === 1) {
        stepIndicator1.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 cursor-pointer transition-all shadow-xs flex flex-col items-start justify-center min-h-[44px]';
        stepIndicator1.setAttribute('aria-current', 'step');
        if (num1) {
          num1.className = 'step-num w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
          num1.replaceChildren(document.createTextNode('1'));
        }
      } else {
        stepIndicator1.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-emerald-500 bg-white text-emerald-950 cursor-pointer transition-all flex flex-col items-start justify-center min-h-[44px]';
        stepIndicator1.removeAttribute('aria-current');
        if (num1) {
          num1.className = 'step-num w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0';
          num1.replaceChildren(createStepDoneSvg());
        }
      }
    }

    if (stepIndicator2) {
      const num2 = stepIndicator2.querySelector('.step-num');
      if (step === 2) {
        stepIndicator2.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 cursor-pointer transition-all shadow-xs flex flex-col items-start justify-center min-h-[44px]';
        stepIndicator2.setAttribute('aria-current', 'step');
        if (num2) {
          num2.className = 'step-num w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
          num2.replaceChildren(document.createTextNode('2'));
        }
      } else {
        stepIndicator2.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 cursor-pointer transition-all opacity-80 hover:opacity-100 flex flex-col items-start justify-center min-h-[44px]';
        stepIndicator2.removeAttribute('aria-current');
        if (num2) {
          num2.className = 'step-num w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0';
          num2.replaceChildren(document.createTextNode('2'));
        }
      }
    }
  }

  function showStep1Error(msg) {
    if (step1Error && step1ErrorText) {
      step1ErrorText.textContent = msg;
      step1Error.classList.remove('hidden');
      step1Error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function validateStep1() {
    const name = appNameInput ? appNameInput.value.trim() : '';
    const normalizedUrl = appUrlInput ? normalizeHttpUrl(appUrlInput.value) : '';
    if (appUrlInput && normalizedUrl && normalizedUrl !== appUrlInput.value.trim()) {
      appUrlInput.value = normalizedUrl;
    }
    const org = orgNameInput ? orgNameInput.value.trim() : '';
    const email = contactEmailInput ? contactEmailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      showStep1Error('Please enter a name for the product, enterprise, or nominee.');
      if (appNameInput) appNameInput.focus();
      return false;
    }
    if (!normalizedUrl || !/^https?:\/\/.+\..+/i.test(normalizedUrl)) {
      showStep1Error('Please provide a valid website or repository URL (e.g. https://example.com).');
      if (appUrlInput) appUrlInput.focus();
      return false;
    }
    if (!org) {
      showStep1Error('Please enter your organization, CISO, or maintainer name.');
      if (orgNameInput) orgNameInput.focus();
      return false;
    }
    if (!email || !emailRegex.test(email)) {
      showStep1Error('Please provide a valid contact email address (e.g. security@example.com).');
      if (contactEmailInput) contactEmailInput.focus();
      return false;
    }

    if (step1Error) step1Error.classList.add('hidden');
    return true;
  }

  function scrollToWizardForm() {
    if (appFormContainer) {
      appFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goToStep(targetStep) {
    if (targetStep === 1) {
      updateWizardStepsUI(1);
      scrollToWizardForm();
    } else if (targetStep === 2) {
      if (validateStep1()) {
        updateSummaryBar();
        updateWizardStepsUI(2);
        scrollToWizardForm();
      }
    }
  }

  function safeCopyText(text, btn, successLabel) {
    if (!text) return;
    const orig = btn.textContent;
    const notify = () => {
      btn.textContent = successLabel || 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    };
    if (typeof window.ztdsCopy === 'function') {
      window.ztdsCopy(text, notify);
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(notify).catch(() => {});
    } else {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        notify();
      } catch (_) {}
    }
  }

  if (copyCliCommandBtn && cliAuditCommand) {
    copyCliCommandBtn.addEventListener('click', () => {
      safeCopyText(cliAuditCommand.textContent, copyCliCommandBtn, 'Copied!');
    });
  }

  if (downloadBadgeSvgBtn) {
    downloadBadgeSvgBtn.addEventListener('click', () => {
      const slug = generateSlug(appNameInput ? appNameInput.value.trim() : '');
      const blob = new Blob([currentSvgXml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-ztds.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (badgeEmbedDetails) {
    const summaryEl = badgeEmbedDetails.querySelector('summary');
    if (summaryEl) {
      summaryEl.addEventListener('click', () => {
        badgeEmbedDetails.dataset.userToggled = 'true';
      });
    }
  }

  function setTrack(track) {
    currentTrack = ['product', 'company', 'fellow'].includes(track) ? track : 'product';

    trackBtns.forEach(b => {
      const btnTrack = b.getAttribute('data-track');
      const isCurrent = btnTrack === currentTrack;
      b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        if (appFormContainer && b.id) appFormContainer.setAttribute('aria-labelledby', b.id);
        const accent = btnTrack === 'company' ? 'border-blue-600 bg-blue-50/70' : (btnTrack === 'fellow' ? 'border-purple-600 bg-purple-50/70' : 'border-emerald-600 bg-emerald-50/70');
        b.className = `track-btn text-left p-3 rounded-xl border-2 ${accent} text-slate-900 shadow-xs min-h-[56px] touch-target transition-all flex flex-col justify-center`;
      } else {
        b.className = 'track-btn text-left p-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[56px] touch-target transition-all flex flex-col justify-center';
      }
    });

    if (currentTrack === 'product') {
      if (formTitle) formTitle.textContent = 'Product Certification Application';
      if (formSubtitle) formSubtitle.textContent = 'For AI applications, SaaS tools, browser extensions, SDKs, and MCP servers.';
      if (trackBadge) {
        trackBadge.textContent = 'Track A';
        trackBadge.className = 'pill-trust shrink-0';
      }
      if (step1Subtitle) step1Subtitle.textContent = 'Product Certification';
      if (step2Subtitle) step2Subtitle.textContent = 'Verify & Submit';
      if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Track A \u00b7 Product Certification';
      if (step2TrackBadge) step2TrackBadge.textContent = 'Track A Verification';
      if (step2Subheading) step2Subheading.textContent = 'Attach an optional local CLI audit receipt, confirm your architecture, and submit for 48-hour Board review.';
      if (labelAppName) labelAppName.textContent = 'Product or Library Name *';
      if (appNameInput) appNameInput.placeholder = 'e.g. My AI SaaS, AgentProxy';
      if (labelAppUrl) labelAppUrl.textContent = 'Website or Repository URL *';
      if (labelOrgName) labelOrgName.textContent = 'Organization / Maintainer Name *';
      if (productFields) productFields.classList.remove('hidden');
      if (companyFields) companyFields.classList.add('hidden');
      if (fellowFields) fellowFields.classList.add('hidden');
      if (step2ProductVerification) step2ProductVerification.classList.remove('hidden');
      if (step2NonProductNote) step2NonProductNote.classList.add('hidden');
      if (checkboxConfirmationText) {
        const strongZero = document.createElement('strong');
        strongZero.textContent = '0.00 bytes';
        checkboxConfirmationText.replaceChildren(
          document.createTextNode('I confirm that this software executes de-identification locally in client volatile memory with '),
          strongZero,
          document.createTextNode(' cleartext PII/PHI transmitted across external network sockets prior to sanitization.')
        );
      }
      if (submitBtn) submitBtn.textContent = 'Submit Application & Generate Record \u2192';
    } else if (currentTrack === 'company') {
      if (formTitle) formTitle.textContent = 'Corporate Adopter Registration';
      if (formSubtitle) formSubtitle.textContent = 'Document client-side Zero-Trust data isolation across your organization for CISO & DPO sign-off.';
      if (trackBadge) {
        trackBadge.textContent = 'Track B';
        trackBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0';
      }
      if (step1Subtitle) step1Subtitle.textContent = 'Corporate Adopter';
      if (step2Subtitle) step2Subtitle.textContent = 'Policy Attestation';
      if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Track B \u00b7 Corporate Adopter';
      if (step2TrackBadge) step2TrackBadge.textContent = 'Track B Attestation';
      if (step2Subheading) step2Subheading.textContent = 'Confirm your organization policy and submit for asynchronous 48-hour Safe Harbor listing.';
      if (labelAppName) labelAppName.textContent = 'Company / Enterprise Name *';
      if (appNameInput) appNameInput.placeholder = 'e.g. Acme Health Corp, TechGlobal';
      if (labelAppUrl) labelAppUrl.textContent = 'Company Website URL *';
      if (labelOrgName) labelOrgName.textContent = 'Head of Security / CISO Full Name *';
      if (productFields) productFields.classList.add('hidden');
      if (companyFields) companyFields.classList.remove('hidden');
      if (fellowFields) fellowFields.classList.add('hidden');
      if (step2ProductVerification) step2ProductVerification.classList.add('hidden');
      if (step2NonProductNote) step2NonProductNote.classList.remove('hidden');
      if (nonProductNoteTitle) nonProductNoteTitle.textContent = 'Enterprise Track \u2014 No CLI or GitHub account required';
      if (nonProductNoteBody) nonProductNoteBody.textContent = 'Submit directly using this web form. The ZTDS Review Board verifies organizational Safe Harbor due diligence asynchronously within 48 hours and emails your registry confirmation.';
      if (checkboxConfirmationText) {
        checkboxConfirmationText.textContent = 'I confirm that our organization mandates client-side Zero-Trust Data Sanitization across internal AI workflows with Zero Sanitization Subprocessors (GDPR Art. 28) and Technical Safe Harbor controls (GDPR Art. 32 / Israel Amendment 13 Sec. 17).';
      }
      if (submitBtn) submitBtn.textContent = 'Submit Corporate Registration \u2192';
    } else {
      if (formTitle) formTitle.textContent = 'Research Fellow Nomination';
      if (formSubtitle) formSubtitle.textContent = 'Nominate an academic researcher, cryptographer, or systems architect to the ZTDS Fellows Council.';
      if (trackBadge) {
        trackBadge.textContent = 'Track C';
        trackBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0';
      }
      if (step1Subtitle) step1Subtitle.textContent = 'Research Fellow';
      if (step2Subtitle) step2Subtitle.textContent = 'Fellow Induction';
      if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Track C \u00b7 Research Fellow';
      if (step2TrackBadge) step2TrackBadge.textContent = 'Track C Nomination';
      if (step2Subheading) step2Subheading.textContent = 'Confirm research credentials and submit for peer-reviewed Fellows Council onboarding.';
      if (labelAppName) labelAppName.textContent = 'Nominee Full Name *';
      if (appNameInput) appNameInput.placeholder = 'e.g. Dr. Jane Doe, Prof. Alan Turing';
      if (labelAppUrl) labelAppUrl.textContent = 'Academic Profile, ORCID, or Portfolio URL *';
      if (labelOrgName) labelOrgName.textContent = 'Nominator Name & Affiliation *';
      if (productFields) productFields.classList.add('hidden');
      if (companyFields) companyFields.classList.add('hidden');
      if (fellowFields) fellowFields.classList.remove('hidden');
      if (step2ProductVerification) step2ProductVerification.classList.add('hidden');
      if (step2NonProductNote) step2NonProductNote.classList.remove('hidden');
      if (nonProductNoteTitle) nonProductNoteTitle.textContent = 'Research Track \u2014 Direct academic intake';
      if (nonProductNoteBody) nonProductNoteBody.textContent = 'Fellow nominations are reviewed directly by the Consortium Chair within 48 hours without requiring CLI audits or local code builds.';
      if (checkboxConfirmationText) {
        checkboxConfirmationText.textContent = 'I confirm that this nominee has authored peer-reviewed research, legal frameworks, or open cryptographic/zero-trust security tooling.';
      }
      if (submitBtn) submitBtn.textContent = 'Submit Fellow Nomination \u2192';
    }

    renderBenefitsCard(currentTrack);
    updateBadgeAndSnippets();
  }

  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTrack(btn.getAttribute('data-track'));
      if (window.history && window.history.replaceState) {
        const p = new URLSearchParams(window.location.search);
        const t = btn.getAttribute('data-track') || 'product';
        if (t !== 'product') p.set('track', t);
        else p.delete('track');
        const qs = p.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      }
    });
  });

  if (btnStep1Continue) btnStep1Continue.addEventListener('click', () => goToStep(2));
  if (btnStep2Back) btnStep2Back.addEventListener('click', () => goToStep(1));
  if (btnEditDetails) btnEditDetails.addEventListener('click', () => goToStep(1));

  if (stepIndicator1) stepIndicator1.addEventListener('click', () => goToStep(1));
  if (stepIndicator2) stepIndicator2.addEventListener('click', () => goToStep(2));

  [stepIndicator1, stepIndicator2].forEach(indicator => {
    if (!indicator) return;
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const step = parseInt(indicator.getAttribute('data-step'), 10);
        if (step) goToStep(step);
      }
    });
  });

  // Prevent premature submit on Enter in Step 1 (IME-safe)
  if (applyFormEl) {
    let lastApplyCompositionEndAt = null;
    applyFormEl.addEventListener('compositionend', (ev) => {
      lastApplyCompositionEndAt = ev.timeStamp;
    });
    applyFormEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && currentStep !== 2) {
        if (e.isComposing || e.keyCode === 229) return;
        if (lastApplyCompositionEndAt !== null && Math.abs(e.timeStamp - lastApplyCompositionEndAt) < 50) return;
        e.preventDefault();
        goToStep(2);
      }
    });
  }

  if (appNameInput) appNameInput.addEventListener('input', updateBadgeAndSnippets);
  if (appUrlInput) appUrlInput.addEventListener('input', updateBadgeAndSnippets);
  if (appProfileSelect) {
    appProfileSelect.addEventListener('change', () => {
      const fwHipaa = document.getElementById('fwHipaa');
      if (fwHipaa && (appProfileSelect.value === 'medical' || appProfileSelect.value === 'biotech')) {
        fwHipaa.checked = true;
      }
      updateBadgeAndSnippets();
    });
  }

  // Deep-link URL parameter hydration (?track=, ?domain=, ?profile=, ?hash=, ?company=, ?industry=, ?slug=, ?name=, ?url=, ?focus=)
  const urlParams = new URLSearchParams(window.location.search);
  const rawInitialTrack = urlParams.get('track');
  const qDomain = (urlParams.get('domain') || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
  const qUrl = (urlParams.get('url') || '').trim();
  const qCompany = (urlParams.get('company') || urlParams.get('org') || '').trim();
  const qName = (urlParams.get('name') || urlParams.get('slug') || '').trim();
  const qProfile = (urlParams.get('profile') || '').trim().toLowerCase();
  const qIndustry = (urlParams.get('industry') || '').trim().toLowerCase();
  const qHash = (urlParams.get('hash') || '').trim();
  const paramFocus = (urlParams.get('focus') || '').trim().toLowerCase();

  const initialTrack = rawInitialTrack === 'case-study'
    ? 'company'
    : (rawInitialTrack || (qCompany ? 'company' : null));

  if (initialTrack && ['product', 'company', 'fellow'].includes(initialTrack)) {
    setTrack(initialTrack);
    if (rawInitialTrack === 'case-study') {
      const companyScopeEl = document.getElementById('companyScope');
      if (companyScopeEl && !companyScopeEl.value) {
        companyScopeEl.value = 'Enterprise Case Study & Field Validation Report';
      }
    }
  } else {
    renderBenefitsCard(currentTrack);
  }

  if (qUrl && appUrlInput && !appUrlInput.value) {
    appUrlInput.value = normalizeHttpUrl(qUrl);
  } else if (qDomain && appUrlInput && !appUrlInput.value) {
    appUrlInput.value = 'https://' + qDomain;
  }

  if ((qCompany || qName) && appNameInput && !appNameInput.value) {
    appNameInput.value = qCompany || qName;
  } else if (qDomain && appNameInput && !appNameInput.value) {
    const hostBase = qDomain.split('.')[0] || '';
    if (hostBase) {
      appNameInput.value = hostBase.charAt(0).toUpperCase() + hostBase.slice(1);
    }
  }

  if (qProfile && appProfileSelect) {
    const profileAliases = {
      hipaa: 'medical',
      healthcare: 'medical',
      fintech: 'finance',
      banking: 'finance',
      saas: 'dev',
      defense: 'government',
      siem: 'security',
      secops: 'security'
    };
    const mappedProfile = profileAliases[qProfile] || qProfile;
    const optMatch = Array.from(appProfileSelect.options).find(o => o.value.toLowerCase() === mappedProfile);
    if (optMatch) {
      appProfileSelect.value = optMatch.value;
      const fwHipaa = document.getElementById('fwHipaa');
      if (fwHipaa && (optMatch.value === 'medical' || optMatch.value === 'biotech')) {
        fwHipaa.checked = true;
      }
    }
  }

  if (qIndustry) {
    const companyIndustryEl = document.getElementById('companyIndustry');
    if (companyIndustryEl) {
      const industryAliases = {
        healthcare: 'Healthcare & Hospital EHR',
        hipaa: 'Healthcare & Hospital EHR',
        medical: 'Healthcare & Hospital EHR',
        finance: 'Commercial Banking & FinTech',
        fintech: 'Commercial Banking & FinTech',
        banking: 'Commercial Banking & FinTech',
        legal: 'Corporate Law & LegalTech',
        saas: 'B2B Enterprise SaaS',
        agency: 'Digital Agency & GEO Marketing',
        defense: 'Sovereign & Defense Tech',
        sovereign: 'Sovereign & Defense Tech',
        voice: 'B2B Enterprise SaaS'
      };
      const targetLabel = industryAliases[qIndustry] || qIndustry;
      const indOpt = Array.from(companyIndustryEl.options).find(
        o => o.value.toLowerCase() === targetLabel.toLowerCase() || o.value.toLowerCase().includes(qIndustry)
      );
      if (indOpt) companyIndustryEl.value = indOpt.value;
    }
  }

  const fellowTrackSelect = document.getElementById('fellowTrack');
  if (paramFocus && fellowTrackSelect) {
    if (paramFocus === 'crypto') fellowTrackSelect.value = 'WG-1 Architecture & Cryptography';
    else if (paramFocus === 'legal' || paramFocus === 'grc') fellowTrackSelect.value = 'WG-2 GRC & Regulatory Standard';
    else if (paramFocus === 'systems') fellowTrackSelect.value = 'WG-3 Systems, Enclaves & WASM Runtime';
    else if (paramFocus === 'profiles') fellowTrackSelect.value = 'WG-4 Industry Profiles & Entity Taxonomy';
  }

  if (qHash && auditHashInput && !auditHashInput.value) {
    auditHashInput.value = qHash.startsWith('sha256:') ? qHash : 'sha256:' + qHash;
  }

  if (qDomain) {
    const banner = document.createElement('div');
    banner.className = 'mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-xs';
    const leftWrap = document.createElement('div');
    leftWrap.className = 'flex items-center gap-2';
    const dotEl = document.createElement('span');
    dotEl.className = 'w-2 h-2 rounded-full bg-emerald-500 shrink-0';
    const labelSpan = document.createElement('span');
    const domStrong = document.createElement('strong');
    domStrong.textContent = qDomain;
    labelSpan.append(document.createTextNode('Pre-filled from Live Perimeter Audit: '), domStrong);
    if (qProfile) {
      const profSpan = document.createElement('span');
      profSpan.className = 'uppercase text-emerald-700 font-bold';
      profSpan.textContent = qProfile + ' Profile';
      labelSpan.append(document.createTextNode(' \u00b7 '), profSpan);
    }
    leftWrap.append(dotEl, labelSpan);
    const rightSpan = document.createElement('span');
    rightSpan.className = 'text-slate-600 text-xs font-sans';
    rightSpan.textContent = 'Add maintainer & email below to continue';
    banner.append(leftWrap, rightSpan);
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.insertBefore(banner, mainContainer.children[1] || mainContainer.firstChild);
    }
  }

  updateBadgeAndSnippets();

  function attachCopyButton(buttonId, inputId) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      safeCopyText(input.value, btn, 'Copied!');
    });
  }
  attachCopyButton('copyMarkdownSnippetBtn', 'badgeMarkdownSnippet');
  attachCopyButton('copyHtmlSnippetBtn', 'badgeHtmlSnippet');

  if (applyFormEl) {
    applyFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (currentStep !== 2) {
        goToStep(2);
        return;
      }

      const confirmCheckbox = document.getElementById('confirmCheckbox');
      if (confirmCheckbox && !confirmCheckbox.checked) {
        if (step2Error && step2ErrorText) {
          step2ErrorText.textContent = 'Please confirm the attestation checkbox before submitting your application.';
          step2Error.classList.remove('hidden');
          step2Error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }
      if (step2Error) step2Error.classList.add('hidden');

      const appName = appNameInput.value.trim();
      const appUrl = normalizeHttpUrl(appUrlInput.value);
      const orgName = orgNameInput.value.trim();
      const contactEmail = contactEmailInput.value.trim();
      const slug = generateSlug(appName);
      const today = new Date().toISOString().split('T')[0];

      let titlePrefix = '[Track A: Verification]';
      let jsonTarget = 'data/registry.json';
      let formattedJson = '';
      let markdownBody = '';

      if (currentTrack === 'product') {
        const appCategory = appCategorySelect ? appCategorySelect.value : 'WebPlatform';
        const profile = appProfileSelect ? appProfileSelect.value : 'general';
        const auditHashRaw = auditHashInput ? auditHashInput.value.trim() : '';
        const auditHash = auditHashRaw || 'pending-board-audit';
        const auditHashNote = auditHashRaw
          ? `\`${auditHashRaw}\``
          : 'Pending Consortium Board verification (`npx ztds-audit`)';

        const fwList = [];
        if (document.getElementById('fwGdpr')?.checked) fwList.push('GDPR Art. 28 Zero Sanitization Subprocessors & Art. 32');
        if (document.getElementById('fwAiAct')?.checked) fwList.push('EU AI Act Art. 50');
        if (document.getElementById('fwSoc2')?.checked) fwList.push('SOC 2 Type II');
        if (document.getElementById('fwHipaa')?.checked) fwList.push('HIPAA Safe Harbor');
        if (document.getElementById('fwFre502')?.checked) fwList.push('US FRE 502(b)');
        if (document.getElementById('fwPciDss')?.checked) fwList.push('PCI-DSS v4.0');

        const jsonEntry = {
          id: slug,
          name: appName,
          slug: slug,
          url: appUrl,
          category: appCategory,
          profile: profile,
          tier: 'Community Verified',
          license: 'Commercial / Proprietary',
          description: `${appName} client-side zero-trust de-identification implementation.`,
          architecture: 'RAM-Only Execution / WebAssembly & Local Sanitization',
          verified_date: today,
          verified_hash: auditHash,
          badge_url: `https://ztds.ai/badge/${slug}.svg`,
          frameworks: fwList
        };

        formattedJson = JSON.stringify(jsonEntry, null, 2);

        markdownBody = `## ZTDS Accreditation Submission: ${appName}\n\n` +
          `### Submission Overview\n` +
          `- **Track**: Track A (Software & Product Certification)\n` +
          `- **Product Name**: ${appName}\n` +
          `- **URL**: ${appUrl}\n` +
          `- **Maintainer / Org**: ${orgName} (${contactEmail})\n` +
          `- **Category**: ${appCategory}\n` +
          `- **Target Profile**: ${profile}\n` +
          `- **Audit Hash**: ${auditHashNote}\n` +
          `- **Compliance Scope**: ${fwList.join(', ') || 'Core Zero-Egress'}\n\n` +
          `### Invariant Conformance Affirmation\n` +
          `- [x] Invariant 1: Zero External Egress Prior to Sanitization (0.00 bytes cleartext leaked)\n` +
          `- [x] Invariant 2: Deterministic Reversible Tokenization (isolated in client RAM)\n` +
          `- [x] Invariant 3: Verifiable Cryptographic Isolation (sandboxed V8 / WASM / Enclave)\n` +
          `- [x] Invariant 4: Continuous Compliance & Zero Sanitization Subprocessors (GDPR Art. 28 & Art. 32 Technical Safe Harbor)\n\n` +
          `### Proposed \`data/registry.json\` Entry\n\`\`\`json\n${formattedJson}\n\`\`\`\n\n` +
          `### Verification Command\n` +
          `\`\`\`bash\n` +
          `npx ztds-audit --target ${appUrl} --profile ${profile}\n` +
          `\`\`\`\n\n` +
          `*Submitted via ZTDS.ai Accreditation Gateway*`;

      } else if (currentTrack === 'company') {
        titlePrefix = '[Track B: Corporate Adopter]';
        jsonTarget = 'data/companies.json';
        const industry = document.getElementById('companyIndustry')?.value || 'B2B Enterprise SaaS';
        const hq = document.getElementById('companyHeadquarters')?.value.trim() || 'International';
        const scope = document.getElementById('companyScope')?.value.trim() || 'Client-side zero-trust AI workflows';

        const jsonEntry = {
          id: slug,
          slug: slug,
          name: appName,
          tier: 'Enterprise Adopter',
          industry: industry,
          url: appUrl,
          headquarters: hq,
          description: `${appName} mandates client-side Zero-Trust Data Sanitization across internal AI workflows.`,
          verified_date: today,
          compliance_scope: scope
        };

        formattedJson = JSON.stringify(jsonEntry, null, 2);

        markdownBody = `## ZTDS Corporate Adopter Registration: ${appName}\n\n` +
          `### Enterprise Profile\n` +
          `- **Enterprise**: ${appName}\n` +
          `- **Website**: ${appUrl}\n` +
          `- **Head of Security / CISO**: ${orgName} (${contactEmail})\n` +
          `- **Industry**: ${industry}\n` +
          `- **Headquarters**: ${hq}\n` +
          `- **Mandate Scope**: ${scope}\n\n` +
          `### Policy Affirmation\n` +
          `- [x] Mandatory client-side zero-trust sanitization on workstations & LLM pipelines\n` +
          `- [x] Zero Sanitization Subprocessors (GDPR Art. 28) & Technical Safe Harbor (GDPR Art. 32 / Israel Amendment 13 Sec. 17)\n\n` +
          `### Proposed \`data/companies.json\` Entry\n\`\`\`json\n${formattedJson}\n\`\`\`\n\n` +
          `*Submitted via ZTDS.ai Accreditation Gateway*`;

      } else {
        titlePrefix = '[Track C: Research Fellow]';
        jsonTarget = 'data/fellows.json';
        const trackFocus = document.getElementById('fellowTrack')?.value || 'WG-1 Architecture & Cryptography';
        const orcid = document.getElementById('fellowOrcid')?.value.trim() || 'ORCID Pending';
        const contribution = document.getElementById('fellowContribution')?.value.trim() || 'Zero-trust privacy and cryptographic research.';

        const jsonEntry = {
          id: slug,
          slug: slug,
          name: appName,
          role: 'Accredited Fellow',
          status: 'Nominated Fellow',
          track: trackFocus,
          affiliation: orgName,
          location: 'Global',
          orcid: orcid,
          contribution: contribution,
          verified_date: today
        };

        formattedJson = JSON.stringify(jsonEntry, null, 2);

        markdownBody = `## ZTDS Research Fellow Nomination: ${appName}\n\n` +
          `### Nominee Credentials\n` +
          `- **Nominee Name**: ${appName}\n` +
          `- **Profile / Portfolio URL**: ${appUrl}\n` +
          `- **Nominator / Affiliation**: ${orgName} (${contactEmail})\n` +
          `- **Working Group**: ${trackFocus}\n` +
          `- **ORCID / DOI**: ${orcid}\n` +
          `- **Contribution Summary**: ${contribution}\n\n` +
          `### Affirmation\n` +
          `- [x] Verified contributions to peer-reviewed cryptography, legal treatises, or open runtime code\n\n` +
          `### Proposed \`data/fellows.json\` Entry\n\`\`\`json\n${formattedJson}\n\`\`\`\n\n` +
          `*Submitted via ZTDS.ai Accreditation Gateway*`;
      }

      const receiptId = `ZTDS-GITOPS-REC-2026-${slug.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const fastTrackVal = (document.getElementById('fastTrackLicense')?.value || '').trim();

      if (fastTrackVal) {
        const fastTrackBlock = `### Accreditation Status\n- **Queue Priority**: Fast-Track Tier 1\n- **License Ref**: \`${fastTrackVal}\`\n\n`;
        const anchorRegex = /### (Invariant Conformance Affirmation|Policy Affirmation|Affirmation)/;
        if (anchorRegex.test(markdownBody)) {
          markdownBody = markdownBody.replace(anchorRegex, `${fastTrackBlock}### $1`);
        }
      }

      compiledMarkdown = `<!-- Official GitOps Submission Receipt: ${receiptId} -->\n` + markdownBody;
      compiledJson = formattedJson;

      if (jsonTargetFile) jsonTargetFile.textContent = `Target File: ${jsonTarget} (Receipt: ${receiptId})`;
      if (jsonPayloadCode) jsonPayloadCode.textContent = formattedJson;

      const issueTitle = encodeURIComponent(`${titlePrefix} ${appName} [${receiptId}]`);
      const clippedMd = compiledMarkdown.length > 5500
        ? compiledMarkdown.slice(0, 5500) + '\n\n...(truncated for URL length — paste full Markdown if needed)'
        : compiledMarkdown;
      const issueBody = encodeURIComponent(clippedMd);
      const emailBody = encodeURIComponent(compiledMarkdown);

      if (githubIssueLink) {
        githubIssueLink.href = `https://github.com/moxno/ztds.ai/issues/new?title=${issueTitle}&body=${issueBody}`;
      }
      if (mailtoLink) {
        mailtoLink.href = `mailto:security@ztds.ai?subject=${issueTitle}&body=${emailBody}`;
      }

      const origBtnLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Application...';
      }
      if (serverIntakeStatus) {
        serverIntakeStatus.className = 'p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 leading-relaxed';
        serverIntakeStatus.textContent = 'Logging intake receipt with Consortium Review Board...';
      }

      const honeypotWebsite = document.getElementById('applyWebsiteConfirm')?.value || '';
      const honeypotFax = document.getElementById('applyFaxExt')?.value || '';
      const honeypotBot = Boolean(document.getElementById('applyBotCheck')?.checked);

      try {
        const res = await fetch('/api/lead-capture/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: contactEmail,
            domain: appUrl,
            role: `accreditation_${currentTrack}`,
            industryProfile: currentTrack,
            riskScore: 95,
            source: 'accreditation_wizard',
            notes: `${receiptId} | ${appName} | ${orgName} | elapsed=${Date.now() - formMountedAt}ms`,
            website_url_confirm: honeypotWebsite,
            org_fax_ext: honeypotFax,
            botcheck: honeypotBot ? '1' : ''
          }),
          signal: AbortSignal.timeout(6000)
        });

        let data = {};
        try { data = await res.json(); } catch (_) {}

        if (res.ok) {
          const ref = data.leadId || receiptId;
          if (serverIntakeStatus) {
            serverIntakeStatus.className = 'p-3 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-xs text-emerald-200 leading-relaxed';
            serverIntakeStatus.textContent = `Logged in Consortium Review Queue (${ref}). Confirmation receipt dispatched to ${contactEmail}.`;
          }
          if (successHeading) successHeading.textContent = 'Application Logged & Record Ready';
        } else {
          if (serverIntakeStatus) {
            serverIntakeStatus.className = 'p-3 rounded-lg bg-amber-950/60 border border-amber-700/60 text-xs text-amber-200 leading-relaxed';
            serverIntakeStatus.textContent = `Payload generated locally (${receiptId}). Server queue returned HTTP ${res.status} \u2014 use GitHub Intake or Send via Email below to complete your submission.`;
          }
        }
      } catch (_) {
        if (serverIntakeStatus) {
          serverIntakeStatus.className = 'p-3 rounded-lg bg-amber-950/60 border border-amber-700/60 text-xs text-amber-200 leading-relaxed';
          serverIntakeStatus.textContent = `Payload generated locally (${receiptId}). Network intake was unreachable \u2014 use GitHub Intake or Send via Email below to dispatch directly.`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origBtnLabel;
        }
      }

      if (submissionSuccess) {
        submissionSuccess.classList.remove('hidden');
        submissionSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      if (!compiledJson) return;
      safeCopyText(compiledJson, copyJsonBtn, 'Copied JSON!');
    });
  }

  if (copyMarkdownBtn) {
    copyMarkdownBtn.addEventListener('click', () => {
      if (!compiledMarkdown) return;
      safeCopyText(compiledMarkdown, copyMarkdownBtn, 'Copied Markdown!');
    });
  }

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => {
      if (!compiledJson) return;
      const slug = generateSlug(appNameInput ? appNameInput.value.trim() : '');
      const blob = new Blob([compiledJson], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-ztds-entry.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
})();
