import { logEventFromContext } from 'corsair/core';
import { makeCountdownApiRequest } from './client';
import { get as autocomplete } from './endpoints/autocomplete';
import { get as product } from './endpoints/product';
import { get as search } from './endpoints/search';
import { CountdownApiEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	makeCountdownApiRequest: jest.fn(),
}));

const mockRequest = makeCountdownApiRequest as jest.MockedFunction<
	typeof makeCountdownApiRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-countdownapi-key',
} as Parameters<typeof search>[0];

describe('CountdownApi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('search sends the correct request', async () => {
		await search(ctx, {
			query: 'iphone',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'search',
				query: 'iphone',
				ebay_domain: 'ebay.com',
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('product sends the correct request', async () => {
		await product(ctx, {
			epid: '123',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'product',
				url: undefined,
				epid: '123',
				gtin: undefined,
				ebay_domain: 'ebay.com',
				include_html: undefined,
				skip_gtin_cache: undefined,
				include_parts_compatibility: undefined,
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});

	it('autocomplete uses search_term', async () => {
		await autocomplete(ctx, {
			query: 'iph',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'autocomplete',
				search_term: 'iph',
				ebay_domain: 'ebay.com',
			},
		);

		expect(mockLogEvent).toHaveBeenCalled();
	});
});

describe('CountdownApi output schemas', () => {
	it('search schema validates a representative response', () => {
		const response = {
			request_metadata: { id: 'req-1', status: 'ok' },
			search_parameters: { type: 'search', ebay_domain: 'ebay.com' },
			search_information: { total_results: 500, page: 1 },
			search_results: [
				{
					position: 1,
					title: 'iPhone 15 Pro',
					link: 'https://www.ebay.com/itm/123',
					price: { raw: '$999.00', value: 999, currency: 'USD' },
					thumbnail: 'https://i.ebayimg.com/images/123.jpg',
					rating: 4.9,
					reviews_count: 42,
				},
			],
		};

		const result = CountdownApiEndpointOutputSchemas.search.safeParse(response);
		expect(result.success).toBe(true);
	});

	it('search schema preserves extra passthrough fields', () => {
		const response = {
			request_metadata: { id: 'req-2', status: 'ok', extra_field: true },
			search_results: [
				{
					title: 'Widget',
					link: 'https://ebay.com/itm/456',
					sponsored: true,
				},
			],
			pagination: { next_page: 2 },
		};

		const result = CountdownApiEndpointOutputSchemas.search.safeParse(response);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.search_results[0]).toHaveProperty('sponsored', true);
			expect(result.data).toHaveProperty('pagination');
		}
	});

	it('search schema rejects response missing search_results', () => {
		const response = {
			request_metadata: { id: 'req-3', status: 'ok' },
		};

		const result = CountdownApiEndpointOutputSchemas.search.safeParse(response);
		expect(result.success).toBe(false);
	});

	it('product schema validates a representative response', () => {
		const response = {
			request_metadata: { id: 'req-4', status: 'ok' },
			search_parameters: { type: 'product', ebay_domain: 'ebay.com' },
			product: {
				title: 'iPhone 15 Pro 256GB',
				link: 'https://www.ebay.com/itm/789',
				price: { raw: '$1,099.00', value: 1099, currency: 'USD' },
				images: [
					'https://i.ebayimg.com/images/a.jpg',
					'https://i.ebayimg.com/images/b.jpg',
				],
			},
		};

		const result =
			CountdownApiEndpointOutputSchemas.product.safeParse(response);
		expect(result.success).toBe(true);
	});

	it('product schema preserves extra passthrough fields', () => {
		const response = {
			request_metadata: { id: 'req-5', status: 'ok' },
			product: {
				title: 'Gadget',
				seller_info: { name: 'top_seller', feedback_score: 99.8 },
				item_specifics: [{ name: 'Brand', value: 'Apple' }],
			},
		};

		const result =
			CountdownApiEndpointOutputSchemas.product.safeParse(response);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.product).toHaveProperty('seller_info');
			expect(result.data.product).toHaveProperty('item_specifics');
		}
	});

	it('product schema rejects response missing product', () => {
		const response = {
			request_metadata: { id: 'req-6', status: 'ok' },
		};

		const result =
			CountdownApiEndpointOutputSchemas.product.safeParse(response);
		expect(result.success).toBe(false);
	});

	it('autocomplete schema validates a representative response', () => {
		const response = {
			request_metadata: { id: 'req-7', status: 'ok' },
			search_parameters: { type: 'autocomplete', ebay_domain: 'ebay.com' },
			autocomplete_results: ['iphone 15', 'iphone 14', 'iphone case'],
		};

		const result =
			CountdownApiEndpointOutputSchemas.autocomplete.safeParse(response);
		expect(result.success).toBe(true);
	});

	it('autocomplete schema preserves extra passthrough fields', () => {
		const response = {
			request_metadata: { id: 'req-8', status: 'ok', timing: 42 },
			autocomplete_results: ['test'],
			extra: 'value',
		};

		const result =
			CountdownApiEndpointOutputSchemas.autocomplete.safeParse(response);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveProperty('extra', 'value');
		}
	});

	it('autocomplete schema rejects response missing autocomplete_results', () => {
		const response = {
			request_metadata: { id: 'req-9', status: 'ok' },
		};

		const result =
			CountdownApiEndpointOutputSchemas.autocomplete.safeParse(response);
		expect(result.success).toBe(false);
	});

	it('all schemas reject response missing request_metadata', () => {
		const noMetadata = { search_results: [] };
		expect(
			CountdownApiEndpointOutputSchemas.search.safeParse(noMetadata).success,
		).toBe(false);

		const noMetadata2 = { product: { title: 'X' } };
		expect(
			CountdownApiEndpointOutputSchemas.product.safeParse(noMetadata2).success,
		).toBe(false);

		const noMetadata3 = { autocomplete_results: [] };
		expect(
			CountdownApiEndpointOutputSchemas.autocomplete.safeParse(noMetadata3)
				.success,
		).toBe(false);
	});
});
