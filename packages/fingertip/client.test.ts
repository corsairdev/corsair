import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import {
	FINGERTIP_API_BASE,
	FINGERTIP_RATE_LIMIT_CONFIG,
	makeFingertipPingRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const realRequest =
	jest.requireActual<typeof import('corsair/http')>('corsair/http').request;

beforeEach(() => {
	mockRequest.mockReset();
	jest.restoreAllMocks();
});

describe('makeFingertipPingRequest', () => {
	it('configures the API host, Bearer token, and exact ping route', async () => {
		mockRequest.mockResolvedValue({ message: 'pong' });

		await expect(makeFingertipPingRequest('test-api-key')).resolves.toEqual({
			message: 'pong',
		});

		const call = mockRequest.mock.calls[0];
		if (!call)
			throw new Error('Expected the shared request transport to be called');
		const [config, requestOptions, transportOptions] = call;

		expect(config).toMatchObject({
			BASE: FINGERTIP_API_BASE,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: 'test-api-key',
		});
		expect(config.HEADERS).toBeUndefined();
		expect(requestOptions).toMatchObject({ method: 'GET', url: '/v1/ping' });
		expect(requestOptions.body).toBeUndefined();
		expect(requestOptions.query).toBeUndefined();
		expect(transportOptions?.rateLimitConfig).toBe(FINGERTIP_RATE_LIMIT_CONFIG);
		expect(FINGERTIP_RATE_LIMIT_CONFIG).toMatchObject({
			enabled: true,
			maxRetries: 0,
			headerNames: { retryAfter: 'retry-after' },
		});
	});

	it('fails fast when the API key is missing or empty', async () => {
		await expect(makeFingertipPingRequest()).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(makeFingertipPingRequest('')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('extracts Retry-After in the real transport without nested retries', async () => {
		mockRequest.mockResolvedValue({ message: 'unused' });
		await makeFingertipPingRequest('test-api-key');

		const call = mockRequest.mock.calls[0];
		if (!call)
			throw new Error('Expected the shared request transport to be called');
		const [config, requestOptions, transportOptions] = call;
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		await expect(
			realRequest(config, requestOptions, transportOptions),
		).rejects.toMatchObject({ status: 429, retryAfter: 4000 });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const fetchCall = fetchSpy.mock.calls[0];
		if (!fetchCall)
			throw new Error('Expected the real transport to call fetch');
		expect(fetchCall[0]).toBe(`${FINGERTIP_API_BASE}/v1/ping`);
		expect(new Headers(fetchCall[1]?.headers).get('authorization')).toBe(
			'Bearer test-api-key',
		);
	});
});
