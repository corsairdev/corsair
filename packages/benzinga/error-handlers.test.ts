import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function rateLimitError(retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.benzinga.com/api/v2/news' },
		{
			url: 'https://api.benzinga.com/api/v2/news',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: 'Rate limit exceeded',
		},
		'Too Many Requests',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function statusError(status: number, body: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.benzinga.com/api/v2/news' },
		{
			url: 'https://api.benzinga.com/api/v2/news',
			ok: false,
			status,
			statusText: body,
			body,
		},
		body,
	);
}

function errorContext(operation: string, error: Error): ErrorContext {
	return {
		pluginId: 'benzinga',
		operation,
		input: {},
		originalError: error,
	};
}

describe('Benzinga error handlers', () => {
	it('matches 429 responses and preserves retryAfter', async () => {
		const error = rateLimitError(45000);
		const ctx = errorContext('benzinga.news.get', error);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error, ctx)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error, ctx);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(45000);
	});

	it('matches 429 without retryAfter and message-based rate limits', async () => {
		const withoutHeader = rateLimitError();
		const ctx = errorContext('benzinga.news.get', withoutHeader);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(withoutHeader, ctx)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			withoutHeader,
			ctx,
		);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBeUndefined();

		const messageBased = new Error('RATE_LIMITED: slow down');
		const messageCtx = errorContext('benzinga.news.get', messageBased);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(messageBased, messageCtx)).toBe(
			true,
		);
	});

	it('matches 401 unauthorized errors without retrying', async () => {
		const error = statusError(401, 'Unauthorized');
		const ctx = errorContext('benzinga.news.get', error);
		expect(errorHandlers.AUTH_ERROR.match(error, ctx)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error, ctx)).toBe(false);
		const strategy = await errorHandlers.AUTH_ERROR.handler(error, ctx);
		expect(strategy.maxRetries).toBe(0);

		const authFailed = new Error('auth_failed: invalid token');
		const authCtx = errorContext('benzinga.news.get', authFailed);
		expect(errorHandlers.AUTH_ERROR.match(authFailed, authCtx)).toBe(true);
	});

	it('matches 403 permission and 404 not-found errors', async () => {
		const forbidden = statusError(403, 'Forbidden');
		const forbiddenCtx = errorContext('benzinga.news.get', forbidden);
		expect(errorHandlers.PERMISSION_ERROR.match(forbidden, forbiddenCtx)).toBe(
			true,
		);
		const forbiddenStrategy = await errorHandlers.PERMISSION_ERROR.handler(
			forbidden,
			forbiddenCtx,
		);
		expect(forbiddenStrategy.maxRetries).toBe(0);

		const notFound = statusError(404, 'Not Found');
		const notFoundCtx = errorContext('benzinga.news.get', notFound);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFound, notFoundCtx)).toBe(
			true,
		);
		const notFoundStrategy = await errorHandlers.NOT_FOUND_ERROR.handler(
			notFound,
			notFoundCtx,
		);
		expect(notFoundStrategy.maxRetries).toBe(0);

		const noData = new Error('no_data_found for parameters');
		const noDataCtx = errorContext('benzinga.news.get', noData);
		expect(errorHandlers.NOT_FOUND_ERROR.match(noData, noDataCtx)).toBe(true);
	});

	it('retries network errors and stops on unknown errors', async () => {
		const network = new Error('fetch failed: connection reset');
		const networkCtx = errorContext('benzinga.news.get', network);
		expect(errorHandlers.NETWORK_ERROR.match(network, networkCtx)).toBe(true);
		const networkStrategy = await errorHandlers.NETWORK_ERROR.handler(
			network,
			networkCtx,
		);
		expect(networkStrategy.maxRetries).toBe(3);

		const unknown = new Error('something unexpected');
		const unknownCtx = errorContext('benzinga.news.get', unknown);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(unknown, unknownCtx)).toBe(
			false,
		);
		expect(errorHandlers.AUTH_ERROR.match(unknown, unknownCtx)).toBe(false);
		expect(errorHandlers.DEFAULT.match(unknown, unknownCtx)).toBe(true);
		const defaultStrategy = await errorHandlers.DEFAULT.handler(
			unknown,
			unknownCtx,
		);
		expect(defaultStrategy.maxRetries).toBe(0);
	});
});
