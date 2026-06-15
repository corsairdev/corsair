import crypto from 'node:crypto';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zohomail } from './index';

const SECRET = 'zoho-hook-secret-123';

function sign(rawBody: string, secret = SECRET): string {
	return crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
}

async function buildCorsair(options: { webhookSecret?: string } = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zohomail');
	const pluginOptions =
		'webhookSecret' in options
			? { webhookSecret: options.webhookSecret }
			: { webhookSecret: SECRET };
	const corsair = createCorsair({
		plugins: [zohomail(pluginOptions)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? 'test-kek-0123456789abcdef0123456789abcdef',
	});
	await corsair.zohomail.keys.issue_new_dek();
	return { corsair, testDb };
}

const eventBody = () =>
	JSON.stringify({
		messageId: '1450530000000099001',
		folderId: '1450530000000008014',
		subject: 'Webhook test mail',
		fromAddress: 'sender@example.com',
		toAddress: 'me@example.com',
		summary: 'hello from the webhook',
		receivedTime: '1700000000000',
	});

// The bound webhook leaf is `{ match, handler }`; the handler injects ctx
// (key resolved via keyBuilder → webhookSecret, db) — the same path
// `processWebhook` drives in the HTTP route.
describe('Zoho Mail webhook — full bound pipeline', () => {
	it('matches, verifies the signature, parses, and persists a signed delivery', async () => {
		const { corsair, testDb } = await buildCorsair();
		const orm = createCorsairOrm(testDb.database);
		const wh = corsair.zohomail.webhooks.messages.received;

		const rawBody = eventBody();
		const headers = { 'x-hook-signature': sign(rawBody) };

		// routing
		expect(wh.match({ headers, body: JSON.parse(rawBody) })).toBe(true);

		// verify + parse + persist
		const response = await wh.handler({
			payload: JSON.parse(rawBody),
			headers,
			rawBody,
		});
		expect(response.success).toBe(true);

		const events = await orm.events.findMany({
			where: { event_type: 'zohomail.webhook.messageReceived' },
		});
		expect(events.length).toBeGreaterThan(0);

		const stored = await corsair.zohomail.db.messages.findByEntityId(
			'1450530000000099001',
		);
		expect(stored?.data.subject).toBe('Webhook test mail');

		testDb.cleanup();
	});

	it('rejects a tampered body (bad signature) and does not persist', async () => {
		const { corsair, testDb } = await buildCorsair();
		const orm = createCorsairOrm(testDb.database);
		const wh = corsair.zohomail.webhooks.messages.received;

		const rawBody = eventBody();
		const goodSig = sign(rawBody);
		const tampered = rawBody.replace('Webhook test mail', 'Injected subject');

		const response = await wh.handler({
			payload: JSON.parse(tampered),
			headers: { 'x-hook-signature': goodSig },
			rawBody: tampered,
		});
		expect(response.success).toBe(false);

		const events = await orm.events.findMany({
			where: { event_type: 'zohomail.webhook.messageReceived' },
		});
		expect(events.length).toBe(0);

		testDb.cleanup();
	});

	it('rejects signed deliveries when no webhook secret is configured', async () => {
		const { corsair, testDb } = await buildCorsair({
			webhookSecret: undefined,
		});
		const wh = corsair.zohomail.webhooks.messages.received;

		const rawBody = eventBody();
		const response = await wh.handler({
			payload: JSON.parse(rawBody),
			headers: { 'x-hook-signature': sign(rawBody) },
			rawBody,
		});

		expect(response.success).toBe(false);
		expect(response.error).toMatch(/secret/i);

		testDb.cleanup();
	});

	it('handles the handshake and persists x-hook-secret', async () => {
		const { corsair, testDb } = await buildCorsair();
		const handshake = corsair.zohomail.webhooks.challenge.handshake;
		const hookSecret = 'incoming-hook-secret-from-zoho';

		expect(
			handshake.match({
				headers: { 'x-hook-secret': hookSecret },
				body: {},
			}),
		).toBe(true);

		const response = await handshake.handler({
			payload: {},
			headers: { 'x-hook-secret': hookSecret },
		});
		expect(response.success).toBe(true);
		expect(response.data?.hookSecret).toBe(hookSecret);

		const stored = await corsair.zohomail.keys.get_webhook_signature();
		expect(stored).toBe(hookSecret);

		testDb.cleanup();
	});

	it('handles first request with secret, signature, and email body', async () => {
		const { corsair, testDb } = await buildCorsair({
			webhookSecret: undefined,
		});
		const handshake = corsair.zohomail.webhooks.challenge.handshake;
		const received = corsair.zohomail.webhooks.messages.received;
		const hookSecret = 'first-request-hook-secret';
		const rawBody = eventBody();
		const headers = {
			'x-hook-secret': hookSecret,
			'x-hook-signature': sign(rawBody, hookSecret),
		};
		const body = JSON.parse(rawBody);

		expect(handshake.match({ headers, body })).toBe(true);
		expect(received.match({ headers, body })).toBe(false);

		const response = await handshake.handler({
			payload: body,
			headers,
			rawBody,
		});
		expect(response.success).toBe(true);

		const stored = await corsair.zohomail.keys.get_webhook_signature();
		expect(stored).toBe(hookSecret);

		testDb.cleanup();
	});

	it('rejects handshake when signature does not match the secret', async () => {
		const { corsair, testDb } = await buildCorsair({
			webhookSecret: undefined,
		});
		const handshake = corsair.zohomail.webhooks.challenge.handshake;
		const hookSecret = 'first-request-hook-secret';
		const rawBody = eventBody();

		const response = await handshake.handler({
			payload: JSON.parse(rawBody),
			headers: {
				'x-hook-secret': hookSecret,
				'x-hook-signature': sign(rawBody, 'wrong-secret'),
			},
			rawBody,
		});
		expect(response.success).toBe(false);

		testDb.cleanup();
	});

	it('perserves large numeric messageId values from raw JSON', async () => {
		const { corsair, testDb } = await buildCorsair();
		const wh = corsair.zohomail.webhooks.messages.received;
		const largeId = '1560840837125110000';
		const rawBody = `{"messageId":${largeId},"subject":"Large ID test","summary":"hello"}`;

		const response = await wh.handler({
			payload: JSON.parse(rawBody),
			headers: { 'x-hook-signature': sign(rawBody) },
			rawBody,
		});
		expect(response.success).toBe(true);

		const stored = await corsair.zohomail.db.messages.findByEntityId(largeId);
		expect(stored?.data.messageId).toBe(largeId);

		testDb.cleanup();
	});
});
