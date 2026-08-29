import { CloudcartAPIError, makeCloudcartRequest } from './client';
import { CloudcartEndpointInputSchemas } from './endpoints/types';
import { verifyCloudcartWebhookSignature } from './webhooks/types';

describe('Cloudcart API Client & Endpoint Schemas', () => {
	it('validates product input schema', () => {
		const parsed = CloudcartEndpointInputSchemas.createProduct.parse({
			data: { name: 'Test Product', price: 100 },
		});
		expect(parsed).toBeDefined();
		expect(parsed.data).toEqual({ name: 'Test Product', price: 100 });
	});

	it('validates order listing input schema', () => {
		const parsed = CloudcartEndpointInputSchemas.listOrders.parse({
			'page[number]': 1,
			'page[size]': 20,
		});
		expect(parsed['page[number]']).toBe(1);
		expect(parsed['page[size]']).toBe(20);
	});

	it('validates customer input schema', () => {
		const parsed = CloudcartEndpointInputSchemas.getCustomer.parse({
			id: 'cust_123',
		});
		expect(parsed.id).toBe('cust_123');
	});

	it('throws CloudcartAPIError when API key is missing', async () => {
		await expect(makeCloudcartRequest('products', '')).rejects.toThrow(
			CloudcartAPIError,
		);
	});

	it('validates webhook API key header', () => {
		const secret = 'cc_test_key';
		const payload = { type: 'order.created', data: { id: 12345 } };

		const validResult = verifyCloudcartWebhookSignature(
			{
				headers: { 'x-cloudcart-apikey': secret },
				payload,
			} as never,
			secret,
		);
		expect(validResult.valid).toBe(true);

		const invalidResult = verifyCloudcartWebhookSignature(
			{
				headers: { 'x-cloudcart-apikey': 'wrong_key' },
				payload,
			} as never,
			secret,
		);
		expect(invalidResult.valid).toBe(false);
	});
});
