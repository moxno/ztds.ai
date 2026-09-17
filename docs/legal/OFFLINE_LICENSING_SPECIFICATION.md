# ZTDS Cryptographic Offline Licensing Specification

**ARCHITECTURE SPECIFICATION: ASYMMETRIC ED25519 ZERO-TELEMETRY LICENSE ENFORCEMENT**  
*Standard Version: 1.0 &middot; ZTDS RFC v1.0 Operational Layer &middot; BrandMeWeb Ecosystem*

---

## 1. Executive Summary & Design Invariants

Commercial deployments of the ZTDS engine (`@privacyscrubber/sdk` and enterprise air-gapped container nodes) require subscription enforcement without violating **Invariant 1 (Zero External Egress)**:

1. **Zero-Telemetry Invariant:** The licensing engine shall execute 100% offline. It shall make zero HTTP/HTTPS requests, zero DNS lookups, zero socket connections, and zero inter-process network pings to external validation endpoints.
2. **Asymmetric Cryptographic Security:** The engine uses the **Ed25519** digital signature algorithm (Edwards-curve Digital Signature Algorithm, RFC 8032). The Licensor signs licenses using an offline private key; the client SDK verifies signatures using an embedded public key.
3. **Anti-Cannibalization Gate:** The engine strictly enforces the entity separation defined in `ZTDS_Entity_Taxonomy_and_25_Profiles_SSOT.md`. Specialized industry profiles (HIPAA Clinical PHI, Financial IBAN/PAN, Legal Privilege, Cloud Secrets) require a signed commercial tier (`enterprise_airgapped` or `global_site`).
4. **Sub-Millisecond Evaluation:** License verification must occur in memory in under 0.5 milliseconds during process initialization without recurring CPU overhead.

---

## 2. Cryptographic Envelope & Token Structure

A ZTDS license is distributed as a compact, URL-safe string structured in three segments separated by periods:

```
ZTDS-LIC-v1.{base64url(payload)}.{base64url(signature)}
```

### 2.1. Header / Prefix
* Fixed magic string: `ZTDS-LIC-v1`
* Demarcates the protocol version and signature algorithm (Ed25519).

### 2.2. Payload Schema
The payload is a canonical JSON string containing:

```json
{
  "license_id": "ZTDS-2026-ENT-0042",
  "customer_id": "cust_acme_health",
  "customer_name": "Acme Global Health Systems",
  "tier": "enterprise_airgapped",
  "issued_at": "2026-09-17T00:00:00Z",
  "expires_at": "2027-09-17T23:59:59Z",
  "grace_period_days": 60,
  "max_nodes": 5,
  "features": {
    "universal_pii": true,
    "specialized_profiles": true,
    "allowed_profiles": ["*"],
    "evidence_binder": true,
    "airgapped_enclave": true
  }
}
```

### 2.3. Canonicalization & Signature Generation
To guarantee deterministic hashing across diverse JSON parsers:
1. All JSON keys are sorted alphabetically at all nesting levels.
2. Unnecessary whitespace is stripped (`JSON.stringify(payload)`).
3. The canonical string is encoded as UTF-8 bytes.
4. The Licensor signs the byte array using the Ed25519 private key:
   $$\text{signature} = \text{Ed25519}_{\text{sign}}(K_{\text{private}}, \text{CanonicalBytes})$$
5. The signature bytes (64 bytes) are encoded as `base64url`.

---

## 3. Tier Hierarchy & Feature Enforcement Matrix

| Tier ID | Annual Fee | Max Nodes | Universal PII | 25 Industry Profiles | Evidence Binder |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`community_free`** | $0 | 1 | Yes (15k chars) | Trial (5k chars) | No |
| **`developer_pro`** | $1,990/yr | 5 | Unlimited | No (Baseline only) | Basic |
| **`enterprise_airgapped`** | $12,000/yr | 5 | Unlimited | Yes (Full 25 Profiles) | Full (Drata/Vanta) |
| **`global_site`** | $50,000/yr | Unlimited | Unlimited | Yes (Custom Profiles) | Full + Dedicated |

### 3.1. Profile Access Check (`assertProfileAllowed`)
When an application requests sanitization using a specialized profile (e.g., `options.profile = "healthcare"`):
1. If the license is `community_free` or `developer_pro`, access to `healthcare`, `legal`, `financial`, `hr`, etc. is blocked with a `FeatureUnauthorizedError`.
2. The user is instructed to upgrade to the Enterprise Air-Gapped tier to unlock vertical profiles.

---

## 4. Verification Lifecycle & Error Handling

```
[Customer Application Start]
           |
           v
[Read ZTDS_LICENSE_KEY or .lic file]
           |
           v
[Parse 3-part Token: ZTDS-LIC-v1]
     |                 |
     | (Malformed)     v (Valid Syntax)
     +--------> [Throw LicenseMalformedError]
                       |
                       v
       [Verify Ed25519 Signature against Public Key]
            |                        |
            | (Invalid)              v (Valid)
            +---------------> [Throw LicenseTamperedError]
                                     |
                                     v
                       [Check Current System Time]
                       - If now > expires_at + grace_period:
                           [Throw LicenseExpiredError]
                       - If expires_at < now <= expires_at + grace:
                           [Log Warning: License in Grace Period]
                       - If now <= expires_at:
                           [Emit LicenseVerified Event]
```

### 4.1. Error Classification
- **`LicenseMalformedError`**: The token string does not begin with `ZTDS-LIC-v1` or lacks three base64url segments.
- **`LicenseTamperedError`**: The cryptographic signature does not verify against the embedded public key, indicating the payload (e.g., node count, tier, or expiration) was modified.
- **`LicenseExpiredError`**: The license expiration timestamp plus the 60-day operational grace period has lapsed.
- **`FeatureUnauthorizedError`**: The application attempted to execute a profile not authorized by the license tier.

---

## 5. Security & Key Management Guidelines

1. **Private Key Isolation:** The Ed25519 private key is held exclusively by Ilya Sibiryakov on an air-gapped, encrypted hardware key (or isolated secrets vault). It is NEVER committed to git or bundled into client distributions.
2. **Public Key Embedding:** The client SDK bundles only the SPKI public key (`keys/ztds_license_public.pem`). Even if an adversary extracts the public key from the SDK, Ed25519 mathematics make it computationally infeasible to forge a valid license without the private key.
3. **Grace Period Ergonomics:** Enterprise procurement cycles often encounter Accounts Payable delays. The 60-day grace period prevents production outages while emitting daily operational log reminders to the CISO/DevOps team.
