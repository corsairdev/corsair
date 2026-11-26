jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	accountUsageResponse,
	companySearchResponse,
	contactSearchResponse,
	enrichCompaniesResponse,
	enrichContactsResponse,
	jobCompleteResponse,
	searchAndEnrichCompaniesResponse,
	searchAndEnrichContactsResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Lusha request shapes', () => {
	it('searchContacts posts the contacts to /v3/contacts/search', async () => {
		mockFetch(jsonResponse(contactSearchResponse));

		await endpoints.person.searchContacts(makeCtx(), {
			contacts: [{ email: 'orit.shilvock@lusha.com' }],
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/search`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('api_key')).toBe('test-key');
		expect(sentBody()).toEqual({
			contacts: [{ email: 'orit.shilvock@lusha.com' }],
			options: undefined,
			signals: undefined,
		});
	});

	it('enrichContacts posts ids and reveal to /v3/contacts/enrich', async () => {
		mockFetch(jsonResponse(enrichContactsResponse));

		await endpoints.person.enrichContacts(makeCtx(), {
			ids: ['4389064654', '4389064624'],
			reveal: ['emails', 'phones'],
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/enrich`);
		expect(sentBody()).toEqual({
			ids: ['4389064654', '4389064624'],
			reveal: ['emails', 'phones'],
			waterfallEnabled: undefined,
			tableId: undefined,
		});
	});

	it('searchAndEnrichContacts posts contacts plus reveal', async () => {
		mockFetch(jsonResponse(searchAndEnrichContactsResponse));

		await endpoints.person.searchAndEnrichContacts(makeCtx(), {
			contacts: [
				{
					firstName: 'Orit',
					lastName: 'Shilvock',
					companyName: 'Lusha',
					clientReferenceId: 'my-ref-1',
				},
			],
			reveal: ['emails'],
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/search-and-enrich`);
		expect(sentBody()).toEqual({
			contacts: [
				{
					firstName: 'Orit',
					lastName: 'Shilvock',
					companyName: 'Lusha',
					clientReferenceId: 'my-ref-1',
				},
			],
			reveal: ['emails'],
			options: undefined,
		});
	});

	it('searchCompanies posts the companies to /v3/companies/search', async () => {
		mockFetch(jsonResponse(companySearchResponse));

		await endpoints.company.searchCompanies(makeCtx(), {
			companies: [{ domain: 'lusha.com' }],
		});

		expect(lastCall().url).toBe(`${BASE}/v3/companies/search`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			companies: [{ domain: 'lusha.com' }],
			options: undefined,
			signals: undefined,
		});
	});

	it('enrichCompanies posts ids and reveal to /v3/companies/enrich', async () => {
		mockFetch(jsonResponse(enrichCompaniesResponse));

		await endpoints.company.enrichCompanies(makeCtx(), {
			ids: ['16303253'],
			reveal: ['employeesByDepartment', 'competitors'],
			tableId: '482910',
		});

		expect(lastCall().url).toBe(`${BASE}/v3/companies/enrich`);
		expect(sentBody()).toEqual({
			ids: ['16303253'],
			reveal: ['employeesByDepartment', 'competitors'],
			tableId: '482910',
		});
	});

	it('searchAndEnrichCompanies posts companies plus reveal', async () => {
		mockFetch(jsonResponse(searchAndEnrichCompaniesResponse));

		await endpoints.company.searchAndEnrichCompanies(makeCtx(), {
			companies: [{ id: '16303253' }],
			reveal: ['directParent', 'ultimateParent'],
		});

		expect(lastCall().url).toBe(`${BASE}/v3/companies/search-and-enrich`);
		expect(sentBody()).toEqual({
			companies: [{ id: '16303253' }],
			reveal: ['directParent', 'ultimateParent'],
			options: undefined,
		});
	});

	it('getAccountUsage gets /v3/account/usage with no body', async () => {
		mockFetch(jsonResponse(accountUsageResponse));

		await endpoints.account.getAccountUsage(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/v3/account/usage`);
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('getContactsEnrichJob gets /v3/contacts/jobs/{jobId}', async () => {
		mockFetch(jsonResponse(jobCompleteResponse));

		await endpoints.jobs.getContactsEnrichJob(makeCtx(), {
			jobId: 'wf_3f2b9c1e',
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/jobs/wf_3f2b9c1e`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('encodes a job id that needs escaping', async () => {
		mockFetch(jsonResponse(jobCompleteResponse));

		await endpoints.jobs.getContactsEnrichJob(makeCtx(), {
			jobId: 'wf a/b',
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/jobs/wf%20a%2Fb`);
	});
});
