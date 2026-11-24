import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { mocoOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { moco } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof moco>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

function apiError(status: number, method = 'GET'): ApiError {
	return new ApiError(
		{ method: method as 'GET', url: '/projects/{id}' },
		{
			url: 'https://acme.mocoapp.com/api/v1/projects/{id}',
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`MOCO ${status}`,
	);
}

describe('moco plugin', () => {
	it('registers every operation with meta and schemas', () => {
		const plugin = moco();
		expect(plugin.id).toBe('moco');
		const ids = mocoOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(plugin.endpoints?.projects.tasks.create).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.invoices.sendEmail).toEqual(expect.any(Function));
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: { account: ['subdomain'] } });
	});

	it('prefers the key from options', async () => {
		const plugin = moco({ key: 'opt-key' });
		await expect(keyBuilderOf(plugin)({}, 'endpoint')).resolves.toBe('opt-key');
	});

	it('reads the stored key', async () => {
		const plugin = moco();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: async () => 'stored' } },
				'endpoint',
			),
		).resolves.toBe('stored');
	});

	it('asks for a connection when no key is stored', async () => {
		const plugin = moco();
		await expect(
			keyBuilderOf(plugin)(
				{ keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilderOf(plugin)(
				{
					keys: {
						get_api_key: async () => {
							throw new Error('No DEK found for account');
						},
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps a caller DEFAULT handler last', () => {
		const plugin = moco({
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 1 }),
				},
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
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
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(500))).toBe(false);
	});

	it('retries a 5xx only for reads', async () => {
		expect(errorHandlers.SERVER_ERROR.match(apiError(502))).toBe(true);
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'GET')),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(apiError(502, 'POST')),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
