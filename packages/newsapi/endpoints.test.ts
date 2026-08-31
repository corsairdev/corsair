import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Articles, Sources } from './endpoints';
import { NewsApiEndpointInputSchemas } from './endpoints/types';
import type { NewsApiContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeNewsApiRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('NewsApi endpoints routing & event logging', () => {
	const mockMakeNewsApiRequest =
		client.makeNewsApiRequest as jest.MockedFunction<
			typeof client.makeNewsApiRequest
		>;
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const ctx = {
		key: 'test-api-key',
		db: {
			articles: { upsertByEntityId: jest.fn() },
			sources: { upsertByEntityId: jest.fn() },
		},
	} as unknown as NewsApiContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('articles.getEverything issues GET /v2/everything, normalizes csv params, and caches by url', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({
			status: 'ok',
			totalResults: 1,
			articles: [{ url: 'https://example.com/a', title: 'A' }],
		} as any);

		const result = await Articles.getEverything(ctx, {
			q: 'bitcoin',
			sources: ['bbc-news', 'cnn'],
			domains: 'techcrunch.com,thenextweb.com',
		});

		expect(result.totalResults).toBe(1);
		expect(mockMakeNewsApiRequest).toHaveBeenCalledWith(
			'v2/everything',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({
					q: 'bitcoin',
					sources: 'bbc-news,cnn',
					domains: 'techcrunch.com,thenextweb.com',
				}),
			}),
		);
		expect(ctx.db.articles!.upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/a',
			expect.objectContaining({ url: 'https://example.com/a' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'newsapi.articles.getEverything',
			expect.any(Object),
			'completed',
		);
	});

	it('articles.getTopHeadlines issues GET /v2/top-headlines and caches articles', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({
			status: 'ok',
			totalResults: 1,
			articles: [{ url: 'https://example.com/b', title: 'B' }],
		} as any);

		const result = await Articles.getTopHeadlines(ctx, {
			country: 'us',
			category: 'technology',
		});

		expect(result.articles).toHaveLength(1);
		expect(mockMakeNewsApiRequest).toHaveBeenCalledWith(
			'v2/top-headlines',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({
					country: 'us',
					category: 'technology',
				}),
			}),
		);
		expect(ctx.db.articles!.upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/b',
			expect.objectContaining({ url: 'https://example.com/b' }),
		);
	});

	it('articles.getV1 issues GET /v1/articles for the legacy source-based lookup', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({
			status: 'ok',
			source: 'techcrunch',
			sortBy: 'top',
			articles: [{ title: 'Legacy article' }],
		} as any);

		const result = await Articles.getV1(ctx, { source: 'techcrunch' });

		expect(result.source).toBe('techcrunch');
		expect(mockMakeNewsApiRequest).toHaveBeenCalledWith(
			'v1/articles',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({ source: 'techcrunch' }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'newsapi.articles.getV1',
			expect.any(Object),
			'completed',
		);
	});

	it('sources.list issues GET /v2/top-headlines/sources and caches by id', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({
			status: 'ok',
			sources: [{ id: 'bbc-news', name: 'BBC News', category: 'general' }],
		} as any);

		const result = await Sources.list(ctx, { category: 'general' });

		expect(result.sources).toHaveLength(1);
		expect(mockMakeNewsApiRequest).toHaveBeenCalledWith(
			'v2/top-headlines/sources',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({ category: 'general' }),
			}),
		);
		expect(ctx.db.sources!.upsertByEntityId).toHaveBeenCalledWith(
			'bbc-news',
			expect.objectContaining({ id: 'bbc-news' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'newsapi.sources.list',
			expect.any(Object),
			'completed',
		);
	});

	it('sources.list works with no input at all', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({
			status: 'ok',
			sources: [],
		} as any);

		const result = await Sources.list(ctx, undefined);

		expect(result.sources).toEqual([]);
		expect(mockMakeNewsApiRequest).toHaveBeenCalledWith(
			'v2/top-headlines/sources',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({
					category: undefined,
					language: undefined,
					country: undefined,
				}),
			}),
		);
	});

	it('articles.getEverything rejects invalid input before calling the client', async () => {
		await expect(
			Articles.getEverything(ctx, { pageSize: 10 } as any),
		).rejects.toThrow();
		expect(mockMakeNewsApiRequest).not.toHaveBeenCalled();
	});

	it('articles.getEverything rejects a malformed provider response', async () => {
		mockMakeNewsApiRequest.mockResolvedValueOnce({ status: 'ok' } as any);

		await expect(
			Articles.getEverything(ctx, { q: 'bitcoin' }),
		).rejects.toThrow();
	});
});

describe('NewsApi input validation', () => {
	it('rejects everything queries missing q, sources, language, and domains', () => {
		const result = NewsApiEndpointInputSchemas.articlesGetEverything.safeParse({
			pageSize: 10,
		});
		expect(result.success).toBe(false);
	});

	it('accepts an everything query with only q set', () => {
		const result = NewsApiEndpointInputSchemas.articlesGetEverything.safeParse({
			q: 'bitcoin',
		});
		expect(result.success).toBe(true);
	});

	it('rejects top-headlines queries that mix sources with country', () => {
		const result =
			NewsApiEndpointInputSchemas.articlesGetTopHeadlines.safeParse({
				sources: 'bbc-news',
				country: 'us',
			});
		expect(result.success).toBe(false);
	});

	it('accepts top-headlines queries with sources alone', () => {
		const result =
			NewsApiEndpointInputSchemas.articlesGetTopHeadlines.safeParse({
				sources: 'bbc-news',
			});
		expect(result.success).toBe(true);
	});

	it('requires a source for the legacy v1 articles endpoint', () => {
		const result = NewsApiEndpointInputSchemas.articlesGetV1.safeParse({});
		expect(result.success).toBe(false);
	});
});
