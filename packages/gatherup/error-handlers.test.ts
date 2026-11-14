import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GatherupAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure is core's ApiError, as `request()` throws it. A 200 that
 * carries an errorCode, or a request that got no answer, is a
 * GatherupAPIError.
 */
function apiError(options: {
	status?: number;
	errorCode?: number;
	bodyError?: boolean;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
}): Error {
	const method = (options.method ?? 'POST') as 'GET' | 'POST' | 'PUT';
	if (options.status === undefined) {
		return new GatherupAPIError('failed', {
			errorCode: options.errorCode,
			bodyError: options.bodyError,
			method,
			transport: options.transport,
			timedOut: options.timedOut,
		});
	}
	return new ApiError(
		{ method, url: '/api/v2/test' },
		{
			url: 'https://app.gatherup.com/api/v2/test',
			ok: false,
			status: options.status,
			statusText: '',
			body: { errorCode: options.errorCode, errorMessage: 'failed' },
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
		pluginId: 'gatherup',
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
	it('retries a 503 read, which is how GatherUp signals its 5-a-second limit', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([['POST'], ['PUT']])(
		'does not retry a 503 on a %s, which may have landed',
		async (method) => {
			await expect(
				resolve(apiError({ status: 503, method })),
			).resolves.toMatchObject({ maxRetries: 0 });
		},
	);

	it('retries a 429 on a write too, since nothing ran', async () => {
		await expect(
			resolve(apiError({ status: 429, method: 'POST' })),
		).resolves.toMatchObject({
			maxRetries: 3,
		});
	});

	it('waits a Retry-After header when one arrives', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'GET', retryAfter: 2000 })),
		).resolves.toMatchObject({ headersRetryAfterMs: 2000 });
	});

	it('does not retry an invalid clientId, even on a 200', async () => {
		await expect(
			resolve(apiError({ errorCode: 2, bodyError: true })),
		).resolves.toEqual({ maxRetries: 0 });
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

	it.each([[400], [404]])('does not retry a %i', async (status) => {
		await expect(resolve(apiError({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats a 500 as a server error rather than a rate limit', async () => {
		// 503 is the rate limit here, so a 500 must not be retried as one.
		await expect(
			resolve(apiError({ status: 500, method: 'POST' })),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx read twice', async () => {
		await expect(
			resolve(apiError({ status: 500, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('never replays a 5xx customer create', async () => {
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
