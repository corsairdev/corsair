/**
 * Error routing, end to end.
 *
 * API Ninjas answers a missing key, an invalid key, a premium-gated endpoint,
 * an exhausted quota and an ordinary bad parameter all with `400`, so the
 * status code cannot decide anything on its own and every one of these
 * decisions is made by reading the body. That makes the matchers worth testing
 * individually, and the retry strategies worth testing at all: a wrong answer
 * here either spends a month's quota on a request that will never succeed, or
 * reports a plan problem as a caller bug.
 *
 * `endpoints.test.ts` checks which handler wins for each failure. This file
 * checks what each handler then does.
 */
import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

type Context = {
	pluginId: string;
	operation: string;
	input: Record<string, unknown>;
	originalError: Error;
};

const context: Context = {
	pluginId: 'apininjas',
	operation: 'text.sentiment',
	input: {},
	originalError: new Error('test'),
};

type Handler = {
	match: (error: Error, context: Context) => boolean;
	handler: (
		error: Error,
		context: Context,
	) => Promise<{
		maxRetries?: number;
		retryStrategy?: string;
		headersRetryAfterMs?: number;
	}>;
};

const handlers = errorHandlers as unknown as Record<string, Handler>;

/** Builds an ApiError the way the transport builds one. */
function apiError(
	status: number,
	body: unknown,
	rateLimitInfo?: { retryAfter?: number },
): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.api-ninjas.com/v1/sentiment' },
		{
			url: 'https://api.api-ninjas.com/v1/sentiment',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		typeof body === 'object' && body !== null && 'error' in body
			? String((body as { error: unknown }).error)
			: 'Error',
		rateLimitInfo,
	);
}

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('reading the body', () => {
	it('reads the message out of a JSON body under `error`', () => {
		expect(
			handlers.AUTH_ERROR?.match(
				apiError(400, { error: 'Invalid API Key.' }),
				context,
			),
		).toBe(true);
	});

	it('reads it out of a body under `message`, which 404s and 5xx use', () => {
		expect(
			handlers.NOT_FOUND_ERROR?.match(
				apiError(404, { message: 'Endpoint not found.' }),
				context,
			),
		).toBe(true);
	});

	it('reads a body that arrived as a plain string', () => {
		// Not every failure comes back as JSON - a gateway error can be text.
		expect(
			handlers.PERMISSION_ERROR?.match(
				apiError(
					400,
					'This endpoint is available to premium subscribers only.',
				),
				context,
			),
		).toBe(true);
	});

	it('falls back to the error message when there is no body at all', () => {
		expect(
			handlers.NETWORK_ERROR?.match(new Error('fetch failed'), context),
		).toBe(true);
	});

	it('is not confused by a body of an unexpected shape', () => {
		const odd = apiError(400, [1, 2, 3]);

		expect(handlers.AUTH_ERROR?.match(odd, context)).toBe(false);
		expect(handlers.BAD_REQUEST_ERROR?.match(odd, context)).toBe(true);
	});
});

describe('quota and throttling', () => {
	it('does not retry an exhausted monthly quota', async () => {
		// The allowance does not come back inside a retry window; retrying only
		// spends attempts on a request that cannot succeed until the month turns.
		const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
			apiError(400, {
				error: 'Monthly quota exceeded. Consider upgrading your subscription.',
			}),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Monthly quota exhausted'),
		);
	});

	it('matches the other wording the provider uses for an exhausted quota', () => {
		expect(
			handlers.RATE_LIMIT_ERROR?.match(
				apiError(400, { error: 'Your quota has been used up for this month.' }),
				context,
			),
		).toBe(true);
	});

	it('retries a genuine 429 five times', async () => {
		const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
			apiError(429, { error: 'Too Many Requests' }),
			context,
		);

		expect(strategy?.maxRetries).toBe(5);
	});

	it('honours a Retry-After when the provider ever sends one', async () => {
		// It does not today - there are no rate-limit headers on this API at all -
		// but the client declares the header, so the handler passes it through.
		const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
			apiError(429, { error: 'Too Many Requests' }, { retryAfter: 30_000 }),
			context,
		);

		expect(strategy?.headersRetryAfterMs).toBe(30_000);
	});

	it('leaves the retry delay to backoff when no header is present', async () => {
		const strategy = await handlers.RATE_LIMIT_ERROR?.handler(
			apiError(429, { error: 'Too Many Requests' }),
			context,
		);

		expect(strategy?.headersRetryAfterMs).toBeUndefined();
	});
});

describe('credentials', () => {
	it.each(['Missing API Key.', 'Invalid API Key.'])(
		'treats %j as an authentication failure, not a bad request',
		(message) => {
			// Both are 400s. Reporting them as validation errors would send a caller
			// looking at their parameters instead of at their key.
			expect(
				handlers.AUTH_ERROR?.match(apiError(400, { error: message }), context),
			).toBe(true);
			expect(
				handlers.BAD_REQUEST_ERROR?.match(
					apiError(400, { error: message }),
					context,
				),
			).toBe(false);
		},
	);

	it('never retries an authentication failure', async () => {
		const strategy = await handlers.AUTH_ERROR?.handler(
			apiError(400, { error: 'Invalid API Key.' }),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Authentication failed'),
		);
	});
});

describe('plan gating', () => {
	it.each([
		'This endpoint is available to premium subscribers only.',
		'This API endpoint is only available to premium subscribers.',
		'year parameter is for premium subscribers only',
		'This currency pair is for premium subscribers only.',
		'This interest rate is available to premium subscribers only.',
		'This endpoint is currently down for free users. Please upgrade.',
	])('recognises %j as a plan problem', (message) => {
		expect(
			handlers.PERMISSION_ERROR?.match(
				apiError(400, { error: message }),
				context,
			),
		).toBe(true);
	});

	it('never retries a plan problem, because the answer will not change', async () => {
		const strategy = await handlers.PERMISSION_ERROR?.handler(
			apiError(400, {
				error: 'This endpoint is available to premium subscribers only.',
			}),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Not available on this plan'),
		);
	});
});

describe('unknown routes', () => {
	it('matches on the message as well as the status', () => {
		// The status is the reliable signal, but the body is what a caller reads.
		expect(
			handlers.NOT_FOUND_ERROR?.match(
				apiError(404, {
					message:
						'Endpoint not found. Please check your spelling and try again.',
				}),
				context,
			),
		).toBe(true);
	});

	it('does not retry an endpoint that does not exist', async () => {
		const strategy = await handlers.NOT_FOUND_ERROR?.handler(
			apiError(404, { message: 'Endpoint not found.' }),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Endpoint not found'),
		);
	});
});

describe('bad requests', () => {
	it('claims an ordinary 400 that no earlier handler wanted', () => {
		expect(
			handlers.BAD_REQUEST_ERROR?.match(
				apiError(400, { error: 'Invalid text parameter.' }),
				context,
			),
		).toBe(true);
	});

	it('stands aside for quota, credential and plan failures', () => {
		const yielded = [
			{ error: 'Monthly quota exceeded.' },
			{ error: 'Invalid API Key.' },
			{ error: 'This endpoint is available to premium subscribers only.' },
		];

		for (const body of yielded) {
			expect(
				handlers.BAD_REQUEST_ERROR?.match(apiError(400, body), context),
			).toBe(false);
		}
	});

	it('does not claim a 404 or a 500', () => {
		expect(
			handlers.BAD_REQUEST_ERROR?.match(
				apiError(404, { message: 'x' }),
				context,
			),
		).toBe(false);
		expect(
			handlers.BAD_REQUEST_ERROR?.match(
				apiError(500, { message: 'x' }),
				context,
			),
		).toBe(false);
	});

	it('does not retry a request the provider rejected', async () => {
		const strategy = await handlers.BAD_REQUEST_ERROR?.handler(
			apiError(400, { error: 'Invalid text parameter.' }),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
	});
});

describe('server errors', () => {
	it.each([500, 502, 503])('claims a %d', (status) => {
		expect(
			handlers.SERVER_ERROR?.match(
				apiError(status, { message: 'Internal server error' }),
				context,
			),
		).toBe(true);
	});

	it('does not retry a 502, which is also how a bad parameter is reported', async () => {
		// `postalcode?code=...` and an unsolvable Sudoku both answer 502. Retrying
		// a malformed request five times only spends quota.
		const strategy = await handlers.SERVER_ERROR?.handler(
			apiError(502, { message: 'Internal server error' }),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('502'));
	});

	it.each([500, 503])('retries a %d twice with backoff', async (status) => {
		const strategy = await handlers.SERVER_ERROR?.handler(
			apiError(status, { message: 'Service Unavailable' }),
			context,
		);

		expect(strategy).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});

describe('network failures', () => {
	it.each([
		'fetch failed',
		'network timeout',
		'connection reset',
		'ECONNREFUSED 127.0.0.1:443',
		'getaddrinfo ENOTFOUND api.api-ninjas.com',
		'ETIMEDOUT',
	])('recognises %j', (message) => {
		expect(handlers.NETWORK_ERROR?.match(new Error(message), context)).toBe(
			true,
		);
	});

	it('retries three times, since the request may never have arrived', async () => {
		const strategy = await handlers.NETWORK_ERROR?.handler(
			new Error('fetch failed'),
			context,
		);

		expect(strategy?.maxRetries).toBe(3);
	});
});

describe('the default handler', () => {
	it('matches anything left over', () => {
		expect(
			handlers.DEFAULT?.match(new Error('something unexpected'), context),
		).toBe(true);
	});

	it('reports rather than retries, and logs as an error not a warning', async () => {
		const strategy = await handlers.DEFAULT?.handler(
			new Error('something unexpected'),
			context,
		);

		expect(strategy?.maxRetries).toBe(0);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Unhandled error'),
		);
	});
});

describe('handler set', () => {
	it('declares every handler the core can dispatch to', () => {
		expect(Object.keys(errorHandlers)).toEqual([
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'BAD_REQUEST_ERROR',
			'SERVER_ERROR',
			'NETWORK_ERROR',
			'DEFAULT',
		]);
	});

	it('orders quota ahead of the handlers that would otherwise claim it', () => {
		// `handleCorsairError` takes the first matching handler in insertion
		// order, so this ordering is behaviour, not style.
		const names = Object.keys(errorHandlers);

		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('BAD_REQUEST_ERROR'),
		);
		expect(names.indexOf('AUTH_ERROR')).toBeLessThan(
			names.indexOf('BAD_REQUEST_ERROR'),
		);
		expect(names.indexOf('PERMISSION_ERROR')).toBeLessThan(
			names.indexOf('BAD_REQUEST_ERROR'),
		);
		expect(names[names.length - 1]).toBe('DEFAULT');
	});

	it('satisfies the core handler contract', () => {
		const asContract: CorsairErrorHandler = errorHandlers;

		for (const entry of Object.values(asContract)) {
			expect(typeof entry?.match).toBe('function');
			expect(typeof entry?.handler).toBe('function');
		}
	});
});
