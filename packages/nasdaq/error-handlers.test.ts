import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NasdaqAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

/** Mirrors corsair core: the first handler whose match() passes, in key order. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	const entry = errorHandlers[classify(error)] as ErrorHandlerAndMatchFunction;
	return entry.handler(error, {
		pluginId: 'nasdaq',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

/**
 * Builds the core `ApiError` the client produces: the status, and a sanitized
 * body carrying Nasdaq's own code.
 * unknown: the provider's error envelope; each case passes its own shape.
 */
function apiError(
	status: number,
	code?: string,
	options: { retryAfter?: number } = {},
): ApiError {
	const body =
		code === undefined ? undefined : { quandl_error: { code, message: 'x' } };
	return new ApiError(
		{ method: 'GET', url: '/datatables/NDAQ/RTAT10.json' },
		{
			url: 'https://data.nasdaq.com/api/v3/datatables/NDAQ/RTAT10.json',
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		'Nasdaq failed',
		{ retryAfter: options.retryAfter },
	);
}

describe('nasdaq error handlers', () => {
	it('retries QEAx07 after the 30 seconds it asks for', async () => {
		const error = apiError(429, 'QEAx07', { retryAfter: 2000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			// The documented 30-second window, not a 4-second backoff.
			headersRetryAfterMs: 30_000,
			retryStrategy: 'linear_4s',
		});
	});

	it('retries a 429 without a Nasdaq code, a gateway throttle', async () => {
		const error = apiError(429, undefined, { retryAfter: 1500 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 1500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 429 QEAx06, the daily cap', async () => {
		expect(await strategy(apiError(429, 'QEAx06'))).toEqual({ maxRetries: 0 });
	});

	it('does not retry QELx06, the temporary account block', async () => {
		expect(await strategy(apiError(429, 'QELx06'))).toEqual({ maxRetries: 0 });
	});

	it('does not retry QEAx06, the daily cap', async () => {
		const error = apiError(403, 'QEAx06');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats QEAx01 as a key problem', async () => {
		const error = apiError(400, 'QEAx01');
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats QEPx04 as a missing key', async () => {
		expect(classify(apiError(403, 'QEPx04'))).toBe('AUTH_ERROR');
	});

	it('classifies a gateway 403 as blocked rather than auth', async () => {
		// No quandl_error in the body is the Incapsula page, not the API.
		const error = apiError(403);
		expect(classify(error)).toBe('BLOCKED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an expired cursor', async () => {
		const error = apiError(400, 'QESx06');
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx, because every wrapped route is a read', async () => {
		const error = apiError(500);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new NasdaqAPIError('socket hang up'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps the caller keys first and DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const names = Object.keys(merged);
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('runs a caller handler for a status no builtin covers', () => {
		const custom = {
			match: (error: Error) =>
				error instanceof ApiError && error.status === 502,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, { CUSTOM: custom });

		const failure = apiError(502);
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(failure, {
				pluginId: 'nasdaq',
				operation: 'test',
				input: {},
				originalError: failure,
			}),
		);
		expect(firstMatch?.[0]).toBe('CUSTOM');
	});

	it('uses the caller DEFAULT when both provide one', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
