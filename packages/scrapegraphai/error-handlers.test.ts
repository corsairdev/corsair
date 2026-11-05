import { ScrapegraphAiAPIError, ScrapegraphAiRateLimitError } from './client';
import { errorHandlers } from './error-handlers';

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers]?.match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies ScrapegraphAiRateLimitError as RATE_LIMIT_ERROR and retries', async () => {
		const error = new ScrapegraphAiRateLimitError('slow down', 2000);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
		const strategy = await errorHandlers.RATE_LIMIT_ERROR?.handler(error);
		expect(strategy?.maxRetries).toBeGreaterThan(0);
		expect(strategy?.headersRetryAfterMs).toBe(2000);
	});

	it('classifies HTTP 401 as AUTH_ERROR and does not retry', async () => {
		const error = new ScrapegraphAiAPIError('unauthorized', 401, 401);
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
		const strategy = await errorHandlers.AUTH_ERROR?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	it('classifies HTTP 403 as AUTH_ERROR', () => {
		expect(
			matchedHandlerName(new ScrapegraphAiAPIError('invalid key', 403, 403)),
		).toBe('AUTH_ERROR');
	});

	it('classifies HTTP 402 as INSUFFICIENT_CREDITS_ERROR and does not retry', async () => {
		const error = new ScrapegraphAiAPIError('Insufficient credits', 402, 402);
		expect(matchedHandlerName(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		const strategy = await errorHandlers.INSUFFICIENT_CREDITS_ERROR?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT for anything else and does not retry', async () => {
		const error = new ScrapegraphAiAPIError('boom', 500, 500);
		expect(matchedHandlerName(error)).toBe('DEFAULT');
		const strategy = await errorHandlers.DEFAULT?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches auth errors by message when status is absent', () => {
		expect(matchedHandlerName(new Error('unauthorized: invalid_auth'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches insufficient-credits errors by message when status is absent', () => {
		expect(
			matchedHandlerName(new Error('Insufficient credits to complete request')),
		).toBe('INSUFFICIENT_CREDITS_ERROR');
	});
});
