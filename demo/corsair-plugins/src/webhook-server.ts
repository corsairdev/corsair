import 'dotenv/config';
import { filterWebhook } from 'corsair';
import express from 'express';
import { corsair } from './index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'application/json' }));

app.post('/webhook', async (req, res) => {
	console.log('\n' + '═'.repeat(60));
	console.log('📨 INCOMING WEBHOOK REQUEST');
	console.log('═'.repeat(60));
	console.log('Headers:', JSON.stringify(req.headers, null, 2));
	console.log('Body type:', req.body);

	const headers = req.headers as Record<string, string | string[] | undefined>;
	const body = req.body;
	const query = req.query as Record<string, string | string[] | undefined>;

	console.log('\n🔍 Running filterWebhook function...\n');

	const tenantId =
		query?.tenant_id && typeof query.tenant_id === 'string'
			? query.tenant_id
			: Array.isArray(query?.tenant_id) && query.tenant_id[0]
				? query.tenant_id[0]
				: (req.headers['x-tenant-id'] as string) || 'default';
	const tenantScopedCorsair = corsair.withTenant(tenantId);

	const result = await filterWebhook(tenantScopedCorsair, headers, body, query);

	console.log('✅ Filter Result:');
	console.log('   Plugin:', result.plugin || 'null (unknown provider)');
	console.log('   Action:', result.action || 'null (unknown action)');
	console.log('═'.repeat(60));

	if (result.plugin === 'slack') {
		const slackBody = result.body as {
			type?: string;
			challenge?: string;
			event?: { type?: string };
			event_id?: string;
			team_id?: string;
			text?: string;
		};

		if (slackBody.type === 'url_verification') {
			console.log('\n🔐 Slack URL Verification Challenge');
			console.log('Challenge:', slackBody.challenge);
			return res.json({ challenge: slackBody.challenge });
		}

		if (slackBody.type === 'event_callback' && slackBody.event) {
			console.log('\n📬 Slack Event Details:');
			console.log('   Event Type:', slackBody.type);
			console.log('   Event ID:', slackBody.event_id);
			console.log('   Team ID:', slackBody.team_id);
			if (slackBody.type === 'event_callback' && 'text' in slackBody) {
				console.log('   Message Text:', slackBody.text?.substring(0, 100));
			}
		}
	}

	if (result.plugin === 'linear') {
		const linearBody = result.body as {
			type?: string;
			action?: string;
			data?: { id?: string; title?: string; body?: string };
		};

		console.log('\n📋 Linear Event Details:');
		console.log('   Type:', linearBody.type);
		console.log('   Action:', linearBody.action);
		if (linearBody.data) {
			const data = linearBody.data;
			console.log('   Data ID:', data.id);
			if (linearBody.type === 'Issue' && data.title) {
				console.log('   Issue Title:', data.title);
			}
			if (linearBody.type === 'Comment' && data.body) {
				console.log('   Comment Preview:', data.body.substring(0, 100));
			}
		}
	}

	if (result.plugin === 'gmail') {
		const gmailBody = result.body as {
			message?: {
				data?: string;
				messageId?: string;
			};
		};

		console.log('\n📧 Gmail Event Details:');
		console.log('   Action:', result.action);
		if (gmailBody.message) {
			console.log('   Message ID:', gmailBody.message.messageId);
			if (gmailBody.message.data) {
				console.log('   Has Data:', !!gmailBody.message.data);
			}
		}
	}

	res.status(200).json({
		success: true,
		filtered: {
			plugin: result.plugin,
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
