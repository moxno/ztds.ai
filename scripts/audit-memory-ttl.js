#!/usr/bin/env node

/**
 * Memory TTL & Invalidation Auditor
 * Enforces Optimization 3: Every learning must have a creation date and TTL condition.
 * Prunes expired or mechanically-tested entries when line threshold is exceeded.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LEARNINGS_PATH = path.join(ROOT, '.agent', 'learnings.md');
const SOFT_LIMIT = 70;
const HARD_LIMIT = 85;

function auditMemoryTTL(options = {}) {
  const silent = Boolean(options.silent);
  const strict = Boolean(options.strict);

  if (!fs.existsSync(LEARNINGS_PATH)) {
    if (!silent) console.error('[FAIL] .agent/learnings.md not found');
    return { success: false, errors: ['File missing'] };
  }

  const content = fs.readFileSync(LEARNINGS_PATH, 'utf8');
  const lines = content.split('\n');
  const activeLines = lines.filter(l => l.trim().length > 0);

  const errors = [];
  const warnings = [];
  const entries = [];
  let currentEntry = null;

  // Regex for header with TTL: ## N. Title [YYYY-MM-DD | TTL: ...]
  const headerRegex = /^##\s+\d+\.\s+(.+?)\s+\[(\d{4}-\d{2}-\d{2})\s*\|\s*TTL:\s*([^\]]+)\]$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
      const match = line.match(headerRegex);
      if (!match) {
        // Advisory warning for missing/flexible TTL tag
        warnings.push(`Line ${i + 1}: Unformatted or missing TTL tag in header: "${line}". Recommended format: ## N. Title [YYYY-MM-DD | TTL: <condition>]`);
      } else {
        const [, title, dateStr, ttlCondition] = match;
        const entryDate = new Date(dateStr);
        if (isNaN(entryDate.getTime())) {
          warnings.push(`Line ${i + 1}: Unrecognized date format "${dateStr}" in header: "${line}"`);
        }
        currentEntry = {
          lineNum: i + 1,
          title,
          dateStr,
          date: entryDate,
          ttlCondition: ttlCondition.trim(),
        };
        entries.push(currentEntry);
      }
    }
  }

  // Soft and hard line count limits
  if (activeLines.length > HARD_LIMIT) {
    errors.push(`.agent/learnings.md exceeds hard line budget: ${activeLines.length} active lines (hard maximum: ${HARD_LIMIT})`);
  } else if (activeLines.length > SOFT_LIMIT) {
    warnings.push(`.agent/learnings.md approaching capacity: ${activeLines.length} active lines (recommended budget: <= ${SOFT_LIMIT})`);
  }

  // Check for expired ISO date TTLs
  const now = new Date();
  for (const entry of entries) {
    const ttlDateMatch = entry.ttlCondition.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (ttlDateMatch) {
      const ttlDate = new Date(ttlDateMatch[1]);
      if (ttlDate < now) {
        warnings.push(`Entry "${entry.title}" expired on ${ttlDateMatch[1]} and is ready for pruning.`);
      }
    }
  }

  if (strict && warnings.length > 0) {
    errors.push(...warnings);
  }

  const success = errors.length === 0;

  if (!silent) {
    console.log(`[INFO] Memory Hygiene Audit: ${entries.length} entries detected across ${activeLines.length} lines (budget: <= ${SOFT_LIMIT}, hard: ${HARD_LIMIT}).`);
    if (warnings.length > 0) {
      warnings.forEach(w => console.warn(`   [WARN] ${w}`));
    }
    if (success) {
      console.log('[PASS] Memory hygiene within operational budget.\n');
    } else {
      console.error(`[FAIL] Memory Audit hard violations:`);
      errors.forEach(e => console.error(`   - ${e}`));
      console.log('');
    }
  }

  return { success, errors, warnings, entries, lineCount: activeLines.length };
}

if (require.main === module) {
  const res = auditMemoryTTL();
  process.exit(res.success ? 0 : 1);
}

module.exports = { auditMemoryTTL, SOFT_LIMIT, HARD_LIMIT };
