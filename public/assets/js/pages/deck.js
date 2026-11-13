(function () {
  'use strict';

(function() {
      const slides = document.querySelectorAll('.slide');
      const totalSlides = slides.length;
      let currentIndex = 0;

      const currentNumEl = document.getElementById('current-slide-num');
      const totalNumEl = document.getElementById('total-slides-num');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      const notesDrawer = document.getElementById('notes-drawer');
      const toggleNotesBtn = document.getElementById('toggle-notes-btn');
      const closeNotesBtn = document.getElementById('close-notes-btn');
      const notesContentEl = document.getElementById('notes-content');
      const notesSlideTitle = document.getElementById('notes-slide-title');
      const fullscreenBtn = document.getElementById('fullscreen-btn');

      totalNumEl.textContent = totalSlides < 10 ? '0' + totalSlides : totalSlides;

      // Speaker Notes Data mapped by slide index
      const speakerNotes = [
        {
          lead: 'Opening Track:',
          paragraphs: [
            '"Thank you for reviewing this executive briefing. As CISOs, your teams face intense pressure to adopt Generative AI and RAG immediately. Current cloud proxy solutions force a false choice: block engineering productivity, or route cleartext company prompts through third-party cloud DLP vendors.',
            'ZTDS introduces deterministic, client-side zero-trust sanitization in host volatile RAM. Zero bytes leave your environment. Let us inspect the math."'
          ]
        },
        {
          lead: 'Core Argument:',
          paragraphs: [
            '"Highlight the 4 statutory chokepoints, especially Vector Database Poisoning. In traditional RAG, when PII is embedded into high-dimensional vector space, deleting it under GDPR Art. 17 requires rebuilding the entire index at high operational cost.',
            'ZTDS strips PII into surrogate tokens before vector embedding, permanently immunizing the vector database."'
          ]
        },
        {
          lead: 'Cloud DLP Critique:',
          paragraphs: [
            '"Highlight the 400ms latency tax. In multi-agent systems with 10-15 reasoning hops, cloud DLP adds 6+ seconds of lag. Also note the Vendor Trust Paradox: routing sensitive data to another SaaS vendor to protect it from upstream LLMs doubles your external breach surface."'
          ]
        },
        {
          lead: 'The 4 Invariants:',
          paragraphs: [
            '"ZTDS is an open RFC v1.0 standard with academic DOIs on Zenodo and OSF. Emphasize Invariant 1 (0.00 bytes cleartext egress) and Invariant 2 (deterministic, reversible tokenization). The mapping table stays in client volatile RAM with zero persistent storage."'
          ]
        },
        {
          lead: 'Architecture Walkthrough:',
          paragraphs: [
            '"Walk through the pipeline: Ingest -> In-RAM Tokenizer (<1.8ms) -> Upstream LLM (receives synthetic tokens) -> Local De-pseudonymizer -> Output. Run the self-serve 5-minute Airplane Mode Audit: disconnect Wi-Fi and verify zero dropped packets."'
          ]
        },
        {
          lead: 'Statutory Risk Minimization & Safe Harbor:',
          paragraphs: [
            '"Accelerate General Counsel review from months to 48 hours. Local computational transformation in volatile RAM eliminates intermediary sanitization subprocessors under GDPR Art. 28 and establishes a Technical Safe Harbor under GDPR Art. 32 & Recital 26. Share the 1-page CISO memo and SOC 2 evidence pack."'
          ]
        },
        {
          lead: 'Air-Gapped & Cryptography:',
          paragraphs: [
            '"For defense, SCIF, or sovereign banking VPCs: zero telemetry and zero call-home sockets. Verification uses 256-bit Ed25519 asymmetric signatures executing in ~111.8 microseconds, including a 60-day renewal grace period for procurement continuity."'
          ]
        },
        {
          lead: '30 Profiles Moat:',
          paragraphs: [
            '"Explain why generic open-source scripts fail in regulated production: high false positive rates and missing sector-specific validation. The 30 enterprise profiles cover HIPAA clinical data, SWIFT/IBAN, M&A deal codenames, cloud secrets (AWS, Kubernetes, JWT), automotive telematics, and telecom identifiers."'
          ]
        },
        {
          lead: 'Commercial ROI:',
          paragraphs: [
            '"Compare Enterprise Air-Gapped deployment against legacy cloud DLP proxies and custom internal maintenance. Highlight Net 30 procurement terms, multi-node cluster licensing, 30 industry profiles, and SLA coverage via PrivacyScrubber.com."'
          ]
        },
        {
          lead: 'Closing Call-to-Action:',
          paragraphs: [
            '"Initiate the self-serve 14-day Air-Gapped Sandbox Pilot in staging VPC. Zero technical risk and asynchronous fulfillment: evaluation token and 1-page CISO memo delivered directly via self-serve documentation."'
          ]
        }
      ];

      function renderSpeakerNote(note) {
        if (!notesContentEl) return;
        if (!note || !Array.isArray(note.paragraphs) || note.paragraphs.length === 0) {
          const p = document.createElement('p');
          p.textContent = 'No speaker notes recorded for this slide.';
          notesContentEl.replaceChildren(p);
          return;
        }
        const nodes = note.paragraphs.map((text, idx) => {
          const p = document.createElement('p');
          if (idx === 0 && note.lead) {
            const strong = document.createElement('strong');
            strong.textContent = note.lead + ' ';
            p.append(strong, document.createTextNode(text));
          } else {
            p.textContent = text;
          }
          return p;
        });
        notesContentEl.replaceChildren(...nodes);
      }

      function showSlide(index, options) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentIndex = index;

        slides.forEach((slide, i) => {
          if (i === currentIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        const formattedNum = (currentIndex + 1) < 10 ? '0' + (currentIndex + 1) : (currentIndex + 1);
        currentNumEl.textContent = formattedNum;

        // Update speaker notes
        const activeSlide = slides[currentIndex];
        notesSlideTitle.textContent = activeSlide.getAttribute('data-title') || '';
        renderSpeakerNote(speakerNotes[currentIndex]);

        // Update Hash
        history.replaceState(null, null, '#' + (currentIndex + 1));

        // Reset vertical scroll on stacked mobile/tablet viewports between slide transitions
        if (!(options && options.skipScrollReset) && window.matchMedia && window.matchMedia('(max-width: 1023px)').matches && window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }

      function nextSlide() {
        if (currentIndex < totalSlides - 1) {
          showSlide(currentIndex + 1);
        }
      }

      function prevSlide() {
        if (currentIndex > 0) {
          showSlide(currentIndex - 1);
        }
      }

      function toggleNotes() {
        notesDrawer.classList.toggle('open');
      }

      function toggleFullscreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }

      // Event Listeners
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
      toggleNotesBtn.addEventListener('click', toggleNotes);
      closeNotesBtn.addEventListener('click', () => notesDrawer.classList.remove('open'));
      fullscreenBtn.addEventListener('click', toggleFullscreen);

      // Horizontal touch swipe navigation (respect horizontal table/code scroll regions)
      const slideStage = document.getElementById('main-content');
      let swipeStartX = 0;
      let swipeStartY = 0;
      let swipeStartTime = 0;
      let swipeTracking = false;
      if (slideStage) {
        slideStage.addEventListener('touchstart', (e) => {
          if (!e.touches || e.touches.length !== 1) {
            swipeTracking = false;
            return;
          }
          const target = e.target;
          if (target && target.closest && target.closest('a, button, input, textarea, select, pre, code, table, .overflow-x-auto, #notes-drawer')) {
            swipeTracking = false;
            return;
          }
          swipeStartX = e.touches[0].clientX;
          swipeStartY = e.touches[0].clientY;
          swipeStartTime = Date.now();
          swipeTracking = true;
        }, { passive: true });

        slideStage.addEventListener('touchend', (e) => {
          if (!swipeTracking || !e.changedTouches || e.changedTouches.length !== 1) return;
          swipeTracking = false;
          const dt = Date.now() - swipeStartTime;
          if (dt > 600) return;
          const dx = e.changedTouches[0].clientX - swipeStartX;
          const dy = e.changedTouches[0].clientY - swipeStartY;
          if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) nextSlide();
            else prevSlide();
          }
        }, { passive: true });
      }

      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.key) {
          case 'ArrowRight':
          case ' ':
          case 'PageDown':
          case 'Enter':
            e.preventDefault();
            nextSlide();
            break;
          case 'ArrowLeft':
          case 'PageUp':
          case 'Backspace':
            e.preventDefault();
            prevSlide();
            break;
          case 'Home':
            e.preventDefault();
            showSlide(0);
            break;
          case 'End':
            e.preventDefault();
            showSlide(totalSlides - 1);
            break;
          case 'n':
          case 'N':
            toggleNotes();
            break;
          case 'f':
          case 'F':
            toggleFullscreen();
            break;
          case 'Escape':
            notesDrawer.classList.remove('open');
            break;
        }
      });

      // Handle direct hash or query navigation e.g. /deck/#5 or /deck/?slide=5
      function handleHash() {
        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash.replace('#', '') || params.get('slide') || '';
        const slideNum = parseInt(hash, 10);
        if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= totalSlides) {
          showSlide(slideNum - 1, { skipScrollReset: true });
        } else {
          showSlide(0, { skipScrollReset: true });
        }
      }

      window.addEventListener('hashchange', handleHash);
      handleHash();
    })();
})();
