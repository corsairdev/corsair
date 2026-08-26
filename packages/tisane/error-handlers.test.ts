import { ApiError } from 'corsair/http';
import { TisaneAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{ url: '/test', ok: false, status, statusText: 'Error', body: {} },
		`request failed with status ${status}`,
	);
}

describe('Tisane error handlers', () => {
	it('matches and handles rate limit errors (429)', async () => {
		const apiErr = apiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiErr)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(apiErr);
		expect(result.maxRetries).toBe(5);

		const tisaneErr = new TisaneAPIError('Quota exceeded', undefined, 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(tisaneErr)).toBe(true);
	});

	it('matches and handles auth errors (401/403)', async () => {
		const authErr = new TisaneAPIError(
			'Unauthorized access key',
			undefined,
			401,
		);
		expect(errorHandlers.AUTH_ERROR.match(authErr)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('provides a default fallback error handler', async () => {
		const genericErr = new Error('Random failure');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
