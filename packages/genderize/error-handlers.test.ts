import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GenderizeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure is core's ApiError, as `request()` throws it; a request that
 * got no answer is a GenderizeAPIError.
 */
function apiError(options: {
	status?: number;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
	reason?: string;
}): Error {
	if (options.status === undefined) {
		return new GenderizeAPIError('failed', {
			method: options.method ?? 'GET',
			transport: options.transport,
			timedOut: options.timedOut,
		});
	}
	return new ApiError(
		{ method: 'GET', url: '/' },
		{
			url: 'https://api.genderize.io/',
			ok: false,
			status: options.status,
			statusText: '',
			body: options.reason === undefined ? {} : { error: options.reason },
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
	const handlers: CorsairErrorHandler = errorHandlers;
	const context: ErrorContext = {
		pluginId: 'genderize',
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
	it('retries a 429 with backoff, because the window may reset', async () => {
		await expect(resolve(apiError({ status: 429 }))).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry an exhausted quota, which lasts until the window resets', async () => {
		await expect(
			resolve(apiError({ status: 429, reason: 'Request limit reached' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('still retries the short-term throttle', async () => {
		await expect(
			resolve(apiError({ status: 429, reason: 'Request too low to process' })),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('waits a Retry-After header when one arrives', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 30_000 })),
		).resolves.toMatchObject({ headersRetryAfterMs: 30_000 });
	});

	it('does not retry a refused key', async () => {
		await expect(resolve(apiError({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a paused or unpaid subscription', async () => {
		await expect(resolve(apiError({ status: 402 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a malformed name', async () => {
		await expect(resolve(apiError({ status: 422 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx, since a read changed nothing', async () => {
		await expect(resolve(apiError({ status: 503 }))).resolves.toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a timeout once, and a timeout outranks the transport match', async () => {
		await expect(
			resolve(apiError({ transport: true, timedOut: true })),
		).resolves.toEqual({ maxRetries: 1, retryStrategy: 'linear_2s' });
	});

	it('retries a dropped connection twice', async () => {
		await expect(resolve(apiError({ transport: true }))).resolves.toMatchObject(
			{ maxRetries: 2 },
		);
	});

	it('leaves an unclassified error alone, through DEFAULT', async () => {
		await expect(resolve(new Error('something else'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins when there are no caller handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts a caller handler first but keeps DEFAULT last', () => {
		const custom: CorsairErrorHandler = {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged)[0]).toBe('CUSTOM');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toBe(custom.DEFAULT);
		// Every builtin the caller did not name is still there.
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});

	it('lets a caller replace one builtin without losing the rest', () => {
		const custom: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.AUTH_ERROR).toBe(custom.AUTH_ERROR);
		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});
});
