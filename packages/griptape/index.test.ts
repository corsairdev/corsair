import { AuthMissingError } from 'corsair/core';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import { griptape } from './index';

describe('griptape keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = griptape({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('from-options');
	});

	it('returns the stored api key when options.key is absent', async () => {
		const plugin = griptape();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'from-store' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('from-store');
	});

	it('throws AuthMissingError when the api key is missing', async () => {
		const plugin = griptape();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws AuthMissingError for non-endpoint sources', async () => {
		const plugin = griptape({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'webhook'),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('griptape registry completeness', () => {
	const plugin = griptape({ key: 'test-api-key' });

	function flattenEndpoints(): string[] {
		const names: string[] = [];
		const nested = plugin.endpoints as Record<string, Record<string, unknown>>;
		for (const [group, ops] of Object.entries(nested)) {
			for (const op of Object.keys(ops)) {
				names.push(`${group}.${op}`);
			}
		}
		return names;
	}

	it('defaults to api_key auth', () => {
		// options is typed as the incoming options; authType is resolved at
		// runtime by the factory default.
		const options = plugin.options as { authType?: string };
		expect(options.authType).toBe('api_key');
		expect(plugin.id).toBe('griptape');
		expect(plugin.authConfig).toHaveProperty('api_key');
	});

	it('exposes 144 wired endpoints', () => {
		expect(flattenEndpoints()).toHaveLength(144);
	});

	it('covers every endpoint with schemas and meta', () => {
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;

		for (const name of flattenEndpoints()) {
			expect(schemas[name]).toBeDefined();
			expect(meta[name]).toBeDefined();
		}
		expect(Object.keys(schemas)).toHaveLength(144);
	});

	it('keeps input schema keys aligned with endpoint keys', () => {
		expect(Object.keys(GriptapeEndpointInputSchemas)).toHaveLength(144);
	});
});
