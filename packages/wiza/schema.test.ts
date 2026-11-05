import { Credits, IndividualReveals, Lists, Prospects } from './endpoints';
import {
	WizaEndpointInputSchemas,
	WizaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WizaSchema } from './schema';

jest.mock('./client', () => ({
	makeWizaRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => undefined),
}));

import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeWizaRequest } from './client';

const mockedMakeWizaRequest = jest.mocked(makeWizaRequest);
const mockedLogEventFromContext = jest.mocked(logEventFromContext);

function createMockCtx() {
	return {
		key: 'test-key',
		db: {
			reveals: { upsertByEntityId: jest.fn(async () => undefined) },
			lists: { upsertByEntityId: jest.fn(async () => undefined) },
			prospects: { upsertByEntityId: jest.fn(async () => undefined) },
		},
	} as const;
}

describe('Wiza schema', () => {
	it('declares a semver version and entities', () => {
		expect(WizaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(WizaSchema.entities)).toEqual(
			expect.arrayContaining(['reveals', 'lists', 'prospects']),
		);
	});
});

describe('Wiza endpoint input schemas', () => {
	it('accepts an empty credits input', () => {
		expect(WizaEndpointInputSchemas.creditsGet.safeParse({}).success).toBe(
			true,
		);
	});

	it('accepts a reveal by linkedin profile url', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: {
				profile_url: 'https://www.linkedin.com/in/satyanadella',
			},
			enrichment_level: 'partial',
		});
		expect(result.success).toBe(true);
	});

	it('accepts a reveal by name and company', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { full_name: 'Jane Doe', company: 'Acme' },
			enrichment_level: 'full',
			email_options: { accept_work: true },
		});
		expect(result.success).toBe(true);
	});

	it('rejects a reveal without any identifier', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { company: 'Acme' },
			enrichment_level: 'partial',
		});
		expect(result.success).toBe(false);
	});

	it('accepts email when profile_url is an empty string', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { profile_url: '', email: 'jane@acme.com' },
			enrichment_level: 'partial',
		});
		expect(result.success).toBe(true);
	});

	it('rejects an invalid enrichment level', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { email: 'jane@acme.com' },
			enrichment_level: 'everything',
		});
		expect(result.success).toBe(false);
	});

	it('accepts string and number ids for reveals and lists', () => {
		expect(
			WizaEndpointInputSchemas.individualRevealsGet.safeParse({ id: 42 })
				.success,
		).toBe(true);
		expect(
			WizaEndpointInputSchemas.listsGet.safeParse({ id: 'lst_1' }).success,
		).toBe(true);
	});

	it('accepts prospect search filters and caps size at 30', () => {
		const ok = WizaEndpointInputSchemas.prospectsSearch.safeParse({
			size: 5,
			filters: {
				job_title: [{ v: 'VP of Sales', s: 'i' }],
				location: [{ v: 'San Francisco', b: 'city' }],
			},
		});
		expect(ok.success).toBe(true);
		const tooBig = WizaEndpointInputSchemas.prospectsSearch.safeParse({
			size: 50,
			filters: {},
		});
		expect(tooBig.success).toBe(false);
	});
});

describe('Wiza endpoint output schemas', () => {
	it('parses a credits response with unlimited emails', () => {
		const result = WizaEndpointOutputSchemas.creditsGet.safeParse({
			credits: {
				email_credits: 'unlimited',
				phone_credits: 100,
				export_credits: 0,
				api_credits: 100,
			},
		});
		expect(result.success).toBe(true);
	});

	it('parses a started reveal response', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsStart.safeParse({
			status: { code: 200, message: '' },
			type: 'individual_reveal',
			data: { id: 7, status: 'queued', is_complete: false },
		});
		expect(result.success).toBe(true);
	});

	it('parses a finished reveal with contact data', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsGet.safeParse({
			status: { code: 200 },
			type: 'individual_reveal',
			data: {
				id: 7,
				status: 'finished',
				is_complete: true,
				name: 'Jane Doe',
				email: 'jane@acme.com',
				email_status: 'valid',
				emails: [{ email: 'jane@acme.com', email_status: 'valid' }],
				phones: [{ number: '+15550000000', type: 'mobile' }],
			},
		});
		expect(result.success).toBe(true);
	});

	it('rejects a reveal response with an unknown status', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsGet.safeParse({
			status: { code: 200 },
			data: { id: 7, status: 'exploded', is_complete: false },
		});
		expect(result.success).toBe(false);
	});

	it('parses a list response', () => {
		const result = WizaEndpointOutputSchemas.listsGet.safeParse({
			status: { code: 200 },
			type: 'list',
			data: {
				id: 15,
				name: 'VP of Sales in San Francisco',
				status: 'queued',
				created_at: '2024-01-01T00:00:00Z',
				finished_at: null,
				enrichment_level: 'partial',
			},
		});
		expect(result.success).toBe(true);
	});

	it('parses a prospect search response', () => {
		const result = WizaEndpointOutputSchemas.prospectsSearch.safeParse({
			status: { code: 200 },
			data: {
				total: 8210,
				profiles: [
					{
						full_name: 'Jane Doe',
						linkedin_url: 'linkedin.com/in/janedoe',
						job_title: 'VP of Sales',
						job_company_name: 'Acme',
						location_name: 'san francisco, california, united states',
					},
				],
			},
		});
		expect(result.success).toBe(true);
	});
});

describe('Wiza error handlers', () => {
	const networkError = new Error('ECONNRESET');

	it('does not retry SERVER_ERROR for individualReveals.start', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler(networkError, {
			pluginId: 'wiza',
			operation: 'individualReveals.start',
			input: {},
			originalError: networkError,
		});
		expect(result.maxRetries).toBe(0);
	});

	it('retries SERVER_ERROR for idempotent reads', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler(networkError, {
			pluginId: 'wiza',
			operation: 'individualReveals.get',
			input: {},
			originalError: networkError,
		});
		expect(result.maxRetries).toBe(3);
	});
});

describe('Wiza endpoint handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('credits.get calls provider and logs completion', async () => {
		const ctx = createMockCtx();
		const response = {
			credits: {
				email_credits: 10,
				phone_credits: 5,
				export_credits: 1,
				api_credits: 20,
			},
		};
		mockedMakeWizaRequest.mockResolvedValueOnce(response);

		await expect(Credits.get(ctx as never, {})).resolves.toEqual(response);
		expect(mockedMakeWizaRequest).toHaveBeenCalledWith(
			'/api/meta/credits',
			'test-key',
			{ method: 'GET' },
		);
		expect(mockedLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'wiza.credits.get',
			{ api_credits: 20 },
			'completed',
		);
	});

	it('individualReveals.start persists reveal and propagates api errors', async () => {
		const ctx = createMockCtx();
		const input = {
			individual_reveal: { profile_url: 'https://www.linkedin.com/in/janedoe' },
			enrichment_level: 'partial' as const,
		};
		const response = {
			status: { code: 200, message: 'ok' },
			type: 'individual_reveal',
			data: { id: 7, status: 'queued', is_complete: false },
		};
		mockedMakeWizaRequest.mockResolvedValueOnce(response);

		await expect(IndividualReveals.start(ctx as never, input)).resolves.toEqual(
			response,
		);
		expect(ctx.db.reveals.upsertByEntityId).toHaveBeenCalled();

		const rateLimited = new ApiError(
			{ url: '/api/individual_reveals', method: 'POST' },
			{
				url: '/api/individual_reveals',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: undefined,
			},
			'Rate limited',
		);
		mockedMakeWizaRequest.mockRejectedValueOnce(rateLimited);
		await expect(IndividualReveals.start(ctx as never, input)).rejects.toBe(
			rateLimited,
		);
	});

	it('individualReveals.get fetches by id and upserts', async () => {
		const ctx = createMockCtx();
		const response = {
			status: { code: 200, message: 'ok' },
			type: 'individual_reveal',
			data: { id: 99, status: 'finished', is_complete: true },
		};
		mockedMakeWizaRequest.mockResolvedValueOnce(response);

		await expect(
			IndividualReveals.get(ctx as never, { id: 99 }),
		).resolves.toEqual(response);
		expect(mockedMakeWizaRequest).toHaveBeenCalledWith(
			'/api/individual_reveals/99',
			'test-key',
			{ method: 'GET' },
		);
		expect(ctx.db.reveals.upsertByEntityId).toHaveBeenCalledWith(
			'99',
			expect.objectContaining({ id: 99 }),
		);
	});

	it('individualReveals.start does not log completed when persistence fails', async () => {
		const ctx = createMockCtx();
		const input = {
			individual_reveal: { profile_url: 'https://www.linkedin.com/in/janedoe' },
			enrichment_level: 'partial' as const,
		};
		mockedMakeWizaRequest.mockResolvedValueOnce({
			status: { code: 200, message: 'ok' },
			type: 'individual_reveal',
			data: { id: 7, status: 'queued', is_complete: false },
		});
		ctx.db.reveals.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(IndividualReveals.start(ctx as never, input)).rejects.toThrow(
			'db down',
		);
		expect(mockedLogEventFromContext).not.toHaveBeenCalled();
	});

	it('lists.get fetches by id and upserts', async () => {
		const ctx = createMockCtx();
		const response = {
			status: { code: 200, message: 'ok' },
			type: 'list',
			data: {
				id: 55,
				name: 'List',
				status: 'queued',
				enrichment_level: 'partial',
				report_type: 'people',
				created_at: '2024-01-01T00:00:00Z',
				finished_at: null,
			},
		};
		mockedMakeWizaRequest.mockResolvedValueOnce(response);

		await expect(Lists.get(ctx as never, { id: 55 })).resolves.toEqual(
			response,
		);
		expect(mockedMakeWizaRequest).toHaveBeenCalledWith(
			'/api/lists/55',
			'test-key',
			{ method: 'GET' },
		);
		expect(ctx.db.lists.upsertByEntityId).toHaveBeenCalled();
	});

	it('prospects.search posts filters and upserts profiles', async () => {
		const ctx = createMockCtx();
		const input = {
			size: 1,
			filters: { job_title: [{ v: 'Engineer', s: 'i' as const }] },
		};
		const response = {
			status: { code: 200, message: 'ok' },
			data: {
				total: 1,
				profiles: [
					{
						full_name: 'Jane Doe',
						linkedin_url: 'linkedin.com/in/janedoe',
						job_title: 'Engineer',
						job_company_name: 'Acme',
						location_name: 'SF',
					},
				],
			},
		};
		mockedMakeWizaRequest.mockResolvedValueOnce(response);

		await expect(Prospects.search(ctx as never, input)).resolves.toEqual(
			response,
		);
		expect(mockedMakeWizaRequest).toHaveBeenCalledWith(
			'/api/prospects/search',
			'test-key',
			{ method: 'POST', body: input },
		);
		expect(ctx.db.prospects.upsertByEntityId).toHaveBeenCalledWith(
			'linkedin.com/in/janedoe',
			expect.objectContaining({ full_name: 'Jane Doe' }),
		);
	});
});
