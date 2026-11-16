# Production Dockerfile for ztds-mcp (ZTDS RFC v1.0)
# Compatible with Docker Hub, Glama.ai, Claude Desktop, Cursor, and containerized MCP runtimes
FROM node:22-alpine

LABEL org.opencontainers.image.title="ztds-mcp" \
      org.opencontainers.image.description="Open standard MCP server for Zero-Trust Data Sanitization (ZTDS RFC v1.0). In-RAM PII and secret tokenization." \
      org.opencontainers.image.url="https://ztds.ai/mcp/" \
      org.opencontainers.image.documentation="https://ztds.ai/standard/" \
      org.opencontainers.image.source="https://github.com/moxno/ztds-mcp" \
      org.opencontainers.image.vendor="ZTDS AI Consortium" \
      org.opencontainers.image.licenses="Apache-2.0" \
      io.modelcontextprotocol.server.name="io.github.moxno/ztds"

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

USER node
ENV NODE_ENV=production

ENTRYPOINT ["node", "index.js"]
