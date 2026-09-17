# Air-Gapped Enterprise End User License Agreement (EULA)

**APPLICABLE TO: ON-PREMISE, SCIF, AWS NITRO ENCLAVE, AND PRIVATE CLOUD VPC INSTALLATIONS OF THE ZTDS DATA-PLANE ENGINE.**

---

### IMPORTANT NOTICE
THIS AIR-GAPPED ENTERPRISE END USER LICENSE AGREEMENT ("EULA") IS A LEGAL AGREEMENT BETWEEN YOU ("LICENSEE" OR "CUSTOMER") AND ILYA SIBIRYAKOV / BRANDMEWEB ("LICENSOR"). BY COMPILING, EMBEDDING, OR EXECUTING THE ZTDS AIR-GAPPED BINARY, DOCKER CONTAINER, NITRO ENCLAVE IMAGE, OR WEBASSEMBLY ENGINE, LICENSEE AGREES TO BE BOUND BY THE TERMS OF THIS EULA.

---

## 1. Air-Gapped Operational Model & Disconnected Rights

1.1. **Zero-Telemetry Verification:** Licensor acknowledges and agrees that the Software is engineered to operate in mission-critical, air-gapped, isolated networks without connectivity to the public internet or external control planes. 

1.2. **No License Phone-Home:** Licensor represents and warrants that:
(a) The Software does not contain any licensing heartbeats, phone-home beacons, remote kill-switches, telemetry agents, or external socket dependencies;
(b) License verification is performed strictly via offline cryptographic validation (Ed25519 or RSA-4096 signed license files) evaluated locally in memory; and
(c) The Software will never attempt DNS resolution, HTTP/S egress, or socket connections to Licensor domains or third-party analytical endpoints during runtime execution.

---

## 2. Permitted Deployments & Node Topology

2.1. **Authorized Enclave Scope:** Licensee is authorized to deploy the Software within:
- Internal on-premise bare-metal servers or private hypervisors;
- Hardware-isolated enclaves (including AWS Nitro Enclaves, AMD SEV-SNP, and Intel SGX);
- Private air-gapped Kubernetes clusters, virtual machines, or isolated Docker containers; and
- Secure Compartmented Information Facilities (SCIF) or defense-grade air-gapped enclaves.

2.2. **Internal Use Only:** The Software shall be utilized solely for Licensee's internal business operations to protect Licensee's proprietary codebases, employee data, patient PHI, customer PII, and RAG vector databases from unauthorized data leakage to upstream AI models.

---

## 3. Strict Intellectual Property & Anti-Cannibalization Covenants

3.1. **Prohibition of Competitive Commercialization:** Licensee agrees that the Software contains trade secrets and proprietary algorithmic heuristics of substantial economic value. Licensee shall not:
(a) Package, white-label, or offer the Software as a standalone commercial PII/PHI de-identification service, managed API, or SaaS product competing with Licensor;
(b) Decompile, disassemble, or reverse engineer the compiled WebAssembly bytecodes or binary executables;
(c) Extract, scrape, or harvest the 25 specialized industry entity taxonomies or regex pattern banks to train external machine learning classifiers or build competing regex engines; or
(d) Distribute, share, or publish the offline license keys or binary tarballs to any unauthorized third party.

3.2. **Source Code Access (When Applicable):** If an applicable Order Form explicitly grants source code inspection rights, Licensee agrees that source code access is granted strictly under a confidential, internal-audit-only license. Licensee may compile the code internally but may not create derivative commercial products or transfer the code outside the authorized development team.

---

## 4. Compliance Auditing & Annual Self-Certification

4.1. **No Physical Network Intrusion:** Licensor respects Licensee's air-gapped security policies and waives any right to conduct physical on-site inspections or deploy remote telemetry scanners within Licensee's secure facilities.

4.2. **Annual CISO Self-Certification:** In lieu of on-site audits, Licensee's Chief Information Security Officer (CISO), VP of Engineering, or authorized legal signatory shall, upon Licensor's annual written request, deliver a signed written certification confirming:
(a) The total number of active Authorized Nodes running the Software;
(b) That the Software remains deployed strictly within internal networks in compliance with Section 2; and
(c) That no unauthorized copies, forks, or extractions have been distributed outside Licensee's organization.

---

## 5. Offline Updates, Patches & Maintenance

5.1. **Offline Patch Delivery:** During active subscription terms, Licensor shall provide updates, security patches, and updated regulatory entity taxonomies (e.g., new EU AI Act or HIPAA definitions) via:
- Cryptographically signed offline tarball bundles (`.tar.gz.asc`);
- Direct air-gapped optical/USB transfer media packages (where required); or
- Customer-managed private container registry images.

5.2. **Verification of Integrity:** Licensee shall verify the SHA-256 checksum and PGP signature (Key ID: `0x4E9A2B1C`) of all update packages prior to ingestion into air-gapped networks.

---

## 6. Disclaimer of Consequential Damages & Warranty

6.1. **Limited Air-Gapped Warranty:** Licensor warrants that the Software delivers sub-millisecond in-memory de-identification conforming to ZTDS Invariant 1 (zero external egress) and Invariant 3 (volatile RAM isolation) when configured according to the Documentation.

6.2. **AS-IS Disclaimer:** EXCEPT AS EXPRESSLY SET FORTH HEREIN, THE SOFTWARE IS PROVIDED "AS IS." LICENSOR DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED. UNDER NO CIRCUMSTANCES SHALL LICENSOR BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE DEPLOYMENT OR EXECUTION OF THE SOFTWARE WITHIN LICENSEE'S NETWORK.

---

## 7. Term, Decommissioning & Memory Purge

7.1. **Term:** This EULA remains in effect for the duration of the Subscription Term designated in the Order Form.

7.2. **Purge Protocol upon Termination:** Upon expiration or termination of the license:
(a) Licensee shall terminate all running processes and memory allocations executing the Software;
(b) Licensee shall securely delete all offline binary images, container snapshots, and cryptographic license files from internal storage; and
(c) Licensee shall provide written confirmation of complete decommissioning within thirty (30) days.
