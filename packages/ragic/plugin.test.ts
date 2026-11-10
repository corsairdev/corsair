import { AuthMissingError } from 'corsair/core';
import { ragic, ragicEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof ragic>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'records.comment',
	'records.create',
	'records.delete',
	'records.get',
	'records.list',
	'records.lock',
	'records.unlock',
	'records.update',
	'schema.get',
];

describe('ragic plugin definition', () => {
	const plugin = ragic();

	it('registers as ragic with api_key auth, no webhooks and the www server', () => {
		expect(plugin.id).toBe('ragic');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.options?.server).toBe('www.ragic.com');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('accepts another shard', () => {
		expect(ragic({ server: 'eu2.ragic.com' }).options?.server).toBe(
			'eu2.ragic.com',
		);
	});

	it('exposes exactly the nine catalog operations', () => {
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

	it('marks record deletion as the only destructive operation', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive).toEqual(['records.delete']);
	});

	it('marks the five that change a record as writes', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'write',
		);

		expect(writes.sort()).toEqual([
			'records.comment',
			'records.create',
			'records.lock',
			'records.unlock',
			'records.update',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(ragicEndpointSchemas['records.list'].input).toBeDefined();
		expect(Object.keys(ragicEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a form’s fields differ per account', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('ragic key builder', () => {
	const plugin = ragic();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(ragic({ key: 'from-options' }), keyContext(null)),
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
