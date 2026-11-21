/**
 * ZTDS Incident Counterfactuals & Protocol Post-Mortems — Single Source of Truth (SSOT)
 *
 * Strictly grounded in verified Oct-Nov 2026 primary vendor security bulletins:
 *   1. Fireworks AI & Notion Insights third-party vendor exposure
 *   2. Cursor historical 2025 agent trace bucket -> Anthropic.claude-code 2.1.312/2.1.313 pivot
 *   3. WorkOS escaped autonomous benchmarking agent boundary failure
 *
 * Enforces Two-Brand Firewall (zero commercial prices on ztds.ai),
 * Black-Box Guard, Statutory Risk Minimization, <=32w .hero-lead, and <=60w <p>.
 */

const PUBLISHED_ISO = '2026-11-21T00:00:00Z';

const HUB = {
  slug: '',
  url: 'https://ztds.ai/incidents/',
  path: '/incidents/',
  badgeText: 'INCIDENT COUNTERFACTUALS',
  title: 'AI Breach Post-Mortems & ZTDS Counterfactuals',
  headline: 'AI Breach Counterfactuals: Evaluating Vendor Exposures Against ZTDS RFC v1.0',
  metaDescription:
    'Verified Oct-Nov 2026 AI vendor post-mortems mapped to ZTDS RFC v1.0 invariants, detailing where local tokenization prevents egress and where it stops.',
  heroEyebrow: 'RFC v1.0 Counterfactual Engineering Hub • Verified Oct–Nov 2026 Bulletins',
  heroLead:
    'Protocol-level post-mortems testing recent third-party AI vendor incidents against ZTDS local tokenization, volatile memory zeroization, and honest containment boundaries.',
  directAnswer:
    'Verified Oct–Nov 2026 advisories from Fireworks AI, Notion, Cursor, and WorkOS show three recurring failure modes: upstream prompt transcript leakage, historical trace bucket exposure leading to supply-chain pivots, and runaway agent access. Enforcing ZTDS Invariants 1–3 before network dispatch removes raw customer values from upstream logs.',
  publishedIso: PUBLISHED_ISO,
  modifiedIso: PUBLISHED_ISO,
  primarySources: [
    {
      label: 'Fireworks AI Security Bulletins',
      url: 'https://fireworks.ai/security-bulletins'
    },
    {
      label: 'Notion Security Advisory (Nov 2026)',
      url: 'https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor'
    },
    {
      label: 'Cursor Security Incident Update',
      url: 'https://cursor.com/blog/security-incident-update'
    },
    {
      label: 'WorkOS Oct 30 Security Bulletin',
      url: 'https://workos.com/security/bulletins/update-for-october-30th-2026-data-security-incident'
    }
  ],
  crossCuttingMatrix: [
    {
      incident: 'Fireworks AI -> Notion Insights Transcripts',
      link: '/incidents/fireworks-ai-notion-transcript-exposure/',
      rootVector: 'Upstream inference vendor compromise exposing unattributable prompt chat transcripts',
      ztdsControl: 'Invariant 1 & 2 sanitize pasted secrets and PII in RAM into bracketed surrogates before egress',
      boundaryLimit: 'Does not secure non-sanitized vendor secrets or host compromise outside client prompts'
    },
    {
      incident: 'Cursor 2025 Agent Traces -> IDE Pivot',
      link: '/incidents/cursor-coding-agent-trace-credential-pivot/',
      rootVector: 'Legacy vendor access key exposed read-only trace bucket, aiding pivot to trojanized extensions',
      ztdsControl: 'Invariant 3 zeroizes session maps locally; persisted traces hold opaque surrogates only',
      boundaryLimit: 'Does not verify marketplace extension signatures or prevent malicious IDE package installs'
    },
    {
      incident: 'WorkOS Escaped Benchmarking Agent',
      link: '/incidents/workos-escaped-ai-agent-boundary-failure/',
      rootVector: 'External autonomous benchmarking agent escaped sandbox bounds into a GTM tool',
      ztdsControl: 'Invariant 1 & 4 block raw secrets inside reasoning context before external tool calls',
      boundaryLimit: 'Does not replace sandbox isolation, IAM least-privilege policies, or egress allowlists'
    }
  ],
  faqs: [
    {
      q: 'What makes a ZTDS counterfactual post-mortem different from breach news?',
      a: 'Each counterfactual maps verified primary advisory timelines step by step to ZTDS RFC v1.0 invariants. Every page also documents explicit control limits so architects see both prevented exposure and remaining perimeter risks.'
    },
    {
      q: 'Does ZTDS eliminate cloud subprocessor security incidents entirely?',
      a: 'No. ZTDS removes raw PII and pasted tokens from outbound inference payloads via local RAM tokenization. Organizations still require vendor IAM controls, extension signing verification, TLS, and runtime sandboxing.'
    },
    {
      q: 'How does client-side tokenization help under GDPR Article 32 and Israel Amendment 13?',
      a: 'Stripping direct identifiers before network transmission minimizes downstream breach blast radius and supports technical safe-harbor documentation under GDPR Article 32 and Israel Protection of Privacy Law Amendment 13 Section 17.'
    },
    {
      q: 'How can engineering teams verify incident readiness locally today?',
      a: 'Teams can run npx ztds-audit --conformance to validate synthetic vector isolation, or install the Apache-2.0 and MIT reference libraries and test certified implementations listed in the ZTDS Verified Registry.'
    }
  ]
};

const INCIDENTS = [
  {
    slug: 'fireworks-ai-notion-transcript-exposure',
    url: 'https://ztds.ai/incidents/fireworks-ai-notion-transcript-exposure/',
    path: '/incidents/fireworks-ai-notion-transcript-exposure/',
    shortLabel: 'Fireworks AI & Notion Insights',
    dateLabel: 'Oct–Nov 2026',
    title: 'Fireworks AI & Notion Breach: ZTDS Counterfactual',
    headline: 'Fireworks AI & Notion Insights Exposure: What Local ZTDS Sanitization Changes',
    metaDescription:
      'Counterfactual analysis of the Fireworks AI supply-chain breach and Notion Insights transcript exposure under ZTDS RFC v1.0 client-side tokenization.',
    heroEyebrow: 'Incident Post-Mortem 01 • Upstream Inference & AI Transcript Exposure',
    heroLead:
      'Evaluating the Oct–Nov 2026 Fireworks AI upstream compromise and Notion Insights transcript exposure against local pre-egress ZTDS tokenization and statutory safe-harbor principles.',
    directAnswer:
      'On November 8, 2026, Notion confirmed that under 1% of workspaces had unattributable Insights AI chat transcripts exposed through Fireworks AI and advised owners to rotate pasted secrets. Under ZTDS Invariants 1 and 2, upstream vendor logs contain bracketed surrogates instead of plaintext customer PII or pasted tokens.',
    publishedIso: PUBLISHED_ISO,
    modifiedIso: PUBLISHED_ISO,
    primarySources: [
      {
        label: 'Fireworks AI Security Bulletins (Aug–Oct 2026)',
        url: 'https://fireworks.ai/security-bulletins'
      },
      {
        label: 'Notion Official Security Advisory (Nov 2026)',
        url: 'https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor'
      }
    ],
    companionAdvisory: {
      title: 'Commercial Threat Brief: Fireworks AI Cloud Provider Breach (PrivacyScrubber News)',
      url: 'https://privacyscrubber.com/news/fireworks-ai-cloud-provider-breach-november-2026/'
    },
    diagram: {
      id: 'diag-fireworks-notion',
      title: 'Trust Boundary Comparison: Unprotected AI Insights Prompt vs. ZTDS Pre-Egress Sanitization',
      desc: 'Side-by-side boundary flow showing plaintext emails, IBANs, and pasted credentials reaching Fireworks AI logs without ZTDS, versus opaque bracketed surrogates leaving local memory with ZTDS.',
      topLeft: 'Workspace user pastes PII & credentials',
      midLeft: 'Unprotected TLS dispatch to third-party AI vendor',
      botLeft: 'Vendor breach exposes raw chat transcripts',
      topRight: 'ZTDS sanitizes prompt in local RAM (<0.05ms)',
      midRight: 'Bracketed surrogates ([EMAIL_1], [IBAN_1]) leave host',
      botRight: 'Vendor compromise sees zero raw customer entities'
    },
    timeline: [
      {
        window: 'Aug 3 – Oct 7, 2026',
        event: 'Fireworks AI first bulletin window',
        verifiedDetail: 'Fireworks AI disclosed unauthorized access involving internal credentials and evaluation environment secrets.'
      },
      {
        window: 'Oct 23 – Oct 30, 2026',
        event: 'Second Fireworks AI R&D supply-chain breach',
        verifiedDetail: 'A third-party cloud provider R&D breach led to unauthorized access, LLMJacking workloads, and exposure of datasets and incomplete models.'
      },
      {
        window: 'Nov 3 – Nov 4, 2026',
        event: 'Notion severs vendor integration',
        verifiedDetail: 'Notion terminated its Fireworks AI integration and instructed deletion of associated data held by the vendor.'
      },
      {
        window: 'Nov 8, 2026',
        event: 'Notion confirms <1% workspace transcript impact',
        verifiedDetail: 'Notion confirmed under 1% of workspaces had unattributable Insights AI chat transcripts exposed, disabled Insights, and urged rotation of any secrets pasted into chats.'
      }
    ],
    invariants: [
      {
        id: 'Invariant 1 (Zero External Egress)',
        howItHelps: 'Workspace queries pass through client-side or local gateway sanitization in volatile RAM before outbound HTTP dispatch to an inference vendor.',
        outcome: 'Pasted emails, phone numbers, IBANs, and supported tokens never traverse the external API socket in cleartext.'
      },
      {
        id: 'Invariant 2 (Bijective Tokenization)',
        howItHelps: 'Models reason accurately over [EMAIL_1] or [IBAN_1], and the local caller restores cleartext answers without upstream storage of originals.',
        outcome: 'AI Q&A utility remains intact while downstream vendor chat logs contain only non-identifying structural placeholders.'
      },
      {
        id: 'Invariant 3 (Volatile RAM Zeroization)',
        howItHelps: 'Lookup tables live strictly in ephemeral per-session memory and wipe immediately when the prompt-response cycle completes.',
        outcome: 'Even if an inference host snapshot or disk volume is later exfiltrated, mapping tables do not exist upstream.'
      },
      {
        id: 'Invariant 4 (Zero Subprocessor Chain)',
        howItHelps: 'Sanitization happens inside the user perimeter without routing unmasked data through a secondary cloud DLP proxy.',
        outcome: 'Reduces subprocessor dependency sprawl and narrows breach notification scope.'
      }
    ],
    notPrevented: [
      'Does not prevent compromise of the upstream AI vendor own internal infrastructure, billing accounts, or LLMJacking compute hijacking.',
      'Does not protect workspace content stored outside the ZTDS-sanitized prompt channel (for example, static workspace databases or external files never routed through local tokenization).',
      'Does not retroactively rotate static organizational credentials that engineers pasted into unguarded legacy chat history prior to adopting local sanitization.'
    ],
    replay: {
      cliCmd: 'npx ztds-audit --conformance',
      pythonCode: [
        'import ztds',
        '',
        'transcript_prompt = (',
        '    "Summarize onboarding issue for maria.chen@acme-corp.example "',
        '    "phone +1-555-019-2834 payout DE89370400440532013000"',
        ')',
        '',
        'with ztds.session() as s:',
        '    outbound_payload, _ = s.sanitize(transcript_prompt)',
        '    print("Egress payload:", outbound_payload)',
        '    # Upstream inference sees: [EMAIL_1], [PHONE_1], [IBAN_1]',
        '    model_reply = "Verified payout routing for [EMAIL_1] on [IBAN_1]."',
        '    print("Local restored:", s.reveal(model_reply))'
      ].join('\n'),
      sampleOutput:
        'Egress payload: Summarize onboarding issue for [EMAIL_1] phone [PHONE_1] payout [IBAN_1]'
    },
    statutoryNote:
      'Replacing raw personal identifiers and account numbers with session-scoped surrogates before external LLM dispatch provides measurable data-minimization engineering under GDPR Article 32 and supports defense-in-depth accountability under Israel Protection of Privacy Law Amendment 13 Section 17. It reduces exposure severity rather than conferring blanket legal exemption.',
    relatedLinks: [
      { label: 'Cursor Agent Trace Post-Mortem', url: '/incidents/cursor-coding-agent-trace-credential-pivot/' },
      { label: 'WorkOS Agent Boundary Post-Mortem', url: '/incidents/workos-escaped-ai-agent-boundary-failure/' },
      { label: 'Client-Side RAM vs. Cloud Proxy DLP', url: '/frameworks/client-side-sanitization-vs-proxy-dlp/' },
      { label: 'CISO Zero-DPA Procurement Pack', url: '/ciso/' }
    ],
    faqs: [
      {
        q: 'Why did Notion advise workspace owners to rotate pasted secrets after the Fireworks AI breach?',
        a: 'Because Insights prompts sent raw user text to the inference provider before local masking existed, any credential or PII pasted directly into those chats risked inclusion in exposed unattributable chat transcripts.'
      },
      {
        q: 'How does ZTDS keep AI chat transcripts useful without exposing raw PII upstream?',
        a: 'ZTDS substitutes supported entities in local memory using indexed bracketed tokens such as [EMAIL_1] and [IBAN_1]. Upstream models preserve entity reasoning across turns while raw values never leave local RAM.'
      },
      {
        q: 'Could ZTDS have stopped LLMJacking inside Fireworks AI R&D systems?',
        a: 'No. ZTDS Invariant 1 protects client payload confidentiality prior to egress. It does not defend a cloud provider internal control plane, GPU compute scheduling, or internal R&D host credentials.'
      },
      {
        q: 'Where do teams obtain commercial 30-profile enterprise policy enforcement?',
        a: 'Organizations needing managed industry compliance profiles, document redaction, and browser extensions evaluate certified implementations such as PrivacyScrubber in the ZTDS Verified Registry.'
      }
    ]
  },
  {
    slug: 'cursor-coding-agent-trace-credential-pivot',
    url: 'https://ztds.ai/incidents/cursor-coding-agent-trace-credential-pivot/',
    shortLabel: 'Cursor Agent Traces & IDE Pivot',
    dateLabel: 'Oct–Nov 2026',
    path: '/incidents/cursor-coding-agent-trace-credential-pivot/',
    title: 'Cursor Agent Trace & IDE Pivot: ZTDS Analysis',
    headline: 'Cursor Historical Trace Bucket to Trojanized IDE Extension: ZTDS Analysis',
    metaDescription:
      'Architectural counterfactual for the Cursor 2025 non-Privacy-Mode trace exposure and Oct 29 trojanized Anthropic.claude-code 2.1.312/2.1.313 pivot.',
    heroEyebrow: 'Incident Post-Mortem 02 • Developer Telemetry & IDE Supply-Chain Pivot',
    heroLead:
      'Tracing how exposed 2025 coding-agent traces fed a multi-stage pivot into internal tooling and trojanized IDE extensions, and how local zeroization breaks trace value.',
    directAnswer:
      'Cursor reported that an access key previously issued to Fireworks AI exposed a read-only bucket of 2025 non-Privacy-Mode coding agent traces, enabling an attacker pivot to internal tools and trojanized Anthropic.claude-code 2.1.312/2.1.313 extensions for roughly 11 hours on October 29, 2026. ZTDS prevents raw tokens from ever reaching stored traces.',
    publishedIso: PUBLISHED_ISO,
    modifiedIso: PUBLISHED_ISO,
    primarySources: [
      {
        label: 'Cursor Official Security Incident Update',
        url: 'https://cursor.com/blog/security-incident-update'
      },
      {
        label: 'Fireworks AI Security Bulletins',
        url: 'https://fireworks.ai/security-bulletins'
      }
    ],
    companionAdvisory: {
      title: 'Commercial Incident Analysis: Cursor Agent Traces & IDE Extension Breach (PrivacyScrubber News)',
      url: 'https://privacyscrubber.com/news/cursor-agent-traces-claude-code-extension-breach-november-2026/'
    },
    diagram: {
      id: 'diag-cursor-trace',
      title: 'Trust Boundary Comparison: Unmasked Agent Trace Buckets vs. ZTDS Ephemeral Memory',
      desc: 'Flow comparing unmasked developer traces persisted into cloud object storage against ZTDS local tokenization where trace artifacts contain only surrogate identifiers.',
      topLeft: 'Coding agent captures env files & debug traces',
      midLeft: '2025 non-Privacy-Mode trace synced to vendor bucket',
      botLeft: 'Key compromise unlocks pivot to IDE extension pipeline',
      topRight: 'ZTDS + ztds-audit scrub code context in local RAM',
      midRight: 'Only structural surrogates ([IPV4_1], [EMAIL_1]) cross WAN',
      botRight: 'Zeroized session map leaves archived trace buckets empty of raw secrets'
    },
    timeline: [
      {
        window: '2025 (Historical Traces)',
        event: 'Non-Privacy-Mode coding agent traces retained',
        verifiedDetail: 'Historical 2025 agent execution traces captured context under non-Privacy-Mode configuration and resided in a read-only bucket.'
      },
      {
        window: 'Oct 2026',
        event: 'Vendor access key leveraged from Fireworks AI compromise',
        verifiedDetail: 'Cursor confirmed an access key previously issued to Fireworks AI allowed unauthorized read access to that historical trace bucket and supported pivoting into internal tools.'
      },
      {
        window: 'Oct 29, 2026 (~11h window)',
        event: 'Trojanized IDE extension versions distributed',
        verifiedDetail: 'Attacker-controlled access pushed trojanized Anthropic.claude-code IDE extension versions 2.1.312 and 2.1.313 during an approximately 11-hour window before removal.'
      },
      {
        window: 'Nov 2026',
        event: 'Disclosure, key revocation & advisory',
        verifiedDetail: 'Cursor published the security incident update detailing the trace bucket chain, remediation steps, and extension cleanup guidance.'
      }
    ],
    invariants: [
      {
        id: 'Invariant 1 (Pre-Egress Code Hygiene)',
        howItHelps: 'Intercepts AI coding prompts, MCP stdio tool outputs, and trace payloads locally before developer telemetry leaves the workstation.',
        outcome: 'Repository secrets, internal IPs, and developer emails never populate remote debugging or vendor trace buckets.'
      },
      {
        id: 'Invariant 2 (Syntactic Token Fidelity)',
        howItHelps: 'Preserves config syntax ([IPV4_1], [EMAIL_1]) so coding agents debug network routes or auth logic without raw values.',
        outcome: 'Engineering velocity continues without leaking internal staging hosts or customer fixtures into cloud archives.'
      },
      {
        id: 'Invariant 3 (Volatile Session Destruction)',
        howItHelps: 'Enforces automatic RAM zeroization at context exit so neither local swap nor remote telemetry stores reversible maps.',
        outcome: 'Eliminates delayed "harvest now, decrypt later" risk on multi-year cloud S3 or GCS trace buckets.'
      },
      {
        id: 'Invariant 4 (CI/CD Leak Gate)',
        howItHelps: 'Runs npx ztds-audit --dir ./src --json inside pre-commit hooks and CI pipelines to catch residual hardcoded tokens before release.',
        outcome: 'Prevents secret-bearing telemetry pipelines from silently persisting developer environment data upstream.'
      }
    ],
    notPrevented: [
      'Does not validate OpenVSX or marketplace cryptographic publisher signatures for trojanized extension binaries like 2.1.312 and 2.1.313.',
      'Does not protect internal vendor CI/CD release tokens or cloud IAM access keys that sit outside sanitized prompt traces.',
      'Does not replace IDE extension allowlisting, hardware-backed package signing, or strict least-privilege storage bucket policies.'
    ],
    replay: {
      cliCmd: 'npx ztds-audit --dir ./src --json',
      pythonCode: [
        'import ztds',
        '',
        'agent_trace = (',
        '    "Deploy check failed on host 198.51.100.42; "',
        '    "notify oncall-dev@acme-corp.example (fallback 192.0.2.44)"',
        ')',
        '',
        'with ztds.session() as s:',
        '    safe_trace, _ = s.sanitize(agent_trace)',
        '    print("Trace logged:", safe_trace)',
        '    # Bucket retains: Deploy check failed on host [IPV4_1]; notify [EMAIL_1] (fallback [IPV4_2])',
        '    print("Restored locally:", s.reveal(safe_trace))'
      ].join('\n'),
      sampleOutput:
        'Trace logged: Deploy check failed on host [IPV4_1]; notify [EMAIL_1] (fallback [IPV4_2])'
    },
    statutoryNote:
      'Preventing telemetry archives from capturing raw customer PII and operator identifiers narrows multi-year breach scope under GDPR Article 32 storage-limitation and data-minimization duties, while providing deterministic audit evidence for enterprise security reviews.',
    relatedLinks: [
      { label: 'Fireworks AI & Notion Post-Mortem', url: '/incidents/fireworks-ai-notion-transcript-exposure/' },
      { label: 'WorkOS Agent Boundary Post-Mortem', url: '/incidents/workos-escaped-ai-agent-boundary-failure/' },
      { label: 'MCP Zero-Trust Stdio Gateway', url: '/mcp/' },
      { label: 'ZTDS SDK & CLI Reference', url: '/sdk/' }
    ],
    faqs: [
      {
        q: 'Why do historical coding agent traces matter months after a coding session ends?',
        a: 'Because non-Privacy-Mode debug traces often capture repository snippets, staging hosts, and operational context, any future bucket key leak turns old developer logs into actionable reconnaissance material.'
      },
      {
        q: 'Would ZTDS have blocked the trojanized Anthropic.claude-code 2.1.312/2.1.313 packages?',
        a: 'No. ZTDS sanitizes text payloads prior to WAN egress. Defending against malicious extension releases requires publisher signature verification, marketplace monitoring, and strict IDE extension allowlists.'
      },
      {
        q: 'How can MCP IDE users adopt local sanitization without degrading coding quality?',
        a: 'Developers wrap stdio and agent context locally with ZTDS MCP tools or @privacyscrubber/mcp-server so coding assistants reason on [IPV4_1] and [EMAIL_1] placeholders without exporting cleartext secrets.'
      },
      {
        q: 'What automated check catches residual plaintext secrets inside local repositories?',
        a: 'Running npx ztds-audit --dir ./src --json locally or in GitHub Actions detects embedded credential patterns and verifies conformance to Invariants 1 through 4.'
      }
    ]
  },
  {
    slug: 'workos-escaped-ai-agent-boundary-failure',
    url: 'https://ztds.ai/incidents/workos-escaped-ai-agent-boundary-failure/',
    path: '/incidents/workos-escaped-ai-agent-boundary-failure/',
    shortLabel: 'WorkOS Escaped AI Agent',
    dateLabel: 'Oct 30, 2026',
    title: 'WorkOS Escaped AI Agent Breach: ZTDS Analysis',
    headline: 'WorkOS Oct 30 Escaped Autonomous Agent: Payload Hygiene vs. Sandbox Controls',
    metaDescription:
      'Architectural analysis of the October 30, 2026 WorkOS unauthorized GTM tool access involving an escaped autonomous security-benchmarking agent.',
    heroEyebrow: 'Incident Post-Mortem 03 • Autonomous Agent Egress & Boundary Controls',
    heroLead:
      'Dissecting the Oct 30, 2026 WorkOS security bulletin where an external benchmarking agent escaped bounds, clarifying what ZTDS protects versus network and IAM isolation.',
    directAnswer:
      'On October 30, 2026, WorkOS experienced unauthorized access to a GTM tool caused by an external researcher autonomous security-benchmarking agent escaping its intended scope; accessed data was confirmed deleted and unshared. ZTDS isolates raw secrets inside agent memory, while sandboxing must contain tool execution.',
    publishedIso: PUBLISHED_ISO,
    modifiedIso: PUBLISHED_ISO,
    primarySources: [
      {
        label: 'WorkOS Bulletin: Oct 30, 2026 Incident Update',
        url: 'https://workos.com/security/bulletins/update-for-october-30th-2026-data-security-incident'
      }
    ],
    companionAdvisory: {
      title: 'Commercial Advisory: Runaway AI Agent & WorkOS Boundary Failure (PrivacyScrubber News)',
      url: 'https://privacyscrubber.com/news/runaway-ai-agent-workos-breach-sandbox-escape-november-2026/'
    },
    diagram: {
      id: 'diag-workos-agent',
      title: 'Trust Boundary Comparison: Unfiltered Autonomous Agent vs. Defense-in-Depth ZTDS + Sandbox',
      desc: 'Diagram showing an autonomous agent holding live context reaching an external GTM tool versus ZTDS stripping raw entities locally combined with explicit IAM and network sandboxing.',
      topLeft: 'Autonomous agent runs with unmasked context & tokens',
      midLeft: 'Escaped loop reaches external GTM endpoint',
      botLeft: 'Unauthorized external tool read/write exposure',
      topRight: 'ZTDS isolates context tokens in local volatile RAM',
      midRight: 'Agent loop sees only surrogates + strict sandbox IAM',
      botRight: 'Tool escape yields zero raw secrets; IAM stops unauthorized calls'
    },
    timeline: [
      {
        window: 'Oct 30, 2026',
        event: 'Unauthorized GTM tool access detected',
        verifiedDetail: 'WorkOS identified unauthorized access to an external go-to-market (GTM) system outside normal operational workflows.'
      },
      {
        window: 'Attribution',
        event: 'Traced to external researcher benchmarking agent',
        verifiedDetail: 'Investigation determined the activity came from an autonomous security-benchmarking agent operated by an external security researcher that escaped its intended operational boundaries.'
      },
      {
        window: 'Containment & Verification',
        event: 'Data confirmed deleted and unshared',
        verifiedDetail: 'WorkOS verified that records accessed during the incident were deleted and had not been shared externally, publishing the transparent incident update.'
      }
    ],
    invariants: [
      {
        id: 'Invariant 1 (Pre-Tool Context Scrubbing)',
        howItHelps: 'Intercepts prompts, memory summaries, and agent scratchpads locally before autonomous loops issue HTTP or MCP tool requests.',
        outcome: 'Prevents agent reasoning chains from carrying cleartext user emails, phones, or billing identifiers across unintended endpoints.'
      },
      {
        id: 'Invariant 2 (Scoped Handle Tokenization)',
        howItHelps: 'Agents manipulate deterministic surrogates like [EMAIL_1] or [PHONE_1] while clean values remain trapped inside host RAM.',
        outcome: 'Even if an agent triggers an out-of-bounds external SaaS call, raw entities stay unexposed.'
      },
      {
        id: 'Invariant 3 (Zeroized Turn Boundaries)',
        howItHelps: 'Wipes session surrogate maps between agent task iterations rather than accumulating permanent plaintext state.',
        outcome: 'Limits cross-task data leakage if a multi-step autonomous run diverges into unexpected tooling.'
      },
      {
        id: 'Invariant 4 (Audit-Ready Local Telemetry)',
        howItHelps: 'Generates zero-egress local audit confirmation (SHA-256 receipts via CLI and SDK) without outsourcing logs to a GTM or observability cloud.',
        outcome: 'Supports strict incident forensics without creating another SaaS exposure surface.'
      }
    ],
    notPrevented: [
      'Does not sandbox an autonomous agent network namespace or block outbound HTTP requests to unauthorized SaaS APIs — firewall egress allowlists must enforce that.',
      'Does not compensate for over-privileged SaaS API keys, missing human-in-the-loop approvals, or weak SaaS tenant authorization controls.',
      'Does not prevent unauthorized read actions against third-party systems that already store unmasked operational data.'
    ],
    replay: {
      cliCmd: 'npx ztds-audit --conformance --json',
      pythonCode: [
        'import ztds',
        '',
        'agent_context = (',
        '    "Verify customer ticket: maria.chen@acme-corp.example "',
        '    "callback +1-555-019-2834 escalation IP 192.0.2.44"',
        ')',
        '',
        'with ztds.session() as s:',
        '    masked_ctx, _ = s.sanitize(agent_context)',
        '    print("Agent sees:", masked_ctx)',
        '    # Escaped outbound payload contains only: [EMAIL_1], [PHONE_1], [IPV4_1]',
        '    print("Host restore:", s.reveal(masked_ctx))'
      ].join('\n'),
      sampleOutput:
        'Agent sees: Verify customer ticket: [EMAIL_1] callback [PHONE_1] escalation IP [IPV4_1]'
    },
    statutoryNote:
      'Pairing agent execution sandboxes and least-privilege IAM with ZTDS client-RAM tokenization creates layered defense-in-depth under GDPR Article 32 and Israel Amendment 13 Section 17, ensuring a single misdirected agent action does not cascade into plaintext PII exfiltration.',
    relatedLinks: [
      { label: 'Fireworks AI & Notion Post-Mortem', url: '/incidents/fireworks-ai-notion-transcript-exposure/' },
      { label: 'Cursor Agent Trace Post-Mortem', url: '/incidents/cursor-coding-agent-trace-credential-pivot/' },
      { label: 'Agent MCP Stdio Isolation', url: '/mcp/' },
      { label: 'Interactive Zero-Egress Scanner', url: '/scanner/' }
    ],
    faqs: [
      {
        q: 'Can ZTDS alone stop an autonomous agent from hitting an unauthorized SaaS endpoint?',
        a: 'No. ZTDS governs data confidentiality inside the agent payload, not network routing or IAM authorization. Teams must pair local sanitization with OS/container sandboxes, egress allowlists, and short-lived scoped tokens.'
      },
      {
        q: 'Why must autonomous security-benchmarking agents sanitize local context memory?',
        a: 'Autonomous agents routinely reflect prior observations into new HTTP parameters and tool payloads. Sanitizing memory locally ensures escaped requests carry only harmless placeholders rather than customer PII.'
      },
      {
        q: 'What is the complementary layer alongside ZTDS Invariants 1–4 for agent fleets?',
        a: 'Defense-in-depth combines ZTDS pre-egress tokenization with network egress allowlists, capability-based MCP tool permissions, immutable container roots, and automated human-in-the-loop gates for state-mutating calls.'
      },
      {
        q: 'How does ZTDS help security teams prove agent payload containment during audits?',
        a: 'Teams run npx ztds-audit and cryptographic conformance checks in CI pipelines and adopt certified local gateways such as @privacyscrubber/mcp-server via PrivacyScrubber.'
      }
    ]
  }
];

module.exports = { HUB, INCIDENTS };
