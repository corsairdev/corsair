import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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
			body: { detail: 'provider detail with sensitive context' },
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

	it('keeps rate-limit metadata while redacting the provider body and request payload', async () => {
		const providerError = apiError(429, 4000);
		mockedRequest.mockRejectedValue(providerError);
		// Rejection values have no static type, so unknown is narrowed with instanceof below.
		const received = await makeProductboardRequest(
			'/notes',
			'test-token',
		).catch((error: unknown) => error);

		expect(received).toBeInstanceOf(ApiError);
		expect(received).toMatchObject({ status: 429, retryAfter: 4000, body: {} });
		if (received instanceof ApiError) {
			expect(received.request).not.toHaveProperty('body');
			expect(received.message).not.toContain('sensitive');
			expect(received.url).not.toContain('person@example.com');
		}
	});

	it('extracts Retry-After with the real shared transport without duplicate retries', async () => {
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(
				JSON.stringify({ errors: [{ code: 'rate.limitExceeded' }] }),
				{
					status: 429,
					headers: { 'content-type': 'application/json', 'retry-after': '4' },
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
		const options: ApiRequestOptions = { method: 'GET', url: '/teams' };

		try {
			await expect(
				realRequest(config, options, {
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				}),
			).rejects.toMatchObject({ status: 429, retryAfter: 4000 });
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
