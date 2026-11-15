import { AuthMissingError } from 'corsair/core';
import { taxjar, taxjarEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof taxjar>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'addresses.validate',
	'categories.list',
	'customers.create',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.update',
	'nexusRegions.list',
	'orders.create',
	'orders.delete',
	'orders.get',
	'orders.list',
	'orders.update',
	'rates.get',
	'refunds.create',
	'refunds.delete',
	'refunds.get',
	'refunds.list',
	'refunds.update',
	'summaryRates.list',
	'taxes.calculate',
];

const riskLevels = {
	'addresses.validate': 'read',
	'categories.list': 'read',
	'customers.create': 'write',
	'customers.delete': 'destructive',
	'customers.get': 'read',
	'customers.list': 'read',
	'customers.update': 'write',
	'nexusRegions.list': 'read',
	'orders.create': 'write',
	'orders.delete': 'destructive',
	'orders.get': 'read',
	'orders.list': 'read',
	'orders.update': 'write',
	'rates.get': 'read',
	'refunds.create': 'write',
	'refunds.delete': 'destructive',
	'refunds.get': 'read',
	'refunds.list': 'read',
	'refunds.update': 'write',
	'summaryRates.list': 'read',
	'taxes.calculate': 'read',
} as const;

describe('taxjar plugin definition', () => {
	const plugin = taxjar();

	it('registers as taxjar with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('taxjar');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 21 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(21);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskLevels);
	});

	it('marks every delete destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = operations.filter((name) => name.endsWith('.delete'));
		expect(deletes).toEqual([
			'customers.delete',
			'orders.delete',
			'refunds.delete',
		]);
		for (const name of deletes) {
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('treats tax calculation and address validation as reads', () => {
		// Both are POST routes that record nothing, so a read-only caller may
		// use them.
		const meta = plugin.endpointMeta ?? {};
		expect(meta['taxes.calculate']?.riskLevel).toBe('read');
		expect(meta['addresses.validate']?.riskLevel).toBe('read');
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(taxjarEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares entities: {} because the plugin stores nothing', () => {
		expect(plugin.schema).toBeDefined();
		expect(Array.isArray(plugin.schema?.entities)).toBe(false);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('builds error handlers with DEFAULT last', () => {
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});

describe('taxjar keyBuilder', () => {
	const plugin = taxjar();

	it('prefers the inline key over the stored one', async () => {
		const inline = taxjar({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(inline, ctx)).resolves.toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
