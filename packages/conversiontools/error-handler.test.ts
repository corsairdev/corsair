import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ConversiontoolsDownloadError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/tasks' },
		{
			url: 'https://api.conversiontools.io/v1/tasks',
			ok: false,
			status,
			statusText: message,
			body: { error: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Conversion Tools error handlers', () => {
	it('maps 429 to RATE_LIMIT_ERROR and never retries it', async () => {
		const error = apiError(429, 'Rate limit exceeded', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});

		const downloadError = new ConversiontoolsDownloadError(429);
		expect(route(downloadError)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(downloadError),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('keeps rate-limit retry delay absent when the provider gives no header', async () => {
		const error = apiError(429, 'Monthly rate limit exceeded');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps authentication, permission, bad request, and not-found responses', async () => {
		const unauthorized = apiError(401, 'Not authorized');
		const forbidden = apiError(403, 'Feature requires a paid plan');
		const badRequest = apiError(400, 'Bad request');
		const missing = apiError(404, 'Task not found');
		expect(route(unauthorized)).toBe('AUTH_ERROR');
		expect(route(forbidden)).toBe('PERMISSION_ERROR');
		expect(route(badRequest)).toBe('BAD_REQUEST_ERROR');
		expect(route(missing)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.PERMISSION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries safe GET server errors at most twice', async () => {
		const error = apiError(500, 'Internal server error');
		const context: ErrorContext = {
			pluginId: 'conversiontools',
			operation: 'tasks.get',
			input: {},
			originalError: error,
		};
		expect(route(error)).toBe('SERVER_ERROR');
		await expect(
			errorHandlers.SERVER_ERROR.handler(error, context),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries conversion task creation or other write operations', async () => {
		const error = apiError(500, 'Internal server error');
		const context: ErrorContext = {
			pluginId: 'conversiontools',
			operation: 'tasks.create',
			input: {},
			originalError: error,
		};

		await expect(
			errorHandlers.SERVER_ERROR.handler(error, context),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(error, {
				...context,
				operation: 'files.upload',
			}),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes other provider errors to DEFAULT without retries', async () => {
		const error = apiError(409, 'Task files have been deleted');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
