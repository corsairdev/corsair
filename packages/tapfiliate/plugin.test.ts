import { AuthMissingError } from 'corsair/core';
import { tapfiliate, tapfiliateEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof tapfiliate>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'affiliates.balances',
	'affiliates.create',
	'affiliates.customFields',
	'affiliates.delete',
	'affiliates.get',
	'affiliates.list',
	'affiliates.payments',
	'affiliates.programs',
	'balances.list',
	'clicks.create',
	'clicks.get',
	'clicks.list',
	'commissions.approve',
	'commissions.disapprove',
	'commissions.get',
	'commissions.list',
	'commissions.update',
	'conversions.create',
	'conversions.delete',
	'conversions.get',
	'conversions.list',
	'conversions.update',
	'customers.cancel',
	'customers.create',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.uncancel',
	'customers.update',
	'payments.cancel',
	'payments.create',
	'payments.get',
	'payments.list',
	'programs.addAffiliate',
	'programs.affiliates',
	'programs.approveAffiliate',
	'programs.disapproveAffiliate',
	'programs.get',
	'programs.getAffiliate',
	'programs.list',
	'programs.updateAffiliate',
];

describe('tapfiliate plugin definition', () => {
	const plugin = tapfiliate();

	it('registers as tapfiliate with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('tapfiliate');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 41 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(41);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks only the deletes destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();

		expect(destructive).toEqual([
			'affiliates.delete',
			'conversions.delete',
			'customers.delete',
		]);
		for (const name of destructive) {
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('treats a payment cancel as a reversible write, not a delete', () => {
		// The route is a DELETE but the effect is a cancellation, so it stays a
		// write and is not marked irreversible.
		const meta = plugin.endpointMeta ?? {};
		expect(meta['payments.cancel']?.riskLevel).toBe('write');
		expect(meta['payments.cancel']?.irreversible).toBeUndefined();
		expect(meta['customers.cancel']?.riskLevel).toBe('write');
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(tapfiliateEndpointSchemas).sort()).toEqual(operations);
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

describe('tapfiliate keyBuilder', () => {
	const plugin = tapfiliate();

	it('prefers the inline key over the stored one', async () => {
		const inline = tapfiliate({ key: 'inline-key' });
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
