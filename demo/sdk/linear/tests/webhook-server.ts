import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createWebhookHandler } from '../webhook-handler';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  console.log(`Created fixtures directory: ${FIXTURES_DIR}`);
}

app.use(express.json());

const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;
const handler = createWebhookHandler(webhookSecret ? { webhookSecret } : undefined);

handler.on('Issue', (event) => {
  console.log(`\n📋 Issue ${event.action}:`, event.data.title);
  console.log(`   ID: ${event.data.identifier}`);
  if (event.action === 'update' && 'updatedFrom' in event && event.updatedFrom) {
    console.log(`   Updated fields: ${Object.keys(event.updatedFrom).join(', ')}`);
  }
});

handler.on('Comment', (event) => {
  console.log(`\n💬 Comment ${event.action}`);
  console.log(`   Body: ${event.data.body?.substring(0, 50)}...`);
});

handler.on('Project', (event) => {
  console.log(`\n📊 Project ${event.action}:`, event.data.name);
  console.log(`   State: ${event.data.state}`);
});

app.post('/webhook/linear', async (req, res) => {
  try {
    const headers = {
      'linear-signature': req.headers['linear-signature'] as string,
      'linear-delivery': req.headers['linear-delivery'] as string,
    };

    console.log('\n🔔 Webhook received');
    console.log('   Signature:', headers['linear-signature'] ? '✓' : '✗');
    console.log('   Delivery:', headers['linear-delivery']);

    const result = await handler.handleWebhook(headers, req.body);

    if (!result.success) {
      console.error('   ❌ Error:', result.error);
      return res.status(400).json({ error: result.error });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const randomId = Math.random().toString(36).substring(7);
    const eventType = result.eventType || 'unknown';
    const action = result.action || 'unknown';
    const filename = `${eventType}_${action}_${timestamp}_${randomId}.json`;
    const filepath = path.join(FIXTURES_DIR, filename);

    const fixtureData = {
      timestamp,
      headers,
      body: req.body,
    };

    fs.writeFileSync(filepath, JSON.stringify(req.body, null, 2));
    
    console.log(`   ✓ Event processed: ${eventType}.${action}`);
    console.log(`   💾 Saved to: ${filename}`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('   ❌ Error processing webhook:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    fixturesCount: fs.existsSync(FIXTURES_DIR) 
      ? fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json')).length 
      : 0,
  });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Linear Webhook Server                       ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📝 Webhook endpoint: http://localhost:${PORT}/webhook/linear`);
  console.log(`💾 Fixtures directory: ${FIXTURES_DIR}`);
  console.log(`🔐 Signature verification: ${webhookSecret ? 'ENABLED' : 'DISABLED (set LINEAR_WEBHOOK_SECRET)'}`);
  console.log('\n📖 To expose this server:');
  console.log(`   ngrok http ${PORT}`);
  console.log('\n⏳ Waiting for webhook events...\n');
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down webhook server...');
  process.exit(0);
});

