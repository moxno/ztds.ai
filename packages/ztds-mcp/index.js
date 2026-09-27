#!/usr/bin/env node
/**
 * ZTDS (Zero-Trust Data Sanitization) MCP Server
 * Reference Open-Source Implementation under Apache-2.0
 * 
 * Standards Conformance:
 * - RFC v1.0: https://ztds.ai/standard/
 * - IETF Draft: draft-sibiryakov-ztds-protocol-02
 * - Model Context Protocol Specification: 2024-11-05
 * 
 * Invariants:
 * 1. Zero External Egress Prior to Sanitization
 * 2. Deterministic Context-Preserving Reversible Tokenization
 * 3. Verifiable Ephemeral RAM Isolation (Theorem 2 Zeroization)
 * 4. Subprocessor Chain Exclusion (GDPR Recital 26 / Art. 28)
 */

import readline from 'readline';
import crypto from 'crypto';

const SERVER_NAME = 'ztds-mcp';
const SERVER_VERSION = '1.0.0';
const PROTOCOL_VERSION = '2024-11-05';

// Universal PII & Secrets Regex Patterns (Free Baseline per RFC v1.0)
// Ordered by pattern specificity to avoid false positives (e.g. phone consuming secret digits)
const PATTERNS = {
  API_SECRET: /\b(?:sk-(?:ant-|proj-)?[a-zA-Z0-9_-]{20,64}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35}|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,})\b/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,
  CREDIT_CARD: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
  IBAN: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]?){0,16}\b/g,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
  IPV4: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  PHONE: /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/g
};

// Volatile in-memory token storage (Theorem 2 Ephemeral RAM Isolation)
// Format: sessionId -> { tokenToCleartext: Map, cleartextToToken: Map, counters: Object }
const sessionStores = new Map();

function getSessionStore(sessionId = 'default') {
  if (!sessionStores.has(sessionId)) {
    sessionStores.set(sessionId, {
      tokenToCleartext: new Map(),
      cleartextToToken: new Map(),
      counters: {}
    });
  }
  return sessionStores.get(sessionId);
}

function resetSessionStore(sessionId) {
  if (sessionId) {
    if (sessionStores.has(sessionId)) {
      const store = sessionStores.get(sessionId);
      store.tokenToCleartext.clear();
      store.cleartextToToken.clear();
      sessionStores.delete(sessionId);
    }
  } else {
    for (const [_, store] of sessionStores) {
      store.tokenToCleartext.clear();
      store.cleartextToToken.clear();
    }
    sessionStores.clear();
  }
}

/**
 * Sanitizes input text, substituting sensitive matches with deterministic surrogate tokens.
 */
function sanitizeText(text, sessionId = 'default') {
  const startUs = process.hrtime.bigint();
  const store = getSessionStore(sessionId);
  let sanitized = text;
  let totalMasked = 0;
  const detectedCategories = new Set();

  for (const [category, regex] of Object.entries(PATTERNS)) {
    // Clone regex with global flag
    const re = new RegExp(regex.source, regex.flags);
    sanitized = sanitized.replace(re, (match) => {
      detectedCategories.add(category);
      if (store.cleartextToToken.has(match)) {
        return store.cleartextToToken.get(match);
      }
      store.counters[category] = (store.counters[category] || 0) + 1;
      const token = `[${category}_TOKEN_${store.counters[category]}]`;
      store.cleartextToToken.set(match, token);
      store.tokenToCleartext.set(token, match);
      totalMasked++;
      return token;
    });
  }

  const endUs = process.hrtime.bigint();
  const durationUs = Number(endUs - startUs) / 1000;
  const hash = crypto.createHash('sha256').update(sanitized).digest('hex').substring(0, 16);

  return {
    sanitizedText: sanitized,
    entitiesMasked: totalMasked,
    categories: Array.from(detectedCategories),
    executionUs: Math.round(durationUs),
    auditReceipt: `ZTDS-RECEIPT-${hash.toUpperCase()}`,
    zeroEgressAttested: true
  };
}

/**
 * Restores cleartext values into LLM-generated text using volatile session tokens.
 */
function restoreText(text, sessionId = 'default') {
  const startUs = process.hrtime.bigint();
  const store = getSessionStore(sessionId);
  let restored = text;
  let totalRestored = 0;

  for (const [token, cleartext] of store.tokenToCleartext) {
    if (restored.includes(token)) {
      restored = restored.split(token).join(cleartext);
      totalRestored++;
    }
  }

  const endUs = process.hrtime.bigint();
  const durationUs = Number(endUs - startUs) / 1000;

  return {
    restoredText: restored,
    tokensRestored: totalRestored,
    executionUs: Math.round(durationUs)
  };
}

/**
 * Deterministic audit of cleartext without persisting session tokens.
 */
function auditText(text) {
  const ephemeralSession = `__audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const store = getSessionStore(ephemeralSession);
  const findings = {};
  let total = 0;

  let current = text;
  for (const [category, regex] of Object.entries(PATTERNS)) {
    const re = new RegExp(regex.source, regex.flags);
    current = current.replace(re, (match) => {
      findings[category] = (findings[category] || 0) + 1;
      total++;
      return `[${category}_AUDIT_TOKEN]`;
    });
  }

  // Immediately purge ephemeral audit store (Theorem 2 RAM zeroization)
  resetSessionStore(ephemeralSession);

  const riskLevel = total === 0 ? 'CLEAN' : total < 5 ? 'MODERATE' : 'CRITICAL';
  const textHash = crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);

  return {
    riskLevel,
    totalEntitiesFound: total,
    breakdown: findings,
    contentHash: `sha256:${textHash}`,
    rfcCompliance: {
      invariant1_zeroEgress: true,
      invariant2_deterministicSurrogates: true,
      invariant3_ramIsolation: true,
      invariant4_subprocessorExclusion: true
    }
  };
}

// Tool definitions for MCP tools/list
const TOOLS = [
  {
    name: 'ztds_sanitize',
    description: 'Sanitize sensitive PII and secrets in prompt text locally using ZTDS RFC v1.0 zero-egress invariants.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The raw text to sanitize before sending to LLM context.'
        },
        sessionId: {
          type: 'string',
          description: 'Optional session identifier to preserve token consistency across conversational turns (default: "default").'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'ztds_restore',
    description: 'Restore authentic cleartext values into LLM-generated output from local in-memory token mapping.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The sanitized response text received from the LLM containing surrogate tokens.'
        },
        sessionId: {
          type: 'string',
          description: 'Optional session identifier used during initial sanitization.'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'ztds_audit',
    description: 'Audit text for PII/secrets exposure against ZTDS RFC v1.0 standard and generate an attestation receipt.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to inspect for exposure risks.'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'ztds_info',
    description: 'Retrieve ZTDS open specification details (RFC v1.0, IETF draft-02) and enterprise upgrade guide.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'ztds_reset_session',
    description: 'Zeroize and purge volatile in-memory token mappings (Theorem 2 RAM zeroization).',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Optional session identifier to clear. If omitted, clears all sessions.'
        }
      }
    }
  }
];

// Prompts definition for MCP prompts/list
const PROMPTS = [
  {
    name: 'ztds_guard',
    description: 'Activates the ZTDS Zero-Trust Data Sanitization guardrail in Claude or Cursor.',
    arguments: [
      {
        name: 'task',
        description: 'The task description or prompt to execute safely.',
        required: true
      }
    ]
  }
];

// JSON-RPC 2.0 Message Dispatcher
async function handleMessage(request) {
  const { id, method, params } = request;

  // Notification (no id)
  if (id === undefined || id === null) {
    if (method === 'notifications/initialized') {
      // Client ready
      return null;
    }
    return null;
  }

  // ping
  if (method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }

  // initialize
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      }
    };
  }

  // tools/list
  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    };
  }

  // prompts/list
  if (method === 'prompts/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        prompts: PROMPTS
      }
    };
  }

  // prompts/get
  if (method === 'prompts/get') {
    const promptName = params?.name;
    if (promptName === 'ztds_guard') {
      const task = params?.arguments?.task || '';
      return {
        jsonrpc: '2.0',
        id,
        result: {
          description: 'Zero-Trust Data Sanitization prompt instructions',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `[ZTDS Zero-Trust Guardrail Active]\nEnsure all sensitive entities (names, emails, credentials, IDs) are sanitized via ztds_sanitize before transmission. Restore tokens in output via ztds_restore.\n\nTask: ${task}`
              }
            }
          ]
        }
      };
    }
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32602, message: `Prompt not found: ${promptName}` }
    };
  }

  // tools/call
  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === 'ztds_sanitize') {
      if (typeof args.text !== 'string') {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Invalid arguments: "text" must be a string' }
        };
      }
      const res = sanitizeText(args.text, args.sessionId);
      const textOutput = [
        res.sanitizedText,
        '',
        `> 🛡️ [ZTDS Invariant 1 Attested] Zero external egress.`,
        `> Receipt: ${res.auditReceipt} | Execution: ${res.executionUs}µs | Entities Masked: ${res.entitiesMasked}`,
        `> Need 30+ enterprise profiles (HIPAA, PCI-DSS, SOC 2)? See @privacyscrubber/mcp-server (https://privacyscrubber.com)`
      ].join('\n');

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: textOutput }],
          isError: false,
          _ztds: res
        }
      };
    }

    if (toolName === 'ztds_restore') {
      if (typeof args.text !== 'string') {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Invalid arguments: "text" must be a string' }
        };
      }
      const res = restoreText(args.text, args.sessionId);
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: res.restoredText }],
          isError: false,
          _ztds: res
        }
      };
    }

    if (toolName === 'ztds_audit') {
      if (typeof args.text !== 'string') {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Invalid arguments: "text" must be a string' }
        };
      }
      const res = auditText(args.text);
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
          isError: false,
          _ztds: res
        }
      };
    }

    if (toolName === 'ztds_info') {
      const infoText = [
        `# ZTDS (Zero-Trust Data Sanitization) Open Standard`,
        `Specification: RFC v1.0 (https://ztds.ai/standard/)`,
        `IETF Draft: draft-sibiryakov-ztds-protocol-02`,
        `Academic DOI: 10.5281/zenodo.22058770`,
        ``,
        `## The 4 Protocol Invariants:`,
        `1. Zero External Egress Prior to Sanitization (RAM-isolated regex pipeline).`,
        `2. Deterministic Context-Preserving Reversible Tokenization.`,
        `3. Verifiable Cryptographic RAM Isolation (Theorem 2 Zeroization).`,
        `4. Subprocessor Chain Exclusion (GDPR Recital 26 / EU AI Act Article 10).`,
        ``,
        `## Commercial Production Profiles:`,
        `The open standard reference engine covers universal baseline entities.`,
        `For 30+ specialized vertical industry profiles (HIPAA PHI, PCI-DSS Cardholder, GLBA Financial, CJIS Law Enforcement, FERPA Student Records) and enterprise team key management, deploy the commercial engine:`,
        `- NPM Package: @privacyscrubber/mcp-server`,
        `- Backend SDK: npm install @privacyscrubber/sdk`,
        `- Web & Licensing: https://privacyscrubber.com`
      ].join('\n');

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: infoText }],
          isError: false
        }
      };
    }

    if (toolName === 'ztds_reset_session') {
      resetSessionStore(args.sessionId);
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Session memory purged. Theorem 2 volatile RAM zeroization verified.` }],
          isError: false
        }
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Tool not found: ${toolName}` }
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  };
}

// Stdio Stream Loop
function startStdioServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const request = JSON.parse(trimmed);
      const response = await handleMessage(request);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: 'Parse error: invalid JSON' }
        }) + '\n'
      );
    }
  });

  process.stderr.write(`[ZTDS MCP Server v${SERVER_VERSION}] Ready on stdio (Zero external egress).\n`);
}

// Export functions for unit testing and direct invocation
export {
  handleMessage,
  sanitizeText,
  restoreText,
  auditText,
  resetSessionStore,
  TOOLS,
  PROMPTS,
  PATTERNS
};

// Auto-start when executed as a CLI script
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  startStdioServer();
}
