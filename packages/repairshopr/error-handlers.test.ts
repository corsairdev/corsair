import type { CorsairErrorHandler } from 'corsair/core';
import { describeRepairshoprError, RepairshoprAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { AUTH_ERROR, VALIDATION_ERROR } from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function shopError(init: {
	status?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RepairshoprAPIError {
	return new RepairshoprAPIError(init.message ?? 'failed', init);
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
			shopError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when one arrives', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			shopError({ status: 429, retryAfter: 2_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(2_000);
	});
});

describe('auth handling', () => {
	it('matches the live 401 body', () => {
		const error = shopError({ status: 401, message: AUTH_ERROR.error });

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
	});

	it('does not retry an auth failure', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			shopError({ status: 401 }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('treats a 401 as auth, never as a missing record', () => {
		const error = shopError({ status: 401 });

		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(false);
	});
});

describe('validation handling', () => {
	it('matches a 422 and does not retry it', async () => {
		const error = shopError({ status: 422 });

		expect(claims(handlers, 'VALIDATION_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'VALIDATION_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('matches a zod rejection with no status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = shopError({ status: 404 });

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
			shopError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('never replays a 5xx write', () => {
		const error = shopError({
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

		expect(claims(merged, 'AUTH_ERROR', shopError({ status: 401 }))).toBe(
			false,
		);
	});
});

describe('message building', () => {
	it('joins every message a validation body carries', () => {
		const message = describeRepairshoprError(422, VALIDATION_ERROR, 'fallback');

		expect(message).toContain('RepairShopr 422');
		expect(message).toContain('Email is not an email');
	});
});
