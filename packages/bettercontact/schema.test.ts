import { Credits, Enrichment, LeadFinder } from './endpoints';
import {
	BetterContactEndpointInputSchemas,
	BetterContactEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { bettercontact } from './index';
import { BetterContactSchema } from './schema';

jest.mock('./client', () => ({
	makeBetterContactRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(async () => undefined),
}));

import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeBetterContactRequest } from './client';

const mockedMakeBetterContactRequest = jest.mocked(makeBetterContactRequest);
const mockedLogEventFromContext = jest.mocked(logEventFromContext);

function createMockCtx() {
	return {
		key: 'test-api-key',
	} as const;
}

describe('BetterContact schema & metadata', () => {
	it('declares a semver version and entities', () => {
		expect(BetterContactSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof BetterContactSchema.entities).toBe('object');
	});
});

describe('BetterContact input schemas - Valid inputs', () => {
	it('validates credits.get input', () => {
		expect(
			BetterContactEndpointInputSchemas.creditsGet.safeParse({}).success,
		).toBe(true);
	});

	it('validates leadFinder.create input', () => {
		const valid = BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
			filters: { job_titles: ['CEO'] },
			limit: 50,
			offset: 0,
			enrich_email_address: true,
		});
		expect(valid.success).toBe(true);
	});

	it('validates leadFinder.getResults input', () => {
		const valid =
			BetterContactEndpointInputSchemas.leadFinderGetResults.safeParse({
				request_id: 'req_123',
			});
		expect(valid.success).toBe(true);
	});

	it('validates enrichment.enrich input', () => {
		const valid = BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
			data: [{ first_name: 'John', company_domain: 'example.com' }],
			enrich_phone_number: true,
		});
		expect(valid.success).toBe(true);
	});

	it('validates enrichment.getResults input', () => {
		const valid =
			BetterContactEndpointInputSchemas.enrichmentGetResults.safeParse({
				request_id: 'req_456',
			});
		expect(valid.success).toBe(true);
	});
});

describe('BetterContact input schemas - Edge & Rejection cases', () => {
	it('rejects leadFinder.create with limit > 200 or < 1', () => {
		const tooHigh =
			BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
				filters: { job_titles: ['CEO'] },
				limit: 250,
			});
		expect(tooHigh.success).toBe(false);

		const tooLow = BetterContactEndpointInputSchemas.leadFinderCreate.safeParse(
			{
				filters: { job_titles: ['CEO'] },
				limit: 0,
			},
		);
		expect(tooLow.success).toBe(false);
	});

	it('rejects leadFinder.create with negative offset', () => {
		const invalid =
			BetterContactEndpointInputSchemas.leadFinderCreate.safeParse({
				filters: { job_titles: ['CEO'] },
				offset: -5,
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects enrichment.enrich with empty data array', () => {
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				data: [],
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects enrichment.enrich with data array > 100 items', () => {
		const items = Array.from({ length: 101 }, (_, i) => ({
			first_name: `User${i}`,
		}));
		const invalid =
			BetterContactEndpointInputSchemas.enrichmentEnrich.safeParse({
				data: items,
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects getResults without request_id', () => {
		const leadFinderInvalid =
			BetterContactEndpointInputSchemas.leadFinderGetResults.safeParse({});
		expect(leadFinderInvalid.success).toBe(false);

		const enrichmentInvalid =
			BetterContactEndpointInputSchemas.enrichmentGetResults.safeParse({});
		expect(enrichmentInvalid.success).toBe(false);
	});
});

describe('BetterContact output schemas', () => {
	it('parses credits response', () => {
		const res = BetterContactEndpointOutputSchemas.creditsGet.safeParse({
			success: true,
			credits_left: 1000,
			email: 'user@example.com',
		});
		expect(res.success).toBe(true);
	});

	it('parses leadFinder.create response', () => {
		const res = BetterContactEndpointOutputSchemas.leadFinderCreate.safeParse({
			success: true,
			request_id: 'req_123',
			message: 'Accepted',
		});
		expect(res.success).toBe(true);
	});

	it('parses leadFinder.getResults response with all statuses', () => {
		for (const status of [
			'not_started',
			'processing',
			'on_hold',
			'terminated',
		]) {
			const res =
				BetterContactEndpointOutputSchemas.leadFinderGetResults.safeParse({
					id: 'req_123',
					status,
					credits_consumed: 10,
					credits_left: 990,
					leads: [{ name: 'Jane' }],
				});
			expect(res.success).toBe(true);
		}
	});

	it('parses enrichment.enrich response', () => {
		const res = BetterContactEndpointOutputSchemas.enrichmentEnrich.safeParse({
			success: true,
			id: 'enrich_123',
		});
		expect(res.success).toBe(true);
	});

	it('parses enrichment.getResults response with all statuses', () => {
		for (const status of ['processing', 'on_hold', 'terminated']) {
			const res =
				BetterContactEndpointOutputSchemas.enrichmentGetResults.safeParse({
					id: 'enrich_123',
					status,
					credits_consumed: 5,
					credits_left: 995,
					data: [{ email: 'jane@example.com' }],
				});
			expect(res.success).toBe(true);
		}
	});
});

describe('BetterContact error handlers', () => {
	it('handles RATE_LIMIT_ERROR (429)', async () => {
		const error = new ApiError(
			{ url: '/api/v2/account', method: 'GET' },
			{
				url: '/api/v2/account',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: undefined,
			},
			'Rate limited',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('handles AUTH_ERROR (401)', async () => {
		const error = new ApiError(
			{ url: '/api/v2/account', method: 'GET' },
			{
				url: '/api/v2/account',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: undefined,
			},
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('handles DEFAULT error handler', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});

describe('BetterContact keyBuilder resolution', () => {
	it('resolves explicit options.key', async () => {
		const plugin = bettercontact({ key: 'explicit-key' });
		const key = await plugin.keyBuilder!(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('explicit-key');
	});

	it('resolves key from ctx.keys.get_api_key when options.key is omitted', async () => {
		const plugin = bettercontact({});
		const mockCtx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue('dynamic-ctx-key') },
		};
		const key = await plugin.keyBuilder!(mockCtx as never, 'endpoint');
		expect(key).toBe('dynamic-ctx-key');
	});

	it('falls back to process.env.BETTERCONTACT_API_KEY when no key is provided', async () => {
		const oldEnv = process.env.BETTERCONTACT_API_KEY;
		process.env.BETTERCONTACT_API_KEY = 'env-secret-key';

		const plugin = bettercontact({});
		const mockCtx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(undefined) },
		};
		const key = await plugin.keyBuilder!(mockCtx as never, 'endpoint');
		expect(key).toBe('env-secret-key');

		process.env.BETTERCONTACT_API_KEY = oldEnv;
	});
});

describe('BetterContact endpoint handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('credits.get calls makeBetterContactRequest', async () => {
		const ctx = createMockCtx();
		const response = {
			success: true,
			credits_left: 500,
			email: 'test@example.com',
		};
		mockedMakeBetterContactRequest.mockResolvedValueOnce(response);

		const result = await Credits.get(ctx as never, {});
		expect(result).toEqual(response);
		expect(mockedMakeBetterContactRequest).toHaveBeenCalledWith(
			'account',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEventFromContext).toHaveBeenCalled();
	});

	it('leadFinder.create posts search request', async () => {
		const ctx = createMockCtx();
		const input = { filters: { industry: 'tech' } };
		const response = { success: true, request_id: 'srch_1' };
		mockedMakeBetterContactRequest.mockResolvedValueOnce(response);

		const result = await LeadFinder.create(ctx as never, input);
		expect(result).toEqual(response);
		expect(mockedMakeBetterContactRequest).toHaveBeenCalledWith(
			'lead_finder/async',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
	});

	it('leadFinder.getResults fetches search results', async () => {
		const ctx = createMockCtx();
		const input = { request_id: 'srch_1' };
		const response = { id: 'srch_1', status: 'terminated', leads: [] };
		mockedMakeBetterContactRequest.mockResolvedValueOnce(response);

		const result = await LeadFinder.getResults(ctx as never, input);
		expect(result).toEqual(response);
		expect(mockedMakeBetterContactRequest).toHaveBeenCalledWith(
			'lead_finder/async/srch_1',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('enrichment.enrich posts batch enrichment request', async () => {
		const ctx = createMockCtx();
		const input = { data: [{ first_name: 'Alice' }] };
		const response = { success: true, id: 'batch_1' };
		mockedMakeBetterContactRequest.mockResolvedValueOnce(response);

		const result = await Enrichment.enrich(ctx as never, input);
		expect(result).toEqual(response);
		expect(mockedMakeBetterContactRequest).toHaveBeenCalledWith(
			'async',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
	});

	it('enrichment.getResults fetches enrichment status', async () => {
		const ctx = createMockCtx();
		const input = { request_id: 'batch_1' };
		const response = { id: 'batch_1', status: 'terminated', data: [] };
		mockedMakeBetterContactRequest.mockResolvedValueOnce(response);

		const result = await Enrichment.getResults(ctx as never, input);
		expect(result).toEqual(response);
		expect(mockedMakeBetterContactRequest).toHaveBeenCalledWith(
			'async/batch_1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('propagates errors thrown by makeBetterContactRequest', async () => {
		const ctx = createMockCtx();
		const err = new Error('Network timeout');
		mockedMakeBetterContactRequest.mockRejectedValueOnce(err);

		await expect(Credits.get(ctx as never, {})).rejects.toThrow(
			'Network timeout',
		);
	});
});
