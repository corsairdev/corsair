import type { ErrorContext } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { ClientaryAPIError } from './client';
import { errorHandlers } from './error-handlers';

function makeContext(operation: string): ErrorContext {
	return {
		pluginId: 'clientary',
		operation,
		input: {},
		originalError: new Error(operation),
	};
}

function makeClientaryError(
	status: number | undefined,
	message: string,
	options?: { retryAfter?: number },
): ClientaryAPIError {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/clients',
	};
	const result: ApiResult = {
		url: 'https://acme.clientary.com/api/v2/clients',
		ok: status !== undefined && status < 300,
		status: status ?? 0,
		statusText: message,
		body: undefined,
	};
	return new ClientaryAPIError(message, status, {
		cause: new ApiError(requestOptions, result, message, {
			retryAfter: options?.retryAfter ?? 0,
		}),
	});
}

describe('Clientary error handlers', () => {
	it('matches and retries 429 rate limits with the Retry-After header', async () => {
		const error = makeClientaryError(429, 'Rate limit exceeded', {
			retryAfter: 5000,
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			makeContext('clients.list'),
		);
		expect(result.maxRetries).toBe(3);
		expect(result.retryStrategy).toBe('exponential_backoff');
		expect(result.headersRetryAfterMs).toBe(5000);
	});

	it('matches 429 by message when status is missing', async () => {
		const error = makeClientaryError(undefined, 'HTTP 429 Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches and does not retry 401 auth failures', async () => {
		const error = makeClientaryError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 403 forbidden', async () => {
		const error = makeClientaryError(403, 'Forbidden');
		expect(errorHandlers.FORBIDDEN_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.FORBIDDEN_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 404 not found', async () => {
		const error = makeClientaryError(404, 'Not Found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 422 validation failures', async () => {
		const error = makeClientaryError(422, 'Unprocessable Entity');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.VALIDATION_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 426 plan limits', async () => {
		const error = makeClientaryError(426, 'Upgrade Required');
		expect(errorHandlers.PLAN_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.PLAN_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('retries 5xx server errors up to 2 times', async () => {
		const error = makeClientaryError(500, 'Internal Server Error');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.SERVER_ERROR.handler(
			error,
			makeContext('clients.list'),
		);
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it.each([
		'invoices.create',
		'invoices.send',
		'payments.create',
		'clients.delete',
	])('does not retry 429 on %s', async (operation) => {
		const error = makeClientaryError(429, 'Rate limit exceeded');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			makeContext(operation),
		);
		expect(result.maxRetries).toBe(0);
	});

	it.each([
		'invoices.create',
		'invoices.send',
		'payments.create',
		'clients.delete',
	])('does not retry 5xx on %s', async (operation) => {
		const error = makeClientaryError(500, 'Internal Server Error');
		const result = await errorHandlers.SERVER_ERROR.handler(
			error,
			makeContext(operation),
		);
		expect(result.maxRetries).toBe(0);
	});

	it('treats any other error as a default no-retry failure', async () => {
		const error = makeClientaryError(undefined, 'Weird failure');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('exactly one handler matches the 401 case', async () => {
		const error = makeClientaryError(401, 'Unauthorized');
		const matches = Object.entries(errorHandlers).filter(([name, h]) => {
			if (name === 'DEFAULT') return false;
			return h.match(error);
		});
		expect(matches.map(([name]) => name)).toEqual(['AUTH_ERROR']);
	});

	it('does not classify a 500 as NOT_FOUND just because the body mentions not found', () => {
		const error = makeClientaryError(500, 'internal: widget not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
	});

	it('does not classify a 500 as VALIDATION just because the body mentions unprocessable', () => {
		const error = makeClientaryError(500, 'unprocessable downstream');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
	});

	it('still matches not found by message when no status is present', () => {
		const error = makeClientaryError(undefined, 'record not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});
});
