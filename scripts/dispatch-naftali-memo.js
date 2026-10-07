/**
 * Patent Attorney Naftali Sync Memo Dispatcher
 * ─────────────────────────────────────────────
 * Dispatches the official Hebrew legal sync memo regarding:
 * - IL 331905 priority immunity & IETF Draft-02
 * - IETF RFC 8179 IPR Disclosure terms (Royalty-Free / FRAND / PrivacyScrubber exclusion)
 * - Madrid Protocol Filing Plan (ZTDS™ #397119, Deadline: 20/03/2027)
 * - PCT International Application Roadmap (IL 331905, WIPO DAS B17B, Deadline: 14/09/2027)
 * 
 * Recipients: office@levypatent.com, naftali@levypatent.com
 * CC: ilsimox@gmail.com
 * Sender: Ilya Sibiryakov <ilya@brandmeweb.com>
 * SSOT Content: docs/legal/MEMO_FOR_NAFTALI_IETF_SYNC_AND_MADRID_PCT.md
 */

const fs = require('fs');
const path = require('path');

// STRICT CONTRACT SIGNATURE GUARD: Do not dispatch until legal representation contract is signed
console.log('HOLD: Dispatch to Naftali Levy is on legal hold (engagement contract pending signature). Aborting.');
process.exit(0);

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

const docPath = path.join(__dirname, '../docs/legal/MEMO_FOR_NAFTALI_IETF_SYNC_AND_MADRID_PCT.md');
if (!fs.existsSync(docPath)) {
  console.error(`❌ Error: Document not found at ${docPath}`);
  process.exit(1);
}

const markdownContent = fs.readFileSync(docPath, 'utf8');

const subject = 'תזכיר סנכרון משפטי ופטנטי עבור עו"ד נפתלי: IL 331905 מול תקן IETF, גילוי IPR, פרוטוקול מדריד ו-PCT — איליה סיביריאקוב';

const payload = {
  from: 'Ilya Sibiryakov <ilya@brandmeweb.com>',
  to: ['office@levypatent.com', 'naftali@levypatent.com'],
  cc: ['ilsimox@gmail.com'],
  reply_to: ['ilya@brandmeweb.com', 'ilsimox@gmail.com'],
  subject: subject,
  text: markdownContent
};

async function dispatch(dryRun = false) {
  console.log('🚀 Patent Counsel Sync Memo Preparation:');
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

  const logEntry = `[${new Date().toISOString()}] Naftali Sync Memo Dispatched | IL 331905 / Madrid / PCT | To: office@levypatent.com, naftali@levypatent.com | Resend ID: ${data.id}\n`;
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
