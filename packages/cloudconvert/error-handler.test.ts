import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	code?: string,
) {
	return new ApiError(
		{ method: 'POST', url: '/jobs' },
		{
			url: 'https://api.cloudconvert.com/v2/jobs',
			ok: false,
			status,
			statusText: message,
			body: code === undefined ? {} : { code },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('No CloudConvert error handler matched.');
	return match[0];
}

describe('CloudConvert error handlers', () => {
	it('leaves 429 retrying to the shared HTTP client', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(2500);
	});

	it('routes the documented TOO_MANY_REQUESTS code to the rate-limit handler', () => {
		const error = apiError(
			429,
			'Too Many Requests',
			undefined,
			'TOO_MANY_REQUESTS',
		);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR without retries', async () => {
		const unauthorized = apiError(401, 'Unauthorized');
		const forbidden = apiError(403, 'Forbidden');
		expect(route(unauthorized)).toBe('AUTH_ERROR');
		expect(route(forbidden)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR without retries', async () => {
		const error = apiError(404, 'Not Found');
		expect(route(error)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400, 422 and INVALID_DATA to BAD_REQUEST_ERROR', async () => {
		const badRequest = apiError(400, 'Bad Request');
		const invalidData = apiError(422, 'Unprocessable Entity');
		const coded = apiError(
			422,
			'Unprocessable Entity',
			undefined,
			'INVALID_DATA',
		);
		expect(route(badRequest)).toBe('BAD_REQUEST_ERROR');
		expect(route(invalidData)).toBe('BAD_REQUEST_ERROR');
		expect(route(coded)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unrecognized errors to DEFAULT without retries', async () => {
		const error = new Error('Unexpected provider response');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
