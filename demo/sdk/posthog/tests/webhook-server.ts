import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { PostHogWebhookHandler } from '../webhook-handler';

const PORT = process.env.PORT || 3000;
const POSTHOG_WEBHOOK_SECRET = process.env.POSTHOG_WEBHOOK_SECRET || '';
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
	// Ensure eventId is a string and has a fallback
	const eventIdStr = String(eventId || 'unknown');
	const eventIdShort = eventIdStr.length > 8 ? eventIdStr.substring(0, 8) : eventIdStr;
	const filename = `${eventType}_${timestamp}_${eventIdShort}.json`;
	const filepath = path.join(FIXTURES_DIR, filename);

	fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
	console.log(`💾 Saved to: fixtures/${filename}`);
}

const app = express();
app.use(express.json());
app.use(express.text({ type: 'application/json' }));

const handler = new PostHogWebhookHandler({
	secret: POSTHOG_WEBHOOK_SECRET || undefined,
});

// Event captured handler
handler.on('event.captured', (event) => {
	console.log('\n📊 EVENT CAPTURED');
	console.log('━'.repeat(50));
	console.log(`Event: ${event.event}`);
	console.log(`Distinct ID: ${event.distinct_id}`);
	console.log(`Timestamp: ${event.timestamp || 'N/A'}`);
	if (event.properties) {
		console.log(`Properties: ${JSON.stringify(event.properties, null, 2)}`);
	}
});

app.post('/webhook', async (req, res) => {
	console.log('\n' + '═'.repeat(60));
	console.log(`📨 INCOMING POSTHOG WEBHOOK`);
	console.log('═'.repeat(60));

	const payloadObj =
		typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
	const payload =
		typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

	const result = await handler.handleWebhook(
		{
			'x-posthog-signature': req.headers['x-posthog-signature'] as string,
			'x-posthog-timestamp': req.headers['x-posthog-timestamp'] as string,
		},
		payload,
	);

	if (result.success && result.eventType) {
		const eventId = payloadObj.uuid || payloadObj.distinct_id || 'unknown';
		console.log(`Event Type: ${result.eventType}`);
		console.log(`Event ID: ${eventId}`);

		// Handle array of events
		const events = Array.isArray(payloadObj) ? payloadObj : [payloadObj];
		events.forEach((event: any) => {
			// Ensure eventId is converted to string
			const eventId = event.uuid || event.distinct_id || event.id || 'unknown';
			saveWebhookPayload(
				result.eventType || 'event.captured',
				eventId,
				event,
			);
		});

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
      <head><title>PostHog Webhook Test Server</title></head>
      <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>⚡ PostHog Webhook Test Server</h1>
        <p>This server is ready to receive PostHog webhook events.</p>
        
        <h2>Setup Instructions:</h2>
        <ol>
          <li>Run <code>ngrok http 3000</code> in another terminal</li>
          <li>Copy the ngrok URL (e.g., <code>https://abc123.ngrok.io</code>)</li>
          <li>Go to your PostHog project settings</li>
          <li>Navigate to Data Pipelines → Destinations</li>
          <li>Click "+ New" → "Destination" → "Webhook"</li>
          <li>Set Webhook URL to: <code>[ngrok-url]/webhook</code></li>
          <li>Configure filters and enable the destination</li>
          <li>Save the configuration</li>
        </ol>
        
        <h2>Endpoints:</h2>
        <ul>
          <li><code>POST /webhook</code> - Receives PostHog webhooks</li>
          <li><code>GET /health</code> - Health check</li>
        </ul>
        
        <h2>Environment Variables:</h2>
        <ul>
          <li><code>POSTHOG_WEBHOOK_SECRET</code> - ${POSTHOG_WEBHOOK_SECRET ? '✅ Configured' : '❌ Not set (signature verification disabled)'}</li>
          <li><code>PORT</code> - ${PORT}</li>
        </ul>
        
        <p>Check the terminal for incoming webhook logs!</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log('');
	console.log('⚡ PostHog Webhook Test Server');
	console.log('═'.repeat(50));
	console.log(`Server running at: http://localhost:${PORT}`);
	console.log(`Webhook endpoint:  http://localhost:${PORT}/webhook`);
	console.log(
		`Secret configured: ${POSTHOG_WEBHOOK_SECRET ? 'Yes' : 'No (signature verification disabled)'}`,
	);
	console.log('');
	console.log('📋 Next steps:');
	console.log('  1. Run: ngrok http 3000');
	console.log('  2. Copy the https URL from ngrok');
	console.log('  3. Go to your PostHog project settings');
	console.log('  4. Navigate to Data Pipelines → Destinations');
	console.log('  5. Create a new Webhook destination');
	console.log('  6. Set URL to: [ngrok-url]/webhook');
	console.log('  7. Configure filters and enable');
	console.log('  8. Save configuration');
	console.log('');
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(50));
});

