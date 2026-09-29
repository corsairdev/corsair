import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { makeCurrentsApiRequest } from './client';
import { get as categories } from './endpoints/categories';
import { get as languages } from './endpoints/languages';
import { get as latest } from './endpoints/latest';
import { get as regions } from './endpoints/regions';
import { get as search } from './endpoints/search';
import type {
	CategoriesResponse,
	LanguagesResponse,
	LatestResponse,
	RegionsResponse,
	SearchResponse,
} from './endpoints/types';
import {
	CurrentsApiEndpointInputSchemas,
	CurrentsApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { currentsapi } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCurrentsApiRequest: jest.fn(),
}));

const mockRequest = makeCurrentsApiRequest as jest.MockedFunction<
	typeof makeCurrentsApiRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-currentsapi-key',
} as Parameters<typeof search>[0];

const docSearchResponse = {
	status: 'ok',
	news: [
		{
			id: 'ac4062d1-5fbb-4784-bf1d-6b50f5f643a0',
			title: 'Investors are taking a gamble on Bitcoin',
			description: 'Cryptocurrency markets rallied again this week',
			url: 'https://example.com/news/bitcoin-markets',
			author: 'example.com',
			image: 'https://example.com/img/bitcoin.jpg',
			language: 'en',
			category: ['finance'],
			source_category: ['finance'],
			published: '2026-09-07 14:22:08 +0000',
		},
		{
			id: '713f0c68-9bac-4168-9880-c94eecaf735f',
			title: 'City council approves new transit plan',
			description: 'The council voted 8-3 to adopt the plan',
			url: 'https://example.com/news/transit-plan',
			author: 'example.com',
			image: 'None',
			language: 'en',
			category: ['general'],
			source_category: ['regional'],
			published: '2026-09-07 12:10:31 +0000',
		},
	],
	page: 1,
} satisfies SearchResponse;

const docLatestResponse = {
	status: 'ok',
	news: [
		{
			id: 'ac4062d1-5fbb-4784-bf1d-6b50f5f643a0',
			title: 'Investors are taking a gamble on Bitcoin',
			description: 'Cryptocurrency markets rallied again',
			url: 'https://example.com/news/bitcoin-markets',
			author: 'example.com',
			image: 'https://example.com/img/bitcoin.jpg',
			language: 'en',
			category: ['finance'],
			published: '2026-09-07 14:22:08 +0000',
		},
	],
	page: 1,
} satisfies LatestResponse;

const docLanguagesResponse = {
	languages: {
		English: 'en',
		Arabic: 'ar',
		French: 'fr',
		German: 'de',
	},
	description: 'available languages followed by query code',
	status: 'ok',
} satisfies LanguagesResponse;

const docRegionsResponse = {
	regions: {
		Australia: 'AU',
		Canada: 'CA',
		Finland: 'FI',
		Italy: 'IT',
	},
	description: 'available regions followed by query code',
	status: 'ok',
} satisfies RegionsResponse;

const docCategoriesResponse = {
	categories: ['regional', 'technology', 'business', 'general', 'sports'],
	description: 'order by source count in descending order',
	status: 'ok',
} satisfies CategoriesResponse;

describe('CurrentsApi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('search sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(docSearchResponse);

		const result = await search(ctx, {
			keywords: 'Bitcoin',
			language: 'en',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/search',
			'test-currentsapi-key',
			{
				keywords: 'Bitcoin',
				query: undefined,
				language: 'en',
				category: undefined,
				country: undefined,
				start_date: undefined,
				end_date: undefined,
				page_number: undefined,
				page_size: undefined,
				limit: undefined,
				type: undefined,
				domain: undefined,
				domain_not: undefined,
				author: undefined,
				has_image: undefined,
				has_description: undefined,
			},
		);

		expect(result).toEqual(docSearchResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'currentsapi.search.get',
			{ keywords: 'Bitcoin', language: 'en' },
			'completed',
		);
	});

	it('search forwards filters and pagination', async () => {
		mockRequest.mockResolvedValue(docSearchResponse);

		await search(ctx, {
			query: 'Bitcoin AND markets',
			language: 'en',
			category: 'finance,technology',
			page_number: 2,
			page_size: 20,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/search',
			'test-currentsapi-key',
			{
				keywords: undefined,
				query: 'Bitcoin AND markets',
				language: 'en',
				category: 'finance,technology',
				country: undefined,
				start_date: undefined,
				end_date: undefined,
				page_number: 2,
				page_size: 20,
				limit: undefined,
				type: undefined,
				domain: undefined,
				domain_not: undefined,
				author: undefined,
				has_image: undefined,
				has_description: undefined,
			},
		);
	});

	it('search rejects offsets beyond 5000 rows', async () => {
		await expect(
			search(ctx, { keywords: 'Bitcoin', page_number: 180, page_size: 300 }),
		).rejects.toThrow(ZodError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('latest sends the correct request and returns validated response', async () => {
		mockRequest.mockResolvedValue(docLatestResponse);

		const result = await latest(ctx, { language: 'en' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/latest-news',
			'test-currentsapi-key',
			{
				language: 'en',
				category: undefined,
				country: undefined,
				page_number: undefined,
				page_size: undefined,
				type: undefined,
				domain: undefined,
				domain_not: undefined,
				author: undefined,
			},
		);

		expect(result).toEqual(docLatestResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'currentsapi.latest.get',
			{ language: 'en' },
			'completed',
		);
	});

	it('languages returns validated response', async () => {
		mockRequest.mockResolvedValue(docLanguagesResponse);

		const result = await languages(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/available/languages',
			'test-currentsapi-key',
			{},
		);
		expect(result).toEqual(docLanguagesResponse);
	});

	it('regions returns validated response', async () => {
		mockRequest.mockResolvedValue(docRegionsResponse);

		const result = await regions(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/available/regions',
			'test-currentsapi-key',
			{},
		);
		expect(result).toEqual(docRegionsResponse);
	});

	it('categories returns validated response', async () => {
		mockRequest.mockResolvedValue(docCategoriesResponse);

		const result = await categories(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/available/categories',
			'test-currentsapi-key',
			{},
		);
		expect(result).toEqual(docCategoriesResponse);
	});

	it('search throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ invalid_data: true });

		await expect(search(ctx, { keywords: 'Bitcoin' })).rejects.toThrow(
			ZodError,
		);
	});

	it('latest throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await expect(latest(ctx, { language: 'en' })).rejects.toThrow(ZodError);
	});
});

describe('CurrentsApi output schemas', () => {
	it('search schema validates the documented response', () => {
		const result =
			CurrentsApiEndpointOutputSchemas.search.safeParse(docSearchResponse);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.news).toHaveLength(2);
			expect(result.data.news[0]).toMatchObject({
				title: 'Investors are taking a gamble on Bitcoin',
			});
		}
	});

	it('search schema preserves extra passthrough fields', () => {
		const result = CurrentsApiEndpointOutputSchemas.search.safeParse({
			...docSearchResponse,
			future_field: { nested: 'value' },
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveProperty('future_field');
		}
	});

	it('search schema rejects response missing news', () => {
		const result = CurrentsApiEndpointOutputSchemas.search.safeParse({
			status: 'ok',
			page: 1,
		});
		expect(result.success).toBe(false);
	});

	it('languages schema validates the documented response', () => {
		const result =
			CurrentsApiEndpointOutputSchemas.languages.safeParse(
				docLanguagesResponse,
			);
		expect(result.success).toBe(true);
	});

	it('languages schema rejects response missing languages', () => {
		const result = CurrentsApiEndpointOutputSchemas.languages.safeParse({
			status: 'ok',
		});
		expect(result.success).toBe(false);
	});

	it('categories schema validates the documented response', () => {
		const result = CurrentsApiEndpointOutputSchemas.categories.safeParse(
			docCategoriesResponse,
		);
		expect(result.success).toBe(true);
	});
});

describe('CurrentsApi input schemas', () => {
	it('search defaults language to en', () => {
		const result = CurrentsApiEndpointInputSchemas.search.safeParse({
			keywords: 'Bitcoin',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.language).toBe('en');
		}
	});

	it('latest defaults language to en', () => {
		const result = CurrentsApiEndpointInputSchemas.latest.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.language).toBe('en');
		}
	});

	it('search rejects offsets beyond 5000 rows', () => {
		const result = CurrentsApiEndpointInputSchemas.search.safeParse({
			keywords: 'Bitcoin',
			page_number: 180,
			page_size: 300,
		});
		expect(result.success).toBe(false);
	});
});

describe('CurrentsApi keyBuilder', () => {
	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = currentsapi();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('prefers an explicitly supplied key', async () => {
		const plugin = currentsapi({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'from-store' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe(
			'explicit-key',
		);
	});

	it('returns the stored key when present', async () => {
		const plugin = currentsapi();
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe('stored-key');
	});
});

describe('CurrentsApi error handlers', () => {
	it('matches RATE_LIMIT_ERROR for ApiError with status 429', async () => {
		const error = new ApiError(
			{ url: 'https://api.currentsapi.services/v1/search', method: 'GET' },
			{
				url: 'https://api.currentsapi.services/v1/search',
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
				ok: false,
			},
			'Rate limited',
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
	});

	it('matches AUTH_ERROR for ApiError with status 401', async () => {
		const error = new ApiError(
			{ url: 'https://api.currentsapi.services/v1/search', method: 'GET' },
			{
				url: 'https://api.currentsapi.services/v1/search',
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
	});

	it('DEFAULT matches all other errors', async () => {
		const error = new Error('Something generic went wrong');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
	});
});
