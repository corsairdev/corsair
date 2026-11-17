import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/workspaces' },
		{
			url: 'https://api.pdfless.com/v1/workspaces',
			ok: false,
			status,
			statusText: 'error',
			body: { message },
		},
		message,
	);
}

describe('PDFLess error handlers', () => {
	it('does not retry a 429', async () => {
		const error = apiError(429, 'too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats the documented 401 missing key as auth and does not retry', async () => {
		const error = apiError(401, 'No API key found in request');
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
