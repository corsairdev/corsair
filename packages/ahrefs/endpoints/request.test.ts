import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { makeAhrefsRequest } from '../client';
import { ahrefs } from '../index';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAhrefsRequest: jest.fn(async () => ({ ok: true })),
}));

const mockedRequest = makeAhrefsRequest as jest.MockedFunction<
	typeof makeAhrefsRequest
>;
const ctx = {
	key: 'test-key',
	$getAccountId: async () => 'acct',
	database: undefined,
} as never;
const plugin = ahrefs({ key: 'test-key' });
if (!plugin.endpoints) throw new Error('ahrefs plugin has no endpoints');
const endpoints = plugin.endpoints;

let warn: jest.SpyInstance;
// Recorded Ahrefs responses, keyed by action; each test hands its action a
// real response so the output check passes and only the request is asserted.
const recorded = JSON.parse(
	readFileSync(
		join(__dirname, '..', '__fixtures__', 'live-responses.json'),
		'utf8',
	),
) as Record<string, { response: object }>;
const respondWith = (action: string) =>
	mockedRequest.mockResolvedValueOnce(recorded[action]?.response ?? {});

beforeEach(() => {
	mockedRequest.mockClear();
	warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterEach(() => warn.mockRestore());

describe('callAhrefs request building', () => {
	it('sends GET reads as query parameters only', async () => {
		respondWith('webAnalytics.browsers');
		await endpoints.webAnalytics.browsers(ctx, {
			project_id: 7,
			from: '2026-10-01',
			limit: 3,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/web-analytics/browsers',
			'test-key',
			{
				method: 'GET',
				query: { project_id: 7, from: '2026-10-01', limit: 3 },
				body: undefined,
			},
		);
	});

	it('splits a PUT into query id and JSON body', async () => {
		respondWith('management.addProjectKeywords');
		await endpoints.management.addProjectKeywords(ctx, {
			project_id: 9,
			keywords: [{ keyword: 'example' }],
			locations: [{ country: 'us', language: 'en' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/management/project-keywords',
			'test-key',
			{
				method: 'PUT',
				query: { project_id: 9 },
				body: {
					keywords: [{ keyword: 'example' }],
					locations: [{ country: 'us', language: 'en' }],
				},
			},
		);
	});

	it('sends a DELETE with ids in the query', async () => {
		respondWith('management.deleteKeywordLists');
		await endpoints.management.deleteKeywordLists(ctx, {
			keyword_list_ids: '12,13',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/management/keyword-lists',
			'test-key',
			{
				method: 'DELETE',
				query: { keyword_list_ids: '12,13' },
				body: undefined,
			},
		);
	});

	it('sends Brand Radar entity reads as a POST body', async () => {
		respondWith('brandRadar.sovOverviewEntities');
		await endpoints.brandRadar.sovOverviewEntities(ctx, {
			data_source: ['chatgpt'],
			brands: [{ names: ['example'] }],
		});
		const call = mockedRequest.mock.calls[0];
		expect(call?.[0]).toBe('/brand-radar/sov-overview');
		expect(call?.[2]?.method).toBe('POST');
		expect(call?.[2]?.body).toEqual({
			data_source: ['chatgpt'],
			brands: [{ names: ['example'] }],
		});
	});
});

describe('callAhrefs schema checks', () => {
	it('rejects invalid input before any request is sent', async () => {
		await expect(
			endpoints.gsc.keywords(ctx, {
				project_id: 1,
				date_from: '10/01/2026',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('drops input keys the endpoint does not declare', async () => {
		respondWith('public.domainRatingFree');
		await endpoints.public.domainRatingFree(ctx, {
			target: 'ahrefs.com',
			...({ injected: 'x' } as object),
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.query).toEqual({
			target: 'ahrefs.com',
		});
	});

	it('returns the parsed response when it matches the schema', async () => {
		mockedRequest.mockResolvedValueOnce({
			domain_rating: { domain_rating: 91, license: 'cc' },
			extra_top_level: true,
		});
		const result = await endpoints.public.domainRatingFree(ctx, {
			target: 'ahrefs.com',
		});
		expect(result).toEqual({
			domain_rating: { domain_rating: 91, license: 'cc' },
		});
		expect(warn).not.toHaveBeenCalled();
	});

	it('throws when a response does not match the schema', async () => {
		mockedRequest.mockResolvedValueOnce({ unexpected: [] });
		await expect(endpoints.public.crawlerIps(ctx, {})).rejects.toThrow(
			'ahrefs.public.crawlerIps',
		);
	});

	it('keeps the Ahrefs parameters the original actions used to drop', async () => {
		mockedRequest.mockResolvedValueOnce({ keywords: [] });
		await endpoints.siteExplorer.organicKeywords(ctx, {
			target: 'ahrefs.com',
			date: '2026-11-01',
			country: 'us',
			select: 'keyword',
			portfolio_id: 12,
			traffic_mode: 'static',
			timeout: 0,
		});
		const [, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(options?.query).toMatchObject({
			portfolio_id: 12,
			traffic_mode: 'static',
			timeout: 0,
		});
	});

	it('sends the older target_mode to Ahrefs as mode', async () => {
		mockedRequest.mockResolvedValueOnce({ keywords: [] });
		await endpoints.keywordsExplorer.overview(ctx, {
			target: 'ahrefs.com',
			target_mode: 'domain',
			country: 'us',
			select: 'keyword',
		});
		const [, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(options?.query).toMatchObject({ mode: 'domain' });
		expect(options?.query).not.toHaveProperty('target_mode');
	});

	it('checks responses on the original actions too', async () => {
		mockedRequest.mockResolvedValueOnce({ unexpected: true });
		await expect(
			endpoints.siteExplorer.getDomainRating(ctx, {
				target: 'ahrefs.com',
				date: '2026-11-01',
			}),
		).rejects.toThrow('ahrefs.siteExplorer.getDomainRating');
	});

	it('accepts rows without the identity column when it was not selected', async () => {
		mockedRequest.mockResolvedValueOnce({ pages: [{ sum_traffic: 120 }] });
		const result = await endpoints.siteExplorer.topPages(ctx, {
			target: 'ahrefs.com',
			date: '2026-11-01',
			country: 'us',
			select: 'sum_traffic',
		});
		expect(result.pages).toEqual([{ sum_traffic: 120 }]);
	});

	it('validates input on the original Site Explorer actions too', async () => {
		await expect(
			endpoints.siteExplorer.getDomainRating(ctx, {
				target: 'ahrefs.com',
				date: 'yesterday',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
