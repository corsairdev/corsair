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
	it('accepts a DQL query', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'name:"OpenAI"',
			type: 'Organization',
			size: 5,
		});
		expect(result.success).toBe(true);
	});

	it('accepts a query without optional type', () => {
		const result = DqlSearchInputSchema.safeParse({
			query: 'diffbot',
		});
		expect(result.success).toBe(true);
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
