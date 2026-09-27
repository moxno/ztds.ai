/**
 * ZTDS (Zero-Trust Data Sanitization) Middleware for FastMCP / Model Context Protocol
 * Protocol Authority: ZTDS AI Consortium & Standards Authority
 * IETF Standards Track: draft-sibiryakov-ztds-protocol-02
 * https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/
 * Standard Specification: https://ztds.ai/standard/
 *
 * Invariants Enforced:
 * 1. Zero External Egress Prior to Sanitization (100% in-memory client/host execution)
 * 2. Deterministic Reversible Tokenization (Bracketed syntactic surrogates)
 * 3. Verifiable Ephemeral RAM Isolation & Zeroization (Theorem 2)
 * 4. Zero Subprocessors (Eliminates third-party SaaS subprocessor liability)
 */

'use strict';

const PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,
  IPV4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  IBAN: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]?){0,16}\b/g,
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
  PHONE: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  API_SECRET: /\b(?:sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,})\b/g,
};

class ZTDSFastMCPMiddleware {
  /**
   * @param {Object} [options]
   * @param {string[]} [options.enabledEntities]
   * @param {boolean} [options.sanitizeInputs=true]
   * @param {boolean} [options.sanitizeOutputs=true]
   */
  constructor(options = {}) {
    this.enabledEntities = options.enabledEntities || Object.keys(PATTERNS);
    this.sanitizeInputs = options.sanitizeInputs !== false;
    this.sanitizeOutputs = options.sanitizeOutputs !== false;
    this._sessionMaps = new Map();
    this._entityMaps = new Map();
  }

  /**
   * Deterministically sanitizes text in volatile memory.
   * @param {string} text
   * @param {string} sessionId
   * @returns {{sanitized: string, tokenMap: Record<string, string>}}
   */
  sanitizeText(text, sessionId) {
    if (typeof text !== 'string') return { sanitized: text, tokenMap: {} };

    if (!this._sessionMaps.has(sessionId)) {
      this._sessionMaps.set(sessionId, new Map());
      this._entityMaps.set(sessionId, new Map());
    }

    const tokenMap = this._sessionMaps.get(sessionId);
    const entityMap = this._entityMaps.get(sessionId);
    let sanitized = text;

    for (const entityType of this.enabledEntities) {
      const regex = new RegExp(PATTERNS[entityType].source, 'g');
      sanitized = sanitized.replace(regex, (match) => {
        if (entityMap.has(match)) {
          return entityMap.get(match);
        }
        let count = 0;
        for (const k of tokenMap.keys()) {
          if (k.startsWith(`[${entityType}_TOKEN_`)) count++;
        }
        const token = `[${entityType}_TOKEN_${count + 1}]`;
        tokenMap.set(token, match);
        entityMap.set(match, token);
        return token;
      });
    }

    const exportedMap = {};
    for (const [k, v] of tokenMap.entries()) {
      exportedMap[k] = v;
    }
    return { sanitized, tokenMap: exportedMap };
  }

  /**
   * Restores cleartext from surrogate tokens in volatile memory.
   * @param {string} text
   * @param {string} sessionId
   * @returns {string}
   */
  restoreText(text, sessionId) {
    if (typeof text !== 'string') return text;
    const tokenMap = this._sessionMaps.get(sessionId);
    if (!tokenMap || tokenMap.size === 0) return text;

    let restored = text;
    for (const [token, original] of tokenMap.entries()) {
      restored = restored.split(token).join(original);
    }
    return restored;
  }

  /**
   * Recursively sanitizes object properties in place or returns sanitized clone.
   * @param {any} val
   * @param {string} sessionId
   * @returns {any}
   */
  sanitizeObject(val, sessionId) {
    if (typeof val === 'string') {
      return this.sanitizeText(val, sessionId).sanitized;
    }
    if (Array.isArray(val)) {
      return val.map((item) => this.sanitizeObject(item, sessionId));
    }
    if (val !== null && typeof val === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(val)) {
        result[k] = this.sanitizeObject(v, sessionId);
      }
      return result;
    }
    return val;
  }

  /**
   * Enforces Theorem 2: Volatile RAM Zeroization upon request completion.
   * @param {string} sessionId
   */
  zeroizeSession(sessionId) {
    if (this._sessionMaps.has(sessionId)) {
      this._sessionMaps.get(sessionId).clear();
      this._sessionMaps.delete(sessionId);
    }
    if (this._entityMaps.has(sessionId)) {
      this._entityMaps.get(sessionId).clear();
      this._entityMaps.delete(sessionId);
    }
  }

  /**
   * FastMCP Tool Wrapper: wraps any tool handler with zero-trust sanitization.
   * @param {string} toolName
   * @param {Function} handler
   * @returns {Function}
   */
  wrapTool(toolName, handler) {
    const self = this;
    return async function (args, context) {
      const sessionId = (context && context.sessionId) || `mcp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      try {
        let processedArgs = args;
        if (self.sanitizeInputs && args) {
          processedArgs = self.sanitizeObject(args, sessionId);
        }

        const rawResult = await handler(processedArgs, context);

        let finalResult = rawResult;
        if (self.sanitizeOutputs && rawResult) {
          finalResult = self.sanitizeObject(rawResult, sessionId);
        }

        // Attach ZTDS conformance metadata
        if (finalResult && typeof finalResult === 'object' && !Array.isArray(finalResult)) {
          finalResult._ztds = {
            standard: 'RFC v1.0 (IETF draft-sibiryakov-ztds-protocol-02)',
            zeroEgress: true,
            sessionId,
          };
        }

        return finalResult;
      } finally {
        self.zeroizeSession(sessionId);
      }
    };
  }
}

module.exports = {
  ZTDSFastMCPMiddleware,
  PATTERNS,
};
