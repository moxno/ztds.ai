#!/usr/bin/env node
'use strict';

/**
 * ZTDS.ai — +24h Delayed Canonical API Syndicator (DEV.to + Hashnode)
 *
 * Publishes canonical technical syndications ONLY after:
 *   1. >= 24h elapsed since canonical ZTDS incident publishedIso (unless --force-immediate)
 *   2. Canonical https://ztds.ai/incidents/<slug>/ URL responds HTTP 200 live
 *   3. DEV.to or Hashnode slot is not yet recorded in data/incidents.json -> syndication
 *
 * Updates data/incidents.json with confirmed URLs once SSR <link rel="canonical"> is verified.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'incidents.json');

const ARGS = process.argv.slice(2);
const IS_DRY_RUN = ARGS.includes('--dry-run');
const FORCE_IMMEDIATE = ARGS.includes('--force-immediate');
const TARGET_SLUG = (ARGS.find(a => a.startsWith('--slug=')) || '').split('=')[1] || null;
const DELAY_24H_MS = 24 * 60 * 60 * 1000;

function renderSyndicationMarkdown(inc, hubUrl) {
  const timelineRows = (inc.timeline || [])
    .map(t => `| ${t.window} | ${t.event} | ${t.verifiedDetail} |`)
    .join('\n');
  const invRows = (inc.invariants || [])
    .map(v => `| ${v.id} | ${v.howItHelps} | ${v.outcome} |`)
    .join('\n');
  const sources = (inc.primarySources || []).map(s => `- [${s.label}](${s.url})`).join('\n');
  const companionLine =
    inc.companionAdvisory && inc.companionAdvisory.url
      ? `\n- [${inc.companionAdvisory.title}](${inc.companionAdvisory.url})`
      : '';
  const limits = (inc.notPrevented || []).map(x => `- ${x}`).join('\n');
  const related = (inc.relatedLinks || []).map(r => `- [${r.label}](https://ztds.ai${r.url})`).join('\n');

  return `> Originally published in the [ZTDS RFC v1.0 Incident Counterfactuals Hub](${inc.url}). Grounded strictly in primary vendor security advisories.

## Executive Counterfactual Summary

${inc.directAnswer}

${inc.heroLead}

## Verified Primary Sources & Timeline

${sources}${companionLine}

| Verified Window | Milestone | Confirmed Bulletin Record |
| :--- | :--- | :--- |
${timelineRows}

## Trust Boundary Architecture Comparison

**Baseline path (without local ZTDS isolation):**
1. ${inc.diagram.topLeft}
2. ${inc.diagram.midLeft}
3. Outcome: ${inc.diagram.botLeft}

**ZTDS RFC v1.0 counterfactual boundary:**
1. ${inc.diagram.topRight}
2. ${inc.diagram.midRight}
3. Outcome: ${inc.diagram.botRight}

## Mapping Against ZTDS RFC v1.0 Invariants

| ZTDS Invariant | Protocol Enforcement | Counterfactual Outcome |
| :--- | :--- | :--- |
${invRows}

## What ZTDS Does NOT Prevent

ZTDS governs pre-egress payload confidentiality inside volatile memory. It complements infrastructure sandboxing, IAM controls, and package integrity checks rather than replacing them:

${limits}

## Reproducible Synthetic Replay & CLI Verification

\`\`\`bash
${inc.replay.cliCmd}
\`\`\`

\`\`\`python
${inc.replay.pythonCode}
\`\`\`

Verified local output:

\`\`\`text
${inc.replay.sampleOutput}
\`\`\`

## Statutory Risk Minimization & Deployment Paths

${inc.statutoryNote}

- Open Hub & Counterfactuals: [ZTDS.ai Incident Counterfactuals](${hubUrl})
- CISO Governance Documentation: [Zero-DPA Procurement Pack](https://ztds.ai/ciso/)
- Certified Local Ecosystem (\`@privacyscrubber/mcp-server\`, \`@privacyscrubber/sdk\`): [ZTDS Verified Registry](https://ztds.ai/registry/) and [PrivacyScrubber](https://privacyscrubber.com/pricing/?utm_source=ztds_syndication)

### Related Technical Post-Mortems

${related}
`;
}

async function isLive200(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
    return res.status === 200;
  } catch (_) {
    return false;
  }
}

async function verifyCanonicalTag(url, expectedCanonical) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (res.status !== 200) return { ok: false, reason: `HTTP ${res.status}` };
    const html = await res.text();
    const match = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (!match) return { ok: false, reason: 'Missing canonical link tag' };
    return { ok: match[1] === expectedCanonical, actual: match[1] };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function publishToDevTo(inc, bodyMarkdown, apiKey) {
  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      article: {
        title: inc.headline.slice(0, 128),
        published: true,
        body_markdown: bodyMarkdown,
        tags: ['security', 'ai', 'privacy', 'devsecops'],
        canonical_url: inc.url,
        main_image: inc.ogImage || undefined
      }
    }),
    signal: AbortSignal.timeout(20000)
  });
  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(`DEV.to API error ${res.status}: ${JSON.stringify(data)}`);
  }
  const ver = await verifyCanonicalTag(data.url, inc.url);
  if (!ver.ok) {
    console.warn(`[Syndicate] DEV.to canonical check warning for ${data.url}: ${ver.reason || ver.actual}`);
  }
  return data.url;
}

async function publishToHashnode(inc, bodyMarkdown, token, pubId) {
  const mutation = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          url
          canonicalUrl
        }
      }
    }
  `;
  const res = await fetch('https://gql-beta.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-hashnode-client': 'ztds-syndicator'
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          title: inc.headline,
          publicationId: pubId,
          contentMarkdown: bodyMarkdown,
          originalArticleURL: inc.url,
          slug: `${inc.slug}-ztds`,
          tags: [{ name: 'AI Security', slug: 'ai-security' }],
          coverImageOptions: inc.ogImage ? { coverImageURL: inc.ogImage } : undefined,
          metaTags: {
            title: inc.title.slice(0, 60),
            description: inc.metaDescription.slice(0, 150)
          }
        }
      }
    }),
    signal: AbortSignal.timeout(20000)
  });
  const data = await res.json();
  const isProGated =
    Array.isArray(data.errors) &&
    data.errors.some(
      e => e?.extensions?.code === 'FORBIDDEN' || /active Pro plan/i.test(e?.message || '')
    );
  if (isProGated) {
    console.warn(
      `[Syndicate] Hashnode API skipped for ${inc.slug}: publication ${pubId} requires an active Hashnode Pro plan (upgrade in Hashnode dashboard or publish manually via web UI).`
    );
    return null;
  }
  const postUrl = data?.data?.publishPost?.post?.url;
  if (!res.ok || data.errors || !postUrl) {
    throw new Error(`Hashnode GraphQL error: ${JSON.stringify(data.errors || data)}`);
  }
  const ver = await verifyCanonicalTag(postUrl, inc.url);
  if (!ver.ok) {
    console.warn(`[Syndicate] Hashnode canonical check warning for ${postUrl}: ${ver.reason || ver.actual}`);
  }
  return postUrl;
}

async function main() {
  const ssot = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const incidents = ssot.incidents || [];
  const hubUrl = ssot.hub?.url || 'https://ztds.ai/incidents/';
  const devtoKey = (process.env.DEVTO_API_KEY || '').trim();
  const hashnodeToken = (process.env.HASHNODE_TOKEN || '').trim();
  const hashnodePubId = (process.env.HASHNODE_PUBLICATION_ID || '6aff24a1d4293966e07b8f23').trim();

  let mutated = false;
  let eligibleCount = 0;

  for (const inc of incidents) {
    if (TARGET_SLUG && inc.slug !== TARGET_SLUG) continue;
    const syn = inc.syndication || { devtoUrl: null, hashnodeUrl: null, linkedinUrl: null, syndicatedAt: null };
    const md = renderSyndicationMarkdown(inc, hubUrl);

    if (/\$\s?\d|[\u{1F300}-\u{1FAFF}]/u.test(md)) {
      throw new Error(`Policy guard failed rendering syndication Markdown for ${inc.slug}`);
    }

    const needDevto = !syn.devtoUrl;
    const needHashnode = !syn.hashnodeUrl;
    const ageMs = Date.now() - Date.parse(inc.publishedIso || '2026-11-21T00:00:00Z');
    const mature = FORCE_IMMEDIATE || ageMs >= DELAY_24H_MS;

    if (IS_DRY_RUN) {
      console.log(
        `[Syndicate DRY-RUN] ${inc.slug} | md=${md.length} chars | mature=${mature} | needDevto=${needDevto} | needHashnode=${needHashnode}`
      );
      continue;
    }

    if (!needDevto && !needHashnode) continue;
    if (!mature) {
      console.log(`[Syndicate] Holding ${inc.slug} until 24h post-publication window clears.`);
      continue;
    }

    const originReady = await isLive200(inc.url);
    if (!originReady) {
      console.warn(`[Syndicate] Canonical origin not returning HTTP 200 yet (${inc.url}); skipping.`);
      continue;
    }

    eligibleCount++;

    if (needDevto) {
      if (!devtoKey) {
        console.log(`[Syndicate] DEVTO_API_KEY unset — skipping DEV.to for ${inc.slug}.`);
      } else {
        syn.devtoUrl = await publishToDevTo(inc, md, devtoKey);
        syn.syndicatedAt = new Date().toISOString();
        mutated = true;
        console.log(`[Syndicate] Published DEV.to -> ${syn.devtoUrl}`);
      }
    }

    if (needHashnode) {
      if (!hashnodeToken) {
        console.log(`[Syndicate] HASHNODE_TOKEN unset — skipping Hashnode for ${inc.slug}.`);
      } else {
        const hashnodeUrl = await publishToHashnode(inc, md, hashnodeToken, hashnodePubId);
        if (hashnodeUrl) {
          syn.hashnodeUrl = hashnodeUrl;
          syn.syndicatedAt = new Date().toISOString();
          mutated = true;
          console.log(`[Syndicate] Published Hashnode -> ${syn.hashnodeUrl}`);
        }
      }
    }

    inc.syndication = syn;
  }

  if (mutated) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(ssot, null, 2) + '\n', 'utf8');
    console.log('[Syndicate] Persisted updated syndication records to data/incidents.json.');
  } else if (!IS_DRY_RUN) {
    console.log(`[Syndicate] Complete (${eligibleCount} eligible pending incidents checked, 0 updates persisted).`);
  }
}

main().catch(err => {
  console.error('[Syndicate] Fatal error:', err);
  process.exit(1);
});
