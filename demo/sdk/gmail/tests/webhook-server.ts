import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createWebhookHandler } from '../webhook-handler';

dotenv.config();

const app = express();
const port = process.env.WEBHOOK_PORT || 3000;
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    console.log(`Created fixtures directory: ${FIXTURES_DIR}`);
}

app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

const webhookHandler = createWebhookHandler({
    userId: process.env.GMAIL_USER_ID || 'me',
    autoFetchHistory: true,
});

function saveFixture(eventType: string, payload: any): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `${eventType}_${timestamp}_${random}.json`;
    const filepath = path.join(FIXTURES_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
    console.log(`   📝 Saved fixture: ${filename}`);
}

webhookHandler.on('history', async (event) => {
    console.log('\n🔔 History event received:');
    console.log(`   Email: ${event.emailAddress}`);
    console.log(`   History ID: ${event.historyId}`);
    
    saveFixture('history', event);
});

webhookHandler.on('messageReceived', async (event) => {
    console.log('\n📧 Message received event:');
    console.log(`   Email: ${event.emailAddress}`);
    console.log(`   Message ID: ${event.message.id}`);
    console.log(`   Snippet: ${event.message.snippet?.substring(0, 50)}...`);
    
    saveFixture('message_received', event);
});

webhookHandler.on('messageDeleted', async (event) => {
    console.log('\n🗑️  Message deleted event:');
    console.log(`   Email: ${event.emailAddress}`);
    console.log(`   Message ID: ${event.message.id}`);
    
    saveFixture('message_deleted', event);
});

webhookHandler.on('messageLabelChanged', async (event) => {
    console.log('\n🏷️  Message label changed event:');
    console.log(`   Email: ${event.emailAddress}`);
    console.log(`   Message ID: ${event.message.id}`);
    if (event.labelsAdded && event.labelsAdded.length > 0) {
        console.log(`   Labels added: ${event.labelsAdded.join(', ')}`);
    }
    if (event.labelsRemoved && event.labelsRemoved.length > 0) {
        console.log(`   Labels removed: ${event.labelsRemoved.join(', ')}`);
    }
    
    saveFixture('message_label_changed', event);
});

app.post('/webhook/gmail', async (req, res) => {
    console.log('\n' + '='.repeat(60));
    console.log('📬 Received webhook notification');
    console.log('='.repeat(60));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    saveFixture('raw_pubsub_notification', {
        headers: req.headers,
        body: req.body,
        timestamp: new Date().toISOString(),
    });

    try {
        const result = await webhookHandler.handleRawNotification(req.body);

        if (result.success) {
            console.log('\n✅ Webhook processed successfully');
            console.log(`   Event type: ${result.eventType}`);
            console.log(`   History ID: ${result.historyId}`);
            res.status(200).json({ success: true });
        } else {
            console.error('\n❌ Webhook processing failed:', result.error);
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('\n💥 Error processing webhook:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
    
    console.log('='.repeat(60) + '\n');
});

app.get('/health', (_req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        fixturesCount: fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json')).length,
    });
});

app.get('/webhook/history', (_req, res) => {
    res.json({
        lastHistoryId: webhookHandler.getLastHistoryId(),
    });
});

app.post('/webhook/history', (req, res) => {
    const { historyId } = req.body;
    if (historyId) {
        webhookHandler.setLastHistoryId(historyId);
        res.json({ success: true, historyId });
    } else {
        res.status(400).json({ success: false, error: 'historyId required' });
    }
});

app.get('/fixtures', (_req, res) => {
    const fixtures = fs.readdirSync(FIXTURES_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
            name: f,
            size: fs.statSync(path.join(FIXTURES_DIR, f)).size,
            modified: fs.statSync(path.join(FIXTURES_DIR, f)).mtime,
        }));
    
    res.json({ 
        count: fixtures.length,
        fixtures,
    });
});

app.listen(port, () => {
    console.log('\n' + '='.repeat(60));
    console.log('📮 Gmail Webhook Server Started');
    console.log('='.repeat(60));
    console.log(`   Port: ${port}`);
    console.log(`   Webhook endpoint: http://localhost:${port}/webhook/gmail`);
    console.log(`   Health check: http://localhost:${port}/health`);
    console.log(`   Fixtures: http://localhost:${port}/fixtures`);
    console.log(`   Fixtures directory: ${FIXTURES_DIR}`);
    console.log('='.repeat(60));
    console.log('\n🔧 Setup Instructions:\n');
    console.log('1. Install ngrok: https://ngrok.com/download');
    console.log('2. Run ngrok: ngrok http 3000');
    console.log('3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)');
    console.log('4. Set up Google Cloud Pub/Sub:');
    console.log('   a) Create a topic: gcloud pubsub topics create gmail-push');
    console.log('   b) Grant permission:');
    console.log('      gcloud pubsub topics add-iam-policy-binding gmail-push \\');
    console.log('        --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \\');
    console.log('        --role=roles/pubsub.publisher');
    console.log('   c) Create push subscription:');
    console.log('      gcloud pubsub subscriptions create gmail-push-sub \\');
    console.log('        --topic=gmail-push \\');
    console.log('        --push-endpoint=YOUR_NGROK_URL/webhook/gmail');
    console.log('5. Start watching via Gmail API (run from tests or manually)');
    console.log('6. Trigger events: send emails, modify labels, delete messages, etc.');
    console.log('\n📝 Captured events will be saved to:', FIXTURES_DIR);
    console.log('\n🧪 Run tests with: npm test -- webhooks.test.ts\n');
});

export { app, webhookHandler };
