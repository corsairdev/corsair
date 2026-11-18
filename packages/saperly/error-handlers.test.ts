import type {
	ErrorContext,
	ErrorHandlerAndMatchFunction,
	RetryStrategy,
} from 'corsair/core';
import { SaperlyAPIError } from './client';
import { errorHandlers } from './error-handlers';

// ErrorContext.input is an open record of caller fields.
function context(input: Record<string, unknown> = {}): ErrorContext {
	return {
		pluginId: 'saperly',
		operation: 'messages.send',
		input,
		originalError: new Error('saperly'),
	};
}

function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	retryAfter?: number,
	message = 'failed',
): SaperlyAPIError {
	return new SaperlyAPIError(message, { method, status, retryAfter });
}

async function dispatch(
	error: Error,
	ctx = context(),
): Promise<{ name: string; strategy: RetryStrategy }> {
	// Object.entries widens each match to a different arity. The handlers
	// all accept (error, context).
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

describe('saperly error handlers', () => {
	it('keeps fail-fast statuses ahead of the rate-limit handler', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('PAYMENT_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(names.indexOf('CONFLICT_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('UPSTREAM_ERROR'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('does not retry 401, 402, 403, 404, or 409', async () => {
		for (const status of [401, 402, 403, 404, 409]) {
			const result = await dispatch(apiError(status, 'POST'));
			expect(result.strategy.maxRetries).toBe(0);
		}
	});

	it('retries a 429 GET three times worth of budget and caps an hour-long Retry-After', async () => {
		const result = await dispatch(apiError(429, 'GET', 3_600_000));
		expect(result.name).toBe('RATE_LIMIT_ERROR');
		expect(result.strategy.maxRetries).toBe(2);
		expect(result.strategy.headersRetryAfterMs).toBeLessThanOrEqual(60_250);
		expect(result.strategy.headersRetryAfterMs).toBeGreaterThanOrEqual(60_000);
	});

	it('retries a 429 POST only when the caller supplied an idempotency key', async () => {
		const blocked = await dispatch(apiError(429, 'POST', 1000));
		expect(blocked.strategy.maxRetries).toBe(0);
		const replay = await dispatch(
			apiError(429, 'POST', 1000),
			context({ idempotencyKey: 'same-key' }),
		);
		expect(replay.strategy.maxRetries).toBe(2);
	});

	it('retries idempotent 5xx once and never retries a billable POST, even if the message says too many requests', async () => {
		const read = await dispatch(
			apiError(500, 'GET', undefined, 'Too many requests'),
		);
		expect(read.name).toBe('UPSTREAM_ERROR');
		expect(read.strategy.maxRetries).toBe(1);
		expect(read.strategy.headersRetryAfterMs).toBeUndefined();

		const write = await dispatch(
			apiError(500, 'POST', undefined, 'Too many requests'),
		);
		expect(write.name).toBe('UPSTREAM_ERROR');
		expect(write.strategy.maxRetries).toBe(0);

		const remove = await dispatch(apiError(502, 'DELETE'));
		expect(remove.strategy.maxRetries).toBe(1);
	});

	it('fails a validation error fast', async () => {
		const error = new Error('bad');
		error.name = 'ZodError';
		const result = await dispatch(error);
		expect(result.name).toBe('VALIDATION_ERROR');
		expect(result.strategy.maxRetries).toBe(0);
	});
});
