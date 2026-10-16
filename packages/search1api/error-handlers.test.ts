import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { z } from 'zod';
import { Search1APIError } from './client';
import { errorHandlers } from './error-handlers';

// The handlers object narrows each match/handler arity; go through the
// framework type so every entry has the uniform (error, context) signature.
const handlers: CorsairErrorHandler = errorHandlers;

function handlerFor(key: string) {
	const entry = handlers[key];
	if (!entry) throw new Error(`missing error handler: ${key}`);
	return entry;
}

function context(originalError: Error, operation = 'web.search'): ErrorContext {
	return {
		pluginId: 'search1api',
		operation,
		input: {},
		originalError,
	};
}

async function strategyFor(key: string, error: Error) {
	return handlerFor(key).handler(error, context(error));
}

describe('search1api error handlers', () => {
	it('matches zod and 422 failures as VALIDATION_ERROR', () => {
		const zodError = new z.ZodError([]);
		expect(
			handlerFor('VALIDATION_ERROR').match(zodError, context(zodError)),
		).toBe(true);
		const unprocessable = new Search1APIError('bad input', { status: 422 });
		expect(
			handlerFor('VALIDATION_ERROR').match(
				unprocessable,
				context(unprocessable),
			),
		).toBe(true);
	});

	it('retries rate-limited calls with the server delay', async () => {
		const error = new Search1APIError('rate limited', {
			status: 429,
			body: { message: 'Too Many Requests' },
			retryAfter: 1500,
		});
		expect(handlerFor('RATE_LIMIT_ERROR').match(error, context(error))).toBe(
			true,
		);
		await expect(strategyFor('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches rate limits by body text too', () => {
		const error = new Search1APIError('call failed', {
			status: 500,
			body: { error: 'Daily rate limit reached' },
		});
		expect(handlerFor('RATE_LIMIT_ERROR').match(error, context(error))).toBe(
			true,
		);
	});

	it('does not retry auth failures', async () => {
		const error = new Search1APIError('Unauthorized', { status: 401 });
		expect(handlerFor('AUTH_ERROR').match(error, context(error))).toBe(true);
		await expect(strategyFor('AUTH_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});

		const bodyOnly = new Search1APIError('Request failed', {
			status: 400,
			body: { message: 'Invalid API key' },
		});
		expect(handlerFor('AUTH_ERROR').match(bodyOnly, context(bodyOnly))).toBe(
			true,
		);
	});

	it('does not retry out-of-credit failures', async () => {
		const error = new Search1APIError('Payment required', { status: 402 });
		expect(
			handlerFor('PAYMENT_REQUIRED_ERROR').match(error, context(error)),
		).toBe(true);
		await expect(strategyFor('PAYMENT_REQUIRED_ERROR', error)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);

		const bodyOnly = new Search1APIError('Request failed', {
			status: 400,
			body: { message: 'Insufficient credits for this request' },
		});
		expect(
			handlerFor('PAYMENT_REQUIRED_ERROR').match(bodyOnly, context(bodyOnly)),
		).toBe(true);
	});

	it('does not retry malformed requests', async () => {
		const error = new Search1APIError('Bad Request', { status: 400 });
		expect(handlerFor('BAD_REQUEST_ERROR').match(error, context(error))).toBe(
			true,
		);
		await expect(strategyFor('BAD_REQUEST_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries server failures with exponential backoff', async () => {
		for (const status of [500, 502, 503, 504]) {
			const error = new Search1APIError('Server error', { status });
			expect(handlerFor('SERVER_ERROR').match(error, context(error))).toBe(
				true,
			);
			await expect(strategyFor('SERVER_ERROR', error)).resolves.toEqual({
				maxRetries: 3,
				retryStrategy: 'exponential_backoff',
			});
		}
		const clientError = new Search1APIError('bad', { status: 400 });
		expect(
			handlerFor('SERVER_ERROR').match(clientError, context(clientError)),
		).toBe(false);
	});

	it('does not replay a failed feedback report but retries other writes', async () => {
		const feedbackError = new Search1APIError('Bad gateway', { status: 502 });
		const feedbackContext = context(feedbackError, 'web.feedback');
		expect(handlerFor('SERVER_ERROR').match(feedbackError, feedbackContext)).toBe(
			true,
		);
		await expect(
			handlerFor('SERVER_ERROR').handler(feedbackError, feedbackContext),
		).resolves.toEqual({ maxRetries: 0 });

		const searchError = new Search1APIError('Bad gateway', { status: 502 });
		await expect(strategyFor('SERVER_ERROR', searchError)).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honors Retry-After on a server failure', async () => {
		const error = new Search1APIError('Bad gateway', {
			status: 502,
			retryAfter: 2000,
		});
		await expect(strategyFor('SERVER_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay timeouts for the same billing reason', async () => {
		for (const message of [
			'Request timeout',
			'operation timed out',
			'aborted',
		]) {
			const error = new Search1APIError(message);
			expect(handlerFor('TIMEOUT_ERROR').match(error, context(error))).toBe(
				true,
			);
			await expect(strategyFor('TIMEOUT_ERROR', error)).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('falls back to no retries for anything unmatched', async () => {
		const error = new Error('something else');
		expect(handlerFor('DEFAULT').match(error, context(error))).toBe(true);
		await expect(strategyFor('DEFAULT', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
