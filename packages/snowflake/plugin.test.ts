import { AuthMissingError } from 'corsair/core';
import { snowflake, snowflakeEndpointSchemas } from './index';

const operations = ['statements.submit', 'statements.get', 'statements.cancel'];

function keyContext(apiKey: string | null) {
	return {
		// const assertion: keyBuilder narrows on the authType literal.
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: async () => apiKey },
	};
}

describe('snowflake plugin definition', () => {
	const plugin = snowflake();

	it('registers the snowflake id with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('snowflake');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('exposes the statement endpoint tree', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('sets a risk level and a description on every endpoint', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		expect(meta['statements.submit']?.riskLevel).toBe('destructive');
		expect(meta['statements.get']?.riskLevel).toBe('read');
		expect(meta['statements.cancel']?.riskLevel).toBe('write');
		for (const entry of Object.values(meta)) {
			if (!entry.description) throw new Error('missing description');
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(snowflakeEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(snowflakeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when the caller supplies DEFAULT first', () => {
		const custom = snowflake({
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 1 }),
				},
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
	});
});

function buildKey(
	plugin: ReturnType<typeof snowflake>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook',
) {
	// The fake context only has the fields keyBuilder reads.
	return plugin.keyBuilder?.(ctx as never, source);
}

describe('snowflake key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');
		await expect(
			buildKey(snowflake({ key: 'option-key' }), ctx, 'endpoint'),
		).resolves.toBe('option-key');
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext('stored-key');
		await expect(buildKey(snowflake(), ctx, 'endpoint')).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext(null);
		await expect(buildKey(snowflake(), ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext('stored-key');
		await expect(
			buildKey(snowflake({ key: 'option-key' }), ctx, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
