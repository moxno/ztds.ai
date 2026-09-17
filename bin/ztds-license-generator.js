#!/usr/bin/env node

/**
 * ZTDS Founder License Minting CLI
 * 
 * Generates cryptographically signed, zero-telemetry offline licenses
 * for enterprise customers under the ZTDS specification.
 * 
 * Usage:
 *   node bin/ztds-license-generator.js --customer "Acme Health" --tier enterprise_airgapped --nodes 5
 */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { canonicalizeJson, base64urlEncode } = require("../lib/license-validator");

function printHelp() {
  console.log(`
ZTDS Enterprise License Generator (Ed25519)
------------------------------------------------------------
Usage:
  node bin/ztds-license-generator.js [options]

Required Options:
  --customer <name>     Customer legal corporate name

Optional Options:
  --tier <tier>         developer_pro | enterprise_airgapped | global_site (default: enterprise_airgapped)
  --nodes <number>      Maximum authorized nodes (default: 5)
  --months <number>     Subscription duration in months (default: 12)
  --profiles <list>     Allowed profiles: '*' for all, or comma-separated: healthcare,financial (default: '*')
  --grace <days>        Grace period days past expiration (default: 60)
  --key <path>          Path to Ed25519 private key PEM (default: keys/ztds_license_private.pem)
  --out <path>          Save license token to designated .lic file
  --help                Show this help message
------------------------------------------------------------
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    customer: null,
    tier: "enterprise_airgapped",
    nodes: 5,
    months: 12,
    profiles: "*",
    grace: 60,
    keyPath: null,
    outPath: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--customer" && args[i + 1]) {
      options.customer = args[++i];
    } else if (arg === "--tier" && args[i + 1]) {
      options.tier = args[++i];
    } else if (arg === "--nodes" && args[i + 1]) {
      options.nodes = parseInt(args[++i], 10);
    } else if (arg === "--months" && args[i + 1]) {
      options.months = parseInt(args[++i], 10);
    } else if (arg === "--profiles" && args[i + 1]) {
      options.profiles = args[++i];
    } else if (arg === "--grace" && args[i + 1]) {
      options.grace = parseInt(args[++i], 10);
    } else if (arg === "--key" && args[i + 1]) {
      options.keyPath = args[++i];
    } else if (arg === "--out" && args[i + 1]) {
      options.outPath = args[++i];
    }
  }

  return options;
}

function loadPrivateKey(specifiedPath) {
  if (specifiedPath && fs.existsSync(specifiedPath)) {
    return fs.readFileSync(specifiedPath, "utf8");
  }

  if (process.env.ZTDS_LICENSE_PRIVATE_KEY) {
    return process.env.ZTDS_LICENSE_PRIVATE_KEY;
  }

  const defaultPath = path.join(__dirname, "../keys/ztds_license_private.pem");
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, "utf8");
  }

  console.error("Error: Private signing key not found.");
  console.error("Provide a key via --key <path> or set ZTDS_LICENSE_PRIVATE_KEY.");
  process.exit(1);
}

function main() {
  const options = parseArgs();

  if (!options.customer) {
    console.error("Error: --customer <name> is required.\n");
    printHelp();
    process.exit(1);
  }

  const privateKeyPem = loadPrivateKey(options.keyPath);

  const now = new Date();
  const expiresDate = new Date(now.getTime() + options.months * 30 * 24 * 60 * 60 * 1000);

  const tierPrefix = options.tier.includes("dev") ? "DEV" : (options.tier.includes("global") ? "GLB" : "ENT");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const licenseId = `ZTDS-2026-${tierPrefix}-${randomSuffix}`;

  let allowedProfiles = ["*"];
  if (options.tier === "developer_pro") {
    allowedProfiles = [];
  } else if (options.profiles !== "*") {
    allowedProfiles = options.profiles.split(",").map(s => s.trim().toLowerCase());
  }

  const payload = {
    license_id: licenseId,
    customer_id: `cust_${options.customer.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 24)}`,
    customer_name: options.customer,
    tier: options.tier,
    issued_at: now.toISOString(),
    expires_at: expiresDate.toISOString(),
    grace_period_days: options.grace,
    max_nodes: options.nodes,
    features: {
      universal_pii: true,
      specialized_profiles: options.tier !== "developer_pro",
      allowed_profiles: allowedProfiles,
      evidence_binder: options.tier !== "developer_pro",
      airgapped_enclave: true
    }
  };

  const canonicalPayload = canonicalizeJson(payload);
  const canonicalBytes = Buffer.from(JSON.stringify(canonicalPayload), "utf8");

  let signatureBuffer;
  try {
    signatureBuffer = crypto.sign(null, canonicalBytes, privateKeyPem);
  } catch (err) {
    console.error("Signing failed: " + err.message);
    process.exit(1);
  }

  const payloadB64 = base64urlEncode(canonicalBytes);
  const signatureB64 = base64urlEncode(signatureBuffer);

  const token = `ZTDS-LIC-v1.${payloadB64}.${signatureB64}`;

  console.log("============================================================");
  console.log("ZTDS ENTERPRISE OFFLINE LICENSE MINTED");
  console.log("============================================================");
  console.log(`License ID:     ${licenseId}`);
  console.log(`Customer:       ${options.customer}`);
  console.log(`Tier:           ${options.tier}`);
  console.log(`Nodes:          ${options.nodes}`);
  console.log(`Expires:        ${expiresDate.toISOString()}`);
  console.log(`Grace Period:   ${options.grace} days`);
  console.log(`Profiles:       ${allowedProfiles.length ? allowedProfiles.join(", ") : "Universal PII only"}`);
  console.log("------------------------------------------------------------");
  console.log("SIGNED TOKEN:");
  console.log(token);
  console.log("------------------------------------------------------------");

  if (options.outPath) {
    fs.writeFileSync(options.outPath, token, "utf8");
    console.log(`Saved license file to: ${options.outPath}`);
  }

  console.log(`
CUSTOMER ACTIVATION INSTRUCTIONS:
1. Set environment variable in air-gapped node:
   export ZTDS_LICENSE_KEY="${token}"

2. Or pass directly in code:
   const { ZTDSEngine } = require("@privacyscrubber/sdk");
   const engine = new ZTDSEngine({ licenseKey: "${token}" });
============================================================
`);
}

main();
