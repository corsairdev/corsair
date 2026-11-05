import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function required(
	handler: (typeof errorHandlers)[keyof typeof errorHandlers],
	name: string,
): ErrorHandlerAndMatchFunction {
	if (!handler) {
		throw new Error(`boldsign errorHandlers must define ${name}`);
	}
	return handler;
}

const rateLimit = required(errorHandlers.RATE_LIMIT_ERROR, 'RATE_LIMIT_ERROR');
const auth = required(errorHandlers.AUTH_ERROR, 'AUTH_ERROR');
const permission = required(errorHandlers.PERMISSION_ERROR, 'PERMISSION_ERROR');
const fallback = required(errorHandlers.DEFAULT, 'DEFAULT');

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const requestOptions = {
		method: 'GET',
		url: '/v1/document/list',
	} satisfies ApiRequestOptions;
	const result = {
		url: 'https://api.boldsign.com/v1/document/list',
		ok: false,
		status,
		statusText: 'error',
		body: {},
	} satisfies ApiResult;
	return new ApiError(
		requestOptions,
		result,
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

const ctx = {
	pluginId: 'boldsign',
	operation: 'test',
	input: {},
	originalError: new Error('test'),
};

describe('boldsign errorHandlers', () => {
	it('matches 429 ApiErrors as rate-limit errors and retries with backoff', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);

		expect(rateLimit.match(error, ctx)).toBe(true);
		const strategy = await rateLimit.handler(error, ctx);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it('matches rate-limit messages on plain errors', () => {
		expect(rateLimit.match(new Error('API rate limit exceeded'), ctx)).toBe(
			true,
		);
		expect(rateLimit.match(new Error('429 quota exhausted'), ctx)).toBe(true);
	});

	it('does not classify other statuses as rate-limit errors', () => {
		expect(rateLimit.match(apiError(500, 'Internal Server Error'), ctx)).toBe(
			false,
		);
		expect(rateLimit.match(apiError(401, 'Unauthorized'), ctx)).toBe(false);
	});

	it('matches 401 ApiErrors as auth errors with no retries', async () => {
		const error = apiError(401, 'Unauthorized');

		expect(auth.match(error, ctx)).toBe(true);
		const strategy = await auth.handler(error, ctx);
		expect(strategy.maxRetries).toBe(0);
	});

	it('matches invalid-key and invalid-token messages as auth errors', () => {
		expect(auth.match(new Error('Invalid API key'), ctx)).toBe(true);
		expect(auth.match(new Error('Invalid token'), ctx)).toBe(true);
		expect(auth.match(new Error('Unauthorized'), ctx)).toBe(true);
	});

	it('matches 403 ApiErrors as permission errors with no retries', async () => {
		const error = apiError(403, 'Forbidden');

		expect(permission.match(error, ctx)).toBe(true);
		const strategy = await permission.handler(error, ctx);
		expect(strategy.maxRetries).toBe(0);
		expect(permission.match(new Error('permission denied'), ctx)).toBe(true);
	});

	it('routes everything else through DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');

		expect(fallback.match(error, ctx)).toBe(true);
		const strategy = await fallback.handler(error, ctx);
		expect(strategy.maxRetries).toBe(0);
	});
});
