import type { CorsairErrorHandler } from 'corsair/core';
import { RaiselyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { FORBIDDEN } from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function raiselyError(init: {
	status?: number;
	code?: string;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RaiselyAPIError {
	return new RaiselyAPIError(init.message ?? 'failed', init);
}

/** Widens the concrete handlers so a shared caller can invoke them. */
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
			raiselyError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes the documented Retry-After through', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			raiselyError({ status: 429, retryAfter: 30_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(30_000);
	});
});

describe('auth handling', () => {
	it('matches the live forbidden body', () => {
		const error = raiselyError({
			status: 403,
			code: FORBIDDEN.code,
			message: FORBIDDEN.detail,
		});

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
	});

	it('matches a 401 and a body-coded forbidden', () => {
		expect(claims(handlers, 'AUTH_ERROR', raiselyError({ status: 401 }))).toBe(
			true,
		);
		expect(
			claims(
				handlers,
				'AUTH_ERROR',
				raiselyError({ status: 400, code: 'forbidden' }),
			),
		).toBe(true);
	});

	it('does not retry an auth failure', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			raiselyError({ status: 403 }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('never reads a 403 as a missing record', () => {
		expect(
			claims(handlers, 'NOT_FOUND_ERROR', raiselyError({ status: 403 })),
		).toBe(false);
	});
});

describe('validation handling', () => {
	it('matches a 422 and its body code', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', raiselyError({ status: 422 })),
		).toBe(true);
		expect(
			claims(
				handlers,
				'VALIDATION_ERROR',
				raiselyError({ status: 500, code: 'validation-error' }),
			),
		).toBe(true);
	});

	it('matches a zod rejection with no status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('does not retry a validation rejection', async () => {
		const result = await decide(
			handlers,
			'VALIDATION_ERROR',
			raiselyError({ status: 422 }),
		);

		expect(result?.maxRetries).toBe(0);
	});
});

describe('gone and not-found handling', () => {
	it('matches 404 and 410 and does not retry either', async () => {
		for (const status of [404, 410]) {
			const error = raiselyError({ status });
			expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(true);
			const result = await decide(handlers, 'NOT_FOUND_ERROR', error);
			expect(result?.maxRetries).toBe(0);
		}
	});
});

describe('server handling', () => {
	it('replays a 5xx read', async () => {
		const result = await decide(
			handlers,
			'SERVER_ERROR',
			raiselyError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write', () => {
		const error = raiselyError({
			status: 500,
			method: 'POST',
			replayable: false,
		});

		expect(claims(handlers, 'SERVER_ERROR', error)).toBe(false);
		expect(firstMatch(handlers, error)).toBe('DEFAULT');
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

		expect(claims(merged, 'AUTH_ERROR', raiselyError({ status: 403 }))).toBe(
			false,
		);
	});
});
