import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { GithubWebhookHandler } from '../webhook-handler';

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
	fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

function saveWebhookPayload(
	eventType: string,
	deliveryId: string,
	payload: object,
) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const filename = `${eventType}_${timestamp}_${deliveryId.substring(0, 8)}.json`;
	const filepath = path.join(FIXTURES_DIR, filename);

	fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
	console.log(`💾 Saved to: fixtures/${filename}`);
}

const app = express();
app.use(express.json());
app.use(express.text({ type: 'application/json' }));

const handler = new GithubWebhookHandler({
	secret: WEBHOOK_SECRET || undefined,
});

handler.on('commit_comment', (event) => {
	console.log('\n📝 COMMIT COMMENT EVENT');
	console.log('━'.repeat(50));
	console.log(`Action: ${event.action}`);
	console.log(`Comment: "${event.comment.body}"`);
	console.log(`Commit: ${event.comment.commit_id}`);
	console.log(`Author: ${event.comment.user.login}`);
	console.log(`Repo: ${event.repository.full_name}`);
});

handler.on('deployment', (event) => {
	console.log('\n🚀 DEPLOYMENT EVENT');
	console.log('━'.repeat(50));
	console.log(`Action: ${event.action}`);
	console.log(`Environment: ${event.deployment.environment}`);
	console.log(`Ref: ${event.deployment.ref}`);
	console.log(`SHA: ${event.deployment.sha.substring(0, 7)}`);
	console.log(`Creator: ${event.deployment.creator.login}`);
	if (event.workflow) {
		console.log(`Workflow: ${event.workflow.name}`);
	}
});

handler.on('pull_request', (event) => {
	console.log('\n🔀 PULL REQUEST EVENT');
	console.log('━'.repeat(50));
	console.log(`Action: ${event.action}`);
	console.log(`PR #${event.number}: ${event.pull_request.title}`);
	console.log(`State: ${event.pull_request.state}`);
	console.log(`Author: ${event.pull_request.user.login}`);
	console.log(
		`Base: ${event.pull_request.base.ref} ← Head: ${event.pull_request.head.ref}`,
	);
	console.log(`URL: ${event.pull_request.html_url}`);
	if (event.pull_request.body) {
		console.log(`Body: ${event.pull_request.body.substring(0, 100)}...`);
	}
});

handler.on('push', (event) => {
	console.log('\n⬆️  PUSH EVENT');
	console.log('━'.repeat(50));
	console.log(`Ref: ${event.ref}`);
	console.log(`Pusher: ${event.pusher.name}`);
	console.log(`Commits: ${event.commits.length}`);
	if (event.created) console.log(`Branch/Tag Created: Yes`);
	if (event.deleted) console.log(`Branch/Tag Deleted: Yes`);
	if (event.forced) console.log(`Force Push: Yes`);
	event.commits.forEach((commit, i) => {
		console.log(
			`  ${i + 1}. ${commit.message.split('\n')[0]} (${commit.id.substring(0, 7)})`,
		);
	});
	console.log(`Compare: ${event.compare}`);
});

handler.on('star', (event) => {
	console.log('\n⭐ STAR EVENT');
	console.log('━'.repeat(50));
	console.log(`Action: ${event.action}`);
	console.log(`User: ${event.sender.login}`);
	console.log(`Repo: ${event.repository.full_name}`);
	console.log(`Stars: ${event.repository.stargazers_count}`);
	if (event.action === 'created' && event.starred_at) {
		console.log(`Starred at: ${event.starred_at}`);
	}
});

handler.on('team_add', (event) => {
	console.log('\n👥 TEAM ADD EVENT');
	console.log('━'.repeat(50));
	console.log(`Team: ${event.team.name} (${event.team.slug})`);
	console.log(`Permission: ${event.team.permission}`);
	console.log(`Repo: ${event.repository.full_name}`);
	console.log(`Organization: ${event.organization.login}`);
	if (event.team.parent) {
		console.log(`Parent Team: ${event.team.parent.name}`);
	}
});

handler.on('watch', (event) => {
	console.log('\n👀 WATCH EVENT');
	console.log('━'.repeat(50));
	console.log(`Action: ${event.action}`);
	console.log(`User: ${event.sender.login}`);
	console.log(`Repo: ${event.repository.full_name}`);
	console.log(`Watchers: ${event.repository.watchers_count}`);
});

app.post('/webhook', async (req, res) => {
	const eventType = req.headers['x-github-event'] as string;
	const deliveryId = req.headers['x-github-delivery'] as string;

	console.log('\n' + '═'.repeat(60));
	console.log(`📨 INCOMING WEBHOOK`);
	console.log(`Event: ${eventType}`);
	console.log(`Delivery ID: ${deliveryId}`);
	console.log('═'.repeat(60));

	const payloadObj =
		typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
	const payload =
		typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

	if (eventType && eventType !== 'ping') {
		saveWebhookPayload(eventType, deliveryId || 'unknown', payloadObj);
	}

	const result = await handler.handleWebhook(
		{
			'x-github-event': eventType,
			'x-hub-signature-256': req.headers['x-hub-signature-256'] as string,
			'x-github-delivery': deliveryId,
		},
		payload,
	);

	if (result.success) {
		console.log(`\n✅ Event processed successfully`);
		res.status(200).json({ status: 'ok', eventType: result.eventType });
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
      <head><title>GitHub Webhook Test Server</title></head>
      <body style="font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>🎣 GitHub Webhook Test Server</h1>
        <p>This server is ready to receive GitHub webhooks.</p>
        <h2>Setup Instructions:</h2>
        <ol>
          <li>Run <code>ngrok http 3000</code> in another terminal</li>
          <li>Copy the ngrok URL (e.g., <code>https://abc123.ngrok.io</code>)</li>
          <li>Go to your GitHub repo → Settings → Webhooks → Add webhook</li>
          <li>Set Payload URL to: <code>[ngrok-url]/webhook</code></li>
          <li>Set Content type to: <code>application/json</code></li>
          <li>Set Secret to match WEBHOOK_SECRET env var (optional)</li>
          <li>Select events: Push, Pull requests, Stars, etc.</li>
        </ol>
        <h2>Endpoints:</h2>
        <ul>
          <li><code>POST /webhook</code> - Receives GitHub webhooks</li>
          <li><code>GET /health</code> - Health check</li>
        </ul>
        <p>Check the terminal for incoming webhook logs!</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log('');
	console.log('🎣 GitHub Webhook Test Server');
	console.log('═'.repeat(50));
	console.log(`Server running at: http://localhost:${PORT}`);
	console.log(`Webhook endpoint:  http://localhost:${PORT}/webhook`);
	console.log(
		`Secret configured: ${WEBHOOK_SECRET ? 'Yes' : 'No (signature verification disabled)'}`,
	);
	console.log('');
	console.log('📋 Next steps:');
	console.log('  1. Run: ngrok http 3000');
	console.log('  2. Copy the https URL from ngrok');
	console.log('  3. Add webhook in GitHub repo settings');
	console.log('     - Payload URL: [ngrok-url]/webhook');
	console.log('     - Content type: application/json');
	console.log('     - Events: Select the ones you want to test');
	console.log('');
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(50));
});
