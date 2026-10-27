#!/usr/bin/env node
/**
 * ZTDS.ai — Security Honeypot & Active Deception Auditor (H1-H6)
 * Audits root/subdirectory HTML forms and /api/*.js POST endpoints.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const HONEYPOT_FIELD_NAMES = [
  'website_url_confirm',
  'org_fax_ext',
  'company_fax_ext',
  'work_fax_number',
  'botcheck'
];

const API_HONEYPOT_TOKENS = [
  'website_url_confirm',
  'org_fax_ext',
  'botcheck',
  'admin_override',
  'is_admin',
  'isHoneypotTriggered'
];

function walkFiles(dir, extFilter, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.name.startsWith('.') ||
      ['node_modules', 'dist', 'build', '.next', 'coverage', 'vendor', 'public', 'stitch_export'].includes(entry.name)
    ) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (fullPath.includes(path.join('docs', 'legal', 'internal'))) continue;
    if (entry.isDirectory()) {
      walkFiles(fullPath, extFilter, results);
    } else if (extFilter(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function auditForms() {
  const htmlFiles = walkFiles(ROOT_DIR, (name) => /\.(html|jsx|tsx)$/.test(name));
  let checkedForms = 0;
  const issues = [];
  const formRegex = /<form\b[^>]*>([\s\S]*?)<\/form>/gi;

  for (const file of htmlFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = formRegex.exec(content)) !== null) {
      const fullForm = match[0];
      const openTag = fullForm.slice(0, fullForm.indexOf('>') + 1);

      const isTargetForm =
        /method=["']POST["']/i.test(openTag) ||
        /web3forms\.com/i.test(openTag) ||
        /id=["'](cisoLeadForm|directInvoiceFallbackForm|pgLeadForm|corporate-invoice-form)["']/i.test(openTag);

      if (!isTargetForm) continue;
      checkedForms++;

      const hasHoneypotField = HONEYPOT_FIELD_NAMES.some((fieldName) =>
        new RegExp(`name=["']${fieldName}["']`, 'i').test(fullForm)
      );

      if (!hasHoneypotField) {
        issues.push(`[H1 Form Missing Honeypot] ${relPath}: Form (${openTag.replace(/\s+/g, ' ').slice(0, 80)}...) lacks a honeypot input.`);
        continue;
      }

      if (/name=["'](website_url_confirm|org_fax_ext|company_fax_ext|work_fax_number)["']/i.test(fullForm)) {
        const hasAriaHidden = /aria-hidden=["']true["']/i.test(fullForm);
        const hasTabIndexNeg = /tabindex=["']-1["']/i.test(fullForm);
        const hasSafeAutocomplete = /autocomplete=["'](new-password|off)["']/i.test(fullForm);

        if (!hasAriaHidden || !hasTabIndexNeg || !hasSafeAutocomplete) {
          issues.push(
            `[H6 A11y/Autofill Violation] ${relPath}: Text honeypot in form (${openTag.slice(0, 60)}...) must include aria-hidden="true", tabindex="-1", and autocomplete="new-password".`
          );
        }
      }
    }
  }

  return { checkedForms, issues };
}

function auditApiEndpoints() {
  const apiDir = path.join(ROOT_DIR, 'api');
  if (!fs.existsSync(apiDir)) return { checkedApis: 0, issues: [] };

  const apiFiles = walkFiles(apiDir, (name) => name.endsWith('.js') || name.endsWith('.ts'));
  let checkedApis = 0;
  const issues = [];

  for (const file of apiFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    const acceptsPost = /req\.method\s*[!=]==?\s*['"]POST['"]|ALLOW.*POST/i.test(content);
    if (!acceptsPost) continue;

    checkedApis++;
    const hasPoisonPillGuard = API_HONEYPOT_TOKENS.some((token) => content.includes(token));
    if (!hasPoisonPillGuard) {
      issues.push(`[H2 API Missing Poison-Pill Guard] ${relPath}: Public POST endpoint lacks honeypot/poison-pill trap.`);
    }
  }

  return { checkedApis, issues };
}

function main() {
  console.log('=== Security Honeypot & Active Deception Audit (H1-H6) ===');
  const formRes = auditForms();
  const apiRes = auditApiEndpoints();

  console.log(`- Audited Target HTML/JSX Forms: ${formRes.checkedForms}`);
  console.log(`- Audited Public POST API Endpoints: ${apiRes.checkedApis}`);

  const allIssues = [...formRes.issues, ...apiRes.issues];
  if (allIssues.length > 0) {
    console.error(`\n[FAIL] Detected ${allIssues.length} honeypot coverage issue(s):`);
    for (const issue of allIssues) console.error(`  - ${issue}`);
    process.exit(1);
  }

  console.log('[PASS] 100% Honeypot & Active Deception coverage verified (H1/H2/H6 compliant).');
}

main();
