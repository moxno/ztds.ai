(function () {
  'use strict';

(function() {
    // 1. Safely render current attempted path without XSS
    try {
      const displayPath = document.getElementById('displayAttemptedPath');
      if (displayPath) {
        const rawPath = window.location.pathname || '/unknown-target';
        // textContent prevents any HTML interpretation
        displayPath.textContent = rawPath;

        // Smart Closest-Route Recovery Matching
        const lower = rawPath.toLowerCase();
        const routeRules = [
          { match: /rfc|spec|standard|invariant/, url: '/standard/', title: 'Official ZTDS RFC v1.0 Specification' },
          { match: /ietf|draft/, url: '/ietf/', title: 'IETF Standards Track (draft-sibiryakov-ztds-protocol-02)' },
          { match: /memo|dpa|safe-harbor/, url: '/ciso/memo/', title: '1-Page CISO Executive Safe Harbor Memorandum' },
          { match: /ciso|procurement|legal|trust/, url: '/ciso/', title: 'CISO Procurement & Legal Defense Pack' },
          { match: /framework|owasp|nist|llm02|rmf|iso-42001|mitre|atlas/, url: '/frameworks/', title: 'Regulatory & AI Security Framework Mappings (OWASP, NIST, EU AI Act)' },
          { match: /gdpr|hipaa|compliance|pci|ai-act/, url: '/compliance/', title: 'Global Regulatory Compliance Matrix' },
          { match: /soc2|soc-2|aicpa/, url: '/soc2/', title: 'AICPA SOC 2 Type II & Trust Center' },
          { match: /roi|calc|breach|cost/, url: '/roi/', title: 'CISO Breach Liability & ROI Calculator' },
          { match: /order|schedule-a|contract|msa/, url: '/docs/legal/order-form/', title: 'Enterprise Commercial Order Form (Schedule A)' },
          { match: /wordpress|wp-guard|wp-plugin|elementor|cf7|contact-form|barrelswood/, url: '/sdk/#5-physical-execution-surfaces', title: 'WordPress & Web Form Zero-Trust Guard (Surface 06)' },
          { match: /sdk|npm|pip|node|python|wasm|pric|licens|trial/, url: '/sdk/', title: 'Headless Developer SDK & Offline Licensing' },
          { match: /mcp|claude|cursor|windsurf|stdio/, url: '/mcp/', title: 'Model Context Protocol (MCP) Server Hub' },
          { match: /scan|audit|perimeter|egress/, url: '/scanner/', title: 'Live Zero-Trust Domain Perimeter Scanner' },
          { match: /inspect|dag|playground|token/, url: '/inspector/', title: 'Interactive In-RAM Sanitization & DAG Inspector' },
          { match: /verif|ed25519|cert-val/, url: '/verify/', title: 'Ed25519 Cryptographic Certificate Validator' },
          { match: /badge|seal|svg/, url: '/badge/', title: 'ZTDS Verified SVG Badge Generator' },
          { match: /apply|accredit|submit|nomina/, url: '/apply/', title: 'Self-Serve GitOps Accreditation Intake' },
          { match: /reg|product|dir/, url: '/registry/', title: 'Verified Implementations Registry' },
          { match: /fellow|council|wg-|ilya|cliford/, url: '/fellows/', title: 'Accredited Research Fellows & Working Groups' },
          { match: /learningcenter|voice|bipa|pstn|whisper|deepgram/, url: '/companies/learningcenterusa/', title: 'LearningCenterUsa Voice AI & BIPA Enclave Case Study' },
          { match: /compan|adopt|member|brandmeweb|privacyscrubber/, url: '/companies/', title: 'Corporate Adopters & Enterprise Members' },
          { match: /case|stud/, url: '/case-studies/', title: 'Enterprise Architecture Case Studies' },
          { match: /blueprint|rag|langchain|llamaindex/, url: '/blueprints/', title: '10 Canonical AI & RAG Architecture Blueprints' },
          { match: /bench|latency|perf/, url: '/benchmarks/', title: 'AI Safety & Sub-Millisecond Latency Benchmarks' },
          { match: /whitepaper|doi|zenodo|paper|academ/, url: '/whitepaper/', title: 'Peer-Reviewed Academic Whitepaper & DOIs' },
          { match: /eviden|sovereign|fre-502/, url: '/evidentiary-sovereignty/', title: 'Evidentiary Sovereignty & Legal Privilege' },
          { match: /deck|slide|pitch/, url: '/deck/', title: 'Executive CISO Pitch Deck' },
          { match: /agency|retainer/, url: '/agency/', title: 'BrandMeWeb Enterprise AI Safety Retainer' },
          { match: /gov|charter|cab/, url: '/governance/', title: 'Consortium Governance & CAB Charter' },
          { match: /sec|cvd|pgp|vuln/, url: '/security/', title: 'Security Policy & Coordinated Vulnerability Disclosure' },
          { match: /term|patent|rand|trademark/, url: '/terms/', title: 'Standards, RAND-Z Patent Policy & Terms' },
          { match: /priv/, url: '/privacy/', title: 'Zero-Telemetry Privacy Policy' }
        ];
        const hit = routeRules.find(function(r) { return r.match.test(lower); });
        const box = document.getElementById('smartRouteSuggestion');
        const titleEl = document.getElementById('smartRouteTitle');
        const urlEl = document.getElementById('smartRouteUrl');
        const linkEl = document.getElementById('smartRouteLink');
        if (hit && box && titleEl && urlEl && linkEl) {
          titleEl.textContent = hit.title;
          urlEl.textContent = 'https://ztds.ai' + hit.url;
          linkEl.href = hit.url;
          box.classList.remove('hidden');
        }
      }
    } catch(e) {}

    // 2. Interactive Memory De-Tokenization Simulation
    const btnSimulate = document.getElementById('btnSimulateDetokenize');
    const logBox = document.getElementById('detokenizeLogBox');

    if (btnSimulate && logBox) {
      btnSimulate.addEventListener('click', function() {
        btnSimulate.disabled = true;
        btnSimulate.textContent = 'Probing Volatile Heap...';
        logBox.classList.remove('hidden');

        setTimeout(function() {
          btnSimulate.textContent = 'Heap Verification Completed';
        }, 600);
      });
    }
  })();
})();
