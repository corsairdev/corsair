import { logEventFromContext } from 'corsair/core';
import { makeSearch1APIRequest, requestSearch1APIScreenshot } from './client';
import { Account, Content, Deepcrawl, Web } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	Search1APIError: class Search1APIError extends Error {},
	makeSearch1APIRequest: jest.fn(),
	requestSearch1APIScreenshot: jest.fn(),
}));

const mockRequest = jest.mocked(makeSearch1APIRequest);
const mockScreenshot = jest.mocked(requestSearch1APIScreenshot);
const mockLog = jest.mocked(logEventFromContext);

// never parameters: any concrete endpoint function is assignable to this
// (parameters are contravariant), so the table needs no per-entry casts.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function createContext() {
	return {
		key: 's1_key_test',
		options: {},
		db: {
			searchResults: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

beforeEach(() => {
	mockRequest.mockReset().mockResolvedValue({});
	mockScreenshot.mockReset().mockResolvedValue({
		contentType: 'image/png',
		base64: 'aGVsbG8=',
		sizeBytes: 5,
	});
	mockLog.mockClear();
});

const searchResponse = {
	searchParameters: { query: 'corsair' },
	results: [],
};

const batchResponse = {
	results: [],
	summary: { total: 0, successful: 0, failed: 0, totalCost: 0 },
};

const crawlResponse = {
	crawlParameters: { url: 'https://example.com' },
	results: {
		title: 'Example',
		link: 'https://example.com',
		content: 'hello',
	},
};

const cases: Array<{
	name: string;
	endpoint: AnyEndpoint;
	// each case feeds a different payload; the endpoint's schema validates it
	input: unknown;
	method: string;
	url: string;
	// Minimal body that passes the endpoint's output schema.
	response?: unknown;
}> = [
	{
		name: 'search',
		endpoint: Web.search,
		input: { query: 'corsair' },
		method: 'POST',
		url: '/search',
		response: searchResponse,
	},
	{
		name: 'searchBatch',
		endpoint: Web.searchBatch,
		input: [{ query: 'corsair' }],
		method: 'POST',
		url: '/search',
		response: batchResponse,
	},
	{
		name: 'news',
		endpoint: Web.news,
		input: { query: 'ai regulation' },
		method: 'POST',
		url: '/news',
		response: searchResponse,
	},
	{
		name: 'newsBatch',
		endpoint: Web.newsBatch,
		input: [{ query: 'ai regulation' }],
		method: 'POST',
		url: '/news',
		response: batchResponse,
	},
	{
		name: 'ask',
		endpoint: Web.ask,
		input: { query: 'what happened in tech today?' },
		method: 'POST',
		url: '/ask',
		response: {
			query: 'what happened in tech today?',
			intent: { search_query: 'tech news', sources: [], time_range: null },
			results: [],
			errors: [],
		},
	},
	{
		name: 'trending',
		endpoint: Web.trending,
		input: { search_service: 'github' },
		method: 'POST',
		url: '/trending',
		response: {
			trendingParameters: { search_service: 'github' },
			results: [],
		},
	},
	{
		name: 'feedback',
		endpoint: Web.feedback,
		input: { message: 'POST /crawl returned empty content', category: 'bug' },
		method: 'POST',
		url: '/feedback',
		response: { id: 'fb_abc123', status: 'new' },
	},
	{
		name: 'crawl',
		endpoint: Content.crawl,
		input: { url: 'https://example.com' },
		method: 'POST',
		url: '/crawl',
		response: crawlResponse,
	},
	{
		name: 'crawlBatch',
		endpoint: Content.crawlBatch,
		input: [{ url: 'https://example.com' }],
		method: 'POST',
		url: '/crawl',
		response: [crawlResponse],
	},
	{
		name: 'screenshot',
		endpoint: Content.screenshot,
		input: { url: 'https://example.com' },
		method: 'RAW',
		url: 'https://example.com',
	},
	{
		name: 'sitemap',
		endpoint: Content.sitemap,
		input: { url: 'https://example.com' },
		method: 'POST',
		url: '/sitemap',
		response: { links: [] },
	},
	{
		name: 'extract',
		endpoint: Content.extract,
		input: { url: 'https://example.com', prompt: 'Get the title' },
		method: 'POST',
		url: '/extract',
		response: {
			success: true,
			extractParameters: { url: 'https://example.com' },
			results: { title: 'Example' },
		},
	},
	{
		name: 'deepcrawl.start',
		endpoint: Deepcrawl.start,
		input: { url: 'https://example.com' },
		method: 'POST',
		url: '/deepcrawl',
		response: { taskId: 't1', status: 'queued' },
	},
	{
		name: 'deepcrawl.status',
		endpoint: Deepcrawl.status,
		input: { taskId: 'task/1' },
		method: 'GET',
		url: '/deepcrawl/status/task%2F1',
		response: { taskId: 'task/1', status: 'processing' },
	},
	{
		name: 'usage',
		endpoint: Account.usage,
		input: {},
		method: 'GET',
		url: '/usage',
		response: { usage: 42, credential_type: 'api_key' },
	},
	{
		name: 'health',
		endpoint: Account.health,
		input: {},
		method: 'GET',
		url: '/health',
		response: { status: 'ok', version: '1.2.3' },
	},
];

describe('search1api endpoint routing', () => {
	it.each(cases)(
		'$name calls $method $url',
		async ({ endpoint, input, method, url, response }) => {
			const ctx = createContext();
			if (method !== 'RAW') {
				mockRequest.mockResolvedValueOnce(response ?? {});
			}
			await endpoint(ctx as never, input as never);

			if (method === 'RAW') {
				expect(mockScreenshot).toHaveBeenCalledTimes(1);
				expect(mockScreenshot.mock.calls[0]?.[0]).toEqual(input);
				expect(mockScreenshot.mock.calls[0]?.[1]).toBe('s1_key_test');
				expect(mockRequest).not.toHaveBeenCalled();
				return;
			}

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [calledUrl, calledKey, options] = mockRequest.mock.calls[0] ?? [];
			expect(calledUrl).toBe(url);
			expect(calledKey).toBe('s1_key_test');
			expect(options?.method ?? 'GET').toBe(method);
		},
	);

	it('search sends the validated body and logs the completed call', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce(searchResponse);
		await Web.search(ctx as never, {
			query: 'corsair integrations',
			search_service: 'duckduckgo',
			max_results: 3,
			crawl_results: 1,
			time_range: 'week',
		});

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({
			query: 'corsair integrations',
			search_service: 'duckduckgo',
			max_results: 3,
			crawl_results: 1,
			time_range: 'week',
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'search1api.web.search',
			expect.objectContaining({ query: 'corsair integrations' }),
			'completed',
		);
	});

	it('searchBatch sends the array body', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce(batchResponse);
		await Web.searchBatch(ctx as never, [
			{ query: 'one' },
			{ query: 'two', max_results: 10 },
		]);

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual([
			{ query: 'one' },
			{ query: 'two', max_results: 10 },
		]);
	});

	it('crawlBatch sends the array body', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce([crawlResponse]);
		await Content.crawlBatch(ctx as never, [
			{ url: 'https://example.com' },
			{ url: 'https://example.org' },
		]);

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual([
			{ url: 'https://example.com' },
			{ url: 'https://example.org' },
		]);
	});

	it('search stores each hit by link with the query', async () => {
		mockRequest.mockResolvedValueOnce({
			searchParameters: { query: 'due process' },
			results: [
				{
					title: 'A',
					link: 'https://example.com/a',
					snippet: 'first',
				},
				{
					title: 'B',
					link: 'https://example.com/b',
					snippet: 'second',
					published_date: '2026-01-02',
				},
			],
		});
		const ctx = createContext();
		await Web.search(ctx as never, { query: 'due process' });

		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/a',
			expect.objectContaining({ query: 'due process' }),
		);
		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/b',
			expect.objectContaining({
				publishedDate: new Date('2026-01-02'),
			}),
		);
	});

	it('search still returns results when the cache write fails', async () => {
		mockRequest.mockResolvedValueOnce({
			searchParameters: { query: 'x' },
			results: [{ title: 'A', link: 'https://example.com/a', snippet: 's' }],
		});
		const ctx = createContext();
		ctx.db.searchResults.upsertByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await Web.search(ctx as never, { query: 'x' });

		expect(result.results).toHaveLength(1);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('rejects an invalid input before any request is made', async () => {
		const ctx = createContext();
		await expect(
			Web.search(ctx as never, { query: '' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects unknown input keys before any request is made', async () => {
		const ctx = createContext();
		await expect(
			Web.search(
				ctx as never,
				{
					query: 'x',
					oiseau: true,
				} as never,
			),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty batch before any request is made', async () => {
		const ctx = createContext();
		await expect(Web.searchBatch(ctx as never, [] as never)).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('usage sends the period as a query param', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({
			usage: 42,
			credential_type: 'api_key',
		});
		await Account.usage(ctx as never, { period: 'month' } as never);

		expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
			period: 'month',
		});
		expect(mockRequest.mock.calls[0]?.[2]?.body).toBeUndefined();
	});

	it('usage without a period sends no query params', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({
			usage: 42,
			credential_type: 'api_key',
		});
		await Account.usage(ctx as never, {} as never);

		expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({});
	});

	it('feedback sends the validated body and logs the report id', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ id: 'fb_abc123', status: 'new' });
		await Web.feedback(ctx as never, {
			message: 'POST /crawl returned empty content',
			category: 'bug',
			request_id: 'req_1',
			agent: { name: 'corsair' },
		});

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({
			message: 'POST /crawl returned empty content',
			category: 'bug',
			request_id: 'req_1',
			agent: { name: 'corsair' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'search1api.web.feedback',
			{ id: 'fb_abc123', status: 'new' },
			'completed',
		);
	});

	it('rejects a malformed vendor response', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ usage: 'lots' });
		await expect(Account.usage(ctx as never, {} as never)).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
