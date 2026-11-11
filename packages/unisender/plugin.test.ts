import { AuthMissingError } from 'corsair/core';
import { unisender, unisenderEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof unisender>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'campaigns.create',
	'campaigns.list',
	'contacts.count',
	'contacts.exclude',
	'contacts.export',
	'contacts.get',
	'contacts.import',
	'contacts.subscribe',
	'contacts.unsubscribe',
	'fields.create',
	'fields.delete',
	'fields.list',
	'lists.create',
	'lists.delete',
	'lists.list',
	'messages.createEmail',
	'messages.sendEmail',
	'messages.status',
	'tags.list',
];

describe('unisender plugin definition', () => {
	const plugin = unisender();

	it('registers as unisender with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('unisender');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the nineteen catalog operations', () => {
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

		expect(destructive.sort()).toEqual(['fields.delete', 'lists.delete']);
	});

	it('marks the sends as writes, since each reaches recipients', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of [
			'messages.sendEmail',
			'campaigns.create',
			'contacts.import',
		]) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks the lookups as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'campaigns.list',
			'contacts.count',
			'contacts.get',
			'fields.list',
			'lists.list',
			'messages.status',
			'tags.list',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(unisenderEndpointSchemas['lists.list'].input).toBeDefined();
		expect(Object.keys(unisenderEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a contact status changes on confirmation', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('unisender key builder', () => {
	const plugin = unisender();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(unisender({ key: 'from-options' }), keyContext(null)),
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
