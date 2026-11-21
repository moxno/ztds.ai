#!/usr/bin/env node
'use strict';

/**
 * ZTDS.ai — Option A Semi-Autonomous Incident Candidate Discovery & Extraction Gate
 *
 * Strictly enforces:
 *   1. Live primary advisory HTTP 200 + >= 600 chars visible text (never bare RSS headlines)
 *   2. Deduplication against data/incidents.json slugs & primarySources URLs
 *   3. Gemini structured evaluation requiring ztdsRelevanceScore >= 8
 *   4. Executable Python replay generation & live output verification against packages/ztds/src
 *   5. Deterministic SERP/clarity/safety validation before writing & running npm run incidents:build
 *
 * Usage:
 *   node scripts/discover-incident-candidate.js --dry-run [--source-url=https://...] [--from-privacyscrubber]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'incidents.json');
const PS_NEWS_PATH = '/Users/ilya/Desktop/PrivacyScrubber/data/news.js';

const ARGS = process.argv.slice(2);
const IS_DRY_RUN = ARGS.includes('--dry-run');
const FROM_PS = ARGS.includes('--from-privacyscrubber');
const SOURCE_URL = (ARGS.find(a => a.startsWith('--source-url=')) || '').split('=').slice(1).join('=').trim();
const SUMMARY_OUT = (ARGS.find(a => a.startsWith('--summary-out=')) || '').split('=').slice(1).join('=').trim();
const MAX_CANDIDATES = parseInt((ARGS.find(a => a.startsWith('--max-candidates=')) || '').split('=')[1] || '1', 10) || 1;

const PRIMARY_FEEDS = [
  'https://github.blog/security/feed/',
  'https://www.cisa.gov/cybersecurity-advisories/all.xml'
];

const AI_SECURITY_KEYWORDS =
  /\b(ai|llm|agent|mcp|model context protocol|copilot|cursor|openai|anthropic|claude|prompt|rag|vector|transcript|inference|chatbot)\b/i;

function decodeXmlEntities(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function normalizeUrl(u) {
  try {
    const parsed = new URL(u);
    parsed.hash = '';
    return parsed.toString().replace(/\/+$/, '');
  } catch (_) {
    return String(u || '').trim();
  }
}

function stripHtmlToText(html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchFeedCandidates() {
  const candidates = [];
  for (const feedUrl of PRIMARY_FEEDS) {
    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'ZTDS-Incident-Discovery/1.0 (+https://ztds.ai/incidents/)' },
        signal: AbortSignal.timeout(12000)
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const itemBlocks = [...xml.matchAll(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi)].slice(0, 20);
      for (const blockMatch of itemBlocks) {
        const block = blockMatch[0];
        const titleM = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const linkHrefM = block.match(/<link[^>]+href=["']([^"']+)["']/i);
        const linkTextM = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const title = titleM ? decodeXmlEntities(titleM[1]) : '';
        const link = decodeXmlEntities((linkHrefM && linkHrefM[1]) || (linkTextM && linkTextM[1]) || '');
        if (!link || !/^https?:\/\//i.test(link)) continue;
        if (/news\.google\.com/i.test(link)) continue;
        if (AI_SECURITY_KEYWORDS.test(title)) {
          candidates.push({ url: link, hintTitle: title, companionAdvisory: null });
        }
      }
    } catch (err) {
      console.warn(`[Discover] Feed skipped (${feedUrl}): ${err.message}`);
    }
  }
  return candidates;
}

function loadPrivacyScrubberCandidates() {
  if (!FROM_PS || !fs.existsSync(PS_NEWS_PATH)) return [];
  try {
    const { NEWS_ARTICLES } = require(PS_NEWS_PATH);
    const out = [];
    for (const art of (NEWS_ARTICLES || []).slice(0, 12)) {
      const urls = [];
      if (art.originalIncidentUrl) urls.push(art.originalIncidentUrl);
      if (Array.isArray(art.groundingIncidentUrls)) urls.push(...art.groundingIncidentUrls);
      const cleanPrimary = urls.find(
        u => typeof u === 'string' && /^https?:\/\//i.test(u) && !/news\.google\.com|grounding-api-redirect/i.test(u)
      );
      if (cleanPrimary && art.slug) {
        out.push({
          url: cleanPrimary,
          hintTitle: art.h1 || art.title || '',
          companionAdvisory: {
            title: `Commercial Advisory: ${art.h1 || art.slug} (PrivacyScrubber News)`,
            url: `https://privacyscrubber.com/news/${art.slug}/`
          }
        });
      }
    }
    return out;
  } catch (err) {
    console.warn(`[Discover] Could not read local PrivacyScrubber news.js: ${err.message}`);
    return [];
  }
}

async function fetchPrimaryAdvisory(url) {
  if (/news\.google\.com/i.test(url)) {
    return { ok: false, reason: 'Blocked opaque news.google.com redirect URL' };
  }
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZTDS-Research/1.0; +https://ztds.ai/incidents/)',
        Accept: 'text/html,application/xhtml+xml,text/plain'
      },
      signal: AbortSignal.timeout(15000)
    });
    if (res.status !== 200) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const finalUrl = res.url || url;
    if (/news\.google\.com|consent\.google\.com|accounts\./i.test(finalUrl)) {
      return { ok: false, reason: `Redirected to non-primary URL: ${finalUrl}` };
    }
    const rawHtml = await res.text();
    if (/cf-turnstile|g-recaptcha|hcaptcha|verify you are human/i.test(rawHtml)) {
      return { ok: false, reason: 'Gated by anti-bot challenge' };
    }
    const text = stripHtmlToText(rawHtml);
    if (text.length < 600) {
      return { ok: false, reason: `Insufficient extracted primary text (${text.length} chars < 600)` };
    }
    const pageTitleM = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return {
      ok: true,
      finalUrl,
      pageTitle: pageTitleM ? decodeXmlEntities(pageTitleM[1]) : '',
      text: text.slice(0, 14000)
    };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function evaluateWithGemini(candidate, primaryDoc, apiKey) {
  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  const todayIso = new Date().toISOString().slice(0, 10) + 'T00:00:00Z';

  const systemPrompt = `You are a Principal AI Security Architect authoring vendor-neutral protocol post-mortems for ZTDS.ai (Zero-Trust Data Sanitization RFC v1.0).
Evaluate ONLY the provided primary advisory text. Never invent dates, counts, customer names, CVEs, or timelines not explicitly stated in the text.
Return ONE strict JSON object with these exact keys:
- "ztdsRelevanceScore": integer 0-10. Score >= 8 ONLY if the incident directly exposes prompts, chat transcripts, agent traces, RAG chunks, workspace PII, or pasted developer secrets where pre-egress local RAM tokenization changes payload exposure. Score <= 6 for pure infrastructure RCE, DDoS, marketplace signing, or unrelated bugs.
- "scoreRationale": short 1-sentence reason.
- "slug": lowercase kebab-case slug (max 64 chars, no leading/trailing hyphens).
- "shortLabel": short breadcrumb label (max 36 chars).
- "dateLabel": short month-year label from advisory (e.g., "Nov 2026").
- "title": exact page title, 30 to 68 characters, MUST include "ZTDS" (ASCII only, no "&amp;" entities).
- "headline": crisp <h1> headline (max 90 chars).
- "metaDescription": 70 to 165 characters.
- "heroEyebrow": short badge text e.g. "Incident Post-Mortem • AI Vendor Telemetry Exposure".
- "heroLead": strictly <= 32 words summarizing what happened and what ZTDS evaluation tests.
- "directAnswer": 40 to 55 words answering the incident vs. ZTDS counterfactual directly from primary text.
- "keywords": lowercase space-separated search keywords.
- "publishedIso": "${todayIso}"
- "modifiedIso": "${todayIso}"
- "primarySources": array with [{"label": "Concise Vendor Bulletin Label", "url": "${primaryDoc.finalUrl}"}]
- "diagram": { "id": "diag-<short-slug>", "title": "...", "desc": "...", "topLeft": "max 55 chars", "midLeft": "max 55 chars", "botLeft": "max 55 chars", "topRight": "max 55 chars", "midRight": "max 55 chars", "botRight": "max 55 chars" }
- "timeline": array of 3-4 verified objects {"window": "...", "event": "...", "verifiedDetail": "..."} from primary text only.
- "invariants": array of 4 objects {"id": "Invariant 1 (...)", "howItHelps": "<=45w", "outcome": "<=45w"} covering Invariants 1-4.
- "notPrevented": array of 3 honest boundary limits where ZTDS does NOT apply (<=35w each).
- "syntheticPrompt": 1 realistic synthetic string using ONLY fake fixtures like "maria.chen@acme-corp.example", "+1-555-019-2834", "DE89370400440532013000", "198.51.100.42" (NEVER use US SSN patterns, real key prefixes, or JWTs).
- "replayCli": "npx ztds-audit --conformance --json"
- "statutoryNote": <= 55 words framing GDPR Art. 32 & Israel Amendment 13 Sec. 17 strictly as risk minimization / technical safe harbor (NEVER claim complete legal immunity or elimination of GDPR Art. 28).
- "matrixSummary": {"incident": "...", "rootVector": "...", "ztdsControl": "...", "boundaryLimit": "..."}
- "faqs": array of exactly 4 objects {"q": "plain ASCII question ending in ?", "a": "concise plain ASCII answer <= 55 words"}.

STRICT PROHIBITIONS:
- ZERO prices, currency symbols, or commercial tiers.
- ZERO banned buzzwords (no empower, paradigm, delve, testament, tapestry, game-changer, cutting-edge, synergy).
- ZERO emojis, ZERO Unicode smart quotes.`;

  const userPrompt = `Primary Source URL: ${primaryDoc.finalUrl}\nHint Title: ${candidate.hintTitle || primaryDoc.pageTitle}\n\nPrimary Advisory Text:\n${primaryDoc.text}`;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.15 }
        }),
        signal: AbortSignal.timeout(45000)
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        console.warn(`[Discover] ${model} API notice: ${json.error?.message || res.status}`);
        continue;
      }
      const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
      if (!text) continue;
      return JSON.parse(text);
    } catch (err) {
      console.warn(`[Discover] ${model} failed: ${err.message}`);
    }
  }
  return null;
}

function buildPythonReplay(syntheticPrompt) {
  const safeLiteral = JSON.stringify(String(syntheticPrompt || 'Contact maria.chen@acme-corp.example on 198.51.100.42'));
  return [
    'import ztds',
    '',
    `sample_payload = ${safeLiteral}`,
    '',
    'with ztds.session() as s:',
    '    masked, _ = s.sanitize(sample_payload)',
    '    print("Egress payload:", masked)',
    '    print("Host restore:", s.reveal(masked))'
  ].join('\n');
}

function validateAndMaterialize(raw, companionAdvisory) {
  const slug = String(raw.slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  if (!slug || slug.length < 8) throw new Error(`Invalid slug generated: "${slug}"`);

  const title = String(raw.title || '').trim();
  if (title.length < 30 || title.length > 68 || !title.includes('ZTDS')) {
    throw new Error(`Invalid title (${title.length} chars): "${title}"`);
  }
  const metaDescription = String(raw.metaDescription || '').trim();
  if (metaDescription.length < 70 || metaDescription.length > 165) {
    throw new Error(`Invalid metaDescription (${metaDescription.length} chars)`);
  }
  const leadWords = String(raw.heroLead || '').trim().split(/\s+/).length;
  if (leadWords > 32) {
    throw new Error(`.heroLead exceeds 32 words (${leadWords})`);
  }

  const pythonCode = buildPythonReplay(raw.syntheticPrompt);
  const pythonSrc = path.join(ROOT, 'packages', 'ztds', 'src');
  const pyOut = execFileSync('python3', ['-c', pythonCode], {
    cwd: ROOT,
    env: { ...process.env, PYTHONPATH: pythonSrc },
    encoding: 'utf8'
  });
  const egressLine = pyOut
    .split('\n')
    .map(l => l.trim())
    .find(l => l.startsWith('Egress payload:'));
  if (!egressLine || !/\[[A-Z0-9_]+_\d+\]/.test(egressLine)) {
    throw new Error(`Python replay did not produce verified surrogate tokens: ${pyOut}`);
  }

  const incident = {
    slug,
    url: `https://ztds.ai/incidents/${slug}/`,
    path: `/incidents/${slug}/`,
    ogImage: `https://ztds.ai/assets/img/og/og-incident-${slug}.png`,
    shortLabel: String(raw.shortLabel || title).slice(0, 42),
    dateLabel: String(raw.dateLabel || '2026'),
    title,
    headline: String(raw.headline || title),
    metaDescription,
    heroEyebrow: String(raw.heroEyebrow || 'Incident Post-Mortem • Verified Primary Bulletin'),
    heroLead: String(raw.heroLead || metaDescription),
    directAnswer: String(raw.directAnswer || metaDescription),
    keywords: String(raw.keywords || `${slug.replace(/-/g, ' ')} ztds incident`),
    publishedIso: raw.publishedIso,
    modifiedIso: raw.modifiedIso,
    primarySources: raw.primarySources,
    ...(companionAdvisory ? { companionAdvisory } : {}),
    diagram: {
      id: `diag-${slug.slice(0, 20)}`,
      ...raw.diagram
    },
    timeline: raw.timeline,
    invariants: raw.invariants,
    notPrevented: raw.notPrevented,
    replay: {
      cliCmd: raw.replayCli || 'npx ztds-audit --conformance --json',
      pythonCode,
      sampleOutput: egressLine
    },
    statutoryNote: String(raw.statutoryNote || ''),
    relatedLinks: [
      { label: 'Client-Side RAM vs. Cloud Proxy DLP', url: '/frameworks/client-side-sanitization-vs-proxy-dlp/' },
      { label: 'CISO Zero-DPA Procurement Pack', url: '/ciso/' }
    ],
    matrixSummary: raw.matrixSummary,
    faqs: raw.faqs,
    syndication: {
      devtoUrl: null,
      hashnodeUrl: null,
      linkedinUrl: null,
      syndicatedAt: null
    }
  };

  const serialized = JSON.stringify(incident);
  const forbidden =
    /(\$\s?\d|\b(?:empower\w*|paradigm\w*|delve|testament|tapestry|game-changer|cutting-edge|synergy)\b|complete immunity|100% legal immunity|eliminates gdpr art\. 28|\b\d{3}-\d{2}-\d{4}\b|[\u{1F300}-\u{1FAFF}])/iu;
  const bad = serialized.match(forbidden);
  if (bad) {
    throw new Error(`Policy/content violation detected in generated candidate: "${bad[0]}"`);
  }
  return incident;
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const seenSlugs = new Set((existing.incidents || []).map(i => i.slug));
  const seenSources = new Set();
  for (const i of existing.incidents || []) {
    for (const s of i.primarySources || []) seenSources.add(normalizeUrl(s.url));
  }

  let pool = [];
  if (SOURCE_URL) {
    pool = [{ url: SOURCE_URL, hintTitle: SOURCE_URL, companionAdvisory: null }];
  } else {
    pool = [...loadPrivacyScrubberCandidates(), ...(await fetchFeedCandidates())];
  }

  const deduped = [];
  const poolUrls = new Set();
  for (const c of pool) {
    const norm = normalizeUrl(c.url);
    if (!norm || seenSources.has(norm) || poolUrls.has(norm)) continue;
    poolUrls.add(norm);
    deduped.push(c);
  }

  console.log(`[Discover] Found ${deduped.length} new candidate primary URL(s) after deduplication.`);
  if (deduped.length === 0) {
    console.log('[Discover] No new candidate URLs to evaluate.');
    return;
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    console.log('[Discover] GEMINI_API_KEY is not configured; exiting cleanly without modifying data/incidents.json.');
    return;
  }

  let added = [];
  for (const cand of deduped) {
    if (added.length >= MAX_CANDIDATES) break;
    console.log(`[Discover] Fetching primary source: ${cand.url}`);
    const doc = await fetchPrimaryAdvisory(cand.url);
    if (!doc.ok) {
      console.log(`[Discover] Skipped (${doc.reason})`);
      continue;
    }

    const aiEval = await evaluateWithGemini(cand, doc, apiKey);
    if (!aiEval) {
      console.log('[Discover] Skipped (AI evaluation returned null)');
      continue;
    }

    const score = Number(aiEval.ztdsRelevanceScore || 0);
    console.log(`[Discover] Candidate score=${score}/10 — ${aiEval.scoreRationale || ''}`);
    if (score < 8) {
      console.log('[Discover] Below ZTDS relevance threshold (<8); skipping.');
      continue;
    }

    try {
      const inc = validateAndMaterialize(aiEval, cand.companionAdvisory);
      if (seenSlugs.has(inc.slug)) {
        console.log(`[Discover] Duplicate slug "${inc.slug}"; skipping.`);
        continue;
      }
      if (IS_DRY_RUN) {
        console.log('[Discover] DRY-RUN passed candidate validation:\n' + JSON.stringify(inc, null, 2));
        added.push(inc);
        continue;
      }

      existing.incidents.unshift(inc);
      existing.hub.modifiedIso = inc.modifiedIso;
      fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
      added.push(inc);
    } catch (err) {
      console.warn(`[Discover] Candidate rejected by deterministic gate: ${err.message}`);
    }
  }

  if (added.length === 0) {
    console.log('[Discover] No high-signal ZTDS candidate found.');
    return;
  }

  if (!IS_DRY_RUN) {
    console.log('[Discover] Running atomic build pipeline (npm run incidents:build)...');
    execSync('npm run incidents:build', { cwd: ROOT, stdio: 'inherit' });
    if (SUMMARY_OUT) {
      const inc = added[0];
      const summaryMd = [
        `## Automated ZTDS Incident Counterfactual Candidate`,
        '',
        `- **Slug**: \`${inc.slug}\``,
        `- **Target URL**: ${inc.url}`,
        `- **Primary Advisory**: ${inc.primarySources.map(s => `[${s.label}](${s.url})`).join(', ')}`,
        `- **Verified Python Output**: \`${inc.replay.sampleOutput}\``,
        '',
        `### Reviewer Fact-Check Checklist (Option A Gate)`,
        `- [ ] Confirm primary bulletin dates, vendor names, and facts against ${inc.primarySources[0].url}`,
        `- [ ] Verify \`What ZTDS Does NOT Prevent\` boundaries make zero false security claims`,
        `- [ ] Check **42/42** CI tests + **0** \`ztds-audit\` findings before merging PR`
      ].join('\n');
      fs.writeFileSync(SUMMARY_OUT, summaryMd + '\n', 'utf8');
    }
  }
}

main().catch(err => {
  console.error('[Discover] Fatal error:', err);
  process.exit(1);
});
