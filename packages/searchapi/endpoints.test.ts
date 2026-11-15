import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { SearchApiContext } from './context';
import {
	getAccount,
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
		expect(result.results[0]?.link).toBe('https://example.com');
		expect(JSON.stringify(result.results)).not.toContain('secret-query');
		expect(upsert.mock.calls[0]?.[1]).toEqual(result.search);
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
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
