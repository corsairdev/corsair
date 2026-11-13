import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	GLEAP_API_BASE,
	GLEAP_API_BASE_US,
	makeGleapRequest,
	redactSensitiveData,
	sanitizeApiError,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	// unknown because ApiError body parameter can accept any parsed JSON or string payload
	body?: unknown,
) {
	return new ApiError(
		{ method: 'POST', url: '/tickets' },
		{
			url: 'https://api.gleap.io/v3/tickets',
			ok: false,
			status,
			statusText: message,
			// unknown because ApiError body matches unknown response types
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeGleapRequest', () => {
	it('sends Authorization: Bearer <apiKey> and does not set TOKEN in config', async () => {
		mockRequest.mockResolvedValue({ id: 'ticket_123' });

		await makeGleapRequest('/tickets', 'test-api-key', {
			method: 'POST',
			body: { title: 'Bug report' },
			projectId: 'proj_123',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: GLEAP_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				project: 'proj_123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/tickets',
				body: { title: 'Bug report' },
			}),
		);
	});

	it('makes unauthenticated requests without Authorization header', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeGleapRequest('/users/me', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: GLEAP_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ ok: true });

		await expect(
			makeGleapRequest('/tickets', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('supports regional custom baseUrl like US endpoint', async () => {
		mockRequest.mockResolvedValue({ id: 'ticket_us' });

		await makeGleapRequest('/tickets', 'us-key', {
			method: 'GET',
			baseUrl: GLEAP_API_BASE_US,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.BASE).toBe(GLEAP_API_BASE_US);
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		// unknown because caught rejection has no static type until inspected
		const err = await makeGleapRequest('/tickets', 'test-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(429);
		expect((err as ApiError).retryAfter).toBe(3000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as ApiError)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('redacts sensitive credentials from ApiError payloads', async () => {
		const sensitiveError = new ApiError(
			{
				method: 'POST',
				url: 'https://api.gleap.io/v3/tickets',
				body: { apiKey: 'secret-token-123', title: 'Test' },
			},
			{
				url: 'https://api.gleap.io/v3/tickets',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { token: 'secret-token-123', message: 'Invalid token' },
			},
			'Failed with token secret-token-123',
		);

		mockRequest.mockRejectedValue(sensitiveError);

		// unknown because caught rejection has no static type until inspected
		const caught: unknown = await makeGleapRequest('/tickets', 'key', {
			method: 'POST',
			body: { apiKey: 'secret-token-123', title: 'Test' },
		}).catch((e: unknown) => e);

		expect(caught).toBeInstanceOf(ApiError);
		const sanitized = caught as ApiError;
		// unknown because request body is parsed from unknown payload
		const reqBody = sanitized.request.body as Record<string, unknown>;
		expect(reqBody.apiKey).toBe('[REDACTED]');
		expect(reqBody.title).toBe('Test');
		// unknown because response body is parsed from unknown payload
		const resBody = sanitized.body as Record<string, unknown>;
		expect(resBody.token).toBe('[REDACTED]');
	});

	it('redactSensitiveData redacts strings, arrays and nested object credentials', () => {
		expect(redactSensitiveData('Bearer my-secret-token')).toBe(
			'Bearer [REDACTED]',
		);
		const nested = {
			user: {
				name: 'Alice',
				apiKey: '12345',
				secret: 'xyz',
			},
			tokens: ['a', 'b'],
		};
		// unknown because redacted result contains dynamic payload fields
		const redacted = redactSensitiveData(nested) as {
			user: Record<string, unknown>;
			tokens: string[];
		};
		expect(redacted.user.name).toBe('Alice');
		expect(redacted.user.apiKey).toBe('[REDACTED]');
		expect(redacted.user.secret).toBe('[REDACTED]');
	});

	it('sanitizeApiError passes non-ApiError unchanged', () => {
		const regularError = new Error('Regular network error');
		expect(sanitizeApiError(regularError)).toBe(regularError);
	});
});

describe('real-transport rate-limit Retry-After integration', () => {
	it('preserves Retry-After header with single-owner maxRetries: 0', async () => {
		const actualHttp = jest.requireActual('corsair/http');
		const originalFetch = global.fetch;

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'content-type': 'application/json',
				'retry-after': '4',
			}),
			text: async () => JSON.stringify({ message: 'Rate limit reached' }),
			json: async () => ({ message: 'Rate limit reached' }),
		});

		global.fetch = mockFetch;

		try {
			// unknown because rejection value has no static type until asserted
			const result: unknown = await actualHttp
				.request(
					{
						BASE: 'https://api.gleap.io/v3',
						VERSION: '3.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: { 'Content-Type': 'application/json' },
					},
					{
						method: 'GET',
						url: '/tickets',
					},
				)
				.catch((err: unknown) => err);

			expect(result).toBeInstanceOf(ApiError);
			const apiErr = result as ApiError;
			expect(apiErr.status).toBe(429);
			// 4 seconds parsed to 4000ms
			expect(apiErr.retryAfter).toBe(4000);
			// Confirms the single-owner rate limit error handler returns maxRetries: 0
			await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		} finally {
			global.fetch = originalFetch;
		}
	});
});
