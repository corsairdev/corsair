import { AuthMissingError } from 'corsair/core';
import { u301, u301EndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof u301>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'analytics.audience',
	'analytics.clicks',
	'domains.active',
	'domains.create',
	'domains.delete',
	'domains.get',
	'domains.homeRedirect',
	'domains.list',
	'domains.notFoundRedirect',
	'domains.pathLength',
	'links.create',
	'links.delete',
	'links.get',
	'links.list',
];

describe('u301 plugin definition', () => {
	const plugin = u301();

	it('registers as u301 with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('u301');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the fourteen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation as keyof typeof schemas];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation as keyof typeof meta];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks the two deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual(['domains.delete', 'links.delete']);
	});

	it('marks link creation as a write, since it spends an allowance slot', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['links.create' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('exports the endpoint schema map for the host', () => {
		expect(u301EndpointSchemas['links.create'].input).toBeDefined();
		expect(Object.keys(u301EndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since click counts change with every visit', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('u301 key builder', () => {
	const plugin = u301();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(u301({ key: 'from-options' }), keyContext(null)),
		).resolves.toBe('from-options');
	});

	it('packs the separate apiKey and workspaceId options', async () => {
		// The clearer setup: two options rather than one packed string.
		await expect(
			buildKey(
				u301({ apiKey: 'key-1', workspaceId: 'ws-1' }),
				keyContext(null),
			),
		).resolves.toBe('key-1\nws-1');
	});

	it('does not build from a half-set pair, since a workspace alone cannot work', async () => {
		await expect(
			buildKey(u301({ apiKey: 'key-1' }), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('falls back to the stored api_key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
