import { AuthMissingError } from 'corsair/core';
import { vectorshift, vectorshiftEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof vectorshift>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'chatbots.create',
	'chatbots.run',
	'knowledgeBases.create',
	'knowledgeBases.get',
	'knowledgeBases.query',
	'pipelines.bulkRun',
	'pipelines.create',
	'pipelines.list',
	'pipelines.run',
	'transformations.create',
	'transformations.run',
];

describe('vectorshift plugin definition', () => {
	const plugin = vectorshift();

	it('registers as vectorshift with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('vectorshift');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eleven catalog operations', () => {
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

	it('marks the lookups and the knowledge base query as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		// A query retrieves and answers; it changes nothing in the account.
		expect(reads.sort()).toEqual([
			'knowledgeBases.get',
			'knowledgeBases.query',
			'pipelines.list',
		]);
	});

	it('marks runs and creates as writes, since they execute or make objects', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of [
			'pipelines.run',
			'pipelines.bulkRun',
			'pipelines.create',
			'chatbots.run',
			'transformations.run',
		]) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks nothing destructive, since the API has no delete routes', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive).toEqual([]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(vectorshiftEndpointSchemas['pipelines.run'].input).toBeDefined();
		expect(Object.keys(vectorshiftEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since runs are one-off and pipelines change', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('vectorshift key builder', () => {
	const plugin = vectorshift();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(vectorshift({ key: 'from-options' }), keyContext(null)),
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
