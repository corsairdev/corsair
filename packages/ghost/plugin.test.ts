import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ghostAccountFields } from './auth';
import { ghostOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { ghost } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof ghost>): KeyBuilder {
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
		`Ghost ${status}`,
	);
}

describe('ghost plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = ghost();
		expect(plugin.id).toBe('ghost');
		const ids = ghostOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: [...ghostAccountFields] },
		});
	});

	it('prefers the key from options', async () => {
		const plugin = ghost({
			...{
				siteUrl: 'https://blog.example.com',
				contentApiKey: 'content_key_test_value',
			},
			key: '6b0a3e9ebfdd6d00010042af:0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0',
		});
		await expect(keyBuilderOf(plugin)({ keys: {} }, 'endpoint')).resolves.toBe(
			'6b0a3e9ebfdd6d00010042af:0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0',
		);
	});

	it('reads the stored key', async () => {
		const plugin = ghost({
			siteUrl: 'https://blog.example.com',
			contentApiKey: 'content_key_test_value',
		});
		await expect(
			keyBuilderOf(plugin)(
				{
					keys: {
						get_api_key: () =>
							Promise.resolve(
								'6b0a3e9ebfdd6d00010042b0:1f2e3d4c5b6a79889706b5c4d3e2f1011f2e3d4c5b6a79889706b5c4d3e2f101',
							),
						get_site_url: () => Promise.resolve('https://blog.example.com'),
					},
				},
				'endpoint',
			),
		).resolves.toBe(
			'6b0a3e9ebfdd6d00010042b0:1f2e3d4c5b6a79889706b5c4d3e2f1011f2e3d4c5b6a79889706b5c4d3e2f101',
		);
	});

	it('asks for a connection when no key is stored', async () => {
		const plugin = ghost();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: () => Promise.resolve(null) } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilderOf(plugin)(
				{
					keys: {
						get_api_key: () => Promise.reject(new Error('No DEK found')),
					},
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
		const plugin = ghost({ errorHandlers: { DEFAULT: callerDefault } });
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
		const write = ghostOperations.find((o) => o.method === 'DELETE');
		if (write) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(
					apiError(503, write.method, write.path),
				),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});
});
