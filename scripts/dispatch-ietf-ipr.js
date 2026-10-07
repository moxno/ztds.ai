/**
 * IETF RFC 8179 IPR Disclosure Dispatcher
 * ───────────────────────────────────────
 * Dispatches the official IPR disclosure for draft-sibiryakov-ztds-protocol-02
 * to the IETF Secretariat (ietf-ipr@ietf.org) via Resend API.
 * 
 * Sender: Ilya Sibiryakov <ilya@brandmeweb.com>
 * SSOT Content: docs/legal/IETF_IPR_DISCLOSURE_RFC8179.md
 */

const fs = require('fs');
const path = require('path');

let apiKey = process.env.RESEND_API_KEY;

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

const docPath = path.join(__dirname, '../docs/legal/IETF_IPR_DISCLOSURE_RFC8179.md');
if (!fs.existsSync(docPath)) {
  console.error(`❌ Error: Document not found at ${docPath}`);
  process.exit(1);
}

const markdownContent = fs.readFileSync(docPath, 'utf8');

const subject = '[IPR Disclosure] draft-sibiryakov-ztds-protocol-02: Ilya Sibiryakov\'s Statement about IPR (IL 331905 / WIPO DAS B17B)';

const payload = {
  from: 'Ilya Sibiryakov <ilya@brandmeweb.com>',
  to: ['ietf-ipr@ietf.org'],
  cc: ['ilsimox@gmail.com'],
  reply_to: ['ilya@brandmeweb.com', 'ilsimox@gmail.com'],
  subject: subject,
  text: markdownContent
};

async function dispatch(dryRun = false) {
  console.log('🚀 IETF RFC 8179 IPR Disclosure Preparation:');
  console.log(`From:    ${payload.from}`);
  console.log(`To:      ${payload.to.join(', ')}`);
  console.log(`CC:      ${payload.cc.join(', ')}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Payload Size: ${payload.text.length} characters\n`);

  if (dryRun) {
    console.log('ℹ️ Dry-run mode enabled. Email NOT sent.');
    return { dryRun: true };
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

  const logEntry = `[${new Date().toISOString()}] IETF IPR Disclosure Dispatched | draft-sibiryakov-ztds-protocol-02 | To: ietf-ipr@ietf.org | Resend ID: ${data.id}\n`;
  const sprintLogPath = path.join(__dirname, '../.agent/sprint_logs.txt');
  fs.mkdirSync(path.dirname(sprintLogPath), { recursive: true });
  fs.appendFileSync(sprintLogPath, logEntry);

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
