import type { ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { SnowflakeAPIError } from './client';
import { errorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

function classify(error: Error, operation = 'statements.submit'): HandlerName {
	const context: ErrorContext = {
		pluginId: 'snowflake',
		operation,
		input: {},
		originalError: error,
	};
	// Object.keys widens to string; every key is a handler name.
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error, context),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

function apiError(status: number, retryAfter?: number, message = 'failed') {
	return new SnowflakeAPIError(`Snowflake ${status}: ${message}`, {
		status,
		retryAfter,
		body: { code: status === 429 ? '390505' : '000000', message },
	});
}

describe('Snowflake error handlers', () => {
	it('pins dispatch order, with DEFAULT last', () => {
		expect(Object.keys(errorHandlers)).toEqual([
			'VALIDATION_ERROR',
			'STATEMENT_TIMEOUT',
			'QUERY_FAILURE',
			'BAD_REQUEST_ERROR',
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'METHOD_NOT_ALLOWED',
			'UNSUPPORTED_MEDIA',
			'RATE_LIMIT_ERROR',
			'SERVER_ERROR',
			'TIMEOUT_ERROR',
			'DEFAULT',
		]);
	});

	it('does not retry zod, statement timeout, query failure, or client errors', async () => {
		const zod = new ZodError([]);
		expect(classify(zod)).toBe('VALIDATION_ERROR');
		expect(
			await errorHandlers.VALIDATION_ERROR.handler(zod, contextFor(zod)),
		).toEqual({
			maxRetries: 0,
		});

		const cases: ReadonlyArray<readonly [number, HandlerName]> = [
			[408, 'STATEMENT_TIMEOUT'],
			[422, 'QUERY_FAILURE'],
			[400, 'BAD_REQUEST_ERROR'],
			[401, 'AUTH_ERROR'],
			[403, 'PERMISSION_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[405, 'METHOD_NOT_ALLOWED'],
			[415, 'UNSUPPORTED_MEDIA'],
		];
		for (const [status, name] of cases) {
			const error = apiError(status);
			expect(classify(error)).toBe(name);
			expect(
				await errorHandlers[name].handler(error, contextFor(error)),
			).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('matches status, not message text, for every statement operation', () => {
		const rateNamedAuth = apiError(401, undefined, 'rate limit exceeded');
		expect(classify(rateNamedAuth, 'statements.cancel')).toBe('AUTH_ERROR');
		const authNamedRate = apiError(429, undefined, 'unauthorized');
		expect(classify(authNamedRate, 'statements.get')).toBe('RATE_LIMIT_ERROR');
		expect(classify(apiError(422), 'statements.submit')).toBe('QUERY_FAILURE');
	});

	it('caps a 429 Retry-After at 60s and adds jitter', async () => {
		const random = jest.spyOn(Math, 'random').mockReturnValue(0);
		const twoSeconds = apiError(429, 2000);
		expect(classify(twoSeconds)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				twoSeconds,
				contextFor(twoSeconds),
			),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1500,
			retryStrategy: 'exponential_backoff_jitter',
		});

		random.mockReturnValue(1);
		const twoMinutes = apiError(429, 120_000);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				twoMinutes,
				contextFor(twoMinutes),
			),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff_jitter',
		});
		random.mockRestore();
	});

	it('retries a 429 without Retry-After using jittered backoff, 3 times', async () => {
		const error = apiError(429);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error, contextFor(error)),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('does not retry 5xx or a client timeout', async () => {
		for (const status of [500, 502, 503, 504, 522]) {
			const error = apiError(status);
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(
				await errorHandlers.SERVER_ERROR.handler(error, contextFor(error)),
			).toEqual({ maxRetries: 0 });
		}

		const cause = new Error('The operation timed out');
		cause.name = 'TimeoutError';
		const wrapped = new SnowflakeAPIError(cause.message, { cause });
		expect(classify(wrapped)).toBe('TIMEOUT_ERROR');
		expect(
			await errorHandlers.TIMEOUT_ERROR.handler(wrapped, contextFor(wrapped)),
		).toEqual({ maxRetries: 0 });
	});
});

function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'snowflake',
		operation: 'statements.submit',
		input: {},
		originalError: error,
	};
}
