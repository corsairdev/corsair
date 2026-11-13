import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { KickboxAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	code?: string;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
	paid?: boolean;
}) {
	return new KickboxAPIError('failed', options);
}

/**
 * The first handler whose `match` passes, as core runs them: key order, with
 * DEFAULT last.
 */
// unknown: a handler result is a Partial of the retry options, and each test
// reads a different field of it.
async function resolve(
	error: Error,
): Promise<Record<string, unknown> | undefined> {
	// Every builtin handler ignores the context, but the map is typed as the
	// full handler contract here so both arguments can be passed.
	const handlers: CorsairErrorHandler = errorHandlers;
	const context: ErrorContext = {
		pluginId: 'kickbox',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		if (!entry) continue;
		if (entry.match(error, context)) {
			return (await entry.handler(error, context)) as Record<string, unknown>;
		}
	}
	return undefined;
}

describe('paid verification after an uncertain outcome', () => {
	it('does not replay a timed-out verification, which may have been charged', async () => {
		await expect(
			resolve(
				apiError({
					transport: true,
					timedOut: true,
					method: 'GET',
					paid: true,
				}),
			),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('does not replay a dropped verification, which may have been charged', async () => {
		await expect(
			resolve(apiError({ transport: true, method: 'GET', paid: true })),
		).resolves.toMatchObject({ maxRetries: 0 });
	});
});

describe('a refused key on a 200', () => {
	it('is matched as an auth error, not left to DEFAULT', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				apiError({ status: 200, code: 'FORBIDDEN', method: 'GET' }),
			),
		).toBe(true);
	});
});

describe('error handler selection', () => {
	it('does not retry a spent balance', async () => {
		await expect(
			resolve(apiError({ status: 200, code: 'INSUFFICIENT_BALANCE' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('reaches the quota handler before the rate limit one', () => {
		// Both look like "come back later"; only one of them clears.
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('retries a 429 twice with backoff', async () => {
		await expect(
			resolve(apiError({ status: 429, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits a Retry-After header when one arrives', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 7000 })),
		).resolves.toMatchObject({ headersRetryAfterMs: 7000 });
	});

	it('does not retry a 401', async () => {
		await expect(resolve(apiError({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 403', async () => {
		await expect(resolve(apiError({ status: 403 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([[400], [422]])('does not retry a %i', async (status) => {
		await expect(resolve(apiError({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx check twice, since a GET cannot be billed twice', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('retries a dropped connection', async () => {
		await expect(
			resolve(apiError({ transport: true, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('handles a timeout as a timeout, not as a plain network failure', async () => {
		await expect(
			resolve(apiError({ transport: true, timedOut: true, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 1, retryStrategy: 'linear_2s' });
	});

	it('does not retry a ZodError', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry anything else', async () => {
		await expect(resolve(new Error('something else'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('puts a caller handler where it runs, ahead of DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(Object.keys(merged)[0]).toBe('UPSTREAM_ERROR');
		expect(merged.QUOTA_ERROR).toBe(errorHandlers.QUOTA_ERROR);
	});

	it('keeps every builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		for (const name of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(name);
		}
	});

	it('lets a caller override a builtin by name', () => {
		const custom = {
			match: () => false,
			handler: async () => ({ maxRetries: 9 }),
		};

		const merged = mergeErrorHandlers(errorHandlers, { AUTH_ERROR: custom });

		expect(merged.AUTH_ERROR).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('uses the caller DEFAULT as the fallback and keeps it last', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};

		const merged = mergeErrorHandlers(errorHandlers, { DEFAULT: custom });

		expect(merged.DEFAULT).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
