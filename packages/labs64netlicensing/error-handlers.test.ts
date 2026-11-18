import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/license' },
		{
			url: 'https://go.netlicensing.io/core/v2/rest/license',
			ok: false,
			status,
			statusText: 'error',
			body: { items: null },
		},
		message,
	);
}

describe('NetLicensing error handlers', () => {
	it('does not retry a 429', async () => {
		const error = apiError(429, 'too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401', async () => {
		const error = apiError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
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
