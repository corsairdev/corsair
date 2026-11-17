import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/limits' },
		{
			url: 'https://api.globalping.io/v1/limits',
			ok: false,
			status,
			statusText: 'error',
			body: { error: { type: 'error' } },
		},
		'error',
	);
}

describe('Globalping error handlers', () => {
	it('does not retry a 429', async () => {
		const error = apiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for any other error', async () => {
		const error = apiError(500);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
