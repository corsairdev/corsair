import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	makeSaperlyRecordingRequest,
	makeSaperlyRequest,
	SAPERLY_API_BASE,
	SaperlyAPIError,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

// jest.mock replaces request but the imported binding stays a function type.
const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [
	OpenAPIConfig,
	ApiRequestOptions,
	{ rateLimitConfig?: { enabled?: boolean; maxRetries?: number } },
] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	// jest.MockedFunction hides the rateLimitConfig argument on request().
	return call as unknown as [
		OpenAPIConfig,
		ApiRequestOptions,
		{ rateLimitConfig?: { enabled?: boolean; maxRetries?: number } },
	];
}

beforeEach(() => {
	mockRequest.mockReset();
	jest.restoreAllMocks();
});

describe('saperly client', () => {
	it('sends a bearer token and the production base URL', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });
		await makeSaperlyRequest('/health', 'x_key_test');
		const [config, options, requestOptions] = lastCall();
		expect(config.BASE).toBe(SAPERLY_API_BASE);
		expect(config.BASE).toBe('https://api.saperly.com');
		expect(config.TOKEN).toBe('x_key_test');
		const headers = config.HEADERS;
		if (!headers || typeof headers === 'function') {
			throw new Error('expected a headers object');
		}
		expect(headers.Authorization).toBeUndefined();
		expect(options.url).toBe('/health');
		expect(requestOptions.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
		});
	});

	it('uses a caller base URL when one is set', async () => {
		mockRequest.mockResolvedValue({});
		await makeSaperlyRequest('/numbers', 'x_key_test', {
			baseUrl: 'https://sandbox.example',
		});
		expect(lastCall()[0].BASE).toBe('https://sandbox.example');
	});

	it('maps a 402 tagged body without stringifying an object envelope', async () => {
		const body = {
			_tag: 'SpendLimitExceeded',
			limitCents: 5000,
			priorSpendCents: 4800,
			requestedCents: 300,
		};
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/calls' },
				{
					url: 'https://api.saperly.com/calls',
					ok: false,
					status: 402,
					statusText: 'Payment Required',
					body,
				},
				'[object Object]',
			),
		);
		await expect(
			makeSaperlyRequest('/calls', 'x_key_test', { method: 'POST', body: {} }),
		).rejects.toMatchObject({
			name: 'SaperlyAPIError',
			status: 402,
			tag: 'SpendLimitExceeded',
			method: 'POST',
		});
	});

	it('makes exactly one fetch on a 429 and keeps Retry-After', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/numbers' },
				{
					url: 'https://api.saperly.com/numbers',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { _tag: 'RateLimited', bucket: 'read' },
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);
		try {
			await makeSaperlyRequest('/numbers', 'x_key_test');
			throw new Error('expected a 429');
		} catch (error) {
			expect(error).toBeInstanceOf(SaperlyAPIError);
			// catch bindings are unknown to the checker.
			const apiError = error as SaperlyAPIError;
			expect(apiError.retryAfter).toBe(1500);
			expect(apiError.status).toBe(429);
		}
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('returns a recording Location without following the redirect', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://cdn.example/rec.wav' },
			}),
		);
		const result = await makeSaperlyRecordingRequest(
			'/calls/{id}/recording',
			'x_key_test',
			{ path: { id: 'call 1' } },
		);
		expect(result).toEqual({ url: 'https://cdn.example/rec.wav' });
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.saperly.com/calls/call%201/recording',
			expect.objectContaining({
				method: 'GET',
				redirect: 'manual',
				headers: expect.objectContaining({
					Authorization: 'Bearer x_key_test',
				}),
			}),
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('copies a recording 429 Retry-After into milliseconds', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ _tag: 'RateLimited', bucket: 'read' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '30',
				},
			}),
		);
		await expect(
			makeSaperlyRecordingRequest('/calls/{id}/recording', 'x_key_test', {
				path: { id: 'call_1' },
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 30_000 });
	});
});
