import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/predictLongRunning' },
		{
			url: 'https://us-central1-aiplatform.googleapis.com/v1/predictLongRunning',
			ok: false,
			status,
			statusText: message,
			body: { error: { code: status, message, status: 'RESOURCE_EXHAUSTED' } },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Veo errorHandlers', () => {
	it('retries HTTP 429 and keeps Retry-After', async () => {
		const error = apiError(429, 'Resource exhausted', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 2000,
		});
	});

	it('does not treat a message that merely contains 429 as a rate limit', () => {
		const error = apiError(500, 'operation 429 was aborted');
		expect(route(error)).toBe('DEFAULT');
	});

	it('does not retry auth, bad request, or server errors', async () => {
		expect(route(apiError(401, 'Unauthenticated'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Permission denied'))).toBe('AUTH_ERROR');
		expect(route(apiError(400, 'Invalid argument'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(404, 'Not found'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(503, 'unavailable'))).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
