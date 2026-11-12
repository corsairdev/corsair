import { AuthMissingError } from 'corsair/core';
import { remarkety, remarketyEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof remarkety>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.types',
	'campaigns.update',
	'contacts.create',
	'contacts.unsubscribe',
	'emailTemplates.get',
	'emailTemplates.update',
	'masterTemplates.list',
	'products.list',
	'rules.get',
	'rules.list',
	'segments.count',
	'segments.list',
	'stores.create',
	'stores.delete',
	'stores.get',
	'stores.status',
	'stores.update',
];

describe('remarkety plugin definition', () => {
	const plugin = remarkety();

	it('registers as remarkety with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('remarkety');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty catalog operations', () => {
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

	it('marks the three deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual(['campaigns.delete', 'stores.delete']);
	});

	it('flags both deletes as irreversible for the approval text', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of ['stores.delete', 'campaigns.delete']) {
			expect(meta[operation as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('marks stores.update as a write, since it carries the store sync key', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['stores.update' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('marks the read-only routes as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'campaigns.get',
			'campaigns.types',
			'emailTemplates.get',
			'masterTemplates.list',
			'products.list',
			'rules.get',
			'rules.list',
			'segments.count',
			'segments.list',
			'stores.get',
			'stores.status',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(remarketyEndpointSchemas['stores.get'].input).toBeDefined();
		expect(Object.keys(remarketyEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since campaign stats move with every send', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('remarkety key builder', () => {
	const plugin = remarkety();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(remarkety({ key: 'from-options' }), keyContext(null)),
		).resolves.toBe('from-options');
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
