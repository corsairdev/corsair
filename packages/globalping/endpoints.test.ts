import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { GlobalpingContext } from './context';
import {
	createMeasurement,
	getHealth,
	getLimits,
	getMeasurement,
	listProbes,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key?: string,
	db?: GlobalpingContext['db'],
): GlobalpingContext {
	return { key, db } as unknown as GlobalpingContext;
}

describe('globalping', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns probes and drops resolver addresses', async () => {
		mockRequest.mockResolvedValue([
			{
				version: '0.54.0',
				location: {
					continent: 'AS',
					region: 'Southern Asia',
					country: 'PK',
					city: 'Islamabad',
					asn: 150315,
					network: 'Example Net',
				},
				resolvers: ['8.8.8.8'],
				tags: ['datacenter'],
			},
		]);
		const result = await listProbes(context('sekrit'), {});
		expect(result.probes[0]?.country).toBe('PK');
		expect(JSON.stringify(result.probes)).not.toContain('8.8.8.8');
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer sekrit' }),
		);
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
	});

	it('stores the create rate limit', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			rateLimit: {
				measurements: {
					create: { type: 'ip', limit: 250, remaining: 249, reset: 0 },
				},
			},
		});
		const result = await getLimits(
			context(undefined, {
				limits: { upsertByEntityId: upsert },
			} as unknown as GlobalpingContext['db']),
			{},
		);
		expect(result.limit.id).toBe('measurements.create');
		expect(upsert).toHaveBeenCalledWith('measurements.create', result.limit);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
		});
	});

	it('stores the health text', async () => {
		mockRequest.mockResolvedValue('Alive');
		const result = await getHealth(context(), {});
		expect(result.health).toEqual({ id: 'api', status: 'Alive' });
	});

	it('stores a created measurement and omits the target from the event', async () => {
		mockRequest.mockResolvedValue({ id: 'abc', probesCount: 3 });
		const result = await createMeasurement(context(), {
			type: 'ping',
			target: 'secret.internal',
		});
		expect(result.measurement).toEqual({
			id: 'abc',
			probesCount: 3,
			type: 'ping',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret.internal',
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v1/measurements',
		});
	});

	it('rejects an unknown measurement type before calling the API', async () => {
		await expect(
			createMeasurement(context(), {
				type: 'nmap' as 'ping',
				target: 'example.com',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 404 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/measurements/missing' },
			{
				url: 'https://api.globalping.io/v1/measurements/missing',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { error: { type: 'not_found' } },
			},
			'Not Found',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getMeasurement(context(), { id: 'missing' })).rejects.toBe(
			error,
		);
	});
});
