import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/{ip}' },
		{
			url: 'https://api.vpndetection.io/8.8.8.8',
			ok: false,
			status,
			statusText: 'error',
			body: { error: message },
		},
		message,
	);
}

describe('VPNDetection error handlers', () => {
	it('does not retry a 429, because the HTTP client already retries it', async () => {
		const error = apiError(429, 'rate limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats a rejected key as an auth failure with no retry', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status, 'invalid API key');
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		}
		await expect(
			errorHandlers.AUTH_ERROR.handler(apiError(401, 'invalid API key')),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('sends a bad address and any other status to the default handler', async () => {
		for (const status of [400, 500]) {
			const error = apiError(status, 'error');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
			expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		}
		await expect(
			errorHandlers.DEFAULT.handler(apiError(500, 'error')),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
