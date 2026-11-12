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
const endpoints = ahrefs({ key: 'test-key' }).endpoints;

beforeEach(() => mockedRequest.mockClear());

describe('callAhrefs request building', () => {
	it('sends GET reads as query parameters only', async () => {
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
