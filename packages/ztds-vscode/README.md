# ZTDS Guard — Local In-RAM PII & Secret Sanitizer (MCP & AI Firewall)

Local, zero-telemetry VS Code security extension implementing the open <strong>Zero-Trust Data Sanitization (ZTDS RFC v1.0)</strong> standard. Mask PII, credentials, and API secrets inside local host RAM before prompts reach Copilot, Claude, Cursor, or external MCP servers, and configure verified local MCP tool boundaries cleanly.

## Why Developers Use ZTDS Guard in VS Code

* <strong>Defend Against Wild MCP Exploits & Tool-Call Leakage</strong>: With recent critical vulnerabilities such as <code>CVE-2026-120779</code> targeting VS Code MCP clients and cascading multi-server trust poisoning, raw credentials and customer PII inside prompts or workspace context face immediate exfiltration risk.
* <strong>100% Volatile Host RAM Execution</strong>: Zero external API calls, zero cloud proxies, zero disk writes, and zero intermediary subprocessors (GDPR Art. 28 & Recital 26 alignment).
* <strong>Reversible Single-Pass Tokenization</strong>: Substitutes cleartext emails, API tokens, IBANs, SSNs, IPv4 addresses, credit cards, and phone numbers with deterministic surrogate tokens (such as <code>[EMAIL_TOKEN_1]</code> and <code>[API_SECRET_TOKEN_1]</code>) and restores values locally after AI output arrives.

## Commands

Open the Command Palette (<code>Cmd+Shift+P</code> / <code>Ctrl+Shift+P</code>):

* <code>ZTDS: Sanitize Selection in Volatile RAM</code> — Masks sensitive baseline entities in the active selection or document using deterministic surrogate tokens stored solely in extension host memory.
* <code>ZTDS: Restore Surrogate Tokens from RAM</code> — Restores cleartext values from volatile memory with single-pass replacement immune to cascade token injection.
* <code>ZTDS: Audit Active File for PII & Secret Egress</code> — Scans the open editor, surfaces inline VS Code diagnostics on exposed lines, and outputs a SHA-256 compliance receipt.
* <code>ZTDS: Zeroize Volatile Token Session (Theorem 2)</code> — Immediately clears volatile RAM mapping tables and diagnostics.
* <code>ZTDS: Configure Local MCP Firewall (.vscode/mcp.json)</code> — Safely initializes or merges the open-source <code>ztds-mcp</code> stdio server into your workspace configuration.

## Containerized & CLI Runtime Compatibility

Run the underlying open-standard MCP firewall via CLI or the signed multi-arch OCI container on <a href="https://hub.docker.com/r/brandmeweb/ztds-mcp">Docker Hub (brandmeweb/ztds-mcp)</a>:

```bash
npx ztds-mcp init
docker pull brandmeweb/ztds-mcp:latest
```

## Compliance Frameworks & ZTDS RFC v1.0 Documentation

Explore the vendor-neutral specification, security boundaries, and regulatory blueprints on <a href="https://ztds.ai/">ZTDS.ai Open Standard Consortium</a>:

<ul>
  <li><a href="https://ztds.ai/mcp/">MCP In-RAM Security & Tool-Call Boundary Architecture</a></li>
  <li><a href="https://ztds.ai/sdk/">ZTDS Headless Developer SDK & RAG Integration Guide</a></li>
  <li><a href="https://ztds.ai/standard/">ZTDS Protocol Specification RFC v1.0</a></li>
  <li><a href="https://ztds.ai/compliance/">Enterprise Regulatory Compliance & Zero-Subprocessor Matrix</a></li>
  <li><a href="https://ztds.ai/scanner/">Zero-Trust Network Egress Scanner & CLI Auditor</a></li>
  <li><a href="https://ztds.ai/frameworks/">Compliance Implementation Blueprints Hub</a></li>
  <li><a href="https://ztds.ai/frameworks/mcp-stdio-pii-sanitization/">MCP Stdio PII Sanitization & Tool Poisoning Mitigation</a></li>
  <li><a href="https://ztds.ai/frameworks/hipaa-safe-harbor-llm-prompts/">HIPAA Safe Harbor De-Identification for LLM Prompts</a></li>
  <li><a href="https://ztds.ai/frameworks/gdpr-article-25-32-ai-prompts/">GDPR Articles 25 & 32 Technical Safe Harbor for AI Prompts</a></li>
  <li><a href="https://ztds.ai/frameworks/eu-ai-act-article-10-data-governance/">EU AI Act Article 10 Data Governance & Prompt Hygiene</a></li>
  <li><a href="https://ztds.ai/frameworks/nist-ai-rmf-generative-ai-profile-pii/">NIST AI RMF Generative AI Profile PII Controls</a></li>
  <li><a href="https://ztds.ai/frameworks/owasp-llm02-sensitive-information-disclosure/">OWASP LLM02 Sensitive Information Disclosure Defense</a></li>
  <li><a href="https://ztds.ai/frameworks/rag-pipeline-pii-sanitization/">RAG Pipeline Client-Side PII Sanitization</a></li>
  <li><a href="https://ztds.ai/frameworks/client-side-sanitization-vs-proxy-dlp/">Client-Side RAM Sanitization vs. Cloud Proxy DLP</a></li>
</ul>

## Pioneer Certified Commercial Implementation (PrivacyScrubber)

For enterprise teams requiring 30 industry compliance profiles (HIPAA 18 identifiers, PCI-DSS, defense CMMC, banking SWIFT) and air-gapped node enforcement, deploy <a href="https://privacyscrubber.com">PrivacyScrubber</a>, engineered by BrandMeWeb:

<ul>
  <li><a href="https://privacyscrubber.com/pii-mcp/">Production MCP Server & Tool-Call Boundary Redaction</a></li>
  <li><a href="https://privacyscrubber.com/sdk/">Headless Node.js, TypeScript & Python RAG SDK</a></li>
  <li><a href="https://privacyscrubber.com/solutions/medical/hipaa-ai-scrubber/">HIPAA Safe Harbor AI Scrubber for Healthcare</a></li>
</ul>

## License

Apache-2.0. Maintained by the ZTDS AI Consortium (Working Group WG-1). Lead Author: Ilya Sibiryakov.
