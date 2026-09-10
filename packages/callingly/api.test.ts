import { AuthMissingError } from 'corsair/core';
import type { CallinglyKeyBuilderContext } from './index';
import { callingly } from './index';

describe('callingly plugin instance', () => {
	const plugin = callingly();

	it('initializes with default options and correct id', () => {
		expect(plugin.id).toBe('callingly');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(plugin.schema).toBeDefined();
		expect(plugin.authConfig).toBeDefined();
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});
});

describe('callingly keyBuilder authentication', () => {
	const plugin = callingly();
	const KEY = 'test-api-key';

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = callingly({ key: KEY });
		const mockCtx = {
			authType: 'api_key',
			keys: {},
		} as unknown as CallinglyKeyBuilderContext;
		const out = await withOptionsKey.keyBuilder!(mockCtx, 'endpoint');
		expect(out).toBe(KEY);
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

describe('callingly endpoint schemas & error handling', () => {
	it('requires name, event, and target_url in CreateWebhookInputSchema', async () => {
		const { CreateWebhookInputSchema } = await import('./endpoints/types');

		expect(() =>
			CreateWebhookInputSchema.parse({
				name: 'New Lead Webhook',
				event: 'lead.created',
				target_url: 'https://example.com/webhook',
			}),
		).not.toThrow();

		expect(() =>
			CreateWebhookInputSchema.parse({
				name: 'New Lead Webhook',
				event: 'lead.created',
			}),
		).toThrow();
	});

	it('enforces collection requirement in ListCallsResponseSchema and ListTeamUsersResponseSchema', async () => {
		const { ListCallsResponseSchema, ListTeamUsersResponseSchema } =
			await import('./endpoints/types');

		expect(() =>
			ListCallsResponseSchema.parse({
				calls: [{ id: 'call_1' }],
			}),
		).not.toThrow();

		expect(() =>
			ListCallsResponseSchema.parse({
				data: [{ id: 'call_2' }],
			}),
		).not.toThrow();

		expect(() =>
			ListCallsResponseSchema.parse({
				total: 0,
			}),
		).toThrow();

		expect(() =>
			ListTeamUsersResponseSchema.parse({
				agents: [{ id: 'user_1' }],
			}),
		).not.toThrow();

		expect(() => ListTeamUsersResponseSchema.parse({})).toThrow();
	});

	it('restricts SERVER_ERROR retry to GET requests only', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const { CallinglyAPIError } = await import('./client');

		const postRetry = await errorHandlers.SERVER_ERROR.handler(
			new CallinglyAPIError('Internal Server Error', 500, undefined, 'POST'),
		);
		expect(postRetry.maxRetries).toBe(0);

		const getRetry = await errorHandlers.SERVER_ERROR.handler(
			new CallinglyAPIError('Internal Server Error', 500, undefined, 'GET'),
		);
		expect(getRetry.maxRetries).toBe(2);
		expect(getRetry.retryStrategy).toBe('exponential_backoff');
	});
});
