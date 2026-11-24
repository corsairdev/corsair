import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeProductboardRequest, PRODUCTBOARD_API_BASE } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/notes', body: { private: 'customer data' } },
		{
			url: `${PRODUCTBOARD_API_BASE}/notes?owner%5Bemail%5D=person%40example.com`,
			ok: false,
			status,
			statusText: 'provider detail with sensitive context',
			body: {
				id: 'error-occurrence-1',
				errors: [
					{
						code: 'validation.invalidValue',
						title: 'Invalid value',
						detail: 'provider detail with sensitive context',
						source: { pointer: '/data/fields/name' },
					},
				],
			},
		},
		'provider detail with sensitive context',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeProductboardRequest', () => {
	it('uses the v2 host and bearer authentication headers', async () => {
		mockedRequest.mockResolvedValue({ data: [] });
		await makeProductboardRequest('/teams', 'test-token', {
			method: 'GET',
			query: { pageCursor: 'opaque-cursor' },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: PRODUCTBOARD_API_BASE,
			VERSION: '2.0.0',
			HEADERS: {
				Authorization: 'Bearer test-token',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/teams',
				query: { pageCursor: 'opaque-cursor' },
			}),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 3,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('sends JSON request bodies on writes', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'note-id' } });
		const body = {
			data: { type: 'textNote', fields: { name: 'Synthetic note' } },
		};
		await makeProductboardRequest('/notes', 'test-token', {
			method: 'POST',
			body,
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'POST', body }),
		);
	});

	it('fails fast for an explicitly empty key', async () => {
		await expect(makeProductboardRequest('/teams', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('keeps status, retry data and error titles but drops request data and details', async () => {
		mockedRequest.mockRejectedValue(apiError(429, 4000));
		// Rejection values have no static type, so unknown is narrowed with instanceof below.
		const received = await makeProductboardRequest('/notes', 'test-token', {
			method: 'POST',
			body: { data: { fields: { content: 'Private customer feedback' } } },
		}).catch((error: unknown) => error);

		expect(received).toBeInstanceOf(ApiError);
		if (!(received instanceof ApiError)) throw new Error('Expected ApiError');
		expect(received.status).toBe(429);
		expect(received.retryAfter).toBe(4000);
		expect(received.body).toEqual({
			id: 'error-occurrence-1',
			errors: [
				{
					code: 'validation.invalidValue',
					title: 'Invalid value',
					source: { pointer: '/data/fields/name' },
				},
			],
		});
		expect(received.message).toBe(
			'Productboard request failed with HTTP 429: Invalid value',
		);
		expect(received.request).not.toHaveProperty('body');
		expect(received.request).not.toHaveProperty('query');
		const serialized = JSON.stringify(received) + received.message;
		expect(serialized).not.toContain('sensitive');
		expect(serialized).not.toContain('person@example.com');
		expect(serialized).not.toContain('Private customer feedback');
	});

	it('passes non-ApiError failures through unchanged', async () => {
		const networkError = new TypeError('fetch failed');
		mockedRequest.mockRejectedValue(networkError);
		await expect(makeProductboardRequest('/teams', 'test-token')).rejects.toBe(
			networkError,
		);
	});

	it('retries 429 responses up to the configured bound and honors Retry-After', async () => {
		const originalFetch = globalThis.fetch;
		const throttledResponse = () =>
			new Response(
				JSON.stringify({ errors: [{ code: 'rate.limitExceeded' }] }),
				{
					status: 429,
					headers: { 'content-type': 'application/json', 'retry-after': '2' },
				},
			);
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(throttledResponse())
			.mockResolvedValueOnce(throttledResponse())
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ data: [] }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			);
		globalThis.fetch = fetchMock;
		const realRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		const config: OpenAPIConfig = {
			BASE: PRODUCTBOARD_API_BASE,
			VERSION: '2.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { Authorization: 'Bearer test-token' },
		};
		const options: ApiRequestOptions = {
			method: 'POST',
			url: '/notes',
			body: { data: { fields: { name: 'Synthetic note' } } },
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 3,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'retry-after' },
		};

		try {
			jest.useFakeTimers();
			const requestPromise = realRequest(config, options, { rateLimitConfig });
			await jest.advanceTimersByTimeAsync(1999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			await jest.advanceTimersByTimeAsync(1999);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			await jest.advanceTimersByTimeAsync(1);
			await expect(requestPromise).resolves.toEqual({ data: [] });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			jest.useRealTimers();
			globalThis.fetch = originalFetch;
		}
	});

	it('bounds repeated 429 retries at three and does not retry writes on 5xx or network errors', async () => {
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockImplementation(
			() =>
				new Response(
					JSON.stringify({ errors: [{ code: 'rate.limitExceeded' }] }),
					{
						status: 429,
						headers: { 'content-type': 'application/json' },
					},
				),
		);
		globalThis.fetch = fetchMock;
		const realRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		const config: OpenAPIConfig = {
			BASE: PRODUCTBOARD_API_BASE,
			VERSION: '2.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { Authorization: 'Bearer test-token' },
		};
		const options: ApiRequestOptions = {
			method: 'POST',
			url: '/notes',
			body: { data: { fields: { name: 'Synthetic note' } } },
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 3,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};

		try {
			await expect(
				realRequest(config, options, { rateLimitConfig }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);

			fetchMock.mockReset().mockResolvedValue(
				new Response(JSON.stringify({ errors: [{ code: 'server.error' }] }), {
					status: 500,
					headers: { 'content-type': 'application/json' },
				}),
			);
			await expect(
				realRequest(config, options, { rateLimitConfig }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);

			fetchMock.mockReset().mockRejectedValue(new TypeError('network failure'));
			await expect(
				realRequest(config, options, { rateLimitConfig }),
			).rejects.toThrow('network failure');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('transport error handler', () => {
	it('preserves one retry owner for 429 responses', async () => {
		const error = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
