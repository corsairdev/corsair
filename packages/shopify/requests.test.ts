import { Shopify } from './endpoints';
import type { ShopifyEndpointInputs } from './endpoints/types';
import {
	collection,
	customer,
	inventoryItem,
	location,
	order,
	pageInfo,
	product,
	productPage,
	shop,
	webhookSubscription,
} from './test-fixtures';
import { createContext, createHarness } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const harness = createHarness();

beforeEach(() => {
	harness.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

/** The GraphQL body the mocked fetch received, split for assertions. */
function sentGraphql(): {
	query: string;
	// unknown: variables differ per operation; each assertion narrows the
	// fields it expects.
	variables: Record<string, unknown>;
} {
	const body = harness.lastRequest().body as {
		query: string;
		// unknown: see the return type above.
		variables?: Record<string, unknown>;
	};
	return { query: body.query, variables: body.variables ?? {} };
}

describe('products', () => {
	it('products.list sends paging, filter and sort with the documented defaults', async () => {
		const ctx = createContext();
		harness.respond({ data: productPage });

		const result = await Shopify.products.list(ctx, {
			query: 'status:active',
			sortKey: 'TITLE',
		});

		harness.expectAuthenticated();
		const { query, variables } = sentGraphql();
		expect(query).toContain('query ProductsList');
		expect(query).toContain('fragment ProductFields on Product');
		expect(variables).toEqual({
			first: 50,
			after: undefined,
			query: 'status:active',
			sortKey: 'TITLE',
			reverse: undefined,
		});
		expect(result.products.edges).toHaveLength(1);
		expect(result.products.edges[0]?.node.title).toBe('Hiking backpack');
	});

	it('products.list rejects a page size above the provider maximum', async () => {
		const ctx = createContext();

		await harness.expectRejection(Shopify.products.list(ctx, { first: 251 }));

		expect(harness.fetchMock).not.toHaveBeenCalled();
	});

	it('products.get asks for one product by GID', async () => {
		const ctx = createContext();
		harness.respond({ data: { product } });

		const result = await Shopify.products.get(ctx, {
			id: 'gid://shopify/Product/1',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('query ProductGet');
		expect(variables).toEqual({ id: 'gid://shopify/Product/1' });
		expect(result.product?.handle).toBe('hiking-backpack');
	});

	it('products.create sends only the fields it was given', async () => {
		const ctx = createContext();
		harness.respond({ data: { productCreate: { product, userErrors: [] } } });

		const result = await Shopify.products.create(ctx, {
			title: 'Hiking backpack',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('mutation ProductCreate');
		expect(variables).toEqual({ product: { title: 'Hiking backpack' } });
		expect(result.product.id).toBe('gid://shopify/Product/1');
	});

	// The failure that matters: a rejected mutation still answers HTTP 200.
	it('products.create throws when userErrors is not empty', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				productCreate: {
					product: null,
					userErrors: [{ field: ['title'], message: 'Title is invalid' }],
				},
			},
		});

		const error = await harness.expectRejection<Error>(
			Shopify.products.create(ctx, { title: 'x' }),
		);

		expect(error.message).toContain('Title is invalid');
	});

	it('products.update sends the id alongside the changed field', async () => {
		const ctx = createContext();
		harness.respond({ data: { productUpdate: { product, userErrors: [] } } });

		await Shopify.products.update(ctx, {
			id: 'gid://shopify/Product/1',
			title: 'Renamed',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('mutation ProductUpdate');
		expect(variables).toEqual({
			product: { id: 'gid://shopify/Product/1', title: 'Renamed' },
		});
	});

	it('products.delete is synchronous unless told otherwise', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				productDelete: {
					deletedProductId: 'gid://shopify/Product/1',
					userErrors: [],
				},
			},
		});

		const result = await Shopify.products.delete(ctx, {
			id: 'gid://shopify/Product/1',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('mutation ProductDelete');
		expect(variables).toEqual({
			id: 'gid://shopify/Product/1',
			synchronous: true,
		});
		expect(result.deletedProductId).toBe('gid://shopify/Product/1');
	});
});

describe('variants', () => {
	it('variants.list filters by the numeric product id', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				productVariants: {
					edges: [
						{
							node: {
								id: 'gid://shopify/ProductVariant/11',
								title: 'Default',
								sku: 'PACK-1',
								price: '99.00',
								compareAtPrice: null,
								inventoryQuantity: 12,
								inventoryItem: { id: 'gid://shopify/InventoryItem/3' },
							},
							cursor: 'v1',
						},
					],
					pageInfo,
				},
			},
		});

		await Shopify.variants.list(ctx, {
			productId: 'gid://shopify/Product/1',
		});

		const { variables } = sentGraphql();
		// The search syntax takes the bare id; a GID matches nothing.
		expect(variables.query).toBe('product_id:1');
	});

	it('variants.update sends only the fields that were passed', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				productVariantsBulkUpdate: {
					productVariants: [
						{ id: 'gid://shopify/ProductVariant/11', price: '79.00' },
					],
					userErrors: [],
				},
			},
		});

		await Shopify.variants.update(ctx, {
			productId: 'gid://shopify/Product/1',
			id: 'gid://shopify/ProductVariant/11',
			price: '79.00',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('mutation VariantsUpdate');
		expect(variables).toEqual({
			productId: 'gid://shopify/Product/1',
			variants: [{ id: 'gid://shopify/ProductVariant/11', price: '79.00' }],
		});
	});
});

describe('inventory', () => {
	it('inventory.list reads the available quantity at each location', async () => {
		const ctx = createContext();
		harness.respond({ data: { inventoryItem } });

		const result = await Shopify.inventory.list(ctx, {
			inventoryItemId: 'gid://shopify/InventoryItem/3',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('quantities(names: ["available"])');
		expect(variables).toEqual({ id: 'gid://shopify/InventoryItem/3' });
		expect(
			result.inventoryItem?.inventoryLevels.edges[0]?.node.quantities[0]
				?.quantity,
		).toBe(4);
	});

	it('inventory.adjust sends a signed delta with its reason', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				inventoryAdjustQuantities: {
					inventoryAdjustmentGroup: {
						createdAt: '2026-01-01T00:00:00Z',
						reason: 'correction',
						changes: [{ name: 'available', delta: -4 }],
					},
					userErrors: [],
				},
			},
		});

		await Shopify.inventory.adjust(ctx, {
			inventoryItemId: 'gid://shopify/InventoryItem/3',
			locationId: 'gid://shopify/Location/9',
			delta: -4,
			reason: 'correction',
		});

		const { query, variables } = sentGraphql();
		expect(query).toContain('mutation InventoryAdjust');
		expect(variables).toEqual({
			input: {
				reason: 'correction',
				name: 'available',
				changes: [
					{
						inventoryItemId: 'gid://shopify/InventoryItem/3',
						locationId: 'gid://shopify/Location/9',
						delta: -4,
					},
				],
			},
		});
	});
});

describe('collections', () => {
	it('collections.list pages with a default size', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				collections: {
					edges: [{ node: collection, cursor: 'c1' }],
					pageInfo,
				},
			},
		});

		const result = await Shopify.collections.list(ctx, {});

		expect(sentGraphql().variables).toEqual({
			first: 50,
			after: undefined,
			query: undefined,
		});
		expect(result.collections.edges[0]?.node.title).toBe('Outdoor');
	});

	it('collections.get asks for one collection', async () => {
		const ctx = createContext();
		harness.respond({ data: { collection } });

		await Shopify.collections.get(ctx, { id: 'gid://shopify/Collection/5' });

		expect(sentGraphql().variables).toEqual({
			id: 'gid://shopify/Collection/5',
		});
	});

	it('collections.create sends the collection input', async () => {
		const ctx = createContext();
		harness.respond({
			data: { collectionCreate: { collection, userErrors: [] } },
		});

		await Shopify.collections.create(ctx, { title: 'Outdoor' });

		expect(sentGraphql().variables).toEqual({
			collection: { title: 'Outdoor' },
		});
	});

	it('collections.addProducts sends the collection and product ids', async () => {
		const ctx = createContext();
		harness.respond({
			data: { collectionAddProducts: { collection, userErrors: [] } },
		});

		await Shopify.collections.addProducts(ctx, {
			id: 'gid://shopify/Collection/5',
			productIds: ['gid://shopify/Product/1'],
		});

		expect(sentGraphql().variables).toEqual({
			id: 'gid://shopify/Collection/5',
			productIds: ['gid://shopify/Product/1'],
		});
	});
});

describe('orders', () => {
	it('orders.list pages with filter and sort', async () => {
		const ctx = createContext();
		harness.respond({
			data: { orders: { edges: [{ node: order, cursor: 'o1' }], pageInfo } },
		});

		const result = await Shopify.orders.list(ctx, {
			query: 'financial_status:paid',
			sortKey: 'CREATED_AT',
		});

		expect(sentGraphql().variables).toEqual({
			first: 50,
			after: undefined,
			query: 'financial_status:paid',
			sortKey: 'CREATED_AT',
			reverse: undefined,
		});
		expect(result.orders.edges[0]?.node.totalPriceSet.shopMoney.amount).toBe(
			'10.00',
		);
	});

	it('orders.get asks for one order', async () => {
		const ctx = createContext();
		harness.respond({ data: { order } });

		await Shopify.orders.get(ctx, { id: 'gid://shopify/Order/1001' });

		expect(sentGraphql().variables).toEqual({ id: 'gid://shopify/Order/1001' });
	});

	// Cancelling must not refund by default: the deprecated flag did, and a
	// caller who only asked to cancel would move money.
	it('orders.cancel does not refund unless asked', async () => {
		const ctx = createContext();
		harness.respond({ data: { orderCancel: { order, userErrors: [] } } });

		await Shopify.orders.cancel(ctx, { id: 'gid://shopify/Order/1001' });

		const { query, variables } = sentGraphql();
		expect(query).toContain('refundMethod');
		expect(query).not.toContain('$refund:');
		expect(variables).toMatchObject({
			orderId: 'gid://shopify/Order/1001',
			reason: 'CUSTOMER',
			restock: false,
			notifyCustomer: false,
			refundOriginalPayment: false,
		});
	});

	it('orders.markAsPaid sends the order id in an input object', async () => {
		const ctx = createContext();
		harness.respond({ data: { orderMarkAsPaid: { order, userErrors: [] } } });

		await Shopify.orders.markAsPaid(ctx, { id: 'gid://shopify/Order/1001' });

		expect(sentGraphql().variables).toEqual({
			input: { id: 'gid://shopify/Order/1001' },
		});
	});

	it('orders.close sends the order id in an input object', async () => {
		const ctx = createContext();
		harness.respond({ data: { orderClose: { order, userErrors: [] } } });

		await Shopify.orders.close(ctx, { id: 'gid://shopify/Order/1001' });

		expect(sentGraphql().variables).toEqual({
			input: { id: 'gid://shopify/Order/1001' },
		});
	});
});

describe('customers', () => {
	it('customers.list reads the address from defaultEmailAddress', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				customers: { edges: [{ node: customer, cursor: 'c1' }], pageInfo },
			},
		});

		const result = await Shopify.customers.list(ctx, {});

		// Customer has no `email` field in 2026-10, so asking for one would fail
		// the whole query.
		const { query } = sentGraphql();
		expect(query).not.toMatch(/\n\s+email\s*\n/);
		expect(query).toContain('defaultEmailAddress');
		expect(
			result.customers.edges[0]?.node.defaultEmailAddress?.emailAddress,
		).toBe('jenny@example.com');
	});

	it('customers.get asks for one customer', async () => {
		const ctx = createContext();
		harness.respond({ data: { customer } });

		await Shopify.customers.get(ctx, { id: 'gid://shopify/Customer/7' });

		expect(sentGraphql().variables).toEqual({ id: 'gid://shopify/Customer/7' });
	});

	it('customers.create sends the customer input', async () => {
		const ctx = createContext();
		harness.respond({ data: { customerCreate: { customer, userErrors: [] } } });

		await Shopify.customers.create(ctx, { email: 'jenny@example.com' });

		expect(sentGraphql().variables).toEqual({
			input: { email: 'jenny@example.com' },
		});
	});

	it('customers.update sends the id inside the input object', async () => {
		const ctx = createContext();
		harness.respond({ data: { customerUpdate: { customer, userErrors: [] } } });

		await Shopify.customers.update(ctx, {
			id: 'gid://shopify/Customer/7',
			firstName: 'Jenny',
		});

		expect(sentGraphql().variables).toEqual({
			input: { id: 'gid://shopify/Customer/7', firstName: 'Jenny' },
		});
	});

	it('customers.create rejects an address that is not an email', async () => {
		const ctx = createContext();

		await harness.expectRejection(
			Shopify.customers.create(ctx, { email: 'not-an-email' }),
		);

		expect(harness.fetchMock).not.toHaveBeenCalled();
	});
});

describe('shop', () => {
	it('shop.get sends no variables', async () => {
		const ctx = createContext();
		harness.respond({ data: { shop } });

		const result = await Shopify.shop.get(ctx, {});

		expect(sentGraphql().query).toContain('query ShopGet');
		expect(sentGraphql().variables).toEqual({});
		expect(result.shop.myshopifyDomain).toBe('corsair-test.myshopify.com');
	});

	it('shop.listLocations reads the shop locations', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				locations: { edges: [{ node: location, cursor: 'l1' }], pageInfo },
			},
		});

		const result = await Shopify.shop.listLocations(ctx, {});

		expect(sentGraphql().variables).toEqual({ first: 50 });
		expect(result.locations.edges[0]?.node.name).toBe('Warehouse');
	});
});

describe('webhookSubscriptions', () => {
	it('webhookSubscriptions.list filters by topic after the page arrives', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				webhookSubscriptions: {
					edges: [
						{ node: webhookSubscription, cursor: 'w1' },
						{
							node: {
								...webhookSubscription,
								id: 'gid://shopify/WebhookSubscription/3',
								topic: 'PRODUCTS_UPDATE',
							},
							cursor: 'w2',
						},
					],
					pageInfo,
				},
			},
		});

		const result = await Shopify.webhookSubscriptions.list(ctx, {
			topic: 'ORDERS_CREATE',
		});

		// One request, filtered locally: a bad topic reads as an empty page
		// instead of failing the query.
		expect(result.webhookSubscriptions.edges).toHaveLength(1);
		expect(result.webhookSubscriptions.edges[0]?.node.topic).toBe(
			'ORDERS_CREATE',
		);
	});

	it('webhookSubscriptions.create registers a JSON subscription', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				webhookSubscriptionCreate: {
					webhookSubscription,
					userErrors: [],
				},
			},
		});

		await Shopify.webhookSubscriptions.create(ctx, {
			topic: 'ORDERS_CREATE',
			uri: 'https://example.com/webhook',
		});

		expect(sentGraphql().variables).toEqual({
			topic: 'ORDERS_CREATE',
			webhookSubscription: {
				uri: 'https://example.com/webhook',
				format: 'JSON',
			},
		});
	});

	it('webhookSubscriptions.create rejects a non-URL endpoint', async () => {
		const ctx = createContext();

		await harness.expectRejection(
			Shopify.webhookSubscriptions.create(ctx, {
				topic: 'ORDERS_CREATE',
				uri: 'not a url',
			}),
		);

		expect(harness.fetchMock).not.toHaveBeenCalled();
	});

	it('webhookSubscriptions.delete names the subscription id', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				webhookSubscriptionDelete: {
					deletedWebhookSubscriptionId: 'gid://shopify/WebhookSubscription/2',
					userErrors: [],
				},
			},
		});

		const result = await Shopify.webhookSubscriptions.delete(ctx, {
			id: 'gid://shopify/WebhookSubscription/2',
		});

		expect(sentGraphql().variables).toEqual({
			id: 'gid://shopify/WebhookSubscription/2',
		});
		expect(result.deletedWebhookSubscriptionId).toBe(
			'gid://shopify/WebhookSubscription/2',
		);
	});
});

describe('credentials', () => {
	it('uses the shop domain from the account when no option overrides it', async () => {
		const ctx = createContext({ shopDomain: undefined });
		harness.respond({ data: { shop } });

		await Shopify.shop.get(ctx, {});

		// Falls back to keys.get_shop_domain, the accessor generated from
		// authConfig.api_key.account.
		expect(harness.lastRequest().origin).toBe(
			'https://corsair-test.myshopify.com',
		);
	});

	it('fails with a typed error when no shop domain is stored', async () => {
		const ctx = createContext(
			{ shopDomain: undefined },
			{ get_shop_domain: async () => null },
		);

		const error = await harness.expectRejection<Error>(
			Shopify.shop.get(ctx, {} as ShopifyEndpointInputs['shopGet']),
		);

		expect(error.name).toBe('AuthMissingError');
		expect(harness.fetchMock).not.toHaveBeenCalled();
	});
});
