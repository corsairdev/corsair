import { ApiError } from 'corsair/http';
import { BestBuyAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	return new ApiError(
		{ method: 'GET', url: 'products' },
		{
			url: 'https://api.bestbuy.com/v1/products',
			ok: false,
			status,
			statusText: '',
			body: { error: 'fail' },
		},
		'request failed',
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Best Buy error handlers', () => {
	it('classifies 429 as rate limit', () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('keeps Retry-After from wrapped 429s', async () => {
		const wrapped = new BestBuyAPIError('Too Many Requests', {
			cause: apiError(429),
			retryAfter: 2000,
		});
		expect(classify(wrapped)).toBe('RATE_LIMIT_ERROR');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('classifies 401 as auth', () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
	});

	it('classifies 404 as not found', () => {
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry auth failures', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
	});
});
