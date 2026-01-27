import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ResendWebhookHandler } from '../webhook-handler';

const PORT = process.env.PORT || 3000;
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || '';
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
	fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

function saveWebhookPayload(
	eventType: string,
	eventId: string | number | undefined,
	payload: object,
) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const eventIdStr = String(eventId || 'unknown');
	const eventIdShort = eventIdStr.length > 8 ? eventIdStr.substring(0, 8) : eventIdStr;
	const filename = `${eventType.replace('.', '_')}_${timestamp}_${eventIdShort}.json`;
	const filepath = path.join(FIXTURES_DIR, filename);

	fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
	console.log(`💾 Saved to: fixtures/${filename}`);
}

const app = express();
app.use(express.json());
app.use(express.text({ type: 'application/json' }));

const handler = new ResendWebhookHandler({
	secret: RESEND_WEBHOOK_SECRET || undefined,
});

handler.on('email.sent', (event) => {
	console.log('\n📧 EMAIL SENT');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`From: ${event.data.from}`);
	console.log(`To: ${event.data.to?.join(', ')}`);
	console.log(`Subject: ${event.data.subject || 'N/A'}`);
	console.log(`Created At: ${event.created_at}`);
});

handler.on('email.delivered', (event) => {
	console.log('\n✅ EMAIL DELIVERED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`To: ${event.data.to?.join(', ')}`);
});

handler.on('email.opened', (event) => {
	console.log('\n👁️ EMAIL OPENED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`To: ${event.data.to?.join(', ')}`);
});

handler.on('email.clicked', (event) => {
	console.log('\n🖱️ EMAIL CLICKED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`Link: ${event.data.link || 'N/A'}`);
});

handler.on('email.bounced', (event) => {
	console.log('\n❌ EMAIL BOUNCED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`Bounce Type: ${event.data.bounce_type || 'N/A'}`);
});

handler.on('email.complained', (event) => {
	console.log('\n⚠️ EMAIL COMPLAINED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
});

handler.on('email.failed', (event) => {
	console.log('\n💥 EMAIL FAILED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
	console.log(`Error: ${event.data.error || 'N/A'}`);
});

handler.on('email.received', (event) => {
	console.log('\n📬 EMAIL RECEIVED');
	console.log('━'.repeat(50));
	console.log(`Email ID: ${event.data.email_id}`);
});

handler.on('domain.created', (event) => {
	console.log('\n🌐 DOMAIN CREATED');
	console.log('━'.repeat(50));
	console.log(`Domain ID: ${event.data.domain_id}`);
	console.log(`Name: ${event.data.name}`);
	console.log(`Status: ${event.data.status}`);
});

handler.on('domain.updated', (event) => {
	console.log('\n🔄 DOMAIN UPDATED');
	console.log('━'.repeat(50));
	console.log(`Domain ID: ${event.data.domain_id}`);
	console.log(`Name: ${event.data.name}`);
	console.log(`Status: ${event.data.status}`);
});

app.post('/webhook', async (req, res) => {
	console.log('\n' + '═'.repeat(60));
	console.log(`📨 INCOMING RESEND WEBHOOK`);
	console.log('═'.repeat(60));

	const payloadObj =
		typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
	const payload =
		typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

	const result = await handler.handleWebhook(
		{
			'resend-signature': req.headers['resend-signature'] as string,
		},
		payload,
	);

	if (result.success && result.eventType) {
		const eventId = payloadObj.data?.email_id || payloadObj.data?.domain_id || 'unknown';
		console.log(`Event Type: ${result.eventType}`);
		console.log(`Event ID: ${eventId}`);

		saveWebhookPayload(
			result.eventType,
			eventId,
			payloadObj,
		);

		console.log(`\n✅ Event processed successfully`);
		res.status(200).json({ status: 'ok' });
	} else {
		console.log(`\n❌ Event processing failed: ${result.error}`);
		res.status(400).json({ status: 'error', error: result.error });
	}
});

app.get('/health', (_req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
	res.send(`
    <html>
      <head><title>Resend Webhook Test Server</title></head>
      <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>⚡ Resend Webhook Test Server</h1>
        <p>This server is ready to receive Resend webhook events.</p>
        
        <h2>Setup Instructions:</h2>
        <ol>
          <li>Run <code>ngrok http 3000</code> in another terminal</li>
          <li>Copy the ngrok URL (e.g., <code>https://abc123.ngrok.io</code>)</li>
          <li>Go to your Resend dashboard</li>
          <li>Navigate to Settings → Webhooks</li>
          <li>Click "Add Webhook"</li>
          <li>Set Webhook URL to: <code>[ngrok-url]/webhook</code></li>
          <li>Select the events you want to receive</li>
          <li>Save the webhook secret (set as RESEND_WEBHOOK_SECRET)</li>
          <li>Click "Create Webhook"</li>
        </ol>
        
        <h2>Endpoints:</h2>
        <ul>
          <li><code>POST /webhook</code> - Receives Resend webhooks</li>
          <li><code>GET /health</code> - Health check</li>
        </ul>
        
        <h2>Environment Variables:</h2>
        <ul>
          <li><code>RESEND_WEBHOOK_SECRET</code> - ${RESEND_WEBHOOK_SECRET ? '✅ Configured' : '❌ Not set (signature verification disabled)'}</li>
          <li><code>PORT</code> - ${PORT}</li>
        </ul>
        
        <p>Check the terminal for incoming webhook logs!</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log('');
	console.log('⚡ Resend Webhook Test Server');
	console.log('═'.repeat(50));
	console.log(`Server running at: http://localhost:${PORT}`);
	console.log(`Webhook endpoint:  http://localhost:${PORT}/webhook`);
	console.log(
		`Secret configured: ${RESEND_WEBHOOK_SECRET ? 'Yes' : 'No (signature verification disabled)'}`,
	);
	console.log('');
	console.log('📋 Next steps:');
	console.log('  1. Run: ngrok http 3000');
	console.log('  2. Copy the https URL from ngrok');
	console.log('  3. Go to your Resend dashboard');
	console.log('  4. Navigate to Settings → Webhooks');
	console.log('  5. Click "Add Webhook"');
	console.log('  6. Set URL to: [ngrok-url]/webhook');
	console.log('  7. Select events to receive');
	console.log('  8. Save webhook secret as RESEND_WEBHOOK_SECRET');
	console.log('  9. Click "Create Webhook"');
	console.log('');
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(50));
});
