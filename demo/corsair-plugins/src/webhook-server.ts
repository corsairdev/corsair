import 'dotenv/config';
import express from 'express';
import { filterWebhook } from 'corsair';

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

	const result = filterWebhook(headers, body);

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
				console.log('   Message Text:', (result.body as { text?: string }).text?.substring(0, 100));
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
				console.log('   Comment Preview:', result.body.data.body.substring(0, 100));
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

app.get('/', (_req, res) => {
	res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Webhook Filter Test Server</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
          }
          code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
          }
          pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          .step {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #4CAF50;
          }
          h2 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>🔍 Webhook Filter Test Server</h1>
        <p>This server uses the <code>filterWebhook</code> function to identify webhook providers and actions.</p>
        
        <h2>📡 Endpoints</h2>
        <ul>
          <li><code>POST /webhook</code> - Receives webhooks from Slack, Linear, GitHub, etc.</li>
          <li><code>GET /health</code> - Health check endpoint</li>
        </ul>

        <h2>🚀 Setup Instructions</h2>
        
        <div class="step">
          <h3>1. Expose your server with ngrok</h3>
          <pre>ngrok http ${PORT}</pre>
          <p>Copy the HTTPS URL (e.g., <code>https://abc123.ngrok.io</code>)</p>
        </div>

        <div class="step">
          <h3>2. Configure Slack Webhooks</h3>
          <ol>
            <li>Go to <a href="https://api.slack.com/apps" target="_blank">https://api.slack.com/apps</a></li>
            <li>Select your app → <strong>Event Subscriptions</strong></li>
            <li>Set Request URL to: <code>[ngrok-url]/webhook</code></li>
            <li>Subscribe to bot events (e.g., <code>message.channels</code>, <code>app_mention</code>, <code>reaction_added</code>)</li>
            <li>Save and reinstall the app to your workspace</li>
          </ol>
          <p><strong>Note:</strong> Slack will send a URL verification challenge first. The server handles this automatically.</p>
        </div>

        <div class="step">
          <h3>3. Configure Linear Webhooks</h3>
          <ol>
            <li>Go to your Linear workspace → <strong>Settings</strong> → <strong>API</strong> → <strong>Webhooks</strong></li>
            <li>Click <strong>Create webhook</strong></li>
            <li>Set URL to: <code>[ngrok-url]/webhook</code></li>
            <li>Select events (e.g., <code>Issue</code>, <code>Comment</code>, <code>Project</code>)</li>
            <li>Save the webhook</li>
          </ol>
        </div>

        <div class="step">
          <h3>4. Test GitHub Webhooks (Optional)</h3>
          <ol>
            <li>Go to your GitHub repository → <strong>Settings</strong> → <strong>Webhooks</strong></li>
            <li>Click <strong>Add webhook</strong></li>
            <li>Set Payload URL to: <code>[ngrok-url]/webhook</code></li>
            <li>Set Content type to: <code>application/json</code></li>
            <li>Select events (e.g., <code>push</code>, <code>pull_request</code>)</li>
            <li>Click <strong>Add webhook</strong></li>
          </ol>
        </div>

        <h2>📋 What the filterWebhook function does</h2>
        <p>The <code>filterWebhook</code> function analyzes the request headers and body to identify:</p>
        <ul>
          <li><strong>Resource:</strong> The provider (slack, linear, github, etc.)</li>
          <li><strong>Action:</strong> The event/action type (message, IssueCreate, push, etc.)</li>
        </ul>

        <p><strong>Check your terminal for detailed webhook information!</strong></p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log('');
	console.log('╔══════════════════════════════════════════════════════════╗');
	console.log('║   Webhook Filter Test Server                            ║');
	console.log('╚══════════════════════════════════════════════════════════╝');
	console.log('');
	console.log(`🚀 Server running at: http://localhost:${PORT}`);
	console.log(`📡 Webhook endpoint:  http://localhost:${PORT}/webhook`);
	console.log(`📊 Health check:      http://localhost:${PORT}/health`);
	console.log('');
	console.log('📖 Next steps:');
	console.log('  1. Run: ngrok http ' + PORT);
	console.log('  2. Copy the HTTPS URL from ngrok');
	console.log('  3. Configure webhooks in Slack/Linear/GitHub');
	console.log('  4. Send test events and watch the terminal!');
	console.log('');
	console.log('═'.repeat(60));
	console.log('Waiting for webhooks...');
	console.log('═'.repeat(60));
});

process.on('SIGINT', () => {
	console.log('\n\n👋 Shutting down webhook server...');
	process.exit(0);
});