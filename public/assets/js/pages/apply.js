(function () {
  'use strict';

(function() {
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
      const productFields = document.getElementById('productFieldsContainer');
      const companyFields = document.getElementById('companyFieldsContainer');
      const fellowFields = document.getElementById('fellowFieldsContainer');
      const checkboxConfirmationText = document.getElementById('checkboxConfirmationText');
      const submitBtn = document.getElementById('submitBtn');

      // Track A additions
      const appCategorySelect = document.getElementById('appCategory');
      const appProfileSelect = document.getElementById('appProfile');
      const cliAuditCommand = document.getElementById('cliAuditCommand');
      const copyCliCommandBtn = document.getElementById('copyCliCommandBtn');
      const simulateHashBtn = document.getElementById('simulateHashBtn');
      const auditHashInput = document.getElementById('auditHash');

      // Preview elements
      const badgePreviewMount = document.getElementById('badgePreviewMount');
      const badgeTrackPill = document.getElementById('badgeTrackPill');
      const badgeMarkdownSnippet = document.getElementById('badgeMarkdownSnippet');
      const badgeHtmlSnippet = document.getElementById('badgeHtmlSnippet');
      const downloadBadgeSvgBtn = document.getElementById('downloadBadgeSvgBtn');

      // Submission elements
      const submissionSuccess = document.getElementById('submissionSuccess');
      const jsonTargetFile = document.getElementById('jsonTargetFile');
      const jsonPayloadCode = document.getElementById('jsonPayloadCode');
      const githubIssueLink = document.getElementById('githubIssueLink');
      const mailtoLink = document.getElementById('mailtoLink');
      const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
      const copyJsonBtn = document.getElementById('copyJsonBtn');
      const downloadJsonBtn = document.getElementById('downloadJsonBtn');

      // Wizard navigation elements
      const wizardStepsBar = document.getElementById('wizardStepsBar');
      const stepIndicator1 = document.getElementById('stepIndicator1');
      const stepIndicator2 = document.getElementById('stepIndicator2');
      const stepIndicator3 = document.getElementById('stepIndicator3');
      const step1Panel = document.getElementById('step1Panel');
      const step2Panel = document.getElementById('step2Panel');
      const step3Panel = document.getElementById('step3Panel');
      const btnStep1Continue = document.getElementById('btnStep1Continue');
      const btnStep2Back = document.getElementById('btnStep2Back');
      const btnStep2Continue = document.getElementById('btnStep2Continue');
      const btnStep3Back = document.getElementById('btnStep3Back');
      const step2Error = document.getElementById('step2Error');
      const step2ErrorText = document.getElementById('step2ErrorText');
      const step3Error = document.getElementById('step3Error');
      const step3ErrorText = document.getElementById('step3ErrorText');
      const step1Subtitle = document.getElementById('step1Subtitle');
      const step2Subtitle = document.getElementById('step2Subtitle');
      const step1SelectedTrackLabel = document.getElementById('step1SelectedTrackLabel');
      const step2Heading = document.getElementById('step2Heading');
      const step2Subheading = document.getElementById('step2Subheading');
      const step2TrackBadge = document.getElementById('step2TrackBadge');
      const step3TrackBadge = document.getElementById('step3TrackBadge');
      const step3ProductVerification = document.getElementById('step3ProductVerification');
      const applyFormEl = document.getElementById('applyForm');

      let currentStep = 1;
      let currentTrack = 'product';
      let currentSvgXml = '';
      let compiledMarkdown = '';
      let compiledJson = '';

      function generateSlug(val) {
        if (!val) return 'your-app';
        return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-app';
      }

      function escapeXml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
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
    <!-- Official ZTDS Air-Gap Monolith Vector Mark -->
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
        const rawUrl = appUrlInput.value.trim() || 'https://example.com';
        const profile = appProfileSelect ? appProfileSelect.value : 'medical';
        cliAuditCommand.textContent = `npx ztds-audit --target ${rawUrl} --dir ./src --profile ${profile}`;
      }

      function updateBadgeAndSnippets() {
        const name = appNameInput.value.trim();
        const slug = generateSlug(name);

        let badgeLabel = 'VERIFIED';
        let colorRight = '#059669'; // Emerald
        let textColorRight = '#ffffff';

        if (currentTrack === 'product') {
          badgeTrackPill.textContent = 'Track A: Verified';
          badgeTrackPill.className = 'text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200';
          badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... · VERIFIED' : name.toUpperCase() + ' · VERIFIED') : 'VERIFIED';
          colorRight = '#059669';
          textColorRight = '#ffffff';
        } else if (currentTrack === 'company') {
          badgeTrackPill.textContent = 'Track B: Corporate Adopter';
          badgeTrackPill.className = 'text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200';
          badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... · ADOPTER' : name.toUpperCase() + ' · ADOPTER') : 'ADOPTER';
          colorRight = '#2563eb';
          textColorRight = '#ffffff';
        } else {
          badgeTrackPill.textContent = 'Track C: Research Fellow';
          badgeTrackPill.className = 'text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200';
          badgeLabel = name ? (name.length > 15 ? name.substring(0, 13).toUpperCase() + '... · FELLOW' : name.toUpperCase() + ' · FELLOW') : 'FELLOW';
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

        badgeMarkdownSnippet.value = `[![ZTDS ${badgeLabel}](${badgeUrl})](${targetUrl})`;
        badgeHtmlSnippet.value = `<a href="${targetUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="ZTDS Conformance" width="168" height="22" decoding="async"></a>`;

        updateCliCommand();
      }

      function updateWizardStepsUI(step) {
        currentStep = step;

        if (step1Panel) step1Panel.classList.toggle('hidden', step !== 1);
        if (step2Panel) step2Panel.classList.toggle('hidden', step !== 2);
        if (step3Panel) step3Panel.classList.toggle('hidden', step !== 3);

        if (stepIndicator1) {
          const num1 = stepIndicator1.querySelector('.step-num');
          if (step === 1) {
            stepIndicator1.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 cursor-pointer transition-all shadow-xs flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator1.setAttribute('aria-current', 'step');
            if (num1) {
              num1.className = 'step-num w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
              num1.textContent = '1';
            }
          } else {
            stepIndicator1.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-emerald-500 bg-white text-emerald-950 cursor-pointer transition-all flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator1.removeAttribute('aria-current');
            if (num1) {
              num1.className = 'step-num w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 font-mono';
              num1.textContent = '\u2713';
            }
          }
        }

        if (stepIndicator2) {
          const num2 = stepIndicator2.querySelector('.step-num');
          if (step === 2) {
            stepIndicator2.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 cursor-pointer transition-all shadow-xs flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator2.setAttribute('aria-current', 'step');
            if (num2) {
              num2.className = 'step-num w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
              num2.textContent = '2';
            }
          } else if (step > 2) {
            stepIndicator2.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-emerald-500 bg-white text-emerald-950 cursor-pointer transition-all flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator2.removeAttribute('aria-current');
            if (num2) {
              num2.className = 'step-num w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 font-mono';
              num2.textContent = '\u2713';
            }
          } else {
            stepIndicator2.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 cursor-pointer transition-all opacity-80 hover:opacity-100 flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator2.removeAttribute('aria-current');
            if (num2) {
              num2.className = 'step-num w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0';
              num2.textContent = '2';
            }
          }
        }

        if (stepIndicator3) {
          const num3 = stepIndicator3.querySelector('.step-num');
          if (step === 3) {
            stepIndicator3.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-emerald-950 cursor-pointer transition-all shadow-xs flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator3.setAttribute('aria-current', 'step');
            if (num3) {
              num3.className = 'step-num w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0';
              num3.textContent = '3';
            }
          } else {
            stepIndicator3.className = 'step-indicator p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 cursor-pointer transition-all opacity-80 hover:opacity-100 flex flex-col items-center sm:items-start justify-center min-h-[44px]';
            stepIndicator3.removeAttribute('aria-current');
            if (num3) {
              num3.className = 'step-num w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0';
              num3.textContent = '3';
            }
          }
        }
      }

      function showStep2Error(msg) {
        if (step2Error && step2ErrorText) {
          step2ErrorText.textContent = msg;
          step2Error.classList.remove('hidden');
          step2Error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      function validateStep2() {
        const name = appNameInput ? appNameInput.value.trim() : '';
        const url = appUrlInput ? appUrlInput.value.trim() : '';
        const org = orgNameInput ? orgNameInput.value.trim() : '';
        const email = contactEmailInput ? contactEmailInput.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
          showStep2Error('Please enter a name for the product, organization, or nominee.');
          if (appNameInput) appNameInput.focus();
          return false;
        }
        if (!url) {
          showStep2Error('Please provide a valid website or repository URL.');
          if (appUrlInput) appUrlInput.focus();
          return false;
        }
        if (!org) {
          showStep2Error('Please enter the organization, maintainer, or nominator name.');
          if (orgNameInput) orgNameInput.focus();
          return false;
        }
        if (!email || !emailRegex.test(email)) {
          showStep2Error('Please provide a valid contact email address (e.g. ciso@example.com).');
          if (contactEmailInput) contactEmailInput.focus();
          return false;
        }

        if (step2Error) step2Error.classList.add('hidden');
        return true;
      }

      function scrollToWizardForm() {
        const container = document.getElementById('applyFormContainer');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      function goToStep(targetStep) {
        if (targetStep === 1) {
          updateWizardStepsUI(1);
          scrollToWizardForm();
        } else if (targetStep === 2) {
          updateWizardStepsUI(2);
          scrollToWizardForm();
        } else if (targetStep === 3) {
          if (validateStep2()) {
            updateWizardStepsUI(3);
            scrollToWizardForm();
          }
        }
      }

      async function simulateSha256(text) {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          if (window.crypto && window.crypto.subtle) {
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          }
        } catch (e) {}
        // Deterministic fallback
        let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        for (let i = 0; i < text.length; i++) {
          const ch = text.charCodeAt(i);
          h1 = Math.imul(h1 ^ ch, 2654435761);
          h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const hex = (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
        return 'sha256:' + (hex + hex + hex + hex).substring(0, 64);
      }

      if (simulateHashBtn) {
        simulateHashBtn.addEventListener('click', async () => {
          const seed = (appNameInput.value.trim() || 'ztds-app') + (appUrlInput.value.trim() || 'https://ztds.ai') + Date.now();
          simulateHashBtn.textContent = 'Calculating...';
          const hash = await simulateSha256(seed);
          auditHashInput.value = hash;
          simulateHashBtn.textContent = 'Simulated!';
          setTimeout(() => { simulateHashBtn.textContent = 'Simulate Local Hash \u2192'; }, 2000);
        });
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

      if (copyCliCommandBtn) {
        copyCliCommandBtn.addEventListener('click', () => {
          safeCopyText(cliAuditCommand.textContent, copyCliCommandBtn, 'Copied!');
        });
      }

      if (downloadBadgeSvgBtn) {
        downloadBadgeSvgBtn.addEventListener('click', () => {
          const slug = generateSlug(appNameInput.value.trim());
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

      function setTrack(track) {
        currentTrack = track;
        trackBtns.forEach(b => {
          const isCurrent = b.getAttribute('data-track') === track;
          b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
          if (isCurrent) {
            b.className = 'track-btn px-4 py-2.5 rounded-lg text-xs font-bold bg-slate-900 text-white shadow-sm min-h-[44px] touch-target';
          } else {
            b.className = 'track-btn px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 min-h-[44px] touch-target';
          }
        });

        // Sync Overview Cards
        const trackCards = document.querySelectorAll('[data-track-card]');
        trackCards.forEach(card => {
          const cardTrack = card.getAttribute('data-track-card');
          const isSelected = cardTrack === track;
          card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          const actionLabel = card.querySelector('.font-sans');
          if (isSelected) {
            if (track === 'product') {
              card.className = 'track-card ztds-card p-3.5 bg-white border-2 border-emerald-600 ring-2 ring-emerald-500/20 rounded-xl flex flex-col justify-between cursor-pointer shadow-md text-left transition-all';
              if (actionLabel) { actionLabel.textContent = 'Active Track \u2192'; actionLabel.className = 'text-emerald-700 font-semibold font-sans'; }
            } else if (track === 'company') {
              card.className = 'track-card ztds-card p-3.5 bg-white border-2 border-blue-600 ring-2 ring-blue-500/20 rounded-xl flex flex-col justify-between cursor-pointer shadow-md text-left transition-all';
              if (actionLabel) { actionLabel.textContent = 'Active Track \u2192'; actionLabel.className = 'text-blue-700 font-semibold font-sans'; }
            } else {
              card.className = 'track-card ztds-card p-3.5 bg-white border-2 border-purple-600 ring-2 ring-purple-500/20 rounded-xl flex flex-col justify-between cursor-pointer shadow-md text-left transition-all';
              if (actionLabel) { actionLabel.textContent = 'Active Track \u2192'; actionLabel.className = 'text-purple-700 font-semibold font-sans'; }
            }
          } else {
            card.className = 'track-card ztds-card p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between cursor-pointer hover:border-slate-300 hover:shadow-sm text-left opacity-90 hover:opacity-100 transition-all';
            if (actionLabel) {
              actionLabel.textContent = 'Select Track \u2192';
              actionLabel.className = (cardTrack === 'company' ? 'text-blue-700' : (cardTrack === 'fellow' ? 'text-purple-700' : 'text-emerald-700')) + ' font-semibold font-sans';
            }
          }
        });

        // Sync Step 1 Radio Cards
        const trackChoiceCards = document.querySelectorAll('[data-track-choice]');
        trackChoiceCards.forEach(card => {
          const cardTrack = card.getAttribute('data-track-choice');
          const isSelected = cardTrack === track;
          card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
          const radioDot = card.querySelector('.track-radio-dot');
          const radioBorder = card.querySelector('.rounded-full.border-2');

          if (isSelected) {
            if (track === 'product') {
              card.className = 'track-choice-card p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-xs touch-target min-h-[56px]';
              if (radioBorder) radioBorder.className = 'w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-1';
              if (radioDot) radioDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-600 track-radio-dot';
            } else if (track === 'company') {
              card.className = 'track-choice-card p-4 rounded-xl border-2 border-blue-600 bg-blue-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-xs touch-target min-h-[56px]';
              if (radioBorder) radioBorder.className = 'w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0 mt-1';
              if (radioDot) radioDot.className = 'w-2.5 h-2.5 rounded-full bg-blue-600 track-radio-dot';
            } else {
              card.className = 'track-choice-card p-4 rounded-xl border-2 border-purple-600 bg-purple-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-xs touch-target min-h-[56px]';
              if (radioBorder) radioBorder.className = 'w-5 h-5 rounded-full border-2 border-purple-600 flex items-center justify-center shrink-0 mt-1';
              if (radioDot) radioDot.className = 'w-2.5 h-2.5 rounded-full bg-purple-600 track-radio-dot';
            }
          } else {
            card.className = 'track-choice-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition-all flex items-start justify-between gap-3 opacity-90 hover:opacity-100 touch-target min-h-[56px]';
            if (radioBorder) radioBorder.className = 'w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-1';
            if (radioDot) radioDot.className = 'w-2.5 h-2.5 rounded-full bg-transparent track-radio-dot';
          }
        });

        if (track === 'product') {
          formTitle.textContent = 'Product Certification Application';
          formSubtitle.textContent = 'Self-serve GitOps intake for software applications, browser extensions, and developer libraries.';
          trackBadge.textContent = 'Track A';
          trackBadge.className = 'pill-trust shrink-0';
          if (step1Subtitle) step1Subtitle.textContent = 'Product Certification';
          if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Selected: Track A (Product Certification)';
          if (step2Heading) step2Heading.textContent = 'Product & Maintainer Profile';
          if (step2Subheading) step2Subheading.textContent = 'Enter software details, public URL, and target industry profile matrix.';
          if (step2TrackBadge) step2TrackBadge.textContent = 'Track A: Product';
          if (step3TrackBadge) step3TrackBadge.textContent = 'Track A Verification';
          labelAppName.textContent = 'Product or Library Name *';
          appNameInput.placeholder = 'e.g. My AI SaaS, AgentProxy';
          labelAppUrl.textContent = 'Website or Repository URL *';
          labelOrgName.textContent = 'Organization / Maintainer Name *';
          productFields.classList.remove('hidden');
          companyFields.classList.add('hidden');
          fellowFields.classList.add('hidden');
          if (step3ProductVerification) step3ProductVerification.classList.remove('hidden');
          if (auditHashInput) auditHashInput.required = true;
          {
            const strongZero = document.createElement('strong');
            strongZero.textContent = '0.00 bytes';
            checkboxConfirmationText.replaceChildren(
              document.createTextNode('I confirm that this software executes de-identification locally in client volatile memory with '),
              strongZero,
              document.createTextNode(' cleartext PII/PHI transmitted across external network sockets prior to sanitization.')
            );
          }
          submitBtn.textContent = 'Generate GitOps Submission & Claim Badge \u2192';
        } else if (track === 'company') {
          formTitle.textContent = 'Corporate Enterprise Adopter Registration';
          formSubtitle.textContent = 'Register your enterprise as enforcing client-side Zero-Trust data sanitization across internal AI workflows.';
          trackBadge.textContent = 'Track B';
          trackBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0';
          if (step1Subtitle) step1Subtitle.textContent = 'Corporate Adopter';
          if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Selected: Track B (Corporate Adopter)';
          if (step2Heading) step2Heading.textContent = 'Corporate Adopter Profile';
          if (step2Subheading) step2Subheading.textContent = 'Enter enterprise name, domain, CISO contact, and internal AI mandate scope.';
          if (step2TrackBadge) step2TrackBadge.textContent = 'Track B: Enterprise';
          if (step3TrackBadge) step3TrackBadge.textContent = 'Track B Attestation';
          labelAppName.textContent = 'Company / Enterprise Name *';
          appNameInput.placeholder = 'e.g. Acme Health Corp, TechGlobal';
          labelAppUrl.textContent = 'Company Website URL *';
          labelOrgName.textContent = 'Head of Security / CISO Full Name *';
          productFields.classList.add('hidden');
          companyFields.classList.remove('hidden');
          fellowFields.classList.add('hidden');
          if (step3ProductVerification) step3ProductVerification.classList.add('hidden');
          if (auditHashInput) auditHashInput.required = false;
          checkboxConfirmationText.textContent = 'I confirm that our organization mandates client-side Zero-Trust Data Sanitization across internal AI workflows to prevent data leakage and eliminate DPA overhead.';
          submitBtn.textContent = 'Submit Corporate Member Registration \u2192';
        } else {
          formTitle.textContent = 'Research Fellow & Contributor Nomination';
          formSubtitle.textContent = 'Nominate an academic researcher, cryptographer, or security architect to the ZTDS Fellows Council.';
          trackBadge.textContent = 'Track C';
          trackBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0';
          if (step1Subtitle) step1Subtitle.textContent = 'Research Fellow';
          if (step1SelectedTrackLabel) step1SelectedTrackLabel.textContent = 'Selected: Track C (Research Fellow)';
          if (step2Heading) step2Heading.textContent = 'Research Fellow Nomination Profile';
          if (step2Subheading) step2Subheading.textContent = 'Enter nominee credentials, research portfolio URL, and working group focus.';
          if (step2TrackBadge) step2TrackBadge.textContent = 'Track C: Fellow';
          if (step3TrackBadge) step3TrackBadge.textContent = 'Track C Nomination';
          labelAppName.textContent = 'Nominee Full Name *';
          appNameInput.placeholder = 'e.g. Dr. Jane Doe, Prof. Alan Turing';
          labelAppUrl.textContent = 'Academic Profile, ORCID, or Portfolio URL *';
          labelOrgName.textContent = 'Nominator Name & Affiliation *';
          productFields.classList.add('hidden');
          companyFields.classList.add('hidden');
          fellowFields.classList.remove('hidden');
          if (step3ProductVerification) step3ProductVerification.classList.add('hidden');
          if (auditHashInput) auditHashInput.required = false;
          checkboxConfirmationText.textContent = 'I confirm that this nominee has published peer-reviewed research, legal treatises, or engineered open cryptographic/zero-trust security tooling.';
          submitBtn.textContent = 'Submit Fellow Nomination \u2192';
        }

        updateBadgeAndSnippets();
      }

      // Wire Tab Buttons
      trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          setTrack(btn.getAttribute('data-track'));
        });
      });

      // Wire Overview Cards (Interactive quick selection)
      const trackOverviewCards = document.querySelectorAll('[data-track-card]');
      trackOverviewCards.forEach(card => {
        const handleCardSelect = () => {
          const track = card.getAttribute('data-track-card');
          if (track) {
            setTrack(track);
            const formCard = document.getElementById('applyFormContainer');
            if (formCard) {
              formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        };
        card.addEventListener('click', handleCardSelect);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardSelect();
          }
        });
      });

      // Wire Step 1 Radio Cards
      const trackChoiceCards = document.querySelectorAll('[data-track-choice]');
      trackChoiceCards.forEach(card => {
        const handleChoice = () => {
          const track = card.getAttribute('data-track-choice');
          if (track) setTrack(track);
        };
        card.addEventListener('click', handleChoice);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleChoice();
          }
        });
      });

      // Wire Step Buttons
      if (btnStep1Continue) btnStep1Continue.addEventListener('click', () => goToStep(2));
      if (btnStep2Back) btnStep2Back.addEventListener('click', () => goToStep(1));
      if (btnStep2Continue) btnStep2Continue.addEventListener('click', () => goToStep(3));
      if (btnStep3Back) btnStep3Back.addEventListener('click', () => goToStep(2));

      // Wire Step Indicator Navigation
      if (stepIndicator1) stepIndicator1.addEventListener('click', () => goToStep(1));
      if (stepIndicator2) stepIndicator2.addEventListener('click', () => {
        if (currentStep === 1) goToStep(2);
        else if (currentStep === 3) goToStep(2);
      });
      if (stepIndicator3) stepIndicator3.addEventListener('click', () => goToStep(3));

      [stepIndicator1, stepIndicator2, stepIndicator3].forEach(indicator => {
        if (!indicator) return;
        indicator.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const step = parseInt(indicator.getAttribute('data-step'), 10);
            if (step) goToStep(step);
          }
        });
      });

      // Prevent premature submit on Enter in Steps 1 & 2
      if (applyFormEl) {
        applyFormEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.target.tagName === 'INPUT' && currentStep !== 3) {
            e.preventDefault();
            if (currentStep === 1) goToStep(2);
            else if (currentStep === 2) goToStep(3);
          }
        });
      }

      appNameInput.addEventListener('input', updateBadgeAndSnippets);
      appUrlInput.addEventListener('input', updateBadgeAndSnippets);
      if (appProfileSelect) appProfileSelect.addEventListener('change', updateBadgeAndSnippets);

      // Check URL search parameters (?track=, ?domain=, ?profile=, ?hash=, ?company=, ?industry=, ?slug=, ?name=, ?url=)
      const urlParams = new URLSearchParams(window.location.search);
      const rawInitialTrack = urlParams.get('track');
      const qDomain = (urlParams.get('domain') || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
      const qUrl = (urlParams.get('url') || '').trim();
      const qCompany = (urlParams.get('company') || urlParams.get('org') || '').trim();
      const qName = (urlParams.get('name') || urlParams.get('slug') || '').trim();
      const qProfile = (urlParams.get('profile') || '').trim().toLowerCase();
      const qIndustry = (urlParams.get('industry') || '').trim().toLowerCase();
      const qHash = (urlParams.get('hash') || '').trim();

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
      }

      if (qUrl && appUrlInput && !appUrlInput.value) {
        appUrlInput.value = /^https?:\/\//i.test(qUrl) ? qUrl : 'https://' + qUrl;
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
        if (optMatch) appProfileSelect.value = optMatch.value;
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

      if (qHash && auditHashInput && !auditHashInput.value) {
        auditHashInput.value = qHash.startsWith('sha256:') ? qHash : 'sha256:' + qHash;
      }

      updateBadgeAndSnippets();

      if (rawInitialTrack === 'case-study' || qDomain || qCompany || qName || qHash) {
        updateWizardStepsUI(2);
      }

      // Sync track selection to URL via history.replaceState
      trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
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

      // Snippet copy helpers
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

      // Handle Form Submit
      if (applyFormEl) {
        applyFormEl.addEventListener('submit', (e) => {
          e.preventDefault();

          const confirmCheckbox = document.getElementById('confirmCheckbox');
          if (confirmCheckbox && !confirmCheckbox.checked) {
            if (step3Error && step3ErrorText) {
              step3ErrorText.textContent = 'Please confirm the zero-egress affirmation checkbox before generating your GitOps submission.';
              step3Error.classList.remove('hidden');
              step3Error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return;
          }
          if (step3Error) step3Error.classList.add('hidden');

          const appName = appNameInput.value.trim();
          const appUrl = appUrlInput.value.trim();
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
            const auditHash = (auditHashInput ? auditHashInput.value.trim() : '') || 'sha256:7f83b1659a72d3e1104e6c70b8a245d8b76c94fa10b981e7d23f46a81e9d0c24';

            const fwList = [];
            if (document.getElementById('fwGdpr') && document.getElementById('fwGdpr').checked) fwList.push('GDPR Art. 28 Vendor Exemption');
            if (document.getElementById('fwHipaa') && document.getElementById('fwHipaa').checked) fwList.push('HIPAA Safe Harbor');
            if (document.getElementById('fwAiAct') && document.getElementById('fwAiAct').checked) fwList.push('EU AI Act Art. 50');
            if (document.getElementById('fwSoc2') && document.getElementById('fwSoc2').checked) fwList.push('SOC 2 Type II');
            if (document.getElementById('fwFre502') && document.getElementById('fwFre502').checked) fwList.push('US FRE 502(b)');
            if (document.getElementById('fwPciDss') && document.getElementById('fwPciDss').checked) fwList.push('PCI-DSS v4.0');

            const jsonEntry = {
              id: slug,
              name: appName,
              slug: slug,
              url: appUrl,
              category: appCategory,
              profile: profile,
              tier: "Community Verified",
              license: "Commercial / Proprietary",
              description: `${appName} client-side zero-trust de-identification implementation.`,
              architecture: "RAM-Only Execution / WebAssembly & Local Regex",
              verified_date: today,
              verified_hash: auditHash,
              badge_url: `https://ztds.ai/badge/${slug}.svg`,
              frameworks: fwList
            };

            formattedJson = JSON.stringify(jsonEntry, null, 2);

            markdownBody = `## ZTDS Accreditation Pull Request: ${appName}\n\n` +
              `### Submission Overview\n` +
              `- **Track**: Track A (Software & Product Certification)\n` +
              `- **Product Name**: ${appName}\n` +
              `- **URL**: ${appUrl}\n` +
              `- **Maintainer / Org**: ${orgName} (${contactEmail})\n` +
              `- **Category**: ${appCategory}\n` +
              `- **Target Profile**: ${profile}\n` +
              `- **Audit Hash**: \`${auditHash}\`\n` +
              `- **Compliance Scope**: ${fwList.join(', ')}\n\n` +
              `### Invariant Conformance Affirmation\n` +
              `- [x] Invariant 1: Zero External Egress Prior to Sanitization (0.00 bytes cleartext leaked)\n` +
              `- [x] Invariant 2: Deterministic Reversible Tokenization (volatiles isolated in RAM)\n` +
              `- [x] Invariant 3: Verifiable Cryptographic Isolation (sandboxed V8 / WASM / Enclave)\n` +
              `- [x] Invariant 4: Continuous Compliance & Zero Subprocessor Chain (GDPR Art. 28 Zero Sanitization Subprocessors & Art. 32 Technical Safe Harbor)\n\n` +
              `### Proposed \`data/registry.json\` Entry\n\`\`\`json\n${formattedJson}\n\`\`\`\n\n` +
              `### GitOps Verification Command\n` +
              `\`\`\`bash\n` +
              `npx ztds-audit --target ${appUrl} --profile ${profile}\n` +
              `\`\`\`\n\n` +
              `*Submitted via ZTDS.ai GitOps Gateway*`;

          } else if (currentTrack === 'company') {
            titlePrefix = '[Track B: Corporate Adopter]';
            jsonTarget = 'data/companies.json';
            const industry = document.getElementById('companyIndustry').value;
            const hq = document.getElementById('companyHeadquarters').value.trim() || 'International';
            const scope = document.getElementById('companyScope').value.trim() || 'Client-side zero-trust AI workflows';

            const jsonEntry = {
              id: slug,
              slug: slug,
              name: appName,
              tier: "Enterprise Adopter",
              industry: industry,
              url: appUrl,
              headquarters: hq,
              description: `${appName} mandates client-side Zero-Trust Data Sanitization across internal AI workflows.`,
              verified_date: today,
              compliance_scope: scope
            };

            formattedJson = JSON.stringify(jsonEntry, null, 2);

            markdownBody = `## ZTDS Corporate Adopter Pull Request: ${appName}\n\n` +
              `### Enterprise Profile\n` +
              `- **Enterprise**: ${appName}\n` +
              `- **Website**: ${appUrl}\n` +
              `- **Head of Security / CISO**: ${orgName} (${contactEmail})\n` +
              `- **Industry**: ${industry}\n` +
              `- **Headquarters**: ${hq}\n` +
              `- **Mandate Scope**: ${scope}\n\n` +
              `### Policy Affirmation\n` +
              `- [x] Mandatory client-side zero-trust sanitization on employee workstations & LLM pipelines\n` +
              `- [x] Zero-DPA compliance exclusion confirmed across cloud AI providers\n\n` +
              `### Proposed \`data/companies.json\` Entry\n\`\`\`json\n${formattedJson}\n\`\`\`\n\n` +
              `*Submitted via ZTDS.ai GitOps Gateway*`;

          } else {
            titlePrefix = '[Track C: Research Fellow]';
            jsonTarget = 'data/fellows.json';
            const trackFocus = document.getElementById('fellowTrack').value;
            const orcid = document.getElementById('fellowOrcid').value.trim() || 'ORCID Pending';
            const contribution = document.getElementById('fellowContribution').value.trim() || 'Zero-trust privacy and cryptographic research.';

            const jsonEntry = {
              id: slug,
              slug: slug,
              name: appName,
              role: "Accredited Fellow",
              status: "Nominated Fellow",
              track: trackFocus,
              affiliation: orgName,
              location: "Global",
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
              `*Submitted via ZTDS.ai GitOps Gateway*`;
          }

          const receiptId = `ZTDS-GITOPS-REC-2026-${slug.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const fastTrackVal = (document.getElementById('fastTrackLicense')?.value || '').trim();

          if (fastTrackVal) {
            markdownBody = markdownBody.replace('### Policy Affirmation', `### Accreditation Status\n- **Queue Priority**: Fast-Track Tier 1\n- **License Ref**: \`${fastTrackVal}\`\n\n### Policy Affirmation`);
            markdownBody = markdownBody.replace('### Affirmation', `### Accreditation Status\n- **Queue Priority**: Fast-Track Tier 1\n- **License Ref**: \`${fastTrackVal}\`\n\n### Affirmation`);
          }

          compiledMarkdown = `<!-- Official GitOps Submission Receipt: ${receiptId} -->\n` + markdownBody;
          compiledJson = formattedJson;

          // Update UI
          jsonTargetFile.textContent = `Target File: ${jsonTarget} (Receipt: ${receiptId})`;
          jsonPayloadCode.textContent = formattedJson;

          const issueTitle = encodeURIComponent(`${titlePrefix} ${appName} [${receiptId}]`);
          const issueBody = encodeURIComponent(compiledMarkdown);

          const githubIssueUrl = `https://github.com/moxno/ztds.ai/pulls`;
          const mailtoUrl = `mailto:security@ztds.ai?subject=${issueTitle}&body=${issueBody}`;

          githubIssueLink.href = githubIssueUrl;
          mailtoLink.href = mailtoUrl;

          // Automatically log accreditation intake via serverless lead-capture pipeline
          (async () => {
            try {
              await fetch('/api/lead-capture/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: contactEmail,
                  domain: appUrl,
                  role: `accreditation_${currentTrack}`,
                  industryProfile: currentTrack,
                  riskScore: 95,
                  source: 'accreditation_wizard',
                  notes: `${receiptId} | ${appName} | ${orgName}`
                })
              });
            } catch (_) {}
          })();

          submissionSuccess.classList.remove('hidden');
          submissionSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }

      copyJsonBtn.addEventListener('click', () => {
        if (!compiledJson) return;
        safeCopyText(compiledJson, copyJsonBtn, 'Copied JSON!');
      });

      copyMarkdownBtn.addEventListener('click', () => {
        if (!compiledMarkdown) return;
        safeCopyText(compiledMarkdown, copyMarkdownBtn, 'Copied PR (.md)!');
      });

      downloadJsonBtn.addEventListener('click', () => {
        if (!compiledJson) return;
        const slug = generateSlug(appNameInput.value.trim());
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

      // URL parameter pre-fill from Live Scanner (Sprint 4)
      const paramDomain = urlParams.get('domain');
      const paramProfile = urlParams.get('profile');

      if (paramProfile && appProfileSelect) {
        const matchingOpt = Array.from(appProfileSelect.options).find(o => o.value === paramProfile);
        if (matchingOpt) {
          appProfileSelect.value = paramProfile;
        }
      }

      const paramFocus = urlParams.get('focus');
      const paramName = urlParams.get('name');
      const fellowTrackSelect = document.getElementById('fellowTrack');

      if (paramFocus && fellowTrackSelect) {
        if (paramFocus === 'crypto') fellowTrackSelect.value = 'WG-1 Architecture & Cryptography';
        else if (paramFocus === 'legal' || paramFocus === 'grc') fellowTrackSelect.value = 'WG-2 GRC & Regulatory Standard';
        else if (paramFocus === 'systems') fellowTrackSelect.value = 'WG-3 Systems, Enclaves & WASM Runtime';
        else if (paramFocus === 'profiles') fellowTrackSelect.value = 'WG-4 Industry Profiles & Entity Taxonomy';
      }

      if (paramName && appNameInput && initialTrack === 'fellow') {
        appNameInput.value = paramName;
      }

      if (paramDomain && appUrlInput && appNameInput) {
        const cleanDomain = paramDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        appUrlInput.value = `https://${cleanDomain}`;
        const formattedName = cleanDomain.split('.')[0];
        appNameInput.value = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        
        const auditHashEl = document.getElementById('auditHash');
        if (auditHashEl && !auditHashEl.value) {
          auditHashEl.value = 'sha256:pre-audit-' + cleanDomain.replace(/[^a-z0-9]/gi, '') + '-' + Date.now().toString(36);
        }

        const banner = document.createElement('div');
        banner.className = 'mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center justify-between shadow-xs';
        const leftWrap = document.createElement('div');
        leftWrap.className = 'flex items-center gap-2';
        const dotEl = document.createElement('span');
        dotEl.className = 'w-2 h-2 rounded-full bg-emerald-500';
        const labelSpan = document.createElement('span');
        const domStrong = document.createElement('strong');
        domStrong.textContent = cleanDomain;
        labelSpan.append(document.createTextNode('Pre-filled from Live Perimeter Audit: '), domStrong);
        if (paramProfile) {
          const profSpan = document.createElement('span');
          profSpan.className = 'uppercase text-emerald-700 font-bold';
          profSpan.textContent = paramProfile + ' Profile';
          labelSpan.append(document.createTextNode(' \u00b7 '), profSpan);
        }
        leftWrap.append(dotEl, labelSpan);
        const rightSpan = document.createElement('span');
        rightSpan.className = 'text-slate-500 text-xs font-sans';
        rightSpan.textContent = 'Ready for GitOps Attestation';
        banner.append(leftWrap, rightSpan);
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
          mainContainer.insertBefore(banner, mainContainer.children[1] || mainContainer.firstChild);
        }

        if (typeof updateBadgeAndSnippets === 'function') {
          updateBadgeAndSnippets();
        }

        // Auto-advance to Step 2 so user sees pre-filled details ready for review
        goToStep(2);
      }
    })();
})();
