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

	it('sends locations, limit, timeout and measurement options on create', async () => {
		mockRequest.mockResolvedValue({ id: 'abc', probesCount: 2 });
		await createMeasurement(context('tok'), {
			type: 'ping',
			target: 'example.com',
			locations: [{ magic: 'Germany', limit: 1 }, { country: 'US' }],
			limit: 2,
			timeout: 10,
			measurementOptions: { packets: 2, protocol: 'TCP', port: 443 },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual({
			method: 'POST',
			url: '/v1/measurements',
			body: {
				type: 'ping',
				target: 'example.com',
				locations: [{ magic: 'Germany', limit: 1 }, { country: 'US' }],
				limit: 2,
				timeout: 10,
				measurementOptions: { packets: 2, protocol: 'TCP', port: 443 },
			},
		});
		expect(mockRequest.mock.calls[0]?.[0].HEADERS).toMatchObject({
			Authorization: 'Bearer tok',
		});
	});

	it('reuses the probes of an earlier measurement when locations is an id', async () => {
		mockRequest.mockResolvedValue({ id: 'def', probesCount: 2 });
		await createMeasurement(context(), {
			type: 'http',
			target: 'example.com',
			locations: 'abc',
			measurementOptions: { request: { method: 'HEAD', path: '/' } },
		});
		expect(mockRequest.mock.calls[0]?.[1]?.body).toMatchObject({
			locations: 'abc',
			measurementOptions: { request: { method: 'HEAD', path: '/' } },
		});
	});

	it('rejects an unknown measurement option before calling the API', async () => {
		await expect(
			createMeasurement(context(), {
				type: 'ping',
				target: 'example.com',
				measurementOptions: { packets: 99 },
			}),
		).rejects.toThrow();
		await expect(
			createMeasurement(context(), {
				type: 'ping',
				target: 'example.com',
				measurementOptions: { colour: 'red' } as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('returns per-probe results from a finished measurement', async () => {
		// Trimmed from a live GET /v1/measurements/{id} on 11-17 (ping from Germany).
		mockRequest.mockResolvedValue({
			id: '2G1HHMselyZgvluDk00021WEE',
			type: 'ping',
			status: 'finished',
			createdAt: '2026-11-17T05:30:40.414Z',
			updatedAt: '2026-11-17T05:30:41.144Z',
			target: 'example.com',
			probesCount: 1,
			locations: [{ magic: 'Germany' }],
			measurementOptions: { packets: 2 },
			results: [
				{
					probe: {
						continent: 'EU',
						region: 'Western Europe',
						country: 'DE',
						state: null,
						city: 'Falkenstein',
						asn: 24940,
						longitude: 12.37,
						latitude: 50.48,
						network: 'Hetzner Online',
						tags: ['datacenter-network'],
						resolvers: ['private'],
					},
					result: {
						status: 'finished',
						rawOutput:
							'PING example.com (172.66.147.243) 56(84) bytes of data.',
						resolvedAddress: '172.66.147.243',
						resolvedHostname: 'example.com',
						timings: [
							{ ttl: 57, rtt: 5.59 },
							{ ttl: 57, rtt: 5.71 },
						],
						stats: {
							min: 5.588,
							max: 5.707,
							avg: 5.647,
							total: 2,
							loss: 0,
							rcv: 2,
							drop: 0,
						},
					},
				},
				{
					probe: { country: 'US' },
					result: { status: 'in-progress', rawOutput: '' },
				},
			],
		});
		const result = await getMeasurement(context(), {
			id: '2G1HHMselyZgvluDk00021WEE',
		});
		expect(result.measurement).toEqual({
			id: '2G1HHMselyZgvluDk00021WEE',
			probesCount: 1,
			type: 'ping',
			status: 'finished',
		});
		expect(result.target).toBe('example.com');
		expect(result.results).toHaveLength(2);
		expect(result.results?.[0]?.probe).toEqual({
			continent: 'EU',
			region: 'Western Europe',
			country: 'DE',
			state: null,
			city: 'Falkenstein',
			asn: 24940,
			network: 'Hetzner Online',
			latitude: 50.48,
			longitude: 12.37,
			tags: ['datacenter-network'],
		});
		expect(result.results?.[0]?.result).toMatchObject({
			status: 'finished',
			resolvedAddress: '172.66.147.243',
			stats: { avg: 5.647, loss: 0 },
			timings: [
				{ ttl: 57, rtt: 5.59 },
				{ ttl: 57, rtt: 5.71 },
			],
		});
		expect(result.results?.[1]?.result.status).toBe('in-progress');
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'example.com',
		);
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
