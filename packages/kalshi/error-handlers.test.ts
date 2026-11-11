import { ApiError } from 'corsair/http';
import { KalshiAPIError } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
		}
		status: number;
		statusText: string;
		body: unknown;
	},
}));

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/exchange/status' },
		{ url: 'u', status, statusText: message, body: {} } as never,
		message,
	);
}

function wrapped(status: number, message: string): KalshiAPIError {
	return new KalshiAPIError(message, String(status), {
		cause: apiError(status, message),
	});
}

describe('Kalshi error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches a 429 raised by the HTTP layer', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					apiError(429, 'Too Many Requests'),
				),
			).toBe(true);
		});

		it('matches a 429 after the client wraps it in KalshiAPIError', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'Too Many Requests')),
			).toBe(true);
		});

		it('matches the 429 body text when no status is available', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('too many requests')),
			).toBe(true);
		});

		it('does not match an unrelated 500', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(wrapped(500, 'Internal error')),
			).toBe(false);
		});

		it('retries up to 5 times with exponential backoff and jitter', async () => {
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler();

			expect(strategy.maxRetries).toBe(5);
			expect(strategy.retryStrategy).toBe('exponential_backoff_jitter');
		});

		it('does not rely on a Retry-After header, which Kalshi never sends', async () => {
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler();

			expect('headersRetryAfterMs' in strategy).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 responses', () => {
			expect(errorHandlers.AUTH_ERROR.match(wrapped(401, 'Unauthorized'))).toBe(
				true,
			);
			expect(errorHandlers.AUTH_ERROR.match(wrapped(403, 'Forbidden'))).toBe(
				true,
			);
		});

		it('matches bad local credentials so they are not retried', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(
					new Error('Invalid Kalshi credentials: both are required'),
				),
			).toBe(true);
		});

		it('never retries an auth failure', async () => {
			expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches anything and does not retry', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			expect((await errorHandlers.DEFAULT.handler()).maxRetries).toBe(0);
		});
	});
});
