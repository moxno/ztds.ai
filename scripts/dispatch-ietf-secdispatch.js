/**
 * IETF SECDISPATCH Submission Dispatcher
 * ──────────────────────────────────────
 * Dispatches the official ZTDS Protocol (draft-sibiryakov-ztds-protocol-02)
 * dispatch request to secdispatch@ietf.org and Security Area Directors via Resend API.
 * 
 * Sender: Ilya Sibiryakov <ilya@brandmeweb.com>
 * SSOT Content: /Users/ilya/Desktop/ZTDS AI/docs/ietf/SECDISPATCH_SUBMISSION_REQUEST.md
 */

const fs = require('fs');
const path = require('path');

let apiKey = process.env.RESEND_API_KEY;

// Check local .env.local first, then fallback to sibling PrivacyScrubber .env.local
const candidateEnvs = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../../PrivacyScrubber/.env.local')
];

for (const envPath of candidateEnvs) {
  if (!apiKey && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^RESEND_API_KEY=["']?([^"\r\n']+)["']?/m);
    if (match) apiKey = match[1];
  }
}

if (!apiKey) {
  console.error('❌ Error: RESEND_API_KEY is not defined in process.env or .env.local');
  process.exit(1);
}

const docPath = path.join(__dirname, '../docs/ietf/SECDISPATCH_SUBMISSION_REQUEST.md');
if (!fs.existsSync(docPath)) {
  console.error(`❌ Error: Document not found at ${docPath}`);
  process.exit(1);
}

const markdownContent = fs.readFileSync(docPath, 'utf8');

const bodyLines = markdownContent.split('\n');
const startIdx = bodyLines.findIndex(line => line.startsWith('## 1. Document Information'));
const textBody = (startIdx !== -1 ? bodyLines.slice(startIdx) : bodyLines).join('\n').trim();

const subject = '[dispatch] Dispatch Request: The Zero-Trust Data Sanitization (ZTDS) Protocol (draft-sibiryakov-ztds-protocol-02)';

const payload = {
  from: 'Ilya Sibiryakov <ilya@brandmeweb.com>',
  to: ['secdispatch@ietf.org'],
  cc: ['rdd@cert.org', 'paul.wouters@aiven.io'],
  bcc: ['ilsimox@gmail.com'],
  reply_to: ['ilya@brandmeweb.com', 'ilsimox@gmail.com'],
  subject: subject,
  text: textBody
};

async function dispatch(dryRun = false) {
  console.log('🚀 IETF SECDISPATCH Request Preparation:');
  console.log(`From:    ${payload.from}`);
  console.log(`To:      ${payload.to.join(', ')}`);
  console.log(`CC:      ${payload.cc.join(', ')}`);
  console.log(`BCC:     ${payload.bcc.join(', ')}`);
  console.log(`Subject: ${payload.subject}\n`);

  if (dryRun) {
    console.log('🔍 [Dry-Run Mode] Network dispatch skipped.');
    console.log(`Payload length: ${payload.text.length} characters.`);
    return { dryRun: true, status: 'ready' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('❌ [Resend Error]:', data);
    process.exit(1);
  }

  console.log(`✅ [Dispatch Success] Resend Email ID: ${data.id}`);

  const logEntry = `[${new Date().toISOString()}] IETF SECDISPATCH Dispatched | draft-sibiryakov-ztds-protocol-02 | To: secdispatch@ietf.org | CC: rdd@cert.org, paul.wouters@aiven.io | Resend ID: ${data.id}\n`;
  const sprintLogPath = path.join(__dirname, '../.agent/sprint_logs.txt');
  fs.mkdirSync(path.dirname(sprintLogPath), { recursive: true });
  fs.appendFileSync(sprintLogPath, logEntry);

  console.log('✅ Logged to .agent/sprint_logs.txt');
  return data;
}

if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  dispatch(isDryRun).catch(err => {
    console.error('❌ Exception during dispatch:', err);
    process.exit(1);
  });
}

module.exports = { dispatch, payload };
