import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

describe('ClickUp error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches HTTP 429 ApiError and returns retry info', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/list/1/task' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					ok: false,
					url: '/list/1/task',
					body: {},
				},
				'Too Many Requests',
				{ retryAfter: 3000 },
			);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(apiError);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(3000);
		});
	});
});
