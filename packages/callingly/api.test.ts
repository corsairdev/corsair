import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type { CallinglyContext, CallinglyKeyBuilderContext } from './index';
import { callingly } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

describe('callingly plugin instance', () => {
	const plugin = callingly();

	it('initializes with default options and correct id', () => {
		expect(plugin.id).toBe('callingly');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toBeDefined();
		expect(plugin.schema).toBeDefined();
		expect(plugin.authConfig).toBeDefined();
	});

	it('matches webhook signature headers correctly', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-callingly-signature': 'sig123' },
				body: null,
				query: {},
			}),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'callingly-signature': 'sig123' },
				body: null,
				query: {},
			}),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-other-header': 'val' },
				body: null,
				query: {},
			}),
		).toBe(false);
	});
});

describe('callingly keyBuilder authentication', () => {
	const plugin = callingly();
	const KEY = 'test-api-key';
	const SECRET = 'test-webhook-secret';

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = callingly({ key: KEY });
		const out = await withOptionsKey.keyBuilder!(
			{ authType: 'api_key', keys: {} } as CallinglyKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe(KEY);
	});

	it('returns options.webhookSecret for webhook source', async () => {
		const withWebhookSec = callingly({ webhookSecret: SECRET });
		const out = await withWebhookSec.keyBuilder!(
			{ authType: 'api_key', keys: {} } as CallinglyKeyBuilderContext,
			'webhook',
		);
		expect(out).toBe(SECRET);
	});

	it('throws AuthMissingError when api key is absent', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => KEY },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(KEY);
	});

	it('reads oauth access token from key manager', async () => {
		const oauthCtx = {
			authType: 'oauth_2',
			keys: { get_access_token: async () => 'oauth-token-123' },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(plugin.keyBuilder!(oauthCtx, 'endpoint')).resolves.toBe(
			'oauth-token-123',
		);
	});
});

describe('callingly webhooks', () => {
	const plugin = callingly();
	const webhookSecret = 'whsec_test_secret_123456';

	it('executes callCompleted webhook handler correctly with signature & db persistence', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_55',
			status: 'completed',
			duration: 120,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		const mockUpsert = jest.fn();
		const ctxWithDb = {
			key: webhookSecret,
			db: {
				calls: { upsertByEntityId: mockUpsert },
			},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithDb, {
			payload: {
				event: 'call.completed',
				call_id: 'call_55',
				status: 'completed',
				duration: 120,
			},
			headers: { 'x-callingly-signature': validSig },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('call_55');
		expect(mockUpsert).toHaveBeenCalledWith(
			'call_55',
			expect.objectContaining({
				id: 'call_55',
				status: 'completed',
				duration: 120,
			}),
		);
	});

	it('rejects forged callCompleted webhook when signature is invalid', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_forged',
		});

		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: { event: 'call.completed', call_id: 'call_forged' },
			headers: { 'x-callingly-signature': 'invalid_signature_hex' },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('executes leadCreated webhook handler correctly with signature & db persistence', async () => {
		const leadWebhook = plugin.webhooks!.leads.created;
		const rawPayload = JSON.stringify({
			event: 'lead.created',
			lead_id: 'lead_77',
			name: 'Bob',
			phone_number: '+15551234567',
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		const mockUpsert = jest.fn();
		const ctxWithDb = {
			key: webhookSecret,
			db: {
				leads: { upsertByEntityId: mockUpsert },
			},
		} as unknown as CallinglyContext;

		const result = await leadWebhook.handler(ctxWithDb, {
			payload: {
				event: 'lead.created',
				lead_id: 'lead_77',
				name: 'Bob',
				phone_number: '+15551234567',
			},
			headers: { 'x-callingly-signature': validSig },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('lead_77');
		expect(mockUpsert).toHaveBeenCalledWith(
			'lead_77',
			expect.objectContaining({
				id: 'lead_77',
				name: 'Bob',
				phone: '+15551234567',
			}),
		);
	});

	it('rejects forged leadCreated webhook when signature is invalid', async () => {
		const leadWebhook = plugin.webhooks!.leads.created;
		const rawPayload = JSON.stringify({
			event: 'lead.created',
			lead_id: 'lead_forged',
		});

		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await leadWebhook.handler(ctxWithSecret, {
			payload: { event: 'lead.created', lead_id: 'lead_forged' },
			headers: { 'x-callingly-signature': 'bad_sig' },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});
});
