import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, body: unknown = {}): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{ url: '/test', ok: false, status, statusText: 'Error', body },
		`request failed with status ${status}`,
	);
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers]?.match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR and retries', async () => {
		const error = apiError(429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
		const strategy = await errorHandlers.RATE_LIMIT_ERROR?.handler(error);
		expect(strategy?.maxRetries).toBeGreaterThan(0);
	});

	it('classifies a 401 as AUTH_ERROR and does not retry', async () => {
		const error = apiError(401);
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
		const strategy = await errorHandlers.AUTH_ERROR?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	/** ScrapeGraphAI's own SDK maps a 402 to "Insufficient credits" — see scrapegraph-sdk's `_map_http_error`. */
	it('classifies a 402 as INSUFFICIENT_CREDITS_ERROR and does not retry', async () => {
		const error = apiError(402);
		expect(matchedHandlerName(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		const strategy = await errorHandlers.INSUFFICIENT_CREDITS_ERROR?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT for anything else and does not retry', async () => {
		const error = apiError(500);
		expect(matchedHandlerName(error)).toBe('DEFAULT');
		const strategy = await errorHandlers.DEFAULT?.handler();
		expect(strategy?.maxRetries).toBe(0);
	});

	it('matches auth errors by message when not wrapped in ApiError', () => {
		expect(matchedHandlerName(new Error('unauthorized: invalid_auth'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches insufficient-credits errors by message when not wrapped in ApiError', () => {
		expect(
			matchedHandlerName(new Error('Insufficient credits to complete request')),
		).toBe('INSUFFICIENT_CREDITS_ERROR');
	});
});
