import { AuthMissingError } from 'corsair/core';
import { rocketReachEndpointSchemas, rocketreach } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof rocketreach>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'account.universal',
	'company.lookup',
	'company.search',
	'email.verify',
	'person.bulkLookup',
	'person.checkStatus',
	'person.lookup',
	'person.search',
];

describe('rocketreach plugin definition', () => {
	const plugin = rocketreach();

	it('registers as rocketreach with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('rocketreach');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
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

	it('marks the credit-spending routes as writes and the pure reads as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		// A lookup or verification spends a credit, so it is a write even
		// though its HTTP verb may be GET.
		expect(writes.sort()).toEqual([
			'company.lookup',
			'email.verify',
			'person.bulkLookup',
			'person.lookup',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(rocketReachEndpointSchemas['account.get'].input).toBeDefined();
		expect(Object.keys(rocketReachEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a lookup costs a credit to refresh', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('rocketreach key builder', () => {
	const plugin = rocketreach();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(rocketreach({ key: 'from-options' }), keyContext(null)),
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
