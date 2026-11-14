import type { CorsairErrorHandler } from 'corsair/core';
import { RoamAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MISSING_SCOPE } from './test-fixtures';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function roamError(init: {
	status?: number;
	code?: string;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RoamAPIError {
	return new RoamAPIError(init.message ?? 'failed', init);
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
			roamError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes a Retry-After through when one arrives', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			roamError({ status: 429, retryAfter: 7_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(7_000);
	});
});

describe('auth handling', () => {
	it('matches not_authed and invalid_token', () => {
		expect(
			claims(
				handlers,
				'AUTH_ERROR',
				roamError({ status: 401, code: 'not_authed' }),
			),
		).toBe(true);
		expect(
			claims(
				handlers,
				'AUTH_ERROR',
				roamError({ status: 401, code: 'invalid_token' }),
			),
		).toBe(true);
	});

	it('matches a revoked token and stops before the generic auth handler', () => {
		const error = roamError({ status: 401, code: 'token_revoked' });

		// The docs say to discard a revoked token, so it gets its own entry.
		expect(claims(handlers, 'TOKEN_REVOKED_ERROR', error)).toBe(true);
		expect(firstMatch(handlers, error)).toBe('TOKEN_REVOKED_ERROR');
	});

	it('does not retry a revoked token', async () => {
		const result = await decide(
			handlers,
			'TOKEN_REVOKED_ERROR',
			roamError({ status: 401, code: 'token_revoked' }),
		);

		expect(result?.maxRetries).toBe(0);
	});

	it('does not retry a rejected token', async () => {
		const result = await decide(
			handlers,
			'AUTH_ERROR',
			roamError({ status: 401, code: 'invalid_token' }),
		);

		expect(result?.maxRetries).toBe(0);
	});
});

describe('permission handling', () => {
	it('matches missing_scope and a bare 403', () => {
		const scopeError = roamError({
			status: 403,
			code: MISSING_SCOPE.error,
		});

		expect(claims(handlers, 'PERMISSION_ERROR', scopeError)).toBe(true);
		// A scope failure is not a dead token, so it must not land on AUTH_ERROR.
		expect(claims(handlers, 'AUTH_ERROR', scopeError)).toBe(false);
	});

	it('does not retry a scope failure, which a retry cannot fix', async () => {
		const result = await decide(
			handlers,
			'PERMISSION_ERROR',
			roamError({ status: 403, code: 'missing_scope' }),
		);

		expect(result?.maxRetries).toBe(0);
	});
});

describe('validation handling', () => {
	it('matches a 400 and a zod rejection', () => {
		expect(
			claims(handlers, 'VALIDATION_ERROR', roamError({ status: 400 })),
		).toBe(true);
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches an unknown method and does not retry it', async () => {
		const error = roamError({ status: 404, code: 'not_found' });

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
			roamError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('replays a read that failed before any response arrived', () => {
		const error = roamError({
			message: 'fetch failed',
			method: 'GET',
			replayable: true,
		});

		expect(firstMatch(handlers, error)).toBe('SERVER_ERROR');
	});

	it('never replays a write that failed before any response arrived', () => {
		const error = roamError({
			message: 'fetch failed',
			method: 'POST',
			replayable: false,
		});

		expect(firstMatch(handlers, error)).toBe('DEFAULT');
	});

	it('never replays a 5xx write', () => {
		const error = roamError({
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

		expect(claims(merged, 'AUTH_ERROR', roamError({ status: 401 }))).toBe(
			false,
		);
	});
});
