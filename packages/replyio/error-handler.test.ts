import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function makeContext(operation: string, originalError: Error): ErrorContext {
	return {
		pluginId: 'replyio',
		operation,
		input: {},
		originalError,
	};
}

function makeApiError(
	status: number,
	message: string,
	body: Record<string, string>,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'sequences' },
		{
			url: 'https://api.reply.io/v3/sequences',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Replyio error handlers', () => {
	it('matches 429 responses as rate-limit errors and retries with Retry-After', async () => {
		const error = makeApiError(
			429,
			'Too Many Requests',
			{ title: 'Too Many Requests' },
			2000,
		);
		const context = makeContext('sequences.list', error);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR?.handler(
			error,
			context,
		);
		expect(strategy?.maxRetries).toBe(5);
		expect(strategy?.headersRetryAfterMs).toBe(2000);
	});

	it('matches rate-limit messages on plain errors', async () => {
		const error = new Error('Request failed with 429');
		const context = makeContext('contacts.list', error);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR?.handler(
			error,
			context,
		);
		expect(strategy?.maxRetries).toBe(5);
		expect(strategy?.headersRetryAfterMs).toBeUndefined();
	});

	it('does not treat unrelated errors as rate-limit errors', () => {
		const error = new Error('socket hang up');
		const context = makeContext('contacts.list', error);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error, context)).toBe(false);
	});

	it('matches 401 responses as auth errors without retry', async () => {
		const error = makeApiError(401, 'Unauthorized', {});
		const context = makeContext('users.getCurrent', error);
		expect(errorHandlers.AUTH_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.AUTH_ERROR?.handler(error, context);
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches 403 responses and Reply forbidden codes as permission errors', async () => {
		const error = makeApiError(403, 'Forbidden', {
			code: 'schedule.forbidden',
		});
		const context = makeContext('schedules.delete', error);
		expect(errorHandlers.PERMISSION_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.PERMISSION_ERROR?.handler(
			error,
			context,
		);
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches 404 responses and Reply notFound codes', async () => {
		const error = makeApiError(404, 'Not Found', {
			code: 'sequence.notFound',
		});
		const context = makeContext('sequences.get', error);
		expect(errorHandlers.NOT_FOUND_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.NOT_FOUND_ERROR?.handler(
			error,
			context,
		);
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches 400 responses as validation errors', async () => {
		const error = makeApiError(400, 'Bad Request', {
			code: 'webHook.invalidEvent',
		});
		const context = makeContext('contacts.create', error);
		expect(errorHandlers.VALIDATION_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.VALIDATION_ERROR?.handler(
			error,
			context,
		);
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches 5xx responses as server errors with limited retries', async () => {
		const error = makeApiError(500, 'Internal Server Error', {});
		const context = makeContext('sequences.list', error);
		expect(errorHandlers.SERVER_ERROR?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.SERVER_ERROR?.handler(error, context);
		expect(strategy?.maxRetries).toBe(2);
	});

	it('falls through to DEFAULT for anything else', async () => {
		const error = new Error('socket hang up');
		const context = makeContext('contacts.list', error);
		expect(errorHandlers.DEFAULT?.match(error, context)).toBe(true);
		const strategy = await errorHandlers.DEFAULT?.handler(error, context);
		expect(strategy?.maxRetries).toBe(0);
	});
});
