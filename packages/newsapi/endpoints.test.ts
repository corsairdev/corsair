import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { NewsApiContext } from './context';
import {
	everything,
	headlines,
	legacyArticles,
	listSources,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key: string, db?: NewsApiContext['db']): NewsApiContext {
	return { key, db } as unknown as NewsApiContext;
}

const ARTICLE = {
	source: { id: 'bbc-news', name: 'BBC' },
	author: 'Ada',
	title: 'Hello',
	description: 'World',
	url: 'https://example.com/hello',
	urlToImage: 'https://example.com/img.png',
	publishedAt: '2024-01-01T00:00:00Z',
	content: 'full text secret',
};

describe('newsapi reads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores an article and omits the query and content from the event', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			status: 'ok',
			articles: [ARTICLE, { title: 'no url' }],
		});
		const result = await everything(
			context('sekrit', {
				articles: { upsertByEntityId: upsert },
			} as unknown as NewsApiContext['db']),
			{ q: 'secret-query' },
		);
		expect(result.articles).toEqual([
			{
				id: 'https://example.com/hello',
				title: 'Hello',
				description: 'World',
				author: 'Ada',
				urlToImage: 'https://example.com/img.png',
				publishedAt: '2024-01-01T00:00:00Z',
				sourceId: 'bbc-news',
				sourceName: 'BBC',
			},
		]);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('full text');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret-query',
		);
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('sekrit');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://newsapi.org');
		expect(config?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v2/everything',
			query: { q: 'secret-query', apiKey: 'sekrit' },
		});
	});

	it('sends the date, searchIn and excludeDomains filters and returns totalResults', async () => {
		mockRequest.mockResolvedValue({
			status: 'ok',
			totalResults: 594,
			articles: [ARTICLE],
		});
		const result = await everything(context('sekrit'), {
			q: 'bitcoin',
			searchIn: 'title,description',
			excludeDomains: 'example.org',
			from: '2026-11-10',
			to: '2026-11-16T12:00:00',
			page: 2,
			pageSize: 10,
		});
		expect(result.totalResults).toBe(594);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v2/everything',
			query: {
				q: 'bitcoin',
				searchIn: 'title,description',
				excludeDomains: 'example.org',
				from: '2026-11-10',
				to: '2026-11-16T12:00:00',
				page: '2',
				pageSize: '10',
			},
		});
	});

	it('rejects a searchIn field NewsAPI does not know', async () => {
		await expect(
			everything(context('sekrit'), { q: 'x', searchIn: 'body' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('returns totalResults for top headlines', async () => {
		mockRequest.mockResolvedValue({
			status: 'ok',
			totalResults: 37,
			articles: [ARTICLE],
		});
		const result = await headlines(context('sekrit'), { country: 'us' });
		expect(result.totalResults).toBe(37);
	});

	it('rejects sources mixed with a country before calling the API', async () => {
		await expect(
			headlines(context('sekrit'), { country: 'us', sources: 'bbc-news' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('stores a source', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			status: 'ok',
			sources: [
				{
					id: 'bbc-news',
					name: 'BBC',
					description: 'News',
					url: 'https://bbc.co.uk',
					category: 'general',
					language: 'en',
					country: 'gb',
				},
			],
		});
		const result = await listSources(
			context('sekrit', {
				sources: { upsertByEntityId: upsert },
			} as unknown as NewsApiContext['db']),
			{},
		);
		expect(result.sources[0]?.id).toBe('bbc-news');
		expect(upsert).toHaveBeenCalledWith('bbc-news', result.sources[0]);
	});

	it('uses the legacy source string as sourceName', async () => {
		mockRequest.mockResolvedValue({
			status: 'ok',
			source: 'bbc-news',
			articles: [{ url: 'https://example.com/a', title: 'A' }],
		});
		const result = await legacyArticles(context('sekrit'), {
			source: 'bbc-news',
		});
		expect(result.articles[0]?.sourceName).toBe('bbc-news');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v1/articles',
		});
	});

	it('throws when the key is missing', async () => {
		await expect(listSources(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v2/everything' },
			{
				url: 'https://newsapi.org/v2/everything',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { code: 'apiKeyInvalid' },
			},
			'apiKeyInvalid',
		);
		mockRequest.mockRejectedValue(error);
		await expect(everything(context('sekrit'), { q: 'x' })).rejects.toBe(error);
	});

	it('returns articles when the database write fails', async () => {
		mockRequest.mockResolvedValue({ status: 'ok', articles: [ARTICLE] });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await everything(
			context('sekrit', {
				articles: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db')),
				},
			} as unknown as NewsApiContext['db']),
			{ q: 'x' },
		);
		expect(result.articles).toHaveLength(1);
		expect(warn).toHaveBeenCalledWith('Failed to save NewsAPI article');
		warn.mockRestore();
	});
});
