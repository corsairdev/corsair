import { logEventFromContext } from 'corsair/core';
import { makePDLRequest, requestPdlEnrichment } from './client';
import {
	Autocomplete,
	Company,
	Ip,
	Job,
	Location,
	Person,
	School,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual<typeof import('./client')>('./client');
	return {
		...actual,
		makePDLRequest: jest.fn(),
		requestPdlEnrichment: jest.fn(),
	};
});

const mockRequest = jest.mocked(makePDLRequest);
const mockEnrichment = jest.mocked(requestPdlEnrichment);
const mockLog = jest.mocked(logEventFromContext);

// never parameters: any concrete endpoint function is assignable to this
// (parameters are contravariant), so the table needs no per-entry casts.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function createContext() {
	return {
		key: 'pdl_key_test',
		options: {},
		db: {
			people: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			companies: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

beforeEach(() => {
	mockRequest.mockReset().mockResolvedValue({});
	mockEnrichment.mockReset().mockResolvedValue({});
	mockLog.mockClear();
});

const personEnrichResponse = {
	status: 200,
	likelihood: 7,
	data: {
		pdl_id: 'person_abc',
		full_name: 'grace hopper',
		job_company_name: 'us navy',
	},
};

const searchResponse = { status: 200, data: [], total: 0 };

const bulkResponse = [
	{ status: 200, likelihood: 6, data: { pdl_id: 'person_1' } },
	{ status: 400 },
	{ status: 404 },
];

const ipResponse = {
	status: 200,
	data: {
		ip: { address: '174.110.144.98' },
		company: { name: 'acme', confidence: 'high' },
	},
};

const cases: Array<{
	name: string;
	endpoint: AnyEndpoint;
	input: unknown;
	method: string;
	url: string;
	enrichment?: unknown;
	response?: unknown;
	query?: Record<string, unknown>;
	body?: unknown;
}> = [
	{
		name: 'person.enrich',
		endpoint: Person.enrich,
		input: { profile: 'linkedin.com/in/gracehopper', min_likelihood: 8 },
		method: 'GET',
		url: '/v5/person/enrich',
		enrichment: personEnrichResponse,
		query: { profile: 'linkedin.com/in/gracehopper', min_likelihood: 8 },
	},
	{
		name: 'person.search',
		endpoint: Person.search,
		input: {
			query: { term: { job_company_name: 'people data labs' } },
			size: 10,
		},
		method: 'POST',
		url: '/v5/person/search',
		response: searchResponse,
		body: {
			query: { term: { job_company_name: 'people data labs' } },
			size: 10,
		},
	},
	{
		name: 'person.identify',
		endpoint: Person.identify,
		input: { name: 'grace hopper', company: 'us navy' },
		method: 'GET',
		url: '/v5/person/identify',
		enrichment: {
			status: 200,
			matches: [{ match_score: 95, data: [personEnrichResponse.data] }],
		},
		query: { name: 'grace hopper', company: 'us navy' },
	},
	{
		name: 'person.bulk',
		endpoint: Person.bulk,
		input: {
			requests: [
				{ params: { profile: 'linkedin.com/in/a' } },
				{ params: { email: 'b@example.com' }, metadata: { row: 2 } },
			],
		},
		method: 'POST',
		url: '/v5/person/bulk',
		response: bulkResponse,
		body: {
			requests: [
				{ params: { profile: 'linkedin.com/in/a' } },
				{ params: { email: 'b@example.com' }, metadata: { row: 2 } },
			],
		},
	},
	{
		name: 'company.enrich',
		endpoint: Company.enrich,
		input: { website: 'peopledatalabs.com' },
		method: 'GET',
		url: '/v5/company/enrich',
		enrichment: { status: 200, likelihood: 8, id: 'co_9', name: 'pdl' },
		query: { website: 'peopledatalabs.com' },
	},
	{
		name: 'company.search',
		endpoint: Company.search,
		input: { sql: "SELECT * FROM company WHERE tags='mobile'", size: 5 },
		method: 'POST',
		url: '/v5/company/search',
		response: searchResponse,
		body: { sql: "SELECT * FROM company WHERE tags='mobile'", size: 5 },
	},
	{
		name: 'company.clean',
		endpoint: Company.clean,
		input: { website: 'www.peopledatalabs.com' },
		method: 'GET',
		url: '/v5/company/clean',
		response: { status: 200, name: 'people data labs' },
		query: { website: 'www.peopledatalabs.com' },
	},
	{
		name: 'school.clean',
		endpoint: School.clean,
		input: { name: 'harverd' },
		method: 'GET',
		url: '/v5/school/clean',
		response: { status: 200, name: 'harvard university' },
		query: { name: 'harverd' },
	},
	{
		name: 'location.clean',
		endpoint: Location.clean,
		input: { location: 'san fransisco' },
		method: 'GET',
		url: '/v5/location/clean',
		response: { status: 200, name: 'san francisco, california, united states' },
		query: { location: 'san fransisco' },
	},
	{
		name: 'ip.enrich',
		endpoint: Ip.enrich,
		input: {
			ip: '174.110.144.98',
			return_if_unmatched: false,
			min_confidence: 'high' as const,
		},
		method: 'GET',
		url: '/v5/ip/enrich',
		enrichment: ipResponse,
		query: {
			ip: '174.110.144.98',
			return_if_unmatched: false,
			min_confidence: 'high',
		},
	},
	{
		name: 'job.search with structured filters',
		endpoint: Job.search,
		input: {
			title: 'software engineer',
			company_website: 'peopledatalabs.com',
			is_active: true,
			size: 10,
		},
		method: 'POST',
		url: '/v5/job_posting/search',
		response: { status: 200, data: [], total: 0 },
		body: {
			title: 'software engineer',
			company_website: 'peopledatalabs.com',
			is_active: true,
			size: 10,
		},
	},
	{
		name: 'job.search with a raw query',
		endpoint: Job.search,
		input: { query: { term: { remote_work_policy: 'full' } } },
		method: 'POST',
		url: '/v5/job_posting/search',
		response: { status: 200, data: [], total: 0 },
		body: { query: { term: { remote_work_policy: 'full' } } },
	},
	{
		name: 'autocomplete.suggest',
		endpoint: Autocomplete.suggest,
		input: { field: 'job_title', text: 'soft' },
		method: 'GET',
		url: '/v5/autocomplete',
		response: {
			fields: ['job_title'],
			data: [{ count: 123, name: 'software engineer' }],
			status: 200,
		},
		query: { field: 'job_title', text: 'soft' },
	},
];

describe('pdl endpoint routing', () => {
	it.each(cases)(
		'$name calls $method $url',
		async ({
			endpoint,
			input,
			method,
			url,
			enrichment,
			response,
			query,
			body,
		}) => {
			const ctx = createContext();
			if (enrichment !== undefined) {
				mockEnrichment.mockResolvedValueOnce(enrichment);
			} else if (response !== undefined) {
				mockRequest.mockResolvedValueOnce(response);
			}
			await endpoint(ctx as never, input as never);

			if (enrichment !== undefined) {
				expect(mockEnrichment).toHaveBeenCalledTimes(1);
				const [calledUrl, calledKey, options] =
					mockEnrichment.mock.calls[0] ?? [];
				expect(calledUrl).toBe(url);
				expect(calledKey).toBe('pdl_key_test');
				expect(options?.query).toEqual(query);
				expect(mockRequest).not.toHaveBeenCalled();
				return;
			}

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [calledUrl, calledKey, options] = mockRequest.mock.calls[0] ?? [];
			expect(calledUrl).toBe(url);
			expect(calledKey).toBe('pdl_key_test');
			expect(options?.method ?? 'GET').toBe(method);
			if (query !== undefined) {
				expect(options?.query).toEqual(query);
			}
			if (body !== undefined) {
				expect(options?.body).toEqual(body);
			}
		},
	);

	it('person.search passes scroll_token and dataset through the body', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 200,
			data: [],
			total: 0,
			scroll_token: 'abc123',
		});
		await Person.search(
			createContext() as never,
			{
				query: { exists: { field: 'phone_numbers' } },
				scroll_token: 'abc123',
				dataset: 'phone,-resume',
			} as never,
		);

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({
			query: { exists: { field: 'phone_numbers' } },
			scroll_token: 'abc123',
			dataset: 'phone,-resume',
		});
	});

	it('person.enrich translates the 404 no-match outcome to found:false', async () => {
		mockEnrichment.mockResolvedValueOnce(null);
		const ctx = createContext();
		const result = await Person.enrich(
			ctx as never,
			{
				profile: 'linkedin.com/in/nobody',
			} as never,
		);

		expect(result).toEqual({ found: false });
		expect(ctx.db.people.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('person.identify translates the 404 no-match outcome to found:false', async () => {
		mockEnrichment.mockResolvedValueOnce(null);
		const ctx = createContext();
		const result = await Person.identify(
			ctx as never,
			{
				name: 'nobody',
				company: 'nowhere',
			} as never,
		);

		expect(result).toEqual({ found: false });
	});

	it('ip.enrich translates the 404 no-match outcome to found:false', async () => {
		mockEnrichment.mockResolvedValueOnce(null);
		const ctx = createContext();
		const result = await Ip.enrich(
			ctx as never,
			{ ip: '174.110.144.98' } as never,
		);

		expect(result).toEqual({ found: false });
		expect(mockEnrichment).toHaveBeenCalledTimes(1);
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'pdl.ip.enrich',
			{
				found: false,
				ip: '174.110.144.98',
				hasCompany: false,
				hasPerson: false,
			},
			'completed',
		);
	});

	it('company.enrich flattens the response into company and stores it by id', async () => {
		mockEnrichment.mockResolvedValueOnce({
			status: 200,
			likelihood: 9,
			id: 'co_9',
			name: 'people data labs',
			website: 'peopledatalabs.com',
		});
		const ctx = createContext();
		const result = await Company.enrich(
			ctx as never,
			{
				website: 'peopledatalabs.com',
			} as never,
		);

		expect(result).toEqual({
			found: true,
			status: 200,
			likelihood: 9,
			company: {
				id: 'co_9',
				name: 'people data labs',
				website: 'peopledatalabs.com',
			},
		});
		expect(ctx.db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'co_9',
			expect.objectContaining({ name: 'people data labs', likelihood: 9 }),
		);
	});

	it('person.enrich stores the matched person by pdl_id', async () => {
		mockEnrichment.mockResolvedValueOnce(personEnrichResponse);
		const ctx = createContext();
		await Person.enrich(
			ctx as never,
			{
				profile: 'linkedin.com/in/gracehopper',
			} as never,
		);

		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'person_abc',
			expect.objectContaining({
				pdlId: 'person_abc',
				name: 'grace hopper',
				likelihood: 7,
			}),
		);
	});

	it('person.enrich still returns the match when the cache write fails', async () => {
		mockEnrichment.mockResolvedValueOnce(personEnrichResponse);
		const ctx = createContext();
		ctx.db.people.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await Person.enrich(
			ctx as never,
			{
				profile: 'linkedin.com/in/gracehopper',
			} as never,
		);

		expect(result).toEqual({
			found: true,
			status: 200,
			likelihood: 7,
			data: personEnrichResponse.data,
		});
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('location.clean logs the flattened cleaned name', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 200,
			name: 'san francisco, california, united states',
		});
		const ctx = createContext();
		await Location.clean(ctx as never, { location: 'san fransisco' } as never);

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'pdl.location.clean',
			{
				input: 'san fransisco',
				cleaned: 'san francisco, california, united states',
			},
			'completed',
		);
	});

	it('person.bulk surfaces per-item failures without failing the call', async () => {
		mockRequest.mockResolvedValueOnce(bulkResponse);
		const ctx = createContext();
		const result = await Person.bulk(
			ctx as never,
			{
				requests: [
					{ params: { profile: 'linkedin.com/in/a' } },
					{ params: { email: 'b@example.com' } },
					{ params: { lid: 'c' } },
				],
			} as never,
		);

		expect(result).toEqual(bulkResponse);
		expect(result[1]).toMatchObject({ status: 400 });
		expect(result[2]).toMatchObject({ status: 404 });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'pdl.person.bulk',
			expect.objectContaining({ requestCount: 3, matched: 1, failed: 2 }),
			'completed',
		);
	});

	it('rejects enrichment inputs below the documented minimum before the wire', async () => {
		const ctx = createContext();
		await expect(
			Person.enrich(ctx as never, { name: 'grace hopper' } as never),
		).rejects.toThrow(/minimum|needs/);
		expect(mockEnrichment).not.toHaveBeenCalled();

		await expect(
			Person.enrich(
				ctx as never,
				{
					first_name: 'grace',
					last_name: 'hopper',
				} as never,
			),
		).rejects.toThrow();
		expect(mockEnrichment).not.toHaveBeenCalled();
	});

	it('rejects company.enrich without name, ticker, website, or profile', async () => {
		const ctx = createContext();
		await expect(
			Company.enrich(ctx as never, { country: 'us' } as never),
		).rejects.toThrow();
		expect(mockEnrichment).not.toHaveBeenCalled();
	});

	it('rejects a search with both query and sql before the wire', async () => {
		const ctx = createContext();
		await expect(
			Person.search(
				ctx as never,
				{
					query: { match_all: {} },
					sql: 'SELECT * FROM person',
				} as never,
			),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a malformed vendor response', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ status: 200, nope: true });
		await expect(
			Company.search(ctx as never, { query: { match_all: {} } } as never),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
