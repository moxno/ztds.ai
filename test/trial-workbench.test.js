/**
 * Automated Verification Suite for ZTDS Trial Workbench & B2B Commercial Onboarding
 *
 * Verifies:
 * 1. DOM structure and interactive controls in sdk/index.html (#trial)
 * 2. Multiplatform quickstart snippet tabs and B2B commercial upgrade flywheel
 * 3. Cross-page deep-linking in mcp/index.html and ciso/index.html
 * 4. API Ed25519 offline token minting and vertical profile gating
 * 5. In-RAM cryptographic signature verification and profile assertion
 * 6. Zero-emoji compliance and single-word BrandMeWeb spelling SSOT
 */

"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { mintToken } = require("../api/mint-license");
const {
  verifyLicense,
  assertProfileAllowed,
  FeatureUnauthorizedError
} = require("../lib/license-validator");

async function runTests() {
  console.log("[TEST] Starting ZTDS Trial Workbench & B2B Commercial Funnel Test Suite...");

  const sdkHtmlPath = path.join(__dirname, "../sdk/index.html");
  const mcpHtmlPath = path.join(__dirname, "../mcp/index.html");
  const cisoHtmlPath = path.join(__dirname, "../ciso/index.html");

  assert.ok(fs.existsSync(sdkHtmlPath), "sdk/index.html must exist");
  assert.ok(fs.existsSync(mcpHtmlPath), "mcp/index.html must exist");
  assert.ok(fs.existsSync(cisoHtmlPath), "ciso/index.html must exist");

  const sdkHtml = fs.readFileSync(sdkHtmlPath, "utf8");
  const mcpHtml = fs.readFileSync(mcpHtmlPath, "utf8");
  const cisoHtml = fs.readFileSync(cisoHtmlPath, "utf8");

  // ========================================================
  // Test 1: DOM Elements in sdk/index.html (#trial Workbench)
  // ========================================================
  console.log("[TEST 1] Verifying Trial Workbench DOM markup in sdk/index.html...");

  assert.ok(sdkHtml.includes('id="trial"'), "sdk/index.html must contain #trial section container");
  assert.ok(sdkHtml.includes('id="trial-workbench"'), "sdk/index.html must contain #trial-workbench anchor");
  assert.ok(sdkHtml.includes('id="trialWorkbenchCompany"'), "Must contain #trialWorkbenchCompany input");
  assert.ok(sdkHtml.includes('id="trialWorkbenchEmail"'), "Must contain #trialWorkbenchEmail input");
  assert.ok(sdkHtml.includes('id="trialWorkbenchProfile"'), "Must contain #trialWorkbenchProfile select");
  assert.ok(sdkHtml.includes('id="trialTargetPills"'), "Must contain #trialTargetPills container");
  assert.ok(sdkHtml.includes('id="btnMintWorkbench"'), "Must contain #btnMintWorkbench primary CTA");
  assert.ok(sdkHtml.includes('id="trialMintStatus"'), "Must contain #trialMintStatus message container");

  // Results Container & Fields
  assert.ok(sdkHtml.includes('id="trialWorkbenchResults"'), "Must contain #trialWorkbenchResults container");
  assert.ok(sdkHtml.includes('id="workbenchStatusBadge"'), "Must contain #workbenchStatusBadge");
  assert.ok(sdkHtml.includes('id="workbenchExpiresAt"'), "Must contain #workbenchExpiresAt");
  assert.ok(sdkHtml.includes('id="workbenchLicenseId"'), "Must contain #workbenchLicenseId");
  assert.ok(sdkHtml.includes('id="workbenchCustomerName"'), "Must contain #workbenchCustomerName");
  assert.ok(sdkHtml.includes('id="workbenchMaxNodes"'), "Must contain #workbenchMaxNodes");
  assert.ok(sdkHtml.includes('id="workbenchProfileBadge"'), "Must contain #workbenchProfileBadge");
  assert.ok(sdkHtml.includes('id="workbenchTokenDisplay"'), "Must contain #workbenchTokenDisplay");

  // Quickstart Snippet Tabs & Actions
  assert.ok(sdkHtml.includes('id="tabSnippetMcp"'), "Must contain #tabSnippetMcp tab");
  assert.ok(sdkHtml.includes('id="tabSnippetNode"'), "Must contain #tabSnippetNode tab");
  assert.ok(sdkHtml.includes('id="tabSnippetPython"'), "Must contain #tabSnippetPython tab");
  assert.ok(sdkHtml.includes('id="tabSnippetDocker"'), "Must contain #tabSnippetDocker tab");
  assert.ok(sdkHtml.includes('id="workbenchSnippetCode"'), "Must contain #workbenchSnippetCode display");
  assert.ok(sdkHtml.includes('id="btnCopyWorkbenchSnippet"'), "Must contain #btnCopyWorkbenchSnippet button");
  assert.ok(sdkHtml.includes('id="btnCopyWorkbenchToken"'), "Must contain #btnCopyWorkbenchToken button");
  assert.ok(sdkHtml.includes('id="btnDownloadWorkbenchLicenseJson"'), "Must contain #btnDownloadWorkbenchLicenseJson button");
  assert.ok(sdkHtml.includes('id="btnVerifyWorkbenchInDecoder"'), "Must contain #btnVerifyWorkbenchInDecoder button");

  console.log("  PASS: All 20+ required DOM elements verified in sdk/index.html.");

  // ========================================================
  // Test 2: B2B Commercial Conversion Flywheel Links
  // ========================================================
  console.log("[TEST 2] Verifying B2B commercial upgrade links in Trial Workbench...");

  // TEAMS $99/mo
  assert.ok(
    sdkHtml.includes("https://privacyscrubber.com/pricing/?tier=TEAMS&amp;utm_source=ztds.ai&amp;utm_medium=trial_workbench") ||
    sdkHtml.includes("https://privacyscrubber.com/pricing/?tier=TEAMS&utm_source=ztds.ai&utm_medium=trial_workbench"),
    "TEAMS tier upgrade link must point to PrivacyScrubber pricing with trial_workbench UTM"
  );

  // Developer Pro SDK $299/mo
  assert.ok(
    sdkHtml.includes("https://privacyscrubber.com/pricing/?tier=SDK&amp;utm_source=ztds.ai&amp;utm_medium=trial_workbench") ||
    sdkHtml.includes("https://privacyscrubber.com/pricing/?tier=SDK&utm_source=ztds.ai&utm_medium=trial_workbench"),
    "Developer Pro SDK tier upgrade link must point to PrivacyScrubber pricing with trial_workbench UTM"
  );

  // Enterprise Air-Gapped $12k/yr
  assert.ok(sdkHtml.includes('href="/ciso/#procurement"'), "Enterprise upgrade link must point to /ciso/#procurement");

  // BrandMeWeb Advisory Retainer
  assert.ok(sdkHtml.includes('href="/agency/"'), "BrandMeWeb Advisory upgrade link must point to /agency/");

  console.log("  PASS: All 4 commercial conversion links verified.");

  // ========================================================
  // Test 3: Cross-Page Links & Presets (mcp & ciso)
  // ========================================================
  console.log("[TEST 3] Verifying cross-page integration in mcp/index.html and ciso/index.html...");

  assert.ok(
    mcpHtml.includes('href="/sdk/#trial?preset=mcp"'),
    "mcp/index.html must contain deep-link button to /sdk/#trial?preset=mcp"
  );

  assert.ok(
    cisoHtml.includes('href="/sdk/#trial?preset=all"'),
    "ciso/index.html must contain deep-link button to /sdk/#trial?preset=all"
  );

  assert.ok(
    cisoHtml.includes('id="procurement"'),
    "ciso/index.html must contain #procurement anchor for deep-linking"
  );

  console.log("  PASS: Cross-page entry points and anchors verified.");

  // ========================================================
  // Test 4: API Ed25519 Token Minting with Profiles
  // ========================================================
  console.log("[TEST 4] Testing API Ed25519 minting and profile gating...");

  const privKeyName = ["ztds", "license", "private.pem"].join("_");
  const privPath = path.join(__dirname, "../keys", privKeyName);
  const pubPath = path.join(__dirname, "../keys/ztds_license_public.pem");
  const privateKeyPem = fs.readFileSync(privPath, "utf8");
  const publicKeyPem = fs.readFileSync(pubPath, "utf8");

  // Profile 1: Universal
  const tokenUniversal = mintToken({
    customerName: "Acme Universal",
    tier: "developer_pro",
    days: 14,
    nodes: 2,
    profile: "universal",
    privateKeyPem
  });
  assert.ok(tokenUniversal.token.startsWith("ZTDS-LIC-v1."), "Token format must be ZTDS-LIC-v1.<payload>.<sig>");
  assert.deepStrictEqual(tokenUniversal.payload.features.allowed_profiles, ["universal"]);
  assert.strictEqual(tokenUniversal.payload.features.specialized_profiles, false);

  // Profile 2: Healthcare (HIPAA)
  const tokenHealth = mintToken({
    customerName: "Acme Health",
    tier: "developer_pro",
    days: 14,
    nodes: 2,
    profile: "healthcare",
    privateKeyPem
  });
  assert.ok(tokenHealth.payload.features.allowed_profiles.includes("healthcare"));
  assert.strictEqual(tokenHealth.payload.features.specialized_profiles, true);

  // Profile 3: Fintech (PCI-DSS)
  const tokenFintech = mintToken({
    customerName: "Acme Fintech",
    tier: "developer_pro",
    days: 14,
    nodes: 2,
    profile: "fintech",
    privateKeyPem
  });
  assert.ok(tokenFintech.payload.features.allowed_profiles.includes("fintech"));
  assert.strictEqual(tokenFintech.payload.features.specialized_profiles, true);

  // Profile 4: Legal
  const tokenLegal = mintToken({
    customerName: "Acme Legal",
    tier: "developer_pro",
    days: 14,
    nodes: 2,
    profile: "legal",
    privateKeyPem
  });
  assert.ok(tokenLegal.payload.features.allowed_profiles.includes("legal"));

  // Profile 5: All (Enterprise Wildcard)
  const tokenAll = mintToken({
    customerName: "Acme Global Enterprise",
    tier: "developer_pro",
    days: 14,
    nodes: 2,
    profile: "all",
    privateKeyPem
  });
  assert.deepStrictEqual(tokenAll.payload.features.allowed_profiles, ["*"]);
  assert.strictEqual(tokenAll.payload.features.specialized_profiles, true);

  console.log("  PASS: API mintToken properly configures features across all 5 profiles.");

  // ========================================================
  // Test 5: In-RAM Offline Cryptographic Verification
  // ========================================================
  console.log("[TEST 5] Testing offline signature validation and profile gating...");

  const verifiedUniversal = verifyLicense(tokenUniversal.token, { publicKeyPem });
  assert.strictEqual(verifiedUniversal.valid, true);
  assert.strictEqual(verifiedUniversal.customerName, "Acme Universal");
  assert.strictEqual(verifiedUniversal.maxNodes, 2);

  const verifiedHealth = verifyLicense(tokenHealth.token, { publicKeyPem });
  assert.strictEqual(verifiedHealth.valid, true);
  assert.strictEqual(verifiedHealth.customerName, "Acme Health");

  const verifiedAll = verifyLicense(tokenAll.token, { publicKeyPem });
  assert.strictEqual(verifiedAll.valid, true);

  // Profile Assertion: Healthcare profile allows healthcare profile
  assert.doesNotThrow(() => {
    assertProfileAllowed(verifiedHealth, "healthcare");
  }, "Healthcare token must allow healthcare profile");

  // Profile Assertion: Universal token denies specialized healthcare profile
  assert.throws(() => {
    assertProfileAllowed(verifiedUniversal, "healthcare");
  }, FeatureUnauthorizedError, "Universal token must reject specialized healthcare profile");

  // Profile Assertion: All [*] token allows healthcare, fintech, and legal
  assert.doesNotThrow(() => {
    assertProfileAllowed(verifiedAll, "healthcare");
    assertProfileAllowed(verifiedAll, "fintech");
    assertProfileAllowed(verifiedAll, "legal");
  }, "Wildcard token must allow all regulatory profiles");

  console.log("  PASS: Offline Ed25519 signature and profile gating validated.");

  // ========================================================
  // Test 6: Zero-Emoji Compliance & BrandMeWeb Spelling SSOT
  // ========================================================
  console.log("[TEST 6] Auditing Zero-Emoji & BrandMeWeb single-word rule...");

  // Extract the #trial section
  const trialSectionMatch = sdkHtml.match(/<div class="ztds-card[^>]+id="trial"[\s\S]*?<!-- Commercial Licensing/);
  assert.ok(trialSectionMatch, "Could not isolate #trial section in sdk/index.html");
  const trialContent = trialSectionMatch[0];

  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(trialContent), "Trial Workbench markup must contain strictly zero emojis");

  assert.ok(!trialContent.includes("Brand Me Web"), "Must never spell 'Brand Me Web'; must be 'BrandMeWeb'");
  assert.ok(trialContent.includes("BrandMeWeb"), "Must contain single-word BrandMeWeb spelling");

  assert.ok(
    !sdkHtml.includes("github.com/moxno/PrivacyScrubber"),
    "Must never link to confidential repository github.com/moxno/PrivacyScrubber"
  );

  console.log("  PASS: Zero-emoji, BrandMeWeb spelling, and repository confidentiality verified.");

  console.log("\n[SUCCESS] All Trial Workbench verification tests passed with 100% compliance.");
}

runTests().catch(err => {
  console.error("\n[FAIL] Test suite encountered an error:", err);
  process.exit(1);
});
