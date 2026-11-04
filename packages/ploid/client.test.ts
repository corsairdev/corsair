import type { ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makePloidRequest, PLOID_API_BASE, PloidAPIError } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	// unknown: the fixture deliberately feeds every error body shape the
	// provider can send (object, string, omitted); a narrower type would not.
	body: unknown,
	retryAfterMs?: number,
): ApiError {
	const result: ApiResult = {
		url: `${PLOID_API_BASE}/v1/search`,
		ok: false,
		status,
		statusText: '',
		body,
	};
	return new ApiError(
		{ method: 'POST', url: '/v1/search' },
		result,
		'request failed',
		retryAfterMs === undefined ? undefined : { retryAfter: retryAfterMs },
	);
}

describe('makePloidRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ data: {}, meta: { request_id: 'req_1' } });
	});

	it('calls the documented host with the bearer token', async () => {
		await makePloidRequest('/v1/account/credits', 'test-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: PLOID_API_BASE,
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/account/credits',
			}),
			expect.anything(),
		);
	});

	it('honors a baseUrl override', async () => {
		await makePloidRequest('/v1/account/credits', 'test-key', {
			baseUrl: 'https://ploid-proxy.example.com',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://ploid-proxy.example.com' }),
			expect.anything(),
			expect.anything(),
		);
	});

	it('makes exactly one attempt for reads and writes', async () => {
		mockRequest.mockRejectedValue(
			apiError(429, { error: { code: 'rate_limited' } }, 2000),
		);

		await expect(
			makePloidRequest('/v1/search', 'test-key', {
				method: 'POST',
				body: { query: 'founders' },
			}),
		).rejects.toThrow(PloidAPIError);

		await expect(
			makePloidRequest('/v1/account/credits', 'test-key'),
		).rejects.toThrow(PloidAPIError);

		expect(mockRequest).toHaveBeenCalledTimes(2);
		const writeConfig = mockRequest.mock.calls[0]?.[2]?.rateLimitConfig;
		const readConfig = mockRequest.mock.calls[1]?.[2]?.rateLimitConfig;
		// Retries belong to the plugin error handlers; the transport still
		// parses Retry-After, which requires enabled: true.
		expect(readConfig).toMatchObject({ enabled: true, maxRetries: 0 });
		expect(writeConfig).toMatchObject({ enabled: true, maxRetries: 0 });
	});

	it('sends a JSON media type only when a body is present', async () => {
		await makePloidRequest('/v1/account/credits', 'test-key');
		await makePloidRequest('/v1/search', 'test-key', {
			method: 'POST',
			body: { query: 'founders' },
		});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			expect.anything(),
			expect.objectContaining({ mediaType: undefined }),
			expect.anything(),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			expect.objectContaining({
				mediaType: 'application/json; charset=utf-8',
				body: { query: 'founders' },
			}),
			expect.anything(),
		);
	});

	it('keeps status, code, body, and Retry-After on PloidAPIError', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				429,
				{
					error: {
						code: 'rate_limited',
						message: 'Slow down',
						request_id: 'req_1',
					},
				},
				1500,
			),
		);

		const error = await makePloidRequest('/v1/search', 'test-key', {
			method: 'POST',
			body: { query: 'founders' },
		}).then(
			() => {
				throw new Error('expected PloidAPIError');
			},
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(PloidAPIError);
		if (!(error instanceof PloidAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.code).toBe('rate_limited');
		expect(error.retryAfter).toBe(1500);
		expect(error.method).toBe('POST');
		expect(error.message).toContain('rate_limited');
	});

	it('maps provider statuses without guessing a code', async () => {
		for (const status of [401, 402, 403, 404, 409, 410, 422, 503]) {
			mockRequest.mockRejectedValue(
				apiError(status, {
					error: { code: 'x', message: 'no', request_id: 'req_1' },
				}),
			);
			const error = await makePloidRequest('/v1/search', 'test-key', {
				method: 'POST',
				body: { query: 'founders' },
			}).then(
				() => {
					throw new Error('expected PloidAPIError');
				},
				(caught: Error) => caught,
			);
			expect(error).toBeInstanceOf(PloidAPIError);
			if (error instanceof PloidAPIError) {
				expect(error.status).toBe(status);
			}
		}
	});

	it('uses the provider error message for unmapped statuses', async () => {
		// 402 is outside the shared client's status map, so ApiError.message
		// would stringify body.error into "[object Object]" without this.
		mockRequest.mockRejectedValue(
			apiError(402, {
				error: {
					code: 'insufficient_acu',
					message: 'Not enough ACU. Add usage capacity to continue.',
					request_id: 'req_2',
				},
			}),
		);

		const error = await makePloidRequest('/v1/search', 'test-key', {
			method: 'POST',
			body: { query: 'founders' },
		}).then(
			() => {
				throw new Error('expected PloidAPIError');
			},
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(PloidAPIError);
		if (!(error instanceof PloidAPIError)) return;
		expect(error.message).toBe(
			'insufficient_acu: Not enough ACU. Add usage capacity to continue.',
		);
		expect(error.message).not.toContain('[object Object]');
	});

	it('tolerates a non-object error body', async () => {
		mockRequest.mockRejectedValue(apiError(503, 'upstream unavailable'));

		const error = await makePloidRequest('/v1/search', 'test-key').then(
			() => {
				throw new Error('expected PloidAPIError');
			},
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(PloidAPIError);
		if (!(error instanceof PloidAPIError)) return;
		expect(error.code).toBeUndefined();
		expect(error.body).toBe('upstream unavailable');
	});
});
