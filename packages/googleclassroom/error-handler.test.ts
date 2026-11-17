import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

const makeApiError = (status: number) =>
	new ApiError(
		{ method: 'GET', url: '/v1/courses' },
		{
			url: 'https://classroom.googleapis.com/v1/courses',
			ok: false,
			status,
			statusText: 'Provider error',
			body: { error: { status } },
		},
		`HTTP ${status}`,
		status === 429 ? { retryAfter: 4000 } : undefined,
	);

describe('Google Classroom error handlers', () => {
	it('matches 429 and leaves retries to the shared transport', async () => {
		const error = makeApiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(4000);
	});

	it('stops retrying authentication failures', async () => {
		const error = makeApiError(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([400, 403, 404, 422, 500, 503])(
		'keeps HTTP %i failures from replaying a write',
		async (status) => {
			const error = makeApiError(status);
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('keeps the catch-all handler last', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});
