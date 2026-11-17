import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import type { SerplyContext } from './context';
import * as More from './endpoints/more';
import { serply } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function ctx(): SerplyContext {
	// unknown: the endpoints read only `key` from the context.
	return { key: 'sk-test' } as unknown as SerplyContext;
}

function sent() {
	const [config, options] = mockRequest.mock.calls[0] ?? [];
	return {
		headers: config?.HEADERS as Record<string, string>,
		method: options?.method,
		url: options?.url,
		query: options?.query,
		body: options?.body,
	};
}

// Bodies trimmed from the response examples at https://serply.io/docs.
const SERP = {
	results: [
		{
			title: 'Result Title',
			description: 'Result description text...',
			position: 1,
			realPosition: 1,
			result_type: 'organic',
			metadata: { display_url: 'example.com' },
			link: 'https://example.com',
		},
	],
	ai_overview: { title: 'AI Overview', metadata: { present: true } },
	ads: [],
	related_questions: [],
	total: null,
	ts: 1.2,
};
const LISTING = {
	kind: 'Listing',
	data: {
		after: 't3_1vpk70t',
		children: [{ kind: 't3', data: { title: 'x', score: 3, num_comments: 1 } }],
	},
};

type Row = [
	string,
	(c: SerplyContext, i: never) => Promise<unknown>,
	Record<string, unknown>,
	string,
	Record<string, string> | undefined,
	unknown,
	Record<string, unknown>,
];

const rows: Row[] = [
	[
		'web.search',
		More.webSearch,
		{ q: 'search api', num: 5, start: 10, gl: 'de' },
		'/v1/search/',
		{ q: 'search api', num: '5', start: '10', gl: 'de' },
		SERP,
		{ results: [{ link: 'https://example.com' }] },
	],
	[
		'bing.search',
		More.bingSearch,
		{ q: 'iphone 14' },
		'/v1/b/search/',
		{ q: 'iphone 14' },
		{
			ads: [],
			adsCount: 0,
			shoppingAds: [],
			results: [
				{
					title: 'T',
					description: 'D',
					realPosition: 2,
					link: 'https://apple.com',
				},
			],
			query: 'iphone 14',
		},
		{ results: [{ realPosition: 2 }] },
	],
	[
		'news.search',
		More.newsSearch,
		{ q: 'tesla', ceid: 'US:en', resolve_links: true },
		'/v1/news/',
		{ q: 'tesla', ceid: 'US:en', resolve_links: 'true' },
		{
			feed: {
				title: 'tesla - Google News',
				entries: [{ title: 'A', link: 'https://news.google.com/x' }],
			},
			entities: [],
		},
		{ feed: { title: 'tesla - Google News' } },
	],
	[
		'videos.search',
		More.videoSearch,
		{ q: 'python tutorial' },
		'/v1/video/',
		{ q: 'python tutorial' },
		{
			results: [
				{
					title: 'Python Full Course',
					link: 'https://www.youtube.com/watch?v=x',
					description: '',
					realPosition: 1,
				},
			],
			ads: [],
		},
		{ results: [{ title: 'Python Full Course' }] },
	],
	[
		'jobs.search',
		More.jobSearch,
		{ q: 'nurse practitioner new york' },
		'/v1/job/search/',
		{ q: 'nurse practitioner new york' },
		{
			jobs: [
				{
					position: 'Nurse Practitioner',
					employer: 'Healthcare System',
					location: 'New York, NY',
					link: 'https://example.com/j',
					posted_at: '2026-08-13',
				},
			],
		},
		{ jobs: [{ employer: 'Healthcare System' }] },
	],
	[
		'products.search',
		More.productSearch,
		{ q: 'iphone 14' },
		'/v1/product/search/',
		{ q: 'iphone 14' },
		{
			products: [
				{
					link: 'https://amazon.com/x',
					asin: 'B09',
					title: 'iPhone',
					price: 914.97,
					real_position: 3,
					review_count: 308,
				},
			],
			ads: [],
		},
		{ products: [{ price: 914.97 }] },
	],
	[
		'ebay.search',
		More.ebaySearch,
		{ q: 'vinyl records' },
		'/v1/ebay/search/',
		{ q: 'vinyl records' },
		{
			results: [
				{
					title: 'Prince LP',
					link: 'https://www.ebay.com/itm/1',
					position: 1,
					result_type: 'organic',
					metadata: { price: '$27.06' },
				},
			],
			total: 0,
			query: 'vinyl records',
		},
		{ results: [{ title: 'Prince LP' }] },
	],
	[
		'reddit.subredditPosts',
		More.redditSubredditPosts,
		{ subreddit: 'python', limit: 10, sort: 'top', t: 'week' },
		'/v1/reddit/subreddit/python',
		{ limit: '10', sort: 'top', t: 'week' },
		LISTING,
		{ data: { after: 't3_1vpk70t' } },
	],
	[
		'reddit.subredditAbout',
		More.redditSubredditAbout,
		{ subreddit: 'python' },
		'/v1/reddit/subreddit/python/about',
		undefined,
		{ display_name: 'Python', subscribers: 1300000 },
		{ subscribers: 1300000 },
	],
	[
		'reddit.userPosts',
		More.redditUserPosts,
		{ username: 'spez', after: 't3_x' },
		'/v1/reddit/user/spez',
		{ after: 't3_x' },
		LISTING,
		{ kind: 'Listing' },
	],
	[
		'reddit.post',
		More.redditPost,
		{ id: '1ul97v0', with_comments: true },
		'/v1/reddit/post/1ul97v0',
		{ with_comments: 'true' },
		{
			id: '1ul97v0',
			title: 'What should an open-source browser solve?',
			score: 2,
			num_comments: 18,
		},
		{ num_comments: 18 },
	],
	[
		'reddit.comments',
		More.redditComments,
		{ id: '1ul97v0' },
		'/v1/reddit/comments/1ul97v0',
		{},
		{
			cached: true,
			data: [
				LISTING,
				{
					kind: 'Listing',
					data: { children: [{ kind: 't1', data: { body: 'hi' } }] },
				},
			],
		},
		{ cached: true },
	],
];

beforeEach(() => {
	jest.clearAllMocks();
});

describe.each(rows)(
	'%s',
	(_name, endpoint, input, url, query, response, expected) => {
		it('sends a GET with the key header and parses the documented answer', async () => {
			mockRequest.mockResolvedValueOnce(response);
			const result = await endpoint(ctx(), input as never);
			expect(sent().method).toBe('GET');
			const [path, search] = (sent().url ?? '').split('?');
			expect(path).toBe(url);
			expect(Object.fromEntries(new URLSearchParams(search ?? ''))).toEqual(
				query ?? {},
			);
			expect(sent().headers['X-Api-Key']).toBe('sk-test');
			expect(result).toMatchObject(expected);
		});
	},
);

describe('pages.fetch', () => {
	it('POSTs the url and response type as JSON', async () => {
		mockRequest.mockResolvedValueOnce({
			data: '# Serply',
			status: 200,
			headers: { 'content-type': 'text/html' },
			config: { url: 'https://serply.io/', method: 'GET' },
		});
		const result = await More.pageFetch(ctx(), {
			url: 'https://serply.io/',
			response_type: 'markdown',
		});
		expect(sent().method).toBe('POST');
		expect(sent().url).toBe('/v1/request');
		expect(sent().body).toEqual({
			url: 'https://serply.io/',
			response_type: 'markdown',
		});
		expect(result.data).toBe('# Serply');
	});
});

describe('query encoding', () => {
	it('writes spaces as + the way Serply parses them', async () => {
		mockRequest.mockResolvedValueOnce({ products: [] });
		await More.productSearch(ctx(), { q: 'mechanical keyboard' });
		expect(sent().url).toBe('/v1/product/search/?q=mechanical+keyboard');
		expect(sent().query).toBeUndefined();
	});
});

describe('pages.fetch in markdown mode', () => {
	it('wraps the plain-text markdown answer as data', async () => {
		mockRequest.mockResolvedValueOnce(
			'Google Search API for AI Agents - Serply.io',
		);
		const result = await More.pageFetch(ctx(), {
			url: 'https://serply.io/',
			response_type: 'markdown',
		});
		expect(result).toEqual({
			data: 'Google Search API for AI Agents - Serply.io',
		});
	});
});

describe('headers, validation and privacy', () => {
	it('sends the proxy region and device as headers, not query values', async () => {
		mockRequest.mockResolvedValueOnce(SERP);
		await More.webSearch(ctx(), {
			q: 'search api',
			proxy_location: 'DE',
			device: 'mobile',
		});
		expect(sent().headers['X-Proxy-Location']).toBe('DE');
		expect(sent().headers['X-User-Agent']).toBe('mobile');
		expect(sent().url).toBe('/v1/search/?q=search+api');
	});

	it('refuses a subreddit name that would change the route', async () => {
		await expect(
			More.redditSubredditPosts(ctx(), { subreddit: '../user/spez' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('fails when the answer lacks its main array', async () => {
		mockRequest.mockResolvedValueOnce({ detail: 'weird' });
		await expect(More.jobSearch(ctx(), { q: 'x' })).rejects.toThrow();
	});

	it('does not log the search terms', async () => {
		mockRequest.mockResolvedValueOnce(SERP);
		await More.webSearch(ctx(), { q: 'private medical question' });
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('medical');
	});
});

describe('risk levels', () => {
	it('keeps every operation read: they are metered lookups', () => {
		const meta = serply().endpointMeta ?? {};
		expect(Object.keys(meta)).toHaveLength(16);
		for (const entry of Object.values(meta))
			expect(entry.riskLevel).toBe('read');
	});
});
