import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/api/google/search' },
		{
			url: 'https://api.litescrape.com/api/google/search',
			ok: false,
			status,
			statusText: message,
			body: {},
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

describe('Litescrape errorHandlers', () => {
	it('routes 402 to INSUFFICIENT_BALANCE_ERROR with no retries', async () => {
		const error = apiError(402, 'Payment Required');
		expect(route(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_BALANCE_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not treat a message merely containing 429 as a rate limit', async () => {
		// Regression: the bare `msg.includes('429')` fallback used to match any
		// message containing those digits (an ID, URL or count), misrouting a
		// non-retryable failure into the retrying RATE_LIMIT_ERROR handler and
		// queueing duplicate work.
		const error = apiError(500, 'task 429 was aborted');
		expect(route(error)).not.toBe('RATE_LIMIT_ERROR');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('still routes a real ApiError with status 429 to RATE_LIMIT_ERROR', () => {
		// The numeric guard, not the message, must keep driving this decision.
		expect(route(apiError(429, 'Slow down'))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not retry a permanent 4xx whose message mentions concurrency', () => {
		// A 400/403 saying "concurrency limit" is a permanent plan/permission
		// failure, so classifying an ApiError by status keeps it out of the
		// retrying RATE_LIMIT_ERROR handler.
		const error = apiError(403, 'concurrency limit reached for this plan');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(route(error)).toBe('AUTH_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400, 409 and 422 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(409, 'Conflict'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 503 to SERVICE_UNAVAILABLE_ERROR and respects retryAfter', async () => {
		const error = apiError(503, 'Service Unavailable', 2000);
		expect(route(error)).toBe('SERVICE_UNAVAILABLE_ERROR');
		await expect(
			errorHandlers.SERVICE_UNAVAILABLE_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('falls back to the documented error_code strings when status is absent', () => {
		expect(route(new Error('insufficient balance'))).toBe(
			'INSUFFICIENT_BALANCE_ERROR',
		);
		expect(route(new Error('missing_api_key'))).toBe('AUTH_ERROR');
		expect(route(new Error('validation_error'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('not found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('service_unavailable'))).toBe(
			'SERVICE_UNAVAILABLE_ERROR',
		);
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
