import type { CorsairErrorHandler } from 'corsair/core';
import { describeRocketlaneError, RocketlaneAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { AUTH_ERROR, NOT_FOUND_ERROR, VALIDATION_ERROR } from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function laneError(init: {
	status?: number;
	code?: string;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RocketlaneAPIError {
	return new RocketlaneAPIError(init.message ?? 'failed', init);
}

/**
 * The built handlers are concrete and each takes only what it reads, so a
 * shared caller has to widen them first: core types an entry as a `Partial`
 * whose handler takes `(error, context)`.
 */
function asHandlerMap(handlers: typeof errorHandlers): CorsairErrorHandler {
	return handlers;
}

async function decide(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): Promise<Decision | undefined> {
	const entry = handlers[name];
	if (!entry?.handler) return undefined;
	return entry.handler(error, {} as never);
}

function claims(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): boolean {
	return handlers[name]?.match?.(error, {} as never) === true;
}

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
	it('retries a 429 with exponential backoff', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			laneError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when one arrives', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			laneError({ status: 429, retryAfter: 3_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(3_000);
	});

	it('leaves the delay unset when no header arrived', async () => {
		// Rocketlane documents no window, so the strategy's own backoff applies.
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			laneError({ status: 429 }),
		);

		expect(result?.headersRetryAfterMs).toBeUndefined();
	});
});

describe('auth handling', () => {
	it('matches the live NOT_AUTHORIZED body', () => {
		const error = laneError({
			status: 401,
			code: AUTH_ERROR.errors[0]?.errorCode,
		});

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
	});

	it('matches a 401 that carries no code, which a keyless request returns', () => {
		expect(claims(handlers, 'AUTH_ERROR', laneError({ status: 401 }))).toBe(
			true,
		);
	});

	it('does not retry a rejected key', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			laneError({ status: 401, code: 'NOT_AUTHORIZED' }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('routes a 403 to the permission handler, not to auth', () => {
		expect(
			claims(handlers, 'PERMISSION_ERROR', laneError({ status: 403 })),
		).toBe(true);
		expect(claims(handlers, 'AUTH_ERROR', laneError({ status: 403 }))).toBe(
			false,
		);
	});
});

describe('validation handling', () => {
	it('matches a 400 and does not retry it', async () => {
		const error = laneError({ status: 400, code: 'BAD_REQUEST' });

		expect(claims(handlers, 'VALIDATION_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'VALIDATION_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('matches a zod rejection with no status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('matches a body that says BAD_REQUEST even on another status', () => {
		expect(
			claims(
				handlers,
				'VALIDATION_ERROR',
				laneError({ status: 422, code: 'BAD_REQUEST' }),
			),
		).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 body and does not retry it', async () => {
		const error = laneError({
			status: 404,
			code: NOT_FOUND_ERROR.errors[0]?.errorCode,
		});

		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'NOT_FOUND_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});
});

describe('server handling', () => {
	it('replays a 5xx on a call declared replayable', async () => {
		const result = await decide(
			handlers,
			'SERVER_ERROR',
			laneError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx on a create', () => {
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				laneError({ status: 500, method: 'POST', replayable: false }),
			),
		).toBe(false);
		// DEFAULT catches it and stops at once.
		expect(
			firstMatch(
				handlers,
				laneError({ status: 500, method: 'POST', replayable: false }),
			),
		).toBe('DEFAULT');
	});

	it('does not replay a 5xx with no replay declaration', () => {
		expect(claims(handlers, 'SERVER_ERROR', laneError({ status: 500 }))).toBe(
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

		expect(firstMatch(merged, new Error('special'))).toBe('CUSTOM_500');
		const result = await decide(merged, 'CUSTOM_500', new Error('special'));
		expect(result?.maxRetries).toBe(7);
	});

	it('lets a caller override a builtin of the same name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		expect(claims(merged, 'AUTH_ERROR', laneError({ status: 401 }))).toBe(
			false,
		);
	});

	it('keeps a builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(claims(merged, 'NOT_FOUND_ERROR', laneError({ status: 404 }))).toBe(
			true,
		);
	});
});

describe('message building', () => {
	it('joins every message a validation body carries', () => {
		const message = describeRocketlaneError(400, VALIDATION_ERROR, 'fallback');

		expect(message).toContain('Rocketlane 400 BAD_REQUEST');
		expect(message).toContain('projectName must not be blank');
		expect(message).toContain('dueDate must be on or after startDate');
	});
});
