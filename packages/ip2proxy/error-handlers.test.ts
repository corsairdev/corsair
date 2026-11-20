import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/' },
		{
			url: 'https://api.ip2proxy.com/',
			ok: false,
			status,
			statusText: 'error',
			body: { response: message },
		},
		message,
	);
}

describe('IP2Proxy error handlers', () => {
	it('does not retry a 429, because the HTTP client already retries it', async () => {
		const error = apiError(429, 'too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats the documented 401 body as an auth failure with no retry', async () => {
		const error = apiError(401, 'Invalid API key or insufficient credit.');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches an insufficient-credit message even without a status', () => {
		const error = new Error('Invalid API key or insufficient credit.');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('sends any other status to the default handler', async () => {
		const error = apiError(500, 'server error');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
