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
		// Cast partial test context: keyBuilder only accesses keys/authType properties
		const mockCtx = {
			authType: 'api_key',
			keys: {},
		} as unknown as CallinglyKeyBuilderContext;
		const out = await withOptionsKey.keyBuilder!(mockCtx, 'endpoint');
		expect(out).toBe(KEY);
	});

	it('returns options.webhookSecret for webhook source', async () => {
		const withWebhookSec = callingly({ webhookSecret: SECRET });
		// Cast partial test context: keyBuilder only accesses keys/authType properties
		const mockCtx = {
			authType: 'api_key',
			keys: {},
		} as unknown as CallinglyKeyBuilderContext;
		const out = await withWebhookSec.keyBuilder!(mockCtx, 'webhook');
		expect(out).toBe(SECRET);
	});

	it('throws AuthMissingError when api key is absent', async () => {
		// Cast partial test context: keyBuilder only accesses keys.get_api_key
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		// Cast partial test context: keyBuilder only accesses keys.get_api_key
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => KEY },
		} as unknown as CallinglyKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(KEY);
	});

	it('reads oauth access token from key manager', async () => {
		// Cast partial test context: keyBuilder only accesses keys.get_access_token
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
		const nowIso = new Date().toISOString();
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_55',
			status: 'completed',
			duration: 120,
			timestamp: nowIso,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		const mockUpsert = jest.fn();
		// Cast mock context: webhook handler requires database mock and signing key
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
				timestamp: nowIso,
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
			timestamp: new Date().toISOString(),
		});

		// Cast mock context: webhook handler requires signing key
		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: {
				event: 'call.completed',
				call_id: 'call_forged',
				timestamp: new Date().toISOString(),
			},
			headers: { 'x-callingly-signature': 'invalid_signature_hex' },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('executes leadCreated webhook handler correctly with signature & db persistence', async () => {
		const leadWebhook = plugin.webhooks!.leads.created;
		const nowIso = new Date().toISOString();
		const rawPayload = JSON.stringify({
			event: 'lead.created',
			lead_id: 'lead_77',
			name: 'Bob',
			phone_number: '+15551234567',
			timestamp: nowIso,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		const mockUpsert = jest.fn();
		// Cast mock context: webhook handler requires database mock and signing key
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
				timestamp: nowIso,
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
			timestamp: new Date().toISOString(),
		});

		// Cast mock context: webhook handler requires signing key
		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await leadWebhook.handler(ctxWithSecret, {
			payload: {
				event: 'lead.created',
				lead_id: 'lead_forged',
				timestamp: new Date().toISOString(),
			},
			headers: { 'x-callingly-signature': 'bad_sig' },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('rejects webhook when signing key is missing and not hub-verified', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		// Cast mock context: testing failure when key is absent
		const ctxNoKey = {
			key: '',
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxNoKey, {
			payload: { event: 'call.completed', call_id: 'call_1' },
			headers: {},
			rawBody: '{"event":"call.completed"}',
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('rejects webhook when entity id is absent', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const nowIso = new Date().toISOString();
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			timestamp: nowIso,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		// Cast mock context: testing payload validation with secret
		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: { event: 'call.completed', timestamp: nowIso },
			headers: { 'x-callingly-signature': validSig },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
	});

	it('rejects replayed webhook when timestamp is expired beyond 5 minutes', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const oldIso = new Date(Date.now() - 10 * 60 * 1000).toISOString();
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_old',
			timestamp: oldIso,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		// Cast mock context: testing replay attack validation
		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: {
				event: 'call.completed',
				call_id: 'call_old',
				timestamp: oldIso,
			},
			headers: { 'x-callingly-signature': validSig },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('rejects replayed direct webhook even when attacker supplies fresh x-callingly-timestamp header', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const oldIso = new Date(Date.now() - 15 * 60 * 1000).toISOString();
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_replayed_with_fresh_header',
			timestamp: oldIso,
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		// Attacker sends authentic rawPayload (with old timestamp) + fresh x-callingly-timestamp header
		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: {
				event: 'call.completed',
				call_id: 'call_replayed_with_fresh_header',
				timestamp: oldIso,
			},
			headers: {
				'x-callingly-signature': validSig,
				'x-callingly-timestamp': String(Date.now()),
			},
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('accepts a valid signature when rawBody was reconstructed with JSON.stringify', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const nowIso = new Date().toISOString();
		const payload = {
			event: 'call.completed',
			call_id: 'call_rebuilt',
			timestamp: nowIso,
		};
		const reconstructed = JSON.stringify(payload);
		const validSig = createHmac('sha256', webhookSecret)
			.update(reconstructed)
			.digest('hex');
		const ctxWithSecret = {
			key: webhookSecret,
			db: { calls: { upsertByEntityId: jest.fn() } },
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload,
			headers: { 'x-callingly-signature': validSig },
			rawBody: `{ "event": "call.completed", "call_id": "call_rebuilt", "timestamp": "${nowIso}" }`,
		});

		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('call_rebuilt');
	});

	it('rejects untimestamped webhook for replay attack prevention', async () => {
		const completedWebhook = plugin.webhooks!.calls.completed;
		const rawPayload = JSON.stringify({
			event: 'call.completed',
			call_id: 'call_no_ts',
		});
		const validSig = createHmac('sha256', webhookSecret)
			.update(rawPayload)
			.digest('hex');

		// Cast mock context: testing untimestamped replay rejection
		const ctxWithSecret = {
			key: webhookSecret,
			db: {},
		} as unknown as CallinglyContext;

		const result = await completedWebhook.handler(ctxWithSecret, {
			payload: { event: 'call.completed', call_id: 'call_no_ts' },
			headers: { 'x-callingly-signature': validSig },
			rawBody: rawPayload,
		});

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});
});

describe('callingly endpoint schemas & error handling', () => {
	it('requires name, event, and target_url in CreateWebhookInputSchema', async () => {
		const { CreateWebhookInputSchema } = await import('./endpoints/types');

		// Valid webhook input
		expect(() =>
			CreateWebhookInputSchema.parse({
				name: 'New Lead Webhook',
				event: 'lead.created',
				target_url: 'https://example.com/webhook',
			}),
		).not.toThrow();

		// Missing target_url should throw
		expect(() =>
			CreateWebhookInputSchema.parse({
				name: 'New Lead Webhook',
				event: 'lead.created',
			}),
		).toThrow();

		// Missing event should throw
		expect(() =>
			CreateWebhookInputSchema.parse({
				name: 'New Lead Webhook',
				target_url: 'https://example.com/webhook',
			}),
		).toThrow();

		// Missing name should throw
		expect(() =>
			CreateWebhookInputSchema.parse({
				event: 'lead.created',
				target_url: 'https://example.com/webhook',
			}),
		).toThrow();
	});

	it('enforces collection requirement in ListCallsResponseSchema and ListTeamUsersResponseSchema', async () => {
		const { ListCallsResponseSchema, ListTeamUsersResponseSchema } =
			await import('./endpoints/types');

		// Valid calls response with calls array
		expect(() =>
			ListCallsResponseSchema.parse({
				calls: [{ id: 'call_1' }],
			}),
		).not.toThrow();

		// Valid calls response with data array
		expect(() =>
			ListCallsResponseSchema.parse({
				data: [{ id: 'call_2' }],
			}),
		).not.toThrow();

		// Empty passthrough object without calls or data should throw
		expect(() =>
			ListCallsResponseSchema.parse({
				total: 0,
			}),
		).toThrow();

		// Valid team users response with agents array
		expect(() =>
			ListTeamUsersResponseSchema.parse({
				agents: [{ id: 'user_1' }],
			}),
		).not.toThrow();

		// Valid team users response with users array
		expect(() =>
			ListTeamUsersResponseSchema.parse({
				users: [{ id: 'user_2' }],
			}),
		).not.toThrow();

		// Empty passthrough object without agents or users should throw
		expect(() => ListTeamUsersResponseSchema.parse({})).toThrow();
	});

	it('restricts SERVER_ERROR retry to GET requests only', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const { CallinglyAPIError } = await import('./client');

		const postError = new CallinglyAPIError(
			'Internal Server Error',
			500,
			undefined,
			'POST',
		);
		const postRetry = await errorHandlers.SERVER_ERROR.handler(postError);
		expect(postRetry.maxRetries).toBe(0);

		const putError = new CallinglyAPIError(
			'Internal Server Error',
			500,
			undefined,
			'PUT',
		);
		const putRetry = await errorHandlers.SERVER_ERROR.handler(putError);
		expect(putRetry.maxRetries).toBe(0);

		const deleteError = new CallinglyAPIError(
			'Internal Server Error',
			500,
			undefined,
			'DELETE',
		);
		const deleteRetry = await errorHandlers.SERVER_ERROR.handler(deleteError);
		expect(deleteRetry.maxRetries).toBe(0);

		const getError = new CallinglyAPIError(
			'Internal Server Error',
			500,
			undefined,
			'GET',
		);
		const getRetry = await errorHandlers.SERVER_ERROR.handler(getError);
		expect(getRetry.maxRetries).toBe(2);
		expect(getRetry.retryStrategy).toBe('exponential_backoff');
	});
});
