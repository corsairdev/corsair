import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { NgrokAPIError } from './client';
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
		pluginId: 'ngrok',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

function apiError(
	status: number,
	options: { code?: string; method?: string } = {},
): NgrokAPIError {
	return new NgrokAPIError(`ngrok ${status}: failed`, { status, ...options });
}

describe('ngrok error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('separates a missing header from a bad credential by code', async () => {
		// Both are a 403, and only the code says which fix applies.
		expect(classify(apiError(403, { code: 'ERR_NGROK_200' }))).toBe(
			'AUTH_ERROR',
		);
		expect(classify(apiError(403, { code: 'ERR_NGROK_202' }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('recognises a revoked key by its own code', async () => {
		const error = apiError(401, { code: 'ERR_NGROK_201' });
		expect(classify(error)).toBe('REVOKED_KEY_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a domain already reserved by another account', async () => {
		const error = apiError(409, { code: 'ERR_NGROK_230' });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404 for a missing endpoint', async () => {
		expect(classify(apiError(404))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(500, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx on a create, update or delete', async () => {
		expect(classify(apiError(500, { method: 'POST' }))).toBe('DEFAULT');
		expect(classify(apiError(500, { method: 'PATCH' }))).toBe('DEFAULT');
		expect(classify(apiError(500, { method: 'DELETE' }))).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
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
				error instanceof NgrokAPIError && error.status === 502,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, { CUSTOM: custom });

		const failure = new NgrokAPIError('bad gateway', { status: 502 });
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(failure, {
				pluginId: 'ngrok',
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
