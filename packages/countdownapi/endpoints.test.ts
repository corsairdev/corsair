import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { CountdownApiAPIError, makeCountdownApiRequest } from './client';
import { get as autocomplete } from './endpoints/autocomplete';
import { get as product } from './endpoints/product';
import { get as search } from './endpoints/search';
import { CountdownApiEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';

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

const validSearchResponse = {
	request_metadata: { id: 'req-1', status: 'ok' },
	search_results: [
		{
			position: 1,
			title: 'iPhone 15',
			link: 'https://ebay.com/itm/1',
			price: { raw: '$999.00', value: 999, currency: 'USD' },
		},
	],
};

const validProductResponse = {
	request_metadata: { id: 'req-2', status: 'ok' },
	product: {
		title: 'iPhone 15 Pro',
		link: 'https://ebay.com/itm/2',
		price: { raw: '$1,099.00', value: 1099, currency: 'USD' },
	},
};

const validAutocompleteResponse = {
	request_metadata: { id: 'req-3', status: 'ok' },
	autocomplete_results: ['iphone 15', 'iphone 14'],
};

describe('CountdownApi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue(validSearchResponse as any);
	});

	it('search sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(validSearchResponse as any);

		const result = await search(ctx, {
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

		expect(result).toEqual(validSearchResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.search.get',
			{ query: 'iphone', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('product sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(validProductResponse as any);

		const result = await product(ctx, {
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

		expect(result).toEqual(validProductResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.product.get',
			{ epid: '123', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('autocomplete uses search_term and returns validated response', async () => {
		mockRequest.mockResolvedValue(validAutocompleteResponse as any);

		const result = await autocomplete(ctx, {
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

		expect(result).toEqual(validAutocompleteResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'countdownapi.autocomplete.get',
			{ query: 'iph', ebay_domain: 'ebay.com' },
			'completed',
		);
	});

	it('search throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ invalid_data: true } as any);

		await expect(
			search(ctx, {
				query: 'iphone',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
	});

	it('product throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({
			request_metadata: { id: '1', status: 'ok' },
		} as any);

		await expect(
			product(ctx, {
				epid: '123',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
	});

	it('autocomplete throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({
			search_parameters: { type: 'autocomplete' },
		} as any);

		await expect(
			autocomplete(ctx, {
				query: 'iph',
				ebay_domain: 'ebay.com',
			}),
		).rejects.toThrow(ZodError);
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

describe('CountdownApi error handlers', () => {
	it('matches RATE_LIMIT_ERROR for CountdownApiAPIError with status 429 and preserves retryAfter', async () => {
		const error = new CountdownApiAPIError('Rate limit exceeded', 429, {
			retryAfter: 3500,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3500,
		});
	});

	it('matches RATE_LIMIT_ERROR for wrapped ApiError with status 429 and preserves retryAfter', async () => {
		const apiError = new ApiError(
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
		const error = new CountdownApiAPIError(apiError.message, apiError.status, {
			cause: apiError,
		});

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(6000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 6000,
		});
	});

	it('matches RATE_LIMIT_ERROR on message fallback', async () => {
		const error1 = new Error('rate_limited by server');
		const error2 = new Error('HTTP 429 Too Many Requests');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error1)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error2)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error1);
		expect(strategy).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('matches AUTH_ERROR for CountdownApiAPIError with status 401', async () => {
		const error = new CountdownApiAPIError('Invalid API key', 401);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.AUTH_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches AUTH_ERROR for wrapped ApiError with status 401', async () => {
		const apiError = new ApiError(
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
		const error = new CountdownApiAPIError(apiError.message, apiError.status, {
			cause: apiError,
		});

		expect(error.status).toBe(401);
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
