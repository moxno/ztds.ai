#!/usr/bin/env bash
# ==============================================================================
# ZTDS.ai — Master Verification Runner (RFC v1.0 Conformance Suite)
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "----------------------------------------------------------------------"
echo "[ZTDS] Executing Comprehensive Verification Suite across all modules..."
echo "----------------------------------------------------------------------"

# 1. Invariant Codebase Auditor
echo ""
echo ">> Step 1/12: Running Invariant Codebase Auditor..."
node bin/ztds-audit.js --dir ./data

# 2. Cryptographic Licensing Engine
echo ""
echo ">> Step 2/12: Running Offline Ed25519 Licensing Test..."
node test/license.test.js

# 3. Domain Scanner & Anti-SSRF Protection
echo ""
echo ">> Running Domain Scanner & Anti-SSRF Tests..."
node test/scan-domain.test.js

# 4. Lead Capture & Rate Limiting
echo ""
echo ">> Running Lead Capture & Rate Limiting Tests..."
node test/lead-capture.test.js

# 5. Schema.org Knowledge Graph
echo ""
echo ">> Running Schema.org & GEO Knowledge Graph Tests..."
node test/schema.test.js

# 6. Scanner UI & Progressive Disclosure
echo ""
echo ">> Running Scanner UI Tests..."
node test/scanner-ui.test.js

# 7. BrandMeWeb Agency Package & SOW
echo ""
echo ">> Running BrandMeWeb Agency Package Tests..."
node test/agency.test.js

# 10. Routes Integrity & Zero-Emoji Audit
echo ""
echo ">> Step 10/12: Running Routes Integrity & Zero-Emoji Tests..."
node test/routes-integrity.test.js

# 11. Registry & Ecosystem JSON Schema
echo ""
echo ">> Step 11/12: Running Ecosystem Registries Schema Tests..."
node test/registries-schema.test.js

# 12. GEO Corpus & Sitemap Alignment
echo ""
echo ">> Step 12/12: Running GEO Corpus & Sitemap Tests..."
node test/geo-corpus.test.js

echo ""
echo "======================================================================"
echo "[SUCCESS] ALL 12 VERIFICATION SUITES PASSED WITH 100% CONFORMANCE."
echo "======================================================================"
