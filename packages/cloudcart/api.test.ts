import { createHmac } from 'node:crypto';
import {
	CloudcartAPIError,
	makeCloudcartRequest,
	packCloudcartKey,
} from './client';
import { CloudcartEndpointInputSchemas } from './endpoints/types';
import { verifyCloudcartWebhookSignature } from './webhooks/types';

// ─── Live API gate ─────────────────────────────────────────────────────────────
// Set both CLOUDCART_API_KEY and CLOUDCART_STORE_URL to run the live suite.
// Without them the block is skipped so CI stays green without credentials.
const LIVE_API_KEY = process.env.CLOUDCART_API_KEY ?? '';
const LIVE_STORE_URL = process.env.CLOUDCART_STORE_URL ?? '';
const LIVE_PACKED_KEY =
	LIVE_API_KEY && LIVE_STORE_URL
		? packCloudcartKey(LIVE_API_KEY, LIVE_STORE_URL)
		: '';
const describeLive = LIVE_PACKED_KEY ? describe : describe.skip;

describe('Cloudcart API Client & Endpoint Schemas', () => {
	it('validates product input schema — accepts well-formed input', () => {
		const parsed = CloudcartEndpointInputSchemas.createProduct.parse({
			data: { name: 'Test Product', price: 100 },
		});
		expect(parsed).toBeDefined();
		expect((parsed.data as Record<string, unknown>)?.name).toBe('Test Product');
	});

	it('validates product input schema — accepts bare input (schema is passthrough)', () => {
		// BaseEntityInputSchema is deliberately permissive: the plugin sends
		// whatever the caller provides as the JSON:API body. Validate that
		// empty input still parses (no required fields enforced at the plugin layer).
		const parsed = CloudcartEndpointInputSchemas.createProduct.parse({});
		expect(parsed).toBeDefined();
	});

	it('validates order listing input schema', () => {
		const parsed = CloudcartEndpointInputSchemas.listOrders.parse({
			'page[number]': 1,
			'page[size]': 20,
		});
		expect(parsed['page[number]']).toBe(1);
		expect(parsed['page[size]']).toBe(20);
	});

	it('rejects page[size] above 250', () => {
		expect(() =>
			CloudcartEndpointInputSchemas.listOrders.parse({ 'page[size]': 999 }),
		).toThrow();
	});

	it('validates customer input schema', () => {
		const parsed = CloudcartEndpointInputSchemas.getCustomer.parse({
			id: 'cust_123',
		});
		expect(parsed.id).toBe('cust_123');
	});

	it('getOrder requires an id', () => {
		expect(() => CloudcartEndpointInputSchemas.getOrder.parse({})).toThrow();
		const parsed = CloudcartEndpointInputSchemas.getOrder.parse({ id: 42 });
		expect(parsed.id).toBe(42);
	});

	it('throws CloudcartAPIError when API key is missing', async () => {
		await expect(makeCloudcartRequest('products', '')).rejects.toThrow(
			CloudcartAPIError,
		);
	});

	it('validates webhook hmac over the raw body', () => {
		const secret = 'cc_test_key';
		const payload = { type: 'order.created', data: { id: 12345 } };
		const rawBody = JSON.stringify(payload);
		const signature = createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');

		const validResult = verifyCloudcartWebhookSignature(
			{
				headers: { 'x-cloudcart-signature': signature },
				payload,
				rawBody,
			} as never,
			secret,
		);
		expect(validResult.valid).toBe(true);

		const invalidResult = verifyCloudcartWebhookSignature(
			{
				headers: { 'x-cloudcart-signature': 'aa'.repeat(32) },
				payload,
				rawBody,
			} as never,
			secret,
		);
		expect(invalidResult.valid).toBe(false);
	});
});

// ─── Live suite ────────────────────────────────────────────────────────────────
describeLive('CloudCart live API (read-only)', () => {
	it('lists products and returns a JSON:API data envelope', async () => {
		const res = await makeCloudcartRequest<{ data: unknown }>(
			'products',
			LIVE_PACKED_KEY,
			{ method: 'GET', query: { 'page[size]': 1 } },
		);
		expect(res).toHaveProperty('data');
	});

	it('lists orders and returns a JSON:API data envelope', async () => {
		const res = await makeCloudcartRequest<{ data: unknown }>(
			'orders',
			LIVE_PACKED_KEY,
			{ method: 'GET', query: { 'page[size]': 1 } },
		);
		expect(res).toHaveProperty('data');
	});

	it('lists categories and returns a JSON:API data envelope', async () => {
		const res = await makeCloudcartRequest<{ data: unknown }>(
			'categories',
			LIVE_PACKED_KEY,
			{ method: 'GET', query: { 'page[size]': 1 } },
		);
		expect(res).toHaveProperty('data');
	});

	it('lists customers and returns a JSON:API data envelope', async () => {
		const res = await makeCloudcartRequest<{ data: unknown }>(
			'customers',
			LIVE_PACKED_KEY,
			{ method: 'GET', query: { 'page[size]': 1 } },
		);
		expect(res).toHaveProperty('data');
	});

	it('rejects an invalid API key with an error', async () => {
		const badKey = packCloudcartKey('INVALID_KEY_000', LIVE_STORE_URL);
		await expect(
			makeCloudcartRequest('products', badKey, { method: 'GET' }),
		).rejects.toThrow();
	});
});
