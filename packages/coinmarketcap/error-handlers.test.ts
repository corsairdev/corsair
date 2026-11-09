import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { CoinMarketCapAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { rateLimitResponse, unknownRouteResponse } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// The real entry type. Read through it rather than off the `Partial` map, whose
// union of handler signatures collapses to the shortest parameter list.
type Entry = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<RetryStrategy>;
};

// The builtin map is a `Partial` over a wide key union, so its value type
// cannot be indexed for a call; this view states the one signature core uses.
// unknown: the builtin map is a Partial over a wide key union; this view
// states the one signature core calls it with.
const handlers = errorHandlers as unknown as Record<HandlerName, Entry>; // unknown: see above.

/** Mirrors core: the first handler whose match() passes, in key order. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(handlers) as HandlerName[]).find((key) =>
		handlers[key].match(error, context),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return handlers[classify(error)].handler(error, context);
}

// unknown: the handlers read only `originalError`; core builds the real context.
const context = {} as ErrorContext;

function apiError(
	status: number,
	// unknown: each case passes one of CoinMarketCap's error envelopes.
	body: unknown = {},
	options: { retryAfter?: number } = {},
) {
	return new CoinMarketCapAPIError(`CoinMarketCap ${status}: failed`, {
		status,
		body,
		retryAfter: options.retryAfter,
		method: 'GET',
	});
}

describe('AUTH_ERROR', () => {
	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('matches the error_code even on an unexpected status', async () => {
		// 1001 arrives on a 401; the code alone is enough to refuse a retry.
		expect(classify(apiError(400, { status: { error_code: 1001 } }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches a disabled key', async () => {
		expect(classify(apiError(403, { status: { error_code: 1007 } }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches a missing key', async () => {
		expect(classify(apiError(401, { status: { error_code: 1002 } }))).toBe(
			'AUTH_ERROR',
		);
	});
});

describe('PERMISSION_ERROR', () => {
	it('does not retry a plan that lacks the endpoint', async () => {
		const error = apiError(403, { status: { error_code: 1006 } });
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('matches the API_KEY_REQUIRED code on its own', async () => {
		expect(classify(apiError(403, { status: { error_code: 1005 } }))).toBe(
			'PERMISSION_ERROR',
		);
	});
});

describe('BILLING_ERROR', () => {
	it('does not retry an expired subscription', async () => {
		const error = apiError(402, { status: { error_code: 1004 } });
		expect(classify(error)).toBe('BILLING_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an unactivated key', async () => {
		expect(classify(apiError(402, { status: { error_code: 1003 } }))).toBe(
			'BILLING_ERROR',
		);
	});
});

describe('QUOTA_ERROR', () => {
	it('does not retry the daily credit limit', async () => {
		const error = apiError(429, { status: { error_code: 1009 } });
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the monthly credit limit', async () => {
		expect(classify(apiError(429, { status: { error_code: 1010 } }))).toBe(
			'QUOTA_ERROR',
		);
	});

	it('does not retry the anonymous allowance, which the live API sends', async () => {
		const error = apiError(429, rateLimitResponse);
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('sits before RATE_LIMIT_ERROR, which matches the same status', async () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.indexOf('QUOTA_ERROR')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
	});
});

describe('RATE_LIMIT_ERROR', () => {
	it('retries the minute limit', async () => {
		const error = apiError(429, { status: { error_code: 1008 } });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 60_000,
		});
	});

	it('retries the IP limit', async () => {
		expect(classify(apiError(429, { status: { error_code: 1011 } }))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('retries a 429 whose body carries no code', async () => {
		// A gateway in front of the API answers 429 without the envelope.
		expect(classify(apiError(429, '<html>Too Many</html>'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('uses the documented 60 second window when no Retry-After arrived', async () => {
		expect(
			await strategy(apiError(429, { status: { error_code: 1008 } })),
		).toMatchObject({ headersRetryAfterMs: 60_000 });
	});

	it('lets a real Retry-After override the fallback', async () => {
		expect(
			await strategy(
				apiError(429, { status: { error_code: 1008 } }, { retryAfter: 3_000 }),
			),
		).toMatchObject({ headersRetryAfterMs: 3_000 });
	});
});

describe('VALIDATION_ERROR', () => {
	it('does not retry a 400', async () => {
		const error = apiError(400, { status: { error_code: 400 } });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError raised before the request', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404))).toBe('VALIDATION_ERROR');
	});
});

describe('SERVER_ERROR', () => {
	it('replays a 500, because every operation here is a read', async () => {
		const error = apiError(503);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not catch a 4xx', async () => {
		expect(classify(apiError(400))).not.toBe('SERVER_ERROR');
	});

	it('replays a 200-with-error envelope, which arrives as a 500', async () => {
		// errorFromEnvelope sets `status` to the body code, so a /v3 catch-all
		// answer reaching a handler looks like a 500.
		const error = apiError(500, unknownRouteResponse);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toMatchObject({ maxRetries: 2 });
	});
});

describe('DEFAULT', () => {
	it('is last in key order', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('matches an error no other handler claims', async () => {
		const error = new Error('something else');
		error.name = 'SomeOtherError';
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: { match: () => false, handler: async () => ({}) },
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('puts a caller handler first so it is the one that runs', async () => {
		// A caller handler for a status no builtin covers never runs if the
		// builtin keys keep their position, because DEFAULT claims the error
		// first.
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_500: {
				match: (error: Error) =>
					error instanceof CoinMarketCapAPIError && error.status === 502,
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('MY_500');
		expect(await merged.MY_500?.handler(apiError(502), context)).toEqual({
			maxRetries: 7,
		});
	});

	it('lets the caller replace a builtin handler and moves it first', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: { match: () => false, handler: async () => ({}) },
		});
		expect(merged.SERVER_ERROR?.match(new Error('x'), context)).toBe(false);
		// Caller keys come first, so a caller override is never shadowed by a
		// builtin DEFAULT.
		expect(Object.keys(merged)[0]).toBe('SERVER_ERROR');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});

	it('keeps the builtin DEFAULT when the caller sets none', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({}) },
		});
		expect(merged.DEFAULT).toBe(errorHandlers.DEFAULT);
	});

	it('uses the caller DEFAULT when one is given', () => {
		const callerDefault = { match: () => true, handler: async () => ({}) };
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
