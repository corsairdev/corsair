import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { GEOKEO_STATUS, GeokeoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	code?: string;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
}) {
	return new GeokeoAPIError('failed', options);
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
		pluginId: 'geokeo',
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
	it('does not retry a used-up quota', async () => {
		await expect(
			resolve(apiError({ code: GEOKEO_STATUS.OVER_QUERY_LIMIT })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry ACCESS_DENIED', async () => {
		await expect(
			resolve(apiError({ code: GEOKEO_STATUS.ACCESS_DENIED })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry INVALID_REQUEST', async () => {
		await expect(
			resolve(apiError({ code: GEOKEO_STATUS.INVALID_REQUEST })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a real 429, which only a proxy would send', async () => {
		await expect(
			resolve(apiError({ status: 429, retryAfter: 5000 })),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a real 5xx, since a read is safe to replay', async () => {
		await expect(resolve(apiError({ status: 502 }))).resolves.toMatchObject({
			maxRetries: 2,
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

	it('leaves a code the docs do not name alone, through UNKNOWN_STATUS_ERROR', async () => {
		await expect(resolve(apiError({ code: 'SOMETHING_NEW' }))).resolves.toEqual(
			{
				maxRetries: 0,
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
			QUOTA_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.QUOTA_ERROR).toBe(custom.QUOTA_ERROR);
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});
});
