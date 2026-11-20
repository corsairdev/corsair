import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	INTERZOID_API_BASE,
	InterzoidAPIError,
	makeInterzoidRequest,
} from './client';
import { errorHandlers } from './error-handlers';

/** A `then` handler for calls that must reject: a resolved call fails the test. */
const expectedRejection = (): never => {
	throw new Error('expected the call to reject');
};

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/getremainingcredits' },
		{
			url: 'https://api.interzoid.com/getremainingcredits',
			ok: false,
			status,
			statusText: message,
			body: { Code: String(status), Message: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeInterzoidRequest', () => {
	it('sends x-api-key header and uses the Interzoid base URL', async () => {
		mockedRequest.mockResolvedValue({ Code: 'Success', Credits: 1000 });

		const result = await makeInterzoidRequest<{
			Code?: string;
			Credits?: number;
		}>('/getremainingcredits', 'test-license-key', {
			method: 'GET',
		});

		expect(result).toEqual({ Code: 'Success', Credits: 1000 });
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: INTERZOID_API_BASE,
			HEADERS: {
				'Content-Type': 'application/json',
				'x-api-key': 'test-license-key',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/getremainingcredits',
		});
	});

	it('forwards query parameters correctly', async () => {
		mockedRequest.mockResolvedValue({ SimKey: 'xyz123', Code: 'Success' });

		await makeInterzoidRequest('/getcompanymatchadvanced', 'test-license-key', {
			method: 'GET',
			query: { company: 'IBM', algorithm: 'model-v4-wide' },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/getcompanymatchadvanced',
			query: { company: 'IBM', algorithm: 'model-v4-wide' },
		});
	});

	it('throws AuthMissingError when apiKey is an empty string', async () => {
		// `unknown` because a rejection value has no static type; assertions below narrow it.
		const caught: unknown = await makeInterzoidRequest(
			'/getremainingcredits',
			'',
		).then(expectedRejection, (e: unknown) => e);

		expect(caught).toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when apiKey is undefined', async () => {
		// `unknown` because a rejection value has no static type; assertions below narrow it.
		const caught: unknown = await makeInterzoidRequest(
			'/getremainingcredits',
			undefined,
		).then(expectedRejection, (e: unknown) => e);

		expect(caught).toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError with its status and retryAfter', async () => {
		const rateLimit = makeApiError(429, 'Too Many Requests', 2500);
		mockedRequest.mockRejectedValue(rateLimit);

		// `unknown` because a rejection value has no static type; assertions below narrow it.
		const caught: unknown = await makeInterzoidRequest(
			'/getremainingcredits',
			'test-key',
		).then(expectedRejection, (e: unknown) => e);

		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.status).toBe(429);
			expect(caught.retryAfter).toBe(2500);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		}
	});

	it('keeps the lookup value out of a rebuilt ApiError', async () => {
		const email = 'person@example.com';
		mockedRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/getemailinfo', query: { email } },
				{
					url: `https://api.interzoid.com/getemailinfo?email=${email}`,
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: 'Bad Request',
				},
				'Bad Request',
				{ rateLimitRemaining: 7 },
			),
		);

		const caught: unknown = await makeInterzoidRequest(
			'/getemailinfo',
			'test-key',
			{ method: 'GET', query: { email } },
		).then(expectedRejection, (e: unknown) => e);

		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.status).toBe(400);
			expect(caught.rateLimitRemaining).toBe(7);
			expect(caught.url).toBe('https://api.interzoid.com/getemailinfo');
			expect(caught.request).toEqual({ method: 'GET', url: '/getemailinfo' });
			expect(JSON.stringify(caught)).not.toContain(email);
		}
	});

	it('wraps non-Error exceptions in InterzoidAPIError', async () => {
		mockedRequest.mockRejectedValue('network failure');

		// `unknown` because a rejection value has no static type; assertions below narrow it.
		const caught: unknown = await makeInterzoidRequest(
			'/getremainingcredits',
			'test-key',
		).then(expectedRejection, (e: unknown) => e);

		expect(caught).toBeInstanceOf(InterzoidAPIError);
		if (caught instanceof InterzoidAPIError) {
			expect(caught.message).toBe('Unknown error');
		}
	});

	it('real transport extracts Retry-After from 429 response via actual request', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};

		const originalFetch = global.fetch;
		try {
			global.fetch = jest.fn().mockResolvedValue(
				new Response('{"Code":"429","Message":"Too Many Requests"}', {
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'content-type': 'application/json',
						'retry-after': '4',
					},
				}),
			);

			const config: OpenAPIConfig = {
				BASE: INTERZOID_API_BASE,
				VERSION: '1.0.0',
				HEADERS: { 'x-api-key': 'test-key' },
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
			};

			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await actualRequest(
				config,
				{
					method: 'GET',
					url: '/getremainingcredits',
				},
				{ rateLimitConfig },
			).then(expectedRejection, (e: unknown) => e);

			expect(global.fetch).toHaveBeenCalledTimes(1);
			expect(caught).toBeInstanceOf(ApiError);
			if (caught instanceof ApiError) {
				expect(caught.status).toBe(429);
				expect(caught.retryAfter).toBe(4000);
			}
		} finally {
			global.fetch = originalFetch;
		}
	});
});
