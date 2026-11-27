import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { maritimeOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { maritime } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof maritime>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

function apiError(status: number, method = 'GET'): ApiError {
	return new ApiError(
		{ method: method as 'GET', url: '/api/agents/{agent_id}' },
		{
			url: 'https://api.maritime.sh/api/agents/{agent_id}',
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`Maritime ${status}`,
	);
}

describe('maritime plugin', () => {
	it('registers every operation and webhook with meta and schemas', () => {
		const plugin = maritime();
		expect(plugin.id).toBe('maritime');
		const ids = maritimeOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(ids).toHaveLength(332);
		expect(plugin.endpoints?.sandboxes.commands.run).toEqual(
			expect.any(Function),
		);
		expect(Object.keys(plugin.webhookSchemas ?? {})).toHaveLength(21);
		expect(plugin.webhooks?.sandbox.ended.match).toEqual(expect.any(Function));
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('uses the key option, else the stored key, else asks to connect', async () => {
		expect(await keyBuilderOf(maritime({ key: 'mk_1' }))({}, 'endpoint')).toBe(
			'mk_1',
		);
		const stored = { keys: { get_api_key: async () => 'mk_stored' } };
		expect(await keyBuilderOf(maritime())(stored, 'endpoint')).toBe(
			'mk_stored',
		);
		await expect(
			keyBuilderOf(maritime())(
				{ keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		// An account without a DEK passes its key in options; the lookup error is not fatal.
		await expect(
			keyBuilderOf(maritime())(
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

	it('gives webhooks the webhook secret, never the API key', async () => {
		expect(
			await keyBuilderOf(maritime({ key: 'mk_1', webhookSecret: 'whsec' }))(
				{},
				'webhook',
			),
		).toBe('whsec');
		expect(
			await keyBuilderOf(maritime({ key: 'mk_1' }))(
				{ keys: { get_webhook_signature: async () => 'stored' } },
				'webhook',
			),
		).toBe('stored');
	});

	it('keeps DEFAULT last when a caller adds handlers', () => {
		const plugin = maritime({
			errorHandlers: {
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('CUSTOM');
	});
});

describe('error handlers', () => {
	const matching = (error: Error) =>
		Object.entries(errorHandlers).find(([, h]) => h.match(error))?.[0];

	it('matches by status', () => {
		expect(matching(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(matching(apiError(401))).toBe('AUTH_ERROR');
		expect(matching(apiError(403))).toBe('AUTH_ERROR');
		expect(matching(apiError(404))).toBe('NOT_FOUND_ERROR');
		expect(matching(apiError(402))).toBe('BAD_REQUEST_ERROR');
		expect(matching(apiError(409))).toBe('BAD_REQUEST_ERROR');
		expect(matching(apiError(422))).toBe('BAD_REQUEST_ERROR');
		expect(matching(apiError(503))).toBe('SERVER_ERROR');
	});

	it("never retries a 429 again after core's own retries", async () => {
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx for reads only', async () => {
		expect(await errorHandlers.SERVER_ERROR.handler(apiError(503))).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
		expect(
			await errorHandlers.SERVER_ERROR.handler(apiError(503, 'POST')),
		).toEqual({ maxRetries: 0 });
	});
});
