import 'dotenv/config';
import { filterWebhook } from 'corsair';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'application/json' }));

app.post('/webhook', async (req, res) => {
	console.log('\n' + '═'.repeat(60));
	console.log('📨 INCOMING WEBHOOK REQUEST');
	console.log('═'.repeat(60));
	console.log('Headers:', JSON.stringify(req.headers, null, 2));
	console.log('Body type:', typeof req.body);

	const headers = req.headers as Record<string, string | string[] | undefined>;
	const body = req.body;

	console.log('\n🔍 Running filterWebhook function...\n');

	const result = await filterWebhook(headers, body);

	console.log('✅ Filter Result:');
	console.log('   Resource:', result.resource || 'null (unknown provider)');
	console.log('   Action:', result.action || 'null (unknown action)');
	console.log('═'.repeat(60));

	if (result.resource === 'slack') {
		if (result.body.type === 'url_verification') {
			console.log('\n🔐 Slack URL Verification Challenge');
			console.log('Challenge:', result.body.challenge);
			return res.json({ challenge: result.body.challenge });
		}

		if (result.body.type === 'event_callback' && result.body.event) {
			console.log('\n📬 Slack Event Details:');
			console.log('   Event Type:', result.body.type);
			console.log('   Event ID:', result.body.event_id);
			console.log('   Team ID:', result.body.team_id);
			if (result.body.type === 'event_callback' && 'text' in result.body) {
				console.log(
					'   Message Text:',
					(result.body as { text?: string }).text?.substring(0, 100),
				);
			}
		}
	}

	if (result.resource === 'linear') {
		console.log('\n📋 Linear Event Details:');
		console.log('   Type:', result.body.type);
		console.log('   Action:', result.body.action);
		if (result.body.data) {
			console.log('   Data ID:', result.body.data.id);
			if (result.body.type === 'Issue' && result.body.data.title) {
				console.log('   Issue Title:', result.body.data.title);
			}
			if (result.body.type === 'Comment' && result.body.data.body) {
				console.log(
					'   Comment Preview:',
					result.body.data.body.substring(0, 100),
				);
			}
		}
	}

	res.status(200).json({
		success: true,
		filtered: {
			resource: result.resource,
			action: result.action,
		},
	});
});

app.get('/health', (_req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		endpoint: '/webhook',
	});
});

app.listen(PORT, () => {
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(60));
});

process.on('SIGINT', () => {
	console.log('\n\n👋 Shutting down webhook server...');
	process.exit(0);
});
