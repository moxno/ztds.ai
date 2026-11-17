'use strict';

const crypto = require('crypto');

const MAX_INPUT_LENGTH = 500000;
const MAX_SESSIONS = 500;
const MAX_TOKENS_PER_SESSION = 5000;

const TOKEN_PATTERNS = {
  API_SECRET: /\b(?:sk-(?:ant-|proj-)?[a-zA-Z0-9_-]{20,64}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35}|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,})\b/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,
  CREDIT_CARD: /(?<!\d)(?:4\d{3}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|5[1-5]\d{2}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|3[47]\d{2}[-\s]?\d{6}[-\s]?\d{5}|6(?:011|5\d{2})[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})(?!\d)/g,
  IBAN: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,26}\b/g,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
  IPV4: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  PHONE: /(?<!\w)(?:\+\d{1,3}[-.\s]?)?(?:\(\d{2,4}\)[-.\s]?|\d{2,4}[-.\s])\d{2,4}[-.\s]?\d{3,4}(?: *(?:ext|x|ext\.) *\d{1,5})?(?!\w)/g
};

// Volatile in-memory token store isolated in extension host RAM (Theorem 2 zeroization).
const volatileStores = new Map();

function getSessionStore(sessionId = 'default') {
  if (volatileStores.has(sessionId)) {
    const existing = volatileStores.get(sessionId);
    existing.lastAccessed = Date.now();
    return existing;
  }

  if (volatileStores.size >= MAX_SESSIONS) {
    let oldestKey = null;
    let oldestTs = Infinity;
    for (const [k, v] of volatileStores) {
      if (v.lastAccessed < oldestTs) {
        oldestTs = v.lastAccessed;
        oldestKey = k;
      }
    }
    if (oldestKey !== null) {
      resetSession(oldestKey);
    }
  }

  const created = {
    tokenToCleartext: new Map(),
    cleartextToToken: new Map(),
    counters: {},
    lastAccessed: Date.now()
  };
  volatileStores.set(sessionId, created);
  return created;
}

/**
 * Masks baseline PII and secrets into deterministic reversible surrogate tokens inside volatile RAM.
 */
function sanitizeText(text, sessionId = 'default') {
  if (typeof text !== 'string') {
    return { sanitizedText: '', entitiesMasked: 0, categories: [], auditReceipt: 'ZTDS-RECEIPT-EMPTY' };
  }
  if (text.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input length (${text.length} chars) exceeds maximum safety limit (${MAX_INPUT_LENGTH} chars).`);
  }

  const store = getSessionStore(sessionId);
  let sanitized = text;
  let entitiesMasked = 0;
  const detectedCategories = new Set();

  for (const [category, regex] of Object.entries(TOKEN_PATTERNS)) {
    const re = new RegExp(regex.source, regex.flags);
    sanitized = sanitized.replace(re, (match) => {
      detectedCategories.add(category);
      if (store.cleartextToToken.has(match)) {
        return store.cleartextToToken.get(match);
      }
      if (store.cleartextToToken.size >= MAX_TOKENS_PER_SESSION) {
        return match;
      }
      store.counters[category] = (store.counters[category] || 0) + 1;
      let token = `[${category}_TOKEN_${store.counters[category]}]`;
      while (text.includes(token)) {
        store.counters[category]++;
        token = `[${category}_TOKEN_${store.counters[category]}]`;
      }
      store.cleartextToToken.set(match, token);
      store.tokenToCleartext.set(token, match);
      entitiesMasked++;
      return token;
    });
  }

  const hash = crypto.createHash('sha256').update(sanitized).digest('hex').slice(0, 16).toUpperCase();

  return {
    sanitizedText: sanitized,
    entitiesMasked,
    categories: Array.from(detectedCategories),
    auditReceipt: `ZTDS-RECEIPT-${hash}`
  };
}

/**
 * Restores cleartext values from volatile RAM using single-pass replacement (immune to cascade injection).
 */
function restoreText(text, sessionId = 'default') {
  if (typeof text !== 'string') {
    return { restoredText: '', tokensRestored: 0 };
  }

  const store = getSessionStore(sessionId);
  if (store.tokenToCleartext.size === 0) {
    return { restoredText: text, tokensRestored: 0 };
  }

  let tokensRestored = 0;
  const restoredText = text.replace(/\[[A-Z0-9_]+_TOKEN_\d+\]/g, (token) => {
    if (store.tokenToCleartext.has(token)) {
      tokensRestored++;
      return store.tokenToCleartext.get(token);
    }
    return token;
  });

  return { restoredText, tokensRestored };
}

/**
 * Audits document lines for exposed PII/secrets and computes a deterministic SHA-256 compliance receipt.
 */
function auditDocumentLines(text) {
  const input = typeof text === 'string' ? text : '';
  const lines = input.split(/\r?\n/);
  const findings = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];
    for (const [category, regex] of Object.entries(TOKEN_PATTERNS)) {
      const re = new RegExp(regex.source, regex.flags);
      let m;
      while ((m = re.exec(lineText)) !== null) {
        findings.push({
          line: lineIdx,
          startCol: m.index,
          endCol: m.index + m[0].length,
          category
        });
        if (m[0].length === 0) {
          re.lastIndex++;
        }
      }
    }
  }

  const digest = crypto.createHash('sha256').update(input).digest('hex').slice(0, 16).toUpperCase();
  const receiptHash = `ZTDS-AUDIT-${digest}`;

  return {
    findings,
    receiptHash,
    clean: findings.length === 0
  };
}

/**
 * Parses and safely merges the ZTDS stdio firewall block into workspace `.vscode/mcp.json`.
 */
function mergeVscodeMcpConfig(existingJsonStr) {
  const raw = typeof existingJsonStr === 'string' ? existingJsonStr.trim() : '';
  let parsed = {};

  if (raw.length > 0) {
    parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Existing .vscode/mcp.json must contain a JSON object.');
    }
  }

  const existingServers = parsed.servers && typeof parsed.servers === 'object' && !Array.isArray(parsed.servers)
    ? parsed.servers
    : {};

  const updated = {
    ...parsed,
    servers: {
      ...existingServers,
      ztds: {
        type: 'stdio',
        command: 'npx',
        args: ['-y', 'ztds-mcp']
      }
    }
  };

  return `${JSON.stringify(updated, null, 2)}\n`;
}

/**
 * Purges and zeroizes all volatile token mappings for a session (or all sessions when omitted).
 */
function resetSession(sessionId) {
  if (sessionId) {
    if (volatileStores.has(sessionId)) {
      const store = volatileStores.get(sessionId);
      store.tokenToCleartext.clear();
      store.cleartextToToken.clear();
      volatileStores.delete(sessionId);
    }
    return;
  }

  for (const store of volatileStores.values()) {
    store.tokenToCleartext.clear();
    store.cleartextToToken.clear();
  }
  volatileStores.clear();
}

/**
 * Returns the active volatile token count for telemetry display.
 */
function getSessionTokenCount(sessionId = 'default') {
  const store = volatileStores.get(sessionId);
  return store ? store.tokenToCleartext.size : 0;
}

module.exports = {
  MAX_INPUT_LENGTH,
  TOKEN_PATTERNS,
  sanitizeText,
  restoreText,
  auditDocumentLines,
  mergeVscodeMcpConfig,
  resetSession,
  getSessionTokenCount
};
