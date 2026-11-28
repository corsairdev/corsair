import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { zohocrmOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { zohocrm, zohocrmOAuthScopes } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof zohocrm>): KeyBuilder {
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
		`ZohoCrm ${status}`,
	);
}

describe('zohocrm plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = zohocrm();
		expect(plugin.id).toBe('zohocrm');
		const ids = zohocrmOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.authConfig).toEqual({ oauth_2: {} });
	});

	it("signs in at the region's accounts host with one comma-separated scope list", () => {
		const us = zohocrm().oauthConfig;
		expect(us?.authUrl).toBe('https://accounts.zoho.com/oauth/v2/auth');
		expect(us?.tokenUrl).toBe('https://accounts.zoho.com/oauth/v2/token');
		expect(us?.scopes).toEqual([zohocrmOAuthScopes.join(',')]);
		expect(us?.authParams).toEqual({
			access_type: 'offline',
			prompt: 'consent',
		});
		expect(zohocrm({ region: 'eu' }).oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.eu/oauth/v2/token',
		);
		expect(zohocrm({ region: 'ca' }).oauthConfig?.authUrl).toBe(
			'https://accounts.zohocloud.ca/oauth/v2/auth',
		);
	});

	it('prefers the token from options', async () => {
		const plugin = zohocrm({ key: 'from-options' });
		await expect(keyBuilderOf(plugin)({ keys: {} }, 'endpoint')).resolves.toBe(
			'from-options',
		);
	});

	it('uses the stored access token while it is fresh', async () => {
		const plugin = zohocrm();
		const later = String(Math.floor(Date.now() / 1000) + 3600);
		await expect(
			keyBuilderOf(plugin)(
				{
					tenantId: 't1',
					options: {},
					keys: {
						get_integration_credentials: () =>
							Promise.resolve({ client_id: 'id', client_secret: 'secret' }),
						get_access_token: () => Promise.resolve('stored-token'),
						get_expires_at: () => Promise.resolve(later),
					},
				},
				'endpoint',
			),
		).resolves.toBe('stored-token');
	});

	it("refreshes an expired token at the region's accounts host", async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					JSON.stringify({ access_token: 'fresh-token', expires_in: 3600 }),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			);
		const plugin = zohocrm({ region: 'in' });
		const saved: Record<string, string> = {};
		await expect(
			keyBuilderOf(plugin)(
				{
					tenantId: 't2',
					options: { region: 'in' },
					keys: {
						get_integration_credentials: () =>
							Promise.resolve({ client_id: 'id', client_secret: 'secret' }),
						get_access_token: () => Promise.resolve('old-token'),
						get_expires_at: () => Promise.resolve('1'),
						get_refresh_token: () => Promise.resolve('refresh'),
						set_access_token: (v: string) => {
							saved.access = v;
							return Promise.resolve();
						},
						set_expires_at: (v: string) => {
							saved.expires = v;
							return Promise.resolve();
						},
						set_refresh_token: () => Promise.resolve(),
					},
				},
				'endpoint',
			),
		).resolves.toBe('fresh-token');
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://accounts.zoho.in/oauth/v2/token',
		);
		expect(saved.access).toBe('fresh-token');
		fetchMock.mockRestore();
	});

	it('asks for a connection when nothing is connected', async () => {
		const plugin = zohocrm();
		await expect(
			keyBuilderOf(plugin)(
				{
					tenantId: 't3',
					options: {},
					keys: { get_integration_credentials: () => Promise.resolve({}) },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps a caller DEFAULT handler last', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};
		const plugin = zohocrm({ errorHandlers: { DEFAULT: callerDefault } });
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
		const write = zohocrmOperations.find((o) => o.method === 'DELETE');
		if (write) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(
					apiError(503, write.method, write.path),
				),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});
});
