/**
 * ZTDS.ai Cryptographic Conformance Certificate Engine
 * 
 * Generates and validates cryptographically signed ZTDS Conformance Certificates
 * for AI software, agents, RAG pipelines, and enterprise deployments.
 * 
 * Conforms to ZTDS RFC v1.0 & Ed25519 (RFC 8032) standards.
 * Standards Authority: ZTDS AI Consortium & BrandMeWeb Ecosystem
 * Author: Ilya Sibiryakov (ORCID: 0009-0002-0642-5985)
 */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  canonicalizeJson,
  base64urlEncode,
  base64urlDecode,
  DEFAULT_PUBLIC_KEY
} = require("./license-validator");

// Custom Error Hierarchy
class CertificateError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class CertificateMalformedError extends CertificateError {
  constructor(msg = "Certificate format is invalid or malformed.") {
    super(msg, "ERR_CERT_MALFORMED");
  }
}

class CertificateTamperedError extends CertificateError {
  constructor(msg = "Cryptographic signature validation failed. Certificate payload has been tampered with or corrupted.") {
    super(msg, "ERR_CERT_TAMPERED");
  }
}

class CertificateExpiredError extends CertificateError {
  constructor(msg = "Certificate has expired past its 365-day validity window.") {
    super(msg, "ERR_CERT_EXPIRED");
  }
}

/**
 * Loads Ed25519 private signing key from specified path, env, or default path.
 */
function loadPrivateKey(specifiedPath) {
  if (specifiedPath && fs.existsSync(specifiedPath)) {
    return fs.readFileSync(specifiedPath, "utf8");
  }

  if (process.env.ZTDS_CERT_PRIVATE_KEY) {
    return process.env.ZTDS_CERT_PRIVATE_KEY;
  }

  const defaultKeyName = ["ztds", "license", "private.pem"].join("_");
  const defaultPath = path.join(__dirname, "..", "keys", defaultKeyName);
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, "utf8");
  }

  throw new CertificateError(
    "Private signing key not found. Provide --key <path> or set ZTDS_CERT_PRIVATE_KEY environment variable.",
    "ERR_KEY_NOT_FOUND"
  );
}

/**
 * Loads Ed25519 public key.
 */
function loadPublicKey(specifiedPath) {
  if (specifiedPath && fs.existsSync(specifiedPath)) {
    return fs.readFileSync(specifiedPath, "utf8");
  }
  if (process.env.ZTDS_CERT_PUBLIC_KEY) {
    return process.env.ZTDS_CERT_PUBLIC_KEY;
  }
  if (process.env.ZTDS_LICENSE_PUBLIC_KEY) {
    return process.env.ZTDS_LICENSE_PUBLIC_KEY;
  }
  const defaultPath = path.join(__dirname, "../keys/ztds_license_public.pem");
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, "utf8");
  }
  return DEFAULT_PUBLIC_KEY;
}

/**
 * Generates an Ed25519-signed ZTDS Conformance Certificate.
 * 
 * @param {Object} options
 * @param {string} options.applicant - Legal name or handle of developer/organization
 * @param {string} options.product - Name of the application, library, or agent
 * @param {string} [options.category] - Product category (e.g., 'AI Agent', 'RAG Pipeline')
 * @param {string} [options.repository] - Source repository URL or package URI
 * @param {string} options.auditHash - SHA-256 tree hash calculated during scan
 * @param {string} [options.level] - Conformance level: 'Level 1', 'Level 2', 'Level 3' (default: 'Level 1')
 * @param {number} [options.scannedFilesCount] - Number of audited source files
 * @param {string} [options.privateKeyPem] - Ed25519 private key PEM
 * @param {number} [options.validityDays] - Validity duration in days (default: 365)
 * @returns {Object} { token, certificate, payload }
 */
function mintCertificate(options = {}) {
  if (!options.applicant) {
    throw new CertificateError("Applicant name is required for certificate issuance.", "ERR_MISSING_APPLICANT");
  }
  if (!options.product) {
    throw new CertificateError("Product name is required for certificate issuance.", "ERR_MISSING_PRODUCT");
  }
  if (!options.auditHash || !options.auditHash.startsWith("sha256:")) {
    throw new CertificateError("A valid sha256: audit hash is required for certificate issuance.", "ERR_MISSING_HASH");
  }

  const privateKey = options.privateKeyPem || loadPrivateKey(options.keyPath);
  const now = options.currentTime || new Date();
  const validityDays = options.validityDays || 365;
  const expiresAt = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

  const cleanProductSlug = options.product.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 20);
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  const certId = `ZTDS-CERT-2026-${cleanProductSlug.toUpperCase()}-${randomSuffix}`;

  const payload = {
    certificate_id: certId,
    standard: "ZTDS RFC v1.0",
    specification_url: "https://ztds.ai/standard/",
    authority: "ZTDS AI Consortium & Standards Authority (BrandMeWeb Ecosystem)",
    level: options.level || "Level 1: Automated CTS Invariant Conformance",
    subject: {
      applicant: options.applicant,
      product: options.product,
      category: options.category || "Autonomous AI Software & Sanitization Node",
      repository: options.repository || "https://ztds.ai/registry/",
      audit_hash: options.auditHash,
      scanned_files_count: options.scannedFilesCount || 0
    },
    invariants: {
      invariant_1_zero_egress: "PASS",
      invariant_2_reversible_tokens: "PASS",
      invariant_3_in_memory_isolation: "PASS",
      invariant_4_zero_subprocessors: "PASS"
    },
    issued_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    validity_days: validityDays,
    registry_verification_url: `https://ztds.ai/registry/#${cleanProductSlug}`,
    badge_url: `https://ztds.ai/badge/${cleanProductSlug}.svg`
  };

  const canonicalPayload = canonicalizeJson(payload);
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalPayload), "utf8");

  let signatureBuffer;
  try {
    signatureBuffer = crypto.sign(null, canonicalBytes, privateKey);
  } catch (err) {
    throw new CertificateError("Failed to sign certificate: " + err.message, "ERR_SIGNING_FAILED");
  }

  const payloadB64 = base64urlEncode(canonicalBytes);
  const signatureB64 = base64urlEncode(signatureBuffer);
  const token = `ZTDS-CERT-v1.${payloadB64}.${signatureB64}`;

  return {
    token,
    certificate_id: certId,
    payload,
    canonical_json: JSON.stringify(canonicalPayload, null, 2)
  };
}

/**
 * Validates a ZTDS 3-part certificate token.
 * 
 * @param {string} tokenString - Format: ZTDS-CERT-v1.{payload_b64url}.{sig_b64url}
 * @param {Object} [options]
 * @param {string} [options.publicKeyPem]
 * @param {Date} [options.currentTime]
 * @returns {Object} Validated certificate data
 */
function verifyCertificate(tokenString, options = {}) {
  if (!tokenString || typeof tokenString !== "string") {
    throw new CertificateMalformedError("Certificate token must be a non-empty string.");
  }

  const parts = tokenString.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "ZTDS-CERT-v1") {
    throw new CertificateMalformedError("Invalid certificate token format. Expected prefix 'ZTDS-CERT-v1'.");
  }

  const payloadB64 = parts[1];
  const signatureB64 = parts[2];

  let rawPayloadJson;
  let payload;
  let signatureBuffer;

  try {
    rawPayloadJson = base64urlDecode(payloadB64).toString("utf8");
    payload = JSON.parse(rawPayloadJson);
    signatureBuffer = base64urlDecode(signatureB64);
  } catch (err) {
    throw new CertificateMalformedError("Failed to decode certificate payload or signature: " + err.message);
  }

  const canonicalPayload = canonicalizeJson(payload);
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalPayload), "utf8");

  const publicKeyPem = options.publicKeyPem || loadPublicKey(options.keyPath);

  let isSignatureValid = false;
  try {
    isSignatureValid = crypto.verify(
      null,
      canonicalBytes,
      publicKeyPem,
      signatureBuffer
    );
  } catch (err) {
    throw new CertificateTamperedError("Cryptographic verification failed: " + err.message);
  }

  if (!isSignatureValid) {
    throw new CertificateTamperedError();
  }

  const now = options.currentTime || new Date();
  const expiresAt = new Date(payload.expires_at);

  if (now > expiresAt) {
    throw new CertificateExpiredError(
      `Certificate ${payload.certificate_id} expired on ${expiresAt.toISOString()}.`
    );
  }

  const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));

  return {
    valid: true,
    certificate_id: payload.certificate_id,
    standard: payload.standard,
    level: payload.level,
    subject: payload.subject,
    invariants: payload.invariants,
    issued_at: payload.issued_at,
    expires_at: payload.expires_at,
    days_remaining: daysRemaining,
    payload
  };
}

module.exports = {
  mintCertificate,
  verifyCertificate,
  loadPrivateKey,
  loadPublicKey,
  CertificateError,
  CertificateMalformedError,
  CertificateTamperedError,
  CertificateExpiredError
};
