import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function errorWithStatus(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/company' },
		{
			url: 'https://api.freeagent.com/v2/company',
			ok: false,
			status,
			statusText: 'Provider response',
			body: {},
		},
		'Provider response',
		status === 429 ? { retryAfter: 60000 } : undefined,
	);
}

describe('FreeAgent error handlers', () => {
	it('recognizes 429 and leaves retries to the shared transport', async () => {
		const error = errorWithStatus(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(60000);
	});

	it('classifies authentication and not-found failures without retry', async () => {
		const unauthorized = errorWithStatus(401);
		const forbidden = errorWithStatus(403);
		const missing = errorWithStatus(404);
		expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(missing)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the final default handler for other errors', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
