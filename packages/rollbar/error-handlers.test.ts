import type { CorsairErrorHandler } from 'corsair/core';
import { RollbarAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function rbError(init: {
	status?: number;
	err?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RollbarAPIError {
	return new RollbarAPIError(init.message ?? 'failed', init);
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
			rbError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when a gateway adds one', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rbError({ status: 429, retryAfter: 60_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(60_000);
	});
});

describe('auth handling', () => {
	it('matches a 401 and a 403 and does not retry either', async () => {
		for (const status of [401, 403]) {
			const error = rbError({ status, err: 1 });
			expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
			const result = await decide(handlers, 'AUTH_ERROR', error);
			expect(result?.maxRetries).toBe(0);
		}
	});
});

describe('validation handling', () => {
	it('matches a 400, a 422 and a zod rejection', () => {
		expect(claims(handlers, 'VALIDATION_ERROR', rbError({ status: 400 }))).toBe(
			true,
		);
		expect(claims(handlers, 'VALIDATION_ERROR', rbError({ status: 422 }))).toBe(
			true,
		);
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = rbError({ status: 404, err: 1 });

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
			rbError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write', () => {
		const error = rbError({
			status: 500,
			method: 'PATCH',
			replayable: false,
		});

		expect(claims(handlers, 'SERVER_ERROR', error)).toBe(false);
		expect(firstMatch(handlers, error)).toBe('DEFAULT');
	});
});

describe('a body-level failure', () => {
	it('lands on DEFAULT, because no status or retry applies', async () => {
		// A 200 whose `err` was non-zero has no status, so no status handler
		// matches. That is deliberate: the body already described the failure.
		const error = rbError({ err: 1, message: 'invalid status' });

		expect(firstMatch(handlers, error)).toBe('DEFAULT');
		const result = await decide(handlers, 'DEFAULT', error);
		expect(result?.maxRetries).toBe(0);
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

		expect(claims(merged, 'AUTH_ERROR', rbError({ status: 401 }))).toBe(false);
	});
});
