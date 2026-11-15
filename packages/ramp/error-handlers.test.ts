import type { CorsairErrorHandler } from 'corsair/core';
import { RAMP_RATE_LIMIT_COOLDOWN_MS, RampAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { INVALID_TOKEN_BODY, SCOPE_ERROR_BODY } from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function rampError(init: {
	status?: number;
	code?: string;
	message?: string;
	retryAfter?: number;
	method?: string;
}): RampAPIError {
	return new RampAPIError(init.message ?? 'failed', init);
}

/**
 * The built handlers are concrete and each takes only what it reads, so a
 * shared caller has to widen them first: core types an entry as a `Partial`
 * whose handler takes `(error, context)`.
 */
function asHandlerMap(handlers: typeof errorHandlers): CorsairErrorHandler {
	return handlers;
}

/** Runs one named entry out of a typed handler map. */
async function decide(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): Promise<Decision | undefined> {
	const entry = handlers[name];
	if (!entry?.handler) return undefined;
	return entry.handler(error, {} as never);
}

/** Whether one named entry claims the error. */
function claims(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): boolean {
	return handlers[name]?.match?.(error, {} as never) === true;
}

/** The first entry, in key order, whose matcher claims the error. */
function firstMatch(
	handlers: CorsairErrorHandler,
	error: Error,
): string | undefined {
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match?.(error, {} as never),
	)?.[0];
}

const handlers = asHandlerMap(errorHandlers);

describe('rate limit handling', () => {
	it('retries a 429 with a documented exponential backoff', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rampError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('uses Retry-After when Ramp sent one', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rampError({ status: 429, retryAfter: 12_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(12_000);
	});

	it('falls back to the documented 60 second cooldown without the header', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rampError({ status: 429 }),
		);

		expect(result?.headersRetryAfterMs).toBe(RAMP_RATE_LIMIT_COOLDOWN_MS);
		expect(RAMP_RATE_LIMIT_COOLDOWN_MS).toBe(60_000);
	});

	it('does not match a 400, even though Ramp answers one for a bad filter', () => {
		expect(
			claims(handlers, 'RATE_LIMIT_ERROR', rampError({ status: 400 })),
		).toBe(false);
	});
});

describe('auth handling', () => {
	it('matches the invalid-token 404 the live API sends', () => {
		const error = rampError({ status: 404, code: 'DEVELOPER_7002' });

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(false);
		// A bad key must not be reported as a missing record.
		expect(firstMatch(handlers, error)).toBe('AUTH_ERROR');
	});

	it('matches a plain 401', () => {
		expect(claims(handlers, 'AUTH_ERROR', rampError({ status: 401 }))).toBe(
			true,
		);
	});

	it('does not retry an auth failure', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			rampError({
				status: 404,
				code: 'DEVELOPER_7002',
				message: INVALID_TOKEN_BODY.error_v2.message,
			}),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('routes a read-only token refusal to the permission handler', () => {
		const error = rampError({
			status: 403,
			code: SCOPE_ERROR_BODY.error_v2.error_code,
		});

		expect(claims(handlers, 'PERMISSION_ERROR', error)).toBe(true);
		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(false);
	});
});

describe('validation and not-found handling', () => {
	it('matches a zod rejection without a status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('matches a 400', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', rampError({ status: 400 })),
		).toBe(true);
	});

	it('matches a genuine 404 and never retries it', async () => {
		const error = rampError({ status: 404, code: 'DEVELOPER_7004' });

		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'NOT_FOUND_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});
});

describe('server handling', () => {
	it('replays a 5xx read', async () => {
		const result = await decide(
			handlers,
			'SERVER_ERROR',
			rampError({ status: 504, method: 'GET' }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write, which may already have landed', () => {
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				rampError({ status: 504, method: 'PATCH' }),
			),
		).toBe(false);
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				rampError({ status: 504, method: 'POST' }),
			),
		).toBe(false);
	});

	it('does not treat a 5xx without a known method as replayable', () => {
		expect(claims(handlers, 'SERVER_ERROR', rampError({ status: 500 }))).toBe(
			false,
		);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin map untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('runs a caller handler for a case no builtin covers', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_500: {
				match: (error: Error) => error.message === 'special',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		// The caller's key must be reached before DEFAULT claims the error.
		expect(firstMatch(merged, new Error('special'))).toBe('CUSTOM_500');
		const result = await decide(merged, 'CUSTOM_500', new Error('special'));
		expect(result?.maxRetries).toBe(7);
	});

	it('lets a caller override a builtin of the same name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		expect(claims(merged, 'RATE_LIMIT_ERROR', rampError({ status: 429 }))).toBe(
			false,
		);
	});

	it('keeps the builtin value under a name the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(claims(merged, 'AUTH_ERROR', rampError({ status: 401 }))).toBe(true);
	});
});
