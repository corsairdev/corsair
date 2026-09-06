import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { makeCountdownApiRequest } from './client';
import { get as autocomplete } from './endpoints/autocomplete';
import { get as product } from './endpoints/product';
import { get as search } from './endpoints/search';
import { CountdownApiEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { countdownapi } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
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

// Fixtures below follow the official CountdownAPI documentation
// (docs.trajectdata.com/countdownapi/ebay-product-data-api/results/*):
// `request_metadata` carries id/created_at/processed_at/total_time_taken/
// ebay_url (no status), parameters are echoed as `request_parameters`, search
// items carry a `prices` array, product images are `[{ link }]`, and master
// product pages have no top-level `product`.

const docSearchResponse = {
	request_info: { success: true, credits_used: 1, credits_remaining: 999 },
	request_metadata: {
		id: '48d63ef58b3eb240d5b18115b674c4170faba51f',
		created_at: '2021-01-01T00:00:00.000Z',
		processed_at: '2021-01-01T00:00:00.100Z',
		total_time_taken: 0.1,
		ebay_url: 'https://www.ebay.com/sch/i.html?_nkw=memory+cards',
	},
	request_parameters: {
		type: 'search',
		search_term: 'memory cards',
		ebay_domain: 'ebay.com',
	},
	search_information: { original_search_term: 'memory cards' },
	search_results: [
		{
			position: 1,
			title: 'SanDisk Ultra 128GB microSDXC Memory Card',
			epid: '15029998723',
			link: 'https://www.ebay.com/itm/15029998723',
			image: 'https://i.ebayimg.com/images/g/ABC123/s-l500.jpg',
			hotness: '518+ Sold',
			condition: 'Brand New',
			is_auction: false,
			buy_it_now: true,
			free_returns: true,
			sponsored: false,
			item_location: 'United States',
			rating: 4.9,
			ratings_total: 1287,
			shipping_cost: 0,
			prices: [
				{
					symbol: '$',
					value: 7.85,
					currency: 'USD',
					raw: '$7.85',
					name: '',
				},
			],
			seller_info: {
				name: 'top_seller',
				review_count: 12345,
				positive_feedback_percent: 99.2,
			},
		},
	],
	pagination: {
		current_page: 1,
		total_results: '9893',
		has_next_page: true,
		next_page: 2,
	},
};

const docProductResponse = {
	request_info: { success: true, credits_used: 1, credits_remaining: 999 },
	request_metadata: {
		id: '1c0ffee4decafbad0ddba115b674c4170faba51f',
		created_at: '2021-01-01T00:00:00.000Z',
		processed_at: '2021-01-01T00:00:00.100Z',
		total_time_taken: 0.1,
		ebay_url: 'https://www.ebay.com/itm/15029998723',
	},
	request_parameters: {
		type: 'product',
		epid: '15029998723',
		ebay_domain: 'ebay.com',
	},
	is_master: false,
	product: {
		title: 'SanDisk Ultra 128GB microSDXC Memory Card',
		link: 'https://www.ebay.com/itm/15029998723',
		images: [
			{ link: 'https://i.ebayimg.com/images/g/ABC123/s-l1600.jpg' },
			{ link: 'https://i.ebayimg.com/images/g/DEF456/s-l1600.jpg' },
		],
	},
};

const docMasterProductResponse = {
	request_info: { success: true, credits_used: 1, credits_remaining: 999 },
	request_metadata: {
		id: '2c0ffee4decafbad0ddba115b674c4170faba51f',
		created_at: '2021-01-01T00:00:00.000Z',
		processed_at: '2021-01-01T00:00:00.100Z',
		total_time_taken: 0.1,
		ebay_url: 'https://www.ebay.com/itm/0619659162982',
	},
	request_parameters: {
		type: 'product',
		gtin: '0619659162982',
		ebay_domain: 'ebay.com',
	},
	is_master: true,
	sold_out: false,
	top_picks: [
		{
			product: {
				title: 'SanDisk Ultra 128GB microSDXC Memory Card',
				epid: '15029998723',
				link: 'https://www.ebay.com/itm/15029998723',
				prices: [
					{
						symbol: '$',
						value: 7.85,
						currency: 'USD',
						raw: '$7.85',
						name: '',
					},
				],
			},
		},
	],
};

const docAutocompleteResponse = {
	request_info: { success: true, credits_used: 1, credits_remaining: 999 },
	request_metadata: {
		id: '48d63ef58b3eb240d5b18115b674c4170faba51f',
		created_at: '2021-01-01T00:00:00.000Z',
		processed_at: '2021-01-01T00:00:00.001Z',
		total_time_taken: 0.1,
	},
	request_parameters: {
		type: 'autocomplete',
		search_term: 'memory',
		ebay_domain: 'ebay.com',
	},
	autocomplete_results: [
		{
			suggestion: 'memory card',
			type: 'KEYWORD',
			category_id: 9394,
			category_name: 'Cell Phone Accessories',
		},
		{
			suggestion: 'memory foam mattress',
			type: 'KEYWORD',
		},
	],
};

describe('CountdownApi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue(docSearchResponse as any);
	});

	it('search sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(docSearchResponse as any);

		const result = await search(ctx, {
			query: 'memory cards',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'search',
				search_term: 'memory cards',
				ebay_domain: 'ebay.com',
				page: undefined,
			},
		);

		expect(result).toEqual(docSearchResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.search.get',
			{ query: 'memory cards', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('search maps the query input to the documented search_term wire parameter', async () => {
		mockRequest.mockResolvedValue(docSearchResponse as any);

		await search(ctx, {
			query: 'memory cards',
			ebay_domain: 'ebay.com',
		});

		const requestQuery = mockRequest.mock.calls[0]?.[2];
		expect(requestQuery?.search_term).toBe('memory cards');
		expect(requestQuery).not.toHaveProperty('query');
	});

	it('search forwards the page parameter when provided', async () => {
		mockRequest.mockResolvedValue(docSearchResponse as any);

		await search(ctx, {
			query: 'memory cards',
			ebay_domain: 'ebay.com',
			page: 3,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'search',
				search_term: 'memory cards',
				ebay_domain: 'ebay.com',
				page: 3,
			},
		);
	});

	it('product sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(docProductResponse as any);

		const result = await product(ctx, {
			epid: '15029998723',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'product',
				url: undefined,
				epid: '15029998723',
				gtin: undefined,
				ebay_domain: 'ebay.com',
				include_html: undefined,
				skip_gtin_cache: undefined,
				include_parts_compatibility: undefined,
			},
		);

		expect(result).toEqual(docProductResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.product.get',
			{ epid: '15029998723', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('product parses a master page response without a top-level product', async () => {
		mockRequest.mockResolvedValue(docMasterProductResponse as any);

		const result = await product(ctx, {
			gtin: '0619659162982',
			ebay_domain: 'ebay.com',
		});

		expect(result).toEqual(docMasterProductResponse);
	});

	it('autocomplete uses search_term and returns validated response', async () => {
		mockRequest.mockResolvedValue(docAutocompleteResponse as any);

		const result = await autocomplete(ctx, {
			query: 'memory',
			ebay_domain: 'ebay.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/request',
			'test-countdownapi-key',
			{
				type: 'autocomplete',
				search_term: 'memory',
				ebay_domain: 'ebay.com',
			},
		);

		expect(result).toEqual(docAutocompleteResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.autocomplete.get',
			{ query: 'memory', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('search throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ invalid_data: true } as any);

		await expect(
			search(ctx, {
				query: 'memory cards',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
	});

	it('product throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({
			request_parameters: { type: 'product' },
		} as any);

		await expect(
			product(ctx, {
				epid: '15029998723',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
	});

	it('autocomplete throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ request_metadata: { id: '1' } } as any);

		await expect(
			autocomplete(ctx, {
				query: 'memory',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
	});
});

describe('CountdownApi output schemas', () => {
	it('search schema validates the documented search response', () => {
		const result =
			CountdownApiEndpointOutputSchemas.search.safeParse(docSearchResponse);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.request_metadata.status).toBeUndefined();
			expect(result.data.pagination?.total_results).toBe('9893');
			expect(result.data.search_results[0]?.prices?.[0]).toMatchObject({
				value: 7.85,
				raw: '$7.85',
			});
		}
	});

	it('search schema accepts a numeric pagination.total_results', () => {
		const result = CountdownApiEndpointOutputSchemas.search.safeParse({
			...docSearchResponse,
			pagination: {
				current_page: 1,
				total_results: 9893,
				has_next_page: false,
			},
		});
		expect(result.success).toBe(true);
	});

	it('search schema preserves extra passthrough fields', () => {
		const response = {
			request_metadata: { id: 'req-2', extra_field: true },
			search_results: [
				{
					title: 'Widget',
					link: 'https://ebay.com/itm/456',
					sponsored: true,
				},
			],
			future_field: { nested: 'value' },
		};

		const result = CountdownApiEndpointOutputSchemas.search.safeParse(response);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.search_results[0]).toHaveProperty('sponsored', true);
			expect(result.data).toHaveProperty('future_field');
		}
	});

	it('search schema rejects response missing search_results', () => {
		const response = {
			request_metadata: { id: 'req-3' },
		};

		const result = CountdownApiEndpointOutputSchemas.search.safeParse(response);
		expect(result.success).toBe(false);
	});

	it('product schema validates the documented individual listing response', () => {
		const result =
			CountdownApiEndpointOutputSchemas.product.safeParse(docProductResponse);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.product?.images?.[0]).toHaveProperty('link');
		}
	});

	it('product schema validates a master page without a top-level product', () => {
		const result = CountdownApiEndpointOutputSchemas.product.safeParse(
			docMasterProductResponse,
		);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.is_master).toBe(true);
			expect(result.data.product).toBeUndefined();
			expect(result.data.top_picks).toHaveLength(1);
		}
	});

	it('product schema rejects response missing request_metadata', () => {
		const response = {
			request_parameters: { type: 'product' },
			product: { title: 'Gadget' },
		};

		const result =
			CountdownApiEndpointOutputSchemas.product.safeParse(response);
		expect(result.success).toBe(false);
	});

	it('autocomplete schema validates the documented autocomplete response', () => {
		const result = CountdownApiEndpointOutputSchemas.autocomplete.safeParse(
			docAutocompleteResponse,
		);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.autocomplete_results[0]).toMatchObject({
				suggestion: 'memory card',
				type: 'KEYWORD',
				category_id: 9394,
				category_name: 'Cell Phone Accessories',
			});
		}
	});

	it('autocomplete schema accepts a string category_id', () => {
		const response = {
			request_metadata: { id: 'req-8' },
			autocomplete_results: [
				{
					suggestion: 'memory card',
					type: 'KEYWORD',
					category_id: '9394',
					category_name: 'Cell Phone Accessories',
				},
			],
		};

		const result =
			CountdownApiEndpointOutputSchemas.autocomplete.safeParse(response);
		expect(result.success).toBe(true);
	});

	it('autocomplete schema preserves extra passthrough fields', () => {
		const response = {
			request_metadata: { id: 'req-9', timing: 42 },
			autocomplete_results: [{ suggestion: 'test', type: 'KEYWORD' }],
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
			request_metadata: { id: 'req-10' },
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

describe('CountdownApi keyBuilder', () => {
	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = countdownapi();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('prefers an explicitly supplied key', async () => {
		const plugin = countdownapi({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'from-store' },
		} as never;
		await expect(keyBuilder?.(ctx, 'endpoint')).resolves.toBe('explicit-key');
	});

	it('returns the stored key when present', async () => {
		const plugin = countdownapi();
		const keyBuilder = plugin.keyBuilder;
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(keyBuilder?.(ctx, 'endpoint')).resolves.toBe('stored-key');
	});
});

describe('CountdownApi error handlers', () => {
	it('matches RATE_LIMIT_ERROR for ApiError with status 429 and does not stack retries', async () => {
		const error = new ApiError(
			{ url: 'https://api.countdownapi.com/request', method: 'GET' },
			{
				url: 'https://api.countdownapi.com/request',
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
				ok: false,
			},
			'Rate limited',
			{ retryAfter: 6000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches RATE_LIMIT_ERROR on message fallback', async () => {
		const error1 = new Error('rate_limited by server');
		const error2 = new Error('HTTP 429 Too Many Requests');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error1)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error2)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error1);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches AUTH_ERROR for ApiError with status 401', async () => {
		const error = new ApiError(
			{ url: 'https://api.countdownapi.com/request', method: 'GET' },
			{
				url: 'https://api.countdownapi.com/request',
				status: 401,
				statusText: 'Unauthorized',
				body: {},
				ok: false,
			},
			'Unauthorized',
		);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.AUTH_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches AUTH_ERROR on message fallback', async () => {
		const error1 = new Error('Request was unauthorized');
		const error2 = new Error('invalid_auth credential provided');

		expect(errorHandlers.AUTH_ERROR.match(error1)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error2)).toBe(true);

		const strategy = await errorHandlers.AUTH_ERROR.handler(error1);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('DEFAULT matches all other errors', async () => {
		const error = new Error('Something generic went wrong');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);

		const strategy = await errorHandlers.DEFAULT.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});
});
