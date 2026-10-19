# Empirical Evaluation Tables: W3C Solid Pod & Local LLM 3-Boundary MITM Study

**Paper Title:** *Preserving Data Sovereignty in Decentralized Storage: Client-Side Ephemeral Sanitization for Solid Pod AI Ingestion*  
**Authors:** **Ilya Sibiryakov** (First Author & Principal Architect, ZTDS AI Consortium) and **Jeremy Pesner** (Co-First & Corresponding Author, Georgetown University)  
**Protocol Standard:** ZTDS RFC v1.0 / IETF `draft-sibiryakov-ztds-protocol-02`  
**Execution Timestamp:** `2026-10-19T15:17:24.623Z`  
**Hardware Environment:** `Apple M1 Pro` (10 cores, 16 GB RAM, Darwin 27.0.0 (arm64), Node v24.12.0)  

---

## Table 1: Three-Boundary Data Exposure Matrix (Condition A vs. Condition B)

| Inspection Boundary | Metric | Condition A: Baseline W3C Solid Pod (WAC/ACP Only) | Condition B: Solid Pod + ZTDS In-Memory Middleware | Empirical Delta |
| :--- | :--- | :--- | :--- | :--- |
| **Boundary 1: Client Pod RAM** | Authorized Entities Extracted | 61 / 61 (100.0%) | 61 / 61 (100.0%) | Full Local Utility |
| **Boundary 1: Client Pod RAM** | Pre-Egress Sanitization Latency (p50 / p95 / p99) | N/A (0 µs) | **9.1 µs** / 14.5 µs / 69.2 µs | **< 0.5 ms Overhead** |
| **Boundary 2: Network Transit (MITM Wire Tap)** | Cleartext Entities Captured on Wire | **61 / 61 (100.00%)** | **0 / 61 (0.00%)** | **-100.00% Wire Leakage** |
| **Boundary 2: Network Transit (MITM Wire Tap)** | Cleartext PII/PHI Bytes Captured on Wire | **968 Bytes** | **0 Bytes** | **Zero-Byte Egress (Invariant 1)** |
| **Boundary 3: LLM Server Context Window** | Cleartext Entities Ingested by Model | **61 / 61 (100.00%)** | **0 / 61 (0.00%)** | **100.00% Model Insulation** |
| **Boundary 3 -> 1: Client Stream Re-Hydration** | Bijective Restoration Fidelity (BFS) | N/A (Cleartext) | **100.00%** | **Zero Data Loss (Invariant 2)** |
| **Boundary 1: Post-Session Teardown** | Theorem 2 Ephemeral RAM Zeroization | Persistent in Context | **100.00% (0 Residual Keys)** | **Complete Volatile Purge (Invariant 3)** |

---

## Table 2: Scenario-Level Empirical Breakdown Across 12 W3C Solid Pod Resources

| Scenario ID | Decentralized Storage Domain | Pod Serialization | Sensitive Entities | Baseline MITM Wire Leakage | ZTDS MITM Wire Leakage | Stream Restoration Fidelity | Client p50 Latency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SOLID-HLTH-01` | Healthcare & Clinical EHR Pod (HIPAA) | `text/turtle` | 5 | **100.0%** (79 B) | **0.00%** (0 B) | **100.0%** | 13.5 µs |
| `SOLID-HLTH-02` | Healthcare & Clinical EHR Pod (HIPAA) | `application/ld+json` | 5 | **100.0%** (81 B) | **0.00%** (0 B) | **100.0%** | 9.4 µs |
| `SOLID-HLTH-03` | Healthcare & Clinical EHR Pod (HIPAA) | `text/turtle` | 5 | **100.0%** (79 B) | **0.00%** (0 B) | **100.0%** | 9.1 µs |
| `SOLID-FIN-01` | Financial & Sovereign Wealth Pod (GLBA / PCI-DSS) | `application/ld+json` | 5 | **100.0%** (82 B) | **0.00%** (0 B) | **100.0%** | 9.5 µs |
| `SOLID-FIN-02` | Financial & Sovereign Wealth Pod (GLBA / PCI-DSS) | `text/turtle` | 5 | **100.0%** (86 B) | **0.00%** (0 B) | **100.0%** | 8.9 µs |
| `SOLID-FIN-03` | Financial & Sovereign Wealth Pod (GLBA / PCI-DSS) | `application/ld+json` | 6 | **100.0%** (87 B) | **0.00%** (0 B) | **100.0%** | 8.4 µs |
| `SOLID-LGL-01` | Legal & Fiduciary Trust Pod (FRE 502 Privilege) | `text/turtle` | 5 | **100.0%** (85 B) | **0.00%** (0 B) | **100.0%** | 9 µs |
| `SOLID-LGL-02` | Legal & Fiduciary Trust Pod (FRE 502 Privilege) | `application/ld+json` | 5 | **100.0%** (78 B) | **0.00%** (0 B) | **100.0%** | 9.1 µs |
| `SOLID-LGL-03` | Legal & Fiduciary Trust Pod (FRE 502 Privilege) | `text/turtle` | 5 | **100.0%** (81 B) | **0.00%** (0 B) | **100.0%** | 8.8 µs |
| `SOLID-DEV-01` | Decentralized Identity & DevSecOps Pod (WebID / OIDC) | `text/turtle` | 5 | **100.0%** (76 B) | **0.00%** (0 B) | **100.0%** | 9.1 µs |
| `SOLID-DEV-02` | Decentralized Identity & DevSecOps Pod (WebID / OIDC) | `text/turtle` | 5 | **100.0%** (77 B) | **0.00%** (0 B) | **100.0%** | 8.6 µs |
| `SOLID-DEV-03` | Decentralized Identity & DevSecOps Pod (WebID / OIDC) | `application/ld+json` | 5 | **100.0%** (77 B) | **0.00%** (0 B) | **100.0%** | 8.8 µs |

---

## LaTeX Snippet for PoPETS / USENIX PEPR Manuscript (Section 5: Empirical Evaluation)

```latex
\begin{table*}[t]
\centering
\caption{Three-Boundary Empirical Data Exposure: Standard W3C Solid Pod (WAC/ACP) vs. ZTDS Client-Side Ephemeral Sanitization ($N = 61$ Sensitive Entities across 12 Pod Resources)}
\label{tab:solid-ztds-boundaries}
\begin{tabular}{llccc}
\toprule
\textbf{Inspection Boundary} & \textbf{Measured Telemetry Metric} & \textbf{Baseline (WAC/ACP Only)} & \textbf{ZTDS Middleware (RFC v1.0)} & \textbf{Security / Privacy Gain} \\
\midrule
Boundary 1 (Client RAM) & Authorized Pod Entities Loaded & 61/61 (100\%) & 61/61 (100\%) & Full Local Utility \\
Boundary 1 (Client RAM) & Tokenization Latency ($p_{50} / p_{99}$) & --- & 9.1\,$\mu$s / 69.2\,$\mu$s & Sub-Millisecond ($<1$\,ms) \\
Boundary 2 (MITM Wire Tap) & Cleartext Entities Intercepted & 61/61 (100.0\%) & \textbf{0/61 (0.00\%)} & \textbf{100.0\% Leakage Eliminated} \\
Boundary 2 (MITM Wire Tap) & Raw Sensitive Bytes on Socket & 968\,B & \textbf{0\,B} & \textbf{Zero-Byte Network Egress} \\
Boundary 3 (LLM Server) & Sensitive Entities in Context Window & 61/61 (100.0\%) & \textbf{0/61 (0.00\%)} & \textbf{Zero Server Exposure} \\
Boundary 3 $\rightarrow$ 1 & Bijective Stream Restoration Fidelity & --- & \textbf{100.00\%} & Lossless Client Recovery \\
Boundary 1 (Teardown) & Theorem 2 Volatile Heap Zeroization & Unprotected & \textbf{100.00\% (0 Residuals)} & Forward Memory Secrecy \\
\bottomrule
\end{tabular}
\end{table*}
```
