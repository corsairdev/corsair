import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { FollowUpBossAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// The handlers ignore the context, so one shared fixture covers every call.
const errorContext: ErrorContext = {
	pluginId: 'followupboss',
	operation: 'test.operation',
	input: {},
	originalError: new Error('original'),
};

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number,
	// unknown: each case passes one of FUB's `{ errorMessage }` bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new FollowUpBossAPIError(`Follow Up Boss ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Follow Up Boss error handlers', () => {
	it('retries a 429 with backoff, waiting five times', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when FUB sends one', async () => {
		const error = apiError(429, {}, { retryAfter: 8000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 8000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches only a FollowUpBossAPIError 429, not other errors', () => {
		expect(classify(new Error('Too Many Requests'))).toBe('DEFAULT');
	});

	it('does not retry a 401 with a wrong or revoked API key', async () => {
		const error = apiError(401, { errorMessage: 'Invalid API key' });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	// 403 is also the status FUB answers with when the account has expired
	// into its grace period and is locked down.
	it('does not retry a 403 from a locked or expired account', async () => {
		const error = apiError(403, { errorMessage: 'Account is locked' });
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'DELETE'])('does not replay a failed %s', async (method) => {
		const error = apiError(500, {}, { method });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a read that failed before any status came back', async () => {
		const error = new FollowUpBossAPIError('fetch failed', {
			cause: new TypeError('fetch failed'),
			method: 'GET',
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	// unknown: handlers are opaque match/handler pairs; only the return value
	// of handler() is inspected.
	const error = apiError(401);

	it('returns the built-ins untouched when no user handlers are given', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('lets user handlers override a built-in with the same key', async () => {
		const user: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: (e: Error) => e instanceof FollowUpBossAPIError,
				handler: async () => ({ maxRetries: 9 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, user);
		expect(await merged.AUTH_ERROR?.handler(error, errorContext)).toEqual({
			maxRetries: 9,
		});
		// Untouched built-ins stay.
		expect(
			await merged.RATE_LIMIT_ERROR?.handler(apiError(429), errorContext),
		).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('keeps the built-in DEFAULT when the user adds none', async () => {
		const user: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 9 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, user);
		expect(merged.DEFAULT).toBe(errorHandlers.DEFAULT);
		// Handlers match in key order, so DEFAULT must stay last.
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(error, errorContext)).toEqual({
			maxRetries: 0,
		});
	});

	it('lets the user replace the built-in DEFAULT', async () => {
		const user: CorsairErrorHandler = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, user);
		expect(merged.DEFAULT).toBe(user.DEFAULT);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(error, errorContext)).toEqual({
			maxRetries: 7,
		});
	});
});
