import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://my.sevdesk.de/api/v1/Contact' },
		{
			url: 'https://my.sevdesk.de/api/v1/Contact',
			ok: false,
			status,
			statusText: 'HTTP error',
			body: undefined,
		},
		'Sanitized Sevdesk failure',
		{ retryAfter },
	);
}

describe('Sevdesk error handlers', () => {
	it('retains rate-limit timing without framework retries', async () => {
		const error = apiError(429, 4000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(error.retryAfter).toBe(4000);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
	it('handles authentication and permission errors', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});
	it('handles validation, not-found, and server failures without replays', async () => {
		for (const status of [400, 422])
			expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(status))).toBe(
				true,
			);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(500))).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
	it('leaves DEFAULT last', async () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
