import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://team.mailcoach.app/api/user',
			ok: false,
			status,
			statusText: 'Mailcoach response',
			body: 'provider error details',
		},
		`HTTP ${status}`,
		{ retryAfter: status === 429 ? 2_500 : undefined },
	);
}

describe('Mailcoach error handlers', () => {
	it('recognizes 429 and leaves retries to corsair/http', async () => {
		const error = apiError(429);

		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(2_500);
	});

	it.each([401, 403])(
		'stops retrying HTTP %s authentication failures',
		async (status) => {
			const error = apiError(status);

			expect(errorHandlers.AUTH_ERROR?.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR?.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('leaves 422 and plain-text provider failures for the caller without retries', async () => {
		const error = apiError(422);

		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR?.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT?.match()).toBe(true);
		await expect(errorHandlers.DEFAULT?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
