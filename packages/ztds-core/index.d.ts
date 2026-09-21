/**
 * @ztds/core — Zero-Trust Data Sanitization (RFC v1.0)
 * Official Open Specification & Reference Implementation Interface
 * License: Apache-2.0
 */

export interface TokenMap {
  [token: string]: string;
}

export interface SanitizationResult {
  /** The sanitized text with sensitive entities substituted with surrogate tokens */
  sanitizedText: string;
  /** Private, volatile token lookup map that must remain strictly in local memory */
  tokenMap: TokenMap;
  /** Execution latency in microseconds */
  executionUs: number;
  /** Number of sensitive entities identified and masked */
  entitiesDetected: number;
  /** Invariant 1 attestation: confirmation that zero cleartext bytes crossed execution perimeter */
  zeroEgressAttested: true;
}

export interface TokenRestoreResult {
  /** Text with surrogate tokens restored to original values */
  restoredText: string;
  /** Number of surrogate tokens successfully de-tokenized */
  tokensRestored: number;
  /** Execution latency in microseconds */
  executionUs: number;
}

export interface InvariantAudit {
  invariant1_zero_egress: boolean;
  invariant2_deterministic_reversible: boolean;
  invariant3_cryptographic_isolation: boolean;
  invariant4_subprocessor_exclusion: boolean;
  compliant: boolean;
}

export interface ZTDSEngineOptions {
  /** Enable universal base entity rules (Email, Phone, SSN, Credit Card, IPv4/IPv6, API Secrets) */
  universalRules?: boolean;
  /** Custom in-memory regex patterns to detect */
  customRules?: Array<{ name: string; pattern: RegExp; tokenPrefix: string }>;
}

export class ZTDSEngine {
  constructor(options?: ZTDSEngineOptions);
  
  /**
   * Masks sensitive entities in cleartext with reversible surrogate tokens.
   * Satisfies Invariants 1, 2, and 3 (volatile RAM execution, 0.00 bytes socket egress).
   */
  mask(cleartext: string): SanitizationResult;

  /**
   * Replaces surrogate tokens in model response with original values from local tokenMap.
   * Satisfies Invariant 2 (Deterministic Context-Preserving Reversible Tokenization).
   */
  reveal(maskedText: string, tokenMap: TokenMap): TokenRestoreResult;

  /**
   * Flushes and zeroizes volatile token memory buffer.
   */
  flush(): void;

  /**
   * Verifies that the current execution environment complies with RFC v1.0 4 Invariants.
   */
  verifyInvariants(): InvariantAudit;
}

export class ZTDSClient {
  constructor(engine?: ZTDSEngine);
  wrapPrompt(prompt: string): { sanitizedPrompt: string; unwrap: (response: string) => string };
}

export const SPEC_VERSION: '1.0.0';
export const STANDARD_STATUS: 'PROPOSED_STANDARD';
export const DEMARCATION: {
  specification: string;
  referenceEngine: string;
  commercialProductionEngine: string;
  license: string;
};
