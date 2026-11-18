import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	LISTENNOTES_API_BASE,
	makeListennotesRequest,
	sanitizeApiError,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{
			method: 'GET',
			url: '/genres',
			headers: { 'x-listenapi-key': 'secret-test-key' },
		},
		{
			url: 'https://listen-api.listennotes.com/api/v2/genres',
			ok: false,
			status,
			statusText: message,
			body: { error: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeListennotesRequest', () => {
	it('uses the v2 base URL and X-ListenAPI-Key header', async () => {
		mockedRequest.mockResolvedValue({ genres: [] });

		await makeListennotesRequest('/genres', 'test-api-key', {
			method: 'GET',
			query: { top_level_only: 1 },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LISTENNOTES_API_BASE,
			VERSION: '2.0.0',
			HEADERS: {
				'X-ListenAPI-Key': 'test-api-key',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/genres',
				query: { top_level_only: 1 },
			}),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('makes unauthenticated requests when apiKey is undefined', async () => {
		mockedRequest.mockResolvedValue({ genres: [] });

		await makeListennotesRequest('/genres', undefined, {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'X-ListenAPI-Key',
		);
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		await expect(makeListennotesRequest('/genres', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('omits undefined query values via compactQuery', () => {
		expect(
			compactQuery({ q: 'podcasts', page: undefined, safe_mode: 1 }),
		).toEqual({
			q: 'podcasts',
			safe_mode: 1,
		});
	});

	it('rethrows sanitized 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockedRequest.mockRejectedValue(rateLimited);

		// `unknown` because rejection value has no static type before caught.
		const caught: unknown = await makeListennotesRequest('/genres', 'test-api-key').catch(
			// `unknown` because catch clause error is untyped.
			(e: unknown) => e,
		);

		expect(caught).toBeInstanceOf(ApiError);
		const error = caught as ApiError;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2500);
		expect(error.request.headers?.['x-listenapi-key']).toBe('[REDACTED]');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
	});

	it('sanitizes credentials from error request headers and body', () => {
		const raw = new ApiError(
			{
				method: 'POST',
				url: '/test',
				headers: { 'x-listenapi-key': 'super-secret-key' },
				body: { apiKey: 'secret', safe: 'value' },
			},
			{
				url: 'https://listen-api.listennotes.com/api/v2/test',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { token: 'secret-token', message: 'invalid' },
			},
			'Bad Request',
		);

		// `unknown` because sanitizeApiError accepts and returns unknown for non-ApiError fallback.
		const sanitized: unknown = sanitizeApiError(raw);
		expect(sanitized).toBeInstanceOf(ApiError);
		const err = sanitized as ApiError;
		expect(err.request.headers?.['x-listenapi-key']).toBe('[REDACTED]');
		expect(err.request.body).toEqual({ apiKey: '[REDACTED]', safe: 'value' });
		expect(err.body).toEqual({ token: '[REDACTED]', message: 'invalid' });
	});
});

describe('real transport rate-limit test via jest.requireActual', () => {
	it('uses real transport with 429 and parses Retry-After header', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');

		const originalFetch = globalThis.fetch;
		try {
			globalThis.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					headers: new Headers({
						'retry-after': '4',
						'content-type': 'application/json',
					}),
					json: () => Promise.resolve({ error: 'Too Many Requests' }),
					text: () =>
						Promise.resolve(JSON.stringify({ error: 'Too Many Requests' })),
					clone() {
						return this;
					},
				}),
			);

			// `unknown` because rejection value has no static type before caught.
			const caught: unknown = await actualHttp
				.request(
					{
						BASE: LISTENNOTES_API_BASE,
						VERSION: '2.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: {},
					},
					{
						method: 'GET',
						url: '/genres',
					},
					{
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 0,
							backoffMultiplier: 1,
							headerNames: { retryAfter: 'retry-after' },
						},
					},
				)
				.catch(
					// `unknown` because catch clause parameter has no static type.
					(e: unknown) => e,
				);

			expect(caught).toBeInstanceOf(ApiError);
			const error = caught as ApiError;
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(4000);
			expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
