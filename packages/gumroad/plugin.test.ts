import { AuthMissingError } from 'corsair/core';
import { gumroad, gumroadEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(fields: { authType: 'api_key'; apiKey?: string | null }) {
	return {
		authType: fields.authType,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null) },
	};
}

function buildKey(
	plugin: ReturnType<typeof gumroad>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'products.list',
	'products.get',
	'sales.list',
	'sales.get',
	'subscribers.list',
	'licenses.verify',
];

describe('gumroad plugin definition', () => {
	const plugin = gumroad();

	it('registers as gumroad with api_key auth by default and no webhooks', () => {
		expect(plugin.id).toBe('gumroad');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the full nested endpoint tree', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('marks the reads read-only, the license verify write, all described', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		for (const [operation, entry] of Object.entries(meta)) {
			expect(entry.riskLevel).toBe(
				operation === 'licenses.verify' ? 'write' : 'read',
			);
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(gumroadEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(gumroadEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = gumroad({
			errorHandlers: {
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
		expect(names).toContain('SERVER_ERROR');
	});
});

describe('gumroad key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(gumroad({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(gumroad(), ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: null });

		await expect(buildKey(gumroad(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(
			gumroad().keyBuilder?.(ctx as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
