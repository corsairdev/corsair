import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/segments' },
		{
			url: '/v1/segments',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
	);
}

describe('Customer.io error handlers', () => {
	it('matches rate-limit errors via status and message', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many Requests')),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited slow down')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('requests retries with backoff for rate limits', async () => {
		const decision = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, 'Too Many Requests'),
		);
		expect(decision.maxRetries).toBe(5);
	});

	it('matches auth errors and stops retries', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('invalid_auth credentials')),
		).toBe(true);
		const decision = await errorHandlers.AUTH_ERROR.handler(
			new Error('unauthorized'),
		);
		expect(decision.maxRetries).toBe(0);
	});

	it('matches permission errors without retries', async () => {
		expect(
			errorHandlers.PERMISSION_ERROR.match(apiError(403, 'Forbidden')),
		).toBe(true);
		const decision = await errorHandlers.PERMISSION_ERROR.handler(
			new Error('forbidden'),
		);
		expect(decision.maxRetries).toBe(0);
	});

	it('matches not-found errors without retries', async () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(apiError(404, 'Not Found')),
		).toBe(true);
		const decision = await errorHandlers.NOT_FOUND_ERROR.handler(
			new Error('segment_not_found'),
		);
		expect(decision.maxRetries).toBe(0);
	});

	it('matches validation errors without retries', async () => {
		expect(
			errorHandlers.VALIDATION_ERROR.match(apiError(400, 'Bad Request')),
		).toBe(true);
		expect(
			errorHandlers.VALIDATION_ERROR.match(apiError(422, 'Unprocessable')),
		).toBe(true);
		const decision = await errorHandlers.VALIDATION_ERROR.handler(
			new Error('validation failed'),
		);
		expect(decision.maxRetries).toBe(0);
	});

	it('retries server errors twice', async () => {
		expect(
			errorHandlers.SERVER_ERROR.match(apiError(500, 'Server Error')),
		).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(200, 'ok'))).toBe(false);
		const decision = await errorHandlers.SERVER_ERROR.handler(
			apiError(503, 'Unavailable'),
		);
		expect(decision.maxRetries).toBe(2);
	});

	it('retries network failures three times', async () => {
		expect(
			errorHandlers.NETWORK_ERROR.match(
				new Error('fetch failed: ECONNREFUSED'),
			),
		).toBe(true);
		const decision = await errorHandlers.NETWORK_ERROR.handler(
			new Error('network down'),
		);
		expect(decision.maxRetries).toBe(3);
	});

	it('falls through to DEFAULT for anything else', async () => {
		expect(errorHandlers.DEFAULT.match(new Error('something odd'))).toBe(true);
		const decision = await errorHandlers.DEFAULT.handler(
			new Error('something odd'),
		);
		expect(decision.maxRetries).toBe(0);
	});
});
