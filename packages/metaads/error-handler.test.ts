import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

// `unknown` fields model Graph error payloads that vary by status and code.
function apiError(status: number, body: Record<string, unknown> = {}) {
	return new ApiError(
		{ method: 'POST', url: '/act_1/campaigns' },
		{
			url: 'https://graph.facebook.com/v27.0/act_1/campaigns',
			ok: false,
			status,
			statusText: 'Meta error',
			body,
		},
		'Meta API error',
	);
}

describe('Meta Ads error handling', () => {
	it('recognizes 429 and never retries a request automatically', async () => {
		const error = apiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('recognizes Meta Graph throttle codes returned in error bodies', async () => {
		const error = apiError(400, {
			error: { code: 613, error_subcode: 1487742 },
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('recognizes authentication and permission errors without retries', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
		expect(
			errorHandlers.AUTH_ERROR.match(apiError(400, { error: { code: 190 } })),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(apiError(400, { error: { code: 200 } })),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(apiError(400, { error: { code: 294 } })),
		).toBe(true);
	});

	it('recognizes invalid request errors', () => {
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
	});

	it('recognizes missing object errors', () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
	});

	it('keeps the catch-all handler last and disables retries for other failures', async () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
