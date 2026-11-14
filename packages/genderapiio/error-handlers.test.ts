import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GENDERAPIIO_ERROR_CODES, GenderApiIoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/**
 * An HTTP failure arrives as core's ApiError carrying the problem document; a
 * request that got no answer arrives as GenderApiIoAPIError.
 */
function apiError(options: {
	status?: number;
	code?: string;
	action?: string;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
}): Error {
	if (options.transport) return new GenderApiIoAPIError('failed', options);
	return new ApiError(
		{ method: (options.method ?? 'POST') as 'POST', url: '/api/v2/gender' },
		{
			url: 'https://api.genderapi.io/api/v2/gender',
			ok: false,
			status: options.status ?? 500,
			statusText: '',
			body: { code: options.code, action: options.action },
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
		pluginId: 'genderapiio',
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
			resolve(apiError({ status: 429, retryAfter: 5000 })),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a refused key', async () => {
		await expect(
			resolve(apiError({ status: 401, code: 'invalid_api_key' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a disabled, expired or restricted key', async () => {
		for (const code of ['access_denied', 'key_disabled', 'key_expired']) {
			await expect(resolve(apiError({ status: 403, code }))).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry an empty balance, which needs credits or a reset', async () => {
		await expect(
			resolve(
				apiError({
					status: 403,
					code: GENDERAPIIO_ERROR_CODES.INSUFFICIENT_CREDITS,
				}),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 body or a 400 query', async () => {
		await expect(
			resolve(apiError({ status: 422, code: 'validation_error' })),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(apiError({ status: 400, code: 'invalid_json' })),
		).resolves.toEqual({ maxRetries: 0 });
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

	it('does not retry a billing problem, because a retry is billed again', async () => {
		await expect(
			resolve(
				apiError({ status: 503, code: 'billing_reconciliation_required' }),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(
				apiError({ status: 502, code: 'ai_upstream_error', method: 'POST' }),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(
				apiError({ status: 504, code: 'prediction_timeout', method: 'POST' }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a billed POST that failed with any 5xx', async () => {
		// 500 internal_error says contact support; a repeat is a new charge.
		await expect(
			resolve(
				apiError({ status: 500, code: 'internal_error', method: 'POST' }),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(apiError({ status: 504, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not repeat a billed POST after a timeout or a dropped connection', async () => {
		await expect(
			resolve(apiError({ method: 'POST', transport: true, timedOut: true })),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			resolve(apiError({ method: 'POST', transport: true })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry an unavailable AI, since the same request would ask again', async () => {
		await expect(
			resolve(apiError({ status: 503, code: 'ai_unavailable' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx on a free GET route', async () => {
		await expect(
			resolve(apiError({ status: 500, method: 'GET' })),
		).resolves.toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a timeout once, and a timeout outranks the transport match', async () => {
		await expect(
			resolve(apiError({ method: 'GET', transport: true, timedOut: true })),
		).resolves.toEqual({ maxRetries: 1, retryStrategy: 'linear_2s' });
	});

	it('retries a dropped connection twice', async () => {
		await expect(
			resolve(apiError({ method: 'GET', transport: true })),
		).resolves.toMatchObject({
			maxRetries: 2,
		});
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
