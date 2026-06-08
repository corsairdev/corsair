import crypto from 'node:crypto';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zohomail } from './index';

const SECRET = 'zoho-hook-secret-123';

function sign(rawBody: string): string {
	return crypto.createHmac('sha256', SECRET).update(rawBody).digest('base64');
}

async function buildCorsair() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zohomail');
	const corsair = createCorsair({
		plugins: [zohomail({ webhookSecret: SECRET })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? 'test-kek-0123456789abcdef0123456789abcdef',
	});
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
});
