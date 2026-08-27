import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeBetterContactRequest } from './client';
import { Credits, Enrichment, LeadFinder } from './endpoints';
import { bettercontact } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeBetterContactRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeBetterContactRequest);
const mockLog = jest.mocked(logEventFromContext);

function createCtx() {
	return { key: 'test-api-key' } as never;
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('credits.get', () => {
	it('calls makeBetterContactRequest with GET /account', async () => {
		const response = {
			success: true,
			credits_left: 500,
			email: 'test@example.com',
		};
		mockRequest.mockResolvedValueOnce(response);

		const result = await Credits.get(createCtx(), {});

		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith('account', 'test-api-key', {
			method: 'GET',
		});
	});

	it('coerces credits_left from a numeric string', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			credits_left: '500',
			email: 'test@example.com',
		});

		const result = await Credits.get(createCtx(), {});

		expect(result.credits_left).toBe(500);
	});

	it('rejects a credits response missing credits_left', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			email: 'test@example.com',
		});

		await expect(Credits.get(createCtx(), {})).rejects.toThrow();
	});

	it('logs bettercontact.credits.get on success', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			credits_left: 100,
			email: '',
		});
		await Credits.get(createCtx(), {});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'bettercontact.credits.get',
			{},
			'completed',
		);
	});

	it('propagates errors thrown by makeBetterContactRequest', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network timeout'));
		await expect(Credits.get(createCtx(), {})).rejects.toThrow(
			'Network timeout',
		);
	});
});

describe('leadFinder.create', () => {
	it('POSTs to lead_finder/async with the full input as body', async () => {
		const input = {
			filters: { lead_seniority: { include: ['cxo', 'vp'] } },
			limit: 50,
		};
		const response = {
			success: true,
			request_id: 'srch_1',
			message: 'Accepted',
		};
		mockRequest.mockResolvedValueOnce(response);

		const result = await LeadFinder.create(createCtx(), input);

		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			'lead_finder/async',
			'test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
	});

	it('logs bettercontact.leadFinder.create on success with redacted metadata', async () => {
		const input = { filters: { lead_seniority: { include: ['cxo'] } } };
		mockRequest.mockResolvedValueOnce({
			success: true,
			request_id: 'x',
			message: '',
		});
		await LeadFinder.create(createCtx(), input);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'bettercontact.leadFinder.create',
			expect.objectContaining({ has_filters: true }),
			'completed',
		);

		const call = mockLog.mock.calls.find(
			(c) => c[1] === 'bettercontact.leadFinder.create',
		);
		expect(call?.[2]).not.toHaveProperty('filters');
	});

	it('rejects a create response missing request_id', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			message: 'Accepted',
		});

		await expect(
			LeadFinder.create(createCtx(), {
				filters: { lead_seniority: { include: ['cxo'] } },
			}),
		).rejects.toThrow();
	});
});

describe('leadFinder.getResults', () => {
	it('GETs lead_finder/async/:request_id', async () => {
		const response = { id: 'srch_1', status: 'terminated', leads: [] };
		mockRequest.mockResolvedValueOnce(response);

		const result = await LeadFinder.getResults(createCtx(), {
			request_id: 'srch_1',
		});

		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith(
			'lead_finder/async/srch_1',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('handles processing status response', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'srch_1', status: 'processing' });
		const result = (await LeadFinder.getResults(createCtx(), {
			request_id: 'srch_1',
		})) as { status: string };
		expect(result.status).toBe('processing');
	});

	it('rejects a results payload missing status', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'srch_1' });

		await expect(
			LeadFinder.getResults(createCtx(), { request_id: 'srch_1' }),
		).rejects.toThrow();
	});
});

describe('enrichment.enrich', () => {
	it('POSTs to /async with the full input as body', async () => {
		const input = {
			data: [{ first_name: 'Alice', company_domain: 'example.com' }],
		};
		const response = { success: true, id: 'batch_1', message: 'Accepted' };
		mockRequest.mockResolvedValueOnce(response);

		const result = await Enrichment.enrich(createCtx(), input);

		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith('async', 'test-api-key', {
			method: 'POST',
			body: input,
		});
	});

	it('logs bettercontact.enrichment.enrich on success with redacted metadata', async () => {
		const input = { data: [{ first_name: 'Bob' }] };
		mockRequest.mockResolvedValueOnce({ success: true, id: 'b2', message: '' });
		await Enrichment.enrich(createCtx(), input);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'bettercontact.enrichment.enrich',
			expect.objectContaining({ record_count: 1 }),
			'completed',
		);

		const call = mockLog.mock.calls.find(
			(c) => c[1] === 'bettercontact.enrichment.enrich',
		);
		expect(call?.[2]).not.toHaveProperty('data');
	});

	it('rejects an enrich response missing id', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			message: 'Accepted',
		});

		await expect(
			Enrichment.enrich(createCtx(), {
				data: [{ first_name: 'Alice' }],
			}),
		).rejects.toThrow();
	});
});

describe('enrichment.getResults', () => {
	it('GETs async/:request_id', async () => {
		const response = { id: 'batch_1', status: 'terminated', data: [] };
		mockRequest.mockResolvedValueOnce(response);

		const result = await Enrichment.getResults(createCtx(), {
			request_id: 'batch_1',
		});

		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenCalledWith('async/batch_1', 'test-api-key', {
			method: 'GET',
		});
	});

	it('handles on_hold status response', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'batch_1', status: 'on_hold' });
		const result = (await Enrichment.getResults(createCtx(), {
			request_id: 'batch_1',
		})) as { status: string };
		expect(result.status).toBe('on_hold');
	});

	it('rejects a results payload missing status', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'batch_1' });

		await expect(
			Enrichment.getResults(createCtx(), { request_id: 'batch_1' }),
		).rejects.toThrow();
	});
});

describe('keyBuilder resolution', () => {
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

	it('throws AuthMissingError when no key is available', async () => {
		const oldEnv = process.env.BETTERCONTACT_API_KEY;
		process.env.BETTERCONTACT_API_KEY = '';

		const plugin = bettercontact({});
		const mockCtx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(undefined) },
		};

		await expect(
			plugin.keyBuilder!(mockCtx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		process.env.BETTERCONTACT_API_KEY = oldEnv;
	});
});
