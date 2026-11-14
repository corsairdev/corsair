import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/orders/singleStepOrder' },
		{
			url: 'https://api.handwrytten.com/v1/orders/singleStepOrder',
			ok: false,
			status,
			statusText: message,
			body: { status: 'error', message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Handwrytten errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR with single-owner maxRetries: 0', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(route(new Error('rate_limited by provider'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(route(new Error('429 too many requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401, 403, and 440 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(apiError(440, 'Session has expired.'))).toBe('AUTH_ERROR');

		expect(route(new Error('no auth'))).toBe('AUTH_ERROR');
		expect(route(new Error('Missing Authentication Token'))).toBe('AUTH_ERROR');

		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(new Error('validation error in card_id'))).toBe(
			'BAD_REQUEST_ERROR',
		);

		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Page not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('resource not found'))).toBe('NOT_FOUND_ERROR');

		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown 5xx server errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('orders handlers correctly with DEFAULT last', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys).toContain('RATE_LIMIT_ERROR');
		expect(keys).toContain('AUTH_ERROR');
		expect(keys).toContain('BAD_REQUEST_ERROR');
		expect(keys).toContain('NOT_FOUND_ERROR');
	});
});
