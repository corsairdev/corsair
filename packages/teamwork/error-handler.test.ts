import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function makeError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/projects/api/v3/projects.json' },
		{
			url: 'https://acme.teamwork.com/projects/api/v3/projects.json',
			ok: false,
			status,
			statusText: 'Provider response',
			body: { message },
		},
		message,
		{ retryAfter: 5000 },
	);
}

describe('Teamwork error handlers', () => {
	it('leaves 429 retry ownership to Corsair transport and preserves Retry-After', async () => {
		const error = makeError(429, 'rate limited');
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler.match(error)).toBe(true);
		await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		expect(error.retryAfter).toBe(5000);
	});

	it.each([401, 403])(
		'classifies HTTP %s as an auth error without retry',
		async (status) => {
			const error = makeError(status, 'authentication failed');
			const handler = errorHandlers.AUTH_ERROR;
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		},
	);

	it.each([400, 422])(
		'classifies HTTP %s as a bad request without retry',
		async (status) => {
			const error = makeError(status, 'invalid request');
			const handler = errorHandlers.BAD_REQUEST_ERROR;
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		},
	);

	it('keeps the catch-all handler last', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});
