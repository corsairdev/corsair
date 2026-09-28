import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Batch, Check, Credits, Status } from './endpoints';
import type { TpscheckContext } from './index';
import { tpscheck, tpscheckEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeTpscheckRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeTpscheckRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Check.post>[0];

function buildCtx(): Ctx {
	const ctx: TpscheckContext = {
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
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures below mirror the v2 shapes published at
// https://www.tpscheck.uk/documentation/ (check §5, batch §6).

describe('check.post', () => {
	it('sends phone number and returns the parsed verification response', async () => {
		const mockResponse = {
			input: '01829 830730',
			e164: '+441829830730',
			valid: true,
			line: {
				type: 'landline',
				original_carrier: 'BT',
				location: 'Tarporley',
				country: 'England',
				prefix: '01829',
			},
			reachability: {
				status: 'unknown',
				confidence: 'medium',
			},
			tps: false,
			ctps: false,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Check.post(ctx, {
			phone: '01829 830730',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/check', 'test-api-key', {
			method: 'POST',
			body: { phone: '01829 830730' },
			query: { version: '2' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'tpscheck.check',
			{ count: 1 },
			'completed',
		);
	});

	it('never logs the raw phone number', async () => {
		mockedRequest.mockResolvedValue({
			input: '01829 830730',
			e164: '+441829830730',
			valid: true,
			tps: false,
			ctps: false,
		});

		await Check.post(ctx, { phone: '01829 830730' });

		expect(mockedLogEvent).toHaveBeenCalledTimes(1);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(payload).toEqual({ count: 1 });
		expect(JSON.stringify(payload)).not.toContain('01829 830730');
	});

	it('rejects invalid empty phone input before calling the API', async () => {
		await expect(Check.post(ctx, { phone: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('rejects response missing required valid boolean', async () => {
		mockedRequest.mockResolvedValue({
			input: '01829 830730',
			// valid is missing
		});

		await expect(Check.post(ctx, { phone: '01829 830730' })).rejects.toThrow();

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('batch.post', () => {
	it('sends phones array and returns batch results', async () => {
		const mockResponse = {
			total: 2,
			results: [
				{
					input: '01564 331484',
					e164: '+441564331484',
					valid: true,
					tps: false,
					ctps: false,
				},
				{
					input: '01953 498974',
					e164: '+441953498974',
					valid: true,
					tps: true,
					ctps: false,
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const phones = ['01564 331484', '01953 498974'];
		const result = await Batch.post(ctx, { phones });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/batch', 'test-api-key', {
			method: 'POST',
			body: { phones },
			query: { version: '2' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'tpscheck.batch',
			{ count: 2 },
			'completed',
		);
	});

	it('rejects empty batch input', async () => {
		await expect(Batch.post(ctx, { phones: [] })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects batch input with more than 100 phones', async () => {
		const phones = Array.from({ length: 101 }, (_, i) => `070000000${i}`);
		await expect(Batch.post(ctx, { phones })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('credits.get', () => {
	it('fetches and returns usage and remaining credits', async () => {
		const mockResponse = {
			requests_used: 245,
			requests_remaining: 9755,
			monthly_limit: 10000,
			plan: 'Starter',
			reset_date: '2025-07-01T00:00:00Z',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Credits.get(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/credits', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'tpscheck.credits',
			{},
			'completed',
		);
	});
});

describe('status.get', () => {
	it('checks public health status without requiring API key', async () => {
		const mockResponse = {
			status: 'ok',
			version: '1.0.0',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Status.get(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/status', undefined, {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'tpscheck.status',
			{},
			'completed',
		);
	});

	it('works without a stored key since no credentials are sent', async () => {
		mockedRequest.mockResolvedValue({ status: 'ok', version: '1.0.0' });
		const keylessCtx: Ctx = { ...ctx, key: '' };

		const result = await Status.get(keylessCtx, {});

		expect(result).toEqual({ status: 'ok', version: '1.0.0' });
		expect(mockedRequest).toHaveBeenCalledWith('/status', undefined, {
			method: 'GET',
		});
	});
});

// Note: keyBuilder has no unit tests here. Its public type accepts only a
// `never` context (a framework typing limitation shared by every plugin),
// so calling it directly requires a type assertion. Auth behaviour is
// covered instead by the Authorization-header tests in client.test.ts.

describe('tpscheck plugin shape', () => {
	it('exposes check.post, batch.post, credits.get and status.get', () => {
		const plugin = tpscheck({});

		expect(plugin.endpoints?.check.post).toBeDefined();
		expect(plugin.endpoints?.batch.post).toBeDefined();
		expect(plugin.endpoints?.credits.get).toBeDefined();
		expect(plugin.endpoints?.status.get).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = tpscheck({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		expect(tpscheckEndpointSchemas['check.post']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['check.post']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['batch.post']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['batch.post']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['credits.get']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['credits.get']?.output).toBeDefined();
		expect(tpscheckEndpointSchemas['status.get']?.input).toBeDefined();
		expect(tpscheckEndpointSchemas['status.get']?.output).toBeDefined();
	});
});
