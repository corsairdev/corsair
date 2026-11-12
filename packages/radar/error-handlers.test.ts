import type { CorsairErrorHandler } from 'corsair/core';
import { RadarAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function radarError(init: {
	status?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RadarAPIError {
	return new RadarAPIError(init.message ?? 'failed', init);
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

describe('quota handling', () => {
	it('matches a 402 and never retries it', async () => {
		const error = radarError({ status: 402 });

		expect(claims(handlers, 'QUOTA_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'QUOTA_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('stops before the rate-limit handler, which would have retried', () => {
		// A spent quota is not a throughput limit, so ordering matters.
		expect(firstMatch(handlers, radarError({ status: 402 }))).toBe(
			'QUOTA_ERROR',
		);
	});
});

describe('rate limit handling', () => {
	it('retries a 429 with exponential backoff', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			radarError({ status: 429, replayable: true }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('does not claim non-replayable rate-limited writes', async () => {
		const error = radarError({
			status: 429,
			replayable: false,
			method: 'POST',
		});
		expect(firstMatch(handlers, error)).toBe('DEFAULT');
		expect((await decide(handlers, 'DEFAULT', error))?.maxRetries).toBe(0);
	});

	it('passes a Retry-After through when one arrives', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			radarError({ status: 429, retryAfter: 2_000, replayable: true }),
		);

		expect(result?.headersRetryAfterMs).toBe(2_000);
	});
});

describe('auth handling', () => {
	it('matches a 401 and a 403 and does not retry either', async () => {
		for (const status of [401, 403]) {
			const error = radarError({ status });
			expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
			const result = await decide(handlers, 'AUTH_ERROR', error);
			expect(result?.maxRetries).toBe(0);
		}
	});
});

describe('legal handling', () => {
	it('matches a 451 country block and does not retry it', async () => {
		const error = radarError({ status: 451 });

		expect(claims(handlers, 'LEGAL_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'LEGAL_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('does not read a 451 as an auth failure', () => {
		expect(claims(handlers, 'AUTH_ERROR', radarError({ status: 451 }))).toBe(
			false,
		);
	});
});

describe('validation handling', () => {
	it('matches a 400 and a 409', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', radarError({ status: 400 })),
		).toBe(true);
		expect(
			claims(handlers, 'VALIDATION_ERROR', radarError({ status: 409 })),
		).toBe(true);
	});

	it('matches a zod rejection with no status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = radarError({ status: 404 });

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
			radarError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write', () => {
		const error = radarError({
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

		expect(claims(merged, 'AUTH_ERROR', radarError({ status: 401 }))).toBe(
			false,
		);
	});
});
