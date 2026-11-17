import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/campaigns' },
		{
			url: 'https://proofly.io/api/campaigns',
			ok: false,
			status,
			statusText: 'error',
			body: { ok: false, error: message },
		},
		message,
	);
}

describe('Proofly error handlers', () => {
	it('does not retry a 429', async () => {
		const error = apiError(429, 'too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats the documented 400 missing key as auth and does not retry', async () => {
		const error = apiError(
			400,
			'Authentication failed: give me a X-Api-Key header',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for any other error', async () => {
		const error = apiError(500, 'unavailable');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
