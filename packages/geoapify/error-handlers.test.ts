import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GeoapifyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure arrives as core's ApiError; a request that got no answer
 * arrives as GeoapifyAPIError.
 */
function apiError(options: {
	status?: number;
	reason?: string;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
	message?: string;
}): Error {
	if (options.transport) return new GeoapifyAPIError('failed', options);
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/v1/geocode/search' },
		{
			url: 'https://api.geoapify.com/v1/geocode/search',
			ok: false,
			status: options.status ?? 500,
			statusText: '',
			body: { statusCode: options.status, error: options.reason },
		},
		options.message ?? 'failed',
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
		pluginId: 'geoapify',
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
	it('retries a 429 with backoff and honours Retry-After', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 60_000 })),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry an exhausted quota, which only fails again until it resets', async () => {
		const quota = apiError({
			status: 429,
			retryAfter: 60_000,
			message: 'Geoapify 429 Too Many Requests: Quota exceeded',
		});
		await expect(resolve(quota)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry an invalid key', async () => {
		await expect(resolve(apiError({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a parameter the gateway refused', async () => {
		await expect(resolve(apiError({ status: 400 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry an unknown route', async () => {
		await expect(resolve(apiError({ status: 404 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx, since every call here is a read', async () => {
		await expect(resolve(apiError({ status: 500 }))).resolves.toMatchObject({
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
			{
				maxRetries: 2,
			},
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
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});

	it('lets a caller replace one builtin without losing the rest', () => {
		const custom: CorsairErrorHandler = {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.RATE_LIMIT_ERROR).toBe(custom.RATE_LIMIT_ERROR);
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});
});
