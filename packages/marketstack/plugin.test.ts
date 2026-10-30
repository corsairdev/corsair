import { AuthMissingError } from 'corsair/core';
import { marketstack, marketstackAuthConfig } from './index';

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('marketstack plugin registration', () => {
	it('registers api_key with no webhook tenant leftover', () => {
		expect(marketstackAuthConfig).toEqual({ api_key: {} });
	});

	it('returns a direct key when provided', async () => {
		const keyed = marketstack({ key: 'direct-token' });
		const token = await keyBuilderOf(keyed)(
			{ authType: 'api_key' },
			'endpoint',
		);
		expect(token).toBe('direct-token');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = marketstack();
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the account has no DEK', async () => {
		const plugin = marketstack();
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => {
							throw new Error(
								'No DEK found for account (tenant: "default", integration: "marketstack")',
							);
						},
					},
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps DEFAULT last when custom handlers are merged', () => {
		const plugin = marketstack({
			errorHandlers: {
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});

	it('keeps DEFAULT last even when the caller supplies their own DEFAULT', () => {
		const plugin = marketstack({
			errorHandlers: {
				// Declared before CUSTOM on purpose: a naive `{ ...specificDefaults,
				// ...options.errorHandlers, DEFAULT: ... }` merge would leave DEFAULT
				// sitting at this earlier position, since reassigning an existing key
				// does not move it — so a resolver that takes the first matching key
				// would pick this DEFAULT before ever reaching CUSTOM.
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
				CUSTOM: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');

		// Mirrors corsair/core's handleCorsairError resolver: the first key whose
		// handler matches wins.
		const errorHandlers = plugin.errorHandlers ?? {};
		const context = {
			pluginId: 'marketstack',
			operation: 'eod.get',
			input: {},
			originalError: new Error('anything'),
		};
		const firstMatchName = Object.keys(errorHandlers).find((name) =>
			errorHandlers[name]?.match(new Error('anything'), context),
		);
		expect(firstMatchName).toBe('CUSTOM');
	});

	it('registers all ten read operations', () => {
		const plugin = marketstack();
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
		const total = Object.values(endpoints).reduce(
			(sum, group) => sum + Object.keys(group).length,
			0,
		);
		expect(total).toBe(10);
	});
});
