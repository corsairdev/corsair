import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GagelistAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// An answered request fails as core's ApiError (a read is marked replayable
// through a real request, so the 5xx cases go through makeApiError below); one
// that got no answer as GagelistAPIError.
function apiError(options: {
	status?: number;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
	code?: string;
	replayable?: boolean;
}): Error {
	if (options.status === undefined) {
		return new GagelistAPIError('failed', options);
	}
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/api/test' },
		{
			url: 'https://api.gagelist.net/api/test',
			ok: false,
			status: options.status,
			statusText: '',
			body: options.code ? { error: options.code } : undefined,
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
		pluginId: 'gagelist',
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
	it('retries a 429 twice with backoff', async () => {
		await expect(resolve(apiError({ status: 429 }))).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits a Retry-After header when one arrives', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 3000 })),
		).resolves.toMatchObject({ headersRetryAfterMs: 3000 });
	});

	it('retries a 401 once, because the client mints a new token', async () => {
		await expect(resolve(apiError({ status: 401 }))).resolves.toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_1s',
		});
	});

	it('does not retry a refused client pair', async () => {
		await expect(
			resolve(apiError({ status: 400, code: 'invalid_client' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('reaches the credentials handler before the validation one', () => {
		// Both answer 400; only the body says which. Key order decides.
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('CLIENT_CREDENTIALS_ERROR')).toBeLessThan(
			names.indexOf('VALIDATION_ERROR'),
		);
	});

	it('does not retry a 403', async () => {
		await expect(resolve(apiError({ status: 403 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([[400], [404], [422]])('does not retry a %i', async (status) => {
		await expect(resolve(apiError({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx read twice', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'GET' })),
		).resolves.toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('does not replay a 5xx on a POST that is not marked as a read', async () => {
		await expect(
			resolve(apiError({ status: 503, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a dropped connection on a POST list read', async () => {
		await expect(
			resolve(apiError({ method: 'POST', transport: true, replayable: true })),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('never replays a 5xx gage create, which may already exist', async () => {
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
