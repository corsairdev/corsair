import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { AttioAPIError } from './client';
import { errorHandlers } from './error-handlers';

function ctx(error: Error): ErrorContext {
	return {
		pluginId: 'attio',
		operation: 'generated.getSelf',
		input: {},
		originalError: error,
	};
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error, ctx(error)),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/self' },
		{
			url: 'https://api.attio.com/v2/self',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('errorHandlers', () => {
	it('routes a 429 ApiError to the rate-limit handler and retries', async () => {
		const error = apiError(429, 'rate limited', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(error, ctx(error)),
		).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes a 429 AttioAPIError to the rate-limit handler', async () => {
		const error = new AttioAPIError('too many requests', 429);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(error, ctx(error)),
		).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('treats 401 as an auth failure that must not be retried', async () => {
		const error = new AttioAPIError('unauthorized', 401);
		expect(route(error)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler(error, ctx(error))).toEqual({
			maxRetries: 0,
		});
	});

	it('falls back to DEFAULT for errors with no status or known message', async () => {
		const error = new Error('socket hang up');
		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler(error, ctx(error))).toEqual({
			maxRetries: 0,
		});
	});
});
