import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v2/properties' },
		{
			url: 'https://api.lodgify.com/v2/properties',
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
	if (match === undefined) throw new Error('No Lodgify handler matched');
	return match[0];
}

describe('Lodgify errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and preserves retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 3500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 3500,
		});
	});

	it('routes 429 rate limit text message to RATE_LIMIT_ERROR', async () => {
		const error = new Error('Rate limit exceeded');
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: undefined,
		});
	});

	it('routes 401 and 403 authentication failures to AUTH_ERROR', async () => {
		const err401 = apiError(401, 'Unauthorized');
		expect(route(err401)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const err403 = apiError(403, 'Forbidden');
		expect(route(err403)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 validation failures to BAD_REQUEST_ERROR', async () => {
		const err400 = apiError(400, 'Bad Request');
		expect(route(err400)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const err422 = apiError(422, 'Unprocessable Entity');
		expect(route(err422)).toBe('BAD_REQUEST_ERROR');
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

	it('routes 500 and other unhandled failures to DEFAULT', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
