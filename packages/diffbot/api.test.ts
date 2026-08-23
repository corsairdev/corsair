import { makeDiffbotRequest } from './client';
import { Extract, Search } from './endpoints';
import {
	AnalyzeInputSchema,
	AnalyzeResponseSchema,
	DqlSearchInputSchema,
	DqlSearchResponseSchema,
	ExtractArticleInputSchema,
	ExtractArticleResponseSchema,
	ExtractProductInputSchema,
	ExtractProductResponseSchema,
	WebSearchInputSchema,
	WebSearchResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { DiffbotContext } from './index';

// Mock the client request module
jest.mock('./client', () => ({
	makeDiffbotRequest: jest.fn(),
}));

const mockRequest = makeDiffbotRequest as jest.MockedFunction<
	typeof makeDiffbotRequest
>;

const mockCtx = {
	key: 'test-token',
} as DiffbotContext;

// ---------------------------------------------------------------------------
// Extract Article
// ---------------------------------------------------------------------------

describe('extract.article — input schema', () => {
	it('accepts a valid URL', () => {
		const result = ExtractArticleInputSchema.safeParse({
			url: 'https://techcrunch.com/2024/01/01/example-article',
		});
		expect(result.success).toBe(true);
	});

	it('accepts optional fields param', () => {
		const result = ExtractArticleInputSchema.safeParse({
			url: 'https://example.com',
			fields: 'links,meta,tags',
			timeout: 30000,
		});
		expect(result.success).toBe(true);
	});

	it('rejects missing url', () => {
		const result = ExtractArticleInputSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});

describe('extract.article — response schema', () => {
	it('parses a valid article response', () => {
		const payload = {
			request: { pageUrl: 'https://example.com', api: 'article', version: 3 },
			objects: [
				{
					type: 'article' as const,
					title: 'Test Article',
					text: 'Article body text',
					author: 'John Doe',
					date: '2024-01-01T00:00:00.000Z',
					pageUrl: 'https://example.com',
					humanLanguage: 'en',
				},
			],
		};
		const result = ExtractArticleResponseSchema.safeParse(payload);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.objects[0]?.title).toBe('Test Article');
			expect(result.data.objects[0]?.author).toBe('John Doe');
		}
	});

	it('parses response with optional fields missing', () => {
		const result = ExtractArticleResponseSchema.safeParse({
			objects: [{ type: 'article' }],
		});
		expect(result.success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Extract Product
// ---------------------------------------------------------------------------

describe('extract.product — input schema', () => {
	it('accepts a valid product URL', () => {
		const result = ExtractProductInputSchema.safeParse({
			url: 'https://www.amazon.com/dp/B08N5WRWNW',
		});
		expect(result.success).toBe(true);
	});

	it('rejects missing url', () => {
		const result = ExtractProductInputSchema.safeParse({ timeout: 5000 });
		expect(result.success).toBe(false);
	});
});

describe('extract.product — response schema', () => {
	it('parses a valid product response', () => {
		const payload = {
			objects: [
				{
					type: 'product' as const,
					title: 'Example Product',
					offerPrice: '$29.99',
					availability: true,
					brand: 'Acme',
					pageUrl: 'https://example.com/product',
				},
			],
		};
		const result = ExtractProductResponseSchema.safeParse(payload);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.objects[0]?.offerPrice).toBe('$29.99');
			expect(result.data.objects[0]?.availability).toBe(true);
		}
	});
});

// ---------------------------------------------------------------------------
// Analyze (auto-detect)
// ---------------------------------------------------------------------------

describe('extract.analyze — input schema', () => {
	it('accepts a URL with fallback option', () => {
		const result = AnalyzeInputSchema.safeParse({
			url: 'https://example.com',
			fallback: 'article',
		});
		expect(result.success).toBe(true);
	});

	it('rejects empty object', () => {
		const result = AnalyzeInputSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});

describe('extract.analyze — response schema', () => {
	it('parses an analyze response with detected type', () => {
		const result = AnalyzeResponseSchema.safeParse({
			type: 'article',
			humanLanguage: 'en',
			objects: [{ type: 'article', title: 'Detected Article' }],
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.type).toBe('article');
		}
	});
});

// ---------------------------------------------------------------------------
// Web Search
// ---------------------------------------------------------------------------

describe('search.web — input schema', () => {
	it('accepts a valid search query', () => {
		const result = WebSearchInputSchema.safeParse({
			query: 'artificial intelligence trends 2024',
			num: 10,
		});
		expect(result.success).toBe(true);
	});

	it('rejects num > 25 (Diffbot max)', () => {
		const result = WebSearchInputSchema.safeParse({
			query: 'test',
			num: 100,
		});
		expect(result.success).toBe(false);
	});

	it('rejects missing query', () => {
		const result = WebSearchInputSchema.safeParse({ num: 5 });
		expect(result.success).toBe(false);
	});
});

describe('search.web — response schema', () => {
	it('parses a valid search response', () => {
		const payload = {
			results: [
				{
					title: 'AI in 2024',
					pageUrl: 'https://example.com/ai-2024',
					text: 'Article summary...',
					humanLanguage: 'en',
				},
			],
			numResults: 1,
			hits: 1,
		};
		const result = WebSearchResponseSchema.safeParse(payload);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.results?.[0]?.title).toBe('AI in 2024');
			expect(result.data.numResults).toBe(1);
		}
	});
});

// ---------------------------------------------------------------------------
// DQL (Knowledge Graph Search)
// ---------------------------------------------------------------------------

describe('search.dql — input schema', () => {
	it('accepts a DQL query with entityType filter', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'name:"OpenAI"',
			entityType: 'Organization',
			size: 5,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.entityType).toBe('Organization');
		}
	});

	it('accepts a query without optional entityType', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'diffbot',
		});
		expect(result.success).toBe(true);
	});

	it('accepts crawl queryType with collection', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'type:Article',
			queryType: 'crawl',
			col: 'my_collection',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.queryType).toBe('crawl');
			expect(result.data.col).toBe('my_collection');
		}
	});

	it('rejects collection without crawl queryType', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'type:Article',
			col: 'my_collection',
		});
		expect(result.success).toBe(false);
	});

	it('rejects collection for non-crawl queryType', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'type:Article',
			queryType: 'query',
			col: 'my_collection',
		});
		expect(result.success).toBe(false);
	});

	it('rejects invalid queryType', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'test',
			queryType: 'invalid_mode',
		});
		expect(result.success).toBe(false);
	});

	it('rejects missing query', () => {
		const result = DqlSearchInputSchema.safeParse({ size: 5 });
		expect(result.success).toBe(false);
	});
});

describe('search.dql — response schema', () => {
	it('parses a valid DQL response', () => {
		const payload = {
			data: [{ id: 'org-123', name: 'OpenAI', type: 'Organization' }],
			hits: 1,
		};
		const result = DqlSearchResponseSchema.safeParse(payload);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.hits).toBe(1);
			expect(result.data.data).toHaveLength(1);
		}
	});

	it('parses an empty result set', () => {
		const result = DqlSearchResponseSchema.safeParse({ data: [], hits: 0 });
		expect(result.success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Endpoint Handler Verification (Mocked requests)
// ---------------------------------------------------------------------------

describe('Diffbot endpoint handlers (mocked request mapping)', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('extractArticle invokes client correctly', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [] });
		await Extract.article(mockCtx, {
			url: 'https://example.com/article',
			fields: 'meta,links',
		});

		expect(mockRequest).toHaveBeenCalledWith('article', 'test-token', {
			method: 'GET',
			query: {
				url: 'https://example.com/article',
				fields: 'meta,links',
			},
		});
	});

	it('extractProduct invokes client correctly', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [] });
		await Extract.product(mockCtx, {
			url: 'https://example.com/product',
		});

		expect(mockRequest).toHaveBeenCalledWith('product', 'test-token', {
			method: 'GET',
			query: {
				url: 'https://example.com/product',
			},
		});
	});

	it('extractAnalyze invokes client correctly', async () => {
		mockRequest.mockResolvedValueOnce({ type: 'article' });
		await Extract.analyze(mockCtx, {
			url: 'https://example.com/page',
			fallback: 'article',
		});

		expect(mockRequest).toHaveBeenCalledWith('analyze', 'test-token', {
			method: 'GET',
			query: {
				url: 'https://example.com/page',
				fallback: 'article',
			},
		});
	});

	it('searchWeb invokes client correctly', async () => {
		mockRequest.mockResolvedValueOnce({ results: [] });
		await Search.web(mockCtx, {
			query: 'AI news',
			num: 5,
		});

		expect(mockRequest).toHaveBeenCalledWith('search', 'test-token', {
			method: 'GET',
			query: {
				query: 'AI news',
				num: 5,
			},
		});
	});

	it('searchDql invokes client correctly and routes to Knowledge Graph base URL', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });
		await Search.dql(mockCtx, {
			query: 'name:"OpenAI"',
			entityType: 'Organization',
			queryType: 'query',
			size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith('dql', 'test-token', {
			method: 'GET',
			useKgBase: true,
			query: {
				query: 'type:Organization name:"OpenAI"',
				type: 'query',
				size: 10,
			},
		});
	});
});

describe('Diffbot error handlers', () => {
	it('recognizes rate limits and preserves retry timing', async () => {
		const error = Object.assign(new Error('Too many requests'), {
			status: 429,
			retryAfter: 12_000,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 12_000,
		});
	});

	it('does not retry authentication failures', async () => {
		const error = Object.assign(new Error('Unauthorized'), { status: 401 });

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
