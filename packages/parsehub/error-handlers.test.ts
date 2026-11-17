import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/v2/projects' },
		{
			url: 'https://www.parsehub.com/api/v2/projects',
			ok: false,
			status,
			statusText: 'error',
			body: message,
		},
		message,
	);
}

describe('ParseHub error handlers', () => {
	it('does not retry a 429', async () => {
		const error = apiError(429, 'too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats HTTP 401 as an auth failure', async () => {
		const error = apiError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('sends any other status to the default handler', async () => {
		const error = apiError(500, 'server error');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
