import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/connections' },
		{
			url: 'https://api.hookdeck.com/2025-07-01/connections',
			ok: false,
			status,
			statusText: message,
			body: '',
		},
		message,
	);
}

describe('Hookdeck error handlers', () => {
	it('matches rate-limit errors by status and message', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many'))).toBe(
			true,
		);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('rate_limited: slow down'),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom')),
		).toBe(false);
	});

	it('retries rate-limit errors up to 5 times', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('429 too many requests'),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('forwards retryAfter without reconverting', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/connections' },
			{
				url: 'https://api.hookdeck.com/2025-07-01/connections',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: '',
			},
			'Too Many Requests',
			{ retryAfter: 1500 },
		);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(cause);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(1500);
	});

	it('matches auth errors without retrying', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('invalid_auth: bad key')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('falls through to the default handler', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);

		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
