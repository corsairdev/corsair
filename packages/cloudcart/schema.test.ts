import { CloudcartSchema } from './schema';
import { cloudcart } from './index';

describe('Cloudcart schema and plugin', () => {
	it('declares a semver version', () => {
		expect(CloudcartSchema.version).toBeDefined();
		expect(CloudcartSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with required entities', () => {
		expect(typeof CloudcartSchema.entities).toBe('object');
		expect(CloudcartSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(CloudcartSchema.entities);
		expect(entityKeys.length).toBeGreaterThan(0);
		expect(entityKeys).toContain('products');
		expect(entityKeys).toContain('orders');
		expect(entityKeys).toContain('customers');
		expect(entityKeys).toContain('categories');
		for (const entity of Object.values(CloudcartSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});


	it('instantiates plugin correctly with key and options', () => {
		const plugin = cloudcart({ key: 'test_api_key', webhookSecret: 'test_sec' });
		expect(plugin.id).toBe('cloudcart');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toBeDefined();
		expect(plugin.endpointSchemas).toBeDefined();
		expect(plugin.webhookSchemas).toBeDefined();
		expect(plugin.endpointMeta).toBeDefined();
	});

	it('verifies all endpoint groups exist in plugin', () => {
		const plugin = cloudcart({ key: 'test_api_key' });
		expect(typeof plugin.endpoints?.products.createProduct).toBe('function');
		expect(typeof plugin.endpoints?.products.listProducts).toBe('function');
		expect(typeof plugin.endpoints?.categories.listCategories).toBe('function');
		expect(typeof plugin.endpoints?.properties.listProperties).toBe('function');
		expect(typeof plugin.endpoints?.variants.listVariants).toBe('function');
		expect(typeof plugin.endpoints?.customers.listCustomers).toBe('function');
		expect(typeof plugin.endpoints?.orders.listOrders).toBe('function');
		expect(typeof plugin.endpoints?.cart.getCart).toBe('function');
		expect(typeof plugin.endpoints?.discounts.listDiscountCodes).toBe('function');
		expect(typeof plugin.endpoints?.subscribers.listSubscribers).toBe('function');
		expect(typeof plugin.endpoints?.blogs.listBlogPosts).toBe('function');
		expect(typeof plugin.endpoints?.misc.listVendors).toBe('function');
		expect(typeof plugin.endpoints?.webhooks.listWebhooks).toBe('function');
	});
});


