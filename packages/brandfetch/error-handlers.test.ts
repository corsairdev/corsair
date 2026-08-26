import { BrandfetchAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): BrandfetchAPIError {
	const error = new BrandfetchAPIError(message, status);
	Object.assign(error, { status });
	return error;
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies 429 quota exceeded as RATE_LIMIT_ERROR with no retries', async () => {
		const error = apiError(429, 'API key quota exceeded');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('classifies 429 without quota wording as retryable RATE_LIMIT_ERROR', async () => {
		const error = apiError(429, 'Too Many Requests');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('classifies 401 as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiError(401, 'Unauthorized'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('classifies 404 as NOT_FOUND_ERROR', () => {
		expect(matchedHandlerName(apiError(404, 'Not Found'))).toBe(
			'NOT_FOUND_ERROR',
		);
	});

	it('classifies failed transaction enrichment as BAD_REQUEST_ERROR', () => {
		expect(
			matchedHandlerName(apiError(400, 'Failed to enrich transaction')),
		).toBe('BAD_REQUEST_ERROR');
	});

	it('classifies 503 as SERVER_ERROR', () => {
		expect(matchedHandlerName(apiError(503, 'Service Unavailable'))).toBe(
			'SERVER_ERROR',
		);
	});
});
