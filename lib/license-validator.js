/**
 * ZTDS Offline Cryptographic License Validator
 * 
 * Enforces enterprise subscription terms, node counts, expiration dates,
 * and profile authorization strictly in memory without external network calls.
 * Conforms to ZTDS Invariant 1 (Zero External Egress).
 * 
 * Technology: Asymmetric Ed25519 (RFC 8032) via Node.js native crypto.
 * Licensor: Ilya Sibiryakov / BrandMeWeb Ecosystem
 */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Embedded Default Public Verification Key (SPKI PEM)
const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAg3N98ZgL4Uqbu0PmqvG8KN8vUicYkgKfUNVgwlLObr4=
-----END PUBLIC KEY-----`;

// Custom Error Hierarchy
class LicenseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class LicenseMalformedError extends LicenseError {
  constructor(msg = "License token format is invalid or malformed.") {
    super(msg, "ERR_LICENSE_MALFORMED");
  }
}

class LicenseTamperedError extends LicenseError {
  constructor(msg = "Cryptographic signature validation failed. License payload has been tampered with or corrupted.") {
    super(msg, "ERR_LICENSE_TAMPERED");
  }
}

class LicenseExpiredError extends LicenseError {
  constructor(msg = "License has expired and exceeded the authorized grace period.") {
    super(msg, "ERR_LICENSE_EXPIRED");
  }
}

class FeatureUnauthorizedError extends LicenseError {
  constructor(msg = "Requested entity profile or feature is not authorized under the active subscription tier.") {
    super(msg, "ERR_FEATURE_UNAUTHORIZED");
  }
}

/**
 * Deterministically sorts object keys at all nesting levels
 * to guarantee reproducible cryptographic hashing.
 */
function canonicalizeJson(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicalizeJson);
  }
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};
  for (const key of sortedKeys) {
    sortedObj[key] = canonicalizeJson(obj[key]);
  }
  return sortedObj;
}

/**
 * Base64URL decoding helper
 */
function base64urlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64");
}

/**
 * Base64URL encoding helper
 */
function base64urlEncode(buf) {
  return buf.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Parses and verifies a ZTDS 3-part license token.
 * 
 * @param {string} tokenString - Format: ZTDS-LIC-v1.{payload_b64url}.{sig_b64url}
 * @param {Object} options - Validation options
 * @param {string} [options.publicKeyPem] - Optional custom public key PEM
 * @param {Date} [options.currentTime] - Optional time override for testing
 * @returns {Object} Validated license payload with active status metadata
 */
function verifyLicense(tokenString, options = {}) {
  if (!tokenString || typeof tokenString !== "string") {
    throw new LicenseMalformedError("License token must be a non-empty string.");
  }

  const parts = tokenString.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "ZTDS-LIC-v1") {
    throw new LicenseMalformedError("Invalid license token format. Expected prefix 'ZTDS-LIC-v1'.");
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
    throw new LicenseMalformedError("Failed to decode token payload or signature: " + err.message);
  }

  // Canonicalize payload for cryptographic verification
  const canonicalPayload = canonicalizeJson(payload);
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalPayload), "utf8");

  // Load public key
  let publicKeyPem = options.publicKeyPem || process.env.ZTDS_LICENSE_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;
  if (!publicKeyPem.includes("BEGIN PUBLIC KEY")) {
    try {
      if (fs.existsSync(publicKeyPem)) {
        publicKeyPem = fs.readFileSync(publicKeyPem, "utf8");
      }
    } catch (_) {}
  }

  // Cryptographic Ed25519 signature verification
  let isSignatureValid = false;
  try {
    isSignatureValid = crypto.verify(
      null, // Ed25519 does not take a separate digest algorithm in Node crypto
      canonicalBytes,
      publicKeyPem,
      signatureBuffer
    );
  } catch (err) {
    throw new LicenseTamperedError("Cryptographic verification failed: " + err.message);
  }

  if (!isSignatureValid) {
    throw new LicenseTamperedError();
  }

  // Validate expiration and grace period
  const now = options.currentTime || new Date();
  const expiresAt = new Date(payload.expires_at);
  const graceDays = payload.grace_period_days || 0;
  const graceExpiresAt = new Date(expiresAt.getTime() + graceDays * 24 * 60 * 60 * 1000);

  const isExpired = now > expiresAt;
  const isGracePeriodActive = isExpired && now <= graceExpiresAt;

  if (now > graceExpiresAt) {
    throw new LicenseExpiredError(
      `License expired on ${expiresAt.toISOString()} and exceeded the ${graceDays}-day grace period.`
    );
  }

  return {
    valid: true,
    inGracePeriod: isGracePeriodActive,
    graceDaysRemaining: isGracePeriodActive 
      ? Math.max(0, Math.ceil((graceExpiresAt - now) / (1000 * 60 * 60 * 24)))
      : 0,
    licenseId: payload.license_id,
    customerName: payload.customer_name,
    tier: payload.tier,
    maxNodes: payload.max_nodes,
    expiresAt: payload.expires_at,
    features: payload.features || {},
    payload
  };
}

/**
 * Asserts whether a specific industry profile is authorized under the active license.
 * Enforces the Anti-Cannibalization Mandate programmatically.
 * 
 * @param {Object} licenseData - Result from verifyLicense()
 * @param {string} profileName - Profile identifier (e.g., 'healthcare', 'financial', 'legal')
 */
function assertProfileAllowed(licenseData, profileName) {
  if (!profileName || profileName === "universal" || profileName === "general") {
    return true; // Universal consumer PII is always permitted
  }

  if (!licenseData || !licenseData.features) {
    throw new FeatureUnauthorizedError(
      `Specialized profile '${profileName}' requires an active commercial license.`
    );
  }

  const features = licenseData.features;

  // Global enterprise tier has wildcard access
  if (features.allowed_profiles && features.allowed_profiles.includes("*")) {
    return true;
  }

  // Check explicit allowed profiles array
  if (Array.isArray(features.allowed_profiles) && features.allowed_profiles.includes(profileName.toLowerCase())) {
    return true;
  }

  throw new FeatureUnauthorizedError(
    `Specialized profile '${profileName}' is not authorized under tier '${licenseData.tier}'. ` +
    `Upgrade to Enterprise Air-Gapped tier to unlock vertical profiles (https://ztds.ai/sdk).`
  );
}

/**
 * Returns a human-readable, safe summary of the license for startup logs.
 */
function getLicenseSummary(tokenString, options = {}) {
  try {
    const res = verifyLicense(tokenString, options);
    return {
      status: res.inGracePeriod ? "GRACE_PERIOD" : "ACTIVE",
      tier: res.tier,
      customer: res.customerName,
      maxNodes: res.maxNodes,
      expiresAt: res.expiresAt,
      allowedProfilesCount: (res.features.allowed_profiles && res.features.allowed_profiles[0] === "*") ? 25 : (res.features.allowed_profiles || []).length
    };
  } catch (err) {
    return {
      status: "INVALID",
      error: err.message,
      code: err.code
    };
  }
}

module.exports = {
  verifyLicense,
  assertProfileAllowed,
  getLicenseSummary,
  canonicalizeJson,
  base64urlEncode,
  base64urlDecode,
  DEFAULT_PUBLIC_KEY,
  LicenseError,
  LicenseMalformedError,
  LicenseTamperedError,
  LicenseExpiredError,
  FeatureUnauthorizedError
};
