const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const cardPath = path.join(__dirname, '../public/.well-known/mcp/server-card.json');
  if (fs.existsSync(cardPath)) {
    const data = fs.readFileSync(cardPath, 'utf8');
    return res.status(200).send(data);
  }

  const serverCard = {
    serverInfo: {
      name: "ztds-mcp",
      version: "1.2.1"
    },
    authentication: {
      required: false
    },
    tools: [
      {
        name: "ztds_sanitize",
        description: "Zero-Trust Data Sanitization. Replaces PII, PHI, and confidential secrets in client memory before passing prompts to LLMs.",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The raw sensitive text to sanitize"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "ztds_restore",
        description: "Restores original unmasked data from surrogate tokens locally in volatile RAM.",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The sanitized text with surrogate tokens to restore"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "ztds_audit",
        description: "Audits a codebase or document for confidential PII and calculates cryptographic SHA-256 compliance receipts.",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The text or file contents to audit"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "ztds_info",
        description: "Returns current ZTDS RFC v1.0 standard status, active RAM session stats, and engine version.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "ztds_reset_session",
        description: "Explicitly zeroes and destroys the in-memory surrogate mapping table.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ],
    resources: [],
    prompts: []
  };

  return res.status(200).json(serverCard);
};
