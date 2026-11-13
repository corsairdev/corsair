import { AuthMissingError } from 'corsair/core';
import { ynab, ynabEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof ynab>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'accounts.create',
	'accounts.get',
	'accounts.list',
	'budgets.get',
	'budgets.list',
	'categories.get',
	'categories.list',
	'categories.update',
	'months.get',
	'months.list',
	'payees.create',
	'payees.get',
	'payees.list',
	'payees.update',
	'transactions.create',
	'transactions.delete',
	'transactions.get',
	'transactions.list',
	'transactions.scheduledCreate',
	'transactions.scheduledDelete',
	'transactions.scheduledGet',
	'transactions.scheduledList',
	'transactions.update',
	'user.get',
];

describe('ynab plugin definition', () => {
	const plugin = ynab();

	it('registers as ynab with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('ynab');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-four catalog operations', () => {
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

	it('marks the deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'transactions.delete',
			'transactions.scheduledDelete',
		]);
	});

	it('marks assigning to a category as a write, since it moves money', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['categories.update' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('notes that a category assignment replaces rather than adds', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(
			meta['categories.update' as keyof typeof meta]?.description,
		).toContain('replaces');
	});

	it('notes that balances are in milliunits', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['accounts.create' as keyof typeof meta]?.description).toContain(
			'milliunits',
		);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(ynabEndpointSchemas['budgets.list'].input).toBeDefined();
		expect(Object.keys(ynabEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a budget moves with every transaction', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('ynab key builder', () => {
	const plugin = ynab();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(ynab({ key: 'from-options' }), keyContext(null)),
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
