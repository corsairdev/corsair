import type { CorsairErrorHandler } from 'corsair/core';
import { describeRentmanError, RentmanAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	GATEWAY_FORBIDDEN,
	GATEWAY_UNAUTHORIZED,
	VALIDATION_ERROR,
} from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function rentError(init: {
	status?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RentmanAPIError {
	return new RentmanAPIError(init.message ?? 'failed', init);
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
			rentError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when one arrives', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rentError({ status: 429, retryAfter: 4_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(4_000);
	});

	it('leaves the delay unset when no header arrived', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rentError({ status: 429 }),
		);

		expect(result?.headersRetryAfterMs).toBeUndefined();
	});
});

describe('auth handling', () => {
	it('matches a 401 with no token', () => {
		expect(claims(handlers, 'AUTH_ERROR', rentError({ status: 401 }))).toBe(
			true,
		);
	});

	it('matches the gateway 403 a superseded token produces', () => {
		// Rentman keeps only the newest token, so an older one is rejected by the
		// gateway rather than the app; it is still an auth failure.
		expect(claims(handlers, 'AUTH_ERROR', rentError({ status: 403 }))).toBe(
			true,
		);
	});

	it('does not retry an auth failure', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			rentError({ status: 401, message: GATEWAY_UNAUTHORIZED.message }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('treats the 403 denial text as auth, not as a missing record', () => {
		const error = rentError({
			status: 403,
			message: GATEWAY_FORBIDDEN.Message,
		});

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(false);
	});
});

describe('validation handling', () => {
	it('matches a 400 and a 422', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', rentError({ status: 400 })),
		).toBe(true);
		expect(
			claims(handlers, 'VALIDATION_ERROR', rentError({ status: 422 })),
		).toBe(true);
	});

	it('does not retry a validation rejection', async () => {
		const result = await decide(
			handlers,
			'VALIDATION_ERROR',
			rentError({ status: 422 }),
		);

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
		const error = rentError({ status: 404 });

		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'NOT_FOUND_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});
});

describe('server handling', () => {
	it('replays a 500 and a 502 on a read', async () => {
		const result = await decide(
			handlers,
			'SERVER_ERROR',
			rentError({ status: 500, method: 'GET', replayable: true }),
		);
		expect(result?.maxRetries).toBe(2);

		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				rentError({ status: 502, method: 'GET', replayable: true }),
			),
		).toBe(true);
	});

	it('never replays a 5xx write', () => {
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				rentError({ status: 500, method: 'POST', replayable: false }),
			),
		).toBe(false);
		expect(
			firstMatch(
				handlers,
				rentError({ status: 500, method: 'POST', replayable: false }),
			),
		).toBe('DEFAULT');
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

		expect(claims(merged, 'AUTH_ERROR', rentError({ status: 401 }))).toBe(
			false,
		);
	});

	it('keeps a builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(claims(merged, 'NOT_FOUND_ERROR', rentError({ status: 404 }))).toBe(
			true,
		);
	});
});

describe('message building', () => {
	it('joins every field message a validation body carries', () => {
		const message = describeRentmanError(422, VALIDATION_ERROR, 'fallback');

		expect(message).toContain('Rentman 422');
		expect(message).toContain('name: The name field is required.');
		expect(message).toContain('customer: The selected customer is invalid.');
	});
});
