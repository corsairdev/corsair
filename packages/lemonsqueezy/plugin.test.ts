import type { EndpointJob } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	LemonSqueezyEndpointInputSchemas,
	LemonSqueezyEndpointOutputSchemas,
} from './endpoints/types';
import { lemonSqueezyEndpointSchemas, lemonsqueezy } from './index';

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
	plugin: ReturnType<typeof lemonsqueezy>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'affiliates.get',
	'affiliates.list',
	'checkouts.create',
	'checkouts.get',
	'checkouts.list',
	'customers.create',
	'customers.get',
	'customers.list',
	'customers.update',
	'discountRedemptions.get',
	'discountRedemptions.list',
	'discounts.create',
	'discounts.delete',
	'discounts.get',
	'discounts.list',
	'files.get',
	'files.list',
	'licenseKeyInstances.get',
	'licenseKeyInstances.list',
	'licenseKeys.get',
	'licenseKeys.list',
	'licenseKeys.update',
	'orderItems.get',
	'orderItems.list',
	'orders.generateInvoice',
	'orders.get',
	'orders.list',
	'orders.refund',
	'prices.get',
	'prices.list',
	'products.get',
	'products.list',
	'stores.get',
	'stores.list',
	'subscriptionInvoices.generate',
	'subscriptionInvoices.get',
	'subscriptionInvoices.list',
	'subscriptionInvoices.refund',
	'subscriptionItems.get',
	'subscriptionItems.list',
	'subscriptionItems.update',
	'subscriptionItems.usage',
	'subscriptions.cancel',
	'subscriptions.get',
	'subscriptions.list',
	'subscriptions.update',
	'usageRecords.create',
	'usageRecords.get',
	'usageRecords.list',
	'users.get',
	'variants.get',
	'variants.list',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.update',
];

describe('lemonsqueezy plugin definition', () => {
	const plugin = lemonsqueezy();

	it('registers with api_key auth and no plugin-level webhooks', () => {
		expect(plugin.id).toBe('lemonsqueezy');
		expect(plugin.options?.authType).toBe('api_key');
		// A webhook is registered per store through webhooks.create, and its
		// secret is that webhook's, not a plugin-wide one.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes all 57 catalog operations', () => {
		expect(operations).toHaveLength(57);
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks the irreversible actions destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible === true)
			.map(([name]) => name)
			.sort();
		// A refund cannot be undone, a deleted discount or webhook is gone, and
		// a cancelled subscription does not come back through the API.
		expect(irreversible).toEqual([
			'discounts.delete',
			'orders.refund',
			'subscriptionInvoices.refund',
			'webhooks.delete',
		]);
	});

	it('keeps every money-moving and record-changing call out of read', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel !== 'read')
			.map(([name]) => name)
			.sort();
		expect(writes).toEqual([
			'checkouts.create',
			'customers.create',
			'customers.update',
			'discounts.create',
			'discounts.delete',
			'licenseKeys.update',
			'orders.generateInvoice',
			'orders.refund',
			'subscriptionInvoices.generate',
			'subscriptionInvoices.refund',
			'subscriptionItems.update',
			'subscriptions.cancel',
			'subscriptions.update',
			'usageRecords.create',
			'webhooks.create',
			'webhooks.delete',
			'webhooks.update',
		]);
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(lemonSqueezyEndpointSchemas).sort()).toEqual(operations);
		for (const pair of Object.values(lemonSqueezyEndpointSchemas)) {
			expect(pair.input).toBeDefined();
			expect(pair.output).toBeDefined();
		}
	});

	it('has no long-running jobs to follow', () => {
		// Nothing here starts an async job: refunds and invoice generation
		// answer when they finish, so no operation declares an EndpointJob.
		const meta = plugin.endpointMeta as Record<
			string,
			{ job?: EndpointJob } | undefined
		>;
		expect(
			Object.entries(meta).filter(([, entry]) => entry?.job !== undefined),
		).toEqual([]);
	});
});

describe('lemonsqueezy key builder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = lemonsqueezy({ key: 'inline-key' });
		const ctx = keyContext('stored-key');
		expect(await buildKey(plugin, ctx)).toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		expect(await buildKey(lemonsqueezy(), keyContext('stored-key'))).toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(
			buildKey(lemonsqueezy(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('every operation validates its own input', () => {
	it('rejects an empty object where an id is required', () => {
		const needsId: [keyof typeof LemonSqueezyEndpointInputSchemas, string][] = [
			['storesGet', 'storeId'],
			['productsGet', 'productId'],
			['variantsGet', 'variantId'],
			['pricesGet', 'priceId'],
			['filesGet', 'fileId'],
			['ordersGet', 'orderId'],
			['orderItemsGet', 'orderItemId'],
			['subscriptionsGet', 'subscriptionId'],
			['subscriptionItemsGet', 'subscriptionItemId'],
			['subscriptionInvoicesGet', 'subscriptionInvoiceId'],
			['usageRecordsGet', 'usageRecordId'],
			['customersGet', 'customerId'],
			['discountsGet', 'discountId'],
			['discountRedemptionsGet', 'discountRedemptionId'],
			['licenseKeysGet', 'licenseKeyId'],
			['licenseKeyInstancesGet', 'licenseKeyInstanceId'],
			['checkoutsGet', 'checkoutId'],
			['webhooksGet', 'webhookId'],
			['affiliatesGet', 'affiliateId'],
		];
		for (const [schema, field] of needsId) {
			expect({
				schema,
				rejectsEmpty: LemonSqueezyEndpointInputSchemas[schema].safeParse({})
					.success,
			}).toEqual({ schema, rejectsEmpty: false });
			expect(
				LemonSqueezyEndpointInputSchemas[schema].safeParse({ [field]: '1' })
					.success,
			).toBe(true);
		}
	});

	it('rejects an id that is an empty string', () => {
		expect(
			LemonSqueezyEndpointInputSchemas.storesGet.safeParse({ storeId: '' })
				.success,
		).toBe(false);
	});
});

describe('output schemas are registered', () => {
	it('keeps every output schema a zod object', () => {
		for (const [name, schema] of Object.entries(
			LemonSqueezyEndpointOutputSchemas,
		)) {
			expect({ name, hasParse: typeof schema.parse === 'function' }).toEqual({
				name,
				hasParse: true,
			});
		}
	});
});
