import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { omnisendOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { omnisend } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof omnisend>): KeyBuilder {
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
		`Omnisend ${status}`,
	);
}

describe('omnisend plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = omnisend();
		expect(plugin.id).toBe('omnisend');
		const ids = omnisendOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('prefers the key from options', async () => {
		const plugin = omnisend({ key: 'from-options' });
		await expect(keyBuilderOf(plugin)({ keys: {} }, 'endpoint')).resolves.toBe(
			'from-options',
		);
	});

	it('reads the stored key', async () => {
		const plugin = omnisend();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: () => Promise.resolve('stored') } },
				'endpoint',
			),
		).resolves.toBe('stored');
	});

	it('asks for a connection when no key is stored', async () => {
		const plugin = omnisend();
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
		const plugin = omnisend({ errorHandlers: { DEFAULT: callerDefault } });
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
		const write = omnisendOperations.find((o) => o.method === 'DELETE');
		if (write) {
			await expect(
				errorHandlers.SERVER_ERROR.handler(
					apiError(503, write.method, write.path),
				),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});
});
