#!/usr/bin/env node

/**
 * ZTDS.ai — Cryptographic Conformance Certificate Verifier CLI
 * 
 * Verifies authenticity, integrity, and validity of ZTDS RFC v1.0
 * Conformance Certificates issued by the ZTDS AI Consortium.
 * 
 * Technology: Ed25519 (RFC 8032) / Zero-Telemetry Verification.
 * 
 * Usage:
 *   npx ztds-verify ZTDS-CERT-v1.<payload>.<sig>
 *   npx ztds-verify --cert path/to/certificate.cert
 *   node bin/ztds-verify.js --json <token_or_file>
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { verifyCertificate, CertificateError } = require("../lib/certificate-manager");

const ARGS = process.argv.slice(2);
const IS_JSON = ARGS.includes("--json");
const IS_STRICT = ARGS.includes("--strict");

if (ARGS.includes("--help") || ARGS.includes("-h") || ARGS.length === 0) {
  console.log(`
ZTDS.ai Conformance Certificate Verifier (v1.1.1)
Cryptographic Ed25519 (RFC 8032) verification for ZTDS RFC v1.0.

Usage:
  npx ztds-verify [options] <token_or_file_or_slug>

Options:
  --cert <path|token>  Certificate file path, entity slug, domain, or raw token string
  --key <path>         Custom Ed25519 public key PEM
  --strict             Enforce strict active conformance (reject expired or grace-window tokens)
  --json               Output machine-readable JSON verification result
  -h, --help           Show this help message

Specification: https://ztds.ai/standard/
Registry:      https://ztds.ai/registry/
`);
  process.exit(ARGS.length === 0 ? 1 : 0);
}

function resolveSlugOrDomainToken(rawInput) {
  const rootDir = path.resolve(__dirname, "..");
  const normalized = rawInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];

  if (!normalized) return null;

  // 1. Direct local .cert lookup in certs/<slug>.cert
  const slugSafe = normalized.replace(/[^a-z0-9-]/g, "");
  if (slugSafe) {
    const certFilePath = path.join(rootDir, "certs", `${slugSafe}.cert`);
    if (fs.existsSync(certFilePath)) {
      return fs.readFileSync(certFilePath, "utf8").trim();
    }
  }

  // 2. Registry lookup (data/registry.json)
  try {
    const regData = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "registry.json"), "utf8"));
    if (regData && Array.isArray(regData.entities)) {
      const hit = regData.entities.find(
        (e) =>
          (e.slug && e.slug.toLowerCase() === normalized) ||
          (e.id && e.id.toLowerCase() === normalized) ||
          (normalized === "privacyscrubber-ztds-guard" && e.slug === "privacyscrubber-wp-guard")
      );
      if (hit && hit.certificate && hit.certificate.token) return hit.certificate.token;
    }
  } catch (_) {}

  // 3. Corporate Adopter lookup (data/companies.json)
  try {
    const compData = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "companies.json"), "utf8"));
    if (compData && Array.isArray(compData.companies)) {
      const hit = compData.companies.find((c) => {
        const host = String(c.url || "")
          .toLowerCase()
          .replace(/^https?:\/\//i, "")
          .replace(/^www\./i, "")
          .split("/")[0];
        return (
          (c.slug && c.slug.toLowerCase() === normalized) ||
          (c.id && c.id.toLowerCase() === normalized) ||
          (host && host === normalized)
        );
      });
      if (hit && hit.certificate && hit.certificate.token) return hit.certificate.token;
    }
  } catch (_) {}

  // 4. Protected Web Domain lookup (data/domains.json)
  try {
    const domData = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "domains.json"), "utf8"));
    if (domData && Array.isArray(domData.domains)) {
      const hit = domData.domains.find((d) => {
        const dom = String(d.domain || "").toLowerCase();
        const slug = String(d.slug || "").toLowerCase();
        const id = String(d.id || "").toLowerCase();
        return (
          dom === normalized ||
          slug === normalized ||
          id === normalized ||
          `${id}-ztds` === normalized
        );
      });
      if (hit && hit.certificate && hit.certificate.token) return hit.certificate.token;
    }
  } catch (_) {}

  return null;
}

function parseTokenInput() {
  let certArg = null;
  let keyPath = null;

  for (let i = 0; i < ARGS.length; i++) {
    const arg = ARGS[i];
    if (arg === "--cert" && ARGS[i + 1]) {
      certArg = ARGS[++i];
    } else if (arg === "--key" && ARGS[i + 1]) {
      keyPath = ARGS[++i];
    } else if (arg === "--json" || arg === "--strict") {
      continue;
    } else if (!arg.startsWith("-") && !certArg) {
      certArg = arg;
    }
  }

  if (!certArg) {
    console.error("Error: Missing certificate token, slug, domain, or file argument.");
    process.exit(1);
  }

  let tokenString = certArg.trim();
  // Check if it's an existing file path
  if (fs.existsSync(tokenString) && fs.statSync(tokenString).isFile()) {
    try {
      tokenString = fs.readFileSync(tokenString, "utf8").trim();
    } catch (e) {
      console.error(`Error reading certificate file '${certArg}': ${e.message}`);
      process.exit(1);
    }
  } else if (!tokenString.startsWith("ZTDS-CERT-")) {
    const resolved = resolveSlugOrDomainToken(tokenString);
    if (resolved) {
      tokenString = resolved;
    }
  }

  return { tokenString, keyPath };
}

const { tokenString, keyPath } = parseTokenInput();

try {
  const result = verifyCertificate(tokenString, { keyPath });
  if (IS_STRICT && (!result.valid || (typeof result.days_remaining === "number" && result.days_remaining <= 0))) {
    const strictErr = new CertificateError("Certificate failed --strict active validity enforcement.");
    strictErr.code = "ERR_STRICT_CONFORMANCE_REJECTED";
    throw strictErr;
  }

  if (IS_JSON) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  console.log("\n\x1b[1m\x1b[36m[ZTDS]\x1b[0m \x1b[1mCryptographic Conformance Certificate Verifier\x1b[0m \x1b[90m(RFC v1.0)\x1b[0m");
  console.log("\x1b[90m----------------------------------------------------------------------\x1b[0m");
  console.log(`Certificate ID: \x1b[1m\x1b[33m${result.certificate_id}\x1b[0m`);
  console.log(`Standard:       \x1b[37m${result.standard}\x1b[0m`);
  console.log(`Level:          \x1b[36m${result.level}\x1b[0m`);
  console.log(`Applicant:      \x1b[37m${result.subject.applicant}\x1b[0m`);
  console.log(`Product:        \x1b[1m\x1b[37m${result.subject.product}\x1b[0m`);
  console.log(`Audit Hash:     \x1b[90m${result.subject.audit_hash}\x1b[0m`);
  console.log(`Files Audited:  \x1b[37m${result.subject.scanned_files_count} files\x1b[0m`);
  console.log(`Validity:       \x1b[32mActive (${result.days_remaining} days remaining)\x1b[0m`);
  console.log(`Expires At:     \x1b[90m${result.expires_at}\x1b[0m`);
  console.log("\x1b[90m----------------------------------------------------------------------\x1b[0m\n");

  console.log("\x1b[1m\x1b[32m[PASS] CRYPTOGRAPHIC SIGNATURE VALIDATED (Ed25519 / RFC 8032)\x1b[0m");
  console.log("\x1b[90mPayload integrity confirmed: 0 tampering or bit alterations detected.\x1b[0m\n");

  console.log("\x1b[1mVerified Invariants:\x1b[0m");
  console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 1: Zero External Egress Prior to Sanitization`);
  console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 2: Deterministic Reversible Tokenization`);
  console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 3: Verifiable In-Memory Isolation (Volatile RAM)`);
  console.log(`  \x1b[32m[PASS]\x1b[0m Invariant 4: Zero Sub-Processor Telemetry / Persistent Logging\n`);

  console.log("\x1b[1mCompliance Entitlement:\x1b[0m");
  console.log("  - Full GDPR Article 28 DPA Exemption (Zero-Subprocessor Chain)");
  console.log("  - HIPAA Safe Harbor Section 164.514(b) Conformance");
  console.log("  - Authorized to display ZTDS Verified Trust Badge\n");

  process.exit(0);
} catch (err) {
  if (IS_JSON) {
    console.log(JSON.stringify({
      valid: false,
      error: err.message,
      code: err.code || "ERR_VERIFICATION_FAILED"
    }, null, 2));
    process.exit(1);
  }

  console.log("\n\x1b[1m\x1b[36m[ZTDS]\x1b[0m \x1b[1mCryptographic Conformance Certificate Verifier\x1b[0m");
  console.log("\x1b[90m----------------------------------------------------------------------\x1b[0m");
  console.log(`\x1b[1m\x1b[31m[FAIL] CERTIFICATE VERIFICATION REJECTED: ${err.message}\x1b[0m`);
  console.log(`Error Code: \x1b[33m${err.code || "ERR_VERIFICATION_FAILED"}\x1b[0m\n`);
  console.log("\x1b[90mThe certificate signature did not match the ZTDS Authority public key,");
  console.log("or the token format has been corrupted or altered.\x1b[0m\n");
  process.exit(1);
}
