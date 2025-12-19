import express from 'express';
import * as dotenv from 'dotenv';
import { createWebhookHandler } from '../webhook-handler';

dotenv.config();

const app = express();
const port = process.env.WEBHOOK_PORT || 3000;

app.use(express.json());

const webhookHandler = createWebhookHandler({
    userId: process.env.GMAIL_USER_ID || 'me',
    autoFetchHistory: true,
});

webhookHandler.on('history', async (event) => {
    console.log('History event received:');
    console.log(`  Email: ${event.emailAddress}`);
    console.log(`  History ID: ${event.historyId}`);
});

webhookHandler.on('messageReceived', async (event) => {
    console.log('Message received event:');
    console.log(`  Email: ${event.emailAddress}`);
    console.log(`  Message ID: ${event.message.id}`);
    console.log(`  Snippet: ${event.message.snippet}`);
});

webhookHandler.on('messageDeleted', async (event) => {
    console.log('Message deleted event:');
    console.log(`  Email: ${event.emailAddress}`);
    console.log(`  Message ID: ${event.message.id}`);
});

webhookHandler.on('messageLabelChanged', async (event) => {
    console.log('Message label changed event:');
    console.log(`  Email: ${event.emailAddress}`);
    console.log(`  Message ID: ${event.message.id}`);
    if (event.labelsAdded) {
        console.log(`  Labels added: ${event.labelsAdded.join(', ')}`);
    }
    if (event.labelsRemoved) {
        console.log(`  Labels removed: ${event.labelsRemoved.join(', ')}`);
    }
});

app.post('/webhook/gmail', async (req, res) => {
    console.log('Received webhook notification');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    try {
        const result = await webhookHandler.handleRawNotification(req.body);

        if (result.success) {
            console.log('Webhook processed successfully');
            res.status(200).json({ success: true });
        } else {
            console.error('Webhook processing failed:', result.error);
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/webhook/history', (req, res) => {
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

app.listen(port, () => {
    console.log(`Gmail webhook server listening on port ${port}`);
    console.log(`Webhook endpoint: http://localhost:${port}/webhook/gmail`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`\nTo use with Gmail Push Notifications:`);
    console.log(`1. Set up a Cloud Pub/Sub topic`);
    console.log(`2. Create a push subscription pointing to this endpoint`);
    console.log(`3. Call Gmail Users.watch() API to start receiving notifications`);
});

export { app, webhookHandler };

