import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { SearchApiContext } from './context';
import {
	getAccount,
	getSearch,
	getSearchHtml,
	listLocations,
	runSearch,
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

function context(key?: string, db?: SearchApiContext['db']): SearchApiContext {
	return { key, db } as unknown as SearchApiContext;
}

describe('searchapi', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores account usage and sends api_key as a query param', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			account: {
				current_month_usage: 10,
				monthly_allowance: 100,
				remaining_credits: 0,
				remaining_searches: 90,
			},
			api_usage: { searches_this_hour: 1, hourly_rate_limit: 100 },
			subscription: {
				period_start: '2024-12-04T00:34:59Z',
				period_end: '2025-01-04T00:34:59Z',
			},
		});
		const result = await getAccount(
			context('sekrit', {
				accounts: { upsertByEntityId: upsert },
			} as unknown as SearchApiContext['db']),
			{},
		);
		expect(result.account).toMatchObject({
			id: 'account',
			currentMonthUsage: 10,
			remainingSearches: 90,
		});
		expect(upsert).toHaveBeenCalledWith('account', result.account);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/api/v1/me',
			query: { api_key: 'sekrit' },
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
	});

	it('stores locations and omits the query from the event', async () => {
		mockRequest.mockResolvedValue([
			{
				google_id: 1006886,
				name: 'London',
				canonical_name: 'London,England,United Kingdom',
				country_code: 'GB',
				target_type: 'City',
				lat: 51.5,
				lon: -0.1,
			},
		]);
		const result = await listLocations(context(), { q: 'secret-place' });
		expect(result.locations[0]?.id).toBe('1006886');
		expect(JSON.stringify(result.locations)).not.toContain('51.5');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret-place',
		);
	});

	it('stores search metadata and returns organic links', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			search_metadata: { id: 'search_abc', status: 'Success' },
			search_parameters: { engine: 'google', q: 'secret-query' },
			organic_results: [
				{
					position: 1,
					title: 'Example',
					link: 'https://example.com',
					snippet: 'secret-query',
				},
			],
		});
		const result = await runSearch(
			context(undefined, {
				searches: { upsertByEntityId: upsert },
			} as unknown as SearchApiContext['db']),
			{ engine: 'google', q: 'secret-query' },
		);
		expect(result.search).toEqual({
			id: 'search_abc',
			status: 'Success',
			engine: 'google',
		});
		expect(result.results[0]).toEqual({
			position: 1,
			title: 'Example',
			link: 'https://example.com',
			snippet: 'secret-query',
		});
		// The caller gets the snippet; the stored row and the event never hold the query or results.
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('secret-query');
		expect(upsert.mock.calls[0]?.[1]).toEqual(result.search);
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
	});

	it('sends the common filters and engine params, and returns every other section', async () => {
		// Shape from searchapi.io/docs/google (trimmed).
		mockRequest.mockResolvedValue({
			search_metadata: {
				id: 'search_xyz',
				status: 'Success',
				json_url: 'https://www.searchapi.io/api/v1/searches/search_xyz',
			},
			search_parameters: { engine: 'google', q: 'coffee' },
			search_information: { total_results: 1230000 },
			answer_box: { type: 'organic_result', answer: 'Brewed drink' },
			knowledge_graph: { title: 'Coffee' },
			related_questions: [{ question: 'Is coffee healthy?' }],
			organic_results: [
				{
					position: 1,
					title: 'Coffee',
					link: 'https://en.wikipedia.org/wiki/Coffee',
					displayed_link: 'en.wikipedia.org › wiki › Coffee',
					snippet: 'Coffee is a beverage.',
					source: 'Wikipedia',
					domain: 'en.wikipedia.org',
					sitelinks: { inline: [] },
				},
			],
			pagination: {
				current: 2,
				next: 'https://www.google.com/search?start=20',
			},
		});
		const result = await runSearch(context('k'), {
			engine: 'google',
			q: 'coffee',
			location: 'Austin,Texas,United States',
			gl: 'us',
			hl: 'en',
			device: 'mobile',
			page: 2,
			time_period: 'last_week',
			params: { nfpr: 1, verbatim: true },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/api/v1/search',
			query: {
				engine: 'google',
				q: 'coffee',
				location: 'Austin,Texas,United States',
				gl: 'us',
				hl: 'en',
				device: 'mobile',
				page: 2,
				time_period: 'last_week',
				nfpr: 1,
				verbatim: true,
				api_key: 'k',
			},
		});
		expect(result.results[0]?.snippet).toBe('Coffee is a beverage.');
		expect(result.results[0]?.domain).toBe('en.wikipedia.org');
		expect(Object.keys(result.sections).sort()).toEqual([
			'answer_box',
			'knowledge_graph',
			'pagination',
			'related_questions',
			'search_information',
		]);
	});

	it('runs an engine that takes no q through params', async () => {
		mockRequest.mockResolvedValue({
			search_metadata: { id: 'search_t', status: 'Success' },
			search_parameters: { engine: 'youtube_transcripts' },
			transcripts: [{ text: 'hello', start: 0 }],
		});
		const result = await runSearch(context('k'), {
			engine: 'youtube_transcripts',
			params: { video_id: 'dQw4w9WgXcQ' },
		});
		expect(mockRequest.mock.calls[0]?.[1]?.query).toMatchObject({
			engine: 'youtube_transcripts',
			video_id: 'dQw4w9WgXcQ',
		});
		expect(result.results).toEqual([]);
		expect(result.sections.transcripts).toEqual([{ text: 'hello', start: 0 }]);
	});

	it('keeps params from overriding the key or the engine', async () => {
		await expect(
			runSearch(context('k'), {
				engine: 'google',
				q: 'x',
				params: { api_key: 'other' },
			}),
		).rejects.toThrow();
		await expect(
			runSearch(context('k'), { engine: 'google', params: { engine: 'bing' } }),
		).rejects.toThrow();
		await expect(
			runSearch(context('k'), { engine: 'google' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads a cached search by id', async () => {
		mockRequest.mockResolvedValue({
			search_metadata: { id: 'search_abc', status: 'Success' },
			search_parameters: { engine: 'google_news', q: 'x' },
			organic_results: [
				{
					position: 1,
					title: 'T',
					link: 'https://n.example/a',
					date: '2 hours ago',
				},
			],
		});
		const result = await getSearch(context('k'), { id: 'search_abc' });
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/api/v1/searches/search_abc',
		});
		expect(result.search).toEqual({
			id: 'search_abc',
			status: 'Success',
			engine: 'google_news',
		});
		expect(result.results[0]?.date).toBe('2 hours ago');
	});

	it('rejects a cached search response with no id instead of reusing the requested one', async () => {
		mockRequest.mockResolvedValue({ organic_results: [] });
		await expect(getSearch(context('k'), { id: 'search_abc' })).rejects.toThrow(
			'missing an id',
		);
	});

	it('returns cached HTML and does not store it', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue('<html>secret-page</html>');
		const result = await getSearchHtml(
			context('sekrit', {
				searches: { upsertByEntityId: upsert },
			} as unknown as SearchApiContext['db']),
			{ id: 'search_abc' },
		);
		expect(result.html).toContain('secret-page');
		expect(upsert).not.toHaveBeenCalled();
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret-page',
		);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'text/html',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.url).toBe(
			'/api/v1/searches/search_abc.html',
		);
	});

	it('rejects an unsafe id before calling the API', async () => {
		await expect(getSearchHtml(context(), { id: '../me' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v1/me' },
			{
				url: 'https://www.searchapi.io/api/v1/me',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid API key.' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getAccount(context(), {})).rejects.toBe(error);
	});
});
