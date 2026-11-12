import { AuthMissingError } from 'corsair/core';
import { remoteRetrievalEndpointSchemas, remoteretrieval } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof remoteretrieval>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'company.get',
	'orders.create',
	'orders.get',
	'orders.inprogress',
	'orders.list',
	'orders.new',
	'orders.pending',
	'prices',
	'validate',
];

describe('remoteretrieval plugin definition', () => {
	const plugin = remoteretrieval();

	it('registers as remoteretrieval with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('remoteretrieval');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the nine catalog operations', () => {
		// This tree mixes a flat root (validate, prices) with groups, so both shapes
		// are walked.
		const endpointNames = (
			tree: Record<string, unknown>,
			prefix = '',
		): string[] =>
			Object.entries(tree).flatMap(([key, value]) =>
				typeof value === 'function'
					? [prefix ? `${prefix}.${key}` : key]
					: endpointNames(
							value as Record<string, unknown>,
							prefix ? `${prefix}.${key}` : key,
						),
			);

		expect(endpointNames(plugin.endpoints ?? {}).sort()).toEqual(operations);
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

	it('marks only orders.create as a write, since every other route reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		expect(writes).toEqual(['orders.create']);
	});

	it('says plainly that orders.create books and bills a real shipment', () => {
		const create = plugin.endpointMeta?.['orders.create'];

		// A purchase is a write, like stripe charges.create, not destructive.
		expect(create?.riskLevel).toBe('write');
		expect(create?.description).toMatch(/real, paid shipment/);
		expect(create?.description).toMatch(/bills/);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(remoteRetrievalEndpointSchemas['orders.create'].input).toBeDefined();
		expect(Object.keys(remoteRetrievalEndpointSchemas).sort()).toEqual(
			operations,
		);
	});

	it('caches nothing, since a shipment status changes as carriers scan', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('remoteretrieval key builder', () => {
	const plugin = remoteretrieval();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(remoteretrieval({ key: 'from-options' }), keyContext(null)),
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
