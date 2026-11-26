jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { LushaEndpointInputSchemas as Inputs } from './endpoints/types';
import {
	accountUsageResponse,
	companySearchResponse,
	contactSearchResponse,
	enrichCompaniesResponse,
	enrichContactsResponse,
	enrichHaltedResponse,
	enrichPartialResponse,
	jobCompleteResponse,
	jobFailedResponse,
	jobProcessingResponse,
	searchAndEnrichCompaniesResponse,
	searchAndEnrichContactsResponse,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Lusha output parsing', () => {
	it('searchContacts parses previews and billing', async () => {
		mockFetch(jsonResponse(contactSearchResponse));

		const result = await endpoints.person.searchContacts(makeCtx(), {
			contacts: [{ id: '4389064654' }],
		});

		expect(result.results[0]?.id).toBe('4389064654');
		expect(result.results[0]?.canReveal?.[0]?.credits).toBe(1);
		expect(result.billing?.creditsCharged).toBe(3);
		expect(result.requestId).toBe('3c7f6d96-4a72-40cd-96c1-2efcfabeb727');
	});

	it('enrichContacts parses emails, phones and waterfall status', async () => {
		mockFetch(jsonResponse(enrichContactsResponse));

		const result = await endpoints.person.enrichContacts(makeCtx(), {
			ids: ['4389064654'],
			reveal: ['emails', 'phones'],
		});

		expect(result.results[0]?.emails?.[0]?.email).toBe(
			'orit.shilvock@lusha.com',
		);
		expect(result.results[0]?.phones?.[0]?.doNotCall).toBe(false);
		// Omitted when the waterfall did not run.
		expect(result.status).toBeUndefined();
		expect(result.job).toBeUndefined();
	});

	it('enrichContacts parses the partial status with a job', async () => {
		mockFetch(jsonResponse(enrichPartialResponse));

		const result = await endpoints.person.enrichContacts(makeCtx(), {
			ids: ['4389064624'],
			reveal: ['phones'],
		});

		expect(result.status).toBe('partial');
		expect(result.job?.id).toBe('wf_3f2b9c1e-4a7d-4f3b-9c2e-1d6a5b8c7e90');
		expect(result.job?.status).toBe('processing');
	});

	it('enrichContacts parses the out-of-credits waterfall status', async () => {
		mockFetch(jsonResponse(enrichHaltedResponse));

		const result = await endpoints.person.enrichContacts(makeCtx(), {
			ids: ['4389064624'],
			reveal: ['emails'],
		});

		expect(result.status).toBe('PARTIAL_OUT_OF_CREDITS');
		expect(result.statusReason).toBe('WATERFALL_DISABLED');
	});

	it('searchAndEnrichContacts parses enriched results', async () => {
		mockFetch(jsonResponse(searchAndEnrichContactsResponse));

		const result = await endpoints.person.searchAndEnrichContacts(makeCtx(), {
			contacts: [{ email: 'orit.shilvock@lusha.com' }],
			reveal: ['emails'],
		});

		expect(result.results[0]?.fullName).toBe('Orit Shilvock');
	});

	it('searchCompanies parses company previews', async () => {
		mockFetch(jsonResponse(companySearchResponse));

		const result = await endpoints.company.searchCompanies(makeCtx(), {
			companies: [{ domain: 'lusha.com' }],
		});

		expect(result.results[0]?.employeeCount?.exact).toBe(400);
		expect(result.results[0]?.canReveal?.[0]?.field).toBe(
			'employeesByDepartment',
		);
	});

	it('enrichCompanies parses firmographics', async () => {
		mockFetch(jsonResponse(enrichCompaniesResponse));

		const result = await endpoints.company.enrichCompanies(makeCtx(), {
			ids: ['16303253'],
		});

		expect(result.results[0]?.domain).toBe('lusha.com');
		expect(result.results[0]?.funding?.totalRounds).toBe(3);
		expect(result.results[0]?.sicCodes?.[0]?.code).toBe(7371);
	});

	it('searchAndEnrichCompanies parses enriched companies', async () => {
		mockFetch(jsonResponse(searchAndEnrichCompaniesResponse));

		const result = await endpoints.company.searchAndEnrichCompanies(makeCtx(), {
			companies: [{ domain: 'lusha.com' }],
		});

		expect(result.results[0]?.id).toBe('16303253');
	});

	it('getAccountUsage parses credits, rate limits and pricing', async () => {
		mockFetch(jsonResponse(accountUsageResponse));

		const result = await endpoints.account.getAccountUsage(makeCtx(), {});

		expect(result.credits?.remaining).toBe(3800);
		expect(result.rateLimits?.minute?.limit).toBe(1500);
		// A window may be null.
		expect(result.rateLimits?.hourly).toBeNull();
		expect(result.pricing?.email?.credits).toBe(1);
	});

	it('getContactsEnrichJob parses each terminal shape', async () => {
		mockFetch(jsonResponse(jobProcessingResponse));
		const processing = await endpoints.jobs.getContactsEnrichJob(makeCtx(), {
			jobId: 'wf_1',
		});
		expect(processing.status).toBe('processing');
		expect(processing.retryAfter).toBe(5);

		mockFetch(jsonResponse(jobCompleteResponse));
		const complete = await endpoints.jobs.getContactsEnrichJob(makeCtx(), {
			jobId: 'wf_1',
		});
		expect(complete.status).toBe('complete');
		expect(complete.contacts?.[0]?.id).toBe('4389064654');
		expect(complete.creditsCharged).toBe(2);

		mockFetch(jsonResponse(jobFailedResponse));
		const failed = await endpoints.jobs.getContactsEnrichJob(makeCtx(), {
			jobId: 'wf_1',
		});
		expect(failed.status).toBe('failed');
		expect(failed.reason).toBe('All providers exhausted');
	});
});

describe('Lusha rejections', () => {
	it('rejects a wrong-shaped payload: results is a string', async () => {
		mockFetch(jsonResponse({ requestId: 'x', results: 'nope' }));

		await expect(
			endpoints.person.searchContacts(makeCtx(), {
				contacts: [{ id: '4389064654' }],
			}),
		).rejects.toThrow();
	});

	it('rejects a malformed known field: a result id that is a number', async () => {
		mockFetch(jsonResponse({ results: [{ id: 4389064654 }] }));

		await expect(
			endpoints.person.searchContacts(makeCtx(), {
				contacts: [{ id: '4389064654' }],
			}),
		).rejects.toThrow();
	});

	it('rejects a missing results array', async () => {
		mockFetch(jsonResponse({ requestId: 'x', billing: null }));

		await expect(
			endpoints.company.searchCompanies(makeCtx(), {
				companies: [{ domain: 'lusha.com' }],
			}),
		).rejects.toThrow();
	});

	it('rejects an undocumented enrich status value', async () => {
		mockFetch(
			jsonResponse({ ...enrichPartialResponse, status: 'bogus-status' }),
		);

		await expect(
			endpoints.person.enrichContacts(makeCtx(), {
				ids: ['4389064624'],
			}),
		).rejects.toThrow();
	});

	it('rejects an undocumented job status value', async () => {
		mockFetch(jsonResponse({ ...jobCompleteResponse, status: 'queued' }));

		await expect(
			endpoints.jobs.getContactsEnrichJob(makeCtx(), { jobId: 'wf_1' }),
		).rejects.toThrow();
	});

	it('rejects a statusReason outside the documented reasons', async () => {
		mockFetch(
			jsonResponse({ ...enrichHaltedResponse, statusReason: 'SOMETHING_ELSE' }),
		);

		await expect(
			endpoints.person.enrichContacts(makeCtx(), { ids: ['1'] }),
		).rejects.toThrow();
	});
});

describe('Lusha input validation', () => {
	it('rejects a contact with no identifier', () => {
		expect(
			Inputs.personSearchContacts.safeParse({
				contacts: [{ firstName: 'Orit' }],
			}).success,
		).toBe(false);
	});

	it('rejects a name-only contact with no company', () => {
		expect(
			Inputs.personSearchContacts.safeParse({
				contacts: [{ firstName: 'Orit', lastName: 'Shilvock' }],
			}).success,
		).toBe(false);
	});

	it('accepts each documented identifier, one at a time', () => {
		// unknown: the objects are input fixtures of varying shapes; only the
		// identifier fields differ between cases.
		const parse = (contact: Record<string, unknown>) =>
			Inputs.personSearchContacts.safeParse({ contacts: [contact] }).success;
		expect(parse({ id: '4389064654' })).toBe(true);
		expect(parse({ linkedinUrl: 'https://www.linkedin.com/in/someone' })).toBe(
			true,
		);
		expect(parse({ email: 'orit.shilvock@lusha.com' })).toBe(true);
		expect(
			parse({
				firstName: 'Orit',
				lastName: 'Shilvock',
				companyDomain: 'lusha.com',
			}),
		).toBe(true);
		expect(
			parse({ firstName: 'Orit', lastName: 'Shilvock', companyName: 'Lusha' }),
		).toBe(true);
	});

	it('rejects two identifiers on one contact', () => {
		expect(
			Inputs.personSearchContacts.safeParse({
				contacts: [{ id: '4389064654', email: 'orit.shilvock@lusha.com' }],
			}).success,
		).toBe(false);
	});

	it.each([
		'companySearchCompanies',
		'companySearchAndEnrichCompanies',
	] as const)('%s rejects a company row with no id, name or domain', (op) => {
		expect(
			Inputs[op].safeParse({ companies: [{ clientReferenceId: 'row-1' }] })
				.success,
		).toBe(false);
	});

	it.each([
		'companySearchCompanies',
		'companySearchAndEnrichCompanies',
	] as const)('%s accepts one or several company identifiers', (op) => {
		const parse = (company: Record<string, string>) =>
			Inputs[op].safeParse({ companies: [company] }).success;
		expect(parse({ id: '16303253' })).toBe(true);
		expect(parse({ name: 'Lusha' })).toBe(true);
		expect(parse({ domain: 'lusha.com' })).toBe(true);
		expect(
			parse({ clientReferenceId: 'row-1', name: 'Lusha', domain: 'lusha.com' }),
		).toBe(true);
	});

	it('rejects a malformed email', () => {
		expect(
			Inputs.personSearchContacts.safeParse({
				contacts: [{ email: 'not-an-email' }],
			}).success,
		).toBe(false);
	});

	it('rejects more than 100 contacts', () => {
		const contacts = Array.from({ length: 101 }, () => ({ id: '4389064654' }));
		expect(Inputs.personSearchContacts.safeParse({ contacts }).success).toBe(
			false,
		);
	});

	it('rejects an empty ids list on enrich', () => {
		expect(Inputs.personEnrichContacts.safeParse({ ids: [] }).success).toBe(
			false,
		);
	});

	it('rejects more than 100 ids on enrich', () => {
		const ids = Array.from({ length: 101 }, () => '4389064654');
		expect(Inputs.personEnrichContacts.safeParse({ ids }).success).toBe(false);
		expect(Inputs.companyEnrichCompanies.safeParse({ ids }).success).toBe(
			false,
		);
	});

	it('rejects a reveal token the API does not document', () => {
		expect(
			Inputs.personEnrichContacts.safeParse({
				ids: ['4389064654'],
				reveal: ['faxes'],
			}).success,
		).toBe(false);
		expect(
			Inputs.companyEnrichCompanies.safeParse({
				ids: ['16303253'],
				reveal: ['emails'],
			}).success,
		).toBe(false);
	});

	it('rejects a signals type outside the documented enums', () => {
		expect(
			Inputs.companySearchCompanies.safeParse({
				companies: [{ domain: 'lusha.com' }],
				signals: { types: ['promotion'] },
			}).success,
		).toBe(false);
		expect(
			Inputs.companySearchCompanies.safeParse({
				companies: [{ domain: 'lusha.com' }],
				signals: { types: ['headcountIncrease3m'] },
			}).success,
		).toBe(true);
	});

	it('rejects a maxResultsPerSignal outside 1-100', () => {
		expect(
			Inputs.personSearchContacts.safeParse({
				contacts: [{ id: '4389064654' }],
				signals: { types: ['promotion'], maxResultsPerSignal: 101 },
			}).success,
		).toBe(false);
	});
});
