import * as fs from 'fs';
import * as path from 'path';
import { GmailWebhookHandler, createWebhookHandler } from '../webhook-handler';
import type {
    HistoryEvent,
    MessageReceivedEvent,
    MessageDeletedEvent,
    MessageLabelChangedEvent,
} from '../webhooks';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
    filename: string;
    eventType: string;
    payload: object;
}

const EVENT_TYPES = [
    'history',
    'message_received',
    'message_deleted',
    'message_label_changed',
    'raw_pubsub_notification',
];

function extractEventType(filename: string): string {
    for (const eventType of EVENT_TYPES) {
        if (filename.startsWith(eventType + '_')) {
            return eventType;
        }
    }
    return filename.split('_')[0];
}

function loadFixtures(): FixtureFile[] {
    if (!fs.existsSync(FIXTURES_DIR)) {
        return [];
    }

    const files = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json'));
    
    return files.map(filename => {
        const filepath = path.join(FIXTURES_DIR, filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        const eventType = extractEventType(filename);
        
        return {
            filename,
            eventType,
            payload: JSON.parse(content),
        };
    });
}

function getFixturesByEventType(eventType: string): FixtureFile[] {
    return loadFixtures().filter(f => f.eventType === eventType);
}

describe('Real Gmail Webhook Events - Dynamic Tests', () => {
    const allFixtures = loadFixtures();
    
    beforeAll(() => {
        console.log('\n📁 Loaded fixtures from:', FIXTURES_DIR);
        console.log(`   Total fixtures: ${allFixtures.length}`);
        
        const byType = allFixtures.reduce((acc, f) => {
            acc[f.eventType] = (acc[f.eventType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        Object.entries(byType).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count} fixture(s)`);
        });
        
        if (allFixtures.length === 0) {
            console.log('\n⚠️  No fixtures found! Run the webhook server and trigger some events:');
            console.log('   1. npm run webhook-server');
            console.log('   2. In another terminal: ngrok http 3000');
            console.log('   3. Set up Pub/Sub push subscription with ngrok URL');
            console.log('   4. Start Gmail watch and trigger events');
            console.log('   5. Send emails, modify labels, delete messages, etc.\n');
        }
    });

    describe('History Events', () => {
        const historyFixtures = getFixturesByEventType('history');
        
        if (historyFixtures.length === 0) {
            it.skip('no history fixtures available - trigger Gmail events to capture them', () => {});
        } else {
            historyFixtures.forEach((fixture, index) => {
                it(`should process real history event #${index + 1} (${fixture.filename})`, async () => {
                    const handler = new GmailWebhookHandler({ autoFetchHistory: false });
                    const callback = jest.fn();
                    handler.on('history', callback);

                    const event = fixture.payload as HistoryEvent;
                    await callback(event);

                    expect(callback).toHaveBeenCalled();
                    expect(event.type).toBe('history');
                    expect(event.emailAddress).toBeDefined();
                    expect(event.historyId).toBeDefined();
                    
                    console.log(`   📜 History ID: ${event.historyId}`);
                    console.log(`      Email: ${event.emailAddress}`);
                });
            });
        }
    });

    describe('Message Received Events', () => {
        const messageReceivedFixtures = getFixturesByEventType('message_received');
        
        if (messageReceivedFixtures.length === 0) {
            it.skip('no message_received fixtures available - send emails to your account', () => {});
        } else {
            messageReceivedFixtures.forEach((fixture, index) => {
                it(`should process real message received event #${index + 1} (${fixture.filename})`, async () => {
                    const handler = new GmailWebhookHandler({ autoFetchHistory: false });
                    const callback = jest.fn();
                    handler.on('messageReceived', callback);

                    const event = fixture.payload as MessageReceivedEvent;
                    await callback(event);

                    expect(callback).toHaveBeenCalled();
                    expect(event.type).toBe('messageReceived');
                    expect(event.message).toBeDefined();
                    expect(event.message.id).toBeDefined();
                    
                    console.log(`   📧 New message: ${event.message.id}`);
                    if (event.message.snippet) {
                        console.log(`      Snippet: ${event.message.snippet.substring(0, 50)}...`);
                    }
                });
            });
        }
    });

    describe('Message Deleted Events', () => {
        const messageDeletedFixtures = getFixturesByEventType('message_deleted');
        
        if (messageDeletedFixtures.length === 0) {
            it.skip('no message_deleted fixtures available - delete messages to capture them', () => {});
        } else {
            messageDeletedFixtures.forEach((fixture, index) => {
                it(`should process real message deleted event #${index + 1} (${fixture.filename})`, async () => {
                    const handler = new GmailWebhookHandler({ autoFetchHistory: false });
                    const callback = jest.fn();
                    handler.on('messageDeleted', callback);

                    const event = fixture.payload as MessageDeletedEvent;
                    await callback(event);

                    expect(callback).toHaveBeenCalled();
                    expect(event.type).toBe('messageDeleted');
                    expect(event.message).toBeDefined();
                    expect(event.message.id).toBeDefined();
                    
                    console.log(`   🗑️  Deleted message: ${event.message.id}`);
                });
            });
        }
    });

    describe('Message Label Changed Events', () => {
        const labelChangedFixtures = getFixturesByEventType('message_label_changed');
        
        if (labelChangedFixtures.length === 0) {
            it.skip('no message_label_changed fixtures available - modify message labels to capture them', () => {});
        } else {
            labelChangedFixtures.forEach((fixture, index) => {
                it(`should process real label changed event #${index + 1} (${fixture.filename})`, async () => {
                    const handler = new GmailWebhookHandler({ autoFetchHistory: false });
                    const callback = jest.fn();
                    handler.on('messageLabelChanged', callback);

                    const event = fixture.payload as MessageLabelChangedEvent;
                    await callback(event);

                    expect(callback).toHaveBeenCalled();
                    expect(event.type).toBe('messageLabelChanged');
                    expect(event.message).toBeDefined();
                    
                    console.log(`   🏷️  Label changed for: ${event.message.id}`);
                    if (event.labelsAdded) {
                        console.log(`      Added: ${event.labelsAdded.join(', ')}`);
                    }
                    if (event.labelsRemoved) {
                        console.log(`      Removed: ${event.labelsRemoved.join(', ')}`);
                    }
                });
            });
        }
    });

    describe('Raw Pub/Sub Notifications', () => {
        const pubsubFixtures = getFixturesByEventType('raw_pubsub_notification');
        
        if (pubsubFixtures.length === 0) {
            it.skip('no raw Pub/Sub notifications available', () => {});
        } else {
            pubsubFixtures.forEach((fixture, index) => {
                it(`should parse real Pub/Sub notification #${index + 1} (${fixture.filename})`, async () => {
                    const handler = createWebhookHandler({ autoFetchHistory: false });
                    const historyCallback = jest.fn();
                    handler.on('history', historyCallback);

                    const payload = fixture.payload as any;
                    if (payload.body && payload.body.message) {
                        const result = await handler.handlePubSubNotification(payload.body);
                        
                        expect(result.success).toBe(true);
                        expect(result.historyId).toBeDefined();
                        
                        console.log(`   ✉️  Pub/Sub notification processed`);
                        console.log(`      History ID: ${result.historyId}`);
                    }
                });
            });
        }
    });
});

