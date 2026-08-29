import { cloudcart } from './index';
import { CloudcartSchema } from './schema';

describe('Cloudcart schema and plugin', () => {
	it('declares a semver version', () => {
		expect(CloudcartSchema.version).toBeDefined();
		expect(CloudcartSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(typeof CloudcartSchema.entities).toBe('object');
		expect(CloudcartSchema.entities).not.toBeNull();
		expect(CloudcartSchema.entities).toEqual({});
	});

	it('instantiates plugin correctly with key and options', () => {
		const plugin = cloudcart({
			key: 'test_api_key',
			webhookSecret: 'test_sec',
		});
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
		expect(typeof plugin.endpoints?.discounts.listDiscountCodes).toBe(
			'function',
		);
		expect(typeof plugin.endpoints?.subscribers.listSubscribers).toBe(
			'function',
		);
		expect(typeof plugin.endpoints?.blogs.listBlogPosts).toBe('function');
		expect(typeof plugin.endpoints?.misc.listVendors).toBe('function');
		expect(typeof plugin.endpoints?.webhooks.listWebhooks).toBe('function');
	});
});
