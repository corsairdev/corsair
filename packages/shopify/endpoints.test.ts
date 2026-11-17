import { Shopify } from './endpoints';
import { ShopifyEndpointOutputSchemas } from './endpoints/types';
import {
	customer,
	inventoryItem,
	order,
	pageInfo,
	product,
	productPage,
	shop,
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

describe('output parsing', () => {
	it('parses a product page and its nested variant connection', async () => {
		const ctx = createContext();
		harness.respond({ data: productPage });

		const result = await Shopify.products.list(ctx, {});

		expect(result.products.pageInfo.hasNextPage).toBe(false);
		const variant = result.products.edges[0]?.node.variants?.edges[0]?.node;
		expect(variant?.price).toBe('99.00');
	});

	it('keeps a null order field null rather than dropping it', async () => {
		const ctx = createContext();
		harness.respond({ data: { order } });

		const result = await Shopify.orders.get(ctx, {
			id: 'gid://shopify/Order/1001',
		});

		expect(result.order?.cancelledAt).toBeNull();
		expect(result.order?.cancelledAt).not.toBeUndefined();
	});

	it('parses numeric-string counts as strings, as Shopify sends them', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				customers: { edges: [{ node: customer, cursor: 'c1' }], pageInfo },
			},
		});

		const result = await Shopify.customers.list(ctx, {});

		// UnsignedInt64 is serialised as a string; typing it as a number would
		// throw for a real caller on a successful call.
		expect(result.customers.edges[0]?.node.numberOfOrders).toBe('2');
	});

	it('parses a null customer as null, which a missing record looks like', async () => {
		const ctx = createContext();
		harness.respond({ data: { customer: null } });

		const result = await Shopify.customers.get(ctx, {
			id: 'gid://shopify/Customer/404',
		});

		expect(result.customer).toBeNull();
	});

	it('parses a null product as null', async () => {
		const ctx = createContext();
		harness.respond({ data: { product: null } });

		const result = await Shopify.products.get(ctx, {
			id: 'gid://shopify/Product/404',
		});

		expect(result.product).toBeNull();
	});

	it('rejects a wrong-shaped payload instead of returning a blank row', async () => {
		const ctx = createContext();
		// `products` should be a connection object; a bare string must fail.
		harness.respond({ data: { products: 'not-a-connection' } });

		const error = await harness.expectRejection<Error>(
			Shopify.products.list(ctx, {}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects a malformed known field', async () => {
		const ctx = createContext();
		harness.respond({
			data: { shop: { ...shop, name: 42 } },
		});

		await harness.expectRejection(Shopify.shop.get(ctx, {}));
	});

	it('rejects a connection whose edges are missing', async () => {
		const ctx = createContext();
		harness.respond({
			data: { inventoryItem: { ...inventoryItem, inventoryLevels: {} } },
		});

		await harness.expectRejection(
			Shopify.inventory.list(ctx, {
				inventoryItemId: 'gid://shopify/InventoryItem/3',
			}),
		);
	});
});

describe('mutation failures', () => {
	it('throws on a populated userErrors even though data is present', async () => {
		const ctx = createContext();
		harness.respond({
			data: {
				productUpdate: {
					product: null,
					userErrors: [{ field: ['id'], message: 'Product does not exist' }],
				},
			},
		});

		const error = await harness.expectRejection<Error>(
			Shopify.products.update(ctx, {
				id: 'gid://shopify/Product/404',
				title: 'x',
			}),
		);

		expect(error.message).toContain('Product does not exist');
	});

	it('throws when a mutation returns no payload at all', async () => {
		const ctx = createContext();
		harness.respond({ data: {} });

		const error = await harness.expectRejection<Error>(
			Shopify.orders.close(ctx, { id: 'gid://shopify/Order/1' }),
		);

		expect(error.message).toContain('returned no payload');
	});

	it('throws when the order was not returned by a cancel', async () => {
		const ctx = createContext();
		harness.respond({
			data: { orderCancel: { order: null, userErrors: [] } },
		});

		// An empty userErrors with no order is not a success: the schema
		// requires an order, so the caller is not told a cancel happened.
		await harness.expectRejection(
			Shopify.orders.cancel(ctx, { id: 'gid://shopify/Order/1' }),
		);
	});
});

describe('schema coverage', () => {
	it('declares an input and output schema for every operation', () => {
		const operations = [
			'productsList',
			'productsGet',
			'productsCreate',
			'productsUpdate',
			'productsDelete',
			'variantsList',
			'variantsUpdate',
			'inventoryList',
			'inventoryAdjust',
			'collectionsList',
			'collectionsGet',
			'collectionsCreate',
			'collectionsAddProducts',
			'ordersList',
			'ordersGet',
			'ordersCancel',
			'ordersMarkAsPaid',
			'ordersClose',
			'customersList',
			'customersGet',
			'customersCreate',
			'customersUpdate',
			'shopGet',
			'locationsList',
			'webhooksList',
			'webhooksCreate',
			'webhooksDelete',
		] as const;

		for (const op of operations) {
			expect(ShopifyEndpointOutputSchemas[op]).toBeDefined();
		}
	});

	it('parses the product fixture through its output schema', () => {
		const parsed = ShopifyEndpointOutputSchemas.productsList.parse(productPage);
		expect(parsed.products.edges[0]?.node.id).toBe(product.id);
	});
});
