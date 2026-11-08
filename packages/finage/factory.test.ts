import { AuthMissingError } from 'corsair/core';
import type { FinageKeyBuilderContext } from './index';
import { finage, finageEndpointMeta, finageEndpointSchemas } from './index';

// The key builder reads only authType and keys.get_api_key; the remaining
// key-manager methods belong to auth flows this API-key plugin never uses.
function keyContext(
	getKey: () => Promise<string | undefined>,
): FinageKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		keys: { get_api_key: getKey },
		tenantId: 'default',
	} as unknown as FinageKeyBuilderContext;
}

// CorsairPlugin stores the key builder as an optional function whose context is
// generic; narrow it to this plugin's own context before calling it in tests.
type FinageKeyBuilder = (
	ctx: FinageKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof finage>): FinageKeyBuilder {
	const keyBuilder = plugin.keyBuilder as FinageKeyBuilder | undefined;
	if (!keyBuilder) throw new Error('Finage plugin is missing its key builder');
	return keyBuilder;
}

describe('Finage plugin factory', () => {
	it('returns the complete plugin surface', () => {
		const plugin = finage({ key: 'test-key' });
		const endpoints = plugin.endpoints;
		if (!endpoints) throw new Error('Finage plugin is missing its endpoints');

		expect(plugin.id).toBe('finage');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options).toEqual({ key: 'test-key', authType: 'api_key' });
		expect(Object.keys(endpoints.market)).toHaveLength(70);
		expect(Object.keys(finageEndpointSchemas)).toHaveLength(70);
		expect(Object.keys(finageEndpointMeta)).toHaveLength(70);
	});

	it('keeps caller hooks and merges caller error handlers over the defaults', () => {
		const hooks = {};
		const defaultHandler = {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		};
		const plugin = finage({
			key: 'test-key',
			hooks,
			errorHandlers: { DEFAULT: defaultHandler },
		});
		const handlers = plugin.errorHandlers;
		if (!handlers) throw new Error('Finage plugin is missing error handlers');

		expect(plugin.hooks).toBe(hooks);
		expect(handlers.DEFAULT).toBe(defaultHandler);
		expect(handlers.RATE_LIMIT_ERROR).toBeDefined();
	});

	it('prefers the configured key for endpoint calls', async () => {
		const plugin = finage({ key: 'configured-key' });
		const getKey = jest.fn().mockResolvedValue('stored-key');

		await expect(
			keyBuilderOf(plugin)(keyContext(getKey), 'endpoint'),
		).resolves.toBe('configured-key');
		expect(getKey).not.toHaveBeenCalled();
	});

	it('falls back to the stored api_key for endpoint calls', async () => {
		const plugin = finage();
		const getKey = jest.fn().mockResolvedValue('stored-key');

		await expect(
			keyBuilderOf(plugin)(keyContext(getKey), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is configured or stored', async () => {
		const plugin = finage();
		const keyBuilder = keyBuilderOf(plugin);

		await expect(
			keyBuilder(
				keyContext(async () => undefined),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilder(
				keyContext(async () => ''),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
