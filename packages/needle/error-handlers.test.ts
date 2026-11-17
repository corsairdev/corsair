import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NeedleAPIError } from './client';
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
		pluginId: 'needle',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

/** Builds the core `ApiError` the client throws for an HTTP failure. */
function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
	options: { retryAfter?: number } = {},
): ApiError {
	return new ApiError(
		{ method, url: '/leads' },
		{
			url: 'https://needle.app/api/v1/leads',
			ok: false,
			status,
			statusText: 'error',
			body: { requestId: 'r1', error: 'failed' },
		},
		'Needle failed',
		{ retryAfter: options.retryAfter },
	);
}

describe('needle error handlers', () => {
	it('does not replay a 429 core already retried with Retry-After', async () => {
		const error = apiError(429, 'GET', { retryAfter: 1500 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403, which is a scope or plan limit', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 409 duplicate identity', async () => {
		const error = apiError(409, 'POST');
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 validation failure', async () => {
		expect(classify(apiError(422, 'POST'))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a 404 for a missing lead', async () => {
		expect(classify(apiError(404))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(500, 'GET');
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx on a write, which may have gone through', async () => {
		// A POST is not matched by SERVER_ERROR, so it falls to DEFAULT.
		expect(classify(apiError(500, 'POST'))).toBe('DEFAULT');
		expect(classify(apiError(500, 'PATCH'))).toBe('DEFAULT');
		expect(classify(apiError(500, 'DELETE'))).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new NeedleAPIError('socket hang up'))).toBe('DEFAULT');
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
				pluginId: 'needle',
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
