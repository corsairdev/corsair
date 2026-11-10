import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { KlaviyoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	authenticationFailed,
	invalidField,
	rateLimited,
} from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// unknown: the builtin map is a Partial over a wide key union; this view states
// the one signature core calls it with.
type Entry = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<RetryStrategy>;
};
const handlers = errorHandlers as unknown as Record<HandlerName, Entry>; // unknown: see Entry.

// unknown: the handlers read only the error; core builds the real context.
const context = {} as ErrorContext;

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

function apiError(
	status: number | undefined,
	// unknown: each case passes one of Klaviyo's error envelopes.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new KlaviyoAPIError(`Klaviyo ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('AUTH_ERROR', () => {
	it('does not retry a 401', async () => {
		const error = apiError(401, authenticationFailed);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('matches the code even on an unexpected status', async () => {
		expect(classify(apiError(400, authenticationFailed))).toBe('AUTH_ERROR');
	});
});

describe('PERMISSION_ERROR', () => {
	it('does not retry a 403 from a missing scope', async () => {
		expect(classify(apiError(403, {}))).toBe('PERMISSION_ERROR');
	});
});

describe('NOT_FOUND_ERROR', () => {
	it('does not retry a 404', async () => {
		const error = apiError(404, {});
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('VALIDATION_ERROR', () => {
	it('does not retry a 400', async () => {
		const error = apiError(400, invalidField);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError raised before the request', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});
});

describe('CONFLICT_ERROR', () => {
	it('does not retry a 409', async () => {
		expect(classify(apiError(409, {}))).toBe('CONFLICT_ERROR');
	});
});

describe('RATE_LIMIT_ERROR', () => {
	it('retries a 429 and uses Retry-After', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 5_000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5_000,
		});
	});

	it('falls back to a minute when no header arrived', async () => {
		// Klaviyo runs a burst and a steady window; a minute is the steady one.
		expect(await strategy(apiError(429, rateLimited))).toMatchObject({
			headersRetryAfterMs: 60_000,
		});
	});

	it('matches the code without a 429 status', async () => {
		expect(classify(apiError(undefined, rateLimited))).toBe('RATE_LIMIT_ERROR');
	});
});

describe('SERVER_ERROR', () => {
	it('replays a 5xx with backoff', async () => {
		const error = apiError(503, {});
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});

describe('TIMEOUT_ERROR and NETWORK_ERROR', () => {
	it('replays a dropped read', async () => {
		const error = apiError(undefined, {}, { method: 'GET' });
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 2 });
	});

	it('does not replay a dropped write', async () => {
		const error = apiError(undefined, {}, { method: 'POST' });
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a dropped PATCH', async () => {
		const error = apiError(undefined, {}, { method: 'PATCH' });
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
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
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_500: {
				match: (error: Error) =>
					error instanceof KlaviyoAPIError && error.status === 502,
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('MY_500');
		expect(await merged.MY_500?.handler(apiError(502), context)).toEqual({
			maxRetries: 7,
		});
	});

	it('uses the caller DEFAULT when one is given', () => {
		const callerDefault = { match: () => true, handler: async () => ({}) };
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
