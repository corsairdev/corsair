import { whatsapp } from '@corsair-dev/whatsapp';
import * as crypto from 'crypto';
import { createCorsair } from '../core';
import { processWebhook } from '../webhooks';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { createTestDatabase } from './setup-db';

const whatsappOptions = {
	key: 'test-wa-token',
	phoneNumberId: '101010101010',
	webhookSecret: 'test-webhook-secret',
};

function generateSignature(secret: string, payload: string) {
	return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function parseEntityData(data: unknown): Record<string, unknown> {
	return typeof data === 'string'
		? (JSON.parse(data) as Record<string, unknown>)
		: (data as Record<string, unknown>);
}

const originalFetch = global.fetch;

describe('WhatsApp Integration Tests', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let capturedRequestUrl: string | null = null;
	let capturedRequestBody: Record<string, unknown> | null = null;
	let capturedRequestHeaders: Headers | null = null;
	const accountId = 'whatsapp-account';

	beforeEach(async () => {
		testDb = createTestDatabase();
		capturedRequestUrl = null;
		capturedRequestBody = null;
		capturedRequestHeaders = null;
		jest.clearAllMocks();

		global.fetch = jest
			.fn()
			.mockImplementation(
				async (url: string | URL | globalThis.Request, init?: RequestInit) => {
					capturedRequestUrl = url.toString();
					if (init?.body) {
						capturedRequestBody = JSON.parse(init.body as string);
					}
					if (init?.headers) {
						capturedRequestHeaders = new Headers(init.headers);
					}
					return new Response(
						JSON.stringify({
							messaging_product: 'whatsapp',
							contacts: [{ input: '1234567890', wa_id: '1234567890' }],
							messages: [{ id: 'wamid.HBgL...' }],
						}),
						{
							status: 200,
							headers: { 'content-type': 'application/json' },
						},
					);
				},
			);

		await createIntegrationAndAccount(testDb.db, 'whatsapp');
	});

	afterEach(() => {
		global.fetch = originalFetch;
		testDb.cleanup();
	});

	describe('Core API Routing (Outbound Messages)', () => {
		it('should route message sending through Corsair Core to the Meta API', async () => {
			const corsair = createCorsair({
				kek: 'test-kek-32-chars-long-padding-x',
				plugins: [whatsapp(whatsappOptions)],
				database: testDb.db,
			});

			await corsair.whatsapp.api.messages.send({
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'text',
				text: { body: 'Hello World' },
			});

			expect(global.fetch).toHaveBeenCalledTimes(1);
			expect(capturedRequestUrl).toBe(
				'https://graph.facebook.com/v24.0/101010101010/messages',
			);
			expect(capturedRequestHeaders?.get('authorization')).toBe(
				'Bearer test-wa-token',
			);
			expect(capturedRequestBody).toMatchObject({
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'text',
				text: { body: 'Hello World' },
			});

			const entities = await testDb.db
				.selectFrom('corsair_entities')
				.where('account_id', '=', accountId)
				.where('entity_type', '=', 'messages')
				.selectAll()
				.execute();

			expect(entities).toHaveLength(1);
			const data = parseEntityData(entities[0]!.data);
			expect(data.to).toBe('1234567890');
		});
	});

	describe('Hook Lifecycle Verification', () => {
		it('should intercept and mutate arguments in the before hook', async () => {
			const corsair = createCorsair({
				kek: 'test-kek-32-chars-long-padding-x',
				plugins: [
					whatsapp({
						...whatsappOptions,
						hooks: {
							messages: {
								send: {
									before: async (ctx, args) => {
										if (args.type === 'text' && args.text) {
											args.text.body = 'Intercepted: ' + args.text.body;
										}
										return { ctx, args };
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			await corsair.whatsapp.api.messages.send({
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'text',
				text: { body: 'Original' },
			});

			expect(global.fetch).toHaveBeenCalledTimes(1);
			expect(capturedRequestBody?.text).toEqual({
				body: 'Intercepted: Original',
			});
		});
	});

	describe('Webhook E2E Emulation', () => {
		it('should ingest valid webhook, verify signature, and persist incoming entity', async () => {
			const corsair = createCorsair({
				kek: 'test-kek-32-chars-long-padding-x',
				plugins: [whatsapp(whatsappOptions)],
				database: testDb.db,
			});

			const payload = {
				object: 'whatsapp_business_account',
				entry: [
					{
						id: '101010101010',
						changes: [
							{
								value: {
									messaging_product: 'whatsapp',
									metadata: {
										display_phone_number: '16505551111',
										phone_number_id: '101010101010',
									},
									messages: [
										{
											from: '1234567890',
											id: 'wamid.HBgL...',
											timestamp: '1690000000',
											type: 'text',
											text: {
												body: 'Inbound message',
											},
										},
									],
								},
								field: 'messages',
							},
						],
					},
				],
			};

			const rawBody = JSON.stringify(payload);
			const signature = generateSignature('test-webhook-secret', rawBody);

			const result = await processWebhook(
				corsair,
				{
					'x-hub-signature-256': `sha256=${signature}`,
					'content-type': 'application/json',
				},
				rawBody,
			);

			expect(result.plugin).toBe('whatsapp');
			expect(result.action).toBe('messages.received');

			const entities = await testDb.db
				.selectFrom('corsair_entities')
				.where('account_id', '=', accountId)
				.where('entity_type', '=', 'messages')
				.where('entity_id', '=', 'wamid.HBgL...')
				.selectAll()
				.execute();

			expect(entities).toHaveLength(1);
			const data = parseEntityData(entities[0]!.data);
			expect(data.text).toBe('Inbound message');
		});
	});
});
