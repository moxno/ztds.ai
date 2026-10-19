#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "====================================================================================="
echo "ZTDS.ai — Turnkey Solid Pod & Local LLM 3-Boundary MITM Benchmark Runner (v2.4.0)"
echo "====================================================================================="

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js (>=18.0.0) is required. Install from https://nodejs.org"
  exit 1
fi

if [ ! -d "node_modules/@privacyscrubber/sdk" ]; then
  echo "[Setup] Installing certified ZTDS reference engine (@privacyscrubber/sdk@2.4.0)..."
  npm install --no-audit --no-fund --silent || true
fi

if curl -s -m 1 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "[Ollama] Local Ollama daemon detected at http://127.0.0.1:11434."
  if [ "${1:-}" = "--live-ollama" ]; then
    node run-solid-mitm-benchmark.js --live-ollama
  else
    node run-solid-mitm-benchmark.js
  fi
else
  echo "[Enclave] Running deterministic local 3-boundary MITM & loopback LLM benchmark..."
  node run-solid-mitm-benchmark.js
fi
