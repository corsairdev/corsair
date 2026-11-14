import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/jobs' },
		{
			url: `https://api.cloudlayer.io/v2/jobs`,
			ok: false,
			status,
			statusText: message,
			body: { statusCode: status, message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (match === undefined) throw new Error('No Cloudlayer handler matched');
	return match[0];
}

describe('Cloudlayer errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and preserves retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2500,
		});
	});

	it('routes 401 authentication failures to AUTH_ERROR', async () => {
		const error = apiError(401, 'Unauthorized');
		expect(route(error)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 validation failures to BAD_REQUEST_ERROR', async () => {
		const error = apiError(400, 'Bad Request');
		expect(route(error)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 responses to NOT_FOUND_ERROR', async () => {
		const error = apiError(404, 'Not Found');
		expect(route(error)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes other provider failures to DEFAULT', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
