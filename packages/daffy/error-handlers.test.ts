import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers, isNonIdempotent } from './error-handlers';

function rateLimitError(retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/gifts' },
		{
			url: 'https://public.daffy.org/v1/gifts',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		},
		'Too Many Requests',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function context(operation: string, error: Error): ErrorContext {
	return { pluginId: 'daffy', operation, input: {}, originalError: error };
}

describe('Daffy error handlers', () => {
	it('matches Daffy rate-limit responses', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError())).toBe(true);
	});

	it('does not replay gift creation after a rate-limit response', async () => {
		const error = rateLimitError(2000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context('gifts.create', error),
		);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('retries read operations and forwards Retry-After', async () => {
		const error = rateLimitError(2000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context('gifts.list', error),
		);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('classifies only gift creation as non-idempotent', () => {
		expect(isNonIdempotent('gifts.create')).toBe(true);
		expect(isNonIdempotent('gifts.list')).toBe(false);
	});
});
