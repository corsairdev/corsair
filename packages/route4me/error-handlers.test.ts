import type { CorsairErrorHandler } from 'corsair/core';
import { describeRoute4MeError, Route4MeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	V4_AUTH_ERROR,
	V5_AUTH_ERROR,
	V5_VALIDATION_ERROR,
} from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function routeError(init: {
	status?: number;
	code?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): Route4MeAPIError {
	return new Route4MeAPIError(init.message ?? 'failed', init);
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
			routeError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when a gateway adds one', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			routeError({ status: 429, retryAfter: 5_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(5_000);
	});

	it('leaves the delay unset when Route4Me sent no Retry-After', async () => {
		// Route4Me documents no window, so the strategy's own backoff applies
		// rather than a made-up fixed delay.
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			routeError({ status: 429 }),
		);

		expect(result?.headersRetryAfterMs).toBeUndefined();
	});
});

describe('auth handling', () => {
	it('matches v4 401 and v5 401 alike', () => {
		expect(claims(handlers, 'AUTH_ERROR', routeError({ status: 401 }))).toBe(
			true,
		);
		expect(
			claims(
				handlers,
				'AUTH_ERROR',
				routeError({ status: 401, message: V5_AUTH_ERROR.error }),
			),
		).toBe(true);
	});

	it('does not retry a rejected key', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			routeError({ status: 401, message: V4_AUTH_ERROR.errors[0] }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('routes a 403 to the permission handler, not to auth', () => {
		expect(
			claims(handlers, 'PERMISSION_ERROR', routeError({ status: 403 })),
		).toBe(true);
		expect(claims(handlers, 'AUTH_ERROR', routeError({ status: 403 }))).toBe(
			false,
		);
	});
});

describe('validation handling', () => {
	it('matches a v5 406, which is its validation status here', async () => {
		// The plugin always sends Accept: application/json, so a 406 cannot be
		// content negotiation; it is a rejected field.
		const error = routeError({
			status: 406,
			message: V5_VALIDATION_ERROR.messages[1],
		});

		expect(claims(handlers, 'VALIDATION_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'VALIDATION_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('matches a 400', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', routeError({ status: 400 })),
		).toBe(true);
	});

	it('matches a zod rejection with no status', () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('does not treat a 406 as an auth or server problem', () => {
		const error = routeError({ status: 406 });

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(false);
		expect(claims(handlers, 'SERVER_ERROR', error)).toBe(false);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = routeError({ status: 404 });

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
			routeError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('replays a 5xx on a POST that only reads', () => {
		// v5's routes.list and orders.list are POSTs with no side effect.
		const postRead = routeError({
			status: 500,
			method: 'POST',
			replayable: true,
		});

		expect(claims(handlers, 'SERVER_ERROR', postRead)).toBe(true);
	});

	it('never replays a 5xx write, whatever its method', () => {
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				routeError({ status: 500, method: 'POST', replayable: false }),
			),
		).toBe(false);
		expect(
			claims(
				handlers,
				'SERVER_ERROR',
				routeError({ status: 500, method: 'PATCH', replayable: false }),
			),
		).toBe(false);
	});

	it('does not treat a 5xx without a replay declaration as replayable', () => {
		expect(claims(handlers, 'SERVER_ERROR', routeError({ status: 500 }))).toBe(
			false,
		);
		// The DEFAULT handler catches it and stops immediately.
		expect(firstMatch(handlers, routeError({ status: 500 }))).toBe('DEFAULT');
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

		expect(claims(merged, 'AUTH_ERROR', routeError({ status: 401 }))).toBe(
			false,
		);
	});

	it('keeps a builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(claims(merged, 'NOT_FOUND_ERROR', routeError({ status: 404 }))).toBe(
			true,
		);
	});
});

describe('two-generation messages', () => {
	it('reads a v4 message and a v5 message the same way', () => {
		expect(describeRoute4MeError(401, V4_AUTH_ERROR, 'fallback')).toBe(
			'Route4Me 401: Invalid API key',
		);
		expect(describeRoute4MeError(401, V5_AUTH_ERROR, 'fallback')).toBe(
			'Route4Me 401: Unauthenticated',
		);
	});
});
