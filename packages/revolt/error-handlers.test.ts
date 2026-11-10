import type { CorsairErrorHandler } from 'corsair/core';
import { RevoltAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function rvError(init: {
	status?: number;
	reason?: string;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RevoltAPIError {
	return new RevoltAPIError(init.message ?? 'failed', init);
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

describe('block handling', () => {
	it('matches a Blocked 429 and never retries it', async () => {
		const error = rvError({ status: 429, reason: 'Blocked' });

		expect(claims(handlers, 'BLOCKED_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'BLOCKED_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('stops before the rate-limit handler, which would have retried', () => {
		// A block also answers 429, so ordering is what keeps it from looping.
		expect(
			firstMatch(handlers, rvError({ status: 429, reason: 'Blocked' })),
		).toBe('BLOCKED_ERROR');
	});
});

describe('rate limit handling', () => {
	it('retries a RateLimited 429 with exponential backoff', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rvError({ status: 429, reason: 'RateLimited' }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('waits the body retry_after, which is already in milliseconds', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rvError({ status: 429, reason: 'RateLimited', retryAfter: 1200 }),
		);

		expect(result?.headersRetryAfterMs).toBe(1200);
	});
});

describe('auth handling', () => {
	it('matches a 401 and a 403 and does not retry either', async () => {
		for (const status of [401, 403]) {
			const error = rvError({ status });
			expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
			const result = await decide(handlers, 'AUTH_ERROR', error);
			expect(result?.maxRetries).toBe(0);
		}
	});
});

describe('validation handling', () => {
	it('matches a 400, a 413 and a zod rejection', () => {
		expect(claims(handlers, 'VALIDATION_ERROR', rvError({ status: 400 }))).toBe(
			true,
		);
		expect(claims(handlers, 'VALIDATION_ERROR', rvError({ status: 413 }))).toBe(
			true,
		);
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = rvError({ status: 404 });

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
			rvError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write', () => {
		const error = rvError({
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

		expect(claims(merged, 'AUTH_ERROR', rvError({ status: 401 }))).toBe(false);
	});
});
