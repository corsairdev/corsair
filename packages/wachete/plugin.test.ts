import { AuthMissingError } from 'corsair/core';
import { wachete, wacheteEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof wachete>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'data.list',
	'folders.delete',
	'folders.list',
	'folders.move',
	'folders.upsert',
	'notifications.get',
	'notifications.list',
	'tasks.delete',
	'tasks.get',
	'tasks.pages',
	'tasks.search',
	'tasks.upsert',
];

describe('wachete plugin definition', () => {
	const plugin = wachete();

	it('registers as wachete with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('wachete');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twelve catalog operations', () => {
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

	it('marks the two unrecoverable deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		// Deleting a folder takes its subfolders and monitors with it.
		expect(destructive.sort()).toEqual(['folders.delete', 'tasks.delete']);
	});

	it('marks moving as a write rather than a delete', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['folders.move' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('marks every lookup as a read', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'data.list',
			'folders.list',
			'notifications.get',
			'notifications.list',
			'tasks.get',
			'tasks.pages',
			'tasks.search',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(wacheteEndpointSchemas['tasks.upsert'].input).toBeDefined();
		expect(Object.keys(wacheteEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a value changes with every check', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('wachete key builder', () => {
	const plugin = wachete();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(wachete({ key: 'from-options' }), keyContext(null)),
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
