/**
 * Live smoke test against the Admin API. It runs only when both
 * SHOPIFY_ACCESS_TOKEN and SHOPIFY_SHOP_DOMAIN are set, and it is read-only:
 * the token used here needs `read_products`, `read_orders`, `read_customers`
 * and `read_inventory`.
 *
 * Every answer is parsed through its output schema before an assertion, which
 * is what catches a field typed against the docs but wrong in real responses.
 */
import { z } from 'zod';
import { Shopify } from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = z.string().min(1).safeParse(process.env.SHOPIFY_ACCESS_TOKEN);
const DOMAIN = z.string().min(1).safeParse(process.env.SHOPIFY_SHOP_DOMAIN);

if (!TOKEN.success || !DOMAIN.success) {
	// Named explicitly so a skipped run cannot read as a green one.
	const missing = [
		TOKEN.success ? null : 'SHOPIFY_ACCESS_TOKEN',
		DOMAIN.success ? null : 'SHOPIFY_SHOP_DOMAIN',
	].filter(Boolean);
	console.warn(`Shopify live tests skipped: ${missing.join(', ')} not set`);
}

const describeLive = TOKEN.success && DOMAIN.success ? describe : describe.skip;

// unknown: the endpoints read only these fields; the rest of the context is
// the runtime's responsibility and is not exercised here, so the cast is the
// only way to hand a live run the credentials without a full runtime.
const ctx = {
	key: TOKEN.success ? TOKEN.data : '',
	tenantId: 'default',
	options: {
		authType: 'api_key',
		shopDomain: DOMAIN.success ? DOMAIN.data : '',
	},
	keys: {
		get_api_key: async () => (TOKEN.success ? TOKEN.data : null),
		get_shop_domain: async () => (DOMAIN.success ? DOMAIN.data : null),
	},
	db: {},
	// unknown: see the note above; the object has only the members read here.
} as unknown as Parameters<typeof Shopify.shop.get>[0];

describeLive('Shopify live reads', () => {
	it('reads the shop through its output schema', async () => {
		const result = await Shopify.shop.get(ctx, {});

		expect(result.shop.name.length).toBeGreaterThan(0);
		expect(result.shop.myshopifyDomain).toContain('.myshopify.com');
		expect(result.shop.currencyCode).toMatch(/^[A-Z]{3}$/);
	});

	it('lists products and parses each variant price as a string', async () => {
		const result = await Shopify.products.list(ctx, { first: 5 });

		expect(Array.isArray(result.products.edges)).toBe(true);
		for (const edge of result.products.edges) {
			expect(typeof edge.node.id).toBe('string');
			expect(edge.node.id.startsWith('gid://shopify/Product/')).toBe(true);
			// Product itself has no price; it lives on the variant, as a string.
			for (const variant of edge.node.variants?.edges ?? []) {
				expect(
					variant.node.price === null || typeof variant.node.price === 'string',
				).toBe(true);
			}
		}
	});

	it('lists orders and parses totals from the money bag', async () => {
		const result = await Shopify.orders.list(ctx, { first: 5 });

		for (const edge of result.orders.edges) {
			expect(typeof edge.node.totalPriceSet.shopMoney.amount).toBe('string');
			expect(edge.node.totalPriceSet.shopMoney.currencyCode).toMatch(
				/^[A-Z]{3}$/,
			);
		}
	});

	// Whether PII comes back populated depends on the app's access, not on the
	// store's plan: a custom app granted the scopes returns names, an app
	// without them gets nulls. A live run cannot assume either, so this asserts
	// the field parses and nothing more. The denied case is covered by a
	// controlled response in client.test.ts.
	it('lists customers and parses a name whether or not PII is readable', async () => {
		const result = await Shopify.customers.list(ctx, { first: 5 });

		for (const edge of result.customers.edges) {
			// numberOfOrders is an UnsignedInt64, serialised as a string.
			expect(typeof edge.node.numberOfOrders).toBe('string');
			expect(
				edge.node.firstName === null ||
					edge.node.firstName === undefined ||
					typeof edge.node.firstName === 'string',
			).toBe(true);
			// The address lives under defaultEmailAddress; `email` is not a
			// field on Customer in 2026-10.
			const address = edge.node.defaultEmailAddress?.emailAddress;
			expect(address === undefined || typeof address === 'string').toBe(true);
		}
	});

	it('lists locations with a nested address, which inventory.adjust needs', async () => {
		const result = await Shopify.shop.listLocations(ctx, { first: 5 });

		for (const edge of result.locations.edges) {
			expect(typeof edge.node.id).toBe('string');
			expect(typeof edge.node.isActive).toBe('boolean');
			// Every location has an `address` object; a location with no street
			// address has null members, not a null address.
			const { address } = edge.node;
			expect(address).toBeDefined();
			expect(
				address.address1 === null ||
					address.address1 === undefined ||
					typeof address.address1 === 'string',
			).toBe(true);
		}
	});

	it('lists webhook subscriptions', async () => {
		const result = await Shopify.webhookSubscriptions.list(ctx, { first: 5 });

		for (const edge of result.webhookSubscriptions.edges) {
			expect(typeof edge.node.topic).toBe('string');
			expect(typeof edge.node.uri).toBe('string');
		}
	});
});
