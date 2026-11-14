import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GammaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure is core's ApiError, as `request()` throws it; a request that
 * got no answer is a GammaAPIError.
 */
function apiError(options: {
	status?: number;
	code?: string;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
}): Error {
	const method = (options.method ?? 'POST') as 'GET' | 'POST' | 'DELETE';
	if (options.status === undefined) {
		return new GammaAPIError('failed', {
			method,
			transport: options.transport,
			timedOut: options.timedOut,
		});
	}
	return new ApiError(
		{ method, url: '/v1.0/test' },
		{
			url: 'https://public-api.gamma.app/v1.0/test',
			ok: false,
			status: options.status,
			statusText: '',
			body: { message: 'failed', code: options.code },
		},
		'failed',
		{ retryAfter: options.retryAfter },
	);
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
		pluginId: 'gamma',
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

describe('error handler selection', () => {
	it('does not retry a spent workspace', async () => {
		await expect(resolve(apiError({ status: 402 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('reaches the quota handler before the rate limit and permission ones', () => {
		// A 402 is permanent, and both of the others look like a transient block.
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(
			names.indexOf('PERMISSION_ERROR'),
		);
	});

	it('retries a 429 three times with backoff', async () => {
		await expect(resolve(apiError({ status: 429 }))).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits the Retry-After header Gamma sends', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 5000 })),
		).resolves.toMatchObject({ headersRetryAfterMs: 5000 });
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

	it('does not retry a 409, which is another edit running', async () => {
		await expect(
			resolve(apiError({ status: 409, code: 'edit_in_progress' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([[400], [404], [413]])('does not retry a %i', async (status) => {
		await expect(resolve(apiError({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 503 on a read, which Gamma says to retry', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 503 generation, which may have started and spent credits', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'POST' })),
		).resolves.toEqual({
			maxRetries: 0,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('reads an agent route out of credits as quota, not permission', async () => {
		await expect(
			resolve(apiError({ status: 403, code: 'insufficient_credits' })),
		).resolves.toEqual({ maxRetries: 0 });
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(
			names.indexOf('PERMISSION_ERROR'),
		);
	});

	it('retries a 5xx read twice', async () => {
		await expect(
			resolve(apiError({ status: 500, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('never replays a 5xx generation create, which spends credits', async () => {
		await expect(
			resolve(apiError({ status: 500, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a dropped connection on a read', async () => {
		await expect(
			resolve(apiError({ transport: true, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('never replays a dropped connection on a write', async () => {
		await expect(
			resolve(apiError({ transport: true, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0, retryStrategy: 'exponential_backoff' });
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

	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
