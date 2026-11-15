import type {
	ErrorContext,
	ErrorHandlerAndMatchFunction,
	RetryStrategy,
} from 'corsair/core';
import { SuzanneAPIError } from './client';
import { errorHandlers } from './error-handlers';

function context(operation: string): ErrorContext {
	return {
		pluginId: 'suzanne',
		operation,
		input: {},
		originalError: new Error('suzanne'),
	};
}

function apiError(
	status: number,
	code?: string,
	retryAfter?: number,
): SuzanneAPIError {
	return new SuzanneAPIError('failed', {
		status,
		retryAfter,
		body: code
			? {
					error: {
						type: 'invalid_request',
						code,
						message: 'nope',
						request_id: 'req',
					},
				}
			: undefined,
	});
}

async function dispatch(
	error: Error,
	ctx = context('generations.textTo3d'),
): Promise<{ name: string; strategy: RetryStrategy }> {
	// Object.entries widens each match to a different arity.
	const entries = Object.entries(errorHandlers) as Array<
		[string, ErrorHandlerAndMatchFunction]
	>;
	for (const [name, handler] of entries) {
		if (handler.match(error, ctx)) {
			return { name, strategy: await handler.handler(error, ctx) };
		}
	}
	throw new Error('no handler matched');
}

describe('suzanne error handlers', () => {
	it('checks idempotency conflict before the concurrent-limit retry', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('IDEMPOTENCY_CONFLICT')).toBeLessThan(
			names.indexOf('CONCURRENT_LIMIT'),
		);
		expect(names.indexOf('JOB_NOT_DONE')).toBeLessThan(
			names.indexOf('CONCURRENT_LIMIT'),
		);
		expect(names.indexOf('UPLOAD_RETRY')).toBeLessThan(
			names.indexOf('SERVER_ERROR'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('retries a concurrent ceiling and refuses an idempotency conflict', async () => {
		const retry = await dispatch(apiError(409, 'concurrent_limit_reached'));
		expect(retry.name).toBe('CONCURRENT_LIMIT');
		expect(retry.strategy.maxRetries).toBe(2);

		const conflict = await dispatch(apiError(409, 'idempotency_key_conflict'));
		expect(conflict.name).toBe('IDEMPOTENCY_CONFLICT');
		expect(conflict.strategy.maxRetries).toBe(0);
	});

	it('retries upload 500 once and does not retry a generation 500', async () => {
		const upload = await dispatch(
			apiError(500, 'internal'),
			context('uploads.create'),
		);
		expect(upload.name).toBe('UPLOAD_RETRY');
		expect(upload.strategy.maxRetries).toBe(1);

		const generation = await dispatch(
			apiError(500, 'internal', undefined),
			context('generations.textTo3d'),
		);
		expect(generation.name).toBe('SERVER_ERROR');
		expect(generation.strategy.maxRetries).toBe(0);
	});

	it('caps an hour-long Retry-After on 429', async () => {
		const result = await dispatch(apiError(429, 'rate_limited', 3_600_000));
		expect(result.name).toBe('RATE_LIMIT_ERROR');
		expect(result.strategy.maxRetries).toBe(2);
		expect(result.strategy.headersRetryAfterMs).toBeGreaterThanOrEqual(60_000);
		expect(result.strategy.headersRetryAfterMs).toBeLessThanOrEqual(60_250);
	});

	it('does not treat a 500 that mentions rate limits as a 429', async () => {
		const error = apiError(500, 'internal');
		error.message = 'Too many requests';
		const result = await dispatch(error, context('jobs.get'));
		expect(result.name).toBe('SERVER_ERROR');
		expect(result.strategy.maxRetries).toBe(0);
	});
});
