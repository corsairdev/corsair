import * as fs from 'fs';
import * as path from 'path';
import { ResendWebhookHandler } from '../webhook-handler';
import type {
	EmailBouncedEvent,
	EmailClickedEvent,
	EmailDeliveredEvent,
	EmailOpenedEvent,
	EmailSentEvent,
	ResendWebhookEvent,
} from '../webhooks';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
	filename: string;
	eventType: string;
	payload: object;
}

const EVENT_TYPES = [
	'email.sent',
	'email.delivered',
	'email.opened',
	'email.clicked',
	'email.bounced',
	'email.complained',
	'email.failed',
	'email.received',
	'domain.created',
	'domain.updated',
];

function extractEventType(filename: string): string {
	for (const eventType of EVENT_TYPES) {
		if (filename.startsWith(eventType.replace('.', '_'))) {
			return eventType;
		}
	}
	return filename.split('_')[0];
}

function loadFixtures(): FixtureFile[] {
	if (!fs.existsSync(FIXTURES_DIR)) {
		return [];
	}

	const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));

	return files.map((filename) => {
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
	return loadFixtures().filter((f) => f.eventType === eventType);
}

describe('Resend Webhook Handler', () => {
	let handler: ResendWebhookHandler;

	beforeEach(() => {
		handler = new ResendWebhookHandler();
	});

	describe('Event Registration', () => {
		it('should register event handlers', () => {
			const callback = jest.fn();
			handler.on('email.sent', callback);

			expect(handler.hasHandlers('email.sent')).toBe(true);
			expect(handler.getRegisteredEvents()).toContain('email.sent');
		});

		it('should unregister event handlers', () => {
			const callback = jest.fn();
			handler.on('email.sent', callback);
			handler.off('email.sent', callback);

			expect(handler.hasHandlers('email.sent')).toBe(false);
		});

		it('should clear all handlers', () => {
			handler.on('email.sent', jest.fn());
			handler.on('email.delivered', jest.fn());
			handler.clearHandlers();

			expect(handler.getRegisteredEvents()).toHaveLength(0);
		});
	});

	describe('Webhook Processing', () => {
		it('should process email.sent event', async () => {
			const callback = jest.fn();
			handler.on('email.sent', callback);

			const payload: EmailSentEvent = {
				type: 'email.sent',
				created_at: new Date().toISOString(),
				data: {
					email_id: 'test-email-id',
					from: 'sender@example.com',
					to: ['recipient@example.com'],
					subject: 'Test Subject',
					created_at: new Date().toISOString(),
				},
			};

			const result = await handler.handleWebhook({}, payload);

			expect(result.success).toBe(true);
			expect(result.eventType).toBe('email.sent');
			expect(callback).toHaveBeenCalledWith(payload);
		});

		it('should process email.delivered event', async () => {
			const callback = jest.fn();
			handler.on('email.delivered', callback);

			const payload: EmailDeliveredEvent = {
				type: 'email.delivered',
				created_at: new Date().toISOString(),
				data: {
					email_id: 'test-email-id',
					from: 'sender@example.com',
					to: ['recipient@example.com'],
					created_at: new Date().toISOString(),
				},
			};

			const result = await handler.handleWebhook({}, payload);

			expect(result.success).toBe(true);
			expect(result.eventType).toBe('email.delivered');
		});

		it('should process email.opened event', async () => {
			const callback = jest.fn();
			handler.on('email.opened', callback);

			const payload: EmailOpenedEvent = {
				type: 'email.opened',
				created_at: new Date().toISOString(),
				data: {
					email_id: 'test-email-id',
					from: 'sender@example.com',
					to: ['recipient@example.com'],
					created_at: new Date().toISOString(),
				},
			};

			const result = await handler.handleWebhook({}, payload);

			expect(result.success).toBe(true);
			expect(result.eventType).toBe('email.opened');
		});

		it('should process email.clicked event', async () => {
			const callback = jest.fn();
			handler.on('email.clicked', callback);

			const payload: EmailClickedEvent = {
				type: 'email.clicked',
				created_at: new Date().toISOString(),
				data: {
					email_id: 'test-email-id',
					from: 'sender@example.com',
					to: ['recipient@example.com'],
					link: 'https://example.com',
					created_at: new Date().toISOString(),
				},
			};

			const result = await handler.handleWebhook({}, payload);

			expect(result.success).toBe(true);
			expect(result.eventType).toBe('email.clicked');
		});

		it('should process email.bounced event', async () => {
			const callback = jest.fn();
			handler.on('email.bounced', callback);

			const payload: EmailBouncedEvent = {
				type: 'email.bounced',
				created_at: new Date().toISOString(),
				data: {
					email_id: 'test-email-id',
					from: 'sender@example.com',
					to: ['recipient@example.com'],
					bounce_type: 'hard',
					created_at: new Date().toISOString(),
				},
			};

			const result = await handler.handleWebhook({}, payload);

			expect(result.success).toBe(true);
			expect(result.eventType).toBe('email.bounced');
		});
	});

	describe('Signature Verification', () => {
		it('should verify valid signature', () => {
			const secret = 'test-secret';
			const handler = new ResendWebhookHandler({ secret });
			const payload = JSON.stringify({ type: 'email.sent', data: {} });
			const signature = require('crypto')
				.createHmac('sha256', secret)
				.update(payload)
				.digest('hex');

			const isValid = handler.verifySignature(payload, signature);
			expect(isValid).toBe(true);
		});

		it('should reject invalid signature', () => {
			const secret = 'test-secret';
			const handler = new ResendWebhookHandler({ secret });
			const payload = JSON.stringify({ type: 'email.sent', data: {} });
			const invalidSignature = 'invalid-signature';

			const isValid = handler.verifySignature(payload, invalidSignature);
			expect(isValid).toBe(false);
		});

		it('should skip verification if no secret is configured', () => {
			const handler = new ResendWebhookHandler();
			const payload = JSON.stringify({ type: 'email.sent', data: {} });

			const isValid = handler.verifySignature(payload, '');
			expect(isValid).toBe(true);
		});
	});
});

describe('Fixture Statistics', () => {
	it('should report available fixtures', () => {
		const fixtures = loadFixtures();

		console.log('\n📊 Fixture Statistics:');
		console.log('═'.repeat(50));

		if (fixtures.length === 0) {
			console.log('No fixtures captured yet.\n');
			console.log('To capture real webhook payloads:');
			console.log('1. Run: npm run webhook-server');
			console.log('2. Run: ngrok http 3000');
			console.log('3. Configure webhook in Resend dashboard');
			console.log('4. Send emails or trigger domain events\n');
		} else {
			const byType = fixtures.reduce(
				(acc, f) => {
					acc[f.eventType] = (acc[f.eventType] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			EVENT_TYPES.forEach((type) => {
				const count = byType[type] || 0;
				const status = count > 0 ? '✅' : '⬜';
				console.log(`${status} ${type}: ${count} fixture(s)`);
			});

			console.log('═'.repeat(50));
			console.log(`Total: ${fixtures.length} fixtures\n`);
		}

		expect(true).toBe(true);
	});
});
