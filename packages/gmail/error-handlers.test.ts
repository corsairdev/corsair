import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/users/me/profile' },
		{
			url: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
			ok: false,
			status,
			statusText: 'Error',
			body: {},
		},
		`Request failed with status ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Gmail error handlers', () => {
	it('matches a 429 and retries with the Retry-After delay', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		const error = apiError(429, 3000);

		expect(handler.match(error)).toBe(true);
		const result = await handler.handler(error);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(3000);
	});

	it('matches Gmail quota reasons in the message', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		expect(handler.match(new Error('rateLimitExceeded'))).toBe(true);
		expect(handler.match(new Error('userRateLimitExceeded'))).toBe(true);
		expect(handler.match(new Error('Too Many Requests'))).toBe(true);
		expect(handler.match(new Error('different error'))).toBe(false);

		const result = await handler.handler(new Error('rateLimitExceeded'));
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('does not retry authentication errors', async () => {
		const handler = errorHandlers.AUTH_ERROR;

		expect(handler.match(apiError(401))).toBe(true);
		expect(handler.match(new Error('Invalid Credentials'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);
		expect((await handler.handler()).maxRetries).toBe(0);
	});

	it('does not retry permission errors', async () => {
		const handler = errorHandlers.PERMISSION_ERROR;

		expect(handler.match(apiError(403))).toBe(true);
		expect(handler.match(new Error('Insufficient Permission'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);
		expect((await handler.handler()).maxRetries).toBe(0);
	});

	it('does not retry not found errors', async () => {
		const handler = errorHandlers.NOT_FOUND_ERROR;

		expect(handler.match(apiError(404))).toBe(true);
		expect(handler.match(new Error('Requested entity was not found'))).toBe(
			true,
		);
		expect(handler.match(new Error('other error'))).toBe(false);
		expect((await handler.handler()).maxRetries).toBe(0);
	});

	it('does not retry validation errors', async () => {
		const handler = errorHandlers.VALIDATION_ERROR;

		expect(handler.match(apiError(400))).toBe(true);
		expect(handler.match(new Error('Invalid argument'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);
		expect((await handler.handler()).maxRetries).toBe(0);
	});

	it('retries server errors', async () => {
		const handler = errorHandlers.SERVER_ERROR;

		expect(handler.match(apiError(500))).toBe(true);
		expect(handler.match(apiError(503))).toBe(true);
		expect(handler.match(new Error('Backend Error'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);
		expect((await handler.handler()).maxRetries).toBe(3);
	});

	it('falls back to a default handler without retries', async () => {
		const handler = errorHandlers.DEFAULT;

		expect(handler.match(new Error('anything'))).toBe(true);
		expect((await handler.handler()).maxRetries).toBe(0);
	});

	it('checks rate limits before permissions, since Gmail sends quota errors as 403', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('PERMISSION_ERROR'),
		);
	});
});
