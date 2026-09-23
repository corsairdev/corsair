import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function rateLimitError(): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/charges' },
		{
			url: 'https://api.flutterwave.com/v3/charges',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { message: 'Too Many Requests' },
		},
		'Too Many Requests',
		{ retryAfter: 2000 },
	);
}

describe('Flutterwave error handlers', () => {
	it('does not replay write-capable 429s at the plugin layer', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError())).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError()),
		).resolves.toEqual(
			expect.objectContaining({
				maxRetries: 0,
				headersRetryAfterMs: 2000,
			}),
		);
	});

	it('does not retry unauthorized requests', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/transactions' },
			{
				url: 'https://api.flutterwave.com/v3/transactions',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Unauthorized' },
			},
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
