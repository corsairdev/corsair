import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { NinoxAPIError } from './client';
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
		pluginId: 'ninox',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
): NinoxAPIError {
	return new NinoxAPIError(`Ninox ${status}: failed`, { status, method });
}

describe('ninox error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a 403 as a missing grant, not a bad key', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 409 from a stale _expected value', async () => {
		const error = apiError(409, 'PATCH');
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 from an untracked change feed', async () => {
		expect(classify(apiError(400))).toBe('VALIDATION_ERROR');
	});

	it('does not retry an oversized 413 payload', async () => {
		expect(classify(apiError(413, 'POST'))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(500, 'GET');
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx on a write inside a transaction', async () => {
		expect(classify(apiError(500, 'POST'))).toBe('DEFAULT');
		expect(classify(apiError(500, 'PATCH'))).toBe('DEFAULT');
		expect(classify(apiError(500, 'DELETE'))).toBe('DEFAULT');
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
