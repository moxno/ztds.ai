# W3C Solid Pod & Local LLM 3-Boundary MITM Empirical Benchmark Harness

**Study Title:** *Preserving Data Sovereignty in Decentralized Storage: Client-Side Ephemeral Sanitization for Solid Pod AI Ingestion*  
**Target Track:** PoPETS (Privacy Enhancing Technologies Symposium) / USENIX PEPR + SSRN/Zenodo Preprint  
**Protocol Standard:** ZTDS RFC v1.0 / IETF Internet-Draft [`draft-sibiryakov-ztds-protocol-02`](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)  
**Statutory Notice:** U.S. & International Patents Pending.

---

## Authorship & Division of Labor

* **Ilya Sibiryakov** (*First Author & Principal Architect*, ZTDS AI Consortium / BrandMeWeb) — Protocol Specification, In-Memory ZTDS Middleware Architecture, 3-Boundary MITM Telemetry Harness, and Formal Invariant Proofs.
* **Jeremy Pesner** (*Co-First Author & Corresponding Author*, Georgetown University) — Empirical Workstation Validation, Decentralized Access Control (WAC/ACP) Literature Review, and AI Governance / Policy Analysis.

---

## Overview: Three-Boundary Empirical Architecture

W3C Solid Pods provide granular authorization at rest via **Web Access Control (WAC)** and **Access Control Policy (ACP)**. However, once an authorized client application extracts RDF/Turtle (`text/turtle`) or JSON-LD (`application/ld+json`) triples to run a Retrieval-Augmented Generation (RAG) query against an LLM, WAC/ACP enforcement terminates at the Pod boundary.

This turnkey benchmark harness empirically measures cleartext sensitive entity availability across **three distinct architectural inspection points** during an active **Man-in-the-Middle (MITM)** wire interception:

1. **Boundary 1 — Client Pod Memory (`Client_RAM`):**
   - Measures authorized W3C Solid Pod triples loaded into volatile client memory (`N = 61` sensitive entities across 12 Solid Pod resources spanning Healthcare, Financial, Legal, and Identity domains).
   - Measures client-side ZTDS tokenization latency (`p50`, `p95`, `p99` in microseconds `µs`) prior to socket write.
   - Verifies **Theorem 2 Ephemeral RAM Zeroization** (`0` residual keys in `tokenMap` following session teardown).
2. **Boundary 2 — Network Transit / Active MITM Wire Tap (`MITM_Proxy_Wire`):**
   - Spins up a real local TCP/HTTP Man-in-the-Middle proxy interceptor (`127.0.0.1`) between the Solid Pod RAG Client and the LLM Server.
   - Captures exact wire bytes, HTTP headers, Shannon entropy, and cleartext entity leakage rate comparing **Condition A (Baseline Unprotected WAC/ACP RAG)** against **Condition B (ZTDS Client-Side Ephemeral Sanitization Middleware)**.
3. **Boundary 3 — LLM Server Context Window & Client Stream Re-Hydration (`LLM_Server_Context`):**
   - Inspects the exact prompt payload ingested by the LLM inference server (`POST /api/generate`).
   - Streams fragmented NDJSON response chunks back through the client boundary (`StreamingDetokenizer`) to verify **100.00% Bijective Restoration Fidelity (BFS)** across split chunk boundaries.

---

## Quick Start (15-Minute Turnkey Execution)

No manual `mitmproxy`, Wireshark, or custom certificate configuration is required. The harness provisions its own local HTTP wire-tap proxy and supports both deterministic offline execution and live local **Ollama** inference.

### Step 1: Clone & Enter the Harness Directory (~2 mins)

```bash
git clone https://github.com/moxno/ztds.ai.git
cd ztds.ai/benchmarks/solid-pod-mitm-harness
```

### Step 2: Run the Automated 3-Boundary Benchmark (~1 min)

```bash
bash run-benchmarks.sh
# or directly via npm:
npm test
```

The harness will automatically:
1. Load the 12 synthetic W3C Solid Pod RDF/Turtle and JSON-LD fixtures ([`fixtures/solid-pods-dataset.json`](./fixtures/solid-pods-dataset.json)).
2. Start the local **MITM Wire Tap Proxy** (`Boundary 2`) and **Local LLM Inference Endpoint** (`Boundary 3`).
3. Execute **24 paired experimental runs** (`12 Baseline WAC/ACP` vs. `12 ZTDS In-Memory Sanitized`) plus `300` micro-benchmark latency iterations per Pod resource.
4. Export four peer-reviewable publication artifacts into [`results/`](./results/):
   - [`results/telemetry_summary.json`](./results/telemetry_summary.json) — Complete machine-readable telemetry dataset and hardware metadata.
   - [`results/telemetry_runs.csv`](./results/telemetry_runs.csv) — 24-row paired experimental CSV for R, Python, or Stata analysis.
   - [`results/mitm_wire_capture.log`](./results/mitm_wire_capture.log) — Full packet-level HTTP wire capture dump showing what the MITM interceptor captures under Condition A vs. Condition B.
   - [`results/POPETS_EMPIRICAL_TABLES.md`](./results/POPETS_EMPIRICAL_TABLES.md) — Publication-ready Markdown and LaTeX `tabular` tables for Section 5 of the manuscript.

### Step 3 (Optional): Run Against Live Local Ollama Weights (~10 mins)

If you wish to run the exact same 3-boundary MITM harness against live open-source model weights on your workstation:

1. Install Ollama from [https://ollama.com](https://ollama.com) and pull a lightweight local model:
   ```bash
   ollama pull llama3.2
   ```
2. Execute the harness in live Ollama mode:
   ```bash
   npm run benchmark:ollama
   # or:
   bash run-benchmarks.sh --live-ollama
   ```

---

## Repository Structure

```text
benchmarks/solid-pod-mitm-harness/
├── CITATION.cff                     # Formal academic citation & authorship metadata
├── README.md                        # Turnkey setup & methodology documentation
├── package.json                     # Harness dependencies (@privacyscrubber/sdk ^2.4.0)
├── run-benchmarks.sh                # One-command turnkey execution script
├── run-solid-mitm-benchmark.js      # 3-Boundary MITM proxy, LLM server & telemetry runner
├── fixtures/
│   └── solid-pods-dataset.json      # 12 W3C Solid Pod RDF/Turtle & JSON-LD test resources
└── results/
    ├── POPETS_EMPIRICAL_TABLES.md   # Auto-generated Markdown & LaTeX tables for paper
    ├── mitm_wire_capture.log        # Raw HTTP wire payloads intercepted at Boundary 2
    ├── telemetry_runs.csv           # Paired experimental CSV dataset (24 runs)
    └── telemetry_summary.json       # Complete structured JSON benchmark report
```
