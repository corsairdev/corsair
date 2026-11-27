import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { daytonaOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { daytona } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof daytona>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

function apiError(status: number, method = 'GET'): ApiError {
	return new ApiError(
		{ method: method as 'GET', url: '/sandbox/{sandboxIdOrName}' },
		{
			url: 'https://app.daytona.io/api/sandbox/{sandboxIdOrName}',
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`Daytona ${status}`,
	);
}

describe('daytona plugin', () => {
	it('registers every operation and webhook with meta and schemas', () => {
		const plugin = daytona();
		expect(plugin.id).toBe('daytona');
		const ids = daytonaOperations.map((o) => o.id).sort();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(ids);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(ids);
		expect(ids).toHaveLength(215);
		expect(plugin.endpoints?.toolbox.process.executeCommand).toEqual(
			expect.any(Function),
		);
		expect(Object.keys(plugin.webhookSchemas ?? {})).toHaveLength(7);
		expect(plugin.webhooks?.sandbox.stateUpdated.match).toEqual(
			expect.any(Function),
		);
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('uses the key option, else the stored key, else asks to connect', async () => {
		expect(await keyBuilderOf(daytona({ key: 'ibk_1' }))({}, 'endpoint')).toBe(
			'ibk_1',
		);
		const stored = { keys: { get_api_key: async () => 'ibk_stored' } };
		expect(await keyBuilderOf(daytona())(stored, 'endpoint')).toBe(
			'ibk_stored',
		);
		await expect(
			keyBuilderOf(daytona())(
				{ keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		// An account without a DEK passes its key in options; the lookup error is not fatal.
		await expect(
			keyBuilderOf(daytona())(
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
			await keyBuilderOf(daytona({ key: 'ibk_1', webhookSecret: 'whsec' }))(
				{},
				'webhook',
			),
		).toBe('whsec');
		expect(
			await keyBuilderOf(daytona({ key: 'ibk_1' }))(
				{ keys: { get_webhook_signature: async () => 'stored' } },
				'webhook',
			),
		).toBe('stored');
	});

	it('keeps DEFAULT last when a caller adds handlers', () => {
		const plugin = daytona({
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
