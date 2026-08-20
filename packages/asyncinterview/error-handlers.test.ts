import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'request failed') {
	return new ApiError(
		{ method: 'GET', url: '/jobs' },
		{
			url: 'https://app.asyncinterview.ai/api/jobs',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		message,
		{ retryAfter: 5000 },
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('AsyncInterview error handlers', () => {
	it('classifies 429 as RATE_LIMIT_ERROR and keeps retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
		expect(result.retryStrategy).toBe('exponential_backoff');
		expect(result.headersRetryAfterMs).toBe(5000);
	});

	it('classifies 401 as AUTH_ERROR', () => {
		expect(classify(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
	});

	it('classifies 404 as NOT_FOUND_ERROR', () => {
		expect(
			classify(
				apiError(404, 'The route api/jobs/1/responses could not be found.'),
			),
		).toBe('NOT_FOUND_ERROR');
	});

	it('classifies 500 as SERVER_ERROR', () => {
		expect(classify(apiError(500, 'Server Error'))).toBe('SERVER_ERROR');
	});
});
