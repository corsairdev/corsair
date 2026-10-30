import { BetterContactAPIError } from './client';
import { errorHandlers } from './error-handlers';

function makeError(status: number, retryAfter?: number): BetterContactAPIError {
	const err = new BetterContactAPIError('Test error', status);
	// Manually assign retryAfter since it comes from ApiError cause in production
	Object.defineProperty(err, 'retryAfter', {
		value: retryAfter,
		writable: false,
	});
	Object.defineProperty(err, 'status', {
		value: status,
		writable: false,
		configurable: true,
	});
	return err;
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies a 429 BetterContactAPIError as RATE_LIMIT_ERROR', () => {
		const error = makeError(429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a 401 BetterContactAPIError as AUTH_ERROR', () => {
		const error = makeError(401);
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies any other status as DEFAULT', () => {
		const error = makeError(500);
		expect(matchedHandlerName(error)).toBe('DEFAULT');
	});

	it('matches RATE_LIMIT_ERROR via message text "rate_limited"', () => {
		const error = new Error('rate_limited by provider');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('matches RATE_LIMIT_ERROR via message text "429"', () => {
		const error = new Error('received 429 from API');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('matches AUTH_ERROR via message text "unauthorized"', () => {
		const error = new Error('Unauthorized access');
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('matches AUTH_ERROR via message text "invalid_auth"', () => {
		const error = new Error('invalid_auth token');
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('RATE_LIMIT_ERROR handler returns maxRetries: 5', async () => {
		const error = makeError(429);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('RATE_LIMIT_ERROR handler propagates retryAfter as headersRetryAfterMs', async () => {
		const error = makeError(429, 60_000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
		expect(
			(result as { headersRetryAfterMs?: number }).headersRetryAfterMs,
		).toBe(60_000);
	});

	it('AUTH_ERROR handler returns maxRetries: 0 (no retries)', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('DEFAULT handler catches everything and returns maxRetries: 0', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
