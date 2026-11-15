import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Account,
	Companies,
	Geo,
	Industries,
	Keywords,
	People,
	Positions,
	Technologies,
} from './endpoints';
import type { CompanyenrichEndpointInputs } from './endpoints/types';
import type { CompanyenrichContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeCompanyEnrichRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeCompanyEnrichRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
const companyId = '00000000-0000-4000-8000-000000000001';
const company = {
	id: companyId,
	domain: 'example.com',
	website: 'https://example.com',
	logoUrl: 'https://example.com/logo.png',
	updatedAt: '2026-10-19T00:00:00.000Z',
};
const person = { id: 101, socials: {}, experiences: [] };
const country = {
	code: 'US',
	name: 'United States',
	latitude: 38,
	longitude: -97,
};

type Context = Parameters<typeof Companies.get>[0];

function buildContext(): Context {
	const context: CompanyenrichContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

function expectLogged(
	event: string,
	payload: object,
	privateValues: string[] = [],
) {
	expect(mockedLogEvent).toHaveBeenCalledTimes(1);
	expect(mockedLogEvent).toHaveBeenCalledWith(
		ctx,
		`companyenrich.${event}`,
		payload,
		'completed',
	);
	const loggedPayload = JSON.stringify(mockedLogEvent.mock.calls[0]?.[2]) ?? '';
	for (const value of ['test-api-key', ...privateValues]) {
		expect(loggedPayload).not.toContain(value);
	}
}

describe('Company endpoints', () => {
	it('companies.get sends GET /v2/companies/{companyId}', async () => {
		mockedRequest.mockResolvedValue(company);
		const result = await Companies.get(ctx, {
			companyId,
			expand: ['financial'],
		});

		expect(result).toEqual(company);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/v2/companies/${companyId}`,
			'test-api-key',
			{ method: 'GET', query: { expand: ['financial'] } },
		);
		expectLogged('companies.get', { count: 1 });
	});

	it('companies.enrichByDomain sends the documented query parameters', async () => {
		mockedRequest.mockResolvedValue(company);
		const result = await Companies.enrichByDomain(ctx, {
			domain: 'example.com',
			waitForEnrichment: false,
		});

		expect(result).toEqual(company);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/enrich',
			'test-api-key',
			{
				method: 'GET',
				query: { domain: 'example.com', waitForEnrichment: false },
			},
		);
		expectLogged('companies.enrichByDomain', { count: 1 });
	});

	it('companies.enrichByProperties sends identifying properties in the POST body', async () => {
		mockedRequest.mockResolvedValue(company);
		const linkedinUrl = 'https://www.linkedin.com/company/example';
		const input: CompanyenrichEndpointInputs['companiesEnrichByProperties'] = {
			name: 'Example Inc',
			linkedinUrl,
		};
		const result = await Companies.enrichByProperties(ctx, input);

		expect(result).toEqual(company);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/enrich',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('companies.enrichByProperties', { count: 1 }, [linkedinUrl]);
	});

	it('companies.enrichBatch sends domains and expansion in the POST body', async () => {
		const response = {
			items: [
				{ domain: 'example.com', status: 'found', company },
				{ domain: 'missing.example', status: 'not-found' },
			],
		};
		mockedRequest.mockResolvedValue(response);
		const input: CompanyenrichEndpointInputs['companiesEnrichBatch'] = {
			domains: ['example.com', 'missing.example'],
			expand: ['financial'],
		};

		const result = await Companies.enrichBatch(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/enrich/batch',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('companies.enrichBatch', { count: 2, found: 1 });
	});

	it('companies.autocomplete sends GET /v2/companies/autocomplete', async () => {
		const response = {
			items: [
				{
					id: companyId,
					name: 'Example Inc',
					domain: 'example.com',
					logoUrl: 'https://example.com/logo.png',
				},
			],
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Companies.autocomplete(ctx, { query: 'example' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/autocomplete',
			'test-api-key',
			{ method: 'GET', query: { query: 'example' } },
		);
		expectLogged('companies.autocomplete', { count: 1 });
	});

	it('companies.workforce uses exactly one company identifier and cursor', async () => {
		const response = {
			companyId,
			domain: 'example.com',
			observedEmployeeCount: 10,
			departmentHeadcount: {},
			unclassifiedHeadcount: 0,
			historyFrom: '2025-01-01',
			historyTo: '2026-01-01',
			history: [],
			nextCursor: 'older-history',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Companies.workforce(ctx, {
			id: companyId,
			cursor: 'current-history',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/workforce',
			'test-api-key',
			{ method: 'GET', query: { id: companyId, cursor: 'current-history' } },
		);
		expectLogged('companies.workforce', { count: 1, historyPoints: 0 });
	});

	it('companies.search sends a cursor-paginated POST body', async () => {
		const input = { pageSize: 10, filter: { domain: 'example.com' } };
		const response = { items: [company], nextCursor: 'next-page' };
		mockedRequest.mockResolvedValue(response);
		const result = await Companies.search(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/search',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('companies.search', { count: 1 });
	});

	it('companies.searchCount sends search filters and returns the count envelope', async () => {
		const input: CompanyenrichEndpointInputs['companiesSearchCount'] = {
			filter: { type: 'private' },
		};
		const response = { count: 1, total: 1 };
		mockedRequest.mockResolvedValue(response);
		const result = await Companies.searchCount(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/search/count',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('companies.searchCount', { resultCount: 1 });
	});

	it('companies.searchPreview sends the lookalike query without pagination', async () => {
		const input = { lookalike: { domains: ['example.com'] } };
		const response = {
			items: [
				{
					id: companyId,
					logoUrl: 'https://example.com/logo.png',
					updatedAt: '2026-10-19T00:00:00.000Z',
				},
			],
			total: 1,
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Companies.searchPreview(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/search/preview',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('companies.searchPreview', { count: 1 });
	});

	it('accepts nullable filters in semantic interpretation responses', async () => {
		const interpretation = {
			filter: {
				query: null,
				country: null,
				foundedYear: { min: null, max: 2020 },
				fundingAmount: { min: 1_000_000, max: null },
				fundingYear: { min: null, max: 2024 },
				workforceGrowth: {
					period: null,
					department: null,
					min: null,
					max: 0.2,
				},
				workforceSize: [{ department: null, min: null, max: 10 }],
			},
		};
		const previewItem = {
			id: companyId,
			logoUrl: 'https://example.com/logo.png',
			updatedAt: '2026-10-19T00:00:00.000Z',
		};

		mockedRequest.mockResolvedValueOnce({
			items: [company],
			nextCursor: null,
			interpretation,
		});
		await expect(
			Companies.search(ctx, { semantic: { query: 'SaaS in the US' } }),
		).resolves.toMatchObject({ interpretation });

		mockedRequest.mockResolvedValueOnce({ count: 1, total: 1, interpretation });
		await expect(
			Companies.searchCount(ctx, {
				semantic: { query: 'SaaS in the US' },
			}),
		).resolves.toMatchObject({ interpretation });

		mockedRequest.mockResolvedValueOnce({
			items: [previewItem],
			total: 1,
			interpretation,
		});
		await expect(
			Companies.searchPreview(ctx, {
				semantic: { query: 'SaaS in the US' },
			}),
		).resolves.toMatchObject({ interpretation });
	});

	it('rejects an invalid company input before making a request', async () => {
		await expect(
			Companies.enrichByDomain(ctx, { domain: 'x'.repeat(1025) }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('People endpoints', () => {
	it('people.get sends the numeric person ID and education expansion', async () => {
		mockedRequest.mockResolvedValue(person);
		const result = await People.get(ctx, {
			personId: 101,
			expand: ['education'],
		});

		expect(result).toEqual(person);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/101',
			'test-api-key',
			{ method: 'GET', query: { expand: ['education'] } },
		);
		expectLogged('people.get', { count: 1 });
	});

	it('people.enrich sends the email only in the POST body and never logs it', async () => {
		mockedRequest.mockResolvedValue(person);
		const input = { email: 'person@example.com' };
		const result = await People.enrich(ctx, input);

		expect(result).toEqual(person);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/enrich',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('people.enrich', { count: 1 }, [input.email]);
	});

	it('people.findEmail returns the documented status and never logs the found email', async () => {
		const response = {
			personId: 101,
			domain: 'example.com',
			status: 'found',
			email: 'private.person@example.com',
			certainty: 'high',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await People.findEmail(ctx, {
			personId: 101,
			domain: 'example.com',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/101/email',
			'test-api-key',
			{ method: 'GET', query: { domain: 'example.com' } },
		);
		expectLogged('people.findEmail', { count: 1, found: true }, [
			response.email,
		]);
	});

	it('people.search sends filter and cursor pagination in a POST body', async () => {
		const input = {
			pageSize: 10,
			cursor: 'people-cursor',
			filter: { position: 'Engineer' },
		};
		const response = { items: [person], nextCursor: 'next-people-page' };
		mockedRequest.mockResolvedValue(response);
		const result = await People.search(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/search',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('people.search', { count: 1 });
	});

	it('people.search forwards a semantic query, company expansion and name rules, and keeps the interpretation', async () => {
		const input = {
			semantic: { query: 'marketing leaders at fintech startups in London' },
			expand: ['company' as const],
			filter: { query: { in: ['Ada', 'Grace'], notIn: ['Bob'] } },
		};
		const response = {
			items: [person],
			nextCursor: null,
			interpretation: {
				companyNames: [],
				filter: { seniority: ['head', 'vp'], country: 'GB' },
				company: { query: 'fintech startups', filter: { country: 'GB' } },
			},
		};
		mockedRequest.mockResolvedValue(response);
		const result = await People.search(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/search',
			'test-api-key',
			{ method: 'POST', body: input },
		);
	});

	it('people.searchCount forwards a semantic query', async () => {
		const input = { semantic: { query: 'founders in Berlin' } };
		const response = {
			count: 3,
			total: 3,
			interpretation: { filter: { seniority: 'founder' } },
		};
		mockedRequest.mockResolvedValue(response);
		const result = await People.searchCount(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/search/count',
			'test-api-key',
			{ method: 'POST', body: input },
		);
	});

	it('companies.searchCount accepts several name queries', async () => {
		const input = { filter: { query: ['stripe', 'adyen'] } };
		mockedRequest.mockResolvedValue({ count: 2, total: 2 });
		await Companies.searchCount(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/companies/search/count',
			'test-api-key',
			{ method: 'POST', body: input },
		);
	});

	it('people.searchCount sends filters without pagination', async () => {
		const input = { filter: { country: 'US' } };
		const response = { count: 1, total: 1 };
		mockedRequest.mockResolvedValue(response);
		const result = await People.searchCount(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/search/count',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('people.searchCount', { resultCount: 1 });
	});

	it('people.searchPreview returns only preview fields', async () => {
		const input = { filter: { position: 'Engineer' } };
		const response = {
			items: [{ id: 101, experiences: [{ isCurrent: true }] }],
			total: 1,
		};
		mockedRequest.mockResolvedValue(response);
		const result = await People.searchPreview(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/people/search/preview',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('people.searchPreview', { count: 1 });
	});

	it('rejects invalid people input before making a request', async () => {
		await expect(
			People.enrich(ctx, { email: 'not-an-email' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('Geographic endpoints', () => {
	it('geo.regions returns the items envelope', async () => {
		const response = {
			items: [{ id: 'americas', name: 'Americas', countryCodes: ['US'] }],
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Geo.regions(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/geo/regions',
			'test-api-key',
			{ method: 'GET' },
		);
		expectLogged('geo.regions', { count: 1 });
	});

	it('geo.getCountry encodes the two-letter country code in the path', async () => {
		mockedRequest.mockResolvedValue(country);
		const result = await Geo.getCountry(ctx, { countryCode: 'US' });

		expect(result).toEqual(country);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/geo/countries/US',
			'test-api-key',
			{ method: 'GET' },
		);
		expectLogged('geo.getCountry', { count: 1 });
	});

	it('geo.searchCountries sends its cursor-paginated body', async () => {
		const input = { query: 'United', pageSize: 10, cursor: 'country-cursor' };
		const response = { items: [country], nextCursor: 'next-countries' };
		mockedRequest.mockResolvedValue(response);
		const result = await Geo.searchCountries(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/geo/countries',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('geo.searchCountries', { count: 1 });
	});

	it('geo.searchStates sends country filters and cursor pagination', async () => {
		const input = {
			countryCodes: ['US'],
			query: 'California',
			pageSize: 10,
			cursor: 'state-cursor',
		};
		const response = {
			items: [{ id: 1, name: 'California', code: 'CA', countryCode: 'US' }],
			nextCursor: 'next-states',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Geo.searchStates(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/geo/states',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('geo.searchStates', { count: 1 });
	});

	it('geo.searchCities sends state and country filters', async () => {
		const input = { stateIds: [1], countryCodes: ['US'], pageSize: 10 };
		const response = {
			items: [{ id: 1, name: 'San Francisco', countryCode: 'US', stateId: 1 }],
			nextCursor: 'next-cities',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Geo.searchCities(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/geo/cities',
			'test-api-key',
			{ method: 'POST', body: input },
		);
		expectLogged('geo.searchCities', { count: 1 });
	});

	it('rejects invalid geo input before making a request', async () => {
		await expect(Geo.getCountry(ctx, { countryCode: 'USA' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('Reference-data and account endpoints', () => {
	it('industries.list returns the items envelope', async () => {
		const response = { items: [{ name: 'Technology', naicsCodes: ['54'] }] };
		mockedRequest.mockResolvedValue(response);
		const result = await Industries.list(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/industries',
			'test-api-key',
			{ method: 'GET' },
		);
		expectLogged('industries.list', { count: 1 });
	});

	it('keywords.autocomplete sends its required query parameter', async () => {
		const response = { items: ['technology'] };
		mockedRequest.mockResolvedValue(response);
		const result = await Keywords.autocomplete(ctx, { query: 'technology' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/keywords/autocomplete',
			'test-api-key',
			{ method: 'GET', query: { query: 'technology' } },
		);
		expectLogged('keywords.autocomplete', { count: 1 });
	});

	it('technologies.autocomplete sends its required query parameter', async () => {
		const response = { items: ['React'] };
		mockedRequest.mockResolvedValue(response);
		const result = await Technologies.autocomplete(ctx, { query: 'react' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/technologies/autocomplete',
			'test-api-key',
			{ method: 'GET', query: { query: 'react' } },
		);
		expectLogged('technologies.autocomplete', { count: 1 });
	});

	it('positions.autocomplete sends its required query parameter', async () => {
		const response = { items: ['Engineer'] };
		mockedRequest.mockResolvedValue(response);
		const result = await Positions.autocomplete(ctx, { query: 'engineer' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v2/positions/autocomplete',
			'test-api-key',
			{ method: 'GET', query: { query: 'engineer' } },
		);
		expectLogged('positions.autocomplete', { count: 1 });
	});

	it('account.me sends a read-only GET and logs no account fields', async () => {
		const response = {
			userId: '00000000-0000-4000-8000-000000000002',
			credits: { used: 0, total: 100 },
			capabilities: {
				lists: false,
				previews: true,
				companySearchLimit: 100,
				companySearchAsyncLimit: 0,
				peopleSearchLimit: 100,
				searchTermLimit: 250,
			},
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Account.me(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/v2/me', 'test-api-key', {
			method: 'GET',
		});
		expectLogged('account.me', { count: 1 }, [
			'00000000-0000-4000-8000-000000000002',
		]);
	});

	it('rejects an invalid autocomplete query before making a request', async () => {
		await expect(
			Keywords.autocomplete(ctx, { query: 'x'.repeat(101) }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});
