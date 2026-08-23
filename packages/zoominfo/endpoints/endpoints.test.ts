import type { ZoominfoContext } from '..';
import * as client from '../client';
import {
	enrichCompany,
	enrichContact,
	enrichIntent,
	enrichLocation,
	enrichNews,
	enrichScoop,
	enrichTechnology,
} from './enrichments';
import {
	getCompanySearchInputFields,
	getContactSearchInputFields,
	getIntentSearchInputFields,
	getNewsSearchInputFields,
	getScoopSearchInputFields,
} from './input-fields';
import {
	searchCompanies,
	searchContacts,
	searchIntent,
	searchNews,
	searchScoops,
} from './searches';
import { describeInput } from './shared';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const { logEventFromContext } = jest.requireMock('corsair/core') as {
	logEventFromContext: jest.Mock;
};

const requestSpy = jest.spyOn(client, 'makeZoominfoRequest');

function makeCtx(): ZoominfoContext {
	return { key: 'test-jwt' } as unknown as ZoominfoContext;
}

beforeEach(() => {
	requestSpy.mockReset();
	logEventFromContext.mockClear();
});

// Response bodies below are ZoomInfo's own documented examples.
const companySearchBody = {
	maxResults: 15,
	totalResults: 15,
	currentPage: 1,
	data: [{ id: 114804067, name: 'Holy Names University' }],
};

describe('request construction', () => {
	it('posts company search to search/company, not contacts', async () => {
		requestSpy.mockResolvedValue(companySearchBody);

		await searchCompanies(makeCtx(), { companyName: 'ZoomInfo' });

		expect(requestSpy).toHaveBeenCalledWith(
			'search/company',
			'test-jwt',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it.each([
		['searchContacts', 'search/contact', searchContacts],
		['searchIntent', 'search/intent', searchIntent],
		['searchNews', 'search/news', searchNews],
		['searchScoops', 'search/scoop', searchScoops],
	])('routes %s to %s', async (_name, path, endpoint) => {
		requestSpy.mockResolvedValue({ currentPage: 1, data: [] });

		await (endpoint as (c: ZoominfoContext, i: unknown) => Promise<unknown>)(
			makeCtx(),
			{},
		);

		expect(requestSpy).toHaveBeenCalledWith(
			path,
			'test-jwt',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	// The five company-scoped enrichments share a request shape, so they are
	// covered together; company and contact take match-input lists instead and
	// are exercised separately below.
	it.each([
		['enrichIntent', 'enrich/intent', enrichIntent],
		['enrichLocation', 'enrich/location', enrichLocation],
		['enrichNews', 'enrich/news', enrichNews],
		['enrichScoop', 'enrich/scoop', enrichScoop],
		['enrichTechnology', 'enrich/tech', enrichTechnology],
	])('routes %s to %s', async (_name, path, endpoint) => {
		requestSpy.mockResolvedValue({ currentPage: 1, data: [] });

		await (endpoint as (c: ZoominfoContext, i: unknown) => Promise<unknown>)(
			makeCtx(),
			{ companyId: '344589814' },
		);

		expect(requestSpy).toHaveBeenCalledWith(
			path,
			'test-jwt',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it.each([
		[
			'company',
			'lookup/inputfields/company/search',
			getCompanySearchInputFields,
		],
		[
			'contact',
			'lookup/inputfields/contact/search',
			getContactSearchInputFields,
		],
		['intent', 'lookup/inputfields/intent/search', getIntentSearchInputFields],
		['news', 'lookup/inputfields/news/search', getNewsSearchInputFields],
		['scoop', 'lookup/inputfields/scoop/search', getScoopSearchInputFields],
	])(
		'fetches %s input fields over GET with no body',
		async (_resource, path, endpoint) => {
			requestSpy.mockResolvedValue([{ fieldName: 'companyName' }]);

			await endpoint(makeCtx(), {});

			expect(requestSpy).toHaveBeenCalledWith(
				path,
				'test-jwt',
				expect.objectContaining({ method: 'GET', body: undefined }),
			);
		},
	);

	it('forwards only the caller fields that were set', async () => {
		requestSpy.mockResolvedValue(companySearchBody);

		await searchCompanies(makeCtx(), { companyName: 'ZoomInfo', rpp: 25 });

		const call = requestSpy.mock.calls[0];
		expect(call?.[2]?.body).toEqual({ companyName: 'ZoomInfo', rpp: 25 });
	});
});

describe('input validation', () => {
	it('rejects an unknown sort order before calling the API', async () => {
		await expect(
			searchCompanies(makeCtx(), {
				sortOrder: 'sideways',
			} as never),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('rejects a signal score outside ZoomInfo 60-100 range', async () => {
		await expect(
			searchIntent(makeCtx(), { signalScoreMin: 10 }),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('rejects more than the documented 25 companies per enrichment', async () => {
		await expect(
			enrichCompany(makeCtx(), {
				matchCompanyInput: Array.from({ length: 26 }, () => ({
					companyId: 1,
				})),
			}),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('rejects an enrichment entry that carries no identifier', async () => {
		await expect(
			enrichContact(makeCtx(), { matchPersonInput: [{}] }),
		).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('requires a company identifier for the location enrichment', async () => {
		await expect(enrichLocation(makeCtx(), { rpp: 10 })).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});
});

describe('output validation', () => {
	it('returns the parsed body on a well-formed response', async () => {
		requestSpy.mockResolvedValue(companySearchBody);

		const result = await searchCompanies(makeCtx(), {});

		expect(result.totalResults).toBe(15);
		expect(result.data[0]).toMatchObject({ id: 114804067 });
	});

	it('accepts a news response even though it omits totalResults', async () => {
		requestSpy.mockResolvedValue({
			currentPage: 1,
			maxResults: 30,
			data: [{ domain: 'newstral.com', title: 'A headline' }],
		});

		const result = await searchNews(makeCtx(), {});

		expect(result.totalResults).toBeUndefined();
		expect(result.data).toHaveLength(1);
	});

	it('keeps fields ZoomInfo adds that the schema does not name', async () => {
		requestSpy.mockResolvedValue({
			...companySearchBody,
			data: [{ id: 1, name: 'Acme', somethingNew: 'kept' }],
		});

		const result = await searchCompanies(makeCtx(), {});

		expect(result.data[0]).toMatchObject({ somethingNew: 'kept' });
	});

	it('throws when the response is not the documented shape', async () => {
		requestSpy.mockResolvedValue({ companies: [{ id: 1 }] });

		await expect(searchCompanies(makeCtx(), {})).rejects.toThrow();
	});

	it('returns a contact enrichment in the match-result envelope', async () => {
		// /enrich/contact answers with { success, data: { outputFields, result } }
		// rather than the paged envelope the searches use.
		requestSpy.mockResolvedValue({
			success: true,
			data: {
				outputFields: [['id', 'firstName']],
				result: [
					{
						input: { firstname: 'henry', lastname: 'schuck' },
						data: [{ id: 1260398587, firstName: 'Henry' }],
					},
				],
			},
		});

		const result = await enrichContact(makeCtx(), {
			matchPersonInput: [{ firstName: 'Henry', lastName: 'Schuck' }],
		});

		expect(requestSpy).toHaveBeenCalledWith(
			'enrich/contact',
			'test-jwt',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.data.result).toHaveLength(1);
	});

	it('returns intent signals for a company', async () => {
		requestSpy.mockResolvedValue({
			maxResults: 8,
			totalResults: 8,
			currentPage: 1,
			data: [
				{
					id: '3e706b1e-97ab-42cc-95f6-1a8d5176c6c7',
					topic: 'Mobile / Wireless',
					signalScore: 82,
					audienceStrength: 'A',
				},
			],
		});

		const result = await enrichIntent(makeCtx(), {
			companyId: '344589814',
		});

		expect(requestSpy).toHaveBeenCalledWith(
			'enrich/intent',
			'test-jwt',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.data[0]).toMatchObject({ signalScore: 82 });
	});

	it('rejects an intent enrichment with no company identifier', async () => {
		await expect(enrichIntent(makeCtx(), { rpp: 5 })).rejects.toThrow();

		expect(requestSpy).not.toHaveBeenCalled();
	});

	it('returns news articles for a company', async () => {
		requestSpy.mockResolvedValue({
			maxResults: 48,
			totalResults: 5,
			currentPage: 1,
			data: [
				{
					domain: 'www.businesswire.com',
					title: 'Arvind Krishna Elected IBM Chairman',
					pageDate: '2020-12-16T09:11:00.000Z',
					categories: ['PERSON'],
					company: [{ id: 18579882, name: 'IBM' }],
				},
			],
		});

		const result = await enrichNews(makeCtx(), { companyId: '18579882' });

		expect(result.data[0]).toMatchObject({ domain: 'www.businesswire.com' });
	});

	it('returns scoops for a company', async () => {
		requestSpy.mockResolvedValue({
			maxResults: 9,
			totalResults: 9,
			currentPage: 1,
			data: [
				{
					id: 1258709,
					publishedDate: '12/4/2018 12:00 AM',
					description: 'recognized as a Top Place to Work',
					types: [{ id: 6, type: 'Award' }],
					company: { id: 344589814, name: 'ZoomInfo' },
				},
			],
		});

		const result = await enrichScoop(makeCtx(), { companyId: '344589814' });

		expect(result.data[0]).toMatchObject({ id: 1258709 });
	});

	it('returns company locations', async () => {
		requestSpy.mockResolvedValue({
			maxResults: 36,
			totalResults: 36,
			currentPage: 1,
			data: [
				{
					street: '805 Broadway St Ste 900',
					city: 'Vancouver',
					state: 'Washington',
					company: { id: 346572700, addressStatus: 'DEFUNCT' },
				},
			],
		});

		const result = await enrichLocation(makeCtx(), {
			companyId: '346572700',
		});

		expect(result.data[0]).toMatchObject({ city: 'Vancouver' });
	});

	it('returns a company enrichment in the match-result envelope', async () => {
		requestSpy.mockResolvedValue({
			success: true,
			data: {
				outputFields: ['id', 'name', 'website'],
				result: [
					{
						input: { companyId: 344589814 },
						data: { id: 344589814, name: 'ZoomInfo' },
					},
				],
			},
		});

		const result = await enrichCompany(makeCtx(), {
			matchCompanyInput: [{ companyId: 344589814 }],
		});

		expect(result.data.result).toHaveLength(1);
	});

	it('returns the technology stack for a company', async () => {
		requestSpy.mockResolvedValue({
			maxResults: 174,
			totalResults: 174,
			currentPage: 1,
			data: [
				{
					tag: '25420',
					vendor: 'Google LLC',
					product: 'Google Compute Engine',
					attribute: '334.194.1',
				},
			],
		});

		const result = await enrichTechnology(makeCtx(), {
			companyId: '344589814',
		});

		expect(result.data[0]).toMatchObject({ product: 'Google Compute Engine' });
	});

	it('returns the input-field listing for a search', async () => {
		requestSpy.mockResolvedValue([
			{
				fieldName: 'companyName',
				fieldType: 'String',
				description: 'Company name',
				accessGranted: 'true',
			},
		]);

		const fields = await getCompanySearchInputFields(makeCtx(), {});

		expect(fields[0]).toMatchObject({
			fieldName: 'companyName',
			accessGranted: 'true',
		});
	});
});

describe('event logging', () => {
	it('records which filters ran without recording their values', async () => {
		requestSpy.mockResolvedValue({ currentPage: 1, data: [] });

		await searchContacts(makeCtx(), {
			emailAddress: 'henry.schuck@zoominfo.com',
			lastName: 'Schuck',
			rpp: 10,
		});

		const [, event, payload] = logEventFromContext.mock.calls[0];
		expect(event).toBe('zoominfo.searchContacts');
		expect(payload).toEqual({
			filters: ['emailAddress', 'lastName'],
			rpp: 10,
		});
		expect(JSON.stringify(payload)).not.toContain('zoominfo.com');
		expect(JSON.stringify(payload)).not.toContain('Schuck');
	});

	it('does not log a call that failed validation', async () => {
		await expect(
			searchCompanies(makeCtx(), { certified: 7 } as never),
		).rejects.toThrow();

		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('summarises input without copying personal values', () => {
		expect(
			describeInput({ firstName: 'Henry', phone: ['(360) 783-6816'], page: 2 }),
		).toEqual({ filters: ['firstName', 'phone'], page: 2 });
	});
});
