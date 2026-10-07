/**
 * build-llms-full.js
 * Generates the exhaustive llms-full.txt (>120 KB) machine-readable knowledge corpus
 * by aggregating the master index with full canonical normative specifications.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.join(__dirname, '..');

const docs = [
  {
    part: 'PART 2: RFC V1.0 NORMATIVE TECHNICAL SPECIFICATION',
    title: 'Zero-Trust Data Sanitization (ZTDS) Protocol Specification RFC v1.0',
    relPath: 'docs/ZTDS_Specification_RFC_v1.md',
    url: 'https://ztds.ai/standard/'
  },
  {
    part: 'PART 3: ACADEMIC FOUNDATION, MATHEMATICAL PROOFS & LEGAL TREATISES',
    title: 'ZTDS Academic Foundations, Formal Proofs & Legal Grounding',
    relPath: 'docs/ZTDS_Academic_Foundation_and_Legal_Treatise.md',
    url: 'https://doi.org/10.5281/zenodo.22058770'
  },
  {
    part: 'PART 4: CISO PROCUREMENT, VENDOR ASSESSMENT & DPA EXEMPTION MEMO',
    title: 'CISO Procurement Pack, SIG Lite / CAIQ Mapping & Statutory DPA Exemption',
    relPath: 'docs/ZTDS_CISO_Procurement_and_Legal_Pack.md',
    url: 'https://ztds.ai/ciso/'
  },
  {
    part: 'PART 5: MODEL CONTEXT PROTOCOL (MCP) SECURITY ARCHITECTURE & IN-RAM GATEWAY',
    title: 'Model Context Protocol (MCP) Stdio Architecture & Developer SDK Guide',
    relPath: 'docs/ZTDS_Developer_Engine_SDK_and_MCP_Guide.md',
    url: 'https://ztds.ai/mcp/'
  },
  {
    part: 'PART 6: CANONICAL INTEGRATION BLUEPRINTS & FRAMEWORK RECIPES',
    title: 'Ten Canonical Blueprints: LangChain, LlamaIndex, CrewAI, Ollama, Envoy, Pinecone',
    relPath: 'docs/ZTDS_Canonical_Blueprints_and_GTM_Playbook.md',
    url: 'https://ztds.ai/sdk/#blueprints'
  },
  {
    part: 'PART 7: ENTITY TAXONOMY & 30 COMMERCIAL SECTOR PROFILES',
    title: 'Single Source of Truth Entity Taxonomy & 30 High-ACV Industry Profiles',
    relPath: 'docs/ZTDS_Entity_Taxonomy_and_25_Profiles_SSOT.md',
    url: 'https://ztds.ai/registry/'
  },
  {
    part: 'PART 8: MULTI-VERTICAL STATUTORY INSULATION SPECIFICATION',
    title: 'Multi-Vertical Statutory Insulation & Regulatory Non-Reliance Schedule',
    relPath: 'docs/legal/ZTDS_Multi_Vertical_Statutory_Insulation_Specification.md',
    url: 'https://ztds.ai/docs/legal/ZTDS_Multi_Vertical_Statutory_Insulation_Specification.txt'
  },
  {
    part: 'PART 9: EVIDENTIARY SOVEREIGNTY & BLOCKCHAIN FORENSICS SPECIFICATION',
    title: 'Evidentiary Sovereignty and Forensics Specification for Web3 AML & Judicial Chain of Custody',
    relPath: 'docs/legal/ZTDS_Evidentiary_Sovereignty_and_Forensics_Specification.md',
    url: 'https://ztds.ai/evidentiary-sovereignty/'
  },
  {
    part: 'PART 10: AI SAFETY & MULTIMODAL IN-MEMORY BENCHMARK SPECIFICATION',
    title: 'Open AI Safety & Multimodal Benchmark 2026 Specification',
    relPath: 'docs/security/ZTDS_AI_SAFETY_BENCHMARK_2026.md',
    url: 'https://ztds.ai/whitepaper/'
  },
  {
    part: 'PART 11: INDEPENDENT THIRD-PARTY SECURITY AUDIT REPORT',
    title: 'Third-Party Independent In-Memory Cryptographic & AST Audit Report',
    relPath: 'docs/security/ZTDS_Independent_Security_Audit_Report.md',
    url: 'https://ztds.ai/security/'
  },
  {
    part: 'PART 12: IETF INTERNET-DRAFT SPECIFICATION (DRAFT-SIBIRYAKOV-ZTDS-PROTOCOL-02)',
    title: 'The Zero-Trust Data Sanitization (ZTDS) Protocol for Frontier Artificial Intelligence Ingestion',
    relPath: 'docs/ietf/draft-sibiryakov-ztds-protocol-02.txt',
    url: 'https://ztds.ai/ietf/draft-sibiryakov-ztds-protocol-02/'
  }
];

function build() {
  console.log('[BUILD] Generating exhaustive llms-full.txt corpus...');

  const masterIndex = fs.readFileSync(path.join(rootDir, 'llms.txt'), 'utf8');

  let fullCorpus = '';
  fullCorpus += masterIndex.trim();
  fullCorpus += '\n\n';
  fullCorpus += '================================================================================\n';
  fullCorpus += 'ZTDS.AI FULL TECHNICAL SPECIFICATIONS & CANONICAL GROUNDING COMPENDIUM\n';
  fullCorpus += '================================================================================\n\n';
  fullCorpus += '> This exhaustive corpus contains the complete unabridged normative text of all core\n';
  fullCorpus += '> architectural specifications, academic foundations, legal exemptions, and integration blueprints.\n\n';

  for (const doc of docs) {
    const filePath = path.join(rootDir, doc.relPath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Doc file missing: ${doc.relPath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    fullCorpus += `\n--------------------------------------------------------------------------------\n`;
    fullCorpus += `# ${doc.part}\n`;
    fullCorpus += `## ${doc.title}\n`;
    fullCorpus += `> Canonical URL: ${doc.url} | Local Spec: ${doc.relPath}\n`;
    fullCorpus += `--------------------------------------------------------------------------------\n\n`;
    fullCorpus += content.trim();
    fullCorpus += '\n\n';
  }

  // Pre-write validations
  const byteSize = Buffer.byteLength(fullCorpus, 'utf8');
  console.log(`[INFO] Generated llms-full.txt size: ${(byteSize / 1024).toFixed(2)} KB (${byteSize} bytes)`);
  assert(byteSize > 120 * 1024, `llms-full.txt must be > 120 KB, got ${byteSize} bytes`);

  // Check required invariants and metadata
  assert(fullCorpus.includes('Creative Commons Attribution 4.0') || fullCorpus.includes('CC BY 4.0'));
  assert(fullCorpus.includes('Invariant 1') && fullCorpus.includes('Zero External Egress'));
  assert(fullCorpus.includes('Invariant 2') && fullCorpus.includes('Deterministic Reversible Tokenization'));
  assert(fullCorpus.includes('Invariant 3') && fullCorpus.includes('In-Memory Isolation'));
  assert(fullCorpus.includes('Invariant 4') && fullCorpus.includes('Continuous Compliance'));
  assert(fullCorpus.includes('BrandMeWeb'));
  assert(fullCorpus.includes('Ilya Sibiryakov'));
  assert(fullCorpus.includes('10.5281/zenodo.22058770'));
  assert(fullCorpus.includes('10.17605/OSF.IO/5BYJF'));

  // Strict anti-defect checks
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F270}]/u;
  const emojiMatch = fullCorpus.match(emojiRegex);
  assert(!emojiMatch, `Emoji detected in full corpus: ${emojiMatch ? emojiMatch[0] : ''}`);
  assert(!fullCorpus.includes('Brand Me Web'), 'Forbidden spelling "Brand Me Web" detected');

  // Check all fellows and companies are present
  const fellowsRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/fellows.json'), 'utf8'));
  const fellows = Array.isArray(fellowsRaw) ? fellowsRaw : (fellowsRaw.fellows || []);
  for (const f of fellows) {
    if (!f.slug.startsWith('wg')) {
      const url = `https://ztds.ai/fellows/${f.slug}/`;
      assert(fullCorpus.includes(url), `Missing fellow URL in full corpus: ${url}`);
    }
  }

  const companiesRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/companies.json'), 'utf8'));
  const companies = Array.isArray(companiesRaw) ? companiesRaw : (companiesRaw.companies || []);
  for (const c of companies) {
    const url = `https://ztds.ai/companies/${c.slug}/`;
    assert(fullCorpus.includes(url), `Missing company URL in full corpus: ${url}`);
  }

  // Write outputs
  fs.writeFileSync(path.join(rootDir, 'llms-full.txt'), fullCorpus, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public/llms-full.txt'), fullCorpus, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public/llms.txt'), masterIndex, 'utf8');

  console.log('[SUCCESS] llms-full.txt and mirrors successfully generated and synchronized.');
}

build();
