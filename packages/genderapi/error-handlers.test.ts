import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GENDER_API_ERRNO, GenderApiAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure is core's ApiError, as `request()` throws it. A 200 that
 * carries an errno, or a request that got no answer, is a GenderApiAPIError.
 */
function apiError(options: {
	status?: number;
	errno?: number;
	bodyError?: boolean;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
}): Error {
	if (options.status === undefined) {
		return new GenderApiAPIError('failed', options);
	}
	return new ApiError(
		{ method: 'GET', url: '/gender' },
		{
			url: 'https://gender-api.com/gender',
			ok: false,
			status: options.status,
			statusText: '',
			body: options.errno === undefined ? {} : { errno: options.errno },
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
		pluginId: 'genderapi',
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
	it('does not retry a used-up quota, which resets on its own', async () => {
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.LIMIT_REACHED, bodyError: true }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a refused key, even on a 200', async () => {
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.INVALID_KEY, bodyError: true }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry an invalid country code', async () => {
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.INVALID_COUNTRY, bodyError: true }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a country count that does not match the names', async () => {
		await expect(
			resolve(
				apiError({
					errno: GENDER_API_ERRNO.COUNTRY_COUNT_MISMATCH,
					bodyError: true,
				}),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a missing name or too many names', async () => {
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.NAME_NOT_SET, bodyError: true }),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.TOO_MANY_NAMES, bodyError: true }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries their internal errno 500, which is a read', async () => {
		await expect(
			resolve(
				apiError({ errno: GENDER_API_ERRNO.UNKNOWN_ERROR, bodyError: true }),
			),
		).resolves.toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a real 5xx status as well', async () => {
		await expect(resolve(apiError({ status: 503 }))).resolves.toMatchObject({
			maxRetries: 2,
		});
	});

	it('retries a 429 that a proxy added, since Gender API uses errno 30', async () => {
		await expect(resolve(apiError({ status: 429 }))).resolves.toMatchObject({
			maxRetries: 2,
		});
	});

	it('waits the Retry-After a proxy sends with its 429', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 5000 })),
		).resolves.toMatchObject({ maxRetries: 2, headersRetryAfterMs: 5000 });
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

	it('leaves an unclassified body error alone', async () => {
		await expect(
			resolve(apiError({ errno: 99, bodyError: true })),
		).resolves.toEqual({ maxRetries: 0 });
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
			LIMIT_REACHED: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.LIMIT_REACHED).toBe(custom.LIMIT_REACHED);
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});
});
