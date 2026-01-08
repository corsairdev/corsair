import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { SlackWebhookHandler } from '../webhook-handler';

const PORT = process.env.PORT || 3000;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
	fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

function saveWebhookPayload(
	eventType: string,
	eventId: string,
	payload: object,
) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const filename = `${eventType}_${timestamp}_${eventId.substring(0, 8)}.json`;
	const filepath = path.join(FIXTURES_DIR, filename);

	fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
	console.log(`💾 Saved to: fixtures/${filename}`);
}

const app = express();
app.use(express.json());
app.use(express.text({ type: 'application/json' }));

const handler = new SlackWebhookHandler({
	signingSecret: SLACK_SIGNING_SECRET || undefined,
});

handler.on('message', (event) => {
	console.log('\n💬 MESSAGE EVENT');
	console.log('━'.repeat(50));
	console.log(`Channel: ${event.channel}`);
	if ('user' in event && event.user) {
		console.log(`User: ${event.user}`);
	}
	if ('text' in event && event.text) {
		console.log(`Text: ${event.text}`);
	}
	if ('subtype' in event && event.subtype) {
		console.log(`Subtype: ${event.subtype}`);
	}
});

handler.on('app_mention', (event) => {
	console.log('\n@️ APP MENTION EVENT');
	console.log('━'.repeat(50));
	console.log(`User: ${event.user}`);
	console.log(`Channel: ${event.channel}`);
	console.log(`Text: ${event.text}`);
});

handler.on('file_shared', (event) => {
	console.log('\n📎 FILE SHARED EVENT');
	console.log('━'.repeat(50));
	console.log(`File ID: ${event.file_id}`);
	console.log(`User: ${event.user_id}`);
	console.log(`Channel: ${event.channel_id}`);
});

handler.on('file_created', (event) => {
	console.log('\n📄 FILE CREATED EVENT');
	console.log('━'.repeat(50));
	console.log(`File ID: ${event.file_id}`);
	console.log(`User: ${event.user_id}`);
});

handler.on('file_public', (event) => {
	console.log('\n🌐 FILE PUBLIC EVENT');
	console.log('━'.repeat(50));
	console.log(`File ID: ${event.file_id}`);
	console.log(`User: ${event.user_id}`);
});

handler.on('channel_created', (event) => {
	console.log('\n📢 CHANNEL CREATED EVENT');
	console.log('━'.repeat(50));
	console.log(`Channel ID: ${event.channel.id}`);
	console.log(`Channel Name: ${event.channel.name}`);
	console.log(`Creator: ${event.channel.creator}`);
});

handler.on('reaction_added', (event) => {
	console.log('\n👍 REACTION ADDED EVENT');
	console.log('━'.repeat(50));
	console.log(`Reaction: :${event.reaction}:`);
	console.log(`User: ${event.user}`);
	console.log(`Item User: ${event.item_user}`);
});

handler.on('reaction_removed', (event) => {
	console.log('\n👎 REACTION REMOVED EVENT');
	console.log('━'.repeat(50));
	console.log(`Reaction: :${event.reaction}:`);
	console.log(`User: ${event.user}`);
	console.log(`Item User: ${event.item_user}`);
});

handler.on('team_join', (event) => {
	console.log('\n👋 TEAM JOIN EVENT');
	console.log('━'.repeat(50));
	console.log(`User: ${event.user.name} (${event.user.id})`);
	console.log(`Real Name: ${event.user.real_name}`);
});

handler.on('user_change', (event) => {
	console.log('\n👤 USER CHANGE EVENT');
	console.log('━'.repeat(50));
	console.log(`User: ${event.user.name} (${event.user.id})`);
	console.log(`Real Name: ${event.user.real_name}`);
});

app.post('/webhook', async (req, res) => {
	console.log('\n' + '═'.repeat(60));
	console.log(`📨 INCOMING SLACK WEBHOOK`);
	console.log('═'.repeat(60));

	const payloadObj =
		typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
	const payload =
		typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

	if (payloadObj.type === 'url_verification') {
		console.log('🔐 URL Verification Challenge Received');
		console.log(`Challenge: ${payloadObj.challenge}`);
		return res.json({ challenge: payloadObj.challenge });
	}

	const result = await handler.handleWebhook(
		{
			'x-slack-signature': req.headers['x-slack-signature'] as string,
			'x-slack-request-timestamp': req.headers[
				'x-slack-request-timestamp'
			] as string,
		},
		payload,
	);

	if (result.challenge) {
		console.log('✅ URL Verification successful');
		return res.json({ challenge: result.challenge });
	}

	if (result.success && result.eventType && payloadObj.event) {
		const eventId = payloadObj.event_id || 'unknown';
		console.log(`Event Type: ${result.eventType}`);
		console.log(`Event ID: ${eventId}`);

		saveWebhookPayload(result.eventType, eventId, payloadObj);
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
      <head><title>Slack Webhook Test Server</title></head>
      <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>⚡ Slack Webhook Test Server</h1>
        <p>This server is ready to receive Slack webhook events.</p>
        
        <h2>Setup Instructions:</h2>
        <ol>
          <li>Run <code>ngrok http 3000</code> in another terminal</li>
          <li>Copy the ngrok URL (e.g., <code>https://abc123.ngrok.io</code>)</li>
          <li>Go to <a href="https://api.slack.com/apps">https://api.slack.com/apps</a></li>
          <li>Select your app → Event Subscriptions</li>
          <li>Set Request URL to: <code>[ngrok-url]/webhook</code></li>
          <li>Subscribe to bot events:
            <ul>
              <li>app_mention</li>
              <li>message.channels</li>
              <li>file_shared</li>
              <li>file_created</li>
              <li>file_public</li>
              <li>channel_created</li>
              <li>reaction_added</li>
              <li>reaction_removed</li>
              <li>team_join</li>
              <li>user_change</li>
            </ul>
          </li>
          <li>Save changes and reinstall app to workspace</li>
        </ol>
        
        <h2>Endpoints:</h2>
        <ul>
          <li><code>POST /webhook</code> - Receives Slack webhooks</li>
          <li><code>GET /health</code> - Health check</li>
        </ul>
        
        <h2>Environment Variables:</h2>
        <ul>
          <li><code>SLACK_SIGNING_SECRET</code> - ${SLACK_SIGNING_SECRET ? '✅ Configured' : '❌ Not set (signature verification disabled)'}</li>
          <li><code>PORT</code> - ${PORT}</li>
        </ul>
        
        <p>Check the terminal for incoming webhook logs!</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log('');
	console.log('⚡ Slack Webhook Test Server');
	console.log('═'.repeat(50));
	console.log(`Server running at: http://localhost:${PORT}`);
	console.log(`Webhook endpoint:  http://localhost:${PORT}/webhook`);
	console.log(
		`Secret configured: ${SLACK_SIGNING_SECRET ? 'Yes' : 'No (signature verification disabled)'}`,
	);
	console.log('');
	console.log('📋 Next steps:');
	console.log('  1. Run: ngrok http 3000');
	console.log('  2. Copy the https URL from ngrok');
	console.log('  3. Go to https://api.slack.com/apps');
	console.log('  4. Select your app → Event Subscriptions');
	console.log('  5. Set Request URL: [ngrok-url]/webhook');
	console.log('  6. Subscribe to bot events (see homepage for list)');
	console.log('  7. Save and reinstall app');
	console.log('');
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(50));
});
