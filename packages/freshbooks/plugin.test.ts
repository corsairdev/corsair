import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	FRESHBOOKS_OAUTH_AUTH_URL,
	FRESHBOOKS_OAUTH_TOKEN_URL,
	freshbooksOAuthScopes,
} from './auth';
import { freshbooksOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { freshbooks } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof freshbooks>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

function apiError(status: number, method = 'GET', url = '/x'): ApiError {
	return new ApiError(
		{ method: method as 'GET', url },
		{
			url: `https://example.com${url}`,
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`FreshBooks ${status}`,
	);
}

describe('freshbooks plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = freshbooks();
		expect(plugin.id).toBe('freshbooks');
		const ids = freshbooksOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.authConfig).toEqual({ oauth_2: {} });
		expect(plugin.oauthConfig?.authUrl).toBe(FRESHBOOKS_OAUTH_AUTH_URL);
		expect(plugin.oauthConfig?.tokenUrl).toBe(FRESHBOOKS_OAUTH_TOKEN_URL);
		expect(plugin.oauthConfig?.scopes).toEqual([
			freshbooksOAuthScopes.join(' '),
		]);
	});

	it('prefers the key from options', async () => {
		const plugin = freshbooks({
			...{
				accountId: 'LJArJ4',
				businessId: '77001',
				businessUuid: '5e9a0c1d-2b3c-4d5e-8f90-a1b2c3d4e5f6',
			},
			key: 'fb-access-token-from-options',
		});
		await expect(keyBuilderOf(plugin)({ keys: {} }, 'endpoint')).resolves.toBe(
			'fb-access-token-from-options',
		);
	});

	it('uses the stored access token while it is fresh', async () => {
		const plugin = freshbooks({
			accountId: 'LJArJ4',
			businessId: '77001',
			businessUuid: '5e9a0c1d-2b3c-4d5e-8f90-a1b2c3d4e5f6',
		});
		await expect(
			keyBuilderOf(plugin)(
				{
					tenantId: 't1',
					keys: {
						get_integration_credentials: () =>
							Promise.resolve({ client_id: 'id', client_secret: 'secret' }),
						get_access_token: () => Promise.resolve('fb-access-token-stored'),
						get_expires_at: () =>
							Promise.resolve(String(Date.now() + 3_600_000)),
						get_refresh_token: () => Promise.resolve('refresh'),
					},
				},
				'endpoint',
			),
		).resolves.toBe('fb-access-token-stored');
	});

	it('asks for a connection when there is no token to refresh', async () => {
		const plugin = freshbooks();
		await expect(
			keyBuilderOf(plugin)(
				{
					tenantId: 't1',
					keys: {
						get_integration_credentials: () =>
							Promise.resolve({ client_id: 'id', client_secret: 'secret' }),
						get_access_token: () => Promise.resolve(null),
						get_expires_at: () => Promise.resolve(null),
						get_refresh_token: () => Promise.resolve(null),
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads the webhook secret, and answers empty before one is stored', async () => {
		await expect(
			keyBuilderOf(freshbooks({ webhookSecret: 'verifier-1' }))(
				{ keys: {} },
				'webhook',
			),
		).resolves.toBe('verifier-1');
		await expect(
			keyBuilderOf(freshbooks())(
				{
					keys: {
						get_webhook_signature: () => Promise.resolve('stored-verifier'),
					},
				},
				'webhook',
			),
		).resolves.toBe('stored-verifier');
		await expect(
			keyBuilderOf(freshbooks())(
				{ keys: { get_webhook_signature: () => Promise.resolve(null) } },
				'webhook',
			),
		).resolves.toBe('');
	});

	it('keeps a caller DEFAULT handler last', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};
		const plugin = freshbooks({ errorHandlers: { DEFAULT: callerDefault } });
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(plugin.errorHandlers?.DEFAULT).toBe(callerDefault);
	});
});

describe('error handlers', () => {
	it('does not retry a 429 again (core already did)', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches auth, not found and validation statuses', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(422))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(503))).toBe(true);
	});

	it('retries a 5xx only for reads', async () => {
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(503, 'GET')),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
		const write = freshbooksOperations.find((o) => o.method === 'DELETE');
		if (write) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(
					apiError(503, write.method, write.path),
				),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});
});
